import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";

async function requireTeacher() {
  const user: any = await verifyUser();
  const role = (user?.role || "").toLowerCase().trim();

  if (!user || role !== "teacher") {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user: any = await requireTeacher();

    const { attendanceIds, action } = await req.json();

    if (!attendanceIds || !Array.isArray(attendanceIds) || attendanceIds.length === 0) {
      return NextResponse.json({ message: "attendanceIds array required hai" }, { status: 400 });
    }
    if (!action || !["verify", "reject"].includes(action)) {
      return NextResponse.json({ message: "action required hai" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let verified = 0, rejected = 0, skipped = 0;

    for (const attendanceId of attendanceIds) {
      const attDoc = await Attendance.findById(attendanceId);
      if (!attDoc) { skipped++; continue; }

      const todayIdx = attDoc.records.findIndex((r: any) => {
        const d = new Date(r.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });

      if (todayIdx === -1 || attDoc.records[todayIdx].status !== "pending") {
        skipped++;
        continue;
      }

      const record = attDoc.records[todayIdx];
      if (action === "verify") {
        record.status = "present";
        record.verifiedBy = user._id;
        record.verifiedAt = new Date();
        verified++;
      } else {
        record.status = "rejected";
        record.rejectedReason = "Bulk rejected";
        rejected++;
      }

      attDoc.markModified("records");
      await attDoc.save();
    }

    return NextResponse.json({
      success: true,
      message: `✅ ${verified} verified, ${rejected} rejected, ${skipped} skipped`,
    });
  } catch (error: any) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/teacher/attendance/bulk-verify]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}