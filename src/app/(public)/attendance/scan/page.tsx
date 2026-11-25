// src/app/(public)/attendance/scan/page.tsx
"use client";

import { Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

type Step = "input" | "select" | "confirm" | "success" | "error";
type Action = "in" | "out";

interface StudentInfo {
    name: string;
    studentId: string;
}

interface EnrollmentInfo {
    _id: string;
    courseId: string;
    courseName: string;
    today: {
        hasInTime: boolean;
        hasOutTime: boolean;
        inTime: string | null;
        outTime: string | null;
        status: string | null;
    };
}

function getCurrentIST() {
    return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
}

function getCurrentDateIST() {
    return new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

export default function ScanPage() {
    const [step, setStep] = useState<Step>("input");
    const [studentId, setStudentId] = useState("");
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
    const [enrollments, setEnrollments] = useState<EnrollmentInfo[]>([]);
    const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentInfo | null>(null);
    const [action, setAction] = useState<Action>("in");
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [clock, setClock] = useState(getCurrentIST());
    const [date, setDate] = useState(getCurrentDateIST());
    const [code, setCode] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const t = setInterval(() => { setClock(getCurrentIST()); setDate(getCurrentDateIST()); }, 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (step === "input") setTimeout(() => inputRef.current?.focus(), 100);
    }, [step]);

    useEffect(() => {
        if (step === "success") {
            const t = setTimeout(() => handleReset(), 6000);
            return () => clearTimeout(t);
        }
    }, [step]);

    const handleReset = useCallback(() => {
        setStep("input");
        setStudentId("");
        setStudentInfo(null);
        setEnrollments([]);
        setSelectedEnrollment(null);
        setSuccessData(null);
        setErrorMsg("");
        setCode("");
    }, []);

    const determineAction = (enrollment: EnrollmentInfo): Action | "error" => {
        const isRejected = enrollment.today?.status === "rejected";
        if (!enrollment.today?.hasInTime || isRejected) return "in";
        if (!enrollment.today?.hasOutTime) return "out";
        return "error";
    };

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        const id = studentId.trim().toUpperCase();
        if (!id) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/attendance/scan?studentId=${id}`);
            const rawText = await res.text();

            let data;
            try { data = JSON.parse(rawText); }
            catch { throw new Error("Invalid server response"); }

            if (!res.ok) {
                setErrorMsg(data.message || "Student nahi mila");
                setStep("error");
                return;
            }

            if (!data?.student || !Array.isArray(data?.enrollments)) {
                setErrorMsg("Invalid data format");
                setStep("error");
                return;
            }

            setStudentInfo(data.student);
            setEnrollments(data.enrollments);

            if (data.enrollments.length === 1) {
                const enrollment = data.enrollments[0];
                setSelectedEnrollment(enrollment);
                const nextAction = determineAction(enrollment);
                if (nextAction === "error") {
                    setErrorMsg(`Attendance complete ✓\nIN: ${enrollment.today.inTime} | OUT: ${enrollment.today.outTime}`);
                    setStep("error");
                } else {
                    setAction(nextAction);
                    setStep("confirm");
                }
            } else {
                setStep("select");
            }
        } catch (err: any) {
            console.error("Lookup error:", err);
            setErrorMsg(err.message || "Network error");
            setStep("error");
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollmentSelect = (enrollment: EnrollmentInfo) => {
        setSelectedEnrollment(enrollment);
        const nextAction = determineAction(enrollment);
        if (nextAction === "error") {
            setErrorMsg(`Attendance complete ✓\nIN: ${enrollment.today.inTime} | OUT: ${enrollment.today.outTime}`);
            setStep("error");
        } else {
            setAction(nextAction);
            setStep("confirm");
        }
    };

    const handleMark = async () => {
        if (!code || code.trim().length !== 4) {
            setErrorMsg("4-digit code darj karein");
            setStep("error");
            return;
        }
        if (!selectedEnrollment) return;

        setLoading(true);
        try {
            const res = await fetch("/api/attendance/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: studentId.trim().toUpperCase(),
                    enrollmentId: selectedEnrollment._id,
                    action,
                    code: code.trim()
                }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                if (data.code === "INVALID_CODE") {
                    setErrorMsg("❌ Galat code! Staff se pucho.");
                } else {
                    setErrorMsg(data.message || "Mark nahi hua");
                }
                setStep("error");
                setCode("");
                return;
            }
            setSuccessData(data);
            setStep("success");
            setCode("");
        } catch (err: any) {
            console.error("Mark error:", err);
            setErrorMsg("Network error");
            setStep("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{scanStyles}</style>
            <div className="scan-root">
                <div className="scan-header">
                    <div className="scan-academy-name">Shivshakti Computer Academy</div>
                    <div className="scan-clock">{clock}</div>
                    <div className="scan-date">{date}</div>
                </div>

                <div className="scan-card">
                    {step === "input" && (
                        <form onSubmit={handleLookup} className="scan-form">
                            <div className="scan-icon-wrap scan-icon-wrap--blue">🪪</div>
                            <h2 className="scan-card-title">Attendance Scan</h2>
                            <p className="scan-card-sub">Apni Student ID enter karein</p>
                            <input ref={inputRef} className="scan-id-input" type="text" placeholder="SCA-YYYY-XXXX" value={studentId}
                                onChange={(e) => setStudentId(e.target.value.toUpperCase())} maxLength={16} autoComplete="off"
                                autoCapitalize="characters" spellCheck={false} disabled={loading} />
                            <button type="submit" className="scan-btn scan-btn--primary" disabled={loading || !studentId.trim()}>
                                {loading ? <span className="scan-spinner" /> : "Scan Karein"}
                            </button>
                        </form>
                    )}

                    {step === "select" && studentInfo && (
                        <div className="scan-select">
                            <div className="scan-icon-wrap scan-icon-wrap--blue">📚</div>
                            <h2 className="scan-card-title">Course Chunein</h2>
                            <p className="scan-card-sub">{studentInfo.name}</p>
                            <div className="scan-enrollment-list">
                                {enrollments.map((enrollment) => {
                                    const nextAction = determineAction(enrollment);
                                    const isComplete = nextAction === "error";
                                    const isRejected = enrollment.today?.status === "rejected";

                                    return (
                                        <button
                                            key={enrollment._id}
                                            className={`scan-enrollment-item ${isComplete ? "disabled" : ""} ${isRejected ? "rejected" : ""}`}
                                            onClick={() => !isComplete && handleEnrollmentSelect(enrollment)}
                                            disabled={isComplete || loading}
                                        >
                                            <div className="scan-enrollment-name">{enrollment.courseName}</div>
                                            <div className="scan-enrollment-status">
                                                {isRejected ? (
                                                    <span className="scan-status-rejected">⚠️ Rejected (Dobara IN karein)</span>
                                                ) : isComplete ? (
                                                    <span className="scan-status-complete">✓ Complete</span>
                                                ) : enrollment.today.hasInTime ? (
                                                    <span className="scan-status-in">IN: {enrollment.today.inTime}</span>
                                                ) : (
                                                    <span className="scan-status-pending">Pending</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <button className="scan-btn scan-btn--ghost" onClick={handleReset} disabled={loading}>← Wapas</button>
                        </div>
                    )}

                    {step === "confirm" && studentInfo && selectedEnrollment && (
                        <div className="scan-confirm">
                            <div className={`scan-icon-wrap ${action === "in" ? "scan-icon-wrap--green" : "scan-icon-wrap--orange"}`}>
                                {action === "in" ? "👋" : "🚪"}
                            </div>
                            <h2 className="scan-card-title">{action === "in" ? "Entry Confirm" : "Exit Confirm"}</h2>

                            <div className="scan-student-card">
                                <div className="scan-student-avatar">{studentInfo.name.charAt(0)}</div>
                                <div className="scan-student-info">
                                    <div className="scan-student-name">{studentInfo.name}</div>
                                    <div className="scan-student-id">{studentInfo.studentId}</div>
                                    <div className="scan-student-course">{selectedEnrollment.courseName}</div>
                                </div>
                            </div>

                            {selectedEnrollment.today?.status === "rejected" && (
                                <div className="scan-rejected-notice">
                                    <AlertTriangle size={14} />
                                    <span>Pichla attempt reject tha. Dobara IN scan karein.</span>
                                </div>
                            )}

                            {action === "out" && selectedEnrollment.today.inTime && (
                                <div className="scan-status-row">
                                    <span className="scan-status-chip scan-status-chip--green">IN: {selectedEnrollment.today.inTime}</span>
                                    <span className="scan-arrow">→</span>
                                    <span className="scan-status-chip scan-status-chip--orange">OUT: {clock}</span>
                                </div>
                            )}

                            <div className="scan-code-section">
                                <label className="scan-code-label">Hourly Code</label>
                                <input className="scan-code-input" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0000"
                                    value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                    maxLength={4} autoFocus disabled={loading} />
                            </div>

                            <div className="scan-btn-row">
                                <button className="scan-btn scan-btn--ghost" onClick={handleReset} disabled={loading}>← Wapas</button>
                                <button className={`scan-btn ${action === "in" ? "scan-btn--green" : "scan-btn--orange"}`}
                                    onClick={handleMark} disabled={loading}>
                                    {loading ? <span className="scan-spinner" /> : (action === "in" ? "✅ Mark IN" : "🚪 Mark OUT")}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "success" && successData && (
                        <div className="scan-success">
                            <div className="scan-success-icon">{successData.action === "in" ? "✅" : "👋"}</div>
                            <h2 className="scan-success-title">{successData.action === "in" ? "IN Marked" : "OUT Marked"}</h2>
                            <p className="scan-success-name">{successData.student?.name}</p>
                            <div className={`scan-success-time ${successData.action === "out" ? "scan-success-time--orange" : ""}`}>
                                {successData.action === "in" ? "IN" : "OUT"}: {successData.time}
                            </div>
                            {successData.duration && <div className="scan-duration">Duration: {successData.duration}</div>}

                            <div className="scan-verification-notice">
                                <Clock size={14} />
                                <span>Teacher verify karega</span>
                            </div>

                            <div className="scan-auto-reset">
                                <div className="scan-auto-bar" />
                                <span>Resetting...</span>
                            </div>
                        </div>
                    )}

                    {step === "error" && (
                        <div className="scan-error">
                            <div className="scan-error-icon">❌</div>
                            <h2 className="scan-card-title">Error</h2>
                            <p className="scan-error-msg">{errorMsg}</p>
                            <button className="scan-btn scan-btn--primary" onClick={handleReset}>↩ Dobara Try</button>
                        </div>
                    )}
                </div>

                <p className="scan-footer">Digital Attendance System</p>
            </div>
        </>
    );
}

const scanStyles = `
* { box-sizing: border-box; margin: 0; padding: 0; }
.scan-root {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #0f172a; padding: 16px; font-family: 'Inter', system-ui, sans-serif; color: #f8fafc;
}
.scan-header { text-align: center; margin-bottom: 16px; }
.scan-academy-name { font-size: 0.9rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.scan-clock { font-size: 2.2rem; font-weight: 800; color: #fff; line-height: 1; }
.scan-date { font-size: 0.8rem; color: #64748b; margin-top: 4px; }

.scan-card {
  background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px;
  padding: 24px 20px; width: 100%; max-width: 360px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.scan-icon-wrap {
  width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; font-size: 1.5rem;
}
.scan-icon-wrap--blue { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); }
.scan-icon-wrap--green { background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); }
.scan-icon-wrap--orange { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); }

.scan-card-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; text-align: center; margin-bottom: 4px; }
.scan-card-sub { font-size: 0.8rem; color: #94a3b8; text-align: center; margin-bottom: 20px; }

.scan-form { display: flex; flex-direction: column; gap: 16px; }
.scan-id-input {
  width: 100%; padding: 14px; font-size: 1.1rem; font-weight: 700; text-align: center; letter-spacing: 0.1em;
  font-family: 'Courier New', monospace; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px; color: #f1f5f9; outline: none; transition: all 0.2s;
}
.scan-id-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
.scan-id-input:disabled { opacity: 0.5; }

.scan-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer;
  font-size: 0.9rem; font-weight: 600; transition: all 0.2s; width: 100%; font-family: inherit;
}
.scan-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.scan-btn--primary { background: #6366f1; color: white; }
.scan-btn--primary:hover:not(:disabled) { background: #4f46e5; }
.scan-btn--green { background: #22c55e; color: white; }
.scan-btn--green:hover:not(:disabled) { background: #16a34a; }
.scan-btn--orange { background: #f59e0b; color: white; }
.scan-btn--orange:hover:not(:disabled) { background: #d97706; }
.scan-btn--ghost { background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.1); }
.scan-btn--ghost:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: #e2e8f0; }

.scan-spinner {
  width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white; border-radius: 50%; animation: scanSpin 0.7s linear infinite;
}
@keyframes scanSpin { to { transform: rotate(360deg); } }

.scan-select, .scan-confirm, .scan-success, .scan-error { display: flex; flex-direction: column; align-items: center; gap: 16px; }

.scan-enrollment-list { width: 100%; display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto; }
.scan-enrollment-item {
  width: 100%; padding: 12px 14px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px; cursor: pointer; transition: all 0.2s; text-align: left; font-family: inherit;
}
.scan-enrollment-item:hover:not(:disabled) { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3); }
.scan-enrollment-item:disabled { opacity: 0.4; cursor: not-allowed; }
.scan-enrollment-item.rejected { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05); }
.scan-enrollment-name { font-size: 0.85rem; font-weight: 600; color: #f1f5f9; margin-bottom: 4px; }
.scan-enrollment-status { font-size: 0.75rem; }
.scan-status-complete { color: #4ade80; }
.scan-status-in { color: #fbbf24; }
.scan-status-pending { color: #94a3b8; }
.scan-status-rejected { color: #f87171; font-weight: 600; }

.scan-student-card {
  display: flex; align-items: center; gap: 12px; width: 100%; background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px;
}
.scan-student-avatar {
  width: 40px; height: 40px; border-radius: 50%; background: #6366f1; display: flex;
  align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; color: white; flex-shrink: 0;
}
.scan-student-name { font-size: 0.9rem; font-weight: 600; color: #f1f5f9; }
.scan-student-id { font-size: 0.7rem; color: #94a3b8; font-family: monospace; }
.scan-student-course { font-size: 0.7rem; color: #6366f1; font-weight: 500; margin-top: 2px; }

.scan-rejected-notice {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 12px;
  background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;
  font-size: 0.75rem; color: #fca5a5; font-weight: 500;
}

.scan-status-row { display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center; }
.scan-status-chip { font-size: 0.75rem; font-weight: 600; padding: 6px 12px; border-radius: 8px; }
.scan-status-chip--green { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
.scan-status-chip--orange { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
.scan-arrow { color: #475569; font-size: 1rem; }

.scan-code-section { width: 100%; text-align: center; }
.scan-code-label { display: block; font-size: 0.75rem; font-weight: 600; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
.scan-code-input {
  width: 100%; max-width: 140px; padding: 12px; font-size: 1.5rem; font-weight: 800; text-align: center;
  letter-spacing: 0.4em; font-family: 'Courier New', monospace; background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: #f1f5f9; outline: none;
}
.scan-code-input:focus { border-color: #6366f1; }
.scan-code-input:disabled { opacity: 0.5; }

.scan-btn-row { display: flex; gap: 8px; width: 100%; }
.scan-btn-row .scan-btn { flex: 1; }

.scan-success-icon { font-size: 3rem; animation: scanPop 0.4s ease; }
@keyframes scanPop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.scan-success-title { font-size: 1.2rem; font-weight: 700; color: #f1f5f9; }
.scan-success-name { font-size: 0.9rem; color: #94a3b8; }
.scan-success-time {
  font-size: 1.1rem; font-weight: 800; color: #4ade80; background: rgba(34, 197, 94, 0.1);
  padding: 8px 20px; border-radius: 10px; border: 1px solid rgba(34, 197, 94, 0.2);
}
.scan-success-time--orange { color: #fbbf24; background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); }
.scan-duration { font-size: 0.8rem; color: #94a3b8; }

.scan-verification-notice {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 12px;
  background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px;
  font-size: 0.75rem; color: #a5b4fc; font-weight: 500; justify-content: center;
}

.scan-auto-reset { text-align: center; width: 100%; }
.scan-auto-bar { height: 2px; background: #6366f1; border-radius: 100px; width: 100%; animation: scanCountdown 6s linear forwards; margin-bottom: 6px; }
@keyframes scanCountdown { from { width: 100%; } to { width: 0%; } }
.scan-auto-reset span { font-size: 0.7rem; color: #64748b; }

.scan-error-icon { font-size: 2.5rem; }
.scan-error-msg {
  font-size: 0.85rem; color: #f87171; text-align: center; line-height: 1.5;
  background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.2); width: 100%;
}

.scan-footer { color: #475569; font-size: 0.7rem; margin-top: 16px; text-align: center; }
`;