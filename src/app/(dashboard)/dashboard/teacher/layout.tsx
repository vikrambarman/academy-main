"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    LayoutDashboard, CalendarCheck, Clock,
    BookOpen, LogOut, Menu, X, ChevronRight, GraduationCap
} from "lucide-react";
import { PortalThemeToggle } from "@/components/ThemeToggle";

const NAV = [
    { href:"/dashboard/teacher",            label:"Dashboard",  icon:LayoutDashboard },
    { href:"/dashboard/teacher/attendance", label:"Attendance", icon:CalendarCheck   },
    { href:"/dashboard/teacher/timetable",  label:"Timetable",  icon:Clock           },
    { href:"/dashboard/teacher/notes",      label:"Notes",      icon:BookOpen        },
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
        await fetch("/api/auth/logout", { method:"POST" });
        router.push("/teacher/login");
    };

    const active = (href: string) =>
        href === "/dashboard/teacher" ? pathname === href : pathname.startsWith(href);

    return (
        <>
            <style>{css}</style>
            <div className="lay-root">

                {/* Sidebar */}
                <aside className={`lay-sidebar ${open ? "open" : ""}`}>
                    <div className="lay-sidebar-inner">

                        <div className="lay-brand">
                            <div className="lay-brand-icon"><GraduationCap size={18} /></div>
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
                                    <Icon size={16} />
                                    <span>{label}</span>
                                    {active(href) && <ChevronRight size={11} className="lay-arrow" />}
                                </a>
                            ))}
                        </nav>

                        <button className="lay-logout" onClick={handleLogout}>
                            <LogOut size={14} /> <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {open && <div className="lay-overlay" onClick={() => setOpen(false)} />}

                {/* Main */}
                <div className="lay-main">
                    <header className="lay-topbar">
                        <button className="lay-menu-btn" onClick={() => setOpen(s => !s)}>
                            {open ? <X size={17} /> : <Menu size={17} />}
                        </button>
                        <span className="lay-topbar-title">
                            {NAV.find(n => active(n.href))?.label ?? "Teacher Portal"}
                        </span>
                        <div style={{ marginLeft:"auto" }}>
                            <PortalThemeToggle rootClass="lay-root" storageKey="teacher-portal-theme" />
                        </div>
                    </header>
                    <main className="lay-content">{children}</main>
                </div>
            </div>
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

/* ── Teacher Portal Variables — Dark (default) ── */
.lay-root {
    --tp-bg:          #042F2E;
    --tp-surface:     #0D3B37;
    --tp-surface2:    #134E4A;
    --tp-border:      #134E4A;
    --tp-border2:     #1A6B65;
    --tp-accent:      #0F766E;
    --tp-accent2:     #14B8A6;
    --tp-accent-glow: rgba(20,184,166,0.10);
    --tp-accent-b:    rgba(20,184,166,0.22);
    --tp-text:        #CCFBF1;
    --tp-subtext:     #94A3B8;
    --tp-muted:       #64748B;
    --tp-danger:      #EF4444;
    --tp-success:     #22C55E;
    --tp-warn:        #F59E0B;
    --tp-sb-w:        240px;
}

/* ── Light mode override ── */
.lay-root.light {
    --tp-bg:          #F0FDFA;
    --tp-surface:     #FFFFFF;
    --tp-surface2:    #F0FDFA;
    --tp-border:      #99F6E4;
    --tp-border2:     #5EEAD4;
    --tp-accent:      #0F766E;
    --tp-accent2:     #0D9488;
    --tp-accent-glow: rgba(15,118,110,0.08);
    --tp-accent-b:    rgba(15,118,110,0.22);
    --tp-text:        #0F172A;
    --tp-subtext:     #475569;
    --tp-muted:       #94A3B8;
    --tp-danger:      #DC2626;
    --tp-success:     #059669;
    --tp-warn:        #D97706;
}

.lay-root {
    display: flex; min-height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--tp-text);
    background: var(--tp-bg);
}

/* Sidebar */
.lay-sidebar {
    width: var(--tp-sb-w); flex-shrink: 0;
    background: var(--tp-surface);
    border-right: 1px solid var(--tp-border);
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 40;
    transition: transform .24s ease;
}

/* Teal top accent */
.lay-sidebar::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--tp-accent2), transparent);
}

.lay-sidebar-inner {
    display: flex; flex-direction: column; height: 100%;
    overflow-y: auto; scrollbar-width: none;
}

.lay-brand {
    display: flex; align-items: center; gap: 11px;
    padding: 22px 18px 16px;
    border-bottom: 1px solid var(--tp-border);
}
.lay-brand-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--tp-accent-glow);
    border: 1px solid var(--tp-accent-b);
    color: var(--tp-accent2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.lay-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: .92rem; color: var(--tp-text);
}
.lay-brand-role {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .1em; color: var(--tp-accent2); margin-top: 1px;
}

.lay-profile {
    display: flex; align-items: center; gap: 10px;
    margin: 12px 10px 0; padding: 11px 12px;
    background: var(--tp-accent-glow);
    border: 1px solid var(--tp-accent-b);
    border-radius: 11px;
}
.lay-profile-av {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--tp-accent2); color: var(--tp-bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; flex-shrink: 0;
}
.lay-profile-name { font-size: 12px; font-weight: 700; color: var(--tp-text); }
.lay-profile-id   { font-size: 10px; color: var(--tp-accent2); margin-top: 1px; }

.lay-nav {
    display: flex; flex-direction: column; gap: 2px;
    padding: 14px 8px; flex: 1;
}
.lay-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 9px;
    font-size: 13px; font-weight: 600; color: var(--tp-muted);
    text-decoration: none; transition: all .13s; position: relative;
}
.lay-nav-item:hover { background: var(--tp-accent-glow); color: var(--tp-text); }
.lay-nav-item.active {
    background: var(--tp-accent-glow);
    color: var(--tp-accent2);
    border: 1px solid var(--tp-accent-b);
}
/* Active left bar */
.lay-nav-item.active::before {
    content: '';
    position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 16px; border-radius: 2px;
    background: var(--tp-accent2);
}
.lay-arrow { margin-left: auto; }

.lay-logout {
    display: flex; align-items: center; gap: 9px;
    margin: 6px 8px 16px; padding: 9px 12px; border-radius: 9px;
    background: transparent; border: 1px solid var(--tp-border);
    color: var(--tp-muted);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all .13s;
}
.lay-logout:hover { border-color: #7f1d1d; color: #f87171; background: rgba(239,68,68,.06); }

/* Main */
.lay-main {
    margin-left: var(--tp-sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
}
.lay-topbar {
    display: none; align-items: center; gap: 12px;
    padding: 13px 18px;
    background: var(--tp-surface);
    border-bottom: 1px solid var(--tp-border);
    position: sticky; top: 0; z-index: 30;
}
.lay-menu-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid var(--tp-border); background: transparent;
    color: var(--tp-muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
}
.lay-topbar-title { font-size: 14px; font-weight: 700; color: var(--tp-text); }
.lay-content { flex: 1; padding: 28px 32px; }
.lay-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,.6); z-index: 39; backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
    .lay-sidebar { transform: translateX(-100%); }
    .lay-sidebar.open { transform: translateX(0); }
    .lay-main { margin-left: 0; }
    .lay-topbar { display: flex; }
    .lay-overlay { display: block; }
    .lay-content { padding: 18px 14px; }
}
`;