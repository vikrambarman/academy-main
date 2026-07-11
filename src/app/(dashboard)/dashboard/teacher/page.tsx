"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  CalendarCheck, Clock, BookOpen,
  Users, TrendingUp, AlertCircle,
  ArrowRight, RefreshCw,
} from "lucide-react";

/* ── Types ── */
interface Stats {
  totalStudents:  number;
  todayPresent:   number;
  todayAbsent:    number;
  notMarkedToday: number;
  totalNotes:     number;
  activeCourses:  number;
}

interface Course {
  _id:          string;
  name:         string;
  studentCount: number;
}

/* ── Greeting helper ── */
function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning",   emoji: "🌤"  };
  if (h < 17) return { text: "Good Afternoon", emoji: "☀️"  };
  return        { text: "Good Evening",   emoji: "🌙"  };
}

/* ── Main component ── */
export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<{ name: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [stats,   setStats]   = useState<Stats>({
    totalStudents: 0, todayPresent:   0, todayAbsent: 0,
    notMarkedToday: 0, totalNotes:    0, activeCourses: 0,
  });

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res  = await fetchWithAuth("/api/teacher/dashboard");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTeacher(data.teacher);
      setCourses(data.courses ?? []);
      setStats(data.stats);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const { text: greeting, emoji: greetEmoji } = getGreeting();

  // CARDS config me sirf tp-accent3 use karo
const CARDS = [
  {
    label:  "Total Students",
    value:  stats.totalStudents,
    icon:   Users,
    color:  "var(--tp-accent3)",
    bg:     "var(--tp-accent-glow)",
    border: "var(--tp-accent-b)",
  },
  {
    label:  "Present Today",
    value:  stats.todayPresent,
    icon:   CalendarCheck,
    color:  "#22C55E",
    bg:     "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
  },
  {
    label:  "Absent Today",
    value:  stats.todayAbsent,
    icon:   AlertCircle,
    color:  "#F87171",
    bg:     "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
  },
  {
    label:  "Not Marked",
    value:  stats.notMarkedToday,
    icon:   Clock,
    color:  "#F59E0B",
    bg:     "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    label:  "Active Courses",
    value:  stats.activeCourses,
    icon:   TrendingUp,
    color:  "#A78BFA",
    bg:     "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
  },
  {
    label:  "Total Notes",
    value:  stats.totalNotes,
    icon:   BookOpen,
    color:  "#34D399",
    bg:     "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
];

const QUICK = [
  {
    href:  "/dashboard/teacher/attendance",
    icon:  CalendarCheck,
    label: "Mark Attendance",
    sub:   "Aaj ki attendance mark karo",
    color: "var(--tp-accent3)",      // ← indigo
  },
  {
    href:  "/dashboard/teacher/timetable",
    icon:  Clock,
    label: "Manage Timetable",
    sub:   "Class schedule dekho",
    color: "#A78BFA",               // violet
  },
  {
    href:  "/dashboard/teacher/notes",
    icon:  BookOpen,
    label: "Add Notes",
    sub:   "Study material create karo",
    color: "#34D399",               // emerald
  },
];

  return (
    <div className="td-root">

      {/* ── Greeting ── */}
      <div className="td-greeting">
        <div className="td-greeting-left">
          <div className="td-greeting-eyebrow">
            <span className="td-eyebrow-dot" />
            {greeting} {greetEmoji}
          </div>

          <h1 className="td-greeting-name">
            {loading ? (
              <span className="td-skel td-skel--name" />
            ) : (
              teacher?.name ?? "Teacher"
            )}
          </h1>

          <div className="td-greeting-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day:     "numeric",
              month:   "long",
              year:    "numeric",
            })}
          </div>
        </div>

        <div className="td-greeting-right">
          <div className="td-today-pill">
            <CalendarCheck
              size={14}
              style={{ color: "var(--tp-accent2)" }}
            />
            <span>Today</span>
          </div>
          <button
            className="td-refresh-btn"
            onClick={load}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw
              size={13}
              className={loading ? "td-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && !loading && (
        <div className="td-error-banner">
          <AlertCircle size={15} />
          <span>Data load nahi hua. </span>
          <button className="td-retry-btn" onClick={load}>
            Retry karo
          </button>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="td-cards">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="td-card"
              style={{ background: c.bg, borderColor: c.border }}
            >
              {loading ? (
                <>
                  <div className="td-skel td-skel--icon" />
                  <div className="td-skel td-skel--val" />
                  <div className="td-skel td-skel--label" />
                </>
              ) : (
                <>
                  <div
                    className="td-card__icon-wrap"
                    style={{ color: c.color, background: c.bg, borderColor: c.border }}
                  >
                    <Icon size={17} />
                  </div>
                  <div
                    className="td-card__value"
                    style={{ color: c.color }}
                  >
                    {c.value}
                  </div>
                  <div className="td-card__label">{c.label}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Attendance snapshot ── */}
      {!loading && !error && stats.totalStudents > 0 && (
        <div className="td-att-snapshot">
          <div className="td-snapshot-title">
            Today's Attendance Snapshot
          </div>

          <div className="td-snapshot-bar-wrap">
            <div className="td-snapshot-bar">
              {stats.todayPresent > 0 && (
                <div
                  className="td-bar-seg td-bar-seg--present"
                  style={{
                    width: `${(stats.todayPresent / stats.totalStudents) * 100}%`,
                  }}
                />
              )}
              {stats.todayAbsent > 0 && (
                <div
                  className="td-bar-seg td-bar-seg--absent"
                  style={{
                    width: `${(stats.todayAbsent / stats.totalStudents) * 100}%`,
                  }}
                />
              )}
              {stats.notMarkedToday > 0 && (
                <div
                  className="td-bar-seg td-bar-seg--unmarked"
                  style={{
                    width: `${(stats.notMarkedToday / stats.totalStudents) * 100}%`,
                  }}
                />
              )}
            </div>
            <div className="td-snapshot-pct">
              {Math.round(
                (stats.todayPresent / stats.totalStudents) * 100
              )}% present
            </div>
          </div>

          <div className="td-snapshot-legend">
            {[
              { color: "#22C55E",            label: `Present (${stats.todayPresent})`    },
              { color: "#F87171",            label: `Absent (${stats.todayAbsent})`      },
              { color: "var(--tp-border2)",  label: `Unmarked (${stats.notMarkedToday})` },
            ].map((l) => (
              <div key={l.label} className="td-legend-item">
                <span
                  className="td-legend-dot"
                  style={{ background: l.color }}
                />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Active courses ── */}
      <div className="td-section-head">
        <span className="td-section-title">Active Courses</span>
        {!loading && (
          <span className="td-section-count">{courses.length}</span>
        )}
      </div>

      {loading ? (
        <div className="td-courses">
          {[1, 2, 3].map((i) => (
            <div key={i} className="td-course-card td-course-card--skel">
              <div className="td-skel td-skel--course" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="td-empty">Koi course nahi mila</div>
      ) : (
        <div className="td-courses">
          {courses.map((c, i) => (
            <div
              key={c._id}
              className="td-course-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="td-course-num">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="td-course-dot" />
              <div className="td-course-name">{c.name}</div>
              <div className="td-course-badge">
                {c.studentCount} students
              </div>
              <a
                href="/dashboard/teacher/attendance"
                className="td-course-cta"
              >
                Mark Attendance
                <ArrowRight size={11} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ── Quick actions ── */}
      <div className="td-section-head">
        <span className="td-section-title">Quick Actions</span>
      </div>

      <div className="td-quick">
        {QUICK.map((q, i) => {
          const Icon = q.icon;
          return (
            <a
              key={q.href}
              href={q.href}
              className="td-quick-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className="td-quick-icon"
                style={{
                  color:       q.color,
                  background:  `color-mix(in srgb, ${q.color} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${q.color} 25%, transparent)`,
                }}
              >
                <Icon size={19} />
              </div>
              <div className="td-quick-text">
                <div className="td-quick-label">{q.label}</div>
                <div className="td-quick-sub">{q.sub}</div>
              </div>
              <ArrowRight
                size={13}
                className="td-quick-arrow"
                style={{ color: q.color }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}