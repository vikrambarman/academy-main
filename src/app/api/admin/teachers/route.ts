/**
 * GET    /api/admin/teachers  — Sabhi teachers list
 * POST   /api/admin/teachers  — Naya teacher create
 * PATCH  /api/admin/teachers  — Update name/phone/password/isActive
 * DELETE /api/admin/teachers  — Teacher delete
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt                        from "bcryptjs";

import { connectDB }  from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Teacher        from "@/models/Teacher";
import User           from "@/models/User";

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

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET() {
    try {
        await connectDB();
        await requireAdmin();

        const teachers = await Teacher.find()
            .populate("user", "email academyId isActive isFirstLogin")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ teachers });

    } catch (error: any) {
        return handleError(error, "GET /api/admin/teachers");
    }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { name, email, phone, password } = await req.json();

        // ── Validate required fields ──
        if (!name?.trim() || !email?.trim() || !password)
            return NextResponse.json(
                { message: "Name, email aur password required hain" },
                { status: 400 }
            );

        // ── Email uniqueness check ──
        const existing = await User.findOne({ email: email.toLowerCase().trim() }).lean();
        if (existing)
            return NextResponse.json({ message: "Yeh email already registered hai" }, { status: 400 });

        // ── Generate employeeId: SCA-TCH-001, SCA-TCH-002… ──
        const count      = await Teacher.countDocuments();
        const employeeId = `SCA-TCH-${String(count + 1).padStart(3, "0")}`;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            academyId:    employeeId,
            name,
            email:        email.toLowerCase().trim(),
            password:     hashedPassword,
            role:         "teacher",
            isActive:     true,
            isFirstLogin: true,
        });

        const teacher = await Teacher.create({
            user:       newUser._id,
            name,
            employeeId,
            phone,
        });

        return NextResponse.json(
            { message: "Teacher create ho gaya", teacher: { ...teacher.toObject(), email, employeeId } },
            { status: 201 }
        );

    } catch (error: any) {
        return handleError(error, "POST /api/admin/teachers");
    }
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { teacherId, name, phone, password, isActive } = await req.json();

        if (!teacherId)
            return NextResponse.json({ message: "teacherId required" }, { status: 400 });

        const teacher = await Teacher.findById(teacherId).populate("user");
        if (!teacher)
            return NextResponse.json({ message: "Teacher nahi mila" }, { status: 404 });

        const linkedUser = teacher.user as any;

        // ── Name + phone update ──
        if (name !== undefined) {
            teacher.name    = name;
            linkedUser.name = name;
        }
        if (phone !== undefined) teacher.phone = phone;

        // ── Password reset ──
        if (password !== undefined) {
            linkedUser.password     = await bcrypt.hash(password, 10);
            linkedUser.isFirstLogin = true;
        }

        // ── Toggle active ──
        if (isActive !== undefined) {
            teacher.isActive    = isActive;
            linkedUser.isActive = isActive;
        }

        await teacher.save();
        await linkedUser.save();

        return NextResponse.json({ message: "Teacher update ho gaya" });

    } catch (error: any) {
        return handleError(error, "PATCH /api/admin/teachers");
    }
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const teacherId = searchParams.get("id");

        if (!teacherId)
            return NextResponse.json({ message: "id required" }, { status: 400 });

        const teacher = await Teacher.findById(teacherId).lean();
        if (!teacher)
            return NextResponse.json({ message: "Teacher nahi mila" }, { status: 404 });

        // Delete linked user account + teacher record
        await User.findByIdAndDelete((teacher as any).user);
        await Teacher.findByIdAndDelete(teacherId);

        return NextResponse.json({ message: "Teacher delete ho gaya" });

    } catch (error: any) {
        return handleError(error, "DELETE /api/admin/teachers");
    }
}