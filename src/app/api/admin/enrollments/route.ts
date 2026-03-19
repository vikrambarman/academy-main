/**
 * GET  /api/admin/enrollments  — Enrollments fetch karo (optional ?courseId filter)
 * POST /api/admin/enrollments  — Naya enrollment create karo
 */

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";
import "@/models/Course";
import "@/models/Student";
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

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        const query: any = { isActive: true };
        if (courseId) query.course = courseId;

        const enrollments = await Enrollment.find(query)
            .populate("student", "name studentId")
            .populate("course", "name level")
            .populate("franchise", "name code isOwn")
            .lean();

        return NextResponse.json({ enrollments });

    } catch (error: any) {
        return handleError(error, "GET /api/admin/enrollments");
    }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const body = await req.json();
        const { studentId, courseId, feesTotal, franchiseId, certTypeId } = body;

        // ── Validate required fields ──
        if (!studentId || !courseId)
            return NextResponse.json(
                { message: "Student aur Course required hain" },
                { status: 400 }
            );

        // ── Prevent duplicate enrollment ──
        const existing = await Enrollment.findOne({
            student: studentId,
            course: courseId,
            isActive: true,
        }).lean();

        if (existing)
            return NextResponse.json(
                { message: "Student already enrolled in this course" },
                { status: 400 }
            );

        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            feesTotal: Number(feesTotal) || 0,
            franchise: franchiseId || null,
            certType: certTypeId || null,
        });

        return NextResponse.json(
            { message: "Enrollment created", enrollment },
            { status: 201 }
        );

    } catch (error: any) {
        return handleError(error, "POST /api/admin/enrollments");
    }
}