// src/app/api/admin/attendance/student/[enrollmentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Enrollment from "@/models/Enrollment";
import "@/models/Student";
import "@/models/Course";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

// ✅ Fix: params ko Promise<{ enrollmentId: string }> declare karo
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ enrollmentId: string }> }
) {
    try {
        await connectDB();
        await requireAdmin();

        // ✅ Fix: params ko await karo
        const { enrollmentId } = await params;

        // Get enrollment with student & course
        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("student", "name studentId _id")
            .populate("course", "name _id")
            .lean();

        if (!enrollment) {
            return NextResponse.json(
                { success: false, message: "Enrollment not found" },
                { status: 404 }
            );
        }

        // Get attendance doc
        const attDoc = await Attendance.findOne({ enrollment: enrollmentId }).lean();

        const records = (attDoc?.records ?? []).map((r: any) => ({
            date: r.date,
            status: r.status,
            remark: r.remark ?? "",
            inTime: r.inTime ?? null,
            outTime: r.outTime ?? null,
            markedVia: r.markedVia ?? null,
        }));

        // Calculate stats
        const stats = {
            total: 0,
            present: 0,
            absent: 0,
            late: 0,
            holiday: 0,
            leave: 0,
            percentage: 0
        };

        for (const r of records) {
            stats.total++;
            if (r.status === "present") stats.present++;
            else if (r.status === "absent") stats.absent++;
            else if (r.status === "late") stats.late++;
            else if (r.status === "holiday") stats.holiday++;
            else if (r.status === "leave") stats.leave++;
        }

        const counted = stats.total - stats.holiday - stats.leave;
        stats.percentage = counted > 0
            ? Math.round(((stats.present + stats.late) / counted) * 100)
            : 0;

        const data = {
            enrollmentId: (enrollment as any)._id.toString(),
            student: (enrollment as any).student,
            course: (enrollment as any).course,
            stats,
            records,
        };

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("[GET /api/admin/attendance/student/:id]", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}