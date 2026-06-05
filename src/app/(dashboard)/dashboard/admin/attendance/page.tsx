// src/app/(dashboard)/dashboard/admin/attendance/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    CalendarDays, ChevronLeft, ChevronRight, Search,
    CheckCircle2, XCircle, Clock, Coffee, Save,
    Users, TrendingUp, AlertTriangle, Umbrella,
    QrCode, BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

type AttStatus = "present" | "absent" | "late" | "holiday" | "leave";

interface StudentRow {
    enrollmentId: string;
    studentDbId: string;
    studentCode: string;
    courseId: string;
    name: string;
    courseName: string;
    status: AttStatus;
    remark: string;
    alreadyMarked: boolean;
    inTime?: string;
    outTime?: string;
    markedVia?: string;
}

interface AttDoc {
    _id: string;
    enrollmentId: string;
    student: { _id?: string; name: string; studentId: string };
    course: { name: string; _id: string };
    stats: {
        total: number; present: number; absent: number;
        late: number; holiday: number; leave: number; percentage: number
    };
    hasAttendance: boolean;
    records: any[];
}

// ✅ NEW
interface DailyStat {
    date: string;
    present: number;
    absent: number;
    late: number;
    holiday: number;
    leave: number;
    total: number;
}

interface CourseDailyStat {
    courseId: string;
    courseName: string;
    totalStudents: number;
    daily: DailyStat[];
}

interface Course { _id: string; name: string; }
interface CourseSummary { _id: string; name: string; studentCount: number; }

const STATUS_CFG: Record<AttStatus, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
    present: { label: "Present", icon: <CheckCircle2 size={10} />, color: "var(--cp-success)", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.3)" },
    absent: { label: "Absent", icon: <XCircle size={10} />, color: "var(--cp-danger)", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)" },
    late: { label: "Late", icon: <Clock size={10} />, color: "var(--cp-warning)", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
    holiday: { label: "Holiday", icon: <Coffee size={10} />, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.3)" },
    leave: { label: "Leave", icon: <Umbrella size={10} />, color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.3)" },
};

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
}

function fmtDateShort(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short"
    });
}

function isoToday() { return new Date().toISOString().split("T")[0]; }

export default function AdminAttendancePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseId, setCourseId] = useState("");
    const [date, setDate] = useState(isoToday());
    const [rows, setRows] = useState<StudentRow[]>([]);
    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [courseSummary, setCourseSummary] = useState<CourseSummary[]>([]);

    const [allDocs, setAllDocs] = useState<AttDoc[]>([]);
    const [tab, setTab] = useState<"mark" | "overview" | "daily">("mark");
    const [ovSearch, setOvSearch] = useState("");
    const [ovPage, setOvPage] = useState(1);
    const OV_LIMIT = 12;

    const [ovCourseFilter, setOvCourseFilter] = useState("all");
    const [ovStatusFilter, setOvStatusFilter] = useState("all"); // all|good|warning|danger
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    // ✅ NEW - Daily states
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
    const [courseDailyStats, setCourseDailyStats] = useState<CourseDailyStat[]>([]);
    const [dailyFilterCourse, setDailyFilterCourse] = useState("all");
    const [dailyPage, setDailyPage] = useState(1);
    const DAILY_LIMIT = 15;

    const router = useRouter();

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchWithAuth("/api/admin/courses")
            .then(r => r.json())
            .then(d => setCourses(Array.isArray(d) ? d : (d.courses || [])));
    }, []);

    const loadOverview = useCallback(async () => {
        const res = await fetchWithAuth("/api/admin/attendance");
        const d = await res.json();
        setAllDocs(d.attendance || []);
        setCourseSummary(d.courseSummary || []);
        setDailyStats(d.dailyStats || []);           // ✅ NEW
        setCourseDailyStats(d.courseDailyStats || []); // ✅ NEW
    }, []);

    useEffect(() => { loadOverview(); }, [loadOverview]);

    const loadStudents = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/api/admin/attendance?courseId=${courseId}&date=${date}`);
            const data = await res.json();
            const enrollments: any[] = data.enrollments || [];
            const attDocs: any[] = data.attendance || [];

            const attMap: Record<string, any> = {};
            for (const doc of attDocs) {
                const eid = typeof doc.enrollment === "string" ? doc.enrollment : doc.enrollment?._id;
                attMap[eid] = doc.todayRecord ? {
                    status: doc.todayRecord.status,
                    remark: doc.todayRecord.remark ?? "",
                    inTime: doc.todayRecord.inTime ?? null,
                    outTime: doc.todayRecord.outTime ?? null,
                    markedVia: doc.todayRecord.markedVia ?? "manual",
                } : null;
            }

            const built: StudentRow[] = enrollments.map((e: any) => {
                const existing = attMap[e._id] ?? null;
                return {
                    enrollmentId: e._id,
                    studentDbId: e.student?._id ?? e.student,
                    studentCode: e.student?.studentId ?? "",
                    courseId: typeof e.course === "string" ? e.course : e.course?._id,
                    name: e.student?.name ?? "—",
                    courseName: typeof e.course === "string" ? "" : (e.course?.name ?? ""),
                    status: existing?.status ?? "present",
                    remark: existing?.remark ?? "",
                    alreadyMarked: existing !== null,
                    inTime: existing?.inTime ?? null,
                    outTime: existing?.outTime ?? null,
                    markedVia: existing?.markedVia ?? "manual",
                };
            });
            setRows(built);
        } catch { showToast("Students load nahi hue", "error"); }
        finally { setLoading(false); }
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
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    records: rows.map(r => ({
                        enrollmentId: r.enrollmentId,
                        studentId: r.studentDbId,
                        courseId: r.courseId,
                        status: r.status,
                        remark: r.remark,
                    })),
                }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.message);
            showToast(`${rows.length} students ki attendance save ho gayi ✓`, "success");
            setRows(prev => prev.map(r => ({ ...r, alreadyMarked: true })));
            loadOverview();
        } catch (e: any) { showToast(e.message || "Save nahi hua", "error"); }
        finally { setSaving(false); }
    };

    // ── Computed ──────────────────────────────────────────────────────────────
    const filtered = rows.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.studentCode.toLowerCase().includes(search.toLowerCase())
    );

    const ovFiltered = allDocs.filter(d =>
        d.student?.name?.toLowerCase().includes(ovSearch.toLowerCase()) ||
        d.student?.studentId?.toLowerCase().includes(ovSearch.toLowerCase())
    );
    const ovTotalPages = Math.ceil(ovFiltered.length / OV_LIMIT) || 1;
    const ovPaged = ovFiltered.slice((ovPage - 1) * OV_LIMIT, ovPage * OV_LIMIT);

    const avgPct = allDocs.length > 0
        ? Math.round(allDocs.reduce((s, a) => s + (a.stats?.percentage || 0), 0) / allDocs.length)
        : 0;
    const below75 = allDocs.filter(a => (a.stats?.percentage || 0) < 75).length;

    const presentCount = rows.filter(r => r.status === "present").length;
    const absentCount = rows.filter(r => r.status === "absent").length;
    const lateCount = rows.filter(r => r.status === "late").length;
    const leaveCount = rows.filter(r => r.status === "leave").length;

    // ✅ Daily tab computed
    const activeDailyData = dailyFilterCourse === "all"
        ? dailyStats
        : (courseDailyStats.find(c => c.courseId === dailyFilterCourse)?.daily ?? []);

    const dailyTotalPages = Math.ceil(activeDailyData.length / DAILY_LIMIT) || 1;
    const dailyPaged = activeDailyData.slice(
        (dailyPage - 1) * DAILY_LIMIT,
        dailyPage * DAILY_LIMIT
    );

    const activeCourseStudents = dailyFilterCourse === "all"
        ? courseSummary.reduce((s, c) => s + c.studentCount, 0)
        : (courseDailyStats.find(c => c.courseId === dailyFilterCourse)?.totalStudents ?? 0);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{styles}</style>
            {toast && (
                <div className={`att-toast att-toast--${toast.type}`}>{toast.msg}</div>
            )}

            <div className="att-root">

                {/* Header */}
                <div className="att-header">
                    <div>
                        <h1 className="att-title">Attendance</h1>
                        <p className="att-sub">Date-wise bulk attendance manage karo</p>
                    </div>
                    <div className="att-header-actions">
                        <div className="att-tabs">
                            <button
                                className={`att-tab${tab === "mark" ? " att-tab--active" : ""}`}
                                onClick={() => setTab("mark")}
                            >
                                <CalendarDays size={13} /> Mark
                            </button>
                            <button
                                className={`att-tab${tab === "daily" ? " att-tab--active" : ""}`}
                                onClick={() => setTab("daily")}
                            >
                                <BookOpen size={13} /> Daily Register
                            </button>
                            <button
                                className={`att-tab${tab === "overview" ? " att-tab--active" : ""}`}
                                onClick={() => setTab("overview")}
                            >
                                <TrendingUp size={13} /> Overview
                            </button>
                        </div>
                        <button
                            className="att-qr-print-btn"
                            onClick={() => window.open('/api/admin/attendance/qr', '_blank')}
                        >
                            <QrCode size={16} />
                            <span>Print QR</span>
                        </button>
                    </div>
                </div>

                {/* ═══ MARK TAB ═══ */}
                {tab === "mark" && (
                    <>
                        {courseSummary.length > 0 && (
                            <div className="att-course-strip">
                                <span className="att-strip-label">Courses:</span>
                                {courseSummary.map(cs => (
                                    <button
                                        key={cs._id}
                                        className={`att-course-chip${courseId === cs._id ? " att-course-chip--active" : ""}`}
                                        onClick={() => setCourseId(cs._id)}
                                    >
                                        <span className="att-chip-name">{cs.name}</span>
                                        <span className="att-chip-badge">{cs.studentCount}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="att-filter-bar">
                            <div className="att-field">
                                <label className="att-label">Course</label>
                                <select className="att-select" value={courseId} onChange={e => setCourseId(e.target.value)}>
                                    <option value="">-- Course chunno --</option>
                                    {courses.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="att-field">
                                <label className="att-label">Date</label>
                                <input
                                    className="att-input"
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {courseId ? (
                            <>
                                <div className="att-summary-bar">
                                    {[
                                        { key: "present", count: presentCount, cls: "att-sum-chip--green" },
                                        { key: "absent", count: absentCount, cls: "att-sum-chip--red" },
                                        { key: "late", count: lateCount, cls: "att-sum-chip--amber" },
                                        { key: "leave", count: leaveCount, cls: "att-sum-chip--purple" },
                                    ].map(({ key, count, cls }) => (
                                        <div key={key} className={`att-sum-chip ${cls}`}>
                                            {count} {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </div>
                                    ))}
                                    <div style={{ flex: 1 }} />
                                    <span className="att-bulk-label">Mark All:</span>
                                    {(Object.keys(STATUS_CFG) as AttStatus[]).map(s => (
                                        <button
                                            key={s}
                                            className="att-bulk-btn"
                                            style={{ color: STATUS_CFG[s].color, borderColor: STATUS_CFG[s].border, background: STATUS_CFG[s].bg }}
                                            onClick={() => markAll(s)}
                                        >
                                            {STATUS_CFG[s].label}
                                        </button>
                                    ))}
                                </div>

                                <div className="att-search-wrap">
                                    <Search size={13} className="att-search-icon" />
                                    <input
                                        className="att-search"
                                        placeholder="Search student..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>

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
                                        <div className="att-table-head att-table-head--time">
                                            <span>#</span>
                                            <span>Student</span>
                                            <span>Status</span>
                                            <span>IN Time</span>
                                            <span>OUT Time</span>
                                            <span>Remark</span>
                                        </div>
                                        {filtered.map((row, i) => {
                                            const cfg = STATUS_CFG[row.status];
                                            return (
                                                <div
                                                    key={row.enrollmentId}
                                                    className={`att-table-row att-table-row--time${row.alreadyMarked ? " att-table-row--marked" : ""}`}
                                                >
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
                                                            <span className="att-marked-badge">
                                                                {row.markedVia === "qr" ? "📱 QR" : "✓ Manual"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="att-status-btns">
                                                        {(Object.keys(STATUS_CFG) as AttStatus[]).map(s => (
                                                            <button
                                                                key={s}
                                                                className={`att-status-btn${row.status === s ? " att-status-btn--active" : ""}`}
                                                                style={row.status === s ? {
                                                                    background: STATUS_CFG[s].bg,
                                                                    color: STATUS_CFG[s].color,
                                                                    borderColor: STATUS_CFG[s].border,
                                                                } : {}}
                                                                onClick={() => setStatus(row.enrollmentId, s)}
                                                            >
                                                                {STATUS_CFG[s].icon}
                                                                {STATUS_CFG[s].label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="att-time-cell">
                                                        {row.inTime ? (
                                                            <span className="att-time-badge att-time-badge--in">
                                                                🕐 {row.inTime}
                                                            </span>
                                                        ) : (
                                                            <span className="att-time-empty">—</span>
                                                        )}
                                                    </div>
                                                    <div className="att-time-cell">
                                                        {row.outTime ? (
                                                            <span className="att-time-badge att-time-badge--out">
                                                                🚪 {row.outTime}
                                                            </span>
                                                        ) : row.inTime ? (
                                                            <span className="att-time-pending">Pending</span>
                                                        ) : (
                                                            <span className="att-time-empty">—</span>
                                                        )}
                                                    </div>
                                                    <input
                                                        className="att-remark-input"
                                                        placeholder="Remark..."
                                                        value={row.remark}
                                                        onChange={e => setRemark(row.enrollmentId, e.target.value)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

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

                {/* ═══ DAILY REGISTER TAB ═══ */}
                {tab === "daily" && (
                    <>
                        {/* KPI Cards - Today's summary */}
                        {(() => {
                            const todayData = activeDailyData.find(d => d.date === isoToday());
                            const todayPresent = todayData?.present ?? 0;
                            const todayAbsent = todayData?.absent ?? 0;
                            const todayLate = todayData?.late ?? 0;
                            const todayTotal = todayData?.total ?? 0;
                            const todayPct = todayTotal > 0
                                ? Math.round(((todayPresent + todayLate) / todayTotal) * 100)
                                : 0;

                            return (
                                <div className="att-kpi-row att-kpi-row--4">
                                    <div className="att-kpi att-kpi--accent">
                                        <div className="att-kpi-label"><Users size={11} /> Enrolled</div>
                                        <div className="att-kpi-val">{activeCourseStudents}</div>
                                        <div className="att-kpi-sub">Total students</div>
                                    </div>
                                    <div className="att-kpi att-kpi--green">
                                        <div className="att-kpi-label"><CheckCircle2 size={11} /> Today Present</div>
                                        <div className="att-kpi-val">{todayPresent + todayLate}</div>
                                        <div className="att-kpi-sub">{todayLate > 0 ? `incl. ${todayLate} late` : "aaj ke"}</div>
                                    </div>
                                    <div className="att-kpi att-kpi--red">
                                        <div className="att-kpi-label"><XCircle size={11} /> Today Absent</div>
                                        <div className="att-kpi-val">{todayAbsent}</div>
                                        <div className="att-kpi-sub">aaj nahi aaye</div>
                                    </div>
                                    <div className="att-kpi" style={{ borderLeftColor: todayPct >= 75 ? "var(--cp-success)" : "var(--cp-danger)" }}>
                                        <div className="att-kpi-label"><TrendingUp size={11} /> Today %</div>
                                        <div className="att-kpi-val" style={{ color: todayPct >= 75 ? "var(--cp-success)" : "var(--cp-danger)" }}>
                                            {todayPct}%
                                        </div>
                                        <div className="att-kpi-sub">aaj ki attendance</div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Course Filter */}
                        <div className="att-daily-filter">
                            <span className="att-strip-label">Filter by Course:</span>
                            <div className="att-daily-chips">
                                <button
                                    className={`att-course-chip${dailyFilterCourse === "all" ? " att-course-chip--active" : ""}`}
                                    onClick={() => { setDailyFilterCourse("all"); setDailyPage(1); }}
                                >
                                    <span className="att-chip-name">All Courses</span>
                                    <span className="att-chip-badge">{dailyStats.length}</span>
                                </button>
                                {courseDailyStats.map(c => (
                                    <button
                                        key={c.courseId}
                                        className={`att-course-chip${dailyFilterCourse === c.courseId ? " att-course-chip--active" : ""}`}
                                        onClick={() => { setDailyFilterCourse(c.courseId); setDailyPage(1); }}
                                    >
                                        <span className="att-chip-name">{c.courseName}</span>
                                        <span className="att-chip-badge">{c.daily.length}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily Register Table */}
                        {activeDailyData.length === 0 ? (
                            <div className="att-empty">
                                <BookOpen size={28} style={{ opacity: .2, marginBottom: 8 }} />
                                <div>Koi attendance record nahi mila</div>
                                <div style={{ fontSize: 12, color: "var(--cp-muted)", marginTop: 4 }}>
                                    Pehle attendance mark karo
                                </div>
                            </div>
                        ) : (
                            <div className="att-table-wrap">
                                {/* Table Header */}
                                <div className="att-daily-head">
                                    <span>Date</span>
                                    <span style={{ textAlign: "center" }}>Total</span>
                                    <span style={{ textAlign: "center" }}>Present</span>
                                    <span style={{ textAlign: "center" }}>Absent</span>
                                    <span style={{ textAlign: "center" }}>Late</span>
                                    <span style={{ textAlign: "center" }}>Holiday</span>
                                    <span style={{ textAlign: "center" }}>Leave</span>
                                    <span>Attendance %</span>
                                </div>

                                {dailyPaged.map((day, i) => {
                                    const attended = day.present + day.late;
                                    const counted = day.total - day.holiday - day.leave;
                                    const pct = counted > 0 ? Math.round((attended / counted) * 100) : 0;
                                    const pctColor = pct >= 75
                                        ? "var(--cp-success)"
                                        : pct >= 50
                                            ? "var(--cp-warning)"
                                            : "var(--cp-danger)";
                                    const isToday = day.date === isoToday();

                                    return (
                                        <div
                                            key={day.date}
                                            className={`att-daily-row${isToday ? " att-daily-row--today" : ""}`}
                                        >
                                            {/* Date */}
                                            <div className="att-daily-date">
                                                <span className="att-daily-date-main">
                                                    {fmtDateShort(day.date)}
                                                </span>
                                                {isToday && (
                                                    <span className="att-today-badge">Today</span>
                                                )}
                                            </div>

                                            {/* Total */}
                                            <div className="att-daily-cell att-daily-cell--total">
                                                <span className="att-daily-num">{day.total}</span>
                                            </div>

                                            {/* Present */}
                                            <div className="att-daily-cell">
                                                <span
                                                    className="att-daily-badge"
                                                    style={{
                                                        background: "rgba(34,197,94,0.1)",
                                                        color: "var(--cp-success)",
                                                        border: "1px solid rgba(34,197,94,0.25)"
                                                    }}
                                                >
                                                    {day.present}
                                                </span>
                                            </div>

                                            {/* Absent */}
                                            <div className="att-daily-cell">
                                                <span
                                                    className="att-daily-badge"
                                                    style={{
                                                        background: "rgba(239,68,68,0.1)",
                                                        color: "var(--cp-danger)",
                                                        border: "1px solid rgba(239,68,68,0.25)"
                                                    }}
                                                >
                                                    {day.absent}
                                                </span>
                                            </div>

                                            {/* Late */}
                                            <div className="att-daily-cell">
                                                <span
                                                    className="att-daily-badge"
                                                    style={{
                                                        background: "rgba(245,158,11,0.1)",
                                                        color: "var(--cp-warning)",
                                                        border: "1px solid rgba(245,158,11,0.25)"
                                                    }}
                                                >
                                                    {day.late}
                                                </span>
                                            </div>

                                            {/* Holiday */}
                                            <div className="att-daily-cell">
                                                <span
                                                    className="att-daily-badge"
                                                    style={{
                                                        background: "rgba(96,165,250,0.1)",
                                                        color: "#60a5fa",
                                                        border: "1px solid rgba(96,165,250,0.25)"
                                                    }}
                                                >
                                                    {day.holiday}
                                                </span>
                                            </div>

                                            {/* Leave */}
                                            <div className="att-daily-cell">
                                                <span
                                                    className="att-daily-badge"
                                                    style={{
                                                        background: "rgba(167,139,250,0.1)",
                                                        color: "#a78bfa",
                                                        border: "1px solid rgba(167,139,250,0.25)"
                                                    }}
                                                >
                                                    {day.leave}
                                                </span>
                                            </div>

                                            {/* Percentage Bar */}
                                            <div className="att-daily-pct">
                                                <div className="att-daily-bar-wrap">
                                                    <div
                                                        className="att-daily-bar"
                                                        style={{ width: `${pct}%`, background: pctColor }}
                                                    />
                                                </div>
                                                <span
                                                    className="att-daily-pct-label"
                                                    style={{ color: pctColor }}
                                                >
                                                    {pct}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Pagination */}
                                {dailyTotalPages > 1 && (
                                    <div className="att-daily-pag">
                                        <button
                                            className="att-pag-btn"
                                            disabled={dailyPage === 1}
                                            onClick={() => setDailyPage(p => p - 1)}
                                        >
                                            <ChevronLeft size={13} /> Prev
                                        </button>
                                        <span className="att-pag-info">
                                            Page {dailyPage} of {dailyTotalPages}
                                            <span style={{ color: "var(--cp-muted)", marginLeft: 6 }}>
                                                ({activeDailyData.length} days)
                                            </span>
                                        </span>
                                        <button
                                            className="att-pag-btn"
                                            disabled={dailyPage === dailyTotalPages}
                                            onClick={() => setDailyPage(p => p + 1)}
                                        >
                                            Next <ChevronRight size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ═══ OVERVIEW TAB ═══ */}
                {tab === "overview" && (
                    <>
                        {/* KPI Cards */}
                        <div className="att-kpi-row">
                            <div className="att-kpi att-kpi--accent">
                                <div className="att-kpi-label"><Users size={11} /> Total Students</div>
                                <div className="att-kpi-val">{allDocs.length}</div>
                                <div className="att-kpi-sub">Enrolled students</div>
                            </div>
                            <div className="att-kpi att-kpi--green">
                                <div className="att-kpi-label"><TrendingUp size={11} /> Avg Attendance</div>
                                <div className="att-kpi-val">{avgPct}%</div>
                                <div className="att-kpi-sub">Overall average</div>
                            </div>
                            <div className="att-kpi att-kpi--red">
                                <div className="att-kpi-label"><AlertTriangle size={11} /> Below 75%</div>
                                <div className="att-kpi-val">{below75}</div>
                                <div className="att-kpi-sub">Need attention</div>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="ov-filter-row">
                            {/* Search */}
                            <div className="att-search-wrap" style={{ maxWidth: 260, flex: 1 }}>
                                <Search size={13} className="att-search-icon" />
                                <input
                                    className="att-search"
                                    placeholder="Name ya ID se search..."
                                    value={ovSearch}
                                    onChange={e => { setOvSearch(e.target.value); setOvPage(1); }}
                                />
                            </div>

                            {/* Course Filter */}
                            <select
                                className="att-select ov-select"
                                value={ovCourseFilter}
                                onChange={e => { setOvCourseFilter(e.target.value); setOvPage(1); }}
                            >
                                <option value="all">All Courses</option>
                                {courseSummary.map(c => (
                                    <option key={String(c._id)} value={String(c._id)}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                className="att-select ov-select"
                                value={ovStatusFilter}
                                onChange={e => { setOvStatusFilter(e.target.value); setOvPage(1); }}
                            >
                                <option value="all">All Status</option>
                                <option value="good">Good (≥75%)</option>
                                <option value="warning">Warning (50-74%)</option>
                                <option value="danger">Critical (&lt;50%)</option>
                                <option value="none">No Attendance</option>
                            </select>
                        </div>

                        {/* Table */}
                        {(() => {
                            // Apply filters
                            const filtered = allDocs.filter(doc => {
                                const nameMatch =
                                    doc.student?.name?.toLowerCase().includes(ovSearch.toLowerCase()) ||
                                    doc.student?.studentId?.toLowerCase().includes(ovSearch.toLowerCase());

                                const courseMatch =
                                    ovCourseFilter === "all" ||
                                    String(doc.course?._id) === ovCourseFilter;

                                const pct = doc.stats?.percentage ?? 0;
                                const hasAtt = doc.hasAttendance && doc.stats.total > 0;
                                const statusMatch =
                                    ovStatusFilter === "all" ? true :
                                        ovStatusFilter === "good" ? pct >= 75 :
                                            ovStatusFilter === "warning" ? (pct >= 50 && pct < 75) :
                                                ovStatusFilter === "danger" ? (hasAtt && pct < 50) :
                                                    ovStatusFilter === "none" ? !hasAtt : true;

                                return nameMatch && courseMatch && statusMatch;
                            });

                            const totalPages = Math.ceil(filtered.length / OV_LIMIT) || 1;
                            const paged = filtered.slice((ovPage - 1) * OV_LIMIT, ovPage * OV_LIMIT);

                            return (
                                <>
                                    {/* Count info */}
                                    <div className="ov-count-info">
                                        Showing <strong>{filtered.length}</strong> of <strong>{allDocs.length}</strong> students
                                    </div>

                                    {paged.length === 0 ? (
                                        <div className="att-empty">
                                            <Users size={28} style={{ opacity: .2, marginBottom: 8 }} />
                                            <div>Koi student nahi mila</div>
                                            <div style={{ fontSize: 12, color: "var(--cp-muted)", marginTop: 4 }}>
                                                Filter change karo
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="att-table-wrap">
                                            {/* Table Header */}
                                            <div className="ov-table-head">
                                                <span>#</span>
                                                <span>Student</span>
                                                <span>Course</span>
                                                <span style={{ textAlign: "center" }}>Total</span>
                                                <span style={{ textAlign: "center" }}>Present</span>
                                                <span style={{ textAlign: "center" }}>Absent</span>
                                                <span style={{ textAlign: "center" }}>Late</span>
                                                <span>Attendance %</span>
                                            </div>

                                            {paged.map((doc, i) => {
                                                const pct = doc.stats?.percentage ?? 0;
                                                const color = pct >= 75
                                                    ? "var(--cp-success)"
                                                    : pct >= 50
                                                        ? "var(--cp-warning)"
                                                        : "var(--cp-danger)";
                                                const hasAtt = doc.hasAttendance && doc.stats.total > 0;
                                                const isExpanded = expandedStudent === doc.enrollmentId;

                                                // Recent records for expanded view
                                                const recentRecords = [...(doc.records ?? [])]
                                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                    .slice(0, 10);

                                                return (
                                                    <div key={doc.enrollmentId ?? String(doc._id)}>
                                                        {/* Main Row */}
                                                        <div
                                                            className={`ov-table-row${isExpanded ? " ov-table-row--expanded" : ""}${!hasAtt ? " ov-table-row--noatt" : ""}`}
                                                            onClick={() => setExpandedStudent(
                                                                isExpanded ? null : (doc.enrollmentId ?? String(doc._id))
                                                            )}
                                                        >
                                                            {/* # */}
                                                            <span className="att-row-num">
                                                                {(ovPage - 1) * OV_LIMIT + i + 1}
                                                            </span>

                                                            {/* Student */}
                                                            <div className="att-row-student">
                                                                <div
                                                                    className="att-avatar"
                                                                    style={{
                                                                        background: hasAtt
                                                                            ? `color-mix(in srgb,${color} 15%,transparent)`
                                                                            : "var(--cp-border)",
                                                                        color: hasAtt ? color : "var(--cp-muted)"
                                                                    }}
                                                                >
                                                                    {doc.student?.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="att-row-name">{doc.student?.name}</div>
                                                                    <div className="att-row-id">{doc.student?.studentId}</div>
                                                                </div>
                                                            </div>

                                                            {/* Course */}
                                                            <div className="ov-course-cell">
                                                                {doc.course?.name}
                                                            </div>

                                                            {/* Total */}
                                                            <div className="ov-num-cell">
                                                                {hasAtt ? (
                                                                    <span className="ov-total-badge">{doc.stats.total}</span>
                                                                ) : (
                                                                    <span className="ov-no-att">—</span>
                                                                )}
                                                            </div>

                                                            {/* Present */}
                                                            <div className="ov-num-cell">
                                                                {hasAtt ? (
                                                                    <span className="ov-stat-badge ov-stat-badge--present">
                                                                        {doc.stats.present}
                                                                    </span>
                                                                ) : <span className="ov-no-att">—</span>}
                                                            </div>

                                                            {/* Absent */}
                                                            <div className="ov-num-cell">
                                                                {hasAtt ? (
                                                                    <span className="ov-stat-badge ov-stat-badge--absent">
                                                                        {doc.stats.absent}
                                                                    </span>
                                                                ) : <span className="ov-no-att">—</span>}
                                                            </div>

                                                            {/* Late */}
                                                            <div className="ov-num-cell">
                                                                {hasAtt ? (
                                                                    <span className="ov-stat-badge ov-stat-badge--late">
                                                                        {doc.stats.late}
                                                                    </span>
                                                                ) : <span className="ov-no-att">—</span>}
                                                            </div>

                                                            {/* Percentage */}
                                                            <div className="ov-pct-cell">
                                                                {hasAtt ? (
                                                                    <>
                                                                        <div className="att-pct-track" style={{ flex: 1 }}>
                                                                            <div
                                                                                className="att-pct-fill"
                                                                                style={{ width: `${pct}%`, background: color }}
                                                                            />
                                                                        </div>
                                                                        <span style={{ color, fontWeight: 700, fontSize: 12, minWidth: 34 }}>
                                                                            {pct}%
                                                                        </span>
                                                                        {pct < 75 && (
                                                                            <AlertTriangle size={11} color="var(--cp-danger)" />
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <span className="ov-no-att-badge">No Record</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Expanded - Recent Records */}
                                                        {isExpanded && (
                                                            <div className="ov-expanded">
                                                                <div className="ov-exp-header">
                                                                    <span>📅 Recent Attendance Records</span>
                                                                    <button
                                                                        className="ov-detail-btn"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            router.push(`/dashboard/admin/attendance/student/${doc.enrollmentId}`);
                                                                        }}
                                                                    >
                                                                        View Full Details →
                                                                    </button>
                                                                </div>
                                                                {recentRecords.length === 0 ? (
                                                                    <div className="ov-exp-empty">
                                                                        Koi attendance record nahi
                                                                    </div>
                                                                ) : (
                                                                    <div className="ov-rec-list">
                                                                        {recentRecords.map((rec: any, ri: number) => {
                                                                            const cfg = STATUS_CFG[rec.status as AttStatus];
                                                                            return (
                                                                                <div key={ri} className="ov-rec-row">
                                                                                    <span className="ov-rec-date">
                                                                                        {fmtDate(rec.date)}
                                                                                    </span>
                                                                                    <span
                                                                                        className="ov-rec-status"
                                                                                        style={{
                                                                                            color: cfg?.color,
                                                                                            background: cfg?.bg,
                                                                                            borderColor: cfg?.border
                                                                                        }}
                                                                                    >
                                                                                        {cfg?.icon} {cfg?.label}
                                                                                    </span>
                                                                                    {rec.inTime && (
                                                                                        <span className="ov-rec-time">
                                                                                            🕐 {rec.inTime}
                                                                                            {rec.outTime ? ` → ${rec.outTime}` : ""}
                                                                                        </span>
                                                                                    )}
                                                                                    {rec.markedVia && (
                                                                                        <span className="ov-rec-via">
                                                                                            {rec.markedVia === "qr" ? "📱 QR" : "✏️ Manual"}
                                                                                        </span>
                                                                                    )}
                                                                                    {rec.remark && (
                                                                                        <span className="ov-rec-remark">
                                                                                            {rec.remark}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="att-pag">
                                            <button
                                                className="att-pag-btn"
                                                disabled={ovPage === 1}
                                                onClick={() => setOvPage(p => p - 1)}
                                            >
                                                <ChevronLeft size={13} /> Prev
                                            </button>
                                            <span className="att-pag-info">
                                                Page {ovPage} of {totalPages}
                                            </span>
                                            <button
                                                className="att-pag-btn"
                                                disabled={ovPage === totalPages}
                                                onClick={() => setOvPage(p => p + 1)}
                                            >
                                                Next <ChevronRight size={13} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </>
                )}
            </div>
        </>
    );
}

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
.att-header-actions { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

.att-tabs   { display:flex; gap:4px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:10px; padding:4px; }
.att-tab    { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:7px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; color:var(--cp-muted); background:transparent; transition:all .15s; }
.att-tab--active { background:var(--cp-surface); color:var(--cp-accent); box-shadow:0 1px 4px rgba(0,0,0,.15); }
.att-tab:hover:not(.att-tab--active) { color:var(--cp-subtext); }

.att-qr-print-btn { display:inline-flex; align-items:center; gap:7px; padding:8px 18px; border-radius:10px; border:1px solid rgba(99,102,241,0.3); background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08)); color:var(--cp-accent); font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
.att-qr-print-btn:hover { border-color:var(--cp-accent); transform:translateY(-1px); }

.att-course-strip { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:12px 16px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; }
.att-strip-label  { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); white-space:nowrap; }
.att-course-chip  { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:100px; border:1px solid var(--cp-border); background:var(--cp-surface2,var(--cp-surface)); cursor:pointer; transition:all .14s; font-family:'Plus Jakarta Sans',sans-serif; }
.att-course-chip:hover { border-color:var(--cp-accent); background:var(--cp-accent-glow); }
.att-course-chip--active { border-color:var(--cp-accent); background:var(--cp-accent-glow); }
.att-chip-name  { font-size:11px; font-weight:600; color:var(--cp-subtext); }
.att-course-chip--active .att-chip-name { color:var(--cp-accent); }
.att-chip-badge { font-size:10px; font-weight:800; padding:1px 7px; border-radius:100px; background:var(--cp-border); color:var(--cp-muted); }
.att-course-chip--active .att-chip-badge { background:color-mix(in srgb,var(--cp-accent) 25%,transparent); color:var(--cp-accent); }

.att-filter-bar { display:flex; gap:12px; flex-wrap:wrap; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; padding:16px; }
.att-field  { display:flex; flex-direction:column; gap:5px; flex:1; min-width:180px; }
.att-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }
.att-select,.att-input { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; color:var(--cp-text); outline:none; transition:border-color .15s; width:100%; }
.att-select:focus,.att-input:focus { border-color:var(--cp-accent); }

.att-summary-bar { display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
.att-sum-chip { font-size:11px; font-weight:700; padding:4px 11px; border-radius:100px; border:1px solid; }
.att-sum-chip--green  { background:rgba(34,197,94,0.1);   color:var(--cp-success); border-color:rgba(34,197,94,0.3); }
.att-sum-chip--red    { background:rgba(239,68,68,0.1);   color:var(--cp-danger);  border-color:rgba(239,68,68,0.3); }
.att-sum-chip--amber  { background:rgba(245,158,11,0.1);  color:var(--cp-warning); border-color:rgba(245,158,11,0.3); }
.att-sum-chip--purple { background:rgba(167,139,250,0.1); color:#a78bfa;           border-color:rgba(167,139,250,0.3); }
.att-bulk-label { font-size:11px; color:var(--cp-muted); font-weight:600; }
.att-bulk-btn { font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:4px 10px; border-radius:7px; border:1px solid; cursor:pointer; transition:opacity .13s; }
.att-bulk-btn:hover { opacity:.75; }

.att-search-wrap { position:relative; max-width:300px; }
.att-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--cp-muted); pointer-events:none; }
.att-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:9px; color:var(--cp-text); font-size:13px; outline:none; }
.att-search:focus { border-color:var(--cp-accent); }
.att-search::placeholder { color:var(--cp-muted); }

.att-table-wrap { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
.att-table-head { display:grid; grid-template-columns:36px 1.4fr 1.8fr 1fr; gap:10px; padding:10px 16px; background:var(--cp-surface2,var(--cp-bg)); border-bottom:1px solid var(--cp-border); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--cp-muted); }
.att-table-row  { display:grid; grid-template-columns:36px 1.4fr 1.8fr 1fr; gap:10px; padding:11px 16px; border-top:1px solid var(--cp-border); align-items:center; transition:background .12s; }
.att-table-row:hover { background:var(--cp-accent-glow); }
.att-table-row--marked { background:rgba(34,197,94,0.02); }

.att-table-head--time { grid-template-columns:36px 1.4fr 1.6fr 100px 100px 1fr; }
.att-table-row--time  { grid-template-columns:36px 1.4fr 1.6fr 100px 100px 1fr; }
@media(max-width:960px){
  .att-table-head--time { grid-template-columns:28px 1fr; }
  .att-table-row--time  { grid-template-columns:28px 1fr; row-gap:8px; }
  .att-status-btns,.att-time-cell,.att-remark-input { grid-column:2; }
}

.att-time-cell { display:flex; align-items:center; justify-content:center; }
.att-time-badge { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; padding:4px 9px; border-radius:6px; border:1px solid; white-space:nowrap; }
.att-time-badge--in  { background:rgba(34,197,94,0.08); color:var(--cp-success); border-color:rgba(34,197,94,0.25); }
.att-time-badge--out { background:rgba(245,158,11,0.08); color:var(--cp-warning); border-color:rgba(245,158,11,0.25); }
.att-time-empty   { font-size:11px; color:var(--cp-muted); }
.att-time-pending { font-size:9px; font-weight:700; color:var(--cp-warning); background:rgba(245,158,11,0.08); padding:3px 8px; border-radius:6px; border:1px solid rgba(245,158,11,0.2); }

.att-row-num  { font-size:10px; color:var(--cp-border2,var(--cp-muted)); font-weight:600; text-align:center; }
.att-row-student { display:flex; align-items:center; gap:9px; }
.att-avatar { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; }
.att-row-name { font-size:12.5px; color:var(--cp-text); font-weight:600; }
.att-row-id   { font-size:10px; color:var(--cp-muted); margin-top:1px; }
.att-marked-badge { font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; background:rgba(34,197,94,0.1); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); margin-left:auto; flex-shrink:0; }

.att-status-btns { display:flex; gap:4px; flex-wrap:wrap; }
.att-status-btn { display:inline-flex; align-items:center; gap:4px; font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:5px 9px; border-radius:7px; border:1px solid var(--cp-border); background:var(--cp-bg); color:var(--cp-muted); cursor:pointer; transition:all .13s; white-space:nowrap; }
.att-status-btn:hover:not(.att-status-btn--active) { border-color:var(--cp-border2,var(--cp-border)); color:var(--cp-subtext); }

.att-remark-input { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; padding:7px 10px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:7px; color:var(--cp-subtext); outline:none; width:100%; }
.att-remark-input:focus { border-color:var(--cp-accent); }
.att-remark-input::placeholder { color:var(--cp-muted); }

.att-save-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; padding:14px 18px; position:sticky; bottom:0; box-shadow:0 -4px 16px rgba(0,0,0,.1); }
.att-save-info { font-size:12px; color:var(--cp-muted); }
.att-save-btn  { display:inline-flex; align-items:center; gap:7px; padding:10px 22px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; }
.att-save-btn:hover    { opacity:.88; }
.att-save-btn:disabled { opacity:.5; cursor:not-allowed; }

/* KPI */
.att-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.att-kpi-row--4 { grid-template-columns:repeat(4,1fr); }
@media(max-width:700px){
  .att-kpi-row   { grid-template-columns:1fr 1fr; }
  .att-kpi-row--4{ grid-template-columns:1fr 1fr; }
}
.att-kpi { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:10px; padding:14px 16px; border-left:3px solid; }
.att-kpi--accent { border-left-color:var(--cp-accent); }
.att-kpi--green  { border-left-color:var(--cp-success); }
.att-kpi--red    { border-left-color:var(--cp-danger); }
.att-kpi-label { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); margin-bottom:4px; }
.att-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:var(--cp-text); line-height:1; margin-bottom:3px; }
.att-kpi-sub   { font-size:10px; color:var(--cp-muted); }

/* ── DAILY REGISTER ── */
.att-daily-filter { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.att-daily-chips  { display:flex; gap:6px; flex-wrap:wrap; }

.att-daily-head {
  display: grid;
  grid-template-columns: 160px 70px 80px 70px 60px 70px 60px 1fr;
  gap: 8px;
  padding: 10px 16px;
  background: var(--cp-surface2, var(--cp-bg));
  border-bottom: 1px solid var(--cp-border);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--cp-muted);
}

.att-daily-row {
  display: grid;
  grid-template-columns: 160px 70px 80px 70px 60px 70px 60px 1fr;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--cp-border);
  align-items: center;
  transition: background .12s;
}
.att-daily-row:hover { background: var(--cp-accent-glow); }
.att-daily-row--today {
  background: rgba(99,102,241,0.04);
  border-left: 3px solid var(--cp-accent);
}

.ov-detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid var(--cp-accent);
  background: var(--cp-accent-glow);
  color: var(--cp-accent);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.ov-detail-btn:hover {
  background: var(--cp-accent);
  color: white;
}

@media(max-width:900px){
  .att-daily-head,
  .att-daily-row {
    grid-template-columns: 120px 60px 70px 60px 1fr;
  }
  .att-daily-head span:nth-child(5),
  .att-daily-head span:nth-child(6),
  .att-daily-row .att-daily-cell:nth-child(5),
  .att-daily-row .att-daily-cell:nth-child(6) { display: none; }
}

.att-daily-date { display:flex; flex-direction:column; gap:3px; }
.att-daily-date-main { font-size:12px; font-weight:600; color:var(--cp-text); }
.att-today-badge { font-size:9px; font-weight:800; padding:1px 6px; border-radius:100px; background:rgba(99,102,241,0.12); color:var(--cp-accent); border:1px solid rgba(99,102,241,0.2); width:fit-content; }

.att-daily-cell { display:flex; align-items:center; justify-content:center; }
.att-daily-cell--total { }
.att-daily-num  { font-size:13px; font-weight:700; color:var(--cp-text); }
.att-daily-badge { font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; min-width:32px; text-align:center; display:inline-block; }

.att-daily-pct { display:flex; align-items:center; gap:8px; }
.att-daily-bar-wrap { flex:1; height:5px; background:var(--cp-border); border-radius:100px; overflow:hidden; }
.att-daily-bar { height:100%; border-radius:100px; transition:width .4s; }
.att-daily-pct-label { font-size:11px; font-weight:700; min-width:34px; text-align:right; }

.att-daily-pag { display:flex; align-items:center; justify-content:center; gap:10px; padding:12px; border-top:1px solid var(--cp-border); }

/* Overview */
.att-ov-card { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; padding:13px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.att-ov-card:hover { border-color:var(--cp-border2,var(--cp-accent)); }
.att-ov-left  { display:flex; align-items:center; gap:10px; }
.att-ov-right { display:flex; flex-direction:column; gap:7px; align-items:flex-end; }
.att-chip-row { display:flex; gap:4px; flex-wrap:wrap; justify-content:flex-end; }
.att-ov-chip  { font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px; border:1px solid; }
.att-pct-wrap  { display:flex; align-items:center; gap:8px; }
.att-pct-track { width:80px; height:4px; background:var(--cp-border); border-radius:100px; overflow:hidden; }
.att-pct-fill  { height:100%; border-radius:100px; }

/* ── OVERVIEW TABLE ── */
.ov-filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.ov-select {
  max-width: 200px;
  flex: 1;
  min-width: 140px;
  padding: 9px 12px !important;
}
.ov-count-info {
  font-size: 11px;
  color: var(--cp-muted);
  padding: 2px 0;
}
.ov-count-info strong { color: var(--cp-text); }

.ov-table-head {
  display: grid;
  grid-template-columns: 36px 1.6fr 1.2fr 70px 80px 70px 60px 1fr;
  gap: 8px;
  padding: 10px 16px;
  background: var(--cp-surface2, var(--cp-bg));
  border-bottom: 1px solid var(--cp-border);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--cp-muted);
}

.ov-table-row {
  display: grid;
  grid-template-columns: 36px 1.6fr 1.2fr 70px 80px 70px 60px 1fr;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--cp-border);
  align-items: center;
  cursor: pointer;
  transition: background .12s;
}
.ov-table-row:hover { background: var(--cp-accent-glow); }
.ov-table-row--expanded { background: var(--cp-accent-glow); }
.ov-table-row--noatt { opacity: 0.7; }

@media(max-width: 900px) {
  .ov-table-head,
  .ov-table-row {
    grid-template-columns: 28px 1fr 80px 1fr;
  }
  .ov-table-head span:nth-child(4),
  .ov-table-head span:nth-child(5),
  .ov-table-head span:nth-child(6),
  .ov-table-head span:nth-child(7),
  .ov-table-row .ov-num-cell:nth-child(4),
  .ov-table-row .ov-num-cell:nth-child(5),
  .ov-table-row .ov-num-cell:nth-child(6) { display: none; }
}

.ov-course-cell {
  font-size: 11px;
  color: var(--cp-subtext);
  font-weight: 600;
  line-height: 1.4;
}
.ov-num-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ov-total-badge {
  font-size: 13px;
  font-weight: 700;
  color: var(--cp-text);
}
.ov-stat-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 100px;
  border: 1px solid;
  min-width: 28px;
  text-align: center;
  display: inline-block;
}
.ov-stat-badge--present {
  background: rgba(34,197,94,0.1);
  color: var(--cp-success);
  border-color: rgba(34,197,94,0.25);
}
.ov-stat-badge--absent {
  background: rgba(239,68,68,0.1);
  color: var(--cp-danger);
  border-color: rgba(239,68,68,0.25);
}
.ov-stat-badge--late {
  background: rgba(245,158,11,0.1);
  color: var(--cp-warning);
  border-color: rgba(245,158,11,0.25);
}
.ov-pct-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ov-no-att { font-size: 12px; color: var(--cp-muted); }
.ov-no-att-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
  background: var(--cp-border);
  color: var(--cp-muted);
}

/* Expanded Row */
.ov-expanded {
  background: var(--cp-bg);
  border-top: 1px solid var(--cp-border);
  border-bottom: 1px solid var(--cp-border);
  padding: 14px 16px 14px 60px;
}
.ov-exp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: var(--cp-text);
  margin-bottom: 10px;
}
.ov-exp-empty {
  font-size: 12px;
  color: var(--cp-muted);
  padding: 8px 0;
}
.ov-rec-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ov-rec-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: var(--cp-surface);
  border: 1px solid var(--cp-border);
  border-radius: 8px;
  flex-wrap: wrap;
}
.ov-rec-date {
  font-size: 11px;
  color: var(--cp-subtext);
  font-weight: 600;
  min-width: 130px;
}
.ov-rec-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 100px;
  border: 1px solid;
}
.ov-rec-time {
  font-size: 10px;
  color: var(--cp-muted);
  font-family: 'Courier New', monospace;
}
.ov-rec-via {
  font-size: 9px;
  color: var(--cp-muted);
  font-weight: 600;
  padding: 2px 6px;
  background: var(--cp-border);
  border-radius: 4px;
}
.ov-rec-remark {
  font-size: 10px;
  color: var(--cp-muted);
  font-style: italic;
  margin-left: auto;
}

.att-pag     { display:flex; align-items:center; justify-content:center; gap:10px; }
.att-pag-btn { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
.att-pag-btn:hover:not(:disabled) { border-color:var(--cp-accent); color:var(--cp-accent); }
.att-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
.att-pag-info { font-size:12px; color:var(--cp-muted); }

.att-loading { display:flex; align-items:center; gap:10px; padding:32px; color:var(--cp-muted); font-size:13px; }
.att-spinner { width:18px; height:18px; border:2px solid var(--cp-border); border-top-color:var(--cp-accent); border-radius:50%; animation:attSpin .7s linear infinite; }
@keyframes attSpin { to{transform:rotate(360deg)} }

.att-empty { background:var(--cp-surface); border:1px dashed var(--cp-border); border-radius:12px; padding:48px; text-align:center; color:var(--cp-muted); font-size:13px; display:flex; flex-direction:column; align-items:center; }

@media(max-width:640px){
  .att-header-actions { width:100%; flex-direction:column; align-items:stretch; }
  .att-tabs { width:100%; }
  .att-qr-print-btn { width:100%; justify-content:center; }
}
`;