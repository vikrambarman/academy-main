import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

/* ---------------------------------------
   SEO Metadata
---------------------------------------- */
export const metadata: Metadata = {
    title:
        "Computer Courses in Ambikapur | DCA, PGDCA, ADCA, Tally & IT Training",
    description:
        "Explore professional computer courses in Ambikapur at Shivshakti Computer Academy including DCA, PGDCA, ADCA, Tally, Typing, Web Development, Software Development, Networking, Linux and Cloud Computing programs.",
    alternates: {
        canonical: "https://www.shivshakticomputer.in/courses",
    },
    openGraph: {
        title:
            "Computer Courses in Ambikapur | Shivshakti Computer Academy",
        description:
            "Professional IT and computer training programs in Ambikapur, Surguja.",
        url: "https://www.shivshakticomputer.in/courses",
    },
};

/* ---------------------------------------
   Fetch Courses
---------------------------------------- */
async function getCourses() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/courses`,
            {
                next: { revalidate: 60 }, // ISR
            }
        );

        if (!res.ok) return [];

        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

/* ---------------------------------------
   Page Component
---------------------------------------- */
export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <>
            {/* Structured Data - ItemList */}
            <Script
                id="courses-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        itemListElement: courses.map((course: any, index: number) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            url: `https://www.shivshakticomputer.in/courses/${course.slug}`,
                            name: course.name,
                        })),
                    }),
                }}
            />

            <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">

                    {/* Heading */}
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-semibold text-gray-900">
                            Computer Training Courses in Ambikapur
                        </h1>

                        <p className="mt-6 text-gray-600 text-lg">
                            Government-recognized and career-focused IT training programs
                            offered in Ambikapur, Surguja, Chhattisgarh.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">

                        {courses.length === 0 && (
                            <p className="col-span-full text-center text-gray-500">
                                No courses available at the moment.
                            </p>
                        )}

                        {courses.map((course: any) => (
                            <div
                                key={course._id}
                                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            >

                                {/* Banner */}
                                <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                                    {course.banner ? (
                                        <Image
                                            src={course.banner}
                                            alt={`${course.name} course in Ambikapur`}
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

                                    <div className="inline-block text-xs font-medium bg-black text-white px-3 py-1 rounded-full">
                                        {course.level}
                                    </div>

                                    <h2 className="mt-6 text-xl font-semibold text-gray-900 leading-snug">
                                        {course.name}
                                    </h2>

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
        </>
    );
}