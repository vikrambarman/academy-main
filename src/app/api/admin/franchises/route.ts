/**
 * GET    /api/admin/franchises  — Sabhi franchises
 * POST   /api/admin/franchises  — Naya franchise create
 * PUT    /api/admin/franchises  — Franchise update
 * PATCH  /api/admin/franchises  — isActive toggle
 * DELETE /api/admin/franchises  — Franchise delete
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Franchise from "@/models/Franchise";

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

export async function GET() {
    try {
        await connectDB();
        await requireAdmin();
        const franchises = await Franchise.find().sort({ createdAt: 1 }).lean();
        return NextResponse.json(franchises);
    } catch (error: any) {
        return handleError(error, "GET /api/admin/franchises");
    }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { name, code, description, registeredBodies, websiteUrl, portalUrl, portalLoginRequired, isOwn } = await req.json();

        if (!name?.trim() || !code?.trim())
            return NextResponse.json({ message: "Name aur Code required hain" }, { status: 400 });

        const existing = await Franchise.findOne({ code: code.toUpperCase() }).lean();
        if (existing)
            return NextResponse.json({ message: "Franchise code already exists" }, { status: 400 });

        const franchise = await Franchise.create({
            name, code: code.toUpperCase(), description,
            registeredBodies: registeredBodies || [],
            websiteUrl, portalUrl,
            portalLoginRequired: !!portalLoginRequired,
            isOwn: !!isOwn,
        });

        return NextResponse.json(franchise, { status: 201 });
    } catch (error: any) {
        return handleError(error, "POST /api/admin/franchises");
    }
}

// ── PUT ───────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { id, name, description, registeredBodies, websiteUrl, portalUrl, portalLoginRequired, isOwn } = await req.json();

        const franchise = await Franchise.findById(id);
        if (!franchise)
            return NextResponse.json({ message: "Franchise not found" }, { status: 404 });

        if (name !== undefined) franchise.name = name;
        if (description !== undefined) franchise.description = description;
        if (registeredBodies !== undefined) franchise.registeredBodies = registeredBodies;
        if (websiteUrl !== undefined) franchise.websiteUrl = websiteUrl;
        if (portalUrl !== undefined) franchise.portalUrl = portalUrl;
        if (portalLoginRequired !== undefined) franchise.portalLoginRequired = portalLoginRequired;
        if (isOwn !== undefined) franchise.isOwn = isOwn;

        await franchise.save();
        return NextResponse.json(franchise);
    } catch (error: any) {
        return handleError(error, "PUT /api/admin/franchises");
    }
}

// ── PATCH — toggle isActive ───────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { id, isActive } = await req.json();

        const franchise = await Franchise.findById(id);
        if (!franchise)
            return NextResponse.json({ message: "Franchise not found" }, { status: 404 });

        franchise.isActive = isActive;
        await franchise.save();
        return NextResponse.json(franchise);
    } catch (error: any) {
        return handleError(error, "PATCH /api/admin/franchises");
    }
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id)
            return NextResponse.json({ message: "ID required" }, { status: 400 });

        const franchise = await Franchise.findByIdAndDelete(id).lean();
        if (!franchise)
            return NextResponse.json({ message: "Franchise not found" }, { status: 404 });

        return NextResponse.json({ message: "Franchise deleted" });
    } catch (error: any) {
        return handleError(error, "DELETE /api/admin/franchises");
    }
}