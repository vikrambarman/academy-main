import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Notice from "@/models/Notice";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const admin: any = await verifyUser();
        if (admin.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid ID format" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const updated = await Notice.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        return NextResponse.json({ data: updated });

    } catch (error) {
        console.error("ADMIN UPDATE NOTICE ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const admin: any = await verifyUser();
        if (admin.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;

        await Notice.findByIdAndUpdate(id, { isActive: false });

        return NextResponse.json({ message: "Notice deleted" });

    } catch (error) {
        console.error("ADMIN DELETE NOTICE ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}