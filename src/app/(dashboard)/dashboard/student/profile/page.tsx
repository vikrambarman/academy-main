"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function StudentProfile() {
    const [student, setStudent] = useState<any>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const res = await fetchWithAuth("/api/student/me");
            const data = await res.json();
            setStudent(data);
        };

        loadProfile();
    }, []);

    if (!student) return <p>Loading...</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <div className="bg-white shadow rounded-lg p-6 space-y-3">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                <p><strong>Student ID:</strong> {student.studentId}</p>
                <p><strong>Course:</strong> {student.course.name}</p>
                <p><strong>Duration:</strong> {student.course.duration}</p>
            </div>
        </div>
    );
}