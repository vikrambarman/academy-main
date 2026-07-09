import Link from "next/link";
import {
  MonitorCheck,
  Award,
  Briefcase,
  Users,
  ShieldCheck,
  Rocket,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const points = [
  {
    icon: MonitorCheck,
    title: "Practical Computer Training",
    desc: "Hands-on learning with dedicated systems and real-time practical sessions.",
  },
  {
    icon: Award,
    title: "Recognized Certifications",
    desc: "Certificates aligned with Skill India initiatives and DigiLocker verification.",
  },
  {
    icon: Briefcase,
    title: "Career-Oriented Programs",
    desc: "Industry-focused courses designed for employment and digital careers.",
  },
  {
    icon: Users,
    title: "Supportive Learning",
    desc: "Guided training environment that helps students learn confidently.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Local Institute",
    desc: "Established computer training institute serving Ambikapur and nearby regions.",
  },
  {
    icon: Rocket,
    title: "Skill-Based Growth",
    desc: "Programs designed for job readiness, freelancing and self-employment.",
  },
];

const highlights = [
  {
    title: "Practical-First Learning",
    desc: "Every course emphasizes hands-on computer practice from day one.",
  },
  {
    title: "Verified Certifications",
    desc: "Certificates supported by recognised national platforms.",
  },
  {
    title: "Career-Oriented Curriculum",
    desc: "Programs designed for real-world digital career opportunities.",
  },
];

// ⚠️ Confirm karo ye stats sahi hain ya nahi
const miniStats = [
  { val: "10+", lbl: "Years Experience" },
  { val: "25+", lbl: "Courses Offered" },
  // { val: "1K+", lbl: "Students Trained" }, // ← Confirm nahi hai, commented out
];

export default function WhyChooseUs() {
  return (
    <section
      className="wcu-section"
      aria-labelledby="wcu-heading"
    >
      <div className="wcu-container">

        {/* ── Section Header ── */}
        <div className="wcu-header">
          <span className="wcu-tag">
            <span className="wcu-tag-dot" aria-hidden="true" />
            Why Choose Us
          </span>
          <h2 id="wcu-heading" className="wcu-title">
            Why Students Choose{" "}
            <span className="wcu-title-accent">Shivshakti Academy</span>
          </h2>
          <p className="wcu-subtitle">
            Practical training, recognised certifications and career-focused
            learning — built to help students thrive in the digital world.
          </p>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="wcu-grid">

          {/* Left — Feature List */}
          <div className="wcu-features">
            {points.map((point, idx) => {
              const Icon = point.icon;
              return (
                <article key={point.title} className="wcu-feature-item">
                  {/* Number */}
                  <div className="wcu-feat-num" aria-hidden="true">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Icon */}
                  <div className="wcu-feat-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  {/* Content */}
                  <div className="wcu-feat-content">
                    <h3 className="wcu-feat-title">{point.title}</h3>
                    <p className="wcu-feat-desc">{point.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right — Sticky Panel */}
          <aside className="wcu-sidebar">
            <div className="wcu-panel">

              {/* Lead Text */}
              <p className="wcu-panel-lead">
                Our training approach is built around what students actually
                need — practical skills, valid certificates and a clear path
                to employment.
              </p>

              {/* Highlights */}
              <div className="wcu-panel-highlights">
                {highlights.map((hl) => (
                  <div key={hl.title} className="wcu-hl-item">
                    <div className="wcu-hl-check">
                      <CheckCircle size={16} strokeWidth={2} />
                    </div>
                    <div className="wcu-hl-text">
                      <div className="wcu-hl-title">{hl.title}</div>
                      <div className="wcu-hl-desc">{hl.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="wcu-panel-divider" aria-hidden="true" />

              {/* Mini Stats — SIRF confirmed data */}
              <div className="wcu-panel-stats">
                {miniStats.map((stat) => (
                  <div key={stat.lbl} className="wcu-stat-item">
                    <div className="wcu-stat-val">{stat.val}</div>
                    <div className="wcu-stat-lbl">{stat.lbl}</div>
                  </div>
                ))}
              </div>

              <div className="wcu-panel-divider" aria-hidden="true" />

              {/* CTA Button */}
              <Link href="/courses" className="wcu-panel-cta">
                Explore All Courses
                <ArrowRight size={16} strokeWidth={2} />
              </Link>

              {/* Location note */}
              <p className="wcu-panel-note">
                Ambikapur, Surguja, Chhattisgarh
              </p>
            </div>
          </aside>

        </div>

      </div>
    </section>
  );
}