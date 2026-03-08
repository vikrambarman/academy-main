import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

/* ── SEO Metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Computer Courses in Ambikapur | DCA, PGDCA, ADCA, Tally & IT Training",
    description:
        "Explore professional computer courses in Ambikapur at Shivshakti Computer Academy including DCA, PGDCA, ADCA, Tally, Typing, Web Development, Software Development, Networking, Linux and Cloud Computing programs.",
    alternates: {
        canonical: "https://www.shivshakticomputer.in/courses",
    },
    openGraph: {
        title: "Computer Courses in Ambikapur | Shivshakti Computer Academy",
        description:
            "Professional IT and computer training programs in Ambikapur, Surguja.",
        url: "https://www.shivshakticomputer.in/courses",
    },
};

/* ── Fetch ──────────────────────────────────────────────────────────────────── */
async function getCourses() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/courses`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <>
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

            {/* Font imports */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

                .courses-root {
                    font-family: 'DM Sans', sans-serif;
                    background-color: #faf8f4;
                    min-height: 100vh;
                }

                .courses-hero {
                    padding: 96px 24px 64px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .courses-hero::before {
                    content: '';
                    position: absolute;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 70%);
                    pointer-events: none;
                }

                .hero-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    border: 1px solid #fcd34d;
                    background: #fffbeb;
                    padding: 6px 16px;
                    border-radius: 100px;
                    margin-bottom: 28px;
                }

                .hero-eyebrow span {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    background: #d97706;
                    border-radius: 50%;
                }

                .hero-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.15;
                    max-width: 720px;
                    margin: 0 auto 20px;
                }

                .hero-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .hero-subtitle {
                    color: #6b5e4b;
                    font-size: 1.05rem;
                    font-weight: 300;
                    max-width: 540px;
                    margin: 0 auto;
                    line-height: 1.7;
                }

                .hero-stats {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    margin-top: 48px;
                    flex-wrap: wrap;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1a1208;
                }

                .stat-label {
                    font-size: 0.75rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #92826b;
                    margin-top: 2px;
                }

                .divider {
                    width: 1px;
                    height: 40px;
                    background: #ddd5c5;
                    align-self: center;
                }

                /* Grid */
                .courses-grid-section {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px 96px;
                }

                .section-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 40px;
                }

                .section-label-line {
                    flex: 1;
                    height: 1px;
                    background: #e2d9c8;
                }

                .section-label-text {
                    font-size: 11px;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #92826b;
                    white-space: nowrap;
                }

                .courses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 28px;
                }

                /* Card */
                .course-card {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
                    position: relative;
                }

                .course-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 60px rgba(100,70,20,0.12);
                    border-color: #d97706;
                }

                .card-banner {
                    position: relative;
                    height: 200px;
                    background: #f0ead8;
                    overflow: hidden;
                }

                .card-banner-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    font-size: 0.8rem;
                    color: #a89880;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    background: repeating-linear-gradient(
                        45deg,
                        #f0ead8,
                        #f0ead8 10px,
                        #ede7d5 10px,
                        #ede7d5 20px
                    );
                }

                .card-level-badge {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    background: rgba(26,18,8,0.85);
                    color: #fef3c7;
                    padding: 5px 12px;
                    border-radius: 100px;
                    backdrop-filter: blur(4px);
                }

                .card-body {
                    padding: 24px 28px 28px;
                }

                .card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #1a1208;
                    line-height: 1.3;
                    margin-bottom: 14px;
                }

                .card-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 16px;
                }

                .card-meta-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.8rem;
                    color: #6b5e4b;
                }

                .card-meta-icon {
                    width: 16px;
                    height: 16px;
                    flex-shrink: 0;
                    color: #d97706;
                }

                .card-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-bottom: 20px;
                }

                .card-tag {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.06em;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    color: #92540a;
                    padding: 3px 10px;
                    border-radius: 100px;
                }

                .card-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #1a1208;
                    text-decoration: none;
                    padding: 10px 20px;
                    border: 1.5px solid #1a1208;
                    border-radius: 100px;
                    transition: background 0.2s, color 0.2s;
                }

                .course-card:hover .card-cta {
                    background: #1a1208;
                    color: #fef3c7;
                }

                .card-cta-arrow {
                    transition: transform 0.2s;
                }

                .course-card:hover .card-cta-arrow {
                    transform: translateX(4px);
                }

                /* Empty state */
                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 80px 20px;
                    color: #92826b;
                }

                .empty-state-icon {
                    font-size: 3rem;
                    margin-bottom: 16px;
                }

                @media (max-width: 640px) {
                    .courses-grid {
                        grid-template-columns: 1fr;
                    }
                    .hero-stats {
                        gap: 20px;
                    }
                    .divider {
                        display: none;
                    }
                }
            `}</style>

            <main className="courses-root">

                {/* Hero */}
                <div className="courses-hero">
                    <div className="hero-eyebrow">
                        <span></span>
                        Government Recognized Programs
                    </div>
                    <h1 className="hero-title">
                        Build Your Career with <em>Professional</em> IT Training
                    </h1>
                    <p className="hero-subtitle">
                        Government-recognized computer courses in Ambikapur, Surguja —
                        designed to launch real careers in today's digital economy.
                    </p>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-num">{courses.length}+</div>
                            <div className="stat-label">Courses</div>
                        </div>
                        <div className="divider" />
                        <div className="stat-item">
                            <div className="stat-num">NSDC</div>
                            <div className="stat-label">Certified</div>
                        </div>
                        <div className="divider" />
                        <div className="stat-item">
                            <div className="stat-num">100%</div>
                            <div className="stat-label">Job Focused</div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="courses-grid-section">
                    <div className="section-label">
                        <div className="section-label-line" />
                        <div className="section-label-text">All Courses</div>
                        <div className="section-label-line" />
                    </div>

                    <div className="courses-grid">
                        {courses.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📚</div>
                                <p>No courses available at the moment. Check back soon.</p>
                            </div>
                        ) : (
                            courses.map((course: any) => (
                                <article key={course._id} className="course-card">

                                    {/* Banner */}
                                    <div className="card-banner">
                                        {course.banner ? (
                                            <Image
                                                src={course.banner}
                                                alt={`${course.name} course in Ambikapur`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 380px"
                                                className="object-cover"
                                                style={{ transition: "transform 0.5s ease" }}
                                            />
                                        ) : (
                                            <div className="card-banner-placeholder">
                                                Course Preview
                                            </div>
                                        )}
                                        <div className="card-level-badge">{course.level}</div>
                                    </div>

                                    {/* Body */}
                                    <div className="card-body">
                                        <h2 className="card-title">{course.name}</h2>

                                        <div className="card-meta">
                                            {course.duration && (
                                                <div className="card-meta-row">
                                                    <svg className="card-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                                    </svg>
                                                    {course.duration}
                                                </div>
                                            )}
                                            <div className="card-meta-row">
                                                <svg className="card-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                </svg>
                                                {course.authority}
                                            </div>
                                        </div>

                                        {/* Career tags preview */}
                                        {course.careerOpportunities?.length > 0 && (
                                            <div className="card-tags">
                                                {course.careerOpportunities
                                                    .slice(0, 3)
                                                    .map((career: string, i: number) => (
                                                        <span key={i} className="card-tag">
                                                            {career}
                                                        </span>
                                                    ))}
                                                {course.careerOpportunities.length > 3 && (
                                                    <span className="card-tag">
                                                        +{course.careerOpportunities.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <Link
                                            href={`/courses/${course.slug}`}
                                            className="card-cta"
                                        >
                                            View Details
                                            <span className="card-cta-arrow">→</span>
                                        </Link>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}