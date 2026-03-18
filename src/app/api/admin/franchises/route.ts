/**
 * /api/admin/franchises
 * GET    → All franchises
 * POST   → Create franchise
 * PUT    → Update franchise
 * PATCH  → Toggle isActive
 * DELETE → Delete franchise
 */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Franchise from "@/models/Franchise";
import { verifyUser } from "@/lib/verifyUser";

export async function GET() {
    try {
        await connectDB();
        const franchises = await Franchise.find().sort({ createdAt: 1 });
        return NextResponse.json(franchises);
    } catch {
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
        const { name, code, description, registeredBodies, websiteUrl, portalUrl, portalLoginRequired, isOwn } = body;

        if (!name || !code)
            return NextResponse.json({ message: "Name and Code required" }, { status: 400 });

        const existing = await Franchise.findOne({ code: code.toUpperCase() });
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
        const { id, name, description, registeredBodies, websiteUrl, portalUrl, portalLoginRequired, isOwn } = body;

        const franchise = await Franchise.findById(id);
        if (!franchise)
            return NextResponse.json({ message: "Not found" }, { status: 404 });

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
        const franchise = await Franchise.findById(id);
        if (!franchise)
            return NextResponse.json({ message: "Not found" }, { status: 404 });

        franchise.isActive = isActive;
        await franchise.save();
        return NextResponse.json(franchise);
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

        await Franchise.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}