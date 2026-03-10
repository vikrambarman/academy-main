// app/api/admin/timetable/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Timetable from "@/models/Timetable";
import Student from "@/models/Student";
import User from "@/models/User";
import { sendTimetableEmail } from "@/lib/mail";

// GET /api/admin/timetable?enrollmentId=xxx  OR  ?courseId=xxx
export async function GET(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const enrollmentId = searchParams.get("enrollmentId");
        const courseId     = searchParams.get("courseId");

        const query: any = {};
        if (enrollmentId) query.enrollment = enrollmentId;
        if (courseId)     query.course     = courseId;

        const timetables = await Timetable.find(query)
            .populate("course",  "name authority")
            .populate("student", "name studentId")
            .lean();

        return NextResponse.json({ timetables });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// Helper: student ka email fetch karo (Student → User)
async function getStudentEmail(studentId: string): Promise<{ email: string; name: string; sid: string } | null> {
    try {
        const student = await Student.findById(studentId).populate("user", "email").lean() as any;
        if (!student) return null;
        return {
            email: student.user?.email ?? "",
            name:  student.name        ?? "Student",
            sid:   student.studentId   ?? "",
        };
    } catch {
        return null;
    }
}

// POST — create timetable (single OR bulk)
// Single: { courseId, enrollmentId, studentId, slots[], validFrom?, validTo? }
// Bulk:   { courseId, bulk: true, students: [{enrollmentId, studentId}][], slots[], validFrom?, validTo? }
export async function POST(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const body = await req.json();
        const { courseId, slots, validFrom, validTo, bulk, students, enrollmentId, studentId, courseName } = body;

        if (!courseId || !slots?.length) {
            return NextResponse.json({ message: "courseId aur slots required hain" }, { status: 400 });
        }

        // ── BULK MODE ──────────────────────────────────────
        if (bulk) {
            if (!students?.length) {
                return NextResponse.json({ message: "Bulk mode mein students array required hai" }, { status: 400 });
            }

            const results: { enrollmentId: string; status: string; error?: string }[] = [];

            for (const s of students as { enrollmentId: string; studentId: string }[]) {
                try {
                    await Timetable.updateMany({ enrollment: s.enrollmentId }, { isActive: false });

                    await Timetable.create({
                        course:     courseId,
                        enrollment: s.enrollmentId,
                        student:    s.studentId,
                        slots,
                        validFrom:  validFrom ?? new Date(),
                        validTo:    validTo   ?? null,
                        isActive:   true,
                    });

                    // Email send karo (fire and forget)
                    getStudentEmail(s.studentId).then(info => {
                        if (info?.email) {
                            sendTimetableEmail(info.email, {
                                name:       info.name,
                                studentId:  info.sid,
                                courseName: courseName ?? "Your Course",
                                slots,
                            }).catch(err => console.error("Timetable email error:", err));
                        }
                    });

                    results.push({ enrollmentId: s.enrollmentId, status: "created" });
                } catch (err: any) {
                    results.push({ enrollmentId: s.enrollmentId, status: "failed", error: err.message });
                }
            }

            const failed  = results.filter(r => r.status === "failed").length;
            const created = results.filter(r => r.status === "created").length;

            return NextResponse.json({
                message: `${created} timetable create hue, ${failed} failed`,
                results,
            }, { status: 201 });
        }

        // ── SINGLE MODE ────────────────────────────────────
        if (!enrollmentId || !studentId) {
            return NextResponse.json({ message: "enrollmentId aur studentId required hain" }, { status: 400 });
        }

        await Timetable.updateMany({ enrollment: enrollmentId }, { isActive: false });

        const timetable = await Timetable.create({
            course:     courseId,
            enrollment: enrollmentId,
            student:    studentId,
            slots,
            validFrom:  validFrom ?? new Date(),
            validTo:    validTo   ?? null,
            isActive:   true,
        });

        // Email send karo (fire and forget)
        getStudentEmail(studentId).then(info => {
            if (info?.email) {
                sendTimetableEmail(info.email, {
                    name:       info.name,
                    studentId:  info.sid,
                    courseName: courseName ?? "Your Course",
                    slots,
                }).catch(err => console.error("Timetable email error:", err));
            }
        });

        return NextResponse.json({ message: "Timetable created", timetable }, { status: 201 });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PATCH — update slots of existing timetable
// Body: { timetableId, slots[], validTo? }
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { timetableId, slots, validTo } = await req.json();
        if (!timetableId || !slots?.length) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const tt = await Timetable.findByIdAndUpdate(
            timetableId,
            { slots, ...(validTo && { validTo }) },
            { new: true }
        ).populate("student", "name studentId").lean() as any;

        if (!tt) return NextResponse.json({ message: "Timetable not found" }, { status: 404 });

        // Email on update bhi bhejo
        getStudentEmail(tt.student?._id?.toString()).then(info => {
            if (info?.email) {
                sendTimetableEmail(info.email, {
                    name:       info.name,
                    studentId:  info.sid,
                    courseName: (tt.course as any)?.name ?? "Your Course",
                    slots,
                }).catch(err => console.error("Timetable update email error:", err));
            }
        });

        return NextResponse.json({ message: "Updated", timetable: tt });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}