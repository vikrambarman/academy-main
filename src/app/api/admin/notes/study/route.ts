/**
 * GET /api/admin/notes/study
 * - No params  → Active courses list
 * - ?courseSlug → Modules + notes (published + draft dono)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import Course from "@/models/Course";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message))
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const courseSlug = searchParams.get("courseSlug");

        // ── No params: return courses list ──
        if (!courseSlug) {
            const courses = await Course.find({ isActive: true })
                .select("name slug")
                .sort({ name: 1 })
                .lean();
            return NextResponse.json({ success: true, courses });
        }

        // ── Course verify ──
        const course = await Course.findOne({ slug: courseSlug })
            .select("name slug")
            .lean() as any;
        if (!course)
            return NextResponse.json({ error: "Course nahi mila" }, { status: 404 });

        // ── Notes fetch — published + draft dono ──
        const notes = await Note.find({ courseSlug })
            .select("-content")
            .sort({ moduleSlug: 1, order: 1 })
            .lean() as any[];

        // ── Group by module ──
        const moduleMap: Record<string, { moduleName: string; moduleSlug: string; notes: any[] }> = {};
        for (const note of notes) {
            const { moduleSlug, moduleName } = note;
            if (!moduleMap[moduleSlug])
                moduleMap[moduleSlug] = { moduleName, moduleSlug, notes: [] };
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

    } catch (e: any) { return handleError(e, "GET /api/admin/notes/study"); }
}