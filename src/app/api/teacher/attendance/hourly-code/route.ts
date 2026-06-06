import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import HourlyCode from "@/models/HourlyCode";
import {
    getISTMidnight,
    getISTHour,
    getCurrentHourCode,
    getUpcomingCodes,
} from "@/lib/generateHourlyCodes";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function requireStaff() {
    const user: any = await verifyUser();

    // ✅ DEBUG - remove after testing
    console.log('[TEACHER AUTH]', {
        email: user?.email,
        role: user?.role,
        id: user?._id
    });

    if (!user) throw new Error("NO_TOKEN");

    // ✅ Allow admin, staff, teacher, faculty - ANY role except student
    const role = String(user.role || '').toLowerCase().trim();
    if (role === 'student') {
        throw new Error("UNAUTHORIZED");
    }

    // If role is missing, still allow (some old accounts)
    return user;
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireStaff();

        const now = new Date();
        const today = getISTMidnight(now);
        const currentHour = getISTHour(now);

        const currentCode = await getCurrentHourCode();

        if (!currentCode) {
            const existingDates = await HourlyCode.distinct("date");
            return NextResponse.json(
                {
                    success: false,
                    message: "Aaj ka code generate nahi hua. Admin se contact karo.",
                    debug: {
                        istDate: today.toISOString().split("T")[0],
                        currentHour,
                        existingCount: existingDates.length,
                    },
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
                expiresAtFormatted: new Date(currentCode.expiresAt).toLocaleTimeString(
                    "en-IN",
                    { timeZone: "Asia/Kolkata", hour12: true, hour: '2-digit', minute: '2-digit' }
                ),
            },
            upcoming: upcomingCodes,
        });
    } catch (error: any) {
        console.error('[STAFF API ERROR]', error.message);
        if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
            return NextResponse.json({ message: "Unauthorized - please login again" }, { status: 401 });
        }
        return NextResponse.json({ message: "Server error: " + error.message }, { status: 500 });
    }
}