// src/app/api/teacher/timetable/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Timetable from "@/models/Timetable";
import Enrollment from "@/models/Enrollment";

// GET ?courseId=xxx — all timetables for a course
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        const query: any = { isActive: true };
        if (courseId) query.course = courseId;

        const timetables = await Timetable.find(query)
            .populate("student", "name studentId")
            .populate("course", "name")
            .lean();

        return NextResponse.json({ timetables });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST — create timetable (same as admin)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { courseId, enrollmentId, studentId, slots, validFrom, validTo, bulk, students, courseName } = await req.json();

        if (!courseId || !slots?.length) return NextResponse.json({ message: "courseId aur slots required" }, { status: 400 });

        if (bulk) {
            if (!students?.length) return NextResponse.json({ message: "students array required" }, { status: 400 });
            const results = [];
            for (const s of students) {
                try {
                    await Timetable.updateMany({ enrollment: s.enrollmentId }, { isActive: false });
                    await Timetable.create({ course: courseId, enrollment: s.enrollmentId, student: s.studentId, slots, validFrom: validFrom ?? new Date(), validTo: validTo ?? null, isActive: true });
                    results.push({ enrollmentId: s.enrollmentId, status: "created" });
                } catch (err: any) {
                    results.push({ enrollmentId: s.enrollmentId, status: "failed", error: err.message });
                }
            }
            return NextResponse.json({ message: `${results.filter(r => r.status === "created").length} timetable create hue`, results }, { status: 201 });
        }

        if (!enrollmentId || !studentId) return NextResponse.json({ message: "enrollmentId aur studentId required" }, { status: 400 });
        await Timetable.updateMany({ enrollment: enrollmentId }, { isActive: false });
        const timetable = await Timetable.create({ course: courseId, enrollment: enrollmentId, student: studentId, slots, validFrom: validFrom ?? new Date(), validTo: validTo ?? null, isActive: true });

        return NextResponse.json({ message: "Timetable created", timetable }, { status: 201 });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PATCH — update slots
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { timetableId, slots, validTo } = await req.json();
        if (!timetableId || !slots?.length) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

        const tt = await Timetable.findByIdAndUpdate(timetableId, { slots, ...(validTo && { validTo }) }, { new: true });
        if (!tt) return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json({ message: "Updated", timetable: tt });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}