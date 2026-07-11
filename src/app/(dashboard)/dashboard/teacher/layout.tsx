"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  LayoutDashboard, CalendarCheck,
  Clock, BookOpen, LogOut,
  Menu, X, ChevronRight,
  GraduationCap, Key,
} from "lucide-react";
import { PortalThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/dashboard/teacher",                       label: "Dashboard",   icon: LayoutDashboard },
  { href: "/dashboard/teacher/attendance",             label: "Attendance",  icon: CalendarCheck   },
  { href: "/dashboard/teacher/attendance/hourly-code", label: "Hourly Code", icon: Key             },
  { href: "/dashboard/teacher/timetable",              label: "Timetable",   icon: Clock           },
  { href: "/dashboard/teacher/notes",                  label: "Study Notes", icon: BookOpen        },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open,    setOpen]    = useState(false);
  const [teacher, setTeacher] = useState<{
    name: string; employeeId: string;
  } | null>(null);

  useEffect(() => {
    fetchWithAuth("/api/teacher/me")
      .then((r) => r.json())
      .then((d) => setTeacher(d.teacher))
      .catch(() => {});
  }, []);

  /* Close sidebar on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/teacher/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard/teacher"
      ? pathname === href
      : pathname.startsWith(href);

  const currentLabel =
    NAV.find((n) => isActive(n.href))?.label ?? "Teacher Portal";

  return (
    <div className="tp-root" id="tp-root">

      {/* ── Sidebar ── */}
      <aside className={`tp-sidebar ${open ? "tp-sidebar--open" : ""}`}>
        <div className="tp-sidebar-inner">

          <div className="tp-brand">
            <div className="tp-brand__icon">
              <GraduationCap size={18} />
            </div>
            <div>
              <div className="tp-brand__name">
                Shivshakti Computer Academy
              </div>
              <div className="tp-brand__role">Teacher Portal</div>
            </div>
          </div>

          {teacher && (
            <div className="tp-profile">
              <div className="tp-profile__avatar">
                {teacher.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0, overflow: "hidden" }}>
                <div className="tp-profile__name">{teacher.name}</div>
                <div className="tp-profile__id">{teacher.employeeId}</div>
              </div>
            </div>
          )}

          <nav className="tp-nav">
            {NAV.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className={`tp-nav-item ${
                  isActive(href) ? "tp-nav-item--active" : ""
                }`}
              >
                <Icon size={16} className="tp-nav-item__icon" />
                <span className="tp-nav-item__label">{label}</span>
                {isActive(href) && (
                  <ChevronRight size={11} className="tp-nav-item__arrow" />
                )}
              </a>
            ))}
          </nav>

          <div className="tp-sidebar-footer">
            <button className="tp-logout" onClick={handleLogout}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div className="tp-overlay" onClick={() => setOpen(false)} />
      )}

      {/* ── Main body ── */}
      <div className="tp-body">
        <header className="tp-topbar">
          <button
            className="tp-menu-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>

          <div className="tp-topbar__left">
            <span className="tp-topbar__dot" />
            <span className="tp-topbar__title">{currentLabel}</span>
          </div>

          <div className="tp-topbar__right">
            <PortalThemeToggle
              rootClass="tp-root"
              storageKey="teacher-portal-theme"
            />
          </div>
        </header>

        <main className="tp-content">{children}</main>
      </div>
    </div>
  );
}