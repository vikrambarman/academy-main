// FILE: src/app/api/student/attendance/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import "@/models/Course";

export async function GET(request: NextRequest) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "student") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const student = await Student.findOne({ user: (user as any)._id }).lean() as any;
        if (!student) {
            return NextResponse.json({ error: "Student nahi mila" }, { status: 404 });
        }

        // Active enrollments with course name
        const enrollments = await Enrollment.find({
            student: student._id,
            isActive: true,
        })
            .populate("course", "name slug")
            .lean() as any[];

        if (!enrollments.length) {
            return NextResponse.json({ success: true, data: [] });
        }

        const enrollmentIds = enrollments.map((e: any) => e._id);

        // Attendance docs
        const attDocs = await Attendance.find({
            enrollment: { $in: enrollmentIds },
        }).lean() as any[];

        // Build response per attendance doc
        const data = attDocs.map((doc: any) => {
            // Find matching enrollment for course name
            const enrollment = enrollments.find(
                (e: any) => e._id.toString() === doc.enrollment.toString()
            );
            const courseName = (enrollment?.course as any)?.name ?? "—";

            // Compute stats
            const stats = {
                total: 0, present: 0, absent: 0,
                late: 0, holiday: 0, percentage: 0,
            };

            const records = (doc.records || []).map((r: any) => {
                stats.total++;
                if      (r.status === "present") stats.present++;
                else if (r.status === "absent")  stats.absent++;
                else if (r.status === "late")    stats.late++;
                else if (r.status === "holiday") stats.holiday++;
                return {
                    date:   r.date,
                    status: r.status,
                    remark: r.remark ?? "",
                };
            });

            // present + late = attended
            stats.percentage = stats.total > 0
                ? Math.round(((stats.present + stats.late) / stats.total) * 100)
                : 0;

            // Sort newest first
            records.sort((a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return {
                enrollmentId: doc.enrollment.toString(),
                courseName,
                stats,
                records,
            };
        });

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("GET /api/student/attendance error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}