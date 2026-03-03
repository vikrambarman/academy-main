import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Notice from "@/models/Notice";
import NoticeRead from "@/models/NoticeRead";

export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();

        if (!user || user.role !== "student") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const notices = await Notice.find({
            isActive: true,
            isPublished: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        const reads = await NoticeRead.find({
            student: user._id,
        }).select("notice");

        const readIds = reads.map((r) => r.notice.toString());

        const final = notices.map((notice) => ({
            ...notice,
            isRead: readIds.includes(notice._id.toString()),
        }));

        return NextResponse.json({ data: final });

    } catch (error) {
        console.error("STUDENT GET NOTICES ERROR:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}