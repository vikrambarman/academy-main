import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;

        const notice = await Notice.findOne({
            slug,
            isActive: true,
            isPublished: true,
        });

        if (!notice) {
            return NextResponse.json(
                { message: "Notice not found" },
                { status: 404 }
            );
        }

        // Optional: increase views
        notice.views += 1;
        await notice.save();

        return NextResponse.json({ data: notice });

    } catch (error) {
        console.error("GET NOTICE ERROR:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}