import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Student from "@/models/Student";
import User from "@/models/User";

import { sendStudentWelcomeEmail } from "@/lib/mail";

/* =========================================================
   TEMP PASSWORD GENERATOR
========================================================= */

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

/* =========================================================
   CREATE STUDENT
========================================================= */

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        let {
            name,
            fatherName,
            email,
            phone,
            dob,
            gender,
            address,
            qualification,
            admissionDate,
            courseId,
            feesTotal,
            externalStudentId,
            externalPassword,
        } = body;

        /* ================= VALIDATION ================= */

        if (!name || !email || !courseId) {
            return NextResponse.json(
                { message: "Name, Email and Course are required" },
                { status: 400 }
            );
        }

        email = email.toLowerCase().trim();

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json(
                { message: "Invalid Course ID format" },
                { status: 400 }
            );
        }

        /* ================= CHECK COURSE ================= */

        const course = await Course.findById(courseId);

        if (!course || !course.isActive) {
            return NextResponse.json(
                { message: "Invalid or inactive course" },
                { status: 400 }
            );
        }

        /* ================= CHECK EMAIL ================= */

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        /* ================= GENERATE STUDENT ID ================= */

        const studentId = await Student.generateStudentId();

        /* ================= CREATE TEMP PASSWORD ================= */

        const tempPassword = generateTempPassword(8);

        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        /* ================= CREATE USER ================= */

        const newUser = await User.create({
            academyId: studentId,
            name,
            email,
            password: hashedPassword,
            role: "student",
            courseId,
            isFirstLogin: true,
        });

        /* ================= CREATE STUDENT ================= */

        try {
            await Student.create({
                studentId,
                name,
                fatherName,
                email,
                phone,
                dob,
                gender,
                address,
                qualification,
                admissionDate,
                user: newUser._id,
                course: courseId,
                externalStudentId,
                externalPassword,
                feesTotal,
            });
        } catch (studentError) {
            /**
             * Manual rollback
             * If student creation fails → delete created user
             */
            await User.findByIdAndDelete(newUser._id);
            throw studentError;
        }

        /* ================= SEND WELCOME EMAIL ================= */

        await sendStudentWelcomeEmail(email, {
            name,
            studentId,
            tempPassword,
        });

        /* ================= RESPONSE ================= */

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

        console.error("CREATE STUDENT ERROR:", error);

        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}

/* =========================================================
   GET STUDENTS
========================================================= */

export async function GET(req: NextRequest) {
    try {

        await connectDB();

        const students = await Student.find()
            .populate({
                path: "course",
                select: "name",
            })
            .sort({ createdAt: -1 });

        return NextResponse.json(students);

    } catch (error) {

        console.error("GET STUDENTS ERROR:", error);

        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}