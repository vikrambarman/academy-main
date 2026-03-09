/**
 * /api/admin/analytics
 * GET → Dashboard + Reports page dono ke liye complete analytics
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import { verifyUser } from "@/lib/verifyUser";

const MONTH_NAMES = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        /* ================= STUDENTS ================= */

        const [
            totalStudents,
            activeStudents,
            completedStudents,
            droppedStudents,
            inactiveStudents,
        ] = await Promise.all([
            Student.countDocuments(),
            Student.countDocuments({ courseStatus: "active" }),
            Student.countDocuments({ courseStatus: "completed" }),
            Student.countDocuments({ courseStatus: "dropped" }),
            Student.countDocuments({ isActive: false }),
        ]);

        const completionRate = totalStudents > 0
            ? Math.round((completedStudents / totalStudents) * 100) : 0;

        const dropoutRate = totalStudents > 0
            ? Math.round((droppedStudents / totalStudents) * 100) : 0;

        /* New students this month */
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [recentEnrollments, newStudentsThisMonth] = await Promise.all([
            Enrollment.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            }),
            Student.countDocuments({ createdAt: { $gte: startOfMonth } }),
        ]);

        /* ================= COURSES ================= */

        const totalCourses = await Course.countDocuments({ isActive: true });

        /* ================= FINANCIAL ================= */

        const enrollments = await Enrollment.find({ isActive: true });

        let totalExpected  = 0;
        let totalCollected = 0;
        let fullyPaidCount = 0;
        let partiallyPaidCount = 0;
        let unpaidCount = 0;

        const certificateStats = {
            notApplied: 0, applied: 0,
            examGiven:  0, passed:  0, generated: 0,
        };

        enrollments.forEach((e) => {
            totalExpected  += e.feesTotal;
            totalCollected += e.feesPaid;

            if      (e.feesPaid === 0)            unpaidCount++;
            else if (e.feesPaid < e.feesTotal)    partiallyPaidCount++;
            else                                  fullyPaidCount++;

            /* Certificate stats */
            if (e.certificateStatus === "Not Applied")          certificateStats.notApplied++;
            if (e.certificateStatus === "Applied")              certificateStats.applied++;
            if (e.certificateStatus === "Exam Given")           certificateStats.examGiven++;
            if (e.certificateStatus === "Passed")               certificateStats.passed++;
            if (e.certificateStatus === "Certificate Generated") certificateStats.generated++;
        });

        const totalPending      = totalExpected - totalCollected;
        const totalRevenue      = totalCollected;
        const feeCollectionRate = totalExpected > 0
            ? Math.round((totalCollected / totalExpected) * 100) : 0;

        /* ================= REVENUE TREND ================= */

        const revenueTrendRaw = await Enrollment.aggregate([
            { $unwind: "$payments" },
            {
                $group: {
                    _id:    { month: { $month: "$payments.date" } },
                    amount: { $sum: "$payments.amount" },
                },
            },
            { $project: { month: "$_id.month", amount: 1, _id: 0 } },
            { $sort: { month: 1 } },
        ]);

        /* Per-month pending */
        const pendingTrendRaw = await Enrollment.aggregate([
            {
                $group: {
                    _id:     { month: { $month: "$createdAt" } },
                    pending: { $sum: { $subtract: ["$feesTotal", "$feesPaid"] } },
                },
            },
            { $project: { month: "$_id.month", pending: 1, _id: 0 } },
            { $sort: { month: 1 } },
        ]);

        const pendingMap: Record<number, number> = {};
        pendingTrendRaw.forEach((p) => { pendingMap[p.month] = p.pending; });

        /* Dashboard format: { month, amount } */
        const revenueTrend = revenueTrendRaw.map((m) => ({
            month:  MONTH_NAMES[m.month],
            amount: m.amount,
        }));

        /* Reports format: { month, revenue, pending } */
        const revenueByMonth = revenueTrendRaw.map((m) => ({
            month:   MONTH_NAMES[m.month],
            revenue: m.amount,
            pending: pendingMap[m.month] ?? 0,
        }));

        /* ================= ENROLLMENT TREND ================= */

        const enrollmentTrendRaw = await Enrollment.aggregate([
            {
                $group: {
                    _id:   { month: { $month: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $project: { month: "$_id.month", count: 1, _id: 0 } },
            { $sort: { month: 1 } },
        ]);

        /* Dashboard format */
        const enrollmentTrend = enrollmentTrendRaw.map((e) => ({
            month: MONTH_NAMES[e.month],
            count: e.count,
        }));

        /* Reports format (same shape, aliased) */
        const enrollmentsByMonth = enrollmentTrend;

        /* ================= COURSE ANALYTICS ================= */

        const courseAnalytics = await Enrollment.aggregate([
            {
                $lookup: {
                    from:         "courses",
                    localField:   "course",
                    foreignField: "_id",
                    as:           "course",
                },
            },
            { $unwind: "$course" },
            {
                $group: {
                    _id:           "$course.name",
                    totalStudents: { $sum: 1 },
                    totalRevenue:  { $sum: "$feesPaid" },
                    totalExpected: { $sum: "$feesTotal" },
                },
            },
            {
                $addFields: {
                    totalPending: { $subtract: ["$totalExpected", "$totalRevenue"] },
                },
            },
            { $sort: { totalRevenue: -1 } },
        ]);

        const topCourses = courseAnalytics.slice(0, 5);

        /* Reports pie chart format */
        const courseWiseStudents = courseAnalytics.map((c) => ({
            course: c._id,
            count:  c.totalStudents,
        }));

        /* ================= ATTENDANCE ================= */
        /* Attendance model nahi hai abhi — empty array */
        const attendanceSummary: any[] = [];

        /* ================= RESPONSE ================= */

        return NextResponse.json({

            /* ── Dashboard fields ── */
            financial: {
                totalExpected,
                totalCollected,
                totalPending,
                fullyPaidCount,
                partiallyPaidCount,
                unpaidCount,
            },
            students: {
                total:             totalStudents,
                active:            activeStudents,
                completed:         completedStudents,
                dropped:           droppedStudents,
                inactive:          inactiveStudents,
                completionRate,
                dropoutRate,
                recentEnrollments,
            },
            certificates:    certificateStats,
            revenueTrend,
            enrollmentTrend,
            topCourses,
            courseAnalytics,

            /* ── Reports page fields ── */
            totalStudents,
            totalCourses,
            totalRevenue,
            totalPending,
            feeCollectionRate,
            newStudentsThisMonth,
            revenueByMonth,
            enrollmentsByMonth,
            courseWiseStudents,
            attendanceSummary,

        });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("ANALYTICS ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}