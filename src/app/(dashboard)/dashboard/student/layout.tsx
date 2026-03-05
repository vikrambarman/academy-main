"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  BookOpen,
  GraduationCap,
  LogOut,
  Menu,
  Sun,
  Moon,
  Bell,
  LucideIcon
} from "lucide-react";

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import AuthGuard from "@/components/AuthGaurd";

/* ================= TYPES ================= */

interface StudentData {
  name: string;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
  course?: {
    name?: string;
  };
}

interface MenuItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  disabled?: boolean;
}

/* ================= MENU ================= */

const menuSections: {
  title: string;
  items: MenuItem[];
}[] = [
  {
    title: "ACADEMIC",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard/student",
        icon: LayoutDashboard,
      },
      {
        name: "Profile",
        href: "/dashboard/student/profile",
        icon: User,
      },
      {
        name: "Notices",
        href: "/dashboard/student/notices",
        icon: FileText,
      },
    ],
  },
  {
    title: "LEARNING",
    items: [
      { name: "Notes", icon: BookOpen, disabled: true },
      { name: "Exams", icon: FileText, disabled: true },
      { name: "Certificates", icon: GraduationCap, disabled: true },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  /* ================= LOAD STUDENT ================= */

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await fetchWithAuth("/api/student/me");
        const data = await res.json();
        setStudent(data);
      } catch {
        console.error("Failed to load student");
      }
    };

    loadStudent();
  }, []);

  /* ================= DARK MODE ================= */

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  /* ================= CLOSE PROFILE ================= */

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

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= PAGE TITLE ================= */

  const currentPageTitle = useMemo(() => {
    const allItems = menuSections.flatMap((section) =>
      section.items.filter((item) => item.href)
    );

    const matched = allItems.find((item) =>
      pathname?.startsWith(item.href as string)
    );

    return matched?.name || "Student Portal";
  }, [pathname]);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.replace("/login");
  };

  const feesDue =
    (student?.feesTotal ?? 0) - (student?.feesPaid ?? 0);

  /* ================= RETURN ================= */

  return (
    <AuthGuard>

      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">

        {/* Overlay mobile */}

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}

        {/* ================= SIDEBAR ================= */}

        <aside
          className={`fixed lg:static z-50 top-0 left-0 h-full
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >

          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">

            <h2 className="font-bold text-lg text-gray-800 dark:text-white">
              {sidebarOpen ? "Student Portal" : "SP"}
            </h2>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block text-gray-600 dark:text-gray-300"
            >
              <Menu size={18} />
            </button>

          </div>

          <nav className="p-4 space-y-6">

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

                    const active =
                      item.href &&
                      pathname?.startsWith(item.href);

                    if (item.disabled) {

                      return (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg opacity-40 cursor-not-allowed text-gray-500"
                        >
                          <Icon size={18} />
                          {sidebarOpen && <span>{item.name}</span>}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href!}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm
                        ${
                          active
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

          {/* TOPBAR */}

          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">

            <div className="flex items-center gap-4">

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-gray-600 dark:text-gray-300"
              >
                <Menu />
              </button>

              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                {currentPageTitle}
              </h1>

            </div>

            <div className="flex items-center gap-4">

              <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell size={18} />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* PROFILE */}

              <div className="relative" ref={profileRef}>

                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md text-sm dark:text-white"
                >

                  <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full text-xs font-semibold">
                    {student?.name?.charAt(0) ?? "S"}
                  </div>

                  <span>{student?.name ?? "Student"}</span>

                </button>

                {profileOpen && (

                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-xl rounded-lg py-2 border border-gray-200 dark:border-gray-700">

                    <Link
                      href="/dashboard/student/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      View Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                  </div>
                )}

              </div>

            </div>

          </header>

          {/* INFO STRIP */}

          {student && (
            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-6 py-3 flex flex-wrap justify-between text-sm text-gray-700 dark:text-indigo-100">

              <div>
                Course:{" "}
                <span className="font-medium">
                  {student.course?.name ?? "N/A"}
                </span>
              </div>

              <div>
                Fees Due:{" "}
                <span className="font-medium text-red-600">
                  ₹{feesDue}
                </span>
              </div>

              <div>
                Certificate:{" "}
                <span className="font-medium">
                  {student.certificateStatus}
                </span>
              </div>

            </div>
          )}

          {/* CONTENT */}

          <main className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-slate-900">

            <div className="max-w-7xl mx-auto">

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">

                {children}

              </div>

            </div>

          </main>

        </div>

      </div>

    </AuthGuard>
  );
}