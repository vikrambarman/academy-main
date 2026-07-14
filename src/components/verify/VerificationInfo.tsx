// ============================================================
// components/verify/VerificationInfo.tsx  (Client Component)
// ============================================================
"use client";

/* ─── Data (UNCHANGED) ─── */
const authorities = [
  { icon: "graduation", name: "Drishti Computer Education", role: "Franchise Partner", desc: "Foundation, ADCA, DCA and professional program certificates." },
  { icon: "building", name: "Gramin Skill Development Mission", role: "Govt. Authorized Centre", desc: "State-recognized diploma programs for skill development." },
  { icon: "scroll", name: "NSDC / Skill India", role: "National Alignment", desc: "Ministry of Skill Development aligned course certifications." },
  { icon: "link", name: "DigiLocker — Medhavi Skill University", role: "Digital Verified", desc: "University-level diplomas accessible on Government DigiLocker." },
];

const credentials = [
  "ISO 9001:2015 Certified Institute",
  "GSDM Authorized Training Centre",
  "NSDC & Skill India Aligned Courses",
  "MSME (Udyam) Registered",
];

/* ─── Icons ─── */
const GraduationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ScrollIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const iconMap: Record<string, React.ReactNode> = {
  graduation: <GraduationIcon />,
  building: <BuildingIcon />,
  scroll: <ScrollIcon />,
  link: <LinkIcon />,
};

export default function VerificationInfo() {
  return (
    <div className="vi-card">
      <div className="vi-card__header">
        <div className="vi-card__eyebrow">
          <span className="vi-card__eyebrow-line" aria-hidden="true" />
          How It Works
        </div>
        <h2 className="vi-card__title">Certificate Authorities</h2>
        <p className="vi-card__subtitle">
          All certificates are issued and verifiable through these recognized
          organizations.
        </p>
      </div>

      <div className="vi-authorities">
        {authorities.map((a) => (
          <div key={a.name} className="vi-authority">
            <div className="vi-authority__icon">{iconMap[a.icon]}</div>
            <div>
              <div className="vi-authority__role">{a.role}</div>
              <div className="vi-authority__name">{a.name}</div>
              <div className="vi-authority__desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="vi-footer">
        <div className="vi-footer__label">Institute Credentials</div>
        <div className="vi-credentials">
          {credentials.map((c) => (
            <div key={c} className="vi-credential">
              <span className="vi-credential__icon" aria-hidden="true">
                <CheckIcon />
              </span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}