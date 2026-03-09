// app/api/student/attendance/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import "@/models/Course";

export async function GET() {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (!user || user.role !== "student") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const student = await Student.findOne({ user: user._id }).lean();
        if (!student) return NextResponse.json({ message: "Student not found" }, { status: 404 });
        if (!student.isActive) return NextResponse.json({ message: "Account deactivated" }, { status: 403 });

        const attendanceList = await Attendance.find({ student: student._id })
            .populate("course", "name authority duration")
            .lean();

        // Calculate stats per enrollment
        const withStats = attendanceList.map(a => {
            const total    = a.records.length;
            const present  = a.records.filter(r => r.status === "present").length;
            const absent   = a.records.filter(r => r.status === "absent").length;
            const late     = a.records.filter(r => r.status === "late").length;
            const holiday  = a.records.filter(r => r.status === "holiday").length;
            const pct      = total > 0 ? Math.round(((present + late) / (total - holiday)) * 100) : 0;

            return { ...a, stats: { total, present, absent, late, holiday, percentage: pct } };
        });

        return NextResponse.json({ attendance: withStats });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}