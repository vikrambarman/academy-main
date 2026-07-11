import { NextRequest, NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance     from "@/models/Attendance";
import Enrollment     from "@/models/Enrollment";
import Course         from "@/models/Course";

import "@/models/Student";

type AttendanceStatus =
  | "present" | "absent" | "late" | "holiday" | "leave";

interface BulkRecord {
  enrollmentId: string;
  studentId:    string;
  courseId:     string;
  status:       AttendanceStatus;
  remark?:      string;
  inTime?:      string;
  outTime?:     string;
  markedVia?:   "qr" | "manual";
}

async function requireTeacher() {
  const user = await verifyUser() as any;
  if (!user || user.role !== "teacher") throw new Error("UNAUTHORIZED");
  return user;
}

function handleError(error: any, context: string): NextResponse {
  const authErrors = ["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"];
  if (authErrors.includes(error?.message)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  console.error(`[${context}]`, error?.message ?? error);
  return NextResponse.json({ message: "Server error" }, { status: 500 });
}

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

function buildStats(records: any[]) {
  const stats = {
    total: 0, present: 0, absent: 0,
    late: 0, holiday: 0, leave: 0, percentage: 0,
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
  const counted = stats.total - stats.holiday - stats.leave;
  stats.percentage = counted > 0
    ? Math.round(((stats.present + stats.late) / counted) * 100)
    : 0;
  return stats;
}

function buildDailyStats(allDocs: any[]) {
  const dayMap: Record<string, {
    date: string;
    present: number; absent: number; late: number;
    holiday: number; leave: number; total: number;
  }> = {};

  for (const doc of allDocs) {
    for (const r of doc.records ?? []) {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().split("T")[0];
      if (!dayMap[key]) {
        dayMap[key] = {
          date: key, present: 0, absent: 0,
          late: 0, holiday: 0, leave: 0, total: 0,
        };
      }
      dayMap[key].total++;
      switch (r.status) {
        case "present": dayMap[key].present++; break;
        case "absent":  dayMap[key].absent++;  break;
        case "late":    dayMap[key].late++;    break;
        case "holiday": dayMap[key].holiday++; break;
        case "leave":   dayMap[key].leave++;   break;
      }
    }
  }

  return Object.values(dayMap).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function findTodayRecord(
  records: any[],
  dateStr: string | undefined
): any | null {
  if (!dateStr) return null;
  const target = parseDate(dateStr);
  return records.find((r) => isSameDay(new Date(r.date), target)) ?? null;
}

/* ═══════════════════════════════════════════
   GET
   ═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await requireTeacher();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const date     = searchParams.get("date") ?? undefined;

    /* ── courseId diya: Mark tab ── */
    if (courseId) {
      const enrollments = await Enrollment.find({
        course:   courseId,
        isActive: true,
      })
        .populate(
          "student",
          // ✅ studentId bhi select karo - yeh Student model ka custom field hai
          "name studentId _id isActive courseStatus"
        )
        .lean() as any[];

      const activeEnrollments = enrollments.filter((enr) => {
        const s = enr.student;
        if (!s) return false;
        if (s.isActive === false) return false;
        if (["completed", "dropped"].includes(s.courseStatus)) return false;
        return true;
      });

      const enrollmentIds = activeEnrollments.map((e) => e._id);

      const attDocs = await Attendance.find({
        enrollment: { $in: enrollmentIds },
      }).lean() as any[];

      const attMap: Record<string, any> = {};
      for (const doc of attDocs) {
        attMap[String(doc.enrollment)] = doc;
      }

      const attendance = activeEnrollments.map((enr) => {
        const doc      = attMap[String(enr._id)];
        const records  = doc?.records ?? [];
        const todayRec = findTodayRecord(records, date);

        return {
          enrollmentId: String(enr._id),
          // ✅ FIX: Student._id (MongoDB ObjectId) - Attendance doc create ke liye
          studentDbId:  String(enr.student?._id ?? ""),
          stats:        buildStats(records),
          todayRecord:  todayRec
            ? {
                status:    todayRec.status,
                remark:    todayRec.remark    ?? "",
                inTime:    todayRec.inTime    ?? null,
                outTime:   todayRec.outTime   ?? null,
                markedVia: todayRec.markedVia ?? "manual",
              }
            : null,
        };
      });

      const dailyStats = buildDailyStats(attDocs);

      return NextResponse.json({
        // ✅ Enrollments mein student object poora aata hai
        // Frontend: enr.student._id    → MongoDB ObjectId
        // Frontend: enr.student.studentId → "STU001" custom field
        // Frontend: enr.student.name   → "Rahul Sharma"
        enrollments:   activeEnrollments,
        attendance,
        dailyStats,
        totalStudents: activeEnrollments.length,
      });
    }

    /* ── courseId nahi: Overview ── */
    const courses = await Course.find({ isActive: true })
      .select("name _id")
      .lean() as any[];

    const allEnrollments = await Enrollment.find({ isActive: true })
      .populate(
        "student",
        // ✅ studentId bhi select karo
        "name studentId _id isActive courseStatus"
      )
      .populate("course", "name _id")
      .lean() as any[];

    const activeEnrollments = allEnrollments.filter((e) => {
      const s = e.student as any;
      if (!s || s.isActive === false) return false;
      if (["completed", "dropped"].includes(s.courseStatus)) return false;
      return true;
    });

    const attDocs = await Attendance.find()
      .populate("course", "name _id")
      .lean() as any[];

    const attByEnrollment: Record<string, any> = {};
    for (const doc of attDocs) {
      attByEnrollment[String(doc.enrollment)] = doc;
    }

    const overviewDocs = activeEnrollments.map((e) => {
      const attDoc  = attByEnrollment[String(e._id)] ?? null;
      const records = attDoc?.records ?? [];
      const student = e.student as any;
      const course  = e.course  as any;

      return {
        enrollmentId: String(e._id),
        student: {
          _id:       String(student?._id ?? ""),
          name:      student?.name      ?? "—",
          // ✅ FIX: student.studentId → Student model ka custom field
          studentId: student?.studentId ?? "—",
        },
        course: {
          _id:  String(course?._id ?? ""),
          name: course?.name ?? "—",
        },
        stats:        buildStats(records),
        hasAttendance: !!attDoc,
        records,
      };
    });

    const countMap: Record<string, number> = {};
    for (const e of activeEnrollments) {
      const cid = String((e.course as any)?._id ?? "");
      if (cid) countMap[cid] = (countMap[cid] || 0) + 1;
    }

    const courseSummary = courses.map((c: any) => ({
      _id:          c._id,
      name:         c.name,
      studentCount: countMap[String(c._id)] || 0,
    }));

    const dailyStats = buildDailyStats(attDocs);

    const courseDailyMap: Record<string, any[]> = {};
    for (const doc of attDocs) {
      const cid = String((doc.course as any)?._id ?? "");
      if (!courseDailyMap[cid]) courseDailyMap[cid] = [];
      courseDailyMap[cid].push(doc);
    }

    const courseDailyStats = Object.entries(courseDailyMap).map(
      ([cid, cdocs]) => ({
        courseId:      cid,
        courseName:    (cdocs[0]?.course as any)?.name ?? "—",
        totalStudents: countMap[cid] ?? 0,
        daily:         buildDailyStats(cdocs),
      })
    );

    return NextResponse.json({
      attendance:       overviewDocs,
      courseSummary,
      dailyStats,
      courseDailyStats,
    });

  } catch (e: any) {
    return handleError(e, "GET /api/teacher/attendance");
  }
}

/* ═══════════════════════════════════════════
   POST — bulk mark
   ═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await requireTeacher();

    const { date, records } = await req.json() as {
      date:    string;
      records: BulkRecord[];
    };

    if (!date || !records?.length) {
      return NextResponse.json(
        { message: "date aur records required hain" },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { message: "date format YYYY-MM-DD hona chahiye" },
        { status: 400 }
      );
    }

    const targetDate = parseDate(date);

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

    // Step 1: Upsert attendance docs
    await Promise.all(
      records.map(({ enrollmentId, studentId, courseId }) =>
        Attendance.updateOne(
          { enrollment: enrollmentId },
          {
            $setOnInsert: {
              // ✅ studentId yahan Student._id (MongoDB ObjectId) hai
              student:    studentId,
              enrollment: enrollmentId,
              course:     courseId,
              records:    [],
            },
          },
          { upsert: true }
        )
      )
    );

    // Step 2: Update records
    await Promise.all(
      records.map(async ({
        enrollmentId, status, remark, inTime, outTime, markedVia,
      }) => {
        const att = await Attendance.findOne({ enrollment: enrollmentId });
        if (!att) return;

        const idx = att.records.findIndex((r: any) =>
          isSameDay(new Date(r.date), targetDate)
        );

        if (idx >= 0) {
          att.records[idx].date      = targetDate;
          att.records[idx].status    = status;
          att.records[idx].remark    = remark?.trim() ?? "";
          att.records[idx].markedVia = markedVia ?? "manual";

          if (["present", "late"].includes(status)) {
            if (inTime)  att.records[idx].inTime  = inTime;
            if (outTime) att.records[idx].outTime = outTime;
          } else {
            att.records[idx].inTime  = undefined;
            att.records[idx].outTime = undefined;
          }
        } else {
          const newRecord: Record<string, any> = {
            date:      targetDate,
            status,
            remark:    remark?.trim() ?? "",
            markedVia: markedVia ?? "manual",
          };

          if (["present", "late"].includes(status)) {
            if (inTime)  newRecord.inTime  = inTime;
            if (outTime) newRecord.outTime = outTime;
          }

          att.records.push(newRecord as any);
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
   PATCH — single record update
   ═══════════════════════════════════════════ */
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    await requireTeacher();

    const {
      enrollmentId, date, status,
      remark, inTime, outTime, markedVia,
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

    if (idx >= 0) {
      att.records[idx].date      = targetDate;
      att.records[idx].status    = status;
      att.records[idx].remark    = remark?.trim() ?? "";
      att.records[idx].markedVia = markedVia ?? "manual";

      if (["present", "late"].includes(status)) {
        if (inTime)  att.records[idx].inTime  = inTime;
        if (outTime) att.records[idx].outTime = outTime;
      } else {
        att.records[idx].inTime  = undefined;
        att.records[idx].outTime = undefined;
      }
    } else {
      const newRecord: Record<string, any> = {
        date:      targetDate,
        status,
        remark:    remark?.trim() ?? "",
        markedVia: markedVia ?? "manual",
      };

      if (["present", "late"].includes(status)) {
        if (inTime)  newRecord.inTime  = inTime;
        if (outTime) newRecord.outTime = outTime;
      }

      att.records.push(newRecord as any);
    }

    att.markModified("records");
    await att.save();

    return NextResponse.json({ message: "Record updated ✓" });

  } catch (e: any) {
    return handleError(e, "PATCH /api/teacher/attendance");
  }
}