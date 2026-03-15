"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Users, BookOpen, IndianRupee, RefreshCw } from "lucide-react";

interface Analytics {
    totalStudents: number; totalCourses: number;
    totalRevenue: number; totalPending: number;
    enrollmentsByMonth: { month: string; count: number }[];
    revenueByMonth:     { month: string; revenue: number; pending: number }[];
    courseWiseStudents: { course: string; count: number }[];
    attendanceSummary:  { name: string; percentage: number }[];
    feeCollectionRate:  number;
    newStudentsThisMonth: number;
}

const COLORS = ["#f59e0b","#22c55e","#60a5fa","#a78bfa","#f87171","#34d399","#fb923c","#e879f9"];

const CpTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background:   "var(--cp-surface2)",
            border:       "1px solid var(--cp-border)",
            borderRadius: 8,
            padding:      "8px 12px",
            fontSize:     11,
            fontFamily:   "'Plus Jakarta Sans',sans-serif",
        }}>
            {label && (
                <div style={{ color:"var(--cp-muted)", marginBottom:4, fontWeight:700 }}>
                    {label}
                </div>
            )}
            {payload.map((p: any, i: number) => (
                <div key={i} style={{
                    color:       p.color || "var(--cp-text)",
                    display:     "flex",
                    gap:         8,
                    alignItems:  "center",
                }}>
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: p.color, display: "inline-block",
                    }}/>
                    <span style={{ color:"var(--cp-muted)" }}>{p.name}:</span>
                    <span style={{ fontWeight:700 }}>
                        {p.name?.toLowerCase().includes("revenue") || p.name?.toLowerCase().includes("pending")
                            ? `₹${Number(p.value).toLocaleString("en-IN")}` : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function AdminReportsPage() {
    const [data,    setData]    = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast,   setToast]   = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth("/api/admin/analytics");
            setData(await res.json());
        } catch {
            setToast("Load failed");
            setTimeout(() => setToast(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

    if (loading) return (
        <>
            <style>{arStyles}</style>
            <div className="ar-loading">
                <div className="ar-spinner"/>
                <span>Analytics load ho raha hai…</span>
            </div>
        </>
    );

    return (
        <>
            <style>{arStyles}</style>
            {toast && <div className="ar-toast">{toast}</div>}
            <div className="ar-root">

                {/* Header */}
                <div className="ar-header">
                    <div>
                        <h1 className="ar-title">Reports & Analytics</h1>
                        <p className="ar-sub">Academy performance ka complete overview</p>
                    </div>
                    <button className="ar-refresh-btn" onClick={load}>
                        <RefreshCw size={13}/> Refresh
                    </button>
                </div>

                {/* KPI Row */}
                <div className="ar-kpi-row">
                    <div className="ar-kpi amber">
                        <div className="ar-kpi-icon">
                            <Users size={16} style={{ color:"var(--cp-warning)" }}/>
                        </div>
                        <div>
                            <div className="ar-kpi-label">Total Students</div>
                            <div className="ar-kpi-val">{data?.totalStudents || 0}</div>
                            <div className="ar-kpi-sub">+{data?.newStudentsThisMonth || 0} this month</div>
                        </div>
                    </div>
                    <div className="ar-kpi blue">
                        <div className="ar-kpi-icon">
                            <BookOpen size={16} style={{ color:"#60a5fa" }}/>
                        </div>
                        <div>
                            <div className="ar-kpi-label">Active Courses</div>
                            <div className="ar-kpi-val">{data?.totalCourses || 0}</div>
                        </div>
                    </div>
                    <div className="ar-kpi green">
                        <div className="ar-kpi-icon">
                            <IndianRupee size={16} style={{ color:"var(--cp-success)" }}/>
                        </div>
                        <div>
                            <div className="ar-kpi-label">Total Revenue</div>
                            <div className="ar-kpi-val">{fmt(data?.totalRevenue || 0)}</div>
                            <div className="ar-kpi-sub" style={{ color:"var(--cp-success)" }}>
                                {data?.feeCollectionRate || 0}% collected
                            </div>
                        </div>
                    </div>
                    <div className="ar-kpi red">
                        <div className="ar-kpi-icon">
                            <TrendingUp size={16} style={{ color:"var(--cp-danger)" }}/>
                        </div>
                        <div>
                            <div className="ar-kpi-label">Pending Fees</div>
                            <div className="ar-kpi-val">{fmt(data?.totalPending || 0)}</div>
                        </div>
                    </div>
                </div>

                {/* Row 1: Revenue chart + Enrollment chart */}
                <div className="ar-charts-row">

                    {/* Revenue vs Pending */}
                    <div className="ar-chart-card wide">
                        <div className="ar-chart-head">
                            <span className="ar-chart-title">Monthly Revenue</span>
                        </div>
                        <div className="ar-chart-body">
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart
                                    data={data?.revenueByMonth || []}
                                    margin={{ top:5, right:10, left:0, bottom:0 }}
                                >
                                    <XAxis dataKey="month"
                                        tick={{ fill:"var(--cp-muted)", fontSize:10 }}
                                        axisLine={false} tickLine={false}/>
                                    <YAxis
                                        tick={{ fill:"var(--cp-muted)", fontSize:10 }}
                                        axisLine={false} tickLine={false}
                                        tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}/>
                                    <Tooltip content={<CpTooltip/>}/>
                                    <Legend wrapperStyle={{ fontSize:11, color:"var(--cp-muted)" }}/>
                                    <Line type="monotone" dataKey="revenue" name="Revenue"
                                        stroke="var(--cp-success)" strokeWidth={2} dot={false}/>
                                    <Line type="monotone" dataKey="pending" name="Pending"
                                        stroke="var(--cp-danger)" strokeWidth={2} dot={false} strokeDasharray="4 2"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Enrollments by month */}
                    <div className="ar-chart-card">
                        <div className="ar-chart-head">
                            <span className="ar-chart-title">Enrollments / Month</span>
                        </div>
                        <div className="ar-chart-body">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart
                                    data={data?.enrollmentsByMonth || []}
                                    margin={{ top:5, right:10, left:0, bottom:0 }}
                                >
                                    <XAxis dataKey="month"
                                        tick={{ fill:"var(--cp-muted)", fontSize:10 }}
                                        axisLine={false} tickLine={false}/>
                                    <YAxis
                                        tick={{ fill:"var(--cp-muted)", fontSize:10 }}
                                        axisLine={false} tickLine={false}
                                        allowDecimals={false}/>
                                    <Tooltip content={<CpTooltip/>}/>
                                    <Bar dataKey="count" name="Enrollments"
                                        fill="var(--cp-warning)" radius={[4,4,0,0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Row 2: Course-wise pie + Attendance */}
                <div className="ar-charts-row">

                    {/* Course-wise students pie */}
                    <div className="ar-chart-card">
                        <div className="ar-chart-head">
                            <span className="ar-chart-title">Students by Course</span>
                        </div>
                        <div className="ar-chart-body" style={{
                            display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
                        }}>
                            <ResponsiveContainer width={180} height={180}>
                                <PieChart>
                                    <Pie
                                        data={data?.courseWiseStudents || []}
                                        dataKey="count" nameKey="course"
                                        cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={80} paddingAngle={2}
                                    >
                                        {data?.courseWiseStudents?.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CpTooltip/>}/>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                flex:1, minWidth:120,
                                display:"flex", flexDirection:"column", gap:6,
                            }}>
                                {data?.courseWiseStudents?.map((c, i) => (
                                    <div key={i} style={{
                                        display:"flex", alignItems:"center", gap:7,
                                    }}>
                                        <span style={{
                                            width:9, height:9, borderRadius:"50%",
                                            background: COLORS[i % COLORS.length], flexShrink:0,
                                        }}/>
                                        <span style={{
                                            fontSize:11, color:"var(--cp-subtext)",
                                            flex:1, overflow:"hidden",
                                            textOverflow:"ellipsis", whiteSpace:"nowrap",
                                        }}>
                                            {c.course}
                                        </span>
                                        <span style={{
                                            fontSize:11, fontWeight:700, color:"var(--cp-text)",
                                        }}>
                                            {c.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Attendance summary */}
                    <div className="ar-chart-card wide">
                        <div className="ar-chart-head">
                            <span className="ar-chart-title">Attendance Summary — Top 10</span>
                        </div>
                        <div className="ar-chart-body">
                            {!data?.attendanceSummary?.length ? (
                                <div style={{
                                    color:"var(--cp-muted)", fontSize:12,
                                    padding:"20px 0", textAlign:"center",
                                }}>
                                    No attendance data
                                </div>
                            ) : (
                                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                                    {data.attendanceSummary.slice(0, 10).map((s, i) => {
                                        const pct   = s.percentage || 0;
                                        const color = pct >= 75
                                            ? "var(--cp-success)"
                                            : pct >= 50
                                            ? "var(--cp-warning)"
                                            : "var(--cp-danger)";
                                        return (
                                            <div key={i} style={{
                                                display:"flex", alignItems:"center", gap:10,
                                            }}>
                                                <span style={{
                                                    fontSize:11, color:"var(--cp-muted)",
                                                    width:130, flexShrink:0,
                                                    overflow:"hidden", textOverflow:"ellipsis",
                                                    whiteSpace:"nowrap",
                                                }}>
                                                    {s.name}
                                                </span>
                                                <div style={{
                                                    flex:1, height:5,
                                                    background:"var(--cp-surface2)",
                                                    borderRadius:100, overflow:"hidden",
                                                }}>
                                                    <div style={{
                                                        height:"100%", width:`${pct}%`,
                                                        background: color,
                                                        borderRadius:100, transition:"width .4s",
                                                    }}/>
                                                </div>
                                                <span style={{
                                                    fontSize:11, fontWeight:700,
                                                    color, width:36, textAlign:"right",
                                                }}>
                                                    {pct}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fee collection rate */}
                <div className="ar-chart-card" style={{ maxWidth:"100%" }}>
                    <div className="ar-chart-head">
                        <span className="ar-chart-title">Fee Collection Rate</span>
                    </div>
                    <div className="ar-chart-body">
                        <div style={{
                            display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
                        }}>
                            <div style={{
                                position:"relative", width:120, height:120, flexShrink:0,
                            }}>
                                <svg viewBox="0 0 36 36" style={{
                                    width:"100%", height:"100%", transform:"rotate(-90deg)",
                                }}>
                                    <circle cx="18" cy="18" r="15.9" fill="none"
                                        stroke="var(--cp-surface2)" strokeWidth="3"/>
                                    <circle cx="18" cy="18" r="15.9" fill="none"
                                        stroke="var(--cp-success)" strokeWidth="3"
                                        strokeDasharray={`${data?.feeCollectionRate || 0} 100`}
                                        strokeLinecap="round"/>
                                </svg>
                                <div style={{
                                    position:"absolute", inset:0,
                                    display:"flex", alignItems:"center",
                                    justifyContent:"center", flexDirection:"column",
                                }}>
                                    <span style={{
                                        fontFamily:"'DM Serif Display',serif",
                                        fontSize:"1.4rem", color:"var(--cp-success)",
                                    }}>
                                        {data?.feeCollectionRate || 0}%
                                    </span>
                                </div>
                            </div>
                            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                <div>
                                    <div style={{
                                        fontSize:10, color:"var(--cp-muted)",
                                        fontWeight:700, textTransform:"uppercase",
                                        letterSpacing:".08em", marginBottom:3,
                                    }}>
                                        Collected
                                    </div>
                                    <div style={{
                                        fontFamily:"'DM Serif Display',serif",
                                        fontSize:"1.2rem", color:"var(--cp-success)",
                                    }}>
                                        {fmt(data?.totalRevenue || 0)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{
                                        fontSize:10, color:"var(--cp-muted)",
                                        fontWeight:700, textTransform:"uppercase",
                                        letterSpacing:".08em", marginBottom:3,
                                    }}>
                                        Pending
                                    </div>
                                    <div style={{
                                        fontFamily:"'DM Serif Display',serif",
                                        fontSize:"1.2rem", color:"var(--cp-danger)",
                                    }}>
                                        {fmt(data?.totalPending || 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

const arStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

    .ar-root    { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }
    .ar-loading { display:flex; align-items:center; gap:12px; padding:60px; color:var(--cp-muted); font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; justify-content:center; }
    .ar-spinner { width:20px; height:20px; border:2px solid var(--cp-border); border-top-color:var(--cp-accent); border-radius:50%; animation:arSpin .7s linear infinite; }
    @keyframes arSpin { to{transform:rotate(360deg)} }
    .ar-toast   { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; background:rgba(239,68,68,0.12); color:var(--cp-danger); border:1px solid rgba(239,68,68,.3); }

    .ar-header      { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .ar-title       { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .ar-sub         { font-size:12px; color:var(--cp-muted); margin-top:3px; }
    .ar-refresh-btn { display:inline-flex; align-items:center; gap:7px; padding:8px 16px; border-radius:9px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .ar-refresh-btn:hover { border-color:var(--cp-accent); color:var(--cp-accent); }

    .ar-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    @media(max-width:700px){ .ar-kpi-row { grid-template-columns:repeat(2,1fr); } }

    .ar-kpi       { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:10px; padding:14px 16px; display:flex; align-items:flex-start; gap:12px; }
    .ar-kpi.amber { border-left:3px solid var(--cp-warning); }
    .ar-kpi.blue  { border-left:3px solid #60a5fa; }
    .ar-kpi.green { border-left:3px solid var(--cp-success); }
    .ar-kpi.red   { border-left:3px solid var(--cp-danger); }
    .ar-kpi-icon  { margin-top:2px; }
    .ar-kpi-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); margin-bottom:4px; }
    .ar-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.25rem; color:var(--cp-text); }
    .ar-kpi-sub   { font-size:10px; color:var(--cp-muted); margin-top:2px; }

    .ar-charts-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    @media(max-width:800px){ .ar-charts-row { grid-template-columns:1fr; } }

    .ar-chart-card  { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
    .ar-chart-head  { padding:13px 18px; border-bottom:1px solid var(--cp-border); background:var(--cp-surface2); display:flex; align-items:center; justify-content:space-between; }
    .ar-chart-title { font-size:11px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:var(--cp-muted); }
    .ar-chart-body  { padding:16px 18px; }
`;