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

/* ─── Data Fetching ─────────────────────────────────────────────── */

async function getCourse(slug: string) {
    try {
        await connectDB();
        const course = await Course.findOne({ slug, isActive: true }).lean();
        if (!course) return null;

        const configs = await CourseFranchiseConfig.find({
            course: (course as any)._id,
        })
            .populate(
                "franchise",
                "name code registeredBodies isOwn portalUrl portalLoginRequired"
            )
            .populate(
                "defaultCertType",
                "name code issuingBody verificationMethod verificationUrl benefits"
            )
            .lean();

        return {
            ...(course as any),
            _id: (course as any)._id.toString(),
            franchiseOptions: configs.map((cfg: any) => ({
                ...cfg,
                _id: cfg._id.toString(),
                franchise: cfg.franchise
                    ? { ...cfg.franchise, _id: cfg.franchise._id?.toString() }
                    : null,
                defaultCertType: cfg.defaultCertType
                    ? {
                          ...cfg.defaultCertType,
                          _id: cfg.defaultCertType._id?.toString(),
                      }
                    : null,
            })),
        };
    } catch (e) {
        console.error("getCourse error:", e);
        return null;
    }
}

/* ─── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourse(slug);
    if (!course)
        return {
            title: "Course Not Found",
            robots: { index: false, follow: false },
        };

    const franchiseNames =
        course.franchiseOptions?.length > 0
            ? course.franchiseOptions
                  .map((c: any) => c.franchise?.name)
                  .filter(Boolean)
                  .join(", ")
            : course.authority || "";

    return {
        title: `${course.name} Course in Ambikapur | Shivshakti Computer Academy`,
        description: `${course.name} course in Ambikapur. Duration: ${
            course.duration || "Flexible"
        }. ${
            franchiseNames ? `Certified by ${franchiseNames}.` : ""
        } Government-recognized program in Surguja, Chhattisgarh.`,
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

/* ─── Icons ─────────────────────────────────────────────────────── */

const ClockIcon = () => (
    <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const CheckIcon = () => (
    <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ShieldIcon = () => (
    <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const LinkIcon = () => (
    <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const BackIcon = () => (
    <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const PhoneIcon = () => (
    <svg
        width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

/* ─── Page ───────────────────────────────────────────────────────── */

export default async function CourseDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const course = await getCourse(slug);
    if (!course) return notFound();

    const franchiseOptions = course.franchiseOptions || [];
    const hasConfigs = franchiseOptions.length > 0;

    const allBodies = [
        ...new Set<string>(
            franchiseOptions.flatMap(
                (cfg: any) => cfg.franchise?.registeredBodies || []
            )
        ),
    ];

    return (
        <>
            {/* ── Structured Data ── */}
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
                        ...(course.duration && {
                            timeRequired: course.duration,
                        }),
                    }),
                }}
            />

            <main className="cd-root">

                {/* ════════════ BREADCRUMB ════════════ */}
                <nav className="cd-breadcrumb" aria-label="Breadcrumb">
                    <div className="container container-xl cd-breadcrumb__inner">
                        <Link href="/" className="cd-breadcrumb__link">
                            Home
                        </Link>
                        <span className="cd-breadcrumb__sep">›</span>
                        <Link
                            href="/courses"
                            className="cd-breadcrumb__link"
                        >
                            Courses
                        </Link>
                        <span className="cd-breadcrumb__sep">›</span>
                        <span className="cd-breadcrumb__current">
                            {course.name}
                        </span>
                    </div>
                </nav>

                {/* ════════════ BANNER ════════════ */}
                <div className="cd-banner-wrap">
                    <div className="container container-xl">
                        <div className="cd-banner">
                            {/* Image or placeholder */}
                            {course.banner ? (
                                <Image
                                    src={course.banner}
                                    alt={course.name}
                                    fill
                                    sizes="(max-width:768px) 100vw, 1200px"
                                    className="cd-banner__img"
                                    priority
                                />
                            ) : (
                                <div className="cd-banner__placeholder">
                                    <span>Course Preview</span>
                                </div>
                            )}

                            {/* Dark gradient overlay */}
                            <div className="cd-banner__overlay" />

                            {/* Bottom content */}
                            <div className="cd-banner__bottom">
                                <div className="cd-banner__left">
                                    {course.level && (
                                        <span className="cd-banner__level">
                                            {course.level}
                                        </span>
                                    )}
                                    <h1 className="cd-banner__title">
                                        {course.name}
                                    </h1>
                                </div>

                                {/* Quick info pills */}
                                <div className="cd-banner__pills">
                                    {course.duration && (
                                        <span className="cd-banner__pill">
                                            <ClockIcon />
                                            {course.duration}
                                        </span>
                                    )}
                                    {course.eligibility && (
                                        <span className="cd-banner__pill">
                                            <CheckIcon />
                                            {course.eligibility}
                                        </span>
                                    )}
                                    {allBodies.slice(0, 2).map((b: string) => (
                                        <span key={b} className="cd-banner__pill">
                                            <ShieldIcon />
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════════ MAIN LAYOUT ════════════ */}
                <div className="container container-xl cd-layout">

                    {/* ── LEFT: Main Content ── */}
                    <div className="cd-content">

                        {/* Designed For */}
                        {course.designedFor?.length > 0 && (
                            <section className="cd-section">
                                <div className="cd-section__header">
                                    <div className="cd-section__icon">
                                        🎯
                                    </div>
                                    <h2 className="cd-section__title">
                                        Designed For
                                    </h2>
                                </div>
                                <div className="cd-designed-grid">
                                    {course.designedFor.map(
                                        (item: string, i: number) => (
                                            <div
                                                key={i}
                                                className="cd-designed-item"
                                            >
                                                <span className="cd-designed-dot" />
                                                <span>{item}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Career Opportunities */}
                        {course.careerOpportunities?.length > 0 && (
                            <section className="cd-section">
                                <div className="cd-section__header">
                                    <div className="cd-section__icon">
                                        💼
                                    </div>
                                    <h2 className="cd-section__title">
                                        Career Opportunities
                                    </h2>
                                </div>
                                <div className="cd-career-grid">
                                    {course.careerOpportunities.map(
                                        (item: string, i: number) => (
                                            <div
                                                key={i}
                                                className="cd-career-item"
                                            >
                                                <span className="cd-career-item__text">
                                                    {item}
                                                </span>
                                                <span className="cd-career-item__arrow">
                                                    →
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Syllabus */}
                        {course.syllabus?.length > 0 && (
                            <section className="cd-section">
                                <div className="cd-section__header">
                                    <div className="cd-section__icon">
                                        📖
                                    </div>
                                    <h2 className="cd-section__title">
                                        Course Syllabus
                                    </h2>
                                </div>
                                <div className="cd-syllabus">
                                    {course.syllabus.map(
                                        (mod: any, i: number) => (
                                            <div
                                                key={i}
                                                className="cd-module"
                                            >
                                                <div className="cd-module__head">
                                                    <span className="cd-module__num">
                                                        {String(
                                                            i + 1
                                                        ).padStart(2, "0")}
                                                    </span>
                                                    <span className="cd-module__name">
                                                        {mod.module}
                                                    </span>
                                                    {mod.topics?.length >
                                                        0 && (
                                                        <span className="cd-module__count">
                                                            {mod.topics.length}{" "}
                                                            topics
                                                        </span>
                                                    )}
                                                </div>
                                                {mod.topics?.length > 0 && (
                                                    <div className="cd-topics">
                                                        {mod.topics.map(
                                                            (
                                                                t: string,
                                                                j: number
                                                            ) => (
                                                                <div
                                                                    key={j}
                                                                    className="cd-topic"
                                                                >
                                                                    <span className="cd-topic__dot" />
                                                                    <span>
                                                                        {t}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Back link */}
                        <Link href="/courses" className="cd-back">
                            <BackIcon />
                            Back to All Courses
                        </Link>
                    </div>

                    {/* ── RIGHT: Sidebar ── */}
                    <aside className="cd-sidebar">

                        {/* Course Details Card */}
                        <div className="cd-info-card">
                            <div className="cd-info-card__head">
                                <h3 className="cd-info-card__title">
                                    Course Details
                                </h3>
                            </div>

                            <div className="cd-info-card__rows">
                                {course.duration && (
                                    <div className="cd-info-row">
                                        <div className="cd-info-row__icon">
                                            <ClockIcon />
                                        </div>
                                        <div>
                                            <div className="cd-info-row__label">
                                                Duration
                                            </div>
                                            <div className="cd-info-row__value">
                                                {course.duration}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {course.eligibility && (
                                    <div className="cd-info-row">
                                        <div className="cd-info-row__icon">
                                            <CheckIcon />
                                        </div>
                                        <div>
                                            <div className="cd-info-row__label">
                                                Eligibility
                                            </div>
                                            <div className="cd-info-row__value">
                                                {course.eligibility}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {hasConfigs ? (
                                    <div className="cd-info-row">
                                        <div className="cd-info-row__icon">
                                            <ShieldIcon />
                                        </div>
                                        <div>
                                            <div className="cd-info-row__label">
                                                Offered By
                                            </div>
                                            <div className="cd-info-row__value">
                                                {franchiseOptions
                                                    .map(
                                                        (cfg: any) =>
                                                            cfg.franchise?.name
                                                    )
                                                    .filter(Boolean)
                                                    .join(" · ")}
                                            </div>
                                        </div>
                                    </div>
                                ) : course.authority ? (
                                    <div className="cd-info-row">
                                        <div className="cd-info-row__icon">
                                            <ShieldIcon />
                                        </div>
                                        <div>
                                            <div className="cd-info-row__label">
                                                Authority
                                            </div>
                                            <div className="cd-info-row__value">
                                                {course.authority}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {!hasConfigs && course.verification && (
                                    <div className="cd-info-row">
                                        <div className="cd-info-row__icon">
                                            <LinkIcon />
                                        </div>
                                        <div>
                                            <div className="cd-info-row__label">
                                                Verification
                                            </div>
                                            <div className="cd-info-row__value">
                                                {course.verification}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Enroll CTA */}
                            <div className="cd-info-card__cta-wrap">
                                <a
                                    href="tel:+917477036832"
                                    className="cd-enroll-btn"
                                >
                                    <PhoneIcon />
                                    <span>
                                        Enroll Now
                                        <small>
                                            Call us to get started today
                                        </small>
                                    </span>
                                </a>
                            </div>
                        </div>

                        {/* Available Programs Card */}
                        {hasConfigs && (
                            <div className="cd-programs-card">
                                <div className="cd-programs-card__head">
                                    <h3 className="cd-programs-card__title">
                                        Available Programs
                                    </h3>
                                    <span className="cd-programs-card__count">
                                        {franchiseOptions.length}
                                    </span>
                                </div>

                                <div className="cd-programs-list">
                                    {franchiseOptions.map(
                                        (cfg: any, i: number) => {
                                            const f = cfg.franchise;
                                            const c = cfg.defaultCertType;
                                            if (!f) return null;
                                            return (
                                                <div
                                                    key={i}
                                                    className="cd-program-item"
                                                >
                                                    <div className="cd-program-item__head">
                                                        <span
                                                            className="cd-program-item__code"
                                                            style={{
                                                                background:
                                                                    f.isOwn
                                                                        ? "var(--color-warning)"
                                                                        : "var(--color-primary-600)",
                                                            }}
                                                        >
                                                            {f.code}
                                                        </span>
                                                        <span className="cd-program-item__name">
                                                            {f.name}
                                                        </span>
                                                    </div>

                                                    {c && (
                                                        <div className="cd-program-item__cert">
                                                            <span className="cd-program-item__cert-dot" />
                                                            <span>
                                                                {c.name}
                                                                {c.issuingBody && (
                                                                    <span className="cd-program-item__cert-issuer">
                                                                        {" "}
                                                                        ·{" "}
                                                                        {
                                                                            c.issuingBody
                                                                        }
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {f.registeredBodies
                                                        ?.length > 0 && (
                                                        <div className="cd-program-item__bodies">
                                                            {f.registeredBodies.map(
                                                                (b: string) => (
                                                                    <span
                                                                        key={b}
                                                                        className="cd-body-pill"
                                                                    >
                                                                        {b}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                {allBodies.length > 0 && (
                                    <div className="cd-recognized-strip">
                                        <span className="cd-recognized-strip__label">
                                            Recognized by
                                        </span>
                                        <div className="cd-recognized-strip__pills">
                                            {allBodies.map((b: string) => (
                                                <span
                                                    key={b}
                                                    className="cd-body-pill"
                                                >
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            {/* ════════════ PAGE-SCOPED CSS ════════════ */}
            <style>{`

/* ══════════════════════════════════════════
   COURSE DETAIL PAGE  —  page-scoped styles
   Follows: variables.css + components.css
   ══════════════════════════════════════════ */

/* ── Root ───────────────────────────────── */
.cd-root {
  background-color: var(--bg-page);
  min-height: 100vh;
  padding-bottom: var(--space-24);
}

/* ══════════════════════════════════════════
   BREADCRUMB
   ══════════════════════════════════════════ */
.cd-breadcrumb {
  padding: var(--space-5) 0 0;
}
.cd-breadcrumb__inner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.cd-breadcrumb__link {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.cd-breadcrumb__link:hover {
  color: var(--color-primary-600);
}
.cd-breadcrumb__sep {
  font-size: var(--font-size-sm);
  color: var(--text-disabled);
}
.cd-breadcrumb__current {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 260px;
}

/* ══════════════════════════════════════════
   BANNER
   ══════════════════════════════════════════ */
.cd-banner-wrap {
  padding: var(--space-5) 0 0;
}
.cd-banner {
  position: relative;
  height: 420px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: var(--color-gray-100);
  box-shadow: var(--shadow-xl);
}
.cd-banner__img {
  object-fit: cover;
}
.cd-banner__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-primary-50) 0%,
    var(--color-gray-100) 100%
  );
}
.cd-banner__placeholder span {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.cd-banner__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 15, 30, 0.90) 0%,
    rgba(10, 15, 30, 0.20) 55%,
    transparent 100%
  );
}
.cd-banner__bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-8) var(--space-10);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
}
.cd-banner__left {
  flex: 1;
  min-width: 0;
}
.cd-banner__level {
  display: inline-block;
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.40);
  padding: 4px 14px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  margin-bottom: var(--space-3);
}
.cd-banner__title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.4rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
  margin: 0;
}

/* Quick pills */
.cd-banner__pills {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  align-items: flex-end;
}
.cd-banner__pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  white-space: nowrap;
}
.cd-banner__pill svg {
  flex-shrink: 0;
  opacity: 0.85;
}

/* ══════════════════════════════════════════
   LAYOUT GRID
   ══════════════════════════════════════════ */
.cd-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-10);
  align-items: start;
  padding-top: var(--space-10);
}

/* ══════════════════════════════════════════
   LEFT CONTENT
   ══════════════════════════════════════════ */
.cd-content {
  min-width: 0;
}

/* Section */
.cd-section {
  margin-bottom: var(--space-12);
}
.cd-section__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-color);
}
.cd-section__icon {
  width: 40px;
  height: 40px;
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.cd-section__title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  letter-spacing: var(--letter-spacing-tight);
}

/* ── Designed For ─────────────────────── */
.cd-designed-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.cd-designed-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: var(--line-height-relaxed);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}
.cd-designed-item:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-sm);
}
.cd-designed-dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  margin-top: 5px;
  flex-shrink: 0;
}

/* ── Career Grid ──────────────────────── */
.cd-career-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-3);
}
.cd-career-item {
  position: relative;
  background: var(--color-gray-800);
  border: 1px solid var(--color-gray-700);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5) var(--space-8);
  transition:
    background var(--transition-fast),
    transform var(--transition-fast);
  overflow: hidden;
}
.cd-career-item:hover {
  background: var(--color-primary-700);
  border-color: var(--color-primary-600);
  transform: translateY(-2px);
}
.cd-career-item__text {
  font-size: var(--font-size-sm);
  color: var(--color-white);
  line-height: var(--line-height-snug);
  display: block;
}
.cd-career-item__arrow {
  position: absolute;
  bottom: var(--space-3);
  right: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-primary-300);
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}
.cd-career-item:hover .cd-career-item__arrow {
  opacity: 1;
}

/* ── Syllabus ─────────────────────────── */
.cd-syllabus {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.cd-module {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: box-shadow var(--transition-fast);
}
.cd-module:hover {
  box-shadow: var(--shadow-md);
}
.cd-module__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--color-primary-50);
  border-bottom: 1px solid var(--border-color);
}
.cd-module__num {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
  min-width: 32px;
  flex-shrink: 0;
}
.cd-module__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  flex: 1;
}
.cd-module__count {
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  color: var(--text-tertiary);
  background: var(--color-white);
  border: 1px solid var(--border-color);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
}
.cd-topics {
  padding: var(--space-4) var(--space-5);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2) var(--space-6);
}
.cd-topic {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
.cd-topic__dot {
  width: 5px;
  height: 5px;
  background: var(--color-primary-400);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Back link */
.cd-back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-tertiary);
  text-decoration: none;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background var(--transition-fast);
  margin-top: var(--space-4);
}
.cd-back:hover {
  color: var(--color-primary-600);
  border-color: var(--color-primary-300);
  background: var(--color-primary-50);
}

/* ══════════════════════════════════════════
   SIDEBAR
   ══════════════════════════════════════════ */
.cd-sidebar {
  position: sticky;
  top: calc(80px + var(--space-6));
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* ── Info Card ────────────────────────── */
.cd-info-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}
.cd-info-card__head {
  padding: var(--space-4) var(--space-6);
  background: var(--color-primary-50);
  border-bottom: 1px solid var(--border-color);
}
.cd-info-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}
.cd-info-card__rows {
  display: flex;
  flex-direction: column;
}

/* Info row */
.cd-info-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-color-light);
}
.cd-info-row:last-child {
  border-bottom: none;
}
.cd-info-row__icon {
  width: 36px;
  height: 36px;
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-primary-600);
}
.cd-info-row__label {
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 3px;
}
.cd-info-row__value {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: var(--line-height-relaxed);
}

/* Enroll CTA */
.cd-info-card__cta-wrap {
  padding: var(--space-5) var(--space-6);
  border-top: 1px solid var(--border-color);
}
.cd-enroll-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4) var(--space-6);
  background: linear-gradient(
    135deg,
    var(--color-accent-500),
    var(--color-accent-600)
  );
  color: var(--color-white);
  text-decoration: none;
  border-radius: var(--radius-xl);
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.30);
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    filter var(--transition-fast);
}
.cd-enroll-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(249, 115, 22, 0.40);
  filter: brightness(1.06);
}
.cd-enroll-btn svg {
  flex-shrink: 0;
}
.cd-enroll-btn span {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  font-size: var(--font-size-base);
}
.cd-enroll-btn small {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  opacity: 0.80;
}

/* ── Programs Card ────────────────────── */
.cd-programs-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.cd-programs-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: var(--color-primary-50);
  border-bottom: 1px solid var(--border-color);
}
.cd-programs-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}
.cd-programs-card__count {
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}
.cd-programs-list {
  display: flex;
  flex-direction: column;
}

/* Program item */
.cd-program-item {
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border-color-light);
  transition: background var(--transition-fast);
}
.cd-program-item:last-child {
  border-bottom: none;
}
.cd-program-item:hover {
  background: var(--color-gray-50);
}
.cd-program-item__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.cd-program-item__code {
  font-size: 9px;
  font-weight: var(--font-weight-extrabold);
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  color: var(--color-white);
  letter-spacing: 0.07em;
  flex-shrink: 0;
}
.cd-program-item__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}
.cd-program-item__cert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
  line-height: var(--line-height-relaxed);
}
.cd-program-item__cert-dot {
  width: 5px;
  height: 5px;
  border-radius: var(--radius-full);
  background: var(--color-primary-400);
  flex-shrink: 0;
  margin-top: 5px;
}
.cd-program-item__cert-issuer {
  opacity: 0.70;
}
.cd-program-item__bodies {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

/* Body pill — shared */
.cd-body-pill {
  font-size: 9px;
  font-weight: var(--font-weight-bold);
  padding: 2px 9px;
  border-radius: var(--radius-full);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-100);
  letter-spacing: 0.05em;
}

/* Recognized strip */
.cd-recognized-strip {
  padding: var(--space-4) var(--space-6);
  background: var(--color-gray-50);
  border-top: 1px solid var(--border-color);
}
.cd-recognized-strip__label {
  display: block;
  font-size: 9px;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}
.cd-recognized-strip__pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */

/* Tablet */
@media (max-width: 900px) {
  .cd-layout {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding-top: var(--space-6);
  }
  .cd-sidebar {
    position: static;
    order: -1;
  }
  .cd-banner {
    height: 300px;
  }
  .cd-banner__bottom {
    padding: var(--space-6) var(--space-6);
  }
  .cd-topics {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 560px) {
  .cd-banner {
    height: 220px;
    border-radius: var(--radius-xl);
  }
  .cd-banner__pills {
    display: none;
  }
  .cd-banner__bottom {
    padding: var(--space-4) var(--space-5);
  }
  .cd-banner__title {
    font-size: clamp(1.25rem, 5vw, 1.6rem);
  }
  .cd-designed-grid {
    grid-template-columns: 1fr;
  }
  .cd-career-grid {
    grid-template-columns: 1fr 1fr;
  }
  .cd-breadcrumb__current {
    max-width: 160px;
  }
}

      `}</style>
        </>
    );
}