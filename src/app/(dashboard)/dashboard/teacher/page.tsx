// src/app/(dashboard)/dashboard/teacher/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { CalendarCheck, Clock, BookOpen, Users, TrendingUp, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";

interface Stats {
    totalStudents: number;
    todayPresent: number;
    todayAbsent: number;
    notMarkedToday: number;
    totalNotes: number;
    activeCourses: number;
}

export default function TeacherDashboard() {
    const [teacher,  setTeacher]  = useState<{ name: string } | null>(null);
    const [courses,  setCourses]  = useState<any[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(false);
    const [stats,    setStats]    = useState<Stats>({
        totalStudents: 0, todayPresent: 0, todayAbsent: 0,
        notMarkedToday: 0, totalNotes: 0, activeCourses: 0,
    });

    const load = async () => {
        setLoading(true); setError(false);
        try {
            const [meRes, coursesRes] = await Promise.all([
                fetchWithAuth("/api/teacher/me"),
                fetchWithAuth("/api/admin/courses"),
            ]);
            const meData      = await meRes.json();
            const coursesData = await coursesRes.json();

            setTeacher(meData.teacher);
            const allCourses = coursesData.courses || coursesData || [];
            setCourses(allCourses);

            const today = new Date().toISOString().slice(0, 10);
            let totalStudents = 0, todayPresent = 0, todayAbsent = 0, notMarked = 0;

            await Promise.all(allCourses.map(async (course: any) => {
                const attRes  = await fetchWithAuth(`/api/teacher/attendance?courseId=${course._id}&date=${today}`);
                const attData = await attRes.json();
                const enrollments = attData.enrollments || [];
                const attendance  = attData.attendance  || [];

                totalStudents += enrollments.length;
                for (const enr of enrollments) {
                    const att = attendance.find((a: any) => String(a.enrollmentId) === String(enr._id));
                    if (!att?.todayRecord)                                                   { notMarked++;    continue; }
                    if (att.todayRecord.status === "present" || att.todayRecord.status === "late") todayPresent++;
                    else if (att.todayRecord.status === "absent")                            todayAbsent++;
                }
            }));

            let totalNotes = 0;
            try {
                const notesData = await fetchWithAuth("/api/teacher/notes").then(r => r.json());
                totalNotes = (notesData.notes || []).length;
            } catch {}

            setStats({ totalStudents, todayPresent, todayAbsent, notMarkedToday: notMarked, totalNotes, activeCourses: allCourses.length });
        } catch (e) {
            console.error(e); setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const hour     = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
    const greetEmoji = hour < 12 ? "🌤" : hour < 17 ? "☀️" : "🌙";

    const CARDS = [
        { label: "Total Students",   value: stats.totalStudents,  icon: Users,         color: "#14b8a6", bg: "rgba(20,184,166,.08)",  border: "rgba(20,184,166,.2)"  },
        { label: "Present Today",    value: stats.todayPresent,   icon: CalendarCheck, color: "#22c55e", bg: "rgba(34,197,94,.08)",   border: "rgba(34,197,94,.2)"   },
        { label: "Absent Today",     value: stats.todayAbsent,    icon: AlertCircle,   color: "#f87171", bg: "rgba(248,113,113,.08)", border: "rgba(248,113,113,.2)" },
        { label: "Not Marked",       value: stats.notMarkedToday, icon: Clock,         color: "#f59e0b", bg: "rgba(245,158,11,.08)",  border: "rgba(245,158,11,.2)"  },
        { label: "Active Courses",   value: stats.activeCourses,  icon: TrendingUp,    color: "#818cf8", bg: "rgba(129,140,248,.08)", border: "rgba(129,140,248,.2)" },
        { label: "Total Notes",      value: stats.totalNotes,     icon: BookOpen,      color: "#34d399", bg: "rgba(52,211,153,.08)",  border: "rgba(52,211,153,.2)"  },
    ];

    const QUICK = [
        { href: "/dashboard/teacher/attendance", icon: CalendarCheck, label: "Mark Attendance",  sub: "Aaj ki attendance mark karo",   color: "#14b8a6" },
        { href: "/dashboard/teacher/timetable",  icon: Clock,         label: "Manage Timetable", sub: "Class schedule set karo",        color: "#818cf8" },
        { href: "/dashboard/teacher/notes",      icon: BookOpen,      label: "Add Notes",         sub: "Study material create karo",    color: "#34d399" },
    ];

    return (
        <>
            <style>{css}</style>
            <div className="td-root">

                {/* ── Greeting ── */}
                <div className="td-greeting">
                    <div className="td-greeting-left">
                        <div className="td-greeting-eyebrow">
                            <span className="td-eyebrow-dot"/> {greeting} {greetEmoji}
                        </div>
                        <h1 className="td-greeting-name">
                            {loading
                                ? <span className="td-skel td-skel--name"/>
                                : (teacher?.name ?? "Teacher")
                            }
                        </h1>
                        <div className="td-greeting-date">
                            {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                        </div>
                    </div>

                    <div className="td-greeting-right">
                        <div className="td-today-pill">
                            <CalendarCheck size={14} color="#14b8a6"/>
                            <span>Today</span>
                        </div>
                        <button className="td-refresh-btn" onClick={load} disabled={loading} title="Refresh">
                            <RefreshCw size={13} className={loading ? "td-spin" : ""}/>
                        </button>
                    </div>
                </div>

                {/* ── Error state ── */}
                {error && !loading && (
                    <div className="td-error-banner">
                        <AlertCircle size={15}/>
                        <span>Data load nahi hua. </span>
                        <button className="td-retry-btn" onClick={load}>Retry karo</button>
                    </div>
                )}

                {/* ── KPI Cards ── */}
                <div className="td-cards">
                    {CARDS.map(c => {
                        const Icon = c.icon;
                        return (
                            <div key={c.label} className="td-card" style={{ background: c.bg, borderColor: c.border }}>
                                {loading ? (
                                    <>
                                        <div className="td-skel td-skel--icon"/>
                                        <div className="td-skel td-skel--val"/>
                                        <div className="td-skel td-skel--label"/>
                                    </>
                                ) : (
                                    <>
                                        <div className="td-card-icon-wrap" style={{ color: c.color, background: c.bg, borderColor: c.border }}>
                                            <Icon size={17}/>
                                        </div>
                                        <div className="td-card-val" style={{ color: c.color }}>{c.value}</div>
                                        <div className="td-card-label">{c.label}</div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ── Attendance snapshot ── */}
                {!loading && !error && stats.totalStudents > 0 && (
                    <div className="td-att-snapshot">
                        <div className="td-snapshot-title">Today's Attendance Snapshot</div>
                        <div className="td-snapshot-bar-wrap">
                            <div className="td-snapshot-bar">
                                {stats.todayPresent > 0 && (
                                    <div className="td-bar-seg td-bar-seg--present"
                                        style={{ width: `${(stats.todayPresent / stats.totalStudents) * 100}%` }}/>
                                )}
                                {stats.todayAbsent > 0 && (
                                    <div className="td-bar-seg td-bar-seg--absent"
                                        style={{ width: `${(stats.todayAbsent / stats.totalStudents) * 100}%` }}/>
                                )}
                                {stats.notMarkedToday > 0 && (
                                    <div className="td-bar-seg td-bar-seg--unmarked"
                                        style={{ width: `${(stats.notMarkedToday / stats.totalStudents) * 100}%` }}/>
                                )}
                            </div>
                            <div className="td-snapshot-pct">
                                {Math.round((stats.todayPresent / stats.totalStudents) * 100)}% present
                            </div>
                        </div>
                        <div className="td-snapshot-legend">
                            {[
                                { color: "#22c55e", label: `Present (${stats.todayPresent})` },
                                { color: "#f87171", label: `Absent (${stats.todayAbsent})`   },
                                { color: "#334155", label: `Unmarked (${stats.notMarkedToday})` },
                            ].map(l => (
                                <div key={l.label} className="td-legend-item">
                                    <span className="td-legend-dot" style={{ background: l.color }}/>
                                    <span>{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Active Courses ── */}
                <div className="td-section-head">
                    <span className="td-section-title">Active Courses</span>
                    {!loading && <span className="td-section-count">{courses.length}</span>}
                </div>

                {loading ? (
                    <div className="td-courses">
                        {[1,2,3].map(i => <div key={i} className="td-course-card td-course-card--skel"><div className="td-skel td-skel--course"/></div>)}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="td-empty">Koi course nahi mila</div>
                ) : (
                    <div className="td-courses">
                        {courses.map((c: any, i: number) => (
                            <div key={c._id} className="td-course-card" style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="td-course-num">{String(i+1).padStart(2,"0")}</div>
                                <div className="td-course-dot"/>
                                <div className="td-course-name">{c.name}</div>
                                <a href="/dashboard/teacher/attendance" className="td-course-cta">
                                    Mark Attendance <ArrowRight size={11}/>
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Quick Actions ── */}
                <div className="td-section-head">
                    <span className="td-section-title">Quick Actions</span>
                </div>
                <div className="td-quick">
                    {QUICK.map((q, i) => {
                        const Icon = q.icon;
                        return (
                            <a key={q.href} href={q.href} className="td-quick-card"
                                style={{ animationDelay: `${i * 80}ms` }}>
                                <div className="td-quick-icon"
                                    style={{ color: q.color, background: `${q.color}14`, borderColor: `${q.color}38` }}>
                                    <Icon size={19}/>
                                </div>
                                <div className="td-quick-text">
                                    <div className="td-quick-label">{q.label}</div>
                                    <div className="td-quick-sub">{q.sub}</div>
                                </div>
                                <ArrowRight size={13} className="td-quick-arrow" style={{ color: q.color }}/>
                            </a>
                        );
                    })}
                </div>

            </div>
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

.td-root { display:flex; flex-direction:column; gap:20px; max-width:960px; margin:0 auto; font-family:'Plus Jakarta Sans',sans-serif; }

/* ── Skeleton ── */
.td-skel {
    background: linear-gradient(90deg, #0d1b24 25%, #132330 50%, #0d1b24 75%);
    background-size: 200% 100%;
    animation: tdShimmer 1.4s ease infinite;
    border-radius: 6px;
}
@keyframes tdShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.td-skel--name  { height: 36px; width: 55%; border-radius: 8px; display:inline-block; }
.td-skel--icon  { height: 32px; width: 32px; border-radius: 8px; margin-bottom: 8px; }
.td-skel--val   { height: 28px; width: 50%; border-radius: 6px; margin-bottom: 6px; }
.td-skel--label { height: 10px; width: 70%; border-radius: 4px; }
.td-skel--course{ height: 20px; width: 60%; border-radius: 5px; }

/* ── Spin ── */
@keyframes tdSpin { to { transform: rotate(360deg); } }
.td-spin { animation: tdSpin .7s linear infinite; }

/* ── Fade in cards ── */
@keyframes tdFadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── Greeting ── */
.td-greeting {
    display:flex; align-items:flex-start; justify-content:space-between;
    flex-wrap:wrap; gap:14px;
    background: linear-gradient(135deg, #0d1b24 0%, #0a1920 100%);
    border: 1px solid #132330;
    border-radius: 18px; padding: 26px 28px;
    position: relative; overflow: hidden;
}
.td-greeting::after {
    content:''; position:absolute; top:-60px; right:-60px;
    width:200px; height:200px; border-radius:50%;
    background: radial-gradient(circle, rgba(20,184,166,.08) 0%, transparent 70%);
    pointer-events: none;
}
.td-greeting-left { display:flex; flex-direction:column; gap:6px; }
.td-greeting-eyebrow {
    display:flex; align-items:center; gap:7px;
    font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:#14b8a6;
}
.td-eyebrow-dot {
    width:6px; height:6px; border-radius:50%; background:#14b8a6;
    box-shadow: 0 0 8px #14b8a6; animation: tdPulse 2s ease-in-out infinite;
}
@keyframes tdPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
.td-greeting-name {
    font-family:'DM Serif Display',serif; font-size:2rem; color:#f8fafc;
    font-weight:400; line-height:1.2; margin:0;
}
.td-greeting-date { font-size:12px; color:#475569; }

.td-greeting-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.td-today-pill {
    display:flex; align-items:center; gap:7px;
    padding:8px 14px; background:rgba(20,184,166,.08);
    border:1px solid rgba(20,184,166,.2); border-radius:100px;
    font-size:12px; font-weight:700; color:#14b8a6;
}
.td-refresh-btn {
    width:34px; height:34px; border-radius:9px;
    border:1px solid #132330; background:transparent;
    color:#475569; cursor:pointer; display:flex;
    align-items:center; justify-content:center;
    transition:all .14s;
}
.td-refresh-btn:hover:not(:disabled) { border-color:#14b8a6; color:#14b8a6; background:rgba(20,184,166,.06); }
.td-refresh-btn:disabled { opacity:.5; cursor:not-allowed; }

/* ── Error banner ── */
.td-error-banner {
    display:flex; align-items:center; gap:10px;
    background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.2);
    border-radius:12px; padding:12px 16px;
    font-size:13px; color:#f87171;
}
.td-retry-btn {
    background:transparent; border:none; color:#14b8a6;
    font-size:13px; font-weight:700; cursor:pointer; text-decoration:underline;
    font-family:'Plus Jakarta Sans',sans-serif;
}

/* ── KPI Cards ── */
.td-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.td-card {
    border:1px solid; border-radius:14px; padding:18px 20px;
    display:flex; flex-direction:column; gap:5px;
    transition:transform .15s, box-shadow .15s;
    animation: tdFadeUp .4s ease both;
}
.td-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.25); }
.td-card-icon-wrap {
    width:34px; height:34px; border-radius:9px; border:1px solid;
    display:flex; align-items:center; justify-content:center; margin-bottom:4px;
}
.td-card-val   { font-family:'DM Serif Display',serif; font-size:1.9rem; line-height:1; }
.td-card-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; }

/* ── Attendance Snapshot ── */
.td-att-snapshot {
    background:#0d1b24; border:1px solid #132330;
    border-radius:14px; padding:18px 22px;
    display:flex; flex-direction:column; gap:12px;
    animation: tdFadeUp .4s ease both;
}
.td-snapshot-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#475569; }
.td-snapshot-bar-wrap { display:flex; align-items:center; gap:12px; }
.td-snapshot-bar {
    flex:1; height:10px; border-radius:100px;
    background:#132330; overflow:hidden;
    display:flex;
}
.td-bar-seg { height:100%; transition:width .6s ease; }
.td-bar-seg--present  { background:#22c55e; }
.td-bar-seg--absent   { background:#f87171; }
.td-bar-seg--unmarked { background:#334155; }
.td-snapshot-pct { font-size:13px; font-weight:800; color:#22c55e; white-space:nowrap; }
.td-snapshot-legend { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.td-legend-item { display:flex; align-items:center; gap:6px; font-size:11px; color:#64748b; }
.td-legend-dot  { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

/* ── Section head ── */
.td-section-head { display:flex; align-items:center; gap:8px; }
.td-section-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:#334155; }
.td-section-count {
    font-size:10px; font-weight:800; padding:2px 8px; border-radius:100px;
    background:#132330; color:#64748b;
}

/* ── Courses ── */
.td-courses { display:flex; flex-direction:column; gap:7px; }
.td-course-card {
    display:flex; align-items:center; gap:12px;
    background:#0d1b24; border:1px solid #132330;
    border-radius:11px; padding:12px 18px;
    transition:border-color .14s, background .14s;
    animation: tdFadeUp .4s ease both;
}
.td-course-card:hover { border-color:rgba(20,184,166,.25); background:rgba(20,184,166,.03); }
.td-course-card--skel { pointer-events:none; min-height:46px; }
.td-course-num  { font-size:10px; font-weight:800; color:#1e3a4a; min-width:22px; }
.td-course-dot  { width:7px; height:7px; border-radius:50%; background:#14b8a6; flex-shrink:0; }
.td-course-name { font-size:13px; font-weight:600; color:#e2e8f0; flex:1; }
.td-course-cta  {
    display:flex; align-items:center; gap:5px;
    font-size:11px; font-weight:700; color:#14b8a6;
    text-decoration:none; white-space:nowrap;
    opacity:.7; transition:opacity .13s;
}
.td-course-cta:hover { opacity:1; }

/* ── Quick Actions ── */
.td-quick { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.td-quick-card {
    display:flex; align-items:center; gap:14px;
    padding:16px 18px; background:#0d1b24;
    border:1px solid #132330; border-radius:14px;
    text-decoration:none;
    transition:border-color .14s, background .14s, transform .14s;
    animation: tdFadeUp .45s ease both;
    position:relative;
}
.td-quick-card:hover { transform:translateY(-2px); border-color:rgba(20,184,166,.25); background:#0a161e; }
.td-quick-icon {
    width:40px; height:40px; border-radius:11px; border:1px solid;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.td-quick-text { flex:1; min-width:0; }
.td-quick-label { font-size:13px; font-weight:700; color:#f1f5f9; margin-bottom:3px; }
.td-quick-sub   { font-size:11px; color:#475569; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.td-quick-arrow { flex-shrink:0; opacity:.5; transition:opacity .14s, transform .14s; }
.td-quick-card:hover .td-quick-arrow { opacity:1; transform:translateX(3px); }

.td-empty {
    padding:32px; text-align:center; font-size:13px; color:#475569;
    background:#0d1b24; border:1px dashed #132330; border-radius:12px;
}

@media(max-width:700px){
    .td-cards { grid-template-columns:repeat(2,1fr); }
    .td-quick { grid-template-columns:1fr; }
    .td-greeting-name { font-size:1.6rem; }
}
@media(max-width:420px){
    .td-cards { grid-template-columns:1fr 1fr; }
}
`;