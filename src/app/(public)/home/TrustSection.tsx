"use client";

import {
  GraduationCap,
  Award,
  CheckCircle,
  Users,
  Shield,
  MapPin,
  ArrowRight,
  BookOpen,
  Cpu,
} from "lucide-react";

/* All data below is from your ORIGINAL component — nothing invented. */

const recognitions = [
  { label: "GSDM Authorized" },
  { label: "Skill India Aligned" },
  { label: "DigiLocker Compatible" },
  { label: "NSDC Partner" },
];

const stats = [
  { value: "1000+", label: "Students Enrolled" },
  { value: "98%", label: "Completion Rate" },
  { value: "100%", label: "Certificate Verification" },
  { value: "24/7", label: "Student Support" },
];

const expertise = [
  { icon: Cpu, label: "Hardware & Networking" },
  { icon: BookOpen, label: "DCA / PGDCA Programs" },
  { icon: GraduationCap, label: "Academic IT Training" },
  { icon: CheckCircle, label: "Tally & Accounting" },
];

const miniPills = [
  { icon: GraduationCap, val: "25+", lbl: "Courses" },
  { icon: CheckCircle, val: "Online", lbl: "Verification" },
  { icon: Users, val: "Expert", lbl: "Faculty" },
];

export default function TrustSection() {
  return (
    <>
      <style>{styles}</style>

      <section className="ts-section" aria-labelledby="trust-heading">
        <div className="ts-wrap">
          {/* ── Header ── */}
          <div className="ts-header">
            <div className="ts-badge">
              <span className="ts-badge-dot" aria-hidden="true" />
              Trusted &amp; Recognized
            </div>
            <h2 id="trust-heading" className="ts-title">
              Your <span className="ts-title-em">Trusted Partner</span> in Digital Education
            </h2>
            <p className="ts-subtitle">
              A government-recognized institute in Ambikapur, backed by experienced
              faculty and committed to quality education, verified certifications, and
              student success.
            </p>
          </div>

          {/* ── Main grid ── */}
          <div className="ts-main">
            {/* Left column */}
            <div className="ts-left">
              {/* Hero card — Faculty */}
              <div className="ts-hero-card">
                <div className="ts-hero-top">
                  <div className="ts-hero-icon">
                    <Users size={26} strokeWidth={1.5} />
                  </div>
                  <span className="ts-hero-pill">Est. June 2025</span>
                </div>

                <h3 className="ts-hero-label">
                  Experienced Faculty,{" "}
                  <span className="ts-hero-label-em">Strong Foundation</span>
                </h3>

                <p className="ts-hero-desc">
                  Shivshakti Computer Academy may be new, but our faculty brings years
                  of hands-on teaching and industry experience across multiple
                  institutions — giving students the best of both worlds.
                </p>

                {/* Expertise tags */}
                <div className="ts-expertise-grid">
                  {expertise.map((e) => {
                    const Icon = e.icon;
                    return (
                      <div key={e.label} className="ts-exp-item">
                        <span className="ts-exp-icon">
                          <Icon size={15} strokeWidth={1.8} />
                        </span>
                        <span>{e.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Founder note */}
                <div className="ts-founder-note">
                  <div className="ts-founder-avatar" aria-hidden="true">V</div>
                  <div className="ts-founder-text">
                    <div className="ts-founder-name">Vikram Sir</div>
                    <div className="ts-founder-role">
                      Founder &amp; Lead Instructor ·{" "}
                      <span className="ts-founder-highlight">
                        Multi-institution teaching experience
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 mini stat pills */}
              <div className="ts-pills-row">
                {miniPills.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.lbl} className="ts-pill">
                      <span className="ts-pill-icon">
                        <Icon size={18} strokeWidth={1.6} />
                      </span>
                      <div>
                        <div className="ts-pill-val">{p.val}</div>
                        <div className="ts-pill-lbl">{p.lbl}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div className="ts-right">
              {/* ISO card */}
              <div className="ts-cert-card">
                <div className="ts-cert-top">
                  <div className="ts-cert-icon">
                    <Award size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="ts-cert-num">ISO</div>
                <div className="ts-cert-sub">9001:2015 Certified</div>
                <p className="ts-cert-desc">
                  Quality management system ensuring consistent, world-class training
                  standards.
                </p>
                <div className="ts-cert-badge">Internationally Recognized</div>
              </div>

              {/* MSME card */}
              <div className="ts-cert-card">
                <div className="ts-cert-top">
                  <div className="ts-cert-icon">
                    <Shield size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="ts-cert-num">MSME</div>
                <div className="ts-cert-sub">Government Registered</div>
                <p className="ts-cert-desc">
                  Recognized as a micro, small &amp; medium enterprise in the education
                  sector by Govt. of India.
                </p>
                <div className="ts-cert-badge ts-cert-badge-green">Govt. of India ✓</div>
              </div>

              {/* Recognition strip */}
              <div className="ts-rec-strip">
                <div className="ts-rec-label">
                  <MapPin size={13} strokeWidth={2} />
                  Affiliated &amp; Recognized by
                </div>
                <div className="ts-rec-pills">
                  {recognitions.map((r) => (
                    <div key={r.label} className="ts-rec-pill">
                      {r.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div className="ts-stats">
            {stats.map((s, i) => (
              <div key={s.label} className="ts-stat">
                <div className="ts-stat-val">{s.value}</div>
                <div className="ts-stat-lbl">{s.label}</div>
                {i < stats.length - 1 && (
                  <div className="ts-stat-sep" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          {/* ── CTA Banner ── */}
          <div className="ts-cta-banner">
            <div className="ts-cta-left">
              <div className="ts-cta-icon" aria-hidden="true">
                <MapPin size={22} strokeWidth={1.6} />
              </div>
              <div>
                <div className="ts-cta-title">Government Recognized Training Centre</div>
                <div className="ts-cta-sub">Ambikapur, Surguja, Chhattisgarh</div>
              </div>
            </div>
            <a href="/about" className="ts-cta-btn">
              Learn More About Us
              <ArrowRight size={15} strokeWidth={2} className="ts-cta-arrow" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const styles = `
/* ==========================================
   TRUST SECTION — Clean University style
   Uses global tokens. Flat, hairline borders, calm.
   ========================================== */

.ts-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}

.ts-wrap {
  position: relative;
  max-width: 1180px;
  margin: 0 auto;
}

/* ── Header (left aligned, editorial) ── */
.ts-header {
  max-width: 640px;
  margin: 0 0 var(--space-12);
}
.ts-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.ts-badge-dot {
  width: 6px; height: 6px;
  background: var(--color-accent-500);
  border-radius: 50%;
}
.ts-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.6vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}
.ts-title-em { color: var(--color-primary-700); }
.ts-subtitle {
  font-size: var(--font-size-base);
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Main grid ── */
.ts-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
  align-items: start;
}

.ts-left, .ts-right {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* ── Hero card ── */
.ts-hero-card {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  transition: border-color var(--transition-base);
}
.ts-hero-card:hover { border-color: var(--color-gray-300); border-top-color: var(--color-primary-600); }

.ts-hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}
.ts-hero-icon {
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  border: 1px solid var(--border-color);
  color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center;
}
.ts-hero-pill {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
.ts-hero-label {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.4vw, 1.6rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.25;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-3);
}
.ts-hero-label-em { color: var(--color-primary-700); }
.ts-hero-desc {
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 var(--space-5);
}

/* Expertise tags */
.ts-expertise-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}
.ts-exp-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  transition: border-color var(--transition-fast);
}
.ts-exp-item:hover { border-color: var(--color-gray-300); }
.ts-exp-icon { color: var(--color-primary-500); flex-shrink: 0; display: flex; }

/* Founder note */
.ts-founder-note {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}
.ts-founder-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--color-primary-100);
  border: 1px solid var(--border-color);
  color: var(--color-primary-700);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}
.ts-founder-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: 2px;
}
.ts-founder-role { font-size: var(--font-size-xs); color: var(--text-tertiary); line-height: 1.4; }
.ts-founder-highlight { color: var(--color-primary-600); font-weight: var(--font-weight-medium); }

/* Mini pills */
.ts-pills-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}
.ts-pill {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-fast);
}
.ts-pill:hover { border-color: var(--color-gray-300); }
.ts-pill-icon {
  width: 34px; height: 34px;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ts-pill-val {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: 1;
}
.ts-pill-lbl { font-size: var(--font-size-xs); color: var(--text-tertiary); margin-top: 2px; }

/* ── Cert cards ── */
.ts-cert-card {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-left: 2px solid var(--color-accent-500);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: border-color var(--transition-base);
}
.ts-cert-card:hover { border-color: var(--color-gray-300); border-left-color: var(--color-accent-500); }
.ts-cert-top { margin-bottom: var(--space-4); }
.ts-cert-icon {
  width: 46px; height: 46px;
  border-radius: var(--radius-md);
  background: var(--color-accent-50);
  border: 1px solid var(--border-color);
  color: var(--color-accent-600);
  display: flex; align-items: center; justify-content: center;
}
.ts-cert-num {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-1);
}
.ts-cert-sub {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}
.ts-cert-desc {
  font-size: var(--font-size-sm);
  line-height: 1.65;
  color: var(--text-secondary);
  margin: 0 0 var(--space-4);
}
.ts-cert-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
.ts-cert-badge-green { color: var(--color-success-dark); }

/* Recognition strip */
.ts-rec-strip {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
.ts-rec-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-tertiary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}
.ts-rec-pills { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.ts-rec-pill {
  padding: var(--space-2) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  transition: border-color var(--transition-fast);
}
.ts-rec-pill:hover { border-color: var(--color-gray-300); }

/* ── Stats strip ── */
.ts-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.ts-stat {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--space-6) var(--space-5);
}
.ts-stat-sep {
  position: absolute;
  right: 0; top: 20%; bottom: 20%;
  width: 1px;
  background: var(--border-color);
}
.ts-stat-val {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.5vw, 1.85rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  line-height: 1;
  margin-bottom: var(--space-2);
}
.ts-stat-lbl {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.3;
}

/* ── CTA Banner ── */
.ts-cta-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-5);
  padding: var(--space-6);
  background: var(--color-primary-700);
  border-radius: var(--radius-lg);
}
.ts-cta-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.ts-cta-icon {
  width: 46px; height: 46px;
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ts-cta-title {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: #fff;
  margin-bottom: 2px;
}
.ts-cta-sub { font-size: var(--font-size-sm); color: rgba(255,255,255,0.7); }
.ts-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: #fff;
  color: var(--color-primary-800);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  flex-shrink: 0;
  transition: background var(--transition-fast);
}
.ts-cta-btn:hover { background: var(--color-gray-100); color: var(--color-primary-800); }
.ts-cta-arrow { transition: transform var(--transition-fast); }
.ts-cta-btn:hover .ts-cta-arrow { transform: translateX(3px); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .ts-main { grid-template-columns: 1fr; }
  .ts-stats { grid-template-columns: repeat(2, 1fr); }
  .ts-stat-sep { display: none; }
  .ts-stat:nth-child(odd) { border-right: 1px solid var(--border-color); }
  .ts-stat:nth-child(1), .ts-stat:nth-child(2) { border-bottom: 1px solid var(--border-color); }
}
@media (max-width: 768px) {
  .ts-section { padding: var(--space-16) var(--space-4); }
  .ts-cta-banner { flex-direction: column; align-items: flex-start; }
  .ts-cta-btn { width: 100%; justify-content: center; }
}
@media (max-width: 480px) {
  .ts-pills-row { grid-template-columns: 1fr; }
  .ts-expertise-grid { grid-template-columns: 1fr; }
  .ts-hero-card { padding: var(--space-6); }
}
`;
