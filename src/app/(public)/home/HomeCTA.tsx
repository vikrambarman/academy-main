import Link from "next/link";
import { Check, Phone, MapPin, ArrowRight } from "lucide-react";

const checkpoints = [
  "Skill India & GSDM aligned programs",
  "DigiLocker verified certificates",
  "Web Development & Professional IT training",
  "Affordable education for all backgrounds",
];

const phones = [
  { num: "+91 74770 36832", href: "tel:+917477036832" },
  { num: "+91 90090 87883", href: "tel:+919009087883" },
];

// Static component — no "use client"
export default function HomeCTA() {
  return (
    <section className="hcta-section" aria-labelledby="hcta-heading">

      {/* ── Full width dark bg ── */}
      <div className="hcta-bg">
        <div className="hcta-container">
          <div className="hcta-card">

            {/* ── LEFT — Main CTA content ── */}
            <div className="hcta-left">

              {/* Eyebrow */}
              <span className="hcta-eyebrow">
                <span className="hcta-eyebrow-line" aria-hidden="true" />
                Start Today
              </span>

              {/* Heading */}
              <h2 id="hcta-heading" className="hcta-heading">
                Secure Your Future with{" "}
                <em className="hcta-heading-em">Digital Skills</em>
              </h2>

              {/* Description */}
              <p className="hcta-desc">
                Practical computer training, government-recognized
                certifications, and career-focused programs — designed
                for jobs, entrepreneurship and higher studies.
              </p>

              {/* Checklist */}
              <ul className="hcta-checklist">
                {checkpoints.map((pt) => (
                  <li key={pt} className="hcta-check-item">
                    <span className="hcta-check-icon" aria-hidden="true">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="hcta-btns">
                <Link href="/courses" className="hcta-btn-primary">
                  View Courses
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link href="/enquiry" className="hcta-btn-outline">
                  Admission Enquiry
                </Link>
              </div>
            </div>

            {/* ── RIGHT — Contact panel ── */}
            <div className="hcta-right">
              <h3 className="hcta-right-heading">
                Need Guidance? Talk to Us
              </h3>
              <p className="hcta-right-desc">
                Get help with course selection, eligibility criteria,
                certification details and admission guidance.
              </p>

              <div className="hcta-divider" aria-hidden="true" />

              {/* Phone numbers */}
              <div className="hcta-phones">
                {phones.map((p) => (
                  <a key={p.href} href={p.href} className="hcta-phone">
                    <span className="hcta-phone-icon" aria-hidden="true">
                      <Phone size={15} strokeWidth={1.8} />
                    </span>
                    <span className="hcta-phone-num">{p.num}</span>
                  </a>
                ))}
              </div>

              {/* Location note */}
              <p className="hcta-note">
                <MapPin size={14} strokeWidth={1.8} />
                Ambikapur, Chhattisgarh · Mon–Sat, 8 AM – 6 PM
              </p>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}