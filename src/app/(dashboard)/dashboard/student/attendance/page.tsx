// FILE: app/dashboard/student/attendance/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    CheckCircle2, XCircle, Clock, Coffee,
    CalendarDays, ChevronLeft, ChevronRight
} from "lucide-react";

type AttStatus = "present" | "absent" | "late" | "holiday";

interface AttRecord {
    date:   string;
    status: AttStatus;
    remark: string;
}

interface CourseAtt {
    enrollmentId: string;
    courseName:   string;
    stats: {
        total: number; present: number; absent: number;
        late: number; holiday: number; percentage: number;
    };
    records: AttRecord[];
}

const STATUS_CFG: Record<AttStatus, { label: string; color: string; bg: string; border: string; icon: any }> = {
    present: { label: "Present", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle2 },
    absent:  { label: "Absent",  color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: XCircle      },
    late:    { label: "Late",    color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: Clock        },
    holiday: { label: "Holiday", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: Coffee       },
};

const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

function groupByMonth(records: AttRecord[]) {
    const map: Record<string, AttRecord[]> = {};
    for (const r of records) {
        const d   = new Date(r.date);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,"0")}`;
        if (!map[key]) map[key] = [];
        map[key].push(r);
    }
    return Object.entries(map)
        .sort((a, b) => b[0].localeCompare(a[0])) // newest first
        .map(([key, recs]) => {
            const year  = parseInt(key.split("-")[0]);
            const month = parseInt(key.split("-")[1]);
            // Sort records within month newest first
            recs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return { year, month, label: `${MONTH_NAMES[month]} ${year}`, records: recs };
        });
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
}

export default function StudentAttendancePage() {
    const [data,    setData]    = useState<CourseAtt[]>([]);
    const [loading, setLoading] = useState(true);
    const [active,  setActive]  = useState(0);
    const [month,   setMonth]   = useState(0);

    useEffect(() => {
        fetchWithAuth("/api/student/attendance")
            .then(r => r.json())
            .then(d => setData(d.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="sap-loader">
            <div className="sap-spinner" />
            <span>Attendance load ho rahi hai...</span>
        </div>
    );

    if (!data.length) return (
        <div className="sap-empty">
            <CalendarDays size={40} style={{ opacity: .15, marginBottom: 12 }} />
            <div className="sap-empty-title">Koi attendance record nahi</div>
            <div className="sap-empty-sub">Abhi tak koi attendance mark nahi hui hai</div>
        </div>
    );

    const course   = data[active];
    const months   = groupByMonth(course.records);
    const curMonth = months[month] ?? null;
    const pct      = course.stats.percentage;
    const pctColor = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
    const pctBg    = pct >= 75 ? "#f0fdf4"  : pct >= 50 ? "#fffbeb"  : "#fef2f2";
    const circumference = 2 * Math.PI * 36;

    return (
        <>
            <style>{styles}</style>
            <div className="sap-root">

                {/* Page header */}
                <div>
                    <h1 className="sap-title">My Attendance</h1>
                    <p className="sap-sub">Course-wise attendance aur stats dekho</p>
                </div>

                {/* Course tabs — only if multiple courses */}
                {data.length > 1 && (
                    <div className="sap-tabs">
                        {data.map((c, i) => (
                            <button key={c.enrollmentId}
                                className={`sap-tab ${active === i ? "active" : ""}`}
                                onClick={() => { setActive(i); setMonth(0); }}>
                                {c.courseName}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Summary section ── */}
                <div className="sap-summary">

                    {/* Ring card */}
                    <div className="sap-ring-card" style={{ borderColor: pctColor + "33", background: pctBg }}>
                        <div className="sap-ring-wrap">
                            <svg width="100" height="100" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="36" fill="none"
                                    stroke={pctColor + "22"} strokeWidth="9"/>
                                <circle cx="50" cy="50" r="36" fill="none"
                                    stroke={pctColor} strokeWidth="9"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference * (1 - pct / 100)}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                    style={{ transition: "stroke-dashoffset 0.9s ease" }}
                                />
                            </svg>
                            <div className="sap-ring-center">
                                <span className="sap-ring-pct" style={{ color: pctColor }}>{pct}%</span>
                            </div>
                        </div>
                        <div className="sap-ring-info">
                            <div className="sap-ring-label">Overall Attendance</div>
                            <div className="sap-ring-course">{course.courseName}</div>
                            <div className="sap-ring-total">{course.stats.total} total classes</div>
                            {pct < 75 && (
                                <div className="sap-warn">⚠ Below 75% — attend more classes</div>
                            )}
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="sap-stat-grid">
                        {(["present","absent","late","holiday"] as AttStatus[]).map(s => {
                            const cfg  = STATUS_CFG[s];
                            const Icon = cfg.icon;
                            return (
                                <div key={s} className="sap-stat-card"
                                    style={{ borderColor: cfg.border, background: cfg.bg }}>
                                    <Icon size={15} color={cfg.color}/>
                                    <div className="sap-stat-val" style={{ color: cfg.color }}>
                                        {course.stats[s]}
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
                        <CalendarDays size={22} style={{ opacity: .3 }}/>
                        Abhi tak koi record nahi
                    </div>
                ) : (
                    <div className="sap-records-card">

                        {/* Month navigator */}
                        <div className="sap-month-nav">
                            <button className="sap-nav-btn"
                                disabled={month === 0}
                                onClick={() => setMonth(m => m - 1)}>
                                <ChevronLeft size={15}/>
                            </button>
                            <div className="sap-month-label">
                                <CalendarDays size={13} color="#2563eb"/>
                                {curMonth?.label}
                            </div>
                            <button className="sap-nav-btn"
                                disabled={month === months.length - 1}
                                onClick={() => setMonth(m => m + 1)}>
                                <ChevronRight size={15}/>
                            </button>
                            <span className="sap-month-count">
                                {curMonth?.records.length ?? 0} days
                            </span>
                        </div>

                        {/* Month stat summary */}
                        {curMonth && (
                            <div className="sap-month-chips">
                                {(["present","absent","late","holiday"] as AttStatus[]).map(s => {
                                    const cnt = curMonth.records.filter(r => r.status === s).length;
                                    if (!cnt) return null;
                                    return (
                                        <span key={s} className="sap-chip"
                                            style={{ color: STATUS_CFG[s].color, background: STATUS_CFG[s].bg, borderColor: STATUS_CFG[s].border }}>
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
                            <span>Remark</span>
                        </div>

                        {/* Rows */}
                        {curMonth?.records.length === 0 ? (
                            <div className="sap-no-records">Is month mein koi record nahi</div>
                        ) : curMonth?.records.map((rec, i) => {
                            const cfg  = STATUS_CFG[rec.status];
                            const Icon = cfg.icon;
                            return (
                                <div key={i} className="sap-row">
                                    <span className="sap-col-date">{fmtDate(rec.date)}</span>
                                    <span className="sap-col-status"
                                        style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                                        <Icon size={10}/> {cfg.label}
                                    </span>
                                    <span className="sap-col-remark">{rec.remark || "—"}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.sap-root { font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; display:flex; flex-direction:column; gap:18px; max-width:820px; margin:0 auto; padding-bottom:40px; }

.sap-title { font-family:'DM Serif Display',serif; font-size:1.65rem; color:#0f172a; font-weight:400; margin:0 0 3px; }
.sap-sub   { font-size:12px; color:#94a3b8; margin:0; }

.sap-tabs { display:flex; gap:6px; flex-wrap:wrap; }
.sap-tab  { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; padding:7px 16px; border-radius:100px; border:1px solid #e2e8f0; background:#fff; color:#64748b; cursor:pointer; transition:all .14s; }
.sap-tab.active           { background:#eff6ff; color:#2563eb; border-color:#bfdbfe; }
.sap-tab:hover:not(.active) { border-color:#cbd5e1; color:#334155; }

/* ── Summary ── */
.sap-summary { display:flex; gap:14px; flex-wrap:wrap; }

.sap-ring-card { flex:1; min-width:220px; border:1px solid; border-radius:16px; padding:20px 22px; display:flex; align-items:center; gap:18px; }
.sap-ring-wrap { position:relative; flex-shrink:0; width:100px; height:100px; }
.sap-ring-center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
.sap-ring-pct    { font-family:'DM Serif Display',serif; font-size:1.35rem; }
.sap-ring-label  { font-size:13px; font-weight:700; color:#0f172a; margin-bottom:3px; }
.sap-ring-course { font-size:11px; color:#94a3b8; margin-bottom:5px; }
.sap-ring-total  { font-size:11px; color:#64748b; }
.sap-warn { font-size:10px; font-weight:700; color:#dc2626; background:#fef2f2; border:1px solid #fecaca; padding:3px 9px; border-radius:7px; margin-top:8px; display:inline-block; }

.sap-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; flex:1; min-width:180px; }
.sap-stat-card { border:1px solid; border-radius:13px; padding:14px 16px; display:flex; flex-direction:column; gap:5px; }
.sap-stat-val  { font-family:'DM Serif Display',serif; font-size:1.5rem; line-height:1; }
.sap-stat-label{ font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.09em; color:#94a3b8; }

/* ── Records card ── */
.sap-records-card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; box-shadow:0 1px 6px rgba(15,23,42,.04); }

.sap-month-nav   { display:flex; align-items:center; gap:10px; padding:13px 18px; border-bottom:1px solid #f1f5f9; background:#f8fafc; }
.sap-nav-btn     { width:28px; height:28px; border-radius:8px; border:1px solid #e2e8f0; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#64748b; transition:all .13s; flex-shrink:0; }
.sap-nav-btn:hover:not(:disabled) { border-color:#bfdbfe; color:#2563eb; }
.sap-nav-btn:disabled { opacity:.3; cursor:not-allowed; }
.sap-month-label { display:flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:#0f172a; flex:1; }
.sap-month-count { font-size:10px; color:#94a3b8; font-weight:600; white-space:nowrap; }

.sap-month-chips { display:flex; gap:6px; flex-wrap:wrap; padding:10px 18px; border-bottom:1px solid #f1f5f9; background:#fafbff; }
.sap-chip { font-size:10px; font-weight:700; padding:3px 10px; border-radius:100px; border:1px solid; }

.sap-thead { display:grid; grid-template-columns:1.4fr 110px 1fr; gap:8px; padding:9px 18px; background:#f1f5f9; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#64748b; }
.sap-row   { display:grid; grid-template-columns:1.4fr 110px 1fr; gap:8px; padding:12px 18px; border-top:1px solid #f8fafc; align-items:center; transition:background .11s; }
.sap-row:hover { background:#f8fafc; }

.sap-col-date   { font-size:12px; color:#334155; font-weight:500; }
.sap-col-status { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; padding:4px 10px; border-radius:100px; border:1px solid; width:fit-content; }
.sap-col-remark { font-size:11px; color:#94a3b8; }

.sap-no-records { display:flex; align-items:center; justify-content:center; gap:8px; padding:28px; font-size:13px; color:#94a3b8; }

/* ── States ── */
.sap-loader { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:320px; gap:12px; font-size:13px; color:#94a3b8; font-family:'Plus Jakarta Sans',sans-serif; }
.sap-spinner { width:28px; height:28px; border:3px solid #dbeafe; border-top-color:#2563eb; border-radius:50%; animation:sapSpin .7s linear infinite; }
@keyframes sapSpin { to { transform:rotate(360deg); } }

.sap-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:280px; text-align:center; padding:40px; font-family:'Plus Jakarta Sans',sans-serif; }
.sap-empty-title { font-family:'DM Serif Display',serif; font-size:1.2rem; color:#0f172a; margin-bottom:6px; }
.sap-empty-sub   { font-size:12px; color:#94a3b8; }

@media (max-width:600px) {
    .sap-summary { flex-direction:column; }
    .sap-thead,.sap-row { grid-template-columns:1fr 100px; }
    .sap-col-remark { display:none; }
    .sap-ring-card { flex-direction:column; align-items:flex-start; }
}
`;