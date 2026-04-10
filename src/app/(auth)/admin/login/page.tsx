"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ─── Icons ─────────────────────────────────────────────────────── */

const EyeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

const EyeOffIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

const ShieldIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
    </svg>
);

const HomeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
);

/* ─── Types ─────────────────────────────────────────────────────── */

type Stats = {
    students: number;
    courses: number;
    faculty: number;
    certificates: number;
} | null;

/* ─── Page ───────────────────────────────────────────────────────── */

export default function AdminLoginPage() {
    const router = useRouter();

    const [email,        setEmail]        = useState("");
    const [password,     setPassword]     = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading,      setLoading]      = useState(false);
    const [error,        setError]        = useState("");
    const [stats,        setStats]        = useState<Stats>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/public-stats")
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setStatsLoading(false));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res  = await fetch("/api/auth/login", {
                method:      "POST",
                headers:     { "Content-Type": "application/json" },
                credentials: "include",
                body:        JSON.stringify({ identifier: email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            if (data.requires2FA)         { router.push(`/verify-otp?uid=${data.userId}`); return; }
            if (data.forceChangePassword) { router.push("/change-password?forced=true");   return; }
            if (data.role === "admin")      router.push("/dashboard/admin");
            else setError("This portal is restricted to administrators only.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="al-root">

                {/* ═══════ FULL-PAGE BACKGROUND LAYER ═══════ */}
                <div className="al-bg" aria-hidden="true">
                    <div className="al-bg__orb al-bg__orb--1" />
                    <div className="al-bg__orb al-bg__orb--2" />
                    <div className="al-bg__orb al-bg__orb--3" />
                    <div className="al-bg__grid" />
                </div>

                {/* ═══════ TOP NAV BAR ═══════ */}
                <header className="al-topbar">
                    <div className="al-topbar__brand">
                        <span className="al-topbar__brand-dot" />
                        <span className="al-topbar__brand-name">
                            Shivshakti Computer Academy
                        </span>
                    </div>
                    <Link href="/" className="al-topbar__back">
                        <HomeIcon />
                        Back to Site
                    </Link>
                </header>

                {/* ═══════ MAIN CONTENT ═══════ */}
                <main className="al-main">

                    {/* ── Left: Branding Column ── */}
                    <div className="al-brand-col">

                        {/* Restricted pill */}
                        <div className="al-restricted-pill">
                            <span className="al-restricted-pill__dot" aria-hidden="true" />
                            Admin Access Only
                        </div>

                        {/* Heading */}
                        <h1 className="al-brand-col__heading">
                            Academy
                            <br />
                            <span className="al-brand-col__heading-accent">
                                Management
                            </span>
                            <br />
                            System
                        </h1>

                        <p className="al-brand-col__desc">
                            Secure operations dashboard for authorised
                            administrators of Shivshakti Computer Academy,
                            Ambikapur.
                        </p>

                        {/* Decorative vertical text */}
                        <div className="al-brand-col__vertical-text" aria-hidden="true">
                            ADMIN
                        </div>
                    </div>

                    {/* ── Right: Login Card ── */}
                    <div className="al-card-col">

                        {/* Floating card */}
                        <div className="al-card">

                            {/* Card inner top tag */}
                            <div className="al-card__tag">
                                <span className="al-card__tag-line" />
                                Secure Sign In
                                <span className="al-card__tag-line" />
                            </div>

                            {/* Title row */}
                            <div className="al-card__title-row">
                                <div className="al-card__title-icon" aria-hidden="true">
                                    <svg width="20" height="20" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor"
                                        strokeWidth="1.8" strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="al-card__title">
                                        Welcome Back
                                    </h2>
                                    <p className="al-card__subtitle">
                                        Sign in to your admin account
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="al-card__divider" />

                            {/* Error alert */}
                            {error && (
                                <div role="alert" className="al-alert">
                                    <span className="al-alert__icon" aria-hidden="true">!</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleLogin} className="al-form">

                                {/* Email */}
                                <div className="al-field">
                                    <label htmlFor="al-email" className="al-field__label">
                                        Email Address
                                    </label>
                                    <div className="al-field__wrap">
                                        <span className="al-field__prefix" aria-hidden="true">
                                            <svg width="14" height="14" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor"
                                                strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                <polyline points="22,6 12,13 2,6"/>
                                            </svg>
                                        </span>
                                        <input
                                            id="al-email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="admin@shivshakti.edu"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="al-field__input"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="al-field">
                                    <div className="al-field__label-row">
                                        <label htmlFor="al-password" className="al-field__label">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => router.push("/forgot-password")}
                                            className="al-forgot"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="al-field__wrap">
                                        <span className="al-field__prefix" aria-hidden="true">
                                            <ShieldIcon />
                                        </span>
                                        <input
                                            id="al-password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="al-field__input al-field__input--pass"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((p) => !p)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="al-field__eye"
                                        >
                                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="al-submit"
                                >
                                    {loading ? (
                                        <>
                                            <span className="al-spinner" aria-hidden="true" />
                                            Signing in…
                                        </>
                                    ) : (
                                        <>
                                            Sign In to Dashboard
                                            <span className="al-submit__arrow" aria-hidden="true">
                                                <ArrowRightIcon />
                                            </span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* OTP note */}
                            <div className="al-otp-note">
                                <span className="al-otp-note__icon" aria-hidden="true">
                                    <ShieldIcon />
                                </span>
                                OTP verification required after login.
                                Unauthorized access is monitored.
                            </div>
                        </div>

                        {/* Card shadow layer (depth effect) */}
                        <div className="al-card-shadow" aria-hidden="true" />
                    </div>
                </main>

                {/* ═══════ BOTTOM BAR ═══════ */}
                <footer className="al-footer">
                    <span>© 2026 Shivshakti Computer Academy</span>
                    <span className="al-footer__dot" aria-hidden="true" />
                    <span>Ambikapur, Chhattisgarh</span>
                    <span className="al-footer__dot" aria-hidden="true" />
                    <span>All rights reserved</span>
                </footer>
            </div>

            {/* ════════════ PAGE CSS ════════════ */}
            <style>{`

/* ══════════════════════════════════════════
   ADMIN LOGIN  —  unique layout redesign
   ══════════════════════════════════════════ */

/* ── Keyframes ──────────────────────────── */
@keyframes al-pulse  {
  0%,100% { opacity:1;   transform:scale(1);    }
  50%     { opacity:0.5; transform:scale(0.75); }
}
@keyframes al-shimmer {
  from { background-position: -200% center; }
  to   { background-position:  200% center; }
}
@keyframes al-spin {
  to { transform: rotate(360deg); }
}
@keyframes al-float {
  0%,100% { transform: translateY(0);   }
  50%     { transform: translateY(-8px);}
}
@keyframes al-fade-up {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0);    }
}

/* ── Root ───────────────────────────────── */
.al-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-gray-950, #0a0f1e);
  font-family: var(--font-sans);
  position: relative;
  overflow: hidden;
}

/* ══════════════════════════════════════════
   BACKGROUND
   ══════════════════════════════════════════ */
.al-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.al-bg__orb {
  position: absolute;
  border-radius: var(--radius-full);
  filter: blur(100px);
}
.al-bg__orb--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%);
  top: -200px;
  left: -100px;
}
.al-bg__orb--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%);
  bottom: -150px;
  right: -100px;
}
.al-bg__orb--3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}
.al-bg__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ══════════════════════════════════════════
   TOP BAR
   ══════════════════════════════════════════ */
.al-topbar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-10);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(10,15,30,0.60);
}
.al-topbar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.al-topbar__brand-dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  box-shadow: 0 0 8px var(--color-primary-400);
  animation: al-pulse 2s ease-in-out infinite;
}
.al-topbar__brand-name {
  font-family: var(--font-display);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgba(255,255,255,0.70);
  letter-spacing: 0.02em;
}
.al-topbar__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: rgba(255,255,255,0.40);
  text-decoration: none;
  padding: var(--space-2) var(--space-4);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-full);
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background var(--transition-fast);
}
.al-topbar__back:hover {
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.05);
}

/* ══════════════════════════════════════════
   MAIN CONTENT — split layout
   ══════════════════════════════════════════ */
.al-main {
  position: relative;
  z-index: 2;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: 0;
  align-items: center;
  padding: var(--space-12) var(--space-10);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* ══════════════════════════════════════════
   BRAND COLUMN (LEFT)
   ══════════════════════════════════════════ */
.al-brand-col {
  position: relative;
  padding-right: var(--space-16);
  animation: al-fade-up 0.6s var(--ease-out) both;
}

/* Restricted pill */
.al-restricted-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 9px;
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-warning);
  background: rgba(251,146,60,0.10);
  border: 1px solid rgba(251,146,60,0.25);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-8);
}
.al-restricted-pill__dot {
  width: 5px;
  height: 5px;
  border-radius: var(--radius-full);
  background: var(--color-warning);
  flex-shrink: 0;
  animation: al-pulse 2s ease-in-out infinite;
}

/* Heading */
.al-brand-col__heading {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-white);
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0 0 var(--space-6);
}
.al-brand-col__heading-accent {
  background: linear-gradient(
    135deg,
    var(--color-primary-400) 0%,
    var(--color-accent-400) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.al-brand-col__desc {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-light);
  color: rgba(255,255,255,0.42);
  line-height: var(--line-height-relaxed);
  max-width: 400px;
  margin: 0 0 var(--space-10);
}

/* Stat pills row */
.al-stat-pills {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.al-stat-pill {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: var(--space-3) var(--space-5);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(8px);
  transition: background var(--transition-fast), border-color var(--transition-fast);
}
.al-stat-pill:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(37,99,235,0.30);
}
.al-stat-pill__num {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  line-height: 1;
}
.al-stat-pill__label {
  font-size: 9px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.30);
}

/* Vertical text decoration */
.al-brand-col__vertical-text {
  position: absolute;
  right: var(--space-6);
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
  font-family: var(--font-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.5em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.06);
  pointer-events: none;
  user-select: none;
}

/* Skeleton for stats */
.al-skel {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.06) 25%,
    rgba(255,255,255,0.10) 50%,
    rgba(255,255,255,0.06) 75%
  );
  background-size: 200% auto;
  animation: al-shimmer 1.4s linear infinite;
  border-radius: var(--radius-sm);
}
.al-skel--pill-num {
  width: 48px;
  height: 20px;
  display: block;
}

/* ══════════════════════════════════════════
   CARD COLUMN (RIGHT)
   ══════════════════════════════════════════ */
.al-card-col {
  position: relative;
  animation: al-fade-up 0.6s 0.15s var(--ease-out) both;
}

/* Depth shadow behind card */
.al-card-shadow {
  position: absolute;
  inset: 20px -8px -16px 8px;
  background: var(--color-primary-600);
  border-radius: var(--radius-2xl);
  opacity: 0.12;
  filter: blur(24px);
  z-index: -1;
}

/* ── The Card ─────────────────────────── */
.al-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  position: relative;
  overflow: hidden;
}

/* Card inner glow top */
.al-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.25),
    transparent
  );
}

/* Card tag (eyebrow) */
.al-card__tag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: var(--space-6);
}
.al-card__tag-line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.08);
}

/* Title row */
.al-card__title-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.al-card__title-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-xl);
  background: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(37,99,235,0.35);
}
.al-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0;
}
.al-card__subtitle {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: rgba(255,255,255,0.38);
  margin: 0;
}

/* Divider */
.al-card__divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin-bottom: var(--space-6);
}

/* ── Alert ──────────────────────────────── */
.al-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-relaxed);
  background: rgba(239,68,68,0.12);
  border: 1px solid rgba(239,68,68,0.30);
  color: #fca5a5;
}
.al-alert__icon {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  background: rgba(239,68,68,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
  color: #fca5a5;
}

/* ── Form ───────────────────────────────── */
.al-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Field */
.al-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.al-field__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.al-field__label {
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}
.al-field__wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.al-field__prefix {
  position: absolute;
  left: var(--space-4);
  display: flex;
  align-items: center;
  color: rgba(255,255,255,0.25);
  pointer-events: none;
  z-index: 1;
}
.al-field__input {
  width: 100%;
  padding: var(--space-3) var(--space-4) var(--space-3) calc(var(--space-4) + 28px);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  font-family: var(--font-sans);
  color: var(--color-white);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: var(--radius-xl);
  transition:
    border-color var(--transition-fast),
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}
.al-field__input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  background: rgba(37,99,235,0.08);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
}
.al-field__input::placeholder {
  color: rgba(255,255,255,0.18);
}
.al-field__input--pass {
  padding-right: 52px;
}

/* Eye toggle */
.al-field__eye {
  position: absolute;
  right: var(--space-4);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.25);
  display: flex;
  align-items: center;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}
.al-field__eye:hover {
  color: rgba(255,255,255,0.70);
}

/* Forgot */
.al-forgot {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  font-family: var(--font-sans);
  color: var(--color-primary-400);
  padding: 0;
  transition: color var(--transition-fast);
}
.al-forgot:hover {
  color: var(--color-primary-300);
}

/* Submit */
.al-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-sans);
  color: var(--color-white);
  background: var(--color-primary-600);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  margin-top: var(--space-2);
  box-shadow: 0 4px 24px rgba(37,99,235,0.35);
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    filter var(--transition-fast);
  position: relative;
  overflow: hidden;
}
.al-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.12) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}
.al-submit:hover:not(:disabled)::before {
  transform: translateX(100%);
}
.al-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(37,99,235,0.50);
  filter: brightness(1.10);
}
.al-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.al-submit__arrow {
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast);
}
.al-submit:hover:not(:disabled) .al-submit__arrow {
  transform: translateX(4px);
}

/* Spinner */
.al-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: var(--color-white);
  animation: al-spin 0.8s linear infinite;
  flex-shrink: 0;
}

/* OTP note */
.al-otp-note {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-5);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: rgba(255,255,255,0.30);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}
.al-otp-note__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: rgba(251,146,60,0.60);
}

/* ══════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════ */
.al-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-10);
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: rgba(255,255,255,0.18);
  letter-spacing: 0.03em;
}
.al-footer__dot {
  width: 3px;
  height: 3px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.15);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .al-main {
    grid-template-columns: 1fr;
    justify-items: center;
    padding: var(--space-10) var(--space-6);
    gap: var(--space-12);
  }
  .al-brand-col {
    padding-right: 0;
    text-align: center;
    width: 100%;
    max-width: 560px;
  }
  .al-brand-col__desc {
    margin-left: auto;
    margin-right: auto;
  }
  .al-stat-pills {
    justify-content: center;
  }
  .al-restricted-pill {
    display: inline-flex;
  }
  .al-brand-col__vertical-text {
    display: none;
  }
  .al-card-col {
    width: 100%;
    max-width: 480px;
  }
}

@media (max-width: 640px) {
  .al-topbar {
    padding: var(--space-4) var(--space-5);
  }
  .al-topbar__brand-name {
    display: none;
  }
  .al-brand-col__heading {
    font-size: clamp(2rem, 8vw, 2.8rem);
  }
  .al-stat-pills {
    gap: var(--space-2);
  }
  .al-stat-pill {
    padding: var(--space-2) var(--space-4);
  }
  .al-card {
    padding: var(--space-6);
  }
  .al-footer {
    flex-wrap: wrap;
    gap: var(--space-2);
    text-align: center;
  }
}

      `}</style>
        </>
    );
}