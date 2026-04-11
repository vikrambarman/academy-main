"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      <style>{heroStyles}</style>

      <section className="hero-canvas" aria-labelledby="hero-heading">
        {/* Advanced Gradient Mesh Background */}
        <div className="hero-mesh" aria-hidden="true">
          <div className="mesh-gradient mesh-1" />
          <div className="mesh-gradient mesh-2" />
          <div className="mesh-gradient mesh-3" />
          <div className="mesh-gradient mesh-4" />
        </div>

        {/* Geometric Patterns */}
        <div className="hero-pattern" aria-hidden="true">
          <div className="pattern-grid" />
          <div className="pattern-dots" />
        </div>

        {/* Floating Particles */}
        <div className="hero-particles" aria-hidden="true">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Main Container */}
        <div className="hero-stage">

          {/* Animated Top Bar */}
          <div className="hero-top-strip reveal-top">
            <div className="strip-content">
              <div className="strip-badge">
                <span className="badge-pulse" />
                <span>🏆 Government Recognized</span>
              </div>
              <div className="strip-divider" />
              <div className="strip-badge">
                <span className="badge-pulse" />
                <span>🔒 MSME Registered</span>
              </div>
              <div className="strip-divider" />
              <div className="strip-badge">
                <span className="badge-pulse" />
                <span>📜 ISO Certified</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="hero-grid">

            {/* Left Content */}
            <div className="hero-content">

              {/* Premium Badge */}
              <div className="premium-badge reveal-fade">
                <div className="badge-glow" />
                <span className="badge-icon">🇮🇳</span>
                <span className="badge-text">Govt. Recognized Training Centre</span>
                <div className="badge-shimmer" />
              </div>

              {/* Dynamic Title */}
              <h1 id="hero-heading" className="hero-headline">
                <span className="headline-line reveal-slide-1">
                  Empower Your
                </span>
                <span className="headline-line headline-highlight reveal-slide-2">
                  <span className="highlight-text">Digital Future</span>
                </span>
                <span className="headline-line headline-stroke reveal-slide-3">
                  with Skills
                </span>
              </h1>

              {/* Description Card */}
              <div className="desc-card reveal-fade-delay">
                <div className="desc-icon-wrapper">
                  <span className="desc-icon">💡</span>
                  <div className="desc-icon-glow" />
                </div>
                <p className="desc-text">
                  Transform your career with industry-leading computer education,
                  government-recognized certifications, and practical training
                  designed for real-world success in Ambikapur & Surguja.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="hero-actions reveal-scale">
                <Link href="/courses" className="btn-primary">
                  <div className="btn-bg" />
                  <span className="btn-icon">🚀</span>
                  <div className="btn-content">
                    <span className="btn-label">Explore Courses</span>
                    <span className="btn-sublabel">25+ programs</span>
                  </div>
                  <span className="btn-arrow">→</span>
                  <div className="btn-shine" />
                </Link>

                <Link href="/verify-certificate" className="btn-secondary">
                  <span className="btn-icon">🔍</span>
                  <span>Verify Certificate</span>
                  <div className="btn-border-anim" />
                </Link>
              </div>

              {/* Trust Tags */}
              <div className="trust-tags reveal-fade-final">
                {["ISO 9001:2015", "MSME", "DigiLocker", "NSDC Partner"].map((tag, i) => (
                  <div key={i} className="trust-tag" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="tag-dot" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="hero-visual reveal-scale-delay">

              {/* Main Image Frame */}
              <div className="visual-frame">
                <div className="frame-border" />
                <div className="frame-glow" />

                <div className="visual-image">
                  <Image
                    src="/hero.jpg"
                    alt="Students at Shivshakti Computer Academy"
                    fill
                    sizes="(max-width: 900px) 100vw, 500px"
                    priority
                    className="img-content"
                  />
                </div>

                {/* Floating Stats */}
                <div className="visual-stats">
                  <div className="stat-item">
                    <div className="stat-value">10+</div>
                    <div className="stat-label">Years</div>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <div className="stat-value">25+</div>
                    <div className="stat-label">Courses</div>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="float-card">
                <div className="float-pulse" />
                <div className="float-content">
                  <span className="float-text">Admission Open</span>
                </div>
              </div>

              {/* Decorative Orbs */}
              <div className="deco-orb deco-orb-1" />
              <div className="deco-orb deco-orb-2" />
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="stats-bar reveal-bottom">
            {[
              { num: "10+", label: "Years Experience", icon: "📅" },
              { num: "25+", label: "Courses", icon: "📚" },
              { num: "Online", label: "Verification", icon: "🔐" },
              { num: "24/7", label: "Support", icon: "💬" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <div className="stat-number">{stat.num}</div>
                  <div className="stat-desc">{stat.label}</div>
                </div>
                <div className="stat-glow" />
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
   OPTIMIZED HERO - COMPACT & BALANCED
   ========================================== */

.hero-canvas {
  position: relative;
  min-height: 90vh; /* ✅ Reduced from 100vh */
  overflow: hidden;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 50%, #f8f9fa 100%);
  isolation: isolate;
}

[data-theme="dark"] .hero-canvas {
  background: linear-gradient(135deg, #0a0e1a 0%, #151b2e 50%, #0a0e1a 100%);
}

/* ========== GRADIENT MESH ========== */
.hero-mesh {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.5; /* ✅ Reduced opacity */
}

.mesh-gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px); /* ✅ Reduced blur */
  will-change: transform;
  animation: meshFloat 25s ease-in-out infinite;
}

.mesh-1 {
  width: 650px; /* ✅ Smaller */
  height: 650px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.35), transparent 70%);
  top: -10%;
  right: -8%;
  animation-delay: 0s;
}

.mesh-2 {
  width: 500px; /* ✅ Smaller */
  height: 500px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.25), transparent 70%);
  bottom: -15%;
  left: -5%;
  animation-delay: 8s;
}

.mesh-3 {
  width: 400px; /* ✅ Smaller */
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%);
  top: 35%;
  left: 25%;
  animation-delay: 4s;
}

.mesh-4 {
  width: 350px; /* ✅ Smaller */
  height: 350px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.18), transparent 70%);
  top: 15%;
  right: 20%;
  animation-delay: 12s;
}

@keyframes meshFloat {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(50px, -50px) scale(1.08) rotate(90deg); }
  50% { transform: translate(-35px, 35px) scale(0.95) rotate(180deg); }
  75% { transform: translate(25px, -25px) scale(1.03) rotate(270deg); }
}

/* ========== PATTERNS ========== */
.hero-pattern {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.025; /* ✅ Reduced */
  pointer-events: none;
}

.pattern-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--text-primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--text-primary) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 30s linear infinite;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

.pattern-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--text-primary) 1.5px, transparent 1.5px);
  background-size: 40px 40px;
}

/* ========== PARTICLES ========== */
.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px; /* ✅ Smaller */
  height: 3px;
  background: var(--color-primary-400);
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat 10s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% { 
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  10% { 
    opacity: 0.5; /* ✅ Reduced */
    transform: translateY(-20px) scale(1);
  }
  90% {
    opacity: 0.4;
    transform: translateY(-80vh) scale(0.5);
  }
}

/* ========== MAIN STAGE ========== */
.hero-stage {
  position: relative;
  z-index: 10;
  max-width: 1280px; /* ✅ Reduced from 1400px */
  margin: 0 auto;
  padding: clamp(1.2rem, 3vw, 1.5rem) clamp(1rem, 2vw, 1.5rem); /* ✅ Reduced padding */
  min-height: 90vh; /* ✅ Reduced */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(1.5rem, 3vw, 2rem); /* ✅ Reduced gap */
}

/* ========== TOP STRIP ========== */
.hero-top-strip {
  width: fit-content;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 100px;
  padding: 0.5rem 1rem; /* ✅ Reduced padding */
  position: relative;
  overflow: hidden;
}

[data-theme="dark"] .hero-top-strip {
  background: rgba(30, 41, 59, 0.7);
}

.hero-top-strip::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transform: translateX(-100%);
  animation: stripShine 3s ease-in-out infinite;
}

@keyframes stripShine {
  100% { transform: translateX(100%); }
}

.strip-content {
  display: flex;
  align-items: center;
  gap: 1rem; /* ✅ Reduced */
  position: relative;
  z-index: 1;
}

.strip-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.688rem; /* ✅ Reduced (11px) */
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.badge-pulse {
  width: 5px; /* ✅ Smaller */
  height: 5px;
  background: var(--color-primary-600);
  border-radius: 50%;
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
  }
}

.strip-divider {
  width: 1px;
  height: 14px; /* ✅ Reduced */
  background: rgba(59, 130, 246, 0.3);
}

/* ========== CONTENT GRID ========== */
.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem; /* ✅ Reduced from 3rem */
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1.15fr 1fr;
    gap: 3rem; /* ✅ Reduced from 4rem */
  }
}

/* ========== PREMIUM BADGE ========== */
.premium-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem; /* ✅ Reduced */
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05));
  border: 1.5px solid;
  border-image: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.2)) 1;
  border-radius: 100px;
  overflow: hidden;
}

.badge-glow {
  position: absolute;
  inset: -1px;
  background: conic-gradient(from 180deg, #3b82f6, #8b5cf6, #3b82f6);
  opacity: 0.3;
  filter: blur(8px);
  animation: badgeRotate 4s linear infinite;
  pointer-events: none;
}

@keyframes badgeRotate {
  100% { transform: rotate(360deg); }
}

.badge-icon {
  font-size: 1.125rem; /* ✅ Reduced */
  z-index: 1;
}

.badge-text {
  font-size: 0.625rem; /* ✅ Reduced (10px) */
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--color-primary-700), var(--color-accent-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  z-index: 1;
}

.badge-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
  transform: translateX(-100%);
  animation: badgeShimmer 2.5s ease-in-out infinite;
}

@keyframes badgeShimmer {
  100% { transform: translateX(100%); }
}

/* ========== HEADLINE ========== */
.hero-headline {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* ✅ Reduced */
  margin: 1rem 0; /* ✅ Reduced */
}

.headline-line {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.5vw, 3.75rem); /* ✅ REDUCED - was 2.5rem, 7vw, 5rem */
  font-weight: 800;
  line-height: 1.1; /* ✅ Tighter */
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.headline-highlight {
  position: relative;
  width: fit-content;
}

.highlight-text {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f97316 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes underlineGrow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.headline-stroke {
  color: transparent;
  -webkit-text-stroke: 2px var(--text-primary); /* ✅ Reduced from 2.5px */
  text-stroke: 2px var(--text-primary);
}

/* ========== DESCRIPTION CARD ========== */
.desc-card {
  display: flex;
  gap: 1rem; /* ✅ Reduced */
  padding: 1.125rem; /* ✅ Reduced */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-left: 3px solid var(--color-primary-500); /* ✅ Thinner */
  border-radius: 1rem; /* ✅ Reduced */
  position: relative;
  overflow: hidden;
}

[data-theme="dark"] .desc-card {
  background: rgba(30, 41, 59, 0.6);
}

.desc-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.03), transparent);
  pointer-events: none;
}

.desc-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.desc-icon {
  font-size: 2rem; /* ✅ Reduced from 2.5rem */
  display: block;
  position: relative;
  z-index: 1;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); } /* ✅ Reduced bounce */
}

.desc-icon-glow {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.3), transparent);
  filter: blur(12px);
  animation: iconGlow 2s ease-in-out infinite;
}

@keyframes iconGlow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.desc-text {
  font-size: 0.938rem; /* ✅ REDUCED from 1rem (15px) */
  line-height: 1.65; /* ✅ Tighter */
  color: var(--text-secondary);
  margin: 0;
}

/* ========== ACTION BUTTONS ========== */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem; /* ✅ Reduced */
  margin: 1.125rem 0; /* ✅ Reduced */
}

.btn-primary {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem; /* ✅ Reduced */
  padding: 0.938rem 1rem; /* ✅ Reduced */
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 100px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3), 0 2px 6px rgba(37, 99, 235, 0.2); /* ✅ Reduced shadow */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-primary:hover .btn-bg {
  opacity: 1;
}

.btn-primary:hover {
  transform: translateY(-2px); /* ✅ Reduced lift */
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.4), 0 4px 10px rgba(37, 99, 235, 0.25);
  color: white;
}

.btn-icon {
  font-size: 1.375rem; /* ✅ Reduced */
  z-index: 1;
}

.btn-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
  z-index: 1;
}

.btn-label {
  font-size: 0.938rem; /* ✅ REDUCED from 1rem */
  font-weight: 600;
  line-height: 1.2;
}

.btn-sublabel {
  font-size: 0.625rem; /* ✅ REDUCED from 0.688rem (10px) */
  opacity: 0.9;
}

.btn-arrow {
  font-size: 1.125rem; /* ✅ Reduced */
  transition: transform 0.3s;
  z-index: 1;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
}

.btn-primary:hover .btn-shine {
  animation: btnShine 0.8s ease-out;
}

@keyframes btnShine {
  100% { transform: translateX(100%); }
}

.btn-secondary {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.938rem 1.5rem; /* ✅ Reduced */
  background: transparent;
  border: 2px solid var(--color-accent-500);
  border-radius: 100px;
  text-decoration: none;
  color: var(--color-accent-600);
  font-weight: 600;
  font-size: 0.938rem; /* ✅ Added */
  overflow: hidden;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(249, 115, 22, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(249, 115, 22, 0.2);
}

.btn-border-anim {
  position: absolute;
  inset: -2px;
  background: conic-gradient(from 0deg, #f97316, #ea580c, #f97316);
  opacity: 0;
  animation: borderRotate 3s linear infinite;
  transition: opacity 0.3s;
}

.btn-secondary:hover .btn-border-anim {
  opacity: 0.3;
}

@keyframes borderRotate {
  100% { transform: rotate(360deg); }
}

/* ========== TRUST TAGS ========== */
.trust-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; /* ✅ Reduced */
}

.trust-tag {
  display: flex;
  align-items: center;
  gap: 0.375rem; /* ✅ Reduced */
  padding: 0.375rem 0.875rem; /* ✅ Reduced */
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 100px;
  font-size: 0.75rem; /* ✅ REDUCED from 0.813rem (12px) */
  color: var(--text-secondary);
  animation: tagFadeIn 0.5s ease-out both;
  transition: all 0.3s;
}

@keyframes tagFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.trust-tag:hover {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.35);
  transform: translateY(-2px);
}

.tag-dot {
  width: 4px; /* ✅ Smaller */
  height: 4px;
  background: var(--color-primary-500);
  border-radius: 50%;
  animation: tagDotPulse 2s ease-in-out infinite;
}

@keyframes tagDotPulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 5px rgba(59, 130, 246, 0);
  }
}

/* ========== VISUAL FRAME ========== */
.hero-visual {
  position: relative;
  height: 500px; /* ✅ REDUCED from 600px */
}

.visual-frame {
  position: relative;
  width: 100%;
  height: 440px; /* ✅ REDUCED from 520px */
  border-radius: 1.5rem; /* ✅ Reduced */
  overflow: hidden;
}

.frame-border {
  position: absolute;
  inset: -3px;
  background: conic-gradient(from 180deg, #3b82f6, #8b5cf6, #f97316, #3b82f6);
  border-radius: 1.5rem;
  animation: frameSpin 6s linear infinite;
  z-index: -1;
}

@keyframes frameSpin {
  100% { transform: rotate(360deg); }
}

.frame-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.25), transparent 70%); /* ✅ Reduced opacity */
  filter: blur(35px); /* ✅ Reduced blur */
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.4; } /* ✅ Reduced */
  50% { opacity: 0.8; }
}

.visual-image {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
}

.img-content {
  object-fit: cover;
  transition: transform 0.5s ease;
}

.visual-frame:hover .img-content {
  transform: scale(1.05);
}

.visual-stats {
  position: absolute;
  bottom: 1.25rem; /* ✅ Reduced */
  left: 1.25rem;
  right: 1.25rem;
  display: flex;
  gap: 0.875rem; /* ✅ Reduced */
  padding: 1rem; /* ✅ Reduced */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 1rem; /* ✅ Reduced */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12); /* ✅ Reduced */
}

[data-theme="dark"] .visual-stats {
  background: rgba(15, 23, 42, 0.95);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 1.75rem; /* ✅ REDUCED from 2rem */
  font-weight: 800;
  color: var(--color-primary-600);
}

.stat-label {
  font-size: 0.688rem; /* ✅ REDUCED from 0.75rem (11px) */
  color: var(--text-tertiary);
  margin-top: 0.125rem;
}

.stat-divider {
  width: 1px;
  background: var(--border-color);
}

.float-card {
  position: absolute;
  top: 1.5rem; /* ✅ Reduced */
  right: -1.5rem; /* ✅ Reduced */
  padding: 1rem 1.5rem; /* ✅ Reduced */
  background: white;
  border-radius: 1rem; /* ✅ Reduced */
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12); /* ✅ Reduced */
  animation: floatBounce 3s ease-in-out infinite;
}

[data-theme="dark"] .float-card {
  background: var(--color-gray-800);
}

@keyframes floatBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); } /* ✅ Reduced bounce */
}

.float-pulse {
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  width: 8px; /* ✅ Smaller */
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: floatPulse 2s ease-in-out infinite;
}

@keyframes floatPulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
}

.float-text {
  font-family: var(--font-display);
  font-size: 1.125rem; /* ✅ REDUCED from 1.25rem */
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-accent-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.deco-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1)); /* ✅ Reduced opacity */
  filter: blur(2px);
}

.deco-orb-1 {
  width: 100px; /* ✅ Smaller */
  height: 100px;
  top: -15px;
  left: -15px;
  animation: orbSpin1 15s linear infinite;
}

.deco-orb-2 {
  width: 80px; /* ✅ Smaller */
  height: 80px;
  bottom: -12px;
  right: -12px;
  animation: orbSpin2 20s linear infinite reverse;
}

@keyframes orbSpin1 {
  100% { transform: rotate(360deg); }
}

@keyframes orbSpin2 {
  100% { transform: rotate(-360deg); }
}

/* ========== STATS BAR ========== */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); /* ✅ Reduced */
  gap: 1rem; /* ✅ Reduced */
  padding: 1rem; /* ✅ Reduced */
  background: linear-gradient(285deg,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%);
  border-radius: 1rem; /* ✅ Reduced */
}

[data-theme="dark"] .stats-bar {
  background: rgba(30, 41, 59, 0.75);
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem; /* ✅ Reduced */
  padding: 0rem; /* ✅ Reduced */
  border-radius: 0.875rem; /* ✅ Reduced */
  transition: all 0.3s;
}

.stat-card:hover {
  background: rgba(59, 130, 246, 0.06);
  transform: translateY(-2px); /* ✅ Reduced */
}

.stat-icon {
  font-size: 1.2rem; /* ✅ REDUCED from 2rem */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.stat-number {
  font-family: var(--font-display);
  font-size: 1.375rem; /* ✅ REDUCED from 1.5rem */
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-desc {
  font-size: 0.688rem; /* ✅ REDUCED from 0.75rem (11px) */
  color: var(--text-primary);
}

.stat-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent);
  opacity: 0;
  border-radius: 0.875rem;
  transition: opacity 0.3s;
}

.stat-card:hover .stat-glow {
  opacity: 1;
}

/* ========== REVEAL ANIMATIONS ========== */
.reveal-top {
  animation: revealTop 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.reveal-fade {
  animation: revealFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.reveal-slide-1 {
  animation: revealSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.reveal-slide-2 {
  animation: revealSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

.reveal-slide-3 {
  animation: revealSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
}

.reveal-fade-delay {
  animation: revealFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
}

.reveal-scale {
  animation: revealScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.7s both;
}

.reveal-fade-final {
  animation: revealFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s both;
}

.reveal-scale-delay {
  animation: revealScale 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
}

.reveal-bottom {
  animation: revealBottom 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.9s both;
}

@keyframes revealTop {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes revealFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes revealSlide {
  from {
    opacity: 0;
    transform: translateY(30px); /* ✅ Reduced */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes revealScale {
  from {
    opacity: 0;
    transform: scale(0.95); /* ✅ Closer to 1 */
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes revealBottom {
  from {
    opacity: 0;
    transform: translateY(30px); /* ✅ Reduced */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 1024px) {
  .hero-visual {
    height: 420px; /* ✅ Reduced */
  }

  .visual-frame {
    height: 380px;
  }

  .float-card {
    right: 0.5rem;
  }
}

@media (max-width: 640px) {
  .hero-top-strip {
    width: 100%;
  }

  .strip-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .strip-divider {
    display: none;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .stats-bar {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    height: 350px; /* ✅ Reduced */
  }

  .visual-frame {
    height: 320px;
  }
  
  .headline-line {
    font-size: clamp(1.75rem, 8vw, 3rem); /* ✅ Mobile specific reduction */
  }
}

/* ========== ACCESSIBILITY ========== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;