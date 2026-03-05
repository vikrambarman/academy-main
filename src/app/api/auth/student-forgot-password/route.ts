import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import { sendStudentPasswordResetEmail } from "@/lib/mail";

/**
 * Student Forgot Password
 * Sends new temporary password to email
 */

export async function POST(req: Request) {

    try {

        await connectDB();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            email,
            role: "student",
        });

        if (!user) {
            return NextResponse.json(
                { message: "Student account not found" },
                { status: 404 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { message: "Account is disabled" },
                { status: 403 }
            );
        }

        // 🔐 Generate temp password
        const tempPassword =
            Math.random().toString(36).slice(-8) +
            Math.floor(Math.random() * 10);

        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        user.password = hashedPassword;
        user.isFirstLogin = true;

        await user.save();

        // get studentId
        const student = await Student.findOne({ user: user._id });

        const studentId = student?.studentId || user.academyId;

        // send email
        await sendStudentPasswordResetEmail(user.email, {
            name: user.name,
            studentId,
            tempPassword,
        });

        return NextResponse.json({
            message:
                "Temporary password sent to your registered email",
        });

    } catch (error) {

        console.error("FORGOT PASSWORD ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );

    }

}