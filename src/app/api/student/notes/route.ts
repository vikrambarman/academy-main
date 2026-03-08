/**
 * FILE: src/app/api/student/notes/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note, { INote } from "@/models/Note";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import { Types } from "mongoose";

// Populated enrollment type
interface PopulatedCourse {
    _id: Types.ObjectId;
    name: string;
    slug: string;
}

interface PopulatedEnrollment {
    _id: Types.ObjectId;
    student: Types.ObjectId;
    course: PopulatedCourse | null;
    isActive: boolean;
}

export async function GET(request: NextRequest) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "student") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Student record dhundo
        const student = await Student.findOne({ user: (user as any)._id }).lean();
        if (!student) {
            return NextResponse.json({ error: "Student nahi mila" }, { status: 404 });
        }

        // Student ke active enrollments
        const enrollments = await Enrollment.find({
            student: (student as any)._id,
            isActive: true,
        })
            .populate("course", "name slug")
            .lean() as unknown as PopulatedEnrollment[];

        // console.log("[student/notes] enrollments count:", enrollments.length);

        if (!enrollments.length) {
            return NextResponse.json({
                success: true,
                data: [],
                message: "Kisi course mein enrolled nahi hai",
            });
        }

        // Enrolled course slugs
        const enrolledCourseSlugs: string[] = enrollments
            .filter((e) => e.course !== null && typeof e.course.slug === "string")
            .map((e) => e.course!.slug);

        // console.log("[student/notes] enrolledCourseSlugs:", enrolledCourseSlugs);

        if (!enrolledCourseSlugs.length) {
            return NextResponse.json({ success: true, data: [] });
        }

        // ⚠️ isPublished filter HATAYA — debug ke liye
        // Pehle dekho koi bhi note mil raha hai ya nahi
        const allNotes = await Note.find({
            courseSlug: { $in: enrolledCourseSlugs },
        }).lean();

        // console.log("[student/notes] ALL notes (without isPublished filter):", allNotes.length);
        // console.log("[student/notes] note courseslugs in DB:", allNotes.map((n: any) => n.courseSlug));
        // console.log("[student/notes] published notes:", allNotes.filter((n: any) => n.isPublished).length);

        // Ab sirf published wale lo
        const notes = allNotes.filter((n: any) => n.isPublished);

        // Course name lookup
        const courseMap: Record<string, string> = {};
        enrollments.forEach((e) => {
            if (e.course?.slug) {
                courseMap[e.course.slug] = e.course.name;
            }
        });

        // Group: course → module → notes[]
        const grouped: Record<string, {
            courseName: string;
            courseSlug: string;
            modules: Record<string, {
                moduleName: string;
                moduleSlug: string;
                notes: {
                    _id: Types.ObjectId;
                    title: string;
                    topicSlug: string;
                    order: number;
                    updatedAt: Date;
                }[];
            }>;
        }> = {};

        for (const note of notes as any[]) {
            const { courseSlug, moduleSlug, moduleName } = note;

            if (!grouped[courseSlug]) {
                grouped[courseSlug] = {
                    courseName: courseMap[courseSlug] || courseSlug,
                    courseSlug,
                    modules: {},
                };
            }

            if (!grouped[courseSlug].modules[moduleSlug]) {
                grouped[courseSlug].modules[moduleSlug] = {
                    moduleName,
                    moduleSlug,
                    notes: [],
                };
            }

            grouped[courseSlug].modules[moduleSlug].notes.push({
                _id: note._id,
                title: note.title,
                topicSlug: note.topicSlug,
                order: note.order,
                updatedAt: note.updatedAt,
            });
        }

        const data = Object.values(grouped).map((course) => ({
            ...course,
            modules: Object.values(course.modules),
        }));

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("GET /api/student/notes error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}