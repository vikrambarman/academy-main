// src/app/api/teacher/me/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Teacher from "@/models/Teacher";

export async function GET() {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const teacher = await Teacher.findOne({ user: user._id })
            .select("name employeeId phone")
            .lean();

        return NextResponse.json({ teacher });
    } catch (e) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}