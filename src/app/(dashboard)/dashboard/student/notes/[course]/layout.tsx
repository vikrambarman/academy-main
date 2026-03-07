import { ReactNode } from "react";
import Course from "@/models/Course";
import { connectDB } from "@/lib/db";
import NotesSidebar from "@/components/lms/NotesSidebar";

interface Props {
    children: ReactNode;
    params: Promise<{ course: string }>;
}

export default async function NotesLayout({ children, params }: Props) {

    const { course } = await params;

    await connectDB();

    const courseDoc = await Course.findOne({
        slug: course,
        isActive: true
    }).lean();

    if (!courseDoc) {
        return <div>Course not found</div>;
    }

    return (
        <div className="flex h-[calc(100vh-80px)]">

            {/* Sidebar */}

            <div className="w-72 border-r overflow-y-auto bg-gray-50">

                <NotesSidebar
                    syllabus={courseDoc.syllabus}
                    courseSlug={courseDoc.slug}
                />

            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto p-10">
                {children}
            </div>

        </div>
    );
}