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

    const { attendanceId, action } = await req.json();

    if (!attendanceId || !action || !["verify", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "attendanceId aur action (verify/reject) required hain" },
        { status: 400 }
      );
    }

    const attDoc = await Attendance.findById(attendanceId);
    if (!attDoc) {
      return NextResponse.json({ message: "Attendance record nahi mila" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayIdx = attDoc.records.findIndex((r: any) => {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (todayIdx === -1) {
      return NextResponse.json({ message: "Aaj ka attendance record nahi mila" }, { status: 404 });
    }

    const record = attDoc.records[todayIdx];
    if (record.status !== "pending") {
      return NextResponse.json(
        { message: `Attendance already ${record.status} hai` },
        { status: 400 }
      );
    }

    if (action === "verify") {
      record.status = "present";
      record.verifiedBy = user._id;
      record.verifiedAt = new Date();
    } else if (action === "reject") {
      record.status = "rejected";
      record.rejectedReason = "Rejected by teacher";
    }

    attDoc.markModified("records");
    await attDoc.save();

    return NextResponse.json({
      success: true,
      message: action === "verify" ? "✅ Attendance verified!" : "❌ Attendance rejected",
      status: record.status,
    });
  } catch (error: any) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error?.message)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/teacher/attendance/verify]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}