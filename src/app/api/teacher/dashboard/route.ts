// src/app/api/teacher/dashboard/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";
import Note from "@/models/Note";
import Teacher from "@/models/Teacher";

export async function GET() {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        // ── 1. Teacher info ──
        const teacher = await Teacher.findOne({ user: user._id })
            .select("name employeeId")
            .lean();

        // ── 2. All active courses — single query ──
        const courses = await Course.find({ isActive: true })
            .select("_id name slug")
            .sort({ name: 1 })
            .lean();

        const courseIds = courses.map(c => c._id);

        // ── 3. All active enrollments for all courses — single query ──
        const enrollments = await Enrollment.find({
            course: { $in: courseIds },
            isActive: true,
        })
            .populate({ path: "student", select: "name studentId isActive courseStatus" })
            .lean();

        // Filter: purane records mein missing field ko active maano
        const activeEnrollments = enrollments.filter((e: any) => {
            if (!e.student) return false;
            const isActive     = e.student.isActive     ?? true;
            const courseStatus = e.student.courseStatus ?? "active";
            return isActive && courseStatus === "active";
        });

        const enrollmentIds = activeEnrollments.map(e => e._id);

        // ── 4. All attendance docs — single query ──
        const today = new Date();
        const attDocs = await Attendance.find({
            enrollment: { $in: enrollmentIds },
        })
            .select("enrollment records")
            .lean();

        // Build enrollmentId → todayRecord map
        const attMap: Record<string, string | null> = {};
        for (const doc of attDocs) {
            const todayRecord = (doc.records ?? []).find((r: any) => {
                return new Date(r.date).toDateString() === today.toDateString();
            });
            attMap[doc.enrollment.toString()] = todayRecord?.status ?? null;
        }

        // ── 5. Notes count — single query ──
        const totalNotes = await Note.countDocuments();

        // ── 6. Compute stats ──
        let todayPresent = 0, todayAbsent = 0, notMarked = 0;

        for (const enr of activeEnrollments) {
            const status = attMap[enr._id.toString()];
            if (!status)                                      notMarked++;
            else if (status === "present" || status === "late") todayPresent++;
            else if (status === "absent")                       todayAbsent++;
        }

        // ── 7. Per-course student count (for courses list) ──
        const courseStudentMap: Record<string, number> = {};
        for (const enr of activeEnrollments) {
            const cId = enr.course.toString();
            courseStudentMap[cId] = (courseStudentMap[cId] ?? 0) + 1;
        }

        const coursesWithCount = courses.map((c: any) => ({
            ...c,
            studentCount: courseStudentMap[c._id.toString()] ?? 0,
        }));

        return NextResponse.json({
            teacher,
            stats: {
                totalStudents:  activeEnrollments.length,
                todayPresent,
                todayAbsent,
                notMarkedToday: notMarked,
                activeCourses:  courses.length,
                totalNotes,
            },
            courses: coursesWithCount,
        });

    } catch (e) {
        console.error("TEACHER DASHBOARD ERROR:", e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}