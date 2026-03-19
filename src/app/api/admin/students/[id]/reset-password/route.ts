/**
 * PATCH /api/admin/students/[id]/reset-password
 * Student ka password reset karo aur welcome email bhejo
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import User from "@/models/User";
import { sendStudentWelcomeEmail } from "@/lib/mail";

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

// ── Util ──────────────────────────────────────────────────────────────────────

function generateTempPassword(length = 8): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    let pw = "";
    for (let i = 0; i < length; i++)
        pw += chars.charAt(Math.floor(Math.random() * chars.length));
    return pw;
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        await requireAdmin();

        const { id } = await context.params;

        // id = User._id (not Student._id)
        const studentUser = await User.findById(id);
        if (!studentUser || studentUser.role !== "student")
            return NextResponse.json({ message: "Student not found" }, { status: 404 });

        if (!studentUser.isActive)
            return NextResponse.json({ message: "Student account inactive hai" }, { status: 400 });

        // ── Generate new temp password ──
        const tempPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        studentUser.password = hashedPassword;
        studentUser.isFirstLogin = true; // Force password change on next login
        await studentUser.save();

        // ── Send reset email (fire and forget) ──
        sendStudentWelcomeEmail(studentUser.email, {
            name: studentUser.name,
            studentId: studentUser.academyId,
            tempPassword,
        }).catch(err => console.error("[RESET PASSWORD EMAIL]", err));

        return NextResponse.json({ message: "Password reset successfully" });

    } catch (error: any) {
        return handleError(error, "PATCH /api/admin/students/[id]/reset-password");
    }
}