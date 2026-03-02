import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendStudentWelcomeEmail } from "@/lib/mail";

function generateTempPassword(length = 8) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return password;
}

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }   // ✅ Next.js 16 style
) {
    try {
        await connectDB();

        const { id } = await context.params;

        // 🔐 Verify Admin from accessToken cookie
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded: any = jwt.verify(
            accessToken,
            process.env.JWT_SECRET!
        );

        if (decoded.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        // 🔍 Find Student User
        const studentUser = await User.findById(id);

        if (!studentUser || studentUser.role !== "student") {
            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            );
        }

        if (!studentUser.isActive) {
            return NextResponse.json(
                { message: "Student account is inactive" },
                { status: 400 }
            );
        }

        // 🔥 Generate New Temporary Password
        const tempPassword = generateTempPassword(8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        studentUser.password = hashedPassword;
        studentUser.isFirstLogin = true;   // Force password change
        await studentUser.save();

        // 📧 Send Email to Student
        await sendStudentWelcomeEmail(studentUser.email, {
            name: studentUser.name,
            studentId: studentUser.academyId,
            tempPassword,
        });

        return NextResponse.json({
            message: "Student password reset successfully",
        });

    } catch (error) {
        console.error("ADMIN RESET PASSWORD ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}