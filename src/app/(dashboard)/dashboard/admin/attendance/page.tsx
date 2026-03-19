"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    CalendarDays, ChevronLeft, ChevronRight, Search,
    CheckCircle2, XCircle, Clock, Coffee, Save,
    Users, TrendingUp, AlertTriangle, Umbrella,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type AttStatus = "present" | "absent" | "late" | "holiday" | "leave";

interface StudentRow {
    enrollmentId:  string;
    studentDbId:   string;
    studentCode:   string;
    courseId:      string;
    name:          string;
    courseName:    string;
    status:        AttStatus;
    remark:        string;
    alreadyMarked: boolean;
}

interface AttDoc {
    _id:        string;
    student:    { name: string; studentId: string };
    course:     { name: string; _id: string };
    enrollment: { _id: string };
    stats:      { total: number; present: number; absent: number; late: number; holiday: number; leave: number; percentage: number };
    todayRecord: { status: AttStatus; remark?: string } | null;
}

interface Course        { _id: string; name: string; }
interface CourseSummary { _id: string; name: string; studentCount: number; }

const STATUS_CFG: Record<AttStatus, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
    present: { label: "Present", icon: <CheckCircle2 size={10} />, color: "var(--cp-success)", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.3)"   },
    absent:  { label: "Absent",  icon: <XCircle      size={10} />, color: "var(--cp-danger)",  bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)"   },
    late:    { label: "Late",    icon: <Clock         size={10} />, color: "var(--cp-warning)", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)"  },
    holiday: { label: "Holiday", icon: <Coffee        size={10} />, color: "#60a5fa",           bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.3)"  },
    leave:   { label: "Leave",   icon: <Umbrella      size={10} />, color: "#a78bfa",           bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.3)" },
};

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function isoToday() { return new Date().toISOString().split("T")[0]; }

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminAttendancePage() {
    const [courses,       setCourses]       = useState<Course[]>([]);
    const [courseId,      setCourseId]      = useState("");
    const [date,          setDate]          = useState(isoToday());
    const [rows,          setRows]          = useState<StudentRow[]>([]);
    const [search,        setSearch]        = useState("");
    const [saving,        setSaving]        = useState(false);
    const [loading,       setLoading]       = useState(false);
    const [toast,         setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [courseSummary, setCourseSummary] = useState<CourseSummary[]>([]);

    // Overview tab
    const [allDocs,  setAllDocs]  = useState<AttDoc[]>([]);
    const [tab,      setTab]      = useState<"mark" | "overview">("mark");
    const [ovSearch, setOvSearch] = useState("");
    const [ovPage,   setOvPage]   = useState(1);
    const OV_LIMIT = 12;

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchWithAuth("/api/admin/courses").then(r => r.json())
            .then(d => setCourses(Array.isArray(d) ? d : (d.courses || [])));
    }, []);

    const loadOverview = useCallback(async () => {
        const res = await fetchWithAuth("/api/admin/attendance");
        const d   = await res.json();
        setAllDocs(d.attendance || []);
        setCourseSummary(d.courseSummary || []);
    }, []);

    useEffect(() => { loadOverview(); }, [loadOverview]);

    const loadStudents = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        try {
            const res  = await fetchWithAuth(`/api/admin/attendance?courseId=${courseId}&date=${date}`);
            const data = await res.json();

            const enrollments: any[]  = data.enrollments || [];
            const attDocs:     any[]  = data.attendance  || [];

            const attMap: Record<string, { status: AttStatus; remark: string } | null> = {};
            for (const doc of attDocs) {
                const eid = typeof doc.enrollment === "string" ? doc.enrollment : doc.enrollment?._id;
                attMap[eid] = doc.todayRecord
                    ? { status: doc.todayRecord.status, remark: doc.todayRecord.remark ?? "" }
                    : null;
            }

            const built: StudentRow[] = enrollments.map((e: any) => {
                const existing = attMap[e._id] ?? null;
                return {
                    enrollmentId:  e._id,
                    studentDbId:   e.student?._id ?? e.student,
                    studentCode:   e.student?.studentId ?? "",
                    courseId:      typeof e.course === "string" ? e.course : e.course?._id,
                    name:          e.student?.name ?? "—",
                    courseName:    typeof e.course === "string" ? "" : (e.course?.name ?? ""),
                    status:        existing?.status ?? "present",
                    remark:        existing?.remark ?? "",
                    alreadyMarked: existing !== null,
                };
            });
            setRows(built);
        } catch { showToast("Students load nahi hue", "error"); }
        finally  { setLoading(false); }
    }, [courseId, date]);

    useEffect(() => { loadStudents(); }, [loadStudents]);

    const setStatus = (eid: string, status: AttStatus) =>
        setRows(prev => prev.map(r => r.enrollmentId === eid ? { ...r, status } : r));
    const setRemark = (eid: string, remark: string) =>
        setRows(prev => prev.map(r => r.enrollmentId === eid ? { ...r, remark } : r));
    const markAll = (status: AttStatus) =>
        setRows(prev => prev.map(r => ({ ...r, status })));

    const handleSave = async () => {
        if (!rows.length) return;
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/admin/attendance", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    records: rows.map(r => ({
                        enrollmentId: r.enrollmentId,
                        studentId:    r.studentDbId,
                        courseId:     r.courseId,
                        status:       r.status,
                        remark:       r.remark,
                    })),
                }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.message);
            showToast(`${rows.length} students ki attendance save ho gaya ✓`, "success");
            setRows(prev => prev.map(r => ({ ...r, alreadyMarked: true })));
            loadOverview();
        } catch (e: any) { showToast(e.message || "Save nahi hua", "error"); }
        finally { setSaving(false); }
    };

    const filtered = rows.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.studentCode.toLowerCase().includes(search.toLowerCase())
    );

    const ovFiltered  = allDocs.filter(d =>
        d.student?.name?.toLowerCase().includes(ovSearch.toLowerCase()) ||
        d.student?.studentId?.toLowerCase().includes(ovSearch.toLowerCase())
    );
    const ovTotalPages = Math.ceil(ovFiltered.length / OV_LIMIT) || 1;
    const ovPaged      = ovFiltered.slice((ovPage - 1) * OV_LIMIT, ovPage * OV_LIMIT);

    const avgPct  = allDocs.length > 0 ? Math.round(allDocs.reduce((s, a) => s + (a.stats?.percentage || 0), 0) / allDocs.length) : 0;
    const below75 = allDocs.filter(a => (a.stats?.percentage || 0) < 75).length;

    const presentCount = rows.filter(r => r.status === "present").length;
    const absentCount  = rows.filter(r => r.status === "absent").length;
    const lateCount    = rows.filter(r => r.status === "late").length;
    const leaveCount   = rows.filter(r => r.status === "leave").length;

    return (
        <>
            <style>{styles}</style>
            {toast && <div className={`att-toast att-toast--${toast.type}`}>{toast.msg}</div>}

            <div className="att-root">

                {/* Header */}
                <div className="att-header">
                    <div>
                        <h1 className="att-title">Attendance</h1>
                        <p className="att-sub">Date-wise bulk attendance manage karo</p>
                    </div>
                    <div className="att-tabs">
                        <button className={`att-tab${tab === "mark" ? " att-tab--active" : ""}`} onClick={() => setTab("mark")}>
                            <CalendarDays size={13} /> Mark
                        </button>
                        <button className={`att-tab${tab === "overview" ? " att-tab--active" : ""}`} onClick={() => setTab("overview")}>
                            <TrendingUp size={13} /> Overview
                        </button>
                    </div>
                </div>

                {/* ═══ MARK TAB ═══ */}
                {tab === "mark" && (
                    <>
                        {/* Course Summary Strip */}
                        {courseSummary.length > 0 && (
                            <div className="att-course-strip">
                                <span className="att-strip-label">Courses:</span>
                                {courseSummary.map(cs => (
                                    <button key={cs._id}
                                        className={`att-course-chip${courseId === cs._id ? " att-course-chip--active" : ""}`}
                                        onClick={() => setCourseId(cs._id)}>
                                        <span className="att-chip-name">{cs.name}</span>
                                        <span className="att-chip-badge">{cs.studentCount}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Filters */}
                        <div className="att-filter-bar">
                            <div className="att-field">
                                <label className="att-label">Course</label>
                                <select className="att-select" value={courseId} onChange={e => setCourseId(e.target.value)}>
                                    <option value="">-- Course chunno --</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="att-field">
                                <label className="att-label">Date</label>
                                <input className="att-input" type="date" value={date}
                                    onChange={e => setDate(e.target.value)} />
                            </div>
                        </div>

                        {courseId ? (
                            <>
                                {/* Summary bar */}
                                <div className="att-summary-bar">
                                    {[
                                        { key: "present", count: presentCount, cls: "att-sum-chip--green"  },
                                        { key: "absent",  count: absentCount,  cls: "att-sum-chip--red"    },
                                        { key: "late",    count: lateCount,    cls: "att-sum-chip--amber"  },
                                        { key: "leave",   count: leaveCount,   cls: "att-sum-chip--purple" },
                                    ].map(({ key, count, cls }) => (
                                        <div key={key} className={`att-sum-chip ${cls}`}>
                                            {count} {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </div>
                                    ))}
                                    <div style={{ flex: 1 }} />
                                    <span className="att-bulk-label">Mark All:</span>
                                    {(Object.keys(STATUS_CFG) as AttStatus[]).map(s => (
                                        <button key={s} className="att-bulk-btn"
                                            style={{ color: STATUS_CFG[s].color, borderColor: STATUS_CFG[s].border, background: STATUS_CFG[s].bg }}
                                            onClick={() => markAll(s)}>
                                            {STATUS_CFG[s].label}
                                        </button>
                                    ))}
                                </div>

                                {/* Search */}
                                <div className="att-search-wrap">
                                    <Search size={13} className="att-search-icon" />
                                    <input className="att-search" placeholder="Search student..."
                                        value={search} onChange={e => setSearch(e.target.value)} />
                                </div>

                                {/* Table */}
                                {loading ? (
                                    <div className="att-loading">
                                        <div className="att-spinner" /> Loading students...
                                    </div>
                                ) : rows.length === 0 ? (
                                    <div className="att-empty">
                                        <Users size={28} style={{ opacity: .3, marginBottom: 8 }} />
                                        <div>Is course mein koi enrolled student nahi</div>
                                    </div>
                                ) : (
                                    <div className="att-table-wrap">
                                        <div className="att-table-head">
                                            <span>#</span>
                                            <span>Student</span>
                                            <span>Status</span>
                                            <span>Remark</span>
                                        </div>
                                        {filtered.map((row, i) => {
                                            const cfg = STATUS_CFG[row.status];
                                            return (
                                                <div key={row.enrollmentId}
                                                    className={`att-table-row${row.alreadyMarked ? " att-table-row--marked" : ""}`}>
                                                    <span className="att-row-num">{i + 1}</span>
                                                    <div className="att-row-student">
                                                        <div className="att-avatar" style={{ background: cfg.bg, color: cfg.color }}>
                                                            {row.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="att-row-name">{row.name}</div>
                                                            <div className="att-row-id">{row.studentCode}</div>
                                                        </div>
                                                        {row.alreadyMarked && (
                                                            <span className="att-marked-badge">✓ Marked</span>
                                                        )}
                                                    </div>
                                                    <div className="att-status-btns">
                                                        {(Object.keys(STATUS_CFG) as AttStatus[]).map(s => (
                                                            <button key={s}
                                                                className={`att-status-btn${row.status === s ? " att-status-btn--active" : ""}`}
                                                                style={row.status === s ? { background: STATUS_CFG[s].bg, color: STATUS_CFG[s].color, borderColor: STATUS_CFG[s].border } : {}}
                                                                onClick={() => setStatus(row.enrollmentId, s)}>
                                                                {STATUS_CFG[s].icon}
                                                                {STATUS_CFG[s].label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <input className="att-remark-input" placeholder="Remark..."
                                                        value={row.remark}
                                                        onChange={e => setRemark(row.enrollmentId, e.target.value)} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Save bar */}
                                {rows.length > 0 && (
                                    <div className="att-save-bar">
                                        <span className="att-save-info">
                                            {fmtDate(date)} · {rows.length} students · {courses.find(c => c._id === courseId)?.name}
                                        </span>
                                        <button className="att-save-btn" onClick={handleSave} disabled={saving}>
                                            <Save size={13} />
                                            {saving ? "Saving..." : "Save Attendance"}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="att-empty">
                                <CalendarDays size={32} style={{ opacity: .2, marginBottom: 12 }} />
                                <div style={{ fontSize: 14, marginBottom: 4 }}>Course select karo</div>
                                <div style={{ fontSize: 12, color: "var(--cp-muted)" }}>
                                    Upar course chip pe click karo ya dropdown se chunno
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ═══ OVERVIEW TAB ═══ */}
                {tab === "overview" && (
                    <>
                        <div className="att-kpi-row">
                            <div className="att-kpi att-kpi--accent">
                                <div className="att-kpi-label"><Users size={11} /> Total Students</div>
                                <div className="att-kpi-val">{allDocs.length}</div>
                            </div>
                            <div className="att-kpi att-kpi--green">
                                <div className="att-kpi-label"><TrendingUp size={11} /> Avg Attendance</div>
                                <div className="att-kpi-val">{avgPct}%</div>
                            </div>
                            <div className="att-kpi att-kpi--red">
                                <div className="att-kpi-label"><AlertTriangle size={11} /> Below 75%</div>
                                <div className="att-kpi-val">{below75}</div>
                            </div>
                        </div>

                        <div className="att-search-wrap">
                            <Search size={13} className="att-search-icon" />
                            <input className="att-search" placeholder="Search student..."
                                value={ovSearch} onChange={e => { setOvSearch(e.target.value); setOvPage(1); }} />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {ovPaged.length === 0 ? (
                                <div className="att-empty"><div>No records found</div></div>
                            ) : ovPaged.map(doc => {
                                const pct   = doc.stats?.percentage ?? 0;
                                const color = pct >= 75 ? "var(--cp-success)" : pct >= 50 ? "var(--cp-warning)" : "var(--cp-danger)";
                                return (
                                    <div key={doc._id} className="att-ov-card">
                                        <div className="att-ov-left">
                                            <div className="att-avatar" style={{ background: `color-mix(in srgb,${color} 15%,transparent)`, color }}>
                                                {doc.student?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="att-row-name">{doc.student?.name}</div>
                                                <div className="att-row-id">{doc.student?.studentId} · {doc.course?.name}</div>
                                            </div>
                                        </div>
                                        <div className="att-ov-right">
                                            <div className="att-chip-row">
                                                {(Object.keys(STATUS_CFG) as AttStatus[]).map(s => (
                                                    <span key={s} className="att-ov-chip"
                                                        style={{ color: STATUS_CFG[s].color, background: STATUS_CFG[s].bg, borderColor: STATUS_CFG[s].border }}>
                                                        {(doc.stats as any)?.[s] ?? 0} {s}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="att-pct-wrap">
                                                <div className="att-pct-track">
                                                    <div className="att-pct-fill" style={{ width: `${pct}%`, background: color }} />
                                                </div>
                                                <span style={{ color, fontSize: 12, fontWeight: 700, minWidth: 36 }}>{pct}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {ovTotalPages > 1 && (
                            <div className="att-pag">
                                <button className="att-pag-btn" disabled={ovPage === 1} onClick={() => setOvPage(p => p - 1)}>
                                    <ChevronLeft size={13} /> Prev
                                </button>
                                <span className="att-pag-info">Page {ovPage} of {ovTotalPages}</span>
                                <button className="att-pag-btn" disabled={ovPage === ovTotalPages} onClick={() => setOvPage(p => p + 1)}>
                                    Next <ChevronRight size={13} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

.att-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:14px; }

.att-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); animation:attIn .2s ease; }
.att-toast--success { background:rgba(34,197,94,0.12); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); }
.att-toast--error   { background:rgba(239,68,68,0.12);  color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.3); }
@keyframes attIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

.att-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.att-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
.att-sub    { font-size:12px; color:var(--cp-muted); margin-top:3px; }
.att-tabs   { display:flex; gap:4px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:10px; padding:4px; }
.att-tab    { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:7px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; color:var(--cp-muted); background:transparent; transition:all .15s; }
.att-tab--active { background:var(--cp-surface); color:var(--cp-accent); box-shadow:0 1px 4px rgba(0,0,0,.15); }
.att-tab:hover:not(.att-tab--active) { color:var(--cp-subtext); }

/* Course Summary Strip */
.att-course-strip { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:12px 16px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; }
.att-strip-label  { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); white-space:nowrap; margin-right:4px; }
.att-course-chip  { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:100px; border:1px solid var(--cp-border); background:var(--cp-surface2); cursor:pointer; transition:all .14s; font-family:'Plus Jakarta Sans',sans-serif; }
.att-course-chip:hover { border-color:var(--cp-accent); background:var(--cp-accent-glow); }
.att-course-chip--active { border-color:var(--cp-accent); background:var(--cp-accent-glow); }
.att-chip-name  { font-size:11px; font-weight:600; color:var(--cp-subtext); }
.att-course-chip--active .att-chip-name { color:var(--cp-accent); }
.att-chip-badge { font-size:10px; font-weight:800; padding:1px 7px; border-radius:100px; background:var(--cp-border); color:var(--cp-muted); }
.att-course-chip--active .att-chip-badge { background:color-mix(in srgb,var(--cp-accent) 25%,transparent); color:var(--cp-accent); }

.att-filter-bar { display:flex; gap:12px; flex-wrap:wrap; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; padding:16px; }
.att-field  { display:flex; flex-direction:column; gap:5px; flex:1; min-width:180px; }
.att-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }
.att-select, .att-input { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; color:var(--cp-text); outline:none; transition:border-color .15s; width:100%; }
.att-select:focus,.att-input:focus { border-color:var(--cp-accent); }
.att-select option { background:var(--cp-surface); }

.att-summary-bar { display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
.att-sum-chip { font-size:11px; font-weight:700; padding:4px 11px; border-radius:100px; border:1px solid; }
.att-sum-chip--green  { background:rgba(34,197,94,0.1);   color:var(--cp-success); border-color:rgba(34,197,94,0.3);  }
.att-sum-chip--red    { background:rgba(239,68,68,0.1);   color:var(--cp-danger);  border-color:rgba(239,68,68,0.3);  }
.att-sum-chip--amber  { background:rgba(245,158,11,0.1);  color:var(--cp-warning); border-color:rgba(245,158,11,0.3); }
.att-sum-chip--purple { background:rgba(167,139,250,0.1); color:#a78bfa;           border-color:rgba(167,139,250,0.3);}
.att-bulk-label { font-size:11px; color:var(--cp-muted); font-weight:600; }
.att-bulk-btn { font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:4px 10px; border-radius:7px; border:1px solid; cursor:pointer; transition:opacity .13s; }
.att-bulk-btn:hover { opacity:.75; }

.att-search-wrap { position:relative; max-width:300px; }
.att-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--cp-muted); pointer-events:none; }
.att-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:9px; color:var(--cp-text); font-size:13px; outline:none; transition:border-color .15s; }
.att-search:focus { border-color:var(--cp-accent); }
.att-search::placeholder { color:var(--cp-muted); }

.att-table-wrap { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
.att-table-head { display:grid; grid-template-columns:36px 1.4fr 1.8fr 1fr; gap:10px; padding:10px 16px; background:var(--cp-surface2); border-bottom:1px solid var(--cp-border); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--cp-muted); }
.att-table-row  { display:grid; grid-template-columns:36px 1.4fr 1.8fr 1fr; gap:10px; padding:11px 16px; border-top:1px solid var(--cp-border); align-items:center; transition:background .12s; }
.att-table-row:hover { background:var(--cp-accent-glow); }
.att-table-row--marked { background:rgba(34,197,94,0.02); }
@media(max-width:760px){
    .att-table-head { grid-template-columns:28px 1fr; }
    .att-table-row  { grid-template-columns:28px 1fr; row-gap:8px; }
    .att-status-btns, .att-remark-input { grid-column:2; }
}

.att-row-num  { font-size:10px; color:var(--cp-border2); font-weight:600; text-align:center; }
.att-row-student { display:flex; align-items:center; gap:9px; }
.att-avatar { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; }
.att-row-name { font-size:12.5px; color:var(--cp-text); font-weight:600; }
.att-row-id   { font-size:10px; color:var(--cp-muted); margin-top:1px; }
.att-marked-badge { font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; background:rgba(34,197,94,0.1); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); margin-left:auto; flex-shrink:0; }

.att-status-btns { display:flex; gap:4px; flex-wrap:wrap; }
.att-status-btn { display:inline-flex; align-items:center; gap:4px; font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:5px 9px; border-radius:7px; border:1px solid var(--cp-border); background:var(--cp-bg); color:var(--cp-muted); cursor:pointer; transition:all .13s; white-space:nowrap; }
.att-status-btn:hover:not(.att-status-btn--active) { border-color:var(--cp-border2); color:var(--cp-subtext); }

.att-remark-input { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; padding:7px 10px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:7px; color:var(--cp-subtext); outline:none; width:100%; transition:border-color .15s; }
.att-remark-input:focus { border-color:var(--cp-accent); }
.att-remark-input::placeholder { color:var(--cp-muted); }

.att-save-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; padding:14px 18px; position:sticky; bottom:0; box-shadow:0 -4px 16px rgba(0,0,0,.1); }
.att-save-info { font-size:12px; color:var(--cp-muted); }
.att-save-btn  { display:inline-flex; align-items:center; gap:7px; padding:10px 22px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; }
.att-save-btn:hover    { opacity:.88; }
.att-save-btn:disabled { opacity:.5; cursor:not-allowed; }

.att-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
@media(max-width:600px){ .att-kpi-row { grid-template-columns:1fr 1fr; } }
.att-kpi           { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:10px; padding:14px 16px; border-left:3px solid; }
.att-kpi--accent   { border-left-color:var(--cp-accent); }
.att-kpi--green    { border-left-color:var(--cp-success); }
.att-kpi--red      { border-left-color:var(--cp-danger); }
.att-kpi-label { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); margin-bottom:6px; }
.att-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:var(--cp-text); }

.att-ov-card { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; padding:13px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; transition:border-color .13s; }
.att-ov-card:hover { border-color:var(--cp-border2); }
.att-ov-left  { display:flex; align-items:center; gap:10px; }
.att-ov-right { display:flex; flex-direction:column; gap:7px; align-items:flex-end; }
.att-chip-row { display:flex; gap:4px; flex-wrap:wrap; justify-content:flex-end; }
.att-ov-chip  { font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px; border:1px solid; }
.att-pct-wrap  { display:flex; align-items:center; gap:8px; }
.att-pct-track { width:80px; height:4px; background:var(--cp-border); border-radius:100px; overflow:hidden; }
.att-pct-fill  { height:100%; border-radius:100px; transition:width .4s; }

.att-pag     { display:flex; align-items:center; justify-content:center; gap:10px; }
.att-pag-btn { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
.att-pag-btn:hover:not(:disabled) { border-color:var(--cp-accent); color:var(--cp-accent); }
.att-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
.att-pag-info { font-size:12px; color:var(--cp-muted); }

.att-loading { display:flex; align-items:center; gap:10px; padding:32px; color:var(--cp-muted); font-size:13px; }
.att-spinner { width:18px; height:18px; border:2px solid var(--cp-border); border-top-color:var(--cp-accent); border-radius:50%; animation:attSpin .7s linear infinite; }
@keyframes attSpin { to{transform:rotate(360deg)} }

.att-empty { background:var(--cp-surface); border:1px dashed var(--cp-border); border-radius:12px; padding:48px; text-align:center; color:var(--cp-muted); font-size:13px; display:flex; flex-direction:column; align-items:center; }
`;