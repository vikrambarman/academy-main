// app/dashboard/student/attendance/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    CheckCircle2, XCircle, Clock, Sun,
    CalendarDays, TrendingUp, AlertCircle, BookOpen
} from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
type AttendanceStatus = "present" | "absent" | "late" | "holiday";

interface AttendanceRecord {
    date: string;
    status: AttendanceStatus;
    remark?: string;
}

interface AttendanceDoc {
    _id: string;
    course: { name?: string; authority?: string; duration?: string; };
    records: AttendanceRecord[];
    stats: {
        total: number; present: number; absent: number;
        late: number; holiday: number; percentage: number;
    };
}

/* ─── Helpers ────────────────────────────────────── */
const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; bg: string; border: string; icon: any }> = {
    present: { label: "Present", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle2 },
    absent:  { label: "Absent",  color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: XCircle      },
    late:    { label: "Late",    color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: Clock        },
    holiday: { label: "Holiday", color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe", icon: Sun          },
};

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtDay(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { weekday: "short" });
}

function getPctColor(pct: number) {
    if (pct >= 75) return "#15803d";
    if (pct >= 50) return "#d97706";
    return "#dc2626";
}

/* ─── Mini calendar ──────────────────────────────── */
function MonthCalendar({ records, month, year }: {
    records: AttendanceRecord[]; month: number; year: number;
}) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay    = new Date(year, month, 1).getDay(); // 0=Sun
    const cells       = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
        i < firstDay ? null : i - firstDay + 1
    );

    const recordMap: Record<number, AttendanceStatus> = {};
    records.forEach(r => {
        const d = new Date(r.date);
        if (d.getFullYear() === year && d.getMonth() === month)
            recordMap[d.getDate()] = r.status;
    });

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 4 }}>
                {["S","M","T","W","T","F","S"].map((d, i) => (
                    <div key={i} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: "#94a3b8", padding: "2px 0" }}>{d}</div>
                ))}
            </div>
            {/* Day cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const status = recordMap[day];
                    const cfg    = status ? STATUS_CONFIG[status] : null;
                    return (
                        <div
                            key={i}
                            title={status ? `${fmtDate(new Date(year, month, day).toISOString())} — ${STATUS_CONFIG[status].label}` : undefined}
                            style={{
                                aspectRatio: "1", borderRadius: 6, display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 10, fontWeight: 600,
                                background: cfg ? cfg.bg : "#f8fafc",
                                color:      cfg ? cfg.color : "#cbd5e1",
                                border:     `1px solid ${cfg ? cfg.border : "#f1f5f9"}`,
                                cursor:     cfg ? "default" : "default",
                            }}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */
export default function StudentAttendance() {
    const [docs,       setDocs]       = useState<AttendanceDoc[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [activeDoc,  setActiveDoc]  = useState<string | null>(null);
    const [calMonth,   setCalMonth]   = useState(() => {
        const n = new Date(); return { month: n.getMonth(), year: n.getFullYear() };
    });

    useEffect(() => {
        fetchWithAuth("/api/student/attendance")
            .then(r => r.json())
            .then(d => {
                const list = d.attendance ?? [];
                setDocs(list);
                if (list.length > 0) setActiveDoc(list[0]._id);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const activeData = docs.find(d => d._id === activeDoc);
    const sortedRecords = activeData
        ? [...activeData.records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : [];

    if (loading) return (
        <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, border: "3px solid #dbeafe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spSpin 0.7s linear infinite" }} />
            <style>{`@keyframes spSpin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading attendance…</span>
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                .sa-root * { box-sizing: border-box; }
                .sa-root { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; }

                .sa-page-title {
                    font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #0f172a;
                    display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
                }
                .sa-page-sub { font-size: 13px; color: #64748b; font-weight: 300; margin-bottom: 22px; }

                /* ── Course tabs ── */
                .sa-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }

                .sa-tab {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px; font-weight: 600;
                    padding: 8px 16px; border-radius: 10px; cursor: pointer;
                    border: 1px solid #e0effe; background: #fff; color: #64748b;
                    transition: all 0.15s; white-space: nowrap;
                }
                .sa-tab:hover  { background: #f0f9ff; border-color: #bfdbfe; color: #2563eb; }
                .sa-tab.active { background: #2563eb; border-color: #2563eb; color: #fff; }

                /* ── Stats row ── */
                .sa-stats {
                    display: grid; grid-template-columns: repeat(5, 1fr);
                    gap: 10px; margin-bottom: 20px;
                }

                .sa-stat {
                    background: #fff; border: 1px solid #e0effe;
                    border-radius: 13px; padding: 14px 16px;
                    position: relative; overflow: hidden;
                }

                .sa-stat::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0;
                    height: 3px; border-radius: 13px 13px 0 0;
                }

                .sa-stat.blue::before   { background: linear-gradient(90deg,#2563eb,#60a5fa); }
                .sa-stat.green::before  { background: linear-gradient(90deg,#059669,#34d399); }
                .sa-stat.red::before    { background: linear-gradient(90deg,#dc2626,#f87171); }
                .sa-stat.amber::before  { background: linear-gradient(90deg,#d97706,#fbbf24); }
                .sa-stat.purple::before { background: linear-gradient(90deg,#6d28d9,#a78bfa); }

                .sa-stat-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
                .sa-stat-icon.blue   { background: #eff6ff; color: #2563eb; }
                .sa-stat-icon.green  { background: #f0fdf4; color: #059669; }
                .sa-stat-icon.red    { background: #fef2f2; color: #dc2626; }
                .sa-stat-icon.amber  { background: #fffbeb; color: #d97706; }
                .sa-stat-icon.purple { background: #f5f3ff; color: #6d28d9; }

                .sa-stat-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
                .sa-stat-val   { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: #0f172a; }

                /* ── Layout grid ── */
                .sa-grid {
                    display: grid; grid-template-columns: 1fr 320px;
                    gap: 14px; align-items: start;
                }

                /* ── Card shell ── */
                .sa-card {
                    background: #fff; border: 1px solid #e0effe;
                    border-radius: 14px; overflow: hidden;
                }

                .sa-card-head {
                    padding: 14px 18px; border-bottom: 1px solid #f0f7ff;
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;
                }

                .sa-card-title {
                    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
                    text-transform: uppercase; color: #475569;
                    display: flex; align-items: center; gap: 7px;
                }

                .sa-card-title-icon {
                    width: 26px; height: 26px; border-radius: 7px;
                    background: #eff6ff; display: flex; align-items: center;
                    justify-content: center; color: #2563eb;
                }

                .sa-card-body { padding: 16px 18px; }

                /* ── Percentage ring ── */
                .sa-pct-wrap {
                    display: flex; flex-direction: column; align-items: center;
                    padding: 20px 0 16px;
                }

                .sa-pct-ring { position: relative; width: 110px; height: 110px; margin-bottom: 12px; }

                .sa-pct-ring svg { transform: rotate(-90deg); }

                .sa-pct-label {
                    position: absolute; inset: 0;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                }

                .sa-pct-num {
                    font-family: 'DM Serif Display', serif;
                    font-size: 1.6rem; line-height: 1;
                }

                .sa-pct-sub { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; margin-top: 2px; }

                /* attendance threshold note */
                .sa-threshold {
                    font-size: 11px; font-weight: 500; text-align: center;
                    padding: 8px 14px; border-radius: 8px; width: 100%;
                }

                /* ── Legend ── */
                .sa-legend { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }

                .sa-legend-row {
                    display: flex; align-items: center; justify-content: space-between;
                    font-size: 12px;
                }

                .sa-legend-left { display: flex; align-items: center; gap: 7px; color: #475569; }

                .sa-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

                .sa-legend-count { font-weight: 700; color: #0f172a; }

                /* ── Month nav ── */
                .sa-month-nav {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 12px;
                }

                .sa-month-label { font-size: 12px; font-weight: 700; color: #0f172a; }

                .sa-month-btn {
                    width: 26px; height: 26px; border-radius: 7px;
                    border: 1px solid #e0effe; background: transparent;
                    cursor: pointer; display: flex; align-items: center;
                    justify-content: center; color: #64748b; font-size: 13px;
                    transition: background 0.15s;
                }

                .sa-month-btn:hover { background: #eff6ff; color: #2563eb; }

                /* ── Records list ── */
                .sa-records { display: flex; flex-direction: column; gap: 0; }

                .sa-record-row {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 0; border-bottom: 1px solid #f0f7ff;
                    transition: background 0.12s;
                }

                .sa-record-row:last-child { border-bottom: none; }

                .sa-record-date-wrap { flex-shrink: 0; text-align: center; width: 44px; }
                .sa-record-day  { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #94a3b8; }
                .sa-record-date { font-size: 13px; font-weight: 700; color: #0f172a; }
                .sa-record-month { font-size: 9px; color: #94a3b8; }

                .sa-record-status {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px;
                }

                .sa-record-remark { font-size: 11px; color: #94a3b8; margin-left: auto; font-style: italic; }

                /* ── Empty ── */
                .sa-empty {
                    background: #fff; border: 1px solid #e0effe; border-radius: 14px;
                    padding: 48px 24px; text-align: center;
                }
                .sa-empty-icon { width: 48px; height: 48px; background: #eff6ff; border-radius: 13px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: #2563eb; }
                .sa-empty-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 5px; }
                .sa-empty-sub   { font-size: 12px; color: #94a3b8; }

                /* ── Filter chips ── */
                .sa-filter-chips { display: flex; gap: 5px; flex-wrap: wrap; }

                .sa-chip {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
                    padding: 4px 10px; border-radius: 100px; cursor: pointer;
                    border: 1px solid #e0effe; background: #fff; color: #64748b;
                    transition: all 0.14s;
                }
                .sa-chip:hover { border-color: #bfdbfe; color: #2563eb; }
                .sa-chip.active { border-color: transparent; }

                @media (max-width: 768px) {
                    .sa-grid  { grid-template-columns: 1fr; }
                    .sa-stats { grid-template-columns: repeat(3,1fr); }
                    .sa-stats > :nth-child(4),
                    .sa-stats > :nth-child(5) { grid-column: span 1; }
                }

                @media (max-width: 480px) {
                    .sa-stats { grid-template-columns: 1fr 1fr; }
                }
            `}</style>

            <div className="sa-root">

                {/* Header */}
                <div className="sa-page-title">
                    <CalendarDays size={22} style={{ color: "#2563eb" }} />
                    Attendance
                </div>
                <div className="sa-page-sub">Track your daily attendance across all enrolled courses.</div>

                {docs.length === 0 ? (
                    <div className="sa-empty">
                        <div className="sa-empty-icon"><CalendarDays size={22} /></div>
                        <div className="sa-empty-title">No attendance records yet</div>
                        <div className="sa-empty-sub">Your attendance will appear here once the academy starts marking it.</div>
                    </div>
                ) : (
                    <>
                        {/* Course tabs */}
                        {docs.length > 1 && (
                            <div className="sa-tabs">
                                {docs.map(d => (
                                    <button
                                        key={d._id}
                                        className={`sa-tab ${activeDoc === d._id ? "active" : ""}`}
                                        onClick={() => setActiveDoc(d._id)}
                                    >
                                        {d.course?.name ?? "Course"}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeData && (() => {
                            const { stats } = activeData;
                            const pctColor  = getPctColor(stats.percentage);
                            const radius    = 46;
                            const circ      = 2 * Math.PI * radius;
                            const dash      = (stats.percentage / 100) * circ;

                            return (
                                <>
                                    {/* Stats */}
                                    <div className="sa-stats">
                                        {[
                                            { label:"Total Days",  val: stats.total,      color:"blue",   Icon: CalendarDays },
                                            { label:"Present",     val: stats.present,    color:"green",  Icon: CheckCircle2 },
                                            { label:"Absent",      val: stats.absent,     color:"red",    Icon: XCircle      },
                                            { label:"Late",        val: stats.late,       color:"amber",  Icon: Clock        },
                                            { label:"Holidays",    val: stats.holiday,    color:"purple", Icon: Sun          },
                                        ].map(({ label, val, color, Icon }) => (
                                            <div key={label} className={`sa-stat ${color}`}>
                                                <div className={`sa-stat-icon ${color}`}><Icon size={14} /></div>
                                                <div className="sa-stat-label">{label}</div>
                                                <div className="sa-stat-val">{val}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Main grid */}
                                    <div className="sa-grid">

                                        {/* Left — records */}
                                        <div className="sa-card">
                                            <div className="sa-card-head">
                                                <div className="sa-card-title">
                                                    <div className="sa-card-title-icon"><CalendarDays size={13} /></div>
                                                    Attendance Records
                                                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
                                                        ({sortedRecords.length} entries)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="sa-card-body">
                                                {sortedRecords.length === 0 ? (
                                                    <div style={{ textAlign: "center", padding: "24px 0", fontSize: 13, color: "#94a3b8" }}>
                                                        No records for this course yet.
                                                    </div>
                                                ) : (
                                                    <div className="sa-records">
                                                        {sortedRecords.map((r, i) => {
                                                            const cfg = STATUS_CONFIG[r.status];
                                                            const Icon = cfg.icon;
                                                            const d = new Date(r.date);
                                                            return (
                                                                <div key={i} className="sa-record-row">
                                                                    <div className="sa-record-date-wrap">
                                                                        <div className="sa-record-day">{fmtDay(r.date)}</div>
                                                                        <div className="sa-record-date">{d.getDate()}</div>
                                                                        <div className="sa-record-month">
                                                                            {d.toLocaleString("en-IN", { month: "short" })} {d.getFullYear()}
                                                                        </div>
                                                                    </div>
                                                                    <span
                                                                        className="sa-record-status"
                                                                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                                                                    >
                                                                        <Icon size={11} /> {cfg.label}
                                                                    </span>
                                                                    {r.remark && <span className="sa-record-remark">{r.remark}</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right column */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                                            {/* Percentage ring card */}
                                            <div className="sa-card">
                                                <div className="sa-card-head">
                                                    <div className="sa-card-title">
                                                        <div className="sa-card-title-icon"><TrendingUp size={13} /></div>
                                                        Attendance %
                                                    </div>
                                                </div>
                                                <div className="sa-card-body">
                                                    <div className="sa-pct-wrap">
                                                        <div className="sa-pct-ring">
                                                            <svg width="110" height="110" viewBox="0 0 110 110">
                                                                <circle cx="55" cy="55" r={radius} fill="none" stroke="#e0effe" strokeWidth="10" />
                                                                <circle
                                                                    cx="55" cy="55" r={radius} fill="none"
                                                                    stroke={pctColor} strokeWidth="10"
                                                                    strokeDasharray={`${dash} ${circ}`}
                                                                    strokeLinecap="round"
                                                                    style={{ transition: "stroke-dasharray 1s ease" }}
                                                                />
                                                            </svg>
                                                            <div className="sa-pct-label">
                                                                <span className="sa-pct-num" style={{ color: pctColor }}>
                                                                    {stats.percentage}%
                                                                </span>
                                                                <span className="sa-pct-sub">attended</span>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="sa-threshold"
                                                            style={{
                                                                background: stats.percentage >= 75 ? "#f0fdf4" : "#fef2f2",
                                                                color:      stats.percentage >= 75 ? "#15803d" : "#dc2626",
                                                                border:     `1px solid ${stats.percentage >= 75 ? "#bbf7d0" : "#fecaca"}`,
                                                            }}
                                                        >
                                                            {stats.percentage >= 75
                                                                ? "✓ Above 75% — Good standing"
                                                                : "⚠ Below 75% — Needs attention"
                                                            }
                                                        </div>
                                                    </div>

                                                    {/* Legend */}
                                                    <div className="sa-legend">
                                                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                                            <div key={key} className="sa-legend-row">
                                                                <div className="sa-legend-left">
                                                                    <div className="sa-legend-dot" style={{ background: cfg.color }} />
                                                                    <span>{cfg.label}</span>
                                                                </div>
                                                                <span className="sa-legend-count">
                                                                    {stats[key as keyof typeof stats] ?? 0}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Calendar card */}
                                            <div className="sa-card">
                                                <div className="sa-card-head">
                                                    <div className="sa-card-title">
                                                        <div className="sa-card-title-icon"><CalendarDays size={13} /></div>
                                                        Calendar View
                                                    </div>
                                                </div>
                                                <div className="sa-card-body">
                                                    <div className="sa-month-nav">
                                                        <button
                                                            className="sa-month-btn"
                                                            onClick={() => setCalMonth(p => {
                                                                const d = new Date(p.year, p.month - 1);
                                                                return { month: d.getMonth(), year: d.getFullYear() };
                                                            })}
                                                        >‹</button>
                                                        <span className="sa-month-label">
                                                            {new Date(calMonth.year, calMonth.month).toLocaleString("en-IN", { month: "long", year: "numeric" })}
                                                        </span>
                                                        <button
                                                            className="sa-month-btn"
                                                            onClick={() => setCalMonth(p => {
                                                                const d = new Date(p.year, p.month + 1);
                                                                return { month: d.getMonth(), year: d.getFullYear() };
                                                            })}
                                                        >›</button>
                                                    </div>
                                                    <MonthCalendar
                                                        records={activeData.records}
                                                        month={calMonth.month}
                                                        year={calMonth.year}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </>
                )}
            </div>
        </>
    );
}