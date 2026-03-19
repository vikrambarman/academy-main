/**
 * GET    /api/admin/course-franchise-configs?courseId=xxx
 * POST   /api/admin/course-franchise-configs  — Create config
 * PUT    /api/admin/course-franchise-configs  — Update config
 * DELETE /api/admin/course-franchise-configs?id=xxx
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import "@/models/Franchise";
import "@/models/CertificateType";
import "@/models/Course";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message))
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

const POPULATE = [
    { path: "franchise", select: "name code registeredBodies isOwn websiteUrl description" },
    { path: "defaultCertType", select: "name code issuingBody verificationMethod verificationUrl benefits" },
    { path: "certEntries.certType", select: "name code issuingBody verificationMethod verificationUrl benefits defaultFee" },
    { path: "course", select: "name level duration description modules" },
];

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const query: any = courseId ? { course: courseId } : {};

        const configs = await CourseFranchiseConfig.find(query)
            .populate(POPULATE)
            .sort({ createdAt: 1 })
            .lean({ virtuals: true });

        return NextResponse.json(configs);
    } catch (e: any) { return handleError(e, "GET /course-franchise-configs"); }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const body = await req.json();
        const { courseId, franchiseId, certEntries, benefits, highlights } = body;

        if (!courseId || !franchiseId || !certEntries?.length)
            return NextResponse.json(
                { message: "courseId, franchiseId aur kam se kam ek certEntry required hai" },
                { status: 400 }
            );

        // Ensure exactly one default
        const hasDefault = certEntries.some((e: any) => e.isDefault);
        if (!hasDefault) certEntries[0].isDefault = true;

        const defaultEntry = certEntries.find((e: any) => e.isDefault);

        const existing = await CourseFranchiseConfig.findOne({ course: courseId, franchise: franchiseId }).lean();
        if (existing)
            return NextResponse.json(
                { message: "Config already exists for this course + franchise" },
                { status: 400 }
            );

        const config = await CourseFranchiseConfig.create({
            course: courseId,
            franchise: franchiseId,
            certEntries: certEntries.map((e: any) => ({
                certType: e.certTypeId,
                isDefault: !!e.isDefault,
                fee: Number(e.fee) || 0,
                registrationFee: Number(e.registrationFee) || 0,
                installmentsAllowed: e.installmentsAllowed ?? true,
                maxInstallments: Number(e.maxInstallments) || 3,
                minInstallmentAmount: Number(e.minInstallmentAmount) || 500,
            })),
            defaultCertType: defaultEntry.certTypeId,
            benefits: benefits || [],
            highlights: highlights || [],
        });

        const populated = await CourseFranchiseConfig.findById(config._id)
            .populate(POPULATE)
            .lean({ virtuals: true });

        return NextResponse.json(populated, { status: 201 });
    } catch (e: any) { return handleError(e, "POST /course-franchise-configs"); }
}

// ── PUT ───────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const body = await req.json();
        const { id, certEntries, benefits, highlights, isActive } = body;

        const config = await CourseFranchiseConfig.findById(id);
        if (!config)
            return NextResponse.json({ message: "Config not found" }, { status: 404 });

        if (certEntries?.length) {
            const hasDefault = certEntries.some((e: any) => e.isDefault);
            if (!hasDefault) certEntries[0].isDefault = true;

            config.certEntries = certEntries.map((e: any) => ({
                certType: e.certTypeId,
                isDefault: !!e.isDefault,
                fee: Number(e.fee) || 0,
                registrationFee: Number(e.registrationFee) || 0,
                installmentsAllowed: e.installmentsAllowed ?? true,
                maxInstallments: Number(e.maxInstallments) || 3,
                minInstallmentAmount: Number(e.minInstallmentAmount) || 500,
            }));

            const defaultEntry = certEntries.find((e: any) => e.isDefault);
            config.defaultCertType = defaultEntry.certTypeId;
        }

        if (benefits !== undefined) config.benefits = benefits;
        if (highlights !== undefined) config.highlights = highlights;
        if (isActive !== undefined) config.isActive = isActive;

        await config.save();

        const populated = await CourseFranchiseConfig.findById(id)
            .populate(POPULATE)
            .lean({ virtuals: true });

        return NextResponse.json(populated);
    } catch (e: any) { return handleError(e, "PUT /course-franchise-configs"); }
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

        await CourseFranchiseConfig.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (e: any) { return handleError(e, "DELETE /course-franchise-configs"); }
}