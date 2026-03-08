import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

/* ── Shared Fetch ───────────────────────────────────────────────────────────── */
async function fetchCourse(slug: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/courses/${slug}`,
        { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
}

/* ── Dynamic Metadata ───────────────────────────────────────────────────────── */
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
            robots: { index: false, follow: false },
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
                ? [{ url: course.banner, width: 1200, height: 630, alt: course.name }]
                : [],
        },
        alternates: {
            canonical: `https://www.shivshakticomputer.in/courses/${course.slug}`,
        },
    };
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
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

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .detail-root {
                    font-family: 'DM Sans', sans-serif;
                    background-color: #faf8f4;
                    min-height: 100vh;
                }

                /* ── Breadcrumb ── */
                .detail-breadcrumb {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 32px 24px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.8rem;
                    color: #92826b;
                }

                .detail-breadcrumb a {
                    color: #92826b;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .detail-breadcrumb a:hover {
                    color: #b45309;
                }

                /* ── Hero Banner ── */
                .detail-hero {
                    max-width: 900px;
                    margin: 24px auto 0;
                    padding: 0 24px;
                }

                .detail-banner {
                    position: relative;
                    height: 360px;
                    border-radius: 24px;
                    overflow: hidden;
                    background: #f0ead8;
                    box-shadow: 0 16px 60px rgba(100,70,20,0.15);
                }

                .detail-banner-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #a89880;
                    font-size: 0.85rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    background: repeating-linear-gradient(
                        45deg,
                        #f0ead8,
                        #f0ead8 12px,
                        #ede7d5 12px,
                        #ede7d5 24px
                    );
                }

                .detail-banner-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to top,
                        rgba(26,18,8,0.65) 0%,
                        transparent 55%
                    );
                }

                .detail-banner-meta {
                    position: absolute;
                    bottom: 28px;
                    left: 32px;
                    right: 32px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 16px;
                }

                .detail-level-badge {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #fef3c7;
                    border: 1px solid rgba(253,230,138,0.5);
                    padding: 6px 14px;
                    border-radius: 100px;
                    backdrop-filter: blur(4px);
                    background: rgba(26,18,8,0.4);
                }

                .detail-banner-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.4rem, 3vw, 2rem);
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.2;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    max-width: 480px;
                }

                /* ── Layout ── */
                .detail-layout {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 48px 24px 96px;
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 48px;
                    align-items: start;
                }

                @media (max-width: 768px) {
                    .detail-layout {
                        grid-template-columns: 1fr;
                    }
                    .detail-sidebar {
                        order: -1;
                    }
                    .detail-banner {
                        height: 240px;
                    }
                    .detail-banner-title {
                        font-size: 1.2rem;
                    }
                }

                /* ── Main Content ── */
                .detail-section {
                    margin-bottom: 52px;
                }

                .detail-section-header {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 24px;
                }

                .detail-section-icon {
                    width: 36px;
                    height: 36px;
                    background: #fef3c7;
                    border: 1px solid #fde68a;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    flex-shrink: 0;
                }

                .detail-section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: #1a1208;
                }

                /* Designed For */
                .designed-for-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }

                @media (max-width: 480px) {
                    .designed-for-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .designed-for-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 12px;
                    padding: 14px 16px;
                    font-size: 0.85rem;
                    color: #4a3f30;
                    line-height: 1.5;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .designed-for-item:hover {
                    border-color: #fcd34d;
                    box-shadow: 0 4px 16px rgba(217,119,6,0.08);
                }

                .designed-for-dot {
                    width: 7px;
                    height: 7px;
                    background: #d97706;
                    border-radius: 50%;
                    margin-top: 5px;
                    flex-shrink: 0;
                }

                /* Career Opportunities */
                .career-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 10px;
                }

                .career-item {
                    background: #1a1208;
                    color: #fef3c7;
                    border-radius: 12px;
                    padding: 16px;
                    font-size: 0.85rem;
                    font-weight: 400;
                    line-height: 1.4;
                    position: relative;
                    overflow: hidden;
                    transition: background 0.2s;
                }

                .career-item:hover {
                    background: #2d1f0d;
                }

                .career-item::before {
                    content: '→';
                    position: absolute;
                    bottom: 12px;
                    right: 14px;
                    font-size: 0.75rem;
                    color: #fcd34d;
                    opacity: 0.7;
                }

                /* Syllabus */
                .syllabus-list {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .syllabus-module {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: box-shadow 0.2s;
                }

                .syllabus-module:hover {
                    box-shadow: 0 6px 24px rgba(100,70,20,0.09);
                }

                .syllabus-module-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 18px 22px;
                    border-bottom: 1px solid #f0e8d8;
                }

                .module-number {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #d97706;
                    min-width: 32px;
                }

                .module-name {
                    font-weight: 500;
                    font-size: 0.95rem;
                    color: #1a1208;
                }

                .syllabus-topics {
                    padding: 16px 22px 20px 22px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .topic-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.83rem;
                    color: #5a4e3c;
                }

                .topic-bullet {
                    width: 4px;
                    height: 4px;
                    background: #d97706;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* ── Sidebar ── */
                .detail-sidebar {
                    position: sticky;
                    top: 24px;
                }

                .sidebar-card {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    padding: 28px;
                    box-shadow: 0 8px 32px rgba(100,70,20,0.08);
                }

                .sidebar-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1208;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #f0e8d8;
                }

                .sidebar-info-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid #f8f3ea;
                }

                .sidebar-info-row:last-of-type {
                    border-bottom: none;
                }

                .sidebar-icon {
                    width: 32px;
                    height: 32px;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .sidebar-info-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #92826b;
                    margin-bottom: 3px;
                }

                .sidebar-info-value {
                    font-size: 0.85rem;
                    color: #1a1208;
                    font-weight: 400;
                    line-height: 1.45;
                }

                .sidebar-cta {
                    margin-top: 24px;
                    display: block;
                    width: 100%;
                    text-align: center;
                    background: #1a1208;
                    color: #fef3c7;
                    font-size: 0.9rem;
                    font-weight: 500;
                    padding: 14px 20px;
                    border-radius: 14px;
                    text-decoration: none;
                    transition: background 0.2s, transform 0.15s;
                    letter-spacing: 0.02em;
                }

                .sidebar-cta:hover {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                .sidebar-cta-sub {
                    display: block;
                    font-size: 0.72rem;
                    color: #fcd34d;
                    margin-top: 3px;
                    font-weight: 300;
                    letter-spacing: 0.04em;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    color: #92826b;
                    text-decoration: none;
                    margin-top: 20px;
                    transition: color 0.2s;
                }

                .back-link:hover {
                    color: #b45309;
                }
            `}</style>

            <main className="detail-root">

                {/* Breadcrumb */}
                <nav className="detail-breadcrumb">
                    <Link href="/">Home</Link>
                    <span>›</span>
                    <Link href="/courses">Courses</Link>
                    <span>›</span>
                    <span style={{ color: "#4a3f30" }}>{course.name}</span>
                </nav>

                {/* Hero Banner */}
                <div className="detail-hero">
                    <div className="detail-banner">
                        {course.banner ? (
                            <Image
                                src={course.banner}
                                alt={course.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 900px"
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="detail-banner-placeholder">
                                Course Preview
                            </div>
                        )}
                        <div className="detail-banner-overlay" />
                        <div className="detail-banner-meta">
                            <h1 className="detail-banner-title">{course.name}</h1>
                            <div className="detail-level-badge">{course.level}</div>
                        </div>
                    </div>
                </div>

                {/* Layout: Main + Sidebar */}
                <div className="detail-layout">

                    {/* ── Main Content ── */}
                    <div>

                        {/* Designed For */}
                        {course.designedFor?.length > 0 && (
                            <div className="detail-section">
                                <div className="detail-section-header">
                                    <div className="detail-section-icon">🎯</div>
                                    <h2 className="detail-section-title">Designed For</h2>
                                </div>
                                <div className="designed-for-grid">
                                    {course.designedFor.map((item: string, i: number) => (
                                        <div key={i} className="designed-for-item">
                                            <div className="designed-for-dot" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Career Opportunities */}
                        {course.careerOpportunities?.length > 0 && (
                            <div className="detail-section">
                                <div className="detail-section-header">
                                    <div className="detail-section-icon">💼</div>
                                    <h2 className="detail-section-title">Career Opportunities</h2>
                                </div>
                                <div className="career-grid">
                                    {course.careerOpportunities.map((item: string, i: number) => (
                                        <div key={i} className="career-item">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Syllabus */}
                        {course.syllabus?.length > 0 && (
                            <div className="detail-section">
                                <div className="detail-section-header">
                                    <div className="detail-section-icon">📖</div>
                                    <h2 className="detail-section-title">Course Syllabus</h2>
                                </div>
                                <div className="syllabus-list">
                                    {course.syllabus.map((module: any, i: number) => (
                                        <div key={i} className="syllabus-module">
                                            <div className="syllabus-module-header">
                                                <span className="module-number">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <span className="module-name">{module.module}</span>
                                            </div>
                                            {module.topics?.length > 0 && (
                                                <div className="syllabus-topics">
                                                    {module.topics.map((topic: string, j: number) => (
                                                        <div key={j} className="topic-item">
                                                            <div className="topic-bullet" />
                                                            {topic}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Link href="/courses" className="back-link">
                            ← Back to All Courses
                        </Link>
                    </div>

                    {/* ── Sidebar ── */}
                    <aside className="detail-sidebar">
                        <div className="sidebar-card">
                            <div className="sidebar-card-title">Course Details</div>

                            {course.duration && (
                                <div className="sidebar-info-row">
                                    <div className="sidebar-icon">⏱</div>
                                    <div>
                                        <div className="sidebar-info-label">Duration</div>
                                        <div className="sidebar-info-value">{course.duration}</div>
                                    </div>
                                </div>
                            )}

                            {course.eligibility && (
                                <div className="sidebar-info-row">
                                    <div className="sidebar-icon">✅</div>
                                    <div>
                                        <div className="sidebar-info-label">Eligibility</div>
                                        <div className="sidebar-info-value">{course.eligibility}</div>
                                    </div>
                                </div>
                            )}

                            <div className="sidebar-info-row">
                                <div className="sidebar-icon">🏛</div>
                                <div>
                                    <div className="sidebar-info-label">Authority</div>
                                    <div className="sidebar-info-value">{course.authority}</div>
                                </div>
                            </div>

                            {course.verification && (
                                <div className="sidebar-info-row">
                                    <div className="sidebar-icon">🔗</div>
                                    <div>
                                        <div className="sidebar-info-label">Verification</div>
                                        <div className="sidebar-info-value">{course.verification}</div>
                                    </div>
                                </div>
                            )}

                            {course.certificate && (
                                <div className="sidebar-info-row">
                                    <div className="sidebar-icon">🎓</div>
                                    <div>
                                        <div className="sidebar-info-label">Certificate</div>
                                        <div className="sidebar-info-value">{course.certificate}</div>
                                    </div>
                                </div>
                            )}

                            <a href="tel:+917477036832" className="sidebar-cta">
                                Enroll Now
                                <span className="sidebar-cta-sub">Call us to get started today</span>
                            </a>
                        </div>
                    </aside>

                </div>
            </main>
        </>
    );
}