import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

async function fetchCourse(slug: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/courses/${slug}`,
        { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const course = await fetchCourse(slug);
    if (!course) return { title: "Course Not Found", robots: { index: false, follow: false } };
    return {
        title: `${course.name} Course in Ambikapur | Shivshakti Computer Academy`,
        description: `${course.name} course in Ambikapur at Shivshakti Computer Academy. Duration: ${course.duration}. Government-recognized certification program in Surguja, Chhattisgarh.`,
        openGraph: {
            title: `${course.name} Course | Shivshakti Computer Academy`,
            description: `${course.name} training in Ambikapur, Surguja.`,
            url: `https://www.shivshakticomputer.in/courses/${course.slug}`,
            images: course.banner ? [{ url: course.banner, width: 1200, height: 630, alt: course.name }] : [],
        },
        alternates: { canonical: `https://www.shivshakticomputer.in/courses/${course.slug}` },
    };
}

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = await fetchCourse(slug);
    if (!course) return notFound();

    return (
        <>
            <Script id="course-schema" type="application/ld+json" dangerouslySetInnerHTML={{
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
            }} />

            <style>{`
                .detail-root {
                    background: var(--color-bg);
                    min-height: 100vh;
                    font-family: 'DM Sans', sans-serif;
                }

                /* Breadcrumb */
                .detail-breadcrumb {
                    max-width: 900px; margin: 0 auto;
                    padding: 32px 24px 0;
                    display: flex; align-items: center; gap: 8px;
                    font-size: 0.8rem; color: var(--color-text-muted);
                }
                .detail-breadcrumb a { color: var(--color-text-muted); text-decoration: none; transition: color 0.2s; }
                .detail-breadcrumb a:hover { color: var(--color-primary); }

                /* Hero Banner */
                .detail-hero { max-width: 900px; margin: 24px auto 0; padding: 0 24px; }
                .detail-banner {
                    position: relative; height: 360px;
                    border-radius: 24px; overflow: hidden;
                    background: color-mix(in srgb,var(--color-primary) 10%,var(--color-bg));
                    box-shadow: 0 16px 60px color-mix(in srgb,var(--color-primary) 15%,transparent);
                }
                .detail-banner-placeholder {
                    display: flex; align-items: center; justify-content: center; height: 100%;
                    color: var(--color-text-muted); font-size: 0.85rem;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    background: repeating-linear-gradient(
                        45deg,
                        color-mix(in srgb,var(--color-primary) 5%,var(--color-bg)),
                        color-mix(in srgb,var(--color-primary) 5%,var(--color-bg)) 12px,
                        color-mix(in srgb,var(--color-primary) 8%,var(--color-bg)) 12px,
                        color-mix(in srgb,var(--color-primary) 8%,var(--color-bg)) 24px
                    );
                }
                .detail-banner-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 55%);
                }
                .detail-banner-meta {
                    position: absolute; bottom: 28px; left: 32px; right: 32px;
                    display: flex; align-items: flex-end; justify-content: space-between; gap: 16px;
                }
                .detail-level-badge {
                    font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 6px 14px; border-radius: 100px;
                    backdrop-filter: blur(4px);
                    background: rgba(15,23,42,0.4);
                }
                .detail-banner-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700;
                    color: #fff; line-height: 1.2;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    max-width: 480px;
                }

                /* Layout */
                .detail-layout {
                    max-width: 900px; margin: 0 auto;
                    padding: 48px 24px 96px;
                    display: grid; grid-template-columns: 1fr 300px;
                    gap: 48px; align-items: start;
                }

                /* Sections */
                .detail-section { margin-bottom: 52px; }
                .detail-section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
                .detail-section-icon {
                    width: 36px; height: 36px;
                    background: color-mix(in srgb,var(--color-primary) 8%,var(--color-bg));
                    border: 1px solid color-mix(in srgb,var(--color-primary) 22%,transparent);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1rem; flex-shrink: 0;
                }
                .detail-section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem; font-weight: 600; color: var(--color-text);
                }

                /* Designed For */
                .designed-for-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .designed-for-item {
                    display: flex; align-items: flex-start; gap: 10px;
                    background: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: 12px; padding: 14px 16px;
                    font-size: 0.85rem; color: var(--color-text); line-height: 1.5;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .designed-for-item:hover {
                    border-color: var(--color-primary);
                    box-shadow: 0 4px 16px color-mix(in srgb,var(--color-primary) 8%,transparent);
                }
                .designed-for-dot {
                    width: 7px; height: 7px;
                    background: var(--color-primary);
                    border-radius: 50%; margin-top: 5px; flex-shrink: 0;
                }

                /* Career */
                .career-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
                .career-item {
                    background: var(--color-bg-sidebar);
                    color: var(--color-text-inverse);
                    border-radius: 12px; padding: 16px;
                    font-size: 0.85rem; font-weight: 400; line-height: 1.4;
                    position: relative; overflow: hidden;
                    transition: background 0.2s;
                }
                .career-item:hover { background: color-mix(in srgb,var(--color-primary) 80%,var(--color-bg-sidebar)); }
                .career-item::before {
                    content: '→'; position: absolute; bottom: 12px; right: 14px;
                    font-size: 0.75rem; color: var(--color-info); opacity: 0.7;
                }

                /* Syllabus */
                .syllabus-list { display: flex; flex-direction: column; gap: 14px; }
                .syllabus-module {
                    background: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: 16px; overflow: hidden;
                    transition: box-shadow 0.2s;
                }
                .syllabus-module:hover { box-shadow: 0 6px 24px color-mix(in srgb,var(--color-primary) 9%,transparent); }
                .syllabus-module-header {
                    display: flex; align-items: center; gap: 16px;
                    padding: 18px 22px;
                    border-bottom: 1px solid var(--color-border);
                }
                .module-number {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem; font-weight: 700;
                    color: var(--color-primary); min-width: 32px;
                }
                .module-name { font-weight: 500; font-size: 0.95rem; color: var(--color-text); }
                .syllabus-topics { padding: 16px 22px 20px; display: flex; flex-direction: column; gap: 8px; }
                .topic-item { display: flex; align-items: center; gap: 10px; font-size: 0.83rem; color: var(--color-text-muted); }
                .topic-bullet { width: 4px; height: 4px; background: var(--color-primary); border-radius: 50%; flex-shrink: 0; }

                /* Sidebar */
                .detail-sidebar { position: sticky; top: 24px; }
                .sidebar-card {
                    background: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: 20px; padding: 28px;
                    box-shadow: 0 8px 32px color-mix(in srgb,var(--color-primary) 8%,transparent);
                }
                .sidebar-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem; font-weight: 600; color: var(--color-text);
                    margin-bottom: 20px; padding-bottom: 16px;
                    border-bottom: 1px solid var(--color-border);
                }
                .sidebar-info-row {
                    display: flex; align-items: flex-start; gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid color-mix(in srgb,var(--color-border) 60%,transparent);
                }
                .sidebar-info-row:last-of-type { border-bottom: none; }
                .sidebar-icon {
                    width: 32px; height: 32px;
                    background: color-mix(in srgb,var(--color-primary) 8%,var(--color-bg));
                    border: 1px solid color-mix(in srgb,var(--color-primary) 22%,transparent);
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem; flex-shrink: 0;
                }
                .sidebar-info-label {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.1em;
                    text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 3px;
                }
                .sidebar-info-value { font-size: 0.85rem; color: var(--color-text); font-weight: 400; line-height: 1.45; }

                .sidebar-cta {
                    margin-top: 24px; display: block; width: 100%;
                    text-align: center;
                    background: var(--color-accent); color: #fff;
                    font-size: 0.9rem; font-weight: 500;
                    padding: 14px 20px; border-radius: 14px; text-decoration: none;
                    transition: background 0.2s, transform 0.15s;
                    letter-spacing: 0.02em;
                    box-shadow: 0 2px 12px color-mix(in srgb,var(--color-accent) 35%,transparent);
                }
                .sidebar-cta:hover { background: color-mix(in srgb,var(--color-accent) 85%,#000); transform: translateY(-1px); }
                .sidebar-cta-sub { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.7); margin-top: 3px; font-weight: 300; }

                .back-link {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 0.8rem; color: var(--color-text-muted);
                    text-decoration: none; margin-top: 20px; transition: color 0.2s;
                }
                .back-link:hover { color: var(--color-primary); }

                @media (max-width: 768px) {
                    .detail-layout { grid-template-columns: 1fr; }
                    .detail-sidebar { order: -1; }
                    .detail-banner { height: 240px; }
                    .designed-for-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 480px) { .designed-for-grid { grid-template-columns: 1fr; } }
            `}</style>

            <main className="detail-root">

                {/* Breadcrumb */}
                <nav className="detail-breadcrumb">
                    <Link href="/">Home</Link>
                    <span>›</span>
                    <Link href="/courses">Courses</Link>
                    <span>›</span>
                    <span style={{ color:"var(--color-text)" }}>{course.name}</span>
                </nav>

                {/* Hero Banner */}
                <div className="detail-hero">
                    <div className="detail-banner">
                        {course.banner ? (
                            <Image src={course.banner} alt={course.name} fill sizes="(max-width: 768px) 100vw, 900px" className="object-cover" priority />
                        ) : (
                            <div className="detail-banner-placeholder">Course Preview</div>
                        )}
                        <div className="detail-banner-overlay" />
                        <div className="detail-banner-meta">
                            <h1 className="detail-banner-title">{course.name}</h1>
                            <div className="detail-level-badge">{course.level}</div>
                        </div>
                    </div>
                </div>

                {/* Layout */}
                <div className="detail-layout">
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
                                        <div key={i} className="career-item">{item}</div>
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
                                                <span className="module-number">{String(i + 1).padStart(2, "0")}</span>
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

                        <Link href="/courses" className="back-link">← Back to All Courses</Link>
                    </div>

                    {/* Sidebar */}
                    <aside className="detail-sidebar">
                        <div className="sidebar-card">
                            <div className="sidebar-card-title">Course Details</div>
                            {course.duration && (
                                <div className="sidebar-info-row">
                                    <div className="sidebar-icon">⏱</div>
                                    <div><div className="sidebar-info-label">Duration</div><div className="sidebar-info-value">{course.duration}</div></div>
                                </div>
                            )}
                            {course.eligibility && (
                                <div className="sidebar-info-row">
                                    <div className="sidebar-icon">✅</div>
                                    <div><div className="sidebar-info-label">Eligibility</div><div className="sidebar-info-value">{course.eligibility}</div></div>
                                </div>
                            )}
                            <div className="sidebar-info-row">
                                <div className="sidebar-icon">🏛</div>
                                <div><div className="sidebar-info-label">Authority</div><div className="sidebar-info-value">{course.authority}</div></div>
                            </div>
                            {course.verification && (
                                <div className="sidebar-info-row">
                                    <div className="sidebar-icon">🔗</div>
                                    <div><div className="sidebar-info-label">Verification</div><div className="sidebar-info-value">{course.verification}</div></div>
                                </div>
                            )}
                            {course.certificate && (
                                <div className="sidebar-info-row">
                                    <div className="sidebar-icon">🎓</div>
                                    <div><div className="sidebar-info-label">Certificate</div><div className="sidebar-info-value">{course.certificate}</div></div>
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