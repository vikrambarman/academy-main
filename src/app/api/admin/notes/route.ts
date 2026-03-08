/**
 * FILE: src/app/api/admin/notes/route.ts
 * GET  → course ke saare notes list
 * POST → naya note create (.md file + DB entry)
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import Course from "@/models/Course";
import { slugify } from "@/lib/slugify";

const NOTES_BASE = path.join(process.cwd(), "src", "content", "notes");

/**
 * GET /api/admin/notes?courseSlug=dca
 */
export async function GET(request: NextRequest) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const courseSlug = searchParams.get("courseSlug");

        const query = courseSlug ? { courseSlug } : {};
        const notes = await Note.find(query)
            .sort({ courseSlug: 1, moduleSlug: 1, order: 1 })
            .lean();

        return NextResponse.json({ success: true, notes });

    } catch (error) {
        console.error("GET /api/admin/notes error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * POST /api/admin/notes
 * Body: { courseSlug, moduleName, topicName, content, isPublished, order }
 */
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

        const moduleSlug = slugify(moduleName);
        const topicSlug = slugify(topicName);
        const filePath = `notes/${courseSlug}/${moduleSlug}/${topicSlug}.md`;
        const absolutePath = path.join(
            NOTES_BASE,
            courseSlug,
            moduleSlug,
            `${topicSlug}.md`
        );

        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, content, "utf8");

        const note = await Note.create({
            title: topicName,
            courseSlug,
            moduleSlug,
            moduleName,
            topicSlug,
            topicName,
            filePath,
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