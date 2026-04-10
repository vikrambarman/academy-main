"use client";

import {
    GraduationCap,
    Award,
    CheckCircle,
    Users,
    Shield,
    MapPin,
    ArrowRight,
    BookOpen,
    Cpu,
} from "lucide-react";

const recognitions = [
    { icon: "🏛️", label: "GSDM Authorized"      },
    { icon: "🇮🇳", label: "Skill India Aligned"  },
    { icon: "🔐", label: "DigiLocker Compatible" },
    { icon: "📜", label: "NSDC Partner"          },
];

const stats = [
    { value: "1000+", label: "Students Enrolled",        icon: "🎓" },
    { value: "98%",   label: "Completion Rate",          icon: "📈" },
    { value: "100%",  label: "Certificate Verification", icon: "✅" },
    { value: "24/7",  label: "Student Support",          icon: "🤝" },
];

// Faculty expertise areas — real, verifiable claims
const expertise = [
    { icon: Cpu,       label: "Hardware & Networking"    },
    { icon: BookOpen,  label: "DCA / PGDCA Programs"     },
    { icon: GraduationCap, label: "Academic IT Training" },
    { icon: CheckCircle,   label: "Tally & Accounting"   },
];

export default function TrustSection() {
    return (
        <>
            <section className="ts-section" aria-labelledby="trust-heading">

                <div className="ts-dots"    aria-hidden="true" />
                <div className="ts-glow-tr" aria-hidden="true" />
                <div className="ts-glow-bl" aria-hidden="true" />
                <div className="ts-h-line"  aria-hidden="true" />

                <div className="ts-wrap">

                    {/* ── Header ── */}
                    <div className="ts-header">
                        <div className="ts-badge">
                            <span className="ts-badge-dot" aria-hidden="true" />
                            Trusted & Recognized
                        </div>
                        <h2 id="trust-heading" className="ts-title">
                            Your{" "}
                            <span className="ts-title-em">Trusted Partner</span>
                            <br />in Digital Education
                        </h2>
                        <p className="ts-subtitle">
                            A government-recognized institute in Ambikapur, backed by
                            experienced faculty and committed to quality education,
                            verified certifications, and student success.
                        </p>
                    </div>

                    {/* ══════════════════════════════
                        MAIN LAYOUT
                        Left  — Faculty hero card + 3 mini pills
                        Right — ISO + MSME cards + recognition strip
                    ══════════════════════════════ */}
                    <div className="ts-main">

                        {/* ── Left column ── */}
                        <div className="ts-left">

                            {/* Hero card — Faculty experience */}
                            <div className="ts-hero-card">
                                <div className="ts-hero-bar" aria-hidden="true" />

                                <div className="ts-hero-top">
                                    <div className="ts-hero-icon">
                                        <Users size={30} strokeWidth={1.4} />
                                    </div>
                                    <span className="ts-hero-pill">Est. June 2025</span>
                                </div>

                                {/* Heading */}
                                <div className="ts-hero-label">
                                    Experienced Faculty,<br />
                                    <span className="ts-hero-label-em">
                                        Strong Foundation
                                    </span>
                                </div>

                                <p className="ts-hero-desc">
                                    Shivshakti Computer Academy may be new, but our
                                    faculty brings years of hands-on teaching and
                                    industry experience across multiple institutions —
                                    giving students the best of both worlds.
                                </p>

                                {/* Faculty expertise tags */}
                                <div className="ts-expertise-grid">
                                    {expertise.map((e, i) => {
                                        const Icon = e.icon;
                                        return (
                                            <div key={i} className="ts-exp-item">
                                                <span className="ts-exp-icon">
                                                    <Icon size={14} strokeWidth={2} />
                                                </span>
                                                <span>{e.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Founder note */}
                                <div className="ts-founder-note">
                                    <div className="ts-founder-avatar" aria-hidden="true">
                                        V
                                    </div>
                                    <div className="ts-founder-text">
                                        <div className="ts-founder-name">
                                            Vikram Sir
                                        </div>
                                        <div className="ts-founder-role">
                                            Founder & Lead Instructor ·{" "}
                                            <span className="ts-founder-highlight">
                                                Multi-institution teaching experience
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ts-hero-shine" aria-hidden="true" />
                            </div>

                            {/* 3 mini stat pills */}
                            <div className="ts-pills-row">
                                {[
                                    {
                                        icon: <GraduationCap size={18} strokeWidth={1.6} />,
                                        val: "25+",
                                        lbl: "Courses",
                                        c: "blue",
                                    },
                                    {
                                        icon: <CheckCircle size={18} strokeWidth={1.6} />,
                                        val: "Online",
                                        lbl: "Verification",
                                        c: "green",
                                    },
                                    {
                                        icon: <Users size={18} strokeWidth={1.6} />,
                                        val: "Expert",
                                        lbl: "Faculty",
                                        c: "orange",
                                    },
                                ].map((p, i) => (
                                    <div key={i} className={`ts-pill ts-pill-${p.c}`}>
                                        <span className={`ts-pill-icon ts-pill-icon-${p.c}`}>
                                            {p.icon}
                                        </span>
                                        <div>
                                            <div className="ts-pill-val">{p.val}</div>
                                            <div className="ts-pill-lbl">{p.lbl}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Right column ── */}
                        <div className="ts-right">

                            {/* ISO card */}
                            <div className="ts-cert-card ts-cert-orange">
                                <div className="ts-cert-bar ts-cert-bar-orange" aria-hidden="true" />

                                <div className="ts-cert-top">
                                    <div className="ts-cert-icon ts-cert-icon-orange">
                                        <Award size={26} strokeWidth={1.5} />
                                    </div>
                                    <div className="ts-cert-shine" aria-hidden="true" />
                                </div>

                                <div className="ts-cert-num">ISO</div>
                                <div className="ts-cert-sub">9001:2015 Certified</div>
                                <p className="ts-cert-desc">
                                    Quality management system ensuring consistent,
                                    world-class training standards.
                                </p>

                                <div className="ts-cert-badge ts-cbadge-orange">
                                    Internationally Recognized
                                </div>
                            </div>

                            {/* MSME card */}
                            <div className="ts-cert-card ts-cert-green">
                                <div className="ts-cert-bar ts-cert-bar-green" aria-hidden="true" />
                                <div className="ts-cert-pulse" aria-hidden="true" />

                                <div className="ts-cert-top">
                                    <div className="ts-cert-icon ts-cert-icon-green">
                                        <Shield size={26} strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="ts-cert-num">MSME</div>
                                <div className="ts-cert-sub">Government Registered</div>
                                <p className="ts-cert-desc">
                                    Recognized as a micro, small &amp; medium enterprise
                                    in the education sector by Govt. of India.
                                </p>

                                <div className="ts-cert-badge ts-cbadge-green">
                                    Govt. of India ✓
                                </div>
                            </div>

                            {/* Recognition strip */}
                            <div className="ts-rec-strip">
                                <div className="ts-rec-label">
                                    <MapPin size={13} strokeWidth={2} />
                                    Affiliated &amp; Recognized by
                                </div>
                                <div className="ts-rec-pills">
                                    {recognitions.map((r) => (
                                        <div key={r.label} className="ts-rec-pill">
                                            <span>{r.icon}</span>
                                            <span>{r.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats strip ── */}
                    <div className="ts-stats">
                        {stats.map((s, i) => (
                            <div key={i} className="ts-stat">
                                <span className="ts-stat-emoji">{s.icon}</span>
                                <div className="ts-stat-val">{s.value}</div>
                                <div className="ts-stat-lbl">{s.label}</div>
                                {i < stats.length - 1 && (
                                    <div className="ts-stat-sep" aria-hidden="true" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── CTA Banner ── */}
                    <div className="ts-cta-banner">
                        <div className="ts-cta-glow" aria-hidden="true" />

                        <div className="ts-cta-left">
                            <div className="ts-cta-icon" aria-hidden="true">🏛️</div>
                            <div>
                                <div className="ts-cta-title">
                                    Government Recognized Training Centre
                                </div>
                                <div className="ts-cta-sub">
                                    Ambikapur, Surguja, Chhattisgarh
                                </div>
                            </div>
                        </div>

                        <a href="/about" className="ts-cta-btn">
                            Learn More About Us
                            <ArrowRight
                                size={15}
                                strokeWidth={2}
                                className="ts-cta-arrow"
                            />
                        </a>
                    </div>

                </div>
            </section>

            <style>{`

                /* ── Section ── */
                .ts-section {
                    position: relative;
                    padding: var(--space-24) var(--space-6);
                    background: linear-gradient(
                        180deg,
                        var(--color-white) 0%,
                        var(--color-gray-50) 100%
                    );
                    overflow: hidden;
                }

                .ts-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(
                        circle,
                        rgba(37,99,235,0.04) 1px,
                        transparent 1px
                    );
                    background-size: 30px 30px;
                    pointer-events: none;
                    z-index: 0;
                }

                .ts-glow-tr {
                    position: absolute;
                    top: -140px; right: -80px;
                    width: 460px; height: 460px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.08) 0%,
                        transparent 65%
                    );
                    filter: blur(55px);
                    pointer-events: none;
                    z-index: 0;
                }

                .ts-glow-bl {
                    position: absolute;
                    bottom: -120px; left: -70px;
                    width: 380px; height: 380px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(249,115,22,0.06) 0%,
                        transparent 65%
                    );
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                .ts-h-line {
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

                /* ── Wrapper ── */
                .ts-wrap {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .ts-header {
                    text-align: center;
                    max-width: 640px;
                    margin: 0 auto var(--space-16);
                }

                .ts-badge {
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
                    margin-bottom: var(--space-4);
                }

                .ts-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--color-primary-600);
                    border-radius: var(--radius-full);
                    animation: ts-pulse 2s ease-in-out infinite;
                }

                .ts-title {
                    font-family: var(--font-display);
                    font-size: clamp(2rem, 5vw, 3rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: var(--space-4);
                }

                .ts-title-em {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .ts-subtitle {
                    font-size: var(--font-size-base);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin: 0;
                }

                /* ── Main grid ── */
                .ts-main {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-5);
                    margin-bottom: var(--space-6);
                    align-items: start;
                }

                /* ── Left ── */
                .ts-left {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                /* ── Hero card ── */
                .ts-hero-card {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-3xl);
                    padding: var(--space-8);
                    overflow: hidden;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base);
                }

                .ts-hero-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-xl);
                    border-color: var(--color-primary-200);
                }

                .ts-hero-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(
                        to right,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                }

                .ts-hero-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: var(--space-6);
                }

                .ts-hero-icon {
                    width: 56px; height: 56px;
                    border-radius: var(--radius-2xl);
                    background: rgba(37,99,235,0.08);
                    border: 1px solid rgba(37,99,235,0.18);
                    color: var(--color-primary-600);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform var(--transition-base);
                }

                .ts-hero-card:hover .ts-hero-icon {
                    transform: scale(1.08) rotate(-5deg);
                }

                .ts-hero-pill {
                    display: inline-block;
                    padding: var(--space-1) var(--space-3);
                    background: rgba(16,185,129,0.08);
                    border: 1px solid rgba(16,185,129,0.2);
                    border-radius: var(--radius-full);
                    font-size: 0.65rem;
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-success-dark);
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                }

                .ts-hero-label {
                    font-family: var(--font-display);
                    font-size: clamp(1.4rem, 2.5vw, 1.9rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.25;
                    color: var(--text-primary);
                    letter-spacing: var(--letter-spacing-tight);
                    margin-bottom: var(--space-4);
                }

                .ts-hero-label-em {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .ts-hero-desc {
                    font-size: var(--font-size-sm);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin: 0 0 var(--space-5);
                }

                /* Expertise tags */
                .ts-expertise-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-2);
                    margin-bottom: var(--space-6);
                }

                .ts-exp-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    background: var(--color-gray-50);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-medium);
                    color: var(--text-secondary);
                    transition: background var(--transition-fast),
                                border-color var(--transition-fast);
                }

                .ts-exp-item:hover {
                    background: var(--color-primary-50);
                    border-color: var(--color-primary-200);
                    color: var(--color-primary-700);
                }

                .ts-exp-icon {
                    color: var(--color-primary-500);
                    flex-shrink: 0;
                    display: flex;
                }

                /* Founder note */
                .ts-founder-note {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    background: var(--color-gray-50);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                }

                .ts-founder-avatar {
                    width: 40px; height: 40px;
                    border-radius: var(--radius-full);
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-100),
                        var(--color-primary-200)
                    );
                    border: 2px solid var(--color-primary-200);
                    color: var(--color-primary-700);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-display);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-bold);
                    flex-shrink: 0;
                }

                .ts-founder-name {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: 2px;
                }

                .ts-founder-role {
                    font-size: 0.68rem;
                    color: var(--text-tertiary);
                    line-height: 1.4;
                }

                .ts-founder-highlight {
                    color: var(--color-primary-600);
                    font-weight: var(--font-weight-medium);
                }

                /* Shine sweep */
                .ts-hero-shine {
                    position: absolute;
                    top: 0; left: -100%;
                    width: 60%; height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,0.4),
                        transparent
                    );
                    animation: ts-shine 5s ease-in-out infinite;
                    pointer-events: none;
                }

                /* Mini pills */
                .ts-pills-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-3);
                }

                .ts-pill {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    background: var(--color-white);
                    border-radius: var(--radius-xl);
                    border: 1px solid var(--color-gray-200);
                    transition:
                        transform var(--transition-fast),
                        box-shadow var(--transition-fast),
                        border-color var(--transition-fast);
                }

                .ts-pill:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-md);
                }

                .ts-pill-blue:hover   { border-color: rgba(37,99,235,0.3);  }
                .ts-pill-green:hover  { border-color: rgba(16,185,129,0.3); }
                .ts-pill-orange:hover { border-color: rgba(249,115,22,0.3); }

                .ts-pill-icon {
                    width: 36px; height: 36px;
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .ts-pill-icon-blue   { background: rgba(37,99,235,0.1);  color: var(--color-primary-600); }
                .ts-pill-icon-green  { background: rgba(16,185,129,0.1); color: var(--color-success);     }
                .ts-pill-icon-orange { background: rgba(249,115,22,0.1); color: var(--color-accent-600);  }

                .ts-pill-val {
                    font-family: var(--font-display);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    line-height: 1;
                }

                .ts-pill-lbl {
                    font-size: 0.65rem;
                    color: var(--text-tertiary);
                    margin-top: 2px;
                    font-weight: var(--font-weight-medium);
                }

                /* ── Right column ── */
                .ts-right {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                /* Cert cards */
                .ts-cert-card {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-5);
                    overflow: hidden;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base),
                        border-color var(--transition-base);
                }

                .ts-cert-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .ts-cert-orange:hover { border-color: rgba(249,115,22,0.3); }
                .ts-cert-green:hover  { border-color: rgba(16,185,129,0.3); }

                .ts-cert-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                }

                .ts-cert-bar-orange {
                    background: linear-gradient(
                        to right,
                        var(--color-accent-500),
                        var(--color-accent-400)
                    );
                }

                .ts-cert-bar-green {
                    background: linear-gradient(
                        to right,
                        var(--color-success),
                        #34d399
                    );
                }

                .ts-cert-pulse {
                    position: absolute;
                    top: var(--space-4); right: var(--space-4);
                    width: 10px; height: 10px;
                    border-radius: var(--radius-full);
                    background: var(--color-success);
                    animation: ts-pulse 2s ease-in-out infinite;
                }

                .ts-cert-top {
                    margin-bottom: var(--space-4);
                    position: relative;
                }

                .ts-cert-icon {
                    width: 52px; height: 52px;
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform var(--transition-base);
                }

                .ts-cert-card:hover .ts-cert-icon {
                    transform: scale(1.08) rotate(-5deg);
                }

                .ts-cert-icon-orange {
                    background: rgba(249,115,22,0.1);
                    border: 1px solid rgba(249,115,22,0.2);
                    color: var(--color-accent-600);
                }

                .ts-cert-icon-green {
                    background: rgba(16,185,129,0.1);
                    border: 1px solid rgba(16,185,129,0.2);
                    color: var(--color-success);
                }

                .ts-cert-shine {
                    position: absolute;
                    top: 0; left: -100%;
                    width: 80%; height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,0.5),
                        transparent
                    );
                    animation: ts-shine 3s ease-in-out infinite;
                    pointer-events: none;
                }

                .ts-cert-num {
                    font-family: var(--font-display);
                    font-size: clamp(2rem, 3vw, 2.8rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1;
                    color: var(--text-primary);
                    letter-spacing: var(--letter-spacing-tight);
                    margin-bottom: var(--space-1);
                }

                .ts-cert-sub {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-3);
                }

                .ts-cert-desc {
                    font-size: var(--font-size-sm);
                    line-height: 1.7;
                    color: var(--text-secondary);
                    margin: 0 0 var(--space-4);
                }

                .ts-cert-badge {
                    display: inline-block;
                    padding: var(--space-1) var(--space-3);
                    border-radius: var(--radius-full);
                    font-size: 0.65rem;
                    font-weight: var(--font-weight-semibold);
                    letter-spacing: 0.05em;
                }

                .ts-cbadge-orange {
                    background: rgba(249,115,22,0.08);
                    color: var(--color-accent-700);
                    border: 1px solid rgba(249,115,22,0.2);
                }

                .ts-cbadge-green {
                    background: rgba(16,185,129,0.08);
                    color: var(--color-success-dark);
                    border: 1px solid rgba(16,185,129,0.2);
                }

                /* Recognition strip */
                .ts-rec-strip {
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-5) var(--space-6);
                }

                .ts-rec-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: 0.68rem;
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-tertiary);
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: var(--space-4);
                }

                .ts-rec-pills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-2);
                }

                .ts-rec-pill {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    background: var(--color-gray-50);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-medium);
                    color: var(--text-secondary);
                    transition:
                        background var(--transition-fast),
                        border-color var(--transition-fast),
                        transform var(--transition-fast);
                }

                .ts-rec-pill:hover {
                    background: var(--color-primary-50);
                    border-color: var(--color-primary-200);
                    transform: translateY(-1px);
                }

                /* ── Stats strip ── */
                .ts-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    margin-bottom: var(--space-5);
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    box-shadow: var(--shadow-sm);
                    overflow: hidden;
                }

                .ts-stat {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: var(--space-6) var(--space-4);
                    transition:
                        background var(--transition-fast),
                        transform var(--transition-fast);
                }

                .ts-stat:hover {
                    background: var(--color-primary-50);
                }

                .ts-stat-sep {
                    position: absolute;
                    right: 0; top: 20%; bottom: 20%;
                    width: 1px;
                    background: var(--color-gray-100);
                }

                .ts-stat-emoji {
                    font-size: 1.4rem;
                    margin-bottom: var(--space-2);
                    display: block;
                }

                .ts-stat-val {
                    font-family: var(--font-display);
                    font-size: clamp(1.5rem, 2.5vw, 2rem);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary-600);
                    line-height: 1;
                    margin-bottom: var(--space-2);
                }

                .ts-stat-lbl {
                    font-size: var(--font-size-xs);
                    color: var(--text-secondary);
                    font-weight: var(--font-weight-medium);
                    line-height: 1.3;
                }

                /* ── CTA Banner ── */
                .ts-cta-banner {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: var(--space-5);
                    padding: var(--space-6);
                    background: linear-gradient(
                        135deg,
                        var(--color-gray-900) 0%,
                        var(--color-gray-800) 100%
                    );
                    border-radius: var(--radius-2xl);
                    overflow: hidden;
                }

                .ts-cta-glow {
                    position: absolute;
                    top: -40px; right: -40px;
                    width: 240px; height: 240px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.2) 0%,
                        transparent 65%
                    );
                    filter: blur(40px);
                    pointer-events: none;
                }

                .ts-cta-left {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    position: relative;
                    z-index: 1;
                }

                .ts-cta-icon {
                    width: 48px; height: 48px;
                    border-radius: var(--radius-xl);
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    flex-shrink: 0;
                }

                .ts-cta-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-gray-50);
                    margin-bottom: var(--space-1);
                }

                .ts-cta-sub {
                    font-size: var(--font-size-sm);
                    color: rgba(255,255,255,0.5);
                }

                .ts-cta-btn {
                    position: relative;
                    z-index: 1;
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
                    flex-shrink: 0;
                    transition:
                        background var(--transition-fast),
                        transform var(--transition-fast),
                        box-shadow var(--transition-fast);
                }

                .ts-cta-btn:hover {
                    background: var(--color-gray-50);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                    color: var(--color-gray-900);
                }

                .ts-cta-arrow {
                    transition: transform var(--transition-fast);
                }

                .ts-cta-btn:hover .ts-cta-arrow {
                    transform: translateX(4px);
                }

                /* ── Keyframes ── */
                @keyframes ts-pulse {
                    0%, 100% { opacity: 1; transform: scale(1);   }
                    50%       { opacity: 0.5; transform: scale(1.3); }
                }

                @keyframes ts-shine {
                    0%   { left: -100%; }
                    45%  { left: 110%;  }
                    100% { left: 110%;  }
                }

                /* ── Responsive ── */
                @media (max-width: 1024px) {
                    .ts-main {
                        grid-template-columns: 1fr;
                    }

                    .ts-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .ts-stat-sep { display: none; }

                    .ts-stat:nth-child(odd) {
                        border-right: 1px solid var(--color-gray-100);
                    }

                    .ts-stat:nth-child(1),
                    .ts-stat:nth-child(2) {
                        border-bottom: 1px solid var(--color-gray-100);
                    }
                }

                @media (max-width: 768px) {
                    .ts-section {
                        padding: var(--space-16) var(--space-4);
                    }

                    .ts-cta-banner {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: var(--space-6);
                    }

                    .ts-cta-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .ts-expertise-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                @media (max-width: 480px) {
                    .ts-pills-row {
                        grid-template-columns: 1fr;
                    }

                    .ts-expertise-grid {
                        grid-template-columns: 1fr;
                    }

                    .ts-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .ts-hero-card {
                        padding: var(--space-6);
                    }

                    .ts-cert-card {
                        padding: var(--space-5);
                    }
                }
            `}</style>
        </>
    );
}