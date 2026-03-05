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
            { name: "Students", href: "/dashboard/admin/students", icon: Users },
            { name: "Courses", href: "/dashboard/admin/courses", icon: BookOpen },
            { name: "Notices", href: "/dashboard/admin/notices", icon: FileText },
            { name: "Enquiries", href: "/dashboard/admin/enquiries", icon: BarChart3 },
            { name: "Contacts", href: "/dashboard/admin/contacts", icon: Users },
        ],
    },
    {
        title: "ANALYTICS",
        items: [
            { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
            { name: "Transactions", href: "/dashboard/admin/transactions", icon: FileText },
        ],
    },
    {
        title: "SYSTEM",
        items: [
            { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        ],
    },
];

export default function AdminLayout({
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

    /* ================= CLOSE DROPDOWN ================= */

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

        } catch {
            console.error("Logout failed");
        }
    };

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setDarkMode(!darkMode);
    };

    return (

        <AuthGuard>

            <div className="flex h-screen bg-slate-50 overflow-hidden">

                {/* MOBILE OVERLAY */}

                {mobileOpen && (
                    <div
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    />
                )}

                {/* SIDEBAR */}

                <aside
                    className={`
          fixed lg:static z-50 top-0 left-0 h-full
          bg-slate-900 text-slate-200 border-r border-slate-800
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
                >

                    {/* LOGO */}

                    <div className="flex items-center justify-between p-4 border-b border-slate-800">

                        <h2 className="font-semibold text-lg text-white">
                            {sidebarOpen ? "SCA Admin" : "SCA"}
                        </h2>

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:block text-slate-400 hover:text-white"
                        >
                            <Menu size={18} />
                        </button>

                    </div>

                    {/* NAV */}

                    <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100%-70px)]">

                        {menuSections.map((section) => (

                            <div key={section.title}>

                                {sidebarOpen && (
                                    <p className="text-xs text-slate-400 mb-2 tracking-wider">
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
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                        ${active
                                                        ? "bg-indigo-600 text-white"
                                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                    }`}
                                            >

                                                <Icon size={18} />

                                                {sidebarOpen && (
                                                    <span>{item.name}</span>
                                                )}

                                            </Link>

                                        );
                                    })}

                                </div>

                            </div>

                        ))}

                    </nav>

                </aside>

                {/* MAIN */}

                <div className="flex-1 flex flex-col">

                    {/* TOPBAR */}

                    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

                        <div className="flex items-center gap-3 sm:gap-4">

                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden text-slate-600"
                            >
                                <Menu />
                            </button>

                            <h1 className="text-base sm:text-lg font-semibold text-slate-700">
                                Admin Panel
                            </h1>

                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">

                            {/* DARK MODE */}

                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            >
                                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {/* PROFILE */}

                            <div className="relative" ref={profileRef}>

                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 bg-slate-100 px-2 sm:px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-200 transition"
                                >

                                    <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full text-xs font-semibold">
                                        A
                                    </div>

                                    <span className="hidden sm:block">
                                        Admin
                                    </span>

                                </button>

                                {profileOpen && (

                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-sm rounded-lg py-2 z-50">

                                        <Link
                                            href="/dashboard/admin/settings"
                                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            Account Settings
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                    </header>

                    {/* CONTENT */}

                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
                        {children}
                    </main>

                </div>

            </div>

        </AuthGuard>
    );
}