"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * HeroSection — Clean University style (refined)
 * -------------------------------------------------------------
 * Data SAME as your original (no invented claims):
 *  - Badges/recognitions: Govt. Recognized, MSME, ISO 9001:2015, DigiLocker, NSDC Partner
 *  - Stats: 10+ Years, 25+ Courses, Online Verification, 24/7 Support
 *  - Buttons: Explore Courses (25+ programs), Verify Certificate
 *  - Image: /hero.jpg ; Links: /courses, /verify-certificate
 */
export default function HeroSection() {
  // From your original "Bottom Stats Bar" — unchanged
  const stats = [
    { num: "10+", label: "Years Experience" },
    { num: "25+", label: "Courses" },
    { num: "Online", label: "Verification" },
    { num: "24/7", label: "Support" },
  ];

  // From your original "trust-tags" — unchanged
  const trustTags = ["ISO 9001:2015", "MSME", "DigiLocker", "NSDC Partner"];

  return (
    <>
      <style>{heroStyles}</style>

      <section className="hero-canvas" aria-labelledby="hero-heading">
        <div className="hero-stage">
          <div className="hero-grid">
            {/* Left: Content */}
            <div className="hero-content">
              <p className="hero-eyebrow">
                <span className="hero-eyebrow-dot" aria-hidden="true" />
                Govt. Recognized Training Centre
              </p>

              <h1 id="hero-heading" className="hero-headline">
                Empower Your{" "}
                <span className="headline-accent">Digital Future</span> with Skills
              </h1>

              <p className="hero-desc">
                Transform your career with industry-leading computer education,
                government-recognized certifications, and practical training
                designed for real-world success in Ambikapur &amp; Surguja.
              </p>

              <div className="hero-actions">
                <Link href="/courses" className="hero-btn hero-btn-primary">
                  <span className="hero-btn-text">
                    <span className="hero-btn-label">Explore Courses</span>
                    <span className="hero-btn-sub">25+ programs</span>
                  </span>
                  <span className="hero-btn-arrow" aria-hidden="true">→</span>
                </Link>
                <Link href="/verify-certificate" className="hero-btn hero-btn-outline">
                  Verify Certificate
                </Link>
              </div>

              <ul className="hero-trust" aria-label="Recognitions">
                {trustTags.map((tag) => (
                  <li key={tag} className="hero-trust-item">
                    <span className="hero-trust-check" aria-hidden="true">✓</span>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Image with overlapping elements */}
            <div className="hero-visual">
              <div className="hero-image">
                <Image
                  src="/hero.jpg"
                  alt="Students at Shivshakti Computer Academy"
                  fill
                  sizes="(max-width: 900px) 100vw, 520px"
                  priority
                  className="hero-img-content"
                />
                <span className="hero-ribbon">Admission Open</span>
              </div>

              {/* Overlapping card — only original numbers (10+ Years, 25+ Courses) */}
              <div className="hero-floatcard">
                <div className="hero-floatcard-item">
                  <span className="hero-floatcard-num">10+</span>
                  <span className="hero-floatcard-label">Years</span>
                </div>
                <span className="hero-floatcard-rule" aria-hidden="true" />
                <div className="hero-floatcard-item">
                  <span className="hero-floatcard-num">25+</span>
                  <span className="hero-floatcard-label">Courses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip — original Bottom Stats Bar data */}
          <div className="hero-stats">
            {stats.map((s, i) => (
              <div key={s.label} className="hero-stat">
                {i > 0 && <span className="hero-stat-rule" aria-hidden="true" />}
                <div className="hero-stat-text">
                  <div className="hero-stat-num">{s.num}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const heroStyles = `
/* ==========================================
   HERO — Clean University (refined)
   Uses global tokens (--color-*, --font-display, etc.)
   ========================================== */

.hero-canvas {
  position: relative;
  background:
    radial-gradient(120% 80% at 100% 0%, var(--color-primary-50) 0%, transparent 55%),
    var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}

.hero-stage {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(2.75rem, 6vw, 4.5rem) clamp(1rem, 3vw, 2rem);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.25rem, 4vw, 3.5rem);
  align-items: center;
}
@media (min-width: 900px) {
  .hero-grid { grid-template-columns: 1.05fr 0.95fr; }
}

/* ---------- Content ---------- */
.hero-content { max-width: 600px; }
.hero-content > * { animation: heroFade 0.5s ease-out both; }
.hero-content > *:nth-child(2) { animation-delay: 0.06s; }
.hero-content > *:nth-child(3) { animation-delay: 0.12s; }
.hero-content > *:nth-child(4) { animation-delay: 0.18s; }
.hero-content > *:nth-child(5) { animation-delay: 0.24s; }

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent-600);
  margin: 0 0 var(--space-4);
}
.hero-eyebrow-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-accent-500);
}

/* Headline with a thin accent rule above */
.hero-headline {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.8vw, 3rem);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.015em;
  color: var(--text-primary);
  margin: 0 0 var(--space-4);
  padding-top: var(--space-4);
}
.hero-headline::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 44px; height: 3px;
  background: var(--color-accent-500);
  border-radius: 2px;
}
.headline-accent {
  color: var(--color-primary-700);
  border-bottom: 2px solid var(--color-primary-200);
}

.hero-desc {
  font-size: var(--font-size-lg);
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 var(--space-6);
  max-width: 52ch;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0.7rem 1.4rem;
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  text-decoration: none;
  transition: background-color var(--transition-base), border-color var(--transition-base), color var(--transition-base);
}
.hero-btn-primary { background: var(--color-primary-600); color: #fff; }
.hero-btn-primary:hover { background: var(--color-primary-700); color: #fff; }
.hero-btn-text { display: flex; flex-direction: column; line-height: 1.15; text-align: left; }
.hero-btn-label { font-size: var(--font-size-sm); font-weight: 600; }
.hero-btn-sub { font-size: var(--font-size-xs); font-weight: 400; opacity: 0.85; }
.hero-btn-arrow { transition: transform var(--transition-base); }
.hero-btn-primary:hover .hero-btn-arrow { transform: translateX(3px); }

.hero-btn-outline {
  background: transparent;
  color: var(--color-primary-700);
  border-color: var(--border-color-dark);
  padding: 0.85rem 1.4rem;
}
.hero-btn-outline:hover { border-color: var(--color-primary-600); }

/* Recognition chips */
.hero-trust {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.hero-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.7rem;
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  margin: 0;
}
.hero-trust-check {
  color: var(--color-success);
  font-weight: 700;
  font-size: 0.7rem;
}

/* ---------- Visual ---------- */
.hero-visual {
  position: relative;
  animation: heroFade 0.55s ease-out 0.15s both;
  padding-bottom: var(--space-6);
  padding-left: var(--space-2);
}
.hero-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-gray-100);
  box-shadow: var(--shadow-lg);
}
.hero-img-content { object-fit: cover; }

.hero-ribbon {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  background: var(--color-primary-700);
  color: #fff;
  border-radius: var(--radius-sm);
  padding: 0.3rem 0.7rem;
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Overlapping stat card (bottom-left) — original numbers only */
.hero-floatcard {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-5);
  box-shadow: var(--shadow-xl);
}
.hero-floatcard-item { display: flex; flex-direction: column; }
.hero-floatcard-num {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary-700);
  line-height: 1.1;
}
.hero-floatcard-label { font-size: var(--font-size-xs); color: var(--text-tertiary); }
.hero-floatcard-rule { width: 1px; align-self: stretch; background: var(--border-color); }

/* ---------- Stats strip ---------- */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: clamp(2.25rem, 4vw, 3.25rem);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-color);
}
.hero-stat { position: relative; padding: 0 var(--space-5); }
.hero-stat:first-child { padding-left: 0; }
.hero-stat-rule {
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: 1px; height: 70%;
  background: var(--border-color);
}
.hero-stat-num {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-primary-700);
  line-height: 1.1;
}
.hero-stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--space-1);
}

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .hero-visual { padding-left: 0; max-width: 560px; }
}
@media (max-width: 640px) {
  .hero-actions { flex-direction: column; }
  .hero-btn { width: 100%; justify-content: center; }
  .hero-stats { grid-template-columns: repeat(2, 1fr); gap: var(--space-5) 0; }
  .hero-stat { padding: 0 var(--space-4); }
  .hero-stat:nth-child(odd) { padding-left: 0; }
  .hero-stat:nth-child(odd) .hero-stat-rule { display: none; }
}

@keyframes heroFade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-content > *, .hero-visual { animation: none; }
}
`;
