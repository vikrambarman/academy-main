"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

/* ================= TYPES ================= */

interface AnalyticsData {
    financial: {
        totalExpected: number;
        totalCollected: number;
        totalPending: number;
        fullyPaidCount: number;
        partiallyPaidCount: number;
        unpaidCount: number;
    };
    students: {
        total: number;
        active: number;
        inactive: number;
        recentEnrollments: number;
    };
    certificates: {
        notApplied: number;
        applied: number;
        examGiven: number;
        passed: number;
        generated: number;
    };
    revenueTrend: {
        month: string;
        amount: number;
    }[];
    courseAnalytics: {
        _id: string;
        totalStudents: number;
        totalRevenue: number;
        totalExpected: number;
        totalPending: number;
    }[];
}

/* ================= MAIN COMPONENT ================= */

export default function AdminHome() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const res = await fetchWithAuth("/api/admin/analytics");
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Analytics load failed");
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="text-gray-500 animate-pulse">
                Loading dashboard...
            </div>
        );
    }

    /* ================= SAFE DATA ================= */

    const revenueTrend = data?.revenueTrend ?? [];

    const certificateData = [
        { name: "Not Applied", value: data?.certificates?.notApplied ?? 0 },
        { name: "Applied", value: data?.certificates?.applied ?? 0 },
        { name: "Exam Given", value: data?.certificates?.examGiven ?? 0 },
        { name: "Passed", value: data?.certificates?.passed ?? 0 },
        { name: "Generated", value: data?.certificates?.generated ?? 0 },
    ];

    const courseData =
        data?.courseAnalytics?.map((c) => ({
            name: c._id,
            value: c.totalRevenue,
        })) ?? [];

    return (
        <div className="space-y-10">

            {/* ================= HEADER ================= */}
            <h1 className="text-3xl font-bold text-gray-800 ">
                Admin Dashboard
            </h1>

            {/* ================= PREMIUM KPI GRID ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <PremiumCard
                    title="Total Students"
                    value={data?.students?.total ?? 0}
                    gradient="from-blue-500 to-indigo-600"
                />

                <PremiumCard
                    title="Total Expected"
                    value={data?.financial?.totalExpected ?? 0}
                    prefix="₹"
                    gradient="from-purple-500 to-pink-600"
                />

                <PremiumCard
                    title="Total Collected"
                    value={data?.financial?.totalCollected ?? 0}
                    prefix="₹"
                    gradient="from-green-500 to-emerald-600"
                />

                <PremiumCard
                    title="Pending Revenue"
                    value={data?.financial?.totalPending ?? 0}
                    prefix="₹"
                    gradient="from-red-500 to-orange-500"
                />

            </div>

            {/* ================= REVENUE TREND ================= */}
            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8">

                <h3 className="text-xl font-semibold mb-6">
                    Monthly Revenue Trend
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueTrend}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>

            </div>

            {/* ================= CHART GRID ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Certificate Donut */}
                <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8">
                    <h3 className="text-xl font-semibold mb-6">
                        Certificate Status
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={certificateData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={110}
                            >
                                {certificateData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={[
                                            "#3B82F6",
                                            "#8B5CF6",
                                            "#F59E0B",
                                            "#10B981",
                                            "#EF4444",
                                        ][index]}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Course Revenue Pie */}
                <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8">
                    <h3 className="text-xl font-semibold mb-6">
                        Course Revenue
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={courseData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={110}
                            >
                                {courseData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={[
                                            "#6366F1",
                                            "#14B8A6",
                                            "#F97316",
                                            "#EC4899",
                                            "#22C55E",
                                        ][index % 5]}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>

        </div>
    );
}

/* ================= PREMIUM CARD ================= */

function PremiumCard({
    title,
    value,
    prefix = "",
    gradient,
}: {
    title: string;
    value: number;
    prefix?: string;
    gradient: string;
}) {
    return (
        <div
            className={`rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br ${gradient} transition transform hover:scale-105`}
        >
            <p className="text-sm opacity-90">{title}</p>

            <h2 className="text-3xl font-bold mt-3">
                {prefix}
                <CountUp end={value} duration={1.5} separator="," />
            </h2>
        </div>
    );
}