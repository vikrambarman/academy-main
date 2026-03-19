"use client";

import { useEffect, useState }   from "react";
import { fetchWithAuth }         from "@/lib/fetchWithAuth";
import CountUp                   from "react-countup";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import {
    Users, BookOpen, IndianRupee, Award,
    AlertCircle, CheckCircle2, XCircle, UserCheck,
    UserX, GraduationCap, Clock, Wallet,
    TrendingUp, TrendingDown, RefreshCw,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AnalyticsData {
    financial: {
        totalExpected: number; totalCollected: number; totalPending: number;
        fullyPaidCount: number; partiallyPaidCount: number; unpaidCount: number;
        revenueGrowth?: number; thisMonthRev?: number; lastMonthRev?: number;
    };
    students: {
        total: number; active: number; inactive: number;
        completed: number; dropped: number;
        completionRate: number; dropoutRate: number;
        recentEnrollments: number; enrollmentGrowth?: number;
        thisMonthEnrCount?: number; lastMonthEnrCount?: number;
    };
    certificates: {
        notApplied: number; applied: number; examGiven: number;
        passed: number; generated: number;
    };
    revenueTrend:    { month: string; amount: number }[];
    enrollmentTrend: { month: string; count: number  }[];
    courseAnalytics: {
        _id: string; totalStudents: number;
        totalRevenue: number; totalExpected: number; totalPending: number;
    }[];
    topCourses:        { _id: string; totalStudents: number }[];
    pendingFees?:      { studentName: string; course: string; due: number }[];
    topPayingStudents?: { name: string; amount: number }[];
}

// ── Chart colors — use accent palette ─────────────────────────────────────────

const PIE_COLORS = ["#1A56DB", "#3B82F6", "#60A5FA", "#22C55E", "#F59E0B"];

// ── Tooltip ───────────────────────────────────────────────────────────────────

function CpTooltip({ active, payload, label, prefix = "" }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background:   "var(--cp-surface2)",
            border:       "1px solid var(--cp-border)",
            borderRadius: 8,
            padding:      "8px 14px",
            fontFamily:   "'Plus Jakarta Sans',sans-serif",
        }}>
            {label && <div style={{ fontSize: 11, color: "var(--cp-muted)", marginBottom: 4 }}>{label}</div>}
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--cp-accent)" }}>
                {prefix}{payload[0]?.value?.toLocaleString("en-IN")}
            </div>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ w, h, r = 6 }: { w: number | string; h: number; r?: number }) {
    return (
        <div className="cp-dash-skeleton" style={{ width: w, height: h, borderRadius: r }} />
    );
}

function DashboardSkeleton() {
    return (
        <div className="cp-dash-root">
            <div className="cp-dash-header">
                <div>
                    <Skeleton w={200} h={28} r={6} />
                    <div style={{ marginTop: 8 }}><Skeleton w={160} h={14} r={4} /></div>
                </div>
                <Skeleton w={120} h={32} r={8} />
            </div>
            {[1, 2].map(s => (
                <div key={s} className="cp-dash-section">
                    <Skeleton w={100} h={12} r={4} />
                    <div className="cp-kpi-grid" style={{ marginTop: 12 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="cp-kpi-card">
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                    <Skeleton w="55%" h={11} r={4} />
                                    <Skeleton w={30} h={30} r={8} />
                                </div>
                                <Skeleton w="40%" h={26} r={6} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="cp-chart-row">
                {[1, 2].map(i => (
                    <div key={i} className="cp-chart-card">
                        <Skeleton w={140} h={12} r={4} />
                        <div style={{ marginTop: 20 }}><Skeleton w="100%" h={220} r={8} /></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

type KpiColor = "blue" | "green" | "red" | "muted";

const KPI_COLORS: Record<KpiColor, { border: string; iconBg: string; iconColor: string; valColor: string }> = {
    blue:  { border: "rgba(26,86,219,0.3)",   iconBg: "var(--cp-accent-glow)", iconColor: "var(--cp-accent)",  valColor: "var(--cp-text)" },
    green: { border: "rgba(34,197,94,0.3)",   iconBg: "rgba(34,197,94,0.12)", iconColor: "#22C55E",           valColor: "var(--cp-text)" },
    red:   { border: "rgba(239,68,68,0.3)",   iconBg: "rgba(239,68,68,0.12)", iconColor: "var(--cp-danger)",  valColor: "var(--cp-text)" },
    muted: { border: "var(--cp-border)",       iconBg: "var(--cp-surface2)",   iconColor: "var(--cp-muted)",   valColor: "var(--cp-subtext)" },
};

function KpiCard({
    title, value, icon,
    color = "blue", prefix = "", suffix = "",
}: {
    title: string; value: number; icon: React.ReactNode;
    color?: KpiColor; prefix?: string; suffix?: string;
}) {
    const c = KPI_COLORS[color];
    return (
        <div className="cp-kpi-card" style={{ borderColor: c.border }}>
            <div className="cp-kpi-top">
                <div className="cp-kpi-label">{title}</div>
                <div className="cp-kpi-icon" style={{ background: c.iconBg, color: c.iconColor }}>
                    {icon}
                </div>
            </div>
            <div className="cp-kpi-value" style={{ color: c.valColor }}>
                {prefix}<CountUp end={value} duration={1.2} separator="," />{suffix}
            </div>
        </div>
    );
}

// ── Growth Card ───────────────────────────────────────────────────────────────

function GrowthCard({
    title, value, thisVal, lastVal, prefix = "",
}: {
    title: string; value: number;
    thisVal?: number; lastVal?: number; prefix?: string;
}) {
    const pos     = value >= 0;
    const noData  = thisVal === undefined && lastVal === undefined;
    const fmt     = (n: number) => prefix === "₹"
        ? `₹${n.toLocaleString("en-IN")}`
        : n.toLocaleString("en-IN");
    return (
        <div className="cp-growth-card">
            <div className="cp-growth-label">{title}</div>
            <div className="cp-growth-val" style={{ color: noData ? "var(--cp-muted)" : pos ? "var(--cp-success)" : "var(--cp-danger)" }}>
                {noData ? null : pos ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                <span>{noData ? "—" : `${pos ? "+" : ""}${value}%`}</span>
            </div>
            {!noData && (
                <div className="cp-growth-sub" style={{ color: pos ? "var(--cp-success)" : "var(--cp-danger)" }}>
                    {pos ? "vs last month ↑" : "vs last month ↓"}
                </div>
            )}
            {(thisVal !== undefined || lastVal !== undefined) && (
                <div className="cp-growth-meta">
                    <span>This month: <strong>{fmt(thisVal ?? 0)}</strong></span>
                    <span>Last month: <strong>{fmt(lastVal ?? 0)}</strong></span>
                </div>
            )}
        </div>
    );
}

// ── Chart Card ────────────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="cp-chart-card">
            <div className="cp-chart-title">{title}</div>
            {children}
        </div>
    );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function DashSection({ title, icon, children }: {
    title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="cp-dash-section">
            <div className="cp-section-label">
                <span className="cp-section-icon">{icon}</span>
                {title}
            </div>
            {children}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
    const [data,    setData]    = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(false);

    const load = () => {
        setLoading(true);
        setError(false);
        fetchWithAuth("/api/admin/analytics")
            .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
            .then(d  => { setData(d); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    };

    useEffect(() => { load(); }, []);

    const axisStyle = { fill: "var(--cp-muted)", fontSize: 11 };

    if (loading) return <><style>{styles}</style><DashboardSkeleton /></>;

    if (error) return (
        <>
            <style>{styles}</style>
            <div className="cp-dash-root">
                <div className="cp-error-state">
                    <AlertCircle size={28} style={{ color: "var(--cp-danger)", marginBottom: 8 }} />
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Analytics load nahi hui</div>
                    <div style={{ fontSize: 12, color: "var(--cp-muted)", marginBottom: 16 }}>
                        Network ya server issue ho sakti hai
                    </div>
                    <button className="cp-retry-btn" onClick={load}>
                        <RefreshCw size={13} /> Retry
                    </button>
                </div>
            </div>
        </>
    );

    // ── Derived data ──
    const revenueTrend    = data?.revenueTrend    ?? [];
    const enrollmentTrend = data?.enrollmentTrend ?? [];

    const certData = [
        { name: "Not Applied", value: data?.certificates?.notApplied ?? 0 },
        { name: "Applied",     value: data?.certificates?.applied    ?? 0 },
        { name: "Exam Given",  value: data?.certificates?.examGiven  ?? 0 },
        { name: "Passed",      value: data?.certificates?.passed     ?? 0 },
        { name: "Generated",   value: data?.certificates?.generated  ?? 0 },
    ];

    const courseRevenue = data?.courseAnalytics?.map(c => ({
        name: c._id, value: c.totalRevenue,
    })) ?? [];

    const fmt = (n: number) => `₹${n?.toLocaleString("en-IN") ?? 0}`;

    return (
        <>
            <style>{styles}</style>
            <div className="cp-dash-root">

                {/* Header */}
                <div className="cp-dash-header">
                    <div>
                        <h1 className="cp-dash-title">Dashboard</h1>
                        <p className="cp-dash-sub">Welcome back — here's what's happening today.</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="cp-dash-date">
                            {new Date().toLocaleDateString("en-IN", {
                                weekday: "long", day: "numeric",
                                month: "long", year: "numeric",
                            })}
                        </div>
                        <button className="cp-retry-btn" onClick={load} title="Refresh">
                            <RefreshCw size={13} />
                        </button>
                    </div>
                </div>

                {/* ── Students ── */}
                <DashSection title="Students" icon={<Users size={13} />}>
                    <div className="cp-kpi-grid">
                        <KpiCard title="Total Students"     value={data?.students.total             ?? 0} icon={<Users size={15} />}        color="blue"  />
                        <KpiCard title="Active"             value={data?.students.active            ?? 0} icon={<UserCheck size={15} />}     color="green" />
                        <KpiCard title="Inactive"           value={data?.students.inactive          ?? 0} icon={<UserX size={15} />}         color="muted" />
                        <KpiCard title="Completed"          value={data?.students.completed         ?? 0} icon={<GraduationCap size={15} />} color="green" />
                        <KpiCard title="Dropped"            value={data?.students.dropped           ?? 0} icon={<XCircle size={15} />}       color="red"   />
                        <KpiCard title="Recent (30 days)"   value={data?.students.recentEnrollments ?? 0} icon={<Clock size={15} />}         color="blue"  />
                        <KpiCard title="Completion Rate"    value={data?.students.completionRate    ?? 0} icon={<CheckCircle2 size={15} />}  color="green" suffix="%" />
                        <KpiCard title="Dropout Rate"       value={data?.students.dropoutRate       ?? 0} icon={<AlertCircle size={15} />}   color="red"   suffix="%" />
                    </div>
                </DashSection>

                {/* ── Financial ── */}
                <DashSection title="Financial" icon={<IndianRupee size={13} />}>
                    <div className="cp-kpi-grid">
                        <KpiCard title="Total Expected"  value={data?.financial.totalExpected      ?? 0} icon={<Wallet size={15} />}       color="blue"  prefix="₹" />
                        <KpiCard title="Collected"       value={data?.financial.totalCollected     ?? 0} icon={<CheckCircle2 size={15} />} color="green" prefix="₹" />
                        <KpiCard title="Pending"         value={data?.financial.totalPending       ?? 0} icon={<AlertCircle size={15} />}  color="red"   prefix="₹" />
                        <KpiCard title="Fully Paid"      value={data?.financial.fullyPaidCount     ?? 0} icon={<CheckCircle2 size={15} />} color="green" />
                        <KpiCard title="Partial"         value={data?.financial.partiallyPaidCount ?? 0} icon={<Clock size={15} />}        color="blue"  />
                        <KpiCard title="Unpaid"          value={data?.financial.unpaidCount        ?? 0} icon={<XCircle size={15} />}      color="red"   />
                    </div>
                </DashSection>

                {/* ── Growth ── */}
                <div className="cp-growth-row">
                    <GrowthCard
                        title="Revenue Growth"
                        value={data?.financial.revenueGrowth ?? 0}
                        thisVal={data?.financial.thisMonthRev}
                        lastVal={data?.financial.lastMonthRev}
                        prefix="₹"
                    />
                    <GrowthCard
                        title="Enrollment Growth"
                        value={data?.students.enrollmentGrowth ?? 0}
                        thisVal={data?.students.thisMonthEnrCount}
                        lastVal={data?.students.lastMonthEnrCount}
                    />
                </div>

                {/* ── Bar Charts ── */}
                <div className="cp-chart-row">
                    <ChartCard title="Monthly Revenue Trend">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={revenueTrend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                                <Tooltip content={<CpTooltip prefix="₹" />} cursor={{ fill: "var(--cp-accent-glow)" }} />
                                <Bar dataKey="amount" fill="var(--cp-accent)" radius={[4, 4, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Monthly Enrollments">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={enrollmentTrend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                                <Tooltip content={<CpTooltip />} cursor={{ fill: "var(--cp-accent-glow)" }} />
                                <Bar dataKey="count" fill="var(--cp-success)" radius={[4, 4, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* ── Pie Charts ── */}
                <div className="cp-chart-row">
                    <ChartCard title="Certificate Status">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={certData} dataKey="value" nameKey="name"
                                    innerRadius={60} outerRadius={95} paddingAngle={3}>
                                    {certData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <Legend iconType="circle" iconSize={8}
                                    wrapperStyle={{ fontSize: 11, color: "var(--cp-muted)" }} />
                                <Tooltip content={<CpTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Course Revenue Distribution">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={courseRevenue} dataKey="value" nameKey="name"
                                    outerRadius={95} paddingAngle={3}>
                                    {courseRevenue.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend iconType="circle" iconSize={8}
                                    wrapperStyle={{ fontSize: 11, color: "var(--cp-muted)" }} />
                                <Tooltip content={<CpTooltip prefix="₹" />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* ── Alert Panels ── */}
                <div className="cp-alert-row">

                    {/* Pending Fees */}
                    <div className="cp-alert-card">
                        <div className="cp-alert-head">
                            <AlertCircle size={13} style={{ color: "var(--cp-danger)" }} />
                            <span>Pending Fees</span>
                        </div>
                        <div className="cp-alert-list">
                            {data?.pendingFees?.length ? (
                                data.pendingFees.map((p, i) => (
                                    <div key={i} className="cp-alert-item">
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="cp-alert-name">{p.studentName}</div>
                                            <div className="cp-alert-meta">{p.course}</div>
                                        </div>
                                        <div className="cp-alert-amt" style={{ color: "var(--cp-danger)" }}>
                                            {fmt(p.due)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="cp-alert-empty">No pending fees 🎉</div>
                            )}
                        </div>
                    </div>

                    {/* Top Paying Students */}
                    <div className="cp-alert-card">
                        <div className="cp-alert-head">
                            <CheckCircle2 size={13} style={{ color: "var(--cp-success)" }} />
                            <span>Top Paying Students</span>
                        </div>
                        <div className="cp-alert-list">
                            {data?.topPayingStudents?.length ? (
                                data.topPayingStudents.map((s, i) => (
                                    <div key={i} className="cp-alert-item">
                                        <div className="cp-alert-rank">#{i + 1}</div>
                                        <div className="cp-alert-name" style={{ flex: 1 }}>{s.name}</div>
                                        <div className="cp-alert-amt" style={{ color: "var(--cp-success)" }}>
                                            {fmt(s.amount)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="cp-alert-empty">No data yet</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

// ── Styles — ALL colors via var(--cp-*) for light/dark support ────────────────

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

    .cp-dash-root {
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: var(--cp-text);
        display: flex; flex-direction: column; gap: 28px;
    }

    /* ── Header ── */
    .cp-dash-header {
        display: flex; align-items: flex-start;
        justify-content: space-between; flex-wrap: wrap; gap: 10px;
    }
    .cp-dash-title {
        font-family: 'DM Serif Display', serif;
        font-size: 1.7rem; font-weight: 400;
        color: var(--cp-text); line-height: 1.2;
    }
    .cp-dash-sub  { font-size: 12px; color: var(--cp-muted); margin-top: 4px; }
    .cp-dash-date {
        font-size: 11px; color: var(--cp-muted); font-weight: 500;
        padding: 7px 14px; border: 1px solid var(--cp-border);
        border-radius: 8px; background: var(--cp-surface);
        white-space: nowrap; align-self: flex-start;
    }

    /* ── Section ── */
    .cp-dash-section { display: flex; flex-direction: column; gap: 12px; }
    .cp-section-label {
        display: flex; align-items: center; gap: 7px;
        font-size: 11px; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        color: var(--cp-muted);
    }
    .cp-section-icon {
        width: 22px; height: 22px; border-radius: 6px;
        background: var(--cp-accent-glow); color: var(--cp-accent);
        display: flex; align-items: center; justify-content: center;
    }

    /* ── KPI Grid ── */
    .cp-kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 12px;
    }
    .cp-kpi-card {
        background: var(--cp-surface);
        border: 1px solid var(--cp-border);
        border-radius: 12px; padding: 16px 18px;
        transition: transform 0.15s, box-shadow 0.15s;
    }
    .cp-kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px color-mix(in srgb, var(--cp-accent) 8%, transparent);
    }
    .cp-kpi-top {
        display: flex; align-items: flex-start;
        justify-content: space-between; margin-bottom: 12px;
    }
    .cp-kpi-label {
        font-size: 11px; color: var(--cp-muted);
        font-weight: 500; line-height: 1.4;
        flex: 1; margin-right: 8px;
    }
    .cp-kpi-icon {
        width: 30px; height: 30px; border-radius: 8px;
        flex-shrink: 0; display: flex;
        align-items: center; justify-content: center;
    }
    .cp-kpi-value {
        font-family: 'DM Serif Display', serif;
        font-size: 1.5rem; font-weight: 400; line-height: 1;
        color: var(--cp-text);
    }

    /* ── Growth ── */
    .cp-growth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media(max-width:600px) { .cp-growth-row { grid-template-columns: 1fr; } }
    .cp-growth-card {
        background: var(--cp-surface); border: 1px solid var(--cp-border);
        border-radius: 12px; padding: 20px 22px;
    }
    .cp-growth-label {
        font-size: 11px; color: var(--cp-muted); font-weight: 600;
        text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
    }
    .cp-growth-val {
        display: flex; align-items: center; gap: 8px;
        font-family: 'DM Serif Display', serif; font-size: 1.8rem;
    }
    .cp-growth-sub  { font-size: 11px; margin-top: 6px; font-weight: 500; }
    .cp-growth-meta {
        display: flex; flex-direction: column; gap: 3px;
        margin-top: 10px; padding-top: 10px;
        border-top: 1px solid var(--cp-border);
        font-size: 11px; color: var(--cp-muted);
    }
    .cp-growth-meta strong { color: var(--cp-subtext); }

    /* ── Charts ── */
    .cp-chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media(max-width:900px) { .cp-chart-row { grid-template-columns: 1fr; } }
    .cp-chart-card {
        background: var(--cp-surface); border: 1px solid var(--cp-border);
        border-radius: 12px; padding: 20px 20px 14px;
    }
    .cp-chart-title {
        font-size: 11px; font-weight: 700; color: var(--cp-muted);
        text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;
    }

    /* ── Alert Panels ── */
    .cp-alert-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media(max-width:900px) { .cp-alert-row { grid-template-columns: 1fr; } }
    .cp-alert-card {
        background: var(--cp-surface); border: 1px solid var(--cp-border);
        border-radius: 12px; overflow: hidden;
    }
    .cp-alert-head {
        display: flex; align-items: center; gap: 8px;
        padding: 13px 18px; border-bottom: 1px solid var(--cp-border);
        font-size: 11px; font-weight: 700; color: var(--cp-muted);
        text-transform: uppercase; letter-spacing: 0.08em;
        background: var(--cp-surface2);
    }
    .cp-alert-list {
        max-height: 280px; overflow-y: auto;
        scrollbar-width: thin; scrollbar-color: var(--cp-border) transparent;
    }
    .cp-alert-item {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 18px; border-bottom: 1px solid var(--cp-border);
        transition: background 0.12s;
    }
    .cp-alert-item:last-child  { border-bottom: none; }
    .cp-alert-item:hover       { background: var(--cp-accent-glow2); }
    .cp-alert-rank  { width: 22px; font-size: 11px; font-weight: 700; color: var(--cp-muted); flex-shrink: 0; }
    .cp-alert-name  { font-size: 12px; font-weight: 600; color: var(--cp-text); }
    .cp-alert-meta  { font-size: 10px; color: var(--cp-muted); margin-top: 2px; }
    .cp-alert-amt   { font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .cp-alert-empty { padding: 24px 18px; font-size: 12px; color: var(--cp-muted); text-align: center; }

    /* ── Error + Retry ── */
    .cp-error-state {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; padding: 80px 20px;
        color: var(--cp-text); text-align: center; font-size: 13px;
    }
    .cp-retry-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 7px 16px; border-radius: 8px;
        border: 1px solid var(--cp-border); background: var(--cp-surface);
        color: var(--cp-subtext); font-size: 12px; font-weight: 600;
        cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
        transition: border-color 0.14s, color 0.14s;
    }
    .cp-retry-btn:hover { border-color: var(--cp-accent); color: var(--cp-accent); }

    /* ── Skeleton ── */
    .cp-dash-skeleton {
        background: linear-gradient(
            90deg,
            var(--cp-surface) 25%,
            var(--cp-surface2) 50%,
            var(--cp-surface) 75%
        );
        background-size: 200% 100%;
        animation: cpShimmer 1.4s infinite;
    }
    @keyframes cpShimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;