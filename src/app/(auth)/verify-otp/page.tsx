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
        if (!uid) {
            router.push("/login");
            return;
        }
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
        if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
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
            {/* ==================== MAIN WRAPPER ==================== */}
            <div className="otp-verify-page">
                <div className="otp-container">
                    {/* Back Link */}
                    <div className="top-nav">
                        <Link href="/login" className="back-link">
                            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Login</span>
                        </Link>
                    </div>

                    {/* OTP Card */}
                    <div className="otp-card">
                        {/* Header */}
                        <div className="card-header">
                            <div className="security-icon-wrapper">
                                <div className="security-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="security-badge">
                                <span className="badge-pulse"></span>
                                TWO-FACTOR AUTHENTICATION
                            </div>

                            <h1 className="card-title">Verify Your Identity</h1>
                            <p className="card-subtitle">Enter the 6-digit code sent to your registered email</p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="alert alert-danger">
                                <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* OTP Form */}
                        <form onSubmit={(e) => { e.preventDefault(); verifyOTP(otp.join("")); }}>
                            {/* OTP Input Boxes */}
                            <div className="otp-inputs-wrapper" onPaste={handlePaste}>
                                <div className="otp-inputs">
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
                                            aria-label={`OTP digit ${index + 1}`}
                                            className={`otp-input ${digit ? "filled" : ""} ${error ? "error-shake" : ""}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Timer Display */}
                            <div className="timer-display">
                                <svg className="timer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="timer-label">Code expires in</span>
                                <span className={`timer-value ${urgent ? "urgent" : ""}`}>
                                    {timeLeft > 0 ? formatTime() : "Expired"}
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary btn-lg w-full submit-btn" disabled={loading || otp.join("").length !== 6}>
                                {loading ? (
                                    <>
                                        <span className="spinner spinner-sm"></span>
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Verify & Continue</span>
                                        <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Resend Section */}
                        {timeLeft <= 0 ? (
                            <div className="resend-section">
                                <p className="resend-text">Didn't receive the code?</p>
                                <button type="button" className="resend-button" onClick={handleResend}>
                                    <svg className="resend-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Resend Code</span>
                                </button>
                            </div>
                        ) : (
                            <div className="help-text">
                                <svg className="help-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>Check your spam folder if you don't receive the code within a minute</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ==================== CUSTOM STYLES ==================== */}
            <style jsx>{`
                /* ==================== MAIN LAYOUT ==================== */
                .otp-verify-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-6) var(--space-4);
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-50) 0%,
                        var(--color-white) 50%,
                        var(--color-accent-50) 100%
                    );
                    position: relative;
                    overflow: hidden;
                }

                .otp-verify-page::before {
                    content: "";
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, var(--color-primary-200) 0%, transparent 70%);
                    top: -100px;
                    right: -100px;
                    opacity: 0.3;
                    animation: float 8s ease-in-out infinite;
                }

                .otp-verify-page::after {
                    content: "";
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, var(--color-accent-200) 0%, transparent 70%);
                    bottom: -100px;
                    left: -100px;
                    opacity: 0.3;
                    animation: float 10s ease-in-out infinite 2s;
                }

                .otp-container {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 520px;
                }

                /* ==================== TOP NAV ==================== */
                .top-nav {
                    margin-bottom: var(--space-6);
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    text-decoration: none;
                    transition: all var(--transition-fast);
                }

                .back-link:hover {
                    color: var(--color-primary-600);
                    gap: var(--space-3);
                }

                .back-icon {
                    width: 18px;
                    height: 18px;
                }

                /* ==================== OTP CARD ==================== */
                .otp-card {
                    background: var(--bg-elevated);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-10) var(--space-8);
                    box-shadow: var(--shadow-2xl);
                    animation: slideUp var(--transition-slow) var(--ease-out);
                }

                /* ==================== HEADER ==================== */
                .card-header {
                    text-align: center;
                    margin-bottom: var(--space-8);
                }

                .security-icon-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-bottom: var(--space-5);
                }

                .security-icon {
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, var(--color-success-light), var(--color-primary-100));
                    border: 2px solid var(--color-success);
                    border-radius: var(--radius-2xl);
                    animation: iconPulse 3s ease-in-out infinite;
                }

                .security-icon svg {
                    width: 40px;
                    height: 40px;
                    color: var(--color-success-dark);
                }

                .security-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-5);
                    background: linear-gradient(135deg, var(--color-success-light), var(--color-primary-50));
                    border: 1px solid var(--color-success);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-success-dark);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: var(--space-4);
                }

                .badge-pulse {
                    width: 8px;
                    height: 8px;
                    background: var(--color-success);
                    border-radius: var(--radius-full);
                    animation: pulse 2s ease-in-out infinite;
                }

                .card-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-3xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-3);
                    line-height: var(--line-height-tight);
                }

                .card-subtitle {
                    font-size: var(--font-size-base);
                    color: var(--text-secondary);
                    line-height: var(--line-height-relaxed);
                }

                /* ==================== OTP INPUTS ==================== */
                .otp-inputs-wrapper {
                    margin-bottom: var(--space-6);
                }

                .otp-inputs {
                    display: flex;
                    gap: var(--space-3);
                    justify-content: center;
                }

                .otp-input {
                    width: 56px;
                    height: 64px;
                    text-align: center;
                    font-size: var(--font-size-2xl);
                    font-weight: var(--font-weight-semibold);
                    font-family: var(--font-mono);
                    background: var(--bg-page);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius-xl);
                    color: var(--text-primary);
                    transition: all var(--transition-base);
                    outline: none;
                }

                .otp-input:focus {
                    border-color: var(--color-primary-500);
                    background: var(--bg-elevated);
                    box-shadow: 0 0 0 4px var(--color-primary-100);
                }

                .otp-input.filled {
                    border-color: var(--color-primary-500);
                    background: linear-gradient(135deg, var(--color-primary-50), var(--bg-elevated));
                    box-shadow: 0 0 0 3px var(--color-primary-100);
                }

                .otp-input.error-shake {
                    animation: shake 0.4s ease-in-out;
                }

                /* ==================== TIMER ==================== */
                .timer-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2);
                    padding: var(--space-4);
                    background: linear-gradient(135deg, var(--color-gray-50), var(--bg-page));
                    border: var(--border-width) solid var(--border-color);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--space-6);
                }

                .timer-icon {
                    width: 20px;
                    height: 20px;
                    color: var(--color-primary-500);
                }

                .timer-label {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }

                .timer-value {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    font-family: var(--font-mono);
                    color: var(--color-primary-600);
                }

                .timer-value.urgent {
                    color: var(--color-danger);
                    animation: pulse 1s ease-in-out infinite;
                }

                /* ==================== SUBMIT BUTTON ==================== */
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.3);
                }

                .submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-arrow {
                    width: 20px;
                    height: 20px;
                    margin-left: var(--space-2);
                    transition: transform var(--transition-fast);
                }

                .submit-btn:hover .btn-arrow {
                    transform: translateX(4px);
                }

                /* ==================== RESEND SECTION ==================== */
                .resend-section {
                    text-align: center;
                    padding-top: var(--space-6);
                    margin-top: var(--space-6);
                    border-top: var(--border-width) solid var(--border-color);
                }

                .resend-text {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    margin-bottom: var(--space-3);
                }

                .resend-button {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-3) var(--space-6);
                    background: var(--color-primary-50);
                    border: var(--border-width) solid var(--color-primary-200);
                    border-radius: var(--radius-lg);
                    color: var(--color-primary-700);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    cursor: pointer;
                    transition: all var(--transition-base);
                }

                .resend-button:hover {
                    background: var(--color-primary-100);
                    border-color: var(--color-primary-300);
                }

                .resend-icon {
                    width: 18px;
                    height: 18px;
                }

                /* ==================== HELP TEXT ==================== */
                .help-text {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    background: var(--color-info-light);
                    border: var(--border-width) solid var(--color-info);
                    border-radius: var(--radius-lg);
                    margin-top: var(--space-6);
                }

                .help-icon {
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                    color: var(--color-info-dark);
                }

                .help-text span {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    line-height: var(--line-height-relaxed);
                }

                /* ==================== ALERTS ==================== */
                .alert {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--space-6);
                    animation: slideDown var(--transition-base) var(--ease-out);
                }

                .alert-icon {
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                }

                /* ==================== ANIMATIONS ==================== */
                @keyframes iconPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                /* ==================== RESPONSIVE ==================== */
                @media (max-width: 640px) {
                    .otp-card {
                        padding: var(--space-8) var(--space-6);
                    }

                    .otp-inputs {
                        gap: var(--space-2);
                    }

                    .otp-input {
                        width: 48px;
                        height: 56px;
                        font-size: var(--font-size-xl);
                    }

                    .card-title {
                        font-size: var(--font-size-2xl);
                    }
                }
            `}</style>
        </>
    );
}