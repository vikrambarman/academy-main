// src/app/api/admin/attendance/holiday/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

// POST → Bulk holiday mark for all active students
// Body: { date: "2025-01-26", holidayName: "Republic Day" }
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { date, holidayName } = await req.json() as {
            date: string;
            holidayName: string;
        };

        if (!date || !holidayName?.trim()) {
            return NextResponse.json(
                { message: "date aur holidayName required hain" },
                { status: 400 }
            );
        }

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // Saare active enrollments fetch karo
        const enrollments = await Enrollment.find({ isActive: true })
            .populate({
                path: "student",
                match: { isActive: true, courseStatus: "active" },
                select: "_id",
            })
            .lean() as any[];

        // Inactive students filter karo
        const activeEnrollments = enrollments.filter((e) => e.student);

        if (!activeEnrollments.length) {
            return NextResponse.json(
                { message: "Koi active enrollment nahi mili" },
                { status: 404 }
            );
        }

        let marked = 0;
        let skipped = 0;
        let updated = 0;

        for (const enrollment of activeEnrollments) {
            // Ensure attendance doc exists
            await Attendance.findOneAndUpdate(
                {
                    student: enrollment.student._id,
                    enrollment: enrollment._id,
                },
                {
                    $setOnInsert: {
                        student: enrollment.student._id,
                        enrollment: enrollment._id,
                        course: enrollment.course,
                        records: [],
                    },
                },
                { upsert: true, new: true }
            );

            const attDoc = await Attendance.findOne({
                student: enrollment.student._id,
                enrollment: enrollment._id,
            });

            if (!attDoc) continue;

            // Check if record already exists for this date
            const existingIdx = attDoc.records.findIndex((r: any) => {
                const d = new Date(r.date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === targetDate.getTime();
            });

            if (existingIdx >= 0) {
                // Already kuch mark hai - holiday se override karo
                const prev = attDoc.records[existingIdx].status;
                attDoc.records[existingIdx].status = "holiday";
                attDoc.records[existingIdx].remark = holidayName;
                // IN/OUT clear karo (holiday pe koi time nahi chahiye)
                attDoc.records[existingIdx].inTime = undefined;
                attDoc.records[existingIdx].outTime = undefined;
                attDoc.records[existingIdx].markedVia = "manual";
                updated++;
            } else {
                // Naya holiday record push karo
                attDoc.records.push({
                    date: targetDate,
                    status: "holiday",
                    remark: holidayName,
                    markedVia: "manual",
                } as any);
                marked++;
            }

            attDoc.markModified("records");
            await attDoc.save();
        }

        return NextResponse.json({
            success: true,
            message: `🎉 Holiday "${holidayName}" mark ho gaya!`,
            stats: {
                totalProcessed: activeEnrollments.length,
                newlyMarked: marked,
                updated: updated,
            },
        });
    } catch (error: any) {
        if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("[POST /api/admin/attendance/holiday]", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// GET → Check karo ki kisi date pe holiday hai ya nahi
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");

        if (!date) {
            return NextResponse.json(
                { message: "date required hai" },
                { status: 400 }
            );
        }

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // Kisi ek student ka record check karo
        const sample = await Attendance.findOne({}).lean() as any;
        if (!sample) {
            return NextResponse.json({ isHoliday: false, holidayName: null });
        }

        const rec = (sample.records || []).find((r: any) => {
            const d = new Date(r.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === targetDate.getTime();
        });

        return NextResponse.json({
            isHoliday: rec?.status === "holiday",
            holidayName: rec?.status === "holiday" ? rec.remark : null,
        });
    } catch (error: any) {
        if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}