"use client"

import Image from "next/image";
import Link from "next/link";

const courses = [
    { title:"DCA – Diploma in Computer Applications", description:"Computer fundamentals, MS Office, internet usage and practical office skills for beginners.",            image:"/images/courses/dca.jpg",       tag:"Diploma",    slug:"dca-diploma-in-computer-applications" },
    { title:"PGDCA – Post Graduate Diploma",          description:"Advanced diploma program focused on professional-level computer skills and career growth.",               image:"/images/courses/pgdca.jpg",      tag:"Diploma",    slug:"pgdca"                                },
    { title:"Tally with GST",                         description:"Practical accounting and GST training designed for office work and business operations.",                image:"/images/courses/tally.jpg",      tag:"Accounting", slug:"tally-with-gst"                       },
    { title:"Basic Computer Course",                  description:"Perfect starting point for students and first-time learners beginning computer education.",              image:"/images/courses/basic.jpg",      tag:"Foundation", slug:"basic-computer-course"                },
    { title:"Web Development",                        description:"Learn modern website development using HTML, CSS, JavaScript and project-based learning.",               image:"/images/courses/web.jpg",        tag:"Technical",  slug:"web-development"                      },
    { title:"Software Development",                   description:"Programming logic, application development and real-world software skills.",                             image:"/images/courses/software.jpg",   tag:"Technical",  slug:"software-development"                 },
    { title:"Typing Course",                          description:"Hindi & English typing training focused on speed, accuracy and exam preparation.",                       image:"/images/courses/typing.jpg",     tag:"Foundation", slug:"typing-course"                        },
    { title:"Cyber Security",                         description:"Cyber safety fundamentals, ethical hacking concepts and data protection practices.",                     image:"/images/courses/cyber.jpg",      tag:"Technical",  slug:"cyber-security"                       },
    { title:"Vocational Training",                    description:"Skill-based vocational programs aligned with employment and self-employment readiness.",                 image:"/images/courses/vocational.jpg", tag:"Vocational", slug:"vocational-training"                  },
];

// Tag badge inline styles using CSS variables where possible
const tagStyle: Record<string, React.CSSProperties> = {
    Diploma:    { background:"color-mix(in srgb,var(--color-primary) 75%,#000)",    color:"#fff" },
    Accounting: { background:"rgba(5,150,105,0.82)",                                 color:"#fff" },
    Foundation: { background:"rgba(30,41,59,0.82)",                                  color:"#e2e8f0" },
    Technical:  { background:"color-mix(in srgb,var(--color-accent) 82%,#000)",     color:"#fff" },
    Vocational: { background:"rgba(109,40,217,0.82)",                                color:"#fff" },
};

export default function CoursesPreview() {
    return (
        <>
            <style>{`
                .cp-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }
                .cp-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--color-primary);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.28s ease;
                    z-index: 1;
                }
                .cp-card:hover::before { transform: scaleX(1); }
                .cp-card-img-inner { transition: transform 0.5s ease; }
                .cp-card:hover .cp-card-img-inner { transform: scale(1.05); }
                .cp-card-link { transition: gap 0.2s; }
                .cp-card:hover .cp-card-link { gap: 9px; }
                .cp-bottom-arrow { transition: transform 0.2s; }
                .cp-bottom-cta:hover .cp-bottom-arrow { transform: translateX(4px); }
                .cp-header-arrow { transition: transform 0.2s; }
                .cp-header-cta:hover .cp-header-arrow { transform: translateX(4px); }
            `}</style>

            <section
                className="cp-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background:"var(--color-bg)" }}
                aria-labelledby="courses-preview-heading">
                <div className="max-w-[1100px] mx-auto">

                    {/* Header */}
                    <div className="flex flex-wrap items-end justify-between gap-5 md:gap-8 mb-12 md:mb-14">
                        <div className="max-w-[520px]">
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                                style={{ color:"var(--color-primary)" }}>
                                <span style={{ display:"inline-block", width:24, height:1.5, background:"var(--color-primary)", flexShrink:0 }} />
                                Our Courses
                            </div>
                            <h2 id="courses-preview-heading"
                                className="font-serif font-bold leading-[1.2]"
                                style={{ fontSize:"clamp(1.8rem,3vw,2.5rem)", color:"var(--color-text)" }}>
                                Professional Courses<br />
                                in <em className="not-italic" style={{ color:"var(--color-accent)" }}>Ambikapur</em>
                            </h2>
                            <p className="text-[0.88rem] font-light leading-[1.75] mt-3"
                                style={{ color:"var(--color-text-muted)" }}>
                                Career-oriented computer training with practical exposure and government-recognized certification.
                            </p>
                        </div>

                        <Link href="/courses"
                            className="cp-header-cta inline-flex items-center gap-2 shrink-0 text-[0.85rem] font-medium no-underline px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-px"
                            style={{ color:"var(--color-primary)", border:"1.5px solid var(--color-border)" }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="var(--color-primary)"; el.style.background="color-mix(in srgb,var(--color-primary) 6%,transparent)"; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="var(--color-border)"; el.style.background="transparent"; }}>
                            View All Courses
                            <span className="cp-header-arrow" aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {courses.map((course, i) => (
                            <Link key={course.slug} href={`/courses/${course.slug}`}
                                className="cp-card group relative flex flex-col no-underline rounded-[18px] overflow-hidden transition-all duration-200 hover:-translate-y-1"
                                style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border)" }}
                                aria-label={course.title}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="color-mix(in srgb,var(--color-primary) 40%,transparent)"; el.style.boxShadow="0 16px 48px color-mix(in srgb,var(--color-primary) 12%,transparent)"; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="var(--color-border)"; el.style.boxShadow="none"; }}>
                                {/* Image */}
                                <div className="relative h-[180px] overflow-hidden shrink-0"
                                    style={{ background:"color-mix(in srgb,var(--color-primary) 6%,var(--color-bg))" }}>
                                    <div className="cp-card-img-inner absolute inset-0">
                                        <Image src={course.image} alt={course.title} fill
                                            sizes="(max-width:560px) 100vw,(max-width:900px) 50vw,360px"
                                            className="object-cover" />
                                    </div>
                                    <span className="absolute top-3 left-3 z-10 text-[9px] font-medium tracking-[0.12em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
                                        style={tagStyle[course.tag] ?? tagStyle.Foundation}>
                                        {course.tag}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="flex flex-col flex-1 px-5 py-5">
                                    <h3 className="font-serif text-[1rem] font-semibold leading-[1.35]"
                                        style={{ color:"var(--color-text)" }}>{course.title}</h3>
                                    <p className="text-[0.8rem] font-light leading-[1.7] mt-2 flex-1"
                                        style={{ color:"var(--color-text-muted)" }}>{course.description}</p>
                                    <div className="flex items-center justify-between mt-4 pt-3.5"
                                        style={{ borderTop:"1px solid var(--color-border)" }}>
                                        <span className="cp-card-link flex items-center gap-1.5 text-[0.78rem] font-medium"
                                            style={{ color:"var(--color-primary)" }}>
                                            Learn More <span aria-hidden="true">→</span>
                                        </span>
                                        <span className="font-serif text-[1.3rem] font-bold leading-none select-none"
                                            style={{ color:"var(--color-border)" }} aria-hidden="true">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="flex items-center gap-5 mt-12">
                        <div className="flex-1 h-px" style={{ background:"var(--color-border)" }} aria-hidden="true" />
                        <Link href="/courses"
                            className="cp-bottom-cta inline-flex items-center gap-2 shrink-0 no-underline text-[0.88rem] font-medium px-7 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                            style={{ color:"#fff", background:"var(--color-primary)", boxShadow:"0 4px 20px color-mix(in srgb,var(--color-primary) 35%,transparent)" }}>
                            Explore All Courses
                            <span className="cp-bottom-arrow" aria-hidden="true">→</span>
                        </Link>
                        <div className="flex-1 h-px" style={{ background:"var(--color-border)" }} aria-hidden="true" />
                    </div>

                </div>
            </section>
        </>
    );
}