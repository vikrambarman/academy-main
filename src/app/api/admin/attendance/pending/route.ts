import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import "@/models/Student";
import "@/models/Course";

async function requireAdmin() {
    const user: any = await verifyUser();
    const role = (user?.role || "").toLowerCase().trim();

    if (!user || role !== "admin") {
        throw new Error("UNAUTHORIZED");
    }
    return user;
}

export async function GET() {
    try {
        await connectDB();
        await requireAdmin();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const pendingAttendance = await Attendance.find({
            "records.date": today,
            "records.status": "pending",
        })
            .populate("student", "name studentId")
            .populate("course", "name")
            .lean();

        const students = pendingAttendance.map((attDoc: any) => {
            const todayRecord = attDoc.records.find((r: any) => {
                const d = new Date(r.date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === today.getTime();
            });

            let duration = null;
            if (todayRecord?.inTime && todayRecord?.outTime) {
                const inParts = todayRecord.inTime.split(":").map(Number);
                const outParts = todayRecord.outTime.split(":").map(Number);
                const totalMins =
                    outParts[0] * 60 + outParts[1] - (inParts[0] * 60 + inParts[1]);
                duration = `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`;
            }

            return {
                attendanceId: attDoc._id.toString(),
                studentName: attDoc.student?.name ?? "—",
                studentId: attDoc.student?.studentId ?? "—",
                courseName: attDoc.course?.name ?? "—",
                inTime: todayRecord?.inTime ?? null,
                outTime: todayRecord?.outTime ?? null,
                duration,
            };
        });

        return NextResponse.json({
            success: true,
            students,
            count: students.length,
        });
    } catch (error: any) {
        if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error?.message)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("[GET /api/admin/attendance/pending]", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}