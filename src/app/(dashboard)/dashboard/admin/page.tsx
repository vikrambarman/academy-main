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

export default function AdminDashboard() {
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
            <div className="text-slate-500 animate-pulse">
                Loading dashboard...
            </div>
        );
    }

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

            {/* HEADER */}
            <h1 className="text-3xl font-bold text-slate-800">
                Admin Dashboard
            </h1>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <PremiumCard
                    title="Total Students"
                    value={data?.students?.total ?? 0}
                />

                <PremiumCard
                    title="Total Expected"
                    value={data?.financial?.totalExpected ?? 0}
                    prefix="₹"
                />

                <PremiumCard
                    title="Total Collected"
                    value={data?.financial?.totalCollected ?? 0}
                    prefix="₹"
                />

                <PremiumCard
                    title="Pending Revenue"
                    value={data?.financial?.totalPending ?? 0}
                    prefix="₹"
                />

            </div>

            {/* REVENUE TREND */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">

                <h3 className="text-lg font-semibold text-slate-800 mb-6">
                    Monthly Revenue Trend
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueTrend}>
                        <XAxis dataKey="month" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>

            </div>

            {/* CHART GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Certificate Chart */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">

                    <h3 className="text-lg font-semibold text-slate-800 mb-6">
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
                                            "#6366F1",
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

                {/* Course Revenue */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">

                    <h3 className="text-lg font-semibold text-slate-800 mb-6">
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

/* ================= KPI CARD ================= */

function PremiumCard({
    title,
    value,
    prefix = "",
}: {
    title: string;
    value: number;
    prefix?: string;
}) {
    return (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition">

            <p className="text-sm text-slate-500">
                {title}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {prefix}
                <CountUp end={value} duration={1.5} separator="," />
            </h2>

        </div>
    );
}