import Image from "next/image";
import Link from "next/link";

const courses = [
    {
        title: "DCA – Diploma in Computer Applications",
        description:
            "Computer fundamentals, MS Office, internet usage and practical office skills for beginners.",
        image: "/images/courses/dca.jpg",
    },
    {
        title: "PGDCA – Post Graduate Diploma",
        description:
            "Advanced diploma program focused on professional-level computer skills and career growth.",
        image: "/images/courses/pgdca.jpg",
    },
    {
        title: "Tally with GST",
        description:
            "Practical accounting and GST training designed for office work and business operations.",
        image: "/images/courses/tally.jpg",
    },
    {
        title: "Basic Computer Course",
        description:
            "Perfect starting point for students and first-time learners beginning computer education.",
        image: "/images/courses/basic.jpg",
    },
    {
        title: "Web Development",
        description:
            "Learn modern website development using HTML, CSS, JavaScript and project-based learning.",
        image: "/images/courses/web.jpg",
    },
    {
        title: "Software Development",
        description:
            "Programming logic, application development and real-world software skills.",
        image: "/images/courses/software.jpg",
    },
    {
        title: "Typing Course",
        description:
            "Hindi & English typing training focused on speed, accuracy and exam preparation.",
        image: "/images/courses/typing.jpg",
    },
    {
        title: "Cyber Security",
        description:
            "Cyber safety fundamentals, ethical hacking concepts and data protection practices.",
        image: "/images/courses/cyber.jpg",
    },
    {
        title: "Vocational Training",
        description:
            "Skill-based vocational programs aligned with employment and self-employment readiness.",
        image: "/images/courses/vocational.jpg",
    },
];

export default function CoursesPreview() {
    return (
        <section
            className="bg-gray-50"
            aria-labelledby="courses-preview-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2
                        id="courses-preview-heading"
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                    >
                        Professional Computer Courses in Ambikapur
                    </h2>

                    <p className="mt-4 text-gray-600 text-base md:text-lg">
                        Career-oriented computer training programs with practical exposure
                        and government-recognized certification.
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {courses.map((course, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-48 w-full">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                                    {course.title}
                                </h3>

                                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                    {course.description}
                                </p>

                                <Link
                                    href="/courses"
                                    className="inline-block mt-4 text-sm font-medium text-black hover:underline"
                                >
                                    Learn More →
                                </Link>
                            </div>
                        </div>
                    ))}

                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center rounded-xl bg-black text-white px-6 py-3 text-sm font-medium transition hover:bg-gray-800"
                    >
                        Explore All Courses
                    </Link>
                </div>

            </div>
        </section>
    );
}