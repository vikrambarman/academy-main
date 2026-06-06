import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy | Shivshakti Computer Academy, Ambikapur",
  description:
    "Refund Policy of Shivshakti Computer Academy, Ambikapur — our rules on course fee refunds, registration charges, cancellations and non-refundable items.",
  alternates: { canonical: "https://www.shivshakticomputer.in/refund-policy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "6 June 2026";

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: [
      "At Shivshakti Computer Academy, we want every student to make an informed decision before enrolling. This Refund Policy explains the conditions under which course fees may or may not be refunded. By enrolling in any program, you agree to the terms below.",
    ],
  },
  {
    id: "registration",
    title: "Registration / Admission Fee",
    body: ["Please note the following regarding admission charges:"],
    list: [
      "The registration / admission fee is non-refundable, as it covers administrative processing and enrollment costs.",
      "This applies even if a student decides to withdraw after admission is confirmed.",
    ],
  },
  {
    id: "course-fee",
    title: "Course Fee Refunds",
    body: ["Course (tuition) fee refunds, where applicable, follow this structure:"],
    list: [
      "Before classes begin: if you cancel before the course/batch starts, the course fee may be refunded after deducting the non-refundable registration fee and any applicable charges.",
      "Within the first few days of the batch: a partial refund may be considered at the Academy's discretion, after deducting registration fee and the cost of classes/material already provided.",
      "After the course has progressed: once a significant portion of the course has been delivered, course fees are generally non-refundable.",
    ],
  },
  {
    id: "non-refundable",
    title: "Non-Refundable Items",
    body: ["The following are not eligible for any refund:"],
    list: [
      "Registration / admission fees.",
      "Study materials, books or kits already issued.",
      "Examination, certification or third-party charges paid to external authorities (e.g. franchise, GSDM, Skill India, DigiLocker).",
      "University admission / processing fees paid to a partner university or platform.",
      "Any fees for courses already completed or certificates already issued.",
    ],
  },
  {
    id: "university",
    title: "University Admission Refunds",
    body: [
      "For university degree admissions facilitated through our partnerships (such as online and distance education programs), refunds — if any — are governed entirely by the respective university's or partner platform's refund policy. Shivshakti Computer Academy only assists with the admission process and is not responsible for university-level refund decisions.",
    ],
  },
  {
    id: "how-to-request",
    title: "How to Request a Refund",
    body: ["If you believe you are eligible for a refund:"],
    list: [
      "Visit the Academy or contact us by phone/email with your name, enrollment details and reason for the refund request.",
      "Submit the request as early as possible — refund eligibility depends on how much of the course has been delivered.",
      "Our team will review your request and inform you of the eligible amount, if any.",
    ],
  },
  {
    id: "processing",
    title: "Refund Processing",
    body: [
      "Approved refunds are processed within a reasonable time (typically 7–15 working days) through the original mode of payment or another agreed method. The exact timeline may vary depending on the payment channel.",
    ],
  },
  {
    id: "discretion",
    title: "Special Cases & Discretion",
    body: [
      "In genuine cases (such as medical emergencies or relocation), the Academy may consider a special refund or a transfer/hold of fees at its sole discretion. Such decisions are made on a case-by-case basis.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    body: [
      "We may update this Refund Policy from time to time. The version in effect at the time of your enrollment will apply to that enrollment. Please review this page periodically.",
    ],
  },
];

export default function RefundPage() {
  return (
    <>
      <main className="rf-root">
        {/* ── HERO ── */}
        <section className="rf-hero">
          <div className="rf-wrap">
            <div className="rf-eyebrow">
              <span className="rf-eyebrow-line" aria-hidden="true" />
              Legal
            </div>
            <h1 className="rf-title">Refund Policy</h1>
            <p className="rf-lead">
              This policy explains when and how course fees may be refunded at Shivshakti
              Computer Academy. Please read it before enrolling.
            </p>
            <p className="rf-updated">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        {/* ── BODY ── */}
        <section className="rf-body">
          <div className="rf-wrap rf-grid">
            <aside className="rf-toc" aria-label="On this page">
              <div className="rf-toc-label">On this page</div>
              <nav className="rf-toc-nav">
                {sections.map((s, i) => (
                  <a key={s.id} href={`#${s.id}`} className="rf-toc-link">
                    <span className="rf-toc-num">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="rf-content">
              <div className="rf-intro">
                <p>
                  This Refund Policy applies to all students of Shivshakti Computer Academy,
                  Ambikapur (Chhattisgarh). It should be read together with our{" "}
                  <Link href="/terms" className="rf-inline-link">Terms &amp; Conditions</Link>.
                </p>
              </div>

              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="rf-section">
                  <h2 className="rf-section-title">
                    <span className="rf-section-num">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  {s.body.map((p, j) => (
                    <p key={j} className="rf-text">{p}</p>
                  ))}
                  {s.list && (
                    <ul className="rf-list">
                      {s.list.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* Contact block */}
              <section id="contact" className="rf-contact-card">
                <h2 className="rf-contact-title">Need Help With a Refund?</h2>
                <p className="rf-contact-text">
                  For any refund-related query, please contact us with your enrollment
                  details:
                </p>
                <div className="rf-contact-rows">
                  <a href="tel:+917477036832" className="rf-contact-row">
                    <span className="rf-contact-icon"><Phone size={15} strokeWidth={1.8} /></span>
                    +91 74770 36832
                  </a>
                  <a href="mailto:shivshakticomputeracademy25@gmail.com" className="rf-contact-row">
                    <span className="rf-contact-icon"><Mail size={15} strokeWidth={1.8} /></span>
                    shivshakticomputeracademy25@gmail.com
                  </a>
                  <div className="rf-contact-row rf-contact-row--static">
                    <span className="rf-contact-icon"><MapPin size={15} strokeWidth={1.8} /></span>
                    1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras
                    Road, Phunderdihari, Ambikapur, Surguja, Chhattisgarh – 497001
                  </div>
                </div>
                <Link href="/contact" className="rf-contact-cta">Contact Us</Link>
              </section>
            </div>
          </div>
        </section>
      </main>

      <style>{`
/* ── REFUND POLICY — Clean University style (shares pattern with Privacy/Terms) ── */
.rf-root { background: var(--bg-page); min-height: 100vh; }
.rf-wrap { max-width: 1100px; margin: 0 auto; padding: 0 var(--space-6); }

.rf-hero { position: relative; padding: var(--space-20) 0 var(--space-12); background: var(--bg-page); border-bottom: 1px solid var(--border-color); }
.rf-eyebrow { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3); }
.rf-eyebrow-line { width: 22px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.rf-title { font-family: var(--font-display); font-size: clamp(1.875rem, 4vw, 2.75rem); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.15; letter-spacing: -0.015em; margin: 0 0 var(--space-3); }
.rf-lead { font-size: var(--font-size-lg); color: var(--text-secondary); line-height: 1.7; max-width: 60ch; margin: 0 0 var(--space-4); }
.rf-updated { font-size: var(--font-size-sm); color: var(--text-tertiary); margin: 0; }

.rf-body { padding: var(--space-12) 0 var(--space-24); }
.rf-grid { display: grid; grid-template-columns: 240px 1fr; gap: var(--space-10); align-items: start; }

.rf-toc { position: sticky; top: 160px; }
.rf-toc-label { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: var(--space-4); }
.rf-toc-nav { display: flex; flex-direction: column; gap: 2px; }
.rf-toc-link {
  display: flex; align-items: baseline; gap: var(--space-2);
  padding: var(--space-2) var(--space-3); font-size: var(--font-size-sm);
  color: var(--text-secondary); text-decoration: none; border-radius: var(--radius-sm);
  border-left: 2px solid transparent; transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
}
.rf-toc-link:hover { color: var(--color-primary-700); background: var(--bg-surface); border-left-color: var(--color-primary-600); }
.rf-toc-num { font-family: var(--font-display); font-size: var(--font-size-xs); color: var(--text-tertiary); flex-shrink: 0; }

.rf-content { min-width: 0; max-width: 720px; }
.rf-intro p { font-size: var(--font-size-lg); line-height: 1.8; color: var(--text-secondary); margin: 0 0 var(--space-8); }
.rf-inline-link { color: var(--color-primary-700); text-decoration: underline; text-underline-offset: 3px; }
.rf-inline-link:hover { color: var(--color-primary-800); }

.rf-section { margin-bottom: var(--space-10); scroll-margin-top: 170px; }
.rf-section-title {
  display: flex; align-items: baseline; gap: var(--space-3);
  font-family: var(--font-display); font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold); color: var(--text-primary);
  line-height: 1.3; letter-spacing: -0.01em; margin-bottom: var(--space-4);
  padding-bottom: var(--space-3); border-bottom: 1px solid var(--border-color);
}
.rf-section-num { font-family: var(--font-display); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-accent-600); flex-shrink: 0; }
.rf-text { font-size: var(--font-size-base); line-height: 1.8; color: var(--text-secondary); margin: 0 0 var(--space-3); }
.rf-list { margin: 0 0 var(--space-3); padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: var(--space-2); }
.rf-list li { position: relative; padding-left: var(--space-5); font-size: var(--font-size-base); line-height: 1.7; color: var(--text-secondary); }
.rf-list li::before { content: ""; position: absolute; left: 0; top: 0.65em; width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent-500); }

.rf-contact-card { margin-top: var(--space-10); background: var(--color-primary-700); color: #fff; border-radius: var(--radius-lg); padding: var(--space-8); }
.rf-contact-title { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); color: #fff; margin-bottom: var(--space-3); }
.rf-contact-text { font-size: var(--font-size-sm); color: rgba(255,255,255,0.8); line-height: 1.7; margin: 0 0 var(--space-5); }
.rf-contact-rows { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6); }
.rf-contact-row { display: flex; align-items: flex-start; gap: var(--space-3); font-size: var(--font-size-sm); color: rgba(255,255,255,0.9); text-decoration: none; line-height: 1.5; transition: color var(--transition-fast); }
.rf-contact-row:not(.rf-contact-row--static):hover { color: #fff; }
.rf-contact-row--static { cursor: default; }
.rf-contact-icon { width: 30px; height: 30px; flex-shrink: 0; border-radius: var(--radius-md); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; color: #fff; }
.rf-contact-cta { display: inline-flex; align-items: center; padding: var(--space-3) var(--space-6); background: #fff; color: var(--color-primary-800); border-radius: var(--radius-md); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-decoration: none; transition: background var(--transition-fast); }
.rf-contact-cta:hover { background: var(--color-gray-100); color: var(--color-primary-800); }

@media (max-width: 900px) {
  .rf-grid { grid-template-columns: 1fr; gap: var(--space-6); }
  .rf-toc { display: none; }
}
@media (max-width: 480px) {
  .rf-hero { padding: var(--space-16) 0 var(--space-10); }
  .rf-body { padding: var(--space-10) 0 var(--space-16); }
  .rf-contact-card { padding: var(--space-6); }
}
      `}</style>
    </>
  );
}
