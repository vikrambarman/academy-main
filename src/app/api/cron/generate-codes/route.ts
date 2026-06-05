// src/app/api/cron/generate-codes/route.ts

import { NextResponse } from "next/server";
import {
    generateCodesForDate,
    getISTMidnight,
    cleanupOldCodes  // ✅ NEW
} from "@/lib/generateHourlyCodes";

export async function GET() {
    try {
        const now = new Date();

        // ✅ Step 1: Cleanup old codes (TTL ka backup)
        const deleted = await cleanupOldCodes();
        console.log(`🗑️ Cleaned up ${deleted} old codes`);

        // ✅ Step 2: Generate today's codes
        const todayIST = getISTMidnight(now);
        console.log(`🔄 Generating for TODAY (IST): ${todayIST.toISOString().split("T")[0]}`);
        await generateCodesForDate(now);

        // ✅ Step 3: Generate tomorrow's codes
        const tomorrowUTC = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const tomorrowIST = getISTMidnight(tomorrowUTC);
        console.log(`🔄 Generating for TOMORROW (IST): ${tomorrowIST.toISOString().split("T")[0]}`);
        await generateCodesForDate(tomorrowUTC);

        return NextResponse.json({
            success: true,
            message: `Codes generated successfully`,
            today: todayIST.toISOString().split("T")[0],
            tomorrow: tomorrowIST.toISOString().split("T")[0],
            cleanedUp: deleted,
        });
    } catch (error: any) {
        console.error("❌ Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}