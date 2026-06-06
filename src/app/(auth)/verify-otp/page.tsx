"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOTPPage() {
    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const uid = params.get("uid");
        if (!uid) { router.push("/login"); return; }
        setUserId(uid);
        setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }, [router]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    const formatTime = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        setError("");
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
        if (updated.join("").length === 6) verifyOTP(updated.join(""));
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (paste.length !== 6) return;
        const arr = paste.split("");
        setOtp(arr);
        verifyOTP(arr.join(""));
    };

    const verifyOTP = async (code: string) => {
        if (!userId) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId, otp: code }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            router.push("/dashboard/admin");
        } catch (err: any) {
            setError(err.message);
            setOtp(["", "", "", "", "", ""]);
            inputsRef.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!userId) return;
        await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ resend: true, userId }),
        });
        setTimeLeft(300);
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
    };

    const urgent = timeLeft <= 60 && timeLeft > 0;

    return (
        <>
            <div className="otp-page">
                {/* Background */}
                <div className="otp-bg" aria-hidden="true">
                    <div className="otp-bg__orb otp-bg__orb--1" />
                    <div className="otp-bg__orb otp-bg__orb--2" />
                    <div className="otp-bg__grid" />
                </div>

                {/* Back Link */}
                <div className="otp-back">
                    <Link href="/login" className="otp-back__link">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </Link>
                </div>

                {/* Main Card */}
                <div className="otp-card">
                    {/* Header */}
                    <div className="otp-header">
                        <div className="otp-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="otp-badge">
                            <span className="otp-badge__dot" />
                            2FA Verification
                        </div>
                        <h1 className="otp-title">Verify Your Identity</h1>
                        <p className="otp-desc">Enter the 6-digit code sent to your email</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="otp-error">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={(e) => { e.preventDefault(); verifyOTP(otp.join("")); }}>
                        {/* OTP Inputs */}
                        <div className="otp-inputs" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputsRef.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className={`otp-input${digit ? " filled" : ""}${error ? " shake" : ""}`}
                                />
                            ))}
                        </div>

                        {/* Timer */}
                        <div className="otp-timer">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Expires in</span>
                            <span className={`otp-timer__val${urgent ? " urgent" : ""}`}>
                                {timeLeft > 0 ? formatTime() : "Expired"}
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="otp-submit"
                            disabled={loading || otp.join("").length !== 6}
                        >
                            {loading ? (
                                <>
                                    <span className="otp-spinner" />
                                    Verifying…
                                </>
                            ) : (
                                <>
                                    Verify & Continue
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend */}
                    {timeLeft <= 0 ? (
                        <div className="otp-resend">
                            <span className="otp-resend__text">Didn't receive code?</span>
                            <button className="otp-resend__btn" onClick={handleResend}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Resend Code
                            </button>
                        </div>
                    ) : (
                        <div className="otp-help">
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Check spam if you don't see the email
                        </div>
                    )}
                </div>
            </div>

            <style>{`
/* ═══ Keyframes ═══ */
@keyframes otp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
@keyframes otp-spin { to{transform:rotate(360deg)} }
@keyframes otp-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes otp-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

/* ═══ Root ═══ */
.otp-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #0a0f1e;
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
}

/* ═══ Background ═══ */
.otp-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.otp-bg__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}
.otp-bg__orb--1 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%);
  top: -80px;
  left: -60px;
}
.otp-bg__orb--2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
  bottom: -60px;
  right: -50px;
}
.otp-bg__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ═══ Back Link ═══ */
.otp-back {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}
.otp-back__link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 100px;
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}
.otp-back__link:hover {
  color: rgba(255,255,255,0.8);
  border-color: rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.03);
}

/* ═══ Card ═══ */
.otp-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 28px 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  animation: otp-fade 0.4s ease both;
}
.otp-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
}

/* ═══ Header ═══ */
.otp-header {
  text-align: center;
  margin-bottom: 24px;
}
.otp-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(34,197,94,0.2), rgba(99,102,241,0.15));
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 12px;
  color: #22c55e;
}
.otp-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(34,197,94,0.8);
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  padding: 4px 10px;
  border-radius: 100px;
  margin-bottom: 12px;
}
.otp-badge__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #22c55e;
  animation: otp-pulse 2s ease infinite;
}
.otp-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
}
.otp-desc {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.4);
  margin: 0;
  line-height: 1.5;
}

/* ═══ Error ═══ */
.otp-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: 300;
  color: #fca5a5;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: 10px;
  animation: otp-fade 0.3s ease;
}
.otp-error svg {
  flex-shrink: 0;
}

/* ═══ Inputs ═══ */
.otp-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}
.otp-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  color: #fff;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  outline: none;
  transition: all 0.2s;
}
.otp-input:focus {
  border-color: #3b82f6;
  background: rgba(37,99,235,0.08);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}
.otp-input.filled {
  border-color: #22c55e;
  background: rgba(34,197,94,0.08);
  box-shadow: 0 0 0 2px rgba(34,197,94,0.12);
}
.otp-input.shake {
  animation: otp-shake 0.4s ease;
}

/* ═══ Timer ═══ */
.otp-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}
.otp-timer svg {
  color: #3b82f6;
  flex-shrink: 0;
}
.otp-timer__val {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #3b82f6;
  margin-left: 2px;
}
.otp-timer__val.urgent {
  color: #ef4444;
  animation: otp-pulse 1s ease infinite;
}

/* ═══ Submit ═══ */
.otp-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37,99,235,0.3);
  transition: all 0.2s;
  font-family: inherit;
}
.otp-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37,99,235,0.4);
  filter: brightness(1.1);
}
.otp-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.otp-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  animation: otp-spin 0.7s linear infinite;
}

/* ═══ Resend ═══ */
.otp-resend {
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.otp-resend__text {
  font-size: 12px;
  color: rgba(255,255,255,0.3);
  display: block;
  margin-bottom: 10px;
}
.otp-resend__btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: 8px;
  color: #22c55e;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.otp-resend__btn:hover {
  background: rgba(34,197,94,0.15);
  border-color: rgba(34,197,94,0.3);
}

/* ═══ Help ═══ */
.otp-help {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(99,102,241,0.08);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 8px;
  margin-top: 20px;
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  line-height: 1.5;
}
.otp-help svg {
  flex-shrink: 0;
  color: #6366f1;
}

/* ═══ Responsive ═══ */
@media (max-width: 480px) {
  .otp-card {
    padding: 24px 20px;
  }
  .otp-inputs {
    gap: 6px;
  }
  .otp-input {
    width: 42px;
    height: 50px;
    font-size: 18px;
  }
}
            `}</style>
        </>
    );
}