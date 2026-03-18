/**
 * /api/admin/course-franchise-configs
 * GET    ?courseId=xxx  → Course ke sab configs
 * GET    (no params)    → All configs
 * POST                  → Naya config create
 * PUT                   → Config update
 * DELETE ?id=xxx        → Config delete
 */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import { verifyUser } from "@/lib/verifyUser";
import "@/models/Franchise";
import "@/models/CertificateType";

export async function GET(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        const query: any = {};
        if (courseId) query.course = courseId;

        const configs = await CourseFranchiseConfig.find(query)
            .populate("franchise", "name code registeredBodies portalUrl portalLoginRequired isOwn")
            .populate("defaultCertType", "name code issuingBody verificationMethod verificationUrl portalVerificationSteps benefits")
            .populate("availableCertTypes", "name code issuingBody verificationMethod")
            .populate("course", "name level")
            .sort({ createdAt: 1 });

        return NextResponse.json(configs);
    } catch (error) {
        console.error("GET ERROR:", error);
        return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const body = await req.json();
        const {
            courseId, franchiseId, defaultCertTypeId,
            availableCertTypeIds, feeStructure, benefits, highlights,
        } = body;

        if (!courseId || !franchiseId || !defaultCertTypeId)
            return NextResponse.json(
                { message: "courseId, franchiseId, defaultCertTypeId required" },
                { status: 400 }
            );

        const existing = await CourseFranchiseConfig.findOne({
            course: courseId, franchise: franchiseId,
        });
        if (existing)
            return NextResponse.json(
                { message: "Config already exists for this course + franchise" },
                { status: 400 }
            );

        const config = await CourseFranchiseConfig.create({
            course: courseId,
            franchise: franchiseId,
            defaultCertType: defaultCertTypeId,
            availableCertTypes: availableCertTypeIds?.length
                ? availableCertTypeIds
                : [defaultCertTypeId],
            feeStructure: {
                total: Number(feeStructure?.total) || 0,
                installmentsAllowed: feeStructure?.installmentsAllowed ?? true,
                maxInstallments: Number(feeStructure?.maxInstallments) || 3,
                minInstallmentAmount: Number(feeStructure?.minInstallmentAmount) || 500,
            },
            benefits: benefits || [],
            highlights: highlights || [],
        });

        const populated = await CourseFranchiseConfig.findById(config._id)
            .populate("franchise", "name code registeredBodies portalUrl portalLoginRequired isOwn")
            .populate("defaultCertType", "name code issuingBody verificationMethod verificationUrl portalVerificationSteps benefits")
            .populate("availableCertTypes", "name code issuingBody")
            .populate("course", "name level");

        return NextResponse.json(populated, { status: 201 });
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        console.error("CONFIG CREATE ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const body = await req.json();
        const { id, defaultCertTypeId, availableCertTypeIds, feeStructure, benefits, highlights, isActive } = body;

        const config = await CourseFranchiseConfig.findById(id);
        if (!config)
            return NextResponse.json({ message: "Config not found" }, { status: 404 });

        if (defaultCertTypeId !== undefined) config.defaultCertType = defaultCertTypeId;
        if (availableCertTypeIds !== undefined) config.availableCertTypes = availableCertTypeIds;
        if (feeStructure?.total !== undefined) config.feeStructure.total = Number(feeStructure.total);
        if (feeStructure?.installmentsAllowed !== undefined) config.feeStructure.installmentsAllowed = feeStructure.installmentsAllowed;
        if (feeStructure?.maxInstallments !== undefined) config.feeStructure.maxInstallments = Number(feeStructure.maxInstallments);
        if (feeStructure?.minInstallmentAmount !== undefined) config.feeStructure.minInstallmentAmount = Number(feeStructure.minInstallmentAmount);
        if (benefits !== undefined) config.benefits = benefits;
        if (highlights !== undefined) config.highlights = highlights;
        if (isActive !== undefined) config.isActive = isActive;

        await config.save();

        const populated = await CourseFranchiseConfig.findById(id)
            .populate("franchise", "name code registeredBodies portalUrl portalLoginRequired isOwn")
            .populate("defaultCertType", "name code issuingBody verificationMethod verificationUrl portalVerificationSteps benefits")
            .populate("availableCertTypes", "name code issuingBody")
            .populate("course", "name level");

        return NextResponse.json(populated);
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id)
            return NextResponse.json({ message: "ID required" }, { status: 400 });

        await CourseFranchiseConfig.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}