"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Award,
  FileCheck,
  Globe,
  Lock,
  Building2,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

/* ============================================================
   University admission partnership (NEW)
   - Honest wording: we FACILITATE admissions (via College Vidya).
   - SEO: degree course names included as text.
   ============================================================ */
const universityPartner = {
  name: "Mangalayatan University",
  mode: "Online & Distance Education",
  note: "Admission Assistance Partner",
  via: "Authorized through College Vidya",
  description:
    "We assist students with admissions to Mangalayatan University's UGC-entitled online and distance education degree programs — including BCA, BA, B.Com, BSc, MSc and MBA — right here in Ambikapur.",
  programs: ["BCA", "BA", "B.Com", "BSc", "MSc", "MBA"],
  image: "/images/affiliations/mangalayatan.jpg",
  cta: "/contact",
};

/* All affiliation data from your ORIGINAL — nothing invented. */
const affiliations = [
  {
    title: "Mangalayatan University",
    description:
      "Admission assistance for online & distance degree programs (BCA, BA, B.Com, BSc, MSc, MBA) via College Vidya.",
    image: "/images/affiliations/mangalayatan.jpg",
    badge: "University Partner",
    icon: GraduationCap,
  },
  {
    title: "ISO 9001:2015 Certified",
    description:
      "International quality standards for education management and professional training delivery.",
    image: "/images/accreditations/iso.jpg",
    badge: "Quality",
    icon: Award,
  },
  {
    title: "Gramin Skill Development Mission",
    description:
      "Authorized training centre aligned with Skill India initiatives and government-recognized diploma programs.",
    image: "/images/affiliations/gsdm.jpg",
    badge: "Govt. Authorized",
    icon: Shield,
  },
  {
    title: "Drishti Computer Education",
    description:
      "Authorized franchise partner providing verified certification for professional courses.",
    image: "/images/affiliations/drishti.jpg",
    badge: "Franchise Partner",
    icon: Building2,
  },
  {
    title: "Skill India & NSDC",
    description:
      "Selected course certificates verifiable through Skill India and NSDC platforms.",
    image: "/images/affiliations/skillindia.jpg",
    badge: "Skill India",
    icon: FileCheck,
  },
  {
    title: "DigiLocker Enabled",
    description:
      "Diploma certificates accessible digitally via DigiLocker with lifetime verification.",
    image: "/images/affiliations/digilocker.jpg",
    badge: "Digital",
    icon: Lock,
  },
  {
    title: "MSME Registered Institute",
    description:
      "Government-registered MSME institute ensuring authenticity and legal compliance.",
    image: "/images/accreditations/msme.jpg",
    badge: "Registered",
    icon: Globe,
  },
];

const trustMarks = [
  "Skill India",
  "NSDC",
  "DigiLocker",
  "ISO 9001:2015",
  "MSME Udyam",
  "GSDM",
];

export default function PartnersAndCertifications() {
  return (
    <>
      <style>{styles}</style>

      <section className="pc-section" aria-labelledby="partners-heading">
        <div className="pc-wrap">
          {/* ── Header ── */}
          <div className="pc-header">
            <div className="pc-badge">
              <span className="pc-badge-dot" aria-hidden="true" />
              Recognitions &amp; Affiliations
            </div>
            <h2 id="partners-heading" className="pc-title">
              Partners &amp; <span className="pc-title-em">Certifications</span>
            </h2>
            <p className="pc-lead">
              Government-recognized certifications, a university admission partnership,
              and authorized training affiliations — ensuring transparency and
              credibility for every student we train.
            </p>
          </div>

          {/* ── University Partner — highlight banner ── */}
          <div className="pc-uni-banner">
            <div className="pc-uni-left">
              <div className="pc-uni-logo">
                <Image
                  src={universityPartner.image}
                  alt={`${universityPartner.name} logo`}
                  fill
                  sizes="96px"
                  className="pc-uni-logo-img"
                />
              </div>
            </div>

            <div className="pc-uni-main">
              <span className="pc-uni-tag">
                <GraduationCap size={13} strokeWidth={2} />
                {universityPartner.note}
              </span>
              <h3 className="pc-uni-name">
                {universityPartner.name}
                <span className="pc-uni-mode"> · {universityPartner.mode}</span>
              </h3>
              <p className="pc-uni-desc">{universityPartner.description}</p>

              <div className="pc-uni-programs" aria-label="Available degree programs">
                {universityPartner.programs.map((p) => (
                  <span key={p} className="pc-uni-program">
                    {p}
                  </span>
                ))}
              </div>

              <p className="pc-uni-via">{universityPartner.via}</p>
            </div>

            <div className="pc-uni-action">
              <Link href={universityPartner.cta} className="pc-uni-btn">
                Enquire About Degrees
                <ArrowRight size={15} strokeWidth={2} className="pc-uni-arrow" />
              </Link>
            </div>
          </div>

          {/* ── Cards grid ── */}
          <div className="pc-grid">
            {affiliations.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="pc-card">
                  <div className="pc-card-top">
                    <div className="pc-logo-box">
                      <Image
                        src={item.image}
                        alt={`${item.title} logo`}
                        fill
                        sizes="72px"
                        className="pc-logo-img"
                      />
                    </div>
                    <div className="pc-card-icon">
                      <Icon size={18} strokeWidth={1.6} />
                    </div>
                  </div>

                  <span className="pc-type-badge">{item.badge}</span>

                  <h3 className="pc-card-title">{item.title}</h3>
                  <p className="pc-card-desc">{item.description}</p>
                </article>
              );
            })}
          </div>

          {/* ── Trust strip ── */}
          <div className="pc-trust-strip">
            <span className="pc-strip-label">Verified by</span>
            <div className="pc-strip-divider" aria-hidden="true" />
            <div className="pc-strip-items">
              {trustMarks.map((t) => (
                <div key={t} className="pc-strip-item">
                  <span className="pc-strip-dot" aria-hidden="true" />
                  <span className="pc-strip-text">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const styles = `
/* ==========================================
   PARTNERS & CERTIFICATIONS — Clean University style
   Uses global tokens. Flat, hairline borders, calm.
   ========================================== */

.pc-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.pc-wrap { position: relative; max-width: 1180px; margin: 0 auto; }

/* ── Header (left aligned) ── */
.pc-header { max-width: 600px; margin: 0 0 var(--space-8); }
.pc-badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.pc-badge-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; }
.pc-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.4vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: var(--space-3);
}
.pc-title-em { color: var(--color-primary-700); }
.pc-lead { font-size: var(--font-size-base); line-height: 1.7; color: var(--text-secondary); margin: 0; }

/* ── University banner ── */
.pc-uni-banner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-6);
  align-items: center;
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  border-left: 3px solid var(--color-primary-600);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
}
.pc-uni-left { display: flex; align-items: center; }
.pc-uni-logo {
  position: relative;
  width: 92px; height: 92px;
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  flex-shrink: 0;
  overflow: hidden;
}
.pc-uni-logo-img { object-fit: contain; padding: var(--space-3); }

.pc-uni-main { min-width: 0; }
.pc-uni-tag {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  letter-spacing: 0.08em; text-transform: uppercase;
  margin-bottom: var(--space-2);
}
.pc-uni-name {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.4vw, 1.6rem);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-2);
  line-height: 1.25;
}
.pc-uni-mode { color: var(--text-tertiary); font-size: var(--font-size-base); font-weight: var(--font-weight-normal); }
.pc-uni-desc { font-size: var(--font-size-sm); line-height: 1.7; color: var(--text-secondary); margin: 0 0 var(--space-4); max-width: 64ch; }

.pc-uni-programs { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-3); }
.pc-uni-program {
  padding: var(--space-1) var(--space-3);
  background: var(--color-white);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
}
.pc-uni-via { font-size: var(--font-size-xs); color: var(--text-tertiary); margin: 0; }

.pc-uni-action { display: flex; align-items: center; }
.pc-uni-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary-600);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  white-space: nowrap;
  transition: background var(--transition-base);
}
.pc-uni-btn:hover { background: var(--color-primary-700); color: #fff; }
.pc-uni-arrow { transition: transform var(--transition-fast); }
.pc-uni-btn:hover .pc-uni-arrow { transform: translateX(3px); }

/* ── Cards grid ── */
.pc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin-bottom: var(--space-8);
}
.pc-card {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex; flex-direction: column;
  transition: border-color var(--transition-base);
}
.pc-card:hover { border-color: var(--color-gray-300); }

.pc-card-top {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: var(--space-4);
}
.pc-logo-box { position: relative; width: 72px; height: 44px; flex-shrink: 0; }
.pc-logo-img { object-fit: contain; object-position: left center; }
.pc-card-icon {
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  border: 1px solid var(--border-color);
  color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.pc-type-badge {
  display: inline-block;
  padding: 3px var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
  width: fit-content;
}
.pc-card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1.35;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-2);
}
.pc-card-desc { font-size: var(--font-size-sm); line-height: 1.65; color: var(--text-secondary); margin: 0; flex: 1; }

/* ── Trust strip ── */
.pc-trust-strip {
  display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-4);
  padding: var(--space-6);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}
.pc-strip-label {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--text-tertiary); white-space: nowrap; flex-shrink: 0;
}
.pc-strip-divider { width: 1px; height: 20px; background: var(--border-color); flex-shrink: 0; }
.pc-strip-items { display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-2) var(--space-5); flex: 1; }
.pc-strip-item { display: flex; align-items: center; gap: var(--space-2); }
.pc-strip-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-accent-500); flex-shrink: 0; }
.pc-strip-text { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); white-space: nowrap; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .pc-grid { grid-template-columns: repeat(2, 1fr); }
  .pc-uni-banner { grid-template-columns: auto 1fr; }
  .pc-uni-action { grid-column: 1 / -1; }
  .pc-uni-btn { width: 100%; justify-content: center; }
}
@media (max-width: 768px) {
  .pc-section { padding: var(--space-16) var(--space-4); }
  .pc-uni-banner { grid-template-columns: 1fr; text-align: left; padding: var(--space-6); }
  .pc-trust-strip { flex-direction: column; align-items: flex-start; gap: var(--space-3); }
  .pc-strip-divider { display: none; }
}
@media (max-width: 640px) {
  .pc-grid { grid-template-columns: 1fr; }
}
`;
