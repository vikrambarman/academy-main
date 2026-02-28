"use client";

/**
 * AuthGuard
 * ----------
 * Automatically refreshes token on dashboard load
 */

import { useEffect } from "react";

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        const refresh = async () => {
            await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            });
        };

        refresh();
    }, []);

    return <>{children}</>;
}