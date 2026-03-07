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

interface Enrollment {
  _id: string;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
  course?: {
    name?: string;
  };
}

interface StudentData {
  student: {
    name: string;
    studentId: string;
    profileImage?: string;
  };
  enrollments: Enrollment[];
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
        { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
        { name: "Profile", href: "/dashboard/student/profile", icon: User },
        { name: "Notices", href: "/dashboard/student/notices", icon: FileText },
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

export default function StudentLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const pathname = usePathname() ?? "";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);

  /* ================= LOAD STUDENT ================= */

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await fetchWithAuth("/api/student/profile");
        const data = await res.json();
        setStudentData(data);
      } catch {
        console.error("Failed to load student");
      }
    };

    loadStudent();
  }, []);

  const student = studentData?.student;
  const enrollments = studentData?.enrollments || [];

  /* ================= CALCULATIONS ================= */

  const totalFees = enrollments.reduce(
    (sum, e) => sum + (e.feesTotal || 0),
    0
  );

  const totalPaid = enrollments.reduce(
    (sum, e) => sum + (e.feesPaid || 0),
    0
  );

  const feesDue = totalFees - totalPaid;

  const courses = enrollments
    .map((e) => e.course?.name)
    .filter(Boolean);

  const certificateSummary =
    enrollments.length === 1
      ? enrollments[0].certificateStatus
      : `${enrollments.length} Courses`;

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
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= PAGE TITLE ================= */

  const currentPageTitle = useMemo(() => {

    const allItems = menuSections
      .flatMap((section) => section.items)
      .filter((item): item is MenuItem & { href: string } => !!item.href);

    const matched = allItems.find((item) =>
      pathname.startsWith(item.href)
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

  /* ================= RETURN ================= */

  return (

    <AuthGuard>

      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gray-900">

        {/* MOBILE OVERLAY */}

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}

        {/* ================= SIDEBAR ================= */}

        <aside
          className={`fixed lg:static z-50 top-0 left-0 h-full
          bg-indigo-600 text-white
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >

          <div className="flex items-center justify-between p-4 border-b border-indigo-500/40">

            <h2 className="font-bold text-lg whitespace-nowrap">
              {sidebarOpen ? "Student Portal" : "SP"}
            </h2>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block text-white"
            >
              <Menu size={18} />
            </button>

          </div>

          <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-70px)]">

            {menuSections.map((section) => (

              <div key={section.title}>

                {sidebarOpen && (
                  <p className="text-xs text-indigo-200 mb-2">
                    {section.title}
                  </p>
                )}

                <div className="space-y-2">

                  {section.items.map((item) => {

                    const Icon = item.icon;
                    const active = item.href ? pathname.startsWith(item.href) : false;

                    if (item.disabled) {

                      return (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg opacity-40 cursor-not-allowed text-indigo-200 text-sm"
                        >
                          <Icon size={18} />
                          {sidebarOpen && <span>{item.name}</span>}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href as string}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm
                        ${active
                            ? "bg-white text-indigo-600 font-semibold"
                            : "text-indigo-100 hover:bg-white/10"
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

        <div className="flex-1 flex flex-col min-w-0">

          {/* ================= TOPBAR ================= */}

          <header className="bg-white/90 backdrop-blur border-b border-indigo-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

            <div className="flex items-center gap-3 sm:gap-4">

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-gray-700"
              >
                <Menu />
              </button>

              <h1 className="text-base sm:text-lg font-semibold text-indigo-900 truncate">
                {currentPageTitle}
              </h1>

            </div>

            <div className="flex items-center gap-2 sm:gap-4">

              <button className="p-2 rounded hover:bg-gray-100">
                <Bell size={18} />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded hover:bg-gray-100"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* PROFILE */}

              <div className="relative" ref={profileRef}>

                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-2 rounded-lg text-sm transition max-w-[180px]"
                >

                  {/* AVATAR */}

                  <div className="w-8 h-8 rounded-full overflow-hidden">

                    {student?.profileImage ? (

                      <img
                        src={`${student.profileImage}?t=${Date.now()}`}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                        {student?.name?.charAt(0) ?? "S"}
                      </div>

                    )}

                  </div>

                  {/* NAME */}

                  <div className="hidden sm:flex flex-col leading-tight">

                    <span className="text-xs font-medium text-gray-900 truncate max-w-[110px]">
                      {student?.name ?? "Student"}
                    </span>

                    <span className="text-[10px] text-gray-500">
                      ID • {student?.studentId ?? "-"}
                    </span>

                  </div>

                </button>

                {/* DROPDOWN */}

                {profileOpen && (

                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl py-2 border border-gray-200">

                    {/* PROFILE HEADER */}

                    <div className="px-4 py-3 border-b">

                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {student?.name ?? "Student"}
                      </p>

                      <p className="text-xs text-gray-500">
                        Student ID • {student?.studentId}
                      </p>

                    </div>

                    {/* MENU */}

                    <Link
                      href="/dashboard/student/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <User size={16} />
                      View Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-left"
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

            <div className="bg-indigo-100 px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between text-sm text-indigo-900">

              <div>
                Courses:{" "}
                <span className="font-medium">
                  {courses.length > 0 ? courses.join(", ") : "N/A"}
                </span>
              </div>

              <div>
                Fees Due:{" "}
                <span className="font-medium text-red-600">
                  ₹{feesDue}
                </span>
              </div>

              <div>
                Certificates:{" "}
                <span className="font-medium">
                  {certificateSummary}
                </span>
              </div>

            </div>

          )}

          {/* CONTENT */}

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100">

            <div className="max-w-7xl mx-auto">

              <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-md border border-indigo-100">

                {children}

              </div>

            </div>

          </main>

        </div>

      </div>

    </AuthGuard>

  );
}