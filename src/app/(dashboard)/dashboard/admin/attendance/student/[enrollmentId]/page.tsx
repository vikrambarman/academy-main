// src/app/(dashboard)/dashboard/admin/attendance/student/[enrollmentId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    ArrowLeft, Calendar, TrendingUp, Users,
    CheckCircle2, XCircle, Clock, Coffee, Umbrella,
    ChevronLeft, ChevronRight, Download, Filter,
} from "lucide-react";

type AttStatus = "present" | "absent" | "late" | "holiday" | "leave";

interface AttRecord {
    date: string;
    status: AttStatus;
    remark?: string;
    inTime?: string;
    outTime?: string;
    markedVia?: "qr" | "manual";
}

interface StudentDetail {
    enrollmentId: string;
    student: {
        _id: string;
        name: string;
        studentId: string;
    };
    course: {
        _id: string;
        name: string;
    };
    stats: {
        total: number;
        present: number;
        absent: number;
        late: number;
        holiday: number;
        leave: number;
        percentage: number;
    };
    records: AttRecord[];
}

const STATUS_CFG: Record<AttStatus, { label: string; icon: any; color: string; bg: string; border: string }> = {
    present: { label: "Present", icon: <CheckCircle2 size={10} />, color: "var(--cp-success)", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.3)" },
    absent: { label: "Absent", icon: <XCircle size={10} />, color: "var(--cp-danger)", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)" },
    late: { label: "Late", icon: <Clock size={10} />, color: "var(--cp-warning)", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
    holiday: { label: "Holiday", icon: <Coffee size={10} />, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.3)" },
    leave: { label: "Leave", icon: <Umbrella size={10} />, color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.3)" },
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
}

function groupByMonth(records: AttRecord[]) {
    const map: Record<string, AttRecord[]> = {};
    for (const r of records) {
        const d = new Date(r.date);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
        if (!map[key]) map[key] = [];
        map[key].push(r);
    }
    return Object.entries(map)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([key, recs]) => {
            const year = parseInt(key.split("-")[0]);
            const month = parseInt(key.split("-")[1]);
            recs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return { year, month, label: `${MONTH_NAMES[month]} ${year}`, records: recs };
        });
}

function calcDuration(inTime?: string, outTime?: string): string {
    if (!inTime || !outTime) return "—";
    const [inH, inM] = inTime.split(":").map(Number);
    const [outH, outM] = outTime.split(":").map(Number);
    const diff = (outH * 60 + outM) - (inH * 60 + inM);
    if (diff < 0) return "—";
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const enrollmentId = params.enrollmentId as string;

    const [data, setData] = useState<StudentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [statusFilter, setStatusFilter] = useState<AttStatus | "all">("all");

    useEffect(() => {
        if (!enrollmentId) return;
        fetchWithAuth(`/api/admin/attendance/student/${enrollmentId}`)
            .then(r => r.json())
            .then(d => {
                if (d.success) setData(d.data);
                else throw new Error(d.message);
            })
            .catch(err => {
                console.error(err);
                alert("Failed to load student details");
                router.back();
            })
            .finally(() => setLoading(false));
    }, [enrollmentId, router]);

    if (loading) {
        return (
            <div style={{ padding: 48, textAlign: "center" }}>
                <div style={{ width: 36, height: 36, border: "3px solid var(--cp-border)", borderTopColor: "var(--cp-accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 16px" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: "var(--cp-muted)", fontSize: 13 }}>Loading student details...</p>
            </div>
        );
    }

    if (!data) return null;

    const months = groupByMonth(data.records);
    const currentMonth = months[selectedMonth] ?? null;

    // Apply status filter
    const filteredRecords = statusFilter === "all"
        ? currentMonth?.records ?? []
        : (currentMonth?.records ?? []).filter(r => r.status === statusFilter);

    const pct = data.stats.percentage;
    const pctColor = pct >= 75 ? "var(--cp-success)" : pct >= 50 ? "var(--cp-warning)" : "var(--cp-danger)";
    const pctBg = pct >= 75 ? "rgba(34,197,94,0.08)" : pct >= 50 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)";
    const pctBorder = pct >= 75 ? "rgba(34,197,94,0.2)" : pct >= 50 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)";

    return (
        <>
            <style>{styles}</style>
            <div className="sd-root">

                {/* Header */}
                <div className="sd-header">
                    <button className="sd-back-btn" onClick={() => router.back()}>
                        <ArrowLeft size={16} />
                        <span>Back to Overview</span>
                    </button>
                </div>

                {/* Student Info Card */}
                <div className="sd-info-card">
                    <div className="sd-avatar" style={{ background: pctBg, color: pctColor }}>
                        {data.student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="sd-info-text">
                        <h1 className="sd-name">{data.student.name}</h1>
                        <div className="sd-meta">
                            <span>{data.student.studentId}</span>
                            <span className="sd-sep">•</span>
                            <span>{data.course.name}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="sd-stats-grid">
                    {/* Overall % */}
                    <div className="sd-stat-card sd-stat-card--main" style={{ borderColor: pctBorder, background: pctBg }}>
                        <div className="sd-stat-icon" style={{ color: pctColor }}>
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <div className="sd-stat-val" style={{ color: pctColor }}>{pct}%</div>
                            <div className="sd-stat-label">Overall Attendance</div>
                        </div>
                    </div>

                    {/* Total Days */}
                    <div className="sd-stat-card">
                        <div className="sd-stat-icon" style={{ color: "var(--cp-accent)" }}>
                            <Calendar size={18} />
                        </div>
                        <div>
                            <div className="sd-stat-val">{data.stats.total}</div>
                            <div className="sd-stat-label">Total Days</div>
                        </div>
                    </div>

                    {/* Present */}
                    <div className="sd-stat-card">
                        <div className="sd-stat-icon" style={{ color: "var(--cp-success)" }}>
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <div className="sd-stat-val">{data.stats.present}</div>
                            <div className="sd-stat-label">Present</div>
                        </div>
                    </div>

                    {/* Absent */}
                    <div className="sd-stat-card">
                        <div className="sd-stat-icon" style={{ color: "var(--cp-danger)" }}>
                            <XCircle size={18} />
                        </div>
                        <div>
                            <div className="sd-stat-val">{data.stats.absent}</div>
                            <div className="sd-stat-label">Absent</div>
                        </div>
                    </div>

                    {/* Late */}
                    <div className="sd-stat-card">
                        <div className="sd-stat-icon" style={{ color: "var(--cp-warning)" }}>
                            <Clock size={18} />
                        </div>
                        <div>
                            <div className="sd-stat-val">{data.stats.late}</div>
                            <div className="sd-stat-label">Late</div>
                        </div>
                    </div>

                    {/* Holiday */}
                    <div className="sd-stat-card">
                        <div className="sd-stat-icon" style={{ color: "#60a5fa" }}>
                            <Coffee size={18} />
                        </div>
                        <div>
                            <div className="sd-stat-val">{data.stats.holiday}</div>
                            <div className="sd-stat-label">Holiday</div>
                        </div>
                    </div>
                </div>

                {/* Filters & Controls */}
                <div className="sd-controls">
                    {/* Month Navigation */}
                    <div className="sd-month-nav">
                        <button
                            className="sd-nav-btn"
                            disabled={selectedMonth === 0}
                            onClick={() => setSelectedMonth(m => m - 1)}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <div className="sd-month-label">
                            <Calendar size={13} />
                            {currentMonth?.label ?? "No Data"}
                        </div>
                        <button
                            className="sd-nav-btn"
                            disabled={selectedMonth === months.length - 1}
                            onClick={() => setSelectedMonth(m => m + 1)}
                        >
                            <ChevronRight size={14} />
                        </button>
                        <span className="sd-month-count">
                            {currentMonth?.records.length ?? 0} days
                        </span>
                    </div>

                    {/* Status Filter */}
                    <div className="sd-status-filter">
                        <Filter size={13} />
                        <select
                            className="sd-filter-select"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as any)}
                        >
                            <option value="all">All Status</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="holiday">Holiday</option>
                            <option value="leave">Leave</option>
                        </select>
                    </div>

                    {/* Export Button */}
                    <button
                        className="sd-export-btn"
                        onClick={() => alert("Export feature coming soon!")}
                    >
                        <Download size={13} />
                        Export
                    </button>
                </div>

                {/* Records Table */}
                {filteredRecords.length === 0 ? (
                    <div className="sd-empty">
                        <Calendar size={32} style={{ opacity: .2, marginBottom: 12 }} />
                        <div>No records found</div>
                        <div style={{ fontSize: 12, color: "var(--cp-muted)", marginTop: 4 }}>
                            {statusFilter !== "all" ? "Try changing the filter" : "No attendance data for this month"}
                        </div>
                    </div>
                ) : (
                    <div className="sd-table-wrap">
                        {/* Table Header */}
                        <div className="sd-table-head">
                            <span>Date</span>
                            <span>Status</span>
                            <span>IN Time</span>
                            <span>OUT Time</span>
                            <span>Duration</span>
                            <span>Marked Via</span>
                            <span>Remark</span>
                        </div>

                        {/* Table Rows */}
                        {filteredRecords.map((rec, i) => {
                            const cfg = STATUS_CFG[rec.status];
                            const duration = calcDuration(rec.inTime, rec.outTime);
                            const isToday = new Date(rec.date).toISOString().split("T")[0] === new Date().toISOString().split("T")[0];

                            return (
                                <div
                                    key={i}
                                    className={`sd-table-row${isToday ? " sd-table-row--today" : ""}`}
                                >
                                    {/* Date */}
                                    <div className="sd-col-date">
                                        <span className="sd-date-main">{fmtDate(rec.date)}</span>
                                        {isToday && <span className="sd-today-badge">Today</span>}
                                    </div>

                                    {/* Status */}
                                    <span
                                        className="sd-col-status"
                                        style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                                    >
                                        {cfg.icon}
                                        {cfg.label}
                                    </span>

                                    {/* IN Time */}
                                    <div className="sd-col-time">
                                        {rec.inTime ? (
                                            <span className="sd-time-badge sd-time-badge--in">
                                                🕐 {rec.inTime}
                                            </span>
                                        ) : (
                                            <span className="sd-time-empty">—</span>
                                        )}
                                    </div>

                                    {/* OUT Time */}
                                    <div className="sd-col-time">
                                        {rec.outTime ? (
                                            <span className="sd-time-badge sd-time-badge--out">
                                                🚪 {rec.outTime}
                                            </span>
                                        ) : rec.inTime ? (
                                            <span className="sd-time-pending">Pending</span>
                                        ) : (
                                            <span className="sd-time-empty">—</span>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div className="sd-col-duration">
                                        {duration !== "—" ? (
                                            <span className="sd-duration-badge">{duration}</span>
                                        ) : (
                                            <span className="sd-time-empty">—</span>
                                        )}
                                    </div>

                                    {/* Marked Via */}
                                    <div className="sd-col-via">
                                        {rec.markedVia === "qr" ? (
                                            <span className="sd-via-badge sd-via-badge--qr">
                                                📱 QR
                                            </span>
                                        ) : rec.markedVia === "manual" ? (
                                            <span className="sd-via-badge sd-via-badge--manual">
                                                ✏️ Manual
                                            </span>
                                        ) : (
                                            <span className="sd-time-empty">—</span>
                                        )}
                                    </div>

                                    {/* Remark */}
                                    <div className="sd-col-remark">
                                        {rec.remark || "—"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');

.sd-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--cp-text);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.sd-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sd-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid var(--cp-border);
  background: var(--cp-surface);
  color: var(--cp-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.sd-back-btn:hover {
  border-color: var(--cp-accent);
  color: var(--cp-accent);
}

/* Student Info Card */
.sd-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--cp-surface);
  border: 1px solid var(--cp-border);
  border-radius: 16px;
  padding: 20px 24px;
}
.sd-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  flex-shrink: 0;
}
.sd-name {
  font-family: 'DM Serif Display', serif;
  font-size: 1.5rem;
  color: var(--cp-text);
  margin: 0 0 4px;
  font-weight: 400;
}
.sd-meta {
  font-size: 12px;
  color: var(--cp-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.sd-sep {
  opacity: 0.5;
}

/* Stats Grid */
.sd-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.sd-stat-card {
  background: var(--cp-surface);
  border: 1px solid var(--cp-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.sd-stat-card--main {
  border-width: 2px;
  grid-column: span 2;
}
.sd-stat-icon {
  flex-shrink: 0;
}
.sd-stat-val {
  font-family: 'DM Serif Display', serif;
  font-size: 1.4rem;
  color: var(--cp-text);
  line-height: 1;
  margin-bottom: 4px;
}
.sd-stat-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--cp-muted);
}

@media (max-width: 768px) {
  .sd-stat-card--main {
    grid-column: span 1;
  }
}

/* Controls */
.sd-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.sd-month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--cp-surface);
  border: 1px solid var(--cp-border);
  border-radius: 10px;
  padding: 6px 10px;
}
.sd-nav-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid var(--cp-border);
  background: var(--cp-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-muted);
  transition: all 0.13s;
}
.sd-nav-btn:hover:not(:disabled) {
  border-color: var(--cp-accent);
  color: var(--cp-accent);
}
.sd-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.sd-month-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--cp-text);
  min-width: 120px;
  justify-content: center;
}
.sd-month-count {
  font-size: 10px;
  color: var(--cp-muted);
  font-weight: 600;
  margin-left: 4px;
}

.sd-status-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--cp-surface);
  border: 1px solid var(--cp-border);
  border-radius: 10px;
  padding: 6px 12px;
  color: var(--cp-muted);
}
.sd-filter-select {
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--cp-text);
  outline: none;
  cursor: pointer;
}

.sd-export-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  border: 1px solid var(--cp-border);
  background: var(--cp-surface);
  color: var(--cp-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  margin-left: auto;
}
.sd-export-btn:hover {
  border-color: var(--cp-accent);
  color: var(--cp-accent);
}

/* Table */
.sd-table-wrap {
  background: var(--cp-surface);
  border: 1px solid var(--cp-border);
  border-radius: 14px;
  overflow: hidden;
}
.sd-table-head {
  display: grid;
  grid-template-columns: 180px 100px 90px 90px 80px 90px 1fr;
  gap: 10px;
  padding: 10px 18px;
  background: var(--cp-bg);
  border-bottom: 1px solid var(--cp-border);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--cp-muted);
}
.sd-table-row {
  display: grid;
  grid-template-columns: 180px 100px 90px 90px 80px 90px 1fr;
  gap: 10px;
  padding: 12px 18px;
  border-top: 1px solid var(--cp-border);
  align-items: center;
  transition: background 0.12s;
}
.sd-table-row:hover {
  background: var(--cp-accent-glow);
}
.sd-table-row--today {
  background: rgba(99,102,241,0.04);
  border-left: 3px solid var(--cp-accent);
}

@media (max-width: 1024px) {
  .sd-table-head,
  .sd-table-row {
    grid-template-columns: 140px 90px 80px 1fr;
  }
  .sd-table-head span:nth-child(3),
  .sd-table-head span:nth-child(4),
  .sd-table-head span:nth-child(5),
  .sd-table-head span:nth-child(6),
  .sd-col-time:nth-child(3),
  .sd-col-time:nth-child(4),
  .sd-col-duration,
  .sd-col-via { display: none; }
}

@media (max-width: 600px) {
  .sd-table-head,
  .sd-table-row {
    grid-template-columns: 1fr 90px;
  }
  .sd-table-head span:nth-child(7),
  .sd-col-remark { display: none; }
}

.sd-col-date {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.sd-date-main {
  font-size: 12px;
  font-weight: 600;
  color: var(--cp-text);
}
.sd-today-badge {
  font-size: 9px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 100px;
  background: rgba(99,102,241,0.12);
  color: var(--cp-accent);
  border: 1px solid rgba(99,102,241,0.2);
  width: fit-content;
}

.sd-col-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid;
  width: fit-content;
  white-space: nowrap;
}

.sd-col-time {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sd-time-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid;
  white-space: nowrap;
}
.sd-time-badge--in {
  background: rgba(34,197,94,0.08);
  color: var(--cp-success);
  border-color: rgba(34,197,94,0.25);
}
.sd-time-badge--out {
  background: rgba(245,158,11,0.08);
  color: var(--cp-warning);
  border-color: rgba(245,158,11,0.25);
}
.sd-time-empty {
  font-size: 11px;
  color: var(--cp-muted);
}
.sd-time-pending {
  font-size: 9px;
  font-weight: 700;
  color: var(--cp-warning);
  background: rgba(245,158,11,0.08);
  padding: 3px 7px;
  border-radius: 6px;
  border: 1px solid rgba(245,158,11,0.2);
}

.sd-col-duration {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sd-duration-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--cp-active-bg);
  color: var(--cp-accent);
  border: 1px solid var(--cp-border2, var(--cp-border));
}

.sd-col-via {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sd-via-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 6px;
  border: 1px solid;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.sd-via-badge--qr {
  background: rgba(99,102,241,0.1);
  color: var(--cp-accent);
  border-color: rgba(99,102,241,0.25);
}
.sd-via-badge--manual {
  background: rgba(107,114,128,0.1);
  color: var(--cp-muted);
  border-color: var(--cp-border);
}

.sd-col-remark {
  font-size: 11px;
  color: var(--cp-muted);
}

.sd-empty {
  background: var(--cp-surface);
  border: 1px dashed var(--cp-border);
  border-radius: 14px;
  padding: 48px;
  text-align: center;
  color: var(--cp-muted);
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
`;