import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";

export async function POST(req: NextRequest) {

    await connectDB();

    const body = await req.json();

    const { studentId, courseId, feesTotal } = body;

    if (!studentId || !courseId) {
        return NextResponse.json(
            { message: "Student and course required" },
            { status: 400 }
        );
    }

    /* prevent duplicate enrollment */

    const existing = await Enrollment.findOne({
        student: studentId,
        course: courseId,
        isActive: true
    });

    if (existing) {
        return NextResponse.json(
            { message: "Student already enrolled in this course" },
            { status: 400 }
        );
    }

    const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        feesTotal
    });

    return NextResponse.json({
        message: "Enrollment created",
        enrollment
    });

}