"use client";

/**
 * Admin Dashboard Overview
 * --------------------------
 * - Shows quick stats
 * - Future scalable for analytics
 */

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function AdminHome() {
    const [stats, setStats] = useState({
        totalCourses: 0,
        activeCourses: 0,
        totalStudents: 0,
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetchWithAuth("/api/admin/stats");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats");
            }
        };

        loadStats();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
            </h1>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white shadow-md rounded-xl p-6">
                    <p className="text-gray-500 text-sm">Total Courses</p>
                    <h2 className="text-3xl font-bold mt-2">
                        {stats.totalCourses}
                    </h2>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6">
                    <p className="text-gray-500 text-sm">Active Courses</p>
                    <h2 className="text-3xl font-bold mt-2 text-green-600">
                        {stats.activeCourses}
                    </h2>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6">
                    <p className="text-gray-500 text-sm">Total Students</p>
                    <h2 className="text-3xl font-bold mt-2 text-blue-600">
                        {stats.totalStudents}
                    </h2>
                </div>

            </div>

            {/* FUTURE ACTIVITY SECTION */}
            <div className="bg-white shadow-md rounded-xl p-6">
                <h3 className="font-semibold text-gray-700 mb-3">
                    Recent Activity
                </h3>
                <p className="text-gray-500 text-sm">
                    Student registrations and course updates will appear here.
                </p>
            </div>
        </div>
    );
}