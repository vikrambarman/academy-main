import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";

export async function GET() {

    await connectDB();

    /* ================= STUDENTS ================= */

    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ isActive: true });
    const inactiveStudents = await Student.countDocuments({ isActive: false });

    const recentEnrollments = await Enrollment.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    /* ================= FINANCIAL ================= */

    const enrollments = await Enrollment.find({ isActive: true });

    let totalExpected = 0;
    let totalCollected = 0;

    let fullyPaidCount = 0;
    let partiallyPaidCount = 0;
    let unpaidCount = 0;

    enrollments.forEach((e) => {

        totalExpected += e.feesTotal;
        totalCollected += e.feesPaid;

        if (e.feesPaid === 0) {
            unpaidCount++;
        } else if (e.feesPaid < e.feesTotal) {
            partiallyPaidCount++;
        } else {
            fullyPaidCount++;
        }

    });

    const totalPending = totalExpected - totalCollected;

    /* ================= CERTIFICATES ================= */

    const certificateStats = {
        notApplied: 0,
        applied: 0,
        examGiven: 0,
        passed: 0,
        generated: 0
    };

    enrollments.forEach((e) => {

        if (e.certificateStatus === "Not Applied")
            certificateStats.notApplied++;

        if (e.certificateStatus === "Applied")
            certificateStats.applied++;

        if (e.certificateStatus === "Exam Given")
            certificateStats.examGiven++;

        if (e.certificateStatus === "Passed")
            certificateStats.passed++;

        if (e.certificateStatus === "Certificate Generated")
            certificateStats.generated++;

    });

    /* ================= COURSE ANALYTICS ================= */

    const courseAnalytics = await Enrollment.aggregate([
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course"
            }
        },
        { $unwind: "$course" },
        {
            $group: {
                _id: "$course.name",
                totalStudents: { $sum: 1 },
                totalRevenue: { $sum: "$feesPaid" },
                totalExpected: { $sum: "$feesTotal" }
            }
        },
        {
            $addFields: {
                totalPending: { $subtract: ["$totalExpected", "$totalRevenue"] }
            }
        }
    ]);

    /* ================= REVENUE TREND ================= */

    const revenueTrend = await Enrollment.aggregate([
        { $unwind: "$payments" },
        {
            $group: {
                _id: {
                    month: { $month: "$payments.date" }
                },
                amount: { $sum: "$payments.amount" }
            }
        },
        {
            $project: {
                month: "$_id.month",
                amount: 1,
                _id: 0
            }
        },
        { $sort: { month: 1 } }
    ]);

    const monthNames = [
        "",
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const trendFormatted = revenueTrend.map((m) => ({
        month: monthNames[m.month],
        amount: m.amount
    }));

    return NextResponse.json({

        financial: {
            totalExpected,
            totalCollected,
            totalPending,
            fullyPaidCount,
            partiallyPaidCount,
            unpaidCount
        },

        students: {
            total: totalStudents,
            active: activeStudents,
            inactive: inactiveStudents,
            recentEnrollments
        },

        certificates: certificateStats,

        revenueTrend: trendFormatted,

        courseAnalytics

    });

}