import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    Award,
    Shield,
    Building2,
    FileCheck,
    Lock,
    Globe,
    ArrowRight,
    CheckCircle,
    Target,
    Eye,
} from "lucide-react";

export const metadata: Metadata = {
    title: "About Shivshakti Computer Academy | Trusted Computer Training in Ambikapur",
    description:
        "Learn about Shivshakti Computer Academy in Ambikapur — a trusted computer training institute with 10+ years of teaching experience providing practical education and verified certifications.",
};

const stats = [
    { num: "10+",   label: "Years Teaching Experience" },
    { num: "1000+", label: "Students Trained"          },
    { num: "100%",  label: "Verified Certificates"     },
];

const recognitions = [
    { icon: "🏢", label: "MSME (Udyam) Registered Institute",    lucide: Globe     },
    { icon: "🏅", label: "ISO 9001:2015 Certified",              lucide: Award     },
    { icon: "🏛",  label: "Authorized GSDM Training Centre",     lucide: Shield    },
    { icon: "🤝", label: "Drishti Computer Education Franchise",  lucide: Building2 },
    { icon: "📜", label: "Skill India Aligned Programs",          lucide: FileCheck },
    { icon: "🔗", label: "DigiLocker Enabled Certificates",       lucide: Lock      },
];

const processSteps = [
    {
        num: "01",
        title: "Enroll in Course",
        desc: "Choose a program suited to your goals and complete the registration process.",
    },
    {
        num: "02",
        title: "Practical Training",
        desc: "100% hands-on training with dedicated computer systems and expert guidance.",
    },
    {
        num: "03",
        title: "Assessment",
        desc: "Structured evaluation to measure your skills and knowledge progress.",
    },
    {
        num: "04",
        title: "Certification",
        desc: "Receive a digitally verified, government-recognized certificate.",
    },
];

const founderPoints = [
    "10+ years of teaching experience",
    "Trained students across multiple institutions",
    "Practical, career-oriented teaching approach",
    "Committed to transparent and honest certification",
];

export default function AboutPage() {
    return (
        <>
            <main className="ab-root">

                {/* ══════════════════
                    HERO
                ══════════════════ */}
                <section className="ab-hero" aria-labelledby="ab-hero-heading">

                    <div className="ab-hero-glow-tr" aria-hidden="true" />
                    <div className="ab-hero-glow-bl" aria-hidden="true" />
                    <div className="ab-hero-dots"    aria-hidden="true" />
                    <div className="ab-hero-h-line"  aria-hidden="true" />

                    <div className="ab-wrap ab-hero-inner">

                        {/* Left */}
                        <div className="ab-hero-left">
                            <div className="ab-badge">
                                <span className="ab-badge-dot" aria-hidden="true" />
                                Government Recognized Institute
                            </div>

                            <h1 id="ab-hero-heading" className="ab-hero-title">
                                Empowering{" "}
                                <span className="ab-grad-text">Digital Skills</span>
                                <br />in Ambikapur
                            </h1>

                            <p className="ab-hero-desc">
                                Shivshakti Computer Academy is a trusted computer
                                training institute in Ambikapur — built on practical
                                learning, verified certification, and career-oriented
                                digital skill development. With more than 10 years of
                                teaching experience, our faculty builds strong digital
                                foundations and practical confidence for every student.
                            </p>

                            {/* Stats */}
                            <div className="ab-stats-row">
                                {stats.map((s, i) => (
                                    <div key={i} className="ab-stat-pill">
                                        <div className="ab-stat-num">{s.num}</div>
                                        <div className="ab-stat-lbl">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="ab-hero-actions">
                                <Link href="/courses" className="ab-btn-primary">
                                    Explore Courses
                                    <ArrowRight
                                        size={16}
                                        strokeWidth={2}
                                        className="ab-btn-arrow"
                                    />
                                </Link>
                                <Link href="/enquiry" className="ab-btn-outline">
                                    Get in Touch
                                </Link>
                            </div>
                        </div>

                        {/* Right — image */}
                        <div className="ab-hero-right">
                            <div className="ab-img-frame">
                                <div className="ab-img-corner ab-img-corner-tl" aria-hidden="true" />
                                <div className="ab-img-corner ab-img-corner-br" aria-hidden="true" />
                                <div className="ab-img-dot-grid"               aria-hidden="true" />
                                <Image
                                    src="/about.avif"
                                    alt="Students learning practical computer training at Shivshakti Computer Academy, Ambikapur"
                                    fill
                                    sizes="(max-width: 960px) 100vw, 520px"
                                    className="ab-img"
                                    priority
                                />
                            </div>

                            {/* Floating badge */}
                            <div className="ab-img-float" aria-hidden="true">
                                <span className="ab-float-emoji">🎓</span>
                                <div>
                                    <div className="ab-float-title">10+ Years Teaching</div>
                                    <div className="ab-float-sub">Experienced Faculty</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ══════════════════
                    WHO WE ARE
                ══════════════════ */}
                <section
                    className="ab-section ab-who-section"
                    aria-labelledby="ab-who-heading"
                >
                    <div className="ab-section-line" aria-hidden="true" />

                    <div className="ab-wrap ab-who-grid">

                        <div>
                            <div className="ab-eyebrow">
                                <span className="ab-eyebrow-line" />
                                Who We Are
                            </div>
                            <h2 id="ab-who-heading" className="ab-section-title">
                                A Centre Built on<br />
                                <span className="ab-grad-text">
                                    Transparency &amp; Trust
                                </span>
                            </h2>
                            <p className="ab-body-text" style={{ marginTop: "var(--space-5)" }}>
                                Shivshakti Computer Academy is an Authorized Training
                                Centre under Gramin Skill Development Mission. Our
                                programs are designed to align with national skill
                                development initiatives, ensuring students receive
                                structured training and recognised certifications.
                            </p>
                            <p className="ab-body-text" style={{ marginTop: "var(--space-4)" }}>
                                We follow a transparent training approach — students
                                first learn through practical hands-on sessions, undergo
                                proper assessment, and then receive verified
                                certification from authorized organizations.
                            </p>

                            <div className="ab-who-points">
                                {[
                                    "Practical-first training methodology",
                                    "Government-authorized certifications",
                                    "Transparent assessment process",
                                    "Career-focused curriculum design",
                                ].map((pt, i) => (
                                    <div key={i} className="ab-who-point">
                                        <CheckCircle
                                            size={16}
                                            strokeWidth={2.2}
                                            className="ab-point-check"
                                        />
                                        <span>{pt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quote card */}
                        <div className="ab-quote-card">
                            <div className="ab-quote-bar"   aria-hidden="true" />
                            <div className="ab-quote-ghost" aria-hidden="true">"</div>

                            <p className="ab-quote-text">
                                "Practical skills first. Honest certification.
                                Long-term success — that is the promise we make to
                                every student who walks through our doors."
                            </p>

                            <div className="ab-quote-divider" />

                            <div className="ab-quote-author">
                                <div className="ab-quote-avatar" aria-hidden="true">V</div>
                                <div>
                                    <div className="ab-quote-name">
                                        Shivshakti Computer Academy
                                    </div>
                                    <div className="ab-quote-place">
                                        Ambikapur, Chhattisgarh
                                    </div>
                                </div>
                            </div>

                            <div className="ab-quote-pills">
                                <span className="ab-qpill">MSME ✓</span>
                                <span className="ab-qpill">ISO ✓</span>
                                <span className="ab-qpill">GSDM ✓</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ══════════════════
                    RECOGNITIONS
                ══════════════════ */}
                <section
                    className="ab-section ab-rec-section"
                    aria-labelledby="ab-rec-heading"
                >
                    <div className="ab-section-line" aria-hidden="true" />
                    <div className="ab-rec-glow"     aria-hidden="true" />

                    <div className="ab-wrap">
                        <div className="ab-rec-header">
                            <div>
                                <div className="ab-eyebrow">
                                    <span className="ab-eyebrow-line" />
                                    Credentials
                                </div>
                                <h2 id="ab-rec-heading" className="ab-section-title">
                                    Recognitions &amp;{" "}
                                    <span className="ab-grad-text">Authorizations</span>
                                </h2>
                            </div>
                            <p className="ab-rec-desc">
                                Every recognition we hold is a commitment to quality,
                                transparency and genuine certification for our students.
                            </p>
                        </div>

                        <div className="ab-rec-grid">
                            {recognitions.map((r, i) => {
                                const Icon = r.lucide;
                                return (
                                    <div key={i} className="ab-rec-card">
                                        <div className="ab-rec-card-bar" aria-hidden="true" />
                                        <div className="ab-rec-icon-box">
                                            <Icon size={18} strokeWidth={1.6} />
                                        </div>
                                        <div className="ab-rec-label">{r.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════
                    PROCESS
                ══════════════════ */}
                <section
                    className="ab-process-section"
                    aria-labelledby="ab-process-heading"
                >
                    <div className="ab-process-glow" aria-hidden="true" />
                    <div className="ab-process-dots" aria-hidden="true" />

                    <div className="ab-wrap ab-process-inner">
                        <div className="ab-process-header">
                            <div className="ab-eyebrow ab-eyebrow-light">
                                <span className="ab-eyebrow-line-light" />
                                How It Works
                            </div>
                            <h2 id="ab-process-heading" className="ab-process-title">
                                Training &amp;{" "}
                                <span className="ab-process-title-em">
                                    Certification Process
                                </span>
                            </h2>
                        </div>

                        {/* Connector */}
                        <div className="ab-process-connector" aria-hidden="true" />

                        <div className="ab-process-steps">
                            {processSteps.map((step, i) => (
                                <div key={step.num} className="ab-step">
                                    <div className="ab-step-num">{step.num}</div>
                                    <h3 className="ab-step-title">{step.title}</h3>
                                    <p className="ab-step-desc">{step.desc}</p>
                                    <div className="ab-step-bar" aria-hidden="true" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════
                    MISSION & VISION
                ══════════════════ */}
                <section
                    className="ab-section ab-mv-section"
                    aria-labelledby="ab-mv-heading"
                >
                    <div className="ab-section-line" aria-hidden="true" />

                    <div className="ab-wrap">
                        <div className="ab-mv-head">
                            <div className="ab-eyebrow">
                                <span className="ab-eyebrow-line" />
                                Our Purpose
                            </div>
                            <h2 id="ab-mv-heading" className="ab-section-title">
                                Mission &amp;{" "}
                                <span className="ab-grad-text">Vision</span>
                            </h2>
                        </div>

                        <div className="ab-mv-grid">

                            <div className="ab-mv-card">
                                <div className="ab-mv-card-bar ab-mv-bar-blue" aria-hidden="true" />
                                <div className="ab-mv-icon ab-mv-icon-blue">
                                    <Target size={22} strokeWidth={1.6} />
                                </div>
                                <span className="ab-mv-tag ab-mv-tag-blue">Mission</span>
                                <h3 className="ab-mv-title">
                                    Skills First.<br />Honest Certification.
                                </h3>
                                <p className="ab-mv-body">
                                    To provide affordable, practical and certified computer
                                    education that builds job-ready skills and self-confidence
                                    among students across Ambikapur and Surguja region.
                                </p>
                                <div className="ab-mv-dots" aria-hidden="true" />
                            </div>

                            <div className="ab-mv-card">
                                <div className="ab-mv-card-bar ab-mv-bar-orange" aria-hidden="true" />
                                <div className="ab-mv-icon ab-mv-icon-orange">
                                    <Eye size={22} strokeWidth={1.6} />
                                </div>
                                <span className="ab-mv-tag ab-mv-tag-orange">Vision</span>
                                <h3 className="ab-mv-title">
                                    A Trusted Digital<br />Learning Hub.
                                </h3>
                                <p className="ab-mv-body">
                                    To become a trusted digital skill development institute
                                    recognised for honest training, genuine certification,
                                    and long-term student success in India's growing
                                    digital economy.
                                </p>
                                <div className="ab-mv-dots" aria-hidden="true" />
                            </div>

                        </div>
                    </div>
                </section>

                {/* ══════════════════
                    FOUNDER
                ══════════════════ */}
                <section
                    className="ab-section ab-founder-section"
                    aria-labelledby="ab-founder-heading"
                >
                    <div className="ab-section-line"  aria-hidden="true" />
                    <div className="ab-founder-glow"  aria-hidden="true" />

                    <div className="ab-wrap">
                        <div className="ab-founder-card">
                            <div className="ab-founder-card-bar" aria-hidden="true" />

                            {/* Left */}
                            <div className="ab-founder-left">
                                <div className="ab-founder-bg-dots" aria-hidden="true" />

                                <div className="ab-founder-img-ring">
                                    <div className="ab-founder-img-inner">
                                        <Image
                                            src="/founder.jpg"
                                            alt="Mr. Vikram Barman — Founder, Shivshakti Computer Academy"
                                            fill
                                            className="ab-founder-img"
                                        />
                                    </div>
                                </div>

                                <div className="ab-founder-name">Mr. Vikram Barman</div>
                                <div className="ab-founder-role">
                                    Founder &amp; Lead Instructor
                                </div>
                                <div className="ab-founder-mark" aria-hidden="true">"</div>
                            </div>

                            {/* Right */}
                            <div className="ab-founder-right">
                                <div className="ab-eyebrow">
                                    <span className="ab-eyebrow-line" />
                                    Founder's Message
                                </div>

                                <h2
                                    id="ab-founder-heading"
                                    className="ab-founder-title"
                                >
                                    A Decade of Teaching.{" "}
                                    <span className="ab-grad-text">
                                        A Vision for Impact.
                                    </span>
                                </h2>

                                <p className="ab-body-text">
                                    With over 10 years of teaching experience, my journey
                                    in education has been focused on helping students
                                    develop strong academic and digital foundations. Before
                                    establishing this institute, I worked as a Senior
                                    Computer Faculty at multiple institutions, training
                                    students in practical computer applications and
                                    career-oriented skills.
                                </p>

                                <p
                                    className="ab-body-text"
                                    style={{ marginTop: "var(--space-4)" }}
                                >
                                    Shivshakti Computer Academy was founded with a clear
                                    vision — to provide transparent, practical and
                                    skill-based computer education that prepares students
                                    for real-world opportunities in today's digital era.
                                </p>

                                <div className="ab-founder-points">
                                    {founderPoints.map((pt, i) => (
                                        <div key={i} className="ab-who-point">
                                            <CheckCircle
                                                size={15}
                                                strokeWidth={2.2}
                                                className="ab-point-check"
                                            />
                                            <span>{pt}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="ab-founder-motto">
                                    "Skills First. Certification With Integrity."
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ══════════════════
                    BOTTOM CTA
                ══════════════════ */}
                <section className="ab-cta-section">
                    <div className="ab-cta-glow" aria-hidden="true" />
                    <div className="ab-wrap ab-cta-inner">
                        <div className="ab-cta-left">
                            <h2 className="ab-cta-title">
                                Ready to Start Your Digital Journey?
                            </h2>
                            <p className="ab-cta-desc">
                                Join Shivshakti Computer Academy and build real skills
                                with verified certifications.
                            </p>
                        </div>
                        <div className="ab-cta-actions">
                            <Link href="/courses" className="ab-btn-white">
                                View Courses
                                <ArrowRight
                                    size={16}
                                    strokeWidth={2}
                                    className="ab-btn-arrow"
                                />
                            </Link>
                            <Link href="/enquiry" className="ab-btn-cta-ghost">
                                Enquire Now
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <style>{`

                /* ══════════════════════════════
                   ROOT & WRAP
                ══════════════════════════════ */
                .ab-root {
                    background: var(--color-white);
                    min-height: 100vh;
                }

                .ab-wrap {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 var(--space-6);
                }

                /* ══════════════════════════════
                   SHARED ATOMS
                ══════════════════════════════ */

                /* Gradient text */
                .ab-grad-text {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Badge */
                .ab-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-4);
                    background: rgba(37,99,235,0.08);
                    border: 1px solid rgba(37,99,235,0.18);
                    border-radius: var(--radius-full);
                    font-size: 0.68rem;
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-primary-700);
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    margin-bottom: var(--space-5);
                }

                .ab-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--color-primary-600);
                    border-radius: var(--radius-full);
                    animation: ab-pulse 2s ease-in-out infinite;
                }

                /* Eyebrow */
                .ab-eyebrow {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: 0.68rem;
                    font-weight: var(--font-weight-semibold);
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: var(--color-primary-600);
                    margin-bottom: var(--space-4);
                }

                .ab-eyebrow-line {
                    display: inline-block;
                    width: 22px; height: 1.5px;
                    background: var(--color-primary-600);
                    flex-shrink: 0;
                }

                .ab-eyebrow-light {
                    color: var(--color-primary-400);
                }

                .ab-eyebrow-line-light {
                    display: inline-block;
                    width: 22px; height: 1.5px;
                    background: var(--color-primary-400);
                    flex-shrink: 0;
                }

                /* Section title */
                .ab-section-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: 0;
                }

                /* Body text */
                .ab-body-text {
                    font-size: var(--font-size-base);
                    line-height: 1.85;
                    color: var(--text-secondary);
                    margin: 0;
                }

                /* Section top rule */
                .ab-section-line {
                    position: absolute;
                    top: 0; left: 8%; right: 8%;
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent,
                        var(--color-gray-200),
                        transparent
                    );
                    pointer-events: none;
                }

                /* Shared check point */
                .ab-who-point {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }

                .ab-point-check {
                    color: var(--color-success);
                    flex-shrink: 0;
                }

                /* Buttons */
                .ab-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-3) var(--space-6);
                    background: var(--color-primary-600);
                    color: var(--color-white);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    text-decoration: none;
                    transition:
                        background var(--transition-fast),
                        transform var(--transition-fast),
                        box-shadow var(--transition-fast);
                }

                .ab-btn-primary:hover {
                    background: var(--color-primary-700);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(37,99,235,0.3);
                    color: var(--color-white);
                }

                .ab-btn-outline {
                    display: inline-flex;
                    align-items: center;
                    padding: var(--space-3) var(--space-6);
                    border: 1.5px solid var(--color-gray-300);
                    background: transparent;
                    color: var(--text-primary);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                    text-decoration: none;
                    transition:
                        border-color var(--transition-fast),
                        background var(--transition-fast),
                        transform var(--transition-fast);
                }

                .ab-btn-outline:hover {
                    border-color: var(--color-primary-400);
                    background: var(--color-primary-50);
                    color: var(--color-primary-700);
                    transform: translateY(-2px);
                }

                .ab-btn-white {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-3) var(--space-6);
                    background: var(--color-white);
                    color: var(--color-gray-900);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    text-decoration: none;
                    transition:
                        background var(--transition-fast),
                        transform var(--transition-fast),
                        box-shadow var(--transition-fast);
                }

                .ab-btn-white:hover {
                    background: var(--color-gray-50);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                    color: var(--color-gray-900);
                }

                .ab-btn-arrow {
                    transition: transform var(--transition-fast);
                }

                .ab-btn-primary:hover .ab-btn-arrow,
                .ab-btn-white:hover .ab-btn-arrow {
                    transform: translateX(4px);
                }

                .ab-btn-cta-ghost {
                    display: inline-flex;
                    align-items: center;
                    padding: var(--space-3) var(--space-6);
                    border: 1.5px solid rgba(255,255,255,0.22);
                    background: transparent;
                    color: var(--color-gray-50);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                    text-decoration: none;
                    transition:
                        border-color var(--transition-fast),
                        background var(--transition-fast),
                        transform var(--transition-fast);
                }

                .ab-btn-cta-ghost:hover {
                    border-color: rgba(255,255,255,0.5);
                    background: rgba(255,255,255,0.08);
                    transform: translateY(-2px);
                    color: var(--color-gray-50);
                }

                /* ══════════════════════════════
                   HERO
                ══════════════════════════════ */
                .ab-hero {
                    position: relative;
                    padding: var(--space-24) 0 var(--space-20);
                    background: linear-gradient(
                        180deg,
                        var(--color-white) 0%,
                        var(--color-gray-50) 100%
                    );
                    overflow: hidden;
                }

                .ab-hero-glow-tr {
                    position: absolute;
                    top: -120px; right: -80px;
                    width: 460px; height: 460px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.08) 0%,
                        transparent 65%
                    );
                    filter: blur(60px);
                    pointer-events: none;
                    z-index: 0;
                }

                .ab-hero-glow-bl {
                    position: absolute;
                    bottom: -80px; left: -60px;
                    width: 360px; height: 360px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(249,115,22,0.06) 0%,
                        transparent 65%
                    );
                    filter: blur(55px);
                    pointer-events: none;
                    z-index: 0;
                }

                .ab-hero-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(
                        circle,
                        rgba(37,99,235,0.04) 1px,
                        transparent 1px
                    );
                    background-size: 28px 28px;
                    pointer-events: none;
                    z-index: 0;
                }

                .ab-hero-h-line {
                    position: absolute;
                    bottom: 0; left: 8%; right: 8%;
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent,
                        var(--color-gray-200),
                        transparent
                    );
                    pointer-events: none;
                }

                .ab-hero-inner {
                    position: relative;
                    z-index: 10;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-16);
                    align-items: center;
                }

                .ab-hero-title {
                    font-family: var(--font-display);
                    font-size: clamp(2.2rem, 5vw, 3.5rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.15;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: var(--space-5);
                }

                .ab-hero-desc {
                    font-size: var(--font-size-base);
                    line-height: 1.85;
                    color: var(--text-secondary);
                    margin-bottom: var(--space-8);
                }

                /* Stats */
                .ab-stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-3);
                    margin-bottom: var(--space-8);
                }

                .ab-stat-pill {
                    padding: var(--space-4) var(--space-3);
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    text-align: center;
                    box-shadow: var(--shadow-xs);
                    transition:
                        transform var(--transition-fast),
                        box-shadow var(--transition-fast);
                }

                .ab-stat-pill:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-md);
                }

                .ab-stat-num {
                    font-family: var(--font-display);
                    font-size: clamp(1.4rem, 2.5vw, 1.9rem);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary-600);
                    line-height: 1;
                    margin-bottom: var(--space-1);
                }

                .ab-stat-lbl {
                    font-size: 0.66rem;
                    color: var(--text-tertiary);
                    font-weight: var(--font-weight-medium);
                    line-height: 1.35;
                }

                .ab-hero-actions {
                    display: flex;
                    gap: var(--space-3);
                    flex-wrap: wrap;
                }

                /* Image side */
                .ab-hero-right {
                    position: relative;
                }

                .ab-img-frame {
                    position: relative;
                    border-radius: var(--radius-3xl);
                    overflow: hidden;
                    aspect-ratio: 4 / 3;
                    background: var(--color-gray-100);
                    box-shadow: var(--shadow-2xl);
                    border: 1px solid var(--color-gray-200);
                }

                .ab-img-corner {
                    position: absolute;
                    width: 48px; height: 48px;
                    z-index: 2;
                    pointer-events: none;
                }

                .ab-img-corner-tl {
                    top: -4px; left: -4px;
                    border-top: 3px solid var(--color-primary-500);
                    border-left: 3px solid var(--color-primary-500);
                    border-radius: var(--radius-sm) 0 0 0;
                }

                .ab-img-corner-br {
                    bottom: -4px; right: -4px;
                    border-bottom: 3px solid var(--color-accent-500);
                    border-right: 3px solid var(--color-accent-500);
                    border-radius: 0 0 var(--radius-sm) 0;
                }

                .ab-img-dot-grid {
                    position: absolute;
                    top: -20px; right: -20px;
                    width: 80px; height: 80px;
                    background-image: radial-gradient(
                        circle,
                        rgba(37,99,235,0.15) 1.5px,
                        transparent 1.5px
                    );
                    background-size: 10px 10px;
                    z-index: 0;
                    pointer-events: none;
                }

                .ab-img {
                    object-fit: cover;
                }

                /* Floating badge */
                .ab-img-float {
                    position: absolute;
                    bottom: var(--space-5);
                    left: var(--space-5);
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-3) var(--space-4);
                    background: rgba(255,255,255,0.95);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-lg);
                    backdrop-filter: blur(8px);
                }

                .ab-float-emoji { font-size: 1.3rem; flex-shrink: 0; }

                .ab-float-title {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    line-height: 1;
                }

                .ab-float-sub {
                    font-size: 0.68rem;
                    color: var(--text-tertiary);
                    margin-top: 2px;
                }

                /* ══════════════════════════════
                   SHARED SECTION SHELL
                ══════════════════════════════ */
                .ab-section {
                    position: relative;
                    padding: var(--space-24) 0;
                    overflow: hidden;
                }

                /* ══════════════════════════════
                   WHO WE ARE
                ══════════════════════════════ */
                .ab-who-section {
                    background: var(--color-white);
                }

                .ab-who-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-16);
                    align-items: center;
                }

                .ab-who-points {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                    margin-top: var(--space-6);
                }

                /* Quote card */
                .ab-quote-card {
                    position: relative;
                    background: var(--color-gray-900);
                    border-radius: var(--radius-3xl);
                    padding: var(--space-10);
                    overflow: hidden;
                }

                .ab-quote-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(
                        to right,
                        var(--color-primary-500),
                        var(--color-accent-500)
                    );
                }

                .ab-quote-ghost {
                    position: absolute;
                    top: -16px; right: var(--space-6);
                    font-family: Georgia, serif;
                    font-size: 8rem;
                    font-weight: 900;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(37,99,235,0.1);
                    line-height: 1;
                    pointer-events: none;
                    user-select: none;
                }

                .ab-quote-text {
                    font-family: var(--font-display);
                    font-size: var(--font-size-lg);
                    font-style: italic;
                    font-weight: var(--font-weight-normal);
                    color: var(--color-gray-50);
                    line-height: 1.75;
                    margin: 0 0 var(--space-6);
                    position: relative;
                    z-index: 1;
                }

                .ab-quote-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.1);
                    margin-bottom: var(--space-6);
                }

                .ab-quote-author {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    margin-bottom: var(--space-6);
                    position: relative;
                    z-index: 1;
                }

                .ab-quote-avatar {
                    width: 40px; height: 40px;
                    border-radius: var(--radius-full);
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    color: var(--color-white);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-display);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-bold);
                    flex-shrink: 0;
                }

                .ab-quote-name {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-gray-50);
                    margin-bottom: 2px;
                }

                .ab-quote-place {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.45);
                }

                .ab-quote-pills {
                    display: flex;
                    gap: var(--space-2);
                    position: relative;
                    z-index: 1;
                }

                .ab-qpill {
                    display: inline-block;
                    padding: 3px var(--space-3);
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: var(--radius-full);
                    font-size: 0.65rem;
                    font-weight: var(--font-weight-semibold);
                    color: rgba(255,255,255,0.7);
                    letter-spacing: 0.05em;
                }

                /* ══════════════════════════════
                   RECOGNITIONS
                ══════════════════════════════ */
                .ab-rec-section {
                    background: linear-gradient(
                        180deg,
                        var(--color-gray-50) 0%,
                        var(--color-white) 100%
                    );
                }

                .ab-rec-glow {
                    position: absolute;
                    top: -80px; right: -60px;
                    width: 360px; height: 360px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.06) 0%,
                        transparent 65%
                    );
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                .ab-rec-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: var(--space-6);
                    margin-bottom: var(--space-10);
                    position: relative;
                    z-index: 1;
                }

                .ab-rec-desc {
                    font-size: var(--font-size-base);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    max-width: 360px;
                    margin: 0;
                }

                .ab-rec-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-4);
                    position: relative;
                    z-index: 1;
                }

                .ab-rec-card {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-6);
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    overflow: hidden;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base),
                        border-color var(--transition-base);
                }

                .ab-rec-card:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-md);
                    border-color: var(--color-primary-200);
                }

                .ab-rec-card-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(
                        to right,
                        var(--color-primary-500),
                        var(--color-accent-400)
                    );
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.3s var(--ease-in-out);
                }

                .ab-rec-card:hover .ab-rec-card-bar {
                    transform: scaleX(1);
                }

                .ab-rec-icon-box {
                    width: 42px; height: 42px;
                    border-radius: var(--radius-xl);
                    background: rgba(37,99,235,0.08);
                    border: 1px solid rgba(37,99,235,0.18);
                    color: var(--color-primary-600);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: transform var(--transition-base);
                }

                .ab-rec-card:hover .ab-rec-icon-box {
                    transform: scale(1.08) rotate(-5deg);
                }

                .ab-rec-label {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    line-height: 1.4;
                }

                /* ══════════════════════════════
                   PROCESS
                ══════════════════════════════ */
                .ab-process-section {
                    position: relative;
                    padding: var(--space-24) 0;
                    background: linear-gradient(
                        135deg,
                        var(--color-gray-900) 0%,
                        var(--color-gray-800) 100%
                    );
                    overflow: hidden;
                }

                .ab-process-glow {
                    position: absolute;
                    bottom: -80px; left: -60px;
                    width: 380px; height: 380px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.15) 0%,
                        transparent 65%
                    );
                    filter: blur(55px);
                    pointer-events: none;
                    z-index: 0;
                }

                .ab-process-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(
                        circle,
                        rgba(255,255,255,0.03) 1px,
                        transparent 1px
                    );
                    background-size: 28px 28px;
                    pointer-events: none;
                    z-index: 0;
                }

                .ab-process-inner {
                    position: relative;
                    z-index: 1;
                }

                .ab-process-header {
                    margin-bottom: var(--space-14);
                }

                .ab-process-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--color-gray-50);
                    margin-bottom: 0;
                }

                .ab-process-title-em {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-400),
                        var(--color-accent-400)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .ab-process-connector {
                    position: absolute;
                    top: calc(var(--space-24) + var(--space-14) + 96px + 22px);
                    left: calc(var(--space-6) + 11%);
                    right: calc(var(--space-6) + 11%);
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        rgba(37,99,235,0.15),
                        rgba(37,99,235,0.4),
                        rgba(37,99,235,0.15)
                    );
                    pointer-events: none;
                    z-index: 0;
                }

                .ab-process-steps {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--space-6);
                    position: relative;
                    z-index: 1;
                }

                .ab-step-num {
                    width: 44px; height: 44px;
                    border-radius: var(--radius-full);
                    background: var(--color-primary-600);
                    color: var(--color-white);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-display);
                    font-size: 0.78rem;
                    font-weight: var(--font-weight-bold);
                    box-shadow: 0 0 0 6px rgba(37,99,235,0.15);
                    letter-spacing: 0.04em;
                    margin-bottom: var(--space-6);
                }

                .ab-step-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-gray-50);
                    margin-bottom: var(--space-3);
                    line-height: 1.3;
                }

                .ab-step-desc {
                    font-size: var(--font-size-sm);
                    line-height: 1.75;
                    color: rgba(255,255,255,0.45);
                    margin: 0 0 var(--space-5);
                }

                .ab-step-bar {
                    width: 28px; height: 2px;
                    background: linear-gradient(
                        to right,
                        var(--color-primary-500),
                        var(--color-accent-500)
                    );
                    border-radius: var(--radius-full);
                }

                /* ══════════════════════════════
                   MISSION & VISION
                ══════════════════════════════ */
                .ab-mv-section {
                    background: var(--color-white);
                }

                .ab-mv-head {
                    margin-bottom: var(--space-10);
                }

                .ab-mv-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-5);
                }

                .ab-mv-card {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-3xl);
                    padding: var(--space-10);
                    overflow: hidden;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base);
                }

                .ab-mv-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .ab-mv-card-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                }

                .ab-mv-bar-blue {
                    background: linear-gradient(
                        to right,
                        var(--color-primary-600),
                        var(--color-primary-400)
                    );
                }

                .ab-mv-bar-orange {
                    background: linear-gradient(
                        to right,
                        var(--color-accent-500),
                        var(--color-accent-400)
                    );
                }

                .ab-mv-icon {
                    width: 52px; height: 52px;
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--space-4);
                    transition: transform var(--transition-base);
                }

                .ab-mv-card:hover .ab-mv-icon {
                    transform: scale(1.08) rotate(-5deg);
                }

                .ab-mv-icon-blue {
                    background: rgba(37,99,235,0.08);
                    border: 1px solid rgba(37,99,235,0.18);
                    color: var(--color-primary-600);
                }

                .ab-mv-icon-orange {
                    background: rgba(249,115,22,0.08);
                    border: 1px solid rgba(249,115,22,0.18);
                    color: var(--color-accent-600);
                }

                .ab-mv-tag {
                    display: inline-block;
                    padding: 3px var(--space-3);
                    border-radius: var(--radius-full);
                    font-size: 0.65rem;
                    font-weight: var(--font-weight-semibold);
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    margin-bottom: var(--space-4);
                }

                .ab-mv-tag-blue {
                    background: rgba(37,99,235,0.08);
                    color: var(--color-primary-700);
                    border: 1px solid rgba(37,99,235,0.18);
                }

                .ab-mv-tag-orange {
                    background: rgba(249,115,22,0.08);
                    color: var(--color-accent-700);
                    border: 1px solid rgba(249,115,22,0.18);
                }

                .ab-mv-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    line-height: 1.25;
                    letter-spacing: var(--letter-spacing-tight);
                    margin-bottom: var(--space-4);
                }

                .ab-mv-body {
                    font-size: var(--font-size-sm);
                    line-height: 1.85;
                    color: var(--text-secondary);
                    margin: 0;
                }

                .ab-mv-dots {
                    position: absolute;
                    bottom: -16px; right: -16px;
                    width: 120px; height: 120px;
                    background-image: radial-gradient(
                        circle,
                        rgba(37,99,235,0.07) 1.5px,
                        transparent 1.5px
                    );
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                /* ══════════════════════════════
                   FOUNDER
                ══════════════════════════════ */
                .ab-founder-section {
                    background: linear-gradient(
                        180deg,
                        var(--color-gray-50) 0%,
                        var(--color-white) 100%
                    );
                }

                .ab-founder-glow {
                    position: absolute;
                    top: -60px; right: -60px;
                    width: 360px; height: 360px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.06) 0%,
                        transparent 65%
                    );
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                .ab-founder-card {
                    position: relative;
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-3xl);
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                    z-index: 1;
                }

                .ab-founder-card-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(
                        to right,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    z-index: 2;
                }

                .ab-founder-left {
                    position: relative;
                    background: var(--color-gray-900);
                    padding: var(--space-12) var(--space-8);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .ab-founder-bg-dots {
                    position: absolute;
                    bottom: -16px; right: -16px;
                    width: 140px; height: 140px;
                    background-image: radial-gradient(
                        circle,
                        rgba(37,99,235,0.1) 1.5px,
                        transparent 1.5px
                    );
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                .ab-founder-img-ring {
                    width: 120px; height: 120px;
                    border-radius: var(--radius-full);
                    border: 2px solid rgba(37,99,235,0.35);
                    padding: 4px;
                    margin-bottom: var(--space-5);
                    position: relative;
                    z-index: 1;
                }

                .ab-founder-img-inner {
                    width: 100%; height: 100%;
                    border-radius: var(--radius-full);
                    overflow: hidden;
                    background: var(--color-gray-700);
                    position: relative;
                }

                .ab-founder-img {
                    object-fit: cover;
                }

                .ab-founder-name {
                    font-family: var(--font-display);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-gray-50);
                    text-align: center;
                    position: relative;
                    z-index: 1;
                    margin-bottom: var(--space-1);
                }

                .ab-founder-role {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.45);
                    text-align: center;
                    letter-spacing: 0.04em;
                    position: relative;
                    z-index: 1;
                }

                .ab-founder-mark {
                    font-family: Georgia, serif;
                    font-size: 2rem;
                    color: var(--color-primary-400);
                    margin-top: var(--space-6);
                    opacity: 0.5;
                    position: relative;
                    z-index: 1;
                    line-height: 1;
                }

                .ab-founder-right {
                    padding: var(--space-10) var(--space-10);
                }

                .ab-founder-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.5rem, 2.5vw, 2rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: var(--space-5);
                }

                .ab-founder-points {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                    margin-top: var(--space-5);
                    margin-bottom: var(--space-6);
                }

                .ab-founder-motto {
                    display: inline-flex;
                    align-items: center;
                    padding: var(--space-3) var(--space-5);
                    background: var(--color-primary-50);
                    border: 1px solid var(--color-primary-200);
                    border-radius: var(--radius-full);
                    font-family: var(--font-display);
                    font-size: var(--font-size-sm);
                    font-style: italic;
                    font-weight: var(--font-weight-medium);
                    color: var(--color-primary-700);
                }

                /* ══════════════════════════════
                   CTA SECTION
                ══════════════════════════════ */
                .ab-cta-section {
                    position: relative;
                    padding: var(--space-20) 0;
                    background: linear-gradient(
                        135deg,
                        var(--color-gray-900) 0%,
                        var(--color-gray-800) 100%
                    );
                    overflow: hidden;
                }

                .ab-cta-glow {
                    position: absolute;
                    top: -60px; right: -60px;
                    width: 300px; height: 300px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.2) 0%,
                        transparent 65%
                    );
                    filter: blur(50px);
                    pointer-events: none;
                }

                .ab-cta-inner {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: var(--space-8);
                }

                .ab-cta-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.6rem, 3vw, 2.2rem);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-gray-50);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    margin-bottom: var(--space-3);
                }

                .ab-cta-desc {
                    font-size: var(--font-size-base);
                    color: rgba(255,255,255,0.5);
                    line-height: 1.7;
                    margin: 0;
                }

                .ab-cta-left { flex: 1; min-width: 280px; }

                .ab-cta-actions {
                    display: flex;
                    gap: var(--space-3);
                    flex-wrap: wrap;
                    flex-shrink: 0;
                }

                /* ══════════════════════════════
                   KEYFRAMES
                ══════════════════════════════ */
                @keyframes ab-pulse {
                    0%, 100% { opacity: 1; transform: scale(1);   }
                    50%       { opacity: 0.5; transform: scale(1.3); }
                }

                /* ══════════════════════════════
                   RESPONSIVE
                ══════════════════════════════ */
                @media (max-width: 1024px) {
                    .ab-rec-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .ab-process-steps {
                        grid-template-columns: repeat(2, 1fr);
                        gap: var(--space-8);
                    }
                    .ab-process-connector {
                        display: none;
                    }
                }

                @media (max-width: 960px) {
                    .ab-hero-inner {
                        grid-template-columns: 1fr;
                        gap: var(--space-10);
                    }
                    .ab-hero-right {
                        max-width: 560px;
                        margin: 0 auto;
                    }
                    .ab-who-grid {
                        grid-template-columns: 1fr;
                        gap: var(--space-10);
                    }
                    .ab-mv-grid {
                        grid-template-columns: 1fr;
                    }
                    .ab-founder-card {
                        grid-template-columns: 1fr;
                    }
                    .ab-founder-left {
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        gap: var(--space-5);
                        padding: var(--space-7) var(--space-8);
                    }
                    .ab-founder-img-ring {
                        width: 80px; height: 80px;
                        margin-bottom: 0;
                        flex-shrink: 0;
                    }
                    .ab-founder-mark { display: none; }
                    .ab-cta-inner {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 768px) {
                    .ab-hero {
                        padding: var(--space-16) 0;
                    }
                    .ab-section {
                        padding: var(--space-16) 0;
                    }
                    .ab-process-section {
                        padding: var(--space-16) 0;
                    }
                    .ab-cta-section {
                        padding: var(--space-16) 0;
                    }
                    .ab-rec-grid {
                        grid-template-columns: 1fr;
                    }
                    .ab-process-steps {
                        grid-template-columns: 1fr;
                    }
                    .ab-founder-right {
                        padding: var(--space-7) var(--space-6);
                    }
                    .ab-cta-actions {
                        width: 100%;
                        flex-direction: column;
                    }
                    .ab-btn-white,
                    .ab-btn-cta-ghost {
                        justify-content: center;
                    }
                    .ab-rec-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 480px) {
                    .ab-stats-row {
                        grid-template-columns: 1fr;
                    }
                    .ab-hero-actions {
                        flex-direction: column;
                    }
                    .ab-btn-primary,
                    .ab-btn-outline {
                        justify-content: center;
                    }
                    .ab-mv-card {
                        padding: var(--space-7);
                    }
                    .ab-quote-card {
                        padding: var(--space-7);
                    }
                }
            `}</style>
        </>
    );
}