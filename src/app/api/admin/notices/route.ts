import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Notice from "@/models/Notice";

export async function GET() {
    try {
        await connectDB();

        const admin: any = await verifyUser();
        if (admin.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const notices = await Notice.find()
            .sort({ createdAt: -1 });

        return NextResponse.json({ data: notices });

    } catch (error) {
        console.error("ADMIN GET NOTICES ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const admin: any = await verifyUser();
        if (admin.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { title, slug, excerpt, content, category } = body;

        if (!title || !slug || !excerpt || !content) {
            return NextResponse.json(
                { message: "Required fields missing" },
                { status: 400 }
            );
        }

        const existing = await Notice.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { message: "Slug already exists" },
                { status: 400 }
            );
        }

        const notice = await Notice.create({
            title,
            slug,
            excerpt,
            content,
            category,
        });

        return NextResponse.json({ data: notice }, { status: 201 });

    } catch (error) {
        console.error("ADMIN CREATE NOTICE ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}