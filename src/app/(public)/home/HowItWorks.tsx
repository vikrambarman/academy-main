"use client";

import {
    Target,
    Laptop,
    Award,
    ArrowRight,
    Bot,
    BookOpen,
    Sparkles,
    CheckCircle,
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Choose Your Course",
        desc: "Select from diploma, certification or professional IT programs based on your career goals and background.",
        icon: Target,
        color: "blue",
    },
    {
        number: "02",
        title: "Practical Training",
        desc: "Attend hands-on training sessions with real-time computer practice, expert guidance and LMS access.",
        icon: Laptop,
        color: "orange",
    },
    {
        number: "03",
        title: "Get Certified",
        desc: "Receive government-recognized and digitally verifiable certificates through DigiLocker after completion.",
        icon: Award,
        color: "green",
    },
];

const quickBenefits = [
    "No prior experience needed",
    "Flexible batch timings",
    "Hindi & English medium",
    "Certificate in 30–180 days",
];

// ── New upcoming features ──
const upcomingFeatures = [
    {
        icon: Bot,
        tag: "Coming Soon",
        tagColor: "blue",
        title: "AI Learning Assistant",
        desc: "Get instant answers to your course doubts 24/7. Our AI assistant will guide visitors and enrolled students — anytime, anywhere.",
        points: ["Ask any course-related question", "Available to public visitors", "Deeper access for enrolled students"],
    },
    {
        icon: BookOpen,
        tag: "On Admission",
        tagColor: "green",
        title: "Lifetime LMS Access",
        desc: "Every admitted student gets lifetime access to our Learning Management System — practice modules, resources and progress tracking.",
        points: ["Activates on course admission", "Practice at your own pace", "Lifetime access, no expiry"],
    },
];

const colorMap = {
    blue:   { iconBg: "rgba(37,99,235,0.1)",   iconClr: "var(--color-primary-600)",  border: "rgba(37,99,235,0.18)",  tagBg: "rgba(37,99,235,0.08)",   tagClr: "var(--color-primary-700)" },
    orange: { iconBg: "rgba(249,115,22,0.1)",  iconClr: "var(--color-accent-600)",   border: "rgba(249,115,22,0.18)", tagBg: "rgba(249,115,22,0.08)",  tagClr: "var(--color-accent-700)"  },
    green:  { iconBg: "rgba(16,185,129,0.1)",  iconClr: "var(--color-success)",      border: "rgba(16,185,129,0.18)",tagBg: "rgba(16,185,129,0.08)",  tagClr: "var(--color-success-dark)" },
};

export default function HowItWorks() {
    return (
        <>
            <section className="hiw-section" aria-labelledby="how-it-works-heading">

                <div className="hiw-glow-tl"  aria-hidden="true" />
                <div className="hiw-glow-br"  aria-hidden="true" />
                <div className="hiw-h-line"   aria-hidden="true" />

                <div className="hiw-wrap">

                    {/* ── Header ── */}
                    <div className="hiw-header">
                        <div className="hiw-badge">
                            <span className="hiw-badge-dot" aria-hidden="true" />
                            The Process
                        </div>
                        <h2 id="how-it-works-heading" className="hiw-title">
                            How It{" "}
                            <span className="hiw-title-em">Works</span>
                        </h2>
                        <p className="hiw-subtitle">
                            A simple 3-step journey from enrollment to a
                            government-recognized certificate — with lifetime support.
                        </p>
                    </div>

                    {/* ── Steps ── */}
                    <div className="hiw-steps">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            const c = colorMap[step.color as keyof typeof colorMap];
                            return (
                                <div key={step.number} className="hiw-step">

                                    {/* Step number — large ghost */}
                                    <div className="hiw-step-ghost">{step.number}</div>

                                    {/* Icon */}
                                    <div
                                        className="hiw-step-icon"
                                        style={{
                                            background: c.iconBg,
                                            border: `1px solid ${c.border}`,
                                            color: c.iconClr,
                                        }}
                                    >
                                        <Icon size={26} strokeWidth={1.6} />
                                    </div>

                                    <h3 className="hiw-step-title">{step.title}</h3>
                                    <p className="hiw-step-desc">{step.desc}</p>

                                    {/* Progress fill */}
                                    <div className="hiw-step-progress">
                                        <div
                                            className="hiw-step-fill"
                                            style={{
                                                width: `${((i + 1) / steps.length) * 100}%`,
                                                background: c.iconClr,
                                            }}
                                        />
                                    </div>

                                    {/* Arrow — between cards, desktop only */}
                                    {i < steps.length - 1 && (
                                        <div className="hiw-step-arrow" aria-hidden="true">
                                            <ArrowRight size={20} strokeWidth={2} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Quick benefits strip ── */}
                    <div className="hiw-benefits">
                        {quickBenefits.map((b, i) => (
                            <div key={i} className="hiw-benefit">
                                <CheckCircle
                                    size={15}
                                    strokeWidth={2.2}
                                    className="hiw-benefit-icon"
                                />
                                <span>{b}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── Upcoming Features ── */}
                    <div className="hiw-upcoming-header">
                        <div className="hiw-upcoming-eyebrow">
                            <Sparkles size={14} strokeWidth={2} />
                            What's Coming for Our Students
                        </div>
                    </div>

                    <div className="hiw-upcoming-grid">
                        {upcomingFeatures.map((feat, i) => {
                            const Icon = feat.icon;
                            const tc = colorMap[feat.tagColor as keyof typeof colorMap];
                            return (
                                <div key={i} className="hiw-uf-card">
                                    <div className="hiw-uf-top">
                                        <div
                                            className="hiw-uf-icon"
                                            style={{
                                                background: tc.iconBg,
                                                border: `1px solid ${tc.border}`,
                                                color: tc.iconClr,
                                            }}
                                        >
                                            <Icon size={24} strokeWidth={1.6} />
                                        </div>
                                        <span
                                            className="hiw-uf-tag"
                                            style={{
                                                background: tc.tagBg,
                                                color: tc.tagClr,
                                                border: `1px solid ${tc.border}`,
                                            }}
                                        >
                                            {feat.tag}
                                        </span>
                                    </div>

                                    <h3 className="hiw-uf-title">{feat.title}</h3>
                                    <p className="hiw-uf-desc">{feat.desc}</p>

                                    <ul className="hiw-uf-points">
                                        {feat.points.map((pt, pi) => (
                                            <li key={pi} className="hiw-uf-point">
                                                <span className="hiw-uf-dot" />
                                                {pt}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Bottom accent line */}
                                    <div
                                        className="hiw-uf-bar"
                                        style={{ background: tc.iconClr }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>

            <style>{`

                /* ── Section ── */
                .hiw-section {
                    position: relative;
                    padding: var(--space-24) var(--space-6);
                    background: linear-gradient(
                        180deg,
                        var(--color-white) 0%,
                        var(--color-primary-200) 100%
                    );
                    overflow: hidden;
                }

                .hiw-glow-tl {
                    position: absolute;
                    top: -120px; left: -80px;
                    width: 420px; height: 420px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%);
                    filter: blur(55px);
                    pointer-events: none;
                    z-index: 0;
                }

                .hiw-glow-br {
                    position: absolute;
                    bottom: -100px; right: -60px;
                    width: 360px; height: 360px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%);
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                .hiw-h-line {
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
                .hiw-wrap {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .hiw-header {
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto var(--space-16);
                }

                .hiw-badge {
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

                .hiw-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--color-primary-600);
                    border-radius: var(--radius-full);
                    animation: hiw-pulse 2s ease-in-out infinite;
                }

                .hiw-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.9rem, 4vw, 2.8rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: var(--space-4);
                }

                .hiw-title-em {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hiw-subtitle {
                    font-size: var(--font-size-base);
                    line-height: 1.75;
                    color: var(--text-secondary);
                    margin: 0;
                }

                /* ── Steps ── */
                .hiw-steps {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-6);
                    margin-bottom: var(--space-8);
                }

                /* Step card */
                .hiw-step {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-primary-800);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-8) var(--space-6);
                    overflow: hidden;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base),
                        border-color var(--transition-base);
                }

                .hiw-step:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--color-primary-200);
                }

                /* Ghost number */
                .hiw-step-ghost {
                    position: absolute;
                    top: -8px; right: var(--space-4);
                    font-family: var(--font-display);
                    font-size: 5rem;
                    font-weight: var(--font-weight-bold);
                    line-height: 1;
                    color: var(--color-gray-100);
                    user-select: none;
                    pointer-events: none;
                    letter-spacing: var(--letter-spacing-tight);
                    transition: color var(--transition-base);
                }

                .hiw-step:hover .hiw-step-ghost {
                    color: rgba(37,99,235,0.07);
                }

                /* Icon */
                .hiw-step-icon {
                    width: 54px; height: 54px;
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--space-5);
                    transition: transform var(--transition-base);
                }

                .hiw-step:hover .hiw-step-icon {
                    transform: scale(1.08) rotate(-4deg);
                }

                .hiw-step-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-3);
                    letter-spacing: var(--letter-spacing-tight);
                }

                .hiw-step-desc {
                    font-size: var(--font-size-sm);
                    line-height: 1.75;
                    color: var(--text-secondary);
                    margin: 0 0 var(--space-6);
                }

                /* Progress bar inside card */
                .hiw-step-progress {
                    height: 3px;
                    background: var(--color-gray-100);
                    border-radius: var(--radius-full);
                    overflow: hidden;
                }

                .hiw-step-fill {
                    height: 100%;
                    border-radius: var(--radius-full);
                    opacity: 0.7;
                }

                /* Arrow between steps */
                .hiw-step-arrow {
                    position: absolute;
                    top: 50%;
                    right: -22px;
                    transform: translateY(-50%);
                    z-index: 5;
                    width: 36px; height: 36px;
                    border-radius: var(--radius-full);
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-primary-400);
                    box-shadow: var(--shadow-sm);
                    animation: hiw-arrow 2s ease-in-out infinite;
                }

                @keyframes hiw-arrow {
                    0%, 100% { transform: translateY(-50%) translateX(0); opacity: 0.6; }
                    50%       { transform: translateY(-50%) translateX(4px); opacity: 1; }
                }

                /* ── Benefits strip ── */
                .hiw-benefits {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-6);
                    padding: var(--space-6) var(--space-8);
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    margin-bottom: var(--space-16);
                    box-shadow: var(--shadow-xs);
                }

                .hiw-benefit {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                    color: var(--text-secondary);
                }

                .hiw-benefit-icon {
                    color: var(--color-success);
                    flex-shrink: 0;
                }

                /* ── Upcoming features ── */
                .hiw-upcoming-header {
                    text-align: center;
                    margin-bottom: var(--space-8);
                }

                .hiw-upcoming-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-5);
                    background: linear-gradient(
                        135deg,
                        rgba(37,99,235,0.08),
                        rgba(249,115,22,0.06)
                    );
                    border: 1px solid rgba(37,99,235,0.15);
                    border-radius: var(--radius-full);
                    font-size: 0.72rem;
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-primary-700);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }

                /* Upcoming grid — 2 col */
                .hiw-upcoming-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--space-6);
                }

                /* Upcoming feature card */
                .hiw-uf-card {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-8);
                    overflow: hidden;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base),
                        border-color var(--transition-base);
                }

                .hiw-uf-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--color-primary-200);
                }

                .hiw-uf-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: var(--space-5);
                }

                .hiw-uf-icon {
                    width: 52px; height: 52px;
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform var(--transition-base);
                }

                .hiw-uf-card:hover .hiw-uf-icon {
                    transform: scale(1.1) rotate(-5deg);
                }

                .hiw-uf-tag {
                    display: inline-block;
                    padding: var(--space-1) var(--space-3);
                    border-radius: var(--radius-full);
                    font-size: 0.65rem;
                    font-weight: var(--font-weight-semibold);
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                }

                .hiw-uf-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    letter-spacing: var(--letter-spacing-tight);
                    margin-bottom: var(--space-3);
                }

                .hiw-uf-desc {
                    font-size: var(--font-size-sm);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin: 0 0 var(--space-5);
                }

                /* Points list */
                .hiw-uf-points {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 var(--space-6);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .hiw-uf-point {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    margin-bottom: 0;
                }

                .hiw-uf-dot {
                    width: 6px; height: 6px;
                    border-radius: var(--radius-full);
                    background: var(--color-primary-400);
                    flex-shrink: 0;
                    opacity: 0.7;
                }

                /* Bottom accent line */
                .hiw-uf-bar {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 3px;
                    opacity: 0;
                    transition: opacity var(--transition-base);
                }

                .hiw-uf-card:hover .hiw-uf-bar {
                    opacity: 1;
                }

                /* ── Keyframes ── */
                @keyframes hiw-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(1.3); }
                }

                /* ── Responsive ── */
                @media (max-width: 1024px) {
                    .hiw-steps {
                        grid-template-columns: 1fr;
                        max-width: 560px;
                        margin-left: auto;
                        margin-right: auto;
                        margin-bottom: var(--space-8);
                    }

                    /* Hide arrows on mobile */
                    .hiw-step-arrow {
                        display: none;
                    }

                    .hiw-step-ghost {
                        font-size: 4rem;
                    }
                }

                @media (max-width: 768px) {
                    .hiw-section {
                        padding: var(--space-16) var(--space-4);
                    }

                    .hiw-upcoming-grid {
                        grid-template-columns: 1fr;
                    }

                    .hiw-benefits {
                        gap: var(--space-4);
                        padding: var(--space-5) var(--space-5);
                    }
                }

                @media (max-width: 480px) {
                    .hiw-benefit {
                        font-size: var(--font-size-xs);
                    }

                    .hiw-uf-card {
                        padding: var(--space-6);
                    }

                    .hiw-uf-top {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-3);
                    }
                }
            `}</style>
        </>
    );
}