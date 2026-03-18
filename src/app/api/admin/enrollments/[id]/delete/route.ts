import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { verifyUser } from "@/lib/verifyUser";

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const user: any = await verifyUser();
    if (user.role !== "admin")
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const { id } = await context.params;

    await Enrollment.findByIdAndDelete(id, {
        isActive: false
    });

    return NextResponse.json({
        message: "Enrollment removed"
    });

}