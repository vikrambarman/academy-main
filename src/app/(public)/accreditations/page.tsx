import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Accreditation & Registration | Shivshakti Computer Academy",
  description:
    "Official quality certifications and government registration of Shivshakti Computer Academy including ISO 9001:2015 and MSME registration.",
};

/* ─── Data (unchanged from your original) ─── */
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
    <>
      <main className="ac-root">
        {/* ── HERO ── */}
        <section className="ac-hero home-section">
          <div className="container container-xl ac-hero__inner">
            <div className="ac-hero__eyebrow">
              <span className="ac-hero__eyebrow-line" aria-hidden="true" />
              Credentials
            </div>
            <div className="ac-hero__layout">
              <h1 className="ac-hero__title">
                Accreditation &amp; <em className="ac-hero__title-em">Registration</em>
              </h1>
              <p className="ac-hero__desc">
                Official quality certifications and government registrations confirming
                institutional credibility and training authenticity.
              </p>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <section className="ac-body home-section">
          <div className="container container-xl ac-body__inner">
            <div className="ac-grid">
              {accreditations.map((item) => (
                <article key={item.title} className="ac-card">
                  <div className="ac-card__logo-zone">
                    <div className="ac-card__logo-wrap">
                      <Image src={item.image} alt={item.title} fill sizes="100px" className="ac-card__logo-img" />
                    </div>
                    <span className="ac-card__badge">{item.badge}</span>
                  </div>

                  <div className="ac-card__body">
                    <div className="ac-card__subtitle">
                      <span className="ac-card__subtitle-line" aria-hidden="true" />
                      {item.subtitle}
                    </div>
                    <h2 className="ac-card__title">{item.title}</h2>
                    <p className="ac-card__desc">{item.description}</p>

                    <div className="ac-card__points">
                      {item.points.map((pt) => (
                        <div key={pt} className="ac-card__point">
                          <span className="ac-card__point-icon" aria-hidden="true">
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
            <div className="ac-strip" aria-label="Institute trust summary">
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
                  <span key={p} className="ac-strip__pill">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
/* ══════════════════════════════════════════
   ACCREDITATION PAGE — Clean University style
   ══════════════════════════════════════════ */
.ac-root { background-color: var(--bg-page); min-height: 100vh; }

/* HERO — plain, no gradient/glows */
.ac-hero {
  position: relative;
  padding: var(--space-24) 0 var(--space-12);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.ac-hero__inner { position: relative; }
.ac-hero__eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.ac-hero__eyebrow-line { width: 24px; height: 2px; background: var(--color-accent-500); border-radius: 2px; flex-shrink: 0; }
.ac-hero__layout {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: var(--space-8); flex-wrap: wrap;
}
.ac-hero__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.6vw, 2.5rem);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary); line-height: 1.2;
  letter-spacing: -0.015em; margin: 0;
}
.ac-hero__title-em { font-style: normal; color: var(--color-primary-700); }
.ac-hero__desc {
  font-size: var(--font-size-base); color: var(--text-secondary);
  line-height: 1.7; max-width: 420px; margin: 0;
}

/* BODY */
.ac-body { padding-bottom: var(--space-24); }
.ac-body__inner { padding-top: var(--space-12); }

/* GRID */
.ac-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5); margin-bottom: var(--space-8);
}
.ac-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600);
  border-radius: var(--radius-lg);
  overflow: hidden; display: flex; flex-direction: column;
  transition: border-color var(--transition-base);
}
.ac-card:hover { border-color: var(--color-gray-300); }
.ac-card__logo-zone {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-8);
  display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-5);
}
.ac-card__logo-wrap { position: relative; width: 100px; height: 60px; flex-shrink: 0; }
.ac-card__logo-img { object-fit: contain; object-position: left center; }
.ac-card__badge {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-medium);
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--text-secondary); background: var(--bg-page);
  border: 1px solid var(--border-color);
  padding: 4px 10px; border-radius: var(--radius-full);
  white-space: nowrap; flex-shrink: 0;
}
.ac-card__body { padding: var(--space-8); flex: 1; display: flex; flex-direction: column; }
.ac-card__subtitle {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.ac-card__subtitle-line { width: 14px; height: 2px; background: var(--color-accent-500); border-radius: 2px; flex-shrink: 0; }
.ac-card__title {
  font-family: var(--font-display); font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold); color: var(--text-primary);
  line-height: 1.3; margin-bottom: var(--space-3); letter-spacing: -0.01em;
}
.ac-card__desc { font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-6); }
.ac-card__points {
  display: flex; flex-direction: column;
  border: 1px solid var(--border-color); border-radius: var(--radius-md);
  overflow: hidden; margin-top: auto;
}
.ac-card__point {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm); color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}
.ac-card__point:last-child { border-bottom: none; }
.ac-card__point-icon {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--color-primary-50); border: 1px solid var(--border-color);
  color: var(--color-primary-600); flex-shrink: 0;
}

/* TRUST STRIP — solid ink-blue (no dark gradient/dots) */
.ac-strip {
  position: relative;
  background: var(--color-primary-700);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-8);
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-6); flex-wrap: wrap;
}
.ac-strip__left { display: flex; align-items: center; gap: var(--space-4); }
.ac-strip__icon {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
}
.ac-strip__title { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.25; }
.ac-strip__sub { font-size: var(--font-size-xs); color: rgba(255,255,255,0.7); margin-top: var(--space-1); }
.ac-strip__pills { display: flex; gap: var(--space-2); flex-wrap: wrap; justify-content: flex-end; }
.ac-strip__pill {
  font-size: var(--font-size-xs); color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); white-space: nowrap;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .ac-hero { padding: var(--space-16) 0 var(--space-10); }
  .ac-hero__layout { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .ac-hero__desc { max-width: 100%; }
  .ac-grid { grid-template-columns: 1fr; }
  .ac-strip { flex-direction: column; align-items: flex-start; padding: var(--space-6); }
  .ac-strip__pills { justify-content: flex-start; }
}
@media (max-width: 480px) {
  .ac-hero { padding: var(--space-12) 0 var(--space-8); }
  .ac-body { padding-bottom: var(--space-16); }
}
      `}</style>
    </>
  );
}
