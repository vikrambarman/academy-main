import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Clock, Shield, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import "@/models/Franchise";
import "@/models/CertificateType";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title:
    "Computer Courses in Ambikapur | DCA, PGDCA, ADCA, Tally & IT Training",
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

/* ─── Data Fetching — UNCHANGED ─── */
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
      franchiseOptions: (configMap[(c as any)._id.toString()] || []).map(
        (cfg: any) => ({
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
        })
      ),
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
    return course.franchiseOptions
      .map((cfg: any) => cfg.franchise?.name)
      .filter(Boolean)
      .join(" | ");
  }
  return course.authority || "";
}

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

        {/* ── HERO — Full width dark ── */}
        <section className="cp-hero">
          <div className="cp-hero-inner">
            <div className="cp-hero-content">
              <span className="cp-hero-tag">
                <span className="cp-hero-tag-dot" aria-hidden="true" />
                Government Recognised Programs
              </span>
              <h1 className="cp-hero-title">
                Build Your Career with{" "}
                <span className="cp-hero-title-accent">Professional</span>{" "}
                IT Training
              </h1>
              <p className="cp-hero-subtitle">
                Certified computer courses in Ambikapur, Surguja — designed
                to launch real careers in today&apos;s digital economy.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="cp-hero-stats">
              <div className="cp-hero-stat">
                <span className="cp-hero-stat-num">{courses.length}+</span>
                <span className="cp-hero-stat-label">Courses</span>
              </div>
              <div className="cp-hero-stat-sep" aria-hidden="true" />
              <div className="cp-hero-stat">
                <span className="cp-hero-stat-num">NSDC</span>
                <span className="cp-hero-stat-label">Certified</span>
              </div>
              <div className="cp-hero-stat-sep" aria-hidden="true" />
              <div className="cp-hero-stat">
                <span className="cp-hero-stat-num">100%</span>
                <span className="cp-hero-stat-label">Job Focused</span>
              </div>
              <div className="cp-hero-stat-sep" aria-hidden="true" />
              <div className="cp-hero-stat">
                <span className="cp-hero-stat-num">5+</span>
                <span className="cp-hero-stat-label">Years Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── COURSES GRID ── */}
        <section className="cp-courses-section">
          <div className="cp-courses-container">

            {/* Header */}
            <div className="cp-courses-header">
              <span className="cp-courses-eyebrow">All Courses</span>
              <h2 className="cp-courses-title">Explore Our Programs</h2>
              <p className="cp-courses-desc">
                From beginner-friendly diplomas to advanced certifications
                — find the right course for your goals.
              </p>
            </div>

            {courses.length === 0 ? (
              <div className="cp-empty">
                <h3 className="cp-empty-title">No Courses Yet</h3>
                <p className="cp-empty-text">
                  We&apos;re updating our catalog. Check back soon!
                </p>
              </div>
            ) : (
              <div className="cp-grid">
                {courses.map((course: any) => {
                  const bodies = getRegisteredBodies(course);
                  const authority = getAuthorityDisplay(course);
                  return (
                    <article key={course._id} className="cp-card">

                      {/* Banner */}
                      <div className="cp-card-banner">
                        {course.banner ? (
                          <Image
                            src={course.banner}
                            alt={`${course.name} course`}
                            fill
                            sizes="(max-width:768px) 100vw, 400px"
                            className="cp-card-banner-img"
                          />
                        ) : (
                          <div className="cp-card-banner-placeholder">
                            <span>Course Preview</span>
                          </div>
                        )}
                        {course.level && (
                          <span className="cp-card-level">
                            {course.level}
                          </span>
                        )}
                        {bodies.length > 0 && (
                          <div className="cp-card-bodies">
                            {bodies.map((b: string) => (
                              <span key={b} className="cp-card-body-pill">
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="cp-card-body">
                        <h2 className="cp-card-title">{course.name}</h2>

                        <div className="cp-card-meta">
                          {course.duration && (
                            <div className="cp-card-meta-row">
                              <Clock
                                size={14}
                                strokeWidth={2}
                                className="cp-card-meta-icon"
                              />
                              <span>{course.duration}</span>
                            </div>
                          )}
                          {authority && (
                            <div className="cp-card-meta-row">
                              <Shield
                                size={14}
                                strokeWidth={2}
                                className="cp-card-meta-icon"
                              />
                              <span className="cp-card-authority">
                                {authority}
                              </span>
                            </div>
                          )}
                        </div>

                        {course.careerOpportunities?.length > 0 && (
                          <div className="cp-card-tags">
                            {course.careerOpportunities
                              .slice(0, 3)
                              .map((c: string, i: number) => (
                                <span key={i} className="cp-card-tag">
                                  {c}
                                </span>
                              ))}
                            {course.careerOpportunities.length > 3 && (
                              <span className="cp-card-tag cp-card-tag-more">
                                +{course.careerOpportunities.length - 3}{" "}
                                more
                              </span>
                            )}
                          </div>
                        )}

                        <Link
                          href={`/courses/${course.slug}`}
                          className="cp-card-cta"
                        >
                          <span>View Details</span>
                          <ArrowRight
                            size={15}
                            strokeWidth={2}
                            className="cp-card-cta-arrow"
                          />
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
    </>
  );
}