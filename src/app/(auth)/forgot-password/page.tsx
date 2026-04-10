"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setStatus({
                type: "success",
                text: "If an account exists with this email, a password reset link has been sent.",
            });
        } catch (err: any) {
            setStatus({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ==================== MAIN WRAPPER ==================== */}
            <div className="forgot-password-page">
                <div className="forgot-container">
                    {/* Back Link */}
                    <div className="top-nav">
                        <button onClick={() => router.back()} className="back-link">
                            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Login</span>
                        </button>
                    </div>

                    {/* Forgot Password Card */}
                    <div className="forgot-card">
                        {/* Header */}
                        <div className="card-header">
                            <div className="email-icon-wrapper">
                                <div className="email-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="recovery-badge">
                                <span className="badge-pulse"></span>
                                ACCOUNT RECOVERY
                            </div>

                            <h1 className="card-title">Forgot Password?</h1>
                            <p className="card-subtitle">
                                No worries! Enter your email and we'll send you reset instructions
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
                        <form onSubmit={handleSubmit} className="forgot-form">
                            {/* Email Field */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    <span>Email Address</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        type="email"
                                        className="form-input"
                                        required
                                        autoComplete="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="input-border"></div>
                                </div>
                                <span className="form-helper-text">Enter the email you used to register</span>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary btn-lg w-full submit-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner spinner-sm"></span>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Help Info */}
                        <div className="help-section">
                            <div className="help-box">
                                <svg className="help-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="help-text">
                                    <strong>Check your email</strong> for a password reset link. It may take a few minutes to arrive.
                                </div>
                            </div>

                            <p className="help-note">
                                Didn't receive an email? Check your spam folder or{" "}
                                <Link href="/contact" className="help-link">
                                    contact support
                                </Link>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="card-footer">
                            <p className="footer-text">
                                Remember your password?{" "}
                                <button onClick={() => router.back()} className="footer-link">
                                    Back to Login
                                </button>
                            </p>
                            <p className="copyright">Shivshakti Computer Academy © 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== CUSTOM STYLES ==================== */}
            <style jsx>{`
                /* ==================== MAIN LAYOUT ==================== */
                .forgot-password-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-6) var(--space-4);
                    background: linear-gradient(
                        135deg,
                        var(--color-info-light) 0%,
                        var(--color-white) 50%,
                        var(--color-primary-50) 100%
                    );
                    position: relative;
                    overflow: hidden;
                }

                .forgot-password-page::before {
                    content: "";
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, var(--color-info) 0%, transparent 70%);
                    top: -100px;
                    right: -100px;
                    opacity: 0.2;
                    animation: float 8s ease-in-out infinite;
                }

                .forgot-password-page::after {
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

                .forgot-container {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 500px;
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
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .back-link:hover {
                    color: var(--color-info-dark);
                    gap: var(--space-3);
                }

                .back-icon {
                    width: 18px;
                    height: 18px;
                }

                /* ==================== CARD ==================== */
                .forgot-card {
                    // background: var(--bg-elevated);
                    // border: var(--border-width) solid var(--border-color);
                    // border-radius: var(--radius-2xl);
                    // padding: var(--space-1) var(--space-8);
                    // box-shadow: var(--shadow-2xl);
                    animation: slideUp var(--transition-slow) var(--ease-out);
                }

                /* ==================== HEADER ==================== */
                .card-header {
                    text-align: center;
                    margin-bottom: var(--space-6);
                }

                .email-icon-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-bottom: var(--space-5);
                }

                .email-icon {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, var(--color-info-light), var(--color-primary-100));
                    border: 2px solid var(--color-info);
                    border-radius: var(--radius-2xl);
                    animation: iconPulse 3s ease-in-out infinite;
                }

                .email-icon svg {
                    width: 40px;
                    height: 40px;
                    color: var(--color-info-dark);
                }

                .recovery-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    background: linear-gradient(135deg, var(--color-info-light), var(--color-primary-50));
                    border: 1px solid var(--color-info);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-info-dark);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: var(--space-4);
                }

                .badge-pulse {
                    width: 8px;
                    height: 8px;
                    background: var(--color-info);
                    border-radius: var(--radius-full);
                    animation: pulse 2s ease-in-out infinite;
                }

                .card-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-2xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-2);
                    line-height: var(--line-height-tight);
                }

                .card-subtitle {
                    font-size: var(--font-size-base);
                    color: var(--text-secondary);
                    line-height: var(--line-height-relaxed);
                    max-width: 400px;
                    margin: 0 auto;
                }

                /* ==================== FORM ==================== */
                .forgot-form {
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
                    color: var(--color-info);
                }

                .input-wrapper {
                    position: relative;
                    margin-bottom: var(--space-2);
                }

                .form-input {
                    width: 100%;
                    padding: var(--space-2);
                    font-size: var(--font-size-base);
                    color: var(--text-primary);
                    background: var(--bg-page);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-base);
                    outline: none;
                }

                .form-input:focus {
                    border-color: var(--color-info);
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
                    background: linear-gradient(90deg, var(--color-info), var(--color-primary-500));
                    transform: scaleX(0);
                    transition: transform var(--transition-base);
                    border-radius: var(--radius-full);
                }

                /* ==================== SUBMIT BUTTON ==================== */
                .submit-btn {
                    margin-top: var(--space-6);
                    background: linear-gradient(135deg, var(--color-info), var(--color-info-dark));
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
                    background: linear-gradient(135deg, var(--color-info-dark), var(--color-primary-700));
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

                /* ==================== HELP SECTION ==================== */
                .help-section {
                    margin-bottom: var(--space-6);
                }

                .help-box {
                    display: flex;
                    gap: var(--space-3);
                    padding: var(--space-2);
                    background: linear-gradient(135deg, var(--color-info-light), var(--bg-page));
                    border: var(--border-width) solid var(--color-info);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--space-4);
                }

                .help-icon {
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                    color: var(--color-info-dark);
                }

                .help-text {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    line-height: var(--line-height-relaxed);
                }

                .help-text strong {
                    color: var(--text-primary);
                    font-weight: var(--font-weight-semibold);
                }

                .help-note {
                    text-align: center;
                    font-size: var(--font-size-sm);
                    color: var(--text-tertiary);
                    margin: 0;
                }

                .help-link {
                    color: var(--color-info);
                    text-decoration: none;
                    font-weight: var(--font-weight-medium);
                    transition: color var(--transition-fast);
                }

                .help-link:hover {
                    color: var(--color-info-dark);
                    text-decoration: underline;
                }

                /* ==================== FOOTER ==================== */
                .card-footer {
                    text-align: center;
                    padding-top: var(--space-6);
                    border-top: var(--border-width) solid var(--border-color);
                }

                .footer-text {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    margin-bottom: var(--space-3);
                }

                .footer-link {
                    color: var(--color-info);
                    background: none;
                    border: none;
                    font-weight: var(--font-weight-medium);
                    cursor: pointer;
                    transition: color var(--transition-fast);
                }

                .footer-link:hover {
                    color: var(--color-info-dark);
                    text-decoration: underline;
                }

                .copyright {
                    font-size: var(--font-size-xs);
                    color: var(--text-tertiary);
                    margin: 0;
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
                    .forgot-card {
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