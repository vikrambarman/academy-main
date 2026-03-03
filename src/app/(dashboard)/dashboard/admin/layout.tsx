"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BarChart3,
    FileText,
    Settings,
    LogOut,
    Sun,
    Moon,
    Menu,
} from "lucide-react";
import AuthGuard from "@/components/AuthGaurd";

/* ================= MENU CONFIG ================= */

const menuSections = [
    {
        title: "CORE",
        items: [
            {
                name: "Dashboard",
                href: "/dashboard/admin",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "MANAGEMENT",
        items: [
            {
                name: "Students",
                href: "/dashboard/admin/students",
                icon: Users,
            },
            {
                name: "Courses",
                href: "/dashboard/admin/courses",
                icon: BookOpen,
            },
            {
                name: "Notices",
                href: "/dashboard/admin/notices",
                icon: FileText,
            },
            {
                name: "Enquiries",
                href: "/dashboard/admin/enquiries",
                icon: BarChart3,
            },
            {
                name: "Contacts",
                href: "/dashboard/admin/contacts",
                icon: Users,
            },
        ],
    },
    {
        title: "ANALYTICS",
        items: [
            {
                name: "Reports",
                href: "/dashboard/admin/reports",
                icon: BarChart3,
            },
            {
                name: "Transactions",
                href: "/dashboard/admin/transactions",
                icon: FileText,
            },
        ],
    },
    {
        title: "SYSTEM",
        items: [
            {
                name: "Settings",
                href: "/dashboard/admin/settings",
                icon: Settings,
            },
        ],
    },
];

/* ================= COMPONENT ================= */

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);

    /* ================= CLOSE DROPDOWN OUTSIDE ================= */

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    /* ================= HANDLERS ================= */

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            router.replace("/login");
        } catch (error) {
            console.error("Logout failed");
        }
    };

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setDarkMode(!darkMode);
    };

    return (
        <AuthGuard>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

                {/* ================= MOBILE OVERLAY ================= */}
                {mobileOpen && (
                    <div
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    />
                )}

                {/* ================= SIDEBAR ================= */}
                <aside
                    className={`fixed lg:static z-50 top-0 left-0 h-full 
          bg-white dark:bg-gray-800 shadow-xl transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
                >
                    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                        <h2 className="font-bold text-lg dark:text-white">
                            {sidebarOpen ? "SCA Admin" : "SCA"}
                        </h2>

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:block"
                        >
                            <Menu size={18} />
                        </button>
                    </div>

                    <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100%-70px)]">
                        {menuSections.map((section) => (
                            <div key={section.title}>
                                {sidebarOpen && (
                                    <p className="text-xs text-gray-400 mb-2">
                                        {section.title}
                                    </p>
                                )}

                                <div className="space-y-2">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = pathname === item.href;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                        ${active
                                                        ? "bg-indigo-600 text-white"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                <Icon size={18} />
                                                {sidebarOpen && <span>{item.name}</span>}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* ================= MAIN ================= */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* ================= TOPBAR ================= */}
                    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center">

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden"
                            >
                                <Menu />
                            </button>

                            <h1 className="text-lg font-semibold dark:text-white">
                                Admin Panel
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">

                            {/* Dark Mode */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md text-sm dark:text-white hover:opacity-90 transition"
                                >
                                    <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full text-xs font-semibold">
                                        A
                                    </div>
                                    <span>Admin</span>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg py-2 z-50">

                                        <Link
                                            href="/dashboard/admin/settings"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            Account Settings
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>

                                    </div>
                                )}
                            </div>

                        </div>
                    </header>

                    {/* ================= PAGE CONTENT ================= */}
                    <main className="flex-1 overflow-y-auto p-6 bg-blue-200 dark:bg-white-900">
                        {children}
                    </main>

                </div>
            </div>
        </AuthGuard>
    );
}