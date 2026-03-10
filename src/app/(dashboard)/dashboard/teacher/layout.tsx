// src/app/(dashboard)/dashboard/teacher/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    LayoutDashboard, CalendarCheck, Clock,
    BookOpen, LogOut, Menu, X, ChevronRight, GraduationCap
} from "lucide-react";

const NAV = [
    { href: "/dashboard/teacher",            label: "Dashboard",  icon: LayoutDashboard },
    { href: "/dashboard/teacher/attendance", label: "Attendance", icon: CalendarCheck   },
    { href: "/dashboard/teacher/timetable",  label: "Timetable",  icon: Clock           },
    { href: "/dashboard/teacher/notes",      label: "Notes",      icon: BookOpen        },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router   = useRouter();
    const [open,    setOpen]    = useState(false);
    const [teacher, setTeacher] = useState<{ name: string; employeeId: string } | null>(null);

    useEffect(() => {
        fetchWithAuth("/api/teacher/me")
            .then(r => r.json())
            .then(d => setTeacher(d.teacher))
            .catch(() => {});
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/teacher/login");
    };

    const active = (href: string) =>
        href === "/dashboard/teacher" ? pathname === href : pathname.startsWith(href);

    return (
        <>
            <style>{css}</style>
            <div className="lay-root">

                {/* ── Sidebar ── */}
                <aside className={`lay-sidebar ${open ? "open" : ""}`}>
                    <div className="lay-sidebar-inner">

                        <div className="lay-brand">
                            <div className="lay-brand-icon"><GraduationCap size={18}/></div>
                            <div>
                                <div className="lay-brand-name">Shivshakti Computer Academy</div>
                                <div className="lay-brand-role">Teacher Portal</div>
                            </div>
                        </div>

                        {teacher && (
                            <div className="lay-profile">
                                <div className="lay-profile-av">{teacher.name?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div className="lay-profile-name">{teacher.name}</div>
                                    <div className="lay-profile-id">{teacher.employeeId}</div>
                                </div>
                            </div>
                        )}

                        <nav className="lay-nav">
                            {NAV.map(({ href, label, icon: Icon }) => (
                                <a key={href} href={href}
                                    className={`lay-nav-item ${active(href) ? "active" : ""}`}
                                    onClick={() => setOpen(false)}>
                                    <Icon size={16}/>
                                    <span>{label}</span>
                                    {active(href) && <ChevronRight size={11} className="lay-arrow"/>}
                                </a>
                            ))}
                        </nav>

                        <button className="lay-logout" onClick={handleLogout}>
                            <LogOut size={14}/> <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {open && <div className="lay-overlay" onClick={() => setOpen(false)}/>}

                {/* ── Main ── */}
                <div className="lay-main">
                    <header className="lay-topbar">
                        <button className="lay-menu-btn" onClick={() => setOpen(s => !s)}>
                            {open ? <X size={17}/> : <Menu size={17}/>}
                        </button>
                        <span className="lay-topbar-title">
                            {NAV.find(n => active(n.href))?.label ?? "Teacher Portal"}
                        </span>
                    </header>
                    <main className="lay-content">{children}</main>
                </div>
            </div>
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root{
    --teal:#14b8a6; --teal-dim:rgba(20,184,166,.1); --teal-b:rgba(20,184,166,.22);
    --bg:#07111a; --surf:#0d1b24; --border:#132330;
    --text:#e2e8f0; --muted:#64748b; --sw:240px;
}

.lay-root{display:flex;min-height:100vh;font-family:'Plus Jakarta Sans',sans-serif;color:var(--text);background:var(--bg);}

/* Sidebar */
.lay-sidebar{width:var(--sw);flex-shrink:0;background:var(--surf);border-right:1px solid var(--border);position:fixed;top:0;left:0;bottom:0;z-index:40;transition:transform .24s ease;}
.lay-sidebar-inner{display:flex;flex-direction:column;height:100%;overflow-y:auto;scrollbar-width:none;}

.lay-brand{display:flex;align-items:center;gap:11px;padding:22px 18px 16px;border-bottom:1px solid var(--border);}
.lay-brand-icon{width:34px;height:34px;border-radius:9px;background:var(--teal-dim);border:1px solid var(--teal-b);color:var(--teal);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.lay-brand-name{font-family:'DM Serif Display',serif;font-size:.92rem;color:#f8fafc;}
.lay-brand-role{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--teal);margin-top:1px;}

.lay-profile{display:flex;align-items:center;gap:10px;margin:12px 10px 0;padding:11px 12px;background:var(--teal-dim);border:1px solid var(--teal-b);border-radius:11px;}
.lay-profile-av{width:32px;height:32px;border-radius:50%;background:var(--teal);color:#042f2e;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;}
.lay-profile-name{font-size:12px;font-weight:700;color:#f1f5f9;}
.lay-profile-id{font-size:10px;color:var(--teal);margin-top:1px;}

.lay-nav{display:flex;flex-direction:column;gap:2px;padding:14px 8px;flex:1;}
.lay-nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;font-size:13px;font-weight:600;color:var(--muted);text-decoration:none;transition:all .13s;position:relative;}
.lay-nav-item:hover{background:rgba(255,255,255,.04);color:var(--text);}
.lay-nav-item.active{background:var(--teal-dim);color:var(--teal);border:1px solid var(--teal-b);}
.lay-arrow{margin-left:auto;}

.lay-logout{display:flex;align-items:center;gap:9px;margin:6px 8px 16px;padding:9px 12px;border-radius:9px;background:transparent;border:1px solid var(--border);color:var(--muted);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .13s;}
.lay-logout:hover{border-color:#7f1d1d;color:#f87171;background:rgba(239,68,68,.06);}

/* Main */
.lay-main{margin-left:var(--sw);flex:1;display:flex;flex-direction:column;min-height:100vh;}
.lay-topbar{display:none;align-items:center;gap:12px;padding:13px 18px;background:var(--surf);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:30;}
.lay-menu-btn{width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;}
.lay-topbar-title{font-size:14px;font-weight:700;color:var(--text);}
.lay-content{flex:1;padding:28px 32px;}
.lay-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:39;backdrop-filter:blur(2px);}

@media(max-width:768px){
    .lay-sidebar{transform:translateX(-100%);}
    .lay-sidebar.open{transform:translateX(0);}
    .lay-main{margin-left:0;}
    .lay-topbar{display:flex;}
    .lay-overlay{display:block;}
    .lay-content{padding:18px 14px;}
}
`;