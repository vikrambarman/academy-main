"use client";

/**
 * STUDENT CERTIFICATE PAGE — Franchise Aware
 *
 * BACKWARD COMPATIBILITY:
 * - enrollment.franchise = null → legacy mode → falls back to course.authority
 * - enrollment.certType  = null → uses getAuthorityInfo() (existing behavior)
 * - New enrollments → shows full franchise + cert + verification + benefits
 *
 * New features:
 * - Shows which franchise issued the certificate
 * - Registered bodies (MSME, NSDC etc) as badges
 * - Per-franchise verification steps
 * - Benefits list from CourseFranchiseConfig
 */

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Award, ExternalLink, Clock, CheckCircle2,
    Shield, BookOpen, LogIn, Search, AlertCircle,
    GraduationCap, Info, Link2, BadgeCheck
} from "lucide-react";

interface FranchiseData {
    _id: string;
    name: string;
    code: string;
    registeredBodies: string[];
    portalUrl?: string;
    portalLoginRequired: boolean;
    isOwn: boolean;
}
interface CertTypeData {
    _id: string;
    name: string;
    code: string;
    issuingBody: string;
    verificationMethod: string;
    verificationUrl?: string;
    portalVerificationSteps: string[];
    benefits: string[];
}
interface Course {
    name?: string; authority?: string; verification?: string;
    externalPortalUrl?: string; externalLoginRequired?: boolean;
    certificate?: string; duration?: string;
}
interface Enrollment {
    _id: string;
    course: Course;
    certificateStatus: string;
    // New franchise fields (null for old enrollments)
    franchise?: FranchiseData | null;
    certType?: CertTypeData | null;
    externalStudentId?: string | null;
}
interface CertData {
    student: { name: string; studentId: string; };
    enrollments: Enrollment[];
}

/* ─── Legacy fallback (existing behavior preserved) ─── */
function getLegacyAuthorityInfo(authority?: string) {
    const a = authority?.toLowerCase() ?? "";
    if (a.includes("drishti")) return {
        name: "Drishti Computer Education", shortName: "DCE",
        color: "var(--sp-accent)", bg: "var(--sp-active-bg)",
        portalUrl: "https://drishticomputer.com",
        steps: ["Visit drishticce.com", "Enter your certificate number", "Download verified certificate"],
        verificationUrl: "https://drishticomputer.com",
    };
    if (a.includes("gsdm") || a.includes("gramin")) return {
        name: "Gramin Skill Development Mission", shortName: "GSDM",
        color: "var(--sp-success)", bg: "rgba(34,197,94,0.08)",
        portalUrl: "https://graminskill.in",
        steps: ["Visit graminskill.in", "Login with credentials", "Download certificate"],
        verificationUrl: "https://graminskill.in",
    };
    return {
        name: authority ?? "Issuing Authority", shortName: "CERT",
        color: "var(--sp-subtext)", bg: "var(--sp-hover)",
        portalUrl: "", steps: ["Contact academy for verification"], verificationUrl: "",
    };
}

function CertStatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    if (s === "certificate generated") return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(34,197,94,0.12)", color: "var(--sp-success)", border: "1px solid rgba(34,197,94,0.25)", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 100 }}>
            <CheckCircle2 size={12} /> Issued
        </span>
    );
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(245,158,11,0.12)", color: "var(--sp-warn)", border: "1px solid rgba(245,158,11,0.25)", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 100 }}>
            <Clock size={12} /> {status}
        </span>
    );
}

/* ─── NEW: Franchise Certificate Card ─── */
function FranchiseCertCard({ enrollment }: { enrollment: Enrollment }) {
    const franchise = enrollment.franchise!;
    const certType  = enrollment.certType!;
    const issued = enrollment.certificateStatus === "Certificate Generated";

    return (
        <div className="sc-cert-card">
            {/* Authority band */}
            <div className="sc-cert-band" style={{ background: franchise.isOwn ? "rgba(245,158,11,0.06)" : "var(--sp-active-bg)" }}>
                <div className="sc-cert-band-left">
                    <div className="sc-auth-icon" style={{
                        background: franchise.isOwn ? "var(--sp-warn)" : "var(--sp-accent)",
                        color: "#fff", fontFamily: "monospace", fontSize: 11, fontWeight: 800,
                    }}>
                        {franchise.code.slice(0, 4)}
                    </div>
                    <div>
                        <div className="sc-cert-band-title">{enrollment.course?.name}</div>
                        <div className="sc-cert-band-auth">{franchise.name}</div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <CertStatusBadge status={enrollment.certificateStatus} />
                </div>
            </div>

            <div className="sc-cert-body">
                {/* Pending notice */}
                {!issued && (
                    <div className="sc-pending-notice">
                        <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                            <strong>Certificate not yet issued.</strong> Yeh certificate {certType.issuingBody} ke dwara issue hoga jab course complete aur verify ho jaayega.
                        </div>
                    </div>
                )}

                {/* Franchise registered bodies */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {franchise.registeredBodies.map(body => (
                        <span key={body} style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 100,
                            background: "rgba(34,197,94,0.1)", color: "var(--sp-success)",
                            border: "1px solid rgba(34,197,94,0.2)",
                        }}>
                            <BadgeCheck size={9} /> {body}
                        </span>
                    ))}
                    {franchise.isOwn && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: "rgba(245,158,11,0.1)", color: "var(--sp-warn)", border: "1px solid rgba(245,158,11,0.2)" }}>
                            Institute Certificate
                        </span>
                    )}
                </div>

                {/* Info grid */}
                <div className="sc-info-grid" style={{ marginBottom: 16 }}>
                    <div className="sc-info-cell">
                        <div className="sc-info-cell-label">Certificate Name</div>
                        <div className="sc-info-cell-val">{certType.name}</div>
                    </div>
                    <div className="sc-info-cell">
                        <div className="sc-info-cell-label">Issuing Body</div>
                        <div className="sc-info-cell-val">{certType.issuingBody}</div>
                    </div>
                    <div className="sc-info-cell">
                        <div className="sc-info-cell-label">Verification Method</div>
                        <div className="sc-info-cell-val">{certType.verificationMethod || "Contact academy"}</div>
                    </div>
                    {enrollment.externalStudentId && (
                        <div className="sc-info-cell">
                            <div className="sc-info-cell-label">{franchise.name} Student ID</div>
                            <div className="sc-info-cell-val" style={{ fontFamily: "monospace", fontSize: 12 }}>
                                {enrollment.externalStudentId}
                            </div>
                        </div>
                    )}
                </div>

                {/* Benefits */}
                {certType.benefits.length > 0 && (
                    <>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sp-muted)", marginBottom: 8 }}>
                            Certificate Benefits
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                            {certType.benefits.map((b, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "var(--sp-subtext)" }}>
                                    <CheckCircle2 size={13} style={{ color: "var(--sp-success)", flexShrink: 0, marginTop: 1 }} />
                                    {b}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Verification steps */}
                {issued && certType.portalVerificationSteps.length > 0 && (
                    <>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sp-muted)", marginBottom: 10 }}>
                            Certificate kaise verify karein
                        </div>
                        <div className="sc-steps" style={{ marginBottom: 16 }}>
                            {certType.portalVerificationSteps.map((step, i) => (
                                <div key={i} className="sc-step">
                                    <div className="sc-step-num" style={{ background: "var(--sp-active-bg)", color: "var(--sp-accent)", border: "1px solid var(--sp-border2)" }}>
                                        {i + 1}
                                    </div>
                                    {step}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Action buttons */}
                <div className="sc-actions">
                    {issued && certType.verificationUrl && (
                        <a href={certType.verificationUrl} target="_blank" rel="noopener noreferrer" className="sc-btn-primary">
                            <Search size={13} /> Verify Certificate <ExternalLink size={11} />
                        </a>
                    )}
                    {franchise.portalLoginRequired && franchise.portalUrl && (
                        <a href={franchise.portalUrl} target="_blank" rel="noopener noreferrer" className="sc-btn-secondary">
                            <LogIn size={13} /> {franchise.name} Portal <ExternalLink size={11} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── LEGACY Card (old enrollments without franchise) ─── */
function LegacyCertCard({ enrollment }: { enrollment: Enrollment }) {
    const auth   = getLegacyAuthorityInfo(enrollment.course?.authority);
    const issued = enrollment.certificateStatus === "Certificate Generated";

    return (
        <div className="sc-cert-card">
            <div className="sc-cert-band" style={{ background: "var(--sp-active-bg)" }}>
                <div className="sc-cert-band-left">
                    <div className="sc-auth-icon" style={{ background: auth.color, color: "#fff", fontFamily: "monospace", fontSize: 11, fontWeight: 800 }}>
                        {auth.shortName}
                    </div>
                    <div>
                        <div className="sc-cert-band-title">{enrollment.course?.name}</div>
                        <div className="sc-cert-band-auth">{auth.name}</div>
                    </div>
                </div>
                <CertStatusBadge status={enrollment.certificateStatus} />
            </div>
            <div className="sc-cert-body">
                {!issued && (
                    <div className="sc-pending-notice">
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        <div>Certificate abhi issue nahi hua hai. Academy se contact karein status ke liye.</div>
                    </div>
                )}
                {issued && (
                    <>
                        <div className="sc-steps" style={{ marginBottom: 16 }}>
                            {auth.steps.map((step, i) => (
                                <div key={i} className="sc-step">
                                    <div className="sc-step-num" style={{ background: "var(--sp-active-bg)", color: "var(--sp-accent)" }}>{i + 1}</div>
                                    {step}
                                </div>
                            ))}
                        </div>
                        <div className="sc-actions">
                            {auth.verificationUrl && (
                                <a href={auth.verificationUrl} target="_blank" rel="noopener noreferrer" className="sc-btn-primary">
                                    <Search size={13} /> Verify <ExternalLink size={11} />
                                </a>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ─── MAIN COMPONENT ─── */
export default function StudentCertificates() {
    const [data, setData]       = useState<CertData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithAuth("/api/student/profile")
            .then(r => r.json())
            .then(setData)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, border: "3px solid var(--sp-border)", borderTopColor: "var(--sp-accent)", borderRadius: "50%", animation: "spSpin 0.7s linear infinite" }} />
            <style>{`@keyframes spSpin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 13, color: "var(--sp-muted)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading certificates…</span>
        </div>
    );

    if (!data) return (
        <div style={{ textAlign: "center", padding: "48px 0", fontSize: 13, color: "var(--sp-danger)" }}>
            Failed to load. Please refresh.
        </div>
    );

    const { enrollments } = data;
    const issuedCount  = enrollments.filter(e => e.certificateStatus === "Certificate Generated").length;
    const pendingCount = enrollments.length - issuedCount;

    return (
        <>
            <style>{certStyles}</style>
            <div className="sc-root">
                <div className="sc-page-title">
                    <GraduationCap size={22} style={{ color: "var(--sp-accent)" }} /> My Certificates
                </div>
                <div className="sc-page-sub">
                    Aapke sab courses ke certificates — franchise aur verification details ke saath.
                </div>

                {/* Summary */}
                <div className="sc-summary">
                    <div className="sc-stat blue">
                        <div className="sc-stat-icon blue"><BookOpen size={15} /></div>
                        <div className="sc-stat-label">Total Courses</div>
                        <div className="sc-stat-val">{enrollments.length}</div>
                    </div>
                    <div className="sc-stat green">
                        <div className="sc-stat-icon green"><CheckCircle2 size={15} /></div>
                        <div className="sc-stat-label">Issued</div>
                        <div className="sc-stat-val green">{issuedCount}</div>
                    </div>
                    <div className="sc-stat amber">
                        <div className="sc-stat-icon amber"><Clock size={15} /></div>
                        <div className="sc-stat-label">Pending</div>
                        <div className="sc-stat-val amber">{pendingCount}</div>
                    </div>
                </div>

                <div className="sc-section-label"><Award size={13} /> Course Certificates</div>

                {enrollments.length === 0 ? (
                    <div className="sc-empty">
                        <div className="sc-empty-icon"><GraduationCap size={22} /></div>
                        <div className="sc-empty-title">No enrollments found</div>
                        <div className="sc-empty-sub">Certificates yahan dikhenge jab aap enroll honge.</div>
                    </div>
                ) : enrollments.map(e => (
                    /* KEY DECISION: franchise data hai → FranchiseCertCard
                       franchise null → LegacyCertCard (old behavior preserved) */
                    e.franchise && e.certType
                        ? <FranchiseCertCard key={e._id} enrollment={e} />
                        : <LegacyCertCard    key={e._id} enrollment={e} />
                ))}
            </div>
        </>
    );
}

const certStyles = `
    .sc-root * { box-sizing:border-box; }
    .sc-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--sp-text); }
    .sc-page-title { font-family:'DM Serif Display',serif; font-size:1.4rem; color:var(--sp-text); display:flex; align-items:center; gap:10px; margin-bottom:4px; }
    .sc-page-sub   { font-size:13px; color:var(--sp-muted); font-weight:300; margin-bottom:22px; }
    .sc-summary { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:22px; }
    .sc-stat { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:14px; padding:16px 18px; position:relative; overflow:hidden; }
    .sc-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:14px 14px 0 0; }
    .sc-stat.blue::before  { background:linear-gradient(90deg,var(--sp-accent),var(--sp-accent2)); }
    .sc-stat.green::before { background:linear-gradient(90deg,#059669,#34d399); }
    .sc-stat.amber::before { background:linear-gradient(90deg,#d97706,#fbbf24); }
    .sc-stat-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
    .sc-stat-icon.blue  { background:var(--sp-active-bg);  color:var(--sp-accent2); }
    .sc-stat-icon.green { background:rgba(34,197,94,0.12); color:var(--sp-success); }
    .sc-stat-icon.amber { background:rgba(245,158,11,0.12);color:var(--sp-warn);    }
    .sc-stat-label { font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--sp-muted); margin-bottom:5px; }
    .sc-stat-val   { font-family:'DM Serif Display',serif; font-size:1.35rem; color:var(--sp-text); }
    .sc-stat-val.green { color:var(--sp-success); }
    .sc-stat-val.amber { color:var(--sp-warn); }
    .sc-section-label { font-size:12px; font-weight:700; color:var(--sp-muted); letter-spacing:0.08em; text-transform:uppercase; display:flex; align-items:center; gap:8px; margin-bottom:14px; }
    .sc-section-label::after { content:''; flex:1; height:1px; background:var(--sp-border); }
    .sc-cert-card { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:16px; overflow:hidden; margin-bottom:14px; transition:box-shadow 0.18s; }
    .sc-cert-card:hover { box-shadow:0 4px 24px rgba(26,86,219,0.12); }
    .sc-cert-band { padding:14px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; border-bottom:1px solid var(--sp-border); }
    .sc-cert-band-left { display:flex; align-items:center; gap:12px; }
    .sc-auth-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sc-cert-band-title { font-size:15px; font-weight:700; color:var(--sp-text); margin-bottom:2px; }
    .sc-cert-band-auth  { font-size:11px; color:var(--sp-muted); }
    .sc-cert-body { padding:20px; }
    .sc-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    @media(max-width:560px){ .sc-info-grid { grid-template-columns:1fr; } }
    .sc-info-cell { background:var(--sp-hover); border:1px solid var(--sp-border); border-radius:10px; padding:12px 14px; }
    .sc-info-cell-label { font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--sp-muted); margin-bottom:4px; }
    .sc-info-cell-val   { font-size:13px; font-weight:600; color:var(--sp-text); }
    .sc-pending-notice { display:flex; gap:10px; align-items:flex-start; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); border-radius:12px; padding:14px; margin-bottom:16px; font-size:12px; color:var(--sp-warn); line-height:1.65; }
    .sc-steps { display:flex; flex-direction:column; gap:8px; }
    .sc-step  { display:flex; align-items:flex-start; gap:10px; font-size:12px; color:var(--sp-subtext); line-height:1.55; }
    .sc-step-num { width:20px; height:20px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; margin-top:1px; }
    .sc-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:16px; }
    .sc-btn-primary   { display:inline-flex; align-items:center; gap:7px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; color:#fff; background:var(--sp-accent); border:none; border-radius:9px; padding:10px 18px; cursor:pointer; text-decoration:none; transition:opacity 0.15s; }
    .sc-btn-primary:hover { opacity:0.88; }
    .sc-btn-secondary { display:inline-flex; align-items:center; gap:7px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; color:var(--sp-subtext); background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:9px; padding:10px 18px; cursor:pointer; text-decoration:none; transition:background 0.15s; }
    .sc-btn-secondary:hover { background:var(--sp-hover); }
    .sc-empty { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:14px; padding:48px 24px; text-align:center; }
    .sc-empty-icon  { width:48px; height:48px; background:var(--sp-hover); border-radius:13px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--sp-accent); }
    .sc-empty-title { font-size:14px; font-weight:700; color:var(--sp-text); margin-bottom:5px; }
    .sc-empty-sub   { font-size:12px; color:var(--sp-muted); }
`;