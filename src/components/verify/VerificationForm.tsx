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
    const [result, setResult]               = useState<PortalResult | { error: string } | null>(null);
    const [touched, setTouched]             = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cert = certificateNo.trim();
        if (!cert) return;
        const authority = PORTALS.find(p => p.match.test(cert));
        setResult(authority ?? { error: "Unable to identify certificate authority. Please contact the institute directly." });
    };

    const hasError = result && "error" in result;
    const hasMatch = result && "name" in result;

    /* Shared input focus/blur */
    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.borderColor = "var(--color-primary)";
        e.currentTarget.style.background  = "var(--color-bg-card)";
        e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb,var(--color-primary) 12%,transparent)";
    };
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.background  = "var(--color-bg)";
        e.currentTarget.style.boxShadow   = "none";
    };

    return (
        <div className="rounded-[24px] overflow-hidden"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>

            {/* ── Header ── */}
            <div className="px-9 pt-8 pb-7 max-sm:px-6 max-sm:pt-6 max-sm:pb-5"
                style={{ borderBottom: "1px solid var(--color-border)" }}>
                {/* Eyebrow */}
                <div className="flex items-center gap-1.5 mb-2 text-[9px] font-medium tracking-[0.18em] uppercase"
                    style={{ color: "var(--color-primary)" }}>
                    <span aria-hidden="true"
                        style={{ display: "inline-block", width: 14, height: 1.5, background: "var(--color-primary)", flexShrink: 0 }} />
                    Check Your Certificate
                </div>
                <div className="font-serif text-[1.2rem] font-bold leading-[1.25]"
                    style={{ color: "var(--color-text)" }}>
                    Verify Certificate
                </div>
                <div className="text-[0.8rem] font-light leading-[1.6] mt-1.5"
                    style={{ color: "var(--color-text-muted)" }}>
                    Enter your certificate number to proceed to the official verification portal.
                </div>
            </div>

            {/* ── Body ── */}
            <div className="px-9 py-8 max-sm:px-6 max-sm:py-6">
                <form onSubmit={handleSubmit}>
                    {/* Field */}
                    <div className="flex flex-col gap-1.5 mb-4">
                        <label htmlFor="vf-cert-no"
                            className="text-[10px] font-medium tracking-[0.12em] uppercase"
                            style={{ color: "var(--color-text-muted)" }}>
                            Certificate Number / Registration ID
                        </label>
                        <input
                            id="vf-cert-no"
                            type="text"
                            required
                            value={certificateNo}
                            onChange={e => { setCertificateNo(e.target.value); setTouched(true); }}
                            placeholder="e.g. DCE/23/00002345 or GSDM-88921"
                            className="w-full rounded-xl px-4 py-[13px] text-[0.85rem] font-light outline-none transition-all duration-200"
                            style={{
                                fontFamily:  "'DM Sans', sans-serif",
                                background:  "var(--color-bg)",
                                border:      "1px solid var(--color-border)",
                                color:       "var(--color-text)",
                                boxSizing:   "border-box",
                            }}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        <span className="text-[0.72rem] font-light"
                            style={{ color: "var(--color-text-muted)" }}>
                            Prefix determines the verifying authority (DCE, GSDM, NSDC, MSU…)
                        </span>
                    </div>

                    {/* Submit */}
                    <button type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-xl py-[14px] mt-1 text-[0.88rem] font-medium transition-all duration-200 hover:-translate-y-px cursor-pointer"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            background: "var(--color-bg-sidebar)",
                            color:      "var(--color-text-inverse)",
                            border:     "none",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg-sidebar)"}>
                        Proceed to Verification
                        <span className="transition-transform duration-200" aria-hidden="true">→</span>
                    </button>
                </form>

                {/* Error state */}
                {hasError && (
                    <div role="alert"
                        className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 mt-5 text-[0.82rem] font-light leading-[1.6]"
                        style={{
                            background: "color-mix(in srgb,var(--color-error) 10%,var(--color-bg))",
                            border:     "1px solid color-mix(in srgb,var(--color-error) 35%,transparent)",
                            color:      "var(--color-error)",
                        }}>
                        <span aria-hidden="true">✕</span>
                        <span>{(result as { error: string }).error}</span>
                    </div>
                )}

                {/* Match result */}
                {hasMatch && (() => {
                    const r = result as PortalResult;
                    return (
                        <div className="mt-5 rounded-2xl overflow-hidden"
                            style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>

                            {/* Result top row */}
                            <div className="flex items-center gap-3 px-[22px] py-5"
                                style={{ borderBottom: "1px solid var(--color-border)" }}>
                                {/* Icon box */}
                                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-base flex-shrink-0"
                                    style={{
                                        background: "var(--color-bg-card)",
                                        border:     "1px solid color-mix(in srgb,var(--color-warning) 40%,transparent)",
                                    }}
                                    aria-hidden="true">
                                    {r.icon}
                                </div>
                                <div>
                                    {/* Badge */}
                                    <span className="inline-block text-[8px] font-medium tracking-[0.12em] uppercase px-2.5 py-0.5 rounded-full mb-1"
                                        style={{
                                            color:      "var(--color-primary)",
                                            background: "color-mix(in srgb,var(--color-primary) 10%,var(--color-bg))",
                                            border:     "1px solid color-mix(in srgb,var(--color-primary) 25%,transparent)",
                                        }}>
                                        {r.badge}
                                    </span>
                                    <div className="font-serif text-[0.95rem] font-bold leading-[1.2]"
                                        style={{ color: "var(--color-text)" }}>
                                        {r.name}
                                    </div>
                                </div>
                            </div>

                            {/* Result body */}
                            <div className="px-[22px] py-4">
                                <p className="text-[0.8rem] font-light leading-[1.7] mb-4"
                                    style={{ color: "var(--color-text-muted)" }}>
                                    {r.note}
                                </p>
                                <a href={r.url} target="_blank" rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 no-underline rounded-full px-5 py-2.5 text-[0.82rem] font-medium transition-all duration-200 hover:-translate-y-px"
                                    style={{
                                        background: "var(--color-bg-sidebar)",
                                        color:      "var(--color-text-inverse)",
                                    }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg-sidebar)"}>
                                    Go to Verification Portal
                                    <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">↗</span>
                                </a>
                            </div>
                        </div>
                    );
                })()}

                {/* Disclaimer */}
                <p className="mt-5 text-[0.72rem] font-light leading-[1.7] px-0.5"
                    style={{ color: "var(--color-text-muted)" }}>
                    Certificates are issued and verified by respective authorities.
                    Shivshakti Computer Academy acts only as an authorized training partner.
                </p>
            </div>
        </div>
    );
}