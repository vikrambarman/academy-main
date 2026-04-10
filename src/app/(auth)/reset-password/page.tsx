"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get("token"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            setStatus({ type: "error", text: "Invalid or missing reset token." });
            return;
        }
        
        if (password !== confirm) {
            setStatus({ type: "error", text: "Passwords do not match." });
            return;
        }
        
        if (password.length < 8) {
            setStatus({ type: "error", text: "Password must be at least 8 characters long." });
            return;
        }
        
        setLoading(true);
        setStatus(null);
        
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message);
            
            setStatus({
                type: "success",
                text: "Password updated successfully! Redirecting to login...",
            });
            
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            setStatus({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ==================== MAIN WRAPPER ==================== */}
            <div className="reset-password-page">
                <div className="reset-container">
                    {/* Back Link */}
                    <div className="top-nav">
                        <Link href="/login" className="back-link">
                            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Login</span>
                        </Link>
                    </div>

                    {/* Reset Card */}
                    <div className="reset-card">
                        {/* Header */}
                        <div className="card-header">
                            <div className="lock-icon-wrapper">
                                <div className="lock-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="recovery-badge">
                                <span className="badge-pulse"></span>
                                ACCOUNT RECOVERY
                            </div>

                            <h1 className="card-title">Reset Your Password</h1>
                            <p className="card-subtitle">Choose a strong password to secure your account</p>
                        </div>

                        {/* Status Alert */}
                        {status && (
                            <div className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`}>
                                <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                                    {status.type === "success" ? (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    )}
                                </svg>
                                <span>{status.text}</span>
                            </div>
                        )}

                        {/* Reset Form */}
                        <form onSubmit={handleSubmit} className="reset-form">
                            {/* New Password Field */}
                            <div className="form-group">
                                <label htmlFor="new-password" className="form-label">
                                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>New Password</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        className="form-input"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}>
                                        {showPassword ? (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                    <div className="input-border"></div>
                                </div>
                                <span className="form-helper-text">Minimum 8 characters</span>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="form-group">
                                <label htmlFor="confirm-password" className="form-label">
                                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Confirm Password</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="confirm-password"
                                        type={showConfirm ? "text" : "password"}
                                        className="form-input"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Re-enter new password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        aria-label={showConfirm ? "Hide password" : "Show password"}>
                                        {showConfirm ? (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                    <div className="input-border"></div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary btn-lg w-full submit-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner spinner-sm"></span>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Update Password</span>
                                        <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Tips */}
                        <div className="security-tips">
                            <h3 className="tips-title">Password Security Tips</h3>
                            <ul className="tips-list">
                                <li>
                                    <svg className="tip-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Use at least 8 characters</span>
                                </li>
                                <li>
                                    <svg className="tip-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Mix uppercase & lowercase letters</span>
                                </li>
                                <li>
                                    <svg className="tip-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Include numbers and special characters</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== CUSTOM STYLES ==================== */}
            <style jsx>{`
                /* Same base styles as OTP page */
                .reset-password-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-6) var(--space-4);
                    background: linear-gradient(
                        135deg,
                        var(--color-warning-50) 0%,
                        var(--color-white) 50%,
                        var(--color-primary-50) 100%
                    );
                    position: relative;
                    overflow: hidden;
                }

                .reset-password-page::before {
                    content: "";
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, var(--color-warning-200) 0%, transparent 70%);
                    top: -100px;
                    right: -100px;
                    opacity: 0.3;
                    animation: float 8s ease-in-out infinite;
                }

                .reset-password-page::after {
                    content: "";
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, var(--color-primary-200) 0%, transparent 70%);
                    bottom: -100px;
                    left: -100px;
                    opacity: 0.3;
                    animation: float 10s ease-in-out infinite 2s;
                }

                .reset-container {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 520px;
                }

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
                    color: var(--color-warning-600);
                    gap: var(--space-3);
                }

                .back-icon {
                    width: 18px;
                    height: 18px;
                }

                .reset-card {
                    background: var(--bg-elevated);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-10) var(--space-8);
                    box-shadow: var(--shadow-2xl);
                    animation: slideUp var(--transition-slow) var(--ease-out);
                }

                .card-header {
                    text-align: center;
                    margin-bottom: var(--space-8);
                }

                .lock-icon-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-bottom: var(--space-5);
                }

                .lock-icon {
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, var(--color-warning-100), var(--color-accent-100));
                    border: 2px solid var(--color-warning-400);
                    border-radius: var(--radius-2xl);
                    animation: iconPulse 3s ease-in-out infinite;
                }

                .lock-icon svg {
                    width: 40px;
                    height: 40px;
                    color: var(--color-warning-700);
                }

                .recovery-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-5);
                    background: linear-gradient(135deg, var(--color-warning-50), var(--color-accent-50));
                    border: 1px solid var(--color-warning-300);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-warning-700);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: var(--space-4);
                }

                .badge-pulse {
                    width: 8px;
                    height: 8px;
                    background: var(--color-warning-500);
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

                .reset-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-6);
                    margin-bottom: var(--space-8);
                }

                .form-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-2);
                }

                .label-icon {
                    width: 18px;
                    height: 18px;
                    color: var(--color-warning-500);
                }

                .input-wrapper {
                    position: relative;
                }

                .form-input {
                    width: 100%;
                    padding: var(--space-4);
                    font-size: var(--font-size-base);
                    color: var(--text-primary);
                    background: var(--bg-page);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-base);
                    outline: none;
                }

                .form-input:focus {
                    border-color: var(--color-warning-500);
                    background: var(--bg-elevated);
                }

                .form-input:focus + .input-border {
                    transform: scaleX(1);
                }

                .input-border {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--color-warning-500), var(--color-accent-500));
                    transform: scaleX(0);
                    transition: transform var(--transition-base);
                    border-radius: var(--radius-full);
                }

                .password-toggle {
                    position: absolute;
                    right: var(--space-4);
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--color-gray-400);
                    cursor: pointer;
                    padding: var(--space-2);
                    transition: color var(--transition-fast);
                }

                .password-toggle:hover {
                    color: var(--color-warning-500);
                }

                .password-toggle svg {
                    width: 20px;
                    height: 20px;
                }

                .submit-btn {
                    margin-top: var(--space-2);
                    background: linear-gradient(135deg, var(--color-warning-500), var(--color-warning-600));
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(249, 115, 22, 0.3);
                    background: linear-gradient(135deg, var(--color-warning-600), var(--color-warning-700));
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

                .security-tips {
                    padding: var(--space-6);
                    background: linear-gradient(135deg, var(--color-warning-50), var(--bg-page));
                    border: var(--border-width) solid var(--color-warning-200);
                    border-radius: var(--radius-xl);
                }

                .tips-title {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-4);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .tips-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .tips-list li {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }

                .tip-icon {
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                    color: var(--color-success);
                }

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

                @keyframes iconPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @media (max-width: 640px) {
                    .reset-card {
                        padding: var(--space-8) var(--space-6);
                    }

                    .card-title {
                        font-size: var(--font-size-2xl);
                    }
                }
            `}</style>
        </>
    );
}