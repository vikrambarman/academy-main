// // src/app/(dashboard)/dashboard/student/attendance/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { fetchWithAuth } from "@/lib/fetchWithAuth";
// import {
//   CheckCircle2, XCircle, Clock, Coffee, CalendarDays,
//   ChevronLeft, ChevronRight, QrCode, Edit3,
//   LogIn, LogOut, UserX,
// } from "lucide-react";

// // ── Types — model se exactly match ──────────────────────
// // Model: "present" | "absent" | "late" | "holiday" | "leave"
// type AttStatus = "present" | "absent" | "late" | "holiday" | "leave";

// interface AttRecord {
//   date:       string;
//   status:     AttStatus;
//   remark:     string;
//   inTime?:    string;   // "HH:MM"
//   outTime?:   string;   // "HH:MM"
//   markedVia?: "qr" | "manual";
// }

// interface AttStats {
//   total:      number;
//   present:    number;
//   absent:     number;
//   late:       number;
//   holiday:    number;
//   leave?:     number;   // new field — optional for backward compat
//   percentage: number;
// }

// interface CourseAtt {
//   enrollmentId: string;
//   courseName:   string;
//   stats:        AttStats;
//   records:      AttRecord[];
// }

// // ── Status config — "leave" added ───────────────────────
// const STATUS_CFG: Record<
//   AttStatus,
//   {
//     label:  string;
//     color:  string;
//     bg:     string;
//     border: string;
//     icon:   any;
//   }
// > = {
//   present: {
//     label:  "Present",
//     color:  "var(--sp-success)",
//     bg:     "rgb(34 197 94 / 0.1)",
//     border: "rgb(34 197 94 / 0.25)",
//     icon:   CheckCircle2,
//   },
//   absent: {
//     label:  "Absent",
//     color:  "var(--sp-danger)",
//     bg:     "rgb(239 68 68 / 0.1)",
//     border: "rgb(239 68 68 / 0.25)",
//     icon:   XCircle,
//   },
//   late: {
//     label:  "Late",
//     color:  "var(--sp-warn)",
//     bg:     "rgb(245 158 11 / 0.1)",
//     border: "rgb(245 158 11 / 0.25)",
//     icon:   Clock,
//   },
//   holiday: {
//     label:  "Holiday",
//     color:  "var(--sp-accent2)",
//     bg:     "var(--sp-active-bg)",
//     border: "var(--sp-border2)",
//     icon:   Coffee,
//   },
//   // ✅ NEW — model me "leave" add hua
//   leave: {
//     label:  "Leave",
//     color:  "rgb(168 85 247)",     /* purple-500 */
//     bg:     "rgb(168 85 247 / 0.1)",
//     border: "rgb(168 85 247 / 0.25)",
//     icon:   UserX,
//   },
// };

// const MONTH_NAMES = [
//   "January", "February", "March", "April",
//   "May", "June", "July", "August",
//   "September", "October", "November", "December",
// ];

// // ── Helpers ─────────────────────────────────────────────
// function groupByMonth(records: AttRecord[]) {
//   const map: Record<string, AttRecord[]> = {};

//   for (const r of records) {
//     const d   = new Date(r.date);
//     const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
//     if (!map[key]) map[key] = [];
//     map[key].push(r);
//   }

//   return Object.entries(map)
//     .sort((a, b) => b[0].localeCompare(a[0]))
//     .map(([key, recs]) => {
//       const year  = parseInt(key.split("-")[0]);
//       const month = parseInt(key.split("-")[1]);
//       recs.sort(
//         (a, b) =>
//           new Date(b.date).getTime() - new Date(a.date).getTime()
//       );
//       return {
//         year,
//         month,
//         label:   `${MONTH_NAMES[month]} ${year}`,
//         records: recs,
//       };
//     });
// }

// function fmtDate(iso: string) {
//   return new Date(iso).toLocaleDateString("en-IN", {
//     weekday: "short",
//     day:     "numeric",
//     month:   "short",
//     year:    "numeric",
//   });
// }

// function calcDuration(inTime?: string, outTime?: string): string {
//   if (!inTime || !outTime) return "—";
//   const [inH, inM]   = inTime.split(":").map(Number);
//   const [outH, outM] = outTime.split(":").map(Number);
//   const diff          = outH * 60 + outM - (inH * 60 + inM);
//   if (diff <= 0) return "—";
//   const hours = Math.floor(diff / 60);
//   const mins  = diff % 60;
//   return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
// }

// // Percentage → color tokens
// function pctStyle(pct: number) {
//   if (pct >= 75) return {
//     color:  "var(--sp-success)",
//     bg:     "rgb(34 197 94 / 0.08)",
//     border: "rgb(34 197 94 / 0.2)",
//   };
//   if (pct >= 50) return {
//     color:  "var(--sp-warn)",
//     bg:     "rgb(245 158 11 / 0.08)",
//     border: "rgb(245 158 11 / 0.2)",
//   };
//   return {
//     color:  "var(--sp-danger)",
//     bg:     "rgb(239 68 68 / 0.08)",
//     border: "rgb(239 68 68 / 0.2)",
//   };
// }

// // ── Stat card keys to show ───────────────────────────────
// // Model me "leave" bhi hai — show karte hain agar > 0 ho
// const STAT_KEYS: AttStatus[] = ["present", "absent", "late", "holiday", "leave"];

// // ══════════════════════════════════════════════════════
// // COMPONENT
// // ══════════════════════════════════════════════════════
// export default function StudentAttendancePage() {
//   const [data,    setData]    = useState<CourseAtt[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [active,  setActive]  = useState(0);
//   const [month,   setMonth]   = useState(0);

//   useEffect(() => {
//     fetchWithAuth("/api/student/attendance")
//       .then((r) => r.json())
//       .then((d) => setData(d.data || []))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   // ── Loading ──────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="sap-loader">
//         <div className="sap-spinner" />
//         <span className="sap-loader-text">
//           Loading attendance…
//         </span>
//       </div>
//     );
//   }

//   // ── Empty ────────────────────────────────────────────
//   if (!data.length) {
//     return (
//       <div className="sap-empty-state">
//         <CalendarDays size={40} className="sap-empty-icon" />
//         <div className="sap-empty-title">No attendance records</div>
//         <div className="sap-empty-sub">
//           Abhi tak koi attendance mark nahi hui hai
//         </div>
//       </div>
//     );
//   }

//   // ── Derived values ───────────────────────────────────
//   const course   = data[active];
//   const months   = groupByMonth(course.records);
//   const curMonth = months[month] ?? null;
//   const pct      = course.stats.percentage;
//   const style    = pctStyle(pct);

//   // SVG ring constants
//   const R             = 36;
//   const circumference = 2 * Math.PI * R;
//   const dashOffset    = circumference * (1 - pct / 100);

//   // ────────────────────────────────────────────────────
//   return (
//     <div className="sap-root">

//       {/* Page header */}
//       <div className="sap-page-header">
//         <h1 className="sap-title">My Attendance</h1>
//         <p className="sap-sub">
//           Course-wise attendance aur detailed records dekho
//         </p>
//       </div>

//       {/* Course tabs — only when multiple enrollments */}
//       {data.length > 1 && (
//         <div className="sap-tabs">
//           {data.map((c, i) => (
//             <button
//               key={c.enrollmentId}
//               className={`sap-tab ${active === i ? "active" : ""}`}
//               onClick={() => { setActive(i); setMonth(0); }}
//             >
//               {c.courseName}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* ── Summary section ── */}
//       <div className="sap-summary">

//         {/* Circular ring card */}
//         <div
//           className="sap-ring-card"
//           style={{
//             borderColor: style.border,
//             background:  style.bg,
//           }}
//         >
//           {/* SVG Ring */}
//           <div className="sap-ring-wrap">
//             <svg
//               className="sap-ring-svg"
//               width="100"
//               height="100"
//               viewBox="0 0 100 100"
//             >
//               {/* Track */}
//               <circle
//                 cx="50" cy="50" r={R}
//                 fill="none"
//                 stroke={style.color}
//                 strokeWidth="9"
//                 strokeOpacity="0.15"
//               />
//               {/* Fill */}
//               <circle
//                 cx="50" cy="50" r={R}
//                 fill="none"
//                 stroke={style.color}
//                 strokeWidth="9"
//                 strokeDasharray={circumference}
//                 strokeDashoffset={dashOffset}
//                 strokeLinecap="round"
//                 transform="rotate(-90 50 50)"
//                 className="sap-ring-fill"
//               />
//             </svg>
//             <div className="sap-ring-center">
//               <span
//                 className="sap-ring-pct"
//                 style={{ color: style.color }}
//               >
//                 {pct}%
//               </span>
//             </div>
//           </div>

//           {/* Info */}
//           <div className="sap-ring-info">
//             <div className="sap-ring-label">Overall Attendance</div>
//             <div className="sap-ring-course">{course.courseName}</div>
//             <div className="sap-ring-total">
//               {course.stats.total} total classes
//             </div>
//             {pct < 75 && (
//               <div className="sap-warn-pill">
//                 ⚠ Below 75% — attend more classes
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stat cards grid */}
//         <div className="sap-stat-grid">
//           {STAT_KEYS.map((s) => {
//             const cfg   = STATUS_CFG[s];
//             const Icon  = cfg.icon;

//             // Leave count — handle optional field
//             const count =
//               s === "leave"
//                 ? (course.stats.leave ?? 0)
//                 : (course.stats[s] as number);

//             // Hide leave card if count is 0 and no leave records
//             if (s === "leave" && count === 0) return null;

//             return (
//               <div
//                 key={s}
//                 className="sap-stat-card"
//                 style={{
//                   borderColor: cfg.border,
//                   background:  cfg.bg,
//                 }}
//               >
//                 <Icon size={15} color={cfg.color} />
//                 <div
//                   className="sap-stat-val"
//                   style={{ color: cfg.color }}
//                 >
//                   {count}
//                 </div>
//                 <div className="sap-stat-label">{cfg.label}</div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Records section ── */}
//       {months.length === 0 ? (
//         <div className="sap-no-records">
//           <CalendarDays size={22} style={{ opacity: 0.3 }} />
//           Abhi tak koi record nahi
//         </div>
//       ) : (
//         <div className="sap-records-card">

//           {/* Month navigator */}
//           <div className="sap-month-nav">
//             <button
//               className="sap-nav-btn"
//               disabled={month === 0}
//               onClick={() => setMonth((m) => m - 1)}
//               aria-label="Previous month"
//             >
//               <ChevronLeft size={15} />
//             </button>

//             <div className="sap-month-label">
//               <CalendarDays size={13} color="var(--sp-accent2)" />
//               {curMonth?.label}
//             </div>

//             <button
//               className="sap-nav-btn"
//               disabled={month === months.length - 1}
//               onClick={() => setMonth((m) => m + 1)}
//               aria-label="Next month"
//             >
//               <ChevronRight size={15} />
//             </button>

//             <span className="sap-month-count">
//               {curMonth?.records.length ?? 0} days
//             </span>
//           </div>

//           {/* Month chips — mini summary */}
//           {curMonth && (
//             <div className="sap-month-chips">
//               {(Object.keys(STATUS_CFG) as AttStatus[]).map((s) => {
//                 const cnt = curMonth.records.filter(
//                   (r) => r.status === s
//                 ).length;
//                 if (!cnt) return null;
//                 return (
//                   <span
//                     key={s}
//                     className="sap-chip"
//                     style={{
//                       color:       STATUS_CFG[s].color,
//                       background:  STATUS_CFG[s].bg,
//                       borderColor: STATUS_CFG[s].border,
//                     }}
//                   >
//                     {cnt} {STATUS_CFG[s].label}
//                   </span>
//                 );
//               })}
//             </div>
//           )}

//           {/* Table header */}
//           <div className="sap-thead">
//             <span>Date</span>
//             <span>Status</span>
//             <span>In → Out</span>
//             <span>Duration</span>
//             <span>Marked Via</span>
//           </div>

//           {/* Table rows */}
//           {!curMonth || curMonth.records.length === 0 ? (
//             <div className="sap-no-records">
//               <CalendarDays size={18} style={{ opacity: 0.3 }} />
//               Is month mein koi record nahi
//             </div>
//           ) : (
//             curMonth.records.map((rec, i) => {
//               const cfg      = STATUS_CFG[rec.status] ?? STATUS_CFG.absent;
//               const Icon     = cfg.icon;
//               const duration = calcDuration(rec.inTime, rec.outTime);

//               return (
//                 <div key={i} className="sap-row">

//                   {/* Date */}
//                   <div className="sap-col-date">
//                     {fmtDate(rec.date)}
//                   </div>

//                   {/* Status */}
//                   <span
//                     className="sap-col-status"
//                     style={{
//                       color:       cfg.color,
//                       background:  cfg.bg,
//                       borderColor: cfg.border,
//                     }}
//                   >
//                     <Icon size={10} />
//                     {cfg.label}
//                   </span>

//                   {/* In → Out */}
//                   <div className="sap-col-time">
//                     {rec.inTime || rec.outTime ? (
//                       <div className="sap-time-row">
//                         <span className="sap-time-in">
//                           <LogIn
//                             size={11}
//                             style={{ opacity: 0.5 }}
//                           />
//                           {rec.inTime || "—"}
//                         </span>
//                         <span className="sap-time-arrow">→</span>
//                         <span className="sap-time-out">
//                           <LogOut
//                             size={11}
//                             style={{ opacity: 0.5 }}
//                           />
//                           {rec.outTime || "—"}
//                         </span>
//                       </div>
//                     ) : (
//                       <span className="sap-dash">—</span>
//                     )}
//                   </div>

//                   {/* Duration */}
//                   <div className="sap-col-duration">
//                     {duration !== "—" ? (
//                       <span className="sap-duration-badge">
//                         {duration}
//                       </span>
//                     ) : (
//                       <span className="sap-dash">—</span>
//                     )}
//                   </div>

//                   {/* Marked Via */}
//                   <div className="sap-col-marked">
//                     {rec.markedVia === "qr" ? (
//                       <span className="sap-marked-badge sap-marked-badge--qr">
//                         <QrCode size={10} /> QR
//                       </span>
//                     ) : rec.markedVia === "manual" ? (
//                       <span className="sap-marked-badge sap-marked-badge--manual">
//                         <Edit3 size={10} /> Manual
//                       </span>
//                     ) : (
//                       <span className="sap-dash">—</span>
//                     )}
//                   </div>

//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Clock, CheckCircle2, XCircle, RefreshCw, Calendar } from "lucide-react";

interface AttendanceRecord {
  enrollmentId: string;
  courseName: string;
  inTime: string | null;
  outTime: string | null;
  status: "pending" | "present" | "rejected" | "absent" | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
}

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchAttendanceStatus();
    const interval = setInterval(fetchAttendanceStatus, 10000); // Refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const fetchAttendanceStatus = async () => {
    try {
      const res = await fetchWithAuth("/api/student/attendance/status");
      const data = await res.json();
      setAttendance(data.attendance || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch attendance status", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "pending":
        return (
          <span className="sa-badge sa-badge--pending">
            <Clock size={12} /> Pending Verification
          </span>
        );
      case "present":
        return (
          <span className="sa-badge sa-badge--present">
            <CheckCircle2 size={12} /> Verified ✓
          </span>
        );
      case "rejected":
        return (
          <span className="sa-badge sa-badge--rejected">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "absent":
        return (
          <span className="sa-badge sa-badge--absent">
            <XCircle size={12} /> Absent
          </span>
        );
      default:
        return (
          <span className="sa-badge sa-badge--none">
            No Record
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="sa-loader">
        <RefreshCw className="spin" size={32} />
        <p>Loading attendance status...</p>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="sa-root">
      <style>{styles}</style>

      <div className="sa-header">
        <div className="sa-header-left">
          <Calendar size={24} />
          <div>
            <h1 className="sa-title">Today's Attendance</h1>
            <p className="sa-subtitle">
              Last updated: {lastRefresh.toLocaleTimeString("en-IN")}
            </p>
          </div>
        </div>
        <button className="sa-refresh-btn" onClick={fetchAttendanceStatus}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {attendance.length === 0 ? (
        <div className="sa-empty">
          <Calendar size={48} />
          <h2>No Attendance Records</h2>
          <p>Aaj ka koi attendance record nahi mila</p>
        </div>
      ) : (
        <div className="sa-list">
          {attendance.map((record) => (
            <div
              key={record.enrollmentId}
              className={`sa-card sa-card--${record.status || "none"}`}
            >
              <div className="sa-card-header">
                <h3 className="sa-course-name">{record.courseName}</h3>
                {getStatusBadge(record.status)}
              </div>

              <div className="sa-card-body">
                <div className="sa-time-grid">
                  <div className="sa-time-item">
                    <div className="sa-time-label">IN Time</div>
                    <div className="sa-time-value">
                      {record.inTime || "—"}
                    </div>
                  </div>
                  <div className="sa-time-item">
                    <div className="sa-time-label">OUT Time</div>
                    <div className="sa-time-value">
                      {record.outTime || "—"}
                    </div>
                  </div>
                </div>

                {record.status === "pending" && (
                  <div className="sa-pending-notice">
                    <Clock size={16} />
                    <span>
                      Teacher verify karega. Please wait for confirmation.
                    </span>
                  </div>
                )}

                {record.status === "present" && record.verifiedAt && (
                  <div className="sa-verified-notice">
                    <CheckCircle2 size={16} />
                    <span>
                      Verified at{" "}
                      {new Date(record.verifiedAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}

                {record.status === "rejected" && (
                  <div className="sa-rejected-notice">
                    <XCircle size={16} />
                    <span>Attendance rejected by teacher/admin</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = `
.sa-root {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.sa-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--sp-muted);
}

.sa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.sa-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sa-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--sp-text);
  margin: 0;
}

.sa-subtitle {
  font-size: 0.85rem;
  color: var(--sp-muted);
  margin: 0;
}

.sa-refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--sp-card);
  border: 1px solid var(--sp-border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--sp-text);
  cursor: pointer;
  transition: all 0.2s;
}

.sa-refresh-btn:hover {
  background: var(--sp-bg);
}

.sa-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--sp-muted);
}

.sa-empty h2 {
  font-size: 1.2rem;
  margin: 16px 0 8px;
  color: var(--sp-text);
}

.sa-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sa-card {
  background: var(--sp-card);
  border: 2px solid var(--sp-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.sa-card--pending {
  border-color: #f59e0b;
}

.sa-card--present {
  border-color: #22c55e;
}

.sa-card--rejected {
  border-color: #ef4444;
}

.sa-card--absent {
  border-color: #6b7280;
}

.sa-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--sp-bg);
  border-bottom: 1px solid var(--sp-border);
}

.sa-course-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--sp-text);
  margin: 0;
}

.sa-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.sa-badge--pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.sa-badge--present {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.sa-badge--rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.sa-badge--absent {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.sa-badge--none {
  background: rgba(107, 114, 128, 0.05);
  color: #9ca3af;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

.sa-card-body {
  padding: 16px;
}

.sa-time-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.sa-time-item {
  text-align: center;
}

.sa-time-label {
  font-size: 0.75rem;
  color: var(--sp-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.sa-time-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--sp-text);
  font-family: 'Courier New', monospace;
}

.sa-pending-notice,
.sa-verified-notice,
.sa-rejected-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.sa-pending-notice {
  background: rgba(245, 158, 11, 0.08);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.sa-verified-notice {
  background: rgba(34, 197, 94, 0.08);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.sa-rejected-notice {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .sa-time-grid {
    grid-template-columns: 1fr;
  }
}
`;