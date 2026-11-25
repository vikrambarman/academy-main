import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";

function getISTDate(date: Date = new Date()): Date {
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  const istDate = new Date(istMs);
  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth();
  const day = istDate.getUTCDate();
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}

function getISTDayOfWeek(date: Date = new Date()): number {
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  const istDate = new Date(istMs);
  return istDate.getUTCDay();
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const today = getISTDate();
    const dayOfWeek = getISTDayOfWeek();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({
        success: true,
        message: "Weekend - no absent marking",
        skipped: true,
      });
    }

    const enrollments = await Enrollment.find({
      isActive: true,
    })
      .populate({
        path: "student",
        match: { isActive: true, courseStatus: "active" },
        select: "_id studentId name",
      })
      .lean() as any[];

    const activeEnrollments = enrollments.filter(e => e.student && e.student._id);

    if (activeEnrollments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active enrollments found",
        markedAbsent: 0,
      });
    }

    let markedAbsent = 0;
    let alreadyMarked = 0;
    let skipped = 0;

    for (const enrollment of activeEnrollments) {
      try {
        let attDoc = await Attendance.findOne({
          student: enrollment.student._id,
          enrollment: enrollment._id,
        });

        if (!attDoc) {
          attDoc = await Attendance.create({
            student: enrollment.student._id,
            enrollment: enrollment._id,
            course: enrollment.course,
            records: [],
          });
        }

        const todayIdx = attDoc.records.findIndex((r: any) => {
          const d = new Date(r.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        });

        if (todayIdx >= 0) {
          const record = attDoc.records[todayIdx];
          
          if (record.status === "holiday" || record.status === "leave") {
            skipped++;
            continue;
          }

          // If already marked (present/absent/rejected), skip
          if (record.status && record.status !== "pending") {
            alreadyMarked++;
            continue;
          }

          // If status is pending but no inTime, mark absent
          if (record.status === "pending" && !record.inTime) {
            record.status = "absent";
            record.markedVia = "cron";
            attDoc.markModified("records");
            await attDoc.save();
            markedAbsent++;
            continue;
          }

          // If has inTime but still pending at 9 PM, mark absent
          if (record.status === "pending" && record.inTime) {
            record.status = "absent";
            record.markedVia = "cron";
            record.remark = "Not verified by teacher";
            attDoc.markModified("records");
            await attDoc.save();
            markedAbsent++;
            continue;
          }

          alreadyMarked++;
        } else {
          // No record for today → create absent record
          attDoc.records.push({
            date: today,
            status: "absent",
            markedVia: "cron",
          } as any);
          attDoc.markModified("records");
          await attDoc.save();
          markedAbsent++;
        }
      } catch (err) {
        console.error(`Error processing enrollment ${enrollment._id}:`, err);
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Absent marking completed",
      date: today.toISOString().split("T")[0],
      totalActiveEnrollments: activeEnrollments.length,
      markedAbsent,
      alreadyMarked,
      skipped,
    });
  } catch (error) {
    console.error("[CRON /api/cron/mark-absent]", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}