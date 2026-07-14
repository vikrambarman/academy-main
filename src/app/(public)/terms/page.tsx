import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Shivshakti Computer Academy, Ambikapur",
  description:
    "Terms & Conditions for Shivshakti Computer Academy, Ambikapur — rules for enrollment, courses, certification, fees, conduct and use of our website and services.",
  alternates: { canonical: "https://www.shivshakticomputer.in/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "6 June 2026";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    body: [
      "By enrolling in any course, using our website, or availing any service of Shivshakti Computer Academy ('the Academy', 'we', 'us'), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.",
    ],
  },
  {
    id: "enrollment",
    title: "Enrollment & Admission",
    body: ["Admission to any program is subject to the following:"],
    list: [
      "Students must provide accurate personal and academic details at the time of enrollment.",
      "Admission is confirmed only after the required formalities and applicable fees are completed.",
      "Eligibility criteria vary by course and must be met for certain diploma and advanced programs.",
      "The Academy reserves the right to accept or decline any admission at its discretion.",
    ],
  },
  {
    id: "fees",
    title: "Fees & Payments",
    body: ["All fees-related matters are governed by the following terms:"],
    list: [
      "Course fees must be paid as per the schedule communicated at the time of admission.",
      "Fees once paid are generally non-refundable, except as described in our Refund Policy.",
      "The Academy may revise course fees from time to time; revisions do not affect already enrolled students for their current course.",
      "Delayed payments may affect access to classes, study material or certification.",
    ],
  },
  {
    id: "courses-training",
    title: "Courses & Training",
    body: [
      "Course content, duration, batch timings and schedules are decided by the Academy and may be updated to improve quality. We aim to deliver practical, hands-on training; however, the pace of learning and outcomes also depend on the student's regular attendance and effort.",
    ],
  },
  {
    id: "certification",
    title: "Certification",
    body: ["Certificates are issued subject to:"],
    list: [
      "Successful completion of the course, including required attendance and assessments.",
      "Certificates are issued by the relevant authorized authority (e.g. Drishti, GSDM, Skill India/NSDC, or via DigiLocker) depending on the program.",
      "The Academy acts as an authorized training partner and is not the certifying body for partner-issued certificates.",
      "Verification of certificates is done through the respective issuing authority's official portal.",
    ],
  },
  {
    id: "university-admissions",
    title: "University Admission Assistance",
    body: [
      "For university degree programs (such as online and distance education admissions facilitated through our partnerships), the Academy acts only as an admission assistance partner. Admission, eligibility, course delivery, examinations and degrees are governed entirely by the respective university and its policies. The Academy does not guarantee admission or any specific outcome.",
    ],
  },
  {
    id: "student-conduct",
    title: "Student Conduct",
    body: ["Students are expected to:"],
    list: [
      "Maintain discipline and respectful behaviour towards faculty, staff and fellow students.",
      "Handle computer systems, equipment and property of the Academy with care.",
      "Not engage in any unlawful, disruptive or dishonest activity on the premises.",
      "Follow the Academy's rules; violations may lead to suspension or cancellation of admission without refund.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    body: [
      "All study materials, notes, course content, logos and website content are the property of Shivshakti Computer Academy or its respective owners. You may not copy, reproduce, distribute or commercially use any material without prior written permission.",
    ],
  },
  {
    id: "website-use",
    title: "Use of Website",
    body: [
      "You agree to use our website only for lawful purposes. You must not attempt to disrupt the website, gain unauthorized access, or misuse any forms or portals. Information on the website is provided in good faith for general guidance and may be updated without notice.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    body: [
      "The Academy strives to provide quality education and accurate information. However, we are not liable for any indirect or consequential loss arising from the use of our services or website, or for outcomes such as employment, which depend on multiple external factors.",
    ],
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    body: [
      "We may update these Terms & Conditions from time to time. Continued use of our services after any change constitutes acceptance of the revised terms. Please review this page periodically.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law",
    body: [
      "These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts in Ambikapur, Surguja, Chhattisgarh.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="tm-root">
      {/* ── HERO ── */}
      <section className="tm-hero">
        <div className="tm-wrap">
          <div className="tm-eyebrow">
            <span className="tm-eyebrow-line" aria-hidden="true" />
            Legal
          </div>
          <h1 className="tm-title">Terms &amp; Conditions</h1>
          <p className="tm-lead">
            Please read these terms carefully. They govern your enrollment, use
            of our courses, certification and our website.
          </p>
          <p className="tm-updated">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="tm-body">
        <div className="tm-wrap tm-grid">
          {/* TOC */}
          <aside className="tm-toc" aria-label="On this page">
            <div className="tm-toc-label">On this page</div>
            <nav className="tm-toc-nav">
              {sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} className="tm-toc-link">
                  <span className="tm-toc-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="tm-content">
            <div className="tm-intro">
              <p>
                These Terms &amp; Conditions apply to all students, visitors and
                users of Shivshakti Computer Academy, Ambikapur (Chhattisgarh).
                By using our services you accept these terms in full.
              </p>
            </div>

            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="tm-section">
                <h2 className="tm-section-title">
                  <span className="tm-section-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                {s.body.map((p, j) => (
                  <p key={j} className="tm-text">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="tm-list">
                    {s.list.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Contact block */}
            <section id="contact" className="tm-contact-card">
              <h2 className="tm-contact-title">
                Questions About These Terms?
              </h2>
              <p className="tm-contact-text">
                For any clarification regarding these Terms &amp; Conditions,
                please contact us:
              </p>
              <div className="tm-contact-rows">
                <a href="tel:+917477036832" className="tm-contact-row">
                  <span className="tm-contact-icon">
                    <Phone size={15} strokeWidth={1.8} />
                  </span>
                  +91 74770 36832
                </a>
                <a
                  href="mailto:shivshakticomputeracademy25@gmail.com"
                  className="tm-contact-row"
                >
                  <span className="tm-contact-icon">
                    <Mail size={15} strokeWidth={1.8} />
                  </span>
                  shivshakticomputeracademy25@gmail.com
                </a>
                <div className="tm-contact-row tm-contact-row--static">
                  <span className="tm-contact-icon">
                    <MapPin size={15} strokeWidth={1.8} />
                  </span>
                  1st Floor, Above Usha Matching Center, Near Babra Petrol Pump,
                  Banaras Road, Phunderdihari, Ambikapur, Surguja, Chhattisgarh
                  – 497001
                </div>
              </div>
              <Link href="/contact" className="tm-contact-cta">
                Contact Us
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}