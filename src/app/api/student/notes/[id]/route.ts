/**
 * FILE: src/app/api/student/notes/[id]/route.ts
 * Next.js 16+ async params fix
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import { Types } from "mongoose";

const NOTES_BASE = path.join(process.cwd(), "src", "content", "notes");

interface PopulatedCourse {
    _id: Types.ObjectId;
    slug: string;
}

interface PopulatedEnrollment {
    _id: Types.ObjectId;
    student: Types.ObjectId;
    course: PopulatedCourse | null;
    isActive: boolean;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyUser();
        if (!user || (user as any).role !== "student") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Next.js 16+ — params await karo
        const { id } = await params;

        await connectDB();

        const note = await Note.findById(id).lean() as any;
        if (!note || !note.isPublished) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        const student = await Student.findOne({ user: (user as any)._id }).lean();
        if (!student) {
            return NextResponse.json({ error: "Student nahi mila" }, { status: 404 });
        }

        // Enrollment check
        const enrollments = await Enrollment.find({
            student: (student as any)._id,
            isActive: true,
        })
            .populate("course", "slug")
            .lean() as unknown as PopulatedEnrollment[];

        const isEnrolled = enrollments.some(
            (e) => e.course?.slug === note.courseSlug
        );

        if (!isEnrolled) {
            return NextResponse.json(
                { error: "Is course ke notes access karne ka permission nahi hai" },
                { status: 403 }
            );
        }

        // .md file read
        const absolutePath = path.join(
            NOTES_BASE,
            note.courseSlug,
            note.moduleSlug,
            `${note.topicSlug}.md`
        );

        if (!fs.existsSync(absolutePath)) {
            return NextResponse.json(
                { error: "Note file server pe nahi mili" },
                { status: 404 }
            );
        }

        const content = fs.readFileSync(absolutePath, "utf8");

        return NextResponse.json({
            success: true,
            note: {
                _id: note._id,
                title: note.title as string,
                moduleName: note.moduleName as string,
                courseSlug: note.courseSlug as string,
                updatedAt: note.updatedAt as Date,
            },
            content,
        });

    } catch (error) {
        console.error("GET /api/student/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}