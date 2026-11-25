// src/app/(dashboard)/dashboard/teacher/attendance/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    CheckCircle, XCircle, Clock, Coffee, Umbrella,
    Save, ChevronDown, AlertCircle, Users, Calendar,
    TrendingUp, BookOpen, ChevronLeft, ChevronRight,
    AlertTriangle, RefreshCw, CheckCircle2,
} from "lucide-react";

/* ── Types ── */
type AttendanceStatus =
    | "pending" | "present" | "absent" | "late" | "holiday" | "leave" | "";

interface StudentRow {
    enrollmentId: string;
    studentId: string;
    studentCode: string;
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

interface PendingRecord {
    attendanceId: string;
    studentName: string;
    studentId: string;
    courseName: string;
    inTime: string;
    outTime: string | null;
    duration: string | null;
}

/* ── Status config ── */
const STATUS_CFG = {
    pending: {
        label: "Pending", color: "var(--tp-warn)",
        bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.30)",
        icon: Clock,
    },
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
        weekday: "short", day: "numeric", month: "short", year: "numeric",
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
    const [tab, setTab] = useState<"verify" | "mark" | "daily" | "overview">("verify");

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

    /* ── Verify tab ── */
    const [pendingRecords, setPendingRecords] = useState<PendingRecord[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [bulkVerifying, setBulkVerifying] = useState(false);

    /* ── Toast ── */
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showToast = useCallback((type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    }, []);

    /* ── Load courses ── */
    useEffect(() => {
        fetchWithAuth("/api/teacher/courses")
            .then((r) => r.json())
            .then((d) => setCourses(d.courses ?? []))
            .catch(() => { });
    }, []);

    /* ── Load pending records (Verify tab) - Real-time every 10s ── */
    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await fetchWithAuth("/api/teacher/attendance/pending");
                if (res.ok) {
                    const data = await res.json();
                    setPendingRecords(data.students || []);
                    setPendingCount(data.count || 0);
                }
            } catch (err) {
                console.error("Failed to fetch pending", err);
            }
        };
        fetchPending();
        const interval = setInterval(fetchPending, 10000);
        return () => clearInterval(interval);
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
            const res = await fetchWithAuth(`/api/teacher/attendance?courseId=${courseId}&date=${date}`);
            const data = await res.json();

            if (!res.ok) {
                showToast("error", data.message || "Attendance load nahi hui");
                return;
            }

            const enrollments: any[] = data.enrollments ?? [];
            const attendance: any[] = data.attendance ?? [];

            const rows: StudentRow[] = enrollments.map((enr) => {
                const att = attendance.find((a) => String(a.enrollmentId) === String(enr._id));
                const today = att?.todayRecord ?? null;

                return {
                    enrollmentId: String(enr._id),
                    studentId: String(enr.student?._id ?? ""),
                    studentCode: enr.student?.studentId ?? "—",
                    name: enr.student?.name ?? "—",
                    status: (today?.status ?? "") as AttendanceStatus,
                    remark: today?.remark ?? "",
                    inTime: today?.inTime ?? "",
                    outTime: today?.outTime ?? "",
                    markedVia: today?.markedVia ?? "manual",
                    alreadyMarked: !!today,
                    stats: att?.stats ?? { percentage: 0, present: 0, absent: 0, late: 0, total: 0, leave: 0, holiday: 0 },
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

    const updateField = (id: string, patch: Partial<StudentRow>) =>
        setStudents((prev) => prev.map((s) => s.enrollmentId === id ? { ...s, ...patch } : s));

    const handleMarkAll = (key: StatusKey) => {
        setBulkSel(key);
        setStudents((prev) => prev.map((s) => ({ ...s, status: key })));
    };

    const handleSave = async () => {
        if (!courseId) { showToast("error", "Course select karo"); return; }
        const unmarked = students.filter((s) => !s.status);
        if (unmarked.length) {
            showToast("error", `${unmarked.length} student${unmarked.length > 1 ? "s" : ""} ki status mark nahi hai`);
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
                        studentId: s.studentId,
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

    /* ── Verify Handlers ── */
    const handleVerify = async (attendanceId: string, action: "verify" | "reject") => {
        setVerifyingId(attendanceId);
        try {
            const res = await fetchWithAuth("/api/teacher/attendance/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attendanceId, action }),
            });
            if (res.ok) {
                setPendingRecords(prev => prev.filter(r => r.attendanceId !== attendanceId));
                setPendingCount(prev => Math.max(0, prev - 1));
                showToast("success", action === "verify" ? "✅ Verified!" : "❌ Rejected");
                loadOverview();
            } else {
                const data = await res.json();
                showToast("error", data.message || "Action failed");
            }
        } catch (err) {
            showToast("error", "Action failed");
        } finally {
            setVerifyingId(null);
        }
    };

    const handleBulkVerify = async () => {
        if (pendingRecords.length === 0) return;
        setBulkVerifying(true);
        try {
            const attendanceIds = pendingRecords.map(r => r.attendanceId);
            const res = await fetchWithAuth("/api/teacher/attendance/bulk-verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attendanceIds, action: "verify" }),
            });
            if (res.ok) {
                setPendingRecords([]);
                setPendingCount(0);
                showToast("success", `✅ ${attendanceIds.length} records verified!`);
                loadOverview();
            } else {
                const data = await res.json();
                showToast("error", data.message || "Bulk verify failed");
            }
        } catch (err) {
            showToast("error", "Bulk verify failed");
        } finally {
            setBulkVerifying(false);
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
    const activeDailyData = dailyFilterCourse === "all"
        ? dailyStats
        : (courseDailyStats.find((c) => c.courseId === dailyFilterCourse)?.daily ?? []);

    const dailyTotalPages = Math.ceil(activeDailyData.length / DAILY_LIMIT) || 1;
    const dailyPaged = activeDailyData.slice((dailyPage - 1) * DAILY_LIMIT, dailyPage * DAILY_LIMIT);
    const activeCourseStudents = dailyFilterCourse === "all"
        ? courseSummary.reduce((s, c) => s + c.studentCount, 0)
        : (courseDailyStats.find((c) => c.courseId === dailyFilterCourse)?.totalStudents ?? 0);

    /* ── Overview computed ── */
    const ovFiltered = overviewDocs.filter((doc) => {
        const nameMatch = doc.student?.name?.toLowerCase().includes(ovSearch.toLowerCase()) || doc.student?.studentId?.toLowerCase().includes(ovSearch.toLowerCase());
        const courseMatch = ovCourseFilter === "all" || String(doc.course?._id) === ovCourseFilter;
        const pct = doc.stats?.percentage ?? 0;
        const hasAtt = doc.hasAttendance && doc.stats.total > 0;
        const statusMatch = ovStatusFilter === "all" ? true :
            ovStatusFilter === "good" ? pct >= 75 :
            ovStatusFilter === "warning" ? (pct >= 50 && pct < 75) :
            ovStatusFilter === "danger" ? (hasAtt && pct < 50) :
            ovStatusFilter === "none" ? !hasAtt : true;
        return nameMatch && courseMatch && statusMatch;
    });

    const ovTotalPages = Math.ceil(ovFiltered.length / OV_LIMIT) || 1;
    const ovPaged = ovFiltered.slice((ovPage - 1) * OV_LIMIT, ovPage * OV_LIMIT);
    const avgPct = overviewDocs.length > 0
        ? Math.round(overviewDocs.reduce((s, a) => s + (a.stats?.percentage ?? 0), 0) / overviewDocs.length)
        : 0;
    const below75 = overviewDocs.filter((a) => (a.stats?.percentage ?? 0) < 75).length;

    /* ════════════════════════════════════════
       RENDER
       ════════════════════════════════════════ */
    return (
        <>
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
                        <p className="ta-sub">Daily student attendance & verification manage karo</p>
                    </div>
                    <div className="ta-tabs">
                        {(
                            [
                                { key: "verify", label: "Verify", Icon: CheckCircle2, badge: pendingCount },
                                { key: "mark", label: "Mark", Icon: Calendar },
                                { key: "daily", label: "Daily Register", Icon: BookOpen },
                                { key: "overview", label: "Overview", Icon: TrendingUp },
                            ] as const
                        ).map(({ key, label, Icon, badge }: any) => (
                            <button
                                key={key}
                                className={`ta-tab${tab === key ? " ta-tab--active" : ""}`}
                                onClick={() => setTab(key)}
                            >
                                <Icon size={12} /> {label}
                                {badge > 0 && <span className="ta-tab-badge">{badge}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ════════════════════════════════════════
                    VERIFY TAB
                ════════════════════════════════════════ */}
                {tab === "verify" && (
                    <>
                        <div className="ta-verify-header">
                            <div>
                                <h2 className="ta-verify-title">Pending Verification</h2>
                                <p className="ta-verify-sub">{pendingRecords.length} students waiting for approval</p>
                            </div>
                            {pendingRecords.length > 0 && (
                                <button
                                    className="ta-save-btn ta-save-btn--bulk"
                                    onClick={handleBulkVerify}
                                    disabled={bulkVerifying}
                                >
                                    {bulkVerifying ? <RefreshCw size={13} className="spin" /> : <CheckCircle2 size={13} />}
                                    {bulkVerifying ? "Verifying..." : `Bulk Verify All (${pendingRecords.length})`}
                                </button>
                            )}
                        </div>

                        {pendingRecords.length === 0 ? (
                            <div className="ta-empty">
                                <CheckCircle size={32} style={{ opacity: 0.3, marginBottom: 12, color: "var(--tp-success)" }} />
                                <div>All attendance records are verified!</div>
                                <div style={{ fontSize: 12, color: "var(--tp-muted)", marginTop: 4 }}>No pending requests at the moment.</div>
                            </div>
                        ) : (
                            <div className="ta-verify-list">
                                {pendingRecords.map(record => (
                                    <div key={record.attendanceId} className="ta-verify-card">
                                        <div className="ta-verify-left">
                                            <div className="ta-avatar" style={{ background: "rgba(245,158,11,0.1)", color: "var(--tp-warn)" }}>
                                                {record.studentName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ta-verify-info">
                                                <div className="ta-name">{record.studentName}</div>
                                                <div className="ta-sid">{record.studentId}</div>
                                                <div className="ta-course">{record.courseName}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="ta-verify-center">
                                            <div className="ta-verify-time">
                                                <span className="ta-time-badge ta-time-badge--in">🕐 IN: {record.inTime}</span>
                                                {record.outTime ? (
                                                    <span className="ta-time-badge ta-time-badge--out">🚪 OUT: {record.outTime}</span>
                                                ) : (
                                                    <span className="ta-time-pending">Waiting for OUT scan</span>
                                                )}
                                            </div>
                                            {record.duration && (
                                                <div className="ta-verify-duration">Duration: {record.duration}</div>
                                            )}
                                        </div>

                                        <div className="ta-verify-actions">
                                            <button
                                                className="ta-btn-verify ta-btn-verify--reject"
                                                onClick={() => handleVerify(record.attendanceId, "reject")}
                                                disabled={verifyingId === record.attendanceId}
                                            >
                                                <XCircle size={14} /> Reject
                                            </button>
                                            <button
                                                className="ta-btn-verify ta-btn-verify--approve"
                                                onClick={() => handleVerify(record.attendanceId, "verify")}
                                                disabled={verifyingId === record.attendanceId}
                                            >
                                                {verifyingId === record.attendanceId ? (
                                                    <RefreshCw size={14} className="spin" />
                                                ) : (
                                                    <CheckCircle2 size={14} />
                                                )}
                                                Verify
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ════════════════════════════════════════
                    MARK TAB
                ════════════════════════════════════════ */}
                {tab === "mark" && (
                    <>
                        {courseSummary.length > 0 && (
                            <div className="ta-course-strip">
                                <span className="ta-strip-label">Courses:</span>
                                {courseSummary.map((cs) => (
                                    <button key={String(cs._id)} className={`ta-chip${courseId === String(cs._id) ? " ta-chip--active" : ""}`} onClick={() => setCourseId(String(cs._id))}>
                                        <span>{cs.name}</span>
                                        <span className="ta-chip-badge">{cs.studentCount}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="ta-filters">
                            <div className="ta-field">
                                <label className="ta-label">Course</label>
                                <div className="ta-sel-wrap">
                                    <select className="ta-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                                        <option value="">— Course select karo —</option>
                                        {courses.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                                    </select>
                                    <ChevronDown size={13} className="ta-sel-icon" />
                                </div>
                            </div>
                            <div className="ta-field">
                                <label className="ta-label"><Calendar size={10} /> Date</label>
                                <input type="date" className="ta-date-input" value={date} max={todayLocal()} onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>

                        {students.length > 0 && (
                            <>
                                <div className="ta-mark-all">
                                    <span className="ta-mark-label">Sabko mark karo:</span>
                                    {STATUS_KEYS.filter(k => k !== "pending").map((key) => {
                                        const cfg = STATUS_CFG[key];
                                        const Icon = cfg.icon;
                                        return (
                                            <button key={key} className="ta-mark-btn" style={bulkSel === key ? { background: cfg.bg, borderColor: cfg.border, color: cfg.color } : {}} onClick={() => handleMarkAll(key)}>
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
                                    <div className="ta-sum-total"><Users size={12} /> {students.length} total</div>
                                </div>
                            </>
                        )}

                        {!courseId ? (
                            <div className="ta-empty"><Users size={28} style={{ opacity: 0.2 }} /><span>Pehle course select karo</span></div>
                        ) : loading ? (
                            <div className="ta-empty"><div className="ta-spinner" /><span>Load ho rahi hai…</span></div>
                        ) : students.length === 0 ? (
                            <div className="ta-empty"><Users size={28} style={{ opacity: 0.2 }} /><span>Is course mein koi active student nahi</span></div>
                        ) : (
                            <>
                                <div className="ta-table-head">
                                    <span>#</span><span>Student</span><span>Status</span><span>IN Time</span><span>OUT Time</span><span>Remark</span>
                                </div>
                                <div className="ta-list">
                                    {students.map((st, i) => {
                                        const cfg = st.status ? STATUS_CFG[st.status as StatusKey] : null;
                                        const showTime = ["present", "late"].includes(st.status);
                                        return (
                                            <div key={st.enrollmentId} className={`ta-row${st.alreadyMarked ? " ta-row--marked" : ""}`} style={{ borderLeftColor: cfg?.color ?? "var(--tp-border)" }}>
                                                <span className="ta-sno">{String(i + 1).padStart(2, "0")}</span>
                                                <div className="ta-row-student">
                                                    <div className="ta-avatar" style={cfg ? { background: cfg.bg, color: cfg.color } : {}}>
                                                        {st.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ta-info">
                                                        <div className="ta-name">{st.name}</div>
                                                        <div className="ta-sid">{st.studentCode || "—"}</div>
                                                    </div>
                                                    <span className="ta-pct" style={{ color: pctColor(st.stats.percentage) }}>{st.stats.percentage}%</span>
                                                    {st.alreadyMarked && (<span className="ta-marked-badge">{st.markedVia === "qr" ? "📱 QR" : "✓ Manual"}</span>)}
                                                </div>
                                                <div className="ta-status-btns">
                                                    {STATUS_KEYS.filter(k => k !== "pending").map((key) => {
                                                        const c = STATUS_CFG[key];
                                                        const Icon = c.icon;
                                                        return (
                                                            <button key={key} className="ta-status-btn" style={st.status === key ? { background: c.bg, borderColor: c.border, color: c.color } : {}} onClick={() => updateField(st.enrollmentId, { status: st.status === key ? "" : key })}>
                                                                <Icon size={11} /> {c.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <div className="ta-time-cell">
                                                    {showTime ? (<input type="time" className="ta-time-input" value={st.inTime} onChange={(e) => updateField(st.enrollmentId, { inTime: e.target.value })} />) : (<span className="ta-time-na">—</span>)}
                                                </div>
                                                <div className="ta-time-cell">
                                                    {showTime ? (<input type="time" className="ta-time-input" value={st.outTime} onChange={(e) => updateField(st.enrollmentId, { outTime: e.target.value })} />) : (<span className="ta-time-na">—</span>)}
                                                </div>
                                                <input className="ta-remark" placeholder="Remark…" value={st.remark} maxLength={200} onChange={(e) => updateField(st.enrollmentId, { remark: e.target.value })} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {students.length > 0 && (
                            <div className="ta-bottom-bar">
                                <span className="ta-bottom-info">
                                    {allMarked ? (
                                        <><CheckCircle size={13} style={{ color: "var(--tp-success)" }} /> Sab students mark ho gaye</>
                                    ) : (
                                        <><AlertCircle size={13} style={{ color: "var(--tp-warn)" }} /> {summary.unmarked} student{summary.unmarked > 1 ? "s" : ""} abhi unmarked hain</>
                                    )}
                                </span>
                                <button className="ta-save-btn" onClick={handleSave} disabled={saving}>
                                    <Save size={13} /> {saving ? "Saving…" : "Save Attendance"}
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
                        {(() => {
                            const todayData = activeDailyData.find((d) => d.date === todayLocal());
                            const todayP = todayData?.present ?? 0;
                            const todayA = todayData?.absent ?? 0;
                            const todayL = todayData?.late ?? 0;
                            const todayTotal = todayData?.total ?? 0;
                            const todayPct = todayTotal > 0 ? Math.round(((todayP + todayL) / todayTotal) * 100) : 0;

                            return (
                                <div className="ta-kpi-row">
                                    <div className="ta-kpi ta-kpi--accent">
                                        <div className="ta-kpi-label"><Users size={11} /> Enrolled</div>
                                        <div className="ta-kpi-val">{activeCourseStudents}</div>
                                        <div className="ta-kpi-sub">Total students</div>
                                    </div>
                                    <div className="ta-kpi ta-kpi--green">
                                        <div className="ta-kpi-label"><CheckCircle size={11} /> Today Present</div>
                                        <div className="ta-kpi-val">{todayP + todayL}</div>
                                        <div className="ta-kpi-sub">{todayL > 0 ? `incl. ${todayL} late` : "aaj ke"}</div>
                                    </div>
                                    <div className="ta-kpi ta-kpi--red">
                                        <div className="ta-kpi-label"><XCircle size={11} /> Today Absent</div>
                                        <div className="ta-kpi-val">{todayA}</div>
                                        <div className="ta-kpi-sub">aaj nahi aaye</div>
                                    </div>
                                    <div className="ta-kpi" style={{ borderLeftColor: todayPct >= 75 ? "var(--tp-success)" : "var(--tp-danger)" }}>
                                        <div className="ta-kpi-label"><TrendingUp size={11} /> Today %</div>
                                        <div className="ta-kpi-val" style={{ color: todayPct >= 75 ? "var(--tp-success)" : "var(--tp-danger)" }}>{todayPct}%</div>
                                        <div className="ta-kpi-sub">aaj ki attendance</div>
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="ta-daily-filter">
                            <span className="ta-strip-label">Filter:</span>
                            <div className="ta-daily-chips">
                                <button className={`ta-chip${dailyFilterCourse === "all" ? " ta-chip--active" : ""}`} onClick={() => { setDailyFilterCourse("all"); setDailyPage(1); }}>
                                    <span>All Courses</span><span className="ta-chip-badge">{dailyStats.length}</span>
                                </button>
                                {courseDailyStats.map((c) => (
                                    <button key={c.courseId} className={`ta-chip${dailyFilterCourse === c.courseId ? " ta-chip--active" : ""}`} onClick={() => { setDailyFilterCourse(c.courseId); setDailyPage(1); }}>
                                        <span>{c.courseName}</span><span className="ta-chip-badge">{c.daily.length}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {ovLoading ? (
                            <div className="ta-empty"><div className="ta-spinner" /></div>
                        ) : activeDailyData.length === 0 ? (
                            <div className="ta-empty"><BookOpen size={28} style={{ opacity: 0.2 }} /><span>Koi record nahi — pehle attendance mark karo</span></div>
                        ) : (
                            <div className="ta-table-wrap">
                                <div className="ta-daily-head">
                                    <span>Date</span><span style={{ textAlign: "center" }}>Total</span><span style={{ textAlign: "center" }}>Present</span><span style={{ textAlign: "center" }}>Absent</span><span style={{ textAlign: "center" }}>Late</span><span style={{ textAlign: "center" }}>Holiday</span><span style={{ textAlign: "center" }}>Leave</span><span>Attendance %</span>
                                </div>
                                {dailyPaged.map((day) => {
                                    const attended = day.present + day.late;
                                    const counted = day.total - day.holiday - day.leave;
                                    const pct = counted > 0 ? Math.round((attended / counted) * 100) : 0;
                                    const clr = pct >= 75 ? "var(--tp-success)" : pct >= 50 ? "var(--tp-warn)" : "var(--tp-danger)";
                                    const isToday = day.date === todayLocal();

                                    return (
                                        <div key={day.date} className={`ta-daily-row${isToday ? " ta-daily-row--today" : ""}`}>
                                            <div className="ta-daily-date">
                                                <span className="ta-daily-date-main">{fmtDateShort(day.date)}</span>
                                                {isToday && (<span className="ta-today-badge">Today</span>)}
                                            </div>
                                            <div className="ta-daily-cell"><span className="ta-daily-num">{day.total}</span></div>
                                            {([
                                                { v: day.present, bg: "rgba(34,197,94,0.1)", c: "var(--tp-success)", b: "rgba(34,197,94,0.25)" },
                                                { v: day.absent, bg: "rgba(239,68,68,0.1)", c: "var(--tp-danger)", b: "rgba(239,68,68,0.25)" },
                                                { v: day.late, bg: "rgba(245,158,11,0.1)", c: "var(--tp-warn)", b: "rgba(245,158,11,0.25)" },
                                                { v: day.holiday, bg: "rgba(96,165,250,0.1)", c: "#60a5fa", b: "rgba(96,165,250,0.25)" },
                                                { v: day.leave, bg: "rgba(167,139,250,0.1)", c: "#a78bfa", b: "rgba(167,139,250,0.25)" },
                                            ] as const).map((col, ci) => (
                                                <div key={ci} className="ta-daily-cell">
                                                    <span className="ta-daily-badge" style={{ background: col.bg, color: col.c, border: `1px solid ${col.b}` }}>{col.v}</span>
                                                </div>
                                            ))}
                                            <div className="ta-daily-pct">
                                                <div className="ta-daily-bar-wrap"><div className="ta-daily-bar" style={{ width: `${pct}%`, background: clr }} /></div>
                                                <span className="ta-daily-pct-label" style={{ color: clr }}>{pct}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {dailyTotalPages > 1 && (
                                    <div className="ta-pag">
                                        <button className="ta-pag-btn" disabled={dailyPage === 1} onClick={() => setDailyPage((p) => p - 1)}><ChevronLeft size={13} /> Prev</button>
                                        <span className="ta-pag-info">Page {dailyPage} / {dailyTotalPages}<span style={{ color: "var(--tp-muted)", marginLeft: 6 }}>({activeDailyData.length} days)</span></span>
                                        <button className="ta-pag-btn" disabled={dailyPage === dailyTotalPages} onClick={() => setDailyPage((p) => p + 1)}>Next <ChevronRight size={13} /></button>
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

                        <div className="ta-ov-filters">
                            <div className="ta-search-wrap">
                                <input className="ta-search" placeholder="Name ya ID se search…" value={ovSearch} onChange={(e) => { setOvSearch(e.target.value); setOvPage(1); }} />
                            </div>
                            <select className="ta-ov-select" value={ovCourseFilter} onChange={(e) => { setOvCourseFilter(e.target.value); setOvPage(1); }}>
                                <option value="all">All Courses</option>
                                {courseSummary.map((c) => (<option key={String(c._id)} value={String(c._id)}>{c.name}</option>))}
                            </select>
                            <select className="ta-ov-select" value={ovStatusFilter} onChange={(e) => { setOvStatusFilter(e.target.value); setOvPage(1); }}>
                                <option value="all">All Status</option>
                                <option value="good">Good (≥75%)</option>
                                <option value="warning">Warning (50–74%)</option>
                                <option value="danger">Critical (&lt;50%)</option>
                                <option value="none">No Attendance</option>
                            </select>
                        </div>

                        <div className="ta-ov-count">Showing <strong>{ovFiltered.length}</strong> of <strong>{overviewDocs.length}</strong> students</div>

                        {ovLoading ? (
                            <div className="ta-empty"><div className="ta-spinner" /></div>
                        ) : ovPaged.length === 0 ? (
                            <div className="ta-empty"><Users size={28} style={{ opacity: 0.2 }} /><span>Koi student nahi mila</span></div>
                        ) : (
                            <div className="ta-table-wrap">
                                <div className="ta-ov-head">
                                    <span>#</span><span>Student</span><span>Course</span><span style={{ textAlign: "center" }}>Total</span><span style={{ textAlign: "center" }}>Present</span><span style={{ textAlign: "center" }}>Absent</span><span style={{ textAlign: "center" }}>Late</span><span>Attendance %</span>
                                </div>
                                {ovPaged.map((doc, i) => {
                                    const pct = doc.stats?.percentage ?? 0;
                                    const clr = pctColor(pct);
                                    const hasAtt = doc.hasAttendance && doc.stats.total > 0;
                                    const isExpanded = expandedStudent === doc.enrollmentId;
                                    const recentRecords = [...(doc.records ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

                                    return (
                                        <div key={doc.enrollmentId}>
                                            <div className={`ta-ov-row${isExpanded ? " ta-ov-row--exp" : ""}${!hasAtt ? " ta-ov-row--noatt" : ""}`} onClick={() => setExpandedStudent(isExpanded ? null : doc.enrollmentId)}>
                                                <span className="ta-sno">{(ovPage - 1) * OV_LIMIT + i + 1}</span>
                                                <div className="ta-row-student">
                                                    <div className="ta-avatar" style={{ background: hasAtt ? `color-mix(in srgb,${clr} 15%,transparent)` : "var(--tp-border)", color: hasAtt ? clr : "var(--tp-muted)" }}>
                                                        {doc.student?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ta-info">
                                                        <div className="ta-name">{doc.student?.name}</div>
                                                        <div className="ta-sid">{doc.student?.studentId}</div>
                                                    </div>
                                                </div>
                                                <div className="ta-ov-course">{doc.course?.name}</div>
                                                <div className="ta-ov-num">{hasAtt ? <span className="ta-ov-total">{doc.stats.total}</span> : <span className="ta-ov-none">—</span>}</div>
                                                {([
                                                    { v: doc.stats.present, cls: "present" },
                                                    { v: doc.stats.absent, cls: "absent" },
                                                    { v: doc.stats.late, cls: "late" },
                                                ] as const).map(({ v, cls }) => (
                                                    <div key={cls} className="ta-ov-num">
                                                        {hasAtt ? (<span className={`ta-ov-badge ta-ov-badge--${cls}`}>{v}</span>) : <span className="ta-ov-none">—</span>}
                                                    </div>
                                                ))}
                                                <div className="ta-ov-pct">
                                                    {hasAtt ? (
                                                        <>
                                                            <div className="ta-pct-track"><div className="ta-pct-fill" style={{ width: `${pct}%`, background: clr }} /></div>
                                                            <span style={{ color: clr, fontWeight: 700, fontSize: 12, minWidth: 34 }}>{pct}%</span>
                                                            {pct < 75 && (<AlertTriangle size={11} color="var(--tp-danger)" />)}
                                                        </>
                                                    ) : (<span className="ta-ov-no-rec">No Record</span>)}
                                                </div>
                                            </div>
                                            {isExpanded && (
                                                <div className="ta-ov-expanded">
                                                    <div className="ta-ov-exp-header">📅 Recent Attendance (last 10)</div>
                                                    {recentRecords.length === 0 ? (
                                                        <div className="ta-ov-exp-empty">Koi record nahi</div>
                                                    ) : (
                                                        <div className="ta-ov-rec-list">
                                                            {recentRecords.map((rec: any, ri: number) => {
                                                                const cfg = STATUS_CFG[rec.status as StatusKey];
                                                                const Icon = cfg?.icon;
                                                                return (
                                                                    <div key={ri} className="ta-ov-rec-row">
                                                                        <span className="ta-ov-rec-date">{fmtDate(rec.date)}</span>
                                                                        {cfg && (<span className="ta-ov-rec-status" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>{Icon && <Icon size={10} />} {cfg.label}</span>)}
                                                                        {rec.inTime && (<span className="ta-ov-rec-time">🕐 {rec.inTime}{rec.outTime ? ` → ${rec.outTime}` : ""}</span>)}
                                                                        {rec.markedVia && (<span className="ta-ov-rec-via">{rec.markedVia === "qr" ? "📱 QR" : "✏️ Manual"}</span>)}
                                                                        {rec.remark && (<span className="ta-ov-rec-remark">{rec.remark}</span>)}
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
                                        <button className="ta-pag-btn" disabled={ovPage === 1} onClick={() => setOvPage((p) => p - 1)}><ChevronLeft size={13} /> Prev</button>
                                        <span className="ta-pag-info">Page {ovPage} / {ovTotalPages}</span>
                                        <button className="ta-pag-btn" disabled={ovPage === ovTotalPages} onClick={() => setOvPage((p) => p + 1)}>Next <ChevronRight size={13} /></button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
                /* ── VERIFY TAB STYLES ── */
                .ta-verify-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px; }
                .ta-verify-title { font-size:1.2rem; font-weight:700; color:var(--tp-text); margin:0; }
                .ta-verify-sub { font-size:12px; color:var(--tp-muted); margin-top:2px; }
                .ta-save-btn--bulk { background:var(--tp-success); }
                .ta-verify-list { display:flex; flex-direction:column; gap:10px; }
                .ta-verify-card { display:flex; align-items:center; gap:16px; padding:14px 16px; background:var(--tp-surface); border:1px solid var(--tp-border); border-radius:12px; transition:all 0.2s; }
                .ta-verify-card:hover { border-color:var(--tp-accent); box-shadow:0 2px 8px rgba(0,0,0,0.05); }
                .ta-verify-left { display:flex; align-items:center; gap:12px; flex:1; }
                .ta-verify-info { flex:1; }
                .ta-course { font-size:11px; color:var(--tp-accent); margin-top:2px; font-weight:600; }
                .ta-verify-center { display:flex; flex-direction:column; gap:6px; align-items:flex-start; }
                .ta-verify-time { display:flex; gap:8px; flex-wrap:wrap; }
                .ta-verify-duration { font-size:11px; color:var(--tp-success); font-weight:700; }
                .ta-verify-actions { display:flex; gap:8px; margin-left:auto; }
                .ta-btn-verify { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:8px; border:1px solid; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.15s; font-family:inherit; }
                .ta-btn-verify:disabled { opacity:0.5; cursor:not-allowed; }
                .ta-btn-verify--approve { background:var(--tp-success); color:white; border-color:var(--tp-success); }
                .ta-btn-verify--approve:hover:not(:disabled) { opacity:0.9; }
                .ta-btn-verify--reject { background:var(--tp-bg); color:var(--tp-danger); border-color:var(--tp-danger); }
                .ta-btn-verify--reject:hover:not(:disabled) { background:rgba(239,68,68,0.05); }
                .ta-tab-badge { background:var(--tp-danger); color:white; font-size:9px; font-weight:800; padding:1px 5px; border-radius:100px; margin-left:4px; }
                .ta-time-badge { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; padding:4px 9px; border-radius:6px; border:1px solid; white-space:nowrap; }
                .ta-time-badge--in  { background:rgba(34,197,94,0.08); color:var(--tp-success); border-color:rgba(34,197,94,0.25); }
                .ta-time-badge--out { background:rgba(245,158,11,0.08); color:var(--tp-warn); border-color:rgba(245,158,11,0.25); }
                .ta-time-pending { font-size:9px; font-weight:700; color:var(--tp-warn); background:rgba(245,158,11,0.08); padding:3px 8px; border-radius:6px; border:1px solid rgba(245,158,11,0.2); }
                .spin { animation: taSpin .7s linear infinite; }
                @keyframes taSpin { to{transform:rotate(360deg)} }
                @media(max-width:768px) {
                    .ta-verify-card { flex-direction:column; align-items:flex-start; }
                    .ta-verify-actions { width:100%; margin-left:0; }
                    .ta-btn-verify { flex:1; justify-content:center; }
                }
                
                /* Existing styles preserved below... */
                .ta-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--tp-text); display:flex; flex-direction:column; gap:14px; }
                .ta-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; display:flex; align-items:center; gap:8px; box-shadow:0 8px 24px rgba(0,0,0,.4); animation:taIn .2s ease; }
                .ta-toast--success { background:rgba(34,197,94,0.12); color:var(--tp-success); border:1px solid rgba(34,197,94,0.3); }
                .ta-toast--error   { background:rgba(239,68,68,0.12);  color:var(--tp-danger);  border:1px solid rgba(239,68,68,0.3); }
                @keyframes taIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
                .ta-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
                .ta-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--tp-text); font-weight:400; }
                .ta-sub    { font-size:12px; color:var(--tp-muted); margin-top:3px; }
                .ta-tabs   { display:flex; gap:4px; background:var(--tp-bg); border:1px solid var(--tp-border); border-radius:10px; padding:4px; }
                .ta-tab    { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:7px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; color:var(--tp-muted); background:transparent; transition:all .15s; }
                .ta-tab--active { background:var(--tp-surface); color:var(--tp-accent); box-shadow:0 1px 4px rgba(0,0,0,.15); }
                .ta-tab:hover:not(.ta-tab--active) { color:var(--tp-subtext); }
                .ta-course-strip { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:12px 16px; background:var(--tp-surface); border:1px solid var(--tp-border); border-radius:12px; }
                .ta-strip-label  { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--tp-muted); white-space:nowrap; }
                .ta-chip  { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:100px; border:1px solid var(--tp-border); background:var(--tp-surface2,var(--tp-surface)); cursor:pointer; transition:all .14s; font-family:'Plus Jakarta Sans',sans-serif; }
                .ta-chip:hover { border-color:var(--tp-accent); background:var(--tp-accent-glow); }
                .ta-chip--active { border-color:var(--tp-accent); background:var(--tp-accent-glow); }
                .ta-chip-badge { font-size:10px; font-weight:800; padding:1px 7px; border-radius:100px; background:var(--tp-border); color:var(--tp-muted); }
                .ta-chip--active .ta-chip-badge { background:color-mix(in srgb,var(--tp-accent) 25%,transparent); color:var(--tp-accent); }
                .ta-filters { display:flex; gap:12px; flex-wrap:wrap; background:var(--tp-surface); border:1px solid var(--tp-border); border-radius:12px; padding:16px; }
                .ta-field  { display:flex; flex-direction:column; gap:5px; flex:1; min-width:180px; }
                .ta-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--tp-muted); display:flex; align-items:center; gap:4px; }
                .ta-select, .ta-date-input { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px; background:var(--tp-bg); border:1px solid var(--tp-border); border-radius:8px; color:var(--tp-text); outline:none; transition:border-color .15s; width:100%; appearance:none; }
                .ta-select:focus, .ta-date-input:focus { border-color:var(--tp-accent); }
                .ta-sel-wrap { position:relative; }
                .ta-sel-icon { position:absolute; right:10px; top:50%; transform:translateY(-50%); color:var(--tp-muted); pointer-events:none; }
                .ta-mark-all { display:flex; align-items:center; gap:7px; flex-wrap:wrap; margin-bottom:8px; }
                .ta-mark-label { font-size:11px; color:var(--tp-muted); font-weight:600; }
                .ta-mark-btn { font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:4px 10px; border-radius:7px; border:1px solid var(--tp-border); background:var(--tp-bg); color:var(--tp-muted); cursor:pointer; transition:opacity .13s; display:inline-flex; align-items:center; gap:4px; }
                .ta-mark-btn:hover { opacity:.75; }
                .ta-summary { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:12px; }
                .ta-sum-item { display:flex; align-items:center; gap:4px; font-size:11px; font-weight:600; }
                .ta-sum-dot { width:8px; height:8px; border-radius:50%; }
                .ta-sum-total { margin-left:auto; font-size:11px; font-weight:700; color:var(--tp-text); display:flex; align-items:center; gap:4px; }
                .ta-table-head { display:grid; grid-template-columns:36px 1.4fr 1.6fr 100px 100px 1fr; gap:10px; padding:10px 16px; background:var(--tp-surface2,var(--tp-bg)); border-bottom:1px solid var(--tp-border); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--tp-muted); }
                .ta-list { display:flex; flex-direction:column; }
                .ta-row  { display:grid; grid-template-columns:36px 1.4fr 1.6fr 100px 100px 1fr; gap:10px; padding:11px 16px; border-top:1px solid var(--tp-border); align-items:center; transition:background .12s; border-left:3px solid transparent; }
                .ta-row:hover { background:var(--tp-accent-glow); }
                .ta-row--marked { background:rgba(34,197,94,0.02); }
                .ta-sno  { font-size:10px; color:var(--tp-muted); font-weight:600; text-align:center; }
                .ta-row-student { display:flex; align-items:center; gap:9px; }
                .ta-avatar { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; }
                .ta-info { flex:1; }
                .ta-name { font-size:12.5px; color:var(--tp-text); font-weight:600; }
                .ta-sid  { font-size:10px; color:var(--tp-muted); margin-top:1px; }
                .ta-pct { font-size:11px; font-weight:700; min-width:36px; text-align:right; }
                .ta-marked-badge { font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; background:rgba(34,197,94,0.1); color:var(--tp-success); border:1px solid rgba(34,197,94,0.3); margin-left:auto; flex-shrink:0; }
                .ta-status-btns { display:flex; gap:4px; flex-wrap:wrap; }
                .ta-status-btn { display:inline-flex; align-items:center; gap:4px; font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:5px 9px; border-radius:7px; border:1px solid var(--tp-border); background:var(--tp-bg); color:var(--tp-muted); cursor:pointer; transition:all .13s; white-space:nowrap; }
                .ta-status-btn:hover:not(.ta-status-btn--active) { border-color:var(--tp-border2,var(--tp-border)); color:var(--tp-subtext); }
                .ta-time-cell { display:flex; align-items:center; justify-content:center; }
                .ta-time-input { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; padding:6px; background:var(--tp-bg); border:1px solid var(--tp-border); border-radius:6px; color:var(--tp-text); outline:none; width:100%; }
                .ta-time-na { font-size:11px; color:var(--tp-muted); }
                .ta-remark { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; padding:7px 10px; background:var(--tp-bg); border:1px solid var(--tp-border); border-radius:7px; color:var(--tp-subtext); outline:none; width:100%; }
                .ta-remark:focus { border-color:var(--tp-accent); }
                .ta-bottom-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; background:var(--tp-surface); border:1px solid var(--tp-border); border-radius:12px; padding:14px 18px; position:sticky; bottom:0; box-shadow:0 -4px 16px rgba(0,0,0,.1); }
                .ta-bottom-info { font-size:12px; color:var(--tp-muted); display:flex; align-items:center; gap:6px; }
                .ta-save-btn  { display:inline-flex; align-items:center; gap:7px; padding:10px 22px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--tp-accent); color:#fff; }
                .ta-save-btn:hover    { opacity:.88; }
                .ta-save-btn:disabled { opacity:.5; cursor:not-allowed; }
                .ta-empty { background:var(--tp-surface); border:1px dashed var(--tp-border); border-radius:12px; padding:48px; text-align:center; color:var(--tp-muted); font-size:13px; display:flex; flex-direction:column; align-items:center; gap:8px; }
                .ta-spinner { width:18px; height:18px; border:2px solid var(--tp-border); border-top-color:var(--tp-accent); border-radius:50%; animation:taSpin .7s linear infinite; }
                .ta-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:16px; }
                .ta-kpi-row--3 { grid-template-columns:repeat(3,1fr); }
                @media(max-width:700px){ .ta-kpi-row, .ta-kpi-row--3 { grid-template-columns:1fr 1fr; } }
                .ta-kpi { background:var(--tp-surface); border:1px solid var(--tp-border); border-radius:10px; padding:14px 16px; border-left:3px solid; }
                .ta-kpi--accent { border-left-color:var(--tp-accent); }
                .ta-kpi--green  { border-left-color:var(--tp-success); }
                .ta-kpi--red    { border-left-color:var(--tp-danger); }
                .ta-kpi-label { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--tp-muted); margin-bottom:4px; }
                .ta-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:var(--tp-text); line-height:1; margin-bottom:3px; }
                .ta-kpi-sub   { font-size:10px; color:var(--tp-muted); }
                .ta-daily-filter { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:12px; }
                .ta-daily-chips  { display:flex; gap:6px; flex-wrap:wrap; }
                .ta-daily-head { display: grid; grid-template-columns: 120px 60px 70px 60px 60px 70px 60px 1fr; gap: 8px; padding: 10px 16px; background: var(--tp-surface2, var(--tp-bg)); border-bottom: 1px solid var(--tp-border); font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--tp-muted); }
                .ta-daily-row { display: grid; grid-template-columns: 120px 60px 70px 60px 60px 70px 60px 1fr; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--tp-border); align-items: center; transition: background .12s; }
                .ta-daily-row:hover { background: var(--tp-accent-glow); }
                .ta-daily-row--today { background: rgba(99,102,241,0.04); border-left: 3px solid var(--tp-accent); }
                .ta-daily-date { display:flex; flex-direction:column; gap:3px; }
                .ta-daily-date-main { font-size:12px; font-weight:600; color:var(--tp-text); }
                .ta-today-badge { font-size:9px; font-weight:800; padding:1px 6px; border-radius:100px; background:rgba(99,102,241,0.12); color:var(--tp-accent); border:1px solid rgba(99,102,241,0.2); width:fit-content; }
                .ta-daily-cell { display:flex; align-items:center; justify-content:center; }
                .ta-daily-num  { font-size:13px; font-weight:700; color:var(--tp-text); }
                .ta-daily-badge { font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; min-width:32px; text-align:center; display:inline-block; }
                .ta-daily-pct { display:flex; align-items:center; gap:8px; }
                .ta-daily-bar-wrap { flex:1; height:5px; background:var(--tp-border); border-radius:100px; overflow:hidden; }
                .ta-daily-bar { height:100%; border-radius:100px; transition:width .4s; }
                .ta-daily-pct-label { font-size:11px; font-weight:700; min-width:34px; text-align:right; }
                .ta-pag { display:flex; align-items:center; justify-content:center; gap:10px; padding:12px; border-top:1px solid var(--tp-border); }
                .ta-pag-btn { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid var(--tp-border); background:var(--tp-surface); color:var(--tp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
                .ta-pag-btn:hover:not(:disabled) { border-color:var(--tp-accent); color:var(--tp-accent); }
                .ta-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
                .ta-pag-info { font-size:12px; color:var(--tp-muted); }
                .ta-ov-filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
                .ta-search-wrap { flex: 1; min-width: 200px; }
                .ta-search { width: 100%; padding: 9px 12px; background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 9px; color: var(--tp-text); font-size: 13px; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; }
                .ta-search:focus { border-color: var(--tp-accent); }
                .ta-ov-select { max-width: 200px; flex: 1; min-width: 140px; padding: 9px 12px !important; }
                .ta-ov-count { font-size: 11px; color: var(--tp-muted); padding: 2px 0; margin-bottom: 8px; }
                .ta-ov-count strong { color: var(--tp-text); }
                .ta-ov-head { display: grid; grid-template-columns: 36px 1.6fr 1.2fr 70px 80px 70px 60px 1fr; gap: 8px; padding: 10px 16px; background: var(--tp-surface2, var(--tp-bg)); border-bottom: 1px solid var(--tp-border); font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--tp-muted); }
                .ta-ov-row { display: grid; grid-template-columns: 36px 1.6fr 1.2fr 70px 80px 70px 60px 1fr; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--tp-border); align-items: center; cursor: pointer; transition: background .12s; }
                .ta-ov-row:hover { background: var(--tp-accent-glow); }
                .ta-ov-row--exp { background: var(--tp-accent-glow); }
                .ta-ov-row--noatt { opacity: 0.7; }
                @media(max-width: 900px) { .ta-ov-head, .ta-ov-row { grid-template-columns: 28px 1fr 80px 1fr; } .ta-ov-head span:nth-child(4), .ta-ov-head span:nth-child(5), .ta-ov-head span:nth-child(6), .ta-ov-head span:nth-child(7), .ta-ov-row .ta-ov-num:nth-child(4), .ta-ov-row .ta-ov-num:nth-child(5), .ta-ov-row .ta-ov-num:nth-child(6) { display: none; } }
                .ta-ov-course { font-size: 11px; color: var(--tp-subtext); font-weight: 600; line-height: 1.4; }
                .ta-ov-num { display: flex; align-items: center; justify-content: center; }
                .ta-ov-total { font-size: 13px; font-weight: 700; color: var(--tp-text); }
                .ta-ov-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px; border: 1px solid; min-width: 28px; text-align: center; display: inline-block; }
                .ta-ov-badge--present { background: rgba(34,197,94,0.1); color: var(--tp-success); border-color: rgba(34,197,94,0.25); }
                .ta-ov-badge--absent { background: rgba(239,68,68,0.1); color: var(--tp-danger); border-color: rgba(239,68,68,0.25); }
                .ta-ov-badge--late { background: rgba(245,158,11,0.1); color: var(--tp-warn); border-color: rgba(245,158,11,0.25); }
                .ta-ov-pct { display: flex; align-items: center; gap: 6px; }
                .ta-ov-none { font-size: 12px; color: var(--tp-muted); }
                .ta-ov-no-rec { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: var(--tp-border); color: var(--tp-muted); }
                .ta-pct-track { width: 80px; height: 4px; background: var(--tp-border); border-radius: 100px; overflow: hidden; }
                .ta-pct-fill { height: 100%; border-radius: 100px; }
                .ta-ov-expanded { background: var(--tp-bg); border-top: 1px solid var(--tp-border); border-bottom: 1px solid var(--tp-border); padding: 14px 16px 14px 60px; }
                .ta-ov-exp-header { font-size: 11px; font-weight: 700; color: var(--tp-text); margin-bottom: 10px; }
                .ta-ov-exp-empty { font-size: 12px; color: var(--tp-muted); padding: 8px 0; }
                .ta-ov-rec-list { display: flex; flex-direction: column; gap: 6px; }
                .ta-ov-rec-row { display: flex; align-items: center; gap: 10px; padding: 6px 10px; background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 8px; flex-wrap: wrap; }
                .ta-ov-rec-date { font-size: 11px; color: var(--tp-subtext); font-weight: 600; min-width: 130px; }
                .ta-ov-rec-status { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px; border: 1px solid; }
                .ta-ov-rec-time { font-size: 10px; color: var(--tp-muted); font-family: 'Courier New', monospace; }
                .ta-ov-rec-via { font-size: 9px; color: var(--tp-muted); font-weight: 600; padding: 2px 6px; background: var(--tp-border); border-radius: 4px; }
                .ta-ov-rec-remark { font-size: 10px; color: var(--tp-muted); font-style: italic; margin-left: auto; }
            `}</style>
        </>
    );
}