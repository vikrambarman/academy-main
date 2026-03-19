"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    CheckCircle, XCircle, Clock, Coffee, Umbrella,
    Save, ChevronDown, AlertCircle, Users, Calendar,
} from "lucide-react";

type Status = "present" | "absent" | "late" | "holiday" | "leave" | "";

interface Student {
    enrollmentId: string; name: string; studentId: string;
    status: Status; remark: string;
    stats: { percentage: number; present: number; total: number; leave: number; holiday: number };
}
interface Course { _id: string; name: string; }

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
    present: { label: "Present", color: "var(--tp-success)", bg: "rgba(34,197,94,.1)",   border: "rgba(34,197,94,.3)",   icon: CheckCircle },
    absent:  { label: "Absent",  color: "var(--tp-danger)",  bg: "rgba(239,68,68,.1)",   border: "rgba(239,68,68,.3)",   icon: XCircle     },
    late:    { label: "Late",    color: "var(--tp-warn)",    bg: "rgba(245,158,11,.1)",  border: "rgba(245,158,11,.3)",  icon: Clock       },
    holiday: { label: "Holiday", color: "#818cf8",           bg: "rgba(129,140,248,.1)", border: "rgba(129,140,248,.3)", icon: Coffee      },
    leave:   { label: "Leave",   color: "#a78bfa",           bg: "rgba(167,139,250,.1)", border: "rgba(167,139,250,.3)", icon: Umbrella    },
};
const STATUSES = Object.keys(STATUS_CFG);

export default function TeacherAttendancePage() {
    const [courses,  setCourses]  = useState<Course[]>([]);
    const [courseId, setCourseId] = useState("");
    const [date,     setDate]     = useState(new Date().toISOString().slice(0, 10));
    const [students, setStudents] = useState<Student[]>([]);
    const [loading,  setLoading]  = useState(false);
    const [saving,   setSaving]   = useState(false);
    const [bulkSel,  setBulkSel]  = useState<Status>("");
    const [toast,    setToast]    = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg }); setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        fetchWithAuth("/api/teacher/courses")
            .then(r => r.json())
            .then(d => setCourses(d.courses || []))
            .catch(() => {});
    }, []);

    const loadAttendance = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        try {
            const res  = await fetchWithAuth(`/api/teacher/attendance?courseId=${courseId}&date=${date}`);
            const data = await res.json();
            const enrs: any[] = data.enrollments || [];
            const atts: any[] = data.attendance  || [];
            const rows: Student[] = enrs.map(e => {
                const att = atts.find((a: any) => String(a.enrollmentId) === String(e._id));
                return {
                    enrollmentId: e._id,
                    name:         e.student?.name      ?? "—",
                    studentId:    e.student?.studentId ?? "—",
                    status:       (att?.todayRecord?.status ?? "") as Status,
                    remark:       att?.todayRecord?.remark   ?? "",
                    stats:        att?.stats ?? { percentage: 0, present: 0, total: 0, leave: 0, holiday: 0 },
                };
            });
            setStudents(rows);
            setBulkSel("");
        } catch { showToast("error", "Attendance load nahi hui"); }
        finally  { setLoading(false); }
    }, [courseId, date]);

    useEffect(() => { loadAttendance(); }, [loadAttendance]);

    const updateStatus = (id: string, status: Status) =>
        setStudents(s => s.map(st => st.enrollmentId === id ? { ...st, status } : st));
    const updateRemark = (id: string, remark: string) =>
        setStudents(s => s.map(st => st.enrollmentId === id ? { ...st, remark } : st));
    const handleMarkAll = (status: Status) => {
        setBulkSel(status); setStudents(s => s.map(st => ({ ...st, status })));
    };

    const handleSave = async () => {
        if (!courseId) return showToast("error", "Course select karo");
        const unmarked = students.filter(s => !s.status);
        if (unmarked.length) return showToast("error", `${unmarked.length} students ki status mark nahi hai`);
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/teacher/attendance", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    records: students.map(s => ({
                        enrollmentId: s.enrollmentId,
                        studentId:    s.enrollmentId,
                        courseId,
                        status:       s.status,
                        remark:       s.remark,
                    })),
                }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.message);
            showToast("success", "Attendance save ho gayi \u2713");
            loadAttendance();
        } catch (e: any) { showToast("error", e.message || "Save nahi hua"); }
        finally { setSaving(false); }
    };

    const summary = {
        present:  students.filter(s => s.status === "present").length,
        absent:   students.filter(s => s.status === "absent").length,
        late:     students.filter(s => s.status === "late").length,
        holiday:  students.filter(s => s.status === "holiday").length,
        leave:    students.filter(s => s.status === "leave").length,
        unmarked: students.filter(s => !s.status).length,
    };

    const pctColor = (p: number) =>
        p >= 75 ? "var(--tp-success)" : p >= 50 ? "var(--tp-warn)" : "var(--tp-danger)";

    return (
        <>
            <style>{css}</style>
            {toast && (
                <div className={`ta-toast ta-toast--${toast.type}`}>
                    {toast.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {toast.msg}
                </div>
            )}
            <div className="ta-root">
                <div className="ta-header">
                    <div>
                        <h1 className="ta-title">Attendance</h1>
                        <p className="ta-sub">Daily student attendance mark karo</p>
                    </div>
                    {students.length > 0 && (
                        <button className="ta-save-btn" onClick={handleSave} disabled={saving}>
                            <Save size={13} /> {saving ? "Saving..." : "Save Attendance"}
                        </button>
                    )}
                </div>

                <div className="ta-filters">
                    <div className="ta-field">
                        <label className="ta-label">Course</label>
                        <div className="ta-sel-wrap">
                            <select className="ta-select" value={courseId} onChange={e => setCourseId(e.target.value)}>
                                <option value="">Course select karo</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={13} className="ta-sel-icon" />
                        </div>
                    </div>
                    <div className="ta-field">
                        <label className="ta-label"><Calendar size={10} /> Date</label>
                        <input type="date" className="ta-input" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                </div>

                {students.length > 0 && (
                    <>
                        <div className="ta-mark-all">
                            <span className="ta-mark-label">Sabko ek saath:</span>
                            {STATUSES.map(s => {
                                const cfg  = STATUS_CFG[s];
                                const Icon = cfg.icon;
                                const isActive = bulkSel === s;
                                return (
                                    <button key={s} className="ta-mark-btn"
                                        style={isActive ? { background: cfg.bg, borderColor: cfg.border, color: cfg.color } : {}}
                                        onClick={() => handleMarkAll(s as Status)}>
                                        <Icon size={11} /> {cfg.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="ta-summary">
                            {[
                                { key: "present",  val: summary.present,  color: "var(--tp-success)" },
                                { key: "absent",   val: summary.absent,   color: "var(--tp-danger)"  },
                                { key: "late",     val: summary.late,     color: "var(--tp-warn)"    },
                                { key: "holiday",  val: summary.holiday,  color: "#818cf8"           },
                                { key: "leave",    val: summary.leave,    color: "#a78bfa"           },
                                { key: "unmarked", val: summary.unmarked, color: "var(--tp-muted)"   },
                            ].map(s => (
                                <div key={s.key} className="ta-sum-item">
                                    <div className="ta-sum-dot" style={{ background: s.color }} />
                                    <span className="ta-sum-val" style={{ color: s.color }}>{s.val}</span>
                                    <span className="ta-sum-key">{s.key}</span>
                                </div>
                            ))}
                            <div className="ta-sum-total"><Users size={12} /> {students.length} total</div>
                        </div>
                    </>
                )}

                {!courseId ? (
                    <div className="ta-empty"><Users size={24} style={{ opacity: .3 }} /><span>Course select karo</span></div>
                ) : loading ? (
                    <div className="ta-empty"><div className="ta-spinner" /><span>Loading...</span></div>
                ) : students.length === 0 ? (
                    <div className="ta-empty"><span>Is course mein koi active student nahi</span></div>
                ) : (
                    <div className="ta-list">
                        {students.map((st, i) => {
                            const cfg = st.status ? STATUS_CFG[st.status] : null;
                            return (
                                <div key={st.enrollmentId} className="ta-row"
                                    style={{ borderLeftColor: cfg?.color ?? "var(--tp-border)" }}>
                                    <div className="ta-row-left">
                                        <div className="ta-sno">{i + 1}</div>
                                        <div className="ta-avatar">{st.name?.charAt(0).toUpperCase()}</div>
                                        <div className="ta-info">
                                            <div className="ta-name">{st.name}</div>
                                            <div className="ta-sid">{st.studentId}</div>
                                        </div>
                                        <div className="ta-pct" style={{ color: pctColor(st.stats.percentage) }}>
                                            {st.stats.percentage}%
                                        </div>
                                    </div>
                                    <div className="ta-row-right">
                                        <div className="ta-status-btns">
                                            {STATUSES.map(s => {
                                                const c    = STATUS_CFG[s];
                                                const Icon = c.icon;
                                                const isActive = st.status === s;
                                                return (
                                                    <button key={s} className="ta-status-btn"
                                                        style={isActive ? { background: c.bg, borderColor: c.border, color: c.color } : {}}
                                                        onClick={() => updateStatus(st.enrollmentId, isActive ? "" : s as Status)}>
                                                        <Icon size={11} /> {c.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <input className="ta-remark" placeholder="Remark (optional)"
                                            value={st.remark} onChange={e => updateRemark(st.enrollmentId, e.target.value)} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {students.length > 0 && (
                    <div className="ta-bottom-bar">
                        <span className="ta-bottom-info">
                            {summary.unmarked > 0
                                ? <><AlertCircle size={12} style={{ color: "var(--tp-warn)" }} /> {summary.unmarked} students unmarked</>
                                : <><CheckCircle size={12} style={{ color: "var(--tp-success)" }} /> Sab mark ho gaye</>}
                        </span>
                        <button className="ta-save-btn" onClick={handleSave} disabled={saving}>
                            <Save size={13} /> {saving ? "Saving..." : "Save Attendance"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .ta-root { display:flex; flex-direction:column; gap:16px; max-width:960px; margin:0 auto; padding-bottom:48px; font-family:'Plus Jakarta Sans',sans-serif; color:var(--tp-text); }
    .ta-toast { position:fixed; top:20px; right:24px; z-index:9999; display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600; padding:11px 18px; border-radius:12px; box-shadow:0 8px 28px rgba(0,0,0,.4); animation:taIn .22s ease; }
    .ta-toast--success { background:color-mix(in srgb,var(--tp-success) 8%,var(--tp-surface)); color:var(--tp-success); border:1px solid color-mix(in srgb,var(--tp-success) 30%,transparent); }
    .ta-toast--error   { background:color-mix(in srgb,var(--tp-danger) 8%,var(--tp-surface));  color:var(--tp-danger);  border:1px solid color-mix(in srgb,var(--tp-danger)  30%,transparent); }
    @keyframes taIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    .ta-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
    .ta-title  { font-family:'DM Serif Display',serif; font-size:1.7rem; color:var(--tp-text); font-weight:400; margin:0 0 3px; }
    .ta-sub    { font-size:12px; color:var(--tp-muted); margin:0; }
    .ta-filters { display:flex; gap:14px; flex-wrap:wrap; background:var(--tp-surface); border:1px solid var(--tp-border); border-radius:13px; padding:16px 18px; }
    .ta-field   { display:flex; flex-direction:column; gap:5px; flex:1; min-width:200px; }
    .ta-label   { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.09em; color:var(--tp-muted); display:flex; align-items:center; gap:4px; }
    .ta-sel-wrap { position:relative; }
    .ta-select  { width:100%; appearance:none; background:var(--tp-bg); border:1px solid var(--tp-border); border-radius:9px; padding:9px 30px 9px 12px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:var(--tp-text); cursor:pointer; outline:none; transition:border-color .13s; }
    .ta-select:focus { border-color:var(--tp-accent2); }
    .ta-select option { background:var(--tp-surface); }
    .ta-sel-icon { position:absolute; right:10px; top:50%; transform:translateY(-50%); color:var(--tp-muted); pointer-events:none; }
    .ta-input   { background:var(--tp-bg); border:1px solid var(--tp-border); border-radius:9px; padding:9px 12px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:var(--tp-text); outline:none; transition:border-color .13s; width:100%; }
    .ta-input:focus { border-color:var(--tp-accent2); }
    .ta-mark-all  { display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
    .ta-mark-label { font-size:11px; font-weight:700; color:var(--tp-muted); }
    .ta-mark-btn  { display:flex; align-items:center; gap:5px; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:700; padding:5px 12px; border-radius:100px; border:1px solid var(--tp-border); background:transparent; color:var(--tp-muted); cursor:pointer; transition:all .13s; white-space:nowrap; }
    .ta-mark-btn:hover { border-color:var(--tp-border2); color:var(--tp-subtext); }
    .ta-summary { display:flex; align-items:center; gap:14px; flex-wrap:wrap; background:var(--tp-surface); border:1px solid var(--tp-border); border-radius:11px; padding:12px 18px; }
    .ta-sum-item  { display:flex; align-items:center; gap:5px; }
    .ta-sum-dot   { width:7px; height:7px; border-radius:50%; }
    .ta-sum-val   { font-size:14px; font-weight:800; }
    .ta-sum-key   { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--tp-muted); }
    .ta-sum-total { margin-left:auto; display:flex; align-items:center; gap:5px; font-size:12px; font-weight:700; color:var(--tp-muted); }
    .ta-list { display:flex; flex-direction:column; gap:8px; }
    .ta-row  { background:var(--tp-surface); border:1px solid var(--tp-border); border-left:3px solid var(--tp-border); border-radius:12px; padding:12px 16px; display:flex; align-items:flex-start; gap:12px; flex-wrap:wrap; transition:border-left-color .15s; }
    .ta-row-left  { display:flex; align-items:center; gap:10px; flex:1; min-width:200px; }
    .ta-row-right { display:flex; flex-direction:column; gap:7px; flex:2; min-width:260px; }
    .ta-sno    { font-size:11px; font-weight:700; color:var(--tp-muted); width:20px; text-align:right; flex-shrink:0; }
    .ta-avatar { width:32px; height:32px; border-radius:50%; background:var(--tp-accent-glow); color:var(--tp-accent2); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; flex-shrink:0; }
    .ta-info   { flex:1; min-width:0; }
    .ta-name   { font-size:13px; font-weight:700; color:var(--tp-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ta-sid    { font-size:10px; color:var(--tp-muted); }
    .ta-pct    { font-size:13px; font-weight:800; flex-shrink:0; }
    .ta-status-btns { display:flex; gap:5px; flex-wrap:wrap; }
    .ta-status-btn  { display:flex; align-items:center; gap:5px; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:700; padding:5px 11px; border-radius:100px; border:1px solid var(--tp-border); background:transparent; color:var(--tp-muted); cursor:pointer; transition:all .12s; white-space:nowrap; }
    .ta-status-btn:hover { border-color:var(--tp-border2); color:var(--tp-subtext); }
    .ta-remark { background:var(--tp-bg); border:1px solid var(--tp-border); border-radius:8px; padding:6px 10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; color:var(--tp-subtext); outline:none; width:100%; transition:border-color .13s; }
    .ta-remark:focus { border-color:var(--tp-accent2); }
    .ta-remark::placeholder { color:var(--tp-muted); }
    .ta-bottom-bar  { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:13px 18px; background:var(--tp-surface); border:1px solid var(--tp-border); border-radius:12px; position:sticky; bottom:0; box-shadow:0 -4px 16px rgba(0,0,0,.1); }
    .ta-bottom-info { display:flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--tp-muted); }
    .ta-save-btn { display:flex; align-items:center; gap:7px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; padding:9px 20px; border-radius:100px; border:none; background:var(--tp-accent2); color:var(--tp-bg); cursor:pointer; transition:opacity .14s; }
    .ta-save-btn:hover:not(:disabled) { opacity:.85; }
    .ta-save-btn:disabled { opacity:.5; cursor:not-allowed; }
    .ta-empty   { display:flex; align-items:center; justify-content:center; gap:10px; padding:48px; font-size:13px; color:var(--tp-muted); border:1px dashed var(--tp-border); border-radius:12px; flex-direction:column; }
    .ta-spinner { width:20px; height:20px; border:2px solid var(--tp-border); border-top-color:var(--tp-accent2); border-radius:50%; animation:taSpin .7s linear infinite; }
    @keyframes taSpin { to{transform:rotate(360deg)} }
    @media(max-width:600px){ .ta-row{flex-direction:column;} .ta-row-right{min-width:100%;} }
`;