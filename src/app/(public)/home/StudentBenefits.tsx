"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Bot,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Clock,
  Layers,
  Users,
  Monitor,
  Zap,
} from "lucide-react";

// ✅ Genuine benefits - carousel slides
const benefits = [
  {
    id: "lms",
    tag: "On Admission",
    tagColor: "green",
    icon: BookOpen,
    accentColor: "blue",
    title: "Lifetime LMS Access",
    subtitle: "Learn anytime, anywhere — no expiry",
    description:
      "Every enrolled student gets permanent access to our Learning Management System. Study at your own pace, revisit any concept anytime — no renewal fee, ever.",
    features: [
      { icon: BookOpen, text: "Course study materials & notes" },
      { icon: Layers, text: "Chapter-wise practice modules" },
      { icon: Clock, text: "Learn at your own pace, anytime" },
      { icon: Award, text: "Certificate preparation guides" },
    ],
    stat: { value: "Lifetime", label: "Free Access" },
    cta: { label: "Student Login", href: "/student/login" },
    visual: "lms",
  },
  {
    id: "cert",
    tag: "Govt. Recognized",
    tagColor: "blue",
    icon: Award,
    accentColor: "orange",
    title: "Verified Certificates",
    subtitle: "Accepted across India for jobs & education",
    description:
      "Our certificates are government-recognized and digitally verifiable via DigiLocker and enrollment number — giving you credentials that employers and institutions trust.",
    features: [
      { icon: ShieldCheck, text: "Skill India aligned programs" },
      { icon: CheckCircle, text: "DigiLocker digital verification" },
      { icon: Award, text: "GSDM authorized certificates" },
      { icon: Zap, text: "Verifiable via enrollment number" },
    ],
    stat: { value: "100%", label: "Verifiable" },
    cta: { label: "Verify Certificate", href: "/verify-certificate" },
    visual: "cert",
  },
  {
    id: "lab",
    tag: "Modern Facility",
    tagColor: "orange",
    icon: Monitor,
    accentColor: "blue",
    title: "Modern Computer Labs",
    subtitle: "Hands-on training with real software",
    description:
      "Learn on modern computers with industry-standard software. Every course includes dedicated lab hours so you build real skills, not just theoretical knowledge.",
    features: [
      { icon: Monitor, text: "Latest computers & hardware" },
      { icon: Layers, text: "Industry-standard software tools" },
      { icon: Users, text: "Small batch, personal attention" },
      { icon: BookOpen, text: "Project-based learning approach" },
    ],
    stat: { value: "25+", label: "Courses" },
    cta: { label: "View Courses", href: "/courses" },
    visual: "lab",
  },
  {
    id: "guidance",
    tag: "Free of Cost",
    tagColor: "green",
    icon: Users,
    accentColor: "orange",
    title: "Free Admission Guidance",
    subtitle: "We help you choose the right course",
    description:
      "Not sure which course is right for you? Our counselors provide free one-on-one guidance to help you pick the best program based on your goals and background.",
    features: [
      { icon: Users, text: "One-on-one counseling session" },
      { icon: BookOpen, text: "Course comparison & advice" },
      { icon: Clock, text: "Flexible batch timing options" },
      { icon: CheckCircle, text: "Fee structure & EMI options" },
    ],
    stat: { value: "Free", label: "Counseling" },
    cta: { label: "Book Counseling", href: "/enquiry" },
    visual: "guidance",
  },
  {
    id: "ai",
    tag: "Coming Soon",
    tagColor: "muted",
    icon: Bot,
    accentColor: "muted",
    title: "AI Learning Assistant",
    subtitle: "Your 24/7 doubt-clearing companion",
    description:
      "We are building an AI-powered assistant that will help students clear doubts instantly, get personalized study recommendations, and stay on track — available anytime.",
    features: [
      { icon: Bot, text: "Instant doubt clearing, 24/7" },
      { icon: Zap, text: "Smart study recommendations" },
      { icon: Layers, text: "Progress tracking dashboard" },
      { icon: Lock, text: "Deeper access for enrolled students" },
    ],
    stat: { value: "Soon", label: "Launching" },
    cta: { label: "Know More", href: "/about" },
    visual: "ai",
  },
];

export default function StudentBenefits() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const total = benefits.length;

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % total, "next");
  }, [current, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total, "prev");
  }, [current, total, goTo]);

  // Auto play
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = benefits[current];
  const Icon = slide.icon;

  return (
    <section className="sb-section">
      {/* Top Color Strip */}
      <div className="sb-strip-top" aria-hidden="true">
        <div className="sb-strip-inner">
          {benefits.map((b, i) => (
            <span
              key={b.id}
              className={`sb-strip-label ${
                i === current ? "sb-strip-label--active" : ""
              }`}
            >
              {b.title}
            </span>
          ))}
        </div>
      </div>

      {/* Main Carousel Section */}
      <div className="sb-main">
        {/* Left Arrow */}
        <button
          className="sb-arrow sb-arrow--left"
          onClick={goPrev}
          aria-label="Previous benefit"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {/* Slide Content */}
        <div className="sb-container">
          <div
            className={`sb-slide sb-slide--${direction} ${
              isAnimating ? "sb-slide--animating" : ""
            }`}
          >
            {/* LEFT - Content */}
            <div className="sb-content">
              {/* Tag */}
              <span className={`sb-tag sb-tag--${slide.tagColor}`}>
                {slide.tag}
              </span>

              {/* Icon + Title */}
              <div className="sb-title-row">
                <div className={`sb-icon sb-icon--${slide.accentColor}`}>
                  <Icon size={28} strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="sb-title">{slide.title}</h2>
                  <p className="sb-subtitle">{slide.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="sb-description">{slide.description}</p>

              {/* Features */}
              <ul className="sb-features">
                {slide.features.map((f) => {
                  const FIcon = f.icon;
                  return (
                    <li key={f.text} className="sb-feature">
                      <span className={`sb-feature-icon sb-feature-icon--${slide.accentColor}`}>
                        <FIcon size={14} strokeWidth={2} />
                      </span>
                      <span>{f.text}</span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              <Link
                href={slide.cta.href}
                className={`sb-cta sb-cta--${slide.accentColor}`}
              >
                {slide.cta.label}
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>

            {/* RIGHT - Visual */}
            <div className="sb-visual">
              {/* Stat Box */}
              <div className={`sb-stat-box sb-stat-box--${slide.accentColor}`}>
                <div className="sb-stat-value">{slide.stat.value}</div>
                <div className="sb-stat-label">{slide.stat.label}</div>
              </div>

              {/* Visual based on slide type */}
              {slide.visual === "lms" && (
                <div className="sb-visual-lms" aria-hidden="true">
                  <div className="sb-browser-bar">
                    <div className="sb-browser-dots">
                      <span /><span /><span />
                    </div>
                    <div className="sb-browser-url">
                      student.shivshakticomputer.in
                    </div>
                  </div>
                  <div className="sb-browser-body">
                    <div className="sb-browser-sidebar">
                      <div className="sb-nav-item sb-nav-item--active" />
                      <div className="sb-nav-item" />
                      <div className="sb-nav-item" />
                      <div className="sb-nav-item" />
                    </div>
                    <div className="sb-browser-content">
                      <div className="sb-content-heading" />
                      <div className="sb-content-progress">
                        <div className="sb-content-fill" />
                      </div>
                      <div className="sb-content-line" />
                      <div className="sb-content-line sb-content-line--short" />
                      <div className="sb-modules">
                        <div className="sb-module sb-module--done">✓ Module 1</div>
                        <div className="sb-module sb-module--active">▶ Module 2</div>
                        <div className="sb-module">○ Module 3</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.visual === "cert" && (
                <div className="sb-visual-cert" aria-hidden="true">
                  <div className="sb-cert-card">
                    <ShieldCheck size={40} strokeWidth={1.3} className="sb-cert-shield" />
                    <div className="sb-cert-content">
                      <div className="sb-cert-title-line" />
                      <div className="sb-cert-name-line" />
                      <div className="sb-cert-course-line" />
                      <div className="sb-cert-tags">
                        <span>DigiLocker ✓</span>
                        <span>GSDM ✓</span>
                        <span>Skill India ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slide.visual === "lab" && (
                <div className="sb-visual-lab" aria-hidden="true">
                  <div className="sb-lab-grid">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="sb-lab-item">
                        <Monitor
                          size={24}
                          strokeWidth={1.5}
                          className="sb-lab-icon"
                        />
                        <div className="sb-lab-label">PC {n}</div>
                      </div>
                    ))}
                  </div>
                  <div className="sb-lab-caption">
                    Modern Computer Lab — Shivshakti Academy
                  </div>
                </div>
              )}

              {slide.visual === "guidance" && (
                <div className="sb-visual-guidance" aria-hidden="true">
                  <div className="sb-guidance-card">
                    <div className="sb-guidance-avatar">V</div>
                    <div className="sb-guidance-content">
                      <div className="sb-guidance-name">Vikram Sir</div>
                      <div className="sb-guidance-role">
                        Founder & Lead Instructor
                      </div>
                      <div className="sb-guidance-msg">
                        "We personally guide every student to find the right
                        course for their career goals."
                      </div>
                    </div>
                  </div>
                  <div className="sb-guidance-tags">
                    <span>Free Counseling</span>
                    <span>Career Guidance</span>
                    <span>Course Selection</span>
                  </div>
                </div>
              )}

              {slide.visual === "ai" && (
                <div className="sb-visual-ai" aria-hidden="true">
                  <div className="sb-ai-preview">
                    <div className="sb-ai-header">
                      <Bot size={16} strokeWidth={2} />
                      <span>AI Assistant</span>
                      <span className="sb-ai-soon-badge">Coming Soon</span>
                    </div>
                    <div className="sb-ai-msg sb-ai-msg--user">
                      Which course is best for me?
                    </div>
                    <div className="sb-ai-msg sb-ai-msg--bot">
                      <span className="sb-ai-dot" />
                      Based on your background, DCA would be perfect to start!
                    </div>
                    <div className="sb-ai-input">
                      <span>Ask anything...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="sb-dots">
            {benefits.map((b, i) => (
              <button
                key={b.id}
                className={`sb-dot ${i === current ? "sb-dot--active" : ""}`}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                aria-label={`Go to ${b.title}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="sb-counter">
            <span className="sb-counter-current">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="sb-counter-sep">/</span>
            <span className="sb-counter-total">
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right Arrow */}
        <button
          className="sb-arrow sb-arrow--right"
          onClick={goNext}
          aria-label="Next benefit"
        >
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom Color Strip */}
      <div className="sb-strip-bottom" aria-hidden="true">
        <div className="sb-strip-inner">
          <span>Lifetime LMS</span>
          <span className="sb-strip-sep">•</span>
          <span>Verified Certificates</span>
          <span className="sb-strip-sep">•</span>
          <span>Modern Labs</span>
          <span className="sb-strip-sep">•</span>
          <span>Free Guidance</span>
          <span className="sb-strip-sep">•</span>
          <span>AI Assistant (Soon)</span>
        </div>
      </div>
    </section>
  );
}