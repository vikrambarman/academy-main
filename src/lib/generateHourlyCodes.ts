// src/lib/generateHourlyCodes.ts

import { connectDB } from "@/lib/db";
import HourlyCode from "@/models/HourlyCode";
import crypto from "crypto";

export function generateSecureCode(): string {
    const randomBytes = crypto.randomBytes(2);
    return (randomBytes.readUInt16BE(0) % 9000 + 1000).toString();
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function getISTMidnight(date: Date = new Date()): Date {
    const istMs = date.getTime() + IST_OFFSET_MS;
    const istDate = new Date(istMs);

    const year = istDate.getUTCFullYear();
    const month = istDate.getUTCMonth();
    const day = istDate.getUTCDate();

    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}

export function getISTHour(date: Date = new Date()): number {
    const istMs = date.getTime() + IST_OFFSET_MS;
    const istDate = new Date(istMs);
    return istDate.getUTCHours();
}

export async function generateCodesForDate(targetDate: Date): Promise<void> {
    await connectDB();

    const date = getISTMidnight(targetDate);
    const dateStr = date.toISOString().split("T")[0];

    console.log("=== generateCodesForDate ===");
    console.log("targetDate:", targetDate.toISOString());
    console.log("IST date:", dateStr);

    const existing = await HourlyCode.countDocuments({ date });
    if (existing > 0) {
        console.log(`⚠️ Codes already exist for ${dateStr}, skipping.`);
        return;
    }

    const codes = [];

    // IST day start in actual UTC
    const istDayStartUTC = date.getTime() - IST_OFFSET_MS;

    for (let hour = 0; hour < 24; hour++) {
        // Each hour expires at the start of next hour
        const expiresAt = new Date(istDayStartUTC + (hour + 1) * 60 * 60 * 1000);

        codes.push({
            date,
            hour,
            code: generateSecureCode(),
            expiresAt, // ✅ Har hour apne time pe expire hoga
            isActive: true,
        });
    }

    await HourlyCode.insertMany(codes);
    console.log(`✅ Generated 24 codes for ${dateStr} (IST)`);
    console.log(`   Hour 0  expiresAt: ${codes[0].expiresAt.toISOString()}`);
    console.log(`   Hour 23 expiresAt: ${codes[23].expiresAt.toISOString()}`);

    // ✅ Hour 23 ka expiresAt = next day 00:00 IST
    // TTL index isko next day delete kar dega automatically
}

export async function getCurrentHourCode(): Promise<{
    code: string;
    hour: number;
    expiresAt: Date;
} | null> {
    await connectDB();

    const now = new Date();
    const today = getISTMidnight(now);
    const currentHour = getISTHour(now);

    console.log("🔍 getCurrentHourCode:", {
        utcNow: now.toISOString(),
        istNow: new Date(now.getTime() + IST_OFFSET_MS).toISOString(),
        today: today.toISOString().split("T")[0],
        currentHour,
    });

    const hourlyCode = await HourlyCode.findOne({
        date: today,
        hour: currentHour,
        isActive: true,
    });

    if (!hourlyCode) return null;

    return {
        code: hourlyCode.code,
        hour: hourlyCode.hour,
        expiresAt: hourlyCode.expiresAt,
    };
}

export async function verifyCode(code: string): Promise<{
    valid: boolean;
    message: string;
    hour?: number;
} | null> {
    await connectDB();

    const now = new Date();
    const today = getISTMidnight(now);
    const currentHour = getISTHour(now);

    const hourlyCode = await HourlyCode.findOne({
        date: today,
        hour: currentHour,
        code: code.trim(),
        isActive: true,
    });

    if (!hourlyCode) {
        // Grace period: pehle 5 min of new hour
        const currentMinute = new Date(now.getTime() + IST_OFFSET_MS).getUTCMinutes();

        if (currentMinute < 5) {
            const prevHour = currentHour === 0 ? 23 : currentHour - 1;
            const prevDate = currentHour === 0
                ? new Date(today.getTime() - 24 * 60 * 60 * 1000)
                : today;

            const prevCode = await HourlyCode.findOne({
                date: prevDate,
                hour: prevHour,
                code: code.trim(),
                isActive: true,
            });

            if (prevCode) {
                return { valid: true, message: "Grace period mein valid", hour: prevHour };
            }
        }

        return {
            valid: false,
            message: "❌ Galat code! Staff se current hour ka code pucho.",
        };
    }

    return { valid: true, message: "Code verified ✓", hour: currentHour };
}

export async function getUpcomingCodes(limit: number = 4): Promise<any[]> {
    await connectDB();

    const now = new Date();
    const today = getISTMidnight(now);
    const currentHour = getISTHour(now);

    const upcomingCodes = await HourlyCode.find({
        date: today,
        hour: { $gte: currentHour },
        isActive: true,
    })
        .sort({ hour: 1 })
        .limit(limit)
        .lean();

    return upcomingCodes.map((c: any) => ({
        hour: c.hour,
        code: c.code,
        time: `${String(c.hour).padStart(2, "0")}:00 - ${String(c.hour + 1).padStart(2, "0")}:00`,
        expiresAt: c.expiresAt,
    }));
}

// ✅ NEW: Manual cleanup function (optional - backup for TTL)
export async function cleanupOldCodes(): Promise<number> {
    await connectDB();

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayMidnight = getISTMidnight(yesterday);

    const result = await HourlyCode.deleteMany({
        date: { $lt: yesterdayMidnight }
    });

    console.log(`🗑️ Deleted ${result.deletedCount} old codes`);
    return result.deletedCount;
}