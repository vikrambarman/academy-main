// ============================================================
// app/(public)/faq/page.tsx
// ============================================================
"use client";

import Link from "next/link";
import Script from "next/script";
import { useState } from "react";

/* ─── FAQ Data ───────────────────────────────────────────────
   Expanded for SEO / Google indexing. Questions are phrased the
   way people actually search ("computer course fees in Ambikapur",
   "best computer institute near me", "Python / web development course",
   "online degree", etc.). Grouped by category for clarity + structure.
   All answers use ONLY your real data. Adjust fees/specifics as needed.
   ──────────────────────────────────────────────────────────── */
type FAQ = { q: string; a: string };
type FAQGroup = { group: string; items: FAQ[] };

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
        a: "We are located at 1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras Road, Phunderdihari, Ambikapur, Dist: Surguja, Chhattisgarh – 497001. It is easily accessible from the main city area.",
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
        a: "Yes. Alongside our core computer courses, we offer programming training — Python, C, C++ and Java — covering logic building, object-oriented concepts and practical projects. Contact us for the current batch schedule.",
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
        a: "For first-time learners, the Basic Computer Course and DCA (Diploma in Computer Applications) are ideal starting points. They build fundamentals from scratch — no prior experience is required.",
      },
      {
        q: "What is the duration of the computer courses?",
        a: "Course duration depends on the program. Diploma courses such as DCA and PGDCA usually range from 6 months to 1 year, while short-term certifications may be 1–3 months.",
      },
    ],
  },
  {
    group: "University Degrees",
    items: [
      {
        q: "Can I get a university degree like BCA, BA, B.Com, BSc, MSc or MBA here?",
        a: "Yes. Through our university admission partnership, we assist students with admissions to online and distance education degree programs — including BCA, BA, B.Com, BSc, MSc and MBA — right here in Ambikapur. Visit us or send an enquiry for guidance.",
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
        a: "Every admitted student gets lifetime access to our Learning Management System — practice modules, resources and progress tracking — which activates automatically on course admission.",
      },
    ],
  },
];

const ArrowRightIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);

// Flatten for stable indexing + schema
const allFaqs: FAQ[] = faqGroups.flatMap((g) => g.items);

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>("0-0");

  return (
    <>
      {/* FAQPage structured data — helps Google show rich results / People Also Ask */}
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
                Frequently <span className="fq-hero__title-em">Asked Questions</span>
              </h1>
              <p className="fq-hero__desc">
                Common questions about courses, admissions, fees, certifications and our
                computer training in Ambikapur.
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
                      <div key={key} className={isOpen ? "fq-item fq-item--open" : "fq-item"} role="listitem">
                        <button
                          className="fq-trigger"
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          aria-expanded={isOpen}
                        >
                          <span className="fq-trigger__question">{faq.q}</span>
                          <span className="fq-trigger__icon" aria-hidden="true">+</span>
                        </button>
                        <div className="fq-answer" aria-hidden={!isOpen}>
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
                  <span className="fq-cta__eyebrow-line" aria-hidden="true" />
                  Need More Help
                </div>
                <div className="fq-cta__text">Still have questions? Talk to our team.</div>
              </div>
              <Link href="/contact" className="fq-cta__btn">
                Contact the Academy
                <span className="fq-cta__btn-arrow" aria-hidden="true"><ArrowRightIcon /></span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style>{`
/* ── FAQ PAGE — Clean University style ── */
.fq-root { background: var(--bg-page); min-height: 100vh; }

.fq-hero { position: relative; padding: var(--space-20) 0 var(--space-12); background: var(--bg-page); border-bottom: 1px solid var(--border-color); }
.fq-hero__inner { position: relative; max-width: 820px; margin-inline: auto; padding-inline: var(--space-4); }
.fq-hero__eyebrow { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3); }
.fq-hero__eyebrow-line { width: 24px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.fq-hero__layout { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-8); flex-wrap: wrap; }
.fq-hero__title { font-family: var(--font-display); font-size: clamp(1.75rem, 3.6vw, 2.5rem); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.2; letter-spacing: -0.015em; margin: 0; }
.fq-hero__title-em { font-style: normal; color: var(--color-primary-700); }
.fq-hero__desc { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; max-width: 340px; margin: 0; }

.fq-body { padding: var(--space-12) 0 var(--space-24); }
.fq-body__inner { max-width: 820px; margin-inline: auto; padding-inline: var(--space-4); }

/* Group */
.fq-group { margin-bottom: var(--space-10); }
.fq-group__title {
  font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);
  color: var(--text-primary); letter-spacing: -0.01em; margin-bottom: var(--space-4);
  padding-bottom: var(--space-2); border-bottom: 2px solid var(--color-accent-500); display: inline-block;
}

/* Accordion */
.fq-accordion { display: flex; flex-direction: column; gap: var(--space-3); }
.fq-item {
  position: relative; overflow: hidden; background: var(--bg-elevated);
  border: 1px solid var(--border-color); border-radius: var(--radius-md);
  transition: border-color var(--transition-fast);
}
.fq-item:hover { border-color: var(--color-gray-300); }
.fq-item--open { border-color: var(--color-gray-300); }
.fq-trigger {
  width: 100%; display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-5) var(--space-6); text-align: left; background: none; border: none; cursor: pointer; font-family: var(--font-sans);
  transition: background var(--transition-fast);
}
.fq-trigger:hover, .fq-item--open .fq-trigger { background: var(--bg-surface); }
.fq-trigger__question { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.4; flex: 1; }
.fq-trigger__icon {
  width: 28px; height: 28px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-size: var(--font-size-lg); font-weight: 300; line-height: 1; color: var(--color-primary-600);
  background: var(--bg-page); border: 1px solid var(--border-color);
  transition: transform var(--transition-base), background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.fq-item--open .fq-trigger__icon { transform: rotate(45deg); background: var(--color-primary-600); border-color: var(--color-primary-600); color: #fff; }
.fq-answer { max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.32s var(--ease-in-out), opacity 0.24s var(--ease-in-out); }
.fq-item--open .fq-answer { max-height: 400px; opacity: 1; }
.fq-answer__inner { padding: var(--space-2) var(--space-6) var(--space-5); font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.75; border-top: 1px solid var(--border-color); padding-top: var(--space-4); }

/* CTA — solid ink-blue */
.fq-cta {
  position: relative; overflow: hidden; border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-8); display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-5); flex-wrap: wrap; background: var(--color-primary-700); margin-top: var(--space-4);
}
.fq-cta__eyebrow { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: var(--space-2); }
.fq-cta__eyebrow-line { width: 12px; height: 2px; background: rgba(255,255,255,0.5); flex-shrink: 0; }
.fq-cta__text { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.3; }
.fq-cta__btn {
  display: inline-flex; align-items: center; gap: var(--space-2); text-decoration: none;
  padding: var(--space-3) var(--space-6); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); font-family: var(--font-sans);
  color: var(--color-primary-800); background: #fff; border-radius: var(--radius-md); flex-shrink: 0;
  transition: background var(--transition-fast);
}
.fq-cta__btn:hover { background: var(--color-gray-100); color: var(--color-primary-800); }
.fq-cta__btn-arrow { display: flex; align-items: center; transition: transform var(--transition-fast); }
.fq-cta__btn:hover .fq-cta__btn-arrow { transform: translateX(3px); }

/* Responsive */
@media (max-width: 768px) {
  .fq-hero { padding: var(--space-16) 0 var(--space-10); }
  .fq-hero__layout { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .fq-hero__desc { max-width: 100%; }
  .fq-cta { flex-direction: column; align-items: flex-start; padding: var(--space-6); }
}
@media (max-width: 480px) {
  .fq-hero { padding: var(--space-12) 0 var(--space-8); }
  .fq-body { padding: var(--space-10) 0 var(--space-16); }
  .fq-trigger { padding: var(--space-4); }
  .fq-answer__inner { padding: var(--space-3) var(--space-4) var(--space-4); }
}
      `}</style>
    </>
  );
}
