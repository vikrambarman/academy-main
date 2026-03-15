/**
 * FILE: src/app/api/admin/notes/[id]/share/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Note from "@/models/Note";
import Student from "@/models/Student";

async function requireAdmin() {
    try {
        const user = await verifyUser();
        if ((user as any).role !== "admin") return null;
        return user;
    } catch {
        return null;
    }
}

// GET — current shares dekho
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAdmin();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const note = await Note.findById(id)
            .populate("sharedWithStudents", "name studentId")
            .lean() as any;

        if (!note) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        // sharedModuleNames Map ko plain object mein convert karo
        const sharedModuleNames: Record<string, string> = {};
        if (note.sharedModuleNames) {
            for (const [k, v] of Object.entries(note.sharedModuleNames)) {
                sharedModuleNames[k] = v as string;
            }
        }

        return NextResponse.json({
            success: true,
            noteId: id,
            title: note.title,
            primaryCourse: note.courseSlug,
            primaryModuleName: note.moduleName,
            sharedWithCourses: note.sharedWithCourses || [],
            sharedWithStudents: note.sharedWithStudents || [],
            sharedModuleNames,
        });

    } catch (error) {
        console.error("GET /api/admin/notes/[id]/share error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST — share karo
// Body: { type: "course", courseSlugs: ["adca"], moduleNames: { "adca": "MS Office" } }
//    OR { type: "student", studentId: "..." }
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAdmin();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note nahi mila" }, { status: 404 });
        }

        const body = await request.json();
        const { type, courseSlugs, moduleNames, studentId } = body;

        if (type === "course") {
            if (!Array.isArray(courseSlugs) || courseSlugs.length === 0) {
                return NextResponse.json(
                    { error: "courseSlugs array required hai" },
                    { status: 400 }
                );
            }

            const filtered = courseSlugs.filter(
                (s: string) => s !== note.courseSlug
            );

            // sharedModuleNames update karo — Map field
            const moduleNamesUpdate: Record<string, string> = {};
            filtered.forEach((slug: string) => {
                // Admin ne jo module name diya use use karo, warna original moduleName
                moduleNamesUpdate[`sharedModuleNames.${slug}`] =
                    (moduleNames && moduleNames[slug]) ? moduleNames[slug] : note.moduleName;
            });

            await Note.findByIdAndUpdate(id, {
                $addToSet: { sharedWithCourses: { $each: filtered } },
                $set: moduleNamesUpdate,
            });

            return NextResponse.json({
                success: true,
                message: `Note ${filtered.length} course(s) ke saath share ho gaya`,
            });
        }

        if (type === "student") {
            if (!studentId) {
                return NextResponse.json(
                    { error: "studentId required hai" },
                    { status: 400 }
                );
            }

            const student = await Student.findById(studentId).lean();
            if (!student) {
                return NextResponse.json(
                    { error: "Student nahi mila" },
                    { status: 404 }
                );
            }

            await Note.findByIdAndUpdate(id, {
                $addToSet: { sharedWithStudents: studentId },
            });

            return NextResponse.json({
                success: true,
                message: "Note student ke saath share ho gaya",
            });
        }

        return NextResponse.json(
            { error: "type 'course' ya 'student' hona chahiye" },
            { status: 400 }
        );

    } catch (error) {
        console.error("POST /api/admin/notes/[id]/share error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE — share hatao
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAdmin();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const body = await request.json();
        const { type, courseSlug, studentId } = body;

        if (type === "course") {
            // sharedModuleNames se bhi hatao
            await Note.findByIdAndUpdate(id, {
                $pull: { sharedWithCourses: courseSlug },
                $unset: { [`sharedModuleNames.${courseSlug}`]: "" },
            });
            return NextResponse.json({
                success: true,
                message: "Course share hata diya",
            });
        }

        if (type === "student") {
            await Note.findByIdAndUpdate(id, {
                $pull: { sharedWithStudents: studentId },
            });
            return NextResponse.json({
                success: true,
                message: "Student share hata diya",
            });
        }

        return NextResponse.json({ error: "type required" }, { status: 400 });

    } catch (error) {
        console.error("DELETE /api/admin/notes/[id]/share error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}