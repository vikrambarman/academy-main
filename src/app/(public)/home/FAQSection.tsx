"use client";

import Link from "next/link";
import { useState } from "react";
import { HelpCircle, Plus, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "What is the duration of computer courses?",
    answer:
      "Course duration depends on the program. Diploma courses usually range from 6 months to 1 year, while short-term certifications may be 2–3 months.",
  },
  {
    question: "Are certificates government recognized?",
    answer:
      "Yes, selected courses are aligned with Skill India, GSDM and DigiLocker for digital verification. Certificates are verifiable online through official portals.",
  },
  {
    question: "Is practical training provided?",
    answer:
      "Yes, we focus on practical computer training with hands-on system access for every student during every class session.",
  },
  {
    question: "How can I verify my certificate?",
    answer:
      "Certificates can be verified online through DigiLocker or the relevant certification authority's portal using your enrollment number.",
  },
  {
    question: "What are the eligibility criteria?",
    answer:
      "Eligibility varies by course. Foundation courses are open to anyone from Class 8 onwards. Diploma programs generally require 10th or 12th pass qualification.",
  },
  {
    question: "Do you offer admission guidance?",
    answer:
      "Yes, our team provides free admission guidance and career counselling. Visit our centre or call us during working hours for assistance.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq-section" aria-labelledby="faq-heading">

      {/* ── TOP BAR — Full width ── */}
      <div className="faq-topbar">
        <div className="faq-topbar-inner">
          <span className="faq-topbar-tag">
            <HelpCircle size={13} strokeWidth={2} />
            Common Questions
          </span>
          <h2 id="faq-heading" className="faq-topbar-title">
            Frequently Asked Questions
          </h2>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="faq-body">
        <div className="faq-container">

          {/* Subtitle */}
          <p className="faq-subtitle">
            Everything you need to know about admissions, certifications
            and our training programs.
          </p>

          {/* Accordion */}
          <div className="faq-list" role="list">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.question}
                  className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                  role="listitem"
                >
                  <button
                    className="faq-btn"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question">{faq.question}</span>
                    <span
                      className={`faq-icon ${
                        isOpen ? "faq-icon--open" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <Plus size={16} strokeWidth={2.5} />
                    </span>
                  </button>

                  <div
                    className="faq-answer"
                    aria-hidden={!isOpen}
                  >
                    <div className="faq-answer-inner">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="faq-footer">
            <p className="faq-footer-text">
              Still have questions?
            </p>
            <Link href="/enquiry" className="faq-footer-link">
              Contact us directly
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
}