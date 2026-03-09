/**
 * FILE: src/app/api/admin/notes/[id]/route.ts
 * GET    → single note (content ke saath)
 * PUT    → update note
 * DELETE → note delete
 *
 * NOTE: fs remove kar diya — Vercel pe kaam nahi karta.
 *       Content MongoDB ke `content` field se aata hai.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import { slugify } from "@/lib/slugify";

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

        // Content MongoDB mein hai — seedha return karo
        const { content, ...noteMeta } = note;

        return NextResponse.json({ success: true, note: noteMeta, content: content ?? "" });

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

        // Module / topic name change hone par slugs update karo
        if (moduleName) {
            note.moduleName = moduleName;
            note.moduleSlug = slugify(moduleName);
        }
        if (topicName) {
            note.topicName = topicName;
            note.topicSlug = slugify(topicName);
            note.title = topicName;
        }

        // Content update — MongoDB mein save
        if (content !== undefined) {
            note.content = content;
        }

        if (isPublished !== undefined) note.isPublished = isPublished;
        if (order !== undefined) note.order = order;

        // filePath legacy field clear kar do (ab zaroorat nahi)
        note.filePath = undefined;

        await note.save();

        return NextResponse.json({ success: true, note });

    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Is module+topic ka note already exist karta hai" },
                { status: 409 }
            );
        }
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

        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Note delete ho gaya" });

    } catch (error) {
        console.error("DELETE /api/admin/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}