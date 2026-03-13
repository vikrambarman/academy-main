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
            {/* Only accordion animation CSS — no color, no layout */}
            <style>{`
                .fq-answer {
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: max-height 0.32s ease, opacity 0.24s ease;
                }
                .fq-answer.open {
                    max-height: 300px;
                    opacity: 1;
                }
            `}</style>

            <main style={{ background: "var(--color-bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

                {/* ══════════════════════ HERO ══════════════════════ */}
                <section className="relative overflow-hidden px-6 pt-[88px] pb-16"
                    style={{ background: "var(--color-bg)" }}
                    aria-labelledby="faq-hero-heading">

                    {/* Glow */}
                    <div aria-hidden="true" className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 9%,transparent) 0%,transparent 65%)" }} />

                    <div className="relative z-10 max-w-[800px] mx-auto">
                        {/* Eyebrow */}
                        <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                            style={{ color: "var(--color-primary)" }}>
                            <span aria-hidden="true"
                                style={{ display: "inline-block", width: 24, height: 1.5, background: "var(--color-primary)", flexShrink: 0 }} />
                            Help & Information
                        </div>

                        <div className="flex items-end justify-between gap-10 flex-wrap">
                            <h1 id="faq-hero-heading"
                                className="font-serif font-bold leading-[1.15]"
                                style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "var(--color-text)" }}>
                                Frequently<br />
                                <em className="italic" style={{ color: "var(--color-accent)" }}>Asked Questions</em>
                            </h1>
                            <p className="text-[0.88rem] font-light leading-[1.8] max-w-[300px] pb-1"
                                style={{ color: "var(--color-text-muted)" }}>
                                Common questions about admissions, certifications,
                                training structure and policies.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ FAQ BODY ══════════════════════ */}
                <section className="relative px-6 pb-[88px]" aria-label="FAQ accordion">
                    {/* Top divider */}
                    <div aria-hidden="true" className="absolute top-0 pointer-events-none"
                        style={{ left: "10%", right: "10%", height: 1, background: "linear-gradient(to right,transparent,var(--color-border),transparent)" }} />

                    <div className="max-w-[800px] mx-auto pt-14">

                        {/* Accordion list */}
                        <div className="flex flex-col rounded-[20px] overflow-hidden mb-5"
                            style={{ gap: 1, background: "var(--color-border)", border: "1px solid var(--color-border)" }}
                            role="list">
                            {faqs.map((faq, i) => {
                                const isOpen = openIndex === i;
                                return (
                                    <div key={i}
                                        className="relative overflow-hidden transition-colors duration-200"
                                        style={{ background: isOpen ? "color-mix(in srgb,var(--color-primary) 3%,var(--color-bg-card))" : "var(--color-bg-card)" }}
                                        role="listitem">

                                        {/* Left accent bar — visible when open */}
                                        <span aria-hidden="true"
                                            className="absolute left-0 top-0 bottom-0 w-[3px] transition-transform duration-[280ms] ease-out origin-top"
                                            style={{
                                                background: "linear-gradient(to bottom,var(--color-primary),color-mix(in srgb,var(--color-primary) 50%,transparent))",
                                                transform: isOpen ? "scaleY(1)" : "scaleY(0)",
                                            }} />

                                        {/* Trigger */}
                                        <button
                                            className="w-full flex items-center justify-between gap-4 pl-7 pr-6 py-5 text-left cursor-pointer transition-colors duration-200"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                fontFamily: "'DM Sans', sans-serif",
                                            }}
                                            onClick={() => setOpenIndex(isOpen ? null : i)}
                                            aria-expanded={isOpen}
                                            onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-primary) 3%,var(--color-bg-card))"; }}
                                            onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = "none"; }}>

                                            {/* Number */}
                                            <span className="font-serif text-[0.72rem] font-bold flex-shrink-0 min-w-[24px]"
                                                style={{ color: isOpen ? "var(--color-primary)" : "color-mix(in srgb,var(--color-primary) 35%,transparent)" }}
                                                aria-hidden="true">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>

                                            {/* Question */}
                                            <span className="text-[0.88rem] font-medium leading-[1.4] flex-1"
                                                style={{ color: "var(--color-text)" }}>
                                                {faq.q}
                                            </span>

                                            {/* Toggle icon */}
                                            <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-base font-light leading-none transition-all duration-[250ms] ease-out"
                                                style={{
                                                    background:  isOpen ? "var(--color-bg-sidebar)" : "var(--color-bg)",
                                                    border:      isOpen ? "1px solid var(--color-bg-sidebar)" : "1px solid var(--color-border)",
                                                    color:       isOpen ? "var(--color-warning)" : "var(--color-text-muted)",
                                                    transform:   isOpen ? "rotate(45deg)" : "rotate(0deg)",
                                                }}
                                                aria-hidden="true">
                                                +
                                            </span>
                                        </button>

                                        {/* Answer */}
                                        <div className={`fq-answer ${isOpen ? "open" : ""}`}
                                            aria-hidden={!isOpen}>
                                            <div className="pl-[52px] pr-6 pb-5 text-[0.84rem] font-light leading-[1.85]"
                                                style={{ color: "var(--color-text-muted)" }}>
                                                {faq.a}
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA strip */}
                        <div className="relative overflow-hidden rounded-[18px] px-8 py-7 flex items-center justify-between gap-5 flex-wrap"
                            style={{ background: "var(--color-bg-sidebar)" }}
                            aria-label="Still have questions?">

                            {/* Dot pattern */}
                            <div aria-hidden="true" className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-36 h-36 pointer-events-none"
                                style={{
                                    backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 12%,transparent) 1.5px,transparent 1.5px)",
                                    backgroundSize: "12px 12px",
                                }} />

                            <div className="relative z-10">
                                <div className="flex items-center gap-1.5 text-[9px] font-medium tracking-[0.16em] uppercase mb-1"
                                    style={{ color: "color-mix(in srgb,var(--color-warning) 55%,transparent)" }}>
                                    <span aria-hidden="true"
                                        style={{ display: "inline-block", width: 12, height: 1.5, background: "color-mix(in srgb,var(--color-warning) 45%,transparent)", flexShrink: 0 }} />
                                    Need More Help
                                </div>
                                <div className="font-serif text-[0.95rem] font-semibold"
                                    style={{ color: "var(--color-text-inverse)" }}>
                                    Still have questions? Talk to our team.
                                </div>
                            </div>

                            <Link href="/contact"
                                className="relative z-10 inline-flex items-center gap-2 no-underline rounded-full px-[22px] py-[11px] text-[0.82rem] font-medium flex-shrink-0 transition-all duration-200 hover:-translate-y-px"
                                style={{
                                    background:  "var(--color-warning)",
                                    color:       "var(--color-bg-sidebar)",
                                    fontFamily:  "'DM Sans', sans-serif",
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-warning) 80%,#fff)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-warning)"}>
                                Contact the Academy
                                <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                            </Link>
                        </div>

                    </div>
                </section>

            </main>
        </>
    );
}