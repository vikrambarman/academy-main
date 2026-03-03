import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import NoticeRead from "@/models/NoticeRead";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const user: any = await verifyUser();

        if (!user || user.role !== "student") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const { id } = await params;

        await NoticeRead.create({
            notice: id,
            student: user._id,
        });

        return NextResponse.json({ message: "Marked as read" });

    } catch (error) {
        console.error("MARK READ ERROR:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}