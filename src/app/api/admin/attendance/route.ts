// src/app/api/admin/attendance/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import "@/models/Student";

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

function buildStats(records: any[]) {
    const stats = {
        total: 0, present: 0, absent: 0,
        late: 0, holiday: 0, leave: 0, percentage: 0
    };
    for (const r of records ?? []) {
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
    return stats;
}

function buildTodayRecord(records: any[], date?: string) {
    if (!date) return null;
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return (records ?? []).find((r: any) => {
        const d = new Date(r.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === target.getTime();
    }) ?? null;
}

function buildDailyStats(allDocs: any[]) {
    const dayMap: Record<string, {
        date: string;
        present: number; absent: number; late: number;
        holiday: number; leave: number; total: number;
    }> = {};

    for (const doc of allDocs) {
        for (const r of doc.records ?? []) {
            const d = new Date(r.date);
            d.setHours(0, 0, 0, 0);
            const key = d.toISOString().split("T")[0];
            if (!dayMap[key]) {
                dayMap[key] = { date: key, present: 0, absent: 0, late: 0, holiday: 0, leave: 0, total: 0 };
            }
            dayMap[key].total++;
            if (r.status === "present") dayMap[key].present++;
            else if (r.status === "absent") dayMap[key].absent++;
            else if (r.status === "late") dayMap[key].late++;
            else if (r.status === "holiday") dayMap[key].holiday++;
            else if (r.status === "leave") dayMap[key].leave++;
        }
    }

    return Object.values(dayMap).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const date     = searchParams.get("date");

        // ── With courseId: Mark tab ──
        if (courseId) {
            const [enrollments, docs] = await Promise.all([
                Enrollment.find({ course: courseId, isActive: true })
                    .populate("student", "name studentId _id isActive courseStatus")
                    .lean() as Promise<any[]>,
                Attendance.find({ course: courseId })
                    .populate("student", "name studentId")
                    .populate("course", "name")
                    .lean() as Promise<any[]>,
            ]);

            const activeEnrollments = enrollments.filter(e => {
                const s = e.student;
                if (!s || s.isActive === false) return false;
                if (["completed", "dropped"].includes(s.courseStatus)) return false;
                return true;
            });

            const attendance = docs.map(doc => ({
                ...doc,
                stats:       buildStats(doc.records),
                todayRecord: buildTodayRecord(doc.records, date ?? undefined),
            }));

            const dailyStats = buildDailyStats(docs);

            return NextResponse.json({ attendance, enrollments: activeEnrollments, dailyStats });
        }

        // ── No courseId: Overview + Daily ──
        const [courses, enrollments, attDocs] = await Promise.all([
            Course.find({ isActive: true }).select("name _id").lean(),
            Enrollment.find({ isActive: true })
                .populate("student", "name studentId _id isActive courseStatus")
                .populate("course", "name _id")
                .lean() as Promise<any[]>,
            Attendance.find()
                .populate("student", "name studentId _id")
                .populate("course", "name _id")
                .lean() as Promise<any[]>,
        ]);

        // ✅ Attendance map by enrollmentId
        const attByEnrollment: Record<string, any> = {};
        for (const doc of attDocs) {
            const eid = doc.enrollment?.toString();
            if (eid) attByEnrollment[eid] = doc;
        }

        // ✅ Active enrollments only
        const activeEnrollments = enrollments.filter(e => {
            const s = e.student as any;
            if (!s || s.isActive === false) return false;
            if (["completed", "dropped"].includes(s.courseStatus)) return false;
            return true;
        });

        // ✅ Build overview: every enrolled student, even if no attendance doc
        const overviewDocs = activeEnrollments.map(e => {
            const attDoc = attByEnrollment[e._id?.toString()] ?? null;
            const records = attDoc?.records ?? [];
            const stats   = buildStats(records);
            const student = e.student as any;
            const course  = e.course as any;

            return {
                _id:          attDoc?._id ?? e._id,
                enrollmentId: e._id?.toString(),
                student: {
                    _id:       student?._id,
                    name:      student?.name ?? "—",
                    studentId: student?.studentId ?? "—",
                },
                course: {
                    _id:  course?._id,
                    name: course?.name ?? "—",
                },
                stats,
                hasAttendance: !!attDoc,
                records,        // ✅ For daily breakdown
            };
        });

        // Course summary
        const countMap: Record<string, number> = {};
        for (const e of activeEnrollments) {
            const cid = (e.course as any)?._id?.toString();
            if (cid) countMap[cid] = (countMap[cid] || 0) + 1;
        }
        const courseSummary = (courses as any[]).map(c => ({
            _id:          c._id,
            name:         c.name,
            studentCount: countMap[c._id.toString()] || 0,
        }));

        // Daily stats
        const dailyStats = buildDailyStats(attDocs);

        // Per-course daily stats
        const courseDailyMap: Record<string, any[]> = {};
        for (const doc of attDocs) {
            const cid = (doc.course as any)?._id?.toString() ?? "";
            if (!courseDailyMap[cid]) courseDailyMap[cid] = [];
            courseDailyMap[cid].push(doc);
        }

        const courseDailyStats = Object.entries(courseDailyMap).map(([cid, cdocs]) => ({
            courseId:      cid,
            courseName:    (cdocs[0]?.course as any)?.name ?? "—",
            totalStudents: countMap[cid] ?? 0,
            daily:         buildDailyStats(cdocs),
        }));

        return NextResponse.json({
            attendance:       overviewDocs,   // ✅ All enrolled students
            courseSummary,
            dailyStats,
            courseDailyStats,
        });

    } catch (e: any) { return handleError(e, "GET /api/admin/attendance"); }
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { date, records } = await req.json() as {
            date: string;
            records: {
                enrollmentId: string;
                studentId:    string;
                courseId:     string;
                status:       string;
                remark?:      string;
            }[];
        };

        if (!date || !records?.length)
            return NextResponse.json(
                { message: "date aur records required hain" },
                { status: 400 }
            );

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        await Promise.all(
            records.map(({ enrollmentId, studentId, courseId }) =>
                Attendance.updateOne(
                    { enrollment: enrollmentId },
                    {
                        $setOnInsert: {
                            student: studentId, enrollment: enrollmentId,
                            course: courseId, records: [],
                        }
                    },
                    { upsert: true }
                )
            )
        );

        await Promise.all(
            records.map(async ({ enrollmentId, status, remark }) => {
                const att = await Attendance.findOne({ enrollment: enrollmentId });
                if (!att) return;

                const idx = att.records.findIndex((r: any) => {
                    const d = new Date(r.date);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() === targetDate.getTime();
                });

                if (idx >= 0) {
                    att.records[idx].status = status as any;
                    att.records[idx].remark = remark ?? "";
                } else {
                    att.records.push({
                        date: targetDate, status: status as any, remark: remark ?? ""
                    });
                }
                await att.save();
            })
        );

        return NextResponse.json({ message: "Bulk attendance saved ✓" });
    } catch (e: any) { return handleError(e, "POST /api/admin/attendance"); }
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { enrollmentId, date, status, remark } = await req.json();
        if (!enrollmentId || !date || !status)
            return NextResponse.json(
                { message: "enrollmentId, date, status required" },
                { status: 400 }
            );

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const att = await Attendance.findOne({ enrollment: enrollmentId });
        if (!att)
            return NextResponse.json({ message: "Record nahi mila" }, { status: 404 });

        const existing = att.records.find((r: any) => {
            const d = new Date(r.date);
            d.setHours(0, 0, 0, 0);
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