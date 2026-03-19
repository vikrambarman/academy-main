/**
 * DELETE /api/admin/enrollments/[id]/delete
 * Enrollment soft-delete (isActive = false)
 */

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";

// ── Auth helper ───────────────────────────────────────────────────────────────

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

// ── Error helper ──────────────────────────────────────────────────────────────

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message))
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        await requireAdmin();

        const { id } = await context.params;

        const enrollment = await Enrollment.findById(id);
        if (!enrollment)
            return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });

        // Soft delete — isActive false karo, data preserve rehta hai
        enrollment.isActive = false;
        await enrollment.save();

        return NextResponse.json({ message: "Enrollment removed" });

    } catch (error: any) {
        return handleError(error, "DELETE /api/admin/enrollments/[id]/delete");
    }
}