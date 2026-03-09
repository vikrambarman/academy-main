"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Search, Plus, X, ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, XCircle, Clock, Coffee } from "lucide-react";

type AttStatus = "present"|"absent"|"late"|"holiday";

interface AttRecord { date: string; status: AttStatus; remark?: string; }
interface AttDoc {
    _id: string;
    student: { name:string; studentId:string };
    enrollment: { _id:string };
    course: { name:string };
    records: AttRecord[];
    stats: { total:number; present:number; absent:number; late:number; holiday:number; percentage:number; };
}

const STATUS_META: Record<AttStatus,{label:string;color:string;bg:string;icon:any}> = {
    present: { label:"Present", color:"#22c55e", bg:"rgba(34,197,94,.1)",  icon:CheckCircle2 },
    absent:  { label:"Absent",  color:"#ef4444", bg:"rgba(239,68,68,.1)",  icon:XCircle      },
    late:    { label:"Late",    color:"#f59e0b", bg:"rgba(245,158,11,.1)", icon:Clock        },
    holiday: { label:"Holiday", color:"#60a5fa", bg:"rgba(96,165,250,.1)", icon:Coffee       },
};

export default function AdminAttendancePage() {
    const [attendance,   setAttendance]   = useState<AttDoc[]>([]);
    const [students,     setStudents]     = useState<any[]>([]);
    const [courses,      setCourses]      = useState<any[]>([]);
    const [search,       setSearch]       = useState("");
    const [page,         setPage]         = useState(1);
    const [expanded,     setExpanded]     = useState<Set<string>>(new Set());
    const [modalOpen,    setModalOpen]    = useState(false);
    const [toast,        setToast]        = useState<{msg:string;type:"success"|"error"}|null>(null);
    const [saving,       setSaving]       = useState(false);
    const LIMIT = 15;

    // Bulk add form
    const [bulkForm, setBulkForm] = useState({
        enrollmentId: "", studentId: "", courseId: "",
        date: new Date().toISOString().split("T")[0],
        status: "present" as AttStatus, remark: ""
    });

    const showToast = (msg:string, type:"success"|"error") => {
        setToast({msg,type}); setTimeout(()=>setToast(null),3000);
    };

    const load = useCallback(async () => {
        try {
            const res = await fetchWithAuth("/api/admin/attendance");
            const d   = await res.json();
            setAttendance(d.attendance || []);
        } catch { showToast("Load failed","error"); }
    }, []);

    useEffect(() => {
        load();
        fetchWithAuth("/api/admin/students").then(r=>r.json()).then(setStudents);
        fetchWithAuth("/api/admin/courses").then(r=>r.json()).then(d=>setCourses(Array.isArray(d)?d:[]));
    }, [load]);

    // When student selected — auto populate enrollmentId from first enrollment
    const handleStudentSelect = (studentId: string) => {
        const s = students.find(s=>s._id===studentId);
        const enr = s?.enrollments?.[0];
        setBulkForm(f => ({
            ...f, studentId,
            enrollmentId: enr?._id||"",
            courseId: enr?.course?._id||""
        }));
    };

    const handleSaveAttendance = async () => {
        if (!bulkForm.enrollmentId||!bulkForm.studentId||!bulkForm.courseId) {
            showToast("Student aur enrollment select karo","error"); return;
        }
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/admin/attendance", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                    enrollmentId: bulkForm.enrollmentId,
                    studentId:    bulkForm.studentId,
                    courseId:     bulkForm.courseId,
                    records: [{ date:bulkForm.date, status:bulkForm.status, remark:bulkForm.remark }]
                }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error||d.message);
            showToast("Attendance save ho gaya ✓","success");
            setModalOpen(false);
            load();
        } catch(e:any) { showToast(e.message||"Error","error"); }
        finally { setSaving(false); }
    };

    const patchRecord = async (enrollmentId:string, date:string, status:AttStatus) => {
        try {
            await fetchWithAuth("/api/admin/attendance", {
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ enrollmentId, date, status }),
            });
            load();
        } catch { showToast("Update failed","error"); }
    };

    const toggleExpand = (id:string) => setExpanded(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

    const filtered   = attendance.filter(a =>
        a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.student?.studentId?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length/LIMIT)||1;
    const paginated  = filtered.slice((page-1)*LIMIT, page*LIMIT);

    // Summary
    const avgPct = attendance.length > 0
        ? Math.round(attendance.reduce((s,a)=>s+(a.stats?.percentage||0),0)/attendance.length)
        : 0;
    const below75 = attendance.filter(a=>(a.stats?.percentage||0)<75).length;

    return (
        <>
            <style>{aaStyles}</style>
            {toast && <div className={`aa-toast ${toast.type}`}>{toast.msg}</div>}
            <div className="aa-root">

                {/* Header */}
                <div className="aa-header">
                    <div>
                        <h1 className="aa-title">Attendance</h1>
                        <p className="aa-sub">Student-wise attendance records manage karo</p>
                    </div>
                    <button className="aa-add-btn" onClick={()=>setModalOpen(true)}>
                        <Plus size={13}/> Add Record
                    </button>
                </div>

                {/* KPIs */}
                <div className="aa-kpi-row">
                    <div className="aa-kpi amber">
                        <div className="aa-kpi-label">Total Students</div>
                        <div className="aa-kpi-val">{attendance.length}</div>
                    </div>
                    <div className="aa-kpi green">
                        <div className="aa-kpi-label">Avg Attendance</div>
                        <div className="aa-kpi-val">{avgPct}%</div>
                    </div>
                    <div className="aa-kpi red">
                        <div className="aa-kpi-label">Below 75%</div>
                        <div className="aa-kpi-val">{below75}</div>
                    </div>
                </div>

                {/* Search */}
                <div className="aa-search-wrap">
                    <Search size={13} className="aa-search-icon"/>
                    <input className="aa-search" placeholder="Search by name or ID..."
                        value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
                </div>

                {/* Records */}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {paginated.length===0 ? (
                        <div className="aa-empty"><CalendarDays size={24} style={{opacity:.3,marginBottom:8}}/><div>No attendance records</div></div>
                    ) : paginated.map(att => {
                        const pct    = att.stats?.percentage || 0;
                        const isOpen = expanded.has(att._id);
                        const color  = pct>=75?"#22c55e":pct>=50?"#f59e0b":"#ef4444";

                        return (
                            <div key={att._id} className="aa-card">
                                <div className="aa-card-row" onClick={()=>toggleExpand(att._id)}>
                                    <div className="aa-card-left">
                                        <div className="aa-avatar" style={{background:`linear-gradient(135deg,${color}33,${color}22)`,color}}>
                                            {att.student?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="aa-name">{att.student?.name}</div>
                                            <div className="aa-meta">{att.student?.studentId} · {att.course?.name}</div>
                                        </div>
                                    </div>
                                    <div className="aa-card-right">
                                        <div className="aa-stat-chips">
                                            {(["present","absent","late","holiday"] as AttStatus[]).map(s => (
                                                <span key={s} className="aa-chip" style={{color:STATUS_META[s].color,background:STATUS_META[s].bg}}>
                                                    {att.stats?.[s]||0} {s}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="aa-pct-wrap">
                                            <div className="aa-pct-bar">
                                                <div className="aa-pct-fill" style={{width:`${pct}%`,background:color}}/>
                                            </div>
                                            <span className="aa-pct-val" style={{color}}>{pct}%</span>
                                        </div>
                                        {isOpen ? <ChevronLeft size={13} style={{color:"#475569",transform:"rotate(90deg)"}}/> : <ChevronLeft size={13} style={{color:"#475569",transform:"rotate(-90deg)"}}/>}
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="aa-records-wrap">
                                        <div className="aa-records-head">
                                            <span>Date</span><span>Status</span><span>Remark</span><span>Change</span>
                                        </div>
                                        {att.records?.slice().reverse().map((rec,i) => {
                                            const sm = STATUS_META[rec.status];
                                            const Icon = sm?.icon;
                                            return (
                                                <div key={i} className="aa-record-row">
                                                    <span className="aa-rec-date">
                                                        {new Date(rec.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                                                    </span>
                                                    <span className="aa-rec-status" style={{color:sm?.color,background:sm?.bg}}>
                                                        {Icon && <Icon size={10}/>} {sm?.label}
                                                    </span>
                                                    <span className="aa-rec-remark">{rec.remark||"—"}</span>
                                                    <select className="aa-mini-select"
                                                        value={rec.status}
                                                        onChange={e=>patchRecord(att.enrollment?._id, rec.date, e.target.value as AttStatus)}>
                                                        {(["present","absent","late","holiday"] as AttStatus[]).map(s=>(
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {totalPages>1 && (
                    <div className="aa-pag">
                        <button className="aa-pag-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                            <ChevronLeft size={13}/> Prev
                        </button>
                        <span className="aa-pag-info">Page {page} of {totalPages}</span>
                        <button className="aa-pag-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>
                            Next <ChevronRight size={13}/>
                        </button>
                    </div>
                )}
            </div>

            {/* Add Record Modal */}
            {modalOpen && (
                <div className="aa-overlay" onClick={e=>e.target===e.currentTarget&&setModalOpen(false)}>
                    <div className="aa-modal">
                        <div className="aa-modal-head">
                            <span className="aa-modal-title">Add Attendance Record</span>
                            <button className="aa-modal-close" onClick={()=>setModalOpen(false)}><X size={13}/></button>
                        </div>
                        <div className="aa-modal-body">
                            <div className="aa-field">
                                <label className="aa-label">Student</label>
                                <select className="aa-select" value={bulkForm.studentId} onChange={e=>handleStudentSelect(e.target.value)}>
                                    <option value="">-- Student chunno --</option>
                                    {students.map(s=><option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>)}
                                </select>
                            </div>
                            {bulkForm.studentId && (
                                <div className="aa-field">
                                    <label className="aa-label">Enrollment / Course</label>
                                    <select className="aa-select" value={bulkForm.enrollmentId}
                                        onChange={e=>{
                                            const s=students.find(s=>s._id===bulkForm.studentId);
                                            const enr=s?.enrollments?.find((en:any)=>en._id===e.target.value);
                                            setBulkForm(f=>({...f,enrollmentId:e.target.value,courseId:enr?.course?._id||""}));
                                        }}>
                                        {students.find(s=>s._id===bulkForm.studentId)?.enrollments?.map((e:any)=>(
                                            <option key={e._id} value={e._id}>{e.course?.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="aa-form-grid">
                                <div className="aa-field">
                                    <label className="aa-label">Date</label>
                                    <input className="aa-input" type="date" value={bulkForm.date}
                                        onChange={e=>setBulkForm(f=>({...f,date:e.target.value}))}/>
                                </div>
                                <div className="aa-field">
                                    <label className="aa-label">Status</label>
                                    <select className="aa-select" value={bulkForm.status}
                                        onChange={e=>setBulkForm(f=>({...f,status:e.target.value as AttStatus}))}>
                                        {(["present","absent","late","holiday"] as AttStatus[]).map(s=>(
                                            <option key={s} value={s}>{STATUS_META[s].label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="aa-field">
                                <label className="aa-label">Remark (optional)</label>
                                <input className="aa-input" placeholder="e.g. Medical leave"
                                    value={bulkForm.remark} onChange={e=>setBulkForm(f=>({...f,remark:e.target.value}))}/>
                            </div>
                            <div className="aa-modal-footer">
                                <button className="aa-ghost-btn" onClick={()=>setModalOpen(false)}>Cancel</button>
                                <button className="aa-amber-btn" onClick={handleSaveAttendance} disabled={saving}>
                                    {saving?"Saving...":"Save Record"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const aaStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .aa-root  { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:16px; }
    .aa-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); }
    .aa-toast.success { background:#166534; color:#bbf7d0; border:1px solid rgba(34,197,94,.3); }
    .aa-toast.error   { background:#7f1d1d; color:#fecaca; border:1px solid rgba(239,68,68,.3); }

    .aa-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .aa-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .aa-sub    { font-size:12px; color:#475569; margin-top:3px; }
    .aa-add-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; transition:opacity .15s; }
    .aa-add-btn:hover { opacity:.88; }

    .aa-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
    @media(max-width:600px){ .aa-kpi-row { grid-template-columns:1fr 1fr; } }
    .aa-kpi { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:14px 16px; }
    .aa-kpi.amber { border-left:3px solid #f59e0b; }
    .aa-kpi.green { border-left:3px solid #22c55e; }
    .aa-kpi.red   { border-left:3px solid #ef4444; }
    .aa-kpi-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; margin-bottom:6px; }
    .aa-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#f1f5f9; }

    .aa-search-wrap { position:relative; max-width:320px; }
    .aa-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#475569; pointer-events:none; }
    .aa-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:9px; color:#f1f5f9; font-size:13px; outline:none; transition:border-color .15s; }
    .aa-search:focus { border-color:#f59e0b; }
    .aa-search::placeholder { color:#475569; }

    .aa-card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .aa-card-row { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; gap:12px; flex-wrap:wrap; transition:background .13s; }
    .aa-card-row:hover { background:rgba(245,158,11,.03); }
    .aa-card-left { display:flex; align-items:center; gap:12px; }
    .aa-avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; flex-shrink:0; }
    .aa-name { font-size:13px; font-weight:700; color:#f1f5f9; }
    .aa-meta { font-size:11px; color:#475569; margin-top:1px; }
    .aa-card-right { display:flex; align-items:center; gap:12px; flex-wrap:wrap; justify-content:flex-end; }
    .aa-stat-chips { display:flex; gap:5px; flex-wrap:wrap; }
    .aa-chip { font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px; }
    .aa-pct-wrap { display:flex; align-items:center; gap:6px; }
    .aa-pct-bar  { width:60px; height:4px; background:#222; border-radius:100px; overflow:hidden; }
    .aa-pct-fill { height:100%; border-radius:100px; transition:width .4s; }
    .aa-pct-val  { font-size:11px; font-weight:700; }

    .aa-records-wrap { border-top:1px solid #222; }
    .aa-records-head { display:grid; grid-template-columns:1fr 1fr 1fr 80px; gap:8px; padding:9px 18px; background:#1f1f1f; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#334155; }
    .aa-record-row { display:grid; grid-template-columns:1fr 1fr 1fr 80px; gap:8px; padding:10px 18px; border-top:1px solid #1a1a1a; align-items:center; transition:background .12s; }
    .aa-record-row:hover { background:rgba(245,158,11,.02); }
    .aa-rec-date   { font-size:11px; color:#64748b; }
    .aa-rec-status { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; }
    .aa-rec-remark { font-size:11px; color:#475569; }
    .aa-mini-select { font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:600; padding:3px 7px; background:#111; border:1px solid #2a2a2a; border-radius:6px; color:#94a3b8; outline:none; cursor:pointer; }
    .aa-mini-select:focus { border-color:#f59e0b; }

    .aa-empty { background:#1a1a1a; border:1px dashed #2a2a2a; border-radius:12px; padding:48px; text-align:center; color:#475569; font-size:13px; display:flex; flex-direction:column; align-items:center; }

    .aa-pag     { display:flex; align-items:center; justify-content:center; gap:10px; }
    .aa-pag-btn { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .aa-pag-btn:hover:not(:disabled) { border-color:#f59e0b; color:#f59e0b; }
    .aa-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
    .aa-pag-info { font-size:12px; color:#475569; }

    .aa-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .aa-modal   { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:14px; width:100%; max-width:480px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.6); animation:aaIn .18s ease; }
    @keyframes aaIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .aa-modal-head   { display:flex; align-items:center; justify-content:space-between; padding:15px 18px; border-bottom:1px solid #2a2a2a; position:sticky; top:0; background:#1a1a1a; }
    .aa-modal-title  { font-family:'DM Serif Display',serif; font-size:1.05rem; color:#f1f5f9; }
    .aa-modal-close  { width:26px; height:26px; border-radius:7px; border:1px solid #2a2a2a; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#64748b; }
    .aa-modal-close:hover { background:#222; color:#f1f5f9; }
    .aa-modal-body   { padding:18px; display:flex; flex-direction:column; gap:12px; }
    .aa-modal-footer { display:flex; justify-content:flex-end; gap:8px; }
    .aa-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .aa-field  { display:flex; flex-direction:column; gap:5px; }
    .aa-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }
    .aa-input, .aa-select { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px; background:#111; border:1px solid #2a2a2a; border-radius:8px; color:#f1f5f9; outline:none; transition:border-color .15s; width:100%; }
    .aa-input:focus,.aa-select:focus { border-color:#f59e0b; }
    .aa-input::placeholder { color:#334155; }
    .aa-select option { background:#1a1a1a; }
    .aa-amber-btn { padding:9px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; }
    .aa-amber-btn:disabled { opacity:.5; cursor:not-allowed; }
    .aa-ghost-btn { padding:9px 16px; border-radius:8px; border:1px solid #2a2a2a; background:transparent; color:#64748b; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
`;