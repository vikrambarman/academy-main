"use client";

import {
  Bot,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Brain,
  GraduationCap,
  ShieldCheck,
  Layers,
  Target,
} from "lucide-react";

/* All data from your ORIGINAL component — nothing invented. */

const lmsFeatures = [
  { icon: BookOpen, text: "Course practice modules" },
  { icon: Brain, text: "AI-powered doubt clearing" },
  { icon: Zap, text: "Progress tracking dashboard" },
  { icon: GraduationCap, text: "Certificate preparation guides" },
];

const aiFeatures = [
  { icon: Globe, text: "Available to all public visitors" },
  { icon: Brain, text: "Instant answers to course queries" },
  { icon: Lock, text: "Deeper access for enrolled students" },
  { icon: Sparkles, text: "Smart study recommendations" },
];

const certFeatures = [
  "Skill India aligned programs",
  "DigiLocker digital verification",
  "GSDM authorized certificates",
  "Verifiable via enrollment number",
];

const trustStrip = [
  { icon: BookOpen, val: "Lifetime", lbl: "LMS Access" },
  { icon: Bot, val: "24/7", lbl: "AI Support (Soon)" },
  { icon: Award, val: "100%", lbl: "Verified Certificates" },
  { icon: Target, val: "Free", lbl: "Admission Guidance" },
];

export default function StudentBenefits() {
  return (
    <>
      <style>{styles}</style>

      <section className="sb-section" aria-labelledby="sb-heading">
        <div className="sb-wrap">
          {/* ── Header ── */}
          <div className="sb-header">
            <div className="sb-badge">
              <span className="sb-badge-dot" aria-hidden="true" />
              Student Benefits
            </div>
            <h2 id="sb-heading" className="sb-title">
              Everything You Get as a{" "}
              <span className="sb-title-em">Shivshakti Student</span>
            </h2>
            <p className="sb-subtitle">
              From AI-powered learning assistance to lifetime LMS access and
              government-recognized certifications — we invest in your success beyond
              the classroom.
            </p>
          </div>

          {/* ── Main 3-pillar layout ── */}
          <div className="sb-grid">
            {/* Pillar 1 — LMS (large, left) */}
            <div className="sb-card sb-card-lms">
              <div className="sb-card-top">
                <div className="sb-icon sb-icon-blue">
                  <BookOpen size={24} strokeWidth={1.6} />
                </div>
                <span className="sb-tag">
                  <span className="sb-tag-dot" aria-hidden="true" />
                  On Admission
                </span>
              </div>

              <h3 className="sb-card-title">Lifetime LMS Access</h3>
              <p className="sb-card-desc">
                Every student who enrolls gets permanent access to our Learning
                Management System — no expiry, no renewal fee. Learn at your own pace,
                revisit concepts anytime.
              </p>

              <ul className="sb-feat-list">
                {lmsFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.text} className="sb-feat-item">
                      <span className="sb-feat-icon">
                        <Icon size={14} strokeWidth={1.8} />
                      </span>
                      <span>{f.text}</span>
                    </li>
                  );
                })}
              </ul>

              {/* LMS preview mockup */}
              <div className="sb-lms-mock" aria-hidden="true">
                <div className="sb-mock-bar">
                  <span className="sb-mock-dot" />
                  <span className="sb-mock-dot" />
                  <span className="sb-mock-dot" />
                  <span className="sb-mock-url">lms.shivshakti.edu</span>
                </div>
                <div className="sb-mock-body">
                  <div className="sb-mock-sidebar">
                    <div className="sb-mock-nav-item sb-mock-nav-active" />
                    <div className="sb-mock-nav-item" />
                    <div className="sb-mock-nav-item" />
                    <div className="sb-mock-nav-item" />
                  </div>
                  <div className="sb-mock-content">
                    <div className="sb-mock-heading" />
                    <div className="sb-mock-progress">
                      <div className="sb-mock-progress-fill" />
                    </div>
                    <div className="sb-mock-row" />
                    <div className="sb-mock-row sb-mock-row-short" />
                    <div className="sb-mock-modules">
                      <div className="sb-mock-module sb-module-done">✓ Module 1</div>
                      <div className="sb-mock-module sb-module-active">▶ Module 2</div>
                      <div className="sb-mock-module">○ Module 3</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sb-card-footer">
                <span className="sb-foot-note">
                  <Lock size={12} strokeWidth={2} />
                  Activates automatically on course admission
                </span>
              </div>
            </div>

            {/* Right column — stacked */}
            <div className="sb-right-col">
              {/* Pillar 2 — AI Assistant */}
              <div className="sb-card sb-card-ai">
                <div className="sb-card-top">
                  <div className="sb-icon sb-icon-orange">
                    <Bot size={22} strokeWidth={1.6} />
                  </div>
                  <span className="sb-tag sb-tag-soon">
                    <Sparkles size={10} strokeWidth={2} />
                    Coming Soon
                  </span>
                </div>

                <h3 className="sb-card-title">AI Learning Assistant</h3>
                <p className="sb-card-desc">
                  Our AI assistant clears doubts instantly — available 24/7 for public
                  visitors, with deeper course-specific guidance for enrolled students.
                </p>

                <ul className="sb-feat-list">
                  {aiFeatures.map((f) => {
                    const Icon = f.icon;
                    return (
                      <li key={f.text} className="sb-feat-item">
                        <span className="sb-feat-icon sb-feat-icon-orange">
                          <Icon size={13} strokeWidth={1.8} />
                        </span>
                        <span>{f.text}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* AI Chat preview */}
                <div className="sb-ai-mock" aria-hidden="true">
                  <div className="sb-ai-msg sb-ai-msg-user">
                    What courses are available for beginners?
                  </div>
                  <div className="sb-ai-msg sb-ai-msg-bot">
                    <span className="sb-ai-bot-dot" />
                    <span>
                      We offer DCA, Basic Computer &amp; Tally — perfect for beginners
                      with no prior experience needed!
                    </span>
                  </div>
                  <div className="sb-ai-typing" aria-label="typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>

              {/* Pillar 3 — Certificates */}
              <div className="sb-card sb-card-cert">
                <div className="sb-card-top">
                  <div className="sb-icon sb-icon-green">
                    <Award size={22} strokeWidth={1.6} />
                  </div>
                  <span className="sb-tag">
                    <span className="sb-tag-dot" aria-hidden="true" />
                    Govt. Recognized
                  </span>
                </div>

                <h3 className="sb-card-title">Verified Certificates</h3>

                <div className="sb-cert-grid">
                  {certFeatures.map((c) => (
                    <div key={c} className="sb-cert-item">
                      <CheckCircle size={14} strokeWidth={2} className="sb-cert-check" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>

                {/* Certificate preview strip */}
                <div className="sb-cert-mock" aria-hidden="true">
                  <div className="sb-cert-mock-left">
                    <ShieldCheck size={30} strokeWidth={1.3} className="sb-cert-shield" />
                  </div>
                  <div className="sb-cert-mock-right">
                    <div className="sb-cert-name" />
                    <div className="sb-cert-course" />
                    <div className="sb-cert-meta">
                      <span className="sb-cert-badge">DigiLocker ✓</span>
                      <span className="sb-cert-badge">GSDM ✓</span>
                    </div>
                  </div>
                </div>

                <a href="/courses" className="sb-cert-link">
                  View all courses
                  <ArrowRight size={14} strokeWidth={2} className="sb-link-arrow" />
                </a>
              </div>
            </div>
          </div>

          {/* ── Bottom trust strip ── */}
          <div className="sb-trust-strip">
            {trustStrip.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.lbl} className="sb-trust-item">
                  <span className="sb-trust-icon">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <div className="sb-trust-text">
                    <div className="sb-trust-val">{s.val}</div>
                    <div className="sb-trust-lbl">{s.lbl}</div>
                  </div>
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
   STUDENT BENEFITS — Clean University style
   Uses global tokens. Flat cards, hairline borders, calm.
   ========================================== */

.sb-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}

.sb-wrap { position: relative; max-width: 1180px; margin: 0 auto; }

/* ── Header (left aligned) ── */
.sb-header { max-width: 660px; margin: 0 0 var(--space-12); }
.sb-badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.sb-badge-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; }
.sb-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.6vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: var(--space-3);
}
.sb-title-em { color: var(--color-primary-700); }
.sb-subtitle { font-size: var(--font-size-base); line-height: 1.7; color: var(--text-secondary); margin: 0; }

/* ── Main grid ── */
.sb-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
  align-items: start;
}
.sb-right-col { display: flex; flex-direction: column; gap: var(--space-5); }

/* ── Card base ── */
.sb-card {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  transition: border-color var(--transition-base);
}
.sb-card:hover { border-color: var(--color-gray-300); }
.sb-card-lms { border-top-color: var(--color-primary-600); }
.sb-card-ai { border-top-color: var(--color-accent-500); }
.sb-card-cert { border-top-color: var(--color-success); }
.sb-card:hover.sb-card-lms { border-top-color: var(--color-primary-600); }
.sb-card:hover.sb-card-ai { border-top-color: var(--color-accent-500); }
.sb-card:hover.sb-card-cert { border-top-color: var(--color-success); }

.sb-card-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-5);
}

/* Icons — uniform sober treatment */
.sb-icon {
  width: 46px; height: 46px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
}
.sb-icon-blue { background: var(--color-primary-50); color: var(--color-primary-600); }
.sb-icon-orange { background: var(--color-accent-50); color: var(--color-accent-600); }
.sb-icon-green { background: var(--color-success-light); color: var(--color-success-dark); }

/* Tags */
.sb-tag {
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
.sb-tag-soon { color: var(--color-accent-700); }
.sb-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-success); }

/* Title / desc */
.sb-card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-3);
}
.sb-card-desc { font-size: var(--font-size-sm); line-height: 1.7; color: var(--text-secondary); margin: 0 0 var(--space-5); }

/* Feature list */
.sb-feat-list { list-style: none; padding: 0; margin: 0 0 var(--space-6); display: flex; flex-direction: column; gap: var(--space-2); }
.sb-feat-item { display: flex; align-items: center; gap: var(--space-3); font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: 0; }
.sb-feat-icon {
  width: 24px; height: 24px;
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  background: var(--color-primary-50); color: var(--color-primary-600);
}
.sb-feat-icon-orange { background: var(--color-accent-50); color: var(--color-accent-600); }

/* ── LMS Mockup ── */
.sb-lms-mock {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-bottom: var(--space-5);
  background: var(--bg-surface);
}
.sb-mock-bar {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-gray-100);
  border-bottom: 1px solid var(--border-color);
}
.sb-mock-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-gray-300); flex-shrink: 0; }
.sb-mock-url { font-size: 0.6rem; color: var(--text-tertiary); margin-left: var(--space-2); font-family: var(--font-mono); }
.sb-mock-body { display: flex; height: 120px; }
.sb-mock-sidebar {
  width: 48px; background: var(--bg-elevated);
  border-right: 1px solid var(--border-color);
  padding: var(--space-3) var(--space-2);
  display: flex; flex-direction: column; gap: var(--space-2);
}
.sb-mock-nav-item { height: 6px; border-radius: var(--radius-full); background: var(--color-gray-200); }
.sb-mock-nav-active { background: var(--color-primary-300); }
.sb-mock-content { flex: 1; padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-2); }
.sb-mock-heading { height: 8px; width: 60%; background: var(--color-gray-300); border-radius: var(--radius-full); }
.sb-mock-progress { height: 4px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden; }
.sb-mock-progress-fill { height: 100%; width: 65%; background: var(--color-primary-400); border-radius: var(--radius-full); }
.sb-mock-row { height: 5px; background: var(--color-gray-100); border-radius: var(--radius-full); }
.sb-mock-row-short { width: 70%; }
.sb-mock-modules { display: flex; flex-direction: column; gap: 3px; margin-top: auto; }
.sb-mock-module { font-size: 0.55rem; padding: 2px var(--space-2); border-radius: var(--radius-sm); color: var(--text-tertiary); background: var(--color-gray-100); }
.sb-module-done { background: var(--color-success-light); color: var(--color-success-dark); }
.sb-module-active { background: var(--color-primary-50); color: var(--color-primary-600); font-weight: var(--font-weight-medium); }

/* Card footer */
.sb-card-footer { padding-top: var(--space-4); border-top: 1px solid var(--border-color); }
.sb-foot-note { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); color: var(--text-tertiary); }

/* ── AI Chat Mock ── */
.sb-ai-mock {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex; flex-direction: column; gap: var(--space-3);
}
.sb-ai-msg { font-size: 0.72rem; line-height: 1.5; padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); max-width: 90%; }
.sb-ai-msg-user { background: var(--color-primary-50); color: var(--color-primary-700); border: 1px solid var(--color-primary-100); align-self: flex-end; margin-left: auto; }
.sb-ai-msg-bot { display: flex; align-items: flex-start; gap: var(--space-2); background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border-color); }
.sb-ai-bot-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent-400); flex-shrink: 0; margin-top: 3px; }
.sb-ai-typing { display: flex; align-items: center; gap: 3px; padding: var(--space-2) var(--space-3); width: fit-content; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); }
.sb-ai-typing span { width: 5px; height: 5px; border-radius: 50%; background: var(--color-gray-400); animation: sb-typing 1.2s ease-in-out infinite; }
.sb-ai-typing span:nth-child(2) { animation-delay: 0.2s; }
.sb-ai-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes sb-typing { 0%,80%,100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-3px); opacity: 1; } }

/* ── Cert section ── */
.sb-cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-5); }
.sb-cert-item { display: flex; align-items: flex-start; gap: var(--space-2); font-size: var(--font-size-xs); color: var(--text-secondary); line-height: 1.4; }
.sb-cert-check { color: var(--color-success); flex-shrink: 0; margin-top: 1px; }
.sb-cert-mock {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-5);
}
.sb-cert-mock-left { flex-shrink: 0; }
.sb-cert-shield { color: var(--color-success); }
.sb-cert-mock-right { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
.sb-cert-name { height: 7px; width: 70%; background: var(--color-gray-300); border-radius: var(--radius-full); }
.sb-cert-course { height: 5px; width: 50%; background: var(--color-gray-200); border-radius: var(--radius-full); }
.sb-cert-meta { display: flex; gap: var(--space-2); }
.sb-cert-badge {
  display: inline-block; padding: 2px var(--space-2);
  background: var(--color-success-light); color: var(--color-success-dark);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full); font-size: 0.58rem; font-weight: var(--font-weight-semibold);
}
.sb-cert-link { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-primary-600); text-decoration: none; }
.sb-cert-link:hover { color: var(--color-primary-700); }
.sb-link-arrow { transition: transform var(--transition-fast); }
.sb-cert-link:hover .sb-link-arrow { transform: translateX(3px); }

/* ── Trust strip ── */
.sb-trust-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.sb-trust-item {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-6) var(--space-5);
}
.sb-trust-item + .sb-trust-item { border-left: 1px solid var(--border-color); }
.sb-trust-icon {
  width: 38px; height: 38px;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.sb-trust-val {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  line-height: 1;
}
.sb-trust-lbl { font-size: var(--font-size-xs); color: var(--text-tertiary); line-height: 1.3; margin-top: 2px; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .sb-grid { grid-template-columns: 1fr; }
  .sb-trust-strip { grid-template-columns: repeat(2, 1fr); }
  .sb-trust-item:nth-child(odd) { border-left: none; }
  .sb-trust-item:nth-child(3), .sb-trust-item:nth-child(4) { border-top: 1px solid var(--border-color); }
}
@media (max-width: 768px) {
  .sb-section { padding: var(--space-16) var(--space-4); }
  .sb-cert-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .sb-trust-strip { grid-template-columns: 1fr 1fr; }
  .sb-card { padding: var(--space-6); }
  .sb-lms-mock { display: none; }
}
`;
