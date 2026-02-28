"use client";

/**
 * Logout Button Component
 * ------------------------
 * - Calls logout API
 * - Clears cookies server-side
 * - Redirects to login page
 */

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            // After logout → redirect to login
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
            Logout
        </button>
    );
}