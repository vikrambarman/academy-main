"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import AuthGuard from "@/components/AuthGaurd";

export default function StudentLayout({
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
                        {sidebarOpen ? "Student Panel" : "SP"}
                    </div>

                    <nav className="mt-4 space-y-2 px-2">

                        <Link
                            href="/dashboard/student"
                            className={`block px-4 py-2 rounded-md text-sm ${pathname === "/dashboard/student"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-200"
                                }`}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/dashboard/student/profile"
                            className={`block px-4 py-2 rounded-md text-sm ${pathname.includes("profile")
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-200"
                                }`}
                        >
                            Profile
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
                                Welcome, Student
                            </span>

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}