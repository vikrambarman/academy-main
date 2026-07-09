/**
 * GET /api/public/notes-css
 * Student/Teacher iframe ke liye global notes CSS
 * No auth required (iframe mein use hoga)
 */

import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/db";
import Settings         from "@/models/Settings";

export async function GET() {
    try {
        await connectDB();
        const settings = await Settings.findOne().select("globalNotesCSS").lean() as any;
        return NextResponse.json({
            css: settings?.globalNotesCSS || "",
        });
    } catch {
        return NextResponse.json({ css: "" });
    }
}