// ============================================================
// app/faq/page.tsx
// ============================================================
"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
    {
        q: "Is Shivshakti Computer Academy government recognized?",
        a: "Yes, the academy operates under recognized frameworks including MSME registration and authorized training partnerships. Selected programs align with national skill development guidelines under GSDM and Skill India.",
    },
    {
        q: "Are certificates verifiable online?",
        a: "Eligible certificates are issued through recognized authorities like Drishti Computer Education, GSDM and DigiLocker. They are digitally verifiable depending on the program and governing body.",
    },
    {
        q: "What courses are available?",
        a: "We offer DCA, ADCA, PGDCA, Tally, Basic Computer, Web Development and other professional skill development programs across Foundation, Diploma and Advanced levels.",
    },
    {
        q: "What is the admission process?",
        a: "Students can visit the academy or submit an online enquiry. After counselling, enrollment and practical training begins as per the course structure. No entrance exam is required.",
    },
    {
        q: "Where is the academy located?",
        a: "We are located at 1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras Road, Phunderdihari, Ambikapur, Dist: Surguja, Chhattisgarh — easily accessible from the main city area.",
    },
    {
        q: "What are the class timings?",
        a: "Classes run Monday to Saturday, 8:00 AM to 6:00 PM. Batch timings are flexible and can be discussed at the time of admission based on student availability.",
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .fq-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                }

                /* ── Hero ── */
                .fq-hero {
                    padding: 88px 24px 64px;
                    position: relative;
                    overflow: hidden;
                }

                .fq-hero-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 420px; height: 420px;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                .fq-hero-inner {
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .fq-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .fq-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 1.5px;
                    background: #d97706;
                }

                .fq-hero-layout {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                }

                .fq-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.15;
                }

                .fq-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .fq-hero-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    max-width: 300px;
                    padding-bottom: 4px;
                }

                /* ── Body ── */
                .fq-body {
                    padding: 0 24px 88px;
                    position: relative;
                }

                .fq-body::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .fq-body-inner {
                    max-width: 800px;
                    margin: 0 auto;
                    padding-top: 52px;
                }

                /* ── Accordion ── */
                .fq-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    background: #e8dfd0;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }

                .fq-item {
                    background: #fff;
                    position: relative;
                    overflow: hidden;
                }

                /* Left amber bar — shows when open */
                .fq-item::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, #d97706, #fcd34d);
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 0.28s ease;
                }

                .fq-item.open { background: #fffefb; }
                .fq-item.open::before { transform: scaleY(1); }

                /* Trigger */
                .fq-trigger {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding: 20px 24px 20px 28px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                }

                .fq-trigger:hover { background: #fef9ee; }
                .fq-item.open .fq-trigger { background: transparent; }

                .fq-q-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: rgba(180,83,9,0.35);
                    flex-shrink: 0;
                    min-width: 24px;
                }

                .fq-item.open .fq-q-num { color: #b45309; }

                .fq-q-text {
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: #1a1208;
                    line-height: 1.4;
                    flex: 1;
                }

                .fq-icon {
                    width: 28px; height: 28px;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: #92826b;
                    flex-shrink: 0;
                    font-weight: 300;
                    line-height: 1;
                    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.25s ease;
                }

                .fq-item.open .fq-icon {
                    background: #1a1208;
                    border-color: #1a1208;
                    color: #fcd34d;
                    transform: rotate(45deg);
                }

                /* Answer */
                .fq-answer {
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: max-height 0.32s ease, opacity 0.24s ease;
                }

                .fq-item.open .fq-answer {
                    max-height: 300px;
                    opacity: 1;
                }

                .fq-answer-inner {
                    padding: 0 24px 20px 52px;
                    font-size: 0.84rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.85;
                }

                /* ── CTA strip ── */
                .fq-cta {
                    background: #1a1208;
                    border-radius: 18px;
                    padding: 28px 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    flex-wrap: wrap;
                    position: relative;
                    overflow: hidden;
                }

                .fq-cta::before {
                    content: '';
                    position: absolute;
                    right: -10px; top: 50%;
                    transform: translateY(-50%);
                    width: 140px; height: 140px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.1) 1.5px, transparent 1.5px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                .fq-cta-left {}

                .fq-cta-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: rgba(252,211,77,0.5);
                    margin-bottom: 4px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .fq-cta-label::before {
                    content: '';
                    display: inline-block;
                    width: 12px; height: 1.5px;
                    background: rgba(252,211,77,0.4);
                }

                .fq-cta-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #fef3c7;
                }

                .fq-cta-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #1a1208;
                    background: #fcd34d;
                    padding: 11px 22px;
                    border-radius: 100px;
                    text-decoration: none;
                    white-space: nowrap;
                    position: relative;
                    z-index: 1;
                    transition: background 0.18s, transform 0.15s;
                    flex-shrink: 0;
                }

                .fq-cta-btn:hover { background: #fef3c7; transform: translateY(-1px); }

                .fq-cta-arrow { transition: transform 0.18s; }
                .fq-cta-btn:hover .fq-cta-arrow { transform: translateX(3px); }

                /* ── Responsive ── */
                @media (max-width: 640px) {
                    .fq-hero { padding: 64px 20px 52px; }
                    .fq-body { padding: 0 20px 64px; }
                    .fq-hero-layout { flex-direction: column; align-items: flex-start; gap: 12px; }
                    .fq-trigger { padding: 18px 18px 18px 22px; }
                    .fq-answer-inner { padding: 0 18px 18px 42px; }
                    .fq-cta { flex-direction: column; align-items: flex-start; }
                }
            `}</style>

            <main className="fq-root">
                <div className="fq-hero">
                    <div className="fq-hero-glow" aria-hidden="true" />
                    <div className="fq-hero-inner">
                        <div className="fq-eyebrow">Help & Information</div>
                        <div className="fq-hero-layout">
                            <h1 className="fq-title">
                                Frequently<br /><em>Asked Questions</em>
                            </h1>
                            <p className="fq-hero-desc">
                                Common questions about admissions, certifications,
                                training structure and policies.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="fq-body">
                    <div className="fq-body-inner">
                        <div className="fq-list" role="list">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className={`fq-item ${openIndex === i ? "open" : ""}`}
                                    role="listitem"
                                >
                                    <button
                                        className="fq-trigger"
                                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                        aria-expanded={openIndex === i}
                                    >
                                        <span className="fq-q-num" aria-hidden="true">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="fq-q-text">{faq.q}</span>
                                        <span className="fq-icon" aria-hidden="true">+</span>
                                    </button>
                                    <div className="fq-answer" aria-hidden={openIndex !== i}>
                                        <div className="fq-answer-inner">{faq.a}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="fq-cta" aria-label="Still have questions?">
                            <div className="fq-cta-left">
                                <div className="fq-cta-label">Need More Help</div>
                                <div className="fq-cta-text">Still have questions? Talk to our team.</div>
                            </div>
                            <Link href="/contact" className="fq-cta-btn">
                                Contact the Academy
                                <span className="fq-cta-arrow" aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}