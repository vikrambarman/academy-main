"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  LayoutDashboard, User, FileText, BookOpen,
  GraduationCap, LogOut, Menu, Bell, ChevronRight,
  X, IndianRupee, BookMarked, Award
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import AuthGuard from "@/components/AuthGaurd";

/* ─── Types ─────────────────────────────────────── */
interface Enrollment {
  _id: string;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
  course?: { name?: string };
}
interface StudentData {
  student: { name: string; studentId: string; profileImage?: string };
  enrollments: Enrollment[];
}
interface MenuItem {
  name: string;
  href?: string;
  icon: any;
  disabled?: boolean;
  badge?: string;
}

/* ─── Nav config ─────────────────────────────────── */
const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
      { name: "Profile", href: "/dashboard/student/profile", icon: User },
      { name: "Notices", href: "/dashboard/student/notices", icon: FileText },
    ],
  },
  {
    title: "Learning",
    items: [
      { name: "Notes", href: "/dashboard/student/notes", icon: BookOpen },
      { name: "Exams", icon: FileText, disabled: true, badge: "Soon" },
      { name: "Certificates", icon: GraduationCap, disabled: true, badge: "Soon" },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────── */
function Avatar({ name, src, size = 32 }: { name?: string; src?: string; size?: number }) {
  const initials = name?.charAt(0)?.toUpperCase() ?? "S";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
      {src
        ? <img src={`${src}?t=${Date.now()}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={name} />
        : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#2563eb,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "#fff" }}>
            {initials}
          </div>
        )
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN LAYOUT
══════════════════════════════════════════════════ */
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* load student */
  useEffect(() => {
    fetchWithAuth("/api/student/profile")
      .then(r => r.json())
      .then(setStudentData)
      .catch(() => { });
  }, []);

  const student = studentData?.student;
  const enrollments = studentData?.enrollments ?? [];
  const totalFees = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
  const totalPaid = enrollments.reduce((s, e) => s + (e.feesPaid ?? 0), 0);
  const feesDue = totalFees - totalPaid;
  const courses = enrollments.map(e => e.course?.name).filter(Boolean);
  const certCount = enrollments.filter(e => e.certificateStatus === "issued").length;

  /* close profile on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => { if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* page title */
  const pageTitle = useMemo(() => {
    const flat = menuSections.flatMap(s => s.items).filter(i => !!i.href) as (MenuItem & { href: string })[];
    return flat.find(i => pathname.startsWith(i.href))?.name ?? "Student Portal";
  }, [pathname]);

  /* logout */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/login");
  };

  /* ── render ─────────────────────────────────── */
  return (
    <AuthGuard>
      <>
        <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                    /* ── CSS vars ── */
                    :root {
                        --sky-bg:       #f0f9ff;
                        --sky-surface:  #ffffff;
                        --sky-border:   #e0effe;
                        --sky-accent:   #2563eb;
                        --sky-accent2:  #3b82f6;
                        --sky-muted:    #64748b;
                        --sky-text:     #0f172a;
                        --sky-subtext:  #475569;
                        --sky-hover:    #eff6ff;
                        --sky-active-bg:#dbeafe;
                        --sky-active-fg:#1d4ed8;
                        --sky-danger:   #dc2626;
                        --sky-success:  #059669;
                        --sky-warn:     #d97706;
                        --sky-sb-w:     236px;
                        --sky-sb-w-col: 64px;
                        --sky-top-h:    56px;
                        --sky-strip-h:  40px;
                    }

                    .sp-root * { box-sizing: border-box; }
                    .sp-root { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--sky-bg); }

                    /* ── Sidebar ── */
                    .sp-sidebar {
                        position: fixed; top: 0; left: 0; z-index: 50;
                        height: 100vh;
                        width: var(--sky-sb-w);
                        background: var(--sky-surface);
                        border-right: 1px solid var(--sky-border);
                        display: flex; flex-direction: column;
                        transition: width 0.25s cubic-bezier(.4,0,.2,1), transform 0.28s cubic-bezier(.4,0,.2,1);
                        will-change: width, transform;
                    }

                    .sp-sidebar.collapsed { width: var(--sky-sb-w-col); }

                    /* mobile: hidden off-screen by default */
                    @media (max-width: 1023px) {
                        .sp-sidebar { transform: translateX(-100%); }
                        .sp-sidebar.mobile-open { transform: translateX(0); width: var(--sky-sb-w) !important; }
                    }

                    /* ── Sidebar brand ── */
                    .sp-brand {
                        height: var(--sky-top-h);
                        padding: 0 16px;
                        display: flex; align-items: center; justify-content: space-between;
                        border-bottom: 1px solid var(--sky-border);
                        flex-shrink: 0;
                    }

                    .sp-brand-logo {
                        display: flex; align-items: center; gap: 10px; overflow: hidden;
                    }

                    .sp-brand-icon {
                        width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
                        background: linear-gradient(135deg, var(--sky-accent), #60a5fa);
                        display: flex; align-items: center; justify-content: center;
                        font-family: 'DM Serif Display', serif;
                        font-size: 14px; color: #fff; font-weight: 400;
                    }

                    .sp-brand-name {
                        font-size: 13px; font-weight: 700; color: var(--sky-text);
                        white-space: nowrap; overflow: hidden; opacity: 1;
                        transition: opacity 0.18s, width 0.2s;
                    }

                    .sp-sidebar.collapsed .sp-brand-name { opacity: 0; width: 0; }

                    .sp-collapse-btn {
                        width: 26px; height: 26px; border-radius: 7px; border: 1px solid var(--sky-border);
                        background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center;
                        color: var(--sky-muted); transition: background 0.15s, color 0.15s; flex-shrink: 0;
                    }

                    .sp-collapse-btn:hover { background: var(--sky-hover); color: var(--sky-accent); }
                    .sp-sidebar.collapsed .sp-collapse-btn { transform: rotate(180deg); }

                    /* ── Sidebar student card ── */
                    .sp-student-card {
                        margin: 12px 10px;
                        padding: 10px;
                        background: var(--sky-hover);
                        border: 1px solid var(--sky-border);
                        border-radius: 12px;
                        display: flex; align-items: center; gap: 10px;
                        overflow: hidden; flex-shrink: 0;
                        transition: opacity 0.2s;
                    }

                    .sp-student-info { overflow: hidden; flex: 1; }
                    .sp-student-name { font-size: 12px; font-weight: 600; color: var(--sky-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .sp-student-id   { font-size: 10px; color: var(--sky-muted); margin-top: 1px; }

                    .sp-sidebar.collapsed .sp-student-card { padding: 8px; justify-content: center; }
                    .sp-sidebar.collapsed .sp-student-info { display: none; }

                    /* ── Nav ── */
                    .sp-nav { flex: 1; overflow-y: auto; padding: 8px 10px 16px; scrollbar-width: none; }
                    .sp-nav::-webkit-scrollbar { display: none; }

                    .sp-nav-section { margin-bottom: 20px; }

                    .sp-nav-section-title {
                        font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
                        text-transform: uppercase; color: var(--sky-muted);
                        padding: 0 8px; margin-bottom: 4px;
                        white-space: nowrap; overflow: hidden;
                        opacity: 1; transition: opacity 0.18s;
                    }

                    .sp-sidebar.collapsed .sp-nav-section-title { opacity: 0; height: 0; margin: 0; overflow: hidden; }

                    .sp-nav-item {
                        display: flex; align-items: center; gap: 10px;
                        padding: 9px 10px; border-radius: 9px;
                        font-size: 13px; font-weight: 500; color: var(--sky-subtext);
                        text-decoration: none; cursor: pointer;
                        transition: background 0.15s, color 0.15s;
                        white-space: nowrap; overflow: hidden;
                        margin-bottom: 2px; position: relative;
                    }

                    .sp-nav-item:hover:not(.disabled) { background: var(--sky-hover); color: var(--sky-text); }

                    .sp-nav-item.active {
                        background: var(--sky-active-bg);
                        color: var(--sky-active-fg);
                        font-weight: 600;
                    }

                    .sp-nav-item.active .sp-nav-icon { color: var(--sky-accent); }

                    .sp-nav-item.disabled { opacity: 0.4; cursor: not-allowed; }

                    .sp-nav-icon { width: 18px; height: 18px; flex-shrink: 0; }

                    .sp-nav-label { flex: 1; overflow: hidden; opacity: 1; transition: opacity 0.18s, width 0.2s; }
                    .sp-sidebar.collapsed .sp-nav-label { opacity: 0; width: 0; overflow: hidden; }

                    .sp-nav-badge {
                        font-size: 9px; font-weight: 600; letter-spacing: 0.05em;
                        color: var(--sky-muted); background: var(--sky-border);
                        padding: 2px 6px; border-radius: 100px;
                        flex-shrink: 0;
                    }

                    .sp-sidebar.collapsed .sp-nav-badge { display: none; }

                    /* active indicator dot for collapsed */
                    .sp-nav-item.active::before {
                        content: '';
                        position: absolute; left: -10px; top: 50%; transform: translateY(-50%);
                        width: 3px; height: 18px; border-radius: 2px;
                        background: var(--sky-accent);
                    }

                    /* ── Sidebar logout ── */
                    .sp-sb-logout {
                        padding: 10px; border-top: 1px solid var(--sky-border); flex-shrink: 0;
                    }

                    .sp-sb-logout-btn {
                        display: flex; align-items: center; gap: 10px;
                        width: 100%; padding: 9px 10px; border-radius: 9px;
                        border: none; background: transparent; cursor: pointer;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        font-size: 13px; font-weight: 500; color: var(--sky-danger);
                        transition: background 0.15s; white-space: nowrap; overflow: hidden;
                    }

                    .sp-sb-logout-btn:hover { background: #fef2f2; }
                    .sp-sidebar.collapsed .sp-sb-logout-btn { justify-content: center; padding: 9px; }
                    .sp-sidebar.collapsed .sp-sb-logout-label { display: none; }

                    /* ── Main area ── */
                    .sp-body {
                        margin-left: var(--sky-sb-w);
                        min-height: 100vh; display: flex; flex-direction: column;
                        transition: margin-left 0.25s cubic-bezier(.4,0,.2,1);
                    }

                    .sp-body.collapsed { margin-left: var(--sky-sb-w-col); }

                    @media (max-width: 1023px) {
                        .sp-body, .sp-body.collapsed { margin-left: 0; }
                    }

                    /* ── Topbar ── */
                    .sp-topbar {
                        height: var(--sky-top-h);
                        background: rgba(255,255,255,0.85);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border-bottom: 1px solid var(--sky-border);
                        padding: 0 20px;
                        display: flex; align-items: center; justify-content: space-between;
                        position: sticky; top: 0; z-index: 30;
                        flex-shrink: 0;
                    }

                    .sp-topbar-left { display: flex; align-items: center; gap: 12px; }

                    .sp-mobile-toggle {
                        display: none; width: 32px; height: 32px; border-radius: 8px;
                        border: 1px solid var(--sky-border); background: transparent;
                        cursor: pointer; align-items: center; justify-content: center;
                        color: var(--sky-subtext);
                    }

                    @media (max-width: 1023px) { .sp-mobile-toggle { display: flex; } }

                    .sp-breadcrumb {
                        display: flex; align-items: center; gap: 6px;
                        font-size: 13px; font-weight: 500; color: var(--sky-muted);
                    }

                    .sp-breadcrumb-current { color: var(--sky-text); font-weight: 600; }

                    .sp-topbar-right { display: flex; align-items: center; gap: 8px; }

                    .sp-topbar-icon-btn {
                        width: 34px; height: 34px; border-radius: 9px;
                        border: 1px solid var(--sky-border); background: transparent;
                        cursor: pointer; display: flex; align-items: center; justify-content: center;
                        color: var(--sky-subtext); transition: background 0.15s, color 0.15s;
                        position: relative;
                    }

                    .sp-topbar-icon-btn:hover { background: var(--sky-hover); color: var(--sky-accent); }

                    .sp-notif-dot {
                        position: absolute; top: 7px; right: 7px;
                        width: 6px; height: 6px; border-radius: 50%;
                        background: var(--sky-accent); border: 1.5px solid white;
                    }

                    /* profile trigger */
                    .sp-profile-trigger {
                        display: flex; align-items: center; gap: 8px;
                        padding: 5px 10px 5px 5px;
                        border: 1px solid var(--sky-border); border-radius: 10px;
                        background: transparent; cursor: pointer;
                        transition: background 0.15s, border-color 0.15s;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                    }

                    .sp-profile-trigger:hover { background: var(--sky-hover); border-color: #bfdbfe; }

                    .sp-profile-name { font-size: 12px; font-weight: 600; color: var(--sky-text); }
                    .sp-profile-id   { font-size: 10px; color: var(--sky-muted); margin-top: 1px; }

                    /* profile dropdown */
                    .sp-profile-dropdown {
                        position: absolute; right: 0; top: calc(100% + 8px);
                        width: 220px; background: var(--sky-surface);
                        border: 1px solid var(--sky-border); border-radius: 14px;
                        box-shadow: 0 12px 40px rgba(15,23,42,0.1);
                        overflow: hidden; z-index: 100;
                        animation: spDropIn 0.18s ease;
                    }

                    @keyframes spDropIn {
                        from { opacity: 0; transform: translateY(-6px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }

                    .sp-dd-header {
                        padding: 14px 16px; border-bottom: 1px solid var(--sky-border);
                        background: var(--sky-hover);
                    }

                    .sp-dd-name { font-size: 13px; font-weight: 700; color: var(--sky-text); }
                    .sp-dd-id   { font-size: 11px; color: var(--sky-muted); margin-top: 2px; }

                    .sp-dd-item {
                        display: flex; align-items: center; gap: 10px;
                        padding: 10px 16px; font-size: 13px; font-weight: 500;
                        color: var(--sky-subtext); text-decoration: none;
                        transition: background 0.14s;
                        background: none; border: none; width: 100%; cursor: pointer;
                        font-family: 'Plus Jakarta Sans', sans-serif; text-align: left;
                    }

                    .sp-dd-item:hover { background: var(--sky-hover); color: var(--sky-text); }
                    .sp-dd-item.danger { color: var(--sky-danger); }
                    .sp-dd-item.danger:hover { background: #fef2f2; }

                    /* ── Info strip ── */
                    .sp-info-strip {
                        height: var(--sky-strip-h);
                        background: var(--sky-surface);
                        border-bottom: 1px solid var(--sky-border);
                        padding: 0 20px;
                        display: flex; align-items: center; gap: 0;
                        flex-shrink: 0; overflow-x: auto; scrollbar-width: none;
                    }

                    .sp-info-strip::-webkit-scrollbar { display: none; }

                    .sp-info-chip {
                        display: flex; align-items: center; gap: 6px;
                        padding: 0 16px; height: 100%;
                        border-right: 1px solid var(--sky-border);
                        font-size: 11.5px; font-weight: 400; color: var(--sky-muted);
                        white-space: nowrap; flex-shrink: 0;
                    }

                    .sp-info-chip:first-child { padding-left: 0; }
                    .sp-info-chip:last-child  { border-right: none; }

                    .sp-info-chip-icon {
                        width: 16px; height: 16px; flex-shrink: 0;
                        color: var(--sky-accent);
                    }

                    .sp-info-chip-val { font-weight: 600; color: var(--sky-text); margin-left: 3px; }
                    .sp-info-chip-val.danger { color: var(--sky-danger); }
                    .sp-info-chip-val.success { color: var(--sky-success); }

                    /* ── Content ── */
                    .sp-content {
                        flex: 1; overflow-y: auto; padding: 24px 24px;
                        background: var(--sky-bg);
                    }

                    .sp-content-inner { max-width: 1200px; margin: 0 auto; }

                    /* ── Mobile overlay ── */
                    .sp-overlay {
                        position: fixed; inset: 0; background: rgba(15,23,42,0.4);
                        z-index: 40; backdrop-filter: blur(2px);
                        animation: spFadeIn 0.18s ease;
                    }

                    @keyframes spFadeIn { from { opacity: 0; } to { opacity: 1; } }

                    /* ── Scrollbar global ── */
                    .sp-content::-webkit-scrollbar { width: 5px; }
                    .sp-content::-webkit-scrollbar-track { background: transparent; }
                    .sp-content::-webkit-scrollbar-thumb { background: var(--sky-border); border-radius: 10px; }
                `}</style>

        <div className="sp-root">

          {/* Mobile overlay */}
          {mobileOpen && <div className="sp-overlay" onClick={() => setMobileOpen(false)} />}

          {/* ══ SIDEBAR ══ */}
          <aside className={`sp-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>

            {/* Brand */}
            <div className="sp-brand">
              <div className="sp-brand-logo">
                <div className="sp-brand-icon">S</div>
                <span className="sp-brand-name">Student Portal</span>
              </div>
              <button
                className="sp-collapse-btn"
                onClick={() => { setCollapsed(c => !c); setMobileOpen(false); }}
                aria-label="Toggle sidebar"
              >
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Student card */}
            {student && (
              <div className="sp-student-card">
                <Avatar name={student.name} src={student.profileImage} size={32} />
                <div className="sp-student-info">
                  <div className="sp-student-name">{student.name}</div>
                  <div className="sp-student-id">ID · {student.studentId}</div>
                </div>
              </div>
            )}

            {/* Nav */}
            <nav className="sp-nav">
              {menuSections.map(section => (
                <div key={section.title} className="sp-nav-section">
                  <div className="sp-nav-section-title">{section.title}</div>
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const active = item.href ? pathname.startsWith(item.href) : false;

                    if (item.disabled) {
                      return (
                        <div key={item.name} className="sp-nav-item disabled">
                          <Icon size={16} className="sp-nav-icon" />
                          <span className="sp-nav-label">{item.name}</span>
                          {item.badge && <span className="sp-nav-badge">{item.badge}</span>}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href!}
                        className={`sp-nav-item ${active ? "active" : ""}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon size={16} className="sp-nav-icon" />
                        <span className="sp-nav-label">{item.name}</span>
                        {item.badge && <span className="sp-nav-badge">{item.badge}</span>}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Logout */}
            <div className="sp-sb-logout">
              <button className="sp-sb-logout-btn" onClick={handleLogout}>
                <LogOut size={16} style={{ flexShrink: 0 }} />
                <span className="sp-sb-logout-label">Sign Out</span>
              </button>
            </div>
          </aside>

          {/* ══ MAIN ══ */}
          <div className={`sp-body ${collapsed ? "collapsed" : ""}`}>

            {/* Topbar */}
            <header className="sp-topbar">
              <div className="sp-topbar-left">
                <button className="sp-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                  <Menu size={16} />
                </button>
                <div className="sp-breadcrumb">
                  <span>Portal</span>
                  <ChevronRight size={12} />
                  <span className="sp-breadcrumb-current">{pageTitle}</span>
                </div>
              </div>

              <div className="sp-topbar-right">
                <button className="sp-topbar-icon-btn" aria-label="Notifications">
                  <Bell size={15} />
                  <span className="sp-notif-dot" />
                </button>

                {/* Profile */}
                <div style={{ position: "relative" }} ref={profileRef}>
                  <button className="sp-profile-trigger" onClick={() => setProfileOpen(o => !o)}>
                    <Avatar name={student?.name} src={student?.profileImage} size={26} />
                    <div className="hidden sm:block" style={{ textAlign: "left" }}>
                      <div className="sp-profile-name">{student?.name ?? "Student"}</div>
                      <div className="sp-profile-id">ID · {student?.studentId ?? "—"}</div>
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="sp-profile-dropdown">
                      <div className="sp-dd-header">
                        <div className="sp-dd-name">{student?.name ?? "Student"}</div>
                        <div className="sp-dd-id">Student ID · {student?.studentId}</div>
                      </div>
                      <Link href="/dashboard/student/profile" className="sp-dd-item" onClick={() => setProfileOpen(false)}>
                        <User size={14} /> View Profile
                      </Link>
                      <button className="sp-dd-item danger" onClick={handleLogout}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Info strip */}
            {student && (
              <div className="sp-info-strip">
                <div className="sp-info-chip">
                  <BookMarked size={14} className="sp-info-chip-icon" />
                  Course <span className="sp-info-chip-val">{courses.length > 0 ? courses.join(", ") : "N/A"}</span>
                </div>
                <div className="sp-info-chip">
                  <IndianRupee size={14} className="sp-info-chip-icon" />
                  Fees Due <span className={`sp-info-chip-val ${feesDue > 0 ? "danger" : "success"}`}>
                    ₹{feesDue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="sp-info-chip">
                  <Award size={14} className="sp-info-chip-icon" />
                  Certificates <span className="sp-info-chip-val">{certCount > 0 ? `${certCount} Issued` : "Pending"}</span>
                </div>
              </div>
            )}

            {/* Content */}
            <main className="sp-content">
              <div className="sp-content-inner">
                {children}
              </div>
            </main>
          </div>
        </div>
      </>
    </AuthGuard>
  );
}