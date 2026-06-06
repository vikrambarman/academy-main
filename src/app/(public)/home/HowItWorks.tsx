"use client";

import {
  Target,
  Laptop,
  Award,
  ArrowRight,
  Bot,
  BookOpen,
  Sparkles,
  CheckCircle,
} from "lucide-react";

/* All data from your ORIGINAL component — nothing invented. */

const steps = [
  {
    number: "01",
    title: "Choose Your Course",
    desc: "Select from diploma, certification or professional IT programs based on your career goals and background.",
    icon: Target,
  },
  {
    number: "02",
    title: "Practical Training",
    desc: "Attend hands-on training sessions with real-time computer practice, expert guidance and LMS access.",
    icon: Laptop,
  },
  {
    number: "03",
    title: "Get Certified",
    desc: "Receive government-recognized and digitally verifiable certificates through DigiLocker after completion.",
    icon: Award,
  },
];

const quickBenefits = [
  "No prior experience needed",
  "Flexible batch timings",
  "Hindi & English medium",
  "Certificate in 30–180 days",
];

const upcomingFeatures = [
  {
    icon: Bot,
    tag: "Coming Soon",
    title: "AI Learning Assistant",
    desc: "Get instant answers to your course doubts 24/7. Our AI assistant will guide visitors and enrolled students — anytime, anywhere.",
    points: [
      "Ask any course-related question",
      "Available to public visitors",
      "Deeper access for enrolled students",
    ],
  },
  {
    icon: BookOpen,
    tag: "On Admission",
    title: "Lifetime LMS Access",
    desc: "Every admitted student gets lifetime access to our Learning Management System — practice modules, resources and progress tracking.",
    points: [
      "Activates on course admission",
      "Practice at your own pace",
      "Lifetime access, no expiry",
    ],
  },
];

export default function HowItWorks() {
  return (
    <>
      <style>{styles}</style>

      <section className="hiw-section" aria-labelledby="how-it-works-heading">
        <div className="hiw-wrap">
          {/* ── Header ── */}
          <div className="hiw-header">
            <div className="hiw-badge">
              <span className="hiw-badge-dot" aria-hidden="true" />
              The Process
            </div>
            <h2 id="how-it-works-heading" className="hiw-title">
              How It <span className="hiw-title-em">Works</span>
            </h2>
            <p className="hiw-subtitle">
              A simple 3-step journey from enrollment to a government-recognized
              certificate — with lifetime support.
            </p>
          </div>

          {/* ── Steps ── */}
          <div className="hiw-steps">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="hiw-step">
                  <div className="hiw-step-ghost" aria-hidden="true">
                    {step.number}
                  </div>

                  <div className="hiw-step-icon">
                    <Icon size={24} strokeWidth={1.6} />
                  </div>

                  <h3 className="hiw-step-title">{step.title}</h3>
                  <p className="hiw-step-desc">{step.desc}</p>

                  {i < steps.length - 1 && (
                    <div className="hiw-step-arrow" aria-hidden="true">
                      <ArrowRight size={18} strokeWidth={2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Quick benefits strip ── */}
          <div className="hiw-benefits">
            {quickBenefits.map((b) => (
              <div key={b} className="hiw-benefit">
                <CheckCircle size={15} strokeWidth={2} className="hiw-benefit-icon" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          {/* ── Upcoming Features ── */}
          <div className="hiw-upcoming-header">
            <div className="hiw-upcoming-eyebrow">
              <Sparkles size={14} strokeWidth={2} />
              What&apos;s Coming for Our Students
            </div>
          </div>

          <div className="hiw-upcoming-grid">
            {upcomingFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="hiw-uf-card">
                  <div className="hiw-uf-top">
                    <div className="hiw-uf-icon">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <span className="hiw-uf-tag">{feat.tag}</span>
                  </div>

                  <h3 className="hiw-uf-title">{feat.title}</h3>
                  <p className="hiw-uf-desc">{feat.desc}</p>

                  <ul className="hiw-uf-points">
                    {feat.points.map((pt) => (
                      <li key={pt} className="hiw-uf-point">
                        <span className="hiw-uf-dot" aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

const styles = `
/* ==========================================
   HOW IT WORKS — Clean University style
   Uses global tokens. Flat, hairline borders, calm.
   ========================================== */

.hiw-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}

.hiw-wrap { position: relative; max-width: 1180px; margin: 0 auto; }

/* ── Header (left aligned) ── */
.hiw-header { max-width: 600px; margin: 0 0 var(--space-12); }
.hiw-badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.hiw-badge-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; }
.hiw-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.6vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: var(--space-3);
}
.hiw-title-em { color: var(--color-primary-700); }
.hiw-subtitle { font-size: var(--font-size-base); line-height: 1.7; color: var(--text-secondary); margin: 0; }

/* ── Steps ── */
.hiw-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}
.hiw-step {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600);
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-6);
  transition: border-color var(--transition-base);
}
.hiw-step:hover { border-color: var(--color-gray-300); }

/* Ghost number — subtle, serif */
.hiw-step-ghost {
  position: absolute;
  top: var(--space-4); right: var(--space-5);
  font-family: var(--font-display);
  font-size: 2.75rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  color: var(--color-gray-200);
  user-select: none; pointer-events: none;
}

.hiw-step-icon {
  width: 46px; height: 46px;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  border: 1px solid var(--border-color);
  color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-5);
}
.hiw-step-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  letter-spacing: -0.01em;
}
.hiw-step-desc { font-size: var(--font-size-sm); line-height: 1.7; color: var(--text-secondary); margin: 0; }

/* Arrow between steps (desktop) — static, calm */
.hiw-step-arrow {
  position: absolute;
  top: 50%; right: -20px;
  transform: translateY(-50%);
  z-index: 5;
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-primary-500);
}

/* ── Benefits strip ── */
.hiw-benefits {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-6);
  padding: var(--space-5) var(--space-6);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-12);
}
.hiw-benefit {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
.hiw-benefit-icon { color: var(--color-success); flex-shrink: 0; }

/* ── Upcoming features ── */
.hiw-upcoming-header { margin-bottom: var(--space-6); }
.hiw-upcoming-eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600);
  letter-spacing: 0.12em; text-transform: uppercase;
}

.hiw-upcoming-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}
.hiw-uf-card {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-left: 2px solid var(--color-accent-500);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  transition: border-color var(--transition-base);
}
.hiw-uf-card:hover { border-color: var(--color-gray-300); border-left-color: var(--color-accent-500); }
.hiw-uf-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-5);
}
.hiw-uf-icon {
  width: 46px; height: 46px;
  border-radius: var(--radius-md);
  background: var(--color-accent-50);
  border: 1px solid var(--border-color);
  color: var(--color-accent-600);
  display: flex; align-items: center; justify-content: center;
}
.hiw-uf-tag {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
.hiw-uf-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-3);
}
.hiw-uf-desc { font-size: var(--font-size-sm); line-height: 1.7; color: var(--text-secondary); margin: 0 0 var(--space-5); }
.hiw-uf-points { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.hiw-uf-point {
  display: flex; align-items: center; gap: var(--space-3);
  font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: 0;
}
.hiw-uf-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-accent-500); flex-shrink: 0; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hiw-steps {
    grid-template-columns: 1fr;
    max-width: 560px;
  }
  .hiw-step-arrow { display: none; }
}
@media (max-width: 768px) {
  .hiw-section { padding: var(--space-16) var(--space-4); }
  .hiw-upcoming-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .hiw-benefit { font-size: var(--font-size-xs); }
  .hiw-uf-card { padding: var(--space-6); }
  .hiw-uf-top { flex-direction: column; align-items: flex-start; gap: var(--space-3); }
}
`;
