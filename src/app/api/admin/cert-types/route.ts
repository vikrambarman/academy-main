/**
 * /api/admin/cert-types
 * GET    → All cert types (optional ?franchiseId filter)
 * POST   → Create cert type
 * PUT    → Update cert type
 * PATCH  → Toggle isActive
 */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import CertificateType from "@/models/CertificateType";
import "@/models/Franchise";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

export async function GET(req: Request) {
    try {
        await connectDB();
        await requireAdmin();
        const { searchParams } = new URL(req.url);
        const franchiseId = searchParams.get("franchiseId");
        const query: any = franchiseId ? { franchise: franchiseId } : {};
        const certTypes = await CertificateType.find(query)
            .populate("franchise", "name code")
            .sort({ createdAt: 1 })
            .lean();
        return NextResponse.json(certTypes);
    } catch (error: any) {
        if (error.message === "UNAUTHORIZED" || error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        console.error("CERT-TYPES GET:", error);
        return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        await requireAdmin();
        const body = await req.json();
        const { franchiseId, name, code, issuingBody, verificationMethod, verificationUrl, portalVerificationSteps, benefits, description, applicableLevels, defaultFee } = body;
        if (!franchiseId || !name || !code || !issuingBody)
            return NextResponse.json({ message: "franchiseId, name, code, issuingBody required" }, { status: 400 });
        const existing = await CertificateType.findOne({ code: code.toUpperCase() }).lean();
        if (existing)
            return NextResponse.json({ message: "Code already exists" }, { status: 400 });
        const certType = await CertificateType.create({
            franchise: franchiseId, name, code: code.toUpperCase(), issuingBody,
            verificationMethod, verificationUrl,
            portalVerificationSteps: portalVerificationSteps || [],
            benefits: benefits || [], description,
            applicableLevels: applicableLevels || [],
            defaultFee: Number(defaultFee) || 0,
        });
        const populated = await CertificateType.findById(certType._id).populate("franchise", "name code").lean();
        return NextResponse.json(populated, { status: 201 });
    } catch (error: any) {
        if (error.message === "UNAUTHORIZED" || error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        console.error("CERT-TYPES POST:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        await requireAdmin();
        const body = await req.json();
        const { id, name, issuingBody, verificationMethod, verificationUrl, portalVerificationSteps, benefits, description, applicableLevels, defaultFee } = body;
        const certType = await CertificateType.findById(id);
        if (!certType) return NextResponse.json({ message: "Not found" }, { status: 404 });
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
        const populated = await CertificateType.findById(id).populate("franchise", "name code").lean();
        return NextResponse.json(populated);
    } catch (error: any) {
        if (error.message === "UNAUTHORIZED" || error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await connectDB();
        await requireAdmin();
        const { id, isActive } = await req.json();
        const certType = await CertificateType.findById(id);
        if (!certType) return NextResponse.json({ message: "Not found" }, { status: 404 });
        certType.isActive = isActive;
        await certType.save();
        return NextResponse.json(certType);
    } catch (error: any) {
        if (error.message === "UNAUTHORIZED" || error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}