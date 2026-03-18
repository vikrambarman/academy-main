/**
 * /api/admin/certificates
 * GET  → All certificates
 * POST → Create certificate record
 *
 * CHANGES from original:
 * - authority: free text (no enum restriction)
 * - franchise + certType optional refs added
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import { verifyUser } from "@/lib/verifyUser";
import "@/models/Student";
import "@/models/Course";

export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const certificates = await Certificate.find()
            .populate("student", "name studentId")
            .populate("enrollment", "_id")
            .populate("course", "name")
            .populate("franchise", "name code")
            .populate("certType", "name code issuingBody")
            .sort({ createdAt: -1 });

        return NextResponse.json({ certificates });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const body = await req.json();
        const {
            studentId, enrollmentId, courseId,
            certificateNo, authority,
            franchise, certType,
            issueDate, expiryDate, verifyUrl, status, remarks,
        } = body;

        if (!studentId || !enrollmentId)
            return NextResponse.json({ message: "Student aur enrollment required" }, { status: 400 });

        if (!certificateNo?.trim())
            return NextResponse.json({ message: "Certificate number required" }, { status: 400 });

        const existing = await Certificate.findOne({ certificateNo: certificateNo.trim() });
        if (existing)
            return NextResponse.json({ message: "Certificate number already exists" }, { status: 400 });

        const enrollment = await Enrollment.findById(enrollmentId).populate("course");
        if (!enrollment)
            return NextResponse.json({ message: "Enrollment nahi mila" }, { status: 404 });

        const resolvedCourseId = courseId || (enrollment.course as any)?._id;

        const certificate = await Certificate.create({
            student: studentId,
            enrollment: enrollmentId,
            course: resolvedCourseId,
            certificateNo: certificateNo.trim(),
            authority: authority || "Unknown",
            franchise: franchise || null,
            certType: certType || null,
            issueDate: issueDate ? new Date(issueDate) : undefined,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            verifyUrl: verifyUrl?.trim() || undefined,
            status: status || "issued",
            remarks: remarks?.trim() || undefined,
        });

        await Enrollment.findByIdAndUpdate(enrollmentId, {
            certificateStatus: status === "issued" ? "Certificate Generated" : "Applied",
        });

        const populated = await Certificate.findById(certificate._id)
            .populate("student", "name studentId")
            .populate("enrollment", "_id")
            .populate("course", "name")
            .populate("franchise", "name code")
            .populate("certType", "name code issuingBody");

        return NextResponse.json(
            { message: "Certificate record add ho gaya", certificate: populated },
            { status: 201 }
        );

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}