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

export default function CoursesPreview() {
    return (
        <>
            <style>{`
                .cp-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                /* Faint top separator */
                .cp-root::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .cp-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .cp-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 32px;
                    margin-bottom: 52px;
                    flex-wrap: wrap;
                }

                .cp-header-left {
                    max-width: 520px;
                }

                .cp-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .cp-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #d97706;
                }

                .cp-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .cp-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .cp-subtitle {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.75;
                    margin-top: 12px;
                }

                .cp-header-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #1a1208;
                    text-decoration: none;
                    border: 1.5px solid #d5c9b5;
                    padding: 11px 24px;
                    border-radius: 100px;
                    white-space: nowrap;
                    transition: border-color 0.2s, background 0.2s, transform 0.15s;
                    flex-shrink: 0;
                }

                .cp-header-cta:hover {
                    border-color: #b45309;
                    background: #fffbeb;
                    transform: translateY(-1px);
                }

                .cp-header-cta-arrow {
                    transition: transform 0.2s;
                }

                .cp-header-cta:hover .cp-header-cta-arrow {
                    transform: translateX(4px);
                }

                /* ── Grid ── */
                .cp-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }

                /* ── Card ── */
                .cp-card {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 18px;
                    overflow: hidden;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
                    position: relative;
                }

                .cp-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 48px rgba(100,70,20,0.11);
                    border-color: #d97706;
                }

                /* Image area */
                .cp-card-img {
                    position: relative;
                    height: 180px;
                    background: #f0ead8;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .cp-card-img-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    font-size: 0.72rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #b0a090;
                    background: repeating-linear-gradient(
                        45deg,
                        #f0ead8,
                        #f0ead8 8px,
                        #ede7d5 8px,
                        #ede7d5 16px
                    );
                }

                /* Image zoom on hover */
                .cp-card:hover .cp-card-img-inner {
                    transform: scale(1.05);
                }

                .cp-card-img-inner {
                    transition: transform 0.5s ease;
                    position: absolute;
                    inset: 0;
                }

                /* Tag badge */
                .cp-card-tag {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    background: rgba(26,18,8,0.82);
                    color: #fef3c7;
                    padding: 4px 10px;
                    border-radius: 100px;
                    backdrop-filter: blur(4px);
                }

                /* Card body */
                .cp-card-body {
                    padding: 20px 22px 22px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                .cp-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1a1208;
                    line-height: 1.35;
                }

                .cp-card-desc {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.7;
                    margin-top: 8px;
                    flex: 1;
                }

                /* Bottom link row */
                .cp-card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 16px;
                    padding-top: 14px;
                    border-top: 1px solid #f0e8d8;
                }

                .cp-card-link {
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: #b45309;
                    letter-spacing: 0.02em;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: gap 0.2s;
                }

                .cp-card:hover .cp-card-link {
                    gap: 9px;
                }

                .cp-card-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #e8dfd0;
                    line-height: 1;
                    user-select: none;
                }

                /* ── Bottom CTA strip ── */
                .cp-bottom {
                    margin-top: 48px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .cp-bottom-line {
                    flex: 1;
                    height: 1px;
                    background: #e2d9c8;
                }

                .cp-bottom-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #1a1208;
                    color: #fef3c7;
                    font-size: 0.88rem;
                    font-weight: 500;
                    padding: 13px 28px;
                    border-radius: 100px;
                    text-decoration: none;
                    white-space: nowrap;
                    transition: background 0.2s, transform 0.15s;
                    box-shadow: 0 4px 20px rgba(26,18,8,0.18);
                }

                .cp-bottom-cta:hover {
                    background: #2d1f0d;
                    transform: translateY(-2px);
                }

                .cp-bottom-cta-arrow {
                    transition: transform 0.2s;
                }

                .cp-bottom-cta:hover .cp-bottom-cta-arrow {
                    transform: translateX(4px);
                }

                /* ── Responsive ── */
                @media (max-width: 900px) {
                    .cp-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .cp-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }
                }

                @media (max-width: 560px) {
                    .cp-root {
                        padding: 64px 16px;
                    }

                    .cp-grid {
                        grid-template-columns: 1fr;
                        gap: 14px;
                    }

                    .cp-card-img {
                        height: 160px;
                    }
                }
            `}</style>

            <section className="cp-root" aria-labelledby="courses-preview-heading">
                <div className="cp-inner">

                    {/* Header */}
                    <div className="cp-header">
                        <div className="cp-header-left">
                            <div className="cp-eyebrow">Our Courses</div>
                            <h2 id="courses-preview-heading" className="cp-title">
                                Professional Courses<br />
                                in <em>Ambikapur</em>
                            </h2>
                            <p className="cp-subtitle">
                                Career-oriented computer training with practical exposure
                                and government-recognized certification.
                            </p>
                        </div>

                        <Link href="/courses" className="cp-header-cta">
                            View All Courses
                            <span className="cp-header-cta-arrow" aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="cp-grid">
                        {courses.map((course, i) => (
                            <Link
                                key={i}
                                href={`/courses/${course.slug}`}
                                className="cp-card"
                                aria-label={course.title}
                            >
                                {/* Image */}
                                <div className="cp-card-img">
                                    <div className="cp-card-img-inner">
                                        <Image
                                            src={course.image}
                                            alt={course.title}
                                            fill
                                            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="cp-card-tag">{course.tag}</span>
                                </div>

                                {/* Body */}
                                <div className="cp-card-body">
                                    <h3 className="cp-card-title">{course.title}</h3>
                                    <p className="cp-card-desc">{course.description}</p>

                                    <div className="cp-card-footer">
                                        <span className="cp-card-link">
                                            Learn More <span aria-hidden="true">→</span>
                                        </span>
                                        <span className="cp-card-num" aria-hidden="true">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom CTA strip */}
                    <div className="cp-bottom">
                        <div className="cp-bottom-line" aria-hidden="true" />
                        <Link href="/courses" className="cp-bottom-cta">
                            Explore All Courses
                            <span className="cp-bottom-cta-arrow" aria-hidden="true">→</span>
                        </Link>
                        <div className="cp-bottom-line" aria-hidden="true" />
                    </div>

                </div>
            </section>
        </>
    );
}