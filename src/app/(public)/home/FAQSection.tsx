"use client";

import { useState } from "react";

/* All data from your ORIGINAL component — nothing invented. */
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
        <div className="faq-inner">
          {/* Header */}
          <div className="faq-header">
            <div className="faq-badge">
              <span className="faq-badge-dot" aria-hidden="true" />
              Common Questions
            </div>
            <h2 id="faq-heading" className="faq-title">
              Frequently Asked <span className="faq-title-highlight">Questions</span>
            </h2>
            <p className="faq-subtitle">
              Everything you need to know about admissions, certifications and our
              training programs.
            </p>
          </div>

          {/* Accordion */}
          <div className="faq-list" role="list">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.question}
                  className={`faq-item${isOpen ? " faq-item--open" : ""}`}
                  role="listitem"
                >
                  <button
                    className="faq-btn"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question">{faq.question}</span>
                    <span className={`faq-icon${isOpen ? " faq-icon--open" : ""}`} aria-hidden="true">
                      +
                    </span>
                  </button>

                  <div className="faq-answer" aria-hidden={!isOpen}>
                    <div className="faq-answer-inner">{faq.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <p className="faq-footer-note">
            Still have questions?{" "}
            <a href="/enquiry" className="faq-footer-link">Contact us directly →</a>
          </p>
        </div>
      </section>

      <style>{`
/* ── FAQ — Clean University style ── */
.faq-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}
.faq-inner { position: relative; max-width: 780px; margin: 0 auto; }

.faq-header { text-align: center; margin-bottom: var(--space-10); }
.faq-badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.faq-badge-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; }
.faq-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.6vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: 0;
}
.faq-title-highlight { color: var(--color-primary-700); }
.faq-subtitle {
  font-size: var(--font-size-base); line-height: 1.7;
  color: var(--text-secondary); margin: var(--space-3) auto 0; max-width: 540px;
}

.faq-list { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-8); }
.faq-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--transition-base);
}
.faq-item:hover { border-color: var(--color-gray-300); }
.faq-item--open { border-color: var(--color-gray-300); }

.faq-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-4); padding: var(--space-5) var(--space-6);
  text-align: left; background: transparent; border: none; cursor: pointer;
  transition: background-color var(--transition-fast);
}
.faq-btn:hover { background-color: var(--bg-surface); }
.faq-item--open .faq-btn { background-color: var(--bg-surface); }
.faq-question {
  flex: 1; font-family: var(--font-display);
  font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);
  line-height: 1.4; color: var(--text-primary);
}
.faq-icon {
  width: 28px; height: 28px; border-radius: var(--radius-sm);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; line-height: 1;
  border: 1px solid var(--border-color); background: var(--bg-page);
  color: var(--color-primary-600);
  transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), transform 0.24s var(--ease-in-out);
}
.faq-icon--open {
  transform: rotate(45deg);
  background: var(--color-primary-600); border-color: var(--color-primary-600); color: #fff;
}
.faq-answer { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.32s var(--ease-in-out), opacity 0.26s var(--ease-in-out); }
.faq-item--open .faq-answer { max-height: 280px; opacity: 1; }
.faq-answer-inner {
  padding: var(--space-4) var(--space-6) var(--space-5);
  font-size: var(--font-size-sm); line-height: 1.7;
  color: var(--text-secondary); border-top: 1px solid var(--border-color);
}

.faq-footer-note { text-align: center; font-size: var(--font-size-sm); color: var(--text-tertiary); margin: 0; }
.faq-footer-link { color: var(--color-primary-600); font-weight: var(--font-weight-medium); text-decoration: none; }
.faq-footer-link:hover { color: var(--color-primary-700); text-decoration: underline; }

@media (max-width: 480px) {
  .faq-section { padding: var(--space-16) var(--space-4); }
  .faq-list { gap: var(--space-2); }
  .faq-btn { padding: var(--space-4); }
  .faq-answer-inner { padding: var(--space-3) var(--space-4) var(--space-4); }
  .faq-question { font-size: var(--font-size-sm); }
  .faq-icon { width: 26px; height: 26px; font-size: 1rem; }
}
      `}</style>
    </>
  );
}
