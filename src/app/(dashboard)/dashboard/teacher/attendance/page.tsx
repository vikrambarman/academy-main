// src/app/(dashboard)/dashboard/teacher/attendance/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { CheckCircle, XCircle, Clock, Minus, Save, ChevronDown, AlertCircle, Users, Calendar } from "lucide-react";

type Status = "present" | "absent" | "late" | "holiday" | "";

interface Student {
    enrollmentId: string;
    name: string;
    studentId: string;
    status: Status;
    remark: string;
    stats: { percentage: number; present: number; total: number };
}

interface Course { _id: string; name: string; }

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
    present: { label: "Present", color: "#22c55e", bg: "rgba(34,197,94,.12)",   border: "rgba(34,197,94,.3)",   icon: CheckCircle },
    absent:  { label: "Absent",  color: "#f87171", bg: "rgba(248,113,113,.12)", border: "rgba(248,113,113,.3)", icon: XCircle     },
    late:    { label: "Late",    color: "#f59e0b", bg: "rgba(245,158,11,.12)",  border: "rgba(245,158,11,.3)",  icon: Clock       },
    holiday: { label: "Holiday", color: "#818cf8", bg: "rgba(129,140,248,.12)", border: "rgba(129,140,248,.3)", icon: Minus       },
};

export default function TeacherAttendancePage() {
    const [courses,   setCourses]   = useState<Course[]>([]);
    const [courseId,  setCourseId]  = useState("");
    const [date,      setDate]      = useState(new Date().toISOString().slice(0, 10));
    const [students,  setStudents]  = useState<Student[]>([]);
    const [loading,   setLoading]   = useState(false);
    const [saving,    setSaving]    = useState(false);
    const [toast,     setToast]     = useState<{ type: "success"|"error"; msg: string } | null>(null);
    const [markAll,   setMarkAll]   = useState<Status>("");

    const showToast = (type: "success"|"error", msg: string) => {
        setToast({ type, msg }); setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        fetchWithAuth("/api/admin/courses")
            .then(r => r.json())
            .then(d => setCourses(d.courses || d || []))
            .catch(() => {});
    }, []);

    const loadAttendance = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        try {
            const res  = await fetchWithAuth(`/api/teacher/attendance?courseId=${courseId}&date=${date}`);
            const data = await res.json();

            const enrs = data.enrollments || [];
            const atts = data.attendance  || [];

            const rows: Student[] = enrs.map((e: any) => {
                const att     = atts.find((a: any) => String(a.enrollmentId) === String(e._id));
                const today   = att?.todayRecord?.status ?? "";
                const remark  = att?.todayRecord?.remark ?? "";
                const stats   = att?.stats ?? { percentage: 0, present: 0, total: 0 };
                return {
                    enrollmentId: e._id,
                    name:        e.student?.name,
                    studentId:   e.student?.studentId,
                    status:      today as Status,
                    remark,
                    stats,
                };
            });
            setStudents(rows);
        } catch {
            showToast("error", "Attendance load nahi hui");
        } finally {
            setLoading(false);
        }
    }, [courseId, date]);

    useEffect(() => { loadAttendance(); }, [loadAttendance]);

    const updateStatus = (enrollmentId: string, status: Status) =>
        setStudents(s => s.map(st => st.enrollmentId === enrollmentId ? { ...st, status } : st));

    const updateRemark = (enrollmentId: string, remark: string) =>
        setStudents(s => s.map(st => st.enrollmentId === enrollmentId ? { ...st, remark } : st));

    const handleMarkAll = (status: Status) => {
        setMarkAll(status);
        setStudents(s => s.map(st => ({ ...st, status })));
    };

    const handleSave = async () => {
        if (!courseId) return showToast("error", "Course select karo");
        const unmarked = students.filter(s => !s.status);
        if (unmarked.length) return showToast("error", `${unmarked.length} students ki status mark nahi hai`);

        setSaving(true);
        try {
            const records = students.map(s => ({
                enrollmentId: s.enrollmentId,
                studentId:    s.enrollmentId, // will be resolved on backend via enrollment
                courseId,
                status:  s.status,
                remark:  s.remark,
            }));
            const res  = await fetchWithAuth("/api/teacher/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, records }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast("success", "Attendance save ho gayi!");
            loadAttendance();
        } catch (e: any) {
            showToast("error", e.message || "Save nahi hua");
        } finally {
            setSaving(false);
        }
    };

    const summary = {
        present: students.filter(s => s.status === "present").length,
        absent:  students.filter(s => s.status === "absent").length,
        late:    students.filter(s => s.status === "late").length,
        holiday: students.filter(s => s.status === "holiday").length,
        unmarked:students.filter(s => !s.status).length,
    };

    return (
        <>
            <style>{css}</style>

            {toast && (
                <div className={`ta-toast ta-toast--${toast.type}`}>
                    {toast.type === "success" ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                    {toast.msg}
                </div>
            )}

            <div className="ta-root">

                {/* Header */}
                <div className="ta-header">
                    <div>
                        <h1 className="ta-title">Attendance</h1>
                        <p className="ta-sub">Daily student attendance mark karo</p>
                    </div>
                    {students.length > 0 && (
                        <button className="ta-save-btn" onClick={handleSave} disabled={saving}>
                            <Save size={13}/> {saving ? "Saving..." : "Save Attendance"}
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="ta-filters">
                    <div className="ta-field">
                        <label className="ta-label">Course</label>
                        <div className="ta-sel-wrap">
                            <select className="ta-select" value={courseId}
                                onChange={e => setCourseId(e.target.value)}>
                                <option value="">— Course select karo —</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={13} className="ta-sel-icon"/>
                        </div>
                    </div>
                    <div className="ta-field">
                        <label className="ta-label"><Calendar size={10}/> Date</label>
                        <input type="date" className="ta-input" value={date}
                            onChange={e => setDate(e.target.value)}/>
                    </div>
                </div>

                {/* Mark All */}
                {students.length > 0 && (
                    <div className="ta-mark-all">
                        <span className="ta-mark-all-label">Sabko ek saath mark karo:</span>
                        {(["present","absent","late","holiday"] as Status[]).map(s => {
                            const cfg = STATUS_CONFIG[s];
                            const Icon = cfg.icon;
                            return (
                                <button key={s} className={`ta-mark-btn ${markAll === s ? "active" : ""}`}
                                    style={markAll === s ? { background: cfg.bg, borderColor: cfg.border, color: cfg.color } : {}}
                                    onClick={() => handleMarkAll(s)}>
                                    <Icon size={11}/> {cfg.label} All
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Summary bar */}
                {students.length > 0 && (
                    <div className="ta-summary">
                        {[
                            { key: "present", val: summary.present, color: "#22c55e" },
                            { key: "absent",  val: summary.absent,  color: "#f87171" },
                            { key: "late",    val: summary.late,    color: "#f59e0b" },
                            { key: "holiday", val: summary.holiday, color: "#818cf8" },
                            { key: "unmarked",val: summary.unmarked,color: "#64748b" },
                        ].map(s => (
                            <div key={s.key} className="ta-summary-item">
                                <div className="ta-summary-dot" style={{ background: s.color }}/>
                                <span className="ta-summary-val" style={{ color: s.color }}>{s.val}</span>
                                <span className="ta-summary-key">{s.key}</span>
                            </div>
                        ))}
                        <div className="ta-summary-total"><Users size={12}/> {students.length} total</div>
                    </div>
                )}

                {/* Student list */}
                {!courseId ? (
                    <div className="ta-empty"><Users size={24} style={{ opacity:.3 }}/><span>Course select karo</span></div>
                ) : loading ? (
                    <div className="ta-empty"><span>Loading...</span></div>
                ) : students.length === 0 ? (
                    <div className="ta-empty"><span>Is course mein koi active student nahi</span></div>
                ) : (
                    <div className="ta-list">
                        {students.map((st, i) => {
                            const cfg = st.status ? STATUS_CONFIG[st.status] : null;
                            return (
                                <div key={st.enrollmentId}
                                    className="ta-row"
                                    style={cfg ? { borderLeftColor: cfg.color } : {}}>

                                    <div className="ta-row-left">
                                        <div className="ta-sno">{i + 1}</div>
                                        <div className="ta-avatar">{st.name?.charAt(0).toUpperCase()}</div>
                                        <div className="ta-info">
                                            <div className="ta-name">{st.name}</div>
                                            <div className="ta-sid">{st.studentId}</div>
                                        </div>
                                        <div className="ta-pct"
                                            style={{ color: st.stats.percentage >= 75 ? "#22c55e" : st.stats.percentage >= 50 ? "#f59e0b" : "#f87171" }}>
                                            {st.stats.percentage}%
                                        </div>
                                    </div>

                                    <div className="ta-row-right">
                                        <div className="ta-status-btns">
                                            {(["present","absent","late","holiday"] as Status[]).map(s => {
                                                const c = STATUS_CONFIG[s];
                                                const Icon = c.icon;
                                                const isActive = st.status === s;
                                                return (
                                                    <button key={s}
                                                        className={`ta-status-btn ${isActive ? "active" : ""}`}
                                                        style={isActive ? { background: c.bg, borderColor: c.border, color: c.color } : {}}
                                                        onClick={() => updateStatus(st.enrollmentId, isActive ? "" : s)}>
                                                        <Icon size={12}/> {c.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <input className="ta-remark" placeholder="Remark (optional)"
                                            value={st.remark}
                                            onChange={e => updateRemark(st.enrollmentId, e.target.value)}/>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom save */}
                {students.length > 0 && (
                    <div className="ta-bottom-bar">
                        <span className="ta-bottom-info">
                            {summary.unmarked > 0
                                ? <><AlertCircle size={12} color="#f59e0b"/> {summary.unmarked} students unmarked</>
                                : <><CheckCircle size={12} color="#22c55e"/> Sab mark ho gaye</>
                            }
                        </span>
                        <button className="ta-save-btn" onClick={handleSave} disabled={saving}>
                            <Save size={13}/> {saving ? "Saving..." : "Save Attendance"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

const css = `
.ta-root{display:flex;flex-direction:column;gap:18px;max-width:960px;margin:0 auto;padding-bottom:48px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;}

.ta-toast{position:fixed;top:20px;right:24px;z-index:9999;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;padding:11px 18px;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.4);animation:taIn .22s ease;}
.ta-toast--success{background:#052e16;color:#4ade80;border:1px solid #166534;}
.ta-toast--error{background:#2d0a0a;color:#f87171;border:1px solid #7f1d1d;}
@keyframes taIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

.ta-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.ta-title{font-family:'DM Serif Display',serif;font-size:1.7rem;color:#f8fafc;font-weight:400;margin:0 0 3px;}
.ta-sub{font-size:12px;color:#64748b;margin:0;}

.ta-filters{display:flex;gap:14px;flex-wrap:wrap;background:#0d1b24;border:1px solid #132330;border-radius:13px;padding:16px 18px;}
.ta-field{display:flex;flex-direction:column;gap:5px;flex:1;min-width:200px;}
.ta-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:#64748b;display:flex;align-items:center;gap:4px;}
.ta-sel-wrap{position:relative;}
.ta-select{width:100%;appearance:none;background:#07111a;border:1px solid #132330;border-radius:9px;padding:9px 30px 9px 12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;cursor:pointer;outline:none;transition:border-color .13s;}
.ta-select:focus{border-color:#14b8a6;}
.ta-sel-icon{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#64748b;pointer-events:none;}
.ta-input{background:#07111a;border:1px solid #132330;border-radius:9px;padding:9px 12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;outline:none;transition:border-color .13s;}
.ta-input:focus{border-color:#14b8a6;}

.ta-mark-all{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.ta-mark-all-label{font-size:11px;font-weight:700;color:#64748b;margin-right:4px;}
.ta-mark-btn{display:flex;align-items:center;gap:5px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;padding:5px 12px;border-radius:100px;border:1px solid #132330;background:transparent;color:#64748b;cursor:pointer;transition:all .13s;}
.ta-mark-btn:hover{border-color:#334155;color:#94a3b8;}

.ta-summary{display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:#0d1b24;border:1px solid #132330;border-radius:11px;padding:12px 18px;}
.ta-summary-item{display:flex;align-items:center;gap:6px;}
.ta-summary-dot{width:7px;height:7px;border-radius:50%;}
.ta-summary-val{font-size:14px;font-weight:800;}
.ta-summary-key{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#475569;}
.ta-summary-total{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#64748b;}

.ta-list{display:flex;flex-direction:column;gap:8px;}
.ta-row{background:#0d1b24;border:1px solid #132330;border-left:3px solid #132330;border-radius:12px;padding:13px 16px;display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap;transition:border-left-color .15s;}
.ta-row-left{display:flex;align-items:center;gap:10px;flex:1;min-width:200px;}
.ta-row-right{display:flex;flex-direction:column;gap:7px;flex:2;min-width:280px;}

.ta-sno{font-size:11px;font-weight:700;color:#334155;width:20px;text-align:right;flex-shrink:0;}
.ta-avatar{width:32px;height:32px;border-radius:50%;background:rgba(20,184,166,.12);color:#14b8a6;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;}
.ta-info{flex:1;}
.ta-name{font-size:13px;font-weight:700;color:#f1f5f9;}
.ta-sid{font-size:10px;color:#475569;}
.ta-pct{font-size:13px;font-weight:800;flex-shrink:0;}

.ta-status-btns{display:flex;gap:6px;flex-wrap:wrap;}
.ta-status-btn{display:flex;align-items:center;gap:5px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;padding:5px 11px;border-radius:100px;border:1px solid #132330;background:transparent;color:#475569;cursor:pointer;transition:all .12s;}
.ta-status-btn:hover{border-color:#334155;color:#94a3b8;}

.ta-remark{background:#07111a;border:1px solid #132330;border-radius:8px;padding:6px 10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;color:#94a3b8;outline:none;width:100%;}
.ta-remark:focus{border-color:#14b8a6;}

.ta-bottom-bar{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;background:#0d1b24;border:1px solid #132330;border-radius:12px;}
.ta-bottom-info{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:#64748b;}

.ta-save-btn{display:flex;align-items:center;gap:7px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;padding:9px 20px;border-radius:100px;border:none;background:#14b8a6;color:#042f2e;cursor:pointer;transition:opacity .14s;}
.ta-save-btn:hover:not(:disabled){opacity:.85;}
.ta-save-btn:disabled{opacity:.5;cursor:not-allowed;}

.ta-empty{display:flex;align-items:center;justify-content:center;gap:10px;padding:48px;font-size:13px;color:#475569;border:1px dashed #132330;border-radius:12px;flex-direction:column;}

@media(max-width:600px){
    .ta-row{flex-direction:column;}
    .ta-row-right{min-width:100%;}
}
`;