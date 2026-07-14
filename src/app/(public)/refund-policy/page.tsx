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
    body: [
      "Course (tuition) fee refunds, where applicable, follow this structure:",
    ],
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
            This policy explains when and how course fees may be refunded at
            Shivshakti Computer Academy. Please read it before enrolling.
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
                  <span className="rf-toc-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="rf-content">
            <div className="rf-intro">
              <p>
                This Refund Policy applies to all students of Shivshakti Computer
                Academy, Ambikapur (Chhattisgarh). It should be read together with
                our{" "}
                <Link href="/terms" className="rf-inline-link">
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </div>

            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="rf-section">
                <h2 className="rf-section-title">
                  <span className="rf-section-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                {s.body.map((p, j) => (
                  <p key={j} className="rf-text">
                    {p}
                  </p>
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
                For any refund-related query, please contact us with your
                enrollment details:
              </p>
              <div className="rf-contact-rows">
                <a href="tel:+917477036832" className="rf-contact-row">
                  <span className="rf-contact-icon">
                    <Phone size={15} strokeWidth={1.8} />
                  </span>
                  +91 74770 36832
                </a>
                <a
                  href="mailto:shivshakticomputeracademy25@gmail.com"
                  className="rf-contact-row"
                >
                  <span className="rf-contact-icon">
                    <Mail size={15} strokeWidth={1.8} />
                  </span>
                  shivshakticomputeracademy25@gmail.com
                </a>
                <div className="rf-contact-row rf-contact-row--static">
                  <span className="rf-contact-icon">
                    <MapPin size={15} strokeWidth={1.8} />
                  </span>
                  1st Floor, Above Usha Matching Center, Near Babra Petrol Pump,
                  Banaras Road, Phunderdihari, Ambikapur, Surguja, Chhattisgarh
                  – 497001
                </div>
              </div>
              <Link href="/contact" className="rf-contact-cta">
                Contact Us
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}