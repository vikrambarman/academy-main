// FILE: src/app/api/admin/attendance/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Enrollment from "@/models/Enrollment";

/**
 * GET /api/admin/attendance?courseId=xxx&date=2026-03-10
 *
 * Returns:
 * - attendance: existing docs with stats + todayRecord
 * - enrollments: ALL active enrollments for courseId (student list for bulk entry)
 */
export async function GET(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const date     = searchParams.get("date");

        // ── Attendance docs ───────────────────────────────────────────
        const attFilter: any = {};
        if (courseId) attFilter.course = courseId;

        const docs = await Attendance.find(attFilter)
            .populate("student", "name studentId")
            .populate("course",  "name")
            .lean() as any[];

        const attendance = docs.map((doc: any) => {
            const stats = { total: 0, present: 0, absent: 0, late: 0, holiday: 0, percentage: 0 };
            for (const r of (doc.records ?? [])) {
                stats.total++;
                if      (r.status === "present") stats.present++;
                else if (r.status === "absent")  stats.absent++;
                else if (r.status === "late")    stats.late++;
                else if (r.status === "holiday") stats.holiday++;
            }
            stats.percentage = stats.total > 0
                ? Math.round(((stats.present + stats.late) / stats.total) * 100)
                : 0;

            let todayRecord: any = null;
            if (date) {
                const target = new Date(date);
                target.setHours(0, 0, 0, 0);
                todayRecord = (doc.records ?? []).find((r: any) => {
                    const d = new Date(r.date); d.setHours(0, 0, 0, 0);
                    return d.getTime() === target.getTime();
                }) ?? null;
            }

            return { ...doc, stats, todayRecord };
        });

        // ── Enrollments (for student list in bulk mark entry) ─────────
        // Only active enrollments where student courseStatus is "active"
        let enrollments: any[] = [];
        if (courseId) {
            const allEnrollments = await Enrollment.find({ course: courseId, isActive: true })
                .populate("student", "name studentId _id courseStatus isActive")
                .lean() as any[];

            // Filter out completed/dropped/inactive students
            enrollments = allEnrollments.filter((e: any) => {
                const s = e.student;
                if (!s) return false;
                if (s.isActive === false) return false;
                if (s.courseStatus === "completed" || s.courseStatus === "dropped") return false;
                return true;
            });
        }

        return NextResponse.json({ attendance, enrollments });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

/**
 * POST /api/admin/attendance — Date-wise bulk upsert
 * Body: { date, records: [{ enrollmentId, studentId, courseId, status, remark? }] }
 */
export async function POST(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const body = await req.json();
        const { date, records } = body as {
            date: string;
            records: { enrollmentId: string; studentId: string; courseId: string; status: string; remark?: string }[];
        };

        if (!date || !records?.length)
            return NextResponse.json({ message: "date aur records required hain" }, { status: 400 });

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // Step 1: ensure attendance doc exists for each enrollment
        await Promise.all(
            records.map(({ enrollmentId, studentId, courseId }) =>
                Attendance.updateOne(
                    { enrollment: enrollmentId },
                    { $setOnInsert: { student: studentId, enrollment: enrollmentId, course: courseId, records: [] } },
                    { upsert: true }
                )
            )
        );

        // Step 2: update or push record for the target date
        await Promise.all(
            records.map(async ({ enrollmentId, status, remark }) => {
                const att = await Attendance.findOne({ enrollment: enrollmentId });
                if (!att) return;

                const idx = (att.records ?? []).findIndex((r: any) => {
                    const d = new Date(r.date); d.setHours(0, 0, 0, 0);
                    return d.getTime() === targetDate.getTime();
                });

                if (!att.records) att.records = [];
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
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/attendance — Update single record
 * Body: { enrollmentId, date, status, remark? }
 */
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

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
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}