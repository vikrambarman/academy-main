"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { PortalSidebar, NavSection } from "./PortalSidebar";
import { PortalTopbar } from "./PortalTopbar";

type PortalRole = "admin" | "student" | "teacher";

interface PortalShellProps {
  children: ReactNode;
  role: PortalRole;
  navSections: NavSection[];
  userName: string;
  userId?: string;
  userImage?: string;
  userSubtitle?: string;
  storageKey?: string;
}

export function PortalShell({
  children,
  role,
  navSections,
  userName,
  userId,
  userImage,
  userSubtitle,
  storageKey = "portal-theme",
}: PortalShellProps) {
  const [collapsed, setCollapsed] = useState(false);   // persisted (localStorage)
  const [hoverOpen, setHoverOpen] = useState(false);   // temporary hover expand
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore persisted collapse state
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(`${role}-sidebar-collapsed`);
    if (saved === "true") setCollapsed(true);
  }, [role]);

  // Button se toggle — persist hota hai
  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(`${role}-sidebar-collapsed`, String(next));
      if (!next) setHoverOpen(false); // ab persisted expanded hai
      return next;
    });
    setMobileOpen(false);
  };

  // Hover enter — temporary expand
  const handleSidebarEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    if (collapsed) setHoverOpen(true);
  };

  // Hover leave — 180ms delay ke saath collapse (flicker guard)
  const handleSidebarLeave = () => {
    if (!collapsed) return;
    leaveTimer.current = setTimeout(() => setHoverOpen(false), 180);
  };

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const closeMobile = () => setMobileOpen(false);

  // Mobile resize guard
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Escape key closes mobile drawer
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Body scroll lock (mobile)
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (!mounted) {
    return (
      <div data-portal={role} className="portal-root">
        <div className="portal-loading-screen">
          <div className="portal-loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div data-portal={role} className="portal-root">
      {mobileOpen && <div className="portal-overlay" onClick={closeMobile} />}

      <PortalSidebar
        role={role}
        navSections={navSections}
        collapsed={collapsed}
        hoverExpanded={hoverOpen}
        mobileOpen={mobileOpen}
        onToggleCollapsed={toggleCollapsed}
        onCloseMobile={closeMobile}
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
        userName={userName}
        userId={userId}
        userImage={userImage}
        userSubtitle={userSubtitle}
      />

      {/* Margin sirf persisted state se — hover pe content jump nahi karega */}
      <div className={`portal-main ${collapsed ? "portal-main--collapsed" : ""}`}>
        <PortalTopbar
          role={role}
          userName={userName}
          userId={userId}
          userImage={userImage}
          userSubtitle={userSubtitle}
          onToggleMobile={() => setMobileOpen(true)}
          storageKey={storageKey}
        />

        <main className="portal-content">
          <div className="portal-content-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}