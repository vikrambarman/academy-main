"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  Clock, BookOpen, User,
  MapPin, CalendarDays,
} from "lucide-react";

/* ── Types ── */
type WeekDay =
  | "monday" | "tuesday" | "wednesday"
  | "thursday" | "friday" | "saturday";

interface Slot {
  day:       WeekDay;
  startTime: string;
  endTime:   string;
  subject:   string;
  teacher?:  string;
  room?:     string;
}

interface Timetable {
  _id:      string;
  course:   { name: string; authority?: string };
  slots:    Slot[];
  validFrom: string;
  validTo?:  string;
}

/* ── Constants ── */
const DAYS: { key: WeekDay; label: string; short: string }[] = [
  { key: "monday",    label: "Monday",    short: "Mon" },
  { key: "tuesday",   label: "Tuesday",   short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday",  label: "Thursday",  short: "Thu" },
  { key: "friday",    label: "Friday",    short: "Fri" },
  { key: "saturday",  label: "Saturday",  short: "Sat" },
];

/* Sunday = 0 → fallback "monday" */
const todayIndex = new Date().getDay();
const TODAY_KEY: WeekDay =
  DAYS[todayIndex === 0 ? 0 : todayIndex - 1]?.key ?? "monday";

/*
  Day accent colors — semantic per-day colors,
  intentionally not in CSS variables
  (each day needs its own unique hue)
*/
const DAY_COLORS: Record<
  WeekDay,
  { accent: string; light: string; border: string; text: string }
> = {
  monday:    { accent: "#F59E0B", light: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.22)",  text: "#F59E0B" },
  tuesday:   { accent: "#22C55E", light: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.22)",   text: "#22C55E" },
  wednesday: { accent: "#3B82F6", light: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.22)",  text: "#3B82F6" },
  thursday:  { accent: "#A855F7", light: "rgba(168,85,247,0.08)",  border: "rgba(168,85,247,0.22)",  text: "#A855F7" },
  friday:    { accent: "#F97316", light: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.22)",  text: "#F97316" },
  saturday:  { accent: "#F43F5E", light: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.22)",   text: "#F43F5E" },
};

/* ── Helpers ── */
function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ── Main component ── */
export default function StudentTimetablePage() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState(0);
  const [activeDay,  setActiveDay]  = useState<WeekDay>(TODAY_KEY);

  useEffect(() => {
    fetchWithAuth("/api/student/timetable")
      .then((r) => r.json())
      .then((d) => setTimetables(d.timetables ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="st-loader">
        <div className="st-spinner" />
        <span className="st-loader__text">
          Timetable load ho raha hai…
        </span>
      </div>
    );
  }

  /* ── Empty ── */
  if (!timetables.length) {
    return (
      <div className="st-empty">
        <CalendarDays
          size={40}
          className="st-empty__icon"
        />
        <div className="st-empty__title">
          Koi timetable nahi mila
        </div>
        <p className="st-empty__sub">
          Admin ne abhi timetable assign nahi kiya hai.
        </p>
      </div>
    );
  }

  /* ── Derived ── */
  const tt           = timetables[activeTab];
  const daySlots     = tt.slots
    .filter((s) => s.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const daysWithSlots = new Set(tt.slots.map((s) => s.day));

  return (
    <div className="st-root">
      {/* ── Page header ── */}
      <div className="st-page-header">
        <h1 className="st-title">My Timetable</h1>
        <p className="st-sub">Apna weekly class schedule dekho</p>
      </div>

      {/* ── Course tabs (only if multiple courses) ── */}
      {timetables.length > 1 && (
        <div className="st-course-tabs">
          {timetables.map((t, i) => (
            <button
              key={t._id}
              className={`st-course-tab ${
                activeTab === i ? "st-course-tab--active" : ""
              }`}
              onClick={() => {
                setActiveTab(i);
                setActiveDay(TODAY_KEY);
              }}
            >
              {t.course?.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Info bar ── */}
      <div className="st-info-bar">
        <div className="st-info-course">
          <BookOpen size={14} style={{ color: "var(--sp-accent)", flexShrink: 0 }} />
          <span>{tt.course?.name}</span>
        </div>
        <div className="st-info-dates">
          <CalendarDays size={12} />
          <span>
            Valid: {fmtDate(tt.validFrom)}
            {tt.validTo ? ` → ${fmtDate(tt.validTo)}` : " (ongoing)"}
          </span>
        </div>
      </div>

      {/* ── Day selector ── */}
      <div className="st-day-row">
        {DAYS.map((d) => {
          const hasSlots = daysWithSlots.has(d.key);
          const col      = DAY_COLORS[d.key];
          const isActive = activeDay === d.key;
          const isToday  = d.key === TODAY_KEY;
          const slotCount = tt.slots.filter((s) => s.day === d.key).length;

          return (
            <button
              key={d.key}
              className={[
                "st-day-btn",
                isActive  ? "st-day-btn--active" : "",
                !hasSlots ? "st-day-btn--empty"  : "",
              ].join(" ")}
              style={
                isActive
                  ? {
                      background:  col.light,
                      borderColor: col.accent,
                      color:       col.text,
                    }
                  : {}
              }
              onClick={() => setActiveDay(d.key)}
            >
              <span className="st-day-short">{d.short}</span>

              {isToday && (
                <span
                  className="st-today-dot"
                  style={{
                    background: isActive
                      ? col.accent
                      : "var(--sp-accent)",
                  }}
                />
              )}

              {hasSlots && (
                <span
                  className="st-day-count"
                  style={{
                    background: isActive
                      ? col.accent
                      : "var(--sp-border)",
                    color: isActive
                      ? "#fff"
                      : "var(--sp-subtext)",
                  }}
                >
                  {slotCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Active day label ── */}
      <div
        className="st-day-label"
        style={{ color: DAY_COLORS[activeDay].accent }}
      >
        {DAYS.find((d) => d.key === activeDay)?.label}
        {activeDay === TODAY_KEY && (
          <span className="st-today-tag">Today</span>
        )}
      </div>

      {/* ── Slot cards ── */}
      {daySlots.length === 0 ? (
        <div className="st-no-slots">
          <Clock size={20} style={{ opacity: 0.3 }} />
          Is din koi class nahi hai
        </div>
      ) : (
        <div className="st-slots">
          {daySlots.map((slot, i) => {
            const col = DAY_COLORS[slot.day];
            return (
              <div
                key={i}
                className="st-slot-card"
                style={{ borderLeftColor: col.accent }}
              >
                {/* Time column */}
                <div className="st-slot-time">
                  <span
                    className="st-time-start"
                    style={{ color: col.accent }}
                  >
                    {fmtTime(slot.startTime)}
                  </span>
                  <div
                    className="st-time-line"
                    style={{ background: col.border }}
                  />
                  <span className="st-time-end">
                    {fmtTime(slot.endTime)}
                  </span>
                </div>

                {/* Slot body */}
                <div className="st-slot-body">
                  <div className="st-slot-subject">{slot.subject}</div>
                  <div className="st-slot-meta">
                    {slot.teacher && (
                      <span className="st-meta-chip">
                        <User size={10} />
                        {slot.teacher}
                      </span>
                    )}
                    {slot.room && (
                      <span className="st-meta-chip">
                        <MapPin size={10} />
                        {slot.room}
                      </span>
                    )}
                    <span
                      className="st-meta-chip"
                      style={{
                        color:       col.text,
                        background:  col.light,
                        borderColor: col.border,
                      }}
                    >
                      <Clock size={10} />
                      {fmtTime(slot.startTime)} – {fmtTime(slot.endTime)}
                    </span>
                  </div>
                </div>

                {/* Slot number */}
                <div
                  className="st-slot-num"
                  style={{
                    background:  col.light,
                    color:       col.accent,
                    border:      `1px solid ${col.border}`,
                  }}
                >
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Weekly overview grid ── */}
      <div className="st-overview">
        <div className="st-overview-title">Weekly Overview</div>
        <div className="st-overview-grid">
          {DAYS.map((d) => {
            const dayS = tt.slots
              .filter((s) => s.day === d.key)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            const col      = DAY_COLORS[d.key];
            const isActive = activeDay === d.key;

            return (
              <div
                key={d.key}
                className={`st-ov-col ${
                  isActive ? "st-ov-col--active" : ""
                }`}
                onClick={() => setActiveDay(d.key)}
              >
                {/* Day header */}
                <div
                  className="st-ov-day"
                  style={isActive ? { color: col.accent } : {}}
                >
                  {d.short}
                  {d.key === TODAY_KEY && (
                    <span
                      className="st-ov-today-dot"
                      style={{ background: col.accent }}
                    />
                  )}
                </div>

                {/* Slots or empty */}
                {dayS.length === 0 ? (
                  <div className="st-ov-empty">—</div>
                ) : (
                  dayS.map((s, i) => (
                    <div
                      key={i}
                      className="st-ov-slot"
                      style={{
                        background:  col.light,
                        borderColor: col.border,
                        color:       col.text,
                      }}
                    >
                      <div className="st-ov-slot-name">{s.subject}</div>
                      <div className="st-ov-slot-time">
                        {fmtTime(s.startTime)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}