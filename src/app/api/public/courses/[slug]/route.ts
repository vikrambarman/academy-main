import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import "@/models/Franchise";
import "@/models/CertificateType";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await context.params;

        const course = await Course.findOne({ slug, isActive: true }).lean();

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found" },
                { status: 404 }
            );
        }

        // Franchise configs for this course
        // isActive filter nahi — sab configs aayenge
        const franchiseOptions = await CourseFranchiseConfig.find({
            course: (course as any)._id,
        })
            .populate("franchise", "name code registeredBodies isOwn portalUrl portalLoginRequired")
            .populate("defaultCertType", "name code issuingBody verificationMethod verificationUrl benefits portalVerificationSteps")
            .lean();

        return NextResponse.json(
            {
                success: true,
                data: { ...course, franchiseOptions },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Single Course Fetch Error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}