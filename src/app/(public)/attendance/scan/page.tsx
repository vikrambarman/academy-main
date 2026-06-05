// src/app/attendance/scan/page.tsx
// PUBLIC PAGE - No auth required
// Wall pe QR code lagega jo is page pe redirect karega

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────
type Step = "input" | "confirm" | "success" | "error";
type Action = "in" | "out";

interface StudentInfo {
    name: string;
    studentId: string;
    courseName: string;
}

interface TodayStatus {
    hasInTime: boolean;
    hasOutTime: boolean;
    inTime: string | null;
    outTime: string | null;
    status: string | null;
}

// ── Helpers ─────────────────────────────────────────────────────
function getCurrentIST(): string {
    return new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    });
}

function getCurrentDateIST(): string {
    return new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });
}

// ══════════════════════════════════════════════════════════════════
export default function ScanPage() {
    const [step, setStep] = useState<Step>("input");
    const [studentId, setStudentId] = useState("");
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
    const [todayStatus, setTodayStatus] = useState<TodayStatus | null>(null);
    const [action, setAction] = useState<Action>("in");
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [clock, setClock] = useState(getCurrentIST());
    const [date, setDate] = useState(getCurrentDateIST());
    const inputRef = useRef<HTMLInputElement>(null);

    // Live clock
    useEffect(() => {
        const t = setInterval(() => {
            setClock(getCurrentIST());
            setDate(getCurrentDateIST());
        }, 1000);
        return () => clearInterval(t);
    }, []);

    // Auto-focus input
    useEffect(() => {
        if (step === "input") {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [step]);

    // Auto-reset after success (8 seconds)
    useEffect(() => {
        if (step === "success") {
            const t = setTimeout(() => handleReset(), 8000);
            return () => clearTimeout(t);
        }
    }, [step]);

    const handleReset = useCallback(() => {
        setStep("input");
        setStudentId("");
        setStudentInfo(null);
        setTodayStatus(null);
        setSuccessData(null);
        setErrorMsg("");
    }, []);

    // ── Fetch student info ────────────────────────────────────────
    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        const id = studentId.trim().toUpperCase();
        if (!id) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/attendance/scan?studentId=${id}`);
            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.message || "Student nahi mila");
                setStep("error");
                return;
            }

            setStudentInfo(data.student);
            setTodayStatus(data.today);

            // Determine action
            if (!data.today.hasInTime) {
                setAction("in");
            } else if (!data.today.hasOutTime) {
                setAction("out");
            } else {
                // Both marked - show already done
                setErrorMsg(
                    `Aapki aaj ki attendance complete ho chuki hai ✓\nIN: ${data.today.inTime} | OUT: ${data.today.outTime}`
                );
                setStep("error");
                return;
            }

            setStep("confirm");
        } catch {
            setErrorMsg("Network error. Internet connection check karo.");
            setStep("error");
        } finally {
            setLoading(false);
        }
    };

    // ── Mark attendance ───────────────────────────────────────────
    const handleMark = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/attendance/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: studentId.trim().toUpperCase(), action }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setErrorMsg(data.message || "Mark nahi hua");
                setStep("error");
                return;
            }

            setSuccessData(data);
            setStep("success");
        } catch {
            setErrorMsg("Network error. Dobara try karo.");
            setStep("error");
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────
    return (
        <>
            <style>{scanStyles}</style>
            <div className="scan-root">

                {/* Header */}
                <div className="scan-header">
                    <div className="scan-academy-name">
                        🎓 Shivshakti Computer Academy
                    </div>
                    <div className="scan-clock">{clock}</div>
                    <div className="scan-date">{date}</div>
                </div>

                {/* Card */}
                <div className="scan-card">

                    {/* ── STEP: INPUT ── */}
                    {step === "input" && (
                        <form onSubmit={handleLookup} className="scan-form">
                            <div className="scan-icon-wrap scan-icon-wrap--blue">
                                <span className="scan-big-icon">🪪</span>
                            </div>
                            <h2 className="scan-card-title">Student ID Enter Karo</h2>
                            <p className="scan-card-sub">
                                Apna Enrollment ID type karo<br />
                                <span className="scan-id-example">Example: SCA-2025-0001</span>
                            </p>
                            <input
                                ref={inputRef}
                                className="scan-id-input"
                                type="text"
                                placeholder="SCA-YYYY-XXXX"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                                maxLength={16}
                                autoComplete="off"
                                autoCapitalize="characters"
                                spellCheck={false}
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="scan-btn scan-btn--primary"
                                disabled={loading || !studentId.trim()}
                            >
                                {loading ? (
                                    <><span className="scan-spinner" /> Searching...</>
                                ) : (
                                    "🔍 Dhundho"
                                )}
                            </button>
                        </form>
                    )}

                    {/* ── STEP: CONFIRM ── */}
                    {step === "confirm" && studentInfo && (
                        <div className="scan-confirm">
                            <div className={`scan-icon-wrap ${action === "in" ? "scan-icon-wrap--green" : "scan-icon-wrap--orange"}`}>
                                <span className="scan-big-icon">
                                    {action === "in" ? "👋" : "🚪"}
                                </span>
                            </div>

                            <h2 className="scan-card-title">
                                {action === "in" ? "Entry Confirm Karo" : "Exit Confirm Karo"}
                            </h2>

                            {/* Student info */}
                            <div className="scan-student-card">
                                <div className="scan-student-avatar">
                                    {studentInfo.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="scan-student-info">
                                    <div className="scan-student-name">{studentInfo.name}</div>
                                    <div className="scan-student-id">{studentInfo.studentId}</div>
                                    <div className="scan-student-course">{studentInfo.courseName}</div>
                                </div>
                            </div>

                            {/* Today status (if OUT) */}
                            {action === "out" && todayStatus?.inTime && (
                                <div className="scan-status-row">
                                    <div className="scan-status-chip scan-status-chip--green">
                                        ✅ IN: {todayStatus.inTime}
                                    </div>
                                    <div className="scan-arrow">→</div>
                                    <div className="scan-status-chip scan-status-chip--orange">
                                        🚪 OUT: {clock}
                                    </div>
                                </div>
                            )}

                            {action === "in" && (
                                <div className="scan-time-now">
                                    ⏰ IN Time: <strong>{clock}</strong>
                                </div>
                            )}

                            <div className="scan-btn-row">
                                <button
                                    className="scan-btn scan-btn--ghost"
                                    onClick={handleReset}
                                    disabled={loading}
                                >
                                    ← Wapas
                                </button>
                                <button
                                    className={`scan-btn ${action === "in" ? "scan-btn--green" : "scan-btn--orange"}`}
                                    onClick={handleMark}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><span className="scan-spinner" /> Marking...</>
                                    ) : action === "in" ? (
                                        "✅ Mark IN"
                                    ) : (
                                        "🚪 Mark OUT"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP: SUCCESS ── */}
                    {step === "success" && successData && (
                        <div className="scan-success">
                            <div className="scan-success-icon">
                                {successData.action === "in" ? "✅" : "👋"}
                            </div>
                            <h2 className="scan-success-title">
                                {successData.action === "in" ? "Welcome!" : "Goodbye!"}
                            </h2>
                            <p className="scan-success-name">{successData.student?.name}</p>
                            <div className={`scan-success-time ${successData.action === "out" ? "scan-success-time--orange" : ""}`}>
                                {successData.action === "in" ? "IN" : "OUT"}: {successData.time}
                            </div>
                            {successData.duration && (
                                <div className="scan-duration">
                                    ⏱ Total Duration: {successData.duration}
                                </div>
                            )}
                            <div className="scan-auto-reset">
                                <div className="scan-auto-bar" />
                                <span>8 seconds mein auto reset ho jayega...</span>
                            </div>
                            <button className="scan-btn scan-btn--ghost" onClick={handleReset}>
                                ↩ Abhi Reset Karo
                            </button>
                        </div>
                    )}

                    {/* ── STEP: ERROR ── */}
                    {step === "error" && (
                        <div className="scan-error">
                            <div className="scan-error-icon">❌</div>
                            <h2 className="scan-card-title">Kuch Problem Aayi</h2>
                            <p className="scan-error-msg">{errorMsg}</p>
                            <button
                                className="scan-btn scan-btn--primary"
                                onClick={handleReset}
                            >
                                ↩ Dobara Try Karo
                            </button>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <p className="scan-footer">
                    Shivshakti Computer Academy · Digital Attendance System
                </p>
            </div>
        </>
    );
}

// ── Styles ─────────────────────────────────────────────────────
const scanStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .scan-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
    padding: 20px;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }

  .scan-header {
    text-align: center;
    margin-bottom: 24px;
  }
  .scan-academy-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #e2e8f0;
    letter-spacing: 0.02em;
    margin-bottom: 8px;
  }
  .scan-clock {
    font-size: 2.8rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.05em;
    line-height: 1;
  }
  .scan-date {
    font-size: 0.85rem;
    color: #94a3b8;
    margin-top: 4px;
  }

  .scan-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    padding: 40px 36px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  }

  /* Icon wrap */
  .scan-icon-wrap {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }
  .scan-icon-wrap--blue   { background: rgba(99,102,241,0.2);  border: 2px solid rgba(99,102,241,0.4);  }
  .scan-icon-wrap--green  { background: rgba(34,197,94,0.2);   border: 2px solid rgba(34,197,94,0.4);   }
  .scan-icon-wrap--orange { background: rgba(245,158,11,0.2);  border: 2px solid rgba(245,158,11,0.4);  }
  .scan-big-icon { font-size: 2rem; }

  .scan-card-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #f1f5f9;
    text-align: center;
    margin-bottom: 8px;
  }
  .scan-card-sub {
    font-size: 0.85rem;
    color: #94a3b8;
    text-align: center;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  .scan-id-example {
    font-family: 'Courier New', monospace;
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
  }

  /* Form */
  .scan-form { display: flex; flex-direction: column; align-items: center; gap: 16px; }

  .scan-id-input {
    width: 100%;
    padding: 16px 20px;
    font-size: 1.4rem;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0.15em;
    font-family: 'Courier New', monospace;
    background: rgba(255,255,255,0.07);
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 14px;
    color: #f1f5f9;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: #6366f1;
  }
  .scan-id-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.2);
  }
  .scan-id-input::placeholder { color: rgba(255,255,255,0.2); font-size: 1rem; }
  .scan-id-input:disabled { opacity: 0.5; }

  /* Buttons */
  .scan-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 700;
    transition: all 0.2s;
    width: 100%;
    font-family: inherit;
  }
  .scan-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .scan-btn--primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 4px 15px rgba(99,102,241,0.4);
  }
  .scan-btn--primary:hover:not(:disabled) { 
    transform: translateY(-1px); 
    box-shadow: 0 6px 20px rgba(99,102,241,0.5); 
  }
  .scan-btn--green {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    box-shadow: 0 4px 15px rgba(34,197,94,0.4);
  }
  .scan-btn--green:hover:not(:disabled) { transform: translateY(-1px); }
  .scan-btn--orange {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    box-shadow: 0 4px 15px rgba(245,158,11,0.4);
  }
  .scan-btn--orange:hover:not(:disabled) { transform: translateY(-1px); }
  .scan-btn--ghost {
    background: rgba(255,255,255,0.07);
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .scan-btn--ghost:hover:not(:disabled) { 
    background: rgba(255,255,255,0.1); 
    color: #e2e8f0; 
  }

  /* Spinner */
  .scan-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: scanSpin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes scanSpin { to { transform: rotate(360deg); } }

  /* Confirm */
  .scan-confirm { display: flex; flex-direction: column; align-items: center; gap: 16px; }

  .scan-student-card {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 16px;
  }
  .scan-student-avatar {
    width: 50px; height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; font-weight: 800; color: white;
    flex-shrink: 0;
  }
  .scan-student-name   { font-size: 1rem; font-weight: 700; color: #f1f5f9; }
  .scan-student-id     { font-size: 0.75rem; color: #a5b4fc; font-family: monospace; margin-top: 2px; }
  .scan-student-course { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }

  .scan-status-row {
    display: flex; align-items: center; gap: 10px;
    width: 100%; justify-content: center; flex-wrap: wrap;
  }
  .scan-status-chip {
    font-size: 0.8rem; font-weight: 700;
    padding: 8px 16px; border-radius: 10px;
  }
  .scan-status-chip--green  { background: rgba(34,197,94,0.15);  color: #4ade80; border: 1px solid rgba(34,197,94,0.3);  }
  .scan-status-chip--orange { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
  .scan-arrow { color: #475569; font-size: 1.2rem; }

  .scan-time-now {
    font-size: 0.9rem; color: #94a3b8;
    background: rgba(255,255,255,0.05);
    padding: 10px 20px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    width: 100%; text-align: center;
  }
  .scan-time-now strong { color: #a5b4fc; }

  .scan-btn-row { display: flex; gap: 10px; width: 100%; }
  .scan-btn-row .scan-btn { flex: 1; }

  /* Success */
  .scan-success { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .scan-success-icon { font-size: 4rem; animation: scanPop 0.4s ease; }
  @keyframes scanPop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .scan-success-title { font-size: 1.5rem; font-weight: 800; color: #f1f5f9; }
  .scan-success-name  { font-size: 1rem; color: #94a3b8; }
  .scan-success-time  {
    font-size: 1.3rem; font-weight: 800;
    color: #4ade80;
    background: rgba(34,197,94,0.1);
    padding: 10px 28px; border-radius: 12px;
    border: 1px solid rgba(34,197,94,0.3);
  }
  .scan-success-time--orange { color: #fbbf24; background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); }
  .scan-duration { font-size: 0.85rem; color: #a5b4fc; }

  .scan-auto-reset { text-align: center; }
  .scan-auto-bar {
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 100px;
    width: 100%;
    animation: scanCountdown 8s linear forwards;
    margin-bottom: 6px;
  }
  @keyframes scanCountdown { from { width: 100%; } to { width: 0%; } }
  .scan-auto-reset span { font-size: 0.75rem; color: #475569; }

  /* Error */
  .scan-error { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .scan-error-icon { font-size: 3rem; }
  .scan-error-msg  { font-size: 0.9rem; color: #f87171; white-space: pre-line; background: rgba(239,68,68,0.1); padding: 12px 20px; border-radius: 10px; border: 1px solid rgba(239,68,68,0.2); width: 100%; }

  /* Footer */
  .scan-footer { color: #334155; font-size: 0.75rem; margin-top: 20px; text-align: center; }
`;