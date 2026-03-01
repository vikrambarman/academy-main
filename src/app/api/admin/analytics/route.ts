import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();

        /* ===============================
           1️⃣ FINANCIAL + STUDENT SUMMARY
        ================================ */

        const summary = await Student.aggregate([
            {
                $addFields: {
                    pendingFees: { $subtract: ["$feesTotal", "$feesPaid"] },
                },
            },
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    activeStudents: {
                        $sum: { $cond: ["$isActive", 1, 0] },
                    },
                    inactiveStudents: {
                        $sum: { $cond: ["$isActive", 0, 1] },
                    },
                    totalExpected: { $sum: "$feesTotal" },
                    totalCollected: { $sum: "$feesPaid" },
                    totalPending: { $sum: "$pendingFees" },

                    fullyPaidCount: {
                        $sum: {
                            $cond: [{ $eq: ["$pendingFees", 0] }, 1, 0],
                        },
                    },

                    partiallyPaidCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gt: ["$feesPaid", 0] },
                                        { $gt: ["$pendingFees", 0] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    unpaidCount: {
                        $sum: {
                            $cond: [{ $eq: ["$feesPaid", 0] }, 1, 0],
                        },
                    },
                },
            },
        ]);

        /* ===============================
           2️⃣ CERTIFICATE BREAKDOWN
        ================================ */

        const certificateStats = await Student.aggregate([
            {
                $group: {
                    _id: "$certificateStatus",
                    count: { $sum: 1 },
                },
            },
        ]);

        const certificateMap: any = {
            notApplied: 0,
            applied: 0,
            examGiven: 0,
            passed: 0,
            generated: 0,
        };

        certificateStats.forEach((item) => {
            switch (item._id) {
                case "Not Applied":
                    certificateMap.notApplied = item.count;
                    break;
                case "Applied":
                    certificateMap.applied = item.count;
                    break;
                case "Exam Given":
                    certificateMap.examGiven = item.count;
                    break;
                case "Passed":
                    certificateMap.passed = item.count;
                    break;
                case "Certificate Generated":
                    certificateMap.generated = item.count;
                    break;
            }
        });

        /* ===============================
           3️⃣ MONTHLY REVENUE TREND
        ================================ */

        const revenueTrend = await Student.aggregate([
            { $unwind: "$payments" },
            {
                $group: {
                    _id: {
                        year: { $year: "$payments.date" },
                        month: { $month: "$payments.date" },
                    },
                    total: { $sum: "$payments.amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const formattedRevenueTrend = revenueTrend.map((item) => {
            const date = new Date(item._id.year, item._id.month - 1);
            const month = date.toLocaleString("default", {
                month: "short",
                year: "numeric",
            });

            return {
                month,
                amount: item.total,
            };
        });

        /* ===============================
           4️⃣ COURSE LEVEL ANALYTICS
        ================================ */

        const courseAnalytics = await Student.aggregate([
            {
                $addFields: {
                    pendingFees: { $subtract: ["$feesTotal", "$feesPaid"] },
                },
            },
            {
                $group: {
                    _id: "$course",
                    totalStudents: { $sum: 1 },
                    totalRevenue: { $sum: "$feesPaid" },
                    totalExpected: { $sum: "$feesTotal" },
                    totalPending: { $sum: "$pendingFees" },
                },
            },
        ]);

        /* ===============================
           5️⃣ RECENT ENROLLMENTS (30 Days)
        ================================ */

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentEnrollments = await Student.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
        });

        return NextResponse.json({
            financial: summary[0] || {},
            certificates: certificateMap,
            students: {
                total: summary[0]?.totalStudents || 0,
                active: summary[0]?.activeStudents || 0,
                inactive: summary[0]?.inactiveStudents || 0,
                recentEnrollments,
            },
            revenueTrend: formattedRevenueTrend,
            courseAnalytics,
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json(
            { error: "Failed to load analytics" },
            { status: 500 }
        );
    }
}