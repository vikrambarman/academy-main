"use client";

import Image from "next/image";
import { Shield, Award, FileCheck, Globe, Lock, Building2 } from "lucide-react";

const affiliations = [
    {
        title: "ISO 9001:2015 Certified",
        description: "International quality standards for education management and professional training delivery.",
        image: "/images/accreditations/iso.jpg",
        badge: "Quality",
        icon: Award,
        color: "orange",
    },
    {
        title: "Gramin Skill Development Mission",
        description: "Authorized training centre aligned with Skill India initiatives and government-recognized diploma programs.",
        image: "/images/affiliations/gsdm.jpg",
        badge: "Govt. Authorized",
        icon: Shield,
        color: "blue",
    },
    {
        title: "Drishti Computer Education",
        description: "Authorized franchise partner providing verified certification for professional courses.",
        image: "/images/affiliations/drishti.jpg",
        badge: "Franchise Partner",
        icon: Building2,
        color: "purple",
    },
    {
        title: "Skill India & NSDC",
        description: "Selected course certificates verifiable through Skill India and NSDC platforms.",
        image: "/images/affiliations/skillindia.jpg",
        badge: "Skill India",
        icon: FileCheck,
        color: "green",
    },
    {
        title: "DigiLocker Enabled",
        description: "Diploma certificates accessible digitally via DigiLocker with lifetime verification.",
        image: "/images/affiliations/digilocker.jpg",
        badge: "Digital",
        icon: Lock,
        color: "blue",
    },
    {
        title: "MSME Registered Institute",
        description: "Government-registered MSME institute ensuring authenticity and legal compliance.",
        image: "/images/accreditations/msme.jpg",
        badge: "Registered",
        icon: Globe,
        color: "green",
    },
];

const trustMarks = [
    { label: "Skill India", emoji: "🇮🇳" },
    { label: "NSDC",        emoji: "📜" },
    { label: "DigiLocker",  emoji: "🔐" },
    { label: "ISO 9001:2015", emoji: "🏅" },
    { label: "MSME Udyam",  emoji: "🏛️" },
    { label: "GSDM",        emoji: "✅" },
];

const colorMap = {
    blue:   { bar: "var(--color-primary-500)",  iconBg: "rgba(37,99,235,0.1)",   iconClr: "var(--color-primary-600)",  badgeBg: "rgba(37,99,235,0.08)",   badgeClr: "var(--color-primary-700)",  badgeBorder: "rgba(37,99,235,0.2)"   },
    orange: { bar: "var(--color-accent-500)",   iconBg: "rgba(249,115,22,0.1)",  iconClr: "var(--color-accent-600)",   badgeBg: "rgba(249,115,22,0.08)",  badgeClr: "var(--color-accent-700)",   badgeBorder: "rgba(249,115,22,0.2)"  },
    green:  { bar: "var(--color-success)",      iconBg: "rgba(16,185,129,0.1)",  iconClr: "var(--color-success)",      badgeBg: "rgba(16,185,129,0.08)",  badgeClr: "var(--color-success-dark)", badgeBorder: "rgba(16,185,129,0.2)"  },
    purple: { bar: "#7c3aed",                   iconBg: "rgba(124,58,237,0.1)",  iconClr: "#7c3aed",                   badgeBg: "rgba(124,58,237,0.08)",  badgeClr: "#6d28d9",                   badgeBorder: "rgba(124,58,237,0.2)"  },
};

export default function PartnersAndCertifications() {
    return (
        <>
            <section className="pc-section" aria-labelledby="partners-heading">

                <div className="pc-dots"   aria-hidden="true" />
                <div className="pc-glow-tr" aria-hidden="true" />
                <div className="pc-glow-bl" aria-hidden="true" />
                <div className="pc-h-line" aria-hidden="true" />

                <div className="pc-wrap">

                    {/* ── Header ── */}
                    <div className="pc-header">
                        <div className="pc-header-left">
                            <div className="pc-badge">
                                <span className="pc-badge-dot" aria-hidden="true" />
                                Recognitions & Affiliations
                            </div>
                            <h2 id="partners-heading" className="pc-title">
                                Partners &{" "}
                                <span className="pc-title-em">Certifications</span>
                            </h2>
                            <p className="pc-lead">
                                Government-recognized certifications and authorized
                                training partnerships — ensuring transparency and
                                credibility for every student we train.
                            </p>
                        </div>

                        {/* Right — compact trust pills */}
                        <div className="pc-header-right">
                            <p className="pc-header-note">Verified & aligned with</p>
                            <div className="pc-header-pills">
                                {trustMarks.map((t) => (
                                    <div key={t.label} className="pc-header-pill">
                                        <span>{t.emoji}</span>
                                        <span>{t.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Cards grid ── */}
                    <div className="pc-grid">
                        {affiliations.map((item, i) => {
                            const Icon = item.icon;
                            const c = colorMap[item.color as keyof typeof colorMap];
                            return (
                                <article key={item.title} className="pc-card">

                                    {/* Colored top bar — animates on hover */}
                                    <div
                                        className="pc-card-bar"
                                        style={{ background: c.bar }}
                                        aria-hidden="true"
                                    />

                                    {/* Card top row — logo + icon */}
                                    <div className="pc-card-top">

                                        {/* Logo */}
                                        <div className="pc-logo-box">
                                            <Image
                                                src={item.image}
                                                alt={`${item.title} logo`}
                                                fill
                                                sizes="72px"
                                                className="pc-logo-img"
                                            />
                                        </div>

                                        {/* Icon badge */}
                                        <div
                                            className="pc-card-icon"
                                            style={{
                                                background: c.iconBg,
                                                color: c.iconClr,
                                            }}
                                        >
                                            <Icon size={18} strokeWidth={1.6} />
                                        </div>
                                    </div>

                                    {/* Type badge */}
                                    <span
                                        className="pc-type-badge"
                                        style={{
                                            background: c.badgeBg,
                                            color: c.badgeClr,
                                            border: `1px solid ${c.badgeBorder}`,
                                        }}
                                    >
                                        {item.badge}
                                    </span>

                                    {/* Text */}
                                    <h3 className="pc-card-title">{item.title}</h3>
                                    <p className="pc-card-desc">{item.description}</p>

                                    {/* Bottom accent — expands on hover */}
                                    <div
                                        className="pc-card-accent"
                                        style={{ background: c.bar }}
                                        aria-hidden="true"
                                    />
                                </article>
                            );
                        })}
                    </div>

                    {/* ── Trust strip ── */}
                    <div className="pc-trust-strip">
                        <span className="pc-strip-label">Verified by</span>
                        <div className="pc-strip-divider" aria-hidden="true" />
                        <div className="pc-strip-items">
                            {trustMarks.map((t, i) => (
                                <div key={t.label} className="pc-strip-item">
                                    <span className="pc-strip-dot" aria-hidden="true" />
                                    <span className="pc-strip-emoji">{t.emoji}</span>
                                    <span className="pc-strip-text">{t.label}</span>
                                    {i < trustMarks.length - 1 && (
                                        <div className="pc-strip-sep" aria-hidden="true" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <style>{`

                /* ── Section ── */
                .pc-section {
                    position: relative;
                    padding: var(--space-24) var(--space-6);
                    background: linear-gradient(
                        180deg,
                        var(--color-gray-50) 0%,
                        var(--color-white) 100%
                    );
                    overflow: hidden;
                }

                .pc-dots {
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

                .pc-glow-tr {
                    position: absolute;
                    top: -100px; right: -80px;
                    width: 400px; height: 400px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.07) 0%,
                        transparent 65%
                    );
                    filter: blur(55px);
                    pointer-events: none;
                    z-index: 0;
                }

                .pc-glow-bl {
                    position: absolute;
                    bottom: -80px; left: -60px;
                    width: 340px; height: 340px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(249,115,22,0.05) 0%,
                        transparent 65%
                    );
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                .pc-h-line {
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
                .pc-wrap {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .pc-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-12);
                    align-items: end;
                    margin-bottom: var(--space-20);
                }

                .pc-header-left {
                    max-width: 500px;
                }

                /* Badge */
                .pc-badge {
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

                .pc-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--color-primary-600);
                    border-radius: var(--radius-full);
                    animation: pc-pulse 2s ease-in-out infinite;
                }

                .pc-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.9rem, 3.5vw, 2.75rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: var(--space-4);
                }

                .pc-title-em {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .pc-lead {
                    font-size: var(--font-size-base);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin: 0;
                }

                /* Right header */
                .pc-header-right {
                    padding: var(--space-6);
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    box-shadow: var(--shadow-sm);
                }

                .pc-header-note {
                    font-size: 0.68rem;
                    font-weight: var(--font-weight-semibold);
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    color: var(--text-tertiary);
                    margin-bottom: var(--space-4);
                }

                .pc-header-pills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-2);
                }

                .pc-header-pill {
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

                .pc-header-pill:hover {
                    background: var(--color-primary-50);
                    border-color: var(--color-primary-200);
                    transform: translateY(-2px);
                }

                /* ── Cards grid ── */
                .pc-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-5);
                    margin-bottom: var(--space-8);
                }

                /* ── Single card ── */
                .pc-card {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-5);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base),
                        border-color var(--transition-base);
                }

                .pc-card:hover {
                    transform: scale(1.001);
                    box-shadow: 0px 0px 20px var(--color-success-dark);
                }

                /* Top bar — hidden, reveals on hover */
                .pc-card-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.35s var(--ease-in-out);
                }

                .pc-card:hover .pc-card-bar {
                    transform: scaleX(1);
                }

                /* Card top row */
                .pc-card-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: var(--space-5);
                }

                /* Logo */
                .pc-logo-box {
                    position: relative;
                    width: 72px;
                    height: 44px;
                    flex-shrink: 0;
                }

                .pc-logo-img {
                    object-fit: contain;
                    object-position: left center;
                }

                /* Icon */
                .pc-card-icon {
                    width: 38px; height: 38px;
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: transform var(--transition-base);
                }

                .pc-card:hover .pc-card-icon {
                    transform: scale(1.1) rotate(-6deg);
                }

                /* Type badge */
                .pc-type-badge {
                    display: inline-block;
                    padding: 3px var(--space-3);
                    border-radius: var(--radius-full);
                    font-size: 0.62rem;
                    font-weight: var(--font-weight-semibold);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: var(--space-3);
                }

                /* Title */
                .pc-card-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    line-height: 1.35;
                    color: var(--text-primary);
                    letter-spacing: var(--letter-spacing-tight);
                    margin-bottom: var(--space-3);
                }

                /* Desc */
                .pc-card-desc {
                    font-size: var(--font-size-sm);
                    line-height: 1.75;
                    color: var(--text-secondary);
                    margin: 0 0 var(--space-5);
                    flex: 1;
                }

                /* Bottom accent line — expands on hover */
                .pc-card-accent {
                    height: 2px;
                    width: 24px;
                    border-radius: var(--radius-full);
                    margin-top: auto;
                    transition: width var(--transition-base);
                }

                .pc-card:hover .pc-card-accent {
                    width: 52px;
                }

                /* ── Trust strip ── */
                .pc-trust-strip {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: var(--space-4);
                    padding: var(--space-7);
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-300);
                    border-radius: var(--radius-2xl);
                }

                .pc-strip-label {
                    font-size: 0.68rem;
                    font-weight: var(--font-weight-semibold);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--text-tertiary);
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .pc-strip-divider {
                    width: 1px;
                    height: 20px;
                    background: var(--color-gray-200);
                    flex-shrink: 0;
                }

                .pc-strip-items {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: var(--space-3);
                    flex: 1;
                }

                .pc-strip-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                }

                .pc-strip-dot {
                    width: 5px; height: 5px;
                    border-radius: var(--radius-full);
                    background: var(--color-primary-400);
                    flex-shrink: 0;
                }

                .pc-strip-emoji {
                    font-size: 0.9rem;
                    line-height: 1;
                }

                .pc-strip-text {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                    color: var(--text-primary);
                    white-space: nowrap;
                }

                .pc-strip-sep {
                    width: 1px;
                    height: 14px;
                    background: var(--color-gray-200);
                    margin-left: var(--space-3);
                    flex-shrink: 0;
                }

                /* ── Keyframes ── */
                @keyframes pc-pulse {
                    0%, 100% { opacity: 1; transform: scale(1);   }
                    50%       { opacity: 0.5; transform: scale(1.3); }
                }

                /* ── Responsive ── */
                @media (max-width: 1024px) {
                    .pc-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .pc-header {
                        grid-template-columns: 1fr;
                        gap: var(--space-8);
                    }

                    .pc-header-left {
                        max-width: 100%;
                    }
                }

                @media (max-width: 768px) {
                    .pc-section {
                        padding: var(--space-16) var(--space-4);
                    }

                    .pc-trust-strip {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-3);
                        padding: var(--space-5);
                    }

                    .pc-strip-divider {
                        display: none;
                    }

                    .pc-strip-items {
                        gap: var(--space-2);
                    }
                }

                @media (max-width: 640px) {
                    .pc-grid {
                        grid-template-columns: 1fr;
                    }

                    .pc-header-pills {
                        gap: var(--space-2);
                    }
                }
            `}</style>
        </>
    );
}