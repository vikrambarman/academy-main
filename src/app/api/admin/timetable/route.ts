/**
 * GET   /api/admin/timetable?enrollmentId=xxx  OR  ?courseId=xxx
 * POST  /api/admin/timetable — single OR bulk create
 * PATCH /api/admin/timetable — update slots
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB }          from "@/lib/db";
import { verifyUser }         from "@/lib/verifyUser";
import Timetable              from "@/models/Timetable";
import Student                from "@/models/Student";
import { sendTimetableEmail } from "@/lib/mail";
import "@/models/User";
import "@/models/Course";

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

async function getStudentEmail(studentId: string) {
    try {
        const student = await Student.findById(studentId).populate("user", "email").lean() as any;
        if (!student) return null;
        return { email: student.user?.email ?? "", name: student.name ?? "Student", sid: student.studentId ?? "" };
    } catch { return null; }
}

function fireEmail(studentId: string, courseName: string, slots: any[]) {
    getStudentEmail(studentId).then(info => {
        if (!info?.email) return;
        sendTimetableEmail(info.email, { name: info.name, studentId: info.sid, courseName, slots })
            .catch(err => console.error("Timetable email error:", err));
    });
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const enrollmentId = searchParams.get("enrollmentId");
        const courseId     = searchParams.get("courseId");

        const query: any = {};
        if (enrollmentId) query.enrollment = enrollmentId;
        if (courseId)     query.course     = courseId;

        const timetables = await Timetable.find(query)
            .populate("course",  "name")
            .populate("student", "name studentId")
            .lean();

        return NextResponse.json({ timetables });
    } catch (e: any) { return handleError(e, "GET /api/admin/timetable"); }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const body = await req.json();
        const { courseId, slots, validFrom, validTo, bulk, students,
                enrollmentId, studentId, courseName } = body;

        if (!courseId || !slots?.length)
            return NextResponse.json({ message: "courseId aur slots required hain" }, { status: 400 });

        // ── BULK ──
        if (bulk) {
            if (!students?.length)
                return NextResponse.json({ message: "Bulk mode mein students array required hai" }, { status: 400 });

            const results: { enrollmentId: string; status: string; error?: string }[] = [];

            for (const s of students as { enrollmentId: string; studentId: string }[]) {
                try {
                    await Timetable.updateMany({ enrollment: s.enrollmentId }, { isActive: false });
                    await Timetable.create({
                        course: courseId, enrollment: s.enrollmentId, student: s.studentId,
                        slots, validFrom: validFrom ?? new Date(), validTo: validTo ?? null, isActive: true,
                    });
                    fireEmail(s.studentId, courseName ?? "Your Course", slots);
                    results.push({ enrollmentId: s.enrollmentId, status: "created" });
                } catch (err: any) {
                    results.push({ enrollmentId: s.enrollmentId, status: "failed", error: err.message });
                }
            }

            const created = results.filter(r => r.status === "created").length;
            const failed  = results.filter(r => r.status === "failed").length;

            return NextResponse.json(
                { message: `${created} timetable create hue${failed ? `, ${failed} failed` : ""}`, results },
                { status: 201 }
            );
        }

        // ── SINGLE ──
        if (!enrollmentId || !studentId)
            return NextResponse.json({ message: "enrollmentId aur studentId required hain" }, { status: 400 });

        await Timetable.updateMany({ enrollment: enrollmentId }, { isActive: false });

        const timetable = await Timetable.create({
            course: courseId, enrollment: enrollmentId, student: studentId,
            slots, validFrom: validFrom ?? new Date(), validTo: validTo ?? null, isActive: true,
        });

        fireEmail(studentId, courseName ?? "Your Course", slots);

        return NextResponse.json({ message: "Timetable created", timetable }, { status: 201 });

    } catch (e: any) { return handleError(e, "POST /api/admin/timetable"); }
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { timetableId, slots, validTo } = await req.json();
        if (!timetableId || !slots?.length)
            return NextResponse.json({ message: "timetableId aur slots required hain" }, { status: 400 });

        const tt = await Timetable.findByIdAndUpdate(
            timetableId,
            { slots, ...(validTo && { validTo }) },
            { new: true }
        ).populate("student", "name studentId").lean() as any;

        if (!tt)
            return NextResponse.json({ message: "Timetable not found" }, { status: 404 });

        fireEmail(tt.student?._id?.toString(), (tt.course as any)?.name ?? "Your Course", slots);

        return NextResponse.json({ message: "Timetable updated", timetable: tt });
    } catch (e: any) { return handleError(e, "PATCH /api/admin/timetable"); }
}