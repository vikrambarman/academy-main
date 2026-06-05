// src/app/api/attendance/scan/route.ts
// UPDATED VERSION - No late auto-detection

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";

// ── Rate Limiter (same) ────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReqs = 30;

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxReqs) return false;
  entry.count++;
  return true;
}

// ── Helpers (same) ─────────────────────────────────────────────
function getCurrentTime(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

function getTodayDate(): Date {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  ist.setHours(0, 0, 0, 0);
  return ist;
}

function findTodayRecord(records: any[]) {
  const today = getTodayDate();
  return records.find((r) => {
    const d = new Date(r.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

// ════════════════════════════════════════════════════════════════
// GET → Student info (same)
// ════════════════════════════════════════════════════════════════
export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: "Too many requests. Thodi der baad try karo." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId")?.trim().toUpperCase();

    if (!studentId) {
      return NextResponse.json(
        { message: "studentId required hai" },
        { status: 400 }
      );
    }

    await connectDB();

    const student = await Student.findOne({
      studentId,
      isActive: true,
    })
      .select("name studentId courseStatus profileImage _id")
      .lean() as any;

    if (!student) {
      return NextResponse.json(
        { message: "Student nahi mila. ID check karo." },
        { status: 404 }
      );
    }

    if (student.courseStatus !== "active") {
      return NextResponse.json(
        { message: "Student active nahi hai." },
        { status: 403 }
      );
    }

    const enrollment = await Enrollment.findOne({
      student: student._id,
      isActive: true,
    })
      .populate("course", "name")
      .lean() as any;

    if (!enrollment) {
      return NextResponse.json(
        { message: "Koi active enrollment nahi mili." },
        { status: 404 }
      );
    }

    const attDoc = await Attendance.findOne({
      student: student._id,
      enrollment: enrollment._id,
    }).lean() as any;

    const todayRecord = attDoc ? findTodayRecord(attDoc.records) : null;

    return NextResponse.json({
      success: true,
      student: {
        name: student.name,
        studentId: student.studentId,
        courseName: (enrollment.course as any)?.name ?? "—",
      },
      today: {
        hasInTime: !!todayRecord?.inTime,
        hasOutTime: !!todayRecord?.outTime,
        inTime: todayRecord?.inTime ?? null,
        outTime: todayRecord?.outTime ?? null,
        status: todayRecord?.status ?? null,
      },
    });
  } catch (error) {
    console.error("[GET /api/attendance/scan]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ════════════════════════════════════════════════════════════════
// POST → IN/OUT mark (UPDATED - no late detection)
// ════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: "Too many requests." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { studentId, action } = body as {
      studentId: string;
      action: "in" | "out";
    };

    if (!studentId || !action || !["in", "out"].includes(action)) {
      return NextResponse.json(
        { message: "studentId aur action (in/out) required hain" },
        { status: 400 }
      );
    }

    await connectDB();

    const student = await Student.findOne({
      studentId: studentId.trim().toUpperCase(),
      isActive: true,
    }).lean() as any;

    if (!student) {
      return NextResponse.json(
        { message: "Student nahi mila" },
        { status: 404 }
      );
    }

    const enrollment = await Enrollment.findOne({
      student: student._id,
      isActive: true,
    })
      .populate("course", "name _id")
      .lean() as any;

    if (!enrollment) {
      return NextResponse.json(
        { message: "Active enrollment nahi mili" },
        { status: 404 }
      );
    }

    const currentTime = getCurrentTime();
    const today = getTodayDate();
    const courseId = (enrollment.course as any)?._id;

    // ── Upsert attendance doc ──────────────────────────────────
    await Attendance.findOneAndUpdate(
      { student: student._id, enrollment: enrollment._id },
      {
        $setOnInsert: {
          student: student._id,
          enrollment: enrollment._id,
          course: courseId,
          records: [],
        },
      },
      { upsert: true, new: true }
    );

    const attDoc = await Attendance.findOne({
      student: student._id,
      enrollment: enrollment._id,
    });

    if (!attDoc) {
      return NextResponse.json(
        { message: "Attendance doc create nahi hua" },
        { status: 500 }
      );
    }

    const todayIdx = attDoc.records.findIndex((r: any) => {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    // ── IN Action ──────────────────────────────────────────────
    if (action === "in") {
      if (todayIdx >= 0) {
        const existing = attDoc.records[todayIdx];
        if (existing.inTime) {
          return NextResponse.json({
            success: false,
            message: `Aap pehle se IN mark ho chuke ho (${existing.inTime})`,
            alreadyMarked: true,
            inTime: existing.inTime,
          });
        }
        // Record hai but inTime nahi - update
        attDoc.records[todayIdx].inTime = currentTime;
        attDoc.records[todayIdx].markedVia = "qr";
        // Status already set hoga (manual se) - don't change
      } else {
        // ── CHANGE: Default status = "present" ────────────────
        // Admin/Teacher baad me late/absent kar sakta hai
        attDoc.records.push({
          date: today,
          status: "present", // ← Always present on QR scan
          inTime: currentTime,
          markedVia: "qr",
        } as any);
      }

      attDoc.markModified("records");
      await attDoc.save();

      return NextResponse.json({
        success: true,
        action: "in",
        time: currentTime,
        message: `✅ Welcome ${student.name}! IN time: ${currentTime}`,
        student: {
          name: student.name,
          studentId: student.studentId,
        },
      });
    }

    // ── OUT Action ─────────────────────────────────────────────
    if (action === "out") {
      if (todayIdx === -1 || !attDoc.records[todayIdx].inTime) {
        return NextResponse.json({
          success: false,
          message: "Pehle IN mark karo phir OUT kar sakte ho",
        });
      }

      const existing = attDoc.records[todayIdx];

      if (existing.outTime) {
        return NextResponse.json({
          success: false,
          message: `Aap pehle se OUT mark ho chuke ho (${existing.outTime})`,
          alreadyMarked: true,
          outTime: existing.outTime,
        });
      }

      attDoc.records[todayIdx].outTime = currentTime;
      attDoc.markModified("records");
      await attDoc.save();

      // Duration calculate
      const inParts = existing.inTime!.split(":").map(Number);
      const outParts = currentTime.split(":").map(Number);
      const inMins = inParts[0] * 60 + inParts[1];
      const outMins = outParts[0] * 60 + outParts[1];
      const duration = outMins - inMins;
      const hours = Math.floor(duration / 60);
      const mins = duration % 60;

      return NextResponse.json({
        success: true,
        action: "out",
        time: currentTime,
        duration: `${hours}h ${mins}m`,
        message: `👋 Goodbye ${student.name}! Duration: ${hours}h ${mins}m`,
        student: {
          name: student.name,
          studentId: student.studentId,
        },
      });
    }
  } catch (error) {
    console.error("[POST /api/attendance/scan]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}