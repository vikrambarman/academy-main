/**
 * GET  /api/admin/enquiry  — Sabhi enquiries
 * POST /api/admin/enquiry  — Admin se manual enquiry add karo (walk-in, phone, referral)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enquiry        from "@/models/Enquiry";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message))
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

export async function GET() {
    try {
        await connectDB();
        await requireAdmin();
        const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ data: enquiries });
    } catch (e: any) { return handleError(e, "GET /api/admin/enquiry"); }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { name, mobile, course, contactMethod, message, source } = await req.json();

        if (!name?.trim() || !mobile?.trim() || !course?.trim())
            return NextResponse.json(
                { message: "Name, mobile aur course required hain" },
                { status: 400 }
            );

        const enquiry = await Enquiry.create({
            name:          name.trim(),
            mobile:        mobile.trim(),
            course:        course.trim(),
            contactMethod: contactMethod || "Phone",
            message:       message?.trim() || "",
            source:        source || "walk-in",
            status:        "new",
            isActive:      true,
        });

        return NextResponse.json({ data: enquiry }, { status: 201 });
    } catch (e: any) { return handleError(e, "POST /api/admin/enquiry"); }
}