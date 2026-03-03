import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

export async function GET() {
    try {
        await connectDB();

        const notices = await Notice.find({
            isActive: true,
            isPublished: true,
        })
            .sort({ createdAt: -1 })
            .select("-content");

        return NextResponse.json({ data: notices });

    } catch (error) {
        console.error("GET NOTICES ERROR:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}