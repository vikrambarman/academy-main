// src/app/(dashboard)/dashboard/student/attendance/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  CheckCircle2, XCircle, Clock, Coffee, CalendarDays,
  ChevronLeft, ChevronRight, QrCode, Edit3,
  LogIn, LogOut, UserX,
} from "lucide-react";

// ── Types — model se exactly match ──────────────────────
// Model: "present" | "absent" | "late" | "holiday" | "leave"
type AttStatus = "present" | "absent" | "late" | "holiday" | "leave";

interface AttRecord {
  date:       string;
  status:     AttStatus;
  remark:     string;
  inTime?:    string;   // "HH:MM"
  outTime?:   string;   // "HH:MM"
  markedVia?: "qr" | "manual";
}

interface AttStats {
  total:      number;
  present:    number;
  absent:     number;
  late:       number;
  holiday:    number;
  leave?:     number;   // new field — optional for backward compat
  percentage: number;
}

interface CourseAtt {
  enrollmentId: string;
  courseName:   string;
  stats:        AttStats;
  records:      AttRecord[];
}

// ── Status config — "leave" added ───────────────────────
const STATUS_CFG: Record<
  AttStatus,
  {
    label:  string;
    color:  string;
    bg:     string;
    border: string;
    icon:   any;
  }
> = {
  present: {
    label:  "Present",
    color:  "var(--sp-success)",
    bg:     "rgb(34 197 94 / 0.1)",
    border: "rgb(34 197 94 / 0.25)",
    icon:   CheckCircle2,
  },
  absent: {
    label:  "Absent",
    color:  "var(--sp-danger)",
    bg:     "rgb(239 68 68 / 0.1)",
    border: "rgb(239 68 68 / 0.25)",
    icon:   XCircle,
  },
  late: {
    label:  "Late",
    color:  "var(--sp-warn)",
    bg:     "rgb(245 158 11 / 0.1)",
    border: "rgb(245 158 11 / 0.25)",
    icon:   Clock,
  },
  holiday: {
    label:  "Holiday",
    color:  "var(--sp-accent2)",
    bg:     "var(--sp-active-bg)",
    border: "var(--sp-border2)",
    icon:   Coffee,
  },
  // ✅ NEW — model me "leave" add hua
  leave: {
    label:  "Leave",
    color:  "rgb(168 85 247)",     /* purple-500 */
    bg:     "rgb(168 85 247 / 0.1)",
    border: "rgb(168 85 247 / 0.25)",
    icon:   UserX,
  },
};

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

// ── Helpers ─────────────────────────────────────────────
function groupByMonth(records: AttRecord[]) {
  const map: Record<string, AttRecord[]> = {};

  for (const r of records) {
    const d   = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    if (!map[key]) map[key] = [];
    map[key].push(r);
  }

  return Object.entries(map)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, recs]) => {
      const year  = parseInt(key.split("-")[0]);
      const month = parseInt(key.split("-")[1]);
      recs.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return {
        year,
        month,
        label:   `${MONTH_NAMES[month]} ${year}`,
        records: recs,
      };
    });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day:     "numeric",
    month:   "short",
    year:    "numeric",
  });
}

function calcDuration(inTime?: string, outTime?: string): string {
  if (!inTime || !outTime) return "—";
  const [inH, inM]   = inTime.split(":").map(Number);
  const [outH, outM] = outTime.split(":").map(Number);
  const diff          = outH * 60 + outM - (inH * 60 + inM);
  if (diff <= 0) return "—";
  const hours = Math.floor(diff / 60);
  const mins  = diff % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Percentage → color tokens
function pctStyle(pct: number) {
  if (pct >= 75) return {
    color:  "var(--sp-success)",
    bg:     "rgb(34 197 94 / 0.08)",
    border: "rgb(34 197 94 / 0.2)",
  };
  if (pct >= 50) return {
    color:  "var(--sp-warn)",
    bg:     "rgb(245 158 11 / 0.08)",
    border: "rgb(245 158 11 / 0.2)",
  };
  return {
    color:  "var(--sp-danger)",
    bg:     "rgb(239 68 68 / 0.08)",
    border: "rgb(239 68 68 / 0.2)",
  };
}

// ── Stat card keys to show ───────────────────────────────
// Model me "leave" bhi hai — show karte hain agar > 0 ho
const STAT_KEYS: AttStatus[] = ["present", "absent", "late", "holiday", "leave"];

// ══════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════
export default function StudentAttendancePage() {
  const [data,    setData]    = useState<CourseAtt[]>([]);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState(0);
  const [month,   setMonth]   = useState(0);

  useEffect(() => {
    fetchWithAuth("/api/student/attendance")
      .then((r) => r.json())
      .then((d) => setData(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="sap-loader">
        <div className="sap-spinner" />
        <span className="sap-loader-text">
          Loading attendance…
        </span>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────
  if (!data.length) {
    return (
      <div className="sap-empty-state">
        <CalendarDays size={40} className="sap-empty-icon" />
        <div className="sap-empty-title">No attendance records</div>
        <div className="sap-empty-sub">
          Abhi tak koi attendance mark nahi hui hai
        </div>
      </div>
    );
  }

  // ── Derived values ───────────────────────────────────
  const course   = data[active];
  const months   = groupByMonth(course.records);
  const curMonth = months[month] ?? null;
  const pct      = course.stats.percentage;
  const style    = pctStyle(pct);

  // SVG ring constants
  const R             = 36;
  const circumference = 2 * Math.PI * R;
  const dashOffset    = circumference * (1 - pct / 100);

  // ────────────────────────────────────────────────────
  return (
    <div className="sap-root">

      {/* Page header */}
      <div className="sap-page-header">
        <h1 className="sap-title">My Attendance</h1>
        <p className="sap-sub">
          Course-wise attendance aur detailed records dekho
        </p>
      </div>

      {/* Course tabs — only when multiple enrollments */}
      {data.length > 1 && (
        <div className="sap-tabs">
          {data.map((c, i) => (
            <button
              key={c.enrollmentId}
              className={`sap-tab ${active === i ? "active" : ""}`}
              onClick={() => { setActive(i); setMonth(0); }}
            >
              {c.courseName}
            </button>
          ))}
        </div>
      )}

      {/* ── Summary section ── */}
      <div className="sap-summary">

        {/* Circular ring card */}
        <div
          className="sap-ring-card"
          style={{
            borderColor: style.border,
            background:  style.bg,
          }}
        >
          {/* SVG Ring */}
          <div className="sap-ring-wrap">
            <svg
              className="sap-ring-svg"
              width="100"
              height="100"
              viewBox="0 0 100 100"
            >
              {/* Track */}
              <circle
                cx="50" cy="50" r={R}
                fill="none"
                stroke={style.color}
                strokeWidth="9"
                strokeOpacity="0.15"
              />
              {/* Fill */}
              <circle
                cx="50" cy="50" r={R}
                fill="none"
                stroke={style.color}
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="sap-ring-fill"
              />
            </svg>
            <div className="sap-ring-center">
              <span
                className="sap-ring-pct"
                style={{ color: style.color }}
              >
                {pct}%
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="sap-ring-info">
            <div className="sap-ring-label">Overall Attendance</div>
            <div className="sap-ring-course">{course.courseName}</div>
            <div className="sap-ring-total">
              {course.stats.total} total classes
            </div>
            {pct < 75 && (
              <div className="sap-warn-pill">
                ⚠ Below 75% — attend more classes
              </div>
            )}
          </div>
        </div>

        {/* Stat cards grid */}
        <div className="sap-stat-grid">
          {STAT_KEYS.map((s) => {
            const cfg   = STATUS_CFG[s];
            const Icon  = cfg.icon;

            // Leave count — handle optional field
            const count =
              s === "leave"
                ? (course.stats.leave ?? 0)
                : (course.stats[s] as number);

            // Hide leave card if count is 0 and no leave records
            if (s === "leave" && count === 0) return null;

            return (
              <div
                key={s}
                className="sap-stat-card"
                style={{
                  borderColor: cfg.border,
                  background:  cfg.bg,
                }}
              >
                <Icon size={15} color={cfg.color} />
                <div
                  className="sap-stat-val"
                  style={{ color: cfg.color }}
                >
                  {count}
                </div>
                <div className="sap-stat-label">{cfg.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Records section ── */}
      {months.length === 0 ? (
        <div className="sap-no-records">
          <CalendarDays size={22} style={{ opacity: 0.3 }} />
          Abhi tak koi record nahi
        </div>
      ) : (
        <div className="sap-records-card">

          {/* Month navigator */}
          <div className="sap-month-nav">
            <button
              className="sap-nav-btn"
              disabled={month === 0}
              onClick={() => setMonth((m) => m - 1)}
              aria-label="Previous month"
            >
              <ChevronLeft size={15} />
            </button>

            <div className="sap-month-label">
              <CalendarDays size={13} color="var(--sp-accent2)" />
              {curMonth?.label}
            </div>

            <button
              className="sap-nav-btn"
              disabled={month === months.length - 1}
              onClick={() => setMonth((m) => m + 1)}
              aria-label="Next month"
            >
              <ChevronRight size={15} />
            </button>

            <span className="sap-month-count">
              {curMonth?.records.length ?? 0} days
            </span>
          </div>

          {/* Month chips — mini summary */}
          {curMonth && (
            <div className="sap-month-chips">
              {(Object.keys(STATUS_CFG) as AttStatus[]).map((s) => {
                const cnt = curMonth.records.filter(
                  (r) => r.status === s
                ).length;
                if (!cnt) return null;
                return (
                  <span
                    key={s}
                    className="sap-chip"
                    style={{
                      color:       STATUS_CFG[s].color,
                      background:  STATUS_CFG[s].bg,
                      borderColor: STATUS_CFG[s].border,
                    }}
                  >
                    {cnt} {STATUS_CFG[s].label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Table header */}
          <div className="sap-thead">
            <span>Date</span>
            <span>Status</span>
            <span>In → Out</span>
            <span>Duration</span>
            <span>Marked Via</span>
          </div>

          {/* Table rows */}
          {!curMonth || curMonth.records.length === 0 ? (
            <div className="sap-no-records">
              <CalendarDays size={18} style={{ opacity: 0.3 }} />
              Is month mein koi record nahi
            </div>
          ) : (
            curMonth.records.map((rec, i) => {
              const cfg      = STATUS_CFG[rec.status] ?? STATUS_CFG.absent;
              const Icon     = cfg.icon;
              const duration = calcDuration(rec.inTime, rec.outTime);

              return (
                <div key={i} className="sap-row">

                  {/* Date */}
                  <div className="sap-col-date">
                    {fmtDate(rec.date)}
                  </div>

                  {/* Status */}
                  <span
                    className="sap-col-status"
                    style={{
                      color:       cfg.color,
                      background:  cfg.bg,
                      borderColor: cfg.border,
                    }}
                  >
                    <Icon size={10} />
                    {cfg.label}
                  </span>

                  {/* In → Out */}
                  <div className="sap-col-time">
                    {rec.inTime || rec.outTime ? (
                      <div className="sap-time-row">
                        <span className="sap-time-in">
                          <LogIn
                            size={11}
                            style={{ opacity: 0.5 }}
                          />
                          {rec.inTime || "—"}
                        </span>
                        <span className="sap-time-arrow">→</span>
                        <span className="sap-time-out">
                          <LogOut
                            size={11}
                            style={{ opacity: 0.5 }}
                          />
                          {rec.outTime || "—"}
                        </span>
                      </div>
                    ) : (
                      <span className="sap-dash">—</span>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="sap-col-duration">
                    {duration !== "—" ? (
                      <span className="sap-duration-badge">
                        {duration}
                      </span>
                    ) : (
                      <span className="sap-dash">—</span>
                    )}
                  </div>

                  {/* Marked Via */}
                  <div className="sap-col-marked">
                    {rec.markedVia === "qr" ? (
                      <span className="sap-marked-badge sap-marked-badge--qr">
                        <QrCode size={10} /> QR
                      </span>
                    ) : rec.markedVia === "manual" ? (
                      <span className="sap-marked-badge sap-marked-badge--manual">
                        <Edit3 size={10} /> Manual
                      </span>
                    ) : (
                      <span className="sap-dash">—</span>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}