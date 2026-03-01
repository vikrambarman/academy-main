import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Student from "@/models/Student";
import User from "@/models/User";

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

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            name,
            email,
            phone,
            courseId,
            feesTotal,
            externalStudentId,
            externalPassword,
        } = body;

        // Validate required fields
        if (!name || !email || !courseId) {
            return NextResponse.json(
                { message: "Name, Email and Course are required" },
                { status: 400 }
            );
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json(
                { message: "Invalid Course ID format" },
                { status: 400 }
            );
        }

        // Check course
        const course = await Course.findById(courseId);
        if (!course || !course.isActive) {
            return NextResponse.json(
                { message: "Invalid or inactive course" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        // Generate Student ID
        const studentId = await Student.generateStudentId();

        // Generate Temp Password
        const tempPassword = generateTempPassword(8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create User (Auth Layer)
        const newUser = await User.create({
            academyId: studentId,
            name,
            email,
            password: hashedPassword,
            role: "student",
            courseId,
        });

        // Create Student (Academic Layer)
        await Student.create({
            studentId,
            name,
            email,
            phone,
            user: newUser._id,
            course: courseId,
            externalStudentId,
            externalPassword,
            feesTotal,
        });

        return NextResponse.json(
            {
                message: "Student created successfully",
                data: {
                    studentId,
                    tempPassword,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}