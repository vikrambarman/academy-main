/**
 * FILE: src/app/api/admin/notes/[id]/route.ts
 * GET    → single note (with content)
 * PUT    → update note
 * DELETE → delete note
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import { slugify } from "@/lib/slugify";

// ─── GET /api/admin/notes/[id] ───────────────────────────────────────────────
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

        return NextResponse.json({
            success: true,
            note: {
                _id:         note._id,
                title:       note.title,
                courseSlug:  note.courseSlug,
                moduleSlug:  note.moduleSlug,
                moduleName:  note.moduleName,
                topicSlug:   note.topicSlug,
                topicName:   note.topicName,
                isPublished: note.isPublished,
                order:       note.order,
                updatedAt:   note.updatedAt,
            },
            content: note.content || "",
        });

    } catch (error) {
        console.error("GET /api/admin/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// ─── PUT /api/admin/notes/[id] ───────────────────────────────────────────────
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

        const body = await request.json();
        const {
            moduleName,
            topicName,
            content,
            isPublished,
            order,
        } = body;

        // Jo fields aaye sirf wahi update karo
        const updateData: Record<string, any> = {};

        if (moduleName  !== undefined) {
            updateData.moduleName  = moduleName;
            updateData.moduleSlug  = slugify(moduleName);
        }
        if (topicName   !== undefined) {
            updateData.topicName   = topicName;
            updateData.topicSlug   = slugify(topicName);
            updateData.title       = topicName;   // title = topicName
        }
        if (content     !== undefined) updateData.content     = content;
        if (isPublished !== undefined) updateData.isPublished = isPublished;
        if (order       !== undefined) updateData.order       = order;

        const updated = await Note.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, lean: true }
        ) as any;

        if (!updated) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        return NextResponse.json({ success: true, note: updated });

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

// ─── DELETE /api/admin/notes/[id] ────────────────────────────────────────────
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

        const deleted = await Note.findByIdAndDelete(id).lean();
        if (!deleted) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Note delete ho gaya" });

    } catch (error) {
        console.error("DELETE /api/admin/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}