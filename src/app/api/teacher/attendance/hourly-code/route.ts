// src/app/api/staff/attendance/hourly-code/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import { getCurrentHourCode, getUpcomingCodes } from "@/lib/generateHourlyCodes";

async function requireStaff() {
    const user: any = await verifyUser();
    if (!user || (user.role !== "staff" && user.role !== "admin" && user.role !== "teacher")) {
        throw new Error("UNAUTHORIZED");
    }
    return user;
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireStaff();

        const currentCode = await getCurrentHourCode();

        if (!currentCode) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Aaj ka code generate nahi hua. Admin se contact karo."
                },
                { status: 404 }
            );
        }

        const upcomingCodes = await getUpcomingCodes(4);

        return NextResponse.json({
            success: true,
            current: {
                code: currentCode.code,
                hour: currentCode.hour,
                expiresAt: currentCode.expiresAt,
                // ✅ Fix: timeZone add kiya
                expiresAtFormatted: new Date(currentCode.expiresAt).toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            },
            upcoming: upcomingCodes,
        });
    } catch (error: any) {
        if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("[GET /api/staff/attendance/hourly-code]", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}