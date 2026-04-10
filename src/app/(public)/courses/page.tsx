import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import "@/models/Franchise";
import "@/models/CertificateType";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Computer Courses in Ambikapur | DCA, PGDCA, ADCA, Tally & IT Training",
    description:
        "Explore professional computer courses in Ambikapur at Shivshakti Computer Academy including DCA, PGDCA, ADCA, Tally, Typing, Web Development, Software Development, Networking, Linux and Cloud Computing programs.",
    alternates: { canonical: "https://www.shivshakticomputer.in/courses" },
    openGraph: {
        title: "Computer Courses in Ambikapur | Shivshakti Computer Academy",
        description:
            "Professional IT and computer training programs in Ambikapur, Surguja.",
        url: "https://www.shivshakticomputer.in/courses",
    },
};

/* ─── Data Fetching ─────────────────────────────────────────────── */

async function getCoursesWithConfigs() {
    try {
        await connectDB();

        const courses = await Course.find({ isActive: true })
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();

        const courseIds = courses.map((c: any) => c._id);

        const configs = await CourseFranchiseConfig.find({
            course: { $in: courseIds },
        })
            .populate("franchise", "name code registeredBodies isOwn")
            .populate("defaultCertType", "name code")
            .lean();

        const configMap: Record<string, any[]> = {};
        configs.forEach((cfg: any) => {
            const cid = cfg.course.toString();
            if (!configMap[cid]) configMap[cid] = [];
            configMap[cid].push(cfg);
        });

        return courses.map((c: any) => ({
            ...(c as any),
            _id: (c as any)._id.toString(),
            franchiseOptions: (
                configMap[(c as any)._id.toString()] || []
            ).map((cfg: any) => ({
                ...cfg,
                _id: cfg._id.toString(),
                franchise: cfg.franchise
                    ? {
                          ...cfg.franchise,
                          _id: cfg.franchise._id?.toString(),
                      }
                    : null,
                defaultCertType: cfg.defaultCertType
                    ? {
                          ...cfg.defaultCertType,
                          _id: cfg.defaultCertType._id?.toString(),
                      }
                    : null,
            })),
        }));
    } catch (e) {
        console.error("getCoursesWithConfigs error:", e);
        return [];
    }
}

function getRegisteredBodies(course: any): string[] {
    if (!course.franchiseOptions?.length) return [];
    const bodies = new Set<string>();
    course.franchiseOptions.forEach((cfg: any) => {
        cfg.franchise?.registeredBodies?.forEach((b: string) =>
            bodies.add(b)
        );
    });
    return Array.from(bodies).slice(0, 4);
}

function getAuthorityDisplay(course: any): string {
    if (course.franchiseOptions?.length > 0) {
        return course.franchiseOptions
            .map((cfg: any) => cfg.franchise?.name)
            .filter(Boolean)
            .join(" | ");
    }
    return course.authority || "";
}

/* ─── Icons ─────────────────────────────────────────────────────── */

const ClockIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const ShieldIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const ArrowIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

/* ─── Page ───────────────────────────────────────────────────────── */

export default async function CoursesPage() {
    const courses = await getCoursesWithConfigs();

    return (
        <>
            {/* ── Structured Data ── */}
            <Script
                id="courses-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        itemListElement: courses.map(
                            (course: any, index: number) => ({
                                "@type": "ListItem",
                                position: index + 1,
                                url: `https://www.shivshakticomputer.in/courses/${course.slug}`,
                                name: course.name,
                            })
                        ),
                    }),
                }}
            />

            <main className="cp-root">
                {/* ════════════ HERO ════════════ */}
                <section className="cp-hero home-section">
                    <div className="cp-hero__glow cp-hero__glow--1" />
                    <div className="cp-hero__glow cp-hero__glow--2" />

                    <div className="container container-xl cp-hero__inner">
                        {/* Badge */}
                        <div className="cp-hero__badge">
                            <span className="cp-hero__badge-dot" />
                            Government Recognised Programs
                        </div>

                        {/* Heading */}
                        <h1 className="cp-hero__title">
                            Build Your Career with{" "}
                            <span className="cp-hero__title-accent">
                                Professional
                            </span>{" "}
                            IT Training
                        </h1>

                        <p className="cp-hero__subtitle">
                            Certified computer courses in Ambikapur, Surguja —
                            designed to launch real careers in today&apos;s
                            digital economy.
                        </p>

                        {/* Stats Row */}
                        <div className="cp-hero__stats">
                            <div className="cp-hero__stat">
                                <span className="cp-hero__stat-num">
                                    {courses.length}+
                                </span>
                                <span className="cp-hero__stat-label">
                                    Courses
                                </span>
                            </div>
                            <div className="cp-hero__stat-divider" />
                            <div className="cp-hero__stat">
                                <span className="cp-hero__stat-num">NSDC</span>
                                <span className="cp-hero__stat-label">
                                    Certified
                                </span>
                            </div>
                            <div className="cp-hero__stat-divider" />
                            <div className="cp-hero__stat">
                                <span className="cp-hero__stat-num">100%</span>
                                <span className="cp-hero__stat-label">
                                    Job Focused
                                </span>
                            </div>
                            <div className="cp-hero__stat-divider" />
                            <div className="cp-hero__stat">
                                <span className="cp-hero__stat-num">5+</span>
                                <span className="cp-hero__stat-label">
                                    Years Active
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════ COURSES GRID ════════════ */}
                <section className="cp-courses home-section">
                    <div className="container container-xl">
                        {/* Section header */}
                        <div className="section-header cp-courses__header">
                            <span className="section-badge">All Courses</span>
                            <h2 className="section-title">
                                Explore Our Programs
                            </h2>
                            <p className="section-description">
                                From beginner-friendly diplomas to advanced
                                certifications — find the right course for your
                                goals.
                            </p>
                        </div>

                        {/* Grid */}
                        {courses.length === 0 ? (
                            <div className="cp-empty">
                                <div className="cp-empty__icon">📚</div>
                                <h3 className="cp-empty__title">
                                    No Courses Yet
                                </h3>
                                <p className="cp-empty__text">
                                    We&apos;re updating our catalog. Check back
                                    soon!
                                </p>
                            </div>
                        ) : (
                            <div className="cp-grid">
                                {courses.map((course: any) => {
                                    const bodies =
                                        getRegisteredBodies(course);
                                    const authority =
                                        getAuthorityDisplay(course);

                                    return (
                                        <article
                                            key={course._id}
                                            className="cp-card"
                                        >
                                            {/* ── Banner ── */}
                                            <div className="cp-card__banner">
                                                {course.banner ? (
                                                    <Image
                                                        src={course.banner}
                                                        alt={`${course.name} course`}
                                                        fill
                                                        sizes="(max-width:768px) 100vw, 400px"
                                                        className="cp-card__banner-img"
                                                    />
                                                ) : (
                                                    <div className="cp-card__banner-placeholder">
                                                        <span>
                                                            Course Preview
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Level pill */}
                                                {course.level && (
                                                    <span className="cp-card__level">
                                                        {course.level}
                                                    </span>
                                                )}

                                                {/* Registered bodies */}
                                                {bodies.length > 0 && (
                                                    <div className="cp-card__bodies">
                                                        {bodies.map(
                                                            (b: string) => (
                                                                <span
                                                                    key={b}
                                                                    className="cp-card__body-pill"
                                                                >
                                                                    {b}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── Body ── */}
                                            <div className="cp-card__body">
                                                <h2 className="cp-card__title">
                                                    {course.name}
                                                </h2>

                                                {/* Meta */}
                                                <div className="cp-card__meta">
                                                    {course.duration && (
                                                        <div className="cp-card__meta-row">
                                                            <ClockIcon />
                                                            <span>
                                                                {course.duration}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {authority && (
                                                        <div className="cp-card__meta-row">
                                                            <ShieldIcon />
                                                            <span className="cp-card__authority">
                                                                {authority}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Career tags */}
                                                {course.careerOpportunities
                                                    ?.length > 0 && (
                                                    <div className="cp-card__tags">
                                                        {course.careerOpportunities
                                                            .slice(0, 3)
                                                            .map(
                                                                (
                                                                    c: string,
                                                                    i: number
                                                                ) => (
                                                                    <span
                                                                        key={i}
                                                                        className="cp-card__tag"
                                                                    >
                                                                        {c}
                                                                    </span>
                                                                )
                                                            )}
                                                        {course
                                                            .careerOpportunities
                                                            .length > 3 && (
                                                            <span className="cp-card__tag cp-card__tag--more">
                                                                +
                                                                {course
                                                                    .careerOpportunities
                                                                    .length - 3}{" "}
                                                                more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* CTA */}
                                                <Link
                                                    href={`/courses/${course.slug}`}
                                                    className="cp-card__cta"
                                                >
                                                    <span>View Details</span>
                                                    <span className="cp-card__cta-arrow">
                                                        <ArrowIcon />
                                                    </span>
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* ════════════ PAGE-SCOPED CSS ════════════ */}
            <style>{`

/* ══════════════════════════════════════════
   COURSES PAGE  —  page-scoped styles
   Follows: variables.css + components.css
   ══════════════════════════════════════════ */

/* ── Root ───────────────────────────────── */
.cp-root {
  background-color: var(--bg-page);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
.cp-hero {
  position: relative;
  padding: var(--space-24) var(--space-4) var(--space-16);
  text-align: center;
  background: linear-gradient(
    160deg,
    var(--color-primary-200) 0%,
    var(--color-white) 60%,
    var(--color-primary-400) 100%
  );
  overflow: hidden;
}

/* Decorative glows */
.cp-hero__glow {
  position: absolute;
  border-radius: var(--radius-full);
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.35;
}
.cp-hero__glow--1 {
  width: 520px;
  height: 520px;
  background: var(--color-primary-200);
  top: -200px;
  right: -140px;
}
.cp-hero__glow--2 {
  width: 360px;
  height: 360px;
  background: var(--color-accent-200);
  bottom: -120px;
  left: -100px;
}

.cp-hero__inner {
  position: relative;
  z-index: 2;
}

/* Badge */
.cp-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-6);
}
.cp-hero__badge-dot {
  width: 6px;
  height: 6px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Title */
.cp-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  max-width: 720px;
  margin: 0 auto var(--space-5);
  letter-spacing: var(--letter-spacing-tight);
}
.cp-hero__title-accent {
  background: linear-gradient(
    135deg,
    var(--color-primary-600),
    var(--color-accent-500)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Subtitle */
.cp-hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  max-width: 560px;
  margin: 0 auto var(--space-10);
  line-height: var(--line-height-relaxed);
  font-weight: var(--font-weight-normal);
}

/* Stats row */
.cp-hero__stats {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-5) var(--space-10);
  box-shadow: var(--shadow-md);
  flex-wrap: wrap;
  justify-content: center;
}
.cp-hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.cp-hero__stat-num {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1;
}
.cp-hero__stat-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.cp-hero__stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-color);
  flex-shrink: 0;
}

/* ══════════════════════════════════════════
   COURSES SECTION
   ══════════════════════════════════════════ */
.cp-courses {
  padding: var(--space-16) 0 var(--space-24);
}

.cp-courses__header {
  margin-bottom: var(--space-12);
}

/* ── Grid ───────────────────────────────── */
.cp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

/* ══════════════════════════════════════════
   COURSE CARD
   ══════════════════════════════════════════ */
.cp-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base),
    border-color var(--transition-base);
}
.cp-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-300);
}

/* Banner */
.cp-card__banner {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-gray-100);
  flex-shrink: 0;
}
.cp-card__banner-img {
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.cp-card:hover .cp-card__banner-img {
  transform: scale(1.04);
}
.cp-card__banner-placeholder {
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
.cp-card__banner-placeholder span {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Level pill */
.cp-card__level {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(17, 24, 39, 0.82);
  color: var(--color-white);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* Registered bodies strip */
.cp-card__bodies {
  position: absolute;
  bottom: var(--space-3);
  left: var(--space-3);
  right: var(--space-3);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
.cp-card__body-pill {
  font-size: 9px;
  font-weight: var(--font-weight-bold);
  padding: 3px 9px;
  border-radius: var(--radius-full);
  background: rgba(17, 24, 39, 0.78);
  color: var(--color-white);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  letter-spacing: 0.06em;
}

/* Card body */
.cp-card__body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: var(--space-4);
}

/* Title */
.cp-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: var(--line-height-snug);
  margin: 0;
}

/* Meta rows */
.cp-card__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.cp-card__meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}
.cp-card__meta-row svg {
  flex-shrink: 0;
  color: var(--color-primary-500);
}
.cp-card__authority {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Tags */
.cp-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.cp-card__tag {
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100);
  color: var(--color-primary-700);
  letter-spacing: 0.04em;
}
.cp-card__tag--more {
  background: var(--color-gray-100);
  border-color: var(--border-color);
  color: var(--text-tertiary);
}

/* CTA link — pushed to bottom */
.cp-card__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  align-self: flex-start;
  margin-top: auto;
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-600);
  background: var(--color-primary-50);
  border: 1.5px solid var(--color-primary-200);
  border-radius: var(--radius-full);
  text-decoration: none;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}
.cp-card__cta:hover {
  background: var(--color-primary-600);
  color: var(--color-white);
  border-color: var(--color-primary-600);
  box-shadow: var(--shadow-md);
}
.cp-card__cta-arrow {
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast);
}
.cp-card__cta:hover .cp-card__cta-arrow {
  transform: translateX(3px);
}

/* ══════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════ */
.cp-empty {
  text-align: center;
  padding: var(--space-24) var(--space-4);
}
.cp-empty__icon {
  font-size: 3.5rem;
  margin-bottom: var(--space-4);
  line-height: 1;
}
.cp-empty__title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}
.cp-empty__text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */

/* Tablet */
@media (max-width: 768px) {
  .cp-hero {
    padding: var(--space-16) var(--space-4) var(--space-12);
  }
  .cp-hero__stats {
    gap: var(--space-5);
    padding: var(--space-4) var(--space-6);
  }
  .cp-hero__stat-divider {
    display: none;
  }
  .cp-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-5);
  }
}

/* Mobile */
@media (max-width: 480px) {
  .cp-hero {
    padding: var(--space-12) var(--space-4) var(--space-10);
  }
  .cp-hero__title {
    font-size: clamp(1.75rem, 7vw, 2.25rem);
  }
  .cp-hero__subtitle {
    font-size: var(--font-size-base);
  }
  .cp-hero__stats {
    gap: var(--space-4);
    padding: var(--space-4);
    border-radius: var(--radius-xl);
  }
  .cp-grid {
    grid-template-columns: 1fr;
  }
  .cp-card__body {
    padding: var(--space-5);
  }
}

      `}</style>
        </>
    );
}