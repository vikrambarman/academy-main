"use client";

import { useState } from "react";

const faqs = [
    { question: "What is the duration of computer courses?", answer: "Course duration depends on the program. Diploma courses usually range from 6 months to 1 year, while short-term certifications may be 2–3 months." },
    { question: "Are certificates government recognized?", answer: "Yes, selected courses are aligned with Skill India, GSDM and DigiLocker for digital verification. Certificates are verifiable online through official portals." },
    { question: "Is practical training provided?", answer: "Yes, we focus on 100% practical computer training with hands-on system access for every student during every class session." },
    { question: "How can I verify my certificate?", answer: "Certificates can be verified online through DigiLocker or the relevant certification authority's portal using your enrollment number." },
    { question: "What are the eligibility criteria?", answer: "Eligibility varies by course. Foundation courses are open to anyone from Class 8 onwards. Diploma programs generally require 10th or 12th pass qualification." },
    { question: "Do you offer admission guidance?", answer: "Yes, our team provides free admission guidance and career counselling. Visit our centre or call us during working hours for assistance." },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <>
            <section className="faq-section" aria-labelledby="faq-heading">

                <div className="faq-bg-dots"    aria-hidden="true" />
                <div className="faq-glow-tr"    aria-hidden="true" />
                <div className="faq-glow-bl"    aria-hidden="true" />
                <div className="faq-watermark"  aria-hidden="true">FAQ</div>

                <div className="faq-inner">

                    {/* ── Header ── */}
                    <div className="faq-header">
                        <div className="faq-badge">
                            <span className="faq-badge-dot" aria-hidden="true" />
                            Common Questions
                        </div>

                        <h2 id="faq-heading" className="faq-title">
                            Frequently Asked{" "}
                            <span className="faq-title-highlight">Questions</span>
                        </h2>

                        <p className="faq-subtitle">
                            Everything you need to know about admissions,
                            certifications and our training programs.
                        </p>
                    </div>

                    {/* ── Accordion ── */}
                    <div className="faq-list" role="list">
                        {faqs.map((faq, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div
                                    key={i}
                                    className={`faq-item${isOpen ? " faq-item--open" : ""}`}
                                    role="listitem"
                                >
                                    <button
                                        className="faq-btn"
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className="faq-question">{faq.question}</span>
                                        <span
                                            className={`faq-icon${isOpen ? " faq-icon--open" : ""}`}
                                            aria-hidden="true"
                                        >+</span>
                                    </button>

                                    <div className="faq-answer" aria-hidden={!isOpen}>
                                        <div className="faq-answer-inner">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Bottom note ── */}
                    <p className="faq-footer-note">
                        Still have questions?{" "}
                        <a href="/enquiry" className="faq-footer-link">
                            Contact us directly →
                        </a>
                    </p>

                </div>
            </section>

            <style>{`

                /* ── Section ── */
                .faq-section {
                    position: relative;
                    overflow: hidden;
                    padding: var(--space-24) var(--space-6);
                    background: linear-gradient(
                        180deg,
                        var(--color-gray-50) 0%,
                        var(--color-white) 100%
                    );
                }

                @media (min-width: 768px) {
                    .faq-section {
                        padding-top: var(--space-24);
                        padding-bottom: var(--space-24);
                    }
                }

                /* ── Dot bg ── */
                .faq-bg-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(
                        circle,
                        rgba(37, 99, 235, 0.04) 1px,
                        transparent 1px
                    );
                    background-size: 28px 28px;
                    pointer-events: none;
                    z-index: 0;
                }

                /* ── Glows ── */
                .faq-glow-tr {
                    position: absolute;
                    top: -100px;
                    right: -80px;
                    width: 400px;
                    height: 400px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(59, 130, 246, 0.08) 0%,
                        transparent 65%
                    );
                    filter: blur(40px);
                    pointer-events: none;
                    z-index: 0;
                }

                .faq-glow-bl {
                    position: absolute;
                    bottom: -80px;
                    left: -60px;
                    width: 340px;
                    height: 340px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(249, 115, 22, 0.06) 0%,
                        transparent 65%
                    );
                    filter: blur(40px);
                    pointer-events: none;
                    z-index: 0;
                }

                /* ── Watermark ── */
                .faq-watermark {
                    position: absolute;
                    bottom: -20px;
                    right: -10px;
                    font-family: Georgia, serif;
                    font-size: clamp(80px, 14vw, 160px);
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(37, 99, 235, 0.05);
                    pointer-events: none;
                    user-select: none;
                    line-height: 1;
                    z-index: 0;
                }

                /* ── Inner ── */
                .faq-inner {
                    position: relative;
                    z-index: 10;
                    max-width: 780px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .faq-header {
                    text-align: center;
                    margin-bottom: var(--space-12);
                }

                .faq-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-4);
                    background: rgba(37, 99, 235, 0.08);
                    border: 1px solid rgba(37, 99, 235, 0.18);
                    border-radius: var(--radius-full);
                    font-size: 0.68rem;
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-primary-700);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: var(--space-4);
                }

                .faq-badge-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--color-primary-600);
                    border-radius: var(--radius-full);
                    animation: faq-pulse 2s ease-in-out infinite;
                }

                .faq-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.9rem, 4vw, 2.75rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: 0;
                }

                .faq-title-highlight {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .faq-subtitle {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-normal);
                    line-height: 1.7;
                    color: var(--text-secondary);
                    margin-top: var(--space-3);
                    margin-bottom: 0;
                    max-width: 520px;
                    margin-left: auto;
                    margin-right: auto;
                }

                /* ── List container ── */
                .faq-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                    margin-bottom: var(--space-10);
                }

                /* ── Single item ── */
                .faq-item {
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    transition:
                        border-color var(--transition-base),
                        box-shadow var(--transition-base);
                }

                .faq-item:hover {
                    border-color: var(--color-primary-200);
                    box-shadow: var(--shadow-sm);
                }

                .faq-item--open {
                    border-color: var(--color-primary-200);
                    box-shadow: var(--shadow-md);
                }

                /* ── Button ── */
                .faq-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-4);
                    padding: var(--space-5) var(--space-6);
                    text-align: left;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: background-color var(--transition-fast);
                }

                .faq-btn:hover {
                    background-color: var(--color-gray-50);
                }

                .faq-item--open .faq-btn {
                    background-color: var(--color-primary-50);
                }

                .faq-question {
                    flex: 1;
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-medium);
                    line-height: 1.45;
                    color: var(--text-primary);
                }

                /* ── Icon ── */
                .faq-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: var(--radius-full);
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.15rem;
                    line-height: 1;
                    border: 1.5px solid var(--color-gray-300);
                    background-color: var(--color-white);
                    color: var(--color-primary-600);
                    transition:
                        background-color var(--transition-fast),
                        border-color var(--transition-fast),
                        color var(--transition-fast),
                        transform 0.26s var(--ease-in-out);
                }

                .faq-icon--open {
                    transform: rotate(45deg);
                    background-color: var(--color-primary-600);
                    border-color: var(--color-primary-600);
                    color: var(--color-white);
                }

                /* ── Answer panel ── */
                .faq-answer {
                    overflow: hidden;
                    max-height: 0;
                    opacity: 0;
                    transition:
                        max-height 0.34s var(--ease-in-out),
                        opacity 0.28s var(--ease-in-out);
                }

                .faq-item--open .faq-answer {
                    max-height: 260px;
                    opacity: 1;
                }

                .faq-answer-inner {
                    padding: var(--space-4) var(--space-6) var(--space-5);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-normal);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    border-top: 1px solid var(--color-gray-100);
                }

                /* ── Footer note ── */
                .faq-footer-note {
                    text-align: center;
                    font-size: var(--font-size-sm);
                    color: var(--text-tertiary);
                    margin: 0;
                }

                .faq-footer-link {
                    color: var(--color-primary-600);
                    font-weight: var(--font-weight-medium);
                    text-decoration: none;
                    transition: color var(--transition-fast);
                }

                .faq-footer-link:hover {
                    color: var(--color-primary-700);
                    text-decoration: underline;
                }

                /* ── Keyframes ── */
                @keyframes faq-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(1.3); }
                }

                /* ── Responsive ── */
                @media (max-width: 480px) {
                    .faq-section {
                        padding: var(--space-16) var(--space-4);
                    }

                    .faq-list {
                        gap: var(--space-2);
                    }

                    .faq-btn {
                        padding: var(--space-4) var(--space-4);
                    }

                    .faq-answer-inner {
                        padding: var(--space-3) var(--space-4) var(--space-4);
                    }

                    .faq-question {
                        font-size: var(--font-size-sm);
                    }

                    .faq-icon {
                        width: 26px;
                        height: 26px;
                        font-size: 1rem;
                    }
                }
            `}</style>
        </>
    );
}