import Image from "next/image";
import { notFound } from "next/navigation";

async function getCourse(slug: string) {
  const res = await fetch(
    `http://localhost:3000/api/public/courses/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.data;
}

export default async function CourseDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await getCourse(slug);

  if (!course) return notFound();

  return (
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
                        <h2 className="text-xl font-semibold">
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
  );
}