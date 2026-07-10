// src/app/(dashboard)/dashboard/student/layout.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  LayoutDashboard, User, FileText, BookOpen,
  GraduationCap, LogOut, Menu, Bell, ChevronRight,
  IndianRupee, BookMarked, Award, Wallet, Lock,
  CalendarDays, Clock,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import AuthGuard from "@/components/AuthGaurd";
import { PortalThemeToggle } from "@/components/ThemeToggle";

// ── Types ──────────────────────────────────────────────
interface Enrollment {
  _id: string;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
  course?: { name?: string };
}

interface StudentData {
  student: {
    name: string;
    studentId: string;
    profileImage?: string;
  };
  enrollments: Enrollment[];
}

interface MenuItem {
  name: string;
  href?: string;
  icon: any;
  disabled?: boolean;
  badge?: string;
}

// ── Navigation config ───────────────────────────────────
const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: "Academic",
    items: [
      { name: "Dashboard",  href: "/dashboard/student",             icon: LayoutDashboard },
      { name: "Profile",    href: "/dashboard/student/profile",     icon: User            },
      { name: "Notices",    href: "/dashboard/student/notices",     icon: FileText        },
      { name: "Attendance", href: "/dashboard/student/attendance",  icon: CalendarDays    },
      { name: "Schedule",   href: "/dashboard/student/schedule",    icon: Clock           },
    ],
  },
  {
    title: "Finance & Certs",
    items: [
      { name: "Fee Ledger",   href: "/dashboard/student/fees",         icon: Wallet        },
      { name: "Certificates", href: "/dashboard/student/certificates", icon: GraduationCap },
    ],
  },
  {
    title: "Learning",
    items: [
      { name: "Notes", href: "/dashboard/student/notes", icon: BookOpen  },
      { name: "Exams", icon: FileText, disabled: true, badge: "Soon"     },
    ],
  },
  {
    title: "Account",
    items: [
      {
        name: "Change Password",
        href: "/dashboard/student/change-password",
        icon: Lock,
      },
    ],
  },
];

// ── Avatar component ────────────────────────────────────
function Avatar({
  name,
  src,
  size = 32,
}: {
  name?: string;
  src?: string;
  size?: number;
}) {
  const initials = name?.charAt(0)?.toUpperCase() ?? "S";

  return (
    <div
      className="sp-avatar"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={`${src}?t=${Date.now()}`}
          alt={name}
        />
      ) : (
        <div
          className="sp-avatar-fallback"
          style={{ fontSize: size * 0.38 }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// LAYOUT
// ══════════════════════════════════════════════════════
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname() ?? "";

  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch student profile
  useEffect(() => {
    fetchWithAuth("/api/student/profile")
      .then((r) => r.json())
      .then(setStudentData)
      .catch(() => {});
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Derived data
  const student     = studentData?.student;
  const enrollments = studentData?.enrollments ?? [];
  const totalFees   = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
  const totalPaid   = enrollments.reduce((s, e) => s + (e.feesPaid  ?? 0), 0);
  const feesDue     = totalFees - totalPaid;
  const courses     = enrollments.map((e) => e.course?.name).filter(Boolean);
  const certCount   = enrollments.filter(
    (e) => e.certificateStatus === "issued"
  ).length;

  // Page title from pathname
  const pageTitle = useMemo(() => {
    const flat = menuSections
      .flatMap((s) => s.items)
      .filter((i) => !!i.href) as (MenuItem & { href: string })[];

    // Exact match pehle, phir startsWith
    return (
      flat.find((i) => pathname === i.href)?.name ??
      flat.find((i) => pathname.startsWith(i.href))?.name ??
      "Student Portal"
    );
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/student/login");
  };

  const closeSidebar = () => setMobileOpen(false);

  // ──────────────────────────────────────────────────────
  return (
    <AuthGuard>
      <div className="sp-root">

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="sp-overlay" onClick={closeSidebar} />
        )}

        {/* ══════════ SIDEBAR ══════════ */}
        <aside
          className={[
            "sp-sidebar",
            collapsed  ? "collapsed"    : "",
            mobileOpen ? "mobile-open"  : "",
          ].join(" ")}
        >
          {/* Brand */}
          <div className="sp-brand">
            <div className="sp-brand-logo">
              <div className="sp-brand-icon">S</div>
              <span className="sp-brand-name">Student Portal</span>
            </div>
            <button
              className="sp-collapse-btn"
              onClick={() => {
                setCollapsed((c) => !c);
                setMobileOpen(false);
              }}
              aria-label="Toggle sidebar"
            >
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Student card */}
          {student && (
            <div className="sp-student-card">
              <Avatar
                name={student.name}
                src={student.profileImage}
                size={32}
              />
              <div className="sp-student-info">
                <div className="sp-student-name">{student.name}</div>
                <div className="sp-student-id">ID · {student.studentId}</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="sp-nav">
            {menuSections.map((section) => (
              <div key={section.title} className="sp-nav-section">
                <div className="sp-nav-section-title">
                  {section.title}
                </div>

                {section.items.map((item) => {
                  const Icon   = item.icon;
                  const active = item.href
                    ? pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                    : false;

                  if (item.disabled) {
                    return (
                      <div
                        key={item.name}
                        className="sp-nav-item disabled"
                      >
                        <Icon size={16} className="sp-nav-icon" />
                        <span className="sp-nav-label">{item.name}</span>
                        {item.badge && (
                          <span className="sp-nav-badge">{item.badge}</span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href!}
                      className={`sp-nav-item ${active ? "active" : ""}`}
                      onClick={closeSidebar}
                    >
                      <Icon size={16} className="sp-nav-icon" />
                      <span className="sp-nav-label">{item.name}</span>
                      {item.badge && (
                        <span className="sp-nav-badge">{item.badge}</span>
                      )}
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

        {/* ══════════ MAIN BODY ══════════ */}
        <div className={`sp-body ${collapsed ? "collapsed" : ""}`}>

          {/* Topbar */}
          <header className="sp-topbar">
            <div className="sp-topbar-left">
              {/* Mobile toggle */}
              <button
                className="sp-mobile-toggle"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={16} />
              </button>

              {/* Breadcrumb */}
              <div className="sp-breadcrumb">
                <span>Portal</span>
                <ChevronRight size={12} />
                <span className="sp-breadcrumb-current">{pageTitle}</span>
              </div>
            </div>

            <div className="sp-topbar-right">
              {/* Theme toggle */}
              <PortalThemeToggle
                rootClass="sp-root"
                storageKey="student-portal-theme"
              />

              {/* Notifications */}
              <button
                className="sp-topbar-icon-btn"
                aria-label="Notifications"
              >
                <Bell size={15} />
                <span className="sp-notif-dot" />
              </button>

              {/* Profile trigger + dropdown */}
              <div style={{ position: "relative" }} ref={profileRef}>
                <button
                  className="sp-profile-trigger"
                  onClick={() => setProfileOpen((o) => !o)}
                >
                  <Avatar
                    name={student?.name}
                    src={student?.profileImage}
                    size={26}
                  />
                  <div
                    className="hide-mobile"
                    style={{ textAlign: "left" }}
                  >
                    <div className="sp-profile-name">
                      {student?.name ?? "Student"}
                    </div>
                    <div className="sp-profile-id">
                      ID · {student?.studentId ?? "—"}
                    </div>
                  </div>
                </button>

                {profileOpen && (
                  <div className="sp-profile-dropdown">
                    <div className="sp-dd-header">
                      <div className="sp-dd-name">
                        {student?.name ?? "Student"}
                      </div>
                      <div className="sp-dd-id">
                        Student ID · {student?.studentId}
                      </div>
                    </div>

                    <Link
                      href="/dashboard/student/profile"
                      className="sp-dd-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={14} />
                      View Profile
                    </Link>

                    <button
                      className="sp-dd-item danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} />
                      Sign Out
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
                Course&nbsp;
                <span className="sp-info-chip-val">
                  {courses.length > 0 ? courses.join(", ") : "N/A"}
                </span>
              </div>

              <div className="sp-info-chip">
                <IndianRupee size={14} className="sp-info-chip-icon" />
                Fees Due&nbsp;
                <span
                  className={`sp-info-chip-val ${
                    feesDue > 0 ? "danger" : "success"
                  }`}
                >
                  ₹{feesDue.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="sp-info-chip">
                <Award size={14} className="sp-info-chip-icon" />
                Certificates&nbsp;
                <span className="sp-info-chip-val">
                  {certCount > 0 ? `${certCount} Issued` : "Pending"}
                </span>
              </div>
            </div>
          )}

          {/* Page content */}
          <main className="sp-content">
            <div className="sp-content-inner">{children}</div>
          </main>
        </div>

      </div>
    </AuthGuard>
  );
}