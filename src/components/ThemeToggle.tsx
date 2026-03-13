"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Hydration mismatch rokne ke liye
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="
        relative flex items-center gap-2 px-3 py-1.5 rounded-full
        border border-[var(--color-border)]
        bg-[var(--color-bg-card)]
        text-[var(--color-text-muted)]
        hover:text-[var(--color-text)]
        hover:border-[var(--color-primary)]
        transition-all duration-200
        text-sm font-medium
        cursor-pointer
      "
        >
            {/* Sun icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16" height="16"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className={`transition-opacity duration-200 ${isDark ? "opacity-100" : "opacity-40"}`}
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>

            <span>{isDark ? "Light" : "Dark"}</span>

            {/* Moon icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16" height="16"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className={`transition-opacity duration-200 ${isDark ? "opacity-40" : "opacity-100"}`}
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        </button>
    );
}