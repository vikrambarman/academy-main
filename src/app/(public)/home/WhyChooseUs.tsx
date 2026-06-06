"use client";

import {
  MonitorCheck,
  Award,
  Briefcase,
  Users,
  ShieldCheck,
  Rocket,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

/* All data from your ORIGINAL component — nothing invented. */
const points = [
  { icon: MonitorCheck, title: "Practical Computer Training", desc: "Hands-on learning with dedicated systems and real-time practical sessions." },
  { icon: Award, title: "Recognized Certifications", desc: "Certificates aligned with Skill India initiatives and DigiLocker verification." },
  { icon: Briefcase, title: "Career-Oriented Programs", desc: "Industry-focused courses designed for employment and digital careers." },
  { icon: Users, title: "Supportive Learning", desc: "Guided training environment that helps students learn confidently." },
  { icon: ShieldCheck, title: "Trusted Local Institute", desc: "Established computer training institute serving Ambikapur and nearby regions." },
  { icon: Rocket, title: "Skill-Based Growth", desc: "Programs designed for job readiness, freelancing and self-employment." },
];

const highlights = [
  { title: "Practical-First Learning", desc: "Every course emphasizes hands-on computer practice from day one." },
  { title: "Verified Certifications", desc: "Certificates supported by recognised national platforms." },
  { title: "Career-Oriented Curriculum", desc: "Programs designed for real-world digital career opportunities." },
];

const miniStats = [
  { val: "10+", lbl: "Years Experience" },
  { val: "25+", lbl: "Courses Offered" },
  { val: "1K+", lbl: "Students Trained" },
];

export default function WhyChooseUs() {
  return (
    <>
      <section className="wcu-section" aria-labelledby="why-choose-heading">
        <div className="wcu-wrap">
          {/* Header */}
          <div className="wcu-header">
            <div className="wcu-badge">
              <span className="wcu-badge-dot" aria-hidden="true" />
              Why Choose Us
            </div>
            <h2 id="why-choose-heading" className="wcu-title">
              Why Students Choose <span className="wcu-title-em">Shivshakti Academy</span>
            </h2>
            <p className="wcu-subtitle">
              Practical training, recognised certifications and career-focused learning —
              built to help students thrive in the digital world.
            </p>
          </div>

          {/* Body */}
          <div className="wcu-body">
            {/* Left — feature list */}
            <div className="wcu-left">
              {points.map((pt, i) => {
                const Icon = pt.icon;
                return (
                  <div key={pt.title} className="wcu-feat">
                    <div className="wcu-feat-num">{String(i + 1).padStart(2, "0")}</div>
                    <div className="wcu-feat-icon">
                      <Icon size={20} strokeWidth={1.6} />
                    </div>
                    <div className="wcu-feat-body">
                      <h3 className="wcu-feat-title">{pt.title}</h3>
                      <p className="wcu-feat-desc">{pt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right — sticky panel */}
            <div className="wcu-right">
              <div className="wcu-panel">
                <p className="wcu-panel-lead">
                  Our training approach is built around what students actually need —
                  practical skills, valid certificates and a clear path to employment.
                </p>

                <div className="wcu-highlights">
                  {highlights.map((h) => (
                    <div key={h.title} className="wcu-hl">
                      <div className="wcu-hl-check">
                        <CheckCircle size={16} strokeWidth={2} />
                      </div>
                      <div className="wcu-hl-text">
                        <div className="wcu-hl-title">{h.title}</div>
                        <div className="wcu-hl-desc">{h.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="wcu-panel-divider" />

                <div className="wcu-mini-stats">
                  {miniStats.map((s) => (
                    <div key={s.lbl} className="wcu-mini-stat">
                      <div className="wcu-mini-val">{s.val}</div>
                      <div className="wcu-mini-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>

                <div className="wcu-panel-divider" />

                <a href="/courses" className="wcu-panel-cta">
                  Explore All Courses
                  <ArrowRight size={16} strokeWidth={2} className="wcu-cta-arrow" />
                </a>

                <p className="wcu-panel-note">Ambikapur, Surguja, Chhattisgarh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
/* ── WHY CHOOSE US — Clean University style ── */
.wcu-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.wcu-wrap { position: relative; max-width: 1180px; margin: 0 auto; }

.wcu-header { max-width: 640px; margin: 0 0 var(--space-12); }
.wcu-badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.wcu-badge-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; }
.wcu-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.6vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: var(--space-3);
}
.wcu-title-em { color: var(--color-primary-700); }
.wcu-subtitle { font-size: var(--font-size-base); line-height: 1.7; color: var(--text-secondary); margin: 0; }

.wcu-body { display: grid; grid-template-columns: 1fr 360px; gap: var(--space-10); align-items: start; }
.wcu-left { display: flex; flex-direction: column; }

.wcu-feat {
  position: relative;
  display: grid; grid-template-columns: 32px 44px 1fr; gap: var(--space-4);
  align-items: start; padding: var(--space-5) var(--space-4);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-base);
}
.wcu-feat:not(:last-child) { border-bottom: 1px solid var(--border-color); border-radius: 0; }
.wcu-feat:hover { background: var(--bg-surface); }
.wcu-feat-num {
  font-family: var(--font-display); font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold); color: var(--color-gray-300);
  padding-top: 12px; text-align: right; user-select: none;
}
.wcu-feat:hover .wcu-feat-num { color: var(--color-primary-400); }
.wcu-feat-icon {
  width: 44px; height: 44px; border-radius: var(--radius-md);
  background: var(--color-primary-50); border: 1px solid var(--border-color);
  color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.wcu-feat-body { padding-top: var(--space-1); }
.wcu-feat-title {
  font-family: var(--font-display); font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold); color: var(--text-primary);
  margin-bottom: var(--space-1); letter-spacing: -0.01em;
}
.wcu-feat-desc { font-size: var(--font-size-sm); line-height: 1.65; color: var(--text-secondary); margin: 0; }

.wcu-right { position: sticky; top: 100px; }
.wcu-panel {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
}
.wcu-panel-lead { font-size: var(--font-size-sm); line-height: 1.7; color: var(--text-secondary); margin-bottom: var(--space-6); }
.wcu-highlights { display: flex; flex-direction: column; gap: var(--space-4); }
.wcu-hl { display: flex; align-items: flex-start; gap: var(--space-3); }
.wcu-hl-check {
  width: 30px; height: 30px; border-radius: var(--radius-md);
  background: var(--color-primary-50); border: 1px solid var(--border-color);
  color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
}
.wcu-hl-title { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin-bottom: 2px; }
.wcu-hl-desc { font-size: var(--font-size-xs); line-height: 1.6; color: var(--text-tertiary); }
.wcu-panel-divider { height: 1px; background: var(--border-color); margin: var(--space-6) 0; }
.wcu-mini-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
.wcu-mini-stat {
  text-align: center; padding: var(--space-3) var(--space-2);
  border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border-color);
}
.wcu-mini-val { font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--color-primary-700); line-height: 1; margin-bottom: 4px; }
.wcu-mini-lbl { font-size: var(--font-size-xs); color: var(--text-tertiary); line-height: 1.3; }
.wcu-panel-cta {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  width: 100%; padding: var(--space-3) var(--space-6);
  background: var(--color-primary-600); color: #fff;
  border-radius: var(--radius-md); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  text-decoration: none; transition: background var(--transition-base);
}
.wcu-panel-cta:hover { background: var(--color-primary-700); color: #fff; }
.wcu-cta-arrow { transition: transform var(--transition-fast); }
.wcu-panel-cta:hover .wcu-cta-arrow { transform: translateX(3px); }
.wcu-panel-note { text-align: center; margin-top: var(--space-4); font-size: var(--font-size-xs); color: var(--text-tertiary); margin-bottom: 0; }

@media (max-width: 1024px) { .wcu-body { grid-template-columns: 1fr 320px; gap: var(--space-8); } }
@media (max-width: 768px) {
  .wcu-section { padding: var(--space-16) var(--space-4); }
  .wcu-body { grid-template-columns: 1fr; gap: var(--space-8); }
  .wcu-right { position: static; order: -1; }
}
@media (max-width: 480px) {
  .wcu-feat-num { display: none; }
  .wcu-feat { grid-template-columns: 44px 1fr; gap: var(--space-3); padding: var(--space-4) var(--space-3); }
}
      `}</style>
    </>
  );
}
