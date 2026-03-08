// ============================================================
// FAQSection.tsx  (Client Component)
// ============================================================
"use client";

import { useState } from "react";

const faqs = [
    {
        question: "What is the duration of computer courses?",
        answer: "Course duration depends on the program. Diploma courses usually range from 6 months to 1 year, while short-term certifications may be 2–3 months.",
    },
    {
        question: "Are certificates government recognized?",
        answer: "Yes, selected courses are aligned with Skill India, GSDM and DigiLocker for digital verification. Certificates are verifiable online through official portals.",
    },
    {
        question: "Is practical training provided?",
        answer: "Yes, we focus on 100% practical computer training with hands-on system access for every student during every class session.",
    },
    {
        question: "How can I verify my certificate?",
        answer: "Certificates can be verified online through DigiLocker or the relevant certification authority's portal using your enrollment number.",
    },
    {
        question: "What are the eligibility criteria?",
        answer: "Eligibility varies by course. Foundation courses are open to anyone from Class 8 onwards. Diploma programs generally require 10th or 12th pass qualification.",
    },
    {
        question: "Do you offer admission guidance?",
        answer: "Yes, our team provides free admission guidance and career counselling. Visit our centre or call us during working hours for assistance.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <>
            <style>{`
                .faq-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #1a1208;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                /* Ghost text */
                .faq-watermark {
                    position: absolute;
                    bottom: -40px;
                    left: -20px;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(100px, 18vw, 200px);
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(252,211,77,0.04);
                    pointer-events: none;
                    user-select: none;
                    line-height: 1;
                    z-index: 0;
                }

                .faq-glow {
                    position: absolute;
                    top: -80px;
                    right: -60px;
                    width: 380px;
                    height: 380px;
                    background: radial-gradient(circle, rgba(217,119,6,0.09) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                .faq-inner {
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .faq-header {
                    text-align: center;
                    margin-bottom: 56px;
                }

                .faq-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .faq-eyebrow::before,
                .faq-eyebrow::after {
                    content: '';
                    display: inline-block;
                    width: 20px;
                    height: 1.5px;
                    background: #fcd34d;
                }

                .faq-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                }

                .faq-title em {
                    font-style: italic;
                    color: #fcd34d;
                }

                .faq-subtitle {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    margin-top: 12px;
                    line-height: 1.7;
                }

                /* FAQ list */
                .faq-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    background: rgba(252,211,77,0.08);
                    border: 1px solid rgba(252,211,77,0.1);
                    border-radius: 18px;
                    overflow: hidden;
                }

                /* Item */
                .faq-item {
                    background: rgba(255,255,255,0.03);
                    transition: background 0.22s ease;
                }

                .faq-item[data-open="true"] {
                    background: rgba(255,255,255,0.06);
                }

                .faq-item:hover {
                    background: rgba(255,255,255,0.05);
                }

                /* Button */
                .faq-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding: 22px 28px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                }

                .faq-btn-q {
                    font-size: 0.92rem;
                    font-weight: 500;
                    color: #fef3c7;
                    line-height: 1.4;
                    flex: 1;
                }

                .faq-btn-icon {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 1px solid rgba(252,211,77,0.25);
                    background: rgba(252,211,77,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fcd34d;
                    font-size: 1.1rem;
                    flex-shrink: 0;
                    transition: background 0.2s, border-color 0.2s, transform 0.25s ease;
                    line-height: 1;
                }

                .faq-item[data-open="true"] .faq-btn-icon {
                    background: #fcd34d;
                    border-color: #fcd34d;
                    color: #1a1208;
                    transform: rotate(45deg);
                }

                /* Answer */
                .faq-answer {
                    overflow: hidden;
                    max-height: 0;
                    transition: max-height 0.32s ease, opacity 0.28s ease;
                    opacity: 0;
                }

                .faq-item[data-open="true"] .faq-answer {
                    max-height: 200px;
                    opacity: 1;
                }

                .faq-answer-inner {
                    padding: 0 28px 22px;
                    font-size: 0.83rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.6);
                    line-height: 1.8;
                    border-top: 1px solid rgba(252,211,77,0.07);
                    padding-top: 16px;
                }

                @media (max-width: 480px) {
                    .faq-root { padding: 64px 16px; }
                    .faq-btn { padding: 18px 20px; }
                    .faq-answer-inner { padding: 0 20px 18px; padding-top: 14px; }
                    .faq-btn-q { font-size: 0.86rem; }
                }
            `}</style>

            <section className="faq-root" aria-labelledby="faq-heading">
                <div className="faq-watermark" aria-hidden="true">FAQ</div>
                <div className="faq-glow" aria-hidden="true" />

                <div className="faq-inner">
                    <div className="faq-header">
                        <div className="faq-eyebrow">Got Questions</div>
                        <h2 id="faq-heading" className="faq-title">
                            Frequently Asked<br /><em>Questions</em>
                        </h2>
                        <p className="faq-subtitle">
                            Common questions about admissions, certifications and training.
                        </p>
                    </div>

                    <div className="faq-list" role="list">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="faq-item"
                                data-open={openIndex === i ? "true" : "false"}
                                role="listitem"
                            >
                                <button
                                    className="faq-btn"
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    aria-expanded={openIndex === i}
                                >
                                    <span className="faq-btn-q">{faq.question}</span>
                                    <span className="faq-btn-icon" aria-hidden="true">+</span>
                                </button>

                                <div className="faq-answer">
                                    <div className="faq-answer-inner">{faq.answer}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}