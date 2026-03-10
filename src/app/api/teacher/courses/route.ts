// src/app/api/teacher/courses/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Course from "@/models/Course";

export async function GET() {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const courses = await Course.find({ isActive: true })
            .select("_id name slug duration fees")
            .sort({ name: 1 })
            .lean();

        return NextResponse.json({ courses });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}