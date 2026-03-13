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
            <style>{`
                /* Ghost watermark */
                .faq-watermark {
                    position: absolute;
                    bottom: -40px; left: -20px;
                    font-family: Georgia, serif;
                    font-size: clamp(100px, 18vw, 200px);
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(96,165,250,0.05);
                    pointer-events: none;
                    user-select: none;
                    line-height: 1;
                    z-index: 0;
                }

                /* Accordion answer slide */
                .faq-answer {
                    overflow: hidden;
                    max-height: 0;
                    opacity: 0;
                    transition: max-height 0.32s ease, opacity 0.28s ease;
                }
                .faq-item[data-open="true"] .faq-answer {
                    max-height: 200px;
                    opacity: 1;
                }

                /* Icon rotate */
                .faq-icon {
                    transition: background 0.2s, border-color 0.2s, transform 0.25s ease, color 0.2s;
                }
                .faq-item[data-open="true"] .faq-icon {
                    transform: rotate(45deg);
                }

                @media (max-width: 480px) {
                    .faq-root { padding: 64px 16px !important; }
                    .faq-btn  { padding: 18px 20px !important; }
                    .faq-answer-inner { padding: 0 20px 18px !important; padding-top: 14px !important; }
                    .faq-btn-q { font-size: 0.86rem !important; }
                }
            `}</style>

            <section
                className="faq-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background: "var(--color-bg-sidebar)" }}
                aria-labelledby="faq-heading"
            >
                {/* Ghost watermark */}
                <div className="faq-watermark" aria-hidden="true">FAQ</div>

                {/* Blue glow top-right */}
                <div aria-hidden="true" className="absolute -top-20 -right-16 w-[380px] h-[380px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)" }} />
                {/* Accent glow bottom-left */}
                <div aria-hidden="true" className="absolute -bottom-20 -left-10 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle, rgba(239,69,35,0.06) 0%, transparent 65%)" }} />

                <div className="relative z-10 max-w-[800px] mx-auto">

                    {/* Header — centered */}
                    <div className="text-center mb-14">
                        {/* Eyebrow with lines on both sides */}
                        <div className="inline-flex items-center gap-2 mb-4 text-[10px] font-medium tracking-[0.18em] uppercase"
                            style={{ color: "var(--color-info)" }}>
                            <span style={{ display: "inline-block", width: 20, height: 1.5, background: "var(--color-info)" }} />
                            Got Questions
                            <span style={{ display: "inline-block", width: 20, height: 1.5, background: "var(--color-info)" }} />
                        </div>
                        <h2
                            id="faq-heading"
                            className="font-serif font-bold leading-[1.2]"
                            style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--color-text-inverse)" }}
                        >
                            Frequently Asked<br />
                            <em className="not-italic" style={{ color: "var(--color-accent)" }}>Questions</em>
                        </h2>
                        <p className="text-[0.88rem] font-light leading-[1.7] mt-3"
                            style={{ color: "rgba(255,255,255,0.4)" }}>
                            Common questions about admissions, certifications and training.
                        </p>
                    </div>

                    {/* FAQ list */}
                    <div className="flex flex-col gap-px rounded-[18px] overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                        role="list">
                        {faqs.map((faq, i) => (
                            <div key={i}
                                className="faq-item transition-colors duration-200"
                                data-open={openIndex === i ? "true" : "false"}
                                role="listitem"
                                style={{ background: openIndex === i ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)" }}
                            >
                                <button
                                    className="faq-btn w-full flex items-center justify-between gap-4 px-7 py-[22px] text-left bg-transparent border-0 cursor-pointer"
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    aria-expanded={openIndex === i}
                                >
                                    <span className="faq-btn-q text-[0.92rem] font-medium leading-[1.4] flex-1"
                                        style={{ color: "var(--color-text-inverse)" }}>
                                        {faq.question}
                                    </span>
                                    {/* +/× icon */}
                                    <span className="faq-icon w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[1.1rem] leading-none"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.18)",
                                            background: openIndex === i ? "var(--color-primary)" : "rgba(255,255,255,0.06)",
                                            color: openIndex === i ? "#fff" : "var(--color-info)",
                                        }}
                                        aria-hidden="true">+</span>
                                </button>

                                <div className="faq-answer">
                                    <div className="faq-answer-inner px-7 pb-[22px] pt-4 text-[0.83rem] font-light leading-[1.8]"
                                        style={{ color: "rgba(255,255,255,0.55)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}