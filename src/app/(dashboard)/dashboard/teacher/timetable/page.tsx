// src/app/dashboard/teacher/timetable/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, Trash2, Save, ChevronDown, Clock, BookOpen, User, MapPin, AlertCircle, CheckCircle, Users, UserCheck } from "lucide-react";

type WeekDay = "monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday";
type Mode = "single"|"bulk";

interface Slot { day: WeekDay; startTime: string; endTime: string; subject: string; teacher: string; room: string; }
interface Course { _id: string; name: string; }
interface Enrollment { _id: string; student: { _id: string; name: string; studentId: string }; }
interface Timetable { _id: string; slots: Slot[]; validFrom: string; validTo?: string; isActive: boolean; }

const DAYS: { key: WeekDay; short: string; label: string }[] = [
    { key:"monday",    short:"Mon", label:"Monday"    },
    { key:"tuesday",   short:"Tue", label:"Tuesday"   },
    { key:"wednesday", short:"Wed", label:"Wednesday" },
    { key:"thursday",  short:"Thu", label:"Thursday"  },
    { key:"friday",    short:"Fri", label:"Friday"    },
    { key:"saturday",  short:"Sat", label:"Saturday"  },
];

const EMPTY_SLOT = (): Slot => ({ day: "monday", startTime: "09:00", endTime: "10:00", subject: "", teacher: "", room: "" });

const DAY_COLORS: Record<WeekDay, { bg: string; border: string; text: string; pill: string }> = {
    monday:    { bg:"rgba(20,184,166,.08)",   border:"rgba(20,184,166,.3)",   text:"#14b8a6", pill:"#14b8a6" },
    tuesday:   { bg:"rgba(34,197,94,.08)",    border:"rgba(34,197,94,.3)",    text:"#22c55e", pill:"#22c55e" },
    wednesday: { bg:"rgba(99,102,241,.08)",   border:"rgba(99,102,241,.3)",   text:"#818cf8", pill:"#818cf8" },
    thursday:  { bg:"rgba(168,85,247,.08)",   border:"rgba(168,85,247,.3)",   text:"#c084fc", pill:"#c084fc" },
    friday:    { bg:"rgba(249,115,22,.08)",   border:"rgba(249,115,22,.3)",   text:"#fb923c", pill:"#fb923c" },
    saturday:  { bg:"rgba(244,63,94,.08)",    border:"rgba(244,63,94,.3)",    text:"#fb7185", pill:"#fb7185" },
};

export default function TeacherTimetablePage() {
    const [mode,             setMode]             = useState<Mode>("single");
    const [courses,          setCourses]          = useState<Course[]>([]);
    const [enrollments,      setEnrollments]      = useState<Enrollment[]>([]);
    const [courseId,         setCourseId]         = useState("");
    const [enrollmentId,     setEnrollmentId]     = useState("");
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [existing,         setExisting]         = useState<Timetable | null>(null);
    const [slots,            setSlots]            = useState<Slot[]>([EMPTY_SLOT()]);
    const [validFrom,        setValidFrom]        = useState(new Date().toISOString().slice(0, 10));
    const [validTo,          setValidTo]          = useState("");
    const [loading,          setLoading]          = useState(false);
    const [toast,            setToast]            = useState<{ type:"success"|"error"; msg:string }|null>(null);
    const [activeDay,        setActiveDay]        = useState<WeekDay|"all">("all");

    const showToast = (type: "success"|"error", msg: string) => {
        setToast({ type, msg }); setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        fetchWithAuth("/api/teacher/courses").then(r => r.json()).then(d => setCourses(d.courses || [])).catch(() => {});
    }, []);

    useEffect(() => {
        if (!courseId) { setEnrollments([]); setEnrollmentId(""); setSelectedStudents(new Set()); return; }
        fetchWithAuth(`/api/admin/enrollments?courseId=${courseId}`).then(r => r.json()).then(d => setEnrollments(d.enrollments || [])).catch(() => {});
    }, [courseId]);

    useEffect(() => {
        if (mode !== "single" || !enrollmentId) { setExisting(null); setSlots([EMPTY_SLOT()]); return; }
        fetchWithAuth(`/api/teacher/timetable?enrollmentId=${enrollmentId}`)
            .then(r => r.json())
            .then(d => {
                const tt = (d.timetables || [])[0] ?? null;
                setExisting(tt);
                if (tt?.slots?.length) { setSlots(tt.slots); if (tt.validFrom) setValidFrom(tt.validFrom.slice(0,10)); if (tt.validTo) setValidTo(tt.validTo.slice(0,10)); }
                else setSlots([EMPTY_SLOT()]);
            }).catch(() => {});
    }, [enrollmentId, mode]);

    const switchMode = (m: Mode) => { setMode(m); setEnrollmentId(""); setSelectedStudents(new Set()); setExisting(null); setSlots([EMPTY_SLOT()]); };
    const addSlot    = () => setSlots(s => [...s, EMPTY_SLOT()]);
    const removeSlot = (i: number) => setSlots(s => s.filter((_, idx) => idx !== i));
    const updateSlot = (i: number, field: keyof Slot, val: string) =>
        setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [field]: val } : sl));

    const toggleStudent = (id: string) => setSelectedStudents(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const toggleAll     = () => setSelectedStudents(selectedStudents.size === enrollments.length ? new Set() : new Set(enrollments.map(e => e._id)));

    const handleSave = async () => {
        if (!courseId) return showToast("error", "Course select karo");
        if (slots.some(s => !s.subject || !s.startTime || !s.endTime)) return showToast("error", "Saare slots complete karo");
        const selectedCourse = courses.find(c => c._id === courseId);

        if (mode === "bulk") {
            if (selectedStudents.size === 0) return showToast("error", "Ek student select karo");
            const students = enrollments.filter(e => selectedStudents.has(e._id)).map(e => ({ enrollmentId: e._id, studentId: e.student._id }));
            setLoading(true);
            try {
                const res = await fetchWithAuth("/api/teacher/timetable", { method:"POST", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({ courseId, bulk:true, students, slots, validFrom, validTo: validTo||undefined, courseName: selectedCourse?.name ?? "" }) });
                const d = await res.json();
                if (!res.ok) throw new Error(d.message);
                showToast("success", d.message);
            } catch (e: any) { showToast("error", e.message || "Error"); }
            finally { setLoading(false); }
            return;
        }

        const sel = enrollments.find(e => e._id === enrollmentId);
        if (!enrollmentId || !sel) return showToast("error", "Student select karo");
        setLoading(true);
        try {
            let res;
            if (existing) {
                res = await fetchWithAuth("/api/teacher/timetable", { method:"PATCH", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({ timetableId: existing._id, slots, validTo: validTo||undefined }) });
            } else {
                res = await fetchWithAuth("/api/teacher/timetable", { method:"POST", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({ courseId, enrollmentId, studentId: sel.student._id, slots, validFrom, validTo: validTo||undefined, courseName: selectedCourse?.name ?? "" }) });
            }
            const d = await res.json();
            if (!res.ok) throw new Error(d.message);
            showToast("success", existing ? "Updated!" : "Created!");
            setExisting(d.timetable ?? existing);
        } catch (e: any) { showToast("error", e.message || "Error"); }
        finally { setLoading(false); }
    };

    const filteredSlots   = slots.map((s,i) => ({...s,_idx:i})).filter(s => activeDay==="all" || s.day===activeDay);
    const slotsByDay      = DAYS.map(d => ({ ...d, count: slots.filter(s => s.day===d.key).length }));
    const showSlotBuilder = mode==="bulk" ? courseId && selectedStudents.size>0 : !!enrollmentId;

    return (
        <>
            <style>{css}</style>
            <div className="tt-root">

                {toast && (
                    <div className={`tt-toast tt-toast--${toast.type}`}>
                        {toast.type==="success" ? <CheckCircle size={14}/> : <AlertCircle size={14}/>} {toast.msg}
                    </div>
                )}

                <div className="tt-header">
                    <div>
                        <h1 className="tt-title">Timetable</h1>
                        <p className="tt-sub">Student-wise ya course-wise schedule manage karo</p>
                    </div>
                    {showSlotBuilder && (
                        <button className="tt-save-btn" onClick={handleSave} disabled={loading}>
                            <Save size={13}/> {loading?"Saving...":existing?"Update":"Create"} Timetable
                        </button>
                    )}
                </div>

                {/* Mode toggle */}
                <div className="tt-mode-toggle">
                    <button className={`tt-mode-btn ${mode==="single"?"active":""}`} onClick={() => switchMode("single")}>
                        <UserCheck size={13}/> Single Student
                    </button>
                    <button className={`tt-mode-btn ${mode==="bulk"?"active":""}`} onClick={() => switchMode("bulk")}>
                        <Users size={13}/> Entire Course (Bulk)
                    </button>
                </div>

                {/* Selectors */}
                <div className="tt-selectors">
                    <div className="tt-field">
                        <label className="tt-label">Course</label>
                        <div className="tt-sel-wrap">
                            <select className="tt-select" value={courseId}
                                onChange={e => { setCourseId(e.target.value); setEnrollmentId(""); setSelectedStudents(new Set()); }}>
                                <option value="">— Course select karo —</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={13} className="tt-sel-icon"/>
                        </div>
                    </div>

                    {mode==="single" && courseId && (
                        <div className="tt-field">
                            <label className="tt-label">Student</label>
                            <div className="tt-sel-wrap">
                                <select className="tt-select" value={enrollmentId} onChange={e => setEnrollmentId(e.target.value)}>
                                    <option value="">— Student select karo —</option>
                                    {enrollments.map(e => <option key={e._id} value={e._id}>{e.student?.name} ({e.student?.studentId})</option>)}
                                </select>
                                <ChevronDown size={13} className="tt-sel-icon"/>
                            </div>
                        </div>
                    )}

                    {showSlotBuilder && (
                        <div className="tt-dates">
                            <div className="tt-field">
                                <label className="tt-label">Valid From</label>
                                <input type="date" className="tt-input" value={validFrom} onChange={e => setValidFrom(e.target.value)}/>
                            </div>
                            <div className="tt-field">
                                <label className="tt-label">Valid To (optional)</label>
                                <input type="date" className="tt-input" value={validTo} onChange={e => setValidTo(e.target.value)}/>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bulk checklist */}
                {mode==="bulk" && courseId && (
                    <div className="tt-bulk-panel">
                        <div className="tt-bulk-head">
                            <span className="tt-bulk-title"><Users size={12}/> {enrollments.length} students</span>
                            <button className="tt-select-all" onClick={toggleAll}>{selectedStudents.size===enrollments.length?"Deselect All":"Select All"}</button>
                        </div>
                        <div className="tt-bulk-list">
                            {enrollments.map(e => {
                                const checked = selectedStudents.has(e._id);
                                return (
                                    <label key={e._id} className={`tt-bulk-row ${checked?"checked":""}`}>
                                        <input type="checkbox" checked={checked} onChange={() => toggleStudent(e._id)} style={{ accentColor:"#14b8a6" }}/>
                                        <div className="tt-bulk-av">{e.student?.name?.charAt(0).toUpperCase()}</div>
                                        <div className="tt-bulk-info">
                                            <span className="tt-bulk-name">{e.student?.name}</span>
                                            <span className="tt-bulk-id">{e.student?.studentId}</span>
                                        </div>
                                        {checked && <CheckCircle size={13} color="#14b8a6" style={{ marginLeft:"auto", flexShrink:0 }}/>}
                                    </label>
                                );
                            })}
                        </div>
                        {selectedStudents.size > 0 && (
                            <div className="tt-bulk-footer">{selectedStudents.size} student{selectedStudents.size>1?"s":""} selected</div>
                        )}
                    </div>
                )}

                {mode==="single" && existing && (
                    <div className="tt-existing-badge"><CheckCircle size={13} color="#14b8a6"/> Timetable already exists — edit karke update karo</div>
                )}

                {/* Slot builder */}
                {showSlotBuilder && (
                    <>
                        <div className="tt-slots-heading">
                            <span>Class Slots</span>
                            <div className="tt-day-pills">
                                <button className={`tt-day-pill ${activeDay==="all"?"active-all":""}`} onClick={() => setActiveDay("all")}>
                                    All ({slots.length})
                                </button>
                                {slotsByDay.map(d => (
                                    <button key={d.key}
                                        className={`tt-day-pill ${activeDay===d.key?"active-day":""}`}
                                        style={activeDay===d.key ? { background:DAY_COLORS[d.key].bg, borderColor:DAY_COLORS[d.key].pill, color:DAY_COLORS[d.key].text } : {}}
                                        onClick={() => setActiveDay(activeDay===d.key?"all":d.key)}>
                                        {d.short}{d.count>0 && <span className="tt-day-count" style={{ background:DAY_COLORS[d.key].pill }}>{d.count}</span>}
                                    </button>
                                ))}
                                <button className="tt-add-slot-btn" onClick={addSlot}><Plus size={12}/> Add Slot</button>
                            </div>
                        </div>

                        <div className="tt-slots">
                            {filteredSlots.length===0 ? (
                                <div className="tt-no-slots"><Clock size={20} style={{ opacity:.3 }}/><span>Is din ka koi slot nahi</span></div>
                            ) : filteredSlots.map(slot => {
                                const dc = DAY_COLORS[slot.day];
                                return (
                                    <div key={slot._idx} className="tt-slot-card" style={{ borderLeftColor: dc.pill }}>
                                        <div className="tt-slot-top">
                                            <div className="tt-slot-field" style={{ minWidth:130 }}>
                                                <label className="tt-slot-label">Day</label>
                                                <div className="tt-sel-wrap">
                                                    <select className="tt-select tt-select--sm" value={slot.day}
                                                        onChange={e => updateSlot(slot._idx, "day", e.target.value as WeekDay)}>
                                                        {DAYS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                                                    </select>
                                                    <ChevronDown size={11} className="tt-sel-icon"/>
                                                </div>
                                            </div>
                                            <div className="tt-slot-field">
                                                <label className="tt-slot-label"><Clock size={9}/> Start</label>
                                                <input type="time" className="tt-input tt-input--sm" value={slot.startTime} onChange={e => updateSlot(slot._idx,"startTime",e.target.value)}/>
                                            </div>
                                            <div className="tt-slot-field">
                                                <label className="tt-slot-label"><Clock size={9}/> End</label>
                                                <input type="time" className="tt-input tt-input--sm" value={slot.endTime} onChange={e => updateSlot(slot._idx,"endTime",e.target.value)}/>
                                            </div>
                                            <button className="tt-del-btn" onClick={() => removeSlot(slot._idx)}><Trash2 size={12}/></button>
                                        </div>
                                        <div className="tt-slot-bottom">
                                            <div className="tt-slot-field tt-slot-grow">
                                                <label className="tt-slot-label"><BookOpen size={9}/> Subject</label>
                                                <input className="tt-input tt-input--sm" placeholder="e.g. HTML & CSS" value={slot.subject} onChange={e => updateSlot(slot._idx,"subject",e.target.value)}/>
                                            </div>
                                            <div className="tt-slot-field">
                                                <label className="tt-slot-label"><User size={9}/> Teacher</label>
                                                <input className="tt-input tt-input--sm" placeholder="optional" value={slot.teacher} onChange={e => updateSlot(slot._idx,"teacher",e.target.value)}/>
                                            </div>
                                            <div className="tt-slot-field">
                                                <label className="tt-slot-label"><MapPin size={9}/> Room</label>
                                                <input className="tt-input tt-input--sm" placeholder="optional" value={slot.room} onChange={e => updateSlot(slot._idx,"room",e.target.value)}/>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="tt-bottom-bar">
                            <span className="tt-slot-count">{slots.length} slots{mode==="bulk"&&selectedStudents.size>0?` · ${selectedStudents.size} students`:""}</span>
                            <button className="tt-save-btn" onClick={handleSave} disabled={loading}>
                                <Save size={13}/> {loading?"Saving...":existing?"Update":"Create"} Timetable
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

const css = `
.tt-root{font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;display:flex;flex-direction:column;gap:18px;max-width:900px;margin:0 auto;padding-bottom:60px;}
.tt-toast{position:fixed;top:20px;right:24px;z-index:9999;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;padding:11px 18px;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.4);animation:ttIn .22s ease;}
.tt-toast--success{background:#052e16;color:#4ade80;border:1px solid #166534;}
.tt-toast--error{background:#2d0a0a;color:#f87171;border:1px solid #7f1d1d;}
@keyframes ttIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.tt-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.tt-title{font-family:'DM Serif Display',serif;font-size:1.7rem;color:#f8fafc;font-weight:400;margin:0 0 3px;}
.tt-sub{font-size:12px;color:#64748b;margin:0;}
.tt-mode-toggle{display:flex;gap:0;background:#07111a;border:1px solid #132330;border-radius:11px;padding:4px;width:fit-content;}
.tt-mode-btn{display:flex;align-items:center;gap:7px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;padding:7px 14px;border-radius:8px;border:none;background:transparent;color:#475569;cursor:pointer;transition:all .13s;}
.tt-mode-btn.active{background:#0d1b24;color:#14b8a6;}
.tt-selectors{display:flex;flex-direction:column;gap:12px;background:#0d1b24;border:1px solid #132330;border-radius:13px;padding:16px 18px;}
.tt-dates{display:flex;gap:12px;flex-wrap:wrap;}
.tt-field{display:flex;flex-direction:column;gap:5px;flex:1;min-width:170px;}
.tt-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:#64748b;}
.tt-sel-wrap{position:relative;}
.tt-select{width:100%;appearance:none;background:#07111a;border:1px solid #132330;border-radius:9px;padding:9px 28px 9px 11px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;cursor:pointer;outline:none;transition:border-color .13s;}
.tt-select:focus{border-color:#14b8a6;}
.tt-select--sm{padding:7px 24px 7px 9px;font-size:12px;}
.tt-sel-icon{position:absolute;right:9px;top:50%;transform:translateY(-50%);color:#64748b;pointer-events:none;}
.tt-input{background:#07111a;border:1px solid #132330;border-radius:9px;padding:9px 11px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;outline:none;transition:border-color .13s;width:100%;}
.tt-input:focus{border-color:#14b8a6;}
.tt-input--sm{padding:7px 9px;font-size:12px;}
.tt-bulk-panel{background:#0d1b24;border:1px solid #132330;border-radius:13px;overflow:hidden;}
.tt-bulk-head{display:flex;align-items:center;justify-content:space-between;padding:11px 15px;border-bottom:1px solid #132330;background:#07111a;}
.tt-bulk-title{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#64748b;}
.tt-select-all{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;padding:4px 11px;border-radius:100px;border:1px solid #132330;background:transparent;color:#14b8a6;cursor:pointer;}
.tt-bulk-list{display:flex;flex-direction:column;max-height:240px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#132330 transparent;}
.tt-bulk-row{display:flex;align-items:center;gap:11px;padding:10px 15px;cursor:pointer;transition:background .12s;border-bottom:1px solid #0a151e;}
.tt-bulk-row:last-child{border-bottom:none;}
.tt-bulk-row:hover{background:#07111a;}
.tt-bulk-row.checked{background:rgba(20,184,166,.04);}
.tt-bulk-av{width:28px;height:28px;border-radius:50%;background:rgba(20,184,166,.12);color:#14b8a6;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;}
.tt-bulk-info{display:flex;flex-direction:column;gap:1px;flex:1;}
.tt-bulk-name{font-size:13px;font-weight:600;color:#f1f5f9;}
.tt-bulk-id{font-size:10px;color:#475569;}
.tt-bulk-footer{padding:9px 15px;font-size:11px;font-weight:700;color:#14b8a6;background:rgba(20,184,166,.05);border-top:1px solid rgba(20,184,166,.1);}
.tt-existing-badge{display:flex;align-items:center;gap:7px;background:rgba(20,184,166,.06);border:1px solid rgba(20,184,166,.18);border-radius:10px;padding:10px 14px;font-size:12px;color:#14b8a6;}
.tt-slots-heading{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.tt-slots-heading>span{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#334155;}
.tt-day-pills{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
.tt-day-pill{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;padding:5px 11px;border-radius:100px;border:1px solid #132330;background:#07111a;color:#64748b;cursor:pointer;transition:all .13s;display:flex;align-items:center;gap:4px;}
.tt-day-pill:hover{border-color:#334155;color:#94a3b8;}
.tt-day-pill.active-all{background:#0d1b24;color:#e2e8f0;border-color:#334155;}
.tt-day-count{font-size:9px;font-weight:800;padding:1px 5px;border-radius:100px;color:#07111a;line-height:1.4;}
.tt-add-slot-btn{display:flex;align-items:center;gap:5px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;padding:6px 13px;border-radius:100px;border:1px dashed #334155;background:transparent;color:#64748b;cursor:pointer;transition:all .13s;}
.tt-add-slot-btn:hover{border-color:#14b8a6;color:#14b8a6;}
.tt-slots{display:flex;flex-direction:column;gap:9px;}
.tt-slot-card{background:#0d1b24;border:1px solid #132330;border-left:3px solid;border-radius:11px;padding:13px 15px;display:flex;flex-direction:column;gap:9px;}
.tt-slot-top,.tt-slot-bottom{display:flex;gap:9px;flex-wrap:wrap;align-items:flex-end;}
.tt-slot-field{display:flex;flex-direction:column;gap:4px;}
.tt-slot-grow{flex:1;min-width:150px;}
.tt-slot-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#475569;display:flex;align-items:center;gap:3px;}
.tt-del-btn{margin-left:auto;width:30px;height:30px;border-radius:8px;border:1px solid #132330;background:transparent;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;flex-shrink:0;}
.tt-del-btn:hover{border-color:#7f1d1d;color:#f87171;background:rgba(239,68,68,.08);}
.tt-no-slots{display:flex;align-items:center;justify-content:center;gap:9px;padding:28px;font-size:13px;color:#475569;border:1px dashed #132330;border-radius:11px;}
.tt-bottom-bar{display:flex;align-items:center;justify-content:space-between;padding:13px 17px;background:#0d1b24;border:1px solid #132330;border-radius:11px;}
.tt-slot-count{font-size:12px;color:#64748b;font-weight:600;}
.tt-save-btn{display:flex;align-items:center;gap:7px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;padding:9px 20px;border-radius:100px;border:none;background:#14b8a6;color:#042f2e;cursor:pointer;transition:opacity .14s;}
.tt-save-btn:hover:not(:disabled){opacity:.85;}
.tt-save-btn:disabled{opacity:.5;cursor:not-allowed;}
@media(max-width:600px){ .tt-slot-top,.tt-slot-bottom{flex-direction:column;} .tt-del-btn{margin-left:0;align-self:flex-end;} }
`;