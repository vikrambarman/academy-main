// ============================================================
// components/verify/VerificationForm.tsx  (Client Component)
// ============================================================
"use client";

import { useState } from "react";

/* ─── Data ───────────────────────────────────────────────────────── */

const PORTALS = [
    {
        name:  "Drishti Computer Education",
        match: /DRISHTI|DCE/i,
        url:   "https://drishticomputer.com/check-certificate-marksheet",
        note:  "Certificate issued & verified by Drishti Computer Education",
        badge: "Franchise Partner",
        icon:  "graduation",
    },
    {
        name:  "Gramin Skill Development Mission",
        match: /GSDM|GSM/i,
        url:   "https://graminskill.in/condidate_Verify.aspx",
        note:  "Authorized Training Center — verified on the GSDM portal",
        badge: "Govt. Authorized",
        icon:  "building",
    },
    {
        name:  "NSDC / Skill India",
        match: /NSDC|SKILL/i,
        url:   "https://www.nsdcindia.org",
        note:  "Skill India aligned certificate under NSDC framework",
        badge: "National Program",
        icon:  "scroll",
    },
    {
        name:  "DigiLocker (Medhavi Skill University)",
        match: /DIPLOMA|MSU/i,
        url:   "https://www.digilocker.gov.in",
        note:  "University diploma accessible on Government DigiLocker",
        badge: "Digital Verified",
        icon:  "link",
    },
];

type PortalResult = (typeof PORTALS)[number];

/* ─── Icons ─────────────────────────────────────────────────────── */

const GraduationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

const BuildingIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const ScrollIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const LinkIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const ExternalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

const iconMap: Record<string, React.ReactNode> = {
    graduation: <GraduationIcon />,
    building:   <BuildingIcon />,
    scroll:     <ScrollIcon />,
    link:       <LinkIcon />,
};

/* ─── Component ─────────────────────────────────────────────────── */

export default function VerificationForm() {
    const [certificateNo, setCertificateNo] = useState("");
    const [result, setResult]               = useState<PortalResult | { error: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cert = certificateNo.trim();
        if (!cert) return;
        const authority = PORTALS.find((p) => p.match.test(cert));
        setResult(
            authority ?? {
                error: "Unable to identify certificate authority. Please contact the institute directly.",
            }
        );
    };

    const hasError = result && "error" in result;
    const hasMatch = result && "name" in result;

    return (
        <>
            <div className="vf-card">

                {/* ── Header ── */}
                <div className="vf-card__header">
                    <div className="vf-card__eyebrow">
                        <span className="vf-card__eyebrow-line" aria-hidden="true" />
                        Check Your Certificate
                    </div>
                    <h2 className="vf-card__title">Verify Certificate</h2>
                    <p className="vf-card__subtitle">
                        Enter your certificate number to proceed to the
                        official verification portal.
                    </p>
                </div>

                {/* ── Body ── */}
                <div className="vf-card__body">
                    <form onSubmit={handleSubmit} className="vf-form">

                        {/* Input field */}
                        <div className="form-group">
                            <label
                                htmlFor="vf-cert-no"
                                className="vf-form__label"
                            >
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
                                Prefix determines the verifying authority
                                (DCE, GSDM, NSDC, MSU…)
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="vf-form__submit"
                        >
                            Proceed to Verification
                            <span className="vf-form__submit-arrow" aria-hidden="true">
                                <ArrowRightIcon />
                            </span>
                        </button>
                    </form>

                    {/* Error state */}
                    {hasError && (
                        <div
                            role="alert"
                            className="vf-alert vf-alert--error"
                        >
                            <span aria-hidden="true">✕</span>
                            <span>
                                {(result as { error: string }).error}
                            </span>
                        </div>
                    )}

                    {/* Match result */}
                    {hasMatch && (() => {
                        const r = result as PortalResult;
                        return (
                            <div className="vf-result">

                                {/* Result header */}
                                <div className="vf-result__head">
                                    <div className="vf-result__icon">
                                        {iconMap[r.icon]}
                                    </div>
                                    <div>
                                        <span className="vf-result__badge">
                                            {r.badge}
                                        </span>
                                        <div className="vf-result__name">
                                            {r.name}
                                        </div>
                                    </div>
                                </div>

                                {/* Result body */}
                                <div className="vf-result__body">
                                    <p className="vf-result__note">
                                        {r.note}
                                    </p>
                                    <a
                                        href={r.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="vf-result__link"
                                    >
                                        Go to Verification Portal
                                        <span className="vf-result__link-icon" aria-hidden="true">
                                            <ExternalIcon />
                                        </span>
                                    </a>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Disclaimer */}
                    <p className="vf-disclaimer">
                        Certificates are issued and verified by respective
                        authorities. Shivshakti Computer Academy acts only
                        as an authorized training partner.
                    </p>
                </div>
            </div>

            {/* ── Component-scoped CSS ── */}
            <style>{`

/* ══════════════════════════════════════════
   VERIFICATION FORM  —  component-scoped
   ══════════════════════════════════════════ */

.vf-card {
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
}

/* ── Header ─────────────────────────────── */
.vf-card__header {
  padding: var(--space-8) var(--space-8) var(--space-6);
  border-bottom: 1px solid var(--border-color);
}
.vf-card__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary-600);
  margin-bottom: var(--space-3);
}
.vf-card__eyebrow-line {
  display: inline-block;
  width: 14px;
  height: 1.5px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.vf-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  margin: 0 0 var(--space-2);
}
.vf-card__subtitle {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* ── Body ───────────────────────────────── */
.vf-card__body {
  padding: var(--space-8);
}

/* ── Form ───────────────────────────────── */
.vf-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.vf-form__label {
  display: block;
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}

.vf-form__input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  font-family: var(--font-sans);
  color: var(--text-primary);
  background: var(--bg-page);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}
.vf-form__input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  background: var(--bg-elevated);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
}
.vf-form__input::placeholder {
  color: var(--color-gray-400);
}

.vf-form__hint {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: var(--text-tertiary);
  margin-top: var(--space-2);
}

/* Submit button */
.vf-form__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-sans);
  color: var(--color-white);
  background: var(--color-gray-900);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}
.vf-form__submit:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.vf-form__submit-arrow {
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast);
}
.vf-form__submit:hover .vf-form__submit-arrow {
  transform: translateX(3px);
}

/* ── Alert ──────────────────────────────── */
.vf-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  margin-top: var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-relaxed);
}
.vf-alert--error {
  background: var(--color-danger-light);
  border: 1px solid var(--color-danger);
  color: var(--color-danger-dark);
}

/* ── Result card ────────────────────────── */
.vf-result {
  margin-top: var(--space-5);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--bg-page);
  border: 1px solid var(--border-color);
}
.vf-result__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border-color);
}
.vf-result__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--color-warning-light);
  color: var(--color-primary-600);
}
.vf-result__badge {
  display: inline-block;
  font-size: 8px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-1);
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
}
.vf-result__name {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
}
.vf-result__body {
  padding: var(--space-4) var(--space-6);
}
.vf-result__note {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-4);
}

/* Portal link */
.vf-result__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  padding: var(--space-2) var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  background: var(--color-gray-900);
  border-radius: var(--radius-full);
  transition:
    background var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}
.vf-result__link:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.vf-result__link-icon {
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast);
}
.vf-result__link:hover .vf-result__link-icon {
  transform: translate(2px, -2px);
}

/* ── Disclaimer ─────────────────────────── */
.vf-disclaimer {
  margin-top: var(--space-5);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: var(--text-tertiary);
  line-height: var(--line-height-relaxed);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */
@media (max-width: 480px) {
  .vf-card__header,
  .vf-card__body {
    padding: var(--space-6);
  }
}

      `}</style>
        </>
    );
}