"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Users, BookOpen, IndianRupee, Download, RefreshCw } from "lucide-react";

interface Analytics {
    totalStudents: number; totalCourses: number;
    totalRevenue: number; totalPending: number;
    enrollmentsByMonth: { month:string; count:number }[];
    revenueByMonth:     { month:string; revenue:number; pending:number }[];
    courseWiseStudents: { course:string; count:number }[];
    attendanceSummary:  { name:string; percentage:number }[];
    feeCollectionRate:  number;
    newStudentsThisMonth: number;
}

const COLORS = ["#f59e0b","#22c55e","#60a5fa","#a78bfa","#f87171","#34d399","#fb923c","#e879f9"];

const CpTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background:"#1f1f1f", border:"1px solid #333", borderRadius:8, padding:"8px 12px", fontSize:11, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            {label && <div style={{ color:"#64748b", marginBottom:4, fontWeight:700 }}>{label}</div>}
            {payload.map((p: any, i: number) => (
                <div key={i} style={{ color:p.color||"#f1f5f9", display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:p.color, display:"inline-block" }}/>
                    <span style={{ color:"#94a3b8" }}>{p.name}:</span>
                    <span style={{ fontWeight:700 }}>
                        {p.name?.toLowerCase().includes("revenue")||p.name?.toLowerCase().includes("pending")
                            ? `₹${Number(p.value).toLocaleString("en-IN")}` : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function AdminReportsPage() {
    const [data,     setData]     = useState<Analytics|null>(null);
    const [loading,  setLoading]  = useState(true);
    const [toast,    setToast]    = useState<string|null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth("/api/admin/analytics");
            setData(await res.json());
        } catch { setToast("Load failed"); setTimeout(()=>setToast(null),3000); }
        finally { setLoading(false); }
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
                        <div className="ar-kpi-icon"><Users size={16} style={{color:"#f59e0b"}}/></div>
                        <div>
                            <div className="ar-kpi-label">Total Students</div>
                            <div className="ar-kpi-val">{data?.totalStudents||0}</div>
                            <div className="ar-kpi-sub">+{data?.newStudentsThisMonth||0} this month</div>
                        </div>
                    </div>
                    <div className="ar-kpi blue">
                        <div className="ar-kpi-icon"><BookOpen size={16} style={{color:"#60a5fa"}}/></div>
                        <div>
                            <div className="ar-kpi-label">Active Courses</div>
                            <div className="ar-kpi-val">{data?.totalCourses||0}</div>
                        </div>
                    </div>
                    <div className="ar-kpi green">
                        <div className="ar-kpi-icon"><IndianRupee size={16} style={{color:"#22c55e"}}/></div>
                        <div>
                            <div className="ar-kpi-label">Total Revenue</div>
                            <div className="ar-kpi-val">{fmt(data?.totalRevenue||0)}</div>
                            <div className="ar-kpi-sub" style={{color:"#22c55e"}}>{data?.feeCollectionRate||0}% collected</div>
                        </div>
                    </div>
                    <div className="ar-kpi red">
                        <div className="ar-kpi-icon"><TrendingUp size={16} style={{color:"#ef4444"}}/></div>
                        <div>
                            <div className="ar-kpi-label">Pending Fees</div>
                            <div className="ar-kpi-val">{fmt(data?.totalPending||0)}</div>
                        </div>
                    </div>
                </div>

                {/* Row 1: Revenue chart + Enrollment chart */}
                <div className="ar-charts-row">

                    {/* Revenue vs Pending — line chart */}
                    <div className="ar-chart-card wide">
                        <div className="ar-chart-head">
                            <span className="ar-chart-title">Monthly Revenue</span>
                        </div>
                        <div className="ar-chart-body">
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={data?.revenueByMonth||[]} margin={{top:5,right:10,left:0,bottom:0}}>
                                    <XAxis dataKey="month" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                                    <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}
                                        tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                                    <Tooltip content={<CpTooltip/>}/>
                                    <Legend wrapperStyle={{fontSize:11,color:"#64748b"}}/>
                                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={2} dot={false}/>
                                    <Line type="monotone" dataKey="pending" name="Pending" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 2"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Enrollments by month — bar chart */}
                    <div className="ar-chart-card">
                        <div className="ar-chart-head">
                            <span className="ar-chart-title">Enrollments / Month</span>
                        </div>
                        <div className="ar-chart-body">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={data?.enrollmentsByMonth||[]} margin={{top:5,right:10,left:0,bottom:0}}>
                                    <XAxis dataKey="month" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                                    <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
                                    <Tooltip content={<CpTooltip/>}/>
                                    <Bar dataKey="count" name="Enrollments" fill="#f59e0b" radius={[4,4,0,0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Row 2: Course-wise pie + Attendance table */}
                <div className="ar-charts-row">

                    {/* Course-wise students pie */}
                    <div className="ar-chart-card">
                        <div className="ar-chart-head">
                            <span className="ar-chart-title">Students by Course</span>
                        </div>
                        <div className="ar-chart-body" style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                            <ResponsiveContainer width={180} height={180}>
                                <PieChart>
                                    <Pie data={data?.courseWiseStudents||[]} dataKey="count" nameKey="course"
                                        cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                                        {data?.courseWiseStudents?.map((_,i)=>(
                                            <Cell key={i} fill={COLORS[i%COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CpTooltip/>}/>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{flex:1,minWidth:120,display:"flex",flexDirection:"column",gap:6}}>
                                {data?.courseWiseStudents?.map((c,i)=>(
                                    <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
                                        <span style={{width:9,height:9,borderRadius:"50%",background:COLORS[i%COLORS.length],flexShrink:0}}/>
                                        <span style={{fontSize:11,color:"#94a3b8",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.course}</span>
                                        <span style={{fontSize:11,fontWeight:700,color:"#f1f5f9"}}>{c.count}</span>
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
                            {(!data?.attendanceSummary?.length) ? (
                                <div style={{color:"#334155",fontSize:12,padding:"20px 0",textAlign:"center"}}>No attendance data</div>
                            ) : (
                                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                                    {data.attendanceSummary.slice(0,10).map((s,i)=>{
                                        const pct   = s.percentage||0;
                                        const color = pct>=75?"#22c55e":pct>=50?"#f59e0b":"#ef4444";
                                        return (
                                            <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                                                <span style={{fontSize:11,color:"#64748b",width:130,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
                                                <div style={{flex:1,height:5,background:"#222",borderRadius:100,overflow:"hidden"}}>
                                                    <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:100,transition:"width .4s"}}/>
                                                </div>
                                                <span style={{fontSize:11,fontWeight:700,color,width:36,textAlign:"right"}}>{pct}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fee collection rate */}
                <div className="ar-chart-card" style={{maxWidth:"100%"}}>
                    <div className="ar-chart-head">
                        <span className="ar-chart-title">Fee Collection Rate</span>
                    </div>
                    <div className="ar-chart-body">
                        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                            <div style={{position:"relative",width:120,height:120,flexShrink:0}}>
                                <svg viewBox="0 0 36 36" style={{width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#222" strokeWidth="3"/>
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3"
                                        strokeDasharray={`${(data?.feeCollectionRate||0)} 100`}
                                        strokeLinecap="round"/>
                                </svg>
                                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                                    <span style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.4rem",color:"#22c55e"}}>{data?.feeCollectionRate||0}%</span>
                                </div>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:10}}>
                                <div>
                                    <div style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Collected</div>
                                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.2rem",color:"#22c55e"}}>{fmt(data?.totalRevenue||0)}</div>
                                </div>
                                <div>
                                    <div style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Pending</div>
                                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.2rem",color:"#ef4444"}}>{fmt(data?.totalPending||0)}</div>
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
    .ar-root    { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:16px; }
    .ar-loading { display:flex; align-items:center; gap:12px; padding:60px; color:#475569; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; justify-content:center; }
    .ar-spinner { width:20px; height:20px; border:2px solid #2a2a2a; border-top-color:#f59e0b; border-radius:50%; animation:arSpin .7s linear infinite; }
    @keyframes arSpin { to{transform:rotate(360deg)} }
    .ar-toast   { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; background:#7f1d1d; color:#fecaca; border:1px solid rgba(239,68,68,.3); }

    .ar-header  { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .ar-title   { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .ar-sub     { font-size:12px; color:#475569; margin-top:3px; }
    .ar-refresh-btn { display:inline-flex; align-items:center; gap:7px; padding:8px 16px; border-radius:9px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .ar-refresh-btn:hover { border-color:#f59e0b; color:#f59e0b; }

    .ar-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    @media(max-width:700px){ .ar-kpi-row { grid-template-columns:repeat(2,1fr); } }
    .ar-kpi { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:14px 16px; display:flex; align-items:flex-start; gap:12px; }
    .ar-kpi.amber { border-left:3px solid #f59e0b; }
    .ar-kpi.blue  { border-left:3px solid #60a5fa; }
    .ar-kpi.green { border-left:3px solid #22c55e; }
    .ar-kpi.red   { border-left:3px solid #ef4444; }
    .ar-kpi-icon  { margin-top:2px; }
    .ar-kpi-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; margin-bottom:4px; }
    .ar-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.25rem; color:#f1f5f9; }
    .ar-kpi-sub   { font-size:10px; color:#64748b; margin-top:2px; }

    .ar-charts-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    @media(max-width:800px){ .ar-charts-row { grid-template-columns:1fr; } }

    .ar-chart-card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .ar-chart-card.wide { grid-column: span 1; }
    .ar-chart-head { padding:13px 18px; border-bottom:1px solid #222; background:#1f1f1f; display:flex; align-items:center; justify-content:space-between; }
    .ar-chart-title { font-size:11px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:#64748b; }
    .ar-chart-body  { padding:16px 18px; }
`;