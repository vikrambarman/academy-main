/**
 * FILE: src/app/api/student/notes/route.ts
 * GET → student ke accessible notes (enrolled + shared)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import { Types } from "mongoose";
import "@/models/Course";

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

        const student = await Student.findOne({ user: (user as any)._id }).lean();
        if (!student) {
            return NextResponse.json({ error: "Student nahi mila" }, { status: 404 });
        }

        const studentObjectId = (student as any)._id;

        const enrollments = await Enrollment.find({
            student: studentObjectId,
            isActive: true,
        })
            .populate("course", "name slug")
            .lean() as unknown as PopulatedEnrollment[];

        if (!enrollments.length) {
            return NextResponse.json({
                success: true,
                data: [],
                message: "Kisi course mein enrolled nahi hai",
            });
        }

        const enrolledCourseSlugs: string[] = enrollments
            .filter(e => e.course !== null && typeof e.course.slug === "string")
            .map(e => e.course!.slug);

        if (!enrolledCourseSlugs.length) {
            return NextResponse.json({ success: true, data: [] });
        }

        // ── New query: enrolled course + shared course + direct student share ──
        // Backward compatible — purane notes jo sirf courseSlug se linked hain
        // woh pehli condition se hi mil jaate hain
        const notes = await Note.find({
            isPublished: true,
            $or: [
                { courseSlug: { $in: enrolledCourseSlugs } },   // original logic
                { sharedWithCourses: { $in: enrolledCourseSlugs } },   // shared course
                { sharedWithStudents: studentObjectId },                // direct share
            ],
        }).lean();

        // Course name lookup
        const courseMap: Record<string, string> = {};
        enrollments.forEach(e => {
            if (e.course?.slug) courseMap[e.course.slug] = e.course.name;
        });

        // Group: courseSlug → moduleSlug → notes[]
        const grouped: Record<string, {
            courseName: string;
            courseSlug: string;
            isShared: boolean;
            modules: Record<string, {
                moduleName: string;
                moduleSlug: string;
                notes: {
                    _id: Types.ObjectId;
                    title: string;
                    topicSlug: string;
                    order: number;
                    updatedAt: Date;
                    isDirectShare: boolean;
                }[];
            }>;
        }> = {};

        for (const note of notes as any[]) {
            const { courseSlug, moduleSlug, moduleName } = note;

            const isEnrolledCourse = enrolledCourseSlugs.includes(courseSlug);

            const isSharedCourse = !isEnrolledCourse && (note.sharedWithCourses || []).some(
                (s: string) => enrolledCourseSlugs.includes(s)
            );

            const isDirectShare = (note.sharedWithStudents || []).some(
                (sid: any) => sid.toString() === studentObjectId.toString()
            );

            const courseName =
                courseMap[courseSlug] ||
                (isSharedCourse ? `${courseSlug} (Shared)` : courseSlug);

            if (!grouped[courseSlug]) {
                grouped[courseSlug] = {
                    courseName,
                    courseSlug,
                    isShared: isSharedCourse || (isDirectShare && !isEnrolledCourse),
                    modules: {},
                };
            }

            if (!grouped[courseSlug].modules[moduleSlug]) {
                grouped[courseSlug].modules[moduleSlug] = {
                    moduleName: (isSharedCourse || isDirectShare)
                        ? (note.sharedModuleNames?.[
                            // Jo enrolled course match karta hai uska module name lo
                            enrolledCourseSlugs.find(s =>
                                (note.sharedWithCourses || []).includes(s)
                            ) || courseSlug
                        ] || moduleName)
                        : moduleName,
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
                isDirectShare: isDirectShare && !isEnrolledCourse,
            });
        }

        const data = Object.values(grouped).map(course => ({
            ...course,
            modules: Object.values(course.modules).map(mod => ({
                ...mod,
                notes: mod.notes.sort((a, b) => a.order - b.order),
            })),
        }));

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("GET /api/student/notes error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}