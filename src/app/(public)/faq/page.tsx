// ============================================================
// app/(public)/faq/page.tsx
// ============================================================
"use client";

import Link from "next/link";
import Script from "next/script";
import { useState } from "react";

/* ─── Types ─── */
type FAQ = { q: string; a: string };
type FAQGroup = { group: string; items: FAQ[] };

/* ─── FAQ Data (UNCHANGED) ─── */
const faqGroups: FAQGroup[] = [
  {
    group: "About the Institute",
    items: [
      {
        q: "Which is the best computer institute in Ambikapur?",
        a: "Shivshakti Computer Academy is a trusted, government-recognized computer training institute in Ambikapur, Surguja (Chhattisgarh). With 10+ years of teaching experience, practical-first training and verified certifications, we are a preferred choice for computer and IT education in the region.",
      },
      {
        q: "Is Shivshakti Computer Academy government recognized?",
        a: "Yes. The academy operates under recognized frameworks including MSME (Udyam) registration and authorized training partnerships. Selected programs align with national skill development guidelines under GSDM and Skill India.",
      },
      {
        q: "Where is Shivshakti Computer Academy located in Ambikapur?",
        a: "We are located at 1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras Road, Phunderdihari, Ambikapur, Dist: Surguja, Chhattisgarh - 497001. It is easily accessible from the main city area.",
      },
      {
        q: "What are the class timings and working hours?",
        a: "Classes run Monday to Saturday, 8:00 AM to 6:00 PM. Batch timings are flexible and can be discussed at the time of admission based on student availability.",
      },
    ],
  },
  {
    group: "Courses & Programs",
    items: [
      {
        q: "What computer courses are available in Ambikapur?",
        a: "We offer DCA, ADCA, PGDCA, Tally with GST, Basic Computer Course, Typing, Web Development, Software Development and other professional skill-development programs across Foundation, Diploma and Advanced levels.",
      },
      {
        q: "Do you offer programming courses like Python, Java, C and C++?",
        a: "Yes. Alongside our core computer courses, we offer programming training - Python, C, C++ and Java - covering logic building, object-oriented concepts and practical projects. Contact us for the current batch schedule.",
      },
      {
        q: "Do you offer web development courses (HTML, CSS, JavaScript, React)?",
        a: "Yes. Our web development training covers HTML5, CSS3 and JavaScript for building responsive websites, with options to learn modern frameworks like React and full-stack web development.",
      },
      {
        q: "Is the Tally course with GST available?",
        a: "Yes. Our Tally with GST course provides practical accounting and GST training designed for office work, business operations and accounting jobs.",
      },
      {
        q: "Which course is best for beginners with no computer knowledge?",
        a: "For first-time learners, the Basic Computer Course and DCA (Diploma in Computer Applications) are ideal starting points. They build fundamentals from scratch - no prior experience is required.",
      },
      {
        q: "What is the duration of the computer courses?",
        a: "Course duration depends on the program. Diploma courses such as DCA and PGDCA usually range from 6 months to 1 year, while short-term certifications may be 1-3 months.",
      },
    ],
  },
  {
    group: "University Degrees",
    items: [
      {
        q: "Can I get a university degree like BCA, BA, B.Com, BSc, MSc or MBA here?",
        a: "Yes. Through our university admission partnership, we assist students with admissions to online and distance education degree programs - including BCA, BA, B.Com, BSc, MSc and MBA - right here in Ambikapur. Visit us or send an enquiry for guidance.",
      },
      {
        q: "Do you provide admission for online and distance education courses?",
        a: "Yes. We facilitate admissions to recognized online and distance education university programs for students who prefer flexible, work-friendly study options. Our team guides you through the entire process.",
      },
    ],
  },
  {
    group: "Certificates & Verification",
    items: [
      {
        q: "Are the certificates verifiable online?",
        a: "Eligible certificates are issued through recognized authorities such as Drishti Computer Education, GSDM and DigiLocker, and are digitally verifiable depending on the program and governing body.",
      },
      {
        q: "How can I verify my certificate?",
        a: "Certificates can be verified online through DigiLocker or the relevant certification authority's portal using your enrollment number. You can also use the Verify Certificate option on our website.",
      },
      {
        q: "Are certificates accepted for jobs?",
        a: "Yes. Our certifications are aligned with recognized national platforms (Skill India, NSDC, GSDM) and are valued by employers for entry-level and skill-based roles.",
      },
    ],
  },
  {
    group: "Admission & Fees",
    items: [
      {
        q: "What is the admission process?",
        a: "Students can visit the academy or submit an online enquiry. After counselling, enrollment and practical training begins as per the course structure. No entrance exam is required.",
      },
      {
        q: "What are the eligibility criteria for admission?",
        a: "Eligibility varies by course. Foundation courses are open to anyone from Class 8 onwards. Diploma programs (DCA, PGDCA) generally require 10th or 12th pass qualification.",
      },
      {
        q: "What is the fee for computer courses?",
        a: "Course fees vary depending on the program, duration and certification. Fees are kept affordable for students of all backgrounds. Please call us or submit an enquiry for the latest fee details and any ongoing offers.",
      },
      {
        q: "Do you provide free admission guidance and career counselling?",
        a: "Yes. Our team provides free admission guidance and career counselling. Visit our centre or call us during working hours for assistance in choosing the right course.",
      },
    ],
  },
  {
    group: "Training & Support",
    items: [
      {
        q: "Is practical (hands-on) training provided?",
        a: "Yes. We focus on 100% practical computer training with hands-on system access for every student during every class session.",
      },
      {
        q: "Do you teach in Hindi and English?",
        a: "Yes. Our courses are taught in both Hindi and English medium so that every student can learn comfortably.",
      },
      {
        q: "Do students get lifetime LMS access?",
        a: "Every admitted student gets lifetime access to our Learning Management System - practice modules, resources and progress tracking - which activates automatically on course admission.",
      },
    ],
  },
];

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* Flatten for schema */
const allFaqs: FAQ[] = faqGroups.flatMap((g) => g.items);

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>("0-0");

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allFaqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <main className="fq-root">
        {/* ── HERO ── */}
        <section className="fq-hero" aria-labelledby="faq-hero-heading">
          <div className="container fq-hero__inner">
            <div className="fq-hero__eyebrow">
              <span className="fq-hero__eyebrow-line" aria-hidden="true" />
              Help &amp; Information
            </div>
            <div className="fq-hero__layout">
              <h1 id="faq-hero-heading" className="fq-hero__title">
                Frequently{" "}
                <span className="fq-hero__title-em">Asked Questions</span>
              </h1>
              <p className="fq-hero__desc">
                Common questions about courses, admissions, fees, certifications
                and our computer training in Ambikapur.
              </p>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <section className="fq-body" aria-label="FAQ accordion">
          <div className="container fq-body__inner">
            {faqGroups.map((grp, gi) => (
              <div key={grp.group} className="fq-group">
                <h2 className="fq-group__title">{grp.group}</h2>
                <div className="fq-accordion" role="list">
                  {grp.items.map((faq, i) => {
                    const key = `${gi}-${i}`;
                    const isOpen = openKey === key;
                    return (
                      <div
                        key={key}
                        className={
                          isOpen ? "fq-item fq-item--open" : "fq-item"
                        }
                        role="listitem"
                      >
                        <button
                          className="fq-trigger"
                          onClick={() =>
                            setOpenKey(isOpen ? null : key)
                          }
                          aria-expanded={isOpen}
                        >
                          <span className="fq-trigger__question">
                            {faq.q}
                          </span>
                          <span
                            className="fq-trigger__icon"
                            aria-hidden="true"
                          >
                            +
                          </span>
                        </button>
                        <div
                          className="fq-answer"
                          aria-hidden={!isOpen}
                        >
                          <div className="fq-answer__inner">{faq.a}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* CTA Strip */}
            <div className="fq-cta" aria-label="Still have questions?">
              <div className="fq-cta__left">
                <div className="fq-cta__eyebrow">
                  <span
                    className="fq-cta__eyebrow-line"
                    aria-hidden="true"
                  />
                  Need More Help
                </div>
                <div className="fq-cta__text">
                  Still have questions? Talk to our team.
                </div>
              </div>
              <Link href="/contact" className="fq-cta__btn">
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
    </>
  );
}