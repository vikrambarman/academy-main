"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import {
    LayoutDashboard, Users, BookOpen, BarChart3,
    FileText, Settings, LogOut, Menu, Notebook,
    IndianRupee, Award, CalendarDays, Clock,
    ChevronRight, Bell,
} from "lucide-react";
import AuthGuard from "@/components/AuthGaurd";
import { PortalThemeToggle } from "@/components/ThemeToggle";

const menuSections = [
    {
        title: "CORE",
        items: [
            { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
        ],
    },
    {
        title: "MANAGEMENT",
        items: [
            { name: "Students", href: "/dashboard/admin/students", icon: Users },
            { name: "Teachers", href: "/dashboard/admin/teachers", icon: Users },
            { name: "Courses", href: "/dashboard/admin/courses", icon: BookOpen },
            { name: "Enrollments", href: "/dashboard/admin/enroll", icon: Users },
            { name: "Fees", href: "/dashboard/admin/fees", icon: IndianRupee },
            { name: "Certificates", href: "/dashboard/admin/certificates", icon: Award },
            { name: "Notices", href: "/dashboard/admin/notices", icon: Bell },
            { name: "Enquiries", href: "/dashboard/admin/enquiries", icon: BarChart3 },
            { name: "Contacts", href: "/dashboard/admin/contacts", icon: Users },
            { name: "Notes", href: "/dashboard/admin/notes", icon: Notebook },
            { name: "Attendance", href: "/dashboard/admin/attendance", icon: CalendarDays },
            { name: "Timetable", href: "/dashboard/admin/timetable", icon: Clock },
        ],
    },
    {
        title: "ANALYTICS",
        items: [
            { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
            { name: "Transactions", href: "/dashboard/admin/transactions", icon: FileText },
        ],
    },
    {
        title: "SYSTEM",
        items: [
            { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        ],
    },
];

function AdminAvatar({ name = "Admin", size = 30 }: { name?: string; size?: number }) {
    const initials = name.charAt(0).toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--cp-accent), #3B82F6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.38, fontWeight: 700, color: "#fff",
        }}>
            {initials}
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname() ?? "";

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node))
                setProfileOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const pageTitle = useMemo(() => {
        const all = menuSections.flatMap(s => s.items);
        return all.find(i => pathname === i.href || pathname.startsWith(i.href + "/"))?.name ?? "Admin Panel";
    }, [pathname]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        router.replace("/admin/login");
    };

    return (
        <AuthGuard>
            <>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                    /* ── Admin Portal CSS Variables ── */
                    .cp-root {
                        --cp-bg:          #0F172A;
                        --cp-surface:     #1E293B;
                        --cp-surface2:    #273548;
                        --cp-border:      #334155;
                        --cp-border2:     #3E506B;
                        --cp-accent:      #1A56DB;
                        --cp-accent-dim:  #1044B0;
                        --cp-accent-glow: rgba(26,86,219,0.12);
                        --cp-accent-glow2:rgba(26,86,219,0.06);
                        --cp-text:        #F1F5F9;
                        --cp-subtext:     #94A3B8;
                        --cp-muted:       #64748B;
                        --cp-danger:      #EF4444;
                        --cp-success:     #22C55E;
                        --cp-warning:     #F59E0B;
                        --cp-sb-w:        230px;
                        --cp-sb-w-col:    62px;
                        --cp-top-h:       56px;
                    }
                    /* Light mode — cp-root.light pe override */
                    .cp-root.light {
                        --cp-bg:          #F1F5F9;
                        --cp-surface:     #FFFFFF;
                        --cp-surface2:    #F8FAFC;
                        --cp-border:      #E2E8F0;
                        --cp-border2:     #CBD5E1;
                        --cp-accent:      #1A56DB;
                        --cp-accent-dim:  #1044B0;
                        --cp-accent-glow: rgba(26,86,219,0.08);
                        --cp-accent-glow2:rgba(26,86,219,0.04);
                        --cp-text:        #0F172A;
                        --cp-subtext:     #475569;
                        --cp-muted:       #94A3B8;
                    }

                    .cp-root * { box-sizing: border-box; }
                    .cp-root {
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        background: var(--cp-bg);
                        color: var(--cp-text);
                        display: flex; height: 100vh; overflow: hidden; width: 100%;
                    }

                    /* Mobile overlay */
                    .cp-overlay {
                        position: fixed; inset: 0; z-index: 40;
                        background: rgba(15,23,42,0.75);
                        backdrop-filter: blur(3px);
                        animation: cpFade 0.18s ease;
                    }
                    @keyframes cpFade { from { opacity:0; } to { opacity:1; } }

                    /* ══ SIDEBAR ══ */
                    .cp-sidebar {
                        position: fixed; top: 0; left: 0; z-index: 50;
                        height: 100vh; width: var(--cp-sb-w);
                        background: var(--cp-surface);
                        border-right: 1px solid var(--cp-border);
                        display: flex; flex-direction: column;
                        transition: width 0.25s cubic-bezier(.4,0,.2,1),
                                    transform 0.28s cubic-bezier(.4,0,.2,1);
                    }
                    .cp-sidebar.collapsed { width: var(--cp-sb-w-col); }

                    @media (max-width: 1023px) {
                        .cp-sidebar { transform: translateX(-100%); }
                        .cp-sidebar.mobile-open { transform: translateX(0); width: var(--cp-sb-w) !important; }
                    }

                    /* Blue top accent line */
                    .cp-sidebar::after {
                        content: '';
                        position: absolute; top: 0; left: 0; right: 0; height: 2px;
                        background: linear-gradient(90deg, var(--cp-accent), transparent);
                    }

                    /* Brand */
                    .cp-brand {
                        height: var(--cp-top-h); padding: 0 16px;
                        display: flex; align-items: center; justify-content: space-between;
                        border-bottom: 1px solid var(--cp-border); flex-shrink: 0;
                    }
                    .cp-brand-logo { display: flex; align-items: center; gap: 10px; overflow: hidden; }
                    .cp-brand-icon {
                        width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
                        background: linear-gradient(135deg, var(--cp-accent), #3B82F6);
                        display: flex; align-items: center; justify-content: center;
                        font-family: 'DM Serif Display', serif;
                        font-size: 13px; color: #fff; font-weight: 400;
                    }
                    .cp-brand-name {
                        font-size: 13px; font-weight: 700; color: var(--cp-text);
                        white-space: nowrap; opacity: 1; transition: opacity 0.18s;
                    }
                    .cp-sidebar.collapsed .cp-brand-name { opacity: 0; width: 0; overflow: hidden; }

                    .cp-collapse-btn {
                        width: 24px; height: 24px; border-radius: 6px;
                        border: 1px solid var(--cp-border2);
                        background: transparent; cursor: pointer;
                        display: flex; align-items: center; justify-content: center;
                        color: var(--cp-muted); flex-shrink: 0;
                        transition: background 0.15s, color 0.15s;
                    }
                    .cp-collapse-btn:hover { background: var(--cp-accent-glow); color: var(--cp-accent); }
                    .cp-sidebar.collapsed .cp-collapse-btn { transform: rotate(180deg); }

                    /* Nav */
                    .cp-nav { flex: 1; overflow-y: auto; padding: 10px 10px 16px; scrollbar-width: none; }
                    .cp-nav::-webkit-scrollbar { display: none; }
                    .cp-nav-section { margin-bottom: 22px; }
                    .cp-nav-section-title {
                        font-size: 8.5px; font-weight: 700; letter-spacing: 0.14em;
                        text-transform: uppercase; color: var(--cp-muted);
                        padding: 0 8px; margin-bottom: 5px;
                        white-space: nowrap; opacity: 1; transition: opacity 0.18s;
                    }
                    .cp-sidebar.collapsed .cp-nav-section-title { opacity: 0; height: 0; margin: 0; overflow: hidden; }

                    .cp-nav-item {
                        display: flex; align-items: center; gap: 10px;
                        padding: 8px 10px; border-radius: 8px;
                        font-size: 12.5px; font-weight: 500; color: var(--cp-subtext);
                        text-decoration: none; cursor: pointer;
                        transition: background 0.14s, color 0.14s;
                        white-space: nowrap; overflow: hidden;
                        margin-bottom: 1px; position: relative;
                    }
                    .cp-nav-item:hover { background: var(--cp-accent-glow); color: var(--cp-text); }
                    .cp-nav-item.active {
                        background: var(--cp-accent-glow);
                        color: var(--cp-accent);
                        font-weight: 600;
                    }
                    /* Blue left bar for active */
                    .cp-nav-item.active::before {
                        content: '';
                        position: absolute; left: 0; top: 50%; transform: translateY(-50%);
                        width: 3px; height: 18px; border-radius: 2px;
                        background: var(--cp-accent);
                    }
                    .cp-nav-icon { flex-shrink: 0; width: 16px; height: 16px; }
                    .cp-nav-label { flex: 1; overflow: hidden; opacity: 1; transition: opacity 0.18s; }
                    .cp-sidebar.collapsed .cp-nav-label { opacity: 0; width: 0; }

                    /* Logout */
                    .cp-sb-logout { padding: 10px; border-top: 1px solid var(--cp-border); flex-shrink: 0; }
                    .cp-sb-logout-btn {
                        display: flex; align-items: center; gap: 10px;
                        width: 100%; padding: 8px 10px; border-radius: 8px;
                        border: none; background: transparent; cursor: pointer;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        font-size: 12.5px; font-weight: 500; color: var(--cp-danger);
                        transition: background 0.15s; white-space: nowrap; overflow: hidden;
                    }
                    .cp-sb-logout-btn:hover { background: rgba(239,68,68,0.08); }
                    .cp-sidebar.collapsed .cp-sb-logout-btn { justify-content: center; padding: 8px; }
                    .cp-sidebar.collapsed .cp-sb-logout-label { display: none; }

                    /* ══ MAIN BODY ══ */
                    .cp-body {
                        margin-left: var(--cp-sb-w); min-height: 100vh;
                        display: flex; flex-direction: column;
                        transition: margin-left 0.25s cubic-bezier(.4,0,.2,1);
                        background: var(--cp-bg);
                        flex: 1; width: calc(100% - var(--cp-sb-w));
                    }
                    .cp-body.collapsed { margin-left: var(--cp-sb-w-col); width: calc(100% - var(--cp-sb-w-col)); }
                    @media (max-width: 1023px) { .cp-body, .cp-body.collapsed { margin-left: 0; } }

                    /* Topbar */
                    .cp-topbar {
                        height: var(--cp-top-h); background: var(--cp-surface);
                        border-bottom: 1px solid var(--cp-border);
                        padding: 0 20px;
                        display: flex; align-items: center; justify-content: space-between;
                        position: sticky; top: 0; z-index: 30; flex-shrink: 0;
                    }
                    .cp-topbar-left { display: flex; align-items: center; gap: 12px; }
                    .cp-mobile-toggle {
                        display: none; width: 32px; height: 32px; border-radius: 7px;
                        border: 1px solid var(--cp-border2); background: transparent;
                        cursor: pointer; align-items: center; justify-content: center;
                        color: var(--cp-subtext);
                    }
                    @media (max-width: 1023px) { .cp-mobile-toggle { display: flex; } }

                    .cp-breadcrumb {
                        display: flex; align-items: center; gap: 6px;
                        font-size: 13px; font-weight: 500; color: var(--cp-muted);
                    }
                    .cp-breadcrumb-cur { color: var(--cp-text); font-weight: 700; }

                    .cp-topbar-right { display: flex; align-items: center; gap: 8px; }
                    .cp-topbar-icon-btn {
                        width: 32px; height: 32px; border-radius: 8px;
                        border: 1px solid var(--cp-border2); background: transparent;
                        cursor: pointer; display: flex; align-items: center; justify-content: center;
                        color: var(--cp-subtext); transition: all 0.15s; position: relative;
                    }
                    .cp-topbar-icon-btn:hover {
                        background: var(--cp-accent-glow);
                        color: var(--cp-accent);
                        border-color: var(--cp-accent-dim);
                    }
                    .cp-notif-dot {
                        position: absolute; top: 6px; right: 6px;
                        width: 6px; height: 6px; border-radius: 50%;
                        background: var(--cp-accent);
                        border: 1.5px solid var(--cp-surface);
                    }

                    /* Profile */
                    .cp-profile-trigger {
                        display: flex; align-items: center; gap: 8px;
                        padding: 5px 10px 5px 5px;
                        border: 1px solid var(--cp-border2); border-radius: 9px;
                        background: transparent; cursor: pointer;
                        transition: background 0.15s, border-color 0.15s;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                    }
                    .cp-profile-trigger:hover { background: var(--cp-accent-glow); border-color: var(--cp-accent-dim); }
                    .cp-profile-name { font-size: 12px; font-weight: 600; color: var(--cp-text); }
                    .cp-profile-role { font-size: 10px; color: var(--cp-muted); margin-top: 1px; }

                    /* Dropdown */
                    .cp-dropdown {
                        position: absolute; right: 0; top: calc(100% + 8px);
                        width: 200px; background: var(--cp-surface2);
                        border: 1px solid var(--cp-border2); border-radius: 12px;
                        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
                        overflow: hidden; z-index: 100;
                        animation: cpDropIn 0.16s ease;
                    }
                    @keyframes cpDropIn {
                        from { opacity:0; transform:translateY(-6px); }
                        to   { opacity:1; transform:translateY(0); }
                    }
                    .cp-dd-header {
                        padding: 12px 14px; border-bottom: 1px solid var(--cp-border);
                        background: var(--cp-accent-glow2);
                    }
                    .cp-dd-name { font-size: 12px; font-weight: 700; color: var(--cp-text); }
                    .cp-dd-role {
                        font-size: 10px; color: var(--cp-accent); font-weight: 600;
                        margin-top: 2px; text-transform: uppercase; letter-spacing: 0.06em;
                    }
                    .cp-dd-item {
                        display: flex; align-items: center; gap: 9px;
                        padding: 10px 14px; font-size: 12px; font-weight: 500;
                        color: var(--cp-subtext); text-decoration: none;
                        transition: background 0.13s; cursor: pointer;
                        background: none; border: none; width: 100%;
                        font-family: 'Plus Jakarta Sans', sans-serif; text-align: left;
                    }
                    .cp-dd-item:hover { background: var(--cp-accent-glow); color: var(--cp-text); }
                    .cp-dd-item.danger { color: var(--cp-danger); }
                    .cp-dd-item.danger:hover { background: rgba(239,68,68,0.08); }

                    /* Content */
                    .cp-content {
                        flex: 1; overflow-y: auto; padding: 24px;
                        background: var(--cp-bg);
                        scrollbar-width: thin;
                        scrollbar-color: var(--cp-border2) transparent;
                    }
                    .cp-content::-webkit-scrollbar { width: 5px; }
                    .cp-content::-webkit-scrollbar-track { background: transparent; }
                    .cp-content::-webkit-scrollbar-thumb { background: var(--cp-border2); border-radius: 10px; }
                    .cp-content-inner { max-width: 1280px; margin: 0 auto; }
                `}</style>

                <div className="cp-root">
                    {mobileOpen && <div className="cp-overlay" onClick={() => setMobileOpen(false)} />}

                    {/* SIDEBAR */}
                    <aside className={`cp-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
                        <div className="cp-brand">
                            <div className="cp-brand-logo">
                                <div className="cp-brand-icon">S</div>
                                <span className="cp-brand-name">Admin Panel</span>
                            </div>
                            <button className="cp-collapse-btn"
                                onClick={() => { setCollapsed(c => !c); setMobileOpen(false); }}
                                aria-label="Toggle sidebar">
                                <ChevronRight size={12} />
                            </button>
                        </div>

                        <nav className="cp-nav">
                            {menuSections.map(section => (
                                <div key={section.title} className="cp-nav-section">
                                    <div className="cp-nav-section-title">{section.title}</div>
                                    {section.items.map(item => {
                                        const Icon = item.icon;
                                        const active = pathname === item.href || pathname.startsWith(item.href + "/");
                                        return (
                                            <Link key={item.name} href={item.href}
                                                className={`cp-nav-item ${active ? "active" : ""}`}
                                                onClick={() => setMobileOpen(false)}
                                                title={collapsed ? item.name : undefined}>
                                                <Icon size={15} className="cp-nav-icon" />
                                                <span className="cp-nav-label">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </nav>

                        <div className="cp-sb-logout">
                            <button className="cp-sb-logout-btn" onClick={handleLogout}>
                                <LogOut size={15} style={{ flexShrink: 0 }} />
                                <span className="cp-sb-logout-label">Sign Out</span>
                            </button>
                        </div>
                    </aside>

                    {/* MAIN */}
                    <div className={`cp-body ${collapsed ? "collapsed" : ""}`}>
                        <header className="cp-topbar">
                            <div className="cp-topbar-left">
                                <button className="cp-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                                    <Menu size={16} />
                                </button>
                                <div className="cp-breadcrumb">
                                    <span>Admin</span>
                                    <ChevronRight size={12} />
                                    <span className="cp-breadcrumb-cur">{pageTitle}</span>
                                </div>
                            </div>

                            <div className="cp-topbar-right">

                                <PortalThemeToggle rootClass="cp-root" storageKey="admin-portal-theme" />

                                <button className="cp-topbar-icon-btn" aria-label="Notifications">
                                    <Bell size={15} />
                                    <span className="cp-notif-dot" />
                                </button>

                                <div style={{ position: "relative" }} ref={profileRef}>
                                    <button className="cp-profile-trigger" onClick={() => setProfileOpen(o => !o)}>
                                        <AdminAvatar name="Admin" size={26} />
                                        <div className="hidden sm:block" style={{ textAlign: "left" }}>
                                            <div className="cp-profile-name">Admin</div>
                                            <div className="cp-profile-role">Super Admin</div>
                                        </div>
                                    </button>

                                    {profileOpen && (
                                        <div className="cp-dropdown">
                                            <div className="cp-dd-header">
                                                <div className="cp-dd-name">Admin</div>
                                                <div className="cp-dd-role">Super Admin</div>
                                            </div>
                                            <Link href="/dashboard/admin/settings" className="cp-dd-item"
                                                onClick={() => setProfileOpen(false)}>
                                                <Settings size={13} /> Account Settings
                                            </Link>
                                            <button className="cp-dd-item danger" onClick={handleLogout}>
                                                <LogOut size={13} /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>

                        <main className="cp-content">
                            <div className="cp-content-inner">{children}</div>
                        </main>
                    </div>
                </div>
            </>
        </AuthGuard>
    );
}