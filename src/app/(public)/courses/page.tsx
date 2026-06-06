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
    description: "Professional IT and computer training programs in Ambikapur, Surguja.",
    url: "https://www.shivshakticomputer.in/courses",
  },
};

/* ─── Data Fetching (UNCHANGED) ─── */
async function getCoursesWithConfigs() {
  try {
    await connectDB();
    const courses = await Course.find({ isActive: true }).select("-__v").sort({ createdAt: -1 }).lean();
    const courseIds = courses.map((c: any) => c._id);
    const configs = await CourseFranchiseConfig.find({ course: { $in: courseIds } })
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
      franchiseOptions: (configMap[(c as any)._id.toString()] || []).map((cfg: any) => ({
        ...cfg,
        _id: cfg._id.toString(),
        franchise: cfg.franchise ? { ...cfg.franchise, _id: cfg.franchise._id?.toString() } : null,
        defaultCertType: cfg.defaultCertType ? { ...cfg.defaultCertType, _id: cfg.defaultCertType._id?.toString() } : null,
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
    cfg.franchise?.registeredBodies?.forEach((b: string) => bodies.add(b));
  });
  return Array.from(bodies).slice(0, 4);
}

function getAuthorityDisplay(course: any): string {
  if (course.franchiseOptions?.length > 0) {
    return course.franchiseOptions.map((cfg: any) => cfg.franchise?.name).filter(Boolean).join(" | ");
  }
  return course.authority || "";
}

/* ─── Icons ─── */
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default async function CoursesPage() {
  const courses = await getCoursesWithConfigs();

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

      <main className="cp-root">
        {/* ── HERO ── */}
        <section className="cp-hero">
          <div className="container container-xl cp-hero__inner">
            <div className="cp-hero__badge">
              <span className="cp-hero__badge-dot" aria-hidden="true" />
              Government Recognised Programs
            </div>
            <h1 className="cp-hero__title">
              Build Your Career with{" "}
              <span className="cp-hero__title-accent">Professional</span> IT Training
            </h1>
            <p className="cp-hero__subtitle">
              Certified computer courses in Ambikapur, Surguja — designed to launch real
              careers in today&apos;s digital economy.
            </p>

            <div className="cp-hero__stats">
              <div className="cp-hero__stat">
                <span className="cp-hero__stat-num">{courses.length}+</span>
                <span className="cp-hero__stat-label">Courses</span>
              </div>
              <div className="cp-hero__stat-divider" />
              <div className="cp-hero__stat">
                <span className="cp-hero__stat-num">NSDC</span>
                <span className="cp-hero__stat-label">Certified</span>
              </div>
              <div className="cp-hero__stat-divider" />
              <div className="cp-hero__stat">
                <span className="cp-hero__stat-num">100%</span>
                <span className="cp-hero__stat-label">Job Focused</span>
              </div>
              <div className="cp-hero__stat-divider" />
              <div className="cp-hero__stat">
                <span className="cp-hero__stat-num">5+</span>
                <span className="cp-hero__stat-label">Years Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── COURSES GRID ── */}
        <section className="cp-courses">
          <div className="container container-xl">
            <div className="cp-courses__header">
              <span className="cp-courses__eyebrow">All Courses</span>
              <h2 className="cp-courses__title">Explore Our Programs</h2>
              <p className="cp-courses__desc">
                From beginner-friendly diplomas to advanced certifications — find the right
                course for your goals.
              </p>
            </div>

            {courses.length === 0 ? (
              <div className="cp-empty">
                <h3 className="cp-empty__title">No Courses Yet</h3>
                <p className="cp-empty__text">We&apos;re updating our catalog. Check back soon!</p>
              </div>
            ) : (
              <div className="cp-grid">
                {courses.map((course: any) => {
                  const bodies = getRegisteredBodies(course);
                  const authority = getAuthorityDisplay(course);
                  return (
                    <article key={course._id} className="cp-card">
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
                            <span>Course Preview</span>
                          </div>
                        )}
                        {course.level && <span className="cp-card__level">{course.level}</span>}
                        {bodies.length > 0 && (
                          <div className="cp-card__bodies">
                            {bodies.map((b: string) => (
                              <span key={b} className="cp-card__body-pill">{b}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="cp-card__body">
                        <h2 className="cp-card__title">{course.name}</h2>

                        <div className="cp-card__meta">
                          {course.duration && (
                            <div className="cp-card__meta-row">
                              <ClockIcon /><span>{course.duration}</span>
                            </div>
                          )}
                          {authority && (
                            <div className="cp-card__meta-row">
                              <ShieldIcon /><span className="cp-card__authority">{authority}</span>
                            </div>
                          )}
                        </div>

                        {course.careerOpportunities?.length > 0 && (
                          <div className="cp-card__tags">
                            {course.careerOpportunities.slice(0, 3).map((c: string, i: number) => (
                              <span key={i} className="cp-card__tag">{c}</span>
                            ))}
                            {course.careerOpportunities.length > 3 && (
                              <span className="cp-card__tag cp-card__tag--more">
                                +{course.careerOpportunities.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <Link href={`/courses/${course.slug}`} className="cp-card__cta">
                          <span>View Details</span>
                          <span className="cp-card__cta-arrow"><ArrowIcon /></span>
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

      <style>{`
/* ── COURSES PAGE — Clean University style ── */
.cp-root { background: var(--bg-page); min-height: 100vh; overflow-x: hidden; }

/* HERO — left aligned, plain */
.cp-hero {
  position: relative;
  padding: var(--space-20) 0 var(--space-12);
  background:
    radial-gradient(120% 80% at 100% 0%, var(--color-primary-50) 0%, transparent 55%),
    var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.cp-hero__inner { position: relative; }
.cp-hero__badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: var(--space-4);
}
.cp-hero__badge-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; flex-shrink: 0; }
.cp-hero__title {
  font-family: var(--font-display); font-size: clamp(1.875rem, 4.4vw, 2.75rem);
  font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.18;
  max-width: 720px; margin: 0 0 var(--space-4); letter-spacing: -0.015em;
}
.cp-hero__title-accent { color: var(--color-primary-700); }
.cp-hero__subtitle { font-size: var(--font-size-lg); color: var(--text-secondary); max-width: 560px; margin: 0 0 var(--space-8); line-height: 1.7; }

.cp-hero__stats {
  display: inline-flex; align-items: center; gap: var(--space-6);
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); padding: var(--space-5) var(--space-8); flex-wrap: wrap;
}
.cp-hero__stat { display: flex; flex-direction: column; gap: 2px; }
.cp-hero__stat-num { font-family: var(--font-display); font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); color: var(--color-primary-700); line-height: 1; }
.cp-hero__stat-label { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; }
.cp-hero__stat-divider { width: 1px; height: 36px; background: var(--border-color); flex-shrink: 0; }

/* COURSES */
.cp-courses { padding: var(--space-16) 0 var(--space-24); }
.cp-courses__header { max-width: 640px; margin: 0 0 var(--space-10); }
.cp-courses__eyebrow {
  display: inline-block; font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.cp-courses__title { font-family: var(--font-display); font-size: clamp(1.5rem, 3.4vw, 2.25rem); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.2; margin-bottom: var(--space-3); letter-spacing: -0.015em; }
.cp-courses__desc { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; margin: 0; }

/* Grid */
.cp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-5); }

/* Card */
.cp-card {
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column;
  transition: border-color var(--transition-base);
}
.cp-card:hover { border-color: var(--color-gray-300); }
.cp-card__banner { position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: var(--color-gray-100); flex-shrink: 0; border-bottom: 1px solid var(--border-color); }
.cp-card__banner-img { object-fit: cover; }
.cp-card__banner-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; background: var(--bg-surface); }
.cp-card__banner-placeholder span { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.1em; }
.cp-card__level {
  position: absolute; top: var(--space-3); left: var(--space-3);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.06em; text-transform: uppercase;
  background: var(--color-white); color: var(--color-primary-700); border: 1px solid var(--border-color);
  padding: 3px 10px; border-radius: var(--radius-sm);
}
.cp-card__bodies { position: absolute; bottom: var(--space-3); left: var(--space-3); right: var(--space-3); display: flex; flex-wrap: wrap; gap: var(--space-1); }
.cp-card__body-pill {
  font-size: 9px; font-weight: var(--font-weight-semibold); padding: 3px 8px; border-radius: var(--radius-sm);
  background: var(--color-white); color: var(--text-secondary); border: 1px solid var(--border-color); letter-spacing: 0.04em;
}
.cp-card__body { padding: var(--space-6); display: flex; flex-direction: column; flex-grow: 1; gap: var(--space-4); }
.cp-card__title { font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.3; margin: 0; }
.cp-card__meta { display: flex; flex-direction: column; gap: var(--space-2); }
.cp-card__meta-row { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); color: var(--text-tertiary); }
.cp-card__meta-row svg { flex-shrink: 0; color: var(--color-primary-500); }
.cp-card__authority { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cp-card__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.cp-card__tag { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); padding: 3px 10px; border-radius: var(--radius-full); background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-secondary); }
.cp-card__tag--more { color: var(--text-tertiary); }
.cp-card__cta {
  display: inline-flex; align-items: center; gap: var(--space-2); align-self: flex-start; margin-top: auto;
  padding: var(--space-2) var(--space-5); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: #fff; background: var(--color-primary-600); border-radius: var(--radius-md); text-decoration: none;
  transition: background var(--transition-base);
}
.cp-card__cta:hover { background: var(--color-primary-700); }
.cp-card__cta-arrow { display: flex; align-items: center; transition: transform var(--transition-fast); }
.cp-card__cta:hover .cp-card__cta-arrow { transform: translateX(3px); }

/* Empty */
.cp-empty { text-align: center; padding: var(--space-24) var(--space-4); }
.cp-empty__title { font-family: var(--font-display); font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin-bottom: var(--space-3); }
.cp-empty__text { font-size: var(--font-size-base); color: var(--text-secondary); }

/* Responsive */
@media (max-width: 768px) {
  .cp-hero { padding: var(--space-16) 0 var(--space-10); }
  .cp-hero__stats { gap: var(--space-5); padding: var(--space-4) var(--space-6); }
  .cp-hero__stat-divider { display: none; }
  .cp-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
}
@media (max-width: 480px) {
  .cp-hero__stats { gap: var(--space-4); padding: var(--space-4); }
  .cp-grid { grid-template-columns: 1fr; }
  .cp-card__body { padding: var(--space-5); }
}
      `}</style>
    </>
  );
}
