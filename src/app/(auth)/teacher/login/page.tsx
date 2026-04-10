"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function TeacherLoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        if (!identifier || !password) {
            setError("Employee ID/Email and password are required.");
            return;
        }
        
        setLoading(true);
        setError("");
        
        try {
            const res = await fetch("/api/auth/teacher/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || "Login failed");
            
            if (data.forceChangePassword) {
                router.push("/change-password?forced=true");
                return;
            }
            
            router.push("/dashboard/teacher/attendance");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ==================== MAIN LAYOUT ==================== */}
            <div className="teacher-login-page">
                {/* Left Panel - Branding & Schedule */}
                <div className="login-left-panel">
                    <div className="left-panel-content">
                        {/* Logo & Brand */}
                        <div className="brand-section">
                            <div className="brand-logo">
                                <span className="logo-icon">👨‍🏫</span>
                            </div>
                            <h1 className="brand-title">Shivshakti Computer Academy</h1>
                            <p className="brand-tagline">Faculty Management Portal</p>
                        </div>

                        {/* Features List */}
                        <div className="features-list">
                            <div className="feature-item">
                                <div className="feature-icon">📋</div>
                                <div className="feature-text">
                                    <h3>Attendance Management</h3>
                                    <p>Mark and track student attendance</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">📚</div>
                                <div className="feature-text">
                                    <h3>Course Content</h3>
                                    <p>Manage syllabus and materials</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">📊</div>
                                <div className="feature-text">
                                    <h3>Progress Reports</h3>
                                    <p>Monitor student performance</p>
                                </div>
                            </div>
                        </div>

                        {/* Motivational Quote */}
                        <div className="motivational-quote">
                            <div className="quote-icon">"</div>
                            <p className="quote-text">Teaching is the profession that creates all other professions</p>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="left-panel-deco deco-circle-1"></div>
                    <div className="left-panel-deco deco-circle-2"></div>
                    <div className="left-panel-deco deco-dots"></div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="login-right-panel">
                    <div className="right-panel-content">
                        {/* Back to Home */}
                        <div className="top-nav">
                            <Link href="/" className="back-link">
                                <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Home</span>
                            </Link>
                        </div>

                        {/* Login Card */}
                        <div className="login-card">
                            {/* Card Header */}
                            <div className="card-header">
                                <div className="teacher-badge">
                                    <span className="badge-pulse"></span>
                                    FACULTY PORTAL
                                </div>
                                <h2 className="card-title">Welcome Back!</h2>
                                <p className="card-subtitle">Sign in to manage your classes and students</p>
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

                            {/* Login Form */}
                            <form onSubmit={handleLogin} className="login-form">
                                {/* Employee ID/Email Field */}
                                <div className="form-group">
                                    <label htmlFor="identifier" className="form-label">
                                        <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Employee ID or Email</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            id="identifier"
                                            type="text"
                                            className="form-input"
                                            required
                                            autoComplete="username"
                                            placeholder="Enter employee ID or email"
                                            value={identifier}
                                            onChange={(e) => {
                                                setIdentifier(e.target.value);
                                                setError("");
                                            }}
                                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                        />
                                        <div className="input-border"></div>
                                    </div>
                                    <span className="form-helper-text">e.g., TCH-001 or teacher@email.com</span>
                                </div>

                                {/* Password Field */}
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span>Password</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="form-input"
                                            required
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError("");
                                            }}
                                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="btn btn-primary btn-lg w-full submit-btn" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner spinner-sm"></span>
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Access Dashboard</span>
                                            <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Info Box */}
                            <div className="info-box">
                                <svg className="info-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="info-text">
                                    <strong>Forgot credentials?</strong> Contact{" "}
                                    <Link href="/admin/login" className="admin-link">
                                        admin support
                                    </Link>{" "}
                                    for assistance.
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="card-footer">
                                <p className="footer-text">
                                    By signing in, you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== CUSTOM STYLES ==================== */}
            <style jsx>{`
                /* ==================== MAIN LAYOUT ==================== */
                .teacher-login-page {
                    display: flex;
                    min-height: 100vh;
                    background: var(--bg-page);
                }

                /* ==================== LEFT PANEL ==================== */
                .login-left-panel {
                    flex: 1;
                    background: linear-gradient(135deg, var(--color-accent-600) 0%, var(--color-accent-800) 100%);
                    padding: var(--space-5) var(--space-4);
                    position: relative;
                    overflow: hidden;
                    display: none;
                }

                @media (min-width: 1024px) {
                    .login-left-panel {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                }

                .left-panel-content {
                    position: relative;
                    z-index: 10;
                    max-width: 500px;
                    margin: 0 auto;
                }

                /* Brand Section */
                .brand-section {
                    margin-bottom: var(--space-10);
                    text-align: center;
                }

                .brand-logo {
                    width: 100px;
                    height: 100px;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-radius: var(--radius-3xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto var(--space-6);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    animation: float 6s ease-in-out infinite;
                }

                .logo-icon {
                    font-size: var(--font-size-5xl);
                }

                .brand-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-3xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-white);
                    margin-bottom: var(--space-3);
                    line-height: var(--line-height-tight);
                }

                .brand-tagline {
                    font-size: var(--font-size-lg);
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: var(--font-weight-light);
                }

                /* Features List */
                .features-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    margin-bottom: var(--space-10);
                }

                .feature-item {
                    display: flex;
                    gap: var(--space-4);
                    align-items: flex-start;
                    padding: var(--space-4);
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-radius: var(--radius-xl);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    transition: all var(--transition-base);
                }

                .feature-item:hover {
                    transform: translateX(8px);
                    background: rgba(255, 255, 255, 0.12);
                }

                .feature-icon {
                    font-size: var(--font-size-2xl);
                    flex-shrink: 0;
                }

                .feature-text h3 {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-white);
                    margin-bottom: var(--space-1);
                }

                .feature-text p {
                    font-size: var(--font-size-sm);
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                }

                /* Motivational Quote */
                .motivational-quote {
                    position: relative;
                    padding: var(--space-6);
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-radius: var(--radius-2xl);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                }

                .quote-icon {
                    font-size: 80px;
                    font-family: serif;
                    color: rgba(255, 255, 255, 0.15);
                    position: absolute;
                    top: -10px;
                    left: 20px;
                    line-height: 1;
                }

                .quote-text {
                    position: relative;
                    z-index: 2;
                    font-size: var(--font-size-base);
                    font-style: italic;
                    color: var(--color-white);
                    margin: 0;
                    text-align: center;
                }

                /* Decorations */
                .left-panel-deco {
                    position: absolute;
                    border-radius: var(--radius-full);
                    pointer-events: none;
                }

                .deco-circle-1 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                    top: -100px;
                    right: -100px;
                    animation: float 10s ease-in-out infinite;
                }

                .deco-circle-2 {
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
                    bottom: -80px;
                    left: -80px;
                    animation: float 12s ease-in-out infinite 2s;
                }

                .deco-dots {
                    width: 200px;
                    height: 200px;
                    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.2) 2px, transparent 2px);
                    background-size: 20px 20px;
                    bottom: 100px;
                    right: 50px;
                }

                /* ==================== RIGHT PANEL ==================== */
                .login-right-panel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-page);
                    position: relative;
                }

                .right-panel-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: var(--space-6);
                    max-width: 560px;
                    margin: 0 auto;
                    width: 100%;
                }

                /* Top Nav */
                .top-nav {
                    margin-bottom: var(--space-8);
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
                    color: var(--color-accent-600);
                    gap: var(--space-3);
                }

                .back-icon {
                    width: 18px;
                    height: 18px;
                }

                /* ==================== LOGIN CARD ==================== */
                .login-card {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: var(--space-5);
                    background: var(--bg-elevated);
                    // border: var(--border-width) solid var(--border-color);
                    // border-radius: var(--radius-2xl);
                    // box-shadow: var(--shadow-xl);
                }

                /* Card Header */
                .card-header {
                    text-align: center;
                    margin-bottom: var(--space-6);
                }

                .teacher-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    background: linear-gradient(135deg, var(--color-accent-50), var(--color-warning-50));
                    border: 1px solid var(--color-accent-200);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-accent-700);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: var(--space-4);
                }

                .badge-pulse {
                    width: 8px;
                    height: 8px;
                    background: var(--color-accent-500);
                    border-radius: var(--radius-full);
                    animation: pulse 2s ease-in-out infinite;
                }

                .card-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-3xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-2);
                    line-height: var(--line-height-tight);
                }

                .card-subtitle {
                    font-size: var(--font-size-base);
                    color: var(--text-secondary);
                    line-height: var(--line-height-relaxed);
                }

                /* ==================== FORM ==================== */
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    margin-bottom: var(--space-6);
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
                    color: var(--color-accent-500);
                }

                .input-wrapper {
                    position: relative;
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
                    border-color: var(--color-accent-500);
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
                    background: linear-gradient(90deg, var(--color-accent-500), var(--color-warning-500));
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
                    color: var(--color-accent-500);
                }

                .password-toggle svg {
                    width: 20px;
                    height: 20px;
                }

                /* Submit Button */
                .submit-btn {
                    margin-top: var(--space-2);
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, var(--color-accent-500), var(--color-accent-600));
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(249, 115, 22, 0.3);
                    background: linear-gradient(135deg, var(--color-accent-600), var(--color-accent-700));
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

                /* ==================== INFO BOX ==================== */
                .info-box {
                    display: flex;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    background: linear-gradient(135deg, var(--color-info-light), var(--color-accent-50));
                    border: 1px solid var(--color-accent-200);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--space-6);
                }

                .info-icon {
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                    color: var(--color-accent-600);
                }

                .info-text {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    line-height: var(--line-height-relaxed);
                }

                .info-text strong {
                    color: var(--text-primary);
                    font-weight: var(--font-weight-semibold);
                }

                .admin-link {
                    color: var(--color-accent-600);
                    text-decoration: none;
                    font-weight: var(--font-weight-medium);
                    transition: color var(--transition-fast);
                }

                .admin-link:hover {
                    color: var(--color-accent-700);
                    text-decoration: underline;
                }

                /* ==================== CARD FOOTER ==================== */
                .card-footer {
                    text-align: center;
                    padding-top: var(--space-6);
                    border-top: var(--border-width) solid var(--border-color);
                }

                .footer-text {
                    font-size: var(--font-size-xs);
                    color: var(--text-tertiary);
                    margin: 0;
                }

                .footer-text a {
                    color: var(--color-accent-600);
                    text-decoration: none;
                    font-weight: var(--font-weight-medium);
                }

                .footer-text a:hover {
                    text-decoration: underline;
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

                /* ==================== RESPONSIVE ==================== */
                @media (max-width: 1023px) {
                    .right-panel-content {
                        padding: var(--space-4);
                    }

                    .login-card {
                        padding: var(--space-6);
                    }

                    .card-title {
                        font-size: var(--font-size-3xl);
                    }
                }

                @media (max-width: 640px) {
                    .schedule-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-2);
                    }

                    .schedule-arrow {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}