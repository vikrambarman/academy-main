// src/app/(dashboard)/dashboard/admin/attendance/hourly-code/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Key, RefreshCw, Clock, Copy, CheckCircle2, AlertTriangle } from "lucide-react";

export default function HourlyCodePage() {
  const [currentCode, setCurrentCode] = useState<any>(null);
  const [upcomingCodes, setUpcomingCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [error, setError] = useState("");

  const loadCodes = async () => {
    try {
      setError("");
      const res = await fetchWithAuth("/api/admin/attendance/hourly-code");
      const data = await res.json();

      if (res.status === 404) {
        setError("Codes generate nahi hue. Manual generate karo.");
        setCurrentCode(null);
        setUpcomingCodes([]);
        return;
      }

      if (data.success) {
        setCurrentCode(data.current);
        setUpcomingCodes(data.upcoming || []);
      } else {
        setError(data.message || "Failed to load codes");
      }
    } catch (err: any) {
      console.error("Failed to load codes:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleManualGenerate = async () => {
    if (!confirm("Aaj ke codes generate karoge?")) return;

    setLoading(true);
    try {
      // ✅ Cron route nahi - admin generate route call karo
      const res = await fetchWithAuth(
        "/api/admin/attendance/hourly-code/generate",
        { method: "POST" }
      );
      const data = await res.json();

      if (data.success) {
        alert("✅ " + data.message);
        await loadCodes();
      } else {
        alert("❌ Generate failed: " + (data.message || "Unknown error"));
      }
    } catch (err: any) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCodes();
    const interval = setInterval(loadCodes, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!currentCode) return;

    const updateCountdown = () => {
      const now = new Date();
      const expires = new Date(currentCode.expiresAt);
      const diff = expires.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Expired");
        loadCodes();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}:${String(seconds).padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentCode]);

  const handleRegenerate = async () => {
    if (!confirm("Current hour ka code change karoge? Students ko naya code batana padega.")) return;

    setRegenerating(true);
    try {
      const res = await fetchWithAuth("/api/admin/attendance/hourly-code", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`✅ New Code: ${data.newCode}`);
        loadCodes();
      } else {
        alert("❌ " + (data.message || "Regenerate failed"));
      }
    } catch (err: any) {
      alert("❌ Error: " + err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const handleCopy = () => {
    if (currentCode?.code) {
      navigator.clipboard.writeText(currentCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid var(--cp-border)", borderTopColor: "var(--cp-accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 16px" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "var(--cp-muted)" }}>Loading codes...</p>
      </div>
    );
  }

  return (
    <>
      <style>{codeStyles}</style>
      <div className="code-root">
        <div className="code-header">
          <div>
            <h1 className="code-title"><Key size={24} /> Hourly Attendance Codes</h1>
            <p className="code-sub">Har ghante change hone wale codes - Staff ko yahi code batana hai</p>
          </div>
          <button className="code-regen-btn" onClick={handleRegenerate} disabled={regenerating || !currentCode}>
            <RefreshCw size={16} className={regenerating ? "spinning" : ""} />
            {regenerating ? "Regenerating..." : "Regenerate Code"}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="code-error-card">
            <AlertTriangle size={20} />
            <div>
              <div className="code-error-title">Codes Available Nahi Hai</div>
              <div className="code-error-msg">{error}</div>
            </div>
            <button className="code-generate-btn" onClick={handleManualGenerate}>
              🔄 Generate Codes Now
            </button>
          </div>
        )}

        {/* Codes Display */}
        {currentCode && !error && (
          <>
            <div className="code-current-card">
              <div className="code-current-header">
                <div className="code-current-label"><Clock size={18} /> Current Hour Code</div>
                <div className="code-countdown">Next code in: <strong>{countdown}</strong></div>
              </div>

              <div className="code-display" onClick={handleCopy}>
                <div className="code-number">{currentCode.code}</div>
                <div className="code-copy-hint">
                  {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Click to copy</>}
                </div>
              </div>

              <div className="code-hour-info">
                Hour: {String(currentCode.hour).padStart(2, "0")}:00 - {String(currentCode.hour + 1).padStart(2, "0")}:00
              </div>
            </div>

            {upcomingCodes.length > 0 && (
              <div className="code-upcoming-section">
                <h3 className="code-upcoming-title">Upcoming Hours</h3>
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

            <div className="code-instructions">
              <h3 className="code-instructions-title">📋 Staff Instructions</h3>
              <div className="code-steps">
                <div className="code-step"><span className="code-step-num">1</span><span>Current hour ka code board pe likho ya students ko bolo</span></div>
                <div className="code-step"><span className="code-step-num">2</span><span>Har ghante code change hoga - notice karte raho</span></div>
                <div className="code-step"><span className="code-step-num">3</span><span>Emergency me "Regenerate Code" button se naya code generate karo</span></div>
                <div className="code-step"><span className="code-step-num">4</span><span>Power cut me bhi kaam karega - QR static hai</span></div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const codeStyles = `
  .code-root { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--cp-text); display: flex; flex-direction: column; gap: 20px; max-width: 900px; }
  .code-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .code-title { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: var(--cp-text); font-weight: 400; display: flex; align-items: center; gap: 10px; margin: 0 0 6px; }
  .code-sub { font-size: 12px; color: var(--cp-muted); margin: 0; }
  .code-regen-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; border: 1px solid var(--cp-border); background: var(--cp-surface); color: var(--cp-text); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
  .code-regen-btn:hover:not(:disabled) { border-color: var(--cp-accent); color: var(--cp-accent); }
  .code-regen-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .code-regen-btn .spinning { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  
  .code-error-card { display: flex; align-items: center; gap: 16px; background: rgba(245,158,11,0.1); border: 2px solid rgba(245,158,11,0.3); border-radius: 16px; padding: 24px; }
  .code-error-card svg { color: var(--cp-warning); flex-shrink: 0; }
  .code-error-title { font-size: 14px; font-weight: 700; color: var(--cp-text); margin-bottom: 4px; }
  .code-error-msg { font-size: 12px; color: var(--cp-muted); }
  .code-generate-btn { margin-left: auto; padding: 10px 20px; background: var(--cp-warning); color: #000; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 12px; transition: opacity 0.15s; }
  .code-generate-btn:hover { opacity: 0.85; }
  
  .code-current-card { background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05)); border: 2px solid rgba(99,102,241,0.3); border-radius: 16px; padding: 28px; }
  .code-current-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .code-current-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--cp-accent); }
  .code-countdown { font-size: 12px; color: var(--cp-muted); }
  .code-countdown strong { color: var(--cp-warning); }
  .code-display { background: white; border: 3px dashed var(--cp-accent); border-radius: 14px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 16px; }
  .code-display:hover { background: rgba(99,102,241,0.03); border-style: solid; }
  .code-number { font-size: 4rem; font-weight: 800; color: var(--cp-accent); letter-spacing: 0.1em; font-family: 'Courier New', monospace; line-height: 1; }
  .code-copy-hint { font-size: 11px; color: var(--cp-muted); margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .code-hour-info { font-size: 12px; color: var(--cp-muted); text-align: center; }
  .code-upcoming-section { background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 16px; padding: 24px; }
  .code-upcoming-title { font-size: 14px; font-weight: 700; color: var(--cp-text); margin: 0 0 16px; }
  .code-upcoming-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
  .code-upcoming-card { background: var(--cp-bg); border: 1px solid var(--cp-border); border-radius: 10px; padding: 14px; text-align: center; }
  .code-upcoming-hour { font-size: 10px; color: var(--cp-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
  .code-upcoming-code { font-size: 1.5rem; font-weight: 800; color: var(--cp-text); font-family: 'Courier New', monospace; }
  .code-instructions { background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 16px; padding: 24px; }
  .code-instructions-title { font-size: 14px; font-weight: 700; color: var(--cp-text); margin: 0 0 16px; }
  .code-steps { display: flex; flex-direction: column; gap: 10px; }
  .code-step { display: flex; align-items: flex-start; gap: 12px; font-size: 12px; color: var(--cp-subtext); line-height: 1.6; }
  .code-step-num { flex-shrink: 0; width: 24px; height: 24px; background: var(--cp-accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; }
`;