/**
 * POST /api/admin/students  — Naya student create karo
 * GET  /api/admin/students  — Sabhi students list with enrollments
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Course from "@/models/Course";
import Student from "@/models/Student";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import { sendStudentWelcomeEmail } from "@/lib/mail";
import { generateStudentId } from "@/lib/generateStudentId";
import "@/models/Franchise";
import "@/models/CertificateType";

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

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const body = await req.json();
        let {
            name, fatherName, email, phone, dob, gender,
            address, qualification, admissionDate,
            courseId, feesTotal,
            franchiseId, certTypeId, externalStudentId, externalPassword,
        } = body;

        // ── Required field validation ──
        if (!name?.trim() || !email?.trim() || !courseId)
            return NextResponse.json(
                { message: "Name, Email aur Course required hain" },
                { status: 400 }
            );

        if (!mongoose.Types.ObjectId.isValid(courseId))
            return NextResponse.json({ message: "Invalid Course ID" }, { status: 400 });

        email = email.toLowerCase().trim();

        // ── Course must exist and be active ──
        const course = await Course.findById(courseId).lean();
        if (!course || !(course as any).isActive)
            return NextResponse.json({ message: "Invalid ya inactive course" }, { status: 400 });

        // ── Email uniqueness check ──
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser)
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });

        // ── Optional: resolve franchise config ──
        let resolvedFeesTotal = Number(feesTotal) || 0;
        let resolvedFranchiseId = franchiseId || null;
        let resolvedCertTypeId = certTypeId || null;
        let resolvedConfigId = null;

        if (franchiseId && mongoose.Types.ObjectId.isValid(franchiseId)) {
            const config = await CourseFranchiseConfig.findOne({
                course: courseId,
                franchise: franchiseId,
            }).populate("defaultCertType").lean();

            if (config) {
                if (!feesTotal || Number(feesTotal) === 0)
                    resolvedFeesTotal = (config as any).feeStructure.total;
                if (!certTypeId)
                    resolvedCertTypeId = (config as any).defaultCertType?._id?.toString() || null;
                resolvedConfigId = (config as any)._id.toString();
            }
        }

        // ── Create User account ──
        const studentId = await generateStudentId();
        const tempPw = generateTempPassword();
        const hashedPw = await bcrypt.hash(tempPw, 10);

        const newUser = await User.create({
            academyId: studentId, name, email,
            password: hashedPw, role: "student",
            courseId, isFirstLogin: true,
        });

        // ── Create Student + Enrollment (rollback user if either fails) ──
        try {
            const student = await Student.create({
                studentId, name, fatherName, email, phone,
                dob, gender, address, qualification, admissionDate,
                courseStatus: "active",
                user: newUser._id,
                externalStudentId, externalPassword,
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
            });

        } catch (err) {
            await User.findByIdAndDelete(newUser._id);
            throw err;
        }

        // ── Welcome email (fire and forget) ──
        sendStudentWelcomeEmail(email, { name, studentId, tempPassword: tempPw })
            .catch(err => console.error("[WELCOME EMAIL]", err));

        return NextResponse.json(
            { message: "Student successfully create hua", data: { studentId, tempPassword: tempPw } },
            { status: 201 }
        );

    } catch (error: any) {
        return handleError(error, "POST /api/admin/students");
    }
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET() {
    try {
        await connectDB();
        await requireAdmin();

        const students = await Student.find()
            .populate("user", "email isActive isFirstLogin")
            .sort({ createdAt: -1 })
            .lean();

        const studentIds = students.map((s: any) => s._id);

        const enrollments = await Enrollment.find({
            student: { $in: studentIds },
            isActive: true,
        })
            .populate("course", "name level")
            .populate("franchise", "name code isOwn")
            .populate("certType", "name code issuingBody")
            .lean();

        // O(1) lookup — group enrollments by student ID
        const enrollByStudent: Record<string, any[]> = {};
        enrollments.forEach((e: any) => {
            const key = e.student.toString();
            if (!enrollByStudent[key]) enrollByStudent[key] = [];
            enrollByStudent[key].push(e);
        });

        const result = students.map((s: any) => ({
            ...s,
            courseStatus: s.courseStatus || "active",
            enrollments: enrollByStudent[s._id.toString()] || [],
        }));

        return NextResponse.json(result);

    } catch (error: any) {
        return handleError(error, "GET /api/admin/students");
    }
}