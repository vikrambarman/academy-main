// ============================================================
// app/faq/page.tsx
// ============================================================
"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Data ───────────────────────────────────────────────────────── */

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

/* ─── Icons ─────────────────────────────────────────────────────── */

const ArrowRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

/* ─── Page ───────────────────────────────────────────────────────── */

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <>
            <main className="fq-root">

                {/* ════════════ HERO ════════════ */}
                <section
                    className="fq-hero home-section"
                    aria-labelledby="faq-hero-heading"
                >
                    <div className="fq-hero__glow fq-hero__glow--1" aria-hidden="true" />
                    <div className="fq-hero__glow fq-hero__glow--2" aria-hidden="true" />

                    <div className="container fq-hero__inner">
                        {/* Eyebrow */}
                        <div className="fq-hero__eyebrow">
                            <span className="fq-hero__eyebrow-line" aria-hidden="true" />
                            Help &amp; Information
                        </div>

                        {/* Split layout */}
                        <div className="fq-hero__layout">
                            <h1
                                id="faq-hero-heading"
                                className="fq-hero__title"
                            >
                                Frequently
                                <br />
                                <em className="fq-hero__title-em">
                                    Asked Questions
                                </em>
                            </h1>
                            <p className="fq-hero__desc">
                                Common questions about admissions,
                                certifications, training structure and
                                policies.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ════════════ FAQ BODY ════════════ */}
                <section className="fq-body" aria-label="FAQ accordion">
                    <div className="fq-body__divider" aria-hidden="true" />

                    <div className="container fq-body__inner">

                        {/* Accordion */}
                        <div className="fq-accordion" role="list">
                            {faqs.map((faq, i) => {
                                const isOpen = openIndex === i;
                                return (
                                    <div
                                        key={i}
                                        className={
                                            isOpen
                                                ? "fq-item fq-item--open"
                                                : "fq-item"
                                        }
                                        role="listitem"
                                    >
                                        {/* Left accent bar */}
                                        <span
                                            className="fq-item__bar"
                                            aria-hidden="true"
                                        />

                                        {/* Trigger */}
                                        <button
                                            className="fq-trigger"
                                            onClick={() =>
                                                setOpenIndex(
                                                    isOpen ? null : i
                                                )
                                            }
                                            aria-expanded={isOpen}
                                        >
                                            {/* Number */}
                                            <span
                                                className="fq-trigger__num"
                                                aria-hidden="true"
                                            >
                                                {String(i + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            {/* Question */}
                                            <span className="fq-trigger__question">
                                                {faq.q}
                                            </span>

                                            {/* Toggle icon */}
                                            <span
                                                className="fq-trigger__icon"
                                                aria-hidden="true"
                                            >
                                                +
                                            </span>
                                        </button>

                                        {/* Answer */}
                                        <div
                                            className="fq-answer"
                                            aria-hidden={!isOpen}
                                        >
                                            <div className="fq-answer__inner">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Strip */}
                        <div
                            className="fq-cta"
                            aria-label="Still have questions?"
                        >
                            <div
                                className="fq-cta__dots"
                                aria-hidden="true"
                            />

                            <div className="fq-cta__left">
                                <div className="fq-cta__eyebrow">
                                    <span className="fq-cta__eyebrow-line" />
                                    Need More Help
                                </div>
                                <div className="fq-cta__text">
                                    Still have questions? Talk to our team.
                                </div>
                            </div>

                            <Link
                                href="/contact"
                                className="fq-cta__btn"
                            >
                                Contact the Academy
                                <span
                                    className="fq-cta__btn-arrow"
                                    aria-hidden="true"
                                >
                                    <ArrowRightIcon />
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* ════════════ PAGE-SCOPED CSS ════════════ */}
            <style>{`

/* ══════════════════════════════════════════
   FAQ PAGE  —  page-scoped styles
   Follows: variables.css + components.css
   ══════════════════════════════════════════ */

/* ── Root ───────────────────────────────── */
.fq-root {
  background-color: var(--bg-page);
  min-height: 100vh;
}

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
.fq-hero {
  position: relative;
  padding: var(--space-24) 0 var(--space-16);
  overflow: hidden;
  background: linear-gradient(
    160deg,
    var(--color-primary-200) 0%,
    var(--color-white) 60%,
    var(--color-primary-400) 100%
  );
}

/* Glow orbs */
.fq-hero__glow {
  position: absolute;
  border-radius: var(--radius-full);
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.30;
}
.fq-hero__glow--1 {
  width: 460px;
  height: 460px;
  background: var(--color-primary-200);
  top: -190px;
  right: -130px;
}
.fq-hero__glow--2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent-200);
  bottom: -80px;
  left: -80px;
}

/* Center-constrained inner */
.fq-hero__inner {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

/* Eyebrow */
.fq-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary-600);
  margin-bottom: var(--space-4);
}
.fq-hero__eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Split layout */
.fq-hero__layout {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-10);
  flex-wrap: wrap;
}

/* Title */
.fq-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0;
}
.fq-hero__title-em {
  font-style: italic;
  background: linear-gradient(
    135deg,
    var(--color-primary-600),
    var(--color-accent-500)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Desc */
.fq-hero__desc {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  max-width: 300px;
  margin: 0;
  padding-bottom: var(--space-1);
}

/* ══════════════════════════════════════════
   BODY
   ══════════════════════════════════════════ */
.fq-body {
  position: relative;
  padding-bottom: var(--space-24);
}
.fq-body__divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-color),
    transparent
  );
  margin: 0 10%;
}

/* Center-constrained inner */
.fq-body__inner {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
  padding-top: var(--space-12);
}

/* ══════════════════════════════════════════
   ACCORDION
   ══════════════════════════════════════════ */
.fq-accordion {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: var(--space-5);
}

/* ── Item ────────────────────────────────── */
.fq-item {
  position: relative;
  overflow: hidden;
  background: var(--bg-elevated);
  transition: background var(--transition-fast);
}
.fq-item:hover {
  background: var(--color-primary-50);
}
.fq-item--open {
  background: var(--color-primary-50);
}

/* Left accent bar */
.fq-item__bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    to bottom,
    var(--color-primary-500),
    var(--color-primary-200)
  );
  transform: scaleY(0);
  transform-origin: top center;
  transition: transform var(--transition-base);
}
.fq-item--open .fq-item__bar {
  transform: scaleY(1);
}

/* ── Trigger ─────────────────────────────── */
.fq-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6) var(--space-5) var(--space-6);
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
}

/* Number */
.fq-trigger__num {
  font-family: var(--font-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
  min-width: 24px;
  color: var(--color-primary-200);
  transition: color var(--transition-fast);
}
.fq-item--open .fq-trigger__num {
  color: var(--color-primary-600);
}

/* Question */
.fq-trigger__question {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  line-height: var(--line-height-snug);
  flex: 1;
}

/* Toggle icon */
.fq-trigger__icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-light);
  line-height: 1;
  color: var(--text-tertiary);
  background: var(--bg-page);
  border: 1px solid var(--border-color);
  transition:
    transform var(--transition-base),
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}
.fq-item--open .fq-trigger__icon {
  transform: rotate(45deg);
  background: var(--color-gray-900);
  border-color: var(--color-gray-900);
  color: var(--color-warning);
}

/* ── Answer (CSS accordion) ─────────────── */
.fq-answer {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.32s var(--ease-in-out),
    opacity 0.24s var(--ease-in-out);
}
.fq-item--open .fq-answer {
  max-height: 300px;
  opacity: 1;
}
.fq-answer__inner {
  padding: 0 var(--space-6) var(--space-5) calc(var(--space-6) + 24px + var(--space-4));
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

/* ══════════════════════════════════════════
   CTA STRIP
   ══════════════════════════════════════════ */
.fq-cta {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  padding: var(--space-6) var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  flex-wrap: wrap;
  background: linear-gradient(
    135deg,
    var(--color-gray-800) 0%,
    var(--color-gray-900) 100%
  );
  border: 1px solid var(--color-gray-700);
}

/* Dot pattern */
.fq-cta__dots {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 144px;
  height: 144px;
  background-image: radial-gradient(
    circle,
    rgba(251, 146, 60, 0.14) 1.5px,
    transparent 1.5px
  );
  background-size: 12px 12px;
  pointer-events: none;
}

.fq-cta__left {
  position: relative;
  z-index: 1;
}

/* CTA eyebrow */
.fq-cta__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(251, 146, 60, 0.55);
  margin-bottom: var(--space-2);
}
.fq-cta__eyebrow-line {
  display: inline-block;
  width: 12px;
  height: 1.5px;
  background: rgba(251, 146, 60, 0.45);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.fq-cta__text {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
}

/* CTA button */
.fq-cta__btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-sans);
  color: var(--color-gray-900);
  background: var(--color-warning);
  border-radius: var(--radius-full);
  flex-shrink: 0;
  transition:
    filter var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}
.fq-cta__btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(251, 146, 60, 0.35);
}
.fq-cta__btn-arrow {
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast);
}
.fq-cta__btn:hover .fq-cta__btn-arrow {
  transform: translateX(3px);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */
@media (max-width: 768px) {
  .fq-hero {
    padding: var(--space-16) 0 var(--space-12);
  }
  .fq-hero__layout {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  .fq-hero__desc {
    max-width: 100%;
  }
  .fq-cta {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-6);
  }
}

@media (max-width: 480px) {
  .fq-hero {
    padding: var(--space-12) 0 var(--space-10);
  }
  .fq-body {
    padding-bottom: var(--space-16);
  }
  .fq-trigger {
    padding: var(--space-4) var(--space-4) var(--space-4) var(--space-5);
  }
  .fq-answer__inner {
    padding-left: var(--space-5);
  }
}

      `}</style>
        </>
    );
}