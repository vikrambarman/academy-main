import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import "@/models/Franchise";
import "@/models/CertificateType";

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

export async function GET() {
    try {
        await connectDB();
        await requireAdmin();

        /* ── 1. Student counts ── */
        const [totalStudents, activeStudents, completedStudents, droppedStudents, inactiveStudents] = await Promise.all([
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

        const totalCourses = await Course.countDocuments({ isActive: true });

        /* ── 2. Financial summary (Excluding Dropped Students from Main Metrics) ── */
        const enrollments = await Enrollment.find({ isActive: true })
            .populate("student", "name studentId courseStatus")
            .populate("franchise", "name code isOwn registeredBodies")
            .lean();

        const activeEnrollments = enrollments.filter((e: any) => e.student?.courseStatus !== "dropped");
        const droppedEnrollments = enrollments.filter((e: any) => e.student?.courseStatus === "dropped");

        let totalExpected = 0, totalCollected = 0;
        let droppedExpected = 0, droppedCollected = 0;
        let fullyPaidCount = 0, partiallyPaidCount = 0, unpaidCount = 0;
        const certificateStats = { notApplied: 0, applied: 0, examGiven: 0, passed: 0, generated: 0 };

        activeEnrollments.forEach((e: any) => {
            totalExpected += e.feesTotal || 0;
            totalCollected += e.feesPaid || 0;
            if (e.feesPaid === 0) unpaidCount++;
            else if (e.feesPaid < e.feesTotal) partiallyPaidCount++;
            else fullyPaidCount++;
            
            if (e.certificateStatus === "Not Applied") certificateStats.notApplied++;
            if (e.certificateStatus === "Applied") certificateStats.applied++;
            if (e.certificateStatus === "Exam Given") certificateStats.examGiven++;
            if (e.certificateStatus === "Passed") certificateStats.passed++;
            if (e.certificateStatus === "Certificate Generated") certificateStats.generated++;
        });

        droppedEnrollments.forEach((e: any) => {
            droppedExpected += e.feesTotal || 0;
            droppedCollected += e.feesPaid || 0;
        });

        const totalPending = totalExpected - totalCollected;
        const totalRevenue = totalCollected;
        const feeCollectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

        /* ── 3. Franchise breakdown (Active Only) ── */
        const franchiseMap: Record<string, any> = {};
        activeEnrollments.forEach((e: any) => {
            if (!e.franchise) return;
            const fid = e.franchise._id.toString();
            if (!franchiseMap[fid]) {
                franchiseMap[fid] = { franchiseId: fid, franchiseName: e.franchise.name, franchiseCode: e.franchise.code, isOwn: e.franchise.isOwn || false, studentCount: 0, totalFees: 0, collectedFees: 0 };
            }
            franchiseMap[fid].studentCount++;
            franchiseMap[fid].totalFees += e.feesTotal;
            franchiseMap[fid].collectedFees += e.feesPaid;
        });
        const franchiseStats = Object.values(franchiseMap).sort((a, b) => b.studentCount - a.studentCount);

        /* ── 4. Revenue & Enrollment Trends (Excluding Dropped) ── */
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const matchActiveStudent = { $lookup: { from: "students", localField: "student", foreignField: "_id", as: "studentInfo" } };
        const unwindStudent = { $unwind: "$studentInfo" };
        const filterNotDropped = { $match: { "studentInfo.courseStatus": { $ne: "dropped" } } };

        const [revenueTrendRaw, pendingTrendRaw, enrollmentTrendRaw] = await Promise.all([
            Enrollment.aggregate([matchActiveStudent, unwindStudent, filterNotDropped, { $unwind: "$payments" }, { $group: { _id: { month: { $month: "$payments.date" } }, amount: { $sum: "$payments.amount" } } }, { $project: { month: "$_id.month", amount: 1, _id: 0 } }, { $sort: { month: 1 } }]),
            Enrollment.aggregate([matchActiveStudent, unwindStudent, filterNotDropped, { $group: { _id: { month: { $month: "$createdAt" } }, pending: { $sum: { $subtract: ["$feesTotal", "$feesPaid"] } } } }, { $project: { month: "$_id.month", pending: 1, _id: 0 } }, { $sort: { month: 1 } }]),
            Enrollment.aggregate([matchActiveStudent, unwindStudent, filterNotDropped, { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } }, { $project: { month: "$_id.month", count: 1, _id: 0 } }, { $sort: { month: 1 } }]),
        ]);

        const pendingMap: Record<number, number> = {};
        pendingTrendRaw.forEach((p: any) => { pendingMap[p.month] = p.pending; });

        const revenueTrend = revenueTrendRaw.map((m: any) => ({ month: MONTH_NAMES[m.month], amount: m.amount }));
        const revenueByMonth = revenueTrendRaw.map((m: any) => ({ month: MONTH_NAMES[m.month], revenue: m.amount, pending: pendingMap[m.month] ?? 0 }));
        const enrollmentTrend = enrollmentTrendRaw.map((e: any) => ({ month: MONTH_NAMES[e.month], count: e.count }));

        const [thisMonthRevRaw, lastMonthRevRaw] = await Promise.all([
            Enrollment.aggregate([matchActiveStudent, unwindStudent, filterNotDropped, { $unwind: "$payments" }, { $match: { "payments.date": { $gte: thisMonthStart, $lte: now } } }, { $group: { _id: null, total: { $sum: "$payments.amount" } } }]),
            Enrollment.aggregate([matchActiveStudent, unwindStudent, filterNotDropped, { $unwind: "$payments" }, { $match: { "payments.date": { $gte: lastMonthStart, $lte: lastMonthEnd } } }, { $group: { _id: null, total: { $sum: "$payments.amount" } } }]),
        ]);

        const thisMonthRev = thisMonthRevRaw[0]?.total ?? 0;
        const lastMonthRev = lastMonthRevRaw[0]?.total ?? 0;
        const revenueGrowth = lastMonthRev === 0 ? (thisMonthRev > 0 ? 100 : 0) : Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 100);

        const [thisMonthEnrCount, lastMonthEnrCount] = await Promise.all([
            Enrollment.countDocuments({ createdAt: { $gte: thisMonthStart } }),
            Enrollment.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
        ]);
        const enrollmentGrowth = lastMonthEnrCount === 0 ? (thisMonthEnrCount > 0 ? 100 : 0) : Math.round(((thisMonthEnrCount - lastMonthEnrCount) / lastMonthEnrCount) * 100);

        /* ── 5. Top Pending & Top Paying (Active Only) ── */
        const pendingFees = await Enrollment.aggregate([
            { $match: { isActive: true } },
            matchActiveStudent, unwindStudent, filterNotDropped,
            { $addFields: { due: { $subtract: ["$feesTotal", "$feesPaid"] } } },
            { $match: { due: { $gt: 0 } } },
            { $sort: { due: -1 } },
            { $limit: 10 },
            { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseInfo" } },
            { $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: false } },
            { $project: { studentName: "$studentInfo.name", studentId: "$studentInfo.studentId", course: "$courseInfo.name", due: 1, _id: 0 } },
        ]);

        const topPayingRaw = await Enrollment.aggregate([
            { $match: { isActive: true, feesPaid: { $gt: 0 } } },
            matchActiveStudent, unwindStudent, filterNotDropped,
            { $group: { _id: "$student", totalPaid: { $sum: "$feesPaid" } } },
            { $sort: { totalPaid: -1 } },
            { $limit: 10 },
            { $lookup: { from: "students", localField: "_id", foreignField: "_id", as: "student" } },
            { $unwind: "$student" },
            { $project: { name: "$student.name", studentId: "$student.studentId", amount: "$totalPaid", _id: 0 } },
        ]);

        /* ── 6. Course analytics (Active Only) ── */
        const courseAnalytics = await Enrollment.aggregate([
            matchActiveStudent, unwindStudent, filterNotDropped,
            { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseInfo" } },
            { $unwind: "$courseInfo" },
            { $group: { _id: "$courseInfo.name", totalStudents: { $sum: 1 }, totalRevenue: { $sum: "$feesPaid" }, totalExpected: { $sum: "$feesTotal" } } },
            { $addFields: { totalPending: { $subtract: ["$totalExpected", "$totalRevenue"] } } },
            { $sort: { totalRevenue: -1 } },
        ]);

                return NextResponse.json({
            financial: { 
                totalExpected, totalCollected, totalPending, fullyPaidCount, partiallyPaidCount, unpaidCount, 
                revenueGrowth, thisMonthRev, lastMonthRev, 
                droppedStats: { expected: droppedExpected, collected: droppedCollected } 
            },
            students: { 
                total: totalStudents, active: activeStudents, completed: completedStudents, dropped: droppedStudents, 
                inactive: inactiveStudents, completionRate, dropoutRate, recentEnrollments, enrollmentGrowth, thisMonthEnrCount, lastMonthEnrCount 
            },
            certificates: certificateStats,
            revenueTrend, 
            enrollmentTrend, 
            topCourses: courseAnalytics.slice(0, 5), 
            courseAnalytics, 
            pendingFees, 
            topPayingStudents: topPayingRaw,
            totalStudents, totalCourses, totalRevenue, totalPending, feeCollectionRate, newStudentsThisMonth, 
            revenueByMonth, 
            enrollmentsByMonth: enrollmentTrend, // <-- FIX: Yahan enrollmentTrend assign kar diya
            courseWiseStudents: courseAnalytics.map((c: any) => ({ course: c._id, count: c.totalStudents })), 
            franchiseStats,
        });

    } catch (error: any) {
        return handleError(error, "GET /api/admin/analytics");
    }
}