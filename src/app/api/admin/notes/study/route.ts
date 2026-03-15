/**
 * FILE: src/app/api/teacher/notes/route.ts
 * GET → Teacher/Admin ke liye sabhi courses ke notes
 *       (published + draft dono, enrollment restriction nahi)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import Course from "@/models/Course";

export async function GET(request: NextRequest) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const courseSlug = searchParams.get("courseSlug");

        if (!courseSlug) {
            // Sirf courses list return karo
            const courses = await Course.find({ isActive: true })
                .select("name slug")
                .sort({ name: 1 })
                .lean();
            return NextResponse.json({ success: true, courses });
        }

        // Course verify karo
        const course = await Course.findOne({ slug: courseSlug }).lean() as any;
        if (!course) {
            return NextResponse.json({ error: "Course nahi mila" }, { status: 404 });
        }

        // Published + Draft dono fetch karo (no isPublished filter)
        const notes = await Note.find({ courseSlug })
            .select("-content")
            .sort({ moduleSlug: 1, order: 1 })
            .lean();

        // Group: moduleSlug → notes[]
        const moduleMap: Record<string, {
            moduleName: string;
            moduleSlug: string;
            notes: any[];
        }> = {};

        for (const note of notes as any[]) {
            const { moduleSlug, moduleName } = note;
            if (!moduleMap[moduleSlug]) {
                moduleMap[moduleSlug] = { moduleName, moduleSlug, notes: [] };
            }
            moduleMap[moduleSlug].notes.push({
                _id: note._id,
                title: note.title,
                topicSlug: note.topicSlug,
                order: note.order,
                isPublished: note.isPublished,
                updatedAt: note.updatedAt,
            });
        }

        return NextResponse.json({
            success: true,
            course: { name: course.name, slug: course.slug },
            modules: Object.values(moduleMap),
            total: notes.length,
        });

    } catch (error) {
        console.error("GET /api/admin/notes/study error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}