import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Link from "next/link";

interface Props {
    params: Promise<{ course: string }>;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
}

export default async function CourseNotes({ params }: Props) {

    const { course } = await params;

    await connectDB();

    const courseDoc = await Course.findOne({
        slug: course,
        isActive: true
    }).lean();

    if (!courseDoc) {
        return <div>Course not found</div>;
    }

    const syllabus = courseDoc.syllabus || [];

    return (

        <div className="space-y-8">

            <h1 className="text-2xl font-semibold text-indigo-900">
                {courseDoc.name} Notes
            </h1>

            <div className="grid md:grid-cols-2 gap-6">

                {syllabus.map((module: any, i: number) => {

                    const moduleSlug = slugify(module.module);
                    const firstTopic = slugify(module.topics[0]);

                    return (

                        <Link
                            key={i}
                            href={`/dashboard/student/notes/${course}/${moduleSlug}/${firstTopic}`}
                            className="p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                        >

                            <h2 className="font-semibold text-indigo-900">
                                {module.module}
                            </h2>

                            <p className="text-sm text-indigo-600 mt-1">
                                {module.topics.length} Topics
                            </p>

                        </Link>

                    );
                })}

            </div>

        </div>

    );
}