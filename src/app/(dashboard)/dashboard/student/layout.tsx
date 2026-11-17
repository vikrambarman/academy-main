"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  LayoutDashboard,
  User,
  FileText,
  BookOpen,
  GraduationCap,
  Wallet,
  Lock,
  CalendarDays,
  Clock,
} from "lucide-react";
import { PortalShell, NavSection } from "@/components/layout";

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Academic",
    items: [
      { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
      { name: "Profile", href: "/dashboard/student/profile", icon: User },
      { name: "Notices", href: "/dashboard/student/notices", icon: FileText },
      { name: "Attendance", href: "/dashboard/student/attendance", icon: CalendarDays },
      { name: "Schedule", href: "/dashboard/student/schedule", icon: Clock },
    ],
  },
  {
    title: "Finance & Certs",
    items: [
      { name: "Fee Ledger", href: "/dashboard/student/fees", icon: Wallet },
      { name: "Certificates", href: "/dashboard/student/certificates", icon: GraduationCap },
    ],
  },
  {
    title: "Learning",
    items: [
      { name: "Notes", href: "/dashboard/student/notes", icon: BookOpen },
      { name: "Exams", icon: FileText, disabled: true, badge: "Soon" },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Change Password", href: "/dashboard/student/change-password", icon: Lock },
    ],
  },
];

interface StudentData {
  student: {
    name: string;
    studentId: string;
    profileImage?: string;
  };
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    fetchWithAuth("/api/student/profile")
      .then((r) => r.json())
      .then(setStudentData)
      .catch(() => {});
  }, []);

  const student = studentData?.student;

  return (
    <PortalShell
      role="student"
      navSections={NAV_SECTIONS}
      userName={student?.name ?? "Student"}
      userId={student?.studentId}
      userImage={student?.profileImage}
      userSubtitle={`ID: ${student?.studentId ?? "—"}`}
      storageKey="student-portal-theme"
    >
      {children}
    </PortalShell>
  );
}