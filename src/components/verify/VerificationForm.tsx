// ============================================================
// components/verify/VerificationForm.tsx  (Client Component)
// ============================================================
"use client";

import { useState } from "react";

/* ─── Data (UNCHANGED) ─── */
const PORTALS = [
  { name: "Drishti Computer Education", match: /DRISHTI|DCE/i, url: "https://drishticomputer.com/check-certificate-marksheet", note: "Certificate issued & verified by Drishti Computer Education", badge: "Franchise Partner", icon: "graduation" },
  { name: "Gramin Skill Development Mission", match: /GSDM|GSM/i, url: "https://graminskill.in/condidate_Verify.aspx", note: "Authorized Training Center — verified on the GSDM portal", badge: "Govt. Authorized", icon: "building" },
  { name: "NSDC / Skill India", match: /NSDC|SKILL/i, url: "https://www.nsdcindia.org", note: "Skill India aligned certificate under NSDC framework", badge: "National Program", icon: "scroll" },
  { name: "DigiLocker (Medhavi Skill University)", match: /DIPLOMA|MSU/i, url: "https://www.digilocker.gov.in", note: "University diploma accessible on Government DigiLocker", badge: "Digital Verified", icon: "link" },
];

type PortalResult = (typeof PORTALS)[number];

/* ─── Icons ─── */
const GraduationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ScrollIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const iconMap: Record<string, React.ReactNode> = {
  graduation: <GraduationIcon />,
  building: <BuildingIcon />,
  scroll: <ScrollIcon />,
  link: <LinkIcon />,
};

export default function VerificationForm() {
  const [certificateNo, setCertificateNo] = useState("");
  const [result, setResult] = useState<PortalResult | { error: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cert = certificateNo.trim();
    if (!cert) return;
    const authority = PORTALS.find((p) => p.match.test(cert));
    setResult(authority ?? { error: "Unable to identify certificate authority. Please contact the institute directly." });
  };

  const hasError = result && "error" in result;
  const hasMatch = result && "name" in result;

  return (
    <div className="vf-card">
      <div className="vf-card__header">
        <div className="vf-card__eyebrow">
          <span className="vf-card__eyebrow-line" aria-hidden="true" />
          Check Your Certificate
        </div>
        <h2 className="vf-card__title">Verify Certificate</h2>
        <p className="vf-card__subtitle">
          Enter your certificate number to proceed to the official verification
          portal.
        </p>
      </div>

      <div className="vf-card__body">
        <form onSubmit={handleSubmit} className="vf-form">
          <div className="form-group">
            <label htmlFor="vf-cert-no" className="vf-form__label">
              Certificate Number / Registration ID
            </label>
            <input
              id="vf-cert-no"
              type="text"
              required
              value={certificateNo}
              onChange={(e) => {
                setCertificateNo(e.target.value);
                setResult(null);
              }}
              placeholder="e.g. DCE/23/00002345 or GSDM-88921"
              className="vf-form__input"
            />
            <span className="vf-form__hint">
              Prefix determines the verifying authority (DCE, GSDM, NSDC,
              MSU…)
            </span>
          </div>

          <button type="submit" className="vf-form__submit">
            Proceed to Verification
            <span className="vf-form__submit-arrow" aria-hidden="true">
              <ArrowRightIcon />
            </span>
          </button>
        </form>

        {hasError && (
          <div role="alert" className="vf-alert vf-alert--error">
            <span aria-hidden="true">✕</span>
            <span>{(result as { error: string }).error}</span>
          </div>
        )}

        {hasMatch &&
          (() => {
            const r = result as PortalResult;
            return (
              <div className="vf-result">
                <div className="vf-result__head">
                  <div className="vf-result__icon">{iconMap[r.icon]}</div>
                  <div>
                    <span className="vf-result__badge">{r.badge}</span>
                    <div className="vf-result__name">{r.name}</div>
                  </div>
                </div>
                <div className="vf-result__body">
                  <p className="vf-result__note">{r.note}</p>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vf-result__link"
                  >
                    Go to Verification Portal
                    <span
                      className="vf-result__link-icon"
                      aria-hidden="true"
                    >
                      <ExternalIcon />
                    </span>
                  </a>
                </div>
              </div>
            );
          })()}

        <p className="vf-disclaimer">
          Certificates are issued and verified by respective authorities.
          Shivshakti Computer Academy acts only as an authorized training
          partner.
        </p>
      </div>
    </div>
  );
}