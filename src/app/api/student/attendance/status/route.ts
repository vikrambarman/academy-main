import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Enrollment from "@/models/Enrollment";
import "@/models/Course";

async function requireStudent() {
  const user: any = await verifyUser();
  if (!user || user.role !== "student") {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function GET() {
  try {
    await connectDB();
    const user: any = await requireStudent();

    const enrollments = await Enrollment.find({
      student: user.studentId,
      isActive: true,
    })
      .populate("course", "name")
      .lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceData = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        const attDoc = await Attendance.findOne({
          student: user.studentId,
          enrollment: enrollment._id,
        }).lean();

        const todayRecord = attDoc?.records.find((r: any) => {
          const d = new Date(r.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        });

        return {
          enrollmentId: enrollment._id,
          courseName: enrollment.course?.name ?? "—",
          inTime: todayRecord?.inTime ?? null,
          outTime: todayRecord?.outTime ?? null,
          status: todayRecord?.status ?? null,
          verifiedAt: todayRecord?.verifiedAt ?? null,
          verifiedBy: todayRecord?.verifiedBy ?? null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      attendance: attendanceData,
    });
  } catch (error: any) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/student/attendance/status]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}