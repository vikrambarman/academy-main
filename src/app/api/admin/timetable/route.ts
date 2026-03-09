// app/api/admin/timetable/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Timetable from "@/models/Timetable";

// GET /api/admin/timetable?enrollmentId=xxx  OR  ?courseId=xxx
export async function GET(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const enrollmentId = searchParams.get("enrollmentId");
        const courseId = searchParams.get("courseId");

        const query: any = {};
        if (enrollmentId) query.enrollment = enrollmentId;
        if (courseId) query.course = courseId;

        const timetables = await Timetable.find(query)
            .populate("course", "name authority")
            .populate("student", "name studentId")
            .lean();

        return NextResponse.json({ timetables });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST — create timetable
// Body: { courseId, enrollmentId, studentId, slots[], validFrom, validTo }
export async function POST(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const body = await req.json();
        const { courseId, enrollmentId, studentId, slots, validFrom, validTo } = body;

        if (!courseId || !enrollmentId || !studentId || !slots?.length) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Deactivate old timetables for this enrollment
        await Timetable.updateMany(
            { enrollment: enrollmentId },
            { isActive: false }
        );

        const timetable = await Timetable.create({
            course: courseId, enrollment: enrollmentId,
            student: studentId, slots,
            validFrom: validFrom ?? new Date(),
            validTo: validTo ?? null,
            isActive: true,
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
        );

        if (!tt) return NextResponse.json({ message: "Timetable not found" }, { status: 404 });

        return NextResponse.json({ message: "Updated", timetable: tt });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}