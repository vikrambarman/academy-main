import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";

import Student from "@/models/Student";
import Certificate from "@/models/Certificate";
import "@/models/Course";
import Enrollment from "@/models/Enrollment";

export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();

        if (!user || user.role !== "student") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const student = await Student.findOne({ user: user._id }).lean();

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        if (!student.isActive) {
            return NextResponse.json({ message: "Account deactivated" }, { status: 403 });
        }

        // Enrollments fetch karo
        const enrollments = await Enrollment.find({ student: (student as any)._id })
            .populate({
                path: "course",
                select: "name slug duration authority certificate verification externalPortalUrl externalLoginRequired",
            })
            .select("feesTotal feesPaid certificateStatus payments admissionDate course")
            .lean();

        // ── Certificates fetch karo is student ke liye ──────────────────────
        const certificates = await Certificate.find({
            student: (student as any)._id,
        })
            .select("enrollment certificateNo authority issueDate expiryDate verifyUrl status remarks")
            .lean();

        // enrollmentId → certificate map banao
        const certMap: Record<string, any> = {};
        for (const cert of certificates) {
            certMap[(cert as any).enrollment.toString()] = cert;
        }

        // Har enrollment mein uska certificate attach karo
        const enrichedEnrollments = enrollments.map((e: any) => ({
            ...e,
            certificate: certMap[e._id.toString()] || null,
        }));

        return NextResponse.json({
            student: {
                studentId: (student as any).studentId,
                name: (student as any).name,
                email: (student as any).email,
                phone: (student as any).phone,
                address: (student as any).address,
                qualification: (student as any).qualification,
                courseStatus: (student as any).courseStatus,
                profileImage: (student as any).profileImage,
            },
            enrollments: enrichedEnrollments,
        });

    } catch (error) {
        console.error("STUDENT PROFILE ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {

    try {

        await connectDB();

        const user: any = await verifyUser();

        if (!user || user.role !== "student") {

            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );

        }

        const body = await req.json();

        const student = await Student.findOne({
            user: user._id
        });

        if (!student) {

            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            );

        }

        /* ===== ALLOWED FIELDS ===== */

        if (body.phone !== undefined)
            student.phone = body.phone;

        if (body.address !== undefined)
            student.address = body.address;

        if (body.qualification !== undefined)
            student.qualification = body.qualification;

        await student.save();

        return NextResponse.json({
            message: "Profile updated",
            student
        });

    } catch (error) {

        console.error("PROFILE UPDATE ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );

    }

}