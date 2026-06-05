// src/app/api/admin/attendance/hourly-code/route.ts

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

async function requireAdmin() {
  const user: any = await verifyUser();
  if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
  return user;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await requireAdmin();

    const now         = new Date();
    const today       = getISTMidnight(now);
    const currentHour = getISTHour(now);
    const dateStr     = today.toISOString().split("T")[0];

    console.log("🔍 GET hourly-code:", {
      utcNow:      now.toISOString(),
      istDate:     dateStr,
      currentHour,
    });

    const currentCode = await getCurrentHourCode();

    if (!currentCode) {
      const existingDates = await HourlyCode.distinct("date");
      return NextResponse.json(
        {
          message: "Aaj ka code generate nahi hua. Manual generate karo.",
          debug: {
            queryingDate:  dateStr,
            currentHour,
            existingDates: existingDates.map(
              (d: any) => new Date(d).toISOString().split("T")[0]
            ),
          },
        },
        { status: 404 }
      );
    }

    const upcomingCodes = await getUpcomingCodes(4);

    return NextResponse.json({
      success:  true,
      current:  {
        code:               currentCode.code,
        hour:               currentCode.hour,
        expiresAt:          currentCode.expiresAt,
        expiresAtFormatted: new Date(currentCode.expiresAt).toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour:     "2-digit",
          minute:   "2-digit",
          hour12:   true,
        }),
      },
      upcoming: upcomingCodes,
    });
  } catch (error: any) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/admin/attendance/hourly-code]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await requireAdmin();

    const now         = new Date();
    const today       = getISTMidnight(now);
    const currentHour = getISTHour(now);

    const newCode = (Math.floor(Math.random() * 9000) + 1000).toString();

    const updated = await HourlyCode.findOneAndUpdate(
      { date: today, hour: currentHour },
      { code: newCode, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Current hour ka code nahi mila. Pehle generate karo." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success:  true,
      newCode,
      hour:     currentHour,
      date:     today.toISOString().split("T")[0],
    });
  } catch (error: any) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/admin/attendance/hourly-code]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}