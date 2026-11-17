"use client";

import {
  LayoutDashboard, Users, BookOpen, BarChart3, FileText, Settings,
  Notebook, IndianRupee, Award, CalendarDays, Clock, Bell, Shield,
  Settings2, BarChart2, Key,
} from "lucide-react";
import { PortalShell, NavSection } from "@/components/layout";

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Core",
    items: [
      { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Students", href: "/dashboard/admin/students", icon: Users },
      { name: "Teachers", href: "/dashboard/admin/teachers", icon: Users },
      { name: "Courses", href: "/dashboard/admin/courses", icon: BookOpen },
      { name: "Enrollments", href: "/dashboard/admin/enroll", icon: Users },
      { name: "Fees", href: "/dashboard/admin/fees", icon: IndianRupee },
      { name: "Certificates", href: "/dashboard/admin/certificates", icon: Award },
      { name: "Notices", href: "/dashboard/admin/notices", icon: Bell },
      { name: "Enquiries", href: "/dashboard/admin/enquiries", icon: BarChart3 },
      { name: "Contacts", href: "/dashboard/admin/contacts", icon: Users },
      { name: "Notes", href: "/dashboard/admin/notes", icon: Notebook },
      { name: "Study Notes", href: "/dashboard/admin/study", icon: BookOpen },
      { name: "Attendance", href: "/dashboard/admin/attendance", icon: CalendarDays },
      { name: "Hourly Code", href: "/dashboard/admin/attendance/hourly-code", icon: Key },
      { name: "Timetable", href: "/dashboard/admin/timetable", icon: Clock },
      { name: "Course Enquiry", href: "/dashboard/admin/course-enquiry", icon: BarChart2 },
    ],
  },
  {
    title: "Franchise",
    items: [
      { name: "Franchises", href: "/dashboard/admin/franchises", icon: Shield },
      { name: "Course Config", href: "/dashboard/admin/course-configs", icon: Settings2 },
    ],
  },
  {
    title: "Analytics",
    items: [
      { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
      { name: "Transactions", href: "/dashboard/admin/transactions", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
  },
];

export function AdminShellClient({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      role="admin"
      navSections={NAV_SECTIONS}
      userName="Admin"
      userSubtitle="Super Admin"
      storageKey="admin-portal-theme"
    >
      {children}
    </PortalShell>
  );
}