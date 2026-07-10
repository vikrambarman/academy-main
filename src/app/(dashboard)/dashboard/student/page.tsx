// src/app/(dashboard)/dashboard/student/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";
import {
  BookOpen, IndianRupee, Award, TrendingUp,
  AlertCircle, CheckCircle2, Clock, ExternalLink,
  Receipt, GraduationCap, ChevronDown, ChevronUp,
  Shield, BadgeCheck,
} from "lucide-react";

// ── Types (unchanged) ──────────────────────────────────
interface Payment {
  amount: number;
  date: string;
  receiptNo: string;
  remark?: string;
}

interface Course {
  _id: string;
  name: string;
  authority?: string;
  verification?: string;
}

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
  benefits: string[];
}

interface CertRecord {
  status: "issued" | "pending" | "revoked";
  verifyUrl?: string;
}

interface Enrollment {
  _id: string;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
  payments: Payment[];
  course: Course;
  certificate?: CertRecord | null;
  franchise?: FranchiseData | null;
  certType?: CertTypeData | null;
  externalStudentId?: string | null;
}

interface DashboardData {
  student: {
    name: string;
    studentId: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    courseStatus: "active" | "completed" | "dropped";
  };
  enrollments: Enrollment[];
}

// ── Avatar ─────────────────────────────────────────────
function Avatar({
  name,
  src,
  size = 56,
}: {
  name?: string;
  src?: string;
  size?: number;
}) {
  return (
    <div className="sp-avatar" style={{ width: size, height: size }}>
      {src ? (
        <img src={`${src}?t=${Date.now()}`} alt={name} />
      ) : (
        <div
          className="sp-avatar-fallback"
          style={{ fontSize: size * 0.36 }}
        >
          {name?.charAt(0)?.toUpperCase() ?? "S"}
        </div>
      )}
    </div>
  );
}

// ── Status badge ────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { bg: string; color: string; dot: string; label: string }
  > = {
    active: {
      bg:    "rgb(26 86 219 / 0.12)",
      color: "var(--sp-accent2)",
      dot:   "var(--sp-accent)",
      label: "Active",
    },
    completed: {
      bg:    "rgb(34 197 94 / 0.12)",
      color: "#4ADE80",
      dot:   "#22C55E",
      label: "Completed",
    },
    dropped: {
      bg:    "rgb(245 158 11 / 0.12)",
      color: "#FCD34D",
      dot:   "#F59E0B",
      label: "Discontinued",
    },
  };

  const s = map[status] ?? map.active;

  return (
    <span
      className="sd-status-badge"
      style={{ background: s.bg, color: s.color }}
    >
      <span
        className="sd-status-badge__dot"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
}

// ── Cert badge ──────────────────────────────────────────
function CertBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();

  if (s === "certificate generated") {
    return (
      <span className="sd-cert-badge sd-cert-badge--issued">
        <CheckCircle2 size={11} /> Issued
      </span>
    );
  }

  if (s === "passed") {
    return (
      <span className="sd-cert-badge sd-cert-badge--passed">
        <CheckCircle2 size={11} /> Passed
      </span>
    );
  }

  if (s === "applied" || s === "exam given") {
    return (
      <span className="sd-cert-badge sd-cert-badge--pending">
        <Clock size={11} /> {status}
      </span>
    );
  }

  return (
    <span className="sd-cert-badge sd-cert-badge--default">
      <Award size={11} /> {status}
    </span>
  );
}

// ── Franchise strip ─────────────────────────────────────
function FranchiseStrip({
  franchise,
  certType,
  externalStudentId,
}: {
  franchise: FranchiseData;
  certType?: CertTypeData | null;
  externalStudentId?: string | null;
}) {
  const accentColor = franchise.isOwn
    ? "var(--sp-warn)"
    : "var(--sp-accent2)";

  return (
    <div
      className={`sd-franchise-strip ${
        franchise.isOwn
          ? "sd-franchise-strip--own"
          : "sd-franchise-strip--external"
      }`}
    >
      {/* Header */}
      <div className="sd-franchise-header">
        <span
          className="sd-franchise-code"
          style={{ background: accentColor }}
        >
          {franchise.code}
        </span>
        <span className="sd-franchise-name">{franchise.name}</span>
        {franchise.isOwn && (
          <span className="sd-franchise-own-tag">
            (Institute Certificate)
          </span>
        )}
      </div>

      {/* Registered bodies */}
      {franchise.registeredBodies.length > 0 && (
        <div className="sd-registered-bodies">
          {franchise.registeredBodies.map((b) => (
            <span key={b} className="sd-reg-body-pill">
              <BadgeCheck size={8} /> {b}
            </span>
          ))}
        </div>
      )}

      {/* Cert type box */}
      {certType && (
        <div className="sd-cert-type-box">
          <Award
            size={12}
            style={{ color: accentColor, flexShrink: 0, marginTop: 1 }}
          />
          <div>
            <div className="sd-cert-type-name">{certType.name}</div>
            <div className="sd-cert-type-meta">
              {certType.issuingBody}
              {certType.verificationMethod
                ? ` · ${certType.verificationMethod}`
                : ""}
            </div>
          </div>
        </div>
      )}

      {/* External ID */}
      {externalStudentId && (
        <div className="sd-external-id">
          <span style={{ color: "var(--sp-muted)", fontWeight: 600 }}>
            {franchise.code} ID:{" "}
          </span>
          <span
            style={{
              fontFamily: "var(--portal-font-mono)",
              color: "var(--sp-text)",
            }}
          >
            {externalStudentId}
          </span>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ══════════════════════════════════════════════════════
export default function StudentDashboard() {
  const [data,            setData]            = useState<DashboardData | null>(null);
  const [loading,         setLoading]         = useState(true);
  const [accountDisabled, setAccountDisabled] = useState(false);
  const [expandedCards,   setExpandedCards]   = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    fetchWithAuth("/api/student/profile")
      .then(async (res) => {
        if (res.status === 403) {
          setAccountDisabled(true);
          return;
        }
        const json = await res.json();
        if (json?.student) {
          setData(json);
        } else if (json?.name || json?.studentId) {
          setData({ student: json, enrollments: json.enrollments ?? [] });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleCard = (id: string) =>
    setExpandedCards((p) => ({ ...p, [id]: !p[id] }));

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="sd-loader">
        <div className="sd-spinner" />
        <span className="sd-loader-text">Loading your dashboard…</span>
      </div>
    );
  }

  // ── Account disabled ─────────────────────────────────
  if (accountDisabled) {
    return (
      <div style={{ maxWidth: 480, margin: "48px auto" }}>
        <div
          className="sd-banner sd-banner--warn"
          style={{ borderRadius: "var(--portal-radius-xl)", padding: 28 }}
        >
          <AlertCircle size={32} style={{ flexShrink: 0 }} />
          <div>
            <div
              style={{
                fontSize: "var(--portal-text-base)",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Account Deactivated
            </div>
            <div
              style={{
                fontSize: "var(--portal-text-sm)",
                color: "var(--sp-subtext)",
              }}
            >
              Your account has been deactivated. Please contact the academy.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── No data ──────────────────────────────────────────
  if (!data) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 0",
          fontSize: "var(--portal-text-sm)",
          color: "var(--sp-danger)",
        }}
      >
        Failed to load dashboard. Please refresh.
      </div>
    );
  }

  // ── Derived values ───────────────────────────────────
  const { student, enrollments: rawEnrollments } = data;
  const enrollments    = Array.isArray(rawEnrollments) ? rawEnrollments : [];
  const totalFees      = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
  const totalPaid      = enrollments.reduce((s, e) => s + (e.feesPaid  ?? 0), 0);
  const totalDue       = totalFees - totalPaid;
  const overallProgress =
    totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

  // ────────────────────────────────────────────────────
  return (
    <div className="sd-root">

      {/* Welcome hero */}
      <div className="sd-welcome">
        <div className="sd-welcome-left">
          <Avatar name={student.name} src={student.profileImage} size={52} />
          <div>
            <div className="sd-welcome-greeting">Welcome back</div>
            <h1 className="sd-welcome-name">{student.name}</h1>
            <div className="sd-welcome-meta">
              <span className="sd-welcome-id">ID · {student.studentId}</span>
              <StatusBadge status={student.courseStatus} />
            </div>
          </div>
        </div>
        <div className="sd-welcome-right">
          <div className="sd-welcome-stat-label">Fee Progress</div>
          <div className="sd-welcome-stat-val">
            {overallProgress.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Status banners */}
      {student.courseStatus === "completed" && (
        <div className="sd-banner sd-banner--success">
          <GraduationCap size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Congratulations! You have successfully completed your course.
          </span>
        </div>
      )}

      {student.courseStatus === "dropped" && (
        <div className="sd-banner sd-banner--warn">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Your course has been marked as discontinued. Please contact
            the academy.
          </span>
        </div>
      )}

      {/* Stat cards */}
      <div className="sd-stats">
        <div className="sd-stat-card blue">
          <div className="sd-stat-icon blue">
            <BookOpen size={16} />
          </div>
          <div className="sd-stat-label">Enrolled Courses</div>
          <div className="sd-stat-val">
            <CountUp end={enrollments.length} duration={1.2} />
          </div>
        </div>

        <div className="sd-stat-card green">
          <div className="sd-stat-icon green">
            <TrendingUp size={16} />
          </div>
          <div className="sd-stat-label">Total Paid</div>
          <div className="sd-stat-val green">
            ₹<CountUp end={totalPaid} separator="," duration={1.4} />
          </div>
        </div>

        <div className="sd-stat-card red">
          <div className="sd-stat-icon red">
            <IndianRupee size={16} />
          </div>
          <div className="sd-stat-label">Amount Due</div>
          <div className="sd-stat-val red">
            ₹<CountUp end={totalDue} separator="," duration={1.4} />
          </div>
        </div>
      </div>

      {/* Enrollments */}
      {enrollments.length === 0 ? (
        <div className="sd-empty">
          <div className="sd-empty-icon">
            <BookOpen size={22} />
          </div>
          <div className="sd-empty-title">No courses enrolled yet</div>
          <div className="sd-empty-sub">
            Your enrolled courses will appear here once the academy adds them.
          </div>
        </div>
      ) : (
        <>
          <div className="sd-section-title">
            <BookOpen size={13} />
            Enrolled Courses
          </div>

          {enrollments.map((e) => {
            const total    = e.feesTotal ?? 0;
            const paid     = e.feesPaid  ?? 0;
            const due      = total - paid;
            const progress = total > 0 ? (paid / total) * 100 : 0;
            const expanded = !!expandedCards[e._id];
            const sorted   = [...(e.payments ?? [])].sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const authorityDisplay = e.franchise
              ? e.franchise.name
              : e.course?.authority;

            const verifyUrl =
              e.certType?.verificationUrl ??
              e.certificate?.verifyUrl ??
              e.course?.verification;

            return (
              <div
                key={e._id}
                className={`sd-enroll-card ${expanded ? "expanded" : ""}`}
              >
                {/* Card header */}
                <div
                  className="sd-enroll-header"
                  onClick={() => toggleCard(e._id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="sd-course-name">{e.course?.name}</div>
                    <div
                      style={{
                        display:    "flex",
                        alignItems: "center",
                        gap:        6,
                        marginTop:  3,
                        flexWrap:   "wrap",
                      }}
                    >
                      {/* Franchise badge */}
                      {e.franchise ? (
                        <span
                          style={{
                            display:     "inline-flex",
                            alignItems:  "center",
                            gap:         4,
                            fontSize:    10,
                            fontWeight:  700,
                            padding:     "2px 8px",
                            borderRadius: "var(--portal-radius-full)",
                            background:  e.franchise.isOwn
                              ? "rgb(245 158 11 / 0.12)"
                              : "rgb(26 86 219 / 0.1)",
                            color: e.franchise.isOwn
                              ? "var(--sp-warn)"
                              : "var(--sp-accent2)",
                            border: `1px solid ${
                              e.franchise.isOwn
                                ? "rgb(245 158 11 / 0.25)"
                                : "rgb(26 86 219 / 0.2)"
                            }`,
                          }}
                        >
                          <Shield size={8} /> {e.franchise.code}
                        </span>
                      ) : authorityDisplay ? (
                        <span className="sd-course-auth">
                          {authorityDisplay}
                        </span>
                      ) : null}

                      {/* Cert type code */}
                      {e.certType && (
                        <span
                          style={{
                            fontSize:  10,
                            color:     "var(--sp-muted)",
                            fontWeight: 500,
                          }}
                        >
                          {e.certType.code}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sd-enroll-header-right">
                    <CertBadge status={e.certificateStatus} />
                    <button
                      className="sd-chevron-btn"
                      aria-label={expanded ? "Collapse" : "Expand"}
                    >
                      {expanded
                        ? <ChevronUp size={14} />
                        : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded body */}
                {expanded && (
                  <div className="sd-enroll-body">

                    {/* Franchise strip */}
                    {e.franchise && (
                      <FranchiseStrip
                        franchise={e.franchise}
                        certType={e.certType}
                        externalStudentId={e.externalStudentId}
                      />
                    )}

                    {/* Fee KPIs */}
                    <div className="sd-mini-kpi">
                      <div className="sd-mini-kpi-item">
                        <div className="sd-mini-kpi-label">Total Fees</div>
                        <div className="sd-mini-kpi-val">
                          ₹<CountUp end={total} separator="," duration={0.8} />
                        </div>
                      </div>
                      <div className="sd-mini-kpi-item">
                        <div className="sd-mini-kpi-label">Paid</div>
                        <div className="sd-mini-kpi-val green">
                          ₹<CountUp end={paid} separator="," duration={0.8} />
                        </div>
                      </div>
                      <div className="sd-mini-kpi-item">
                        <div className="sd-mini-kpi-label">Pending</div>
                        <div className="sd-mini-kpi-val red">
                          ₹<CountUp end={due} separator="," duration={0.8} />
                        </div>
                      </div>
                    </div>

                    {/* Fee progress */}
                    <div className="sd-progress-row">
                      <span className="sd-progress-label">Fee Progress</span>
                      <span className="sd-progress-pct">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="sd-progress-track">
                      <div
                        className="sd-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Certificate + verify */}
                    <div className="sd-cert-row">
                      <div>
                        <div className="sd-cert-label">Certificate Status</div>
                        <CertBadge status={e.certificateStatus} />
                      </div>
                      {verifyUrl && (
                        <a
                          href={verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sd-verify-link"
                        >
                          Verify Certificate <ExternalLink size={11} />
                        </a>
                      )}
                    </div>

                    {/* Payment history */}
                    <div className="sd-payments-title">
                      <Receipt size={12} /> Payment History
                    </div>

                    {sorted.length === 0 ? (
                      <div className="sd-no-payments">
                        No payments recorded yet.
                      </div>
                    ) : (
                      <div className="sd-payment-list">
                        {sorted.map((p, i) => (
                          <div key={i} className="sd-payment-row">
                            <div className="sd-payment-left">
                              <div className="sd-payment-icon">
                                <Receipt size={13} />
                              </div>
                              <div>
                                <div className="sd-payment-amount">
                                  ₹{p.amount.toLocaleString("en-IN")}
                                </div>
                                <div className="sd-payment-receipt">
                                  Receipt · {p.receiptNo}
                                </div>
                                {p.remark && (
                                  <div className="sd-payment-remark">
                                    {p.remark}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="sd-payment-date">
                              {new Date(p.date).toLocaleDateString("en-IN", {
                                day:   "numeric",
                                month: "short",
                                year:  "numeric",
                              })}
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
  );
}