// ============================================================
// components/verify/VerificationInfo.tsx  (Client Component)
// ============================================================
"use client";

/* ─── Data ───────────────────────────────────────────────────────── */

const authorities = [
    {
        icon:  "graduation",
        name:  "Drishti Computer Education",
        role:  "Franchise Partner",
        desc:  "Foundation, ADCA, DCA and professional program certificates.",
    },
    {
        icon:  "building",
        name:  "Gramin Skill Development Mission",
        role:  "Govt. Authorized Centre",
        desc:  "State-recognized diploma programs for skill development.",
    },
    {
        icon:  "scroll",
        name:  "NSDC / Skill India",
        role:  "National Alignment",
        desc:  "Ministry of Skill Development aligned course certifications.",
    },
    {
        icon:  "link",
        name:  "DigiLocker — Medhavi Skill University",
        role:  "Digital Verified",
        desc:  "University-level diplomas accessible on Government DigiLocker.",
    },
];

const credentials = [
    "ISO 9001:2015 Certified Institute",
    "GSDM Authorized Training Centre",
    "NSDC & Skill India Aligned Courses",
    "MSME (Udyam) Registered",
];

/* ─── Icons ─────────────────────────────────────────────────────── */

const GraduationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

const BuildingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const ScrollIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const LinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const CheckIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const iconMap: Record<string, React.ReactNode> = {
    graduation: <GraduationIcon />,
    building:   <BuildingIcon />,
    scroll:     <ScrollIcon />,
    link:       <LinkIcon />,
};

/* ─── Component ─────────────────────────────────────────────────── */

export default function VerificationInfo() {
    return (
        <>
            <div className="vi-card">

                {/* Decorations */}
                <div className="vi-card__glow vi-card__glow--1" aria-hidden="true" />
                <div className="vi-card__glow vi-card__glow--dots" aria-hidden="true" />

                {/* ── Header ── */}
                <div className="vi-card__header">
                    <div className="vi-card__eyebrow">
                        <span className="vi-card__eyebrow-line" aria-hidden="true" />
                        How It Works
                    </div>
                    <h2 className="vi-card__title">
                        Certificate Authorities
                    </h2>
                    <p className="vi-card__subtitle">
                        All certificates are issued and verifiable through
                        these recognized organizations.
                    </p>
                </div>

                {/* ── Authorities list ── */}
                <div className="vi-authorities">
                    {authorities.map((a) => (
                        <div key={a.name} className="vi-authority">
                            <span
                                className="vi-authority__bar"
                                aria-hidden="true"
                            />
                            <div className="vi-authority__icon">
                                {iconMap[a.icon]}
                            </div>
                            <div>
                                <div className="vi-authority__role">
                                    {a.role}
                                </div>
                                <div className="vi-authority__name">
                                    {a.name}
                                </div>
                                <div className="vi-authority__desc">
                                    {a.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Credentials footer ── */}
                <div className="vi-footer">
                    <div className="vi-footer__label">
                        Institute Credentials
                    </div>
                    <div className="vi-credentials">
                        {credentials.map((c) => (
                            <div key={c} className="vi-credential">
                                <span
                                    className="vi-credential__icon"
                                    aria-hidden="true"
                                >
                                    <CheckIcon />
                                </span>
                                <span>{c}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Component-scoped CSS ── */}
            <style>{`

/* ══════════════════════════════════════════
   VERIFICATION INFO  —  component-scoped
   ══════════════════════════════════════════ */

.vi-card {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: linear-gradient(
    160deg,
    var(--color-gray-800) 0%,
    var(--color-gray-900) 100%
  );
  border: 1px solid var(--color-gray-700);
}

/* Decorations */
.vi-card__glow {
  position: absolute;
  pointer-events: none;
}
.vi-card__glow--1 {
  width: 280px;
  height: 280px;
  border-radius: var(--radius-full);
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.18) 0%,
    transparent 65%
  );
  top: -80px;
  right: -80px;
  filter: blur(20px);
}
.vi-card__glow--dots {
  bottom: -10px;
  left: -10px;
  width: 120px;
  height: 120px;
  background-image: radial-gradient(
    circle,
    rgba(251, 146, 60, 0.16) 1.5px,
    transparent 1.5px
  );
  background-size: 12px 12px;
}

/* ── Header ─────────────────────────────── */
.vi-card__header {
  position: relative;
  z-index: 2;
  padding: var(--space-8) var(--space-8) var(--space-6);
  border-bottom: 1px solid rgba(251, 146, 60, 0.10);
}
.vi-card__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent-400);
  margin-bottom: var(--space-3);
}
.vi-card__eyebrow-line {
  display: inline-block;
  width: 14px;
  height: 1.5px;
  background: var(--color-accent-400);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.vi-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
  margin: 0 0 var(--space-2);
}
.vi-card__subtitle {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: rgba(255, 255, 255, 0.45);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* ── Authorities ────────────────────────── */
.vi-authorities {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(251, 146, 60, 0.08);
}

.vi-authority {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background var(--transition-fast);
}
.vi-authority:last-child {
  border-bottom: none;
}
.vi-authority:hover {
  background: rgba(251, 146, 60, 0.06);
}

/* Left accent bar */
.vi-authority__bar {
  position: absolute;
  left: 0;
  top: var(--space-3);
  bottom: var(--space-3);
  width: 2px;
  border-radius: var(--radius-full);
  background: var(--color-accent-400);
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.vi-authority:hover .vi-authority__bar {
  opacity: 1;
}

/* Icon */
.vi-authority__icon {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-accent-300);
  background: rgba(251, 146, 60, 0.10);
  border: 1px solid rgba(251, 146, 60, 0.16);
}

.vi-authority__role {
  font-size: 8px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(251, 146, 60, 0.60);
  margin-bottom: 3px;
}
.vi-authority__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
  margin-bottom: 3px;
}
.vi-authority__desc {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: rgba(255, 255, 255, 0.35);
  line-height: var(--line-height-relaxed);
}

/* ── Footer ─────────────────────────────── */
.vi-footer {
  position: relative;
  z-index: 2;
  padding: var(--space-5) var(--space-8) var(--space-8);
}
.vi-footer__label {
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(251, 146, 60, 0.42);
  margin-bottom: var(--space-4);
}

/* Credentials */
.vi-credentials {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.vi-credential {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: rgba(255, 255, 255, 0.50);
}
.vi-credential__icon {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-success);
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.20);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */
@media (max-width: 480px) {
  .vi-card__header {
    padding: var(--space-6);
  }
  .vi-authority {
    padding: var(--space-4) var(--space-6);
  }
  .vi-footer {
    padding: var(--space-5) var(--space-6) var(--space-6);
  }
}

      `}</style>
        </>
    );
}