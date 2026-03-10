// src/app/api/teacher/attendance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";

// GET ?courseId=xxx&date=2026-03-10
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const date     = searchParams.get("date");

        if (!courseId) return NextResponse.json({ message: "courseId required" }, { status: 400 });

        // Active enrollments for this course
        const enrollments = await Enrollment.find({ course: courseId, isActive: true })
            .populate({ path: "student", match: { isActive: true, courseStatus: "active" }, select: "name studentId" })
            .lean();

        const activeEnrollments = enrollments.filter(e => e.student);

        // Attendance docs
        const enrollmentIds = activeEnrollments.map(e => e._id);
        const attDocs       = await Attendance.find({ enrollment: { $in: enrollmentIds } }).lean();

        const targetDate = date ? new Date(date) : null;

        const attendance = attDocs.map((doc: any) => {
            const records  = doc.records ?? [];
            const total    = records.length;
            const present  = records.filter((r: any) => r.status === "present").length;
            const absent   = records.filter((r: any) => r.status === "absent").length;
            const late     = records.filter((r: any) => r.status === "late").length;
            const holiday  = records.filter((r: any) => r.status === "holiday").length;
            const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

            const todayRecord = targetDate
                ? records.find((r: any) => {
                    const d = new Date(r.date);
                    return d.toDateString() === targetDate.toDateString();
                }) ?? null
                : null;

            return { enrollmentId: doc.enrollment, studentId: doc.student, stats: { total, present, absent, late, holiday, percentage }, todayRecord };
        });

        return NextResponse.json({ attendance, enrollments: activeEnrollments });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST — bulk mark attendance for a date
// Body: { date, records: [{ enrollmentId, studentId, courseId, status, remark }] }
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { date, records } = await req.json();
        if (!date || !records?.length) return NextResponse.json({ message: "date aur records required hain" }, { status: 400 });

        const targetDate = new Date(date);
        const results = [];

        for (const rec of records) {
            const { enrollmentId, studentId, courseId, status, remark } = rec;

            // Upsert: create doc if missing
            await Attendance.findOneAndUpdate(
                { enrollment: enrollmentId },
                { $setOnInsert: { student: studentId, enrollment: enrollmentId, course: courseId, records: [] } },
                { upsert: true, new: true }
            );

            const att = await Attendance.findOne({ enrollment: enrollmentId });
            if (!att) continue;
            if (!att.records) att.records = [];

            const idx = att.records.findIndex((r: any) => new Date(r.date).toDateString() === targetDate.toDateString());

            if (idx >= 0) {
                att.records[idx].status = status;
                att.records[idx].remark = remark ?? "";
            } else {
                att.records.push({ date: targetDate, status, remark: remark ?? "" });
            }

            att.markModified("records");
            await att.save();
            results.push({ enrollmentId, status: "saved" });
        }

        return NextResponse.json({ message: "Attendance save ho gaya", results });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PATCH — single record update
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { enrollmentId, date, status, remark } = await req.json();
        const targetDate = new Date(date);

        const att = await Attendance.findOne({ enrollment: enrollmentId });
        if (!att) return NextResponse.json({ message: "Attendance doc nahi mila" }, { status: 404 });

        const idx = att.records.findIndex((r: any) => new Date(r.date).toDateString() === targetDate.toDateString());
        if (idx >= 0) { att.records[idx].status = status; att.records[idx].remark = remark ?? ""; }
        else att.records.push({ date: targetDate, status, remark: remark ?? "" });

        att.markModified("records");
        await att.save();

        return NextResponse.json({ message: "Updated" });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}