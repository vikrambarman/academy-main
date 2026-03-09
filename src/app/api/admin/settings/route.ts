/**
 * /api/admin/settings
 * GET   → Academy settings fetch karo
 * PATCH → Settings update karo (partial update supported)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { verifyUser } from "@/lib/verifyUser";

/* ── Allowed fields whitelist (security ke liye) ── */
const ALLOWED_FIELDS = [
    "name", "tagline", "address", "phone", "email",
    "website", "googleMapUrl", "whatsapp",
    "facebook", "instagram", "youtube",
    "logoUrl", "faviconUrl",
    "notifyOnEnquiry", "notifyOnContact", "notifyOnEnrollment",
] as const;

/* -------------------- GET -------------------- */
export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        /* Ek hi settings document hoga — upsert pattern */
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        return NextResponse.json({ settings });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("SETTINGS GET ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

/* -------------------- PATCH -------------------- */
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();

        /* Sirf allowed fields hi update honge */
        const updateData: Record<string, any> = {};
        for (const field of ALLOWED_FIELDS) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { message: "Kuch bhi update karne ke liye nahi mila" },
                { status: 400 }
            );
        }

        /* upsert: true → pehli baar bhi create ho jayega */
        const settings = await Settings.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            message: "Settings save ho gayi",
            settings,
        });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("SETTINGS PATCH ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}