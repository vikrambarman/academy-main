"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Link from "next/link";
import { BookOpen } from "lucide-react";

/* ================= TYPES ================= */

interface Course {
    _id: string;
    name: string;
    slug: string;
}

interface Enrollment {
    _id: string;
    course: Course;
}

interface Data {
    enrollments: Enrollment[];
}

/* ================= COMPONENT ================= */

export default function NotesHome() {

    const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadCourses = async () => {

            try {

                const res = await fetchWithAuth("/api/student/profile");
                const json = await res.json();

                setData(json);

            } catch {

                console.error("Failed to load notes");

            } finally {

                setLoading(false);

            }

        };

        loadCourses();

    }, []);

    if (loading) {
        return <div className="text-gray-500">Loading courses...</div>;
    }

    const enrollments = data?.enrollments || [];

    if (enrollments.length === 0) {
        return (
            <div className="text-gray-500">
                No courses available
            </div>
        );
    }

    return (

        <div className="space-y-6">

            <h1 className="text-xl font-semibold text-indigo-900">
                Your Courses
            </h1>

            <div className="grid md:grid-cols-2 gap-6">

                {enrollments.map((e) => (

                    <Link
                        key={e._id}
                        href={`/dashboard/student/notes/${e.course.slug}`}
                        className="p-6 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center gap-4"
                    >

                        <BookOpen className="text-indigo-600" />

                        <div>

                            <h2 className="font-semibold text-indigo-900">
                                {e.course.name}
                            </h2>

                            <p className="text-sm text-indigo-600">
                                View Notes
                            </p>

                        </div>

                    </Link>

                ))}

            </div>

        </div>

    );
}