"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Award, BadgeCheck, BookOpen, ChevronDown, ChevronRight,
    Clock, GraduationCap, IndianRupee, Layers, Monitor,
    Shield, Sparkles, Star, Users, Zap,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CertEntry {
    certType: {
        _id: string; name: string; code: string; issuingBody: string;
        verificationMethod?: string; verificationUrl?: string; benefits?: string[];
    };
    isDefault:            boolean;
    fee:                  number;
    registrationFee:      number;
    installmentsAllowed:  boolean;
    maxInstallments:      number;
    minInstallmentAmount: number;
}

interface Config {
    _id: string;
    course: {
        _id: string; name: string; level: string;
        duration?: string; description?: string; modules?: string[];
    };
    franchise: {
        _id: string; name: string; code: string; isOwn: boolean;
        registeredBodies: string[]; websiteUrl?: string; description?: string;
    };
    defaultCertType: {
        _id: string; name: string; code: string; issuingBody: string;
        verificationMethod?: string; verificationUrl?: string; benefits?: string[];
    };
    certEntries:  CertEntry[];
    // feeStructure virtual not reliable from lean() — use certEntries directly
    feeStructure?: { total: number; registrationFee: number; installmentsAllowed: boolean; maxInstallments: number; minInstallmentAmount: number };
    benefits:     string[];
    highlights:   string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Get default cert entry from certEntries (lean() virtuals not reliable)
function getDefaultEntry(cfg: Config) {
    return cfg.certEntries?.find(e => e.isDefault) ?? cfg.certEntries?.[0] ?? null;
}
function getCfgFee(cfg: Config)              { return getDefaultEntry(cfg)?.fee                  ?? 0; }
function getCfgEmiOk(cfg: Config)            { return getDefaultEntry(cfg)?.installmentsAllowed  ?? true; }
function getCfgMaxEmi(cfg: Config)           { return getDefaultEntry(cfg)?.maxInstallments       ?? 3; }
function getCfgMinEmi(cfg: Config)           { return getDefaultEntry(cfg)?.minInstallmentAmount  ?? 500; }
function getCfgRegFee(cfg: Config)           { return getDefaultEntry(cfg)?.registrationFee       ?? 0; }

const LEVEL_COLOR: Record<string, string> = {
    "Beginner":     "var(--cp-success)",
    "Intermediate": "var(--cp-warning)",
    "Advanced":     "var(--cp-danger)",
};

const LEVEL_ICON: Record<string, string> = {
    "Beginner": "🌱", "Intermediate": "🚀", "Advanced": "⚡",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
    return (
        <div className="ep-root">
            <div className="ep-sidebar">
                <div className="ep-sk" style={{ width: "80%", height: 28, borderRadius: 6, marginBottom: 24 }} />
                {[1,2,3,4].map(i => (
                    <div key={i} className="ep-sk" style={{ width: "100%", height: 64, borderRadius: 12, marginBottom: 8 }} />
                ))}
            </div>
            <div className="ep-main">
                <div className="ep-sk" style={{ width: "60%", height: 40, borderRadius: 8, marginBottom: 12 }} />
                <div className="ep-sk" style={{ width: "40%", height: 20, borderRadius: 6, marginBottom: 32 }} />
                <div className="ep-sk" style={{ width: "100%", height: 180, borderRadius: 16, marginBottom: 20 }} />
                <div className="ep-sk" style={{ width: "100%", height: 220, borderRadius: 16 }} />
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function EnquiryPresentationPage() {
    const [configs,     setConfigs]     = useState<Config[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [selectedId,  setSelectedId]  = useState<string | null>(null);
    const [activeCert,  setActiveCert]  = useState<string | null>(null);
    const [expandFee,   setExpandFee]   = useState(false);

    const safeJson = async (url: string) => {
        try {
            const r = await fetchWithAuth(url);
            if (!r.ok) return [];
            const d = await r.json();
            return Array.isArray(d) ? d : [];
        } catch { return []; }
    };

    useEffect(() => {
        safeJson("/api/admin/course-franchise-configs")
            .then(d => {
                setConfigs(d);
                if (d.length > 0) {
                    setSelectedId(d[0]._id);
                    const defEntry = d[0].certEntries?.find((e: CertEntry) => e.isDefault) ?? d[0].certEntries?.[0];
                    setActiveCert(defEntry?.certType._id ?? d[0].defaultCertType._id);
                }
            })
            .finally(() => setPageLoading(false));
    }, []);

    const selected = configs.find(c => c._id === selectedId) ?? null;

    // When config changes, reset active cert to default
    const selectConfig = (cfg: Config) => {
        setSelectedId(cfg._id);
        const defEntry = cfg.certEntries?.find(e => e.isDefault) ?? cfg.certEntries?.[0];
        setActiveCert(defEntry?.certType._id ?? cfg.defaultCertType._id);
        setExpandFee(false);
    };

    // Active cert entry (has fee info)
    const activeCertEntry: CertEntry | null = selected
        ? (selected.certEntries?.find(e => e.certType._id === activeCert) ?? selected.certEntries?.[0] ?? null)
        : null;
    const activeCertData = activeCertEntry?.certType ?? (selected ? selected.defaultCertType : null);

    if (pageLoading) return <><style>{css}</style><Skeleton /></>;

    if (configs.length === 0) return (
        <>
            <style>{css}</style>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, color: "var(--cp-muted)", fontFamily: "var(--ep-body)" }}>
                <BookOpen size={40} style={{ opacity: 0.3 }} />
                <div style={{ fontSize: 16, fontWeight: 600 }}>Koi course config nahi hai</div>
                <div style={{ fontSize: 13 }}>Course Franchise Config page pe pehle config add karo</div>
            </div>
        </>
    );

    const fColor  = selected?.franchise.isOwn ? "var(--cp-warning)"      : "var(--cp-accent)";
    const fBg     = selected?.franchise.isOwn ? "rgba(245,158,11,0.12)"  : "var(--cp-accent-glow)";

    // Group by course name for sidebar
    const byCourse: Record<string, Config[]> = {};
    configs.forEach(cfg => {
        const key = cfg.course.name;
        if (!byCourse[key]) byCourse[key] = [];
        byCourse[key].push(cfg);
    });

    return (
        <>
            <style>{css}</style>

            <div className="ep-root">

                {/* ── Sidebar ── */}
                <aside className="ep-sidebar">
                    <div className="ep-sidebar-label">
                        <GraduationCap size={12} /> Courses
                    </div>

                    {Object.entries(byCourse).map(([courseName, cfgs]) => (
                        <div key={courseName} className="ep-course-group">
                            <div className="ep-course-group-name">{courseName}</div>
                            {cfgs.map(cfg => {
                                const isSel  = cfg._id === selectedId;
                                const fc     = cfg.franchise.isOwn ? "var(--cp-warning)" : "var(--cp-accent)";
                                const fbg    = cfg.franchise.isOwn ? "rgba(245,158,11,0.12)" : "var(--cp-accent-glow)";
                                return (
                                    <button key={cfg._id}
                                        className={`ep-sidebar-item${isSel ? " ep-sidebar-item--active" : ""}`}
                                        onClick={() => selectConfig(cfg)}>
                                        <div className="ep-sidebar-badge" style={{ background: fbg, color: fc }}>
                                            {cfg.franchise.code}
                                        </div>
                                        <div className="ep-sidebar-info">
                                            <div className="ep-sidebar-fname">{cfg.franchise.name}</div>
                                            <div className="ep-sidebar-fee">{fmt(getCfgFee(cfg))}</div>
                                        </div>
                                        {isSel && <ChevronRight size={13} style={{ color: fc, flexShrink: 0 }} />}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </aside>

                {/* ── Main Content ── */}
                {selected && (
                    <main className="ep-main">

                        {/* Hero */}
                        <div className="ep-hero">
                            <div className="ep-hero-top">
                                <div>
                                    <div className="ep-hero-course">{selected.course.name}</div>
                                    <div className="ep-hero-meta">
                                        {selected.course.level && (
                                            <span className="ep-level-badge" style={{ color: LEVEL_COLOR[selected.course.level] ?? "var(--cp-accent)" }}>
                                                {LEVEL_ICON[selected.course.level] ?? "📘"} {selected.course.level}
                                            </span>
                                        )}
                                        <span className="ep-franchise-chip" style={{ background: fBg, color: fColor }}>
                                            <Shield size={10} /> {selected.franchise.code} — {selected.franchise.name}
                                        </span>
                                        {selected.franchise.registeredBodies?.slice(0, 2).map(b => (
                                            <span key={b} className="ep-reg-chip">{b}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="ep-hero-fee">
                                    <div className="ep-fee-big">{fmt(activeCertEntry?.fee ?? getCfgFee(selected))}</div>
                                    {(activeCertEntry?.registrationFee ?? 0) > 0 && (
                                        <div className="ep-fee-emi" style={{ color: "var(--cp-warning)" }}>
                                            + {fmt(activeCertEntry?.registrationFee ?? 0)} registration
                                        </div>
                                    )}
                                    {(activeCertEntry?.installmentsAllowed ?? getCfgEmiOk(selected)) && (
                                        <div className="ep-fee-emi">
                                            EMI: {fmt(activeCertEntry?.minInstallmentAmount ?? getCfgMinEmi(selected))} × {activeCertEntry?.maxInstallments ?? getCfgMaxEmi(selected)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Highlights strip */}
                            {selected.highlights.filter(Boolean).length > 0 && (
                                <div className="ep-highlights">
                                    {selected.highlights.filter(Boolean).map((h, i) => (
                                        <span key={i} className="ep-highlight-pill">
                                            <Star size={9} /> {h}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content grid */}
                        <div className="ep-grid">

                            {/* Certificate Types */}
                            <section className="ep-card ep-card--certs">
                                <div className="ep-card-head">
                                    <Award size={14} style={{ color: "var(--cp-accent)" }} />
                                    <span>Certificate Options</span>
                                    <span className="ep-card-count">{selected.certEntries?.length ?? 0} available</span>
                                </div>
                                <div className="ep-cert-tabs">
                                    {(selected.certEntries ?? []).map(entry => {
                                        const isActive  = entry.certType._id === activeCert;
                                        const isDefault = entry.isDefault;
                                        return (
                                            <button key={entry.certType._id}
                                                className={`ep-cert-tab${isActive ? " ep-cert-tab--active" : ""}`}
                                                onClick={() => setActiveCert(entry.certType._id)}>
                                                {entry.certType.name}
                                                {isDefault && <span className="ep-default-dot" title="Default" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {activeCertData && (
                                    <div className="ep-cert-detail">
                                        <div className="ep-cert-issuer">
                                            <BadgeCheck size={13} style={{ color: "var(--cp-accent)", flexShrink: 0 }} />
                                            <div>
                                                <div className="ep-cert-issuer-name">{activeCertData.issuingBody}</div>
                                                {activeCertData.verificationMethod && (
                                                    <div className="ep-cert-verify">✓ {activeCertData.verificationMethod}</div>
                                                )}
                                            </div>
                                        </div>
                                        {activeCertData.benefits && activeCertData.benefits.filter(Boolean).length > 0 && (
                                            <ul className="ep-cert-benefits">
                                                {activeCertData.benefits.filter(Boolean).map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </section>

                            {/* Benefits */}
                            <section className="ep-card ep-card--benefits">
                                <div className="ep-card-head">
                                    <Sparkles size={14} style={{ color: "var(--cp-warning)" }} />
                                    <span>Course Benefits</span>
                                </div>
                                {selected.benefits.filter(Boolean).length > 0 ? (
                                    <ul className="ep-benefits-list">
                                        {selected.benefits.filter(Boolean).map((b, i) => (
                                            <li key={i} className="ep-benefit-item">
                                                <span className="ep-benefit-icon">✓</span>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="ep-empty-note">Benefits add karo Course Config page pe</div>
                                )}
                            </section>

                            {/* Franchise Details */}
                            <section className="ep-card ep-card--franchise">
                                <div className="ep-card-head">
                                    <Shield size={14} style={{ color: fColor }} />
                                    <span>Franchise Details</span>
                                    <span className="ep-franchise-code-badge" style={{ background: fBg, color: fColor }}>
                                        {selected.franchise.code}
                                    </span>
                                </div>
                                <div className="ep-franchise-body">
                                    <div className="ep-franchise-name">{selected.franchise.name}</div>
                                    {selected.franchise.description && (
                                        <div className="ep-franchise-desc">{selected.franchise.description}</div>
                                    )}
                                    {selected.franchise.registeredBodies?.filter(Boolean).length > 0 && (
                                        <div className="ep-regd-section">
                                            <div className="ep-regd-label">Registered With</div>
                                            <div className="ep-regd-pills">
                                                {selected.franchise.registeredBodies.filter(Boolean).map(b => (
                                                    <span key={b} className="ep-regd-pill">{b}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selected.franchise.websiteUrl && (
                                        <a href={selected.franchise.websiteUrl} target="_blank" rel="noopener noreferrer"
                                            className="ep-franchise-link">
                                            🌐 {selected.franchise.websiteUrl}
                                        </a>
                                    )}
                                    {selected.franchise.isOwn && (
                                        <div className="ep-own-badge">
                                            <Zap size={11} /> Shivshakti Computer Academy ka khud ka certificate
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Fee Breakdown */}
                            <section className="ep-card ep-card--fee">
                                <div className="ep-card-head" style={{ cursor: "pointer" }} onClick={() => setExpandFee(f => !f)}>
                                    <IndianRupee size={14} style={{ color: "var(--cp-success)" }} />
                                    <span>Fee Structure</span>
                                    <ChevronDown size={13} style={{ marginLeft: "auto", transform: expandFee ? "rotate(180deg)" : "none", transition: "transform .2s", color: "var(--cp-muted)" }} />
                                </div>
                                {(() => {
                                    const feeTotal  = activeCertEntry?.fee                  ?? getCfgFee(selected);
                                    const regFee    = activeCertEntry?.registrationFee       ?? 0;
                                    const emiOk     = activeCertEntry?.installmentsAllowed   ?? getCfgEmiOk(selected);
                                    const maxEmi    = activeCertEntry?.maxInstallments        ?? getCfgMaxEmi(selected);
                                    const minEmi    = activeCertEntry?.minInstallmentAmount   ?? getCfgMinEmi(selected);
                                    return (
                                        <div className="ep-fee-summary">
                                            <div className="ep-fee-row">
                                                <span>Course Fee</span>
                                                <span className="ep-fee-val">{fmt(feeTotal)}</span>
                                            </div>
                                            {regFee > 0 && (
                                                <div className="ep-fee-row">
                                                    <span>Registration Fee</span>
                                                    <span className="ep-fee-val" style={{ color: "var(--cp-warning)" }}>{fmt(regFee)}</span>
                                                </div>
                                            )}
                                            {regFee > 0 && (
                                                <div className="ep-fee-row" style={{ fontWeight: 700 }}>
                                                    <span>Total Payable</span>
                                                    <span className="ep-fee-val" style={{ color: "var(--cp-accent)" }}>{fmt(feeTotal + regFee)}</span>
                                                </div>
                                            )}
                                            <div className="ep-fee-row">
                                                <span>Installments</span>
                                                <span className="ep-fee-val" style={{ color: emiOk ? "var(--cp-success)" : "var(--cp-muted)" }}>
                                                    {emiOk ? `Allowed (max ${maxEmi})` : "Not allowed"}
                                                </span>
                                            </div>
                                            {emiOk && expandFee && (
                                                <>
                                                    <div className="ep-fee-row ep-fee-row--sub">
                                                        <span>Min. Installment</span>
                                                        <span className="ep-fee-val">{fmt(minEmi)}</span>
                                                    </div>
                                                    <div className="ep-emi-grid">
                                                        {Array.from({ length: maxEmi }, (_, i) => {
                                                            const perEmi = Math.ceil(feeTotal / (i + 1));
                                                            return (
                                                                <div key={i} className="ep-emi-card">
                                                                    <div className="ep-emi-num">{i + 1} installment{i > 0 ? "s" : ""}</div>
                                                                    <div className="ep-emi-amt">{fmt(perEmi)} each</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })()}
                            </section>

                            {/* What you get — summary card */}
                            <section className="ep-card ep-card--summary ep-card--full">
                                <div className="ep-card-head">
                                    <Layers size={14} style={{ color: "var(--cp-accent)" }} />
                                    <span>Is Course Mein Kya Milega</span>
                                </div>
                                <div className="ep-summary-grid">
                                    <div className="ep-summary-item">
                                        <div className="ep-summary-icon" style={{ background: "var(--cp-accent-glow)", color: "var(--cp-accent)" }}>
                                            <GraduationCap size={16} />
                                        </div>
                                        <div className="ep-summary-label">Course</div>
                                        <div className="ep-summary-value">{selected.course.name}</div>
                                        <div className="ep-summary-sub">{selected.course.level}</div>
                                    </div>
                                    <div className="ep-summary-item">
                                        <div className="ep-summary-icon" style={{ background: fBg, color: fColor }}>
                                            <Shield size={16} />
                                        </div>
                                        <div className="ep-summary-label">Franchise</div>
                                        <div className="ep-summary-value">{selected.franchise.name}</div>
                                        <div className="ep-summary-sub">{selected.franchise.code}</div>
                                    </div>
                                    <div className="ep-summary-item">
                                        <div className="ep-summary-icon" style={{ background: "rgba(34,197,94,0.1)", color: "var(--cp-success)" }}>
                                            <Award size={16} />
                                        </div>
                                        <div className="ep-summary-label">Default Certificate</div>
                                        <div className="ep-summary-value">{selected.defaultCertType.name}</div>
                                        <div className="ep-summary-sub">{selected.defaultCertType.issuingBody}</div>
                                    </div>
                                    <div className="ep-summary-item">
                                        <div className="ep-summary-icon" style={{ background: "rgba(245,158,11,0.1)", color: "var(--cp-warning)" }}>
                                            <IndianRupee size={16} />
                                        </div>
                                        <div className="ep-summary-label">Fees</div>
                                        <div className="ep-summary-value">{fmt(activeCertEntry?.fee ?? getCfgFee(selected))}</div>
                                        <div className="ep-summary-sub">
                                            {(activeCertEntry?.registrationFee ?? 0) > 0 && `+${fmt(activeCertEntry?.registrationFee ?? 0)} reg • `}
                                            {(activeCertEntry?.installmentsAllowed ?? getCfgEmiOk(selected))
                                                ? `EMI available`
                                                : "Ek baar payment"}
                                        </div>
                                    </div>
                                    {(selected.certEntries?.length ?? 0) > 1 && (
                                        <div className="ep-summary-item">
                                            <div className="ep-summary-icon" style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>
                                                <BadgeCheck size={16} />
                                            </div>
                                            <div className="ep-summary-label">Cert Options</div>
                                            <div className="ep-summary-value">{selected.certEntries.length} choices</div>
                                            <div className="ep-summary-sub">
                                                {selected.certEntries.map(e => e.certType.code).join(" • ")}
                                            </div>
                                        </div>
                                    )}
                                    {selected.franchise.registeredBodies?.filter(Boolean).length > 0 && (
                                        <div className="ep-summary-item">
                                            <div className="ep-summary-icon" style={{ background: "rgba(20,184,166,0.1)", color: "#14b8a6" }}>
                                                <Users size={16} />
                                            </div>
                                            <div className="ep-summary-label">Recognized By</div>
                                            <div className="ep-summary-value">{selected.franchise.registeredBodies[0]}</div>
                                            <div className="ep-summary-sub">
                                                {selected.franchise.registeredBodies.slice(1).join(" • ") || "& more"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                        </div>
                    </main>
                )}
            </div>
        </>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');

    .ep-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; gap:0; height:82vh; background:var(--cp-bg); border-radius:16px; overflow:hidden; border:1px solid var(--cp-border); }

    /* Sidebar */
    .ep-sidebar { width:260px; flex-shrink:0; background:var(--cp-surface); border-right:1px solid var(--cp-border); padding:20px 14px; display:flex; flex-direction:column; gap:4px; overflow-y:auto; height:100%; position:sticky; top:0; align-self:flex-start; }
    .ep-sidebar-label { display:flex; align-items:center; gap:6px; font-size:9px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--cp-muted); padding:0 6px; margin-bottom:12px; }
    .ep-course-group { margin-bottom:12px; }
    .ep-course-group-name { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); padding:0 8px; margin-bottom:6px; }
    .ep-sidebar-item { display:flex; align-items:center; gap:10px; width:100%; padding:10px 10px; border-radius:10px; border:1px solid transparent; background:transparent; cursor:pointer; text-align:left; transition:all .14s; }
    .ep-sidebar-item:hover { background:var(--cp-accent-glow); border-color:color-mix(in srgb,var(--cp-accent) 20%,transparent); }
    .ep-sidebar-item--active { background:var(--cp-accent-glow); border-color:color-mix(in srgb,var(--cp-accent) 30%,transparent); }
    .ep-sidebar-badge { font-size:9px; font-weight:800; letter-spacing:.06em; padding:3px 8px; border-radius:6px; flex-shrink:0; }
    .ep-sidebar-info { flex:1; min-width:0; }
    .ep-sidebar-fname { font-size:11px; font-weight:700; color:var(--cp-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ep-sidebar-fee { font-size:10px; color:var(--cp-success); font-weight:600; margin-top:1px; }

    /* Main */
    .ep-main { flex:1; overflow-y:auto; padding:28px; display:flex; flex-direction:column; gap:20px; height:100%; }

    /* Hero */
    .ep-hero { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:14px; padding:24px 28px; }
    .ep-hero-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:16px; }
    .ep-hero-course { font-family:'DM Serif Display',serif; font-size:2rem; font-weight:400; color:var(--cp-text); line-height:1.1; margin-bottom:10px; }
    .ep-hero-meta { display:flex; flex-wrap:wrap; align-items:center; gap:7px; }
    .ep-level-badge { font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; background:var(--cp-surface2); }
    .ep-franchise-chip { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:800; padding:3px 10px; border-radius:100px; }
    .ep-reg-chip { font-size:9px; font-weight:700; padding:2px 8px; border-radius:100px; background:var(--cp-bg); color:var(--cp-muted); border:1px solid var(--cp-border); }
    .ep-hero-fee { text-align:right; flex-shrink:0; }
    .ep-fee-big { font-family:'DM Serif Display',serif; font-size:2.2rem; color:var(--cp-success); line-height:1; }
    .ep-fee-emi { font-size:11px; color:var(--cp-muted); margin-top:4px; }
    .ep-highlights { display:flex; flex-wrap:wrap; gap:7px; padding-top:14px; border-top:1px solid var(--cp-border); }
    .ep-highlight-pill { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:600; padding:4px 12px; border-radius:100px; background:rgba(245,158,11,0.08); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.2); }

    /* Grid */
    .ep-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .ep-card--full { grid-column:1/-1; }

    /* Cards */
    .ep-card { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:14px; padding:18px; }
    .ep-card-head { display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-subtext); margin-bottom:14px; }
    .ep-card-count { margin-left:auto; font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px; background:var(--cp-accent-glow); color:var(--cp-accent); border:1px solid color-mix(in srgb,var(--cp-accent) 20%,transparent); }

    /* Cert tabs */
    .ep-cert-tabs { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
    .ep-cert-tab { padding:6px 14px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface2); color:var(--cp-muted); font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; display:flex; align-items:center; gap:6px; }
    .ep-cert-tab:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .ep-cert-tab--active { background:var(--cp-accent-glow); border-color:var(--cp-accent); color:var(--cp-accent); }
    .ep-default-dot { width:6px; height:6px; border-radius:50%; background:var(--cp-accent); flex-shrink:0; }
    .ep-cert-detail { background:var(--cp-bg); border-radius:10px; padding:14px; }
    .ep-cert-issuer { display:flex; gap:8px; margin-bottom:10px; }
    .ep-cert-issuer-name { font-size:13px; font-weight:700; color:var(--cp-text); }
    .ep-cert-verify { font-size:11px; color:var(--cp-success); margin-top:3px; }
    .ep-cert-benefits { margin:0; padding-left:16px; display:flex; flex-direction:column; gap:5px; }
    .ep-cert-benefits li { font-size:12px; color:var(--cp-subtext); }

    /* Benefits */
    .ep-benefits-list { margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; }
    .ep-benefit-item { display:flex; align-items:flex-start; gap:9px; font-size:12px; color:var(--cp-subtext); line-height:1.5; }
    .ep-benefit-icon { width:18px; height:18px; border-radius:50%; background:rgba(34,197,94,0.1); color:var(--cp-success); display:flex; align-items:center; justify-content:center; font-size:9px; flex-shrink:0; margin-top:1px; }

    /* Franchise */
    .ep-franchise-body { display:flex; flex-direction:column; gap:10px; }
    .ep-franchise-code-badge { margin-left:auto; font-size:10px; font-weight:800; padding:2px 9px; border-radius:6px; }
    .ep-franchise-name { font-size:14px; font-weight:700; color:var(--cp-text); }
    .ep-franchise-desc { font-size:12px; color:var(--cp-muted); line-height:1.6; }
    .ep-regd-section { display:flex; flex-direction:column; gap:5px; }
    .ep-regd-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); }
    .ep-regd-pills { display:flex; flex-wrap:wrap; gap:5px; }
    .ep-regd-pill { font-size:10px; font-weight:600; padding:3px 10px; border-radius:100px; background:var(--cp-bg); color:var(--cp-subtext); border:1px solid var(--cp-border); }
    .ep-franchise-link { font-size:11px; color:var(--cp-accent); text-decoration:none; word-break:break-all; }
    .ep-franchise-link:hover { text-decoration:underline; }
    .ep-own-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; padding:6px 12px; border-radius:8px; background:rgba(245,158,11,0.08); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.2); }

    /* Fee */
    .ep-fee-summary { display:flex; flex-direction:column; gap:0; }
    .ep-fee-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--cp-border); font-size:12px; color:var(--cp-subtext); }
    .ep-fee-row:last-child { border-bottom:none; }
    .ep-fee-row--sub { padding-left:12px; background:var(--cp-bg); border-radius:0; font-size:11px; }
    .ep-fee-val { font-weight:700; color:var(--cp-text); }
    .ep-emi-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:8px; margin-top:10px; }
    .ep-emi-card { background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; padding:10px; text-align:center; }
    .ep-emi-num { font-size:10px; color:var(--cp-muted); font-weight:600; margin-bottom:3px; }
    .ep-emi-amt { font-size:13px; font-weight:800; color:var(--cp-success); }

    /* Summary */
    .ep-summary-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:12px; }
    .ep-summary-item { background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:4px; }
    .ep-summary-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:4px; }
    .ep-summary-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--cp-muted); }
    .ep-summary-value { font-size:13px; font-weight:800; color:var(--cp-text); }
    .ep-summary-sub { font-size:10px; color:var(--cp-muted); }

    /* Empty */
    .ep-empty-note { font-size:12px; color:var(--cp-muted); font-style:italic; padding:10px 0; }

    /* Skeleton */
    .ep-sk { background:linear-gradient(90deg,var(--cp-surface) 25%,var(--cp-surface2) 50%,var(--cp-surface) 75%); background-size:200% 100%; animation:epShimmer 1.4s infinite; }
    @keyframes epShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    @media(max-width:900px) {
        .ep-root { flex-direction:column; }
        .ep-sidebar { width:100%; flex-direction:row; flex-wrap:wrap; border-right:none; border-bottom:1px solid var(--cp-border); max-height:160px; overflow-x:auto; }
        .ep-grid { grid-template-columns:1fr; }
    }
    @media(max-width:600px) {
        .ep-main { padding:16px; }
        .ep-hero-top { flex-direction:column; }
        .ep-hero-fee { text-align:left; }
        .ep-summary-grid { grid-template-columns:1fr 1fr; }
    }
`;