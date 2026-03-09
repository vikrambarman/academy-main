// app/api/student/timetable/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Timetable from "@/models/Timetable";
import Student from "@/models/Student";
import "@/models/Course";

export async function GET() {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "student") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const student = await Student.findOne({ user: user._id }).lean();
        if (!student) return NextResponse.json({ message: "Student not found" }, { status: 404 });
        if (!student.isActive) return NextResponse.json({ message: "Account deactivated" }, { status: 403 });

        const timetables = await Timetable.find({
            student:  student._id,
            isActive: true,
        })
            .populate("course", "name authority duration")
            .lean();

        return NextResponse.json({ timetables });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}