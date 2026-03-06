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
        revenueGrowth: number;
    };
    students: {
        total: number;
        active: number;
        inactive: number;
        completed: number;
        dropped: number;
        completionRate: number;
        dropoutRate: number;
        recentEnrollments: number;
        enrollmentGrowth: number;
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
    enrollmentTrend: {
        month: string;
        count: number;
    }[];
    courseAnalytics: {
        _id: string;
        totalStudents: number;
        totalRevenue: number;
        totalExpected: number;
        totalPending: number;
    }[];
    topCourses: {
        _id: string;
        totalStudents: number;
    }[];
    pendingFees: {
        studentName: string;
        course: string;
        due: number;
    }[];
    topPayingStudents: {
        name: string;
        amount: number;
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

            } catch {

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
    const enrollmentTrend = data?.enrollmentTrend ?? [];

    const certificateData = [
        { name: "Not Applied", value: data?.certificates?.notApplied ?? 0 },
        { name: "Applied", value: data?.certificates?.applied ?? 0 },
        { name: "Exam Given", value: data?.certificates?.examGiven ?? 0 },
        { name: "Passed", value: data?.certificates?.passed ?? 0 },
        { name: "Generated", value: data?.certificates?.generated ?? 0 },
    ];

    const courseRevenue =
        data?.courseAnalytics?.map((c) => ({
            name: c._id,
            value: c.totalRevenue,
        })) ?? [];

    const topCourses =
        data?.topCourses?.map((c) => ({
            name: c._id,
            value: c.totalStudents,
        })) ?? [];

    return (

        <div className="space-y-8 sm:space-y-10 px-2 sm:px-0">

            {/* HEADER */}

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Admin Dashboard
            </h1>

            {/* KPI CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">

                <PremiumCard title="Total Students" value={data?.students.total ?? 0} />

                <PremiumCard title="Active Students" value={data?.students.active ?? 0} />

                <PremiumCard title="Inactive Accounts" value={data?.students.inactive ?? 0} />

                <PremiumCard title="Completed Students" value={data?.students.completed ?? 0} />

                <PremiumCard title="Dropped Students" value={data?.students.dropped ?? 0} />

                <PremiumCard title="Completion Rate" value={data?.students.completionRate ?? 0} prefix="%" />

                <PremiumCard title="Dropout Rate" value={data?.students.dropoutRate ?? 0} prefix="%" />

                <PremiumCard title="Recent Enrollments" value={data?.students.recentEnrollments ?? 0} />

                <PremiumCard title="Total Expected" value={data?.financial.totalExpected ?? 0} prefix="₹" />

                <PremiumCard title="Total Collected" value={data?.financial.totalCollected ?? 0} prefix="₹" />

                <PremiumCard title="Pending Revenue" value={data?.financial.totalPending ?? 0} prefix="₹" />

                <PremiumCard title="Fully Paid" value={data?.financial.fullyPaidCount ?? 0} />

                <PremiumCard title="Partial Payments" value={data?.financial.partiallyPaidCount ?? 0} />

                <PremiumCard title="Unpaid Enrollments" value={data?.financial.unpaidCount ?? 0} />

            </div>

            {/* GROWTH CARDS */}

            <div className="grid md:grid-cols-2 gap-6">

                <GrowthCard
                    title="Revenue Growth"
                    value={data?.financial.revenueGrowth ?? 0}
                />

                <GrowthCard
                    title="Enrollment Growth"
                    value={data?.students.enrollmentGrowth ?? 0}
                />

            </div>

            {/* REVENUE TREND */}

            <ChartCard title="Monthly Revenue Trend">

                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenueTrend}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#6366F1" />
                    </BarChart>
                </ResponsiveContainer>

            </ChartCard>

            {/* ENROLLMENT TREND */}

            <ChartCard title="Monthly Enrollments">

                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={enrollmentTrend}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#22C55E" />
                    </BarChart>
                </ResponsiveContainer>

            </ChartCard>

            {/* CHART GRID */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <ChartCard title="Certificate Status">

                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={certificateData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={100}
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

                </ChartCard>

                <ChartCard title="Course Revenue">

                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={courseRevenue}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>

                </ChartCard>

            </div>

            {/* ALERT PANELS */}

            <div className="grid lg:grid-cols-2 gap-8">

                <AlertPanel title="Pending Fees Alerts">

                    {data?.pendingFees?.map((p, i) => (

                        <div key={i} className="flex justify-between border-b py-2">

                            <span>{p.studentName}</span>

                            <span className="text-red-600 font-medium">
                                ₹{p.due}
                            </span>

                        </div>

                    ))}

                </AlertPanel>

                <AlertPanel title="Top Paying Students">

                    {data?.topPayingStudents?.map((s, i) => (

                        <div key={i} className="flex justify-between border-b py-2">

                            <span>{s.name}</span>

                            <span className="text-green-600 font-medium">
                                ₹{s.amount}
                            </span>

                        </div>

                    ))}

                </AlertPanel>

            </div>

        </div>

    );

}

/* ================= COMPONENTS ================= */

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

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 sm:p-6 hover:shadow-md transition">

            <p className="text-xs sm:text-sm text-slate-500">
                {title}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                {prefix}
                <CountUp end={value} duration={1.5} separator="," />
            </h2>

        </div>

    );

}

function GrowthCard({
    title,
    value
}: {
    title: string;
    value: number;
}) {

    const positive = value >= 0;

    return (

        <div className="bg-white border rounded-xl p-6 shadow-sm">

            <p className="text-sm text-slate-500">
                {title}
            </p>

            <h2 className={`text-3xl font-bold mt-2 ${positive ? "text-green-600" : "text-red-600"}`}>
                {positive ? "↑" : "↓"} {Math.abs(value)}%
            </h2>

        </div>

    );

}

function ChartCard({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) {

    return (

        <div className="bg-white border rounded-xl p-6 shadow-sm">

            <h3 className="font-semibold mb-6">
                {title}
            </h3>

            {children}

        </div>

    );

}

function AlertPanel({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) {

    return (

        <div className="bg-white border rounded-xl p-6 shadow-sm">

            <h3 className="font-semibold mb-4">
                {title}
            </h3>

            <div className="space-y-2">
                {children}
            </div>

        </div>

    );

}