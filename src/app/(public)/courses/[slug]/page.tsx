import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  Clock,
  CheckCircle,
  Shield,
  Link as LinkIcon,
  ArrowLeft,
  Phone,
  ArrowRight,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import "@/models/Franchise";
import "@/models/CertificateType";

export const dynamic = "force-dynamic";

/* ─── Data Fetching — UNCHANGED ─── */
async function getCourse(slug: string) {
  try {
    await connectDB();
    const course = await Course.findOne({
      slug,
      isActive: true,
    }).lean();
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
            ...(course.duration && { timeRequired: course.duration }),
          }),
        }}
      />

      <main className="cd-root">

        {/* ── BREADCRUMB ── */}
        <nav className="cd-breadcrumb" aria-label="Breadcrumb">
          <div className="cd-breadcrumb-inner">
            <Link href="/" className="cd-breadcrumb-link">
              Home
            </Link>
            <span className="cd-breadcrumb-sep" aria-hidden="true">
              ›
            </span>
            <Link href="/courses" className="cd-breadcrumb-link">
              Courses
            </Link>
            <span className="cd-breadcrumb-sep" aria-hidden="true">
              ›
            </span>
            <span className="cd-breadcrumb-current">{course.name}</span>
          </div>
        </nav>

        {/* ── BANNER ── */}
        <div className="cd-banner-wrap">
          <div className="cd-banner-container">
            <div className="cd-banner">
              {course.banner ? (
                <Image
                  src={course.banner}
                  alt={course.name}
                  fill
                  sizes="(max-width:768px) 100vw, 1200px"
                  className="cd-banner-img"
                  priority
                />
              ) : (
                <div className="cd-banner-placeholder">
                  <span>Course Preview</span>
                </div>
              )}
              <div className="cd-banner-overlay" aria-hidden="true" />
              <div className="cd-banner-bottom">
                <div className="cd-banner-left">
                  {course.level && (
                    <span className="cd-banner-level">{course.level}</span>
                  )}
                  <h1 className="cd-banner-title">{course.name}</h1>
                </div>
                <div className="cd-banner-pills">
                  {course.duration && (
                    <span className="cd-banner-pill">
                      <Clock size={13} strokeWidth={2} />
                      {course.duration}
                    </span>
                  )}
                  {course.eligibility && (
                    <span className="cd-banner-pill">
                      <CheckCircle size={13} strokeWidth={2} />
                      {course.eligibility}
                    </span>
                  )}
                  {allBodies.slice(0, 2).map((b: string) => (
                    <span key={b} className="cd-banner-pill">
                      <Shield size={13} strokeWidth={2} />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="cd-layout">

          {/* LEFT — Content */}
          <div className="cd-content">

            {/* Designed For */}
            {course.designedFor?.length > 0 && (
              <section className="cd-section">
                <div className="cd-section-header">
                  <h2 className="cd-section-title">Designed For</h2>
                </div>
                <div className="cd-designed-grid">
                  {course.designedFor.map((item: string, i: number) => (
                    <div key={i} className="cd-designed-item">
                      <span
                        className="cd-designed-dot"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Career Opportunities */}
            {course.careerOpportunities?.length > 0 && (
              <section className="cd-section">
                <div className="cd-section-header">
                  <h2 className="cd-section-title">Career Opportunities</h2>
                </div>
                <div className="cd-career-grid">
                  {course.careerOpportunities.map(
                    (item: string, i: number) => (
                      <div key={i} className="cd-career-item">
                        <span className="cd-career-item-text">{item}</span>
                        <ArrowRight
                          size={14}
                          strokeWidth={2}
                          className="cd-career-item-arrow"
                        />
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* Syllabus */}
            {course.syllabus?.length > 0 && (
              <section className="cd-section">
                <div className="cd-section-header">
                  <h2 className="cd-section-title">Course Syllabus</h2>
                </div>
                <div className="cd-syllabus">
                  {course.syllabus.map((mod: any, i: number) => (
                    <div key={i} className="cd-module">
                      <div className="cd-module-head">
                        <span className="cd-module-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="cd-module-name">{mod.module}</span>
                        {mod.topics?.length > 0 && (
                          <span className="cd-module-count">
                            {mod.topics.length} topics
                          </span>
                        )}
                      </div>
                      {mod.topics?.length > 0 && (
                        <div className="cd-topics">
                          {mod.topics.map((t: string, j: number) => (
                            <div key={j} className="cd-topic">
                              <span
                                className="cd-topic-dot"
                                aria-hidden="true"
                              />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Back link */}
            <Link href="/courses" className="cd-back">
              <ArrowLeft size={15} strokeWidth={2} />
              Back to All Courses
            </Link>
          </div>

          {/* RIGHT — Sidebar */}
          <aside className="cd-sidebar">

            {/* Course Info Card */}
            <div className="cd-info-card">
              <div className="cd-info-card-head">
                <h3 className="cd-info-card-title">Course Details</h3>
              </div>
              <div className="cd-info-rows">
                {course.duration && (
                  <div className="cd-info-row">
                    <div className="cd-info-row-icon">
                      <Clock size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="cd-info-row-label">Duration</div>
                      <div className="cd-info-row-value">
                        {course.duration}
                      </div>
                    </div>
                  </div>
                )}
                {course.eligibility && (
                  <div className="cd-info-row">
                    <div className="cd-info-row-icon">
                      <CheckCircle size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="cd-info-row-label">Eligibility</div>
                      <div className="cd-info-row-value">
                        {course.eligibility}
                      </div>
                    </div>
                  </div>
                )}
                {hasConfigs ? (
                  <div className="cd-info-row">
                    <div className="cd-info-row-icon">
                      <Shield size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="cd-info-row-label">Offered By</div>
                      <div className="cd-info-row-value">
                        {franchiseOptions
                          .map((cfg: any) => cfg.franchise?.name)
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  </div>
                ) : course.authority ? (
                  <div className="cd-info-row">
                    <div className="cd-info-row-icon">
                      <Shield size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="cd-info-row-label">Authority</div>
                      <div className="cd-info-row-value">
                        {course.authority}
                      </div>
                    </div>
                  </div>
                ) : null}
                {!hasConfigs && course.verification && (
                  <div className="cd-info-row">
                    <div className="cd-info-row-icon">
                      <LinkIcon size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="cd-info-row-label">Verification</div>
                      <div className="cd-info-row-value">
                        {course.verification}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enroll CTA */}
              <div className="cd-info-card-cta">
                <a href="tel:+917477036832" className="cd-enroll-btn">
                  <Phone size={18} strokeWidth={2} />
                  <span>
                    Enroll Now
                    <small>Call us to get started today</small>
                  </span>
                </a>
              </div>
            </div>

            {/* Programs Card */}
            {hasConfigs && (
              <div className="cd-programs-card">
                <div className="cd-programs-card-head">
                  <h3 className="cd-programs-card-title">
                    Available Programs
                  </h3>
                  <span className="cd-programs-card-count">
                    {franchiseOptions.length}
                  </span>
                </div>
                <div className="cd-programs-list">
                  {franchiseOptions.map((cfg: any, i: number) => {
                    const f = cfg.franchise;
                    const c = cfg.defaultCertType;
                    if (!f) return null;
                    return (
                      <div key={i} className="cd-program-item">
                        <div className="cd-program-item-head">
                          <span
                            className="cd-program-item-code"
                            style={{
                              background: f.isOwn
                                ? "var(--color-accent-600)"
                                : "var(--color-primary-600)",
                            }}
                          >
                            {f.code}
                          </span>
                          <span className="cd-program-item-name">
                            {f.name}
                          </span>
                        </div>
                        {c && (
                          <div className="cd-program-item-cert">
                            <span
                              className="cd-program-item-cert-dot"
                              aria-hidden="true"
                            />
                            <span>
                              {c.name}
                              {c.issuingBody && (
                                <span className="cd-program-item-cert-issuer">
                                  {" "}
                                  · {c.issuingBody}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                        {f.registeredBodies?.length > 0 && (
                          <div className="cd-program-item-bodies">
                            {f.registeredBodies.map((b: string) => (
                              <span key={b} className="cd-body-pill">
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {allBodies.length > 0 && (
                  <div className="cd-recognized-strip">
                    <span className="cd-recognized-strip-label">
                      Recognized by
                    </span>
                    <div className="cd-recognized-strip-pills">
                      {allBodies.map((b: string) => (
                        <span key={b} className="cd-body-pill">
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
    </>
  );
}