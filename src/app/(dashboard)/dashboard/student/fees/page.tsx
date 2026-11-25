"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";
import {
    IndianRupee, Receipt, TrendingUp, AlertCircle,
    CheckCircle2, Clock, ChevronDown, ChevronUp,
    Calendar, BookOpen, Wallet, Shield, Download, Loader2
} from "lucide-react";

// ── Types ──────────────────────────────────────────────
interface Payment {
    amount: number;
    date: string;
    receiptNo: string;
    remark?: string;
    receiptPdfUrl?: string;
    transactionId?: string;
}

interface Course { name?: string; authority?: string; }
interface FranchiseData { _id: string; name: string; code: string; isOwn: boolean; }
interface CertTypeData { _id: string; name: string; code: string; issuingBody: string; }

interface Enrollment {
    _id: string;
    feesTotal: number;
    feesPaid: number;
    certificateStatus: string;
    payments: Payment[];
    course: Course;
    franchise?: FranchiseData | null;
    certType?: CertTypeData | null;
    externalStudentId?: string | null;
}

interface FeeData {
    student: { name: string; studentId: string };
    enrollments: Enrollment[];
}

// ── Helpers ─────────────────────────────────────────────
function fmtINR(n: number) { return `₹${n.toLocaleString("en-IN")}`; }
function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function PaymentStatusBadge({ due }: { due: number }) {
    if (due === 0) {
        return <span className="sfl-status-badge sfl-status-badge--paid"><CheckCircle2 size={10} /> Fully Paid</span>;
    }
    return <span className="sfl-status-badge sfl-status-badge--due"><AlertCircle size={10} /> {fmtINR(due)} Due</span>;
}

// ══════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════
export default function StudentFeeLedger() {
    const [data, setData] = useState<FeeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [paying, setPaying] = useState<Record<string, boolean>>({});
    const [payAmounts, setPayAmounts] = useState<Record<string, string>>({}); // For custom amount input
    const [sdkLoaded, setSdkLoaded] = useState(false);

    // Load Cashfree SDK on mount
    useEffect(() => {
        if ((window as any).Cashfree) {
            setSdkLoaded(true);
            return;
        }
        const script = document.createElement("script");
        script.id = "cashfree-sdk-student";
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        script.onload = () => setSdkLoaded(true);
        script.onerror = () => console.error("Failed to load Cashfree SDK");
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        fetchWithAuth("/api/student/profile")
            .then(async (r) => {
                const json = await r.json();
                let normalized: FeeData;
                if (json?.student) {
                    normalized = { student: json.student, enrollments: Array.isArray(json.enrollments) ? json.enrollments : [] };
                } else {
                    normalized = { student: json, enrollments: Array.isArray(json.enrollments) ? json.enrollments : [] };
                }
                setData(normalized);
                if (normalized.enrollments.length > 0) setExpanded({ [normalized.enrollments[0]._id]: true });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

    const handlePayOnline = async (enrollmentId: string, maxDue: number) => {
        const amountStr = payAmounts[enrollmentId];
        const amountToPay = amountStr ? Number(amountStr) : maxDue;

        if (isNaN(amountToPay) || amountToPay <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }
        if (amountToPay > maxDue) {
            alert(`Amount cannot exceed the due amount of ${fmtINR(maxDue)}`);
            return;
        }

        setPaying(prev => ({ ...prev, [enrollmentId]: true }));
        try {
            const res = await fetchWithAuth("/api/payments/cashfree/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enrollmentId, amount: amountToPay }),
            });
            const responseData = await res.json();
            if (!res.ok) throw new Error(responseData.message || "Payment initiation failed");

            // Trigger Cashfree Checkout
            const cashfree = (window as any).Cashfree({ 
                mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "PRODUCTION" ? "production" : "sandbox" 
            });

            cashfree.checkout({ paymentSessionId: responseData.paymentSessionId })
            .then((result: any) => {
                if (result.error) {
                    alert("Payment failed or cancelled: " + result.error.message);
                } else if (result.redirect) {
                    alert("Payment page opened. Once completed, the page will refresh to show updates.");
                    // Poll or wait for webhook, then refresh
                    setTimeout(() => window.location.reload(), 6000);
                } else {
                    alert("Payment completed successfully! Refreshing...");
                    setTimeout(() => window.location.reload(), 2000);
                }
                setPaying(prev => ({ ...prev, [enrollmentId]: false }));
            }).catch((e: any) => {
                console.error("Cashfree SDK Error", e);
                alert("Payment gateway error occurred. Please try again.");
                setPaying(prev => ({ ...prev, [enrollmentId]: false }));
            });

        } catch (error: any) {
            alert(error.message || "Failed to initiate payment");
            setPaying(prev => ({ ...prev, [enrollmentId]: false }));
        }
    };

    if (loading) return <div className="sfl-loader"><div className="sfl-spinner" /><span className="sfl-loader-text">Loading fee details…</span></div>;
    if (!data) return <div className="sfl-error-text">Failed to load fee details. Please refresh.</div>;

    const { enrollments } = data;
    const totalFees = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
    const totalPaid = enrollments.reduce((s, e) => s + (e.feesPaid ?? 0), 0);
    const totalDue = totalFees - totalPaid;
    const overallPct = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

    const allPayments = enrollments.flatMap((e) => (e.payments ?? []).map((p) => ({ ...p, courseName: e.course?.name ?? "Course" })))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <style>{sflStyles}</style>
            <div className="sfl-root">
                <div className="sfl-page-header">
                    <h1 className="sfl-page-title"><Wallet size={22} style={{ color: "var(--sp-accent2, #1A56DB)" }} /> Fee Ledger</h1>
                    <p className="sfl-page-sub">Complete overview of your fee payments and dues.</p>
                </div>

                <div className="sfl-summary">
                    <div className="sfl-stat sfl-stat--blue"><div className="sfl-stat-icon sfl-stat-icon--blue"><BookOpen size={15} /></div><div className="sfl-stat-label">Courses</div><div className="sfl-stat-val"><CountUp end={enrollments.length} duration={1} /></div></div>
                    <div className="sfl-stat sfl-stat--blue"><div className="sfl-stat-icon sfl-stat-icon--blue"><IndianRupee size={15} /></div><div className="sfl-stat-label">Total Fees</div><div className="sfl-stat-val">₹<CountUp end={totalFees} separator="," duration={1.2} /></div></div>
                    <div className="sfl-stat sfl-stat--green"><div className="sfl-stat-icon sfl-stat-icon--green"><TrendingUp size={15} /></div><div className="sfl-stat-label">Total Paid</div><div className="sfl-stat-val sfl-stat-val--green">₹<CountUp end={totalPaid} separator="," duration={1.4} /></div></div>
                    <div className="sfl-stat sfl-stat--red"><div className="sfl-stat-icon sfl-stat-icon--red"><AlertCircle size={15} /></div><div className="sfl-stat-label">Amount Due</div><div className="sfl-stat-val sfl-stat-val--red">₹<CountUp end={totalDue} separator="," duration={1.4} /></div></div>
                </div>

                <div className="sfl-overall">
                    <div className="sfl-overall-row"><span className="sfl-overall-label">Overall Fee Progress</span><span className="sfl-overall-pct">{overallPct.toFixed(0)}% paid</span></div>
                    <div className="sfl-overall-track"><div className="sfl-overall-fill" style={{ width: `${overallPct}%` }} /></div>
                </div>

                <div className="sfl-section-label"><Receipt size={13} /> Course-wise Ledger</div>

                {enrollments.length === 0 ? (
                    <div className="sfl-empty"><div className="sfl-empty-icon"><BookOpen size={20} /></div><div className="sfl-empty-text">No enrollments found.</div></div>
                ) : (
                    enrollments.map((e) => {
                        const total = e.feesTotal ?? 0;
                        const paid = e.feesPaid ?? 0;
                        const due = total - paid;
                        const pct = total > 0 ? (paid / total) * 100 : 0;
                        const isOpen = !!expanded[e._id];
                        const sorted = [...(e.payments ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                        const authorityLabel = e.franchise?.name || e.course?.authority;

                        return (
                            <div key={e._id} className={`sfl-enrollment ${isOpen ? "open" : ""}`}>
                                <div className="sfl-enroll-head" onClick={() => toggle(e._id)}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="sfl-course-name">{e.course?.name ?? "Course"}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                                            {e.franchise ? (
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: e.franchise.isOwn ? "rgb(245 158 11 / 0.12)" : "rgb(26 86 219 / 0.1)", color: e.franchise.isOwn ? "var(--sp-warn, #F59E0B)" : "var(--sp-accent2, #1A56DB)", border: `1px solid ${e.franchise.isOwn ? "rgb(245 158 11 / 0.25)" : "rgb(26 86 219 / 0.2)" }` }}>
                                                    <Shield size={8} /> {e.franchise.code}
                                                </span>
                                            ) : authorityLabel ? <span className="sfl-course-auth">{authorityLabel}</span> : null}
                                            {e.certType && <span style={{ fontSize: 10, color: "var(--sp-muted, #64748B)", fontWeight: 500 }}>{e.certType.code}</span>}
                                        </div>
                                    </div>
                                    <div className="sfl-enroll-head-right">
                                        <PaymentStatusBadge due={due} />
                                        
                                        {/* PAYMENT CONTROLS */}
                                        {due > 0 && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                    <input
                                                        type="number"
                                                        className="sfl-input-amount"
                                                        placeholder={`₹${due}`}
                                                        value={payAmounts[e._id] || ""}
                                                        onChange={(ev) => {
                                                            const val = Number(ev.target.value);
                                                            if (val > due) {
                                                                alert(`Cannot pay more than due amount (₹${due})`);
                                                                return;
                                                            }
                                                            setPayAmounts(prev => ({ ...prev, [e._id]: ev.target.value }));
                                                        }}
                                                        onClick={(ev) => ev.stopPropagation()}
                                                    />
                                                    <button
                                                        className="sfl-pay-btn"
                                                        onClick={(ev) => { ev.stopPropagation(); handlePayOnline(e._id, due); }}
                                                        disabled={paying[e._id] || !sdkLoaded}
                                                    >
                                                        {paying[e._id] ? <Loader2 size={14} className="animate-spin" /> : !sdkLoaded ? "Loading..." : "Pay Now"}
                                                    </button>
                                                </div>
                                                <button
                                                    className="sfl-pay-full-btn"
                                                    onClick={(ev) => {
                                                        ev.stopPropagation();
                                                        setPayAmounts(prev => ({ ...prev, [e._id]: String(due) }));
                                                        handlePayOnline(e._id, due);
                                                    }}
                                                    disabled={paying[e._id] || !sdkLoaded}
                                                >
                                                    Pay Full Amount ({fmtINR(due)})
                                                </button>
                                            </div>
                                        )}
                                        
                                        <button className="sfl-chevron" aria-label="Toggle details" onClick={(ev) => { ev.stopPropagation(); toggle(e._id); }}>
                                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="sfl-enroll-body">
                                        {e.franchise && (
                                            <div className={`sfl-franchise-strip ${e.franchise.isOwn ? "sfl-franchise-strip--own" : "sfl-franchise-strip--external"}`}>
                                                <Shield size={13} style={{ color: e.franchise.isOwn ? "var(--sp-warn, #F59E0B)" : "var(--sp-accent2, #1A56DB)", flexShrink: 0 }} />
                                                <div style={{ flex: 1 }}><span className="sfl-franchise-name">{e.franchise.name}</span>{e.certType && <span className="sfl-franchise-cert"> · {e.certType.name}</span>}</div>
                                                {e.externalStudentId && <span className="sfl-franchise-id">{e.franchise.code} ID: <span className="sfl-franchise-id-mono">{e.externalStudentId}</span></span>}
                                            </div>
                                        )}
                                        <div className="sfl-fee-grid">
                                            <div className="sfl-fee-cell"><div className="sfl-fee-cell-label">Total Fees</div><div className="sfl-fee-cell-val">₹{total.toLocaleString("en-IN")}</div></div>
                                            <div className="sfl-fee-cell"><div className="sfl-fee-cell-label">Paid</div><div className="sfl-fee-cell-val sfl-fee-cell-val--green">₹{paid.toLocaleString("en-IN")}</div></div>
                                            <div className="sfl-fee-cell"><div className="sfl-fee-cell-label">Remaining</div><div className={`sfl-fee-cell-val ${due > 0 ? "sfl-fee-cell-val--red" : "sfl-fee-cell-val--green"}`}>₹{due.toLocaleString("en-IN")}</div></div>
                                        </div>
                                        <div className="sfl-prog-row"><span className="sfl-prog-lbl">Fee Progress</span><span className="sfl-prog-pct">{pct.toFixed(0)}%</span></div>
                                        <div className="sfl-prog-track"><div className="sfl-prog-fill" style={{ width: `${pct}%` }} /></div>

                                        <div className="sfl-pay-title"><Receipt size={11} /> Payment Records ({sorted.length})</div>
                                        {sorted.length === 0 ? (
                                            <div className="sfl-no-pay">No payments recorded yet.</div>
                                        ) : (
                                            <div className="sfl-pay-table">
                                                <div className="sfl-pay-thead"><span>Amount</span><span>Date</span><span>Receipt No.</span><span>Remark / Action</span></div>
                                                {sorted.map((p, i) => (
                                                    <div key={i} className="sfl-pay-row">
                                                        <div className="sfl-pay-amount">{fmtINR(p.amount)}</div>
                                                        <div className="sfl-pay-date"><Calendar size={10} /> {fmtDate(p.date)}</div>
                                                        <div><span className="sfl-receipt-pill"><Receipt size={9} /> {p.receiptNo}</span></div>
                                                        <div className="sfl-pay-remark">
                                                            <span>{p.remark || "—"}</span>
                                                            {p.receiptPdfUrl && (
                                                                <a href={p.receiptPdfUrl} target="_blank" rel="noopener noreferrer" className="sfl-download-btn" title="Download Official Receipt">
                                                                    <Download size={12} /> PDF
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

                {allPayments.length > 0 && (
                    <div>
                        <div className="sfl-section-label"><Clock size={13} /> Recent Payment Activity</div>
                        <div className="sfl-timeline-card">
                            <div className="sfl-timeline">
                                {allPayments.slice(0, 8).map((p, i) => (
                                    <div key={i} className="sfl-tl-item">
                                        <div className="sfl-tl-icon"><IndianRupee size={14} /></div>
                                        <div className="sfl-tl-content">
                                            <div className="sfl-tl-amount">{fmtINR(p.amount)}</div>
                                            <div className="sfl-tl-meta">
                                                <span>{p.courseName}</span>
                                                <span className="sfl-receipt-pill"><Receipt size={9} /> {p.receiptNo}</span>
                                                {p.remark && <span style={{ color: "var(--sp-muted, #64748B)" }}>{p.remark}</span>}
                                            </div>
                                        </div>
                                        <div className="sfl-tl-date">{fmtDate(p.date)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

const sflStyles = `
    .sfl-root { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--cp-text, #0f172a); display: flex; flex-direction: column; gap: 20px; max-width: 900px; margin: 0 auto; padding: 20px; }
    .sfl-page-header { margin-bottom: 8px; }
    .sfl-page-title { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: var(--cp-text, #0f172a); font-weight: 400; display: flex; align-items: center; gap: 10px; }
    .sfl-page-sub { font-size: 13px; color: var(--cp-muted, #64748b); margin-top: 4px; }
    .sfl-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
    .sfl-stat { background: var(--cp-surface, #ffffff); border: 1px solid var(--cp-border, #e2e8f0); border-radius: 12px; padding: 16px; }
    .sfl-stat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
    .sfl-stat-icon--blue { background: rgba(26, 86, 219, 0.1); color: var(--sp-accent2, #1A56DB); }
    .sfl-stat-icon--green { background: rgba(34, 197, 94, 0.1); color: var(--cp-success, #22c55e); }
    .sfl-stat-icon--red { background: rgba(239, 68, 68, 0.1); color: var(--cp-danger, #ef4444); }
    .sfl-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cp-muted, #64748b); }
    .sfl-stat-val { font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: var(--cp-text, #0f172a); margin-top: 4px; }
    .sfl-stat-val--green { color: var(--cp-success, #22c55e); }
    .sfl-stat-val--red { color: var(--cp-danger, #ef4444); }
    .sfl-overall { background: var(--cp-surface, #ffffff); border: 1px solid var(--cp-border, #e2e8f0); border-radius: 12px; padding: 16px; }
    .sfl-overall-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 8px; }
    .sfl-overall-track { height: 6px; background: var(--cp-border, #e2e8f0); border-radius: 100px; overflow: hidden; }
    .sfl-overall-fill { height: 100%; background: linear-gradient(90deg, var(--sp-accent2, #1A56DB), var(--cp-success, #22c55e)); border-radius: 100px; transition: width 0.4s; }
    .sfl-section-label { font-size: 13px; font-weight: 700; color: var(--cp-subtext, #475569); display: flex; align-items: center; gap: 6px; margin-top: 12px; }
    .sfl-enrollment { background: var(--cp-surface, #ffffff); border: 1px solid var(--cp-border, #e2e8f0); border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
    .sfl-enroll-head { display: flex; align-items: center; justify-content: space-between; padding: 16px; cursor: pointer; transition: background 0.15s; gap: 12px; flex-wrap: wrap; }
    .sfl-enroll-head:hover { background: var(--cp-accent-glow, rgba(26, 86, 219, 0.03)); }
    .sfl-course-name { font-size: 14px; font-weight: 700; color: var(--cp-text, #0f172a); }
    .sfl-course-auth { font-size: 10px; color: var(--cp-muted, #64748b); font-weight: 500; }
    .sfl-enroll-head-right { display: flex; align-items: center; gap: 10px; }
    .sfl-status-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; }
    .sfl-status-badge--paid { background: rgba(34, 197, 94, 0.1); color: var(--cp-success, #22c55e); }
    .sfl-status-badge--due { background: rgba(239, 68, 68, 0.1); color: var(--cp-danger, #ef4444); }
    .sfl-chevron { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--cp-border, #e2e8f0); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--cp-muted, #64748b); transition: all 0.15s; }
    .sfl-chevron:hover { background: var(--cp-surface2, #f8fafc); color: var(--cp-text, #0f172a); }
    .sfl-enroll-body { padding: 0 16px 16px; border-top: 1px solid var(--cp-border, #e2e8f0); }
    .sfl-franchise-strip { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 8px; margin-top: 16px; font-size: 12px; }
    .sfl-franchise-strip--own { background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); }
    .sfl-franchise-strip--external { background: rgba(26, 86, 219, 0.08); border: 1px solid rgba(26, 86, 219, 0.2); }
    .sfl-franchise-name { font-weight: 700; }
    .sfl-franchise-cert { color: var(--cp-muted, #64748b); }
    .sfl-franchise-id { font-size: 11px; color: var(--cp-muted, #64748b); }
    .sfl-franchise-id-mono { font-family: monospace; background: var(--cp-surface2, #f8fafc); padding: 2px 6px; border-radius: 4px; font-weight: 600; }
    .sfl-fee-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; }
    .sfl-fee-cell { text-align: center; padding: 12px; background: var(--cp-surface2, #f8fafc); border-radius: 8px; }
    .sfl-fee-cell-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cp-muted, #64748b); margin-bottom: 4px; }
    .sfl-fee-cell-val { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: var(--cp-text, #0f172a); }
    .sfl-fee-cell-val--green { color: var(--cp-success, #22c55e); }
    .sfl-fee-cell-val--red { color: var(--cp-danger, #ef4444); }
    .sfl-prog-row { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; margin-top: 16px; margin-bottom: 6px; color: var(--cp-subtext, #475569); }
    .sfl-prog-track { height: 4px; background: var(--cp-border, #e2e8f0); border-radius: 100px; overflow: hidden; margin-bottom: 20px; }
    .sfl-prog-fill { height: 100%; background: linear-gradient(90deg, var(--sp-accent2, #1A56DB), var(--cp-success, #22c55e)); border-radius: 100px; transition: width 0.4s; }
    .sfl-pay-title { font-size: 12px; font-weight: 700; color: var(--cp-subtext, #475569); display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
    .sfl-no-pay { text-align: center; padding: 20px; color: var(--cp-muted, #64748b); font-size: 12px; background: var(--cp-surface2, #f8fafc); border-radius: 8px; }
    .sfl-pay-table { border: 1px solid var(--cp-border, #e2e8f0); border-radius: 8px; overflow: hidden; }
    .sfl-pay-thead { display: grid; grid-template-columns: 1fr 1.2fr 1.2fr 1.5fr; background: var(--cp-surface2, #f8fafc); padding: 10px 14px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cp-muted, #64748b); }
    .sfl-pay-row { display: grid; grid-template-columns: 1fr 1.2fr 1.2fr 1.5fr; padding: 12px 14px; border-top: 1px solid var(--cp-border, #e2e8f0); font-size: 12px; align-items: center; }
    .sfl-pay-row:hover { background: var(--cp-accent-glow, rgba(26, 86, 219, 0.03)); }
    .sfl-pay-amount { font-weight: 700; color: var(--cp-success, #22c55e); }
    .sfl-pay-date { display: flex; align-items: center; gap: 4px; color: var(--cp-muted, #64748b); }
    .sfl-receipt-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; background: var(--cp-surface2, #f8fafc); border: 1px solid var(--cp-border, #e2e8f0); border-radius: 6px; font-family: monospace; font-size: 11px; color: var(--cp-subtext, #475569); }
    .sfl-pay-remark { color: var(--cp-subtext, #475569); display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
    .sfl-timeline-card { background: var(--cp-surface, #ffffff); border: 1px solid var(--cp-border, #e2e8f0); border-radius: 12px; padding: 16px; }
    .sfl-timeline { display: flex; flex-direction: column; gap: 16px; }
    .sfl-tl-item { display: flex; gap: 12px; align-items: flex-start; }
    .sfl-tl-icon { width: 28px; height: 28px; border-radius: 50%; background: rgba(34, 197, 94, 0.1); color: var(--cp-success, #22c55e); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .sfl-tl-content { flex: 1; }
    .sfl-tl-amount { font-weight: 700; color: var(--cp-text, #0f172a); font-size: 13px; }
    .sfl-tl-meta { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--cp-muted, #64748b); margin-top: 2px; flex-wrap: wrap; }
    .sfl-tl-date { font-size: 11px; color: var(--cp-muted, #64748b); text-align: right; flex-shrink: 0; }
    .sfl-loader, .sfl-error-text { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: var(--cp-muted, #64748b); gap: 12px; }
    .sfl-spinner { width: 24px; height: 24px; border: 3px solid var(--cp-border, #e2e8f0); border-top-color: var(--sp-accent2, #1A56DB); border-radius: 50%; animation: sflSpin 0.8s linear infinite; }
    @keyframes sflSpin { to { transform: rotate(360deg); } }
    .animate-spin { animation: sflSpin 1s linear infinite; }
    
    /* NEW BUTTONS & INPUTS */
    .sfl-input-amount { width: 100px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--cp-border, #e2e8f0); font-size: 12px; text-align: right; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s; }
    .sfl-input-amount:focus { border-color: var(--sp-accent2, #1A56DB); }
    .sfl-pay-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 8px; background: var(--sp-accent2, #1A56DB); color: #fff; font-size: 12px; font-weight: 700; border: none; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
    .sfl-pay-btn:hover:not(:disabled) { opacity: 0.9; }
    .sfl-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .sfl-pay-full-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 4px 10px; border-radius: 6px; background: rgba(34, 197, 94, 0.1); color: var(--cp-success, #22c55e); font-size: 11px; font-weight: 700; border: 1px solid rgba(34, 197, 94, 0.2); cursor: pointer; transition: all 0.15s; white-space: nowrap; }
    .sfl-pay-full-btn:hover:not(:disabled) { background: rgba(34, 197, 94, 0.15); }
    .sfl-pay-full-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .sfl-download-btn { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; background: rgba(26, 86, 219, 0.1); color: var(--sp-accent2, #1A56DB); font-size: 11px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
    .sfl-download-btn:hover { background: rgba(26, 86, 219, 0.2); }
`;