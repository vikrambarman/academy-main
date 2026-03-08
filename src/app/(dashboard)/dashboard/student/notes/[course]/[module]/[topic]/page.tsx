import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { verifyAccessToken } from "@/lib/auth";
import { getNoteContent } from "@/lib/getNoteContent";

import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import { connectDB } from "@/lib/db";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import Student from "@/models/Student";
import Link from "next/link";

interface Props {
    params: Promise<{
        course: string;
        module: string;
        topic: string;
    }>;
}



export default async function NotesPage({ params }: Props) {

    const { course, module, topic } = await params;

    await connectDB();

    /* ================= AUTH ================= */

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        redirect("/student/login");
    }

    let payload: any;

    try {
        payload = verifyAccessToken(token);
    } catch {
        redirect("/student/login");
    }

    if (payload.role !== "student") {
        redirect("/student/login");
    }

    /* ================= COURSE CHECK ================= */

    const courseDoc = await Course.findOne({
        slug: course,
        isActive: true,
    });

    if (!courseDoc) {
        return (
            <div className="text-red-500">
                Course not found
            </div>
        );
    }

    const student = await Student.findOne({
        user: payload.id
    })

    if (!student) {
        redirect("/student/login")
    }

    /* ================= ENROLLMENT CHECK ================= */

    const enrollment = await Enrollment.findOne({
        student: student._id,
        course: courseDoc._id,
        isActive: true
    })

    if (!enrollment) {
        redirect("/dashboard/student");
    }

    /* ================= LOAD NOTES ================= */

    const content = getNoteContent(course, module, topic);

    if (!content) {
        return (
            <div className="text-gray-500">
                Notes not found
            </div>
        );
    }

    const topics = flattenTopics(courseDoc.syllabus);

    const currentIndex = topics.findIndex(
        (t) => t.topic === topic && t.module === module
    );

    const prev = topics[currentIndex - 1];
    const next = topics[currentIndex + 1];


    /* ================= RENDER ================= */

    return (

        <div className="max-w-4xl mx-auto space-y-10">

            {/* HEADER */}

            <div className="border-b pb-4">

                <h1 className="text-3xl font-bold text-indigo-900">
                    {topic.replace(/-/g, " ")}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    {courseDoc.name}
                </p>

            </div>

            {/* NOTES */}

            <article className="prose prose-indigo max-w-none">

                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {content}
                </ReactMarkdown>

            </article>

            {/* LESSON NAVIGATION */}

            <div className="flex justify-between border-t pt-6">

                {prev ? (
                    <Link
                        href={`/dashboard/student/notes/${course}/${prev.module}/${prev.topic}`}
                        className="text-indigo-600 hover:underline"
                    >
                        ← {prev.title}
                    </Link>
                ) : <span />}

                {next && (
                    <Link
                        href={`/dashboard/student/notes/${course}/${next.module}/${next.topic}`}
                        className="text-indigo-600 hover:underline"
                    >
                        {next.title} →
                    </Link>
                )}

            </div>

        </div>

    )
}


function flattenTopics(syllabus: any) {

    const list: any[] = [];

    syllabus.forEach((mod: any) => {

        const moduleSlug = mod.module
            .toLowerCase()
            .replace(/\s+/g, "-");

        mod.topics.forEach((topic: string) => {

            const topicSlug = topic
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "");

            list.push({
                module: moduleSlug,
                topic: topicSlug,
                title: topic
            });

        });

    });

    return list;
}