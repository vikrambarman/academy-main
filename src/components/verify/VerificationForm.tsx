// ============================================================
// components/verify/VerificationForm.tsx  (Client Component)
// ============================================================
"use client";

import { useState } from "react";

const PORTALS = [
    {
        name: "Drishti Computer Education",
        match: /DRISHTI|DCE/i,
        url: "https://drishticomputer.com/check-certificate-marksheet",
        note: "Certificate issued & verified by Drishti Computer Education",
        icon: "🎓",
        badge: "Franchise Partner",
    },
    {
        name: "Gramin Skill Development Mission",
        match: /GSDM|GSM/i,
        url: "https://graminskill.in/condidate_Verify.aspx",
        note: "Authorized Training Center — verified on the GSDM portal",
        icon: "🏛",
        badge: "Govt. Authorized",
    },
    {
        name: "NSDC / Skill India",
        match: /NSDC|SKILL/i,
        url: "https://www.nsdcindia.org",
        note: "Skill India aligned certificate under NSDC framework",
        icon: "📜",
        badge: "National Program",
    },
    {
        name: "DigiLocker (Medhavi Skill University)",
        match: /DIPLOMA|MSU/i,
        url: "https://www.digilocker.gov.in",
        note: "University diploma accessible on Government DigiLocker",
        icon: "🔗",
        badge: "Digital Verified",
    },
];

type PortalResult = (typeof PORTALS)[number];

export default function VerificationForm() {
    const [certificateNo, setCertificateNo] = useState("");
    const [result, setResult] = useState<PortalResult | { error: string } | null>(null);
    const [touched, setTouched] = useState(false);

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
        <>
            <style>{`
                .vf-card {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                }

                .vf-header {
                    padding: 32px 36px 28px;
                    border-bottom: 1px solid #f5efe4;
                }

                .vf-header-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 8px;
                }

                .vf-header-label::before {
                    content: '';
                    display: inline-block;
                    width: 14px; height: 1.5px;
                    background: #d97706;
                }

                .vf-header-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.25;
                }

                .vf-header-sub {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: #92826b;
                    margin-top: 6px;
                    line-height: 1.6;
                }

                .vf-body {
                    padding: 32px 36px 36px;
                }

                /* Field */
                .vf-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 16px;
                }

                .vf-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92826b;
                }

                .vf-input {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 300;
                    color: #1a1208;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 12px;
                    padding: 13px 16px;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                }

                .vf-input::placeholder { color: #b8a898; }

                .vf-input:focus {
                    border-color: #d97706;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(217,119,6,0.08);
                }

                .vf-hint {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: #92826b;
                    margin-top: 2px;
                }

                /* Submit */
                .vf-submit {
                    width: 100%;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    border: none;
                    border-radius: 12px;
                    padding: 14px;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 4px;
                }

                .vf-submit:hover {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                /* Error */
                .vf-error {
                    margin-top: 20px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 12px;
                    padding: 14px 18px;
                    font-size: 0.82rem;
                    font-weight: 300;
                    color: #dc2626;
                    line-height: 1.6;
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                }

                /* Result */
                .vf-result {
                    margin-top: 20px;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 16px;
                    overflow: hidden;
                }

                .vf-result-top {
                    padding: 20px 22px 16px;
                    border-bottom: 1px solid #f0e8d8;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .vf-result-icon {
                    width: 38px; height: 38px;
                    background: #fff;
                    border: 1px solid #fde68a;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    flex-shrink: 0;
                }

                .vf-result-badge {
                    font-size: 8px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92540a;
                    background: #fffbeb;
                    border: 1px solid #fde68a;
                    padding: 3px 9px;
                    border-radius: 100px;
                    margin-bottom: 4px;
                    display: inline-block;
                }

                .vf-result-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .vf-result-body {
                    padding: 16px 22px 20px;
                }

                .vf-result-note {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.7;
                    margin-bottom: 16px;
                }

                .vf-portal-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    padding: 10px 20px;
                    border-radius: 100px;
                    text-decoration: none;
                    transition: background 0.18s, transform 0.15s;
                }

                .vf-portal-btn:hover {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                .vf-portal-arrow {
                    transition: transform 0.18s;
                }

                .vf-portal-btn:hover .vf-portal-arrow {
                    transform: translateX(3px);
                }

                /* Disclaimer */
                .vf-disclaimer {
                    margin-top: 20px;
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: #b8a898;
                    line-height: 1.7;
                    padding: 0 2px;
                }

                @media (max-width: 480px) {
                    .vf-header { padding: 24px 24px 20px; }
                    .vf-body { padding: 24px 24px 28px; }
                }
            `}</style>

            <div className="vf-card">
                <div className="vf-header">
                    <div className="vf-header-label">Check Your Certificate</div>
                    <div className="vf-header-title">Verify Certificate</div>
                    <div className="vf-header-sub">
                        Enter your certificate number to proceed to the official verification portal.
                    </div>
                </div>

                <div className="vf-body">
                    <form onSubmit={handleSubmit}>
                        <div className="vf-field">
                            <label className="vf-label" htmlFor="vf-cert-no">
                                Certificate Number / Registration ID
                            </label>
                            <input
                                id="vf-cert-no"
                                type="text"
                                required
                                value={certificateNo}
                                onChange={(e) => { setCertificateNo(e.target.value); setTouched(true); }}
                                placeholder="e.g. DCE/23/00002345 or GSDM-88921"
                                className="vf-input"
                            />
                            <span className="vf-hint">
                                Prefix determines the verifying authority (DCE, GSDM, NSDC, MSU…)
                            </span>
                        </div>

                        <button type="submit" className="vf-submit">
                            Proceed to Verification <span className="vf-portal-arrow" aria-hidden="true">→</span>
                        </button>
                    </form>

                    {hasError && (
                        <div className="vf-error" role="alert">
                            <span aria-hidden="true">✕</span>
                            <span>{(result as { error: string }).error}</span>
                        </div>
                    )}

                    {hasMatch && (() => {
                        const r = result as PortalResult;
                        return (
                            <div className="vf-result">
                                <div className="vf-result-top">
                                    <div className="vf-result-icon" aria-hidden="true">{r.icon}</div>
                                    <div>
                                        <div className="vf-result-badge">{r.badge}</div>
                                        <div className="vf-result-name">{r.name}</div>
                                    </div>
                                </div>
                                <div className="vf-result-body">
                                    <p className="vf-result-note">{r.note}</p>
                                    <a
                                        href={r.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="vf-portal-btn"
                                    >
                                        Go to Verification Portal
                                        <span className="vf-portal-arrow" aria-hidden="true">↗</span>
                                    </a>
                                </div>
                            </div>
                        );
                    })()}

                    <p className="vf-disclaimer">
                        Certificates are issued and verified by respective authorities.
                        Shivshakti Computer Academy acts only as an authorized training partner.
                    </p>
                </div>
            </div>
        </>
    );
}