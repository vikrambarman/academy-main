/**
 * FILE: src/app/api/admin/notes/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import Course from "@/models/Course";
import { slugify } from "@/lib/slugify";

// GET /api/admin/notes?courseSlug=dca
export async function GET(request: NextRequest) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const courseSlug = searchParams.get("courseSlug");

        let notes: any[] = [];

        if (courseSlug) {
            // Primary notes + shared notes dono fetch karo
            notes = await Note.find({
                $or: [
                    { courseSlug },
                    { sharedWithCourses: courseSlug },
                ],
            })
                .select("-content")
                .populate("sharedWithStudents", "name studentId")  // ← populate karo
                .sort({ moduleSlug: 1, order: 1 })
                .lean();

            // Shared notes ko mark karo
            notes = notes.map(note => ({
                ...note,
                isSharedNote: note.courseSlug !== courseSlug,
                displayModuleName: note.courseSlug !== courseSlug
                    ? (note.sharedModuleNames?.[courseSlug] || note.moduleName)
                    : note.moduleName,
            }));
        } else {
            notes = await Note.find({})
                .select("-content")
                .sort({ courseSlug: 1, moduleSlug: 1, order: 1 })
                .lean();
        }

        return NextResponse.json({ success: true, notes });

    } catch (error) {
        console.error("GET /api/admin/notes error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST /api/admin/notes
export async function POST(request: NextRequest) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const {
            courseSlug,
            moduleName,
            topicName,
            content = "",
            isPublished = false,
            order = 0,
        }: {
            courseSlug: string;
            moduleName: string;
            topicName: string;
            content?: string;
            isPublished?: boolean;
            order?: number;
        } = body;

        if (!courseSlug || !moduleName || !topicName) {
            return NextResponse.json(
                { error: "courseSlug, moduleName aur topicName required hain" },
                { status: 400 }
            );
        }

        const course = await Course.findOne({ slug: courseSlug }).lean();
        if (!course) {
            return NextResponse.json({ error: "Course nahi mila" }, { status: 404 });
        }

        const note = await Note.create({
            title: topicName,
            courseSlug,
            moduleSlug: slugify(moduleName),
            moduleName,
            topicSlug: slugify(topicName),
            topicName,
            content,
            order,
            isPublished,
            createdBy: (user as any)._id,
        });

        return NextResponse.json({ success: true, note }, { status: 201 });

    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Is course+module+topic ka note already exist karta hai" },
                { status: 409 }
            );
        }
        console.error("POST /api/admin/notes error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}