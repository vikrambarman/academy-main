import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Accreditation & Registration | Shivshakti Computer Academy",
    description:
        "Official quality certifications and government registration of Shivshakti Computer Academy including ISO 9001:2015 and MSME registration.",
};

/* ─── Data ───────────────────────────────────────────────────────── */

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

/* ─── Icons ─────────────────────────────────────────────────────── */

const CheckDotIcon = () => (
    <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const BuildingIcon = () => (
    <svg
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

/* ─── Page ───────────────────────────────────────────────────────── */

export default function AccreditationPage() {
    return (
        <>
            <main className="ac-root">

                {/* ════════════ HERO ════════════ */}
                <section className="ac-hero home-section">
                    {/* Decorative glows */}
                    <div className="ac-hero__glow ac-hero__glow--1" />
                    <div className="ac-hero__glow ac-hero__glow--2" />

                    <div className="container container-xl ac-hero__inner">
                        {/* Eyebrow */}
                        <div className="ac-hero__eyebrow">
                            <span className="ac-hero__eyebrow-line" />
                            Credentials
                        </div>

                        {/* Split layout */}
                        <div className="ac-hero__layout">
                            <h1 className="ac-hero__title">
                                Accreditation &amp;{" "}
                                <em className="ac-hero__title-em">
                                    Registration
                                </em>
                            </h1>
                            <p className="ac-hero__desc">
                                Official quality certifications and government
                                registrations confirming institutional
                                credibility and training authenticity.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ════════════ BODY ════════════ */}
                <section className="ac-body home-section">
                    <div className="ac-body__divider" aria-hidden="true" />

                    <div className="container container-xl ac-body__inner">

                        {/* Cards grid */}
                        <div className="ac-grid">
                            {accreditations.map((item, i) => (
                                <article key={i} className="ac-card">
                                    {/* Top accent line */}
                                    <div
                                        className="ac-card__accent"
                                        aria-hidden="true"
                                    />

                                    {/* Logo zone */}
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
                                        <span className="ac-card__badge">
                                            {item.badge}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div className="ac-card__body">
                                        <div className="ac-card__subtitle">
                                            <span className="ac-card__subtitle-line" />
                                            {item.subtitle}
                                        </div>

                                        <h2 className="ac-card__title">
                                            {item.title}
                                        </h2>

                                        <p className="ac-card__desc">
                                            {item.description}
                                        </p>

                                        {/* Points list */}
                                        <div className="ac-card__points">
                                            {item.points.map((pt, j) => (
                                                <div
                                                    key={j}
                                                    className="ac-card__point"
                                                >
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
                            <div className="ac-strip__dot-pattern" aria-hidden="true" />

                            <div className="ac-strip__left">
                                <div className="ac-strip__icon">
                                    <BuildingIcon />
                                </div>
                                <div>
                                    <div className="ac-strip__title">
                                        Fully Accredited &amp; Government
                                        Recognized
                                    </div>
                                    <div className="ac-strip__sub">
                                        Shivshakti Computer Academy · Ambikapur,
                                        Chhattisgarh
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

            {/* ════════════ PAGE-SCOPED CSS ════════════ */}
            <style>{`

/* ══════════════════════════════════════════
   ACCREDITATION PAGE  —  page-scoped styles
   Follows: variables.css + components.css
   ══════════════════════════════════════════ */

/* ── Root ───────────────────────────────── */
.ac-root {
  background-color: var(--bg-page);
  min-height: 100vh;
}

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
.ac-hero {
  position: relative;
  padding: var(--space-24) 0 var(--space-16);
  overflow: hidden;
  background: linear-gradient(
    160deg,
    var(--color-primary-200) 0%,
    var(--color-white) 60%,
    var(--color-primary-400) 100%
  );
}

/* Glow orbs */
.ac-hero__glow {
  position: absolute;
  border-radius: var(--radius-full);
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.30;
}
.ac-hero__glow--1 {
  width: 480px;
  height: 480px;
  background: var(--color-primary-200);
  top: -200px;
  right: -140px;
}
.ac-hero__glow--2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent-200);
  bottom: -80px;
  left: -80px;
}

.ac-hero__inner {
  position: relative;
  z-index: 2;
}

/* Eyebrow */
.ac-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary-600);
  margin-bottom: var(--space-5);
}
.ac-hero__eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Split layout */
.ac-hero__layout {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-12);
  flex-wrap: wrap;
}

/* Title */
.ac-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0;
}
.ac-hero__title-em {
  font-style: italic;
  background: linear-gradient(
    135deg,
    var(--color-primary-600),
    var(--color-accent-500)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Description */
.ac-hero__desc {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  max-width: 380px;
  padding-bottom: var(--space-1);
  margin: 0;
}

/* ══════════════════════════════════════════
   BODY
   ══════════════════════════════════════════ */
.ac-body {
  padding-bottom: var(--space-24);
  position: relative;
}
.ac-body__divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-color),
    transparent
  );
  margin: 0 10%;
}
.ac-body__inner {
  padding-top: var(--space-16);
}

/* ══════════════════════════════════════════
   CARDS GRID
   ══════════════════════════════════════════ */
.ac-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
  margin-bottom: var(--space-12);
}

/* ── Card ─────────────────────────────── */
.ac-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition:
    box-shadow var(--transition-base),
    border-color var(--transition-base);
}
.ac-card:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-xl);
}

/* Top accent bar — animates on hover */
.ac-card__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    to right,
    var(--color-primary-500),
    var(--color-accent-400)
  );
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--transition-base);
  z-index: 1;
}
.ac-card:hover .ac-card__accent {
  transform: scaleX(1);
}

/* Logo zone */
.ac-card__logo-zone {
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-10) var(--space-10) var(--space-8);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-5);
}
.ac-card__logo-wrap {
  position: relative;
  width: 100px;
  height: 64px;
  flex-shrink: 0;
}
.ac-card__logo-img {
  object-fit: contain;
}
.ac-card__badge {
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
}

/* Card body */
.ac-card__body {
  padding: var(--space-8) var(--space-10);
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Subtitle */
.ac-card__subtitle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-primary-600);
  margin-bottom: var(--space-3);
}
.ac-card__subtitle-line {
  display: inline-block;
  width: 14px;
  height: 1.5px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Title */
.ac-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-snug);
  margin-bottom: var(--space-4);
  letter-spacing: var(--letter-spacing-tight);
}

/* Desc */
.ac-card__desc {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-6);
}

/* Points list */
.ac-card__points {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: auto;
}
.ac-card__point {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color-light);
  transition: background var(--transition-fast);
}
.ac-card__point:last-child {
  border-bottom: none;
}
.ac-card__point:hover {
  background: var(--color-primary-50);
}
.ac-card__point-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100);
  color: var(--color-primary-600);
  flex-shrink: 0;
}

/* ══════════════════════════════════════════
   TRUST STRIP
   ══════════════════════════════════════════ */
.ac-strip {
  position: relative;
  background: linear-gradient(
    135deg,
    var(--color-gray-800) 0%,
    var(--color-gray-900) 100%
  );
  border-radius: var(--radius-2xl);
  padding: var(--space-6) var(--space-10);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
  overflow: hidden;
  border: 1px solid var(--color-gray-700);
}

/* Dot grid decoration */
.ac-strip__dot-pattern {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 160px;
  height: 160px;
  background-image: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.20) 1.5px,
    transparent 1.5px
  );
  background-size: 12px 12px;
  pointer-events: none;
}

.ac-strip__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  position: relative;
  z-index: 1;
}
.ac-strip__icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-300);
  flex-shrink: 0;
}
.ac-strip__title {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
}
.ac-strip__sub {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: rgba(255, 255, 255, 0.45);
  margin-top: var(--space-1);
}

.ac-strip__pills {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
}
.ac-strip__pill {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.80);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  white-space: nowrap;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}
.ac-strip__pill:hover {
  background: rgba(255, 255, 255, 0.13);
  border-color: rgba(255, 255, 255, 0.25);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */

/* Tablet */
@media (max-width: 768px) {
  .ac-hero {
    padding: var(--space-16) 0 var(--space-12);
  }
  .ac-hero__layout {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  .ac-hero__desc {
    max-width: 100%;
  }
  .ac-grid {
    grid-template-columns: 1fr;
  }
  .ac-strip {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-6);
  }
  .ac-strip__pills {
    justify-content: flex-start;
  }
  .ac-card__logo-zone,
  .ac-card__body {
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}

/* Mobile */
@media (max-width: 480px) {
  .ac-hero {
    padding: var(--space-12) 0 var(--space-10);
  }
  .ac-body {
    padding-bottom: var(--space-16);
  }
  .ac-card__logo-zone {
    padding-top: var(--space-6);
    padding-bottom: var(--space-5);
  }
  .ac-card__body {
    padding-top: var(--space-5);
    padding-bottom: var(--space-6);
  }
  .ac-strip__dot-pattern {
    display: none;
  }
}

      `}</style>
        </>
    );
}