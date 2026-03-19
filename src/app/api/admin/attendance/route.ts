/**
 * GET   /api/admin/attendance?courseId=xxx&date=2026-03-10
 * GET   /api/admin/attendance (no params) → course-wise student counts
 * POST  /api/admin/attendance — Bulk upsert
 * PATCH /api/admin/attendance — Single record update
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import "@/models/Student";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
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
        if (r.status === "present") stats.present++;
        else if (r.status === "absent") stats.absent++;
        else if (r.status === "late") stats.late++;
        else if (r.status === "holiday") stats.holiday++;
        else if (r.status === "leave") stats.leave++;
    }
    // present + late count as attended; leave/holiday don't count against
    const counted = stats.total - stats.holiday - stats.leave;
    stats.percentage = counted > 0
        ? Math.round(((stats.present + stats.late) / counted) * 100)
        : 0;

    let todayRecord: any = null;
    if (date) {
        const target = new Date(date); target.setHours(0, 0, 0, 0);
        todayRecord = (records ?? []).find((r: any) => {
            const d = new Date(r.date); d.setHours(0, 0, 0, 0);
            return d.getTime() === target.getTime();
        }) ?? null;
    }
    return { stats, todayRecord };
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const date = searchParams.get("date");

        // ── No courseId: return all courses + their enrolled student counts ──
        if (!courseId) {
            const [courses, enrollments, docs] = await Promise.all([
                Course.find({ isActive: true }).select("name _id").lean(),
                Enrollment.find({ isActive: true }).select("course").lean(),
                Attendance.find()
                    .populate("student", "name studentId")
                    .populate("course", "name")
                    .lean() as Promise<any[]>,
            ]);

            // Count enrollments per course
            const countMap: Record<string, number> = {};
            for (const e of enrollments as any[]) {
                const cid = e.course?.toString();
                if (cid) countMap[cid] = (countMap[cid] || 0) + 1;
            }

            const courseSummary = (courses as any[]).map(c => ({
                _id: c._id,
                name: c.name,
                studentCount: countMap[c._id.toString()] || 0,
            }));

            // Build attendance with stats
            const attendance = docs.map((doc: any) => {
                const { stats, todayRecord } = buildStats(doc.records, date ?? undefined);
                return { ...doc, stats, todayRecord };
            });

            return NextResponse.json({ attendance, courseSummary });
        }

        // ── With courseId: enrollments + attendance for that course ──
        const [enrollments, docs] = await Promise.all([
            Enrollment.find({ course: courseId, isActive: true })
                .populate("student", "name studentId _id isActive courseStatus")
                .lean() as Promise<any[]>,
            Attendance.find({ course: courseId })
                .populate("student", "name studentId")
                .populate("course", "name")
                .lean() as Promise<any[]>,
        ]);

        // Filter inactive/completed students
        const activeEnrollments = (enrollments as any[]).filter(e => {
            const s = e.student;
            if (!s) return false;
            if (s.isActive === false) return false;
            if (s.courseStatus === "completed" || s.courseStatus === "dropped") return false;
            return true;
        });

        const attendance = (docs as any[]).map(doc => {
            const { stats, todayRecord } = buildStats(doc.records, date ?? undefined);
            return { ...doc, stats, todayRecord };
        });

        return NextResponse.json({ attendance, enrollments: activeEnrollments });

    } catch (e: any) { return handleError(e, "GET /api/admin/attendance"); }
}

// ── POST — Bulk upsert ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { date, records } = await req.json() as {
            date: string;
            records: { enrollmentId: string; studentId: string; courseId: string; status: string; remark?: string }[];
        };

        if (!date || !records?.length)
            return NextResponse.json({ message: "date aur records required hain" }, { status: 400 });

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // Ensure doc exists for each enrollment
        await Promise.all(
            records.map(({ enrollmentId, studentId, courseId }) =>
                Attendance.updateOne(
                    { enrollment: enrollmentId },
                    { $setOnInsert: { student: studentId, enrollment: enrollmentId, course: courseId, records: [] } },
                    { upsert: true }
                )
            )
        );

        // Update or push record for target date
        await Promise.all(
            records.map(async ({ enrollmentId, status, remark }) => {
                const att = await Attendance.findOne({ enrollment: enrollmentId });
                if (!att) return;

                const idx = att.records.findIndex((r: any) => {
                    const d = new Date(r.date); d.setHours(0, 0, 0, 0);
                    return d.getTime() === targetDate.getTime();
                });

                if (idx >= 0) {
                    att.records[idx].status = status as any;
                    att.records[idx].remark = remark ?? "";
                } else {
                    att.records.push({ date: targetDate, status: status as any, remark: remark ?? "" });
                }
                await att.save();
            })
        );

        return NextResponse.json({ message: "Bulk attendance saved ✓" });
    } catch (e: any) { return handleError(e, "POST /api/admin/attendance"); }
}

// ── PATCH — Single record update ──────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { enrollmentId, date, status, remark } = await req.json();
        if (!enrollmentId || !date || !status)
            return NextResponse.json({ message: "enrollmentId, date, status required" }, { status: 400 });

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const att = await Attendance.findOne({ enrollment: enrollmentId });
        if (!att)
            return NextResponse.json({ message: "Record nahi mila" }, { status: 404 });

        const existing = att.records.find((r: any) => {
            const d = new Date(r.date); d.setHours(0, 0, 0, 0);
            return d.getTime() === targetDate.getTime();
        });

        if (existing) {
            existing.status = status;
            if (remark !== undefined) existing.remark = remark;
        } else {
            att.records.push({ date: targetDate, status, remark });
        }

        await att.save();
        return NextResponse.json({ message: "Updated ✓" });
    } catch (e: any) { return handleError(e, "PATCH /api/admin/attendance"); }
}