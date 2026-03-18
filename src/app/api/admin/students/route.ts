import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Student from "@/models/Student";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";

import { sendStudentWelcomeEmail } from "@/lib/mail";
import { generateStudentId } from "@/lib/generateStudentId";

function generateTempPassword(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    let pw = "";
    for (let i = 0; i < length; i++)
        pw += chars.charAt(Math.floor(Math.random() * chars.length));
    return pw;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        let {
            name, fatherName, email, phone, dob, gender,
            address, qualification, admissionDate,
            courseId, feesTotal,
            // NEW optional franchise fields
            franchiseId, certTypeId, externalStudentId, externalPassword,
        } = body;

        if (!name || !email || !courseId)
            return NextResponse.json(
                { message: "Name, Email and Course are required" },
                { status: 400 }
            );

        email = email.toLowerCase().trim();

        if (!mongoose.Types.ObjectId.isValid(courseId))
            return NextResponse.json({ message: "Invalid Course ID" }, { status: 400 });

        const course = await Course.findById(courseId);
        if (!course || !course.isActive)
            return NextResponse.json({ message: "Invalid or inactive course" }, { status: 400 });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });

        // ── Franchise config lookup (optional) ──────────────────────────
        let resolvedFeesTotal = Number(feesTotal) || 0;
        let resolvedFranchiseId = franchiseId || null;
        let resolvedCertTypeId = certTypeId || null;
        let resolvedConfigId = null;
        let franchiseFeeNote = null;

        if (franchiseId && mongoose.Types.ObjectId.isValid(franchiseId)) {
            const config = await CourseFranchiseConfig.findOne({
                course: courseId,
                franchise: franchiseId,
                isActive: true,
            }).populate("defaultCertType");

            if (config) {
                if (!feesTotal || Number(feesTotal) === 0) {
                    resolvedFeesTotal = config.feeStructure.total;
                }
                if (!certTypeId) {
                    resolvedCertTypeId = (config.defaultCertType as any)?._id?.toString() || null;
                }
                resolvedConfigId = config._id.toString();
                franchiseFeeNote = `Franchise: ${franchiseId}`;
            }
        }

        const studentId = await generateStudentId();
        const tempPassword = generateTempPassword(8);
        const hashedPw = await bcrypt.hash(tempPassword, 10);

        const newUser = await User.create({
            academyId: studentId,
            name, email,
            password: hashedPw,
            role: "student",
            courseId,
            isFirstLogin: true,
        });

        try {
            const student = await Student.create({
                studentId, name, fatherName, email, phone,
                dob, gender, address, qualification, admissionDate,
                courseStatus: "active",
                user: newUser._id,
                externalStudentId,
                externalPassword,
            });

            await Enrollment.create({
                student: student._id,
                course: courseId,
                admissionDate: admissionDate || new Date(),
                feesTotal: resolvedFeesTotal,
                franchise: resolvedFranchiseId,
                certType: resolvedCertTypeId,
                courseFranchiseConfig: resolvedConfigId,
                externalStudentId: externalStudentId || null,
                externalPassword: externalPassword || null,
                franchiseFeeNote,
            });

        } catch (err) {
            await User.findByIdAndDelete(newUser._id);
            throw err;
        }

        try {
            await sendStudentWelcomeEmail(email, { name, studentId, tempPassword });
        } catch (err) {
            console.error("Email failed:", err);
        }

        return NextResponse.json(
            { message: "Student created successfully", data: { studentId, tempPassword } },
            { status: 201 }
        );

    } catch (error) {
        console.error("CREATE STUDENT ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const students = await Student.find()
            .populate("user")
            .sort({ createdAt: -1 });

        const studentIds = students.map(s => s._id);

        const enrollments = await Enrollment
            .find({ student: { $in: studentIds }, isActive: true })
            .populate("course")
            .populate("franchise")
            .populate("certType");

        const enrollmentsMap: any = {};
        enrollments.forEach((e: any) => {
            const key = e.student.toString();
            if (!enrollmentsMap[key]) enrollmentsMap[key] = [];
            enrollmentsMap[key].push(e);
        });

        const result = students.map((student) => {
            const obj = student.toObject();
            return {
                ...obj,
                courseStatus: obj.courseStatus || "active",
                enrollments: enrollmentsMap[student._id.toString()] || [],
            };
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}