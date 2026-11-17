"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

interface PortalSidebarProps {
  role: "admin" | "student" | "teacher";
  navSections: NavSection[];
  collapsed: boolean;          // persisted state
  hoverExpanded: boolean;      // temporary hover state
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  userName: string;
  userId?: string;
  userImage?: string;
  userSubtitle?: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin Panel",
  student: "Student Portal",
  teacher: "Teacher Portal",
};

const ROLE_INITIALS: Record<string, string> = {
  admin: "A",
  student: "S",
  teacher: "T",
};

export function PortalSidebar({
  role,
  navSections,
  collapsed,
  hoverExpanded,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
  onMouseEnter,
  onMouseLeave,
  userName,
  userId,
  userImage,
  userSubtitle,
}: PortalSidebarProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  // Visual state: collapsed sirf jab persisted collapsed AUR hover nahi
  const visualCollapsed = collapsed && !hoverExpanded;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.replace(`/${role}/login`);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === `/dashboard/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={[
        "portal-sidebar",
        visualCollapsed && "portal-sidebar--collapsed",
        collapsed && hoverExpanded && "portal-sidebar--hover",
        mobileOpen && "portal-sidebar--mobile-open",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Brand */}
      <div className="portal-sidebar__brand">
        <div className="portal-sidebar__logo">
          <div className="portal-sidebar__logo-icon">
            {ROLE_INITIALS[role]}
          </div>
          {!visualCollapsed && (
            <span className="portal-sidebar__logo-text">
              {ROLE_LABELS[role]}
            </span>
          )}
        </div>
        <button
          className="portal-sidebar__collapse-btn"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Sidebar pin open karo" : "Sidebar collapse karo"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* User card */}
      <div className="portal-sidebar__user">
        <div className="portal-sidebar__avatar">
          {userImage ? (
            <img src={userImage} alt={userName} />
          ) : (
            userName?.charAt(0)?.toUpperCase() ?? ROLE_INITIALS[role]
          )}
        </div>
        {!visualCollapsed && (
          <div className="portal-sidebar__user-info">
            <div className="portal-sidebar__user-name">{userName}</div>
            <div className="portal-sidebar__user-id">
              {userSubtitle || userId || role}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="portal-sidebar__nav">
        {navSections.map((section) => (
          <div key={section.title} className="portal-nav-section">
            {!visualCollapsed ? (
              <div className="portal-nav-section__title">{section.title}</div>
            ) : (
              <div className="portal-nav-section__divider" />
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              if (item.disabled) {
                return (
                  <div
                    key={item.name}
                    className="portal-nav-item portal-nav-item--disabled"
                    title={visualCollapsed ? item.name : undefined}
                  >
                    <Icon size={16} className="portal-nav-item__icon" />
                    {!visualCollapsed && (
                      <>
                        <span className="portal-nav-item__label">{item.name}</span>
                        {item.badge && (
                          <span className="portal-nav-item__badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={`portal-nav-item ${active ? "portal-nav-item--active" : ""}`}
                  onClick={onCloseMobile}
                  title={visualCollapsed ? item.name : undefined}
                >
                  <Icon size={16} className="portal-nav-item__icon" />
                  {!visualCollapsed && (
                    <>
                      <span className="portal-nav-item__label">{item.name}</span>
                      {item.badge && (
                        <span className="portal-nav-item__badge">{item.badge}</span>
                      )}
                    </>
                  )}
                  {active && <span className="portal-nav-item__indicator" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="portal-sidebar__footer">
        <button
          className="portal-sidebar__logout"
          onClick={handleLogout}
          title={visualCollapsed ? "Sign Out" : undefined}
        >
          <LogOut size={16} />
          {!visualCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}