"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { CheckCircle2, XCircle, Clock, Coffee, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type AttStatus = "present" | "absent" | "late" | "holiday";

interface AttRecord  { date: string; status: AttStatus; remark: string; }
interface CourseAtt  {
    enrollmentId: string; courseName: string;
    stats: { total:number; present:number; absent:number; late:number; holiday:number; percentage:number; };
    records: AttRecord[];
}

/* Status colors use sp tokens */
const STATUS_CFG: Record<AttStatus, { label:string; color:string; bg:string; border:string; icon:any }> = {
    present: { label:"Present", color:"var(--sp-success)", bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.25)",  icon:CheckCircle2 },
    absent:  { label:"Absent",  color:"var(--sp-danger)",  bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.25)",  icon:XCircle      },
    late:    { label:"Late",    color:"var(--sp-warn)",    bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.25)", icon:Clock        },
    holiday: { label:"Holiday", color:"var(--sp-accent2)", bg:"var(--sp-active-bg)",   border:"var(--sp-border2)",     icon:Coffee       },
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function groupByMonth(records: AttRecord[]) {
    const map: Record<string, AttRecord[]> = {};
    for (const r of records) {
        const d   = new Date(r.date);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,"0")}`;
        if (!map[key]) map[key] = [];
        map[key].push(r);
    }
    return Object.entries(map)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([key, recs]) => {
            const year  = parseInt(key.split("-")[0]);
            const month = parseInt(key.split("-")[1]);
            recs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return { year, month, label:`${MONTH_NAMES[month]} ${year}`, records:recs };
        });
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" });
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
        <div style={{ padding:"48px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div style={{ width:36, height:36, border:"3px solid var(--sp-border)", borderTopColor:"var(--sp-accent)", borderRadius:"50%", animation:"spSpin 0.7s linear infinite" }}/>
            <style>{`@keyframes spSpin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize:13, color:"var(--sp-muted)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Attendance load ho rahi hai...</span>
        </div>
    );

    if (!data.length) return (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:280, textAlign:"center", padding:40, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            <CalendarDays size={40} style={{ opacity:.15, marginBottom:12, color:"var(--sp-text)" }}/>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:"1.2rem", color:"var(--sp-text)", marginBottom:6 }}>Koi attendance record nahi</div>
            <div style={{ fontSize:12, color:"var(--sp-muted)" }}>Abhi tak koi attendance mark nahi hui hai</div>
        </div>
    );

    const course       = data[active];
    const months       = groupByMonth(course.records);
    const curMonth     = months[month] ?? null;
    const pct          = course.stats.percentage;
    const pctColor     = pct >= 75 ? "var(--sp-success)" : pct >= 50 ? "var(--sp-warn)" : "var(--sp-danger)";
    const pctBg        = pct >= 75 ? "rgba(34,197,94,0.08)" : pct >= 50 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)";
    const pctBorder    = pct >= 75 ? "rgba(34,197,94,0.2)"  : pct >= 50 ? "rgba(245,158,11,0.2)"  : "rgba(239,68,68,0.2)";
    const circumference = 2 * Math.PI * 36;

    return (
        <>
            <style>{`
                .sap-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--sp-text); display:flex; flex-direction:column; gap:18px; max-width:820px; margin:0 auto; padding-bottom:40px; }

                .sap-title { font-family:'DM Serif Display',serif; font-size:1.65rem; color:var(--sp-text); font-weight:400; margin:0 0 3px; }
                .sap-sub   { font-size:12px; color:var(--sp-muted); margin:0; }

                .sap-tabs { display:flex; gap:6px; flex-wrap:wrap; }
                .sap-tab  { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; padding:7px 16px; border-radius:100px; border:1px solid var(--sp-border); background:var(--sp-surface); color:var(--sp-muted); cursor:pointer; transition:all .14s; }
                .sap-tab.active             { background:var(--sp-active-bg); color:var(--sp-active-fg); border-color:var(--sp-border2); }
                .sap-tab:hover:not(.active) { border-color:var(--sp-border2); color:var(--sp-text); }

                /* Summary */
                .sap-summary  { display:flex; gap:14px; flex-wrap:wrap; }
                .sap-ring-card { flex:1; min-width:220px; border:1px solid; border-radius:16px; padding:20px 22px; display:flex; align-items:center; gap:18px; }
                .sap-ring-wrap   { position:relative; flex-shrink:0; width:100px; height:100px; }
                .sap-ring-center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
                .sap-ring-pct    { font-family:'DM Serif Display',serif; font-size:1.35rem; }
                .sap-ring-label  { font-size:13px; font-weight:700; color:var(--sp-text); margin-bottom:3px; }
                .sap-ring-course { font-size:11px; color:var(--sp-muted); margin-bottom:5px; }
                .sap-ring-total  { font-size:11px; color:var(--sp-subtext); }
                .sap-warn        { font-size:10px; font-weight:700; color:var(--sp-danger); background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); padding:3px 9px; border-radius:7px; margin-top:8px; display:inline-block; }

                .sap-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; flex:1; min-width:180px; }
                .sap-stat-card { border:1px solid; border-radius:13px; padding:14px 16px; display:flex; flex-direction:column; gap:5px; }
                .sap-stat-val  { font-family:'DM Serif Display',serif; font-size:1.5rem; line-height:1; }
                .sap-stat-label{ font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.09em; color:var(--sp-muted); }

                /* Records card */
                .sap-records-card { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:16px; overflow:hidden; }
                .sap-month-nav    { display:flex; align-items:center; gap:10px; padding:13px 18px; border-bottom:1px solid var(--sp-border); background:var(--sp-hover); }
                .sap-nav-btn      { width:28px; height:28px; border-radius:8px; border:1px solid var(--sp-border); background:var(--sp-surface); cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--sp-muted); transition:all .13s; flex-shrink:0; }
                .sap-nav-btn:hover:not(:disabled) { border-color:var(--sp-border2); color:var(--sp-accent); }
                .sap-nav-btn:disabled { opacity:.3; cursor:not-allowed; }
                .sap-month-label  { display:flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:var(--sp-text); flex:1; }
                .sap-month-count  { font-size:10px; color:var(--sp-muted); font-weight:600; white-space:nowrap; }

                .sap-month-chips  { display:flex; gap:6px; flex-wrap:wrap; padding:10px 18px; border-bottom:1px solid var(--sp-border); background:var(--sp-surface); }
                .sap-chip { font-size:10px; font-weight:700; padding:3px 10px; border-radius:100px; border:1px solid; }

                .sap-thead { display:grid; grid-template-columns:1.4fr 110px 1fr; gap:8px; padding:9px 18px; background:var(--sp-hover); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--sp-muted); }
                .sap-row   { display:grid; grid-template-columns:1.4fr 110px 1fr; gap:8px; padding:12px 18px; border-top:1px solid var(--sp-border); align-items:center; transition:background .11s; }
                .sap-row:hover { background:var(--sp-hover); }

                .sap-col-date   { font-size:12px; color:var(--sp-subtext); font-weight:500; }
                .sap-col-status { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; padding:4px 10px; border-radius:100px; border:1px solid; width:fit-content; }
                .sap-col-remark { font-size:11px; color:var(--sp-muted); }

                .sap-no-records { display:flex; align-items:center; justify-content:center; gap:8px; padding:28px; font-size:13px; color:var(--sp-muted); }

                @media (max-width:600px) {
                    .sap-summary { flex-direction:column; }
                    .sap-thead,.sap-row { grid-template-columns:1fr 100px; }
                    .sap-col-remark { display:none; }
                    .sap-ring-card { flex-direction:column; align-items:flex-start; }
                }
            `}</style>

            <div className="sap-root">

                <div>
                    <h1 className="sap-title">My Attendance</h1>
                    <p className="sap-sub">Course-wise attendance aur stats dekho</p>
                </div>

                {data.length > 1 && (
                    <div className="sap-tabs">
                        {data.map((c, i) => (
                            <button key={c.enrollmentId} className={`sap-tab ${active === i ? "active" : ""}`}
                                onClick={() => { setActive(i); setMonth(0); }}>
                                {c.courseName}
                            </button>
                        ))}
                    </div>
                )}

                {/* Summary */}
                <div className="sap-summary">
                    {/* Ring card */}
                    <div className="sap-ring-card" style={{ borderColor:pctBorder, background:pctBg }}>
                        <div className="sap-ring-wrap">
                            <svg width="100" height="100" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="36" fill="none" stroke={pctColor} strokeWidth="9" strokeOpacity="0.15"/>
                                <circle cx="50" cy="50" r="36" fill="none" stroke={pctColor} strokeWidth="9"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference * (1 - pct / 100)}
                                    strokeLinecap="round" transform="rotate(-90 50 50)"
                                    style={{ transition:"stroke-dashoffset 0.9s ease" }}/>
                            </svg>
                            <div className="sap-ring-center">
                                <span className="sap-ring-pct" style={{ color:pctColor }}>{pct}%</span>
                            </div>
                        </div>
                        <div className="sap-ring-info">
                            <div className="sap-ring-label">Overall Attendance</div>
                            <div className="sap-ring-course">{course.courseName}</div>
                            <div className="sap-ring-total">{course.stats.total} total classes</div>
                            {pct < 75 && <div className="sap-warn">⚠ Below 75% — attend more classes</div>}
                        </div>
                    </div>

                    {/* Stat grid */}
                    <div className="sap-stat-grid">
                        {(["present","absent","late","holiday"] as AttStatus[]).map(s => {
                            const cfg  = STATUS_CFG[s];
                            const Icon = cfg.icon;
                            return (
                                <div key={s} className="sap-stat-card" style={{ borderColor:cfg.border, background:cfg.bg }}>
                                    <Icon size={15} color={cfg.color}/>
                                    <div className="sap-stat-val" style={{ color:cfg.color }}>{course.stats[s]}</div>
                                    <div className="sap-stat-label">{cfg.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Records */}
                {months.length === 0 ? (
                    <div className="sap-no-records"><CalendarDays size={22} style={{ opacity:.3 }}/> Abhi tak koi record nahi</div>
                ) : (
                    <div className="sap-records-card">
                        <div className="sap-month-nav">
                            <button className="sap-nav-btn" disabled={month === 0} onClick={() => setMonth(m => m - 1)}><ChevronLeft size={15}/></button>
                            <div className="sap-month-label"><CalendarDays size={13} color="var(--sp-accent)"/>{curMonth?.label}</div>
                            <button className="sap-nav-btn" disabled={month === months.length - 1} onClick={() => setMonth(m => m + 1)}><ChevronRight size={15}/></button>
                            <span className="sap-month-count">{curMonth?.records.length ?? 0} days</span>
                        </div>

                        {curMonth && (
                            <div className="sap-month-chips">
                                {(["present","absent","late","holiday"] as AttStatus[]).map(s => {
                                    const cnt = curMonth.records.filter(r => r.status === s).length;
                                    if (!cnt) return null;
                                    return (
                                        <span key={s} className="sap-chip" style={{ color:STATUS_CFG[s].color, background:STATUS_CFG[s].bg, borderColor:STATUS_CFG[s].border }}>
                                            {cnt} {STATUS_CFG[s].label}
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        <div className="sap-thead"><span>Date</span><span>Status</span><span>Remark</span></div>

                        {curMonth?.records.length === 0 ? (
                            <div className="sap-no-records">Is month mein koi record nahi</div>
                        ) : curMonth?.records.map((rec, i) => {
                            const cfg  = STATUS_CFG[rec.status];
                            const Icon = cfg.icon;
                            return (
                                <div key={i} className="sap-row">
                                    <span className="sap-col-date">{fmtDate(rec.date)}</span>
                                    <span className="sap-col-status" style={{ color:cfg.color, background:cfg.bg, borderColor:cfg.border }}>
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