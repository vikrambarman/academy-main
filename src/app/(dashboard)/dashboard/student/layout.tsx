"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import AuthGuard from "@/components/AuthGaurd";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [student, setStudent] = useState<any>(null);

    useEffect(() => {
        const loadStudent = async () => {
            const res = await fetchWithAuth("/api/student/me");
            const data = await res.json();
            setStudent(data);
        };
        loadStudent();
    }, []);

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
                        {sidebarOpen ? "Student Portal" : "SP"}
                    </div>

                    <nav className="mt-4 space-y-6 px-2 text-sm">

                        {/* Academic Section */}
                        <div>
                            <p className="text-gray-400 uppercase text-xs px-4 mb-2">
                                Academic
                            </p>

                            <Link
                                href="/dashboard/student"
                                className={`block px-4 py-2 rounded-md ${pathname === "/dashboard/student"
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-200"
                                    }`}
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/dashboard/student/profile"
                                className={`block px-4 py-2 rounded-md ${pathname.includes("profile")
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-200"
                                    }`}
                            >
                                Profile
                            </Link>
                        </div>

                        {/* Future Ready Section */}
                        <div>
                            <p className="text-gray-400 uppercase text-xs px-4 mb-2">
                                Coming Soon
                            </p>

                            <div className="px-4 py-2 text-gray-400">
                                Notes
                            </div>

                            <div className="px-4 py-2 text-gray-400">
                                Exams
                            </div>

                            <div className="px-4 py-2 text-gray-400">
                                Certificates
                            </div>
                        </div>
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
                            {student && (
                                <div className="text-right">
                                    <p className="text-sm font-medium">
                                        {student.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {student.course?.name}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* QUICK INFO STRIP */}
                    {student && (
                        <div className="bg-blue-50 px-6 py-3 flex justify-between text-sm">

                            <div>
                                Course:{" "}
                                <span className="font-medium">
                                    {student.course?.name}
                                </span>
                            </div>

                            <div>
                                Fees Due:{" "}
                                <span className="font-medium text-red-600">
                                    ₹{student.feesTotal - student.feesPaid}
                                </span>
                            </div>

                            <div>
                                Certificate Status:{" "}
                                <span className="font-medium">
                                    {student.certificateStatus}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* CONTENT */}
                    <div className="p-6 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}