// src/app/(public)/home/TrustSection.tsx

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Shield,
  GraduationCap,
  Monitor,
  MapPin,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

// ✅ Genuine data only
const trustCards = [
  {
    icon: Award,
    tag: "Certified Institute",
    title: "Government Recognized & Certified",
    description:
      "Shivshakti Computer Academy holds ISO 9001:2015 certification and is MSME registered under Government of India — ensuring quality education that meets international standards.",
    points: [
      "ISO 9001:2015 Quality Certified",
      "MSME Government Registered",
      "DigiLocker Compatible Certificates",
      "GSDM Authorized Centre",
    ],
    accent: "blue",
  },
  {
    icon: GraduationCap,
    tag: "Expert Faculty",
    title: "Experienced Teachers, Real Results",
    description:
      "Our faculty brings years of hands-on teaching and industry experience across multiple institutions — giving students the best of both academic and practical worlds.",
    points: [
      "Multi-institution teaching experience",
      "Industry-trained instructors",
      "Personalized attention per student",
      "Regular curriculum updates",
    ],
    accent: "orange",
  },
  {
    icon: Monitor,
    tag: "Practical Training",
    title: "Hands-on Labs & Real Projects",
    description:
      "Every course at Shivshakti includes practical lab sessions on modern computers with real software — because we believe learning happens by doing, not just reading.",
    points: [
      "Modern computer lab facility",
      "Real software & tools training",
      "Project-based learning approach",
      "Skill India aligned curriculum",
    ],
    accent: "blue",
  },
];

const recognitions = [
  { label: "GSDM Authorized" },
  { label: "Skill India Aligned" },
  { label: "DigiLocker Compatible" },
  { label: "NSDC Partner" },
  { label: "ISO 9001:2015" },
  { label: "MSME Registered" },
];

export default function TrustSection() {
  return (
    <section className="trust-section" aria-labelledby="trust-heading">
      <div className="trust-container">

        {/* ── Section Header ── */}
        <div className="trust-header">
          <span className="trust-tag">
            <span className="trust-tag-dot" />
            Trusted & Recognized
          </span>
          <h2 id="trust-heading" className="trust-title">
            Why Students{" "}
            <span className="trust-title-accent">Trust Us</span>
          </h2>
          <p className="trust-subtitle">
            A government-recognized institute in Ambikapur backed by
            experienced faculty, certified programs, and a commitment to
            quality education since June 2025.
          </p>
        </div>

        {/* ── 3 Cards ── */}
        <div className="trust-cards">
          {trustCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`trust-card trust-card--${card.accent}`}
              >
                {/* Card Top */}
                <div className="trust-card-top">
                  <div className="trust-card-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <span className="trust-card-tag">{card.tag}</span>
                </div>

                {/* Card Content */}
                <h3 className="trust-card-title">{card.title}</h3>
                <p className="trust-card-desc">{card.description}</p>

                {/* Points */}
                <ul className="trust-card-points">
                  {card.points.map((point) => (
                    <li key={point} className="trust-card-point">
                      <CheckCircle size={14} strokeWidth={2} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ── Founder Strip ── */}
        <div className="trust-founder">
          <div className="trust-founder-photo">
            <Image
              src="/founder.jpg"
              alt="Vikram Sir - Founder, Shivshakti Computer Academy"
              fill
              sizes="80px"
              className="trust-founder-img"
            />
          </div>
          <div className="trust-founder-content">
            <div className="trust-founder-meta">
              <span className="trust-founder-name">Vikram Sir</span>
              <span className="trust-founder-role">
                Founder & Lead Instructor · Est. June 2025
              </span>
            </div>
            <p className="trust-founder-quote">
              "Our mission is simple — give every student in Ambikapur
              access to quality computer education that opens real doors
              in their career."
            </p>
          </div>
          <Link href="/about" className="trust-founder-cta">
            About Academy
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>

        {/* ── Recognition Strip ── */}
        <div className="trust-recognitions">
          <div className="trust-recognitions-label">
            <Shield size={14} strokeWidth={2} />
            <span>Affiliated & Recognized by</span>
          </div>
          <div className="trust-recognitions-pills">
            {recognitions.map((rec) => (
              <span key={rec.label} className="trust-rec-pill">
                <CheckCircle size={12} strokeWidth={2.5} />
                {rec.label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}