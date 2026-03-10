// src/app/api/teacher/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import slugify from "slugify";

// GET ?courseSlug=xxx
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const courseSlug = searchParams.get("courseSlug");

        const query: any = {};
        if (courseSlug) query.courseSlug = courseSlug;

        const notes = await Note.find(query).sort({ order: 1, createdAt: -1 }).lean();
        return NextResponse.json({ notes });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST — create note
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { title, content, courseSlug, moduleSlug, topicSlug, isPublished, order } = await req.json();
        if (!title || !courseSlug || !moduleSlug || !topicSlug) {
            return NextResponse.json({ message: "title, courseSlug, moduleSlug, topicSlug required" }, { status: 400 });
        }

        const note = await Note.create({
            title,
            content: content ?? "",
            courseSlug,
            moduleSlug: moduleSlug || slugify(moduleSlug, { lower: true, strict: true }),
            topicSlug: topicSlug || slugify(topicSlug, { lower: true, strict: true }),
            isPublished: isPublished ?? false,
            order: order ?? 0,
        });

        return NextResponse.json({ message: "Note create ho gaya", note }, { status: 201 });

    } catch (e: any) {
        if (e.code === 11000) return NextResponse.json({ message: "Yeh note already exist karta hai" }, { status: 400 });
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PUT — update note
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { id, title, content, isPublished, order } = await req.json();
        if (!id) return NextResponse.json({ message: "id required" }, { status: 400 });

        const note = await Note.findByIdAndUpdate(id, { title, content, isPublished, order }, { new: true });
        if (!note) return NextResponse.json({ message: "Note nahi mila" }, { status: 404 });

        return NextResponse.json({ message: "Note update ho gaya", note });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// DELETE ?id=xxx
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        if (user.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ message: "id required" }, { status: 400 });

        await Note.findByIdAndDelete(id);
        return NextResponse.json({ message: "Note delete ho gaya" });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}