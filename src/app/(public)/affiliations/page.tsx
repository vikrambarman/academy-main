import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Affiliations & Partnerships | Shivshakti Computer Academy",
  description:
    "Authorized training partnerships and skill development affiliations of Shivshakti Computer Academy.",
};

/* ─── Data (unchanged from your original) ─── */
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
    <>
      <main className="af-root">
        {/* ── HERO ── */}
        <section className="af-hero home-section">
          <div className="container container-xl af-hero__inner">
            <div className="af-hero__eyebrow">
              <span className="af-hero__eyebrow-line" aria-hidden="true" />
              Partners &amp; Affiliations
            </div>
            <div className="af-hero__layout">
              <div>
                <h1 className="af-hero__title">
                  Affiliations &amp;<br />
                  <em className="af-hero__title-em">Partnerships</em>
                </h1>
                <div className="af-hero__count-pill">
                  <span className="af-hero__count-dot" aria-hidden="true" />
                  {affiliations.length} authorized affiliations
                </div>
              </div>
              <p className="af-hero__desc">
                Official training partnerships and authorized academic collaborations
                that back every certificate we issue.
              </p>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <section className="af-body home-section">
          <div className="container container-xl af-body__inner">
            <div className="af-grid">
              {affiliations.map((item) => (
                <article key={item.title} className="af-card">
                  <div className="af-card__top">
                    <div className="af-card__logo-wrap">
                      <Image src={item.image} alt={item.title} fill sizes="88px" className="af-card__logo-img" />
                    </div>
                    <span className="af-card__badge">{item.badge}</span>
                  </div>

                  <div className="af-card__body">
                    <div className="af-card__subtitle">
                      <span className="af-card__subtitle-line" aria-hidden="true" />
                      {item.subtitle}
                    </div>
                    <h2 className="af-card__title">{item.title}</h2>
                    <p className="af-card__desc">{item.description}</p>

                    <div className="af-card__points">
                      {item.points.map((pt) => (
                        <div key={pt} className="af-card__point">
                          <span className="af-card__point-icon" aria-hidden="true">
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
                  <span key={a.short} className="af-strip__pill">{a.short}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
/* ══════════════════════════════════════════
   AFFILIATIONS PAGE — Clean University style
   ══════════════════════════════════════════ */
.af-root { background-color: var(--bg-page); min-height: 100vh; }

/* HERO */
.af-hero {
  position: relative;
  padding: var(--space-24) 0 var(--space-12);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.af-hero__inner { position: relative; }
.af-hero__eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.af-hero__eyebrow-line { width: 24px; height: 2px; background: var(--color-accent-500); border-radius: 2px; flex-shrink: 0; }
.af-hero__layout { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-8); flex-wrap: wrap; }
.af-hero__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.6vw, 2.5rem);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary); line-height: 1.2;
  letter-spacing: -0.015em; margin: 0 0 var(--space-4);
}
.af-hero__title-em { font-style: normal; color: var(--color-primary-700); }
.af-hero__count-pill {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); color: var(--text-secondary);
  background: var(--bg-surface); border: 1px solid var(--border-color);
  padding: var(--space-2) var(--space-4); border-radius: var(--radius-full);
}
.af-hero__count-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; flex-shrink: 0; }
.af-hero__desc { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; max-width: 420px; margin: 0; }

/* BODY */
.af-body { padding-bottom: var(--space-24); }
.af-body__inner { padding-top: var(--space-12); }

/* GRID — clean hairline-separated grid */
.af-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5); margin-bottom: var(--space-8);
}
.af-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  display: flex; flex-direction: column;
  overflow: hidden;
  transition: border-color var(--transition-base);
}
.af-card:hover { border-color: var(--color-gray-300); }
.af-card__top {
  padding: var(--space-6) var(--space-6) var(--space-5);
  display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4);
  border-bottom: 1px solid var(--border-color);
}
.af-card__logo-wrap { position: relative; width: 88px; height: 52px; flex-shrink: 0; }
.af-card__logo-img { object-fit: contain; object-position: left center; }
.af-card__badge {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-medium);
  letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--text-secondary); background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 4px 10px; border-radius: var(--radius-full);
  white-space: nowrap; flex-shrink: 0;
}
.af-card__body { padding: var(--space-6); display: flex; flex-direction: column; flex: 1; }
.af-card__subtitle {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.af-card__subtitle-line { width: 12px; height: 2px; background: var(--color-accent-500); border-radius: 2px; flex-shrink: 0; }
.af-card__title {
  font-family: var(--font-display); font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold); color: var(--text-primary);
  line-height: 1.3; letter-spacing: -0.01em; margin-bottom: var(--space-3);
}
.af-card__desc { font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-6); }
.af-card__points {
  display: flex; flex-direction: column;
  border: 1px solid var(--border-color); border-radius: var(--radius-md);
  overflow: hidden; margin-top: auto;
}
.af-card__point {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm); color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}
.af-card__point:last-child { border-bottom: none; }
.af-card__point-icon {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--color-primary-50); border: 1px solid var(--border-color);
  color: var(--color-primary-600); flex-shrink: 0;
}

/* TRUST STRIP — solid ink-blue */
.af-strip {
  position: relative;
  background: var(--color-primary-700);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-8);
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-6); flex-wrap: wrap;
}
.af-strip__left { display: flex; align-items: center; gap: var(--space-4); }
.af-strip__icon {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
}
.af-strip__label {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.7); margin-bottom: var(--space-1);
}
.af-strip__label-line { width: 12px; height: 2px; background: rgba(255,255,255,0.5); border-radius: 2px; flex-shrink: 0; }
.af-strip__text { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.25; }
.af-strip__pills { display: flex; gap: var(--space-2); flex-wrap: wrap; justify-content: flex-end; }
.af-strip__pill {
  font-size: var(--font-size-xs); color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); white-space: nowrap;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .af-hero { padding: var(--space-16) 0 var(--space-10); }
  .af-hero__layout { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .af-hero__desc { max-width: 100%; }
  .af-grid { grid-template-columns: 1fr; }
  .af-strip { flex-direction: column; align-items: flex-start; padding: var(--space-6); }
  .af-strip__pills { justify-content: flex-start; }
}
@media (max-width: 480px) {
  .af-hero { padding: var(--space-12) 0 var(--space-8); }
  .af-body { padding-bottom: var(--space-16); }
}
      `}</style>
    </>
  );
}
