/**
 * GET /api/admin/analytics
 *
 * Dashboard + Reports page ke liye complete analytics data.
 * Includes: student stats, financial summary, revenue trends,
 * enrollment trends, course analytics, franchise breakdown.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import "@/models/Franchise";
import "@/models/CertificateType";

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ── Auth helper ───────────────────────────────────────────────────────────────

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

// ── Error helper ──────────────────────────────────────────────────────────────

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET() {
    try {
        await connectDB();
        await requireAdmin();

        /* ── 1. Student counts ── */
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
        const dropoutRate = totalStudents > 0 ? Math.round((droppedStudents / totalStudents) * 100) : 0;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [recentEnrollments, newStudentsThisMonth] = await Promise.all([
            Enrollment.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
            Student.countDocuments({ createdAt: { $gte: startOfMonth } }),
        ]);

        /* ── 2. Course count ── */
        const totalCourses = await Course.countDocuments({ isActive: true });

        /* ── 3. Financial summary ── */
        const enrollments = await Enrollment.find({ isActive: true })
            .populate("franchise", "name code isOwn registeredBodies")
            .lean();

        let totalExpected = 0, totalCollected = 0;
        let fullyPaidCount = 0, partiallyPaidCount = 0, unpaidCount = 0;
        const certificateStats = { notApplied: 0, applied: 0, examGiven: 0, passed: 0, generated: 0 };

        enrollments.forEach((e: any) => {
            totalExpected += e.feesTotal;
            totalCollected += e.feesPaid;
            if (e.feesPaid === 0) unpaidCount++;
            else if (e.feesPaid < e.feesTotal) partiallyPaidCount++;
            else fullyPaidCount++;
            if (e.certificateStatus === "Not Applied") certificateStats.notApplied++;
            if (e.certificateStatus === "Applied") certificateStats.applied++;
            if (e.certificateStatus === "Exam Given") certificateStats.examGiven++;
            if (e.certificateStatus === "Passed") certificateStats.passed++;
            if (e.certificateStatus === "Certificate Generated") certificateStats.generated++;
        });

        const totalPending = totalExpected - totalCollected;
        const totalRevenue = totalCollected;
        const feeCollectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

        /* ── 4. Franchise breakdown ── */
        const franchiseMap: Record<string, {
            franchiseId: string; franchiseName: string; franchiseCode: string; isOwn: boolean;
            studentCount: number; totalFees: number; collectedFees: number;
        }> = {};

        enrollments.forEach((e: any) => {
            if (!e.franchise) return;
            const fid = e.franchise._id.toString();
            if (!franchiseMap[fid]) {
                franchiseMap[fid] = {
                    franchiseId: fid,
                    franchiseName: e.franchise.name,
                    franchiseCode: e.franchise.code,
                    isOwn: e.franchise.isOwn || false,
                    studentCount: 0,
                    totalFees: 0,
                    collectedFees: 0,
                };
            }
            franchiseMap[fid].studentCount++;
            franchiseMap[fid].totalFees += e.feesTotal;
            franchiseMap[fid].collectedFees += e.feesPaid;
        });

        const franchiseStats = Object.values(franchiseMap).sort((a, b) => b.studentCount - a.studentCount);

        /* ── 5. Revenue trend + Growth calculation ── */

        // Current month aur pichle mahine ki date ranges
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const [revenueTrendRaw, pendingTrendRaw, enrollmentTrendRaw] = await Promise.all([
            Enrollment.aggregate([
                { $unwind: "$payments" },
                { $group: { _id: { month: { $month: "$payments.date" } }, amount: { $sum: "$payments.amount" } } },
                { $project: { month: "$_id.month", amount: 1, _id: 0 } },
                { $sort: { month: 1 } },
            ]),
            Enrollment.aggregate([
                { $group: { _id: { month: { $month: "$createdAt" } }, pending: { $sum: { $subtract: ["$feesTotal", "$feesPaid"] } } } },
                { $project: { month: "$_id.month", pending: 1, _id: 0 } },
                { $sort: { month: 1 } },
            ]),
            Enrollment.aggregate([
                { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
                { $project: { month: "$_id.month", count: 1, _id: 0 } },
                { $sort: { month: 1 } },
            ]),
        ]);

        const pendingMap: Record<number, number> = {};
        pendingTrendRaw.forEach((p: any) => { pendingMap[p.month] = p.pending; });

        const revenueTrend = revenueTrendRaw.map((m: any) => ({ month: MONTH_NAMES[m.month], amount: m.amount }));
        const revenueByMonth = revenueTrendRaw.map((m: any) => ({
            month: MONTH_NAMES[m.month], revenue: m.amount, pending: pendingMap[m.month] ?? 0,
        }));

        const enrollmentTrend = enrollmentTrendRaw.map((e: any) => ({ month: MONTH_NAMES[e.month], count: e.count }));
        const enrollmentsByMonth = enrollmentTrend;

        /* ── Revenue growth: this month vs last month ── */
        const [thisMonthRevRaw, lastMonthRevRaw] = await Promise.all([
            Enrollment.aggregate([
                { $unwind: "$payments" },
                { $match: { "payments.date": { $gte: thisMonthStart, $lte: now } } },
                { $group: { _id: null, total: { $sum: "$payments.amount" } } },
            ]),
            Enrollment.aggregate([
                { $unwind: "$payments" },
                { $match: { "payments.date": { $gte: lastMonthStart, $lte: lastMonthEnd } } },
                { $group: { _id: null, total: { $sum: "$payments.amount" } } },
            ]),
        ]);

        const thisMonthRev = thisMonthRevRaw[0]?.total ?? 0;
        const lastMonthRev = lastMonthRevRaw[0]?.total ?? 0;
        const revenueGrowth = lastMonthRev === 0
            ? (thisMonthRev > 0 ? 100 : 0)
            : Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 100);

        /* ── Enrollment growth: this month vs last month ── */
        const [thisMonthEnrCount, lastMonthEnrCount] = await Promise.all([
            Enrollment.countDocuments({ createdAt: { $gte: thisMonthStart } }),
            Enrollment.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
        ]);

        const enrollmentGrowth = lastMonthEnrCount === 0
            ? (thisMonthEnrCount > 0 ? 100 : 0)
            : Math.round(((thisMonthEnrCount - lastMonthEnrCount) / lastMonthEnrCount) * 100);

        /* ── 6. Pending fees — top 10 students with highest due ── */
        const pendingFees = await Enrollment.aggregate([
            { $match: { isActive: true } },
            { $addFields: { due: { $subtract: ["$feesTotal", "$feesPaid"] } } },
            { $match: { due: { $gt: 0 } } },
            { $sort: { due: -1 } },
            { $limit: 10 },
            { $lookup: { from: "students", localField: "student", foreignField: "_id", as: "student" } },
            { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "course" } },
            { $unwind: { path: "$student", preserveNullAndEmptyArrays: false } },
            { $unwind: { path: "$course", preserveNullAndEmptyArrays: false } },
            {
                $project: {
                    studentName: "$student.name",
                    studentId: "$student.studentId",
                    course: "$course.name",
                    due: 1,
                    _id: 0,
                },
            },
        ]);

        /* ── 7. Top paying students — by total feesPaid ── */
        const topPayingRaw = await Enrollment.aggregate([
            { $match: { isActive: true, feesPaid: { $gt: 0 } } },
            { $group: { _id: "$student", totalPaid: { $sum: "$feesPaid" } } },
            { $sort: { totalPaid: -1 } },
            { $limit: 10 },
            { $lookup: { from: "students", localField: "_id", foreignField: "_id", as: "student" } },
            { $unwind: "$student" },
            { $project: { name: "$student.name", studentId: "$student.studentId", amount: "$totalPaid", _id: 0 } },
        ]);

        const topPayingStudents = topPayingRaw;

        /* ── 8. Course analytics ── */
        const courseAnalytics = await Enrollment.aggregate([
            { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "course" } },
            { $unwind: "$course" },
            {
                $group: {
                    _id: "$course.name",
                    totalStudents: { $sum: 1 },
                    totalRevenue: { $sum: "$feesPaid" },
                    totalExpected: { $sum: "$feesTotal" },
                },
            },
            { $addFields: { totalPending: { $subtract: ["$totalExpected", "$totalRevenue"] } } },
            { $sort: { totalRevenue: -1 } },
        ]);

        const topCourses = courseAnalytics.slice(0, 5);
        const courseWiseStudents = courseAnalytics.map((c: any) => ({ course: c._id, count: c.totalStudents }));
        const attendanceSummary: any[] = []; // Not implemented yet

        /* ── Response ── */
        return NextResponse.json({
            // Dashboard fields
            financial: {
                totalExpected, totalCollected, totalPending,
                fullyPaidCount, partiallyPaidCount, unpaidCount,
                revenueGrowth,
                thisMonthRev,
                lastMonthRev,
            },
            students: {
                total: totalStudents, active: activeStudents,
                completed: completedStudents, dropped: droppedStudents,
                inactive: inactiveStudents, completionRate, dropoutRate,
                recentEnrollments,
                enrollmentGrowth,
                thisMonthEnrCount,
                lastMonthEnrCount,
            },
            certificates: certificateStats,
            revenueTrend,
            enrollmentTrend,
            topCourses,
            courseAnalytics,
            pendingFees,            // NEW
            topPayingStudents,      // NEW
            // Reports page fields
            totalStudents, totalCourses, totalRevenue, totalPending,
            feeCollectionRate, newStudentsThisMonth,
            revenueByMonth, enrollmentsByMonth, courseWiseStudents, attendanceSummary,
            // Franchise breakdown
            franchiseStats,
        });

    } catch (error: any) {
        return handleError(error, "GET /api/admin/analytics");
    }
}