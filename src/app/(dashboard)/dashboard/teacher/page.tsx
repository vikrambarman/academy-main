// src/app/(dashboard)/dashboard/teacher/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { CalendarCheck, Clock, BookOpen, Users, TrendingUp, AlertCircle } from "lucide-react";

interface Stats {
    totalStudents: number;
    todayPresent: number;
    todayAbsent: number;
    notMarkedToday: number;
    totalNotes: number;
    activeCourses: number;
}

interface RecentActivity {
    type: "attendance" | "note";
    text: string;
    time: string;
}

export default function TeacherDashboard() {
    const [teacher, setTeacher] = useState<{ name: string } | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats]     = useState<Stats>({
        totalStudents: 0, todayPresent: 0, todayAbsent: 0,
        notMarkedToday: 0, totalNotes: 0, activeCourses: 0
    });

    useEffect(() => {
        const load = async () => {
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

                // Fetch attendance stats for all courses
                const today = new Date().toISOString().slice(0, 10);
                let totalStudents = 0, todayPresent = 0, todayAbsent = 0, notMarked = 0;

                for (const course of allCourses) {
                    const attRes = await fetchWithAuth(`/api/teacher/attendance?courseId=${course._id}&date=${today}`);
                    const attData = await attRes.json();
                    const enrollments = attData.enrollments || [];
                    const attendance  = attData.attendance  || [];

                    totalStudents += enrollments.length;

                    for (const enr of enrollments) {
                        const att = attendance.find((a: any) => String(a.enrollmentId) === String(enr._id));
                        if (!att?.todayRecord) { notMarked++; continue; }
                        if (att.todayRecord.status === "present" || att.todayRecord.status === "late") todayPresent++;
                        else if (att.todayRecord.status === "absent") todayAbsent++;
                    }
                }

                // Notes count
                let totalNotes = 0;
                try {
                    const notesRes  = await fetchWithAuth("/api/teacher/notes");
                    const notesData = await notesRes.json();
                    totalNotes = (notesData.notes || []).length;
                } catch {}

                setStats({ totalStudents, todayPresent, todayAbsent, notMarkedToday: notMarked, totalNotes, activeCourses: allCourses.length });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const hour    = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    const CARDS = [
        { label: "Total Students",   value: stats.totalStudents,   icon: Users,         color: "#14b8a6", bg: "rgba(20,184,166,.1)",  border: "rgba(20,184,166,.22)" },
        { label: "Present Today",    value: stats.todayPresent,    icon: CalendarCheck, color: "#22c55e", bg: "rgba(34,197,94,.1)",   border: "rgba(34,197,94,.22)"  },
        { label: "Absent Today",     value: stats.todayAbsent,     icon: AlertCircle,   color: "#f87171", bg: "rgba(248,113,113,.1)", border: "rgba(248,113,113,.22)" },
        { label: "Not Marked Today", value: stats.notMarkedToday,  icon: Clock,         color: "#f59e0b", bg: "rgba(245,158,11,.1)",  border: "rgba(245,158,11,.22)"  },
        { label: "Active Courses",   value: stats.activeCourses,   icon: TrendingUp,    color: "#818cf8", bg: "rgba(129,140,248,.1)", border: "rgba(129,140,248,.22)" },
        { label: "Total Notes",      value: stats.totalNotes,      icon: BookOpen,      color: "#34d399", bg: "rgba(52,211,153,.1)",  border: "rgba(52,211,153,.22)"  },
    ];

    return (
        <>
            <style>{css}</style>
            <div className="td-root">

                {/* Greeting */}
                <div className="td-greeting">
                    <div>
                        <div className="td-greeting-sub">{greeting} 👋</div>
                        <h1 className="td-greeting-name">
                            {loading ? "..." : teacher?.name ?? "Teacher"}
                        </h1>
                        <div className="td-greeting-date">
                            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </div>
                    </div>
                    <div className="td-greeting-badge">
                        <CalendarCheck size={18} color="#14b8a6"/>
                        <span>{new Date().toLocaleDateString("en-IN", { weekday: "long" })}</span>
                    </div>
                </div>

                {/* KPI cards */}
                <div className="td-cards">
                    {CARDS.map(c => {
                        const Icon = c.icon;
                        return (
                            <div key={c.label} className="td-card"
                                style={{ background: c.bg, borderColor: c.border }}>
                                <div className="td-card-icon" style={{ color: c.color }}>
                                    <Icon size={20}/>
                                </div>
                                <div className="td-card-val" style={{ color: c.color }}>
                                    {loading ? "—" : c.value}
                                </div>
                                <div className="td-card-label">{c.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Courses quick view */}
                <div className="td-section-title">Active Courses</div>
                {loading ? (
                    <div className="td-empty">Loading...</div>
                ) : courses.length === 0 ? (
                    <div className="td-empty">Koi course nahi mila</div>
                ) : (
                    <div className="td-courses">
                        {courses.map((c: any) => (
                            <div key={c._id} className="td-course-card">
                                <div className="td-course-dot"/>
                                <div className="td-course-name">{c.name}</div>
                                <a href="/dashboard/teacher/attendance" className="td-course-link">
                                    Mark Attendance →
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick links */}
                <div className="td-section-title">Quick Actions</div>
                <div className="td-quick">
                    {[
                        { href: "/dashboard/teacher/attendance", icon: CalendarCheck, label: "Mark Attendance", sub: "Aaj ki attendance mark karo" },
                        { href: "/dashboard/teacher/timetable",  icon: Clock,         label: "Manage Timetable", sub: "Class schedule set karo"    },
                        { href: "/dashboard/teacher/notes",      icon: BookOpen,      label: "Add Notes",        sub: "Study material add karo"    },
                    ].map(q => {
                        const Icon = q.icon;
                        return (
                            <a key={q.href} href={q.href} className="td-quick-card">
                                <div className="td-quick-icon"><Icon size={18}/></div>
                                <div>
                                    <div className="td-quick-label">{q.label}</div>
                                    <div className="td-quick-sub">{q.sub}</div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

const css = `
.td-root{display:flex;flex-direction:column;gap:22px;max-width:960px;margin:0 auto;}

.td-greeting{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;background:#0d1b24;border:1px solid #132330;border-radius:16px;padding:24px 28px;}
.td-greeting-sub{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#14b8a6;margin-bottom:6px;}
.td-greeting-name{font-family:'DM Serif Display',serif;font-size:1.9rem;color:#f8fafc;font-weight:400;margin-bottom:4px;}
.td-greeting-date{font-size:12px;color:#64748b;}
.td-greeting-badge{display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(20,184,166,.08);border:1px solid rgba(20,184,166,.2);border-radius:10px;font-size:13px;font-weight:700;color:#14b8a6;}

.td-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.td-card{border:1px solid;border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:6px;}
.td-card-icon{margin-bottom:2px;}
.td-card-val{font-family:'DM Serif Display',serif;font-size:1.8rem;}
.td-card-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748b;}

.td-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#475569;}

.td-courses{display:flex;flex-direction:column;gap:8px;}
.td-course-card{display:flex;align-items:center;gap:12px;background:#0d1b24;border:1px solid #132330;border-radius:11px;padding:13px 18px;}
.td-course-dot{width:8px;height:8px;border-radius:50%;background:#14b8a6;flex-shrink:0;}
.td-course-name{font-size:13px;font-weight:600;color:#e2e8f0;flex:1;}
.td-course-link{font-size:11px;font-weight:700;color:#14b8a6;text-decoration:none;white-space:nowrap;}
.td-course-link:hover{text-decoration:underline;}

.td-quick{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.td-quick-card{display:flex;align-items:center;gap:14px;padding:16px 18px;background:#0d1b24;border:1px solid #132330;border-radius:13px;text-decoration:none;transition:all .14s;}
.td-quick-card:hover{border-color:rgba(20,184,166,.3);background:rgba(20,184,166,.05);}
.td-quick-icon{width:38px;height:38px;border-radius:10px;background:rgba(20,184,166,.1);border:1px solid rgba(20,184,166,.2);color:#14b8a6;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.td-quick-label{font-size:13px;font-weight:700;color:#f1f5f9;margin-bottom:3px;}
.td-quick-sub{font-size:11px;color:#64748b;}

.td-empty{padding:28px;text-align:center;font-size:13px;color:#475569;background:#0d1b24;border:1px dashed #132330;border-radius:12px;}

@media(max-width:700px){
    .td-cards{grid-template-columns:repeat(2,1fr);}
    .td-quick{grid-template-columns:1fr;}
}
@media(max-width:480px){
    .td-cards{grid-template-columns:1fr 1fr;}
}
`;