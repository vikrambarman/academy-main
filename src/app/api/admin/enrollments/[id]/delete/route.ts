import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {

    await connectDB();

    const { id } = await context.params;

    await Enrollment.findByIdAndDelete(id, {
        isActive: false
    });

    return NextResponse.json({
        message: "Enrollment removed"
    });

}