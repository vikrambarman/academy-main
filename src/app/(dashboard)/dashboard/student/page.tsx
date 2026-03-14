"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";
import {
    BookOpen, IndianRupee, Award, TrendingUp,
    AlertCircle, CheckCircle2, Clock, ExternalLink,
    Receipt, GraduationCap, ChevronDown, ChevronUp
} from "lucide-react";

interface Payment { amount: number; date: string; receiptNo: string; remark?: string; }
interface Course { _id: string; name: string; authority?: string; verification?: string; }
interface Enrollment {
    _id: string; feesTotal: number; feesPaid: number;
    certificateStatus: string; payments: Payment[]; course: Course;
}
interface DashboardData {
    student: {
        name: string; studentId: string; email?: string;
        phone?: string; profileImage?: string;
        courseStatus: "active" | "completed" | "dropped";
    };
    enrollments: Enrollment[];
}

function Avatar({ name, src, size = 56 }: { name?: string; src?: string; size?: number }) {
    return (
        <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
            {src
                ? <img src={`${src}?t=${Date.now()}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={name} />
                : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--sp-accent), var(--sp-accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {name?.charAt(0)?.toUpperCase() ?? "S"}
                </div>
            }
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { bg: string; color: string; dot: string; label: string }> = {
        active: { bg: "rgba(26,86,219,0.12)", color: "var(--sp-accent2)", dot: "var(--sp-accent)", label: "Active" },
        completed: { bg: "rgba(34,197,94,0.12)", color: "#4ADE80", dot: "#22C55E", label: "Completed" },
        dropped: { bg: "rgba(245,158,11,0.12)", color: "#FCD34D", dot: "#F59E0B", label: "Discontinued" },
    };
    const s = map[status] ?? map.active;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 100 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
            {s.label}
        </span>
    );
}

function CertBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    if (s === "issued") return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(34,197,94,0.12)", color: "#4ADE80", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 100 }}><CheckCircle2 size={12} /> Issued</span>;
    if (s === "pending") return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(245,158,11,0.12)", color: "#FCD34D", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 100 }}><Clock size={12} /> Pending</span>;
    return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(100,116,139,0.12)", color: "#94A3B8", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 100 }}><Award size={12} /> {status}</span>;
}

export default function StudentDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [accountDisabled, setAccountDisabled] = useState(false);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchWithAuth("/api/student/profile")
            .then(async res => {
                if (res.status === 403) { setAccountDisabled(true); return; }
                setData(await res.json());
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const toggleCard = (id: string) => setExpandedCards(p => ({ ...p, [id]: !p[id] }));

    if (loading) return (
        <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, border: "3px solid var(--sp-border)", borderTopColor: "var(--sp-accent)", borderRadius: "50%", animation: "spSpin 0.7s linear infinite" }} />
            <style>{`@keyframes spSpin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ fontSize: 13, color: "var(--sp-muted)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading your dashboard…</span>
        </div>
    );

    if (accountDisabled) return (
        <div style={{ maxWidth: 480, margin: "48px auto", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "32px 28px", textAlign: "center" }}>
                <AlertCircle size={32} style={{ color: "var(--sp-danger)", margin: "0 auto 12px" }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--sp-danger)", marginBottom: 8 }}>Account Deactivated</div>
                <div style={{ fontSize: 13, fontWeight: 300, color: "var(--sp-subtext)", lineHeight: 1.7 }}>Your account has been deactivated by the academy. Please contact administration for assistance.</div>
            </div>
        </div>
    );

    if (!data) return (
        <div style={{ textAlign: "center", padding: "48px 0", fontSize: 13, color: "var(--sp-danger)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Failed to load dashboard. Please refresh.
        </div>
    );

    const { student, enrollments } = data;
    const totalFees = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
    const totalPaid = enrollments.reduce((s, e) => s + (e.feesPaid ?? 0), 0);
    const totalDue = totalFees - totalPaid;
    const overallProgress = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                .sd-root { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--sp-text); }

                /* Welcome card */
                .sd-welcome {
                    background: linear-gradient(135deg, var(--sp-accent) 0%, var(--sp-accent2) 100%);
                    border-radius: 18px; padding: 28px;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 20px; flex-wrap: wrap;
                    margin-bottom: 22px; position: relative; overflow: hidden;
                }
                .sd-welcome::before {
                    content: ''; position: absolute; right: -40px; top: -40px;
                    width: 200px; height: 200px;
                    background: rgba(255,255,255,0.06); border-radius: 50%;
                }
                .sd-welcome::after {
                    content: ''; position: absolute; right: 60px; bottom: -60px;
                    width: 160px; height: 160px;
                    background: rgba(255,255,255,0.04); border-radius: 50%;
                }
                .sd-welcome-left { display: flex; align-items: center; gap: 16px; z-index: 1; }
                .sd-welcome-greeting { font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.55); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
                .sd-welcome-name { font-family: 'DM Serif Display', serif; font-size: clamp(1.2rem, 2.5vw, 1.55rem); color: #fff; line-height: 1.2; margin-bottom: 8px; }
                .sd-welcome-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
                .sd-welcome-id { font-size: 11px; color: rgba(255,255,255,0.5); }
                .sd-welcome-right { z-index: 1; text-align: right; }
                .sd-welcome-stat-label { font-size: 10px; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
                .sd-welcome-stat-val { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: #fff; }

                /* Banners */
                .sd-banner { display: flex; align-items: flex-start; gap: 12px; border-radius: 12px; padding: 14px 18px; font-size: 13px; font-weight: 500; line-height: 1.6; margin-bottom: 22px; }
                .sd-banner-success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); color: #4ADE80; }
                .sd-banner-warn    { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #FCD34D; }

                /* Stats */
                .sd-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 28px; }
                .sd-stat-card {
                    background: var(--sp-surface);
                    border: 1px solid var(--sp-border); border-radius: 14px; padding: 16px 18px;
                    position: relative; overflow: hidden;
                }
                .sd-stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 14px 14px 0 0; }
                .sd-stat-card.blue::before  { background: linear-gradient(90deg, var(--sp-accent), var(--sp-accent2)); }
                .sd-stat-card.green::before { background: linear-gradient(90deg, #059669, #34D399); }
                .sd-stat-card.red::before   { background: linear-gradient(90deg, #DC2626, #F87171); }

                .sd-stat-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
                .sd-stat-icon.blue  { background: rgba(26,86,219,0.12); color: var(--sp-accent2); }
                .sd-stat-icon.green { background: rgba(34,197,94,0.12); color: #22C55E; }
                .sd-stat-icon.red   { background: rgba(239,68,68,0.12); color: #EF4444; }

                .sd-stat-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sp-muted); margin-bottom: 5px; }
                .sd-stat-val { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: var(--sp-text); line-height: 1; }
                .sd-stat-val.green { color: #22C55E; }
                .sd-stat-val.red   { color: #EF4444; }

                /* Section title */
                .sd-section-title {
                    font-size: 13px; font-weight: 700; color: var(--sp-muted);
                    letter-spacing: 0.08em; text-transform: uppercase;
                    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
                }
                .sd-section-title::after { content: ''; flex: 1; height: 1px; background: var(--sp-border); }

                /* Enrollment card */
                .sd-enroll-card {
                    background: var(--sp-surface);
                    border: 1px solid var(--sp-border); border-radius: 16px;
                    overflow: hidden; margin-bottom: 14px; transition: box-shadow 0.2s;
                }
                .sd-enroll-card:hover { box-shadow: 0 4px 24px rgba(26,86,219,0.12); }
                .sd-enroll-header {
                    padding: 18px 22px;
                    display: flex; align-items: center; justify-content: space-between; gap: 12px;
                    cursor: pointer; border-bottom: 1px solid transparent;
                    transition: border-color 0.18s, background 0.18s;
                }
                .sd-enroll-card.expanded .sd-enroll-header {
                    border-bottom-color: var(--sp-border);
                    background: var(--sp-hover);
                }
                .sd-course-name { font-size: 15px; font-weight: 700; color: var(--sp-text); margin-bottom: 3px; }
                .sd-course-auth { font-size: 11px; color: var(--sp-muted); }
                .sd-enroll-header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
                .sd-chevron-btn {
                    width: 28px; height: 28px; border-radius: 8px;
                    border: 1px solid var(--sp-border); background: transparent;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    color: var(--sp-muted); transition: background 0.15s;
                }
                .sd-chevron-btn:hover { background: var(--sp-hover); color: var(--sp-accent); }

                /* Enrollment body */
                .sd-enroll-body { padding: 20px 22px; }
                .sd-mini-kpi { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
                .sd-mini-kpi-item {
                    background: var(--sp-hover);
                    border: 1px solid var(--sp-border); border-radius: 10px; padding: 12px 14px;
                }
                .sd-mini-kpi-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sp-muted); margin-bottom: 5px; }
                .sd-mini-kpi-val { font-size: 15px; font-weight: 700; color: var(--sp-text); }
                .sd-mini-kpi-val.green { color: #22C55E; }
                .sd-mini-kpi-val.red   { color: #EF4444; }

                .sd-progress-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                .sd-progress-label { font-size: 12px; font-weight: 600; color: var(--sp-subtext); }
                .sd-progress-pct   { font-size: 12px; font-weight: 700; color: var(--sp-accent2); }
                .sd-progress-track { height: 7px; background: var(--sp-border); border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
                .sd-progress-fill  { height: 100%; background: linear-gradient(90deg, var(--sp-accent), var(--sp-accent2)); border-radius: 10px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }

                .sd-cert-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
                .sd-cert-label { font-size: 11px; font-weight: 600; color: var(--sp-muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 5px; }
                .sd-verify-link {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 12px; font-weight: 600; color: var(--sp-accent2);
                    text-decoration: none; padding: 7px 14px;
                    border: 1px solid var(--sp-border2); border-radius: 8px;
                    transition: background 0.15s;
                }
                .sd-verify-link:hover { background: var(--sp-hover); }

                .sd-payments-title { font-size: 12px; font-weight: 700; color: var(--sp-muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
                .sd-payment-list { display: flex; flex-direction: column; border: 1px solid var(--sp-border); border-radius: 12px; overflow: hidden; }
                .sd-payment-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 11px 14px; gap: 12px;
                    border-bottom: 1px solid var(--sp-border);
                    transition: background 0.14s;
                }
                .sd-payment-row:last-child { border-bottom: none; }
                .sd-payment-row:hover { background: var(--sp-hover); }
                .sd-payment-left { display: flex; align-items: center; gap: 10px; }
                .sd-payment-icon { width: 30px; height: 30px; border-radius: 8px; background: rgba(26,86,219,0.12); display: flex; align-items: center; justify-content: center; color: var(--sp-accent2); flex-shrink: 0; }
                .sd-payment-amount  { font-size: 13px; font-weight: 700; color: var(--sp-text); }
                .sd-payment-receipt { font-size: 10px; color: var(--sp-muted); margin-top: 1px; }
                .sd-payment-remark  { font-size: 10px; color: var(--sp-subtext); margin-top: 1px; }
                .sd-payment-date    { font-size: 11px; font-weight: 500; color: var(--sp-subtext); }
                .sd-no-payments { padding: 20px; text-align: center; font-size: 13px; color: var(--sp-muted); }

                /* Empty */
                .sd-empty {
                    background: var(--sp-surface); border: 1px solid var(--sp-border);
                    border-radius: 16px; padding: 48px 24px; text-align: center;
                }
                .sd-empty-icon { width: 52px; height: 52px; background: rgba(26,86,219,0.12); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--sp-accent2); }
                .sd-empty-title { font-size: 15px; font-weight: 700; color: var(--sp-text); margin-bottom: 6px; }
                .sd-empty-sub   { font-size: 13px; font-weight: 300; color: var(--sp-muted); }

                @media (max-width: 640px) {
                    .sd-stats    { grid-template-columns: 1fr; }
                    .sd-mini-kpi { grid-template-columns: 1fr; }
                    .sd-welcome  { flex-direction: column; align-items: flex-start; }
                    .sd-welcome-right { text-align: left; }
                }
            `}</style>

            <div className="sd-root">

                {/* Welcome */}
                <div className="sd-welcome">
                    <div className="sd-welcome-left">
                        <Avatar name={student.name} src={student.profileImage} size={52} />
                        <div>
                            <div className="sd-welcome-greeting">Welcome back</div>
                            <div className="sd-welcome-name">{student.name}</div>
                            <div className="sd-welcome-meta">
                                <span className="sd-welcome-id">ID · {student.studentId}</span>
                                <StatusBadge status={student.courseStatus} />
                            </div>
                        </div>
                    </div>
                    <div className="sd-welcome-right">
                        <div className="sd-welcome-stat-label">Fee Progress</div>
                        <div className="sd-welcome-stat-val">{overallProgress.toFixed(0)}%</div>
                    </div>
                </div>

                {/* Banners */}
                {student.courseStatus === "completed" && (
                    <div className="sd-banner sd-banner-success">
                        <GraduationCap size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>Congratulations! You have successfully completed your course.</span>
                    </div>
                )}
                {student.courseStatus === "dropped" && (
                    <div className="sd-banner sd-banner-warn">
                        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>Your course has been marked as discontinued. Please contact the academy.</span>
                    </div>
                )}

                {/* Stats */}
                <div className="sd-stats">
                    <div className="sd-stat-card blue">
                        <div className="sd-stat-icon blue"><BookOpen size={16} /></div>
                        <div className="sd-stat-label">Enrolled Courses</div>
                        <div className="sd-stat-val"><CountUp end={enrollments.length} duration={1.2} /></div>
                    </div>
                    <div className="sd-stat-card green">
                        <div className="sd-stat-icon green"><TrendingUp size={16} /></div>
                        <div className="sd-stat-label">Total Paid</div>
                        <div className="sd-stat-val green">₹<CountUp end={totalPaid} separator="," duration={1.4} /></div>
                    </div>
                    <div className="sd-stat-card red">
                        <div className="sd-stat-icon red"><IndianRupee size={16} /></div>
                        <div className="sd-stat-label">Amount Due</div>
                        <div className="sd-stat-val red">₹<CountUp end={totalDue} separator="," duration={1.4} /></div>
                    </div>
                </div>

                {/* Enrollments */}
                {enrollments.length === 0 ? (
                    <div className="sd-empty">
                        <div className="sd-empty-icon"><BookOpen size={22} /></div>
                        <div className="sd-empty-title">No courses enrolled yet</div>
                        <div className="sd-empty-sub">Your enrolled courses will appear here once the academy adds them.</div>
                    </div>
                ) : (
                    <>
                        <div className="sd-section-title"><BookOpen size={13} /> Enrolled Courses</div>
                        {enrollments.map(e => {
                            const total = e.feesTotal ?? 0;
                            const paid = e.feesPaid ?? 0;
                            const due = total - paid;
                            const progress = total > 0 ? (paid / total) * 100 : 0;
                            const expanded = !!expandedCards[e._id];
                            const sorted = [...(e.payments ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                            return (
                                <div key={e._id} className={`sd-enroll-card ${expanded ? "expanded" : ""}`}>
                                    <div className="sd-enroll-header" onClick={() => toggleCard(e._id)}>
                                        <div>
                                            <div className="sd-course-name">{e.course?.name}</div>
                                            {e.course?.authority && <div className="sd-course-auth">{e.course.authority}</div>}
                                        </div>
                                        <div className="sd-enroll-header-right">
                                            <CertBadge status={e.certificateStatus} />
                                            <button className="sd-chevron-btn" aria-label={expanded ? "Collapse" : "Expand"}>
                                                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    {expanded && (
                                        <div className="sd-enroll-body">
                                            <div className="sd-mini-kpi">
                                                <div className="sd-mini-kpi-item">
                                                    <div className="sd-mini-kpi-label">Total Fees</div>
                                                    <div className="sd-mini-kpi-val">₹<CountUp end={total} separator="," duration={0.8} /></div>
                                                </div>
                                                <div className="sd-mini-kpi-item">
                                                    <div className="sd-mini-kpi-label">Paid</div>
                                                    <div className="sd-mini-kpi-val green">₹<CountUp end={paid} separator="," duration={0.8} /></div>
                                                </div>
                                                <div className="sd-mini-kpi-item">
                                                    <div className="sd-mini-kpi-label">Pending</div>
                                                    <div className="sd-mini-kpi-val red">₹<CountUp end={due} separator="," duration={0.8} /></div>
                                                </div>
                                            </div>

                                            <div className="sd-progress-row">
                                                <span className="sd-progress-label">Fee Progress</span>
                                                <span className="sd-progress-pct">{progress.toFixed(0)}%</span>
                                            </div>
                                            <div className="sd-progress-track">
                                                <div className="sd-progress-fill" style={{ width: `${progress}%` }} />
                                            </div>

                                            <div className="sd-cert-row">
                                                <div>
                                                    <div className="sd-cert-label">Certificate Status</div>
                                                    <CertBadge status={e.certificateStatus} />
                                                </div>
                                                {e.course?.verification && (
                                                    <a href={e.course.verification} target="_blank" rel="noopener noreferrer" className="sd-verify-link">
                                                        Verify Certificate <ExternalLink size={11} />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="sd-payments-title"><Receipt size={12} /> Payment History</div>
                                            {sorted.length === 0 ? (
                                                <div className="sd-no-payments">No payments recorded yet.</div>
                                            ) : (
                                                <div className="sd-payment-list">
                                                    {sorted.map((p, i) => (
                                                        <div key={i} className="sd-payment-row">
                                                            <div className="sd-payment-left">
                                                                <div className="sd-payment-icon"><Receipt size={13} /></div>
                                                                <div>
                                                                    <div className="sd-payment-amount">₹{p.amount.toLocaleString("en-IN")}</div>
                                                                    <div className="sd-payment-receipt">Receipt · {p.receiptNo}</div>
                                                                    {p.remark && <div className="sd-payment-remark">{p.remark}</div>}
                                                                </div>
                                                            </div>
                                                            <div className="sd-payment-date">
                                                                {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </>
    );
}