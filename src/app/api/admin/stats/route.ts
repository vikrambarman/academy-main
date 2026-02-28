import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { verifyUser } from "@/lib/verifyUser";
import Student from "@/models/Student";

export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ isActive: true });
        const totalStudents = await Student.countDocuments();

        return NextResponse.json({
            totalCourses,
            activeCourses,
            totalStudents,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}