import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Affiliations & Partnerships | Shivshakti Computer Academy",
    description:
        "Authorized training partnerships and skill development affiliations of Shivshakti Computer Academy.",
};

/* ─── Data ───────────────────────────────────────────────────────── */

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

/* ─── Icons ─────────────────────────────────────────────────────── */

const CheckIcon = () => (
    <svg
        width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const HandshakeIcon = () => (
    <svg
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.77 7.65 7.65 7.65-7.65.77-.77a5.4 5.4 0 0 0 0-7.65z" />
    </svg>
);

/* ─── Page ───────────────────────────────────────────────────────── */

export default function AffiliationsPage() {
    return (
        <>
            <main className="af-root">

                {/* ════════════ HERO ════════════ */}
                <section className="af-hero home-section">
                    <div className="af-hero__glow af-hero__glow--1" aria-hidden="true" />
                    <div className="af-hero__glow af-hero__glow--2" aria-hidden="true" />

                    <div className="container container-xl af-hero__inner">
                        {/* Eyebrow */}
                        <div className="af-hero__eyebrow">
                            <span className="af-hero__eyebrow-line" aria-hidden="true" />
                            Partners &amp; Affiliations
                        </div>

                        {/* Split layout */}
                        <div className="af-hero__layout">
                            <div>
                                <h1 className="af-hero__title">
                                    Affiliations &amp;
                                    <br />
                                    <em className="af-hero__title-em">
                                        Partnerships
                                    </em>
                                </h1>

                                {/* Count pill */}
                                <div className="af-hero__count-pill">
                                    <span
                                        className="af-hero__count-dot"
                                        aria-hidden="true"
                                    />
                                    {affiliations.length} authorized
                                    affiliations
                                </div>
                            </div>

                            <p className="af-hero__desc">
                                Official training partnerships and authorized
                                academic collaborations that back every
                                certificate we issue.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ════════════ BODY ════════════ */}
                <section className="af-body home-section">
                    <div className="af-body__divider" aria-hidden="true" />

                    <div className="container container-xl af-body__inner">

                        {/* Cards grid */}
                        <div className="af-grid">
                            {affiliations.map((item, i) => (
                                <article key={i} className="af-card">
                                    {/* Accent bar */}
                                    <div
                                        className="af-card__accent"
                                        aria-hidden="true"
                                    />

                                    {/* Top: logo + badge */}
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
                                        <span className="af-card__badge">
                                            {item.badge}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div className="af-card__body">
                                        <div className="af-card__subtitle">
                                            <span className="af-card__subtitle-line" />
                                            {item.subtitle}
                                        </div>

                                        <h2 className="af-card__title">
                                            {item.title}
                                        </h2>

                                        <p className="af-card__desc">
                                            {item.description}
                                        </p>

                                        {/* Points */}
                                        <div className="af-card__points">
                                            {item.points.map((pt, j) => (
                                                <div
                                                    key={j}
                                                    className="af-card__point"
                                                >
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
                        <div
                            className="af-strip"
                            aria-label="Affiliation summary"
                        >
                            <div className="af-strip__dot-pattern" aria-hidden="true" />

                            <div className="af-strip__left">
                                <div className="af-strip__icon">
                                    <HandshakeIcon />
                                </div>
                                <div>
                                    <div className="af-strip__label">
                                        <span className="af-strip__label-line" />
                                        All Affiliations
                                    </div>
                                    <div className="af-strip__text">
                                        Every certificate is backed by an
                                        authorized partner
                                    </div>
                                </div>
                            </div>

                            <div className="af-strip__pills">
                                {affiliations.map((a) => (
                                    <span
                                        key={a.short}
                                        className="af-strip__pill"
                                    >
                                        {a.short}
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
   AFFILIATIONS PAGE  —  page-scoped styles
   Follows: variables.css + components.css
   ══════════════════════════════════════════ */

/* ── Root ───────────────────────────────── */
.af-root {
  background-color: var(--bg-page);
  min-height: 100vh;
}

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
.af-hero {
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
.af-hero__glow {
  position: absolute;
  border-radius: var(--radius-full);
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.28;
}
.af-hero__glow--1 {
  width: 460px;
  height: 460px;
  background: var(--color-primary-200);
  top: -190px;
  right: -130px;
}
.af-hero__glow--2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent-200);
  bottom: -90px;
  left: -90px;
}

.af-hero__inner {
  position: relative;
  z-index: 2;
}

/* Eyebrow */
.af-hero__eyebrow {
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
.af-hero__eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Split layout */
.af-hero__layout {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-12);
  flex-wrap: wrap;
}

/* Title */
.af-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0 0 var(--space-4);
}
.af-hero__title-em {
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

/* Count pill */
.af-hero__count-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
}
.af-hero__count-dot {
  width: 6px;
  height: 6px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Desc */
.af-hero__desc {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  max-width: 380px;
  margin: 0;
  padding-bottom: var(--space-1);
}

/* ══════════════════════════════════════════
   BODY
   ══════════════════════════════════════════ */
.af-body {
  padding-bottom: var(--space-24);
  position: relative;
}
.af-body__divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-color),
    transparent
  );
  margin: 0 10%;
}
.af-body__inner {
  padding-top: var(--space-16);
}

/* ══════════════════════════════════════════
   GRID
   ══════════════════════════════════════════ */
.af-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--border-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  margin-bottom: var(--space-5);
}

/* ── Card ─────────────────────────────── */
.af-card {
  background: var(--bg-elevated);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: background var(--transition-fast);
}
.af-card:hover {
  background: var(--color-primary-50);
}

/* Accent bar */
.af-card__accent {
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
.af-card:hover .af-card__accent {
  transform: scaleX(1);
}

/* Top zone */
.af-card__top {
  padding: var(--space-8) var(--space-8) var(--space-6);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  border-bottom: 1px solid var(--border-color);
}
.af-card__logo-wrap {
  position: relative;
  width: 88px;
  height: 56px;
  flex-shrink: 0;
}
.af-card__logo-img {
  object-fit: contain;
  object-position: left center;
}
.af-card__badge {
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
}

/* Card body */
.af-card__body {
  padding: var(--space-6) var(--space-8) var(--space-8);
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Subtitle */
.af-card__subtitle {
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
.af-card__subtitle-line {
  display: inline-block;
  width: 12px;
  height: 1.5px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Title */
.af-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-snug);
  letter-spacing: var(--letter-spacing-tight);
  margin-bottom: var(--space-3);
}

/* Desc */
.af-card__desc {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-6);
}

/* Points */
.af-card__points {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: auto;
}
.af-card__point {
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
.af-card__point:last-child {
  border-bottom: none;
}
.af-card__point:hover {
  background: var(--color-primary-50);
}
.af-card__point-icon {
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
.af-strip {
  position: relative;
  background: linear-gradient(
    135deg,
    var(--color-gray-800) 0%,
    var(--color-gray-900) 100%
  );
  border: 1px solid var(--color-gray-700);
  border-radius: var(--radius-2xl);
  padding: var(--space-6) var(--space-10);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
  overflow: hidden;
}

/* Dot pattern */
.af-strip__dot-pattern {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 160px;
  height: 160px;
  background-image: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.18) 1.5px,
    transparent 1.5px
  );
  background-size: 12px 12px;
  pointer-events: none;
}

.af-strip__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  position: relative;
  z-index: 1;
}

.af-strip__icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-300);
  flex-shrink: 0;
}

/* Strip label */
.af-strip__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-primary-400);
  margin-bottom: var(--space-1);
}
.af-strip__label-line {
  display: inline-block;
  width: 12px;
  height: 1.5px;
  background: var(--color-primary-400);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.af-strip__text {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
}

/* Pills */
.af-strip__pills {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
}
.af-strip__pill {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.11);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  white-space: nowrap;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}
.af-strip__pill:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.22);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */

/* Tablet */
@media (max-width: 768px) {
  .af-hero {
    padding: var(--space-16) 0 var(--space-12);
  }
  .af-hero__layout {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  .af-hero__desc {
    max-width: 100%;
  }
  .af-grid {
    grid-template-columns: 1fr;
    border-radius: var(--radius-xl);
  }
  .af-strip {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-6);
  }
  .af-strip__pills {
    justify-content: flex-start;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .af-hero {
    padding: var(--space-12) 0 var(--space-10);
  }
  .af-body {
    padding-bottom: var(--space-16);
  }
  .af-card__top {
    padding: var(--space-6) var(--space-6) var(--space-5);
  }
  .af-card__body {
    padding: var(--space-5) var(--space-6) var(--space-6);
  }
  .af-strip__dot-pattern {
    display: none;
  }
}

      `}</style>
        </>
    );
}