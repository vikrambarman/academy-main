"use client";

import {
    LayoutDashboard, User, FileText, BookOpen, GraduationCap,
    Wallet, Lock, CalendarDays, Clock,
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

interface ShellStudent {
    name: string;
    studentId: string;
    profileImage?: string;
}

export function StudentShellClient({
    children,
    student,
}: {
    children: React.ReactNode;
    student: ShellStudent;
}) {
    return (
        <PortalShell
            role="student"
            navSections={NAV_SECTIONS}
            userName={student.name}
            userId={student.studentId}
            userImage={student.profileImage}
            userSubtitle={`ID: ${student.studentId}`}
            storageKey="student-portal-theme"
        >
            {children}
        </PortalShell>
    );
}