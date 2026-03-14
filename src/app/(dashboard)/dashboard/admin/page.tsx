"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import {
    Users, BookOpen, TrendingUp, TrendingDown, IndianRupee,
    Award, AlertCircle, CheckCircle2, XCircle, UserCheck,
    UserX, GraduationCap, Clock, Wallet, BarChart3
} from "lucide-react";

interface AnalyticsData {
    financial: {
        totalExpected: number; totalCollected: number; totalPending: number;
        fullyPaidCount: number; partiallyPaidCount: number; unpaidCount: number;
        revenueGrowth: number;
    };
    students: {
        total: number; active: number; inactive: number;
        completed: number; dropped: number;
        completionRate: number; dropoutRate: number;
        recentEnrollments: number; enrollmentGrowth: number;
    };
    certificates: {
        notApplied: number; applied: number; examGiven: number;
        passed: number; generated: number;
    };
    revenueTrend:    { month: string; amount: number }[];
    enrollmentTrend: { month: string; count: number }[];
    courseAnalytics: { _id: string; totalStudents: number; totalRevenue: number; totalExpected: number; totalPending: number }[];
    topCourses:      { _id: string; totalStudents: number }[];
    pendingFees:     { studentName: string; course: string; due: number }[];
    topPayingStudents: { name: string; amount: number }[];
}

/* ── Chart theme — Blue palette ── */
const ACCENT       = "#1A56DB";
const CHART_BLUE   = "#1A56DB";
const CHART_GREEN  = "#22C55E";
const PIE_COLORS   = ["#1A56DB","#3B82F6","#60A5FA","#22C55E","#F59E0B"];
const AXIS_STYLE   = { fill:"#64748B", fontSize:11 };

function CpTooltip({ active, payload, label, prefix = "" }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background:"#1E293B", border:"1px solid #334155",
            borderRadius:8, padding:"8px 14px",
            fontFamily:"'Plus Jakarta Sans',sans-serif",
        }}>
            <div style={{ fontSize:11, color:"#64748B", marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#1A56DB" }}>
                {prefix}{payload[0]?.value?.toLocaleString("en-IN")}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [data,    setData]    = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithAuth("/api/admin/analytics")
            .then(r => r.json())
            .then(setData)
            .catch(() => console.error("Analytics load failed"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <>
            <style>{cpStyles}</style>
            <div className="cp-dash-root">
                <div className="cp-dash-header">
                    <div className="cp-skeleton" style={{ width:200, height:28, borderRadius:6 }} />
                    <div className="cp-skeleton" style={{ width:120, height:18, borderRadius:4 }} />
                </div>
                <div className="cp-kpi-grid">
                    {Array.from({ length:8 }).map((_,i) => (
                        <div key={i} className="cp-card cp-skeleton-card">
                            <div className="cp-skeleton" style={{ width:"60%", height:11, borderRadius:4 }} />
                            <div className="cp-skeleton" style={{ width:"40%", height:28, borderRadius:6, marginTop:10 }} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const revenueTrend    = data?.revenueTrend    ?? [];
    const enrollmentTrend = data?.enrollmentTrend ?? [];

    const certData = [
        { name:"Not Applied", value: data?.certificates?.notApplied ?? 0 },
        { name:"Applied",     value: data?.certificates?.applied    ?? 0 },
        { name:"Exam Given",  value: data?.certificates?.examGiven  ?? 0 },
        { name:"Passed",      value: data?.certificates?.passed     ?? 0 },
        { name:"Generated",   value: data?.certificates?.generated  ?? 0 },
    ];

    const courseRevenue = data?.courseAnalytics?.map(c => ({ name:c._id, value:c.totalRevenue })) ?? [];
    const fmt = (n: number) => n?.toLocaleString("en-IN");

    return (
        <>
            <style>{cpStyles}</style>

            <div className="cp-dash-root">

                {/* Header */}
                <div className="cp-dash-header">
                    <div>
                        <h1 className="cp-dash-title">Dashboard</h1>
                        <p className="cp-dash-sub">Welcome back — here's what's happening today.</p>
                    </div>
                    <div className="cp-dash-date">
                        {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                    </div>
                </div>

                {/* Students KPIs */}
                <CpSection title="Students" icon={<Users size={14} />}>
                    <div className="cp-kpi-grid">
                        <KpiCard title="Total Students"      value={data?.students.total            ?? 0} icon={<Users size={16} />}        color="blue"  />
                        <KpiCard title="Active"              value={data?.students.active           ?? 0} icon={<UserCheck size={16} />}     color="green" />
                        <KpiCard title="Inactive"            value={data?.students.inactive         ?? 0} icon={<UserX size={16} />}         color="muted" />
                        <KpiCard title="Completed"           value={data?.students.completed        ?? 0} icon={<GraduationCap size={16} />} color="green" />
                        <KpiCard title="Dropped"             value={data?.students.dropped          ?? 0} icon={<XCircle size={16} />}       color="red"   />
                        <KpiCard title="Recent Enrollments"  value={data?.students.recentEnrollments ?? 0} icon={<Clock size={16} />}        color="blue"  />
                        <KpiCard title="Completion Rate"     value={data?.students.completionRate   ?? 0} icon={<CheckCircle2 size={16} />}  color="green" suffix="%" />
                        <KpiCard title="Dropout Rate"        value={data?.students.dropoutRate      ?? 0} icon={<AlertCircle size={16} />}   color="red"   suffix="%" />
                    </div>
                </CpSection>

                {/* Financial KPIs */}
                <CpSection title="Financial" icon={<IndianRupee size={14} />}>
                    <div className="cp-kpi-grid">
                        <KpiCard title="Total Expected"  value={data?.financial.totalExpected      ?? 0} icon={<Wallet size={16} />}       color="blue"  prefix="₹" />
                        <KpiCard title="Collected"       value={data?.financial.totalCollected     ?? 0} icon={<CheckCircle2 size={16} />} color="green" prefix="₹" />
                        <KpiCard title="Pending"         value={data?.financial.totalPending       ?? 0} icon={<AlertCircle size={16} />}  color="red"   prefix="₹" />
                        <KpiCard title="Fully Paid"      value={data?.financial.fullyPaidCount     ?? 0} icon={<CheckCircle2 size={16} />} color="green" />
                        <KpiCard title="Partial"         value={data?.financial.partiallyPaidCount ?? 0} icon={<Clock size={16} />}        color="blue"  />
                        <KpiCard title="Unpaid"          value={data?.financial.unpaidCount        ?? 0} icon={<XCircle size={16} />}      color="red"   />
                    </div>
                </CpSection>

                {/* Growth row */}
                <div className="cp-growth-row">
                    <GrowthCard title="Revenue Growth"    value={data?.financial.revenueGrowth      ?? 0} />
                    <GrowthCard title="Enrollment Growth" value={data?.students.enrollmentGrowth    ?? 0} />
                </div>

                {/* Bar charts */}
                <div className="cp-chart-row">
                    <ChartCard title="Monthly Revenue Trend">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={revenueTrend} margin={{ top:4, right:4, left:-10, bottom:0 }}>
                                <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                                <Tooltip content={<CpTooltip prefix="₹" />} cursor={{ fill:"rgba(26,86,219,0.06)" }} />
                                <Bar dataKey="amount" fill={CHART_BLUE} radius={[4,4,0,0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Monthly Enrollments">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={enrollmentTrend} margin={{ top:4, right:4, left:-10, bottom:0 }}>
                                <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                                <Tooltip content={<CpTooltip />} cursor={{ fill:"rgba(26,86,219,0.06)" }} />
                                <Bar dataKey="count" fill={CHART_GREEN} radius={[4,4,0,0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Pie charts */}
                <div className="cp-chart-row">
                    <ChartCard title="Certificate Status">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={certData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                                    {certData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, color:"#94A3B8" }} />
                                <Tooltip content={<CpTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Course Revenue">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={courseRevenue} dataKey="value" nameKey="name" outerRadius={95} paddingAngle={3}>
                                    {courseRevenue.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, color:"#94A3B8" }} />
                                <Tooltip content={<CpTooltip prefix="₹" />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Alert panels */}
                <div className="cp-alert-row">
                    <div className="cp-alert-card">
                        <div className="cp-alert-head">
                            <AlertCircle size={14} style={{ color:"#EF4444" }} />
                            <span>Pending Fees</span>
                        </div>
                        <div className="cp-alert-list">
                            {data?.pendingFees?.length ? data.pendingFees.map((p,i) => (
                                <div key={i} className="cp-alert-row-item">
                                    <div>
                                        <div className="cp-alert-name">{p.studentName}</div>
                                        <div className="cp-alert-course">{p.course}</div>
                                    </div>
                                    <div className="cp-alert-amount red">₹{fmt(p.due)}</div>
                                </div>
                            )) : <div className="cp-alert-empty">No pending fees 🎉</div>}
                        </div>
                    </div>

                    <div className="cp-alert-card">
                        <div className="cp-alert-head">
                            <CheckCircle2 size={14} style={{ color:"#22C55E" }} />
                            <span>Top Paying Students</span>
                        </div>
                        <div className="cp-alert-list">
                            {data?.topPayingStudents?.length ? data.topPayingStudents.map((s,i) => (
                                <div key={i} className="cp-alert-row-item">
                                    <div className="cp-alert-rank">#{i+1}</div>
                                    <div className="cp-alert-name" style={{ flex:1 }}>{s.name}</div>
                                    <div className="cp-alert-amount green">₹{fmt(s.amount)}</div>
                                </div>
                            )) : <div className="cp-alert-empty">No data yet</div>}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

/* ── Sub-components ── */
function CpSection({ title, icon, children }: { title:string; icon:React.ReactNode; children:React.ReactNode }) {
    return (
        <div className="cp-section">
            <div className="cp-section-title">
                <span className="cp-section-icon">{icon}</span>
                {title}
            </div>
            {children}
        </div>
    );
}

function KpiCard({ title, value, icon, color="blue", prefix="", suffix="" }: {
    title:string; value:number; icon:React.ReactNode;
    color?: "blue"|"green"|"red"|"muted";
    prefix?:string; suffix?:string;
}) {
    const colorMap = {
        blue:  { bg:"rgba(26,86,219,0.08)",   iconBg:"rgba(26,86,219,0.15)",   iconColor:"#1A56DB", val:"#F1F5F9" },
        green: { bg:"rgba(34,197,94,0.06)",   iconBg:"rgba(34,197,94,0.15)",   iconColor:"#22C55E", val:"#F1F5F9" },
        red:   { bg:"rgba(239,68,68,0.06)",   iconBg:"rgba(239,68,68,0.15)",   iconColor:"#EF4444", val:"#F1F5F9" },
        muted: { bg:"rgba(100,116,139,0.06)", iconBg:"rgba(100,116,139,0.12)", iconColor:"#64748B", val:"#94A3B8" },
    };
    const c = colorMap[color];

    return (
        <div className="cp-card" style={{ background:c.bg }}>
            <div className="cp-card-top">
                <div className="cp-card-label">{title}</div>
                <div className="cp-card-icon" style={{ background:c.iconBg, color:c.iconColor }}>{icon}</div>
            </div>
            <div className="cp-card-value" style={{ color:c.val }}>
                {prefix}<CountUp end={value} duration={1.4} separator="," />{suffix}
            </div>
        </div>
    );
}

function GrowthCard({ title, value }: { title:string; value:number }) {
    const pos = value >= 0;
    return (
        <div className="cp-growth-card">
            <div className="cp-growth-label">{title}</div>
            <div className="cp-growth-val" style={{ color: pos ? "#22C55E" : "#EF4444" }}>
                {pos ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                <span>{Math.abs(value)}%</span>
            </div>
            <div className="cp-growth-sub" style={{ color: pos ? "#16A34A" : "#DC2626" }}>
                {pos ? "vs last month ↑" : "vs last month ↓"}
            </div>
        </div>
    );
}

function ChartCard({ title, children }: { title:string; children:React.ReactNode }) {
    return (
        <div className="cp-chart-card">
            <div className="cp-chart-title">{title}</div>
            {children}
        </div>
    );
}

/* ── Styles ── */
const cpStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

    .cp-dash-root {
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #F1F5F9;
        display: flex; flex-direction: column; gap: 28px;
    }

    /* Header */
    .cp-dash-header {
        display: flex; align-items: flex-start; justify-content: space-between;
        flex-wrap: wrap; gap: 8px;
    }
    .cp-dash-title {
        font-family: 'DM Serif Display', serif;
        font-size: 1.7rem; color: #F1F5F9; font-weight: 400; line-height: 1.2;
    }
    .cp-dash-sub  { font-size: 12px; color: #64748B; margin-top: 4px; }
    .cp-dash-date {
        font-size: 11px; color: #64748B; font-weight: 500;
        padding: 6px 12px; border: 1px solid #334155;
        border-radius: 8px; background: #1E293B;
        white-space: nowrap; align-self: flex-start;
    }

    /* Section */
    .cp-section { display: flex; flex-direction: column; gap: 12px; }
    .cp-section-title {
        display: flex; align-items: center; gap: 7px;
        font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
        text-transform: uppercase; color: #64748B;
    }
    .cp-section-icon {
        width: 22px; height: 22px; border-radius: 6px;
        background: rgba(26,86,219,0.10); color: #1A56DB;
        display: flex; align-items: center; justify-content: center;
    }

    /* KPI grid */
    .cp-kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 12px;
    }

    /* KPI card */
    .cp-card {
        border: 1px solid #334155; border-radius: 12px;
        padding: 16px 18px;
        transition: border-color 0.15s, transform 0.15s;
        cursor: default;
    }
    .cp-card:hover { border-color: #3E506B; transform: translateY(-1px); }
    .cp-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .cp-card-label { font-size: 11px; color: #64748B; font-weight: 500; line-height: 1.4; flex: 1; margin-right: 8px; }
    .cp-card-icon {
        width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
    }
    .cp-card-value {
        font-size: 1.5rem; font-weight: 700;
        font-family: 'DM Serif Display', serif; line-height: 1;
    }

    /* Growth */
    .cp-growth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 600px) { .cp-growth-row { grid-template-columns: 1fr; } }
    .cp-growth-card {
        background: #1E293B; border: 1px solid #334155;
        border-radius: 12px; padding: 20px 22px;
    }
    .cp-growth-label { font-size: 11px; color: #64748B; font-weight: 500; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em; }
    .cp-growth-val   { display: flex; align-items: center; gap: 8px; font-size: 1.8rem; font-weight: 700; font-family: 'DM Serif Display', serif; }
    .cp-growth-sub   { font-size: 11px; margin-top: 6px; font-weight: 500; }

    /* Charts */
    .cp-chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 900px) { .cp-chart-row { grid-template-columns: 1fr; } }
    .cp-chart-card {
        background: #1E293B; border: 1px solid #334155;
        border-radius: 12px; padding: 20px 20px 14px;
    }
    .cp-chart-title {
        font-size: 12px; font-weight: 700; color: #94A3B8;
        text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;
    }

    /* Alert panels */
    .cp-alert-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 900px) { .cp-alert-row { grid-template-columns: 1fr; } }
    .cp-alert-card {
        background: #1E293B; border: 1px solid #334155;
        border-radius: 12px; overflow: hidden;
    }
    .cp-alert-head {
        display: flex; align-items: center; gap: 8px;
        padding: 14px 18px; border-bottom: 1px solid #334155;
        font-size: 12px; font-weight: 700; color: #94A3B8;
        text-transform: uppercase; letter-spacing: 0.08em;
        background: #273548;
    }
    .cp-alert-list { padding: 4px 0; max-height: 280px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #334155 transparent; }
    .cp-alert-row-item {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 18px; border-bottom: 1px solid #1E2D40;
        transition: background 0.12s;
    }
    .cp-alert-row-item:last-child { border-bottom: none; }
    .cp-alert-row-item:hover { background: rgba(26,86,219,0.05); }
    .cp-alert-name   { font-size: 12px; font-weight: 600; color: #E2E8F0; }
    .cp-alert-course { font-size: 10px; color: #64748B; margin-top: 1px; }
    .cp-alert-rank   { width: 20px; font-size: 11px; font-weight: 700; color: #64748B; flex-shrink: 0; }
    .cp-alert-amount { font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .cp-alert-amount.red   { color: #EF4444; }
    .cp-alert-amount.green { color: #22C55E; }
    .cp-alert-empty  { padding: 20px 18px; font-size: 12px; color: #64748B; text-align: center; }

    /* Skeleton */
    .cp-skeleton-card { background: #1E293B !important; }
    .cp-skeleton {
        background: linear-gradient(90deg, #1E293B 25%, #273548 50%, #1E293B 75%);
        background-size: 200% 100%;
        animation: cpShimmer 1.4s infinite;
    }
    @keyframes cpShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;