// src/app/teacher/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TeacherLoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password,   setPassword]   = useState("");
    const [showPwd,    setShowPwd]    = useState(false);
    const [loading,    setLoading]    = useState(false);
    const [error,      setError]      = useState("");

    const handleLogin = async () => {
        if (!identifier || !password) return setError("ID/Email aur password dono required hain");
        setLoading(true); setError("");
        try {
            const res  = await fetch("/api/auth/teacher/login", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ identifier, password }),
            });
            const data = await res.json();
            if (!res.ok) return setError(data.message || "Login failed");
            if (data.forceChangePassword) return router.push("/change-password?forced=true");
            router.push("/dashboard/teacher/attendance");
        } catch {
            setError("Server se connect nahi ho pa raha");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{css}</style>
            <div className="tl-root">
                {/* Background layers */}
                <div className="tl-bg-glow tl-bg-glow--1" />
                <div className="tl-bg-glow tl-bg-glow--2" />
                <div className="tl-bg-grid" />

                <div className="tl-card">

                    {/* Logo */}
                    <div className="tl-logo-wrap">
                        <Image src="/logo.png" alt="Logo" width={44} height={44} className="object-contain" />
                    </div>

                    {/* Badge */}
                    <div className="tl-badge">
                        <span className="tl-badge-dot" />
                        Teacher Portal
                    </div>

                    <h1 className="tl-title">Welcome Back</h1>
                    <p className="tl-sub">Apni Teacher ID ya email se login karein</p>

                    {/* Fields */}
                    <div className="tl-fields">

                        {/* Identifier */}
                        <div className="tl-field">
                            <label className="tl-label" htmlFor="identifier">
                                Employee ID / Email
                            </label>
                            <div className="tl-input-wrap">
                                <span className="tl-input-icon">
                                    {/* person icon */}
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                                    </svg>
                                </span>
                                <input
                                    id="identifier"
                                    className="tl-input"
                                    placeholder="TCH-001 ya email address"
                                    value={identifier}
                                    onChange={e => { setIdentifier(e.target.value); setError(""); }}
                                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="tl-field">
                            <label className="tl-label" htmlFor="password">Password</label>
                            <div className="tl-input-wrap">
                                <span className="tl-input-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    className="tl-input tl-input--pwd"
                                    type={showPwd ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(""); }}
                                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="tl-eye-btn"
                                    onClick={() => setShowPwd(p => !p)}
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPwd ? (
                                        /* eye-off */
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        /* eye */
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="tl-error" role="alert">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Login button */}
                    <button
                        className="tl-btn"
                        onClick={handleLogin}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading ? (
                            <><span className="tl-spinner"/> Logging in...</>
                        ) : (
                            "Login to Dashboard"
                        )}
                    </button>

                    {/* Footer */}
                    <div className="tl-footer">
                        Credentials bhool gaye? &nbsp;
                        <a href="/admin/login" className="tl-footer-link">Admin se contact karein</a>
                    </div>
                </div>

                <div className="tl-bottom-note">
                    © 2026 Shivshakti Computer Academy
                </div>
            </div>
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.tl-root {
    min-height: 100vh;
    background: #07111a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
}

/* Background effects */
.tl-bg-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
}
.tl-bg-glow--1 {
    width: 500px; height: 500px;
    top: -180px; right: -140px;
    background: radial-gradient(circle, rgba(20,184,166,.18) 0%, transparent 70%);
}
.tl-bg-glow--2 {
    width: 400px; height: 400px;
    bottom: -120px; left: -100px;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
}
.tl-bg-grid {
    position: fixed; inset: 0; pointer-events: none;
    background-image:
        linear-gradient(rgba(20,184,166,.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(20,184,166,.03) 1px, transparent 1px);
    background-size: 40px 40px;
}

/* Card */
.tl-card {
    width: 100%; max-width: 420px;
    background: rgba(13,27,36,.85);
    border: 1px solid rgba(20,184,166,.18);
    border-radius: 22px;
    padding: 38px 36px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    backdrop-filter: blur(16px);
    box-shadow:
        0 0 0 1px rgba(20,184,166,.06),
        0 32px 64px rgba(0,0,0,.5),
        inset 0 1px 0 rgba(255,255,255,.04);
    position: relative;
    z-index: 1;
}

/* Top accent line */
.tl-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #14b8a6, transparent);
    border-radius: 1px;
}

/* Logo */
.tl-logo-wrap {
    width: 58px; height: 58px;
    background: rgba(20,184,166,.08);
    border: 1px solid rgba(20,184,166,.2);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
    overflow: hidden;
}

/* Badge */
.tl-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .16em;
    color: #14b8a6;
    background: rgba(20,184,166,.08);
    border: 1px solid rgba(20,184,166,.2);
    padding: 5px 14px;
    border-radius: 100px;
    margin-bottom: 18px;
}
.tl-badge-dot {
    width: 5px; height: 5px;
    border-radius: 50%; background: #14b8a6;
    box-shadow: 0 0 6px #14b8a6;
    animation: tlPulse 2s ease-in-out infinite;
}
@keyframes tlPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .5; transform: scale(.75); }
}

/* Heading */
.tl-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.65rem; font-weight: 400;
    color: #f8fafc; text-align: center;
    margin-bottom: 6px;
}
.tl-sub {
    font-size: 12px; color: #64748b;
    text-align: center; margin-bottom: 28px;
    line-height: 1.6;
}

/* Fields */
.tl-fields { width: 100%; display: flex; flex-direction: column; gap: 14px; margin-bottom: 6px; }
.tl-field  { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.tl-label  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: #475569; }

.tl-input-wrap { position: relative; width: 100%; }
.tl-input-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: #334155; pointer-events: none; display: flex; align-items: center;
    transition: color .15s;
}
.tl-input-wrap:focus-within .tl-input-icon { color: #14b8a6; }

.tl-input {
    width: 100%;
    background: rgba(7,17,26,.8);
    border: 1px solid #132330;
    border-radius: 11px;
    padding: 12px 12px 12px 38px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; color: #f1f5f9;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
}
.tl-input::placeholder { color: #1e3a4a; }
.tl-input:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20,184,166,.1);
}
.tl-input--pwd { padding-right: 44px; }

.tl-eye-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: transparent; border: none; cursor: pointer;
    color: #334155; display: flex; align-items: center;
    padding: 4px; border-radius: 6px;
    transition: color .15s, background .15s;
}
.tl-eye-btn:hover { color: #14b8a6; background: rgba(20,184,166,.08); }

/* Error */
.tl-error {
    width: 100%;
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 600; color: #f87171;
    background: rgba(239,68,68,.08);
    border: 1px solid rgba(239,68,68,.2);
    border-radius: 9px;
    padding: 10px 13px;
    margin-top: 6px;
    animation: tlShake .3s ease;
}
@keyframes tlShake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-4px); }
    75%       { transform: translateX(4px); }
}

/* Button */
.tl-btn {
    width: 100%; margin-top: 20px;
    padding: 13px;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #0d9488, #14b8a6);
    color: #f0fdfa;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity .15s, transform .12s, box-shadow .15s;
    box-shadow: 0 4px 16px rgba(20,184,166,.25);
}
.tl-btn:hover:not(:disabled) {
    opacity: .9;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(20,184,166,.35);
}
.tl-btn:active:not(:disabled) { transform: translateY(0); }
.tl-btn:disabled { opacity: .5; cursor: not-allowed; }

/* Spinner */
.tl-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(240,253,250,.3);
    border-top-color: #f0fdfa;
    border-radius: 50%;
    animation: tlSpin .7s linear infinite;
}
@keyframes tlSpin { to { transform: rotate(360deg); } }

/* Footer */
.tl-footer {
    margin-top: 20px;
    font-size: 12px; color: #334155; text-align: center;
}
.tl-footer-link {
    color: #14b8a6; text-decoration: none; font-weight: 600;
    transition: color .14s;
}
.tl-footer-link:hover { color: #2dd4bf; text-decoration: underline; }

/* Bottom note */
.tl-bottom-note {
    margin-top: 24px;
    font-size: 11px; color: #1e3a4a;
    position: relative; z-index: 1;
}

@media (max-width: 480px) {
    .tl-card { padding: 28px 22px 24px; }
    .tl-title { font-size: 1.45rem; }
}
`;