// src/app/api/admin/attendance/hourly-code/generate/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import HourlyCode from "@/models/HourlyCode";
import { generateCodesForDate, getISTMidnight } from "@/lib/generateHourlyCodes";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

export async function POST() {
    try {
        await requireAdmin();
        await connectDB();

        const now = new Date();
        const today = getISTMidnight(now);
        const dateStr = today.toISOString().split("T")[0];

        console.log("📅 Manual generate for IST today:", dateStr);

        // Aaj ke existing codes delete karo
        const deleted = await HourlyCode.deleteMany({ date: today });
        console.log(`🗑️ Deleted ${deleted.deletedCount} existing codes for ${dateStr}`);

        // Fresh generate karo
        await generateCodesForDate(now);

        return NextResponse.json({
            success: true,
            message: `✅ ${dateStr} ke liye codes generate ho gaye!`,
            date: dateStr,
        });
    } catch (error: any) {
        if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("[POST /api/admin/attendance/hourly-code/generate]", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}