"use client";

/**
 * Professional Admin Dashboard Layout
 * -------------------------------------
 * - Sidebar
 * - Topbar
 * - Main Content
 */

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import AuthGuard from "@/components/AuthGaurd";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        router.push("/login");
    };

    return (
        <AuthGuard>
            <div className="flex h-screen bg-gray-100">

                {/* SIDEBAR */}
                <div
                    className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"
                        }`}
                >
                    <div className="p-4 text-xl font-bold border-b">
                        {sidebarOpen ? "Admin Panel" : "AP"}
                    </div>

                    <nav className="mt-4 space-y-2 px-2">

                        <Link
                            href="/dashboard/admin"
                            className={`block px-4 py-2 rounded-md text-sm ${pathname === "/dashboard/admin"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-200"
                                }`}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/dashboard/admin/courses"
                            className={`block px-4 py-2 rounded-md text-sm ${pathname.includes("courses")
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-200"
                                }`}
                        >
                            Courses
                        </Link>

                        <Link
                            href="/dashboard/admin/students"
                            className={`block px-4 py-2 rounded-md text-sm ${pathname.includes("students")
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-200"
                                }`}
                        >
                            Students
                        </Link>

                    </nav>
                </div>

                {/* MAIN SECTION */}
                <div className="flex-1 flex flex-col">

                    {/* TOPBAR */}
                    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-600"
                        >
                            ☰
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Welcome, Admin
                            </span>

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}