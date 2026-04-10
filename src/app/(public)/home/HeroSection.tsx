"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      <style>{heroStyles}</style>

      <section className="hero-section" aria-labelledby="hero-heading">
        {/* Animated Background */}
        <div className="hero-bg-animated">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
        </div>

        {/* Diagonal Split Background */}
        <div className="hero-diagonal-split" aria-hidden="true" />

        {/* Floating Elements */}
        <div className="hero-float hero-float-1" aria-hidden="true">
          <div className="hero-float-content">
            <span className="hero-float-icon">🎓</span>
            <span className="hero-float-text">ISO Certified</span>
          </div>
        </div>

        <div className="hero-float hero-float-2" aria-hidden="true">
          <div className="hero-float-content">
            <span className="hero-float-icon">⚡</span>
            <span className="hero-float-text">Expert Faculty</span>
          </div>
        </div>

        {/* Main Container */}
        <div className="hero-container">
          
          {/* Top Bar - Stats */}
          <div className="hero-top-bar anim-slide-down">
            {[
              { icon: "🏆", label: "Government Recognized" },
              { icon: "🔒", label: "MSME Registered" },
              { icon: "📜", label: "ISO 9001:2015 Certified" },
            ].map((item, i) => (
              <div key={i} className="hero-top-item">
                <span className="hero-top-icon">{item.icon}</span>
                <span className="hero-top-label">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Main Content Grid - Asymmetric */}
          <div className="hero-content-wrapper">
            
            {/* Left - Large Content Block */}
            <div className="hero-main-content">
              
              {/* Animated Badge */}
              <div className="hero-badge-wrapper anim-fade-in">
                <div className="hero-badge">
                  <span className="hero-badge-pulse" />
                  <span className="hero-badge-text">
                    🇮🇳 Government Recognized Training Centre
                  </span>
                </div>
              </div>

              {/* Hero Title - Stacked */}
              <h1 id="hero-heading" className="hero-title anim-slide-up">
                <span className="hero-title-line">Empower Your</span>
                <span className="hero-title-line hero-title-gradient">
                  Digital Future
                </span>
                <span className="hero-title-line hero-title-outline">
                  with Skills
                </span>
              </h1>

              {/* Description with Icon */}
              <div className="hero-description anim-fade-in-delay">
                <div className="hero-desc-icon">💡</div>
                <p className="hero-desc-text">
                  Transform your career with industry-leading computer education,
                  government-recognized certifications, and practical training
                  designed for real-world success in Ambikapur & Surguja.
                </p>
              </div>

              {/* Interactive CTA Group */}
              <div className="hero-cta-wrapper anim-slide-up-delay">
                <Link href="/courses" className="hero-cta-primary">
                  <span className="hero-cta-icon">🚀</span>
                  <span className="hero-cta-text">
                    <span className="hero-cta-main">Explore Courses</span>
                    <span className="hero-cta-sub">25+ programs available</span>
                  </span>
                  <span className="hero-cta-arrow">→</span>
                </Link>

                <Link href="/verify-certificate" className="hero-cta-secondary">
                  <span className="hero-cta-sec-icon">🔍</span>
                  <span>Verify Certificate</span>
                </Link>
              </div>

              {/* Trust Indicators - Horizontal Pills */}
              <div className="hero-trust-pills anim-fade-in-delay-2">
                {[
                  "ISO 9001:2015",
                  "MSME Registered",
                  "DigiLocker Enabled",
                  "NSDC Partner",
                ].map((pill) => (
                  <div key={pill} className="hero-pill">
                    <span className="hero-pill-dot" />
                    {pill}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image Collage */}
            <div className="hero-image-collage anim-scale-in">
              
              {/* Main Image Card */}
              <div className="hero-image-main">
                <div className="hero-image-border" />
                <Image
                  src="/hero.jpg"
                  alt="Students learning at Shivshakti Computer Academy"
                  fill
                  sizes="(max-width: 900px) 100vw, 500px"
                  priority
                  className="hero-image"
                />
                
                {/* Overlay Stats Card */}
                <div className="hero-image-overlay">
                  <div className="hero-overlay-stat">
                    <div className="hero-overlay-number">10+</div>
                    <div className="hero-overlay-label">Years Exp.</div>
                  </div>
                  <div className="hero-overlay-divider" />
                  <div className="hero-overlay-stat">
                    <div className="hero-overlay-number">25+</div>
                    <div className="hero-overlay-label">Courses</div>
                  </div>
                </div>
              </div>

              {/* Small Floating Card */}
              <div className="hero-image-floating">
                <div className="hero-float-card">
                  {/* <div className="hero-float-card-icon">👥</div> */}
                  <div className="hero-float-card-content">
                    <div className="hero-float-card-number">Admisson Open</div>
                    {/* <div className="hero-float-card-label">Active Students</div> */}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="hero-deco hero-deco-1" />
              <div className="hero-deco hero-deco-2" />
            </div>
          </div>

          {/* Bottom Stats Bar - Glass Effect */}
          <div className="hero-stats-bar anim-slide-up-final">
            {[
              { num: "10+", label: "Years Experience", icon: "📅" },
              { num: "25+", label: "Courses", icon: "📚" },
              { num: "Online", label: "Verification", icon: "🔐" },
              { num: "24/7", label: "Support", icon: "💬" },
            ].map((stat, i) => (
              <div key={i} className="hero-stat-item">
                <div className="hero-stat-icon">{stat.icon}</div>
                <div className="hero-stat-content">
                  <div className="hero-stat-num">{stat.num}</div>
                  <div className="hero-stat-label">{stat.label}</div>
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
/* Same styles as before - no changes needed */
/* Copy the entire heroStyles from previous response */

.hero-section {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, #f3f4f6 100%);
}

[data-theme="dark"] .hero-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}

.hero-bg-animated {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: heroFloat 20s ease-in-out infinite;
}

.hero-shape-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.hero-shape-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.3), transparent);
  bottom: -150px;
  left: -50px;
  animation-delay: 5s;
}

.hero-shape-3 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes heroFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

.hero-diagonal-split {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(37, 99, 235, 0.03) 100%);
  clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: 1;
}

.hero-float {
  position: absolute;
  z-index: 5;
  animation: floatBounce 3s ease-in-out infinite;
}

.hero-float-1 {
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.hero-float-2 {
  bottom: 25%;
  right: 2%;
  animation-delay: 1.5s;
  z-index: 1000;
}

@keyframes floatBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.hero-float-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: var(--radius-2xl);
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  box-shadow: var(--shadow-lg);
}

[data-theme="dark"] .hero-float-content {
  background: rgba(30, 41, 59, 0.9);
}

.hero-float-icon {
  font-size: 1.5rem;
}

.hero-float-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  white-space: nowrap;
}

.hero-container {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-8);
}

.hero-top-bar {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: var(--radius-2xl);
  width: fit-content;
}

[data-theme="dark"] .hero-top-bar {
  background: rgba(30, 41, 59, 0.6);
}

.hero-top-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.hero-top-icon {
  font-size: 1.2rem;
}

.hero-top-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  white-space: nowrap;
}

.hero-content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-content-wrapper {
    grid-template-columns: 1.2fr 1fr;
    gap: var(--space-16);
  }
}

.hero-main-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.hero-badge-wrapper {
  display: flex;
}

.hero-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(37, 99, 235, 0.3);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.hero-badge::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.hero-badge-pulse {
  width: 8px;
  height: 8px;
  background: var(--color-primary-600);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.hero-badge-text {
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  letter-spacing: 0.05em;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.hero-title-line {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: var(--font-weight-extrabold);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-title-gradient {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-accent-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.hero-title-gradient::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 200px;
  height: 6px;
  background: linear-gradient(90deg, var(--color-primary-600), transparent);
  border-radius: var(--radius-full);
}

.hero-title-outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--text-primary);
}

.hero-description {
  display: flex;
  gap: var(--space-4);
  align-items: start;
  padding: var(--space-5);
  background: rgba(255, 255, 255, 0.5);
  border-left: 4px solid var(--color-primary-600);
  border-radius: var(--radius-xl);
}

[data-theme="dark"] .hero-description {
  background: rgba(30, 41, 59, 0.5);
}

.hero-desc-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.hero-desc-text {
  font-size: var(--font-size-base);
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
}

.hero-cta-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.hero-cta-primary {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  border-radius: var(--radius-2xl);
  text-decoration: none;
  color: var(--color-white);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.hero-cta-primary::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
  transform: translateX(-100%);
  transition: transform var(--transition-base);
}

.hero-cta-primary:hover::before {
  transform: translateX(100%);
}

.hero-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.4);
}

.hero-cta-icon {
  font-size: 1.5rem;
}

.hero-cta-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero-cta-main {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.hero-cta-sub {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

.hero-cta-arrow {
  font-size: 1.2rem;
  transition: transform var(--transition-fast);
}

.hero-cta-primary:hover .hero-cta-arrow {
  transform: translateX(4px);
}

.hero-cta-secondary {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: transparent;
  border: 2px solid var(--color-accent-600);
  border-radius: var(--radius-2xl);
  text-decoration: none;
  color: var(--color-accent-600);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-base);
}

.hero-cta-secondary:hover {
  background: rgba(249, 115, 22, 0.1);
  transform: translateY(-2px);
}

.hero-cta-sec-icon {
  font-size: 1.2rem;
}

.hero-trust-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.hero-pill {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: rgba(37, 99, 235, 0.05);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.hero-pill:hover {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.3);
}

.hero-pill-dot {
  width: 6px;
  height: 6px;
  background: var(--color-primary-600);
  border-radius: 50%;
}

.hero-image-collage {
  position: relative;
  height: 600px;
}

.hero-image-main {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: var(--radius-3xl);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.hero-image-border {
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-accent-600));
  border-radius: var(--radius-3xl);
  z-index: -1;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.hero-image {
  object-fit: cover;
}

.hero-image-overlay {
  position: absolute;
  bottom: var(--space-6);
  left: var(--space-6);
  right: var(--space-6);
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

[data-theme="dark"] .hero-image-overlay {
  background: rgba(15, 23, 42, 0.95);
}

.hero-overlay-stat {
  flex: 1;
  text-align: center;
}

.hero-overlay-number {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}

.hero-overlay-label {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  margin-top: var(--space-1);
}

.hero-overlay-divider {
  width: 1px;
  background: var(--border-color);
}

.hero-image-floating {
  position: absolute;
  top: var(--space-6);
  right: -var(--space-8);
  animation: floatBounce 3s ease-in-out infinite;
}

.hero-float-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}

[data-theme="dark"] .hero-float-card {
  background: var(--color-gray-800);
}

.hero-float-card-icon {
  font-size: 2rem;
}

.hero-float-card-number {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}

.hero-float-card-label {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.hero-deco {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-200), var(--color-accent-200));
  opacity: 0.3;
}

.hero-deco-1 {
  width: 100px;
  height: 100px;
  top: -20px;
  left: -20px;
  animation: rotate 10s linear infinite;
}

.hero-deco-2 {
  width: 80px;
  height: 80px;
  bottom: -10px;
  right: -10px;
  animation: rotate 15s linear infinite reverse;
}

.hero-stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-4);
  padding: var(--space-6);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
}

[data-theme="dark"] .hero-stats-bar {
  background: rgba(30, 41, 59, 0.7);
}

.hero-stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.hero-stat-icon {
  font-size: 2rem;
}

.hero-stat-num {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.hero-stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.anim-slide-down {
  animation: slideDown 0.6s ease-out;
}

.anim-fade-in {
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.anim-slide-up {
  animation: slideUp 0.8s ease-out 0.3s both;
}

.anim-fade-in-delay {
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.anim-slide-up-delay {
  animation: slideUp 0.8s ease-out 0.5s both;
}

.anim-fade-in-delay-2 {
  animation: fadeIn 0.6s ease-out 0.6s both;
}

.anim-scale-in {
  animation: scaleIn 0.8s ease-out 0.4s both;
}

.anim-slide-up-final {
  animation: slideUp 0.8s ease-out 0.7s both;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 1024px) {
  .hero-float {
    display: none;
  }

  .hero-image-collage {
    height: 400px;
  }

  .hero-image-main {
    height: 400px;
  }

  .hero-image-floating {
    right: var(--space-4);
  }
}

@media (max-width: 640px) {
  .hero-top-bar {
    flex-direction: column;
    align-items: start;
    width: 100%;
  }

  .hero-stats-bar {
    grid-template-columns: 1fr;
  }

  .hero-cta-wrapper {
    flex-direction: column;
  }

  .hero-cta-primary,
  .hero-cta-secondary {
    width: 100%;
    justify-content: center;
  }
}
`;