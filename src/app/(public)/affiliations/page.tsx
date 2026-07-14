import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Affiliations & Partnerships | Shivshakti Computer Academy",
  description:
    "Authorized training partnerships and skill development affiliations of Shivshakti Computer Academy.",
};

/* ─── Data (unchanged) ─── */
const affiliations = [
  {
    title: "Gramin Skill Development Mission",
    short: "GSDM",
    subtitle: "Authorized Training Centre",
    description:
      "Authorized training centre aligned with government-recognized skill development diploma programs under the Chhattisgarh state mission.",
    image: "/images/affiliations/gsdm.jpg",
    badge: "Govt. Authorized",
    points: [
      "State government recognized",
      "Diploma program authority",
      "Structured assessment framework",
    ],
  },
  {
    title: "Drishti Computer Education",
    short: "Drishti",
    subtitle: "Franchise Partner",
    description:
      "Authorized franchise partner providing verified certification for foundation and professional computer programs across the region.",
    image: "/images/affiliations/drishti.jpg",
    badge: "Franchise Partner",
    points: [
      "Verified certification programs",
      "Foundation & professional levels",
      "Authorized examination centre",
    ],
  },
  {
    title: "Skill India & NSDC",
    short: "Skill India",
    subtitle: "National Alignment",
    description:
      "Selected program certifications aligned with national skill development frameworks under the Ministry of Skill Development & Entrepreneurship.",
    image: "/images/affiliations/skillindia.jpg",
    badge: "National Program",
    points: [
      "NSDC aligned curriculum",
      "Ministry of Skill Development",
      "Job-ready skill framework",
    ],
  },
  {
    title: "DigiLocker Enabled",
    short: "DigiLocker",
    subtitle: "Digital Certificate Access",
    description:
      "Eligible certificates accessible digitally for instant verification through the Government of India's DigiLocker platform.",
    image: "/images/affiliations/digilocker.jpg",
    badge: "Digital Verified",
    points: [
      "Govt. DigiLocker platform",
      "Instant online verification",
      "Tamper-proof digital records",
    ],
  },
];

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const HandshakeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.77 7.65 7.65 7.65-7.65.77-.77a5.4 5.4 0 0 0 0-7.65z" />
  </svg>
);

export default function AffiliationsPage() {
  return (
    <main className="af-root">
      {/* ── HERO ── */}
      <section className="af-hero" aria-labelledby="affiliations-hero-heading">
        <div className="container af-hero__inner">
          <div className="af-hero__eyebrow">
            <span className="af-hero__eyebrow-line" aria-hidden="true" />
            Partners &amp; Affiliations
          </div>
          <div className="af-hero__layout">
            <div>
              <h1 id="affiliations-hero-heading" className="af-hero__title">
                Affiliations &amp;
                <br />
                <em className="af-hero__title-em">Partnerships</em>
              </h1>
              <div className="af-hero__count-pill">
                <span className="af-hero__count-dot" aria-hidden="true" />
                {affiliations.length} authorized affiliations
              </div>
            </div>
            <p className="af-hero__desc">
              Official training partnerships and authorized academic
              collaborations that back every certificate we issue.
            </p>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="af-body" aria-label="Affiliation details">
        <div className="container af-body__inner">
          <div className="af-grid">
            {affiliations.map((item) => (
              <article key={item.title} className="af-card">
                <div className="af-card__top">
                  <div className="af-card__logo-wrap">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="88px"
                      className="af-card__logo-img"
                    />
                  </div>
                  <span className="af-card__badge">{item.badge}</span>
                </div>

                <div className="af-card__body">
                  <div className="af-card__subtitle">
                    <span
                      className="af-card__subtitle-line"
                      aria-hidden="true"
                    />
                    {item.subtitle}
                  </div>
                  <h2 className="af-card__title">{item.title}</h2>
                  <p className="af-card__desc">{item.description}</p>

                  <div className="af-card__points">
                    {item.points.map((pt) => (
                      <div key={pt} className="af-card__point">
                        <span
                          className="af-card__point-icon"
                          aria-hidden="true"
                        >
                          <CheckIcon />
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
          <div className="af-strip" aria-label="Affiliation summary">
            <div className="af-strip__left">
              <div className="af-strip__icon">
                <HandshakeIcon />
              </div>
              <div>
                <div className="af-strip__label">
                  <span className="af-strip__label-line" aria-hidden="true" />
                  All Affiliations
                </div>
                <div className="af-strip__text">
                  Every certificate is backed by an authorized partner
                </div>
              </div>
            </div>
            <div className="af-strip__pills">
              {affiliations.map((a) => (
                <span key={a.short} className="af-strip__pill">
                  {a.short}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}