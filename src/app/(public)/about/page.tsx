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

/* All data from your ORIGINAL — nothing invented. */
const stats = [
  { num: "10+", label: "Years Teaching Experience" },
  { num: "1000+", label: "Students Trained" },
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
    <>
      <main className="ab-root">
        {/* ── HERO ── */}
        <section className="ab-hero" aria-labelledby="ab-hero-heading">
          <div className="ab-wrap ab-hero-inner">
            <div className="ab-hero-left">
              <div className="ab-badge">
                <span className="ab-badge-dot" aria-hidden="true" />
                Government Recognized Institute
              </div>
              <h1 id="ab-hero-heading" className="ab-hero-title">
                Empowering <span className="ab-em">Digital Skills</span> in Ambikapur
              </h1>
              <p className="ab-hero-desc">
                Shivshakti Computer Academy is a trusted computer training institute in
                Ambikapur — built on practical learning, verified certification, and
                career-oriented digital skill development. With more than 10 years of
                teaching experience, our faculty builds strong digital foundations and
                practical confidence for every student.
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
                <Link href="/enquiry" className="ab-btn-outline">Get in Touch</Link>
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
                <span className="ab-float-icon"><GraduationCap size={20} strokeWidth={1.6} /></span>
                <div>
                  <div className="ab-float-title">10+ Years Teaching</div>
                  <div className="ab-float-sub">Experienced Faculty</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO WE ARE ── */}
        <section className="ab-section ab-who-section" aria-labelledby="ab-who-heading">
          <div className="ab-wrap ab-who-grid">
            <div>
              <div className="ab-eyebrow">
                <span className="ab-eyebrow-line" aria-hidden="true" />
                Who We Are
              </div>
              <h2 id="ab-who-heading" className="ab-section-title">
                A Centre Built on <span className="ab-em">Transparency &amp; Trust</span>
              </h2>
              <p className="ab-body-text" style={{ marginTop: "var(--space-5)" }}>
                Shivshakti Computer Academy is an Authorized Training Centre under Gramin
                Skill Development Mission. Our programs are designed to align with national
                skill development initiatives, ensuring students receive structured training
                and recognised certifications.
              </p>
              <p className="ab-body-text" style={{ marginTop: "var(--space-4)" }}>
                We follow a transparent training approach — students first learn through
                practical hands-on sessions, undergo proper assessment, and then receive
                verified certification from authorized organizations.
              </p>
              <div className="ab-who-points">
                {whoPoints.map((pt) => (
                  <div key={pt} className="ab-who-point">
                    <CheckCircle size={16} strokeWidth={2} className="ab-point-check" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote card */}
            <div className="ab-quote-card">
              <p className="ab-quote-text">
                &ldquo;Practical skills first. Honest certification. Long-term success — that
                is the promise we make to every student who walks through our doors.&rdquo;
              </p>
              <div className="ab-quote-divider" />
              <div className="ab-quote-author">
                <div className="ab-quote-avatar" aria-hidden="true">V</div>
                <div>
                  <div className="ab-quote-name">Shivshakti Computer Academy</div>
                  <div className="ab-quote-place">Ambikapur, Chhattisgarh</div>
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
        <section className="ab-section ab-rec-section" aria-labelledby="ab-rec-heading">
          <div className="ab-wrap">
            <div className="ab-rec-header">
              <div>
                <div className="ab-eyebrow">
                  <span className="ab-eyebrow-line" aria-hidden="true" />
                  Credentials
                </div>
                <h2 id="ab-rec-heading" className="ab-section-title">
                  Recognitions &amp; <span className="ab-em">Authorizations</span>
                </h2>
              </div>
              <p className="ab-rec-desc">
                Every recognition we hold is a commitment to quality, transparency and
                genuine certification for our students.
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
        <section className="ab-section ab-process-section" aria-labelledby="ab-process-heading">
          <div className="ab-wrap">
            <div className="ab-process-header">
              <div className="ab-eyebrow">
                <span className="ab-eyebrow-line" aria-hidden="true" />
                How It Works
              </div>
              <h2 id="ab-process-heading" className="ab-section-title">
                Training &amp; <span className="ab-em">Certification Process</span>
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
        <section className="ab-section ab-mv-section" aria-labelledby="ab-mv-heading">
          <div className="ab-wrap">
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
                <h3 className="ab-mv-title">Skills First. Honest Certification.</h3>
                <p className="ab-mv-body">
                  To provide affordable, practical and certified computer education that
                  builds job-ready skills and self-confidence among students across
                  Ambikapur and Surguja region.
                </p>
              </div>

              <div className="ab-mv-card ab-mv-card-vision">
                <div className="ab-mv-icon">
                  <Eye size={22} strokeWidth={1.6} />
                </div>
                <span className="ab-mv-tag">Vision</span>
                <h3 className="ab-mv-title">A Trusted Digital Learning Hub.</h3>
                <p className="ab-mv-body">
                  To become a trusted digital skill development institute recognised for
                  honest training, genuine certification, and long-term student success in
                  India&apos;s growing digital economy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOUNDER ── */}
        <section className="ab-section ab-founder-section" aria-labelledby="ab-founder-heading">
          <div className="ab-wrap">
            <div className="ab-founder-card">
              <div className="ab-founder-left">
                <div className="ab-founder-img-ring">
                  <div className="ab-founder-img-inner">
                    <Image
                      src="/founder.jpeg"
                      alt="Mr. Vikram Barman — Founder, Shivshakti Computer Academy"
                      fill
                      className="ab-founder-img"
                    />
                  </div>
                </div>
                <div className="ab-founder-meta">
                  <div className="ab-founder-name">Mr. Vikram Barman</div>
                  <div className="ab-founder-role">Founder &amp; Lead Instructor</div>
                </div>
              </div>

              <div className="ab-founder-right">
                <div className="ab-eyebrow">
                  <span className="ab-eyebrow-line" aria-hidden="true" />
                  Founder&apos;s Message
                </div>
                <h2 id="ab-founder-heading" className="ab-founder-title">
                  A Decade of Teaching. <span className="ab-em">A Vision for Impact.</span>
                </h2>
                <p className="ab-body-text">
                  With over 10 years of teaching experience, my journey in education has been
                  focused on helping students develop strong academic and digital
                  foundations. Before establishing this institute, I worked as a Senior
                  Computer Faculty at multiple institutions, training students in practical
                  computer applications and career-oriented skills.
                </p>
                <p className="ab-body-text" style={{ marginTop: "var(--space-4)" }}>
                  Shivshakti Computer Academy was founded with a clear vision — to provide
                  transparent, practical and skill-based computer education that prepares
                  students for real-world opportunities in today&apos;s digital era.
                </p>
                <div className="ab-founder-points">
                  {founderPoints.map((pt) => (
                    <div key={pt} className="ab-who-point">
                      <CheckCircle size={15} strokeWidth={2} className="ab-point-check" />
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
          <div className="ab-wrap ab-cta-inner">
            <div className="ab-cta-left">
              <h2 className="ab-cta-title">Ready to Start Your Digital Journey?</h2>
              <p className="ab-cta-desc">
                Join Shivshakti Computer Academy and build real skills with verified
                certifications.
              </p>
            </div>
            <div className="ab-cta-actions">
              <Link href="/courses" className="ab-btn-white">
                View Courses
                <ArrowRight size={16} strokeWidth={2} className="ab-btn-arrow" />
              </Link>
              <Link href="/enquiry" className="ab-btn-cta-ghost">Enquire Now</Link>
            </div>
          </div>
        </section>
      </main>

      <style>{`
/* ══════════════════ ABOUT — Clean University style ══════════════════ */
.ab-root { background: var(--bg-page); min-height: 100vh; }
.ab-wrap { max-width: 1180px; margin: 0 auto; padding: 0 var(--space-6); }

/* Shared atoms */
.ab-em { color: var(--color-primary-700); }
.ab-badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: var(--space-4);
}
.ab-badge-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; }
.ab-eyebrow {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.ab-eyebrow-line { width: 22px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.ab-section-title {
  font-family: var(--font-display); font-size: clamp(1.6rem, 3.4vw, 2.25rem);
  font-weight: var(--font-weight-semibold); line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: 0;
}
.ab-body-text { font-size: var(--font-size-base); line-height: 1.8; color: var(--text-secondary); margin: 0; }
.ab-who-point { display: flex; align-items: center; gap: var(--space-3); font-size: var(--font-size-sm); color: var(--text-secondary); }
.ab-point-check { color: var(--color-success); flex-shrink: 0; }

/* Buttons */
.ab-btn-primary, .ab-btn-outline, .ab-btn-white, .ab-btn-cta-ghost {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6); border-radius: var(--radius-md);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  text-decoration: none; transition: background var(--transition-base), border-color var(--transition-base);
}
.ab-btn-primary { background: var(--color-primary-600); color: #fff; }
.ab-btn-primary:hover { background: var(--color-primary-700); color: #fff; }
.ab-btn-outline { border: 1px solid var(--border-color-dark); color: var(--color-primary-700); background: transparent; }
.ab-btn-outline:hover { border-color: var(--color-primary-600); }
.ab-btn-white { background: #fff; color: var(--color-primary-800); }
.ab-btn-white:hover { background: var(--color-gray-100); color: var(--color-primary-800); }
.ab-btn-cta-ghost { border: 1px solid rgba(255,255,255,0.4); color: #fff; background: transparent; }
.ab-btn-cta-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.08); color: #fff; }
.ab-btn-arrow { transition: transform var(--transition-fast); }
.ab-btn-primary:hover .ab-btn-arrow, .ab-btn-white:hover .ab-btn-arrow { transform: translateX(3px); }

/* HERO */
.ab-hero {
  position: relative;
  padding: var(--space-20) 0;
  background:
    radial-gradient(120% 80% at 100% 0%, var(--color-primary-50) 0%, transparent 55%),
    var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.ab-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12); align-items: center; }
.ab-hero-title {
  font-family: var(--font-display); font-size: clamp(2rem, 4.6vw, 3rem);
  font-weight: var(--font-weight-semibold); line-height: 1.18; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: var(--space-4);
}
.ab-hero-desc { font-size: var(--font-size-base); line-height: 1.8; color: var(--text-secondary); margin-bottom: var(--space-6); }
.ab-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); margin-bottom: var(--space-6); }
.ab-stat-pill {
  padding: var(--space-4) var(--space-3); background: var(--bg-elevated);
  border: 1px solid var(--border-color); border-radius: var(--radius-md); text-align: center;
  transition: border-color var(--transition-base);
}
.ab-stat-pill:hover { border-color: var(--color-gray-300); }
.ab-stat-num { font-family: var(--font-display); font-size: clamp(1.4rem, 2.5vw, 1.85rem); font-weight: var(--font-weight-semibold); color: var(--color-primary-700); line-height: 1; margin-bottom: var(--space-1); }
.ab-stat-lbl { font-size: var(--font-size-xs); color: var(--text-tertiary); line-height: 1.35; }
.ab-hero-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }

.ab-hero-right { position: relative; }
.ab-img-frame {
  position: relative; border-radius: var(--radius-lg); overflow: hidden;
  aspect-ratio: 4 / 3; background: var(--color-gray-100);
  border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);
}
.ab-img { object-fit: cover; }
.ab-img-float {
  position: absolute; bottom: var(--space-4); left: var(--space-4);
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4); background: var(--bg-elevated);
  border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-xl);
}
.ab-float-icon {
  width: 36px; height: 36px; border-radius: var(--radius-md);
  background: var(--color-primary-50); border: 1px solid var(--border-color); color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ab-float-title { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1; }
.ab-float-sub { font-size: var(--font-size-xs); color: var(--text-tertiary); margin-top: 2px; }

/* Section shell */
.ab-section { position: relative; padding: var(--space-24) 0; border-bottom: 1px solid var(--border-color); }

/* WHO WE ARE */
.ab-who-section { background: var(--bg-page); }
.ab-who-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12); align-items: center; }
.ab-who-points { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-6); }

.ab-quote-card {
  position: relative; background: var(--color-primary-700);
  border-radius: var(--radius-lg); padding: var(--space-8);
}
.ab-quote-text {
  font-family: var(--font-display); font-size: var(--font-size-lg); font-style: italic;
  color: #fff; line-height: 1.7; margin: 0 0 var(--space-6);
}
.ab-quote-divider { height: 1px; background: rgba(255,255,255,0.15); margin-bottom: var(--space-5); }
.ab-quote-author { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-5); }
.ab-quote-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-weight: var(--font-weight-semibold); flex-shrink: 0;
}
.ab-quote-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: #fff; margin-bottom: 2px; }
.ab-quote-place { font-size: var(--font-size-xs); color: rgba(255,255,255,0.6); }
.ab-quote-pills { display: flex; gap: var(--space-2); }
.ab-qpill {
  padding: 3px var(--space-3); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
  border-radius: var(--radius-full); font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: rgba(255,255,255,0.85);
}

/* RECOGNITIONS */
.ab-rec-section { background: var(--bg-surface); }
.ab-rec-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: var(--space-6); margin-bottom: var(--space-10); }
.ab-rec-desc { font-size: var(--font-size-base); line-height: 1.7; color: var(--text-secondary); max-width: 360px; margin: 0; }
.ab-rec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
.ab-rec-card {
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-left: 2px solid var(--color-accent-500); border-radius: var(--radius-lg);
  padding: var(--space-5); display: flex; align-items: center; gap: var(--space-4);
  transition: border-color var(--transition-base);
}
.ab-rec-card:hover { border-color: var(--color-gray-300); border-left-color: var(--color-accent-500); }
.ab-rec-icon-box {
  width: 42px; height: 42px; border-radius: var(--radius-md);
  background: var(--color-primary-50); border: 1px solid var(--border-color); color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ab-rec-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.4; }

/* PROCESS — solid ink-blue (was dark gradient) */
.ab-process-section { background: var(--color-primary-800); border-bottom: none; }
.ab-process-section .ab-eyebrow { color: rgba(255,255,255,0.7); }
.ab-process-section .ab-eyebrow-line { background: rgba(255,255,255,0.5); }
.ab-process-section .ab-section-title { color: #fff; }
.ab-process-section .ab-em { color: var(--color-accent-400, #c68a52); }
.ab-process-header { margin-bottom: var(--space-12); }
.ab-process-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); }
.ab-step { padding-top: var(--space-2); border-top: 2px solid rgba(255,255,255,0.15); }
.ab-step-num {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  margin: var(--space-4) 0 var(--space-4);
}
.ab-step-title { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: #fff; margin-bottom: var(--space-2); line-height: 1.3; }
.ab-step-desc { font-size: var(--font-size-sm); line-height: 1.65; color: rgba(255,255,255,0.6); margin: 0; }

/* MISSION & VISION */
.ab-mv-section { background: var(--bg-page); }
.ab-mv-head { margin-bottom: var(--space-10); }
.ab-mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
.ab-mv-card {
  position: relative; background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600); border-radius: var(--radius-lg);
  padding: var(--space-8); transition: border-color var(--transition-base);
}
.ab-mv-card-vision { border-top-color: var(--color-accent-500); }
.ab-mv-card:hover { border-color: var(--color-gray-300); }
.ab-mv-icon {
  width: 48px; height: 48px; border-radius: var(--radius-md);
  background: var(--color-primary-50); border: 1px solid var(--border-color); color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4);
}
.ab-mv-card-vision .ab-mv-icon { background: var(--color-accent-50); color: var(--color-accent-600); }
.ab-mv-tag {
  display: inline-block; padding: 3px var(--space-3);
  background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-full);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.07em; text-transform: uppercase;
  color: var(--text-secondary); margin-bottom: var(--space-4);
}
.ab-mv-title { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.25; letter-spacing: -0.01em; margin-bottom: var(--space-3); }
.ab-mv-body { font-size: var(--font-size-sm); line-height: 1.8; color: var(--text-secondary); margin: 0; }

/* FOUNDER */
.ab-founder-section { background: var(--bg-surface); }
.ab-founder-card {
  display: grid; grid-template-columns: 280px 1fr;
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600); border-radius: var(--radius-lg); overflow: hidden;
}
.ab-founder-left {
  background: var(--color-primary-700); padding: var(--space-10) var(--space-8);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.ab-founder-img-ring {
  width: 120px; height: 120px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); padding: 4px; margin-bottom: var(--space-5);
}
.ab-founder-img-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.1); position: relative; }
.ab-founder-img { object-fit: cover; }
.ab-founder-meta { text-align: center; }
.ab-founder-name { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: #fff; margin-bottom: var(--space-1); }
.ab-founder-role { font-size: var(--font-size-xs); color: rgba(255,255,255,0.65); letter-spacing: 0.04em; }
.ab-founder-right { padding: var(--space-10); }
.ab-founder-title { font-family: var(--font-display); font-size: clamp(1.4rem, 2.4vw, 1.85rem); font-weight: var(--font-weight-semibold); line-height: 1.2; letter-spacing: -0.01em; color: var(--text-primary); margin-bottom: var(--space-5); }
.ab-founder-points { display: flex; flex-direction: column; gap: var(--space-2); margin: var(--space-5) 0 var(--space-6); }
.ab-founder-motto {
  display: inline-flex; align-items: center; padding: var(--space-3) var(--space-5);
  background: var(--color-primary-50); border: 1px solid var(--border-color); border-radius: var(--radius-md);
  font-family: var(--font-display); font-size: var(--font-size-sm); font-style: italic; font-weight: var(--font-weight-medium); color: var(--color-primary-700);
}

/* CTA — solid ink-blue */
.ab-cta-section { position: relative; padding: var(--space-16) 0; background: var(--color-primary-700); }
.ab-cta-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-8); }
.ab-cta-title { font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2rem); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.2; margin-bottom: var(--space-2); }
.ab-cta-desc { font-size: var(--font-size-base); color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0; }
.ab-cta-left { flex: 1; min-width: 280px; }
.ab-cta-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; flex-shrink: 0; }

/* RESPONSIVE */
@media (max-width: 1024px) {
  .ab-rec-grid { grid-template-columns: repeat(2, 1fr); }
  .ab-process-steps { grid-template-columns: repeat(2, 1fr); gap: var(--space-8); }
}
@media (max-width: 960px) {
  .ab-hero-inner { grid-template-columns: 1fr; gap: var(--space-10); }
  .ab-hero-right { max-width: 560px; margin: 0 auto; width: 100%; }
  .ab-who-grid { grid-template-columns: 1fr; gap: var(--space-10); }
  .ab-mv-grid { grid-template-columns: 1fr; }
  .ab-founder-card { grid-template-columns: 1fr; }
  .ab-founder-left { flex-direction: row; align-items: center; justify-content: flex-start; gap: var(--space-5); padding: var(--space-7) var(--space-8); }
  .ab-founder-img-ring { width: 80px; height: 80px; margin-bottom: 0; flex-shrink: 0; }
  .ab-founder-meta { text-align: left; }
  .ab-cta-inner { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 768px) {
  .ab-hero { padding: var(--space-16) 0; }
  .ab-section { padding: var(--space-16) 0; }
  .ab-process-section, .ab-cta-section { padding: var(--space-16) 0; }
  .ab-rec-grid { grid-template-columns: 1fr; }
  .ab-process-steps { grid-template-columns: 1fr; }
  .ab-founder-right { padding: var(--space-7) var(--space-6); }
  .ab-cta-actions { width: 100%; flex-direction: column; }
  .ab-btn-white, .ab-btn-cta-ghost { justify-content: center; }
  .ab-rec-header { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
  .ab-stats-row { grid-template-columns: 1fr; }
  .ab-hero-actions { flex-direction: column; }
  .ab-btn-primary, .ab-btn-outline { justify-content: center; }
  .ab-mv-card, .ab-quote-card { padding: var(--space-6); }
}
      `}</style>
    </>
  );
}
