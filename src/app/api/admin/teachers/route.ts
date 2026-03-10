// src/app/api/admin/teachers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Teacher from "@/models/Teacher";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// GET — list all teachers
export async function GET() {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const teachers = await Teacher.find()
            .populate("user", "email academyId isActive isFirstLogin")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ teachers });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST — create teacher
// Body: { name, email, phone?, password }
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { name, email, phone, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Name, email aur password required hain" }, { status: 400 });
        }

        // Check duplicate email
        const existing = await User.findOne({ email });
        if (existing) return NextResponse.json({ message: "Yeh email already registered hai" }, { status: 400 });

        // Generate employeeId: TCH-001, TCH-002 ...
        const count     = await Teacher.countDocuments();
        const employeeId = `TCH-${String(count + 1).padStart(3, "0")}`;

        // academyId same as employeeId for teachers
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            academyId:   employeeId,
            name,
            email,
            password:    hashedPassword,
            role:        "teacher",
            isActive:    true,
            isFirstLogin: true,
        });

        const teacher = await Teacher.create({
            user:       newUser._id,
            name,
            employeeId,
            phone,
        });

        return NextResponse.json({
            message: "Teacher create ho gaya",
            teacher: { ...teacher.toObject(), email, employeeId },
        }, { status: 201 });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PATCH — update teacher (reset password / toggle active)
// Body: { teacherId, password? } OR { teacherId, isActive }
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { teacherId, password, isActive, name, phone } = await req.json();
        if (!teacherId) return NextResponse.json({ message: "teacherId required" }, { status: 400 });

        const teacher = await Teacher.findById(teacherId).populate("user");
        if (!teacher) return NextResponse.json({ message: "Teacher nahi mila" }, { status: 404 });

        const linkedUser = teacher.user as any;

        // Update name & phone
        if (name !== undefined) {
            teacher.name     = name;
            linkedUser.name  = name;
        }
        if (phone !== undefined) {
            teacher.phone = phone;
        }

        // Reset password
        if (password !== undefined) {
            linkedUser.password     = await bcrypt.hash(password, 10);
            linkedUser.isFirstLogin = true;
        }

        // Toggle active
        if (isActive !== undefined) {
            teacher.isActive    = isActive;
            linkedUser.isActive = isActive;
        }

        await teacher.save();
        await linkedUser.save();

        return NextResponse.json({ message: "Teacher update ho gaya" });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// DELETE — remove teacher
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const teacherId = searchParams.get("id");
        if (!teacherId) return NextResponse.json({ message: "id required" }, { status: 400 });

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return NextResponse.json({ message: "Teacher nahi mila" }, { status: 404 });

        await User.findByIdAndDelete(teacher.user);
        await Teacher.findByIdAndDelete(teacherId);

        return NextResponse.json({ message: "Teacher delete ho gaya" });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}