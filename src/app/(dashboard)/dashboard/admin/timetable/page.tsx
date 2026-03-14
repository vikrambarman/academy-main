// FILE: app/dashboard/admin/timetable/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, Trash2, Save, ChevronDown, Clock, BookOpen, User, MapPin, AlertCircle, CheckCircle, Users, UserCheck } from "lucide-react";

type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
type Mode = "single" | "bulk";

interface Slot { day: WeekDay; startTime: string; endTime: string; subject: string; teacher: string; room: string; }
interface Course { _id: string; name: string; }
interface Enrollment { _id: string; student: { _id: string; name: string; studentId: string }; }
interface Timetable { _id: string; slots: Slot[]; validFrom: string; validTo?: string; isActive: boolean; }

const DAYS: { key: WeekDay; short: string; label: string }[] = [
    { key: "monday", short: "Mon", label: "Monday" },
    { key: "tuesday", short: "Tue", label: "Tuesday" },
    { key: "wednesday", short: "Wed", label: "Wednesday" },
    { key: "thursday", short: "Thu", label: "Thursday" },
    { key: "friday", short: "Fri", label: "Friday" },
    { key: "saturday", short: "Sat", label: "Saturday" },
];

const EMPTY_SLOT = (): Slot => ({ day: "monday", startTime: "09:00", endTime: "10:00", subject: "", teacher: "", room: "" });

const DAY_COLORS: Record<WeekDay, { bg: string; border: string; text: string; pill: string }> = {
    monday: { bg: "#fefce8", border: "#fde68a", text: "#92400e", pill: "#f59e0b" },
    tuesday: { bg: "#f0fdf4", border: "#bbf7d0", text: "#14532d", pill: "#22c55e" },
    wednesday: { bg: "#eff6ff", border: "#bfdbfe", text: "#1e3a8a", pill: "#3b82f6" },
    thursday: { bg: "#fdf4ff", border: "#e9d5ff", text: "#581c87", pill: "#a855f7" },
    friday: { bg: "#fff7ed", border: "#fed7aa", text: "#7c2d12", pill: "#f97316" },
    saturday: { bg: "#fff1f2", border: "#fecdd3", text: "#881337", pill: "#f43f5e" },
};

export default function AdminTimetablePage() {
    const [mode, setMode] = useState<Mode>("single");
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [courseId, setCourseId] = useState("");
    const [enrollmentId, setEnrollmentId] = useState("");           // single mode
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set()); // bulk: enrollment IDs
    const [existing, setExisting] = useState<Timetable | null>(null);
    const [slots, setSlots] = useState<Slot[]>([EMPTY_SLOT()]);
    const [validFrom, setValidFrom] = useState(new Date().toISOString().slice(0, 10));
    const [validTo, setValidTo] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [activeDay, setActiveDay] = useState<WeekDay | "all">("all");

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    // Load courses
    useEffect(() => {
        fetchWithAuth("/api/admin/courses")
            .then(r => r.json())
            .then(d => setCourses(d.courses || d || []))
            .catch(() => { });
    }, []);

    // Load enrollments when course changes
    useEffect(() => {
        if (!courseId) { setEnrollments([]); setEnrollmentId(""); setSelectedStudents(new Set()); return; }
        fetchWithAuth(`/api/admin/enrollments?courseId=${courseId}`)
            .then(r => r.json())
            .then(d => setEnrollments(d.enrollments || []))
            .catch(() => { });
    }, [courseId]);

    // Load existing timetable (single mode only)
    useEffect(() => {
        if (mode !== "single" || !enrollmentId) { setExisting(null); setSlots([EMPTY_SLOT()]); return; }
        fetchWithAuth(`/api/admin/timetable?enrollmentId=${enrollmentId}`)
            .then(r => r.json())
            .then(d => {
                const tt = (d.timetables || [])[0] ?? null;
                setExisting(tt);
                if (tt?.slots?.length) {
                    setSlots(tt.slots);
                    if (tt.validFrom) setValidFrom(tt.validFrom.slice(0, 10));
                    if (tt.validTo) setValidTo(tt.validTo.slice(0, 10));
                } else {
                    setSlots([EMPTY_SLOT()]);
                }
            })
            .catch(() => { });
    }, [enrollmentId, mode]);

    // Mode switch — reset selection
    const switchMode = (m: Mode) => {
        setMode(m);
        setEnrollmentId("");
        setSelectedStudents(new Set());
        setExisting(null);
        setSlots([EMPTY_SLOT()]);
    };

    const addSlot = () => setSlots(s => [...s, EMPTY_SLOT()]);
    const removeSlot = (i: number) => setSlots(s => s.filter((_, idx) => idx !== i));
    const updateSlot = (i: number, field: keyof Slot, val: string) =>
        setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [field]: val } : sl));

    // Bulk: toggle individual student
    const toggleStudent = (enrollId: string) => {
        setSelectedStudents(prev => {
            const next = new Set(prev);
            next.has(enrollId) ? next.delete(enrollId) : next.add(enrollId);
            return next;
        });
    };

    // Bulk: select all / deselect all
    const toggleAll = () => {
        if (selectedStudents.size === enrollments.length) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(enrollments.map(e => e._id)));
        }
    };

    const handleSave = async () => {
        if (!courseId) return showToast("error", "Course select karo");
        if (slots.some(s => !s.subject || !s.startTime || !s.endTime)) return showToast("error", "Saare slots complete karo");

        // ── BULK ──
        if (mode === "bulk") {
            if (selectedStudents.size === 0) return showToast("error", "Kam se kam ek student select karo");

            const students = enrollments
                .filter(e => selectedStudents.has(e._id))
                .map(e => ({ enrollmentId: e._id, studentId: e.student._id }));

            setLoading(true);
            try {
                const res = await fetchWithAuth("/api/admin/timetable", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId, bulk: true, students, slots, validFrom, validTo: validTo || undefined, courseName: courses.find(c => c._id === courseId)?.name ?? "" }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                showToast("success", data.message);
            } catch (e: any) {
                showToast("error", e.message || "Error hua");
            } finally {
                setLoading(false);
            }
            return;
        }

        // ── SINGLE ──
        const selectedEnrollment = enrollments.find(e => e._id === enrollmentId);
        if (!enrollmentId || !selectedEnrollment) return showToast("error", "Student select karo");

        setLoading(true);
        try {
            let res;
            if (existing) {
                res = await fetchWithAuth("/api/admin/timetable", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timetableId: existing._id, slots, validTo: validTo || undefined }),
                });
            } else {
                res = await fetchWithAuth("/api/admin/timetable", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        courseId, enrollmentId,
                        studentId: selectedEnrollment.student._id,
                        slots, validFrom, validTo: validTo || undefined,
                        courseName: courses.find(c => c._id === courseId)?.name ?? "",
                    }),
                });
            }
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast("success", existing ? "Timetable update ho gaya!" : "Timetable create ho gaya!");
            setExisting(data.timetable ?? existing);
        } catch (e: any) {
            showToast("error", e.message || "Save nahi hua");
        } finally {
            setLoading(false);
        }
    };

    const filteredSlots = slots.map((s, i) => ({ ...s, _idx: i }))
        .filter(s => activeDay === "all" || s.day === activeDay);

    const slotsByDay = DAYS.map(d => ({ ...d, count: slots.filter(s => s.day === d.key).length }));

    const showSlotBuilder = mode === "bulk"
        ? courseId && selectedStudents.size > 0
        : !!enrollmentId;

    return (
        <>
            <style>{css}</style>
            <div className="at-root">

                {/* Toast */}
                {toast && (
                    <div className={`at-toast at-toast--${toast.type}`}>
                        {toast.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                        {toast.msg}
                    </div>
                )}

                {/* Header */}
                <div className="at-header">
                    <div>
                        <h1 className="at-title">Timetable Manager</h1>
                        <p className="at-sub">Student-wise ya course-wise weekly schedule set karo</p>
                    </div>
                    {showSlotBuilder && (
                        <button className="at-save-btn" onClick={handleSave} disabled={loading}>
                            <Save size={14} />
                            {loading ? "Saving..." : existing ? "Update Timetable" : "Create Timetable"}
                        </button>
                    )}
                </div>

                {/* Mode toggle */}
                <div className="at-mode-toggle">
                    <button className={`at-mode-btn ${mode === "single" ? "active" : ""}`} onClick={() => switchMode("single")}>
                        <UserCheck size={14} /> Single Student
                    </button>
                    <button className={`at-mode-btn ${mode === "bulk" ? "active" : ""}`} onClick={() => switchMode("bulk")}>
                        <Users size={14} /> Entire Course (Bulk)
                    </button>
                </div>

                {/* Selectors */}
                <div className="at-selectors">
                    {/* Course */}
                    <div className="at-field">
                        <label className="at-label">Course</label>
                        <div className="at-select-wrap">
                            <select className="at-select" value={courseId}
                                onChange={e => { setCourseId(e.target.value); setEnrollmentId(""); setSelectedStudents(new Set()); }}>
                                <option value="">— Course select karo —</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={14} className="at-select-icon" />
                        </div>
                    </div>

                    {/* Single: student dropdown */}
                    {mode === "single" && courseId && (
                        <div className="at-field">
                            <label className="at-label">Student</label>
                            <div className="at-select-wrap">
                                <select className="at-select" value={enrollmentId} onChange={e => setEnrollmentId(e.target.value)}>
                                    <option value="">— Student select karo —</option>
                                    {enrollments.map(e => (
                                        <option key={e._id} value={e._id}>
                                            {e.student?.name} ({e.student?.studentId})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="at-select-icon" />
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    {showSlotBuilder && (
                        <div className="at-dates">
                            <div className="at-field">
                                <label className="at-label">Valid From</label>
                                <input type="date" className="at-input" value={validFrom} onChange={e => setValidFrom(e.target.value)} />
                            </div>
                            <div className="at-field">
                                <label className="at-label">Valid To (optional)</label>
                                <input type="date" className="at-input" value={validTo} onChange={e => setValidTo(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* BULK: student checklist */}
                {mode === "bulk" && courseId && (
                    <div className="at-bulk-panel">
                        <div className="at-bulk-header">
                            <span className="at-bulk-title">
                                <Users size={13} /> Students — {enrollments.length} enrolled
                            </span>
                            <button className="at-select-all-btn" onClick={toggleAll}>
                                {selectedStudents.size === enrollments.length ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                        {enrollments.length === 0 ? (
                            <div className="at-bulk-empty">Is course mein koi active enrollment nahi hai</div>
                        ) : (
                            <div className="at-bulk-list">
                                {enrollments.map(e => {
                                    const checked = selectedStudents.has(e._id);
                                    return (
                                        <label key={e._id} className={`at-bulk-row ${checked ? "checked" : ""}`}>
                                            <input type="checkbox" checked={checked}
                                                onChange={() => toggleStudent(e._id)}
                                                style={{ color: "var(--cp-accent)" }} />
                                            <div className="at-bulk-avatar">{e.student?.name?.charAt(0).toUpperCase()}</div>
                                            <div className="at-bulk-info">
                                                <span className="at-bulk-name">{e.student?.name}</span>
                                                <span className="at-bulk-id">{e.student?.studentId}</span>
                                            </div>
                                            {checked && <CheckCircle size={14} style={{ marginLeft: "auto", flexShrink: 0, color: "var(--cp-acent)" }} />}
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                        {selectedStudents.size > 0 && (
                            <div className="at-bulk-footer">
                                {selectedStudents.size} student{selectedStudents.size > 1 ? "s" : ""} selected — inhe same timetable milega
                            </div>
                        )}
                    </div>
                )}

                {/* Existing badge (single mode) */}
                {mode === "single" && existing && (
                    <div className="at-existing-badge">
                        <CheckCircle size={13} style={{ color: "var(--cp-accent)"}} />
                        Is student ka timetable pehle se exist karta hai — edit karke update karo
                    </div>
                )}

                {/* Slot builder */}
                {showSlotBuilder && (
                    <>
                        <div className="at-slots-heading">
                            <span>Class Slots</span>
                            <div className="at-day-pills">
                                <button className={`at-day-pill ${activeDay === "all" ? "active-all" : ""}`}
                                    onClick={() => setActiveDay("all")}>All ({slots.length})</button>
                                {slotsByDay.map(d => (
                                    <button key={d.key}
                                        className={`at-day-pill ${activeDay === d.key ? "active-day" : ""}`}
                                        style={activeDay === d.key ? { background: DAY_COLORS[d.key].bg, borderColor: DAY_COLORS[d.key].pill, color: DAY_COLORS[d.key].text } : {}}
                                        onClick={() => setActiveDay(activeDay === d.key ? "all" : d.key)}>
                                        {d.short}
                                        {d.count > 0 && <span className="at-day-count" style={{ background: DAY_COLORS[d.key].pill }}>{d.count}</span>}
                                    </button>
                                ))}
                                <button className="at-add-slot-btn" onClick={addSlot}>
                                    <Plus size={13} /> Add Slot
                                </button>
                            </div>
                        </div>

                        <div className="at-slots">
                            {filteredSlots.length === 0 ? (
                                <div className="at-no-slots">
                                    <Clock size={22} style={{ opacity: .3 }} />
                                    <span>Is din ka koi slot nahi — Add Slot karo</span>
                                </div>
                            ) : filteredSlots.map(slot => {
                                const dayColor = DAY_COLORS[slot.day];
                                return (
                                    <div key={slot._idx} className="at-slot-card" style={{ borderLeftColor: dayColor.pill }}>
                                        <div className="at-slot-top">
                                            <div className="at-slot-field" style={{ minWidth: 140 }}>
                                                <label className="at-slot-label">Day</label>
                                                <div className="at-select-wrap">
                                                    <select className="at-select at-select--sm"
                                                        value={slot.day}
                                                        onChange={e => updateSlot(slot._idx, "day", e.target.value as WeekDay)}>
                                                        {DAYS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                                                    </select>
                                                    <ChevronDown size={12} className="at-select-icon" />
                                                </div>
                                            </div>
                                            <div className="at-slot-field">
                                                <label className="at-slot-label"><Clock size={10} /> Start</label>
                                                <input type="time" className="at-input at-input--sm"
                                                    value={slot.startTime}
                                                    onChange={e => updateSlot(slot._idx, "startTime", e.target.value)} />
                                            </div>
                                            <div className="at-slot-field">
                                                <label className="at-slot-label"><Clock size={10} /> End</label>
                                                <input type="time" className="at-input at-input--sm"
                                                    value={slot.endTime}
                                                    onChange={e => updateSlot(slot._idx, "endTime", e.target.value)} />
                                            </div>
                                            <button className="at-del-btn" onClick={() => removeSlot(slot._idx)}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                        <div className="at-slot-bottom">
                                            <div className="at-slot-field at-slot-field--grow">
                                                <label className="at-slot-label"><BookOpen size={10} /> Subject</label>
                                                <input className="at-input at-input--sm" placeholder="e.g. HTML & CSS"
                                                    value={slot.subject}
                                                    onChange={e => updateSlot(slot._idx, "subject", e.target.value)} />
                                            </div>
                                            <div className="at-slot-field">
                                                <label className="at-slot-label"><User size={10} /> Teacher</label>
                                                <input className="at-input at-input--sm" placeholder="optional"
                                                    value={slot.teacher}
                                                    onChange={e => updateSlot(slot._idx, "teacher", e.target.value)} />
                                            </div>
                                            <div className="at-slot-field">
                                                <label className="at-slot-label"><MapPin size={10} /> Room</label>
                                                <input className="at-input at-input--sm" placeholder="optional"
                                                    value={slot.room}
                                                    onChange={e => updateSlot(slot._idx, "room", e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="at-bottom-bar">
                            <span className="at-slot-count">
                                {slots.length} slots
                                {mode === "bulk" && selectedStudents.size > 0 && ` · ${selectedStudents.size} students`}
                            </span>
                            <button className="at-save-btn" onClick={handleSave} disabled={loading}>
                                <Save size={14} />
                                {loading ? "Saving..." : existing ? "Update Timetable" : "Create Timetable"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;}

.at-root{font-family:'Plus Jakarta Sans',sans-serif;color:var(--cp-text);display:flex;flex-direction:column;gap:20px;max-width:900px;margin:0 auto;padding-bottom:60px;}

.at-toast{position:fixed;top:20px;right:24px;z-index:9999;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;padding:12px 18px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.35);animation:atSlideIn .25s ease;}
.at-toast--success{background:rgba(34,197,94,0.12);color:var(--cp-success);border:1px solid rgba(34,197,94,0.3);}
.at-toast--error{background:rgba(239,68,68,0.12);color:var(--cp-danger);border:1px solid rgba(239,68,68,0.3);}
@keyframes atSlideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}

.at-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.at-title{font-family:'DM Serif Display',serif;font-size:1.7rem;color:var(--cp-text);font-weight:400;margin:0 0 3px;}
.at-sub{font-size:12px;color:var(--cp-muted);margin:0;}

.at-mode-toggle{display:flex;gap:0;background:var(--cp-bg);border:1px solid var(--cp-border);border-radius:12px;padding:4px;width:fit-content;}
.at-mode-btn{display:flex;align-items:center;gap:7px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;padding:8px 16px;border-radius:9px;border:none;background:transparent;color:var(--cp-muted);cursor:pointer;transition:all .14s;}
.at-mode-btn.active{background:var(--cp-surface);color:var(--cp-accent);}
.at-mode-btn:hover:not(.active){color:var(--cp-subtext);}

.at-selectors{display:flex;flex-direction:column;gap:14px;background:var(--cp-surface);border:1px solid var(--cp-border);border-radius:14px;padding:18px 20px;}
.at-dates{display:flex;gap:14px;flex-wrap:wrap;}
.at-field{display:flex;flex-direction:column;gap:5px;flex:1;min-width:180px;}
.at-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--cp-muted);}

.at-select-wrap{position:relative;}
.at-select{width:100%;appearance:none;background:var(--cp-bg);border:1px solid var(--cp-border);border-radius:9px;padding:9px 32px 9px 12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:var(--cp-text);cursor:pointer;transition:border-color .13s;outline:none;}
.at-select:focus{border-color:var(--cp-accent);}
.at-select--sm{padding:7px 28px 7px 10px;font-size:12px;}
.at-select-icon{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--cp-muted);pointer-events:none;}

.at-input{width:100%;background:var(--cp-bg);border:1px solid var(--cp-border);border-radius:9px;padding:9px 12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:var(--cp-text);outline:none;transition:border-color .13s;}
.at-input:focus{border-color:var(--cp-accent);}
.at-input--sm{padding:7px 10px;font-size:12px;}

.at-bulk-panel{background:var(--cp-surface);border:1px solid var(--cp-border);border-radius:14px;overflow:hidden;}
.at-bulk-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--cp-border);background:var(--cp-surface2);}
.at-bulk-title{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;color:var(--cp-subtext);}
.at-select-all-btn{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;padding:5px 12px;border-radius:100px;border:1px solid var(--cp-border);background:transparent;color:var(--cp-accent);cursor:pointer;transition:all .13s;}
.at-select-all-btn:hover{background:var(--cp-accent-glow);}
.at-bulk-list{display:flex;flex-direction:column;max-height:260px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--cp-border) transparent;}
.at-bulk-row{display:flex;align-items:center;gap:12px;padding:11px 16px;cursor:pointer;transition:background .12s;border-bottom:1px solid var(--cp-border);}
.at-bulk-row:last-child{border-bottom:none;}
.at-bulk-row:hover{background:var(--cp-accent-glow);}
.at-bulk-row.checked{background:color-mix(in srgb,var(--cp-accent) 4%,var(--cp-surface));}
.at-bulk-avatar{width:30px;height:30px;border-radius:50%;background:var(--cp-accent-glow);color:var(--cp-accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;}
.at-bulk-info{display:flex;flex-direction:column;gap:1px;flex:1;}
.at-bulk-name{font-size:13px;font-weight:600;color:var(--cp-text);}
.at-bulk-id{font-size:10px;color:var(--cp-muted);}
.at-bulk-footer{padding:10px 16px;font-size:11px;font-weight:700;color:var(--cp-accent);background:var(--cp-accent-glow);border-top:1px solid color-mix(in srgb,var(--cp-accent) 15%,transparent);}
.at-bulk-empty{padding:24px;text-align:center;font-size:13px;color:var(--cp-muted);}

.at-existing-badge{display:flex;align-items:center;gap:7px;background:color-mix(in srgb,var(--cp-warning) 8%,var(--cp-surface));border:1px solid color-mix(in srgb,var(--cp-warning) 25%,transparent);border-radius:10px;padding:10px 14px;font-size:12px;color:var(--cp-warning);}

.at-slots-heading{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.at-slots-heading>span{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--cp-muted);}

.at-day-pills{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
.at-day-pill{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;padding:5px 12px;border-radius:100px;border:1px solid var(--cp-border);background:var(--cp-surface);color:var(--cp-muted);cursor:pointer;transition:all .13s;display:flex;align-items:center;gap:5px;}
.at-day-pill:hover{border-color:var(--cp-border2);color:var(--cp-subtext);}
.at-day-pill.active-all{background:var(--cp-surface2);color:var(--cp-text);border-color:var(--cp-border2);}
.at-day-count{font-size:9px;font-weight:800;padding:1px 5px;border-radius:100px;color:#fff;line-height:1.4;}
.at-add-slot-btn{display:flex;align-items:center;gap:6px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;padding:6px 14px;border-radius:100px;border:1px dashed var(--cp-border2);background:transparent;color:var(--cp-subtext);cursor:pointer;transition:all .13s;}
.at-add-slot-btn:hover{border-color:var(--cp-accent);color:var(--cp-accent);}

.at-slots{display:flex;flex-direction:column;gap:10px;}
.at-slot-card{background:var(--cp-surface);border:1px solid var(--cp-border);border-left:3px solid;border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;}
.at-slot-top,.at-slot-bottom{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;}
.at-slot-field{display:flex;flex-direction:column;gap:4px;}
.at-slot-field--grow{flex:1;min-width:160px;}
.at-slot-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--cp-muted);display:flex;align-items:center;gap:4px;}
.at-del-btn{margin-left:auto;width:32px;height:32px;border-radius:8px;border:1px solid var(--cp-border);background:transparent;color:var(--cp-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;flex-shrink:0;}
.at-del-btn:hover{border-color:rgba(239,68,68,0.5);color:var(--cp-danger);background:rgba(239,68,68,0.08);}

.at-no-slots{display:flex;align-items:center;justify-content:center;gap:10px;padding:32px;font-size:13px;color:var(--cp-muted);border:1px dashed var(--cp-border);border-radius:12px;}

.at-bottom-bar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--cp-surface);border:1px solid var(--cp-border);border-radius:12px;}
.at-slot-count{font-size:12px;color:var(--cp-muted);font-weight:600;}

.at-save-btn{display:flex;align-items:center;gap:7px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;padding:9px 20px;border-radius:100px;border:none;background:var(--cp-accent);color:#fff;cursor:pointer;transition:all .14s;}
.at-save-btn:hover:not(:disabled){opacity:.88;}
.at-save-btn:disabled{opacity:.5;cursor:not-allowed;}

@media(max-width:600px){
    .at-slot-top,.at-slot-bottom{flex-direction:column;}
    .at-del-btn{margin-left:0;align-self:flex-end;}
    .at-mode-toggle{width:100%;}
    .at-mode-btn{flex:1;justify-content:center;}
}
`;