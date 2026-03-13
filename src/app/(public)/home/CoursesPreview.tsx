import Image from "next/image";
import Link from "next/link";

const courses = [
    {
        title: "DCA – Diploma in Computer Applications",
        description: "Computer fundamentals, MS Office, internet usage and practical office skills for beginners.",
        image: "/images/courses/dca.jpg",
        tag: "Diploma",
        slug: "dca-diploma-in-computer-applications",
    },
    {
        title: "PGDCA – Post Graduate Diploma",
        description: "Advanced diploma program focused on professional-level computer skills and career growth.",
        image: "/images/courses/pgdca.jpg",
        tag: "Diploma",
        slug: "pgdca",
    },
    {
        title: "Tally with GST",
        description: "Practical accounting and GST training designed for office work and business operations.",
        image: "/images/courses/tally.jpg",
        tag: "Accounting",
        slug: "tally-with-gst",
    },
    {
        title: "Basic Computer Course",
        description: "Perfect starting point for students and first-time learners beginning computer education.",
        image: "/images/courses/basic.jpg",
        tag: "Foundation",
        slug: "basic-computer-course",
    },
    {
        title: "Web Development",
        description: "Learn modern website development using HTML, CSS, JavaScript and project-based learning.",
        image: "/images/courses/web.jpg",
        tag: "Technical",
        slug: "web-development",
    },
    {
        title: "Software Development",
        description: "Programming logic, application development and real-world software skills.",
        image: "/images/courses/software.jpg",
        tag: "Technical",
        slug: "software-development",
    },
    {
        title: "Typing Course",
        description: "Hindi & English typing training focused on speed, accuracy and exam preparation.",
        image: "/images/courses/typing.jpg",
        tag: "Foundation",
        slug: "typing-course",
    },
    {
        title: "Cyber Security",
        description: "Cyber safety fundamentals, ethical hacking concepts and data protection practices.",
        image: "/images/courses/cyber.jpg",
        tag: "Technical",
        slug: "cyber-security",
    },
    {
        title: "Vocational Training",
        description: "Skill-based vocational programs aligned with employment and self-employment readiness.",
        image: "/images/courses/vocational.jpg",
        tag: "Vocational",
        slug: "vocational-training",
    },
];

// Tag ke hisaab se color
const tagColors: Record<string, string> = {
    Diploma:    "bg-blue-900/80 text-blue-100",
    Accounting: "bg-emerald-900/80 text-emerald-100",
    Foundation: "bg-slate-800/80 text-slate-200",
    Technical:  "bg-[#EF4523]/85 text-white",
    Vocational: "bg-purple-900/80 text-purple-100",
};

export default function CoursesPreview() {
    return (
        <>
            <style>{`
                /* Top fade line */
                .cp-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #CBD5E1, transparent);
                }

                /* Card hover top accent */
                .cp-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: #1B4FBB;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.28s ease;
                    z-index: 1;
                }
                .cp-card:hover::before { transform: scaleX(1); }

                /* Image zoom */
                .cp-card-img-inner { transition: transform 0.5s ease; }
                .cp-card:hover .cp-card-img-inner { transform: scale(1.05); }

                /* Link arrow slide */
                .cp-card-link { transition: gap 0.2s; }
                .cp-card:hover .cp-card-link { gap: 9px; }

                /* Bottom CTA arrow */
                .cp-bottom-arrow { transition: transform 0.2s; }
                .cp-bottom-cta:hover .cp-bottom-arrow { transform: translateX(4px); }

                /* Header CTA arrow */
                .cp-header-arrow { transition: transform 0.2s; }
                .cp-header-cta:hover .cp-header-arrow { transform: translateX(4px); }
            `}</style>

            <section
                className="cp-root relative overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A] py-20 md:py-24 px-6"
                aria-labelledby="courses-preview-heading"
            >
                <div className="max-w-[1100px] mx-auto">

                    {/* ── Header ── */}
                    <div className="flex flex-wrap items-end justify-between gap-5 md:gap-8 mb-12 md:mb-14">
                        <div className="max-w-[520px]">
                            {/* Eyebrow */}
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase text-blue-700 dark:text-blue-400 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-blue-600 dark:before:bg-blue-500">
                                Our Courses
                            </div>
                            <h2
                                id="courses-preview-heading"
                                className="font-serif font-bold text-[#0F172A] dark:text-slate-50 leading-[1.2]"
                                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
                            >
                                Professional Courses<br />
                                in <em className="italic text-[#EF4523] dark:text-orange-400">Ambikapur</em>
                            </h2>
                            <p className="text-[0.88rem] font-light text-slate-500 dark:text-slate-400 leading-[1.75] mt-3">
                                Career-oriented computer training with practical exposure
                                and government-recognized certification.
                            </p>
                        </div>

                        {/* Header CTA */}
                        <Link
                            href="/courses"
                            className="cp-header-cta inline-flex items-center gap-2 shrink-0 text-[0.85rem] font-medium no-underline text-blue-700 dark:text-blue-300 border-[1.5px] border-blue-200 dark:border-blue-700 px-6 py-2.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-px transition-all duration-200"
                        >
                            View All Courses
                            <span className="cp-header-arrow" aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {/* ── Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {courses.map((course, i) => (
                            <Link
                                key={course.slug}
                                href={`/courses/${course.slug}`}
                                className="cp-card group relative flex flex-col no-underline bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-[18px] overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(26,79,187,0.12)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                                aria-label={course.title}
                            >
                                {/* Image */}
                                <div className="relative h-[180px] bg-blue-50 dark:bg-slate-800 overflow-hidden shrink-0">
                                    <div className="cp-card-img-inner absolute inset-0">
                                        <Image
                                            src={course.image}
                                            alt={course.title}
                                            fill
                                            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Tag badge */}
                                    <span className={`
                                        absolute top-3 left-3 z-10
                                        text-[9px] font-medium tracking-[0.12em] uppercase
                                        px-2.5 py-1 rounded-full backdrop-blur-sm
                                        ${tagColors[course.tag] ?? "bg-slate-800/80 text-slate-200"}
                                    `}>
                                        {course.tag}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="flex flex-col flex-1 px-5 py-5">
                                    <h3 className="font-serif text-[1rem] font-semibold text-[#0F172A] dark:text-slate-100 leading-[1.35]">
                                        {course.title}
                                    </h3>
                                    <p className="text-[0.8rem] font-light text-slate-500 dark:text-slate-400 leading-[1.7] mt-2 flex-1">
                                        {course.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-700">
                                        <span className="cp-card-link flex items-center gap-1.5 text-[0.78rem] font-medium text-blue-600 dark:text-blue-400">
                                            Learn More <span aria-hidden="true">→</span>
                                        </span>
                                        <span
                                            className="font-serif text-[1.3rem] font-bold text-slate-200 dark:text-slate-700 leading-none select-none"
                                            aria-hidden="true"
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* ── Bottom CTA strip ── */}
                    <div className="flex items-center gap-5 mt-12">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                        <Link
                            href="/courses"
                            className="cp-bottom-cta inline-flex items-center gap-2 shrink-0 no-underline text-[0.88rem] font-medium text-white bg-[#1B4FBB] hover:bg-[#1A3E9A] dark:bg-blue-600 dark:hover:bg-blue-500 px-7 py-3 rounded-full shadow-[0_4px_20px_rgba(26,79,187,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(26,79,187,0.35)] transition-all duration-200 whitespace-nowrap"
                        >
                            Explore All Courses
                            <span className="cp-bottom-arrow" aria-hidden="true">→</span>
                        </Link>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                    </div>

                </div>
            </section>
        </>
    );
}