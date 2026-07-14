import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award, Shield, Building2, FileCheck, Lock, Globe,
  ArrowRight, CheckCircle, Target, Eye, GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Shivshakti Computer Academy | Trusted Computer Training in Ambikapur",
  description:
    "Learn about Shivshakti Computer Academy in Ambikapur — a trusted computer training institute with 10+ years of teaching experience providing practical education and verified certifications.",
};

/* ─── Data (UNCHANGED) ─── */
const stats = [
  { num: "10+", label: "Years Teaching Experience" },
  { num: "100%", label: "Practical Training" },
  { num: "100%", label: "Verified Certificates" },
];

const recognitions = [
  { lucide: Globe, label: "MSME (Udyam) Registered Institute" },
  { lucide: Award, label: "ISO 9001:2015 Certified" },
  { lucide: Shield, label: "Authorized GSDM Training Centre" },
  { lucide: Building2, label: "Drishti Computer Education Franchise" },
  { lucide: FileCheck, label: "Skill India Aligned Programs" },
  { lucide: Lock, label: "DigiLocker Enabled Certificates" },
];

const processSteps = [
  { num: "01", title: "Enroll in Course", desc: "Choose a program suited to your goals and complete the registration process." },
  { num: "02", title: "Practical Training", desc: "100% hands-on training with dedicated computer systems and expert guidance." },
  { num: "03", title: "Assessment", desc: "Structured evaluation to measure your skills and knowledge progress." },
  { num: "04", title: "Certification", desc: "Receive a digitally verified, government-recognized certificate." },
];

const whoPoints = [
  "Practical-first training methodology",
  "Government-authorized certifications",
  "Transparent assessment process",
  "Career-focused curriculum design",
];

const founderPoints = [
  "10+ years of teaching experience",
  "Trained students across multiple institutions",
  "Practical, career-oriented teaching approach",
  "Committed to transparent and honest certification",
];

export default function AboutPage() {
  return (
    <main className="ab-root">
      {/* ── HERO ── */}
      <section className="ab-hero" aria-labelledby="ab-hero-heading">
        <div className="container ab-hero-inner">
          <div className="ab-hero-left">
            <div className="ab-badge">
              <span className="ab-badge-dot" aria-hidden="true" />
              Government Recognized Institute
            </div>
            <h1 id="ab-hero-heading" className="ab-hero-title">
              Empowering{" "}
              <span className="ab-em">Digital Skills</span>{" "}
              in Ambikapur
            </h1>
            <p className="ab-hero-desc">
              Shivshakti Computer Academy is a trusted computer training
              institute in Ambikapur — built on practical learning, verified
              certification, and career-oriented digital skill development.
              With more than 10 years of teaching experience, our faculty
              builds strong digital foundations and practical confidence for
              every student.
            </p>

            <div className="ab-stats-row">
              {stats.map((s) => (
                <div key={s.label} className="ab-stat-pill">
                  <div className="ab-stat-num">{s.num}</div>
                  <div className="ab-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="ab-hero-actions">
              <Link href="/courses" className="ab-btn-primary">
                Explore Courses
                <ArrowRight size={16} strokeWidth={2} className="ab-btn-arrow" />
              </Link>
              <Link href="/enquiry" className="ab-btn-outline">
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="ab-hero-right">
            <div className="ab-img-frame">
              <Image
                src="/about.avif"
                alt="Students learning practical computer training at Shivshakti Computer Academy, Ambikapur"
                fill
                sizes="(max-width: 960px) 100vw, 520px"
                className="ab-img"
                priority
              />
            </div>
            <div className="ab-img-float">
              <span className="ab-float-icon">
                <GraduationCap size={20} strokeWidth={1.6} />
              </span>
              <div>
                <div className="ab-float-title">10+ Years Teaching</div>
                <div className="ab-float-sub">Experienced Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section
        className="ab-section ab-who-section"
        aria-labelledby="ab-who-heading"
      >
        <div className="container ab-who-grid">
          <div>
            <div className="ab-eyebrow">
              <span className="ab-eyebrow-line" aria-hidden="true" />
              Who We Are
            </div>
            <h2 id="ab-who-heading" className="ab-section-title">
              A Centre Built on{" "}
              <span className="ab-em">Transparency &amp; Trust</span>
            </h2>
            <p className="ab-body-text" style={{ marginTop: "var(--space-5)" }}>
              Shivshakti Computer Academy is an Authorized Training Centre
              under Gramin Skill Development Mission. Our programs are designed
              to align with national skill development initiatives, ensuring
              students receive structured training and recognised certifications.
            </p>
            <p className="ab-body-text" style={{ marginTop: "var(--space-4)" }}>
              We follow a transparent training approach — students first learn
              through practical hands-on sessions, undergo proper assessment,
              and then receive verified certification from authorized
              organizations.
            </p>
            <div className="ab-who-points">
              {whoPoints.map((pt) => (
                <div key={pt} className="ab-who-point">
                  <CheckCircle
                    size={16}
                    strokeWidth={2}
                    className="ab-point-check"
                  />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote card */}
          <div className="ab-quote-card">
            <p className="ab-quote-text">
              &ldquo;Practical skills first. Honest certification. Long-term
              success — that is the promise we make to every student who walks
              through our doors.&rdquo;
            </p>
            <div className="ab-quote-divider" />
            <div className="ab-quote-author">
              <div className="ab-quote-avatar" aria-hidden="true">V</div>
              <div>
                <div className="ab-quote-name">
                  Shivshakti Computer Academy
                </div>
                <div className="ab-quote-place">
                  Ambikapur, Chhattisgarh
                </div>
              </div>
            </div>
            <div className="ab-quote-pills">
              <span className="ab-qpill">MSME ✓</span>
              <span className="ab-qpill">ISO ✓</span>
              <span className="ab-qpill">GSDM ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECOGNITIONS ── */}
      <section
        className="ab-section ab-rec-section"
        aria-labelledby="ab-rec-heading"
      >
        <div className="container">
          <div className="ab-rec-header">
            <div>
              <div className="ab-eyebrow">
                <span className="ab-eyebrow-line" aria-hidden="true" />
                Credentials
              </div>
              <h2 id="ab-rec-heading" className="ab-section-title">
                Recognitions &amp;{" "}
                <span className="ab-em">Authorizations</span>
              </h2>
            </div>
            <p className="ab-rec-desc">
              Every recognition we hold is a commitment to quality,
              transparency and genuine certification for our students.
            </p>
          </div>

          <div className="ab-rec-grid">
            {recognitions.map((r) => {
              const Icon = r.lucide;
              return (
                <div key={r.label} className="ab-rec-card">
                  <div className="ab-rec-icon-box">
                    <Icon size={18} strokeWidth={1.6} />
                  </div>
                  <div className="ab-rec-label">{r.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section
        className="ab-section ab-process-section"
        aria-labelledby="ab-process-heading"
      >
        <div className="container">
          <div className="ab-process-header">
            <div className="ab-eyebrow">
              <span className="ab-eyebrow-line" aria-hidden="true" />
              How It Works
            </div>
            <h2 id="ab-process-heading" className="ab-section-title">
              Training &amp;{" "}
              <span className="ab-em">Certification Process</span>
            </h2>
          </div>

          <div className="ab-process-steps">
            {processSteps.map((step) => (
              <div key={step.num} className="ab-step">
                <div className="ab-step-num">{step.num}</div>
                <h3 className="ab-step-title">{step.title}</h3>
                <p className="ab-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section
        className="ab-section ab-mv-section"
        aria-labelledby="ab-mv-heading"
      >
        <div className="container">
          <div className="ab-mv-head">
            <div className="ab-eyebrow">
              <span className="ab-eyebrow-line" aria-hidden="true" />
              Our Purpose
            </div>
            <h2 id="ab-mv-heading" className="ab-section-title">
              Mission &amp; <span className="ab-em">Vision</span>
            </h2>
          </div>

          <div className="ab-mv-grid">
            <div className="ab-mv-card ab-mv-card-mission">
              <div className="ab-mv-icon">
                <Target size={22} strokeWidth={1.6} />
              </div>
              <span className="ab-mv-tag">Mission</span>
              <h3 className="ab-mv-title">
                Skills First. Honest Certification.
              </h3>
              <p className="ab-mv-body">
                To provide affordable, practical and certified computer
                education that builds job-ready skills and self-confidence
                among students across Ambikapur and Surguja region.
              </p>
            </div>

            <div className="ab-mv-card ab-mv-card-vision">
              <div className="ab-mv-icon">
                <Eye size={22} strokeWidth={1.6} />
              </div>
              <span className="ab-mv-tag">Vision</span>
              <h3 className="ab-mv-title">A Trusted Digital Learning Hub.</h3>
              <p className="ab-mv-body">
                To become a trusted digital skill development institute
                recognised for honest training, genuine certification, and
                long-term student success in India&apos;s growing digital
                economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section
        className="ab-section ab-founder-section"
        aria-labelledby="ab-founder-heading"
      >
        <div className="container">
          <div className="ab-founder-card">
            <div className="ab-founder-left">
              <div className="ab-founder-img-ring">
                <div className="ab-founder-img-inner">
                  <Image
                    src="/founder.jpg"
                    alt="Mr. Vikram Barman — Founder, Shivshakti Computer Academy"
                    fill
                    className="ab-founder-img"
                  />
                </div>
              </div>
              <div className="ab-founder-meta">
                <div className="ab-founder-name">Mr. Vikram Barman</div>
                <div className="ab-founder-role">
                  Founder &amp; Lead Instructor
                </div>
              </div>
            </div>

            <div className="ab-founder-right">
              <div className="ab-eyebrow">
                <span className="ab-eyebrow-line" aria-hidden="true" />
                Founder&apos;s Message
              </div>
              <h2 id="ab-founder-heading" className="ab-founder-title">
                A Decade of Teaching.{" "}
                <span className="ab-em">A Vision for Impact.</span>
              </h2>
              <p className="ab-body-text">
                With over 10 years of teaching experience, my journey in
                education has been focused on helping students develop strong
                academic and digital foundations. Before establishing this
                institute, I worked as a Senior Computer Faculty at multiple
                institutions, training students in practical computer
                applications and career-oriented skills.
              </p>
              <p className="ab-body-text" style={{ marginTop: "var(--space-4)" }}>
                Shivshakti Computer Academy was founded with a clear vision —
                to provide transparent, practical and skill-based computer
                education that prepares students for real-world opportunities
                in today&apos;s digital era.
              </p>
              <div className="ab-founder-points">
                {founderPoints.map((pt) => (
                  <div key={pt} className="ab-who-point">
                    <CheckCircle
                      size={15}
                      strokeWidth={2}
                      className="ab-point-check"
                    />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
              <div className="ab-founder-motto">
                &ldquo;Skills First. Certification With Integrity.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="ab-cta-section">
        <div className="container ab-cta-inner">
          <div className="ab-cta-left">
            <h2 className="ab-cta-title">
              Ready to Start Your Digital Journey?
            </h2>
            <p className="ab-cta-desc">
              Join Shivshakti Computer Academy and build real skills with
              verified certifications.
            </p>
          </div>
          <div className="ab-cta-actions">
            <Link href="/courses" className="ab-btn-white">
              View Courses
              <ArrowRight size={16} strokeWidth={2} className="ab-btn-arrow" />
            </Link>
            <Link href="/enquiry" className="ab-btn-cta-ghost">
              Enquire Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}