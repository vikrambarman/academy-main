// app/dashboard/student/schedule/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Clock, BookOpen, MapPin, User, CalendarDays, Info } from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

interface Slot {
    day: WeekDay; startTime: string; endTime: string;
    subject: string; teacher?: string; room?: string;
}

interface TimetableDoc {
    _id: string;
    course: { name?: string; authority?: string; duration?: string; };
    slots: Slot[];
    validFrom: string;
    validTo?: string;
    isActive: boolean;
}

/* ─── Constants ──────────────────────────────────── */
const DAYS: WeekDay[] = ["monday","tuesday","wednesday","thursday","friday","saturday"];

const DAY_LABELS: Record<WeekDay, { short: string; full: string }> = {
    monday:    { short: "Mon", full: "Monday"    },
    tuesday:   { short: "Tue", full: "Tuesday"   },
    wednesday: { short: "Wed", full: "Wednesday" },
    thursday:  { short: "Thu", full: "Thursday"  },
    friday:    { short: "Fri", full: "Friday"    },
    saturday:  { short: "Sat", full: "Saturday"  },
};

// Distinct colors per subject slot (cycles)
const SLOT_COLORS = [
    { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    { bg: "#f5f3ff", color: "#5b21b6", border: "#ddd6fe" },
    { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
    { bg: "#f0fdfa", color: "#0f766e", border: "#99f6e4" },
];

function getSlotColor(idx: number) { return SLOT_COLORS[idx % SLOT_COLORS.length]; }

function getTodayDay(): WeekDay {
    const days: (WeekDay | null)[] = [null,"monday","tuesday","wednesday","thursday","friday","saturday"];
    return days[new Date().getDay()] ?? "monday";
}

function fmtTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12  = h % 12 || 12;
    return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
}

function isCurrentSlot(start: string, end: string): boolean {
    const now  = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return mins >= sh * 60 + sm && mins <= eh * 60 + em;
}

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */
export default function StudentSchedule() {
    const [timetables, setTimetables] = useState<TimetableDoc[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [activeDoc,  setActiveDoc]  = useState<string | null>(null);
    const [activeDay,  setActiveDay]  = useState<WeekDay>(getTodayDay());
    const [viewMode,   setViewMode]   = useState<"day" | "week">("day");

    useEffect(() => {
        fetchWithAuth("/api/student/timetable")
            .then(r => r.json())
            .then(d => {
                const list = d.timetables ?? [];
                setTimetables(list);
                if (list.length > 0) setActiveDoc(list[0]._id);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const activeTT  = timetables.find(t => t._id === activeDoc);
    const today     = getTodayDay();

    /* slots for active day */
    const daySlots = activeTT?.slots
        .filter(s => s.day === activeDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)) ?? [];

    /* all subjects for color mapping */
    const subjectColorMap: Record<string, typeof SLOT_COLORS[0]> = {};
    activeTT?.slots.forEach((s, i) => {
        const subjects = [...new Set(activeTT.slots.map(sl => sl.subject))];
        if (!subjectColorMap[s.subject])
            subjectColorMap[s.subject] = getSlotColor(subjects.indexOf(s.subject));
    });

    if (loading) return (
        <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, border: "3px solid #dbeafe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spSpin 0.7s linear infinite" }} />
            <style>{`@keyframes spSpin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading schedule…</span>
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                .ss-root * { box-sizing: border-box; }
                .ss-root { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; }

                .ss-page-title {
                    font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #0f172a;
                    display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
                }
                .ss-page-sub { font-size: 13px; color: #64748b; font-weight: 300; margin-bottom: 22px; }

                /* ── Top bar ── */
                .ss-topbar {
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 10px; margin-bottom: 18px;
                }

                /* course tabs */
                .ss-tabs { display: flex; gap: 6px; flex-wrap: wrap; }

                .ss-tab {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px; font-weight: 600;
                    padding: 7px 14px; border-radius: 9px; cursor: pointer;
                    border: 1px solid #e0effe; background: #fff; color: #64748b;
                    transition: all 0.15s;
                }
                .ss-tab:hover  { background: #f0f9ff; border-color: #bfdbfe; color: #2563eb; }
                .ss-tab.active { background: #2563eb; border-color: #2563eb; color: #fff; }

                /* view toggle */
                .ss-view-toggle {
                    display: flex; gap: 0;
                    background: #f1f5f9; border-radius: 9px; padding: 3px;
                }

                .ss-view-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 11px; font-weight: 600;
                    padding: 5px 12px; border-radius: 7px; cursor: pointer;
                    border: none; background: transparent; color: #64748b;
                    transition: all 0.15s;
                }
                .ss-view-btn.active { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

                /* ── Day selector ── */
                .ss-days {
                    display: grid; grid-template-columns: repeat(6,1fr);
                    gap: 6px; margin-bottom: 18px;
                }

                .ss-day-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    display: flex; flex-direction: column; align-items: center; gap: 3px;
                    padding: 10px 6px; border-radius: 11px; cursor: pointer;
                    border: 1px solid #e0effe; background: #fff;
                    transition: all 0.15s;
                }

                .ss-day-btn:hover { background: #f0f9ff; border-color: #bfdbfe; }

                .ss-day-btn.active {
                    background: #2563eb; border-color: #2563eb;
                }

                .ss-day-short {
                    font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
                    text-transform: uppercase; color: #94a3b8;
                }

                .ss-day-btn.active .ss-day-short { color: rgba(255,255,255,0.65); }

                .ss-day-count {
                    font-family: 'DM Serif Display', serif;
                    font-size: 1rem; color: #0f172a;
                }

                .ss-day-btn.active .ss-day-count { color: #fff; }

                .ss-day-today-dot {
                    width: 5px; height: 5px; border-radius: 50%; background: #2563eb;
                }
                .ss-day-btn.active .ss-day-today-dot { background: rgba(255,255,255,0.7); }

                /* ── Slot cards (day view) ── */
                .ss-slots { display: flex; flex-direction: column; gap: 10px; }

                .ss-slot-card {
                    display: flex; gap: 0;
                    border: 1px solid #e0effe; border-radius: 13px; overflow: hidden;
                    transition: box-shadow 0.18s, transform 0.15s;
                }

                .ss-slot-card:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.09); transform: translateY(-1px); }

                .ss-slot-card.current { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

                .ss-slot-time {
                    width: 76px; flex-shrink: 0; padding: 14px 12px;
                    display: flex; flex-direction: column; align-items: center;
                    justify-content: center; gap: 3px; border-right: 1px solid #e0effe;
                    background: #f8fbff;
                }

                .ss-slot-time-start { font-size: 13px; font-weight: 700; color: #0f172a; }
                .ss-slot-time-sep   { width: 1px; height: 12px; background: #e0effe; }
                .ss-slot-time-end   { font-size: 11px; font-weight: 500; color: #94a3b8; }

                .ss-slot-body {
                    flex: 1; padding: 14px 16px;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 12px; background: #fff;
                }

                .ss-slot-subject { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }

                .ss-slot-meta { display: flex; gap: 12px; flex-wrap: wrap; }

                .ss-slot-meta-item {
                    display: flex; align-items: center; gap: 4px;
                    font-size: 11px; color: #64748b; font-weight: 400;
                }

                .ss-slot-accent {
                    width: 4px; align-self: stretch; flex-shrink: 0; border-radius: 0 4px 4px 0;
                }

                .ss-now-badge {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
                    text-transform: uppercase; background: #2563eb; color: #fff;
                    padding: 3px 8px; border-radius: 100px;
                    animation: ssPulse 2s ease-in-out infinite; flex-shrink: 0;
                }

                @keyframes ssPulse { 0%,100%{opacity:1} 50%{opacity:0.65} }

                /* ── Week grid ── */
                .ss-week-grid {
                    display: grid;
                    grid-template-columns: repeat(6,1fr);
                    gap: 8px;
                }

                .ss-week-col {}

                .ss-week-day-header {
                    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
                    text-transform: uppercase; text-align: center;
                    padding: 8px 4px; margin-bottom: 8px;
                    border-radius: 8px;
                    color: #64748b; background: #f8fafc;
                }

                .ss-week-day-header.today { background: #eff6ff; color: #2563eb; }

                .ss-week-slot {
                    border-radius: 9px; padding: 10px 10px;
                    margin-bottom: 6px; border: 1px solid transparent;
                    transition: box-shadow 0.15s;
                }

                .ss-week-slot:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.08); }

                .ss-week-slot-subject { font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 3px; }
                .ss-week-slot-time    { font-size: 9px; color: #64748b; display: flex; align-items: center; gap: 3px; }

                .ss-week-empty {
                    font-size: 11px; color: #e2e8f0; text-align: center; padding: 12px 0;
                }

                /* ── No schedule ── */
                .ss-empty {
                    background: #fff; border: 1px solid #e0effe; border-radius: 14px;
                    padding: 48px 24px; text-align: center;
                }
                .ss-empty-icon { width: 48px; height: 48px; background: #eff6ff; border-radius: 13px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: #2563eb; }
                .ss-empty-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 5px; }
                .ss-empty-sub   { font-size: 12px; color: #94a3b8; }

                /* ── Info note ── */
                .ss-info-note {
                    display: flex; gap: 9px; align-items: flex-start;
                    background: #f8fbff; border: 1px solid #e0effe; border-radius: 10px;
                    padding: 11px 14px; font-size: 12px; font-weight: 300;
                    color: #475569; line-height: 1.65; margin-bottom: 16px;
                }

                @media (max-width: 640px) {
                    .ss-week-grid { grid-template-columns: repeat(3,1fr); }
                    .ss-days      { grid-template-columns: repeat(3,1fr); }
                }
            `}</style>

            <div className="ss-root">

                {/* Header */}
                <div className="ss-page-title">
                    <CalendarDays size={22} style={{ color: "#2563eb" }} />
                    Class Schedule
                </div>
                <div className="ss-page-sub">Your weekly timetable for all enrolled courses.</div>

                {timetables.length === 0 ? (
                    <div className="ss-empty">
                        <div className="ss-empty-icon"><CalendarDays size={22} /></div>
                        <div className="ss-empty-title">No schedule assigned yet</div>
                        <div className="ss-empty-sub">Your class schedule will appear here once the academy creates it.</div>
                    </div>
                ) : (
                    <>
                        {/* Topbar */}
                        <div className="ss-topbar">
                            {timetables.length > 1 && (
                                <div className="ss-tabs">
                                    {timetables.map(t => (
                                        <button
                                            key={t._id}
                                            className={`ss-tab ${activeDoc === t._id ? "active" : ""}`}
                                            onClick={() => setActiveDoc(t._id)}
                                        >
                                            {t.course?.name ?? "Course"}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="ss-view-toggle">
                                {(["day","week"] as const).map(v => (
                                    <button
                                        key={v}
                                        className={`ss-view-btn ${viewMode === v ? "active" : ""}`}
                                        onClick={() => setViewMode(v)}
                                    >
                                        {v === "day" ? "Day View" : "Week View"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTT && (
                            <>
                                {/* Info note */}
                                <div className="ss-info-note">
                                    <Info size={14} style={{ flexShrink: 0, marginTop: 1, color: "#2563eb" }} />
                                    Schedule for <strong>{activeTT.course?.name}</strong>.
                                    Valid from {new Date(activeTT.validFrom).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                                    {activeTT.validTo ? ` to ${new Date(activeTT.validTo).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}` : " (ongoing)"}.
                                </div>

                                {viewMode === "day" ? (
                                    <>
                                        {/* Day selector */}
                                        <div className="ss-days">
                                            {DAYS.map(day => {
                                                const count   = activeTT.slots.filter(s => s.day === day).length;
                                                const isToday = day === today;
                                                return (
                                                    <button
                                                        key={day}
                                                        className={`ss-day-btn ${activeDay === day ? "active" : ""}`}
                                                        onClick={() => setActiveDay(day)}
                                                    >
                                                        <span className="ss-day-short">{DAY_LABELS[day].short}</span>
                                                        <span className="ss-day-count">{count}</span>
                                                        {isToday && <span className="ss-day-today-dot" title="Today" />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Day label */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                            <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.05rem", color: "#0f172a" }}>
                                                {DAY_LABELS[activeDay].full}
                                            </span>
                                            {activeDay === today && (
                                                <span style={{ fontSize: 10, fontWeight: 700, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: 100 }}>
                                                    Today
                                                </span>
                                            )}
                                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                                {daySlots.length} {daySlots.length === 1 ? "class" : "classes"}
                                            </span>
                                        </div>

                                        {/* Slots */}
                                        {daySlots.length === 0 ? (
                                            <div style={{ background: "#fff", border: "1px solid #e0effe", borderRadius: 14, padding: "32px 24px", textAlign: "center" }}>
                                                <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>No classes today</div>
                                                <div style={{ fontSize: 12, color: "#94a3b8" }}>Enjoy your free day!</div>
                                            </div>
                                        ) : (
                                            <div className="ss-slots">
                                                {daySlots.map((slot, i) => {
                                                    const sc      = subjectColorMap[slot.subject] ?? getSlotColor(i);
                                                    const current = activeDay === today && isCurrentSlot(slot.startTime, slot.endTime);
                                                    return (
                                                        <div key={i} className={`ss-slot-card ${current ? "current" : ""}`}>
                                                            <div className="ss-slot-time">
                                                                <span className="ss-slot-time-start">{fmtTime(slot.startTime)}</span>
                                                                <div className="ss-slot-time-sep" />
                                                                <span className="ss-slot-time-end">{fmtTime(slot.endTime)}</span>
                                                            </div>
                                                            <div className="ss-slot-body">
                                                                <div>
                                                                    <div className="ss-slot-subject">{slot.subject}</div>
                                                                    <div className="ss-slot-meta">
                                                                        {slot.teacher && (
                                                                            <span className="ss-slot-meta-item">
                                                                                <User size={10} /> {slot.teacher}
                                                                            </span>
                                                                        )}
                                                                        {slot.room && (
                                                                            <span className="ss-slot-meta-item">
                                                                                <MapPin size={10} /> {slot.room}
                                                                            </span>
                                                                        )}
                                                                        <span className="ss-slot-meta-item">
                                                                            <Clock size={10} />
                                                                            {(() => {
                                                                                const [sh,sm] = slot.startTime.split(":").map(Number);
                                                                                const [eh,em] = slot.endTime.split(":").map(Number);
                                                                                return `${(eh*60+em)-(sh*60+sm)} min`;
                                                                            })()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                                                                    <span
                                                                        style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                                                                    >
                                                                        <BookOpen size={9} /> {slot.subject}
                                                                    </span>
                                                                    {current && <span className="ss-now-badge">● Now</span>}
                                                                </div>
                                                            </div>
                                                            <div className="ss-slot-accent" style={{ background: sc.color }} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Week view */
                                    <div className="ss-week-grid">
                                        {DAYS.map(day => {
                                            const slots = activeTT.slots
                                                .filter(s => s.day === day)
                                                .sort((a,b) => a.startTime.localeCompare(b.startTime));
                                            const isToday = day === today;
                                            return (
                                                <div key={day} className="ss-week-col">
                                                    <div className={`ss-week-day-header ${isToday ? "today" : ""}`}>
                                                        {DAY_LABELS[day].short}
                                                        {isToday && " •"}
                                                    </div>
                                                    {slots.length === 0
                                                        ? <div className="ss-week-empty">—</div>
                                                        : slots.map((slot, i) => {
                                                            const sc = subjectColorMap[slot.subject] ?? getSlotColor(i);
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="ss-week-slot"
                                                                    style={{ background: sc.bg, borderColor: sc.border }}
                                                                >
                                                                    <div className="ss-week-slot-subject" style={{ color: sc.color }}>{slot.subject}</div>
                                                                    <div className="ss-week-slot-time">
                                                                        <Clock size={8} />{fmtTime(slot.startTime)}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}