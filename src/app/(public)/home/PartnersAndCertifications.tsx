import Link from "next/link";
import {
  Shield,
  Award,
  FileCheck,
  Globe,
  Lock,
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const universityPartner = {
  name: "Mangalayatan University",
  mode: "Online & Distance Education",
  note: "Admission Assistance Partner",
  via: "Authorized through College Vidya",
  description:
    "We assist students with admissions to Mangalayatan University's UGC-entitled online and distance education degree programs — including BCA, BA, B.Com, BSc, MSc and MBA — right here in Ambikapur.",
  programs: ["BCA", "BA", "B.Com", "BSc", "MSc", "MBA"],
  cta: "/contact",
};

const affiliations = [
  {
    title: "ISO 9001:2015 Certified",
    description:
      "International quality management standards for education delivery and professional training.",
    badge: "Quality Certified",
    icon: Award,
    accent: "blue",
  },
  {
    title: "Gramin Skill Development Mission",
    description:
      "Authorized training centre under GSDM — aligned with Skill India government initiatives.",
    badge: "Govt. Authorized",
    icon: Shield,
    accent: "orange",
  },
  {
    title: "Drishti Computer Education",
    description:
      "Authorized franchise partner providing verified certification for professional courses.",
    badge: "Franchise Partner",
    icon: Building2,
    accent: "blue",
  },
  {
    title: "Skill India & NSDC",
    description:
      "Selected course certificates verifiable through Skill India and NSDC platforms.",
    badge: "Skill India",
    icon: FileCheck,
    accent: "orange",
  },
  {
    title: "DigiLocker Enabled",
    description:
      "Diploma certificates accessible digitally via DigiLocker with lifetime verification.",
    badge: "Digital Verified",
    icon: Lock,
    accent: "blue",
  },
  {
    title: "MSME Registered Institute",
    description:
      "Government-registered MSME institute ensuring authenticity and legal compliance.",
    badge: "Govt. Registered",
    icon: Globe,
    accent: "orange",
  },
];

const trustMarks = [
  { label: "ISO 9001:2015", icon: Award },
  { label: "MSME Udyam", icon: Globe },
  { label: "Skill India", icon: FileCheck },
  { label: "NSDC", icon: Shield },
  { label: "DigiLocker", icon: Lock },
  { label: "GSDM", icon: Building2 },
];

export default function PartnersAndCertifications() {
  return (
    <section
      className="pac-section"
      aria-labelledby="pac-heading"
    >

      {/* ── TOP STRIP — Full width colorful bar ── */}
      <div className="pac-strip-top" aria-hidden="true">
        <div className="pac-strip-top-inner">
          <span>ISO 9001:2015</span>
          <span className="pac-strip-sep">·</span>
          <span>MSME Registered</span>
          <span className="pac-strip-sep">·</span>
          <span>Skill India</span>
          <span className="pac-strip-sep">·</span>
          <span>NSDC Partner</span>
          <span className="pac-strip-sep">·</span>
          <span>DigiLocker Enabled</span>
          <span className="pac-strip-sep">·</span>
          <span>GSDM Authorized</span>
          <span className="pac-strip-sep">·</span>
          <span>Govt. Recognized</span>
          <span className="pac-strip-sep">·</span>
          <span>ISO 9001:2015</span>
          <span className="pac-strip-sep">·</span>
          <span>MSME Registered</span>
          <span className="pac-strip-sep">·</span>
          <span>Skill India</span>
          <span className="pac-strip-sep">·</span>
          <span>NSDC Partner</span>
          <span className="pac-strip-sep">·</span>
          <span>DigiLocker Enabled</span>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="pac-body">
        <div className="pac-container">

          {/* ── Section Header ── */}
          <div className="pac-header">
            <span className="pac-tag">
              <span className="pac-tag-dot" aria-hidden="true" />
              Recognitions &amp; Affiliations
            </span>
            <h2 id="pac-heading" className="pac-title">
              Partners &amp;{" "}
              <span className="pac-title-accent">Certifications</span>
            </h2>
            <p className="pac-subtitle">
              Government-recognized certifications, a university admission
              partnership, and authorized training affiliations — ensuring
              transparency and credibility for every student we train.
            </p>
          </div>

          {/* ── University Partner Banner ── */}
          <div className="pac-uni-banner">

            {/* Left — Icon */}
            <div className="pac-uni-icon-wrap">
              <div className="pac-uni-icon">
                <GraduationCap size={40} strokeWidth={1.4} />
              </div>
              <div className="pac-uni-icon-label">
                University<br />Partner
              </div>
            </div>

            {/* Center — Content */}
            <div className="pac-uni-content">
              <span className="pac-uni-eyebrow">
                {universityPartner.note}
              </span>
              <h3 className="pac-uni-name">
                {universityPartner.name}
              </h3>
              <p className="pac-uni-mode">
                {universityPartner.mode}
              </p>
              <p className="pac-uni-desc">
                {universityPartner.description}
              </p>
              <div
                className="pac-uni-programs"
                aria-label="Available degree programs"
              >
                {universityPartner.programs.map((program) => (
                  <span key={program} className="pac-uni-program">
                    {program}
                  </span>
                ))}
              </div>
              <p className="pac-uni-via">
                {universityPartner.via}
              </p>
            </div>

            {/* Right — CTA */}
            <div className="pac-uni-action">
              <CheckCircle
                size={36}
                strokeWidth={1.5}
                className="pac-uni-check"
              />
              <p className="pac-uni-action-text">
                Free counseling &amp; admission guidance available
              </p>
              <Link href={universityPartner.cta} className="pac-uni-btn">
                Enquire About Degrees
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </div>

          </div>

          {/* ── Affiliations Grid ── */}
          <div className="pac-grid-label">
            <span className="pac-grid-eyebrow">
              Our Affiliations &amp; Accreditations
            </span>
            <div className="pac-grid-line" aria-hidden="true" />
          </div>

          <div className="pac-grid">
            {affiliations.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className={`pac-card pac-card--${item.accent}`}
                >
                  <div className="pac-card-top">
                    <div className="pac-card-icon">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>
                    <span className="pac-card-badge">{item.badge}</span>
                  </div>
                  <h3 className="pac-card-title">{item.title}</h3>
                  <p className="pac-card-desc">{item.description}</p>
                </article>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── BOTTOM STRIP — Full width dark trust bar ── */}
      <div className="pac-strip-bottom">
        <div className="pac-strip-bottom-inner">
          <div className="pac-strip-bottom-label">
            <CheckCircle size={16} strokeWidth={2} />
            <span>Verified &amp; Recognized by</span>
          </div>
          <div className="pac-strip-bottom-sep" aria-hidden="true" />
          <div className="pac-strip-bottom-marks">
            {trustMarks.map((mark) => {
              const Icon = mark.icon;
              return (
                <div key={mark.label} className="pac-strip-mark">
                  <Icon size={14} strokeWidth={2} />
                  <span>{mark.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}