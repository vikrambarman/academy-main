/**
 * /api/admin/certificates
 * GET  â†’ Sabhi certificates fetch karo
 * POST â†’ Naya certificate record add karo
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import { verifyUser } from "@/lib/verifyUser";
import "@/models/Student";
import "@/models/Course";

/* -------------------- GET -------------------- */
export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const certificates = await Certificate.find()
            .populate("student", "name studentId")
            .populate("enrollment", "_id")
            .populate("course", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json({ certificates });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("CERTIFICATES GET ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

/* -------------------- POST -------------------- */
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const {
            studentId,
            enrollmentId,
            courseId,
            certificateNo,
            authority,
            issueDate,
            expiryDate,
            verifyUrl,
            status,
            remarks,
        } = body;

        /* â”€â”€ Validation â”€â”€ */
        if (!studentId || !enrollmentId) {
            return NextResponse.json(
                { message: "Student aur enrollment required hai" },
                { status: 400 }
            );
        }

        if (!certificateNo?.trim()) {
            return NextResponse.json(
                { message: "Certificate number required hai" },
                { status: 400 }
            );
        }

        /* â”€â”€ Duplicate certificate number check â”€â”€ */
        const existing = await Certificate.findOne({
            certificateNo: certificateNo.trim(),
        });
        if (existing) {
            return NextResponse.json(
                { message: "Ye certificate number already exist karta hai" },
                { status: 400 }
            );
        }

        /* â”€â”€ Enrollment verify karo â”€â”€ */
        const enrollment = await Enrollment.findById(enrollmentId).populate("course");
        if (!enrollment) {
            return NextResponse.json(
                { message: "Enrollment nahi mila" },
                { status: 404 }
            );
        }

        const resolvedCourseId = courseId || enrollment.course;

        const certificate = await Certificate.create({
            student: studentId,
            enrollment: enrollmentId,
            course: resolvedCourseId,
            certificateNo: certificateNo.trim(),
            authority: authority || "Drishti",
            issueDate: issueDate ? new Date(issueDate) : undefined,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            verifyUrl: verifyUrl?.trim() || undefined,
            status: status || "issued",
            remarks: remarks?.trim() || undefined,
        });

        /* â”€â”€ Enrollment ka certificateStatus bhi update karo â”€â”€ */
        await Enrollment.findByIdAndUpdate(enrollmentId, {
            certificateStatus: status === "issued" ? "Certificate Generated" : "Applied",
        });

        const populated = await Certificate.findById(certificate._id)
            .populate("student", "name studentId")
            .populate("enrollment", "_id")
            .populate("course", "name");

        return NextResponse.json(
            { message: "Certificate record add ho gaya", certificate: populated },
            { status: 201 }
        );

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("CERTIFICATE CREATE ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}