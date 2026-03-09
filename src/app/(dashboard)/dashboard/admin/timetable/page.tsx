"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, X, Edit2, Clock, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

type Day = "mon"|"tue"|"wed"|"thu"|"fri"|"sat";
interface Slot { day:Day; startTime:string; endTime:string; subject:string; teacher?:string; room?:string; }

interface TimetableDoc {
    _id: string;
    student: { _id:string; name:string; studentId:string };
    course: { _id:string; name:string };
    enrollment: { _id:string };
    slots: Slot[];
    validFrom: string; validTo?: string; isActive: boolean;
}

const DAYS: { key:Day; label:string }[] = [
    {key:"mon",label:"Mon"},{key:"tue",label:"Tue"},{key:"wed",label:"Wed"},
    {key:"thu",label:"Thu"},{key:"fri",label:"Fri"},{key:"sat",label:"Sat"},
];

const EMPTY_SLOT: Slot = { day:"mon", startTime:"09:00", endTime:"10:00", subject:"", teacher:"", room:"" };

export default function AdminTimetablePage() {
    const [timetables, setTimetables] = useState<TimetableDoc[]>([]);
    const [students,   setStudents]   = useState<any[]>([]);
    const [expanded,   setExpanded]   = useState<Set<string>>(new Set());
    const [modalOpen,  setModalOpen]  = useState(false);
    const [editDoc,    setEditDoc]    = useState<TimetableDoc|null>(null);
    const [toast,      setToast]      = useState<{msg:string;type:"success"|"error"}|null>(null);
    const [saving,     setSaving]     = useState(false);

    const [form, setForm] = useState({
        studentId:"", enrollmentId:"", courseId:"",
        validFrom: new Date().toISOString().split("T")[0],
        validTo:"",
        slots: [{ ...EMPTY_SLOT }] as Slot[],
    });

    const showToast = (msg:string, type:"success"|"error") => {
        setToast({msg,type}); setTimeout(()=>setToast(null),3000);
    };

    const load = useCallback(async () => {
        const res = await fetchWithAuth("/api/admin/timetable");
        const d   = await res.json();
        setTimetables(d.timetables||[]);
    }, []);

    useEffect(() => {
        load();
        fetchWithAuth("/api/admin/students").then(r=>r.json()).then(setStudents);
    }, [load]);

    const openCreate = () => {
        setEditDoc(null);
        setForm({ studentId:"", enrollmentId:"", courseId:"", validFrom:new Date().toISOString().split("T")[0], validTo:"", slots:[{...EMPTY_SLOT}] });
        setModalOpen(true);
    };

    const openEdit = (doc: TimetableDoc) => {
        setEditDoc(doc);
        setForm({
            studentId: doc.student?._id||"",
            enrollmentId: doc.enrollment?._id||"",
            courseId: doc.course?._id||"",
            validFrom: doc.validFrom?.split("T")[0]||"",
            validTo: doc.validTo?.split("T")[0]||"",
            slots: doc.slots?.length ? doc.slots : [{...EMPTY_SLOT}],
        });
        setModalOpen(true);
    };

    const handleStudentSelect = (sid: string) => {
        const s   = students.find(s=>s._id===sid);
        const enr = s?.enrollments?.[0];
        setForm(f=>({ ...f, studentId:sid, enrollmentId:enr?._id||"", courseId:enr?.course?._id||"" }));
    };

    const addSlot    = () => setForm(f=>({ ...f, slots:[...f.slots, {...EMPTY_SLOT}] }));
    const removeSlot = (i:number) => setForm(f=>({ ...f, slots:f.slots.filter((_,idx)=>idx!==i) }));
    const updateSlot = (i:number, field:keyof Slot, val:string) =>
        setForm(f=>{ const s=[...f.slots]; s[i]={...s[i],[field]:val}; return {...f,slots:s}; });

    const handleSave = async () => {
        if (!form.studentId||!form.enrollmentId) { showToast("Student aur enrollment required","error"); return; }
        if (form.slots.some(s=>!s.subject.trim())) { showToast("Sabhi slots mein subject required hai","error"); return; }
        setSaving(true);
        try {
            if (editDoc) {
                const res = await fetchWithAuth("/api/admin/timetable", {
                    method:"PATCH", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({ timetableId:editDoc._id, slots:form.slots, validTo:form.validTo||undefined }),
                });
                const d = await res.json(); if (!res.ok) throw new Error(d.error||d.message);
            } else {
                const res = await fetchWithAuth("/api/admin/timetable", {
                    method:"POST", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({
                        studentId:    form.studentId,
                        enrollmentId: form.enrollmentId,
                        courseId:     form.courseId,
                        slots:        form.slots,
                        validFrom:    form.validFrom,
                        validTo:      form.validTo||undefined,
                    }),
                });
                const d = await res.json(); if (!res.ok) throw new Error(d.error||d.message);
            }
            showToast(editDoc?"Timetable update ho gaya ✓":"Timetable create ho gaya ✓","success");
            setModalOpen(false);
            load();
        } catch(e:any) { showToast(e.message||"Error","error"); }
        finally { setSaving(false); }
    };

    const toggleExpand = (id:string) => setExpanded(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

    const dayColor: Record<Day,string> = {
        mon:"#f59e0b", tue:"#60a5fa", wed:"#a78bfa",
        thu:"#34d399", fri:"#f87171", sat:"#fb923c"
    };

    return (
        <>
            <style>{atStyles}</style>
            {toast && <div className={`at-toast ${toast.type}`}>{toast.msg}</div>}
            <div className="at-root">

                {/* Header */}
                <div className="at-header">
                    <div>
                        <h1 className="at-title">Timetable</h1>
                        <p className="at-sub">Student-wise class schedules manage karo</p>
                    </div>
                    <button className="at-add-btn" onClick={openCreate}>
                        <Plus size={13}/> Create Timetable
                    </button>
                </div>

                {/* KPI */}
                <div className="at-kpi-row">
                    <div className="at-kpi amber">
                        <div className="at-kpi-label">Total Timetables</div>
                        <div className="at-kpi-val">{timetables.length}</div>
                    </div>
                    <div className="at-kpi green">
                        <div className="at-kpi-label">Active</div>
                        <div className="at-kpi-val">{timetables.filter(t=>t.isActive).length}</div>
                    </div>
                    <div className="at-kpi muted">
                        <div className="at-kpi-label">Avg Slots/Student</div>
                        <div className="at-kpi-val">
                            {timetables.length ? Math.round(timetables.reduce((s,t)=>s+(t.slots?.length||0),0)/timetables.length) : 0}
                        </div>
                    </div>
                </div>

                {/* List */}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {timetables.length===0 ? (
                        <div className="at-empty"><Clock size={24} style={{opacity:.3,marginBottom:8}}/><div>No timetables yet</div></div>
                    ) : timetables.map(tt => {
                        const isOpen = expanded.has(tt._id);
                        const slotsByDay = DAYS.map(d => ({
                            ...d,
                            slots: tt.slots?.filter(s=>s.day===d.key)||[]
                        })).filter(d=>d.slots.length>0);

                        return (
                            <div key={tt._id} className="at-card">
                                <div className="at-card-row" onClick={()=>toggleExpand(tt._id)}>
                                    <div className="at-card-left">
                                        <div className="at-avatar">{tt.student?.name?.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div className="at-name">{tt.student?.name}</div>
                                            <div className="at-meta">{tt.student?.studentId} · {tt.course?.name}</div>
                                        </div>
                                    </div>
                                    <div className="at-card-right">
                                        <div className="at-day-dots">
                                            {DAYS.map(d=>{
                                                const has = tt.slots?.some(s=>s.day===d.key);
                                                return <span key={d.key} className="at-day-dot" style={{ background:has?dayColor[d.key]:"#222", opacity:has?1:.4 }} title={d.label}/>;
                                            })}
                                        </div>
                                        <span className="at-slot-count">{tt.slots?.length||0} slots</span>
                                        <span className={`at-active-badge ${tt.isActive?"on":"off"}`}>
                                            {tt.isActive?"Active":"Inactive"}
                                        </span>
                                        <button className="at-icon-btn amber" onClick={e=>{e.stopPropagation();openEdit(tt);}}>
                                            <Edit2 size={11}/>
                                        </button>
                                        {isOpen ? <ChevronUp size={13} style={{color:"#475569"}}/> : <ChevronDown size={13} style={{color:"#475569"}}/>}
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="at-slots-wrap">
                                        {slotsByDay.map(d => (
                                            <div key={d.key} className="at-day-section">
                                                <div className="at-day-label" style={{color:dayColor[d.key]}}>
                                                    <span className="at-day-dot-lg" style={{background:dayColor[d.key]}}/>
                                                    {d.label}
                                                </div>
                                                {d.slots.map((slot,i) => (
                                                    <div key={i} className="at-slot-row">
                                                        <span className="at-slot-time">{slot.startTime} – {slot.endTime}</span>
                                                        <span className="at-slot-subject">{slot.subject}</span>
                                                        {slot.teacher && <span className="at-slot-meta">{slot.teacher}</span>}
                                                        {slot.room    && <span className="at-slot-meta">Room {slot.room}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        {tt.validFrom && (
                                            <div className="at-validity">
                                                Valid from {new Date(tt.validFrom).toLocaleDateString("en-IN")}
                                                {tt.validTo && ` to ${new Date(tt.validTo).toLocaleDateString("en-IN")}`}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="at-overlay" onClick={e=>e.target===e.currentTarget&&setModalOpen(false)}>
                    <div className="at-modal">
                        <div className="at-modal-head">
                            <span className="at-modal-title">{editDoc?"Edit Timetable":"Create Timetable"}</span>
                            <button className="at-modal-close" onClick={()=>setModalOpen(false)}><X size={13}/></button>
                        </div>
                        <div className="at-modal-body">

                            {!editDoc && (
                                <>
                                    <div className="at-field">
                                        <label className="at-label">Student</label>
                                        <select className="at-select" value={form.studentId} onChange={e=>handleStudentSelect(e.target.value)}>
                                            <option value="">-- Student chunno --</option>
                                            {students.map(s=><option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>)}
                                        </select>
                                    </div>
                                    {form.studentId && (
                                        <div className="at-field">
                                            <label className="at-label">Enrollment / Course</label>
                                            <select className="at-select" value={form.enrollmentId}
                                                onChange={e=>{
                                                    const s=students.find(s=>s._id===form.studentId);
                                                    const enr=s?.enrollments?.find((en:any)=>en._id===e.target.value);
                                                    setForm(f=>({...f,enrollmentId:e.target.value,courseId:enr?.course?._id||""}));
                                                }}>
                                                {students.find(s=>s._id===form.studentId)?.enrollments?.map((e:any)=>(
                                                    <option key={e._id} value={e._id}>{e.course?.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div className="at-form-grid">
                                        <div className="at-field">
                                            <label className="at-label">Valid From</label>
                                            <input className="at-input" type="date" value={form.validFrom} onChange={e=>setForm(f=>({...f,validFrom:e.target.value}))}/>
                                        </div>
                                        <div className="at-field">
                                            <label className="at-label">Valid To (optional)</label>
                                            <input className="at-input" type="date" value={form.validTo} onChange={e=>setForm(f=>({...f,validTo:e.target.value}))}/>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Slots */}
                            <div className="at-slots-section-label">Class Slots</div>
                            <div style={{display:"flex",flexDirection:"column",gap:8}}>
                                {form.slots.map((slot,i) => (
                                    <div key={i} className="at-slot-form">
                                        <div className="at-slot-form-head">
                                            <span className="at-slot-num">Slot {i+1}</span>
                                            {form.slots.length>1 && (
                                                <button className="at-icon-btn danger" onClick={()=>removeSlot(i)}><X size={10}/></button>
                                            )}
                                        </div>
                                        <div className="at-slot-form-grid">
                                            <div className="at-field">
                                                <label className="at-label">Day</label>
                                                <select className="at-select" value={slot.day} onChange={e=>updateSlot(i,"day",e.target.value)}>
                                                    {DAYS.map(d=><option key={d.key} value={d.key}>{d.label}</option>)}
                                                </select>
                                            </div>
                                            <div className="at-field">
                                                <label className="at-label">Start</label>
                                                <input className="at-input" type="time" value={slot.startTime} onChange={e=>updateSlot(i,"startTime",e.target.value)}/>
                                            </div>
                                            <div className="at-field">
                                                <label className="at-label">End</label>
                                                <input className="at-input" type="time" value={slot.endTime} onChange={e=>updateSlot(i,"endTime",e.target.value)}/>
                                            </div>
                                            <div className="at-field">
                                                <label className="at-label">Subject *</label>
                                                <input className="at-input" placeholder="e.g. MS Office" value={slot.subject} onChange={e=>updateSlot(i,"subject",e.target.value)}/>
                                            </div>
                                            <div className="at-field">
                                                <label className="at-label">Teacher</label>
                                                <input className="at-input" placeholder="Optional" value={slot.teacher||""} onChange={e=>updateSlot(i,"teacher",e.target.value)}/>
                                            </div>
                                            <div className="at-field">
                                                <label className="at-label">Room</label>
                                                <input className="at-input" placeholder="Optional" value={slot.room||""} onChange={e=>updateSlot(i,"room",e.target.value)}/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="at-outline-btn" onClick={addSlot}><Plus size={12}/> Add Slot</button>
                            </div>

                            <div className="at-modal-footer">
                                <button className="at-ghost-btn" onClick={()=>setModalOpen(false)}>Cancel</button>
                                <button className="at-amber-btn" onClick={handleSave} disabled={saving}>
                                    {saving?"Saving...":editDoc?"Update":"Create Timetable"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const atStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .at-root  { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:16px; }
    .at-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); }
    .at-toast.success { background:#166534; color:#bbf7d0; border:1px solid rgba(34,197,94,.3); }
    .at-toast.error   { background:#7f1d1d; color:#fecaca; border:1px solid rgba(239,68,68,.3); }

    .at-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .at-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .at-sub    { font-size:12px; color:#475569; margin-top:3px; }
    .at-add-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; transition:opacity .15s; }
    .at-add-btn:hover { opacity:.88; }

    .at-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
    @media(max-width:600px){ .at-kpi-row { grid-template-columns:1fr 1fr; } }
    .at-kpi { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:14px 16px; }
    .at-kpi.amber { border-left:3px solid #f59e0b; }
    .at-kpi.green { border-left:3px solid #22c55e; }
    .at-kpi.muted { border-left:3px solid #475569; }
    .at-kpi-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; margin-bottom:6px; }
    .at-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#f1f5f9; }

    .at-card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .at-card-row { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; gap:12px; flex-wrap:wrap; transition:background .13s; }
    .at-card-row:hover { background:rgba(245,158,11,.03); }
    .at-card-left { display:flex; align-items:center; gap:12px; }
    .at-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.1)); color:#f59e0b; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; flex-shrink:0; }
    .at-name { font-size:13px; font-weight:700; color:#f1f5f9; }
    .at-meta { font-size:11px; color:#475569; margin-top:1px; }
    .at-card-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:flex-end; }

    .at-day-dots { display:flex; gap:4px; }
    .at-day-dot  { width:8px; height:8px; border-radius:50%; }
    .at-slot-count { font-size:11px; color:#64748b; }
    .at-active-badge { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; }
    .at-active-badge.on  { background:rgba(34,197,94,.1); color:#22c55e; border:1px solid rgba(34,197,94,.2); }
    .at-active-badge.off { background:rgba(100,116,139,.1); color:#64748b; border:1px solid rgba(100,116,139,.2); }

    .at-icon-btn { width:26px; height:26px; border-radius:7px; border:1px solid; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; }
    .at-icon-btn.amber  { background:rgba(245,158,11,.08); color:#f59e0b; border-color:rgba(245,158,11,.2); }
    .at-icon-btn.amber:hover { background:rgba(245,158,11,.2); }
    .at-icon-btn.danger { background:rgba(239,68,68,.08); color:#ef4444; border-color:rgba(239,68,68,.2); }
    .at-icon-btn.danger:hover { background:rgba(239,68,68,.2); }

    .at-slots-wrap { border-top:1px solid #222; padding:14px 18px; display:flex; flex-direction:column; gap:10px; }
    .at-day-section {}
    .at-day-label { display:flex; align-items:center; gap:7px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#64748b; margin-bottom:6px; }
    .at-day-dot-lg { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .at-slot-row { display:flex; align-items:center; gap:10px; padding:8px 10px; background:#111; border-radius:8px; flex-wrap:wrap; margin-bottom:4px; }
    .at-slot-time    { font-size:11px; font-weight:700; color:#f59e0b; font-family:monospace; flex-shrink:0; }
    .at-slot-subject { font-size:12px; font-weight:600; color:#f1f5f9; }
    .at-slot-meta    { font-size:11px; color:#475569; }
    .at-validity     { font-size:10px; color:#334155; padding-top:6px; border-top:1px solid #1f1f1f; }

    .at-empty { background:#1a1a1a; border:1px dashed #2a2a2a; border-radius:12px; padding:48px; text-align:center; color:#475569; font-size:13px; display:flex; flex-direction:column; align-items:center; }

    .at-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .at-modal   { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:14px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.6); scrollbar-width:thin; scrollbar-color:#333 transparent; animation:atIn .18s ease; }
    @keyframes atIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .at-modal-head   { display:flex; align-items:center; justify-content:space-between; padding:15px 18px; border-bottom:1px solid #2a2a2a; position:sticky; top:0; background:#1a1a1a; z-index:2; }
    .at-modal-title  { font-family:'DM Serif Display',serif; font-size:1.05rem; color:#f1f5f9; }
    .at-modal-close  { width:26px; height:26px; border-radius:7px; border:1px solid #2a2a2a; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#64748b; }
    .at-modal-close:hover { background:#222; color:#f1f5f9; }
    .at-modal-body   { padding:18px; display:flex; flex-direction:column; gap:12px; }
    .at-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding-top:4px; }

    .at-slots-section-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:#334155; border-bottom:1px solid #222; padding-bottom:6px; }
    .at-slot-form      { background:#111; border:1px solid #1f1f1f; border-radius:9px; padding:12px; }
    .at-slot-form-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
    .at-slot-num       { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; }
    .at-slot-form-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
    @media(max-width:500px){ .at-slot-form-grid { grid-template-columns:1fr 1fr; } }

    .at-field  { display:flex; flex-direction:column; gap:5px; }
    .at-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }
    .at-input, .at-select { font-family:'Plus Jakarta Sans',sans-serif; padding:8px 11px; font-size:12px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:7px; color:#f1f5f9; outline:none; transition:border-color .15s; width:100%; }
    .at-input:focus,.at-select:focus { border-color:#f59e0b; }
    .at-input::placeholder { color:#334155; }
    .at-select option { background:#1a1a1a; }
    .at-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

    .at-outline-btn { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; padding:9px; border-radius:8px; border:1px dashed #2a2a2a; background:transparent; color:#64748b; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .at-outline-btn:hover { border-color:#f59e0b; color:#f59e0b; background:rgba(245,158,11,.04); }
    .at-amber-btn { padding:9px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; }
    .at-amber-btn:disabled { opacity:.5; cursor:not-allowed; }
    .at-ghost-btn { padding:9px 16px; border-radius:8px; border:1px solid #2a2a2a; background:transparent; color:#64748b; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
`;