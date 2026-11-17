"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  BookOpen,
  Key,
} from "lucide-react";
import { PortalShell, NavSection } from "@/components/layout";

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
    ],
  },
  {
    title: "Academic",
    items: [
      { name: "Attendance", href: "/dashboard/teacher/attendance", icon: CalendarCheck },
      { name: "Hourly Code", href: "/dashboard/teacher/attendance/hourly-code", icon: Key },
      { name: "Timetable", href: "/dashboard/teacher/timetable", icon: Clock },
    ],
  },
  {
    title: "Learning",
    items: [
      { name: "Study Notes", href: "/dashboard/teacher/notes", icon: BookOpen },
    ],
  },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [teacher, setTeacher] = useState<{
    name: string;
    employeeId: string;
  } | null>(null);

  useEffect(() => {
    fetchWithAuth("/api/teacher/me")
      .then((r) => r.json())
      .then((d) => setTeacher(d.teacher))
      .catch(() => {});
  }, []);

  return (
    <PortalShell
      role="teacher"
      navSections={NAV_SECTIONS}
      userName={teacher?.name ?? "Teacher"}
      userId={teacher?.employeeId}
      userSubtitle="Teacher"
      storageKey="teacher-portal-theme"
    >
      {children}
    </PortalShell>
  );
}