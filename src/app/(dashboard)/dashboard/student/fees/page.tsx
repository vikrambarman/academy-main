// src/app/(dashboard)/dashboard/student/fees/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";
import {
    IndianRupee, Receipt, TrendingUp, AlertCircle,
    CheckCircle2, Clock, ChevronDown, ChevronUp,
    Calendar, BookOpen, Wallet, Shield,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────
interface Payment {
    amount: number;
    date: string;
    receiptNo: string;
    remark?: string;
}

interface Course {
    name?: string;
    authority?: string;
}

interface FranchiseData {
    _id: string;
    name: string;
    code: string;
    isOwn: boolean;
}

interface CertTypeData {
    _id: string;
    name: string;
    code: string;
    issuingBody: string;
}

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
function fmtINR(n: number) {
    return `₹${n.toLocaleString("en-IN")}`;
}

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// ── Payment status badge ─────────────────────────────────
function PaymentStatusBadge({ due }: { due: number }) {
    if (due === 0) {
        return (
            <span className="sfl-status-badge sfl-status-badge--paid">
                <CheckCircle2 size={10} /> Fully Paid
            </span>
        );
    }
    return (
        <span className="sfl-status-badge sfl-status-badge--due">
            <AlertCircle size={10} /> {fmtINR(due)} Due
        </span>
    );
}

// ══════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════
export default function StudentFeeLedger() {
    const [data, setData] = useState<FeeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchWithAuth("/api/student/profile")
            .then(async (r) => {
                const json = await r.json();

                // Handle both API response shapes
                let normalized: FeeData;
                if (json?.student) {
                    normalized = {
                        student: json.student,
                        enrollments: Array.isArray(json.enrollments)
                            ? json.enrollments
                            : [],
                    };
                } else {
                    normalized = {
                        student: json,
                        enrollments: Array.isArray(json.enrollments)
                            ? json.enrollments
                            : [],
                    };
                }

                setData(normalized);

                // Auto-expand first enrollment
                if (normalized.enrollments.length > 0) {
                    setExpanded({ [normalized.enrollments[0]._id]: true });
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const toggle = (id: string) =>
        setExpanded((p) => ({ ...p, [id]: !p[id] }));

    // ── Loading ──────────────────────────────────────────
    if (loading) {
        return (
            <div className="sfl-loader">
                <div className="sfl-spinner" />
                <span className="sfl-loader-text">Loading fee details…</span>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────
    if (!data) {
        return (
            <div className="sfl-error-text">
                Failed to load fee details. Please refresh.
            </div>
        );
    }

    // ── Derived values ───────────────────────────────────
    const { enrollments } = data;
    const totalFees = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
    const totalPaid = enrollments.reduce((s, e) => s + (e.feesPaid ?? 0), 0);
    const totalDue = totalFees - totalPaid;
    const overallPct = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

    // All payments sorted newest first (for timeline)
    const allPayments = enrollments
        .flatMap((e) =>
            (e.payments ?? []).map((p) => ({
                ...p,
                courseName: e.course?.name ?? "Course",
            }))
        )
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

    // ────────────────────────────────────────────────────
    return (
        <div className="sfl-root">

            {/* Page header */}
            <div className="sfl-page-header">
                <h1 className="sfl-page-title">
                    <Wallet size={22} style={{ color: "var(--sp-accent2)" }} />
                    Fee Ledger
                </h1>
                <p className="sfl-page-sub">
                    Complete overview of your fee payments and dues.
                </p>
            </div>

            {/* Summary stat cards */}
            <div className="sfl-summary">
                <div className="sfl-stat sfl-stat--blue">
                    <div className="sfl-stat-icon sfl-stat-icon--blue">
                        <BookOpen size={15} />
                    </div>
                    <div className="sfl-stat-label">Courses</div>
                    <div className="sfl-stat-val">
                        <CountUp end={enrollments.length} duration={1} />
                    </div>
                </div>

                <div className="sfl-stat sfl-stat--blue">
                    <div className="sfl-stat-icon sfl-stat-icon--blue">
                        <IndianRupee size={15} />
                    </div>
                    <div className="sfl-stat-label">Total Fees</div>
                    <div className="sfl-stat-val">
                        ₹<CountUp end={totalFees} separator="," duration={1.2} />
                    </div>
                </div>

                <div className="sfl-stat sfl-stat--green">
                    <div className="sfl-stat-icon sfl-stat-icon--green">
                        <TrendingUp size={15} />
                    </div>
                    <div className="sfl-stat-label">Total Paid</div>
                    <div className="sfl-stat-val sfl-stat-val--green">
                        ₹<CountUp end={totalPaid} separator="," duration={1.4} />
                    </div>
                </div>

                <div className="sfl-stat sfl-stat--red">
                    <div className="sfl-stat-icon sfl-stat-icon--red">
                        <AlertCircle size={15} />
                    </div>
                    <div className="sfl-stat-label">Amount Due</div>
                    <div className="sfl-stat-val sfl-stat-val--red">
                        ₹<CountUp end={totalDue} separator="," duration={1.4} />
                    </div>
                </div>
            </div>

            {/* Overall progress bar */}
            <div className="sfl-overall">
                <div className="sfl-overall-row">
                    <span className="sfl-overall-label">Overall Fee Progress</span>
                    <span className="sfl-overall-pct">
                        {overallPct.toFixed(0)}% paid
                    </span>
                </div>
                <div className="sfl-overall-track">
                    <div
                        className="sfl-overall-fill"
                        style={{ width: `${overallPct}%` }}
                    />
                </div>
            </div>

            {/* Course-wise ledger */}
            <div className="sfl-section-label">
                <Receipt size={13} /> Course-wise Ledger
            </div>

            {enrollments.length === 0 ? (
                <div className="sfl-empty">
                    <div className="sfl-empty-icon">
                        <BookOpen size={20} />
                    </div>
                    <div className="sfl-empty-text">No enrollments found.</div>
                </div>
            ) : (
                enrollments.map((e) => {
                    const total = e.feesTotal ?? 0;
                    const paid = e.feesPaid ?? 0;
                    const due = total - paid;
                    const pct = total > 0 ? (paid / total) * 100 : 0;
                    const isOpen = !!expanded[e._id];
                    const sorted = [...(e.payments ?? [])].sort(
                        (a, b) =>
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                    );

                    const authorityLabel = e.franchise?.name || e.course?.authority;

                    return (
                        <div
                            key={e._id}
                            className={`sfl-enrollment ${isOpen ? "open" : ""}`}
                        >
                            {/* Accordion header */}
                            <div
                                className="sfl-enroll-head"
                                onClick={() => toggle(e._id)}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="sfl-course-name">
                                        {e.course?.name ?? "Course"}
                                    </div>

                                    {/* Badges row */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                            marginTop: 3,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {/* Franchise badge */}
                                        {e.franchise ? (
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    padding: "2px 8px",
                                                    borderRadius: "var(--portal-radius-full)",
                                                    background: e.franchise.isOwn
                                                        ? "rgb(245 158 11 / 0.12)"
                                                        : "rgb(26 86 219 / 0.1)",
                                                    color: e.franchise.isOwn
                                                        ? "var(--sp-warn)"
                                                        : "var(--sp-accent2)",
                                                    border: `1px solid ${e.franchise.isOwn
                                                            ? "rgb(245 158 11 / 0.25)"
                                                            : "rgb(26 86 219 / 0.2)"
                                                        }`,
                                                }}
                                            >
                                                <Shield size={8} /> {e.franchise.code}
                                            </span>
                                        ) : authorityLabel ? (
                                            <span className="sfl-course-auth">
                                                {authorityLabel}
                                            </span>
                                        ) : null}

                                        {/* Cert type code */}
                                        {e.certType && (
                                            <span
                                                style={{
                                                    fontSize: 10,
                                                    color: "var(--sp-muted)",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {e.certType.code}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="sfl-enroll-head-right">
                                    <PaymentStatusBadge due={due} />
                                    <button
                                        className="sfl-chevron"
                                        aria-label="Toggle details"
                                    >
                                        {isOpen
                                            ? <ChevronUp size={14} />
                                            : <ChevronDown size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded content */}
                            {isOpen && (
                                <div className="sfl-enroll-body">

                                    {/* Franchise info strip */}
                                    {e.franchise && (
                                        <div
                                            className={`sfl-franchise-strip ${e.franchise.isOwn
                                                    ? "sfl-franchise-strip--own"
                                                    : "sfl-franchise-strip--external"
                                                }`}
                                        >
                                            <Shield
                                                size={13}
                                                style={{
                                                    color: e.franchise.isOwn
                                                        ? "var(--sp-warn)"
                                                        : "var(--sp-accent2)",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <span className="sfl-franchise-name">
                                                    {e.franchise.name}
                                                </span>
                                                {e.certType && (
                                                    <span className="sfl-franchise-cert">
                                                        {" "}· {e.certType.name}
                                                    </span>
                                                )}
                                            </div>
                                            {e.externalStudentId && (
                                                <span className="sfl-franchise-id">
                                                    {e.franchise.code} ID:{" "}
                                                    <span className="sfl-franchise-id-mono">
                                                        {e.externalStudentId}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Fee KPIs */}
                                    <div className="sfl-fee-grid">
                                        <div className="sfl-fee-cell">
                                            <div className="sfl-fee-cell-label">Total Fees</div>
                                            <div className="sfl-fee-cell-val">
                                                ₹{total.toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                        <div className="sfl-fee-cell">
                                            <div className="sfl-fee-cell-label">Paid</div>
                                            <div className="sfl-fee-cell-val sfl-fee-cell-val--green">
                                                ₹{paid.toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                        <div className="sfl-fee-cell">
                                            <div className="sfl-fee-cell-label">Remaining</div>
                                            <div
                                                className={`sfl-fee-cell-val ${due > 0
                                                        ? "sfl-fee-cell-val--red"
                                                        : "sfl-fee-cell-val--green"
                                                    }`}
                                            >
                                                ₹{due.toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="sfl-prog-row">
                                        <span className="sfl-prog-lbl">Fee Progress</span>
                                        <span className="sfl-prog-pct">{pct.toFixed(0)}%</span>
                                    </div>
                                    <div className="sfl-prog-track">
                                        <div
                                            className="sfl-prog-fill"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>

                                    {/* Payment records */}
                                    <div className="sfl-pay-title">
                                        <Receipt size={11} />
                                        Payment Records ({sorted.length})
                                    </div>

                                    {sorted.length === 0 ? (
                                        <div className="sfl-no-pay">
                                            No payments recorded yet.
                                        </div>
                                    ) : (
                                        <div className="sfl-pay-table">
                                            {/* Table header */}
                                            <div className="sfl-pay-thead">
                                                <span>Amount</span>
                                                <span>Date</span>
                                                <span>Receipt No.</span>
                                                <span>Remark</span>
                                            </div>

                                            {/* Table rows */}
                                            {sorted.map((p, i) => (
                                                <div key={i} className="sfl-pay-row">
                                                    <div className="sfl-pay-amount">
                                                        {fmtINR(p.amount)}
                                                    </div>
                                                    <div className="sfl-pay-date">
                                                        <Calendar size={10} />
                                                        {fmtDate(p.date)}
                                                    </div>
                                                    <div>
                                                        <span className="sfl-receipt-pill">
                                                            <Receipt size={9} /> {p.receiptNo}
                                                        </span>
                                                    </div>
                                                    <div className="sfl-pay-remark">
                                                        {p.remark || "—"}
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

            {/* Recent activity timeline */}
            {allPayments.length > 0 && (
                <div>
                    <div className="sfl-section-label">
                        <Clock size={13} /> Recent Payment Activity
                    </div>

                    <div className="sfl-timeline-card">
                        <div className="sfl-timeline">
                            {allPayments.slice(0, 8).map((p, i) => (
                                <div key={i} className="sfl-tl-item">
                                    <div className="sfl-tl-icon">
                                        <IndianRupee size={14} />
                                    </div>

                                    <div className="sfl-tl-content">
                                        <div className="sfl-tl-amount">{fmtINR(p.amount)}</div>
                                        <div className="sfl-tl-meta">
                                            <span>{p.courseName}</span>
                                            <span className="sfl-receipt-pill">
                                                <Receipt size={9} /> {p.receiptNo}
                                            </span>
                                            {p.remark && (
                                                <span style={{ color: "var(--sp-muted)" }}>
                                                    {p.remark}
                                                </span>
                                            )}
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
    );
}