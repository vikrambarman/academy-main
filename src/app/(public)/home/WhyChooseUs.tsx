"use client";

import {
    MonitorCheck,
    Award,
    Briefcase,
    Users,
    ShieldCheck,
    Rocket,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

const points = [
    { icon: MonitorCheck, title: "Practical Computer Training",  desc: "Hands-on learning with dedicated systems and real-time practical sessions.", accent: "blue"   },
    { icon: Award,        title: "Recognized Certifications",    desc: "Certificates aligned with Skill India initiatives and DigiLocker verification.", accent: "orange" },
    { icon: Briefcase,    title: "Career-Oriented Programs",     desc: "Industry-focused courses designed for employment and digital careers.", accent: "blue"   },
    { icon: Users,        title: "Supportive Learning",          desc: "Guided training environment that helps students learn confidently.", accent: "green"  },
    { icon: ShieldCheck,  title: "Trusted Local Institute",      desc: "Established computer training institute serving Ambikapur and nearby regions.", accent: "orange" },
    { icon: Rocket,       title: "Skill-Based Growth",           desc: "Programs designed for job readiness, freelancing and self-employment.", accent: "blue"   },
];

const highlights = [
    { title: "Practical-First Learning",    desc: "Every course emphasizes hands-on computer practice from day one." },
    { title: "Verified Certifications",     desc: "Certificates supported by recognised national platforms." },
    { title: "Career-Oriented Curriculum",  desc: "Programs designed for real-world digital career opportunities." },
];

const accentStyles: Record<string, { icon: string; border: string; bg: string; tag: string }> = {
    blue:   { icon: "var(--color-primary-600)",  border: "rgba(37,99,235,0.18)",   bg: "rgba(37,99,235,0.07)",  tag: "var(--color-primary-100)" },
    orange: { icon: "var(--color-accent-600)",   border: "rgba(249,115,22,0.18)",  bg: "rgba(249,115,22,0.06)", tag: "var(--color-accent-100)"  },
    green:  { icon: "var(--color-success)",      border: "rgba(16,185,129,0.18)",  bg: "rgba(16,185,129,0.06)", tag: "var(--color-success-light)"},
};

export default function WhyChooseUs() {
    return (
        <>
            <section className="wcu-section" aria-labelledby="why-choose-heading">

                {/* Bg elements */}
                <div className="wcu-glow-tl"  aria-hidden="true" />
                <div className="wcu-glow-br"  aria-hidden="true" />
                <div className="wcu-h-rule"   aria-hidden="true" />

                <div className="wcu-wrap">

                    {/* ── Top header — full width centered ── */}
                    <div className="wcu-header">
                        <div className="wcu-badge">
                            <span className="wcu-badge-dot" aria-hidden="true" />
                            Why Choose Us
                        </div>
                        <h2 id="why-choose-heading" className="wcu-title">
                            Why Students Choose{" "}
                            <span className="wcu-title-em">Shivshakti Academy</span>
                        </h2>
                        <p className="wcu-subtitle">
                            Practical training, recognised certifications and career-focused
                            learning — built to help students thrive in the digital world.
                        </p>
                    </div>

                    {/* ── Main body — two columns ── */}
                    <div className="wcu-body">

                        {/* Left — feature cards (unconventional: numbered list style) */}
                        <div className="wcu-left">
                            {points.map((pt, i) => {
                                const Icon = pt.icon;
                                const a = accentStyles[pt.accent];
                                return (
                                    <div key={i} className="wcu-feat">
                                        {/* Index number */}
                                        <div className="wcu-feat-num">
                                            {String(i + 1).padStart(2, "0")}
                                        </div>

                                        {/* Icon */}
                                        <div
                                            className="wcu-feat-icon"
                                            style={{
                                                background: a.bg,
                                                border: `1px solid ${a.border}`,
                                                color: a.icon,
                                            }}
                                        >
                                            <Icon size={22} strokeWidth={1.6} />
                                        </div>

                                        {/* Text */}
                                        <div className="wcu-feat-body">
                                            <h3 className="wcu-feat-title">{pt.title}</h3>
                                            <p className="wcu-feat-desc">{pt.desc}</p>
                                        </div>

                                        {/* Connector line (not on last) */}
                                        {i < points.length - 1 && (
                                            <div className="wcu-feat-connector" aria-hidden="true" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right — sticky info panel */}
                        <div className="wcu-right">
                            <div className="wcu-panel">

                                {/* Panel top gradient bar */}
                                <div className="wcu-panel-bar" aria-hidden="true" />

                                <p className="wcu-panel-lead">
                                    Our training approach is built around what students
                                    actually need — practical skills, valid certificates
                                    and a clear path to employment.
                                </p>

                                {/* Highlights */}
                                <div className="wcu-highlights">
                                    {highlights.map((h, i) => (
                                        <div key={i} className="wcu-hl">
                                            <div className="wcu-hl-check">
                                                <CheckCircle size={17} strokeWidth={2.2} />
                                            </div>
                                            <div className="wcu-hl-text">
                                                <div className="wcu-hl-title">{h.title}</div>
                                                <div className="wcu-hl-desc">{h.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="wcu-panel-divider" />

                                {/* Mini stat row */}
                                <div className="wcu-mini-stats">
                                    {[
                                        { val: "10+", lbl: "Years Experience" },
                                        { val: "25+", lbl: "Courses Offered"  },
                                        { val: "1K+", lbl: "Students Trained" },
                                    ].map((s, i) => (
                                        <div key={i} className="wcu-mini-stat">
                                            <div className="wcu-mini-val">{s.val}</div>
                                            <div className="wcu-mini-lbl">{s.lbl}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="wcu-panel-divider" />

                                {/* CTA */}
                                <a href="/courses" className="wcu-panel-cta">
                                    Explore All Courses
                                    <ArrowRight size={16} strokeWidth={2} className="wcu-cta-arrow" />
                                </a>

                                {/* Location note */}
                                <p className="wcu-panel-note">
                                    📍 Ambikapur, Surguja, Chhattisgarh
                                </p>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <style>{`

                /* ── Section ── */
                .wcu-section {
                    position: relative;
                    padding: var(--space-24) var(--space-6);
                    background: var(--color-white);
                    overflow: hidden;
                }

                .wcu-glow-tl {
                    position: absolute;
                    top: -120px; left: -80px;
                    width: 420px; height: 420px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%);
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                .wcu-glow-br {
                    position: absolute;
                    bottom: -100px; right: -60px;
                    width: 360px; height: 360px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%);
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                /* top subtle rule */
                .wcu-h-rule {
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
                .wcu-wrap {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .wcu-header {
                    text-align: center;
                    max-width: 640px;
                    margin: 0 auto var(--space-16);
                }

                .wcu-badge {
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

                .wcu-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--color-primary-600);
                    border-radius: var(--radius-full);
                    animation: wcu-pulse 2s ease-in-out infinite;
                }

                .wcu-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.9rem, 4vw, 2.8rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: var(--space-4);
                }

                .wcu-title-em {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .wcu-subtitle {
                    font-size: var(--font-size-base);
                    line-height: 1.75;
                    color: var(--text-secondary);
                    margin: 0;
                }

                /* ── Body grid ── */
                .wcu-body {
                    display: grid;
                    grid-template-columns: 1fr 360px;
                    gap: var(--space-16);
                    align-items: start;
                }

                /* ── Left — feature list ── */
                .wcu-left {
                    display: flex;
                    flex-direction: column;
                }

                /* Single feature row */
                .wcu-feat {
                    position: relative;
                    display: grid;
                    grid-template-columns: 36px 48px 1fr;
                    gap: var(--space-4);
                    align-items: start;
                    padding: var(--space-5) var(--space-4);
                    border-radius: var(--radius-xl);
                    transition:
                        background-color var(--transition-base),
                        box-shadow var(--transition-base);
                }

                .wcu-feat:hover {
                    background: var(--color-gray-50);
                    box-shadow: var(--shadow-sm);
                }

                /* Number */
                .wcu-feat-num {
                    font-family: var(--font-display);
                    font-size: 0.7rem;
                    font-weight: var(--font-weight-bold);
                    color: var(--color-gray-300);
                    letter-spacing: 0.04em;
                    padding-top: 14px;
                    text-align: right;
                    user-select: none;
                    transition: color var(--transition-fast);
                }

                .wcu-feat:hover .wcu-feat-num {
                    color: var(--color-primary-400);
                }

                /* Icon box */
                .wcu-feat-icon {
                    width: 48px; height: 48px;
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base);
                }

                .wcu-feat:hover .wcu-feat-icon {
                    transform: scale(1.08);
                    box-shadow: var(--shadow-md);
                }

                /* Text */
                .wcu-feat-body {
                    padding-top: var(--space-2);
                }

                .wcu-feat-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-1);
                    letter-spacing: var(--letter-spacing-tight);
                }

                .wcu-feat-desc {
                    font-size: var(--font-size-sm);
                    line-height: 1.7;
                    color: var(--text-secondary);
                    margin: 0;
                }

                /* Connector line between rows */
                .wcu-feat-connector {
                    position: absolute;
                    left: 53px;          /* aligns under icon center */
                    bottom: -1px;
                    width: 1px;
                    height: calc(var(--space-5) + 2px);
                    background: linear-gradient(
                        to bottom,
                        var(--color-gray-200),
                        transparent
                    );
                }

                /* ── Right — sticky panel ── */
                .wcu-right {
                    position: sticky;
                    top: 100px;
                }

                .wcu-panel {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-3xl);
                    padding: var(--space-8);
                    box-shadow: var(--shadow-lg);
                    overflow: hidden;
                }

                /* gradient top bar */
                .wcu-panel-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(
                        to right,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                }

                .wcu-panel-lead {
                    font-size: var(--font-size-sm);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin-bottom: var(--space-6);
                    padding-top: var(--space-2);
                }

                /* Highlights */
                .wcu-highlights {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .wcu-hl {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-3);
                }

                .wcu-hl-check {
                    width: 32px; height: 32px;
                    border-radius: var(--radius-lg);
                    background: rgba(37,99,235,0.08);
                    border: 1px solid rgba(37,99,235,0.18);
                    color: var(--color-primary-600);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 1px;
                }

                .wcu-hl-title {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: 2px;
                }

                .wcu-hl-desc {
                    font-size: var(--font-size-xs);
                    line-height: 1.65;
                    color: var(--text-tertiary);
                }

                /* Divider */
                .wcu-panel-divider {
                    height: 1px;
                    background: var(--color-gray-100);
                    margin: var(--space-6) 0;
                }

                /* Mini stats */
                .wcu-mini-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-2);
                }

                .wcu-mini-stat {
                    text-align: center;
                    padding: var(--space-3) var(--space-2);
                    border-radius: var(--radius-lg);
                    background: var(--color-gray-50);
                    border: 1px solid var(--color-gray-100);
                }

                .wcu-mini-val {
                    font-family: var(--font-display);
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary-600);
                    line-height: 1;
                    margin-bottom: 4px;
                }

                .wcu-mini-lbl {
                    font-size: 0.65rem;
                    color: var(--text-tertiary);
                    font-weight: var(--font-weight-medium);
                    letter-spacing: 0.02em;
                    line-height: 1.3;
                }

                /* CTA button */
                .wcu-panel-cta {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2);
                    width: 100%;
                    padding: var(--space-3) var(--space-6);
                    background: var(--color-primary-600);
                    color: var(--color-white);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                    text-decoration: none;
                    transition:
                        background-color var(--transition-fast),
                        transform var(--transition-fast),
                        box-shadow var(--transition-fast);
                }

                .wcu-panel-cta:hover {
                    background: var(--color-primary-700);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(37,99,235,0.28);
                    color: var(--color-white);
                }

                .wcu-cta-arrow {
                    transition: transform var(--transition-fast);
                }

                .wcu-panel-cta:hover .wcu-cta-arrow {
                    transform: translateX(4px);
                }

                .wcu-panel-note {
                    text-align: center;
                    margin-top: var(--space-4);
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                    margin-bottom: 0;
                }

                /* ── Keyframes ── */
                @keyframes wcu-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(1.3); }
                }

                /* ── Responsive ── */
                @media (max-width: 1024px) {
                    .wcu-body {
                        grid-template-columns: 1fr 320px;
                        gap: var(--space-10);
                    }
                }

                @media (max-width: 768px) {
                    .wcu-section {
                        padding: var(--space-16) var(--space-4);
                    }

                    .wcu-body {
                        grid-template-columns: 1fr;
                        gap: var(--space-10);
                    }

                    /* Panel goes first on mobile */
                    .wcu-right {
                        position: static;
                        order: -1;
                    }

                    .wcu-feat {
                        grid-template-columns: 28px 44px 1fr;
                        gap: var(--space-3);
                        padding: var(--space-4) var(--space-3);
                    }

                    .wcu-feat-connector {
                        left: 46px;
                    }

                    .wcu-mini-stats {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .wcu-feat-num {
                        display: none;
                    }

                    .wcu-feat {
                        grid-template-columns: 44px 1fr;
                    }

                    .wcu-feat-connector {
                        left: 30px;
                    }

                    .wcu-mini-stats {
                        grid-template-columns: repeat(3, 1fr);
                        gap: var(--space-2);
                    }

                    .wcu-mini-val {
                        font-size: var(--font-size-lg);
                    }
                }
            `}</style>
        </>
    );
}