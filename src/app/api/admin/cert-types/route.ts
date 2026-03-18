/**
 * /api/admin/cert-types
 * GET    → All cert types (optional ?franchiseId filter)
 * POST   → Create cert type
 * PUT    → Update cert type
 * PATCH  → Toggle isActive
 */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CertificateType from "@/models/CertificateType";
import { verifyUser } from "@/lib/verifyUser";
import "@/models/Franchise";

export async function GET(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const franchiseId = searchParams.get("franchiseId");

        const query = franchiseId ? { franchise: franchiseId } : {};
        const certTypes = await CertificateType.find(query)
            .populate("franchise", "name code")
            .sort({ createdAt: 1 });

        return NextResponse.json(certTypes);
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
            franchiseId, name, code, issuingBody, verificationMethod,
            verificationUrl, portalVerificationSteps, benefits,
            description, applicableLevels, defaultFee,
        } = body;

        if (!franchiseId || !name || !code || !issuingBody)
            return NextResponse.json(
                { message: "franchiseId, name, code, issuingBody required" },
                { status: 400 }
            );

        const existing = await CertificateType.findOne({ code: code.toUpperCase() });
        if (existing)
            return NextResponse.json({ message: "Code already exists" }, { status: 400 });

        const certType = await CertificateType.create({
            franchise: franchiseId,
            name, code: code.toUpperCase(), issuingBody,
            verificationMethod, verificationUrl,
            portalVerificationSteps: portalVerificationSteps || [],
            benefits: benefits || [],
            description,
            applicableLevels: applicableLevels || [],
            defaultFee: Number(defaultFee) || 0,
        });

        const populated = await CertificateType.findById(certType._id)
            .populate("franchise", "name code");

        return NextResponse.json(populated, { status: 201 });
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
        const { id, name, issuingBody, verificationMethod, verificationUrl,
            portalVerificationSteps, benefits, description, applicableLevels, defaultFee } = body;

        const certType = await CertificateType.findById(id);
        if (!certType)
            return NextResponse.json({ message: "Not found" }, { status: 404 });

        if (name !== undefined) certType.name = name;
        if (issuingBody !== undefined) certType.issuingBody = issuingBody;
        if (verificationMethod !== undefined) certType.verificationMethod = verificationMethod;
        if (verificationUrl !== undefined) certType.verificationUrl = verificationUrl;
        if (portalVerificationSteps !== undefined) certType.portalVerificationSteps = portalVerificationSteps;
        if (benefits !== undefined) certType.benefits = benefits;
        if (description !== undefined) certType.description = description;
        if (applicableLevels !== undefined) certType.applicableLevels = applicableLevels;
        if (defaultFee !== undefined) certType.defaultFee = Number(defaultFee);

        await certType.save();

        const populated = await CertificateType.findById(id)
            .populate("franchise", "name code");

        return NextResponse.json(populated);
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "admin")
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { id, isActive } = await req.json();
        const certType = await CertificateType.findById(id);
        if (!certType)
            return NextResponse.json({ message: "Not found" }, { status: 404 });

        certType.isActive = isActive;
        await certType.save();
        return NextResponse.json(certType);
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}