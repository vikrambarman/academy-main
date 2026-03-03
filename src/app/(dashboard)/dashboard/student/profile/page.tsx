"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function StudentProfile() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetchWithAuth("/api/student/me");

                if (!res.ok) {
                    throw new Error("Unauthorized");
                }

                const data = await res.json();
                setStudent(data);
            } catch (err) {
                console.error("Profile load error");
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="text-gray-500 animate-pulse">
                Loading profile...
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="text-red-500">
                Failed to load profile.
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8">

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                My Profile
            </h1>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6">

                <div className="grid md:grid-cols-2 gap-6 text-sm">

                    <div>
                        <p className="text-gray-500">Full Name</p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                            {student.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                            {student.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                            {student.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Student ID</p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                            {student.studentId}
                        </p>
                    </div>

                </div>

                {/* COURSE SECTION */}
                {student.course && (
                    <div className="border-t pt-6">

                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                            Course Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 text-sm">

                            <div>
                                <p className="text-gray-500">Course Name</p>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    {student.course.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Duration</p>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    {student.course.duration || "N/A"}
                                </p>
                            </div>

                            {student.course.authority && (
                                <div>
                                    <p className="text-gray-500">Authority</p>
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        {student.course.authority}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}