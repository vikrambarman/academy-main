/**
 * FILE: src/app/api/teacher/notes/[id]/route.ts
 * GET → Single note content (teacher/admin)
 *       Draft notes bhi accessible hain
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "teacher") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        // isPublished check nahi — draft bhi milega
        const note = await Note.findById(id).lean() as any;
        if (!note) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            note: {
                _id: note._id,
                title: note.title,
                moduleName: note.moduleName,
                courseSlug: note.courseSlug,
                isPublished: note.isPublished,
                updatedAt: note.updatedAt,
            },
            content: note.content || "",
        });

    } catch (error) {
        console.error("GET /api/teacher/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}