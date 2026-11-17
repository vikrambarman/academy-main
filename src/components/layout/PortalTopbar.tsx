"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Bell, ChevronRight, Settings, LogOut } from "lucide-react";
import { PortalThemeToggle } from "@/components/ThemeToggle";

interface PortalTopbarProps {
    role: "admin" | "student" | "teacher";
    userName: string;
    userId?: string;
    userImage?: string;
    userSubtitle?: string;
    onToggleMobile: () => void;
    storageKey?: string;
}

export function PortalTopbar({
    role,
    userName,
    userId,
    userImage,
    userSubtitle,
    onToggleMobile,
    storageKey = "portal-theme",
}: PortalTopbarProps) {
    const pathname = usePathname() ?? "";
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Derive page title from pathname
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    const pageTitle =
        !last || last === role
            ? "Dashboard"
            : last
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <header className="portal-topbar">
            <div className="portal-topbar__left">
                {/* Mobile toggle */}
                <button
                    className="portal-topbar__mobile-toggle"
                    onClick={onToggleMobile}
                    aria-label="Open menu"
                >
                    <Menu size={18} />
                </button>

                {/* Breadcrumb */}
                <div className="portal-topbar__breadcrumb">
                    <span className="portal-topbar__breadcrumb-root">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                    <ChevronRight size={12} className="portal-topbar__breadcrumb-sep" />
                    <span className="portal-topbar__breadcrumb-current">
                        {pageTitle}
                    </span>
                </div>
            </div>

            <div className="portal-topbar__right">
                {/* Theme toggle */}
                <PortalThemeToggle
                    rootClass="portal-root"
                    storageKey={storageKey}
                />

                {/* Notifications */}
                <div style={{ position: "relative" }} ref={notifRef}>
                    <button
                        className="portal-topbar__icon-btn"
                        onClick={() => setNotifOpen(!notifOpen)}
                        aria-label="Notifications"
                    >
                        <Bell size={16} />
                        <span className="portal-topbar__notif-dot" />
                    </button>

                    {notifOpen && (
                        <div className="portal-dropdown portal-dropdown--notif">
                            <div className="portal-dropdown__header">
                                <span className="portal-dropdown__title">Notifications</span>
                                <span className="portal-dropdown__badge">0 new</span>
                            </div>
                            <div className="portal-dropdown__body">
                                <div className="portal-notif-empty">
                                    <Bell size={24} style={{ opacity: 0.3 }} />
                                    <p>No notifications yet</p>
                                    <p className="portal-notif-empty-sub">
                                        Updates will appear here
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div style={{ position: "relative" }} ref={profileRef}>
                    <button
                        className="portal-topbar__profile"
                        onClick={() => setProfileOpen(!profileOpen)}
                    >
                        <div className="portal-topbar__avatar">
                            {userImage ? (
                                <img src={userImage} alt={userName} />
                            ) : (
                                userName?.charAt(0)?.toUpperCase() ?? "U"
                            )}
                        </div>
                        <div className="portal-topbar__profile-info">
                            <div className="portal-topbar__profile-name">{userName}</div>
                            <div className="portal-topbar__profile-role">
                                {userSubtitle || role}
                            </div>
                        </div>
                    </button>

                    {profileOpen && (
                        <div className="portal-dropdown">
                            <div className="portal-dropdown__header">
                                <div className="portal-dropdown__name">{userName}</div>
                                <div className="portal-dropdown__id">
                                    {userId || userSubtitle || role}
                                </div>
                            </div>
                            <div className="portal-dropdown__body">
                                {role === "student" && (
                                    <Link
                                        href="/dashboard/student/profile"
                                        className="portal-dropdown__item"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <Settings size={14} />
                                        View Profile
                                    </Link>
                                )}
                                {role === "admin" && (
                                    <Link
                                        href="/dashboard/admin/settings"
                                        className="portal-dropdown__item"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <Settings size={14} />
                                        Settings
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}