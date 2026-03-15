/**
 * FILE: src/app/api/student/notes/[id]/route.ts
 * GET → single note content (student)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import { Types } from "mongoose";
import "@/models/Course";

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

        const studentObjectId = (student as any)._id;

        const enrollments = await Enrollment.find({
            student: studentObjectId,
            isActive: true,
        })
            .populate("course", "slug")
            .lean() as unknown as PopulatedEnrollment[];

        const enrolledSlugs: string[] = enrollments
            .filter(e => e.course?.slug)
            .map(e => e.course!.slug);

        // ── Backward compatible access check ──────────────────────────────────
        // Purane students: sirf courseSlug check (pehli condition)
        // Naye shared notes: baaki do conditions
        const isPrimaryEnrolled = enrolledSlugs.includes(note.courseSlug);

        const isSharedCourseAccessible = (note.sharedWithCourses || []).some(
            (slug: string) => enrolledSlugs.includes(slug)
        );

        const isDirectStudentShare = (note.sharedWithStudents || []).some(
            (sid: any) => sid.toString() === studentObjectId.toString()
        );

        if (!isPrimaryEnrolled && !isSharedCourseAccessible && !isDirectStudentShare) {
            return NextResponse.json(
                { error: "Is note ko access karne ka permission nahi hai" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            note: {
                _id: note._id,
                title: note.title as string,
                moduleName: note.moduleName as string,
                courseSlug: note.courseSlug as string,
                updatedAt: note.updatedAt as Date,
            },
            content: note.content || "",
        });

    } catch (error) {
        console.error("GET /api/student/notes/[id] error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}