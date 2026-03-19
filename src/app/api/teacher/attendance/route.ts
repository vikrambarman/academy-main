/**
 * GET   /api/teacher/attendance?courseId=xxx&date=2026-03-10
 * POST  /api/teacher/attendance  — Bulk mark
 * PATCH /api/teacher/attendance  — Single record update
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance     from "@/models/Attendance";
import Enrollment     from "@/models/Enrollment";
import "@/models/Student";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function requireTeacher() {
    const user: any = await verifyUser();
    if (!user || user.role !== "teacher") throw new Error("UNAUTHORIZED");
    return user;
}

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message))
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

function buildStats(records: any[], date?: string) {
    const stats = { total: 0, present: 0, absent: 0, late: 0, holiday: 0, leave: 0, percentage: 0 };
    for (const r of records ?? []) {
        stats.total++;
        if      (r.status === "present") stats.present++;
        else if (r.status === "absent")  stats.absent++;
        else if (r.status === "late")    stats.late++;
        else if (r.status === "holiday") stats.holiday++;
        else if (r.status === "leave")   stats.leave++;
    }
    // leave + holiday don't count against percentage
    const counted = stats.total - stats.holiday - stats.leave;
    stats.percentage = counted > 0
        ? Math.round(((stats.present + stats.late) / counted) * 100)
        : 0;

    let todayRecord: any = null;
    if (date) {
        const target = new Date(date);
        todayRecord = records.find((r: any) =>
            new Date(r.date).toDateString() === target.toDateString()
        ) ?? null;
    }
    return { stats, todayRecord };
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireTeacher();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const date     = searchParams.get("date") ?? undefined;

        if (!courseId)
            return NextResponse.json({ message: "courseId required" }, { status: 400 });

        // Active enrollments for this course
        const enrollments = await Enrollment.find({ course: courseId, isActive: true })
            .populate({
                path:  "student",
                match: { isActive: true, courseStatus: "active" },
                select: "name studentId",
            })
            .lean() as any[];

        const activeEnrollments = enrollments.filter(e => e.student);
        const enrollmentIds     = activeEnrollments.map(e => e._id);

        const attDocs = await Attendance.find({ enrollment: { $in: enrollmentIds } }).lean() as any[];

        const attendance = attDocs.map(doc => {
            const { stats, todayRecord } = buildStats(doc.records, date);
            return {
                enrollmentId: doc.enrollment,
                studentId:    doc.student,
                stats,
                todayRecord,
            };
        });

        return NextResponse.json({ attendance, enrollments: activeEnrollments });

    } catch (e: any) { return handleError(e, "GET /api/teacher/attendance"); }
}

// ── POST — bulk mark ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireTeacher();

        const { date, records } = await req.json() as {
            date: string;
            records: { enrollmentId: string; studentId: string; courseId: string; status: string; remark?: string }[];
        };

        if (!date || !records?.length)
            return NextResponse.json({ message: "date aur records required hain" }, { status: 400 });

        const targetDate = new Date(date);

        for (const { enrollmentId, studentId, courseId, status, remark } of records) {
            // Ensure doc exists
            await Attendance.findOneAndUpdate(
                { enrollment: enrollmentId },
                { $setOnInsert: { student: studentId, enrollment: enrollmentId, course: courseId, records: [] } },
                { upsert: true, new: true }
            );

            const att = await Attendance.findOne({ enrollment: enrollmentId });
            if (!att) continue;

            const idx = att.records.findIndex((r: any) =>
                new Date(r.date).toDateString() === targetDate.toDateString()
            );

            if (idx >= 0) {
                att.records[idx].status = status as any;
                att.records[idx].remark = remark ?? "";
            } else {
                att.records.push({ date: targetDate, status: status as any, remark: remark ?? "" });
            }

            att.markModified("records");
            await att.save();
        }

        return NextResponse.json({ message: "Attendance save ho gayi ✓" });

    } catch (e: any) { return handleError(e, "POST /api/teacher/attendance"); }
}

// ── PATCH — single record update ──────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        await requireTeacher();

        const { enrollmentId, date, status, remark } = await req.json();
        if (!enrollmentId || !date || !status)
            return NextResponse.json({ message: "enrollmentId, date, status required" }, { status: 400 });

        const targetDate = new Date(date);
        const att = await Attendance.findOne({ enrollment: enrollmentId });
        if (!att)
            return NextResponse.json({ message: "Attendance doc nahi mila" }, { status: 404 });

        const idx = att.records.findIndex((r: any) =>
            new Date(r.date).toDateString() === targetDate.toDateString()
        );

        if (idx >= 0) {
            att.records[idx].status = status;
            att.records[idx].remark = remark ?? "";
        } else {
            att.records.push({ date: targetDate, status, remark: remark ?? "" });
        }

        att.markModified("records");
        await att.save();
        return NextResponse.json({ message: "Updated ✓" });

    } catch (e: any) { return handleError(e, "PATCH /api/teacher/attendance"); }
}