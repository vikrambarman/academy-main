import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";

function getISTDate(date: Date = new Date()): Date {
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  const istDate = new Date(istMs);
  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth();
  const day = istDate.getUTCDate();
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const today = getISTDate();

    const pendingAttendance = await Attendance.find({
      "records.date": today,
      "records.status": "pending",
    });

    let autoVerified = 0;

    for (const attDoc of pendingAttendance) {
      const todayIdx = attDoc.records.findIndex((r: any) => {
        const d = new Date(r.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });

      if (todayIdx === -1) continue;

      const record = attDoc.records[todayIdx];

      if (record.status === "pending" && record.inTime && record.outTime) {
        record.status = "present";
        record.verifiedAt = new Date();
        record.remark = "Auto-verified at 8 PM";
        attDoc.markModified("records");
        await attDoc.save();
        autoVerified++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Auto-verified ${autoVerified} pending attendance records`,
      autoVerified,
    });
  } catch (error) {
    console.error("[CRON /api/cron/auto-verify]", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}