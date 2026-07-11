/**
 * GET   /api/teacher/attendance?courseId=xxx&date=YYYY-MM-DD
 * POST  /api/teacher/attendance   — Bulk mark
 * PATCH /api/teacher/attendance   — Single record update
 *
 * ✅ FIXES:
 * - Date comparison timezone-safe (local midnight)
 * - enrollmentId vs studentId mismatch fixed
 * - markedVia field support added
 * - Student model import added
 * - Active student filter consistent with admin route
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance     from "@/models/Attendance";
import Enrollment     from "@/models/Enrollment";

/* Side-effect imports — register models */
import "@/models/Student";
import "@/models/Course";

/* ── Types ── */
type AttendanceStatus =
  | "present" | "absent" | "late" | "holiday" | "leave";

interface BulkRecord {
  enrollmentId: string;
  studentId:    string;  // Student._id
  courseId:     string;
  status:       AttendanceStatus;
  remark?:      string;
  markedVia?:   "qr" | "manual";
}

/* ── Auth helper ── */
async function requireTeacher() {
  const user = await verifyUser() as any;
  if (!user || user.role !== "teacher") {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/* ── Error handler ── */
function handleError(error: any, context: string): NextResponse {
  const authErrors = ["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"];
  if (authErrors.includes(error?.message)) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  console.error(`[${context}]`, error?.message ?? error);
  return NextResponse.json(
    { message: "Server error" },
    { status: 500 }
  );
}

/* ── Date helpers ── */

/**
 * "YYYY-MM-DD" → Date at local midnight
 * Avoids UTC shift issues
 */
function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

/* ── Stats builder ── */
function buildStats(records: any[]) {
  const stats = {
    total:      0,
    present:    0,
    absent:     0,
    late:       0,
    holiday:    0,
    leave:      0,
    percentage: 0,
  };

  for (const r of records ?? []) {
    stats.total++;
    switch (r.status) {
      case "present": stats.present++; break;
      case "absent":  stats.absent++;  break;
      case "late":    stats.late++;    break;
      case "holiday": stats.holiday++; break;
      case "leave":   stats.leave++;   break;
    }
  }

  /* holiday + leave don't count against percentage */
  const counted = stats.total - stats.holiday - stats.leave;
  stats.percentage = counted > 0
    ? Math.round(((stats.present + stats.late) / counted) * 100)
    : 0;

  return stats;
}

/* ── Today record finder ── */
function findTodayRecord(
  records: any[],
  dateStr: string | undefined
): any | null {
  if (!dateStr) return null;
  const target = parseDate(dateStr);
  return (
    records.find((r) => isSameDay(new Date(r.date), target)) ?? null
  );
}

/* ═══════════════════════════════════════════
   GET — load attendance for a course + date
   ═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await requireTeacher();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const date     = searchParams.get("date") ?? undefined;

    if (!courseId) {
      return NextResponse.json(
        { message: "courseId required hai" },
        { status: 400 }
      );
    }

    /* Active enrollments for this course */
    const enrollments = await Enrollment.find({
      course:   courseId,
      isActive: true,
    })
      .populate({
        path:   "student",
        select: "name studentId _id isActive courseStatus",
        /*
          ✅ match: null — server side filter karenge
          mongoose populate match aur lean() saath
          theek kaam nahi karta hamesha
        */
      })
      .lean() as any[];

    /* Filter: student active + not completed/dropped */
    const activeEnrollments = enrollments.filter((enr) => {
      const s = enr.student;
      if (!s) return false;
      if (s.isActive === false) return false;
      if (["completed", "dropped"].includes(s.courseStatus)) return false;
      return true;
    });

    const enrollmentIds = activeEnrollments.map((e) => e._id);

    /* Attendance docs for these enrollments */
    const attDocs = await Attendance.find({
      enrollment: { $in: enrollmentIds },
    }).lean() as any[];

    /* Build response */
    const attendance = attDocs.map((doc) => ({
      enrollmentId: doc.enrollment,   // Enrollment._id
      studentId:    doc.student,      // Student._id
      stats:        buildStats(doc.records),
      todayRecord:  findTodayRecord(doc.records, date),
    }));

    return NextResponse.json({
      enrollments: activeEnrollments,
      attendance,
    });

  } catch (e: any) {
    return handleError(e, "GET /api/teacher/attendance");
  }
}

/* ═══════════════════════════════════════════
   POST — bulk mark attendance
   ═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await requireTeacher();

    const body = await req.json() as {
      date:    string;
      records: BulkRecord[];
    };

    const { date, records } = body;

    if (!date || !records?.length) {
      return NextResponse.json(
        { message: "date aur records required hain" },
        { status: 400 }
      );
    }

    /* Validate date format */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { message: "date format YYYY-MM-DD hona chahiye" },
        { status: 400 }
      );
    }

    const targetDate = parseDate(date);

    /* Validate all statuses */
    const validStatuses: AttendanceStatus[] = [
      "present", "absent", "late", "holiday", "leave",
    ];

    for (const r of records) {
      if (!validStatuses.includes(r.status)) {
        return NextResponse.json(
          { message: `Invalid status: ${r.status}` },
          { status: 400 }
        );
      }
    }

    /* Step 1: Upsert attendance docs (create if not exists) */
    await Promise.all(
      records.map(({ enrollmentId, studentId, courseId }) =>
        Attendance.updateOne(
          { enrollment: enrollmentId },
          {
            $setOnInsert: {
              student:    studentId,     // Student._id  ✅
              enrollment: enrollmentId,  // Enrollment._id ✅
              course:     courseId,
              records:    [],
            },
          },
          { upsert: true }
        )
      )
    );

    /* Step 2: Update records for target date */
    await Promise.all(
      records.map(async ({
        enrollmentId, status, remark, markedVia,
      }) => {
        const att = await Attendance.findOne({
          enrollment: enrollmentId,
        });
        if (!att) return;

        const idx = att.records.findIndex((r: any) =>
          isSameDay(new Date(r.date), targetDate)
        );

        const recordData = {
          date:      targetDate,
          status,
          remark:    remark?.trim() ?? "",
          markedVia: markedVia ?? "manual",
        };

        if (idx >= 0) {
          /* Update existing record */
          att.records[idx] = {
            ...att.records[idx],
            ...recordData,
          };
        } else {
          /* Add new record */
          att.records.push(recordData);
        }

        att.markModified("records");
        await att.save();
      })
    );

    return NextResponse.json({
      message: "Attendance save ho gayi ✓",
      saved:   records.length,
    });

  } catch (e: any) {
    return handleError(e, "POST /api/teacher/attendance");
  }
}

/* ═══════════════════════════════════════════
   PATCH — single student record update
   ═══════════════════════════════════════════ */
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    await requireTeacher();

    const {
      enrollmentId,
      date,
      status,
      remark,
      markedVia,
    } = await req.json();

    if (!enrollmentId || !date || !status) {
      return NextResponse.json(
        { message: "enrollmentId, date, status required hain" },
        { status: 400 }
      );
    }

    const validStatuses: AttendanceStatus[] = [
      "present", "absent", "late", "holiday", "leave",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: `Invalid status: ${status}` },
        { status: 400 }
      );
    }

    const targetDate = parseDate(date);

    const att = await Attendance.findOne({ enrollment: enrollmentId });
    if (!att) {
      return NextResponse.json(
        { message: "Attendance document nahi mila" },
        { status: 404 }
      );
    }

    const idx = att.records.findIndex((r: any) =>
      isSameDay(new Date(r.date), targetDate)
    );

    const recordData = {
      date:      targetDate,
      status,
      remark:    remark?.trim() ?? "",
      markedVia: markedVia ?? "manual",
    };

    if (idx >= 0) {
      att.records[idx] = { ...att.records[idx], ...recordData };
    } else {
      att.records.push(recordData);
    }

    att.markModified("records");
    await att.save();

    return NextResponse.json({ message: "Record updated ✓" });

  } catch (e: any) {
    return handleError(e, "PATCH /api/teacher/attendance");
  }
}