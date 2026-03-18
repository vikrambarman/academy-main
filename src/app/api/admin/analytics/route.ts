/**
 * /api/admin/analytics
 * GET → Dashboard + Reports page dono ke liye complete analytics
 * Updated: franchiseStats breakdown added
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Franchise from "@/models/Franchise";
import { verifyUser } from "@/lib/verifyUser";
import "@/models/CertificateType";

const MONTH_NAMES = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        /* ── Students ── */
        const [
            totalStudents, activeStudents, completedStudents,
            droppedStudents, inactiveStudents,
        ] = await Promise.all([
            Student.countDocuments(),
            Student.countDocuments({ courseStatus: "active" }),
            Student.countDocuments({ courseStatus: "completed" }),
            Student.countDocuments({ courseStatus: "dropped" }),
            Student.countDocuments({ isActive: false }),
        ]);

        const completionRate = totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0;
        const dropoutRate    = totalStudents > 0 ? Math.round((droppedStudents    / totalStudents) * 100) : 0;

        const startOfMonth = new Date();
        startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);

        const [recentEnrollments, newStudentsThisMonth] = await Promise.all([
            Enrollment.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
            Student.countDocuments({ createdAt: { $gte: startOfMonth } }),
        ]);

        /* ── Courses ── */
        const totalCourses = await Course.countDocuments({ isActive: true });

        /* ── Financial ── */
        const enrollments = await Enrollment.find({ isActive: true })
            .populate("franchise", "name code isOwn registeredBodies")
            .lean();

        let totalExpected = 0, totalCollected = 0;
        let fullyPaidCount = 0, partiallyPaidCount = 0, unpaidCount = 0;
        const certificateStats = { notApplied: 0, applied: 0, examGiven: 0, passed: 0, generated: 0 };

        enrollments.forEach((e: any) => {
            totalExpected  += e.feesTotal;
            totalCollected += e.feesPaid;
            if      (e.feesPaid === 0)         unpaidCount++;
            else if (e.feesPaid < e.feesTotal) partiallyPaidCount++;
            else                               fullyPaidCount++;
            if (e.certificateStatus === "Not Applied")           certificateStats.notApplied++;
            if (e.certificateStatus === "Applied")               certificateStats.applied++;
            if (e.certificateStatus === "Exam Given")            certificateStats.examGiven++;
            if (e.certificateStatus === "Passed")                certificateStats.passed++;
            if (e.certificateStatus === "Certificate Generated") certificateStats.generated++;
        });

        const totalPending      = totalExpected - totalCollected;
        const totalRevenue      = totalCollected;
        const feeCollectionRate = totalExpected > 0
            ? Math.round((totalCollected / totalExpected) * 100) : 0;

        /* ── Franchise Breakdown ── */
        const franchiseMap: Record<string, {
            franchiseId: string; franchiseName: string;
            franchiseCode: string; isOwn: boolean;
            studentCount: number; totalFees: number; collectedFees: number;
        }> = {};

        enrollments.forEach((e: any) => {
            if (!e.franchise) return;
            const fid  = e.franchise._id.toString();
            if (!franchiseMap[fid]) {
                franchiseMap[fid] = {
                    franchiseId:   fid,
                    franchiseName: e.franchise.name,
                    franchiseCode: e.franchise.code,
                    isOwn:         e.franchise.isOwn || false,
                    studentCount:  0,
                    totalFees:     0,
                    collectedFees: 0,
                };
            }
            franchiseMap[fid].studentCount++;
            franchiseMap[fid].totalFees     += e.feesTotal;
            franchiseMap[fid].collectedFees += e.feesPaid;
        });

        const franchiseStats = Object.values(franchiseMap)
            .sort((a, b) => b.studentCount - a.studentCount);

        /* ── Revenue Trend ── */
        const revenueTrendRaw = await Enrollment.aggregate([
            { $unwind: "$payments" },
            { $group: { _id: { month: { $month: "$payments.date" } }, amount: { $sum: "$payments.amount" } } },
            { $project: { month: "$_id.month", amount: 1, _id: 0 } },
            { $sort: { month: 1 } },
        ]);

        const pendingTrendRaw = await Enrollment.aggregate([
            { $group: { _id: { month: { $month: "$createdAt" } }, pending: { $sum: { $subtract: ["$feesTotal", "$feesPaid"] } } } },
            { $project: { month: "$_id.month", pending: 1, _id: 0 } },
            { $sort: { month: 1 } },
        ]);

        const pendingMap: Record<number, number> = {};
        pendingTrendRaw.forEach(p => { pendingMap[p.month] = p.pending; });

        const revenueTrend   = revenueTrendRaw.map(m => ({ month: MONTH_NAMES[m.month], amount: m.amount }));
        const revenueByMonth = revenueTrendRaw.map(m => ({
            month:   MONTH_NAMES[m.month],
            revenue: m.amount,
            pending: pendingMap[m.month] ?? 0,
        }));

        /* ── Enrollment Trend ── */
        const enrollmentTrendRaw = await Enrollment.aggregate([
            { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
            { $project: { month: "$_id.month", count: 1, _id: 0 } },
            { $sort: { month: 1 } },
        ]);

        const enrollmentTrend    = enrollmentTrendRaw.map(e => ({ month: MONTH_NAMES[e.month], count: e.count }));
        const enrollmentsByMonth = enrollmentTrend;

        /* ── Course Analytics ── */
        const courseAnalytics = await Enrollment.aggregate([
            { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "course" } },
            { $unwind: "$course" },
            {
                $group: {
                    _id:           "$course.name",
                    totalStudents: { $sum: 1 },
                    totalRevenue:  { $sum: "$feesPaid" },
                    totalExpected: { $sum: "$feesTotal" },
                },
            },
            { $addFields: { totalPending: { $subtract: ["$totalExpected", "$totalRevenue"] } } },
            { $sort: { totalRevenue: -1 } },
        ]);

        const topCourses         = courseAnalytics.slice(0, 5);
        const courseWiseStudents = courseAnalytics.map(c => ({ course: c._id, count: c.totalStudents }));

        const attendanceSummary: any[] = [];

        return NextResponse.json({
            /* Dashboard fields */
            financial:       { totalExpected, totalCollected, totalPending, fullyPaidCount, partiallyPaidCount, unpaidCount },
            students:        { total: totalStudents, active: activeStudents, completed: completedStudents, dropped: droppedStudents, inactive: inactiveStudents, completionRate, dropoutRate, recentEnrollments },
            certificates:    certificateStats,
            revenueTrend,
            enrollmentTrend,
            topCourses,
            courseAnalytics,

            /* Reports page fields */
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

            /* NEW: Franchise breakdown */
            franchiseStats,
        });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        console.error("ANALYTICS ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}