import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const courses = await Course.find({ isActive: true })
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            {
                success: true,
                data: courses,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Public Courses Fetch Error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}