"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    CalendarDays, ChevronLeft, ChevronRight, Search,
    CheckCircle2, XCircle, Clock, Coffee, Save, Users, TrendingUp, AlertTriangle
} from "lucide-react";

type AttStatus = "present" | "absent" | "late" | "holiday";

interface StudentRow {
    enrollmentId: string;
    studentId:    string;
    studentDbId:  string;
    courseId:     string;
    name:         string;
    studentCode:  string;
    courseName:   string;
    status:       AttStatus;
    remark:       string;
    alreadyMarked: boolean;
}

interface AttDoc {
    _id:        string;
    student:    { name: string; studentId: string };
    course:     { name: string; _id: string };
    enrollment: { _id: string };
    stats:      { total: number; present: number; absent: number; late: number; holiday: number; percentage: number };
    records:    { date: string; status: AttStatus; remark?: string }[];
    todayRecord: { status: AttStatus; remark?: string } | null;
}

interface Course { _id: string; name: string; }

const STATUS_CFG: Record<AttStatus, { label: string; color: string; bg: string; border: string }> = {
    present: { label: "Present",  color: "#22c55e", bg: "#052e16", border: "#166534" },
    absent:  { label: "Absent",   color: "#ef4444", bg: "#2d0a0a", border: "#7f1d1d" },
    late:    { label: "Late",     color: "#f59e0b", bg: "#2d1a00", border: "#78350f" },
    holiday: { label: "Holiday",  color: "#60a5fa", bg: "#0c1a2e", border: "#1e3a5f" },
};

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function isoToday() {
    return new Date().toISOString().split("T")[0];
}

export default function AdminAttendancePage() {
    const [courses,     setCourses]     = useState<Course[]>([]);
    const [courseId,    setCourseId]    = useState("");
    const [date,        setDate]        = useState(isoToday());
    const [rows,        setRows]        = useState<StudentRow[]>([]);
    const [search,      setSearch]      = useState("");
    const [saving,      setSaving]      = useState(false);
    const [loading,     setLoading]     = useState(false);
    const [toast,       setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Overview tab
    const [allDocs,     setAllDocs]     = useState<AttDoc[]>([]);
    const [tab,         setTab]         = useState<"mark" | "overview">("mark");
    const [ovSearch,    setOvSearch]    = useState("");
    const [ovPage,      setOvPage]      = useState(1);
    const OV_LIMIT = 12;

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Load courses
    useEffect(() => {
        fetchWithAuth("/api/admin/courses").then(r => r.json())
            .then(d => setCourses(Array.isArray(d) ? d : (d.courses || [])));
    }, []);

    // Load attendance overview (all docs)
    const loadOverview = useCallback(async () => {
        const res = await fetchWithAuth("/api/admin/attendance");
        const d   = await res.json();
        setAllDocs(d.attendance || []);
    }, []);

    useEffect(() => { loadOverview(); }, [loadOverview]);

    // Load students for selected course + date
    const loadStudents = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        try {
            // Single call — returns both enrollments + attendance docs
            const res  = await fetchWithAuth(`/api/admin/attendance?courseId=${courseId}&date=${date}`);
            const data = await res.json();

            const enrollments: any[] = data.enrollments || [];
            const attDocs: AttDoc[]  = data.attendance  || [];

            // Build a map: enrollmentId -> todayRecord
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
                    studentId:     e.student?._id ?? e.student,
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
        } catch {
            showToast("Students load nahi hue", "error");
        } finally {
            setLoading(false);
        }
    }, [courseId, date]);

    useEffect(() => { loadStudents(); }, [loadStudents]);

    const setStatus = (enrollmentId: string, status: AttStatus) =>
        setRows(prev => prev.map(r => r.enrollmentId === enrollmentId ? { ...r, status } : r));

    const setRemark = (enrollmentId: string, remark: string) =>
        setRows(prev => prev.map(r => r.enrollmentId === enrollmentId ? { ...r, remark } : r));

    const markAll = (status: AttStatus) =>
        setRows(prev => prev.map(r => ({ ...r, status })));

    const handleSave = async () => {
        if (!rows.length) return;
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/admin/attendance", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
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
        } catch (e: any) {
            showToast(e.message || "Save nahi hua", "error");
        } finally {
            setSaving(false);
        }
    };

    const filtered = rows.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.studentCode.toLowerCase().includes(search.toLowerCase())
    );

    // Overview filtered + paged
    const ovFiltered = allDocs.filter(d =>
        d.student?.name?.toLowerCase().includes(ovSearch.toLowerCase()) ||
        d.student?.studentId?.toLowerCase().includes(ovSearch.toLowerCase())
    );
    const ovTotalPages = Math.ceil(ovFiltered.length / OV_LIMIT) || 1;
    const ovPaged      = ovFiltered.slice((ovPage - 1) * OV_LIMIT, ovPage * OV_LIMIT);

    const avgPct   = allDocs.length > 0
        ? Math.round(allDocs.reduce((s, a) => s + (a.stats?.percentage || 0), 0) / allDocs.length)
        : 0;
    const below75  = allDocs.filter(a => (a.stats?.percentage || 0) < 75).length;

    const presentCount = rows.filter(r => r.status === "present").length;
    const absentCount  = rows.filter(r => r.status === "absent").length;
    const lateCount    = rows.filter(r => r.status === "late").length;

    return (
        <>
            <style>{styles}</style>
            {toast && <div className={`att-toast ${toast.type}`}>{toast.msg}</div>}

            <div className="att-root">

                {/* Header */}
                <div className="att-header">
                    <div>
                        <h1 className="att-title">Attendance</h1>
                        <p className="att-sub">Date-wise bulk attendance manage karo</p>
                    </div>
                    <div className="att-tabs">
                        <button className={`att-tab ${tab === "mark" ? "active" : ""}`} onClick={() => setTab("mark")}>
                            <CalendarDays size={13} /> Mark Attendance
                        </button>
                        <button className={`att-tab ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
                            <TrendingUp size={13} /> Overview
                        </button>
                    </div>
                </div>

                {/* ═══ MARK ATTENDANCE TAB ═══ */}
                {tab === "mark" && (
                    <>
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

                        {courseId && (
                            <>
                                {/* Summary bar */}
                                <div className="att-summary-bar">
                                    <div className="att-sum-chip green">{presentCount} Present</div>
                                    <div className="att-sum-chip red">{absentCount} Absent</div>
                                    <div className="att-sum-chip amber">{lateCount} Late</div>
                                    <div style={{ flex: 1 }} />
                                    <span className="att-bulk-label">Mark All:</span>
                                    {(["present", "absent", "late", "holiday"] as AttStatus[]).map(s => (
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
                                        {filtered.map((row, i) => (
                                            <div key={row.enrollmentId} className={`att-table-row ${row.alreadyMarked ? "marked" : ""}`}>
                                                <span className="att-row-num">{i + 1}</span>
                                                <div className="att-row-student">
                                                    <div className="att-avatar" style={{ background: STATUS_CFG[row.status].bg, color: STATUS_CFG[row.status].color }}>
                                                        {row.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="att-row-name">{row.name}</div>
                                                        <div className="att-row-id">{row.studentCode}</div>
                                                    </div>
                                                    {row.alreadyMarked && <span className="att-marked-badge">✓ Marked</span>}
                                                </div>
                                                <div className="att-status-btns">
                                                    {(["present", "absent", "late", "holiday"] as AttStatus[]).map(s => (
                                                        <button key={s}
                                                            className={`att-status-btn ${row.status === s ? "active" : ""}`}
                                                            style={row.status === s
                                                                ? { background: STATUS_CFG[s].bg, color: STATUS_CFG[s].color, borderColor: STATUS_CFG[s].border }
                                                                : {}}
                                                            onClick={() => setStatus(row.enrollmentId, s)}>
                                                            {s === "present" && <CheckCircle2 size={10} />}
                                                            {s === "absent"  && <XCircle      size={10} />}
                                                            {s === "late"    && <Clock         size={10} />}
                                                            {s === "holiday" && <Coffee        size={10} />}
                                                            {STATUS_CFG[s].label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <input className="att-remark-input" placeholder="Remark..."
                                                    value={row.remark}
                                                    onChange={e => setRemark(row.enrollmentId, e.target.value)} />
                                            </div>
                                        ))}
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
                        )}

                        {!courseId && (
                            <div className="att-empty">
                                <CalendarDays size={32} style={{ opacity: .2, marginBottom: 12 }} />
                                <div style={{ fontSize: 14, marginBottom: 4 }}>Course select karo</div>
                                <div style={{ fontSize: 12, color: "#334155" }}>Phir date choose karo aur saare students ki attendance ek saath mark karo</div>
                            </div>
                        )}
                    </>
                )}

                {/* ═══ OVERVIEW TAB ═══ */}
                {tab === "overview" && (
                    <>
                        {/* KPIs */}
                        <div className="att-kpi-row">
                            <div className="att-kpi amber">
                                <div className="att-kpi-label"><Users size={11} /> Total Students</div>
                                <div className="att-kpi-val">{allDocs.length}</div>
                            </div>
                            <div className="att-kpi green">
                                <div className="att-kpi-label"><TrendingUp size={11} /> Avg Attendance</div>
                                <div className="att-kpi-val">{avgPct}%</div>
                            </div>
                            <div className="att-kpi red">
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
                                const color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                                return (
                                    <div key={doc._id} className="att-ov-card">
                                        <div className="att-ov-left">
                                            <div className="att-avatar" style={{ background: `${color}22`, color }}>
                                                {doc.student?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="att-row-name">{doc.student?.name}</div>
                                                <div className="att-row-id">{doc.student?.studentId} · {doc.course?.name}</div>
                                            </div>
                                        </div>
                                        <div className="att-ov-right">
                                            <div className="att-chip-row">
                                                {(["present","absent","late","holiday"] as AttStatus[]).map(s => (
                                                    <span key={s} className="att-chip"
                                                        style={{ color: STATUS_CFG[s].color, background: STATUS_CFG[s].bg, border: `1px solid ${STATUS_CFG[s].border}` }}>
                                                        {doc.stats?.[s] ?? 0} {s}
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

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

.att-root  { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:16px; }
.att-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.5); animation:attToastIn .2s ease; }
.att-toast.success { background:#052e16; color:#86efac; border:1px solid #166534; }
.att-toast.error   { background:#2d0a0a; color:#fca5a5; border:1px solid #7f1d1d; }
@keyframes attToastIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

.att-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.att-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
.att-sub    { font-size:12px; color:#475569; margin-top:3px; }

.att-tabs { display:flex; gap:4px; background:#111; border:1px solid #222; border-radius:10px; padding:4px; }
.att-tab  { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:7px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; color:#475569; background:transparent; transition:all .15s; }
.att-tab.active { background:#1a1a1a; color:#f1f5f9; border:1px solid #2a2a2a; }
.att-tab:hover:not(.active) { color:#94a3b8; }

.att-filter-bar { display:flex; gap:12px; flex-wrap:wrap; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; padding:16px; }
.att-field  { display:flex; flex-direction:column; gap:5px; flex:1; min-width:180px; }
.att-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }
.att-select, .att-input { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px; background:#111; border:1px solid #2a2a2a; border-radius:8px; color:#f1f5f9; outline:none; transition:border-color .15s; width:100%; }
.att-select:focus,.att-input:focus { border-color:#f59e0b; }
.att-select option { background:#1a1a1a; }

.att-summary-bar { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.att-sum-chip { font-size:11px; font-weight:700; padding:4px 12px; border-radius:100px; }
.att-sum-chip.green  { background:rgba(34,197,94,.1);  color:#22c55e; border:1px solid #166534; }
.att-sum-chip.red    { background:rgba(239,68,68,.1);  color:#ef4444; border:1px solid #7f1d1d; }
.att-sum-chip.amber  { background:rgba(245,158,11,.1); color:#f59e0b; border:1px solid #78350f; }
.att-bulk-label { font-size:11px; color:#475569; font-weight:600; }
.att-bulk-btn { font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:4px 11px; border-radius:7px; border:1px solid; cursor:pointer; transition:opacity .13s; }
.att-bulk-btn:hover { opacity:.8; }

.att-search-wrap { position:relative; max-width:300px; }
.att-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#475569; pointer-events:none; }
.att-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:9px; color:#f1f5f9; font-size:13px; outline:none; }
.att-search:focus { border-color:#f59e0b; }
.att-search::placeholder { color:#475569; }

.att-table-wrap { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
.att-table-head { display:grid; grid-template-columns:40px 1fr 1fr 1fr; gap:12px; padding:10px 16px; background:#1f1f1f; border-bottom:1px solid #222; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#334155; }
.att-table-row  { display:grid; grid-template-columns:40px 1fr 1fr 1fr; gap:12px; padding:12px 16px; border-top:1px solid #1f1f1f; align-items:center; transition:background .12s; }
.att-table-row:hover  { background:rgba(245,158,11,.02); }
.att-table-row.marked { background:rgba(34,197,94,.02); }
@media(max-width:700px) {
    .att-table-head { grid-template-columns:32px 1fr; }
    .att-table-row  { grid-template-columns:32px 1fr; row-gap:8px; }
    .att-status-btns,.att-remark-input { grid-column:2; }
}

.att-row-num  { font-size:10px; color:#334155; font-weight:600; text-align:center; }
.att-row-student { display:flex; align-items:center; gap:9px; }
.att-avatar   { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; }
.att-row-name { font-size:12.5px; color:#e2e8f0; font-weight:600; }
.att-row-id   { font-size:10px; color:#475569; margin-top:1px; }
.att-marked-badge { font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; background:rgba(34,197,94,.1); color:#22c55e; border:1px solid #166534; margin-left:6px; }

.att-status-btns { display:flex; gap:5px; flex-wrap:wrap; }
.att-status-btn { display:inline-flex; align-items:center; gap:4px; font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:5px 10px; border-radius:7px; border:1px solid #2a2a2a; background:#111; color:#475569; cursor:pointer; transition:all .13s; }
.att-status-btn.active { }
.att-status-btn:hover:not(.active) { border-color:#3a3a3a; color:#94a3b8; }

.att-remark-input { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; padding:7px 10px; background:#111; border:1px solid #2a2a2a; border-radius:7px; color:#94a3b8; outline:none; width:100%; }
.att-remark-input:focus { border-color:#f59e0b; }
.att-remark-input::placeholder { color:#334155; }

.att-save-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; padding:14px 18px; position:sticky; bottom:0; }
.att-save-info { font-size:12px; color:#64748b; }
.att-save-btn  { display:inline-flex; align-items:center; gap:7px; padding:10px 22px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; transition:opacity .15s; }
.att-save-btn:hover    { opacity:.88; }
.att-save-btn:disabled { opacity:.5; cursor:not-allowed; }

.att-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
@media(max-width:600px){ .att-kpi-row { grid-template-columns:1fr 1fr; } }
.att-kpi       { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:14px 16px; }
.att-kpi.amber { border-left:3px solid #f59e0b; }
.att-kpi.green { border-left:3px solid #22c55e; }
.att-kpi.red   { border-left:3px solid #ef4444; }
.att-kpi-label { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; margin-bottom:6px; }
.att-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#f1f5f9; }

.att-ov-card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; transition:border-color .13s; }
.att-ov-card:hover { border-color:#2e2e2e; }
.att-ov-left  { display:flex; align-items:center; gap:10px; }
.att-ov-right { display:flex; flex-direction:column; gap:7px; align-items:flex-end; }
.att-chip-row { display:flex; gap:5px; flex-wrap:wrap; justify-content:flex-end; }
.att-chip     { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; }
.att-pct-wrap  { display:flex; align-items:center; gap:8px; }
.att-pct-track { width:80px; height:4px; background:#222; border-radius:100px; overflow:hidden; }
.att-pct-fill  { height:100%; border-radius:100px; transition:width .4s; }

.att-pag     { display:flex; align-items:center; justify-content:center; gap:10px; }
.att-pag-btn { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
.att-pag-btn:hover:not(:disabled) { border-color:#f59e0b; color:#f59e0b; }
.att-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
.att-pag-info { font-size:12px; color:#475569; }

.att-loading { display:flex; align-items:center; gap:10px; padding:32px; color:#475569; font-size:13px; }
.att-spinner { width:18px; height:18px; border:2px solid #2a2a2a; border-top-color:#f59e0b; border-radius:50%; animation:attSpin .7s linear infinite; }
@keyframes attSpin { to { transform:rotate(360deg); } }

.att-empty { background:#1a1a1a; border:1px dashed #2a2a2a; border-radius:12px; padding:48px; text-align:center; color:#475569; font-size:13px; display:flex; flex-direction:column; align-items:center; }
`;