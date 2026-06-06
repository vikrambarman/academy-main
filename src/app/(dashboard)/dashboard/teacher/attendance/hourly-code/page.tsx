// src/app/(dashboard)/dashboard/teacher/attendance/hourly-code/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Key, Clock, Copy, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

export default function StaffHourlyCodePage() {
    const [currentCode, setCurrentCode]   = useState<any>(null);
    const [upcomingCodes, setUpcomingCodes] = useState<any[]>([]);
    const [loading, setLoading]           = useState(true);
    const [refreshing, setRefreshing]     = useState(false);
    const [copied, setCopied]             = useState(false);
    const [countdown, setCountdown]       = useState("");
    const [error, setError]               = useState("");

    // ✅ useCallback - dependency warning fix
    const loadCodes = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            setError("");

            const res  = await fetchWithAuth("/api/teacher/attendance/hourly-code");
            const data = await res.json();

            if (res.status === 404) {
                setError(data.message || "Codes generate nahi hue. Admin se contact karo.");
                setCurrentCode(null);
                setUpcomingCodes([]);
                return;
            }

            if (res.status === 401) {
                setError("Session expire ho gaya. Dobara login karo.");
                return;
            }

            if (data.success) {
                setCurrentCode(data.current);
                setUpcomingCodes(data.upcoming || []);
            } else {
                setError(data.message || "Codes load nahi hue.");
            }
        } catch (err: any) {
            console.error("Failed to load codes:", err);
            setError("Network error. Internet check karo.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initial load + auto refresh every 60s
    useEffect(() => {
        loadCodes();
        const interval = setInterval(() => loadCodes(), 60000);
        return () => clearInterval(interval);
    }, [loadCodes]);

    // Countdown timer
    useEffect(() => {
        if (!currentCode) return;

        const updateCountdown = () => {
            const now     = new Date();
            const expires = new Date(currentCode.expiresAt);
            const diff    = expires.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown("Expired");
                loadCodes(); // Auto reload when expired
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setCountdown(`${minutes}:${String(seconds).padStart(2, "0")}`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [currentCode, loadCodes]);

    const handleCopy = () => {
        if (currentCode?.code) {
            navigator.clipboard.writeText(currentCode.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // ✅ Countdown warning color
    const getCountdownColor = () => {
        const parts   = countdown.split(":");
        const minutes = parseInt(parts[0] || "99");
        if (minutes < 5)  return "var(--tp-danger, #ef4444)";
        if (minutes < 10) return "var(--tp-warn, #f59e0b)";
        return "var(--tp-accent2, #14b8a6)";
    };

    if (loading) {
        return (
            <div style={{ padding: 48, textAlign: "center" }}>
                <div style={{
                    width: 36, height: 36,
                    border: "3px solid var(--tp-border)",
                    borderTopColor: "var(--tp-accent2)",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    margin: "0 auto 16px"
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: "var(--tp-muted)", fontSize: 13 }}>Loading codes...</p>
            </div>
        );
    }

    return (
        <>
            <style>{codeStyles}</style>
            <div className="code-root">

                {/* Header */}
                <div className="code-header">
                    <div>
                        <h1 className="code-title">
                            <Key size={24} /> Hourly Attendance Codes
                        </h1>
                        <p className="code-sub">Students ko current hour ka code batao</p>
                    </div>
                    {/* ✅ Manual refresh button */}
                    <button
                        className="code-refresh-btn"
                        onClick={() => loadCodes(true)}
                        disabled={refreshing}
                        title="Refresh codes"
                    >
                        <RefreshCw size={15} className={refreshing ? "spinning" : ""} />
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* ✅ Error State */}
                {error && (
                    <div className="code-error-card">
                        <AlertTriangle size={20} />
                        <div>
                            <div className="code-error-title">Code Available Nahi</div>
                            <div className="code-error-msg">{error}</div>
                        </div>
                    </div>
                )}

                {/* Current Code Card */}
                {currentCode && !error && (
                    <>
                        <div className="code-current-card">
                            <div className="code-current-header">
                                <div className="code-current-label">
                                    <Clock size={18} />
                                    Current Hour Code
                                </div>
                                <div className="code-countdown">
                                    Next code in:{" "}
                                    <strong style={{ color: getCountdownColor() }}>
                                        {countdown}
                                    </strong>
                                </div>
                            </div>

                            {/* Code Display - Click to Copy */}
                            <div className="code-display" onClick={handleCopy}>
                                <div className="code-number">{currentCode.code}</div>
                                <div className="code-copy-hint">
                                    {copied
                                        ? <><CheckCircle2 size={14} /> Copied!</>
                                        : <><Copy size={14} /> Click to copy</>
                                    }
                                </div>
                            </div>

                            {/* Hour Info */}
                            <div className="code-hour-info">
                                <span className="code-hour-badge">
                                    🕐 {String(currentCode.hour).padStart(2, "0")}:00
                                    {" → "}
                                    {String(currentCode.hour + 1).padStart(2, "0")}:00 IST
                                </span>
                                {currentCode.expiresAtFormatted && (
                                    <span className="code-expires-badge">
                                        ⏰ Expires: {currentCode.expiresAtFormatted}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Codes */}
                        {upcomingCodes.length > 1 && (
                            <div className="code-upcoming-section">
                                <h3 className="code-upcoming-title">⏭️ Upcoming Hours</h3>
                                <div className="code-upcoming-grid">
                                    {upcomingCodes.slice(1).map((c) => (
                                        <div key={c.hour} className="code-upcoming-card">
                                            <div className="code-upcoming-hour">{c.time}</div>
                                            <div className="code-upcoming-code">{c.code}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="code-instructions">
                            <h3 className="code-instructions-title">📋 Instructions</h3>
                            <div className="code-steps">
                                <div className="code-step">
                                    <span className="code-step-num">1</span>
                                    <span>Current hour ka code board pe likho ya students ko bolo</span>
                                </div>
                                <div className="code-step">
                                    <span className="code-step-num">2</span>
                                    <span>Har ghante code change hoga - countdown dekh te raho</span>
                                </div>
                                <div className="code-step">
                                    <span className="code-step-num">3</span>
                                    <span>
                                        Code change hone se{" "}
                                        <strong style={{ color: "var(--tp-warn)" }}>5 minute pehle</strong>{" "}
                                        students ko alert karo
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </>
    );
}

const codeStyles = `
  .code-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--tp-text);
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 900px;
  }

  /* Header */
  .code-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }
  .code-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.6rem;
    color: var(--tp-text);
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 6px;
  }
  .code-sub { font-size: 12px; color: var(--tp-muted); margin: 0; }

  /* Refresh Button */
  .code-refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 10px;
    border: 1px solid var(--tp-border);
    background: var(--tp-surface);
    color: var(--tp-text);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .code-refresh-btn:hover:not(:disabled) {
    border-color: var(--tp-accent2);
    color: var(--tp-accent2);
  }
  .code-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .code-refresh-btn .spinning { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Error Card */
  .code-error-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(245,158,11,0.08);
    border: 2px solid rgba(245,158,11,0.3);
    border-radius: 16px;
    padding: 20px 24px;
  }
  .code-error-card svg { color: var(--tp-warn, #f59e0b); flex-shrink: 0; }
  .code-error-title { font-size: 13px; font-weight: 700; color: var(--tp-text); margin-bottom: 4px; }
  .code-error-msg   { font-size: 12px; color: var(--tp-muted); }

  /* Current Card */
  .code-current-card {
    background: linear-gradient(135deg, rgba(20,184,166,0.1), rgba(15,118,110,0.05));
    border: 2px solid rgba(20,184,166,0.3);
    border-radius: 16px;
    padding: 28px;
  }
  .code-current-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .code-current-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: var(--tp-accent2);
  }
  .code-countdown { font-size: 12px; color: var(--tp-muted); }

  /* Code Display */
  .code-display {
    background: var(--tp-surface);
    border: 3px dashed var(--tp-accent2);
    border-radius: 14px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 16px;
  }
  .code-display:hover {
    background: rgba(20,184,166,0.05);
    border-style: solid;
  }
  .code-number {
    font-size: 4rem;
    font-weight: 800;
    color: var(--tp-accent2);
    letter-spacing: 0.1em;
    font-family: 'Courier New', monospace;
    line-height: 1;
  }
  .code-copy-hint {
    font-size: 11px;
    color: var(--tp-muted);
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  /* Hour Info */
  .code-hour-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .code-hour-badge {
    font-size: 12px;
    color: var(--tp-muted);
    background: var(--tp-bg);
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid var(--tp-border);
  }
  .code-expires-badge {
    font-size: 12px;
    color: var(--tp-muted);
    background: var(--tp-bg);
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid var(--tp-border);
  }

  /* Upcoming */
  .code-upcoming-section {
    background: var(--tp-surface);
    border: 1px solid var(--tp-border);
    border-radius: 16px;
    padding: 24px;
  }
  .code-upcoming-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--tp-text);
    margin: 0 0 16px;
  }
  .code-upcoming-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }
  .code-upcoming-card {
    background: var(--tp-bg);
    border: 1px solid var(--tp-border);
    border-radius: 10px;
    padding: 14px;
    text-align: center;
    transition: border-color 0.15s;
  }
  .code-upcoming-card:hover { border-color: var(--tp-accent2); }
  .code-upcoming-hour {
    font-size: 10px;
    color: var(--tp-muted);
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 6px;
    letter-spacing: 0.05em;
  }
  .code-upcoming-code {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--tp-text);
    font-family: 'Courier New', monospace;
  }

  /* Instructions */
  .code-instructions {
    background: var(--tp-surface);
    border: 1px solid var(--tp-border);
    border-radius: 16px;
    padding: 24px;
  }
  .code-instructions-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--tp-text);
    margin: 0 0 16px;
  }
  .code-steps { display: flex; flex-direction: column; gap: 10px; }
  .code-step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 12px;
    color: var(--tp-subtext);
    line-height: 1.6;
  }
  .code-step-num {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    background: var(--tp-accent2);
    color: var(--tp-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 11px;
  }
`;