import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enquiry from "@/models/Enquiry";

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
                { message: "Invalid ID" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const updated = await Enquiry.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        return NextResponse.json({ data: updated });

    } catch (error) {
        console.error("ADMIN UPDATE ENQUIRY ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}