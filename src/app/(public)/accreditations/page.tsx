import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Accreditation & Registration | Shivshakti Computer Academy",
  description:
    "Official quality certifications and government registration of Shivshakti Computer Academy including ISO 9001:2015 and MSME registration.",
};

/* ─── Data (unchanged) ─── */
const accreditations = [
  {
    title: "ISO 9001:2015 Certified",
    subtitle: "Quality Management System",
    description:
      "International quality management certification ensuring structured academic processes, consistent training delivery, and measurable educational outcomes for every student.",
    image: "/images/accreditations/iso.jpg",
    badge: "International",
    points: [
      "Structured academic processes",
      "Consistent training delivery",
      "Measurable learning outcomes",
      "Annual quality audits",
    ],
  },
  {
    title: "MSME (Udyam) Registered",
    subtitle: "Government of India",
    description:
      "Government of India registered MSME institute ensuring full authenticity and legal compliance as a certified training provider under the Ministry of MSME.",
    image: "/images/accreditations/msme.jpg",
    badge: "Govt. Registered",
    points: [
      "Ministry of MSME recognized",
      "Legally compliant institute",
      "Authentic training provider",
      "Udyam Registration Certificate",
    ],
  },
];

const trustPills = [
  "ISO 9001:2015",
  "MSME Udyam",
  "GSDM Authorized",
  "Skill India",
  "DigiLocker",
];

const CheckDotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export default function AccreditationPage() {
  return (
    <main className="ac-root">
      {/* ── HERO ── */}
      <section className="ac-hero" aria-labelledby="accreditation-hero-heading">
        <div className="container ac-hero__inner">
          <div className="ac-hero__eyebrow">
            <span className="ac-hero__eyebrow-line" aria-hidden="true" />
            Credentials
          </div>
          <div className="ac-hero__layout">
            <h1 id="accreditation-hero-heading" className="ac-hero__title">
              Accreditation &amp;{" "}
              <em className="ac-hero__title-em">Registration</em>
            </h1>
            <p className="ac-hero__desc">
              Official quality certifications and government registrations
              confirming institutional credibility and training authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="ac-body" aria-label="Accreditation details">
        <div className="container ac-body__inner">
          <div className="ac-grid">
            {accreditations.map((item) => (
              <article key={item.title} className="ac-card">
                <div className="ac-card__logo-zone">
                  <div className="ac-card__logo-wrap">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="100px"
                      className="ac-card__logo-img"
                    />
                  </div>
                  <span className="ac-card__badge">{item.badge}</span>
                </div>

                <div className="ac-card__body">
                  <div className="ac-card__subtitle">
                    <span
                      className="ac-card__subtitle-line"
                      aria-hidden="true"
                    />
                    {item.subtitle}
                  </div>
                  <h2 className="ac-card__title">{item.title}</h2>
                  <p className="ac-card__desc">{item.description}</p>

                  <div className="ac-card__points">
                    {item.points.map((pt) => (
                      <div key={pt} className="ac-card__point">
                        <span
                          className="ac-card__point-icon"
                          aria-hidden="true"
                        >
                          <CheckDotIcon />
                        </span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── Trust Strip ── */}
          <div
            className="ac-strip"
            aria-label="Institute trust summary"
          >
            <div className="ac-strip__left">
              <div className="ac-strip__icon">
                <BuildingIcon />
              </div>
              <div>
                <div className="ac-strip__title">
                  Fully Accredited &amp; Government Recognized
                </div>
                <div className="ac-strip__sub">
                  Shivshakti Computer Academy · Ambikapur, Chhattisgarh
                </div>
              </div>
            </div>
            <div className="ac-strip__pills">
              {trustPills.map((p) => (
                <span key={p} className="ac-strip__pill">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}