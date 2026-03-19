/**
 * PATCH  /api/admin/enquiry/[id]
 * DELETE /api/admin/enquiry/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enquiry from "@/models/Enquiry";

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

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        await requireAdmin();

        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

        const body = await req.json();
        const updated = await Enquiry.findByIdAndUpdate(id, body, { new: true }).lean();
        if (!updated)
            return NextResponse.json({ message: "Enquiry not found" }, { status: 404 });

        return NextResponse.json({ data: updated });
    } catch (e: any) { return handleError(e, "PATCH /api/admin/enquiry/[id]"); }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        await requireAdmin();

        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

        const enquiry = await Enquiry.findById(id);
        if (!enquiry)
            return NextResponse.json({ message: "Enquiry not found" }, { status: 404 });

        enquiry.isActive = false;
        await enquiry.save();
        return NextResponse.json({ message: "Enquiry deleted" });
    } catch (e: any) { return handleError(e, "DELETE /api/admin/enquiry/[id]"); }
}