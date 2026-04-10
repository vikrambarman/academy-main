"use client";

import Link from "next/link";

const checkpoints = [
    "Skill India & GSDM aligned programs",
    "DigiLocker verified certificates",
    "Web Development & Professional IT training",
    "Affordable education for all backgrounds",
];

const phones = [
    { num: "+91 74770 36832", href: "tel:+917477036832" },
    { num: "+91 90090 87883", href: "tel:+919009087883" },
];

export default function HomeCTA() {
    return (
        <>
            <section className="hcta-section" aria-labelledby="home-cta-heading">

                <div className="hcta-fade-line"  aria-hidden="true" />
                <div className="hcta-glow-tr"    aria-hidden="true" />
                <div className="hcta-glow-bl"    aria-hidden="true" />

                <div className="hcta-wrapper">
                    <div className="hcta-card">

                        {/* ── Left ── */}
                        <div className="hcta-left">
                            <div className="hcta-dot-grid" aria-hidden="true" />

                            <div className="hcta-eyebrow">
                                <span className="hcta-eyebrow-line" />
                                Start Today
                            </div>

                            <h2 id="home-cta-heading" className="hcta-heading">
                                Secure Your Future<br />
                                with <em className="hcta-heading-em">Digital Skills</em>
                            </h2>

                            <p className="hcta-desc">
                                Practical computer training, government-recognized certifications,
                                and career-focused programs — designed for jobs,
                                entrepreneurship and higher studies.
                            </p>

                            <ul className="hcta-checklist">
                                {checkpoints.map((pt) => (
                                    <li key={pt} className="hcta-check-item">
                                        <span className="hcta-check-icon" aria-hidden="true">✓</span>
                                        {pt}
                                    </li>
                                ))}
                            </ul>

                            <div className="hcta-btns">
                                <Link href="/courses" className="hcta-btn-primary">
                                    View Courses
                                    <span className="hcta-arrow" aria-hidden="true">→</span>
                                </Link>
                                <Link href="/enquiry" className="hcta-btn-outline">
                                    Admission Enquiry
                                </Link>
                            </div>
                        </div>

                        {/* ── Right ── */}
                        <div className="hcta-right">
                            <div className="hcta-right-bar" aria-hidden="true" />

                            <h3 className="hcta-right-heading">
                                Need Guidance?<br />Talk to Us
                            </h3>
                            <p className="hcta-right-desc">
                                Get help with course selection, eligibility criteria,
                                certification details and admission guidance.
                            </p>

                            <div className="hcta-divider" />

                            <div className="hcta-phones">
                                {phones.map((p) => (
                                    <a key={p.href} href={p.href} className="hcta-phone">
                                        <span className="hcta-phone-icon" aria-hidden="true">📞</span>
                                        <span className="hcta-phone-num">{p.num}</span>
                                    </a>
                                ))}
                            </div>

                            <p className="hcta-note">
                                <span aria-hidden="true">📍</span>
                                Ambikapur, Chhattisgarh · Mon–Sat, 8 AM – 6 PM
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <style>{`

                /* ── Section ── */
                .hcta-section {
                    position: relative;
                    overflow: hidden;
                    padding: var(--space-20) var(--space-6);
                    background-color: var(--color-gray-50);
                }

                @media (min-width: 768px) {
                    .hcta-section {
                        padding-top: var(--space-24);
                        padding-bottom: var(--space-24);
                    }
                }

                /* top rule */
                .hcta-fade-line {
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent,
                        var(--color-gray-200),
                        transparent
                    );
                    pointer-events: none;
                }

                /* Glows — very subtle on light bg */
                .hcta-glow-tr {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 360px; height: 360px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37, 99, 235, 0.07) 0%,
                        transparent 70%
                    );
                    pointer-events: none;
                    z-index: 0;
                }

                .hcta-glow-bl {
                    position: absolute;
                    bottom: -80px; left: -60px;
                    width: 300px; height: 300px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(249, 115, 22, 0.06) 0%,
                        transparent 70%
                    );
                    pointer-events: none;
                    z-index: 0;
                }

                /* ── Wrapper ── */
                .hcta-wrapper {
                    position: relative;
                    z-index: 10;
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ── Card ── */
                .hcta-card {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    border-radius: var(--radius-3xl);
                    overflow: hidden;
                    background-color: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    box-shadow: var(--shadow-xl);
                }

                /* ── Left Panel ── */
                .hcta-left {
                    position: relative;
                    padding: 52px 48px;
                    overflow: hidden;
                }

                .hcta-dot-grid {
                    position: absolute;
                    top: -10px; right: 0;
                    width: 160px; height: 160px;
                    background-image: radial-gradient(
                        circle,
                        rgba(37, 99, 235, 0.1) 1.5px,
                        transparent 1.5px
                    );
                    background-size: 14px 14px;
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.6;
                }

                /* Eyebrow */
                .hcta-eyebrow {
                    position: relative;
                    z-index: 1;
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    margin-bottom: var(--space-5);
                    font-size: 0.625rem;
                    font-weight: var(--font-weight-semibold);
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: var(--color-primary-600);
                }

                .hcta-eyebrow-line {
                    display: inline-block;
                    width: 20px; height: 1.5px;
                    background-color: var(--color-primary-600);
                    flex-shrink: 0;
                }

                /* Heading */
                .hcta-heading {
                    position: relative;
                    z-index: 1;
                    font-family: var(--font-display);
                    font-size: clamp(1.9rem, 2.8vw, 2.6rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.15;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: 0;
                }

                .hcta-heading-em {
                    font-style: normal;
                    color: var(--color-accent-600);
                }

                /* Desc */
                .hcta-desc {
                    position: relative;
                    z-index: 1;
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-normal);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin-top: var(--space-4);
                    margin-bottom: 0;
                    max-width: 420px;
                }

                /* Checklist */
                .hcta-checklist {
                    position: relative;
                    z-index: 1;
                    list-style: none;
                    padding: 0;
                    margin: var(--space-6) 0 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .hcta-check-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    margin-bottom: 0;
                }

                .hcta-check-icon {
                    width: 20px; height: 20px;
                    border-radius: var(--radius-full);
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.55rem;
                    background-color: var(--color-primary-50);
                    border: 1px solid var(--color-primary-200);
                    color: var(--color-primary-600);
                }

                /* Buttons */
                .hcta-btns {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-3);
                    margin-top: var(--space-8);
                }

                .hcta-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-3) var(--space-6);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                    color: var(--color-white);
                    background-color: var(--color-accent-500);
                    box-shadow: 0 4px 18px rgba(249, 115, 22, 0.3);
                    text-decoration: none;
                    transition:
                        transform var(--transition-fast),
                        box-shadow var(--transition-fast);
                }

                .hcta-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.38);
                    color: var(--color-white);
                }

                .hcta-arrow {
                    display: inline-block;
                    transition: transform var(--transition-fast);
                }

                .hcta-btn-primary:hover .hcta-arrow {
                    transform: translateX(4px);
                }

                .hcta-btn-outline {
                    display: inline-flex;
                    align-items: center;
                    padding: var(--space-3) var(--space-6);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                    color: var(--text-primary);
                    background-color: transparent;
                    border: 1.5px solid var(--color-gray-300);
                    text-decoration: none;
                    transition:
                        border-color var(--transition-fast),
                        background-color var(--transition-fast),
                        transform var(--transition-fast);
                }

                .hcta-btn-outline:hover {
                    border-color: var(--color-primary-400);
                    background-color: var(--color-primary-50);
                    color: var(--color-primary-700);
                    transform: translateY(-2px);
                }

                /* ── Right Panel ── */
                .hcta-right {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: var(--space-10) var(--space-8);
                    background-color: var(--color-gray-50);
                    border-left: 1px solid var(--color-gray-200);
                }

                /* gradient top accent */
                .hcta-right-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(
                        to right,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                }

                .hcta-right-heading {
                    font-family: var(--font-display);
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-semibold);
                    line-height: 1.3;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: 0;
                }

                .hcta-right-desc {
                    font-size: var(--font-size-xs);
                    line-height: 1.75;
                    color: var(--text-tertiary);
                    margin-top: var(--space-3);
                    margin-bottom: 0;
                }

                .hcta-divider {
                    height: 1px;
                    background-color: var(--color-gray-200);
                    margin: var(--space-6) 0;
                }

                /* Phones */
                .hcta-phones {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .hcta-phone {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-3);
                    border-radius: var(--radius-xl);
                    border: 1px solid var(--color-gray-200);
                    background-color: var(--color-white);
                    text-decoration: none;
                    transition:
                        border-color var(--transition-fast),
                        background-color var(--transition-fast),
                        transform var(--transition-fast);
                }

                .hcta-phone:hover {
                    border-color: var(--color-primary-300);
                    background-color: var(--color-primary-50);
                    transform: translateX(3px);
                }

                .hcta-phone-icon {
                    width: 32px; height: 32px;
                    border-radius: var(--radius-lg);
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    background-color: var(--color-primary-50);
                    border: 1px solid var(--color-primary-100);
                }

                .hcta-phone-num {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                }

                /* Note */
                .hcta-note {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-2);
                    margin-top: auto;
                    padding-top: var(--space-5);
                    font-size: 0.72rem;
                    line-height: 1.6;
                    color: var(--text-tertiary);
                    margin-bottom: 0;
                }

                /* ── Responsive ── */
                @media (max-width: 960px) {
                    .hcta-card {
                        grid-template-columns: 1fr;
                    }
                    .hcta-left {
                        padding: 44px 36px;
                    }
                    .hcta-right {
                        border-left: none;
                        border-top: 1px solid var(--color-gray-200);
                        padding: 36px 36px 44px;
                    }
                }

                @media (max-width: 480px) {
                    .hcta-section {
                        padding: var(--space-16) var(--space-4);
                    }
                    .hcta-card {
                        border-radius: var(--radius-2xl);
                    }
                    .hcta-left {
                        padding: 36px var(--space-5);
                    }
                    .hcta-right {
                        padding: 28px var(--space-5) 36px;
                    }
                    .hcta-btns {
                        flex-direction: column;
                    }
                    .hcta-btn-primary,
                    .hcta-btn-outline {
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    );
}