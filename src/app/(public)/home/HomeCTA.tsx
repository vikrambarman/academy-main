"use client";

import Link from "next/link";
import { Check, Phone, MapPin, ArrowRight } from "lucide-react";

/* All data from your ORIGINAL component — nothing invented. */
const checkpoints = [
  "Skill India & GSDM aligned programs",
  "DigiLocker verified certificates",
  "Web Development & Professional IT training",
  "Affordable education for all backgrounds",
];

const phones = [
  { num: "+91 74770 36832", href: "tel:+917477036832" },
  { num: "+91 90090 87883", href: "tel:+919009087883" },
];

export default function HomeCTA() {
  return (
    <>
      <section className="hcta-section" aria-labelledby="home-cta-heading">
        <div className="hcta-wrapper">
          <div className="hcta-card">
            {/* Left */}
            <div className="hcta-left">
              <div className="hcta-eyebrow">
                <span className="hcta-eyebrow-line" aria-hidden="true" />
                Start Today
              </div>

              <h2 id="home-cta-heading" className="hcta-heading">
                Secure Your Future with{" "}
                <em className="hcta-heading-em">Digital Skills</em>
              </h2>

              <p className="hcta-desc">
                Practical computer training, government-recognized certifications, and
                career-focused programs — designed for jobs, entrepreneurship and higher
                studies.
              </p>

              <ul className="hcta-checklist">
                {checkpoints.map((pt) => (
                  <li key={pt} className="hcta-check-item">
                    <span className="hcta-check-icon" aria-hidden="true">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="hcta-btns">
                <Link href="/courses" className="hcta-btn-primary">
                  View Courses
                  <ArrowRight size={16} strokeWidth={2} className="hcta-arrow" />
                </Link>
                <Link href="/enquiry" className="hcta-btn-outline">
                  Admission Enquiry
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="hcta-right">
              <h3 className="hcta-right-heading">Need Guidance? Talk to Us</h3>
              <p className="hcta-right-desc">
                Get help with course selection, eligibility criteria, certification
                details and admission guidance.
              </p>

              <div className="hcta-divider" />

              <div className="hcta-phones">
                {phones.map((p) => (
                  <a key={p.href} href={p.href} className="hcta-phone">
                    <span className="hcta-phone-icon" aria-hidden="true">
                      <Phone size={15} strokeWidth={1.8} />
                    </span>
                    <span className="hcta-phone-num">{p.num}</span>
                  </a>
                ))}
              </div>

              <p className="hcta-note">
                <MapPin size={14} strokeWidth={1.8} />
                Ambikapur, Chhattisgarh · Mon–Sat, 8 AM – 6 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
/* ── HOME CTA — Clean University style ── */
.hcta-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.hcta-wrapper { position: relative; max-width: 1100px; margin: 0 auto; }

.hcta-card {
  display: grid; grid-template-columns: 1fr 340px;
  border-radius: var(--radius-lg); overflow: hidden;
  background: var(--bg-elevated); border: 1px solid var(--border-color);
}

/* Left */
.hcta-left { position: relative; padding: var(--space-10) var(--space-10); }
.hcta-eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600);
}
.hcta-eyebrow-line { width: 20px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.hcta-heading {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.8vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: 0;
}
.hcta-heading-em { font-style: normal; color: var(--color-primary-700); }
.hcta-desc { font-size: var(--font-size-sm); line-height: 1.7; color: var(--text-secondary); margin: var(--space-4) 0 0; max-width: 440px; }
.hcta-checklist { list-style: none; padding: 0; margin: var(--space-6) 0 0; display: flex; flex-direction: column; gap: var(--space-2); }
.hcta-check-item { display: flex; align-items: center; gap: var(--space-3); font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: 0; }
.hcta-check-icon {
  width: 22px; height: 22px; border-radius: var(--radius-sm); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-primary-50); border: 1px solid var(--border-color); color: var(--color-primary-600);
}
.hcta-btns { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-8); }
.hcta-btn-primary {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6); border-radius: var(--radius-md);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: #fff; background: var(--color-primary-600); text-decoration: none;
  transition: background var(--transition-base);
}
.hcta-btn-primary:hover { background: var(--color-primary-700); color: #fff; }
.hcta-arrow { transition: transform var(--transition-fast); }
.hcta-btn-primary:hover .hcta-arrow { transform: translateX(3px); }
.hcta-btn-outline {
  display: inline-flex; align-items: center;
  padding: var(--space-3) var(--space-6); border-radius: var(--radius-md);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700); background: transparent;
  border: 1px solid var(--border-color-dark); text-decoration: none;
  transition: border-color var(--transition-base);
}
.hcta-btn-outline:hover { border-color: var(--color-primary-600); }

/* Right */
.hcta-right {
  position: relative; display: flex; flex-direction: column;
  padding: var(--space-8);
  background: var(--bg-surface);
  border-left: 1px solid var(--border-color);
}
.hcta-right-heading {
  font-family: var(--font-display); font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold); line-height: 1.3;
  color: var(--text-primary); margin-bottom: 0;
}
.hcta-right-desc { font-size: var(--font-size-sm); line-height: 1.65; color: var(--text-tertiary); margin: var(--space-3) 0 0; }
.hcta-divider { height: 1px; background: var(--border-color); margin: var(--space-6) 0; }
.hcta-phones { display: flex; flex-direction: column; gap: var(--space-3); }
.hcta-phone {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3); border-radius: var(--radius-md);
  border: 1px solid var(--border-color); background: var(--bg-elevated);
  text-decoration: none; transition: border-color var(--transition-base);
}
.hcta-phone:hover { border-color: var(--color-gray-300); }
.hcta-phone-icon {
  width: 32px; height: 32px; border-radius: var(--radius-md); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-primary-50); border: 1px solid var(--border-color); color: var(--color-primary-600);
}
.hcta-phone-num { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); }
.hcta-note {
  display: flex; align-items: center; gap: var(--space-2);
  margin-top: auto; padding-top: var(--space-5);
  font-size: var(--font-size-xs); line-height: 1.5; color: var(--text-tertiary); margin-bottom: 0;
}
.hcta-note svg { flex-shrink: 0; color: var(--color-accent-600); }

/* Responsive */
@media (max-width: 960px) {
  .hcta-card { grid-template-columns: 1fr; }
  .hcta-right { border-left: none; border-top: 1px solid var(--border-color); }
}
@media (max-width: 480px) {
  .hcta-section { padding: var(--space-16) var(--space-4); }
  .hcta-left { padding: var(--space-8) var(--space-6); }
  .hcta-right { padding: var(--space-6); }
  .hcta-btns { flex-direction: column; }
  .hcta-btn-primary, .hcta-btn-outline { justify-content: center; }
}
      `}</style>
    </>
  );
}
