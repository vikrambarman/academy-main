import Image from "next/image";
import Link from "next/link";

async function getCourses() {
    const res = await fetch(
        `http://localhost:3000/api/public/courses`,
        { cache: "no-store" }
    );

    return res.json();
}

export default async function CoursesPage() {
    const { data } = await getCourses();

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                        Professional Computer Courses
                    </h1>

                    <p className="mt-6 text-gray-600 text-lg">
                        Government-recognized and career-focused digital skill programs
                        designed for real-world success.
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">

                    {data?.map((course: any) => (
                        <div
                            key={course._id}
                            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        >

                            {/* Future Image Support */}
                            <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                                {course.thumbnail ? (
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                        Course Preview
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8">

                                {/* Level Badge */}
                                <div className="inline-block text-xs font-medium bg-black text-white px-3 py-1 rounded-full">
                                    {course.level}
                                </div>

                                {/* Course Name */}
                                <h2 className="mt-6 text-xl font-semibold text-gray-900 leading-snug">
                                    {course.name}
                                </h2>

                                {/* Info */}
                                <div className="mt-4 space-y-2 text-sm text-gray-500">
                                    <p>
                                        <span className="font-medium text-gray-700">
                                            Duration:
                                        </span>{" "}
                                        {course.duration || "Flexible"}
                                    </p>

                                    <p>
                                        <span className="font-medium text-gray-700">
                                            Authority:
                                        </span>{" "}
                                        {course.authority}
                                    </p>
                                </div>

                                {/* CTA */}
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="mt-8 inline-flex items-center text-sm font-medium text-black group-hover:underline"
                                >
                                    View Course Details →
                                </Link>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}