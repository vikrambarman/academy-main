"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";
import {
    IndianRupee, Receipt, TrendingUp, AlertCircle,
    CheckCircle2, Clock, ChevronDown, ChevronUp,
    Download, Calendar, BookOpen, Wallet
} from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
interface Payment {
    amount: number; date: string;
    receiptNo: string; remark?: string;
}
interface Course { name?: string; authority?: string; }
interface Enrollment {
    _id: string; feesTotal: number; feesPaid: number;
    certificateStatus: string; payments: Payment[]; course: Course;
}
interface FeeData {
    student: { name: string; studentId: string; };
    enrollments: Enrollment[];
}

/* ─── Helpers ────────────────────────────────────── */
function fmtINR(n: number) { return `₹${n.toLocaleString("en-IN")}`; }
function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function PaymentStatusBadge({ due }: { due: number }) {
    if (due === 0) return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100 }}>
            <CheckCircle2 size={11} /> Fully Paid
        </span>
    );
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100 }}>
            <AlertCircle size={11} /> {fmtINR(due)} Due
        </span>
    );
}

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */
export default function StudentFeeLedger() {
    const [data, setData] = useState<FeeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchWithAuth("/api/student/profile")
            .then(r => r.json())
            .then(d => {
                setData(d);
                /* auto-expand first enrollment */
                if (d?.enrollments?.length > 0) {
                    setExpanded({ [d.enrollments[0]._id]: true });
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

    if (loading) return (
        <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, border: "3px solid #dbeafe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spSpin 0.7s linear infinite" }} />
            <style>{`@keyframes spSpin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading fee details…</span>
        </div>
    );

    if (!data) return (
        <div style={{ textAlign: "center", padding: "48px 0", fontSize: 13, color: "#dc2626", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Failed to load fee details. Please refresh.
        </div>
    );

    const { enrollments } = data;
    const totalFees = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
    const totalPaid = enrollments.reduce((s, e) => s + (e.feesPaid ?? 0), 0);
    const totalDue = totalFees - totalPaid;
    const overallPct = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

    /* all payments flat — for timeline */
    const allPayments = enrollments
        .flatMap(e => (e.payments ?? []).map(p => ({ ...p, courseName: e.course?.name ?? "Course" })))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                .sfl-root * { box-sizing: border-box; }
                .sfl-root { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; }

                /* ── Page header ── */
                .sfl-page-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 1.4rem; color: #0f172a;
                    display: flex; align-items: center; gap: 10px;
                    margin-bottom: 4px;
                }
                .sfl-page-sub { font-size: 13px; color: #64748b; font-weight: 300; margin-bottom: 22px; }

                /* ── Summary cards ── */
                .sfl-summary {
                    display: grid; grid-template-columns: repeat(4,1fr);
                    gap: 12px; margin-bottom: 22px;
                }

                .sfl-stat {
                    background: #fff; border: 1px solid #e0effe;
                    border-radius: 14px; padding: 16px 18px;
                    position: relative; overflow: hidden;
                }

                .sfl-stat::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    border-radius: 14px 14px 0 0;
                }

                .sfl-stat.blue::before  { background: linear-gradient(90deg,#2563eb,#60a5fa); }
                .sfl-stat.green::before { background: linear-gradient(90deg,#059669,#34d399); }
                .sfl-stat.red::before   { background: linear-gradient(90deg,#dc2626,#f87171); }
                .sfl-stat.amber::before { background: linear-gradient(90deg,#d97706,#fbbf24); }

                .sfl-stat-icon {
                    width: 32px; height: 32px; border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 10px;
                }
                .sfl-stat-icon.blue  { background:#eff6ff; color:#2563eb; }
                .sfl-stat-icon.green { background:#f0fdf4; color:#059669; }
                .sfl-stat-icon.red   { background:#fef2f2; color:#dc2626; }
                .sfl-stat-icon.amber { background:#fffbeb; color:#d97706; }

                .sfl-stat-label { font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#94a3b8; margin-bottom:5px; }
                .sfl-stat-val   { font-family:'DM Serif Display',serif; font-size:1.35rem; color:#0f172a; line-height:1; }
                .sfl-stat-val.green { color:#15803d; }
                .sfl-stat-val.red   { color:#dc2626; }

                /* overall progress */
                .sfl-overall {
                    background: #fff; border: 1px solid #e0effe; border-radius: 14px;
                    padding: 18px 20px; margin-bottom: 22px;
                }
                .sfl-overall-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
                .sfl-overall-label { font-size:13px; font-weight:600; color:#475569; }
                .sfl-overall-pct   { font-family:'DM Serif Display',serif; font-size:1.1rem; color:#2563eb; }
                .sfl-overall-track { height:8px; background:#e0effe; border-radius:10px; overflow:hidden; }
                .sfl-overall-fill  { height:100%; background:linear-gradient(90deg,#2563eb,#60a5fa); border-radius:10px; transition:width 1s cubic-bezier(.4,0,.2,1); }

                /* ── Section label ── */
                .sfl-section-label {
                    font-size:12px; font-weight:700; color:#475569;
                    letter-spacing:0.08em; text-transform:uppercase;
                    display:flex; align-items:center; gap:8px; margin-bottom:12px;
                }
                .sfl-section-label::after { content:''; flex:1; height:1px; background:#e0effe; }

                /* ── Enrollment accordion ── */
                .sfl-enrollment {
                    background: #fff; border: 1px solid #e0effe;
                    border-radius: 14px; overflow: hidden; margin-bottom: 12px;
                    transition: box-shadow 0.18s;
                }
                .sfl-enrollment:hover { box-shadow: 0 4px 20px rgba(37,99,235,0.08); }

                .sfl-enroll-head {
                    padding: 16px 20px;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 12px; cursor: pointer;
                    border-bottom: 1px solid transparent;
                    transition: background 0.15s, border-color 0.15s;
                }

                .sfl-enrollment.open .sfl-enroll-head {
                    background: #f8fbff; border-bottom-color: #e0effe;
                }

                .sfl-enroll-head-left {}
                .sfl-course-name { font-size:14px; font-weight:700; color:#0f172a; margin-bottom:3px; }
                .sfl-course-auth { font-size:11px; color:#64748b; }

                .sfl-enroll-head-right { display:flex; align-items:center; gap:10px; flex-shrink:0; }

                .sfl-chevron {
                    width:28px; height:28px; border-radius:8px;
                    border:1px solid #e0effe; background:transparent;
                    cursor:pointer; display:flex; align-items:center; justify-content:center;
                    color:#64748b; transition:background 0.15s;
                }
                .sfl-chevron:hover { background:#eff6ff; color:#2563eb; }

                /* enrollment body */
                .sfl-enroll-body { padding: 18px 20px; }

                /* mini fee row */
                .sfl-fee-grid {
                    display: grid; grid-template-columns: repeat(3,1fr);
                    gap: 10px; margin-bottom: 16px;
                }

                .sfl-fee-cell {
                    background: #f8fbff; border: 1px solid #e0effe;
                    border-radius: 10px; padding: 12px 14px;
                }
                .sfl-fee-cell-label { font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#94a3b8; margin-bottom:5px; }
                .sfl-fee-cell-val   { font-size:15px; font-weight:700; color:#0f172a; }
                .sfl-fee-cell-val.green { color:#15803d; }
                .sfl-fee-cell-val.red   { color:#dc2626; }

                /* progress */
                .sfl-prog-row  { display:flex; justify-content:space-between; align-items:center; margin-bottom:7px; }
                .sfl-prog-lbl  { font-size:12px; font-weight:600; color:#475569; }
                .sfl-prog-pct  { font-size:12px; font-weight:700; color:#2563eb; }
                .sfl-prog-track { height:6px; background:#e0effe; border-radius:10px; overflow:hidden; margin-bottom:18px; }
                .sfl-prog-fill  { height:100%; background:linear-gradient(90deg,#2563eb,#60a5fa); border-radius:10px; transition:width 0.8s cubic-bezier(.4,0,.2,1); }

                /* payment table */
                .sfl-pay-title { font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#94a3b8; margin-bottom:10px; display:flex; align-items:center; gap:6px; }

                .sfl-pay-table { border:1px solid #e0effe; border-radius:11px; overflow:hidden; }

                .sfl-pay-thead {
                    display: grid; grid-template-columns: 1fr 1fr 1.4fr auto;
                    padding: 9px 14px; background: #f8fbff;
                    border-bottom: 1px solid #e0effe;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
                    text-transform: uppercase; color: #94a3b8; gap: 8px;
                }

                .sfl-pay-row {
                    display: grid; grid-template-columns: 1fr 1fr 1.4fr auto;
                    padding: 11px 14px; gap: 8px;
                    border-bottom: 1px solid #f0f7ff;
                    align-items: center; transition: background 0.14s;
                }
                .sfl-pay-row:last-child { border-bottom: none; }
                .sfl-pay-row:hover { background: #f8fbff; }

                .sfl-pay-amount  { font-size:13px; font-weight:700; color:#15803d; }
                .sfl-pay-date    { font-size:12px; color:#475569; display:flex; align-items:center; gap:5px; }
                .sfl-pay-receipt { font-size:11px; color:#64748b; }
                .sfl-pay-remark  { font-size:10px; color:#94a3b8; margin-top:2px; }

                .sfl-receipt-pill {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: 10px; font-weight: 600; color: #2563eb;
                    background: #eff6ff; border: 1px solid #bfdbfe;
                    padding: 3px 8px; border-radius: 6px;
                    white-space: nowrap;
                }

                .sfl-no-pay { padding:20px; text-align:center; font-size:13px; color:#94a3b8; }

                /* ── Recent timeline ── */
                .sfl-timeline { display:flex; flex-direction:column; gap:0; }

                .sfl-tl-item {
                    display: flex; gap: 14px; align-items: flex-start;
                    padding: 14px 0; border-bottom: 1px solid #f0f7ff;
                    position: relative;
                }
                .sfl-tl-item:last-child { border-bottom: none; }

                .sfl-tl-icon {
                    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
                    background: #eff6ff; border: 1px solid #bfdbfe;
                    display: flex; align-items: center; justify-content: center; color: #2563eb;
                    margin-top: 1px;
                }

                .sfl-tl-content { flex: 1; min-width: 0; }
                .sfl-tl-amount  { font-size:14px; font-weight:700; color:#15803d; margin-bottom:2px; }
                .sfl-tl-meta    { font-size:11px; color:#64748b; display:flex; gap:10px; flex-wrap:wrap; }
                .sfl-tl-date    { margin-left:auto; font-size:11px; color:#94a3b8; white-space:nowrap; flex-shrink:0; }

                /* ── Empty ── */
                .sfl-empty {
                    background:#fff; border:1px solid #e0effe; border-radius:14px;
                    padding:40px 24px; text-align:center;
                }
                .sfl-empty-icon { width:44px; height:44px; background:#eff6ff; border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; color:#2563eb; }
                .sfl-empty-text { font-size:13px; color:#94a3b8; }

                /* ── Responsive ── */
                @media (max-width:640px) {
                    .sfl-summary { grid-template-columns:1fr 1fr; }
                    .sfl-fee-grid { grid-template-columns:1fr; }
                    .sfl-pay-thead,
                    .sfl-pay-row { grid-template-columns: 1fr 1fr; }
                    .sfl-pay-thead > :nth-child(3),
                    .sfl-pay-thead > :nth-child(4),
                    .sfl-pay-row  > :nth-child(3),
                    .sfl-pay-row  > :nth-child(4) { display: none; }
                }
            `}</style>

            <div className="sfl-root">

                {/* Page header */}
                <div className="sfl-page-title">
                    <Wallet size={22} style={{ color: "#2563eb" }} />
                    Fee Ledger
                </div>
                <div className="sfl-page-sub">Complete overview of your fee payments and dues.</div>

                {/* Summary stats */}
                <div className="sfl-summary">
                    <div className="sfl-stat blue">
                        <div className="sfl-stat-icon blue"><BookOpen size={15} /></div>
                        <div className="sfl-stat-label">Courses</div>
                        <div className="sfl-stat-val"><CountUp end={enrollments.length} duration={1} /></div>
                    </div>
                    <div className="sfl-stat blue">
                        <div className="sfl-stat-icon blue"><IndianRupee size={15} /></div>
                        <div className="sfl-stat-label">Total Fees</div>
                        <div className="sfl-stat-val">₹<CountUp end={totalFees} separator="," duration={1.2} /></div>
                    </div>
                    <div className="sfl-stat green">
                        <div className="sfl-stat-icon green"><TrendingUp size={15} /></div>
                        <div className="sfl-stat-label">Total Paid</div>
                        <div className="sfl-stat-val green">₹<CountUp end={totalPaid} separator="," duration={1.4} /></div>
                    </div>
                    <div className="sfl-stat red">
                        <div className="sfl-stat-icon red"><AlertCircle size={15} /></div>
                        <div className="sfl-stat-label">Amount Due</div>
                        <div className="sfl-stat-val red">₹<CountUp end={totalDue} separator="," duration={1.4} /></div>
                    </div>
                </div>

                {/* Overall progress */}
                <div className="sfl-overall">
                    <div className="sfl-overall-row">
                        <span className="sfl-overall-label">Overall Fee Progress</span>
                        <span className="sfl-overall-pct">{overallPct.toFixed(0)}% paid</span>
                    </div>
                    <div className="sfl-overall-track">
                        <div className="sfl-overall-fill" style={{ width: `${overallPct}%` }} />
                    </div>
                </div>

                {/* Per-course ledger */}
                <div className="sfl-section-label"><Receipt size={13} /> Course-wise Ledger</div>

                {enrollments.length === 0 ? (
                    <div className="sfl-empty">
                        <div className="sfl-empty-icon"><BookOpen size={20} /></div>
                        <div className="sfl-empty-text">No enrollments found.</div>
                    </div>
                ) : enrollments.map(e => {
                    const total = e.feesTotal ?? 0;
                    const paid = e.feesPaid ?? 0;
                    const due = total - paid;
                    const pct = total > 0 ? (paid / total) * 100 : 0;
                    const isOpen = !!expanded[e._id];
                    const sorted = [...(e.payments ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    return (
                        <div key={e._id} className={`sfl-enrollment ${isOpen ? "open" : ""}`}>
                            <div className="sfl-enroll-head" onClick={() => toggle(e._id)}>
                                <div className="sfl-enroll-head-left">
                                    <div className="sfl-course-name">{e.course?.name ?? "Course"}</div>
                                    {e.course?.authority && <div className="sfl-course-auth">{e.course.authority}</div>}
                                </div>
                                <div className="sfl-enroll-head-right">
                                    <PaymentStatusBadge due={due} />
                                    <button className="sfl-chevron" aria-label="toggle">
                                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="sfl-enroll-body">

                                    {/* Fee cells */}
                                    <div className="sfl-fee-grid">
                                        <div className="sfl-fee-cell">
                                            <div className="sfl-fee-cell-label">Total Fees</div>
                                            <div className="sfl-fee-cell-val">₹{total.toLocaleString("en-IN")}</div>
                                        </div>
                                        <div className="sfl-fee-cell">
                                            <div className="sfl-fee-cell-label">Paid</div>
                                            <div className="sfl-fee-cell-val green">₹{paid.toLocaleString("en-IN")}</div>
                                        </div>
                                        <div className="sfl-fee-cell">
                                            <div className="sfl-fee-cell-label">Remaining</div>
                                            <div className={`sfl-fee-cell-val ${due > 0 ? "red" : "green"}`}>₹{due.toLocaleString("en-IN")}</div>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="sfl-prog-row">
                                        <span className="sfl-prog-lbl">Fee Progress</span>
                                        <span className="sfl-prog-pct">{pct.toFixed(0)}%</span>
                                    </div>
                                    <div className="sfl-prog-track">
                                        <div className="sfl-prog-fill" style={{ width: `${pct}%` }} />
                                    </div>

                                    {/* Payment table */}
                                    <div className="sfl-pay-title"><Receipt size={11} /> Payment Records ({sorted.length})</div>

                                    {sorted.length === 0 ? (
                                        <div className="sfl-no-pay">No payments recorded yet.</div>
                                    ) : (
                                        <div className="sfl-pay-table">
                                            <div className="sfl-pay-thead">
                                                <span>Amount</span>
                                                <span>Date</span>
                                                <span>Receipt No.</span>
                                                <span>Remark</span>
                                            </div>
                                            {sorted.map((p, i) => (
                                                <div key={i} className="sfl-pay-row">
                                                    <div className="sfl-pay-amount">{fmtINR(p.amount)}</div>
                                                    <div className="sfl-pay-date"><Calendar size={10} />{fmtDate(p.date)}</div>
                                                    <div>
                                                        <span className="sfl-receipt-pill"><Receipt size={9} />{p.receiptNo}</span>
                                                    </div>
                                                    <div className="sfl-pay-remark">{p.remark || "—"}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Recent payments timeline */}
                {allPayments.length > 0 && (
                    <>
                        <div className="sfl-section-label" style={{ marginTop: 28 }}>
                            <Clock size={13} /> Recent Payment Activity
                        </div>

                        <div style={{ background: "#fff", border: "1px solid #e0effe", borderRadius: 14, padding: "4px 20px" }}>
                            <div className="sfl-timeline">
                                {allPayments.slice(0, 8).map((p, i) => (
                                    <div key={i} className="sfl-tl-item">
                                        <div className="sfl-tl-icon"><IndianRupee size={14} /></div>
                                        <div className="sfl-tl-content">
                                            <div className="sfl-tl-amount">{fmtINR(p.amount)}</div>
                                            <div className="sfl-tl-meta">
                                                <span>{p.courseName}</span>
                                                <span className="sfl-receipt-pill"><Receipt size={9} />{p.receiptNo}</span>
                                                {p.remark && <span style={{ color: "#94a3b8" }}>{p.remark}</span>}
                                            </div>
                                        </div>
                                        <div className="sfl-tl-date">{fmtDate(p.date)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}