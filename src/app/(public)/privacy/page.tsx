import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Shivshakti Computer Academy, Ambikapur",
  description:
    "Privacy Policy of Shivshakti Computer Academy, Ambikapur — how we collect, use, store and protect the personal information of our students, visitors and enquiry submissions.",
  alternates: { canonical: "https://www.shivshakticomputer.in/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "6 June 2026";

const sections = [
  {
    id: "info-we-collect",
    title: "Information We Collect",
    body: [
      "When you interact with Shivshakti Computer Academy — by submitting an enquiry, enrolling in a course, or contacting us — we may collect the following information:",
    ],
    list: [
      "Personal details such as your name, mobile number, email address and postal address.",
      "Academic and enrollment details (preferred course, qualification, batch).",
      "Identity/eligibility documents you choose to share for admission or certification.",
      "Messages and queries you send through our enquiry or contact forms.",
      "Basic technical data (such as browser type and pages visited) collected automatically when you use our website.",
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    body: [
      "We use the information we collect only for legitimate purposes related to our training services, including:",
    ],
    list: [
      "Responding to your enquiries and providing admission guidance.",
      "Processing course enrollment, attendance and certification.",
      "Issuing and verifying certificates (including through platforms such as DigiLocker, where applicable).",
      "Sending important updates about classes, schedules, notices and results.",
      "Improving our courses, website and overall student experience.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing of Information",
    body: [
      "We do not sell or rent your personal information to anyone. We may share limited information only when necessary:",
    ],
    list: [
      "With authorized certification or affiliation partners (for example, Skill India, GSDM, or franchise/university partners) solely for issuing valid certificates or processing admissions you have requested.",
      "With government bodies or authorities where required by law.",
      "With trusted service providers (such as our website hosting or communication tools) who are bound to keep your data confidential.",
    ],
  },
  {
    id: "university-admissions",
    title: "University & Third-Party Admissions",
    body: [
      "For university degree programs (such as online and distance education admissions facilitated through our partnerships), some of your details may be shared with the respective university or its authorized admission partner to complete your admission. This is done only with your consent and only to the extent required to process your application.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    body: [
      "We take reasonable technical and organizational measures to protect your personal information against unauthorized access, loss or misuse. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    body: [
      "We retain your information only for as long as it is needed to provide our services, maintain academic and certification records, and comply with legal obligations. Enrollment and certificate records may be retained for longer periods to support verification requests.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    body: ["You have the right to:"],
    list: [
      "Request access to the personal information we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of your information, subject to our legal and record-keeping obligations.",
      "Withdraw consent for non-essential communications at any time.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Website Data",
    body: [
      "Our website may use basic cookies and similar technologies to remember your preferences (such as light/dark theme) and to understand how visitors use the site. You can control or disable cookies through your browser settings.",
    ],
  },
  {
    id: "childrens",
    title: "Students Below 18",
    body: [
      "Many of our foundation courses are open to younger students. For learners below the age of 18, we expect a parent or guardian to provide consent and oversee the sharing of any personal information.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised 'Last updated' date.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="pv-root">
      {/* ── HERO ── */}
      <section className="pv-hero">
        <div className="pv-wrap">
          <div className="pv-eyebrow">
            <span className="pv-eyebrow-line" aria-hidden="true" />
            Legal
          </div>
          <h1 className="pv-title">Privacy Policy</h1>
          <p className="pv-lead">
            Your privacy matters to us. This policy explains how Shivshakti
            Computer Academy collects, uses and protects the information you
            share with us.
          </p>
          <p className="pv-updated">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="pv-body">
        <div className="pv-wrap pv-grid">
          {/* TOC (desktop) */}
          <aside className="pv-toc" aria-label="On this page">
            <div className="pv-toc-label">On this page</div>
            <nav className="pv-toc-nav">
              {sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} className="pv-toc-link">
                  <span className="pv-toc-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="pv-content">
            <div className="pv-intro">
              <p>
                Shivshakti Computer Academy (&ldquo;we&rdquo;, &ldquo;our&rdquo;,
                &ldquo;us&rdquo;), located in Ambikapur, Chhattisgarh, is committed
                to protecting the privacy of our students, visitors and anyone who
                interacts with us. By using our website or services, you agree to
                the practices described in this policy.
              </p>
            </div>

            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="pv-section">
                <h2 className="pv-section-title">
                  <span className="pv-section-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                {s.body.map((p, j) => (
                  <p key={j} className="pv-text">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="pv-list">
                    {s.list.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Contact block */}
            <section id="contact" className="pv-contact-card">
              <h2 className="pv-contact-title">
                Questions About Your Privacy?
              </h2>
              <p className="pv-contact-text">
                If you have any questions about this Privacy Policy or wish to
                exercise your rights, please reach out to us:
              </p>
              <div className="pv-contact-rows">
                <a href="tel:+917477036832" className="pv-contact-row">
                  <span className="pv-contact-icon">
                    <Phone size={15} strokeWidth={1.8} />
                  </span>
                  +91 74770 36832
                </a>
                <a
                  href="mailto:shivshakticomputeracademy25@gmail.com"
                  className="pv-contact-row"
                >
                  <span className="pv-contact-icon">
                    <Mail size={15} strokeWidth={1.8} />
                  </span>
                  shivshakticomputeracademy25@gmail.com
                </a>
                <div className="pv-contact-row pv-contact-row--static">
                  <span className="pv-contact-icon">
                    <MapPin size={15} strokeWidth={1.8} />
                  </span>
                  1st Floor, Above Usha Matching Center, Near Babra Petrol Pump,
                  Banaras Road, Phunderdihari, Ambikapur, Surguja, Chhattisgarh
                  – 497001
                </div>
              </div>
              <Link href="/enquiry" className="pv-contact-cta">
                Contact Us
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}