import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";

/* ---------------------------------------
   Shared Fetch Function (Single Source)
---------------------------------------- */
async function fetchCourse(slug: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/courses/${slug}`,
        {
            next: { revalidate: 60 }, // ISR: refresh every 60 seconds
        }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
}

/* ---------------------------------------
   Dynamic Metadata (Next.js 16+ style)
---------------------------------------- */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const course = await fetchCourse(slug);

    if (!course) {
        return {
            title: "Course Not Found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return {
        title: `${course.name} Course in Ambikapur | Shivshakti Computer Academy`,
        description: `${course.name} course in Ambikapur at Shivshakti Computer Academy. Duration: ${course.duration}. Government-recognized certification program in Surguja, Chhattisgarh.`,
        openGraph: {
            title: `${course.name} Course | Shivshakti Computer Academy`,
            description: `${course.name} training in Ambikapur, Surguja.`,
            url: `https://www.shivshakticomputer.in/courses/${course.slug}`,
            images: course.banner
                ? [
                    {
                        url: course.banner,
                        width: 1200,
                        height: 630,
                        alt: course.name,
                    },
                ]
                : [],
        },
        alternates: {
            canonical: `https://www.shivshakticomputer.in/courses/${course.slug}`,
        },
    };
}

/* ---------------------------------------
   Course Detail Page
---------------------------------------- */
export default async function CourseDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const course = await fetchCourse(slug);

    if (!course) return notFound();

    return (
        <>
            {/* Structured Data Schema */}
            <Script
                id="course-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        name: course.name,
                        description: `${course.name} professional computer course in Ambikapur.`,
                        provider: {
                            "@type": "EducationalOrganization",
                            name: "Shivshakti Computer Academy",
                            sameAs: "https://www.shivshakticomputer.in",
                        },
                    }),
                }}
            />

            <section className="bg-white min-h-screen py-24">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Hero Banner */}
                    <div className="relative h-72 rounded-3xl overflow-hidden bg-gray-100 shadow-md">
                        {course.banner ? (
                            <Image
                                src={course.banner}
                                alt={course.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Course Banner
                            </div>
                        )}
                    </div>

                    {/* Header */}
                    <div className="mt-10">
                        <span className="text-sm bg-black text-white px-4 py-1 rounded-full">
                            {course.level}
                        </span>

                        <h1 className="mt-6 text-4xl font-bold">
                            {course.name}
                        </h1>

                        <p className="mt-4 text-gray-600">
                            {course.duration && `Duration: ${course.duration} • `}
                            {course.authority}
                        </p>
                    </div>

                    {/* Designed For */}
                    {course.designedFor?.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold">
                                Designed For
                            </h2>

                            <ul className="mt-6 grid md:grid-cols-2 gap-3 text-gray-600">
                                {course.designedFor.map((item: string, i: number) => (
                                    <li key={i} className="bg-gray-50 px-4 py-3 rounded-xl">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Career Opportunities */}
                    {course.careerOpportunities?.length > 0 && (
                        <div className="mt-14">
                            <h2 className="text-xl font-semibold">
                                Career Opportunities
                            </h2>

                            <ul className="mt-6 grid md:grid-cols-2 gap-3 text-gray-600">
                                {course.careerOpportunities.map((item: string, i: number) => (
                                    <li key={i} className="bg-gray-50 px-4 py-3 rounded-xl">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Syllabus */}
                    {course.syllabus?.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-3xl font-semibold text-gray-900">
                                Course Syllabus
                            </h2>

                            <div className="mt-8 space-y-8">
                                {course.syllabus.map((module: any, i: number) => (
                                    <div
                                        key={i}
                                        className="border border-gray-100 rounded-2xl p-6"
                                    >
                                        <h3 className="font-semibold text-lg">
                                            {module.module}
                                        </h3>

                                        <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                            {module.topics.map((topic: string, j: number) => (
                                                <li key={j}>• {topic}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}