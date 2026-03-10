// FILE: app/dashboard/student/timetable/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Clock, BookOpen, User, MapPin, CalendarDays } from "lucide-react";

type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

interface Slot {
    day: WeekDay;
    startTime: string;
    endTime: string;
    subject: string;
    teacher?: string;
    room?: string;
}

interface Timetable {
    _id: string;
    course: { name: string; authority?: string };
    slots: Slot[];
    validFrom: string;
    validTo?: string;
}

const DAYS: { key: WeekDay; label: string; short: string }[] = [
    { key: "monday",    label: "Monday",    short: "Mon" },
    { key: "tuesday",   label: "Tuesday",   short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday",  label: "Thursday",  short: "Thu" },
    { key: "friday",    label: "Friday",    short: "Fri" },
    { key: "saturday",  label: "Saturday",  short: "Sat" },
];

const TODAY_KEY = DAYS[new Date().getDay() === 0 ? 0 : new Date().getDay() - 1]?.key ?? "monday";

const DAY_COLORS: Record<WeekDay, { accent: string; light: string; border: string; text: string }> = {
    monday:    { accent: "#f59e0b", light: "#fefce8", border: "#fde68a", text: "#92400e" },
    tuesday:   { accent: "#22c55e", light: "#f0fdf4", border: "#bbf7d0", text: "#14532d" },
    wednesday: { accent: "#3b82f6", light: "#eff6ff", border: "#bfdbfe", text: "#1e3a8a" },
    thursday:  { accent: "#a855f7", light: "#fdf4ff", border: "#e9d5ff", text: "#581c87" },
    friday:    { accent: "#f97316", light: "#fff7ed", border: "#fed7aa", text: "#7c2d12" },
    saturday:  { accent: "#f43f5e", light: "#fff1f2", border: "#fecdd3", text: "#881337" },
};

function fmtTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function StudentTimetablePage() {
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [loading, setLoading]       = useState(true);
    const [activeTab, setActiveTab]   = useState(0);
    const [activeDay, setActiveDay]   = useState<WeekDay>(TODAY_KEY);

    useEffect(() => {
        fetchWithAuth("/api/student/timetable")
            .then(r => r.json())
            .then(d => setTimetables(d.timetables || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="st-loader">
            <div className="st-spinner"/>
            <span>Timetable load ho raha hai...</span>
        </div>
    );

    if (!timetables.length) return (
        <div className="st-empty">
            <CalendarDays size={40} style={{ opacity: .15, marginBottom: 12 }}/>
            <div className="st-empty-title">Koi timetable nahi mila</div>
            <div className="st-empty-sub">Admin ne abhi timetable assign nahi kiya hai</div>
        </div>
    );

    const tt       = timetables[activeTab];
    const daySlots = tt.slots.filter(s => s.day === activeDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const daysWithSlots = new Set(tt.slots.map(s => s.day));

    return (
        <>
            <style>{styles}</style>
            <div className="st-root">

                {/* Page header */}
                <div>
                    <h1 className="st-title">My Timetable</h1>
                    <p className="st-sub">Apna weekly class schedule dekho</p>
                </div>

                {/* Course tabs — multiple timetables */}
                {timetables.length > 1 && (
                    <div className="st-course-tabs">
                        {timetables.map((t, i) => (
                            <button key={t._id}
                                className={`st-course-tab ${activeTab === i ? "active" : ""}`}
                                onClick={() => { setActiveTab(i); setActiveDay(TODAY_KEY); }}>
                                {t.course?.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Course info bar */}
                <div className="st-info-bar">
                    <div className="st-info-course">
                        <BookOpen size={14} color="#2563eb"/>
                        <span>{tt.course?.name}</span>
                    </div>
                    <div className="st-info-dates">
                        <CalendarDays size={12} color="#94a3b8"/>
                        <span>Valid: {fmtDate(tt.validFrom)}{tt.validTo ? ` → ${fmtDate(tt.validTo)}` : " (ongoing)"}</span>
                    </div>
                </div>

                {/* Day selector */}
                <div className="st-day-row">
                    {DAYS.map(d => {
                        const hasSlots = daysWithSlots.has(d.key);
                        const col      = DAY_COLORS[d.key];
                        const isActive = activeDay === d.key;
                        const isToday  = d.key === TODAY_KEY;
                        return (
                            <button key={d.key}
                                className={`st-day-btn ${isActive ? "active" : ""} ${!hasSlots ? "empty" : ""}`}
                                style={isActive ? { background: col.light, borderColor: col.accent, color: col.text } : {}}
                                onClick={() => setActiveDay(d.key)}>
                                <span className="st-day-short">{d.short}</span>
                                {isToday && <span className="st-today-dot" style={{ background: isActive ? col.accent : "#2563eb" }}/>}
                                {hasSlots && (
                                    <span className="st-day-count"
                                        style={{ background: isActive ? col.accent : "#e2e8f0", color: isActive ? "#fff" : "#475569" }}>
                                        {tt.slots.filter(s => s.day === d.key).length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Day label */}
                <div className="st-day-label" style={{ color: DAY_COLORS[activeDay].accent }}>
                    {DAYS.find(d => d.key === activeDay)?.label}
                    {activeDay === TODAY_KEY && <span className="st-today-tag">Today</span>}
                </div>

                {/* Slots */}
                {daySlots.length === 0 ? (
                    <div className="st-no-slots">
                        <Clock size={20} style={{ opacity: .3 }}/>
                        Is din koi class nahi hai
                    </div>
                ) : (
                    <div className="st-slots">
                        {daySlots.map((slot, i) => {
                            const col = DAY_COLORS[slot.day];
                            return (
                                <div key={i} className="st-slot-card"
                                    style={{ borderLeftColor: col.accent }}>
                                    {/* Time column */}
                                    <div className="st-slot-time">
                                        <span className="st-time-start" style={{ color: col.accent }}>{fmtTime(slot.startTime)}</span>
                                        <div className="st-time-line" style={{ background: col.border }}/>
                                        <span className="st-time-end">{fmtTime(slot.endTime)}</span>
                                    </div>
                                    {/* Content */}
                                    <div className="st-slot-body">
                                        <div className="st-slot-subject">{slot.subject}</div>
                                        <div className="st-slot-meta">
                                            {slot.teacher && (
                                                <span className="st-meta-chip">
                                                    <User size={10}/> {slot.teacher}
                                                </span>
                                            )}
                                            {slot.room && (
                                                <span className="st-meta-chip">
                                                    <MapPin size={10}/> {slot.room}
                                                </span>
                                            )}
                                            <span className="st-meta-chip" style={{ color: col.text, background: col.light, borderColor: col.border }}>
                                                <Clock size={10}/> {fmtTime(slot.startTime)} – {fmtTime(slot.endTime)}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Index bubble */}
                                    <div className="st-slot-num" style={{ background: col.light, color: col.accent, border: `1px solid ${col.border}` }}>
                                        {i + 1}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Weekly overview mini grid */}
                <div className="st-overview">
                    <div className="st-overview-title">Weekly Overview</div>
                    <div className="st-overview-grid">
                        {DAYS.map(d => {
                            const dayS = tt.slots.filter(s => s.day === d.key)
                                .sort((a, b) => a.startTime.localeCompare(b.startTime));
                            const col  = DAY_COLORS[d.key];
                            return (
                                <div key={d.key} className={`st-ov-col ${activeDay === d.key ? "st-ov-col--active" : ""}`}
                                    onClick={() => setActiveDay(d.key)}>
                                    <div className="st-ov-day" style={activeDay === d.key ? { color: col.accent } : {}}>
                                        {d.short}
                                        {d.key === TODAY_KEY && <span className="st-ov-today-dot" style={{ background: col.accent }}/>}
                                    </div>
                                    {dayS.length === 0 ? (
                                        <div className="st-ov-empty">—</div>
                                    ) : dayS.map((s, i) => (
                                        <div key={i} className="st-ov-slot"
                                            style={{ background: col.light, borderColor: col.border, color: col.text }}>
                                            <div className="st-ov-slot-name">{s.subject}</div>
                                            <div className="st-ov-slot-time">{fmtTime(s.startTime)}</div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
*,*::before,*::after{box-sizing:border-box;}

.st-root{font-family:'Plus Jakarta Sans',sans-serif;color:#0f172a;display:flex;flex-direction:column;gap:18px;max-width:860px;margin:0 auto;padding-bottom:48px;}

.st-title{font-family:'DM Serif Display',serif;font-size:1.65rem;color:#0f172a;font-weight:400;margin:0 0 3px;}
.st-sub{font-size:12px;color:#94a3b8;margin:0;}

/* Course tabs */
.st-course-tabs{display:flex;gap:6px;flex-wrap:wrap;}
.st-course-tab{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;padding:7px 16px;border-radius:100px;border:1px solid #e2e8f0;background:#fff;color:#64748b;cursor:pointer;transition:all .14s;}
.st-course-tab.active{background:#eff6ff;color:#2563eb;border-color:#bfdbfe;}

/* Info bar */
.st-info-bar{display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px 16px;}
.st-info-course{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:700;color:#0f172a;flex:1;}
.st-info-dates{display:flex;align-items:center;gap:6px;font-size:11px;color:#94a3b8;}

/* Day row */
.st-day-row{display:flex;gap:7px;overflow-x:auto;padding-bottom:2px;}
.st-day-btn{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:54px;padding:10px 8px;border-radius:13px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;transition:all .14s;position:relative;}
.st-day-btn:hover:not(.active){border-color:#cbd5e1;}
.st-day-btn.active{box-shadow:0 2px 10px rgba(0,0,0,.07);}
.st-day-btn.empty{opacity:.45;}
.st-day-short{font-size:11px;font-weight:700;color:inherit;}
.st-today-dot{width:5px;height:5px;border-radius:50%;position:absolute;top:6px;right:8px;}
.st-day-count{font-size:9px;font-weight:800;padding:1px 6px;border-radius:100px;line-height:1.5;}

.st-day-label{font-family:'DM Serif Display',serif;font-size:1.15rem;font-weight:400;display:flex;align-items:center;gap:10px;}
.st-today-tag{font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;padding:2px 9px;border-radius:100px;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;}

/* Slot cards */
.st-slots{display:flex;flex-direction:column;gap:10px;}
.st-slot-card{background:#fff;border:1px solid #e2e8f0;border-left:3px solid;border-radius:14px;padding:16px 18px;display:flex;align-items:flex-start;gap:16px;box-shadow:0 1px 4px rgba(15,23,42,.04);transition:box-shadow .13s;}
.st-slot-card:hover{box-shadow:0 4px 16px rgba(15,23,42,.08);}

.st-slot-time{display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0;min-width:64px;}
.st-time-start{font-size:12px;font-weight:700;}
.st-time-line{width:1px;height:20px;border-radius:1px;}
.st-time-end{font-size:11px;color:#94a3b8;font-weight:500;}

.st-slot-body{flex:1;}
.st-slot-subject{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:8px;}
.st-slot-meta{display:flex;flex-wrap:wrap;gap:6px;}
.st-meta-chip{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;}

.st-slot-num{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;}

.st-no-slots{display:flex;align-items:center;justify-content:center;gap:10px;padding:40px;font-size:13px;color:#94a3b8;background:#f8fafc;border:1px dashed #e2e8f0;border-radius:14px;}

/* Weekly overview */
.st-overview{background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;}
.st-overview-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;padding:12px 16px;border-bottom:1px solid #f1f5f9;background:#f8fafc;}
.st-overview-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:0;}
.st-ov-col{padding:10px 8px;border-right:1px solid #f1f5f9;display:flex;flex-direction:column;gap:5px;cursor:pointer;transition:background .12s;}
.st-ov-col:last-child{border-right:none;}
.st-ov-col:hover{background:#f8fafc;}
.st-ov-col--active{background:#fafbff;}
.st-ov-day{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:#94a3b8;margin-bottom:3px;position:relative;display:flex;align-items:center;gap:4px;}
.st-ov-today-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.st-ov-empty{font-size:10px;color:#cbd5e1;text-align:center;padding:4px 0;}
.st-ov-slot{border-radius:6px;border:1px solid;padding:4px 6px;}
.st-ov-slot-name{font-size:9px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.st-ov-slot-time{font-size:8px;opacity:.7;margin-top:1px;}

/* States */
.st-loader{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:320px;gap:12px;font-size:13px;color:#94a3b8;font-family:'Plus Jakarta Sans',sans-serif;}
.st-spinner{width:28px;height:28px;border:3px solid #dbeafe;border-top-color:#2563eb;border-radius:50%;animation:stSpin .7s linear infinite;}
@keyframes stSpin{to{transform:rotate(360deg)}}
.st-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:280px;text-align:center;padding:40px;font-family:'Plus Jakarta Sans',sans-serif;}
.st-empty-title{font-family:'DM Serif Display',serif;font-size:1.2rem;color:#0f172a;margin-bottom:6px;}
.st-empty-sub{font-size:12px;color:#94a3b8;}

@media(max-width:640px){
    .st-overview-grid{grid-template-columns:repeat(3,1fr);}
    .st-ov-col{border-bottom:1px solid #f1f5f9;}
    .st-day-row{gap:5px;}
    .st-day-btn{min-width:46px;padding:8px 6px;}
}
`;