/**
 * FILE: src/app/api/admin/notes/[id]/route.ts
 * Next.js 16+ async params + proper TypeScript types
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import { slugify } from "@/lib/slugify";

const NOTES_BASE = path.join(process.cwd(), "src", "content", "notes");

/**
 * GET /api/admin/notes/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await connectDB();

        const note = await Note.findById(id).lean() as any;
        if (!note) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        const absolutePath = path.join(
            NOTES_BASE,
            note.courseSlug as string,
            note.moduleSlug as string,
            `${note.topicSlug as string}.md`
        );

        const content = fs.existsSync(absolutePath)
            ? fs.readFileSync(absolutePath, "utf8")
            : "";

        return NextResponse.json({ success: true, note, content });

    } catch (error) {
        console.error("GET /api/admin/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * PUT /api/admin/notes/[id]
 * Body: { content?, moduleName?, topicName?, isPublished?, order? }
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await connectDB();

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        const body = await request.json();
        const {
            content,
            moduleName,
            topicName,
            isPublished,
            order,
        }: {
            content?: string;
            moduleName?: string;
            topicName?: string;
            isPublished?: boolean;
            order?: number;
        } = body;

        // Agar topicName ya moduleName change hua toh file rename/move
        if (topicName || moduleName) {
            const oldPath = path.join(
                NOTES_BASE,
                note.courseSlug,
                note.moduleSlug,
                `${note.topicSlug}.md`
            );

            const newModuleSlug = moduleName ? slugify(moduleName) : note.moduleSlug;
            const newTopicSlug = topicName ? slugify(topicName) : note.topicSlug;

            const newPath = path.join(
                NOTES_BASE,
                note.courseSlug,
                newModuleSlug,
                `${newTopicSlug}.md`
            );

            fs.mkdirSync(path.dirname(newPath), { recursive: true });

            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
            } else {
                fs.writeFileSync(newPath, content ?? "", "utf8");
            }

            note.moduleSlug = newModuleSlug;
            note.moduleName = moduleName ?? note.moduleName;
            note.topicSlug = newTopicSlug;
            note.topicName = topicName ?? note.topicName;
            note.title = topicName ?? note.title;
            note.filePath = `notes/${note.courseSlug}/${newModuleSlug}/${newTopicSlug}.md`;
        }

        // Content update
        if (content !== undefined) {
            const absolutePath = path.join(
                NOTES_BASE,
                note.courseSlug,
                note.moduleSlug,
                `${note.topicSlug}.md`
            );
            fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
            fs.writeFileSync(absolutePath, content, "utf8");
        }

        // Metadata update
        if (isPublished !== undefined) note.isPublished = isPublished;
        if (order !== undefined) note.order = order;

        await note.save();

        return NextResponse.json({ success: true, note });

    } catch (error) {
        console.error("PUT /api/admin/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/notes/[id]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await connectDB();

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        const absolutePath = path.join(
            NOTES_BASE,
            note.courseSlug,
            note.moduleSlug,
            `${note.topicSlug}.md`
        );

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);

            // Khali module folder bhi delete karo
            const moduleDir = path.dirname(absolutePath);
            const remaining = fs.readdirSync(moduleDir);
            if (remaining.length === 0) fs.rmdirSync(moduleDir);
        }

        await Note.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Note delete ho gaya" });

    } catch (error) {
        console.error("DELETE /api/admin/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}