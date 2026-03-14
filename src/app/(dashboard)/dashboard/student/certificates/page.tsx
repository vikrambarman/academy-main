"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Award, ExternalLink, Clock, CheckCircle2,
    Shield, BookOpen, LogIn, Search, AlertCircle,
    GraduationCap, Info
} from "lucide-react";

interface Course {
    name?: string; authority?: string; verification?: string;
    externalPortalUrl?: string; externalLoginRequired?: boolean;
    certificate?: string; duration?: string;
}
interface Enrollment { _id: string; course: Course; certificateStatus: string; }
interface CertData   { student: { name: string; studentId: string; }; enrollments: Enrollment[]; }

interface AuthorityInfo {
    name: string; shortName: string;
    color: string; bg: string; border: string;
    portalLabel: string; portalUrl: string;
    helpText: string; steps: string[];
}

function getAuthorityInfo(authority?: string): AuthorityInfo {
    const a = authority?.toLowerCase() ?? "";

    if (a.includes("drishti") || a.includes("dce")) return {
        name: "Drishti Computer Education", shortName: "DCE",
        color: "var(--sp-accent)", bg: "var(--sp-active-bg)", border: "var(--sp-border2)",
        portalLabel: "Drishti Portal", portalUrl: "https://drishticce.com",
        helpText: "Certificate issued under Drishti Computer Education authority. Verify online via Drishti portal.",
        steps: ["Visit the Drishti verification portal", "Enter your certificate number or student ID", "Download or print your verified certificate"],
    };
    if (a.includes("gsdm") || a.includes("gramin") || a.includes("gsm")) return {
        name: "Gramin Skill Development Mission", shortName: "GSDM",
        color: "var(--sp-success)", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)",
        portalLabel: "GSDM Portal", portalUrl: "https://graminskill.in",
        helpText: "Certificate issued under GSDM — Gramin Skill Development Mission. Verify via the GSDM portal.",
        steps: ["Visit graminskill.in portal", "Login with your registered credentials", "Navigate to Certificate section and download"],
    };
    if (a.includes("nsdc") || a.includes("skill india") || a.includes("pmkvy")) return {
        name: "NSDC / Skill India", shortName: "NSDC",
        color: "var(--sp-warn)", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
        portalLabel: "Skill India Portal", portalUrl: "https://nsdcindia.org",
        helpText: "Certificate issued under NSDC / Skill India framework. Verify via the official Skill India portal.",
        steps: ["Visit nsdcindia.org or skillindiadigital.gov.in", "Login with your registered mobile number", "Find your certificate under 'My Certificates'"],
    };
    if (a.includes("digilocker") || a.includes("msu") || a.includes("diploma")) return {
        name: "DigiLocker / University", shortName: "DIGI",
        color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)",
        portalLabel: "DigiLocker", portalUrl: "https://digilocker.gov.in",
        helpText: "Certificate issued via DigiLocker — India's official digital document wallet.",
        steps: ["Login to digilocker.gov.in with Aadhaar", "Go to 'Issued Documents' section", "Find and download your certificate"],
    };
    return {
        name: authority ?? "Issuing Authority", shortName: "CERT",
        color: "var(--sp-subtext)", bg: "var(--sp-hover)", border: "var(--sp-border)",
        portalLabel: "Verify Certificate", portalUrl: "",
        helpText: "Certificate issued by the academy. Contact administration for verification details.",
        steps: ["Contact Shivshakti Computer Academy", "Provide your student ID and course name", "Academy will verify and confirm your certificate"],
    };
}

function CertStatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    if (s === "issued") return (
        <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(34,197,94,0.12)", color:"var(--sp-success)", border:"1px solid rgba(34,197,94,0.25)", fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:100 }}>
            <CheckCircle2 size={12}/> Issued
        </span>
    );
    if (s === "processing") return (
        <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"var(--sp-active-bg)", color:"var(--sp-active-fg)", border:"1px solid var(--sp-border2)", fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:100 }}>
            <Clock size={12}/> Processing
        </span>
    );
    return (
        <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(245,158,11,0.12)", color:"var(--sp-warn)", border:"1px solid rgba(245,158,11,0.25)", fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:100 }}>
            <Clock size={12}/> Pending
        </span>
    );
}

export default function StudentCertificates() {
    const [data,    setData]    = useState<CertData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithAuth("/api/student/profile")
            .then(r => r.json())
            .then(setData)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ padding:"48px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div style={{ width:36, height:36, border:"3px solid var(--sp-border)", borderTopColor:"var(--sp-accent)", borderRadius:"50%", animation:"spSpin 0.7s linear infinite" }}/>
            <style>{`@keyframes spSpin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize:13, color:"var(--sp-muted)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Loading certificates…</span>
        </div>
    );

    if (!data) return (
        <div style={{ textAlign:"center", padding:"48px 0", fontSize:13, color:"var(--sp-danger)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            Failed to load certificate data. Please refresh.
        </div>
    );

    const { enrollments } = data;
    const issuedCount  = enrollments.filter(e => e.certificateStatus?.toLowerCase() === "issued").length;
    const pendingCount = enrollments.length - issuedCount;

    return (
        <>
            <style>{`
                .sc-root * { box-sizing:border-box; }
                .sc-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--sp-text); }

                .sc-page-title { font-family:'DM Serif Display',serif; font-size:1.4rem; color:var(--sp-text); display:flex; align-items:center; gap:10px; margin-bottom:4px; }
                .sc-page-sub   { font-size:13px; color:var(--sp-muted); font-weight:300; margin-bottom:22px; }

                /* Summary */
                .sc-summary { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:22px; }
                .sc-stat     { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:14px; padding:16px 18px; position:relative; overflow:hidden; }
                .sc-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:14px 14px 0 0; }
                .sc-stat.blue::before  { background:linear-gradient(90deg,var(--sp-accent),var(--sp-accent2)); }
                .sc-stat.green::before { background:linear-gradient(90deg,#059669,#34d399); }
                .sc-stat.amber::before { background:linear-gradient(90deg,#d97706,#fbbf24); }
                .sc-stat-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
                .sc-stat-icon.blue  { background:var(--sp-active-bg);        color:var(--sp-accent2); }
                .sc-stat-icon.green { background:rgba(34,197,94,0.12);        color:var(--sp-success); }
                .sc-stat-icon.amber { background:rgba(245,158,11,0.12);       color:var(--sp-warn);    }
                .sc-stat-label { font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--sp-muted); margin-bottom:5px; }
                .sc-stat-val   { font-family:'DM Serif Display',serif; font-size:1.35rem; color:var(--sp-text); }
                .sc-stat-val.green { color:var(--sp-success); }
                .sc-stat-val.amber { color:var(--sp-warn);    }

                /* Section label */
                .sc-section-label { font-size:12px; font-weight:700; color:var(--sp-muted); letter-spacing:0.08em; text-transform:uppercase; display:flex; align-items:center; gap:8px; margin-bottom:14px; }
                .sc-section-label::after { content:''; flex:1; height:1px; background:var(--sp-border); }

                /* Certificate card */
                .sc-cert-card { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:16px; overflow:hidden; margin-bottom:14px; transition:box-shadow 0.18s; }
                .sc-cert-card:hover { box-shadow:0 4px 24px rgba(26,86,219,0.12); }

                .sc-cert-band { padding:14px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; border-bottom:1px solid var(--sp-border); }
                .sc-cert-band-left { display:flex; align-items:center; gap:12px; }

                .sc-auth-pill { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; padding:5px 12px; border-radius:100px; }
                .sc-auth-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:'DM Serif Display',serif; font-size:11px; font-weight:700; flex-shrink:0; }

                .sc-cert-band-title { font-size:15px; font-weight:700; color:var(--sp-text); margin-bottom:2px; }
                .sc-cert-band-auth  { font-size:11px; color:var(--sp-muted); }

                .sc-cert-body { padding:20px; }

                /* Info grid */
                .sc-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px; }
                .sc-info-cell { background:var(--sp-hover); border:1px solid var(--sp-border); border-radius:10px; padding:12px 14px; }
                .sc-info-cell-label { font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--sp-muted); margin-bottom:4px; }
                .sc-info-cell-val   { font-size:13px; font-weight:600; color:var(--sp-text); }

                /* Help note */
                .sc-help-note { display:flex; gap:9px; align-items:flex-start; background:var(--sp-hover); border:1px solid var(--sp-border); border-radius:10px; padding:12px 14px; margin-bottom:18px; font-size:12px; font-weight:300; color:var(--sp-subtext); line-height:1.65; }

                /* Steps */
                .sc-steps { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
                .sc-step  { display:flex; align-items:flex-start; gap:10px; font-size:12px; font-weight:400; color:var(--sp-subtext); line-height:1.55; }
                .sc-step-num { width:20px; height:20px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; margin-top:1px; }

                /* Buttons */
                .sc-actions { display:flex; gap:8px; flex-wrap:wrap; }
                .sc-btn-primary   { display:inline-flex; align-items:center; gap:7px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; color:#fff; background:var(--sp-accent); border:none; border-radius:9px; padding:10px 18px; cursor:pointer; text-decoration:none; transition:opacity 0.15s,transform 0.15s; white-space:nowrap; }
                .sc-btn-primary:hover { opacity:0.88; transform:translateY(-1px); }
                .sc-btn-secondary { display:inline-flex; align-items:center; gap:7px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; color:var(--sp-subtext); background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:9px; padding:10px 18px; cursor:pointer; text-decoration:none; transition:background 0.15s,border-color 0.15s; white-space:nowrap; }
                .sc-btn-secondary:hover { background:var(--sp-hover); border-color:var(--sp-border2); color:var(--sp-accent); }

                /* Certificate preview */
                .sc-cert-preview { margin-bottom:16px; border:1px solid var(--sp-border); border-radius:10px; overflow:hidden; position:relative; background:var(--sp-hover); }
                .sc-cert-preview img { width:100%; display:block; }
                .sc-cert-preview-label { position:absolute; top:8px; left:8px; font-size:9px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--sp-surface); color:var(--sp-muted); padding:3px 8px; border-radius:6px; border:1px solid var(--sp-border); }

                /* Pending notice */
                .sc-pending-notice { display:flex; gap:12px; align-items:flex-start; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); border-radius:12px; padding:16px; margin-bottom:18px; font-size:13px; color:var(--sp-warn); line-height:1.65; }

                /* Empty */
                .sc-empty       { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:14px; padding:48px 24px; text-align:center; }
                .sc-empty-icon  { width:48px; height:48px; background:var(--sp-hover); border-radius:13px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--sp-accent); }
                .sc-empty-title { font-size:14px; font-weight:700; color:var(--sp-text); margin-bottom:5px; }
                .sc-empty-sub   { font-size:12px; font-weight:300; color:var(--sp-muted); }

                @media(max-width:640px) {
                    .sc-summary { grid-template-columns:1fr 1fr; }
                    .sc-info-grid { grid-template-columns:1fr; }
                    .sc-summary > :last-child { grid-column:span 2; }
                }
            `}</style>

            <div className="sc-root">

                <div className="sc-page-title"><GraduationCap size={22} style={{ color:"var(--sp-accent)" }}/> My Certificates</div>
                <div className="sc-page-sub">Track your certificates across all enrolled courses and authorities.</div>

                {/* Summary */}
                <div className="sc-summary">
                    <div className="sc-stat blue">
                        <div className="sc-stat-icon blue"><BookOpen size={15}/></div>
                        <div className="sc-stat-label">Total Courses</div>
                        <div className="sc-stat-val">{enrollments.length}</div>
                    </div>
                    <div className="sc-stat green">
                        <div className="sc-stat-icon green"><CheckCircle2 size={15}/></div>
                        <div className="sc-stat-label">Issued</div>
                        <div className="sc-stat-val green">{issuedCount}</div>
                    </div>
                    <div className="sc-stat amber">
                        <div className="sc-stat-icon amber"><Clock size={15}/></div>
                        <div className="sc-stat-label">Pending</div>
                        <div className="sc-stat-val amber">{pendingCount}</div>
                    </div>
                </div>

                <div className="sc-section-label"><Award size={13}/> Course Certificates</div>

                {enrollments.length === 0 ? (
                    <div className="sc-empty">
                        <div className="sc-empty-icon"><GraduationCap size={22}/></div>
                        <div className="sc-empty-title">No enrollments found</div>
                        <div className="sc-empty-sub">Your certificates will appear here once you are enrolled in a course.</div>
                    </div>
                ) : enrollments.map(e => {
                    const auth   = getAuthorityInfo(e.course?.authority);
                    const issued = e.certificateStatus?.toLowerCase() === "issued";

                    return (
                        <div key={e._id} className="sc-cert-card">

                            {/* Authority band */}
                            <div className="sc-cert-band" style={{ background: auth.bg }}>
                                <div className="sc-cert-band-left">
                                    <div className="sc-auth-icon" style={{ background:auth.color, color:"#fff" }}>
                                        {auth.shortName.slice(0, 3)}
                                    </div>
                                    <div>
                                        <div className="sc-cert-band-title">{e.course?.name ?? "Course"}</div>
                                        <div className="sc-cert-band-auth">{auth.name}</div>
                                    </div>
                                </div>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    <span className="sc-auth-pill" style={{ background:auth.bg, color:auth.color, border:`1px solid ${auth.border}` }}>
                                        <Shield size={10}/> {auth.shortName}
                                    </span>
                                    <CertStatusBadge status={e.certificateStatus}/>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="sc-cert-body">

                                {!issued && (
                                    <div className="sc-pending-notice">
                                        <AlertCircle size={16} style={{ flexShrink:0, marginTop:1 }}/>
                                        <div>
                                            <strong>Certificate not yet issued.</strong> Your certificate will be available once the course is completed and verified by {auth.name}. Contact the academy for status updates.
                                        </div>
                                    </div>
                                )}

                                {issued && e.course?.certificate && (
                                    <div className="sc-cert-preview">
                                        <img src={e.course.certificate} alt="Certificate"/>
                                        <span className="sc-cert-preview-label">Certificate Preview</span>
                                    </div>
                                )}

                                <div className="sc-info-grid">
                                    <div className="sc-info-cell"><div className="sc-info-cell-label">Issuing Authority</div><div className="sc-info-cell-val">{auth.name}</div></div>
                                    <div className="sc-info-cell"><div className="sc-info-cell-label">Certificate Status</div><div className="sc-info-cell-val">{e.certificateStatus}</div></div>
                                    {e.course?.duration && (
                                        <div className="sc-info-cell"><div className="sc-info-cell-label">Course Duration</div><div className="sc-info-cell-val">{e.course.duration}</div></div>
                                    )}
                                    <div className="sc-info-cell"><div className="sc-info-cell-label">Portal Login Required</div><div className="sc-info-cell-val">{e.course?.externalLoginRequired ? "Yes" : "No"}</div></div>
                                </div>

                                <div className="sc-help-note">
                                    <Info size={14} style={{ flexShrink:0, marginTop:1, color:auth.color }}/>
                                    {auth.helpText}
                                </div>

                                {issued && (
                                    <>
                                        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--sp-muted)", marginBottom:10 }}>
                                            How to verify
                                        </div>
                                        <div className="sc-steps">
                                            {auth.steps.map((step, i) => (
                                                <div key={i} className="sc-step">
                                                    <div className="sc-step-num" style={{ background:auth.bg, color:auth.color, border:`1px solid ${auth.border}` }}>{i + 1}</div>
                                                    {step}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="sc-actions">
                                    {issued && e.course?.verification && (
                                        <a href={e.course.verification} target="_blank" rel="noopener noreferrer" className="sc-btn-primary">
                                            <Search size={13}/> Verify Certificate <ExternalLink size={11}/>
                                        </a>
                                    )}
                                    {issued && e.course?.externalLoginRequired && e.course?.externalPortalUrl && (
                                        <a href={e.course.externalPortalUrl} target="_blank" rel="noopener noreferrer" className="sc-btn-secondary">
                                            <LogIn size={13}/> {auth.portalLabel} <ExternalLink size={11}/>
                                        </a>
                                    )}
                                    {issued && !e.course?.verification && !e.course?.externalPortalUrl && auth.portalUrl && (
                                        <a href={auth.portalUrl} target="_blank" rel="noopener noreferrer" className="sc-btn-secondary">
                                            <ExternalLink size={13}/> {auth.portalLabel}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}