"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ChangePasswordInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const forced = searchParams.get("forced") === "true";

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword.length < 8) {
            setStatus({ type: "error", text: "Password must be at least 8 characters long." });
            return;
        }
        
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    oldPassword: forced ? undefined : oldPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            if (forced) {
                const role = data.role as string | undefined;
                if (role === "admin") router.push("/dashboard/admin");
                else if (role === "teacher") router.push("/dashboard/teacher");
                else router.push("/dashboard/student");
            } else {
                setStatus({ type: "success", text: "Password changed successfully!" });
                setOldPassword("");
                setNewPassword("");
            }
        } catch (err: any) {
            setStatus({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ==================== MAIN WRAPPER ==================== */}
            <div className="change-password-page">
                <div className="change-container">
                    {/* Back Link (only if not forced) */}
                    {!forced && (
                        <div className="top-nav">
                            <button onClick={() => router.back()} className="back-link">
                                <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Dashboard</span>
                            </button>
                        </div>
                    )}

                    {/* Change Password Card */}
                    <div className="change-card">
                        {/* Header */}
                        <div className="card-header">
                            <div className="security-icon-wrapper">
                                <div className={`security-icon ${forced ? "forced" : ""}`}>
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {forced ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        )}
                                    </svg>
                                </div>
                            </div>

                            <div className={`security-badge ${forced ? "forced" : ""}`}>
                                <span className="badge-pulse"></span>
                                {forced ? "SECURITY REQUIRED" : "ACCOUNT SETTINGS"}
                            </div>

                            <h1 className="card-title">{forced ? "Set New Password" : "Change Password"}</h1>
                            <p className="card-subtitle">
                                {forced
                                    ? "For security reasons, you must set a new password before continuing"
                                    : "Update your account password to keep it secure"}
                            </p>
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

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="change-form">
                            {/* Current Password (only if not forced) */}
                            {!forced && (
                                <div className="form-group">
                                    <label htmlFor="old-password" className="form-label">
                                        <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        <span>Current Password</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            id="old-password"
                                            type={showOld ? "text" : "password"}
                                            className="form-input"
                                            required
                                            autoComplete="current-password"
                                            placeholder="Enter current password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowOld(!showOld)}
                                            aria-label={showOld ? "Hide password" : "Show password"}>
                                            {showOld ? (
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
                            )}

                            {/* New Password */}
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
                                        type={showNew ? "text" : "password"}
                                        className="form-input"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Choose a strong password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowNew(!showNew)}
                                        aria-label={showNew ? "Hide password" : "Show password"}>
                                        {showNew ? (
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
                                <span className="form-helper-text">Minimum 8 characters required</span>
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
                                        <span>{forced ? "Set Password & Continue" : "Update Password"}</span>
                                        <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Tips */}
                        <div className="security-tips">
                            <h3 className="tips-title">Password Requirements</h3>
                            <ul className="tips-list">
                                <li className={newPassword.length >= 8 ? "valid" : ""}>
                                    <svg className="tip-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>At least 8 characters</span>
                                </li>
                                <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "valid" : ""}>
                                    <svg className="tip-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Mix of uppercase & lowercase</span>
                                </li>
                                <li className={/\d/.test(newPassword) ? "valid" : ""}>
                                    <svg className="tip-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Contains numbers</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== CUSTOM STYLES ==================== */}
            <style jsx>{`
                /* Similar base styles as Forgot Password */
                .change-password-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-6) var(--space-4);
                    background: linear-gradient(
                        135deg,
                        var(--color-success-light) 0%,
                        var(--color-white) 50%,
                        var(--color-primary-50) 100%
                    );
                    position: relative;
                    overflow: hidden;
                }

                .change-password-page::before {
                    content: "";
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, var(--color-success) 0%, transparent 70%);
                    top: -100px;
                    right: -100px;
                    opacity: 0.2;
                    animation: float 8s ease-in-out infinite;
                }

                .change-password-page::after {
                    content: "";
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, var(--color-primary-200) 0%, transparent 70%);
                    bottom: -100px;
                    left: -100px;
                    opacity: 0.2;
                    animation: float 10s ease-in-out infinite 2s;
                }

                .change-container {
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
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .back-link:hover {
                    color: var(--color-success-dark);
                    gap: var(--space-3);
                }

                .back-icon {
                    width: 18px;
                    height: 18px;
                }

                .change-card {
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

                .security-icon.forced {
                    background: linear-gradient(135deg, var(--color-warning-100), var(--color-danger-light));
                    border-color: var(--color-warning-500);
                }

                .security-icon svg {
                    width: 40px;
                    height: 40px;
                    color: var(--color-success-dark);
                }

                .security-icon.forced svg {
                    color: var(--color-warning-700);
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

                .security-badge.forced {
                    background: linear-gradient(135deg, var(--color-warning-50), var(--color-danger-light));
                    border-color: var(--color-warning-500);
                    color: var(--color-warning-700);
                }

                .badge-pulse {
                    width: 8px;
                    height: 8px;
                    background: var(--color-success);
                    border-radius: var(--radius-full);
                    animation: pulse 2s ease-in-out infinite;
                }

                .security-badge.forced .badge-pulse {
                    background: var(--color-warning-500);
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
                    max-width: 420px;
                    margin: 0 auto;
                }

                .change-form {
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
                    color: var(--color-success);
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
                    border-color: var(--color-success);
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
                    background: linear-gradient(90deg, var(--color-success), var(--color-primary-500));
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
                    color: var(--color-success);
                }

                .password-toggle svg {
                    width: 20px;
                    height: 20px;
                }

                .submit-btn {
                    margin-top: var(--space-2);
                    background: linear-gradient(135deg, var(--color-success), var(--color-success-dark));
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3);
                    background: linear-gradient(135deg, var(--color-success-dark), var(--color-primary-600));
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
                    background: linear-gradient(135deg, var(--color-success-light), var(--bg-page));
                    border: var(--border-width) solid var(--color-success);
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
                    color: var(--color-gray-500);
                    transition: color var(--transition-fast);
                }

                .tips-list li.valid {
                    color: var(--color-success-dark);
                }

                .tip-icon {
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                    color: var(--color-gray-300);
                    transition: color var(--transition-fast);
                }

                .tips-list li.valid .tip-icon {
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
                    .change-card {
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

export default function ChangePasswordPage() {
    return (
        <Suspense fallback={<AuthPageShell />}>
            <ChangePasswordInner />
        </Suspense>
    );
}

function AuthPageShell() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-page)"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "520px",
                minHeight: "400px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-2xl)",
                boxShadow: "var(--shadow-xl)"
            }} />
        </div>
    );
}