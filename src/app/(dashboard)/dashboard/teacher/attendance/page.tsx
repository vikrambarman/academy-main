"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  CheckCircle, XCircle, Clock,
  Coffee, Umbrella, Save,
  ChevronDown, AlertCircle, Users, Calendar,
} from "lucide-react";

/* ── Types ── */
type AttendanceStatus =
  | "present" | "absent" | "late"
  | "holiday" | "leave" | "";

interface StudentRow {
  enrollmentId: string;
  studentId:    string;
  name:         string;
  status:       AttendanceStatus;
  remark:       string;
  stats: {
    percentage: number;
    present:    number;
    absent:     number;
    late:       number;
    total:      number;
    leave:      number;
    holiday:    number;
  };
}

interface Course {
  _id:  string;
  name: string;
}

/* ── Status config ── */
const STATUS_CFG = {
  present: {
    label:  "Present",
    color:  "var(--tp-success)",
    bg:     "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.30)",
    icon:   CheckCircle,
  },
  absent: {
    label:  "Absent",
    color:  "var(--tp-danger)",
    bg:     "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.30)",
    icon:   XCircle,
  },
  late: {
    label:  "Late",
    color:  "var(--tp-warn)",
    bg:     "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.30)",
    icon:   Clock,
  },
  holiday: {
    label:  "Holiday",
    color:  "#818CF8",
    bg:     "rgba(129,140,248,0.10)",
    border: "rgba(129,140,248,0.30)",
    icon:   Coffee,
  },
  leave: {
    label:  "Leave",
    color:  "#A78BFA",
    bg:     "rgba(167,139,250,0.10)",
    border: "rgba(167,139,250,0.30)",
    icon:   Umbrella,
  },
} as const;

type StatusKey = keyof typeof STATUS_CFG;
const STATUS_KEYS = Object.keys(STATUS_CFG) as StatusKey[];

/* ── Date helpers ── */

/**
 * Local date → "YYYY-MM-DD"
 * timezone-safe: toISOString() gives UTC,
 * jo Indian time me date galat ho sakti hai
 */
function todayLocal(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * "YYYY-MM-DD" string → Date (midnight local)
 * Server se compare ke liye consistent rahega
 */
function parseLocalDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

/* ── Percentage color ── */
function pctColor(p: number): string {
  if (p >= 75) return "var(--tp-success)";
  if (p >= 50) return "var(--tp-warn)";
  return "var(--tp-danger)";
}

/* ── Main component ── */
export default function TeacherAttendancePage() {
  const [courses,  setCourses]  = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [date,     setDate]     = useState(todayLocal);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [bulkSel,  setBulkSel]  = useState<StatusKey | "">("");
  const [toast,    setToast]    = useState<{
    type: "success" | "error";
    msg:  string;
  } | null>(null);

  /* ── Toast helper ── */
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
      .catch(() => {});
  }, []);

  /* ── Load attendance ── */
  const loadAttendance = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res  = await fetchWithAuth(
        `/api/teacher/attendance?courseId=${courseId}&date=${date}`
      );
      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message || "Attendance load nahi hui");
        return;
      }

      const enrollments: any[] = data.enrollments ?? [];
      const attendance:  any[] = data.attendance  ?? [];

      /*
        enrollments = active Enrollment docs (populated with student)
        attendance  = Attendance docs with todayRecord + stats
        Match by: att.enrollmentId === enrollment._id
      */
      const rows: StudentRow[] = enrollments.map((enr) => {
        const att = attendance.find(
          (a) => String(a.enrollmentId) === String(enr._id)
        );

        /* todayRecord — already computed by server */
        const today = att?.todayRecord ?? null;

        return {
          enrollmentId: String(enr._id),
          studentId:    String(enr.student?._id ?? enr.student ?? ""),
          name:         enr.student?.name      ?? "—",
          status:       (today?.status ?? "") as AttendanceStatus,
          remark:       today?.remark  ?? "",
          stats:        att?.stats ?? {
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

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  /* ── State updaters ── */
  const updateStatus = (id: string, status: AttendanceStatus) =>
    setStudents((prev) =>
      prev.map((s) =>
        s.enrollmentId === id ? { ...s, status } : s
      )
    );

  const updateRemark = (id: string, remark: string) =>
    setStudents((prev) =>
      prev.map((s) =>
        s.enrollmentId === id ? { ...s, remark } : s
      )
    );

  const handleMarkAll = (key: StatusKey) => {
    setBulkSel(key);
    setStudents((prev) => prev.map((s) => ({ ...s, status: key })));
  };

  /* ── Save attendance ── */
  const handleSave = async () => {
    if (!courseId) {
      showToast("error", "Course select karo");
      return;
    }

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
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          /*
            ✅ FIX: enrollmentId alag, studentId alag
            Route expect karta hai:
              enrollmentId: Enrollment._id
              studentId:    Student._id  (for Attendance doc creation)
              courseId:     Course._id
          */
          records: students.map((s) => ({
            enrollmentId: s.enrollmentId,  // Enrollment._id
            studentId:    s.studentId,     // Student._id
            courseId,
            status:       s.status,
            remark:       s.remark.trim(),
            markedVia:    "manual" as const,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast("success", "Attendance save ho gayi ✓");
      /* Reload to get fresh stats */
      await loadAttendance();
    } catch (err: any) {
      showToast("error", err.message || "Save nahi hua, dobara try karo");
    } finally {
      setSaving(false);
    }
  };

  /* ── Summary counts ── */
  const summary = {
    present:  students.filter((s) => s.status === "present").length,
    absent:   students.filter((s) => s.status === "absent").length,
    late:     students.filter((s) => s.status === "late").length,
    holiday:  students.filter((s) => s.status === "holiday").length,
    leave:    students.filter((s) => s.status === "leave").length,
    unmarked: students.filter((s) => !s.status).length,
  };

  const allMarked = summary.unmarked === 0 && students.length > 0;

  /* ── Render ── */
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

        {/* ── Page header ── */}
        <div className="ta-header">
          <div>
            <h1 className="ta-title">Attendance</h1>
            <p className="ta-sub">
              Daily student attendance mark karo
            </p>
          </div>

          {students.length > 0 && (
            <button
              className="ta-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={13} />
              {saving ? "Saving…" : "Save Attendance"}
            </button>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="ta-filters">
          {/* Course select */}
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
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="ta-sel-icon" />
            </div>
          </div>

          {/* Date picker */}
          <div className="ta-field">
            <label className="ta-label">
              <Calendar size={10} />
              Date
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

        {/* ── Bulk mark + summary (only when students loaded) ── */}
        {students.length > 0 && (
          <>
            {/* Bulk mark all */}
            <div className="ta-mark-all">
              <span className="ta-mark-label">Sabko mark karo:</span>
              {STATUS_KEYS.map((key) => {
                const cfg    = STATUS_CFG[key];
                const Icon   = cfg.icon;
                const active = bulkSel === key;
                return (
                  <button
                    key={key}
                    className="ta-mark-btn"
                    style={
                      active
                        ? {
                            background:  cfg.bg,
                            borderColor: cfg.border,
                            color:       cfg.color,
                          }
                        : {}
                    }
                    onClick={() => handleMarkAll(key)}
                  >
                    <Icon size={11} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Summary bar */}
            <div className="ta-summary">
              {(
                [
                  { key: "present",  val: summary.present,  color: "var(--tp-success)" },
                  { key: "absent",   val: summary.absent,   color: "var(--tp-danger)"  },
                  { key: "late",     val: summary.late,     color: "var(--tp-warn)"    },
                  { key: "holiday",  val: summary.holiday,  color: "#818CF8"           },
                  { key: "leave",    val: summary.leave,    color: "#A78BFA"           },
                  { key: "unmarked", val: summary.unmarked, color: "var(--tp-muted)"   },
                ] as const
              ).map((s) => (
                <div key={s.key} className="ta-sum-item">
                  <span
                    className="ta-sum-dot"
                    style={{ background: s.color }}
                  />
                  <span
                    className="ta-sum-val"
                    style={{ color: s.color }}
                  >
                    {s.val}
                  </span>
                  <span className="ta-sum-key">{s.key}</span>
                </div>
              ))}
              <div className="ta-sum-total">
                <Users size={12} />
                {students.length} total
              </div>
            </div>
          </>
        )}

        {/* ── Main content area ── */}
        {!courseId ? (
          <div className="ta-empty">
            <Users size={28} style={{ opacity: 0.2 }} />
            <span>Pehle course select karo</span>
          </div>
        ) : loading ? (
          <div className="ta-empty">
            <div className="ta-spinner" />
            <span>Attendance load ho rahi hai…</span>
          </div>
        ) : students.length === 0 ? (
          <div className="ta-empty">
            <Users size={28} style={{ opacity: 0.2 }} />
            <span>Is course mein koi active student nahi hai</span>
          </div>
        ) : (
          <div className="ta-list">
            {students.map((st, i) => {
              const cfg = st.status
                ? STATUS_CFG[st.status as StatusKey]
                : null;

              return (
                <div
                  key={st.enrollmentId}
                  className="ta-row"
                  style={{
                    borderLeftColor: cfg?.color ?? "var(--tp-border)",
                  }}
                >
                  {/* Left: student info */}
                  <div className="ta-row-left">
                    <span className="ta-sno">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="ta-avatar">
                      {st.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="ta-info">
                      <div className="ta-name">{st.name}</div>
                      <div className="ta-sid">{st.studentId || "—"}</div>
                    </div>

                    {/* Overall attendance % */}
                    <span
                      className="ta-pct"
                      style={{ color: pctColor(st.stats.percentage) }}
                      title={`Overall: ${st.stats.present}P / ${st.stats.total}T`}
                    >
                      {st.stats.percentage}%
                    </span>
                  </div>

                  {/* Right: status buttons + remark */}
                  <div className="ta-row-right">
                    <div className="ta-status-btns">
                      {STATUS_KEYS.map((key) => {
                        const c      = STATUS_CFG[key];
                        const Icon   = c.icon;
                        const active = st.status === key;
                        return (
                          <button
                            key={key}
                            className="ta-status-btn"
                            style={
                              active
                                ? {
                                    background:  c.bg,
                                    borderColor: c.border,
                                    color:       c.color,
                                  }
                                : {}
                            }
                            onClick={() =>
                              updateStatus(
                                st.enrollmentId,
                                active ? "" : key
                              )
                            }
                          >
                            <Icon size={11} />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      className="ta-remark"
                      placeholder="Remark (optional)"
                      value={st.remark}
                      onChange={(e) =>
                        updateRemark(st.enrollmentId, e.target.value)
                      }
                      maxLength={200}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Sticky bottom bar ── */}
        {students.length > 0 && (
          <div className="ta-bottom-bar">
            <span className="ta-bottom-info">
              {allMarked ? (
                <>
                  <CheckCircle
                    size={13}
                    style={{ color: "var(--tp-success)" }}
                  />
                  Sab students mark ho gaye
                </>
              ) : (
                <>
                  <AlertCircle
                    size={13}
                    style={{ color: "var(--tp-warn)" }}
                  />
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
      </div>
    </>
  );
}