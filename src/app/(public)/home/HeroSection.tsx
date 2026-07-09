"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data
  const slides = [
    {
      image: "/annual-day/1.jpg",
      title: "Empower Your Digital Future",
      subtitle: "Professional Computer Education",
      description:
        "Transform your career with industry-leading computer courses and government-recognized certifications.",
    },
    {
      image: "/annual-day/2.jpg",
      title: "Expert Faculty & Modern Labs",
      subtitle: "Practical Hands-on Training",
      description:
        "Learn from experienced faculty with state-of-the-art computer labs and latest technology.",
    },
    {
      image: "/annual-day/3.jpg",
      title: "25+ Certified Courses",
      subtitle: "DCA, PGDCA, TallyPrime, Web Development & More",
      description:
        "Choose from a wide range of professional courses designed for real-world success.",
    },
  ];

  const stats = [
    { num: "10+", label: "Years Experience" },
    { num: "25+", label: "Courses Offered" },
    { num: "Online", label: "Verification" },
    { num: "24/7", label: "Support Available" },
  ];

  const trustBadges = [
    "ISO 9001:2015",
    "MSME Registered",
    "Govt. Recognized",
    "NSDC Partner",
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-carousel" aria-labelledby="hero-heading">
      {/* Carousel Slides */}
      <div className="hero-carousel-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${
              index === currentSlide ? "hero-slide-active" : ""
            }`}
          >
            {/* Background Image */}
            <div className="hero-slide-bg">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                className="hero-slide-image"
                priority={index === 0}
              />
            </div>

            {/* Overlay - Color + Opacity */}
            <div className="hero-slide-overlay" />

            {/* Content */}
            <div className="hero-slide-content">
              <div className="hero-container-carousel">
                <div className="hero-content-box">
                  {/* Badge */}
                  {index === 0 && (
                    <div className="hero-badge-top">
                      <span className="hero-badge-dot">●</span>
                      Government Recognized Training Centre
                    </div>
                  )}

                  {/* Title */}
                  <h1
                    id="hero-heading"
                    className="hero-carousel-title"
                  >
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <div className="hero-carousel-subtitle">
                    {slide.subtitle}
                  </div>

                  {/* Description */}
                  <p className="hero-carousel-description">
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="hero-carousel-actions">
                    <Link
                      href="/courses"
                      className="hero-btn-carousel hero-btn-carousel-primary"
                    >
                      Explore Courses
                    </Link>
                    <Link
                      href="/verify-certificate"
                      className="hero-btn-carousel hero-btn-carousel-secondary"
                    >
                      Verify Certificate
                    </Link>
                  </div>

                  {/* Trust Badges - only on first slide */}
                  {index === 0 && (
                    <div className="hero-trust-badges">
                      {trustBadges.map((badge, idx) => (
                        <span key={badge} className="hero-trust-tag">
                          {idx > 0 && <span className="hero-trust-dot">•</span>}
                          <span className="hero-trust-icon">✓</span>
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="hero-carousel-nav">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`hero-nav-dot ${
              index === currentSlide ? "hero-nav-dot-active" : ""
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Stats Bar - Below carousel */}
      <div className="hero-stats-bar">
        <div className="hero-container-carousel">
          <div className="hero-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat-item">
                <div className="hero-stat-number">{stat.num}</div>
                <div className="hero-stat-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="hero-wave-shape">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path
            d="M0,40 C300,60 600,20 900,40 C1000,50 1100,30 1200,35 L1200,80 L0,80 Z"
            fill="var(--bg-page)"
          />
        </svg>
      </div>
    </section>
  );
}