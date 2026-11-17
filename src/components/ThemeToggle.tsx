"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Portal ke liye alag localStorage key
const PORTAL_THEME_KEY = "portal-theme";

// Portal theme helper hooks
export function usePortalTheme() {
    const [portalTheme, setPortalThemeState] = useState<"light" | "dark">("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(PORTAL_THEME_KEY) as "light" | "dark" | null;
        if (saved) setPortalThemeState(saved);
    }, []);

    const setPortalTheme = (theme: "light" | "dark") => {
        setPortalThemeState(theme);
        localStorage.setItem(PORTAL_THEME_KEY, theme);
        // cp-root div pe class lagao — html ko nahi
        document.querySelectorAll(".cp-root").forEach(el => {
            el.classList.toggle("dark", theme === "dark");
            el.classList.toggle("light", theme === "light");
        });
    };

    // Mount pe apply karo
    useEffect(() => {
        if (!mounted) return;
        document.querySelectorAll(".cp-root").forEach(el => {
            el.classList.toggle("dark", portalTheme === "dark");
            el.classList.toggle("light", portalTheme === "light");
        });
    }, [mounted, portalTheme]);

    return { portalTheme, setPortalTheme, mounted };
}

// PUBLIC site ke liye — next-themes use karo
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all duration-200 text-sm font-medium cursor-pointer"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-opacity duration-200 ${isDark ? "opacity-100" : "opacity-40"}`}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <span>{isDark ? "Light" : "Dark"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-opacity duration-200 ${isDark ? "opacity-40" : "opacity-100"}`}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        </button>
    );
}

export function PortalThemeToggle({
    rootClass = "cp-root",
    storageKey = "portal-theme",
}: {
    rootClass?: string;
    storageKey?: string;
}) {
    const [portalTheme, setPortalThemeState] = useState<"light" | "dark">("dark");
    const [mounted, setMounted] = useState(false);

    // ✅ FIX: class + data-theme dono set karo
    const applyTheme = (theme: "light" | "dark") => {
        document.querySelectorAll(`.${rootClass}`).forEach(el => {
            el.classList.toggle("dark", theme === "dark");
            el.classList.toggle("light", theme === "light");
            el.setAttribute("data-theme", theme);   // ← NEW LINE
        });
    };

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(storageKey) as "light" | "dark" | null;
        if (saved) setPortalThemeState(saved);
    }, [storageKey]);

    const setPortalTheme = (theme: "light" | "dark") => {
        setPortalThemeState(theme);
        localStorage.setItem(storageKey, theme);
        applyTheme(theme);
    };

    useEffect(() => {
        if (!mounted) return;
        applyTheme(portalTheme);
    }, [mounted, portalTheme, rootClass]);

    if (!mounted) return null;

    const isDark = portalTheme === "dark";

    return (
        <button
            onClick={() => setPortalTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="portal-topbar__icon-btn"
            style={{ width: "auto", padding: "5px 10px", gap: 6, fontSize: 12, fontWeight: 500 }}
        >
            {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
            {isDark ? "Light" : "Dark"}
        </button>
    );
}