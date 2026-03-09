// app/api/admin/attendance/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";

// GET — fetch attendance for a student+enrollment
// GET /api/admin/attendance?enrollmentId=xxx
export async function GET(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const enrollmentId = searchParams.get("enrollmentId");

        if (!enrollmentId) return NextResponse.json({ message: "enrollmentId required" }, { status: 400 });

        const attendance = await Attendance.findOne({ enrollment: enrollmentId })
            .populate("student", "name studentId")
            .populate("course", "name authority")
            .lean();

        return NextResponse.json({ attendance: attendance ?? null });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST — create or update attendance records (bulk upsert)
// Body: { enrollmentId, studentId, courseId, records: [{date, status, remark}] }
export async function POST(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const body = await req.json();
        const { enrollmentId, studentId, courseId, records } = body;

        if (!enrollmentId || !studentId || !courseId || !records?.length) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Upsert — create if not exists, update if exists
        const attendance = await Attendance.findOneAndUpdate(
            { enrollment: enrollmentId },
            {
                student: studentId,
                enrollment: enrollmentId,
                course: courseId,
                $push: { records: { $each: records } },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "Attendance saved", attendance });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PATCH — update a specific date's record
// Body: { enrollmentId, date, status, remark }
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { enrollmentId, date, status, remark } = await req.json();
        if (!enrollmentId || !date || !status) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({ enrollment: enrollmentId });
        if (!attendance) return NextResponse.json({ message: "Attendance record not found" }, { status: 404 });

        const existing = attendance.records.find(r => {
            const d = new Date(r.date); d.setHours(0, 0, 0, 0);
            return d.getTime() === targetDate.getTime();
        });

        if (existing) {
            existing.status = status;
            if (remark !== undefined) existing.remark = remark;
        } else {
            attendance.records.push({ date: targetDate, status, remark });
        }

        await attendance.save();
        return NextResponse.json({ message: "Updated", attendance });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}