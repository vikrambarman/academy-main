import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import "@/models/Franchise";
import "@/models/CertificateType";

export const dynamic = "force-dynamic";

async function getCourse(slug: string) {
    try {
        await connectDB();
        const course = await Course.findOne({ slug, isActive: true }).lean();
        if (!course) return null;

        const configs = await CourseFranchiseConfig.find({
            course: (course as any)._id,
        })
            .populate("franchise", "name code registeredBodies isOwn portalUrl portalLoginRequired")
            .populate("defaultCertType", "name code issuingBody verificationMethod verificationUrl benefits")
            .lean();

        return {
            ...(course as any),
            _id: (course as any)._id.toString(),
            franchiseOptions: configs.map((cfg: any) => ({
                ...cfg,
                _id: cfg._id.toString(),
                franchise: cfg.franchise ? { ...cfg.franchise, _id: cfg.franchise._id?.toString() } : null,
                defaultCertType: cfg.defaultCertType ? { ...cfg.defaultCertType, _id: cfg.defaultCertType._id?.toString() } : null,
            })),
        };
    } catch (e) {
        console.error("getCourse error:", e);
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourse(slug);
    if (!course) return { title: "Course Not Found", robots: { index: false, follow: false } };

    const franchiseNames = course.franchiseOptions?.length > 0
        ? course.franchiseOptions.map((c: any) => c.franchise?.name).filter(Boolean).join(", ")
        : course.authority || "";

    return {
        title: `${course.name} Course in Ambikapur | Shivshakti Computer Academy`,
        description: `${course.name} course in Ambikapur. Duration: ${course.duration || "Flexible"}. ${franchiseNames ? `Certified by ${franchiseNames}.` : ""} Government-recognized program in Surguja, Chhattisgarh.`,
        openGraph: {
            title: `${course.name} Course | Shivshakti Computer Academy`,
            description: `${course.name} training in Ambikapur, Surguja.`,
            url: `https://www.shivshakticomputer.in/courses/${course.slug}`,
            images: course.banner ? [{ url: course.banner, width: 1200, height: 630, alt: course.name }] : [],
        },
        alternates: { canonical: `https://www.shivshakticomputer.in/courses/${course.slug}` },
    };
}

export default async function CourseDetail(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const course = await getCourse(slug);
    if (!course) return notFound();

    const franchiseOptions = course.franchiseOptions || [];
    const hasConfigs       = franchiseOptions.length > 0;

    const allBodies = [...new Set<string>(
        franchiseOptions.flatMap((cfg: any) => cfg.franchise?.registeredBodies || [])
    )];

    return (
        <>
            <Script id="course-schema" type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Course",
                    name: course.name,
                    description: `${course.name} professional computer course in Ambikapur.`,
                    provider: { "@type": "EducationalOrganization", name: "Shivshakti Computer Academy", sameAs: "https://www.shivshakticomputer.in" },
                    ...(course.duration && { timeRequired: course.duration }),
                }),
            }} />

            <style>{`
                .cd-root { background:var(--color-bg); min-height:100vh; font-family:'DM Sans',sans-serif; }

                .cd-breadcrumb { max-width:1100px; margin:0 auto; padding:28px 24px 0; display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--color-text-muted); flex-wrap:wrap; }
                .cd-breadcrumb a { color:var(--color-text-muted); text-decoration:none; transition:color 0.2s; }
                .cd-breadcrumb a:hover { color:var(--color-primary); }

                .cd-banner-wrap { max-width:1100px; margin:20px auto 0; padding:0 24px; }
                .cd-banner { position:relative; height:420px; border-radius:24px; overflow:hidden; background:color-mix(in srgb,var(--color-primary) 10%,var(--color-bg)); box-shadow:0 20px 60px color-mix(in srgb,var(--color-primary) 15%,transparent); }
                .cd-banner-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(10,15,30,0.88) 0%,rgba(10,15,30,0.15) 55%,transparent 100%); }
                .cd-banner-placeholder { display:flex; align-items:center; justify-content:center; height:100%; color:var(--color-text-muted); font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; background:repeating-linear-gradient(45deg,color-mix(in srgb,var(--color-primary) 5%,var(--color-bg)),color-mix(in srgb,var(--color-primary) 5%,var(--color-bg)) 12px,color-mix(in srgb,var(--color-primary) 8%,var(--color-bg)) 12px,color-mix(in srgb,var(--color-primary) 8%,var(--color-bg)) 24px); }

                .cd-banner-bottom { position:absolute; bottom:0; left:0; right:0; padding:28px 36px; display:flex; align-items:flex-end; justify-content:space-between; gap:20px; flex-wrap:wrap; }
                .cd-banner-left { flex:1; min-width:0; }
                .cd-level-pill { display:inline-block; font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.8); border:1px solid rgba(255,255,255,0.25); padding:4px 12px; border-radius:100px; backdrop-filter:blur(4px); background:rgba(15,23,42,0.3); margin-bottom:10px; }
                .cd-banner-title { font-family:'Playfair Display',serif; font-size:clamp(1.5rem,3.5vw,2.4rem); font-weight:700; color:#fff; line-height:1.2; text-shadow:0 2px 12px rgba(0,0,0,0.5); }
                .cd-quick-info { display:flex; gap:8px; flex-wrap:wrap; }
                .cd-quick-pill { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:500; color:#fff; background:rgba(15,23,42,0.65); border:1px solid rgba(255,255,255,0.15); padding:6px 13px; border-radius:100px; backdrop-filter:blur(4px); white-space:nowrap; }

                .cd-layout { max-width:1100px; margin:0 auto; padding:40px 24px 80px; display:grid; grid-template-columns:1fr 340px; gap:40px; align-items:start; }

                /* Sections */
                .cd-section { margin-bottom:48px; }
                .cd-section-header { display:flex; align-items:center; gap:12px; margin-bottom:22px; padding-bottom:14px; border-bottom:1px solid var(--color-border); }
                .cd-section-icon { width:38px; height:38px; background:color-mix(in srgb,var(--color-primary) 8%,var(--color-bg)); border:1px solid color-mix(in srgb,var(--color-primary) 22%,transparent); border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
                .cd-section-title { font-family:'Playfair Display',serif; font-size:1.35rem; font-weight:600; color:var(--color-text); }

                .cd-designed-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
                .cd-designed-item { display:flex; align-items:flex-start; gap:10px; background:var(--color-bg-card); border:1px solid var(--color-border); border-radius:12px; padding:14px 16px; font-size:0.85rem; color:var(--color-text); line-height:1.5; transition:border-color 0.2s; }
                .cd-designed-item:hover { border-color:var(--color-primary); }
                .cd-designed-dot { width:7px; height:7px; background:var(--color-primary); border-radius:50%; margin-top:5px; flex-shrink:0; }

                .cd-career-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:10px; }
                .cd-career-item { background:var(--color-bg-sidebar); color:var(--color-text-inverse); border-radius:12px; padding:14px 16px 24px; font-size:0.85rem; line-height:1.4; position:relative; overflow:hidden; transition:background 0.2s; }
                .cd-career-item:hover { background:color-mix(in srgb,var(--color-primary) 80%,var(--color-bg-sidebar)); }
                .cd-career-item::after { content:'→'; position:absolute; bottom:10px; right:14px; font-size:0.75rem; color:var(--color-info); opacity:0.6; }

                .cd-syllabus { display:flex; flex-direction:column; gap:12px; }
                .cd-module { background:var(--color-bg-card); border:1px solid var(--color-border); border-radius:14px; overflow:hidden; }
                .cd-module-head { display:flex; align-items:center; gap:14px; padding:16px 20px; border-bottom:1px solid var(--color-border); background:color-mix(in srgb,var(--color-primary) 3%,var(--color-bg-card)); }
                .cd-module-num { font-family:'Playfair Display',serif; font-size:1rem; font-weight:700; color:var(--color-primary); min-width:28px; }
                .cd-module-name { font-weight:500; font-size:0.95rem; color:var(--color-text); flex:1; }
                .cd-module-count { font-size:10px; color:var(--color-text-muted); background:color-mix(in srgb,var(--color-primary) 8%,var(--color-bg)); padding:2px 8px; border-radius:100px; white-space:nowrap; }
                .cd-topics { padding:14px 20px 16px; display:grid; grid-template-columns:1fr 1fr; gap:6px; }
                .cd-topic { display:flex; align-items:center; gap:8px; font-size:0.82rem; color:var(--color-text-muted); }
                .cd-topic-dot { width:4px; height:4px; background:var(--color-primary); border-radius:50%; flex-shrink:0; }

                /* Sidebar */
                .cd-sidebar { position:sticky; top:24px; display:flex; flex-direction:column; gap:16px; }

                .cd-info-card { background:var(--color-bg-card); border:1px solid var(--color-border); border-radius:20px; overflow:hidden; box-shadow:0 8px 32px color-mix(in srgb,var(--color-primary) 8%,transparent); }
                .cd-info-head { padding:16px 22px; border-bottom:1px solid var(--color-border); background:color-mix(in srgb,var(--color-primary) 4%,var(--color-bg-card)); }
                .cd-info-head-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:600; color:var(--color-text); }
                .cd-info-row { display:flex; align-items:center; gap:14px; padding:12px 22px; border-bottom:1px solid color-mix(in srgb,var(--color-border) 50%,transparent); }
                .cd-info-row:last-child { border-bottom:none; }
                .cd-info-icon { width:34px; height:34px; background:color-mix(in srgb,var(--color-primary) 8%,var(--color-bg)); border:1px solid color-mix(in srgb,var(--color-primary) 20%,transparent); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:0.95rem; flex-shrink:0; }
                .cd-info-label { font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-text-muted); margin-bottom:2px; }
                .cd-info-value { font-size:0.87rem; color:var(--color-text); line-height:1.45; }
                .cd-cta-wrap { padding:16px 22px; border-top:1px solid var(--color-border); }
                .cd-cta { display:block; width:100%; text-align:center; background:var(--color-accent); color:#fff; font-size:0.95rem; font-weight:600; padding:14px 20px; border-radius:13px; text-decoration:none; transition:background 0.2s,transform 0.15s; box-shadow:0 4px 16px color-mix(in srgb,var(--color-accent) 30%,transparent); }
                .cd-cta:hover { background:color-mix(in srgb,var(--color-accent) 85%,#000); transform:translateY(-1px); }
                .cd-cta-sub { display:block; font-size:0.72rem; color:rgba(255,255,255,0.7); margin-top:3px; font-weight:300; }

                .cd-programs-card { background:var(--color-bg-card); border:1px solid var(--color-border); border-radius:20px; overflow:hidden; }
                .cd-programs-head { padding:16px 22px; border-bottom:1px solid var(--color-border); background:color-mix(in srgb,var(--color-primary) 4%,var(--color-bg-card)); display:flex; align-items:center; gap:8px; }
                .cd-programs-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:600; color:var(--color-text); }
                .cd-programs-count { font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px; background:color-mix(in srgb,var(--color-primary) 12%,var(--color-bg)); color:var(--color-primary); }

                .cd-program-item { padding:16px 22px; border-bottom:1px solid color-mix(in srgb,var(--color-border) 60%,transparent); }
                .cd-program-item:last-child { border-bottom:none; }
                .cd-program-head { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
                .cd-program-code { font-size:9px; font-weight:800; padding:3px 9px; border-radius:5px; color:#fff; letter-spacing:0.06em; flex-shrink:0; }
                .cd-program-name { font-size:13px; font-weight:700; color:var(--color-text); }
                .cd-program-cert { display:flex; align-items:center; gap:6px; font-size:11px; color:var(--color-text-muted); margin-bottom:8px; line-height:1.4; }
                .cd-program-cert-dot { width:4px; height:4px; border-radius:50%; background:var(--color-primary); flex-shrink:0; }
                .cd-program-bodies { display:flex; flex-wrap:wrap; gap:4px; }
                .cd-body-pill { font-size:9px; font-weight:700; padding:2px 8px; border-radius:100px; background:color-mix(in srgb,var(--color-primary) 8%,var(--color-bg)); color:var(--color-primary); border:1px solid color-mix(in srgb,var(--color-primary) 25%,transparent); }

                .cd-recognized-strip { padding:12px 22px; background:color-mix(in srgb,var(--color-primary) 4%,var(--color-bg-card)); border-top:1px solid var(--color-border); display:flex; flex-wrap:wrap; gap:5px; align-items:center; }
                .cd-recognized-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-text-muted); width:100%; margin-bottom:4px; }

                .cd-back { display:inline-flex; align-items:center; gap:6px; font-size:0.8rem; color:var(--color-text-muted); text-decoration:none; margin-top:8px; transition:color 0.2s; }
                .cd-back:hover { color:var(--color-primary); }

                @media(max-width:900px) {
                    .cd-layout { grid-template-columns:1fr; padding:24px 16px 60px; gap:24px; }
                    .cd-sidebar { position:static; order:-1; }
                    .cd-banner { height:280px; }
                    .cd-banner-bottom { padding:20px 22px; }
                    .cd-banner-title { font-size:1.4rem; }
                    .cd-banner-wrap { padding:0 16px; }
                    .cd-breadcrumb { padding:20px 16px 0; }
                    .cd-topics { grid-template-columns:1fr; }
                }
                @media(max-width:560px) {
                    .cd-designed-grid { grid-template-columns:1fr; }
                    .cd-career-grid { grid-template-columns:1fr 1fr; }
                    .cd-banner { height:220px; }
                    .cd-quick-info { display:none; }
                }
            `}</style>

            <main className="cd-root">

                <nav className="cd-breadcrumb">
                    <Link href="/">Home</Link>
                    <span>›</span>
                    <Link href="/courses">Courses</Link>
                    <span>›</span>
                    <span style={{ color: "var(--color-text)" }}>{course.name}</span>
                </nav>

                <div className="cd-banner-wrap">
                    <div className="cd-banner">
                        {course.banner ? (
                            <Image src={course.banner} alt={course.name} fill
                                sizes="(max-width:768px) 100vw, 1100px"
                                className="object-cover" priority />
                        ) : (
                            <div className="cd-banner-placeholder">Course Preview</div>
                        )}
                        <div className="cd-banner-overlay" />
                        <div className="cd-banner-bottom">
                            <div className="cd-banner-left">
                                <div className="cd-level-pill">{course.level}</div>
                                <h1 className="cd-banner-title">{course.name}</h1>
                            </div>
                            <div className="cd-quick-info">
                                {course.duration && (
                                    <span className="cd-quick-pill">⏱ {course.duration}</span>
                                )}
                                {course.eligibility && (
                                    <span className="cd-quick-pill">✅ {course.eligibility}</span>
                                )}
                                {allBodies.slice(0, 2).map((b: string) => (
                                    <span key={b} className="cd-quick-pill">🏛 {b}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cd-layout">

                    {/* Left content */}
                    <div>
                        {course.designedFor?.length > 0 && (
                            <div className="cd-section">
                                <div className="cd-section-header">
                                    <div className="cd-section-icon">🎯</div>
                                    <h2 className="cd-section-title">Designed For</h2>
                                </div>
                                <div className="cd-designed-grid">
                                    {course.designedFor.map((item: string, i: number) => (
                                        <div key={i} className="cd-designed-item">
                                            <div className="cd-designed-dot" />{item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {course.careerOpportunities?.length > 0 && (
                            <div className="cd-section">
                                <div className="cd-section-header">
                                    <div className="cd-section-icon">💼</div>
                                    <h2 className="cd-section-title">Career Opportunities</h2>
                                </div>
                                <div className="cd-career-grid">
                                    {course.careerOpportunities.map((item: string, i: number) => (
                                        <div key={i} className="cd-career-item">{item}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {course.syllabus?.length > 0 && (
                            <div className="cd-section">
                                <div className="cd-section-header">
                                    <div className="cd-section-icon">📖</div>
                                    <h2 className="cd-section-title">Course Syllabus</h2>
                                </div>
                                <div className="cd-syllabus">
                                    {course.syllabus.map((mod: any, i: number) => (
                                        <div key={i} className="cd-module">
                                            <div className="cd-module-head">
                                                <span className="cd-module-num">{String(i+1).padStart(2,"0")}</span>
                                                <span className="cd-module-name">{mod.module}</span>
                                                {mod.topics?.length > 0 && (
                                                    <span className="cd-module-count">{mod.topics.length} topics</span>
                                                )}
                                            </div>
                                            {mod.topics?.length > 0 && (
                                                <div className="cd-topics">
                                                    {mod.topics.map((t: string, j: number) => (
                                                        <div key={j} className="cd-topic">
                                                            <div className="cd-topic-dot" />{t}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Link href="/courses" className="cd-back">← Back to All Courses</Link>
                    </div>

                    {/* Right sidebar */}
                    <aside className="cd-sidebar">

                        {/* Course Details */}
                        <div className="cd-info-card">
                            <div className="cd-info-head">
                                <div className="cd-info-head-title">Course Details</div>
                            </div>

                            {course.duration && (
                                <div className="cd-info-row">
                                    <div className="cd-info-icon">⏱</div>
                                    <div>
                                        <div className="cd-info-label">Duration</div>
                                        <div className="cd-info-value">{course.duration}</div>
                                    </div>
                                </div>
                            )}
                            {course.eligibility && (
                                <div className="cd-info-row">
                                    <div className="cd-info-icon">✅</div>
                                    <div>
                                        <div className="cd-info-label">Eligibility</div>
                                        <div className="cd-info-value">{course.eligibility}</div>
                                    </div>
                                </div>
                            )}
                            {/* Offered By — franchise names OR legacy authority */}
                            {hasConfigs ? (
                                <div className="cd-info-row">
                                    <div className="cd-info-icon">🏛</div>
                                    <div>
                                        <div className="cd-info-label">Offered By</div>
                                        <div className="cd-info-value">
                                            {franchiseOptions
                                                .map((cfg: any) => cfg.franchise?.name)
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </div>
                                    </div>
                                </div>
                            ) : course.authority ? (
                                <div className="cd-info-row">
                                    <div className="cd-info-icon">🏛</div>
                                    <div>
                                        <div className="cd-info-label">Authority</div>
                                        <div className="cd-info-value">{course.authority}</div>
                                    </div>
                                </div>
                            ) : null}

                            {/* Legacy verification only if no franchise configs */}
                            {!hasConfigs && course.verification && (
                                <div className="cd-info-row">
                                    <div className="cd-info-icon">🔗</div>
                                    <div>
                                        <div className="cd-info-label">Verification</div>
                                        <div className="cd-info-value">{course.verification}</div>
                                    </div>
                                </div>
                            )}
                            <div className="cd-cta-wrap">
                                <a href="tel:+917477036832" className="cd-cta">
                                    Enroll Now
                                    <span className="cd-cta-sub">Call us to get started today</span>
                                </a>
                            </div>
                        </div>

                        {/* Available Programs — only if franchise configs exist */}
                        {hasConfigs && (
                            <div className="cd-programs-card">
                                <div className="cd-programs-head">
                                    <div className="cd-programs-title">Available Programs</div>
                                    <span className="cd-programs-count">{franchiseOptions.length}</span>
                                </div>

                                {franchiseOptions.map((cfg: any, i: number) => {
                                    const f = cfg.franchise;
                                    const c = cfg.defaultCertType;
                                    if (!f) return null;
                                    const color = f.isOwn ? "#F59E0B" : "var(--color-primary)";
                                    return (
                                        <div key={i} className="cd-program-item">
                                            <div className="cd-program-head">
                                                <span className="cd-program-code" style={{ background: color }}>
                                                    {f.code}
                                                </span>
                                                <span className="cd-program-name">{f.name}</span>
                                            </div>
                                            {c && (
                                                <div className="cd-program-cert">
                                                    <div className="cd-program-cert-dot" />
                                                    {c.name}
                                                    {c.issuingBody && (
                                                        <span style={{ opacity: 0.7 }}> · {c.issuingBody}</span>
                                                    )}
                                                </div>
                                            )}
                                            {f.registeredBodies?.length > 0 && (
                                                <div className="cd-program-bodies">
                                                    {f.registeredBodies.map((b: string) => (
                                                        <span key={b} className="cd-body-pill">{b}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {allBodies.length > 0 && (
                                    <div className="cd-recognized-strip">
                                        <div className="cd-recognized-label">Recognized by</div>
                                        {allBodies.map((b: string) => (
                                            <span key={b} className="cd-body-pill">{b}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </aside>
                </div>
            </main>
        </>
    );
}