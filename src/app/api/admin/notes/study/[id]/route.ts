/**
 * GET /api/admin/notes/study/[id]
 * Draft notes bhi accessible — no isPublished filter
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note           from "@/models/Note";

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

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        await requireAdmin();

        const { id } = await params;
        const note = await Note.findById(id).lean() as any;

        if (!note)
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });

        return NextResponse.json({
            success: true,
            note: {
                _id:         note._id,
                title:       note.title,
                moduleName:  note.moduleName,
                courseSlug:  note.courseSlug,
                isPublished: note.isPublished,
                updatedAt:   note.updatedAt,
            },
            content: note.content || "",
        });

    } catch (e: any) { return handleError(e, "GET /api/admin/notes/study/[id]"); }
}