"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    CheckCircle, XCircle, Clock, Coffee, Umbrella,
    Save, ChevronDown, AlertCircle, Users, Calendar,
    TrendingUp, BookOpen, ChevronLeft, ChevronRight,
    AlertTriangle,
} from "lucide-react";

/* ── Types ── */
type AttendanceStatus =
    | "present" | "absent" | "late" | "holiday" | "leave" | "";

interface StudentRow {
    enrollmentId: string;
    studentId: string;   // MongoDB _id → Attendance doc ke liye
    studentCode: string;   // ✅ NEW: Custom "STU001" → display ke liye
    name: string;
    status: AttendanceStatus;
    remark: string;
    inTime: string;
    outTime: string;
    markedVia: "qr" | "manual";
    alreadyMarked: boolean;
    stats: {
        percentage: number;
        present: number;
        absent: number;
        late: number;
        total: number;
        leave: number;
        holiday: number;
    };
}

interface Course { _id: string; name: string; }
interface CourseSummary { _id: string; name: string; studentCount: number; }

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

interface OverviewDoc {
    enrollmentId: string;
    student: { _id: string; name: string; studentId: string };
    course: { _id: string; name: string };
    stats: {
        total: number; present: number; absent: number;
        late: number; holiday: number; leave: number; percentage: number;
    };
    hasAttendance: boolean;
    records: any[];
}

/* ── Status config ── */
const STATUS_CFG = {
    present: {
        label: "Present", color: "var(--tp-success)",
        bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.30)",
        icon: CheckCircle,
    },
    absent: {
        label: "Absent", color: "var(--tp-danger)",
        bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)",
        icon: XCircle,
    },
    late: {
        label: "Late", color: "var(--tp-warn)",
        bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.30)",
        icon: Clock,
    },
    holiday: {
        label: "Holiday", color: "#818CF8",
        bg: "rgba(129,140,248,0.10)", border: "rgba(129,140,248,0.30)",
        icon: Coffee,
    },
    leave: {
        label: "Leave", color: "#A78BFA",
        bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.30)",
        icon: Umbrella,
    },
} as const;

type StatusKey = keyof typeof STATUS_CFG;
const STATUS_KEYS = Object.keys(STATUS_CFG) as StatusKey[];

/* ── Date helpers ── */
function todayLocal(): string {
    const d = new Date();
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
    ].join("-");
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric",
        month: "short", year: "numeric",
    });
}

function fmtDateShort(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short",
    });
}

function pctColor(p: number): string {
    if (p >= 75) return "var(--tp-success)";
    if (p >= 50) return "var(--tp-warn)";
    return "var(--tp-danger)";
}

/* ════════════════════════════════════════
   Main Component
   ════════════════════════════════════════ */
export default function TeacherAttendancePage() {

    /* ── Mark tab ── */
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseId, setCourseId] = useState("");
    const [date, setDate] = useState(todayLocal);
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bulkSel, setBulkSel] = useState<StatusKey | "">("");

    /* ── Tabs ── */
    const [tab, setTab] = useState<"mark" | "daily" | "overview">("mark");

    /* ── Overview / Daily ── */
    const [overviewDocs, setOverviewDocs] = useState<OverviewDoc[]>([]);
    const [courseSummary, setCourseSummary] = useState<CourseSummary[]>([]);
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
    const [courseDailyStats, setCourseDailyStats] = useState<CourseDailyStat[]>([]);
    const [ovLoading, setOvLoading] = useState(false);

    /* ── Overview filters ── */
    const [ovSearch, setOvSearch] = useState("");
    const [ovCourseFilter, setOvCourseFilter] = useState("all");
    const [ovStatusFilter, setOvStatusFilter] = useState("all");
    const [ovPage, setOvPage] = useState(1);
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
    const OV_LIMIT = 12;

    /* ── Daily register ── */
    const [dailyFilterCourse, setDailyFilterCourse] = useState("all");
    const [dailyPage, setDailyPage] = useState(1);
    const DAILY_LIMIT = 15;

    /* ── Toast ── */
    const [toast, setToast] = useState<{
        type: "success" | "error"; msg: string;
    } | null>(null);

    const showToast = useCallback(
        (type: "success" | "error", msg: string) => {
            setToast({ type, msg });
            setTimeout(() => setToast(null), 3500);
        },
        []
    );

    /* ── Load courses ── */
    useEffect(() => {
        fetchWithAuth("/api/teacher/courses")
            .then((r) => r.json())
            .then((d) => setCourses(d.courses ?? []))
            .catch(() => { });
    }, []);

    /* ── Load overview ── */
    const loadOverview = useCallback(async () => {
        setOvLoading(true);
        try {
            const res = await fetchWithAuth("/api/teacher/attendance");
            const data = await res.json();
            setOverviewDocs(data.attendance ?? []);
            setCourseSummary(data.courseSummary ?? []);
            setDailyStats(data.dailyStats ?? []);
            setCourseDailyStats(data.courseDailyStats ?? []);
        } catch {
            showToast("error", "Overview load nahi hua");
        } finally {
            setOvLoading(false);
        }
    }, [showToast]);

    useEffect(() => { loadOverview(); }, [loadOverview]);

    /* ── Load attendance for mark tab ── */
    const loadAttendance = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        try {
            const res = await fetchWithAuth(
                `/api/teacher/attendance?courseId=${courseId}&date=${date}`
            );
            const data = await res.json();

            if (!res.ok) {
                showToast("error", data.message || "Attendance load nahi hui");
                return;
            }

            const enrollments: any[] = data.enrollments ?? [];
            const attendance: any[] = data.attendance ?? [];

            // ── Load attendance for mark tab ──
            const rows: StudentRow[] = enrollments.map((enr) => {
                const att = attendance.find(
                    (a) => String(a.enrollmentId) === String(enr._id)
                );
                const today = att?.todayRecord ?? null;

                return {
                    enrollmentId: String(enr._id),
                    // ✅ FIX: 
                    // student._id       → MongoDB ObjectId (Attendance save ke liye)
                    // student.studentId → Custom field "STU001" (display ke liye)
                    studentId: String(enr.student?._id ?? ""),      // MongoDB _id → POST body mein bhejo
                    studentCode: enr.student?.studentId ?? "—",       // Custom "STU001" → display karo
                    name: enr.student?.name ?? "—",
                    status: (today?.status ?? "") as AttendanceStatus,
                    remark: today?.remark ?? "",
                    inTime: today?.inTime ?? "",
                    outTime: today?.outTime ?? "",
                    markedVia: today?.markedVia ?? "manual",
                    alreadyMarked: !!today,
                    stats: att?.stats ?? {
                        percentage: 0, present: 0, absent: 0,
                        late: 0, total: 0, leave: 0, holiday: 0,
                    },
                };
            });

            setStudents(rows);
            setBulkSel("");
        } catch {
            showToast("error", "Network error — dobara try karo");
        } finally {
            setLoading(false);
        }
    }, [courseId, date, showToast]);

    useEffect(() => { loadAttendance(); }, [loadAttendance]);

    /* ── Row updaters ── */
    const updateField = (id: string, patch: Partial<StudentRow>) =>
        setStudents((prev) =>
            prev.map((s) => s.enrollmentId === id ? { ...s, ...patch } : s)
        );

    const handleMarkAll = (key: StatusKey) => {
        setBulkSel(key);
        setStudents((prev) => prev.map((s) => ({ ...s, status: key })));
    };

    /* ── Save ── */
    const handleSave = async () => {
        if (!courseId) { showToast("error", "Course select karo"); return; }

        const unmarked = students.filter((s) => !s.status);
        if (unmarked.length) {
            showToast(
                "error",
                `${unmarked.length} student${unmarked.length > 1 ? "s" : ""} ki status mark nahi hai`
            );
            return;
        }

        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/teacher/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    records: students.map((s) => ({
                        enrollmentId: s.enrollmentId,
                        studentId:    s.studentId,     // Student._id (MongoDB ObjectId) ✅
                        courseId,
                        status: s.status,
                        remark: s.remark.trim(),
                        inTime: s.inTime || undefined,
                        outTime: s.outTime || undefined,
                        markedVia: "manual" as const,
                    })),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            showToast("success", "Attendance save ho gayi ✓");
            await loadAttendance();
            await loadOverview();
        } catch (err: any) {
            showToast("error", err.message || "Save nahi hua");
        } finally {
            setSaving(false);
        }
    };

    /* ── Summary counts ── */
    const summary = {
        present: students.filter((s) => s.status === "present").length,
        absent: students.filter((s) => s.status === "absent").length,
        late: students.filter((s) => s.status === "late").length,
        holiday: students.filter((s) => s.status === "holiday").length,
        leave: students.filter((s) => s.status === "leave").length,
        unmarked: students.filter((s) => !s.status).length,
    };
    const allMarked = summary.unmarked === 0 && students.length > 0;

    /* ── Daily tab computed ── */
    const activeDailyData =
        dailyFilterCourse === "all"
            ? dailyStats
            : (courseDailyStats.find(
                (c) => c.courseId === dailyFilterCourse
            )?.daily ?? []);

    const dailyTotalPages = Math.ceil(activeDailyData.length / DAILY_LIMIT) || 1;
    const dailyPaged = activeDailyData.slice(
        (dailyPage - 1) * DAILY_LIMIT,
        dailyPage * DAILY_LIMIT
    );
    const activeCourseStudents =
        dailyFilterCourse === "all"
            ? courseSummary.reduce((s, c) => s + c.studentCount, 0)
            : (courseDailyStats.find(
                (c) => c.courseId === dailyFilterCourse
            )?.totalStudents ?? 0);

    /* ── Overview computed ── */
    const ovFiltered = overviewDocs.filter((doc) => {
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

    const ovTotalPages = Math.ceil(ovFiltered.length / OV_LIMIT) || 1;
    const ovPaged = ovFiltered.slice(
        (ovPage - 1) * OV_LIMIT,
        ovPage * OV_LIMIT
    );
    const avgPct = overviewDocs.length > 0
        ? Math.round(
            overviewDocs.reduce((s, a) => s + (a.stats?.percentage ?? 0), 0) /
            overviewDocs.length
        )
        : 0;
    const below75 = overviewDocs.filter(
        (a) => (a.stats?.percentage ?? 0) < 75
    ).length;


    console.log(students);

    /* ════════════════════════════════════════
       RENDER
       ════════════════════════════════════════ */
    return (
        <>
            {/* Toast */}
            {toast && (
                <div className={`ta-toast ta-toast--${toast.type}`}>
                    {toast.type === "success"
                        ? <CheckCircle size={14} />
                        : <AlertCircle size={14} />}
                    {toast.msg}
                </div>
            )}

            <div className="ta-root">

                {/* ── Header ── */}
                <div className="ta-header">
                    <div>
                        <h1 className="ta-title">Attendance</h1>
                        <p className="ta-sub">Daily student attendance manage karo</p>
                    </div>

                    {/* Tabs */}
                    <div className="ta-tabs">
                        {(
                            [
                                { key: "mark", label: "Mark", Icon: Calendar },
                                { key: "daily", label: "Daily Register", Icon: BookOpen },
                                { key: "overview", label: "Overview", Icon: TrendingUp },
                            ] as const
                        ).map(({ key, label, Icon }) => (
                            <button
                                key={key}
                                className={`ta-tab${tab === key ? " ta-tab--active" : ""}`}
                                onClick={() => setTab(key)}
                            >
                                <Icon size={12} /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ════════════════════════════════════════
            MARK TAB
            ════════════════════════════════════════ */}
                {tab === "mark" && (
                    <>
                        {/* Course chips */}
                        {courseSummary.length > 0 && (
                            <div className="ta-course-strip">
                                <span className="ta-strip-label">Courses:</span>
                                {courseSummary.map((cs) => (
                                    <button
                                        key={String(cs._id)}
                                        className={`ta-chip${courseId === String(cs._id) ? " ta-chip--active" : ""}`}
                                        onClick={() => setCourseId(String(cs._id))}
                                    >
                                        <span>{cs.name}</span>
                                        <span className="ta-chip-badge">{cs.studentCount}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Filters */}
                        <div className="ta-filters">
                            <div className="ta-field">
                                <label className="ta-label">Course</label>
                                <div className="ta-sel-wrap">
                                    <select
                                        className="ta-select"
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
                                    >
                                        <option value="">— Course select karo —</option>
                                        {courses.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={13} className="ta-sel-icon" />
                                </div>
                            </div>

                            <div className="ta-field">
                                <label className="ta-label">
                                    <Calendar size={10} /> Date
                                </label>
                                <input
                                    type="date"
                                    className="ta-date-input"
                                    value={date}
                                    max={todayLocal()}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Bulk + Summary */}
                        {students.length > 0 && (
                            <>
                                <div className="ta-mark-all">
                                    <span className="ta-mark-label">Sabko mark karo:</span>
                                    {STATUS_KEYS.map((key) => {
                                        const cfg = STATUS_CFG[key];
                                        const Icon = cfg.icon;
                                        return (
                                            <button
                                                key={key}
                                                className="ta-mark-btn"
                                                style={bulkSel === key
                                                    ? {
                                                        background: cfg.bg,
                                                        borderColor: cfg.border,
                                                        color: cfg.color,
                                                    }
                                                    : {}}
                                                onClick={() => handleMarkAll(key)}
                                            >
                                                <Icon size={11} /> {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="ta-summary">
                                    {(
                                        [
                                            { k: "present", v: summary.present, c: "var(--tp-success)" },
                                            { k: "absent", v: summary.absent, c: "var(--tp-danger)" },
                                            { k: "late", v: summary.late, c: "var(--tp-warn)" },
                                            { k: "holiday", v: summary.holiday, c: "#818CF8" },
                                            { k: "leave", v: summary.leave, c: "#A78BFA" },
                                            { k: "unmarked", v: summary.unmarked, c: "var(--tp-muted)" },
                                        ] as const
                                    ).map((s) => (
                                        <div key={s.k} className="ta-sum-item">
                                            <span className="ta-sum-dot" style={{ background: s.c }} />
                                            <span className="ta-sum-val" style={{ color: s.c }}>{s.v}</span>
                                            <span className="ta-sum-key">{s.k}</span>
                                        </div>
                                    ))}
                                    <div className="ta-sum-total">
                                        <Users size={12} /> {students.length} total
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Content */}
                        {!courseId ? (
                            <div className="ta-empty">
                                <Users size={28} style={{ opacity: 0.2 }} />
                                <span>Pehle course select karo</span>
                            </div>
                        ) : loading ? (
                            <div className="ta-empty">
                                <div className="ta-spinner" />
                                <span>Load ho rahi hai…</span>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="ta-empty">
                                <Users size={28} style={{ opacity: 0.2 }} />
                                <span>Is course mein koi active student nahi</span>
                            </div>
                        ) : (
                            <>
                                {/* Table header */}
                                <div className="ta-table-head">
                                    <span>#</span>
                                    <span>Student</span>
                                    <span>Status</span>
                                    <span>IN Time</span>
                                    <span>OUT Time</span>
                                    <span>Remark</span>
                                </div>

                                <div className="ta-list">
                                    {students.map((st, i) => {
                                        const cfg = st.status ? STATUS_CFG[st.status as StatusKey] : null;
                                        const showTime = ["present", "late"].includes(st.status);

                                        return (
                                            <div
                                                key={st.enrollmentId}
                                                className={`ta-row${st.alreadyMarked ? " ta-row--marked" : ""}`}
                                                style={{ borderLeftColor: cfg?.color ?? "var(--tp-border)" }}
                                            >
                                                {/* # */}
                                                <span className="ta-sno">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>

                                                {/* Student */}
                                                <div className="ta-row-student">
                                                    <div
                                                        className="ta-avatar"
                                                        style={cfg
                                                            ? { background: cfg.bg, color: cfg.color }
                                                            : {}}
                                                    >
                                                        {st.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ta-info">
                                                        <div className="ta-name">{st.name}</div>
                                                        <div className="ta-sid">{st.studentCode || "—"}</div>
                                                    </div>
                                                    <span
                                                        className="ta-pct"
                                                        style={{ color: pctColor(st.stats.percentage) }}
                                                    >
                                                        {st.stats.percentage}%
                                                    </span>
                                                    {st.alreadyMarked && (
                                                        <span className="ta-marked-badge">
                                                            {st.markedVia === "qr" ? "📱 QR" : "✓ Manual"}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Status buttons */}
                                                <div className="ta-status-btns">
                                                    {STATUS_KEYS.map((key) => {
                                                        const c = STATUS_CFG[key];
                                                        const Icon = c.icon;
                                                        return (
                                                            <button
                                                                key={key}
                                                                className="ta-status-btn"
                                                                style={st.status === key
                                                                    ? {
                                                                        background: c.bg,
                                                                        borderColor: c.border,
                                                                        color: c.color,
                                                                    }
                                                                    : {}}
                                                                onClick={() =>
                                                                    updateField(st.enrollmentId, {
                                                                        status: st.status === key ? "" : key,
                                                                    })
                                                                }
                                                            >
                                                                <Icon size={11} /> {c.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* IN Time */}
                                                <div className="ta-time-cell">
                                                    {showTime ? (
                                                        <input
                                                            type="time"
                                                            className="ta-time-input"
                                                            value={st.inTime}
                                                            onChange={(e) =>
                                                                updateField(st.enrollmentId, {
                                                                    inTime: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="ta-time-na">—</span>
                                                    )}
                                                </div>

                                                {/* OUT Time */}
                                                <div className="ta-time-cell">
                                                    {showTime ? (
                                                        <input
                                                            type="time"
                                                            className="ta-time-input"
                                                            value={st.outTime}
                                                            onChange={(e) =>
                                                                updateField(st.enrollmentId, {
                                                                    outTime: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="ta-time-na">—</span>
                                                    )}
                                                </div>

                                                {/* Remark */}
                                                <input
                                                    className="ta-remark"
                                                    placeholder="Remark…"
                                                    value={st.remark}
                                                    maxLength={200}
                                                    onChange={(e) =>
                                                        updateField(st.enrollmentId, {
                                                            remark: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* Bottom bar */}
                        {students.length > 0 && (
                            <div className="ta-bottom-bar">
                                <span className="ta-bottom-info">
                                    {allMarked ? (
                                        <>
                                            <CheckCircle size={13} style={{ color: "var(--tp-success)" }} />
                                            Sab students mark ho gaye
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={13} style={{ color: "var(--tp-warn)" }} />
                                            {summary.unmarked} student
                                            {summary.unmarked > 1 ? "s" : ""} abhi unmarked hain
                                        </>
                                    )}
                                </span>
                                <button
                                    className="ta-save-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    <Save size={13} />
                                    {saving ? "Saving…" : "Save Attendance"}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* ════════════════════════════════════════
            DAILY REGISTER TAB
            ════════════════════════════════════════ */}
                {tab === "daily" && (
                    <>
                        {/* KPI */}
                        {(() => {
                            const todayData = activeDailyData.find((d) => d.date === todayLocal());
                            const todayP = todayData?.present ?? 0;
                            const todayA = todayData?.absent ?? 0;
                            const todayL = todayData?.late ?? 0;
                            const todayTotal = todayData?.total ?? 0;
                            const todayPct = todayTotal > 0
                                ? Math.round(((todayP + todayL) / todayTotal) * 100)
                                : 0;

                            return (
                                <div className="ta-kpi-row">
                                    <div className="ta-kpi ta-kpi--accent">
                                        <div className="ta-kpi-label"><Users size={11} /> Enrolled</div>
                                        <div className="ta-kpi-val">{activeCourseStudents}</div>
                                        <div className="ta-kpi-sub">Total students</div>
                                    </div>
                                    <div className="ta-kpi ta-kpi--green">
                                        <div className="ta-kpi-label">
                                            <CheckCircle size={11} /> Today Present
                                        </div>
                                        <div className="ta-kpi-val">{todayP + todayL}</div>
                                        <div className="ta-kpi-sub">
                                            {todayL > 0 ? `incl. ${todayL} late` : "aaj ke"}
                                        </div>
                                    </div>
                                    <div className="ta-kpi ta-kpi--red">
                                        <div className="ta-kpi-label"><XCircle size={11} /> Today Absent</div>
                                        <div className="ta-kpi-val">{todayA}</div>
                                        <div className="ta-kpi-sub">aaj nahi aaye</div>
                                    </div>
                                    <div
                                        className="ta-kpi"
                                        style={{
                                            borderLeftColor: todayPct >= 75
                                                ? "var(--tp-success)"
                                                : "var(--tp-danger)",
                                        }}
                                    >
                                        <div className="ta-kpi-label">
                                            <TrendingUp size={11} /> Today %
                                        </div>
                                        <div
                                            className="ta-kpi-val"
                                            style={{
                                                color: todayPct >= 75
                                                    ? "var(--tp-success)"
                                                    : "var(--tp-danger)",
                                            }}
                                        >
                                            {todayPct}%
                                        </div>
                                        <div className="ta-kpi-sub">aaj ki attendance</div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Course filter chips */}
                        <div className="ta-daily-filter">
                            <span className="ta-strip-label">Filter:</span>
                            <div className="ta-daily-chips">
                                <button
                                    className={`ta-chip${dailyFilterCourse === "all" ? " ta-chip--active" : ""}`}
                                    onClick={() => { setDailyFilterCourse("all"); setDailyPage(1); }}
                                >
                                    <span>All Courses</span>
                                    <span className="ta-chip-badge">{dailyStats.length}</span>
                                </button>
                                {courseDailyStats.map((c) => (
                                    <button
                                        key={c.courseId}
                                        className={`ta-chip${dailyFilterCourse === c.courseId ? " ta-chip--active" : ""}`}
                                        onClick={() => { setDailyFilterCourse(c.courseId); setDailyPage(1); }}
                                    >
                                        <span>{c.courseName}</span>
                                        <span className="ta-chip-badge">{c.daily.length}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily table */}
                        {ovLoading ? (
                            <div className="ta-empty"><div className="ta-spinner" /></div>
                        ) : activeDailyData.length === 0 ? (
                            <div className="ta-empty">
                                <BookOpen size={28} style={{ opacity: 0.2 }} />
                                <span>Koi record nahi — pehle attendance mark karo</span>
                            </div>
                        ) : (
                            <div className="ta-table-wrap">
                                <div className="ta-daily-head">
                                    <span>Date</span>
                                    <span style={{ textAlign: "center" }}>Total</span>
                                    <span style={{ textAlign: "center" }}>Present</span>
                                    <span style={{ textAlign: "center" }}>Absent</span>
                                    <span style={{ textAlign: "center" }}>Late</span>
                                    <span style={{ textAlign: "center" }}>Holiday</span>
                                    <span style={{ textAlign: "center" }}>Leave</span>
                                    <span>Attendance %</span>
                                </div>

                                {dailyPaged.map((day) => {
                                    const attended = day.present + day.late;
                                    const counted = day.total - day.holiday - day.leave;
                                    const pct = counted > 0
                                        ? Math.round((attended / counted) * 100)
                                        : 0;
                                    const clr = pct >= 75 ? "var(--tp-success)"
                                        : pct >= 50 ? "var(--tp-warn)"
                                            : "var(--tp-danger)";
                                    const isToday = day.date === todayLocal();

                                    return (
                                        <div
                                            key={day.date}
                                            className={`ta-daily-row${isToday ? " ta-daily-row--today" : ""}`}
                                        >
                                            <div className="ta-daily-date">
                                                <span className="ta-daily-date-main">
                                                    {fmtDateShort(day.date)}
                                                </span>
                                                {isToday && (
                                                    <span className="ta-today-badge">Today</span>
                                                )}
                                            </div>

                                            <div className="ta-daily-cell">
                                                <span className="ta-daily-num">{day.total}</span>
                                            </div>

                                            {(
                                                [
                                                    {
                                                        v: day.present,
                                                        bg: "rgba(34,197,94,0.1)",
                                                        c: "var(--tp-success)",
                                                        b: "rgba(34,197,94,0.25)",
                                                    },
                                                    {
                                                        v: day.absent,
                                                        bg: "rgba(239,68,68,0.1)",
                                                        c: "var(--tp-danger)",
                                                        b: "rgba(239,68,68,0.25)",
                                                    },
                                                    {
                                                        v: day.late,
                                                        bg: "rgba(245,158,11,0.1)",
                                                        c: "var(--tp-warn)",
                                                        b: "rgba(245,158,11,0.25)",
                                                    },
                                                    {
                                                        v: day.holiday,
                                                        bg: "rgba(96,165,250,0.1)",
                                                        c: "#60a5fa",
                                                        b: "rgba(96,165,250,0.25)",
                                                    },
                                                    {
                                                        v: day.leave,
                                                        bg: "rgba(167,139,250,0.1)",
                                                        c: "#a78bfa",
                                                        b: "rgba(167,139,250,0.25)",
                                                    },
                                                ] as const
                                            ).map((col, ci) => (
                                                <div key={ci} className="ta-daily-cell">
                                                    <span
                                                        className="ta-daily-badge"
                                                        style={{
                                                            background: col.bg,
                                                            color: col.c,
                                                            border: `1px solid ${col.b}`,
                                                        }}
                                                    >
                                                        {col.v}
                                                    </span>
                                                </div>
                                            ))}

                                            <div className="ta-daily-pct">
                                                <div className="ta-daily-bar-wrap">
                                                    <div
                                                        className="ta-daily-bar"
                                                        style={{ width: `${pct}%`, background: clr }}
                                                    />
                                                </div>
                                                <span className="ta-daily-pct-label" style={{ color: clr }}>
                                                    {pct}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {dailyTotalPages > 1 && (
                                    <div className="ta-pag">
                                        <button
                                            className="ta-pag-btn"
                                            disabled={dailyPage === 1}
                                            onClick={() => setDailyPage((p) => p - 1)}
                                        >
                                            <ChevronLeft size={13} /> Prev
                                        </button>
                                        <span className="ta-pag-info">
                                            Page {dailyPage} / {dailyTotalPages}
                                            <span style={{ color: "var(--tp-muted)", marginLeft: 6 }}>
                                                ({activeDailyData.length} days)
                                            </span>
                                        </span>
                                        <button
                                            className="ta-pag-btn"
                                            disabled={dailyPage === dailyTotalPages}
                                            onClick={() => setDailyPage((p) => p + 1)}
                                        >
                                            Next <ChevronRight size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ════════════════════════════════════════
            OVERVIEW TAB
            ════════════════════════════════════════ */}
                {tab === "overview" && (
                    <>
                        {/* KPI */}
                        <div className="ta-kpi-row ta-kpi-row--3">
                            <div className="ta-kpi ta-kpi--accent">
                                <div className="ta-kpi-label"><Users size={11} /> Total Students</div>
                                <div className="ta-kpi-val">{overviewDocs.length}</div>
                                <div className="ta-kpi-sub">Enrolled students</div>
                            </div>
                            <div className="ta-kpi ta-kpi--green">
                                <div className="ta-kpi-label"><TrendingUp size={11} /> Avg Attendance</div>
                                <div className="ta-kpi-val">{avgPct}%</div>
                                <div className="ta-kpi-sub">Overall average</div>
                            </div>
                            <div className="ta-kpi ta-kpi--red">
                                <div className="ta-kpi-label"><AlertTriangle size={11} /> Below 75%</div>
                                <div className="ta-kpi-val">{below75}</div>
                                <div className="ta-kpi-sub">Need attention</div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="ta-ov-filters">
                            <div className="ta-search-wrap">
                                <input
                                    className="ta-search"
                                    placeholder="Name ya ID se search…"
                                    value={ovSearch}
                                    onChange={(e) => { setOvSearch(e.target.value); setOvPage(1); }}
                                />
                            </div>
                            <select
                                className="ta-ov-select"
                                value={ovCourseFilter}
                                onChange={(e) => { setOvCourseFilter(e.target.value); setOvPage(1); }}
                            >
                                <option value="all">All Courses</option>
                                {courseSummary.map((c) => (
                                    <option key={String(c._id)} value={String(c._id)}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="ta-ov-select"
                                value={ovStatusFilter}
                                onChange={(e) => { setOvStatusFilter(e.target.value); setOvPage(1); }}
                            >
                                <option value="all">All Status</option>
                                <option value="good">Good (≥75%)</option>
                                <option value="warning">Warning (50–74%)</option>
                                <option value="danger">Critical (&lt;50%)</option>
                                <option value="none">No Attendance</option>
                            </select>
                        </div>

                        <div className="ta-ov-count">
                            Showing <strong>{ovFiltered.length}</strong> of{" "}
                            <strong>{overviewDocs.length}</strong> students
                        </div>

                        {/* Table */}
                        {ovLoading ? (
                            <div className="ta-empty"><div className="ta-spinner" /></div>
                        ) : ovPaged.length === 0 ? (
                            <div className="ta-empty">
                                <Users size={28} style={{ opacity: 0.2 }} />
                                <span>Koi student nahi mila</span>
                            </div>
                        ) : (
                            <div className="ta-table-wrap">
                                <div className="ta-ov-head">
                                    <span>#</span>
                                    <span>Student</span>
                                    <span>Course</span>
                                    <span style={{ textAlign: "center" }}>Total</span>
                                    <span style={{ textAlign: "center" }}>Present</span>
                                    <span style={{ textAlign: "center" }}>Absent</span>
                                    <span style={{ textAlign: "center" }}>Late</span>
                                    <span>Attendance %</span>
                                </div>

                                {ovPaged.map((doc, i) => {
                                    const pct = doc.stats?.percentage ?? 0;
                                    const clr = pctColor(pct);
                                    const hasAtt = doc.hasAttendance && doc.stats.total > 0;
                                    const isExpanded = expandedStudent === doc.enrollmentId;

                                    const recentRecords = [...(doc.records ?? [])]
                                        .sort(
                                            (a, b) =>
                                                new Date(b.date).getTime() - new Date(a.date).getTime()
                                        )
                                        .slice(0, 10);

                                    return (
                                        <div key={doc.enrollmentId}>
                                            <div
                                                className={`ta-ov-row${isExpanded ? " ta-ov-row--exp" : ""}${!hasAtt ? " ta-ov-row--noatt" : ""}`}
                                                onClick={() =>
                                                    setExpandedStudent(
                                                        isExpanded ? null : doc.enrollmentId
                                                    )
                                                }
                                            >
                                                <span className="ta-sno">
                                                    {(ovPage - 1) * OV_LIMIT + i + 1}
                                                </span>

                                                <div className="ta-row-student">
                                                    <div
                                                        className="ta-avatar"
                                                        style={{
                                                            background: hasAtt
                                                                ? `color-mix(in srgb,${clr} 15%,transparent)`
                                                                : "var(--tp-border)",
                                                            color: hasAtt ? clr : "var(--tp-muted)",
                                                        }}
                                                    >
                                                        {doc.student?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ta-info">
                                                        <div className="ta-name">{doc.student?.name}</div>
                                                        <div className="ta-sid">{doc.student?.studentId}</div>
                                                    </div>
                                                </div>

                                                <div className="ta-ov-course">{doc.course?.name}</div>

                                                <div className="ta-ov-num">
                                                    {hasAtt
                                                        ? <span className="ta-ov-total">{doc.stats.total}</span>
                                                        : <span className="ta-ov-none">—</span>}
                                                </div>

                                                {(
                                                    [
                                                        { v: doc.stats.present, cls: "present" },
                                                        { v: doc.stats.absent, cls: "absent" },
                                                        { v: doc.stats.late, cls: "late" },
                                                    ] as const
                                                ).map(({ v, cls }) => (
                                                    <div key={cls} className="ta-ov-num">
                                                        {hasAtt
                                                            ? (
                                                                <span className={`ta-ov-badge ta-ov-badge--${cls}`}>
                                                                    {v}
                                                                </span>
                                                            )
                                                            : <span className="ta-ov-none">—</span>}
                                                    </div>
                                                ))}

                                                <div className="ta-ov-pct">
                                                    {hasAtt ? (
                                                        <>
                                                            <div className="ta-pct-track">
                                                                <div
                                                                    className="ta-pct-fill"
                                                                    style={{ width: `${pct}%`, background: clr }}
                                                                />
                                                            </div>
                                                            <span style={{ color: clr, fontWeight: 700, fontSize: 12, minWidth: 34 }}>
                                                                {pct}%
                                                            </span>
                                                            {pct < 75 && (
                                                                <AlertTriangle size={11} color="var(--tp-danger)" />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="ta-ov-no-rec">No Record</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded */}
                                            {isExpanded && (
                                                <div className="ta-ov-expanded">
                                                    <div className="ta-ov-exp-header">
                                                        📅 Recent Attendance (last 10)
                                                    </div>
                                                    {recentRecords.length === 0 ? (
                                                        <div className="ta-ov-exp-empty">
                                                            Koi record nahi
                                                        </div>
                                                    ) : (
                                                        <div className="ta-ov-rec-list">
                                                            {recentRecords.map((rec: any, ri: number) => {
                                                                const cfg = STATUS_CFG[rec.status as StatusKey];
                                                                const Icon = cfg?.icon;
                                                                return (
                                                                    <div key={ri} className="ta-ov-rec-row">
                                                                        <span className="ta-ov-rec-date">
                                                                            {fmtDate(rec.date)}
                                                                        </span>
                                                                        {cfg && (
                                                                            <span
                                                                                className="ta-ov-rec-status"
                                                                                style={{
                                                                                    color: cfg.color,
                                                                                    background: cfg.bg,
                                                                                    borderColor: cfg.border,
                                                                                }}
                                                                            >
                                                                                {Icon && <Icon size={10} />} {cfg.label}
                                                                            </span>
                                                                        )}
                                                                        {rec.inTime && (
                                                                            <span className="ta-ov-rec-time">
                                                                                🕐 {rec.inTime}
                                                                                {rec.outTime ? ` → ${rec.outTime}` : ""}
                                                                            </span>
                                                                        )}
                                                                        {rec.markedVia && (
                                                                            <span className="ta-ov-rec-via">
                                                                                {rec.markedVia === "qr"
                                                                                    ? "📱 QR"
                                                                                    : "✏️ Manual"}
                                                                            </span>
                                                                        )}
                                                                        {rec.remark && (
                                                                            <span className="ta-ov-rec-remark">
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

                                {ovTotalPages > 1 && (
                                    <div className="ta-pag">
                                        <button
                                            className="ta-pag-btn"
                                            disabled={ovPage === 1}
                                            onClick={() => setOvPage((p) => p - 1)}
                                        >
                                            <ChevronLeft size={13} /> Prev
                                        </button>
                                        <span className="ta-pag-info">
                                            Page {ovPage} / {ovTotalPages}
                                        </span>
                                        <button
                                            className="ta-pag-btn"
                                            disabled={ovPage === ovTotalPages}
                                            onClick={() => setOvPage((p) => p + 1)}
                                        >
                                            Next <ChevronRight size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

            </div>
        </>
    );
}