"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FEATURES = [
    { icon: "⚙️", text: "Full Academy Control Panel"            },
    { icon: "👥", text: "Student & Faculty Management"          },
    { icon: "📊", text: "Fee, Payment & Report Analytics"       },
    { icon: "🔐", text: "OTP-Protected Secure Access"           },
];

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--color-primary)";
    e.currentTarget.style.background  = "var(--color-bg-card)";
    e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb,var(--color-primary) 12%,transparent)";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--color-border)";
    e.currentTarget.style.background  = "var(--color-bg)";
    e.currentTarget.style.boxShadow   = "none";
};

export default function AdminLoginPage() {
    const router = useRouter();
    const [email,        setEmail]        = useState("");
    const [password,     setPassword]     = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading,      setLoading]      = useState(false);
    const [error,        setError]        = useState("");

    /* Real stats from API */
    type Stats = { students: number; courses: number; faculty: number; certificates: number } | null;
    const [stats,      setStats]      = useState<Stats>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/public-stats")
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d => setStats(d))
            .catch(() => setStats(null))
            .finally(() => setStatsLoading(false));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            const res  = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ identifier: email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            if (data.requires2FA)         { router.push(`/verify-otp?uid=${data.userId}`); return; }
            if (data.forceChangePassword) { router.push("/change-password?forced=true");   return; }
            if (data.role === "admin") { router.push("/dashboard/admin"); }
            else setError("This portal is restricted to administrators only.");
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <>
            <style>{`
                @keyframes al-pulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%     { opacity:.5; transform:scale(.75); }
                }
                @keyframes al-shimmer-bg {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes al-shimmer {
                    from { background-position: -200% center; }
                    to   { background-position:  200% center; }
                }

                .al-badge-dot { animation: al-pulse 2s ease-in-out infinite; }
                .al-skel {
                    background: linear-gradient(90deg,
                        color-mix(in srgb,var(--color-text-inverse) 6%,transparent) 25%,
                        color-mix(in srgb,var(--color-text-inverse) 10%,transparent) 50%,
                        color-mix(in srgb,var(--color-text-inverse) 6%,transparent) 75%
                    );
                    background-size: 200% auto;
                    animation: al-shimmer-bg 1.4s linear infinite;
                    border-radius: 6px;
                }

                /* Shimmer on submit hover */
                .al-submit-shimmer:not(:disabled):hover {
                    background-image: linear-gradient(
                        90deg,
                        var(--color-primary) 0%,
                        color-mix(in srgb,var(--color-primary) 70%,#fff) 45%,
                        var(--color-primary) 100%
                    );
                    background-size: 200% auto;
                    animation: al-shimmer 1.4s linear infinite;
                }

                /* Input placeholder */
                .al-input::placeholder { color: color-mix(in srgb,var(--color-text-muted) 50%,transparent); }
            `}</style>

            <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]"
                style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--color-bg)" }}>

                {/* ═══════════ LEFT PANEL ═══════════ */}
                <div className="hidden md:flex flex-col justify-between relative overflow-hidden px-14 py-14 min-h-screen"
                    style={{ background: "var(--color-bg-sidebar)" }}>

                    {/* Decorative */}
                    <div aria-hidden className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 20%,transparent) 0%,transparent 65%)" }} />
                    <div aria-hidden className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 8%,transparent) 0%,transparent 65%)" }} />
                    {/* Dot pattern */}
                    <div aria-hidden className="absolute bottom-12 right-12 w-40 h-40 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 14%,transparent) 1.5px,transparent 1.5px)",
                            backgroundSize: "12px 12px",
                        }} />
                    {/* Horizontal grid lines */}
                    <div aria-hidden className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: "linear-gradient(color-mix(in srgb,var(--color-warning) 3%,transparent) 1px,transparent 1px)",
                            backgroundSize: "100% 72px",
                        }} />
                    {/* Ghost watermark */}
                    <div aria-hidden className="absolute -bottom-4 -left-3 font-serif font-black italic select-none pointer-events-none leading-none"
                        style={{ fontSize: 170, color: "transparent", WebkitTextStroke: "1px color-mix(in srgb,var(--color-warning) 4%,transparent)" }}>
                        SCA
                    </div>

                    {/* TOP */}
                    <div className="relative z-10">
                        {/* Restricted badge */}
                        <div className="inline-flex items-center gap-2 text-[9px] font-medium tracking-[0.18em] uppercase rounded-full px-4 py-[5px] mb-7"
                            style={{ background: "var(--color-warning)", color: "var(--color-bg-sidebar)" }}>
                            <span className="al-badge-dot w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: "var(--color-bg-sidebar)" }} aria-hidden />
                            Admin Access Only
                        </div>

                        {/* Academy name */}
                        <div className="font-serif text-[1.55rem] font-bold leading-[1.15] mb-2"
                            style={{ color: "var(--color-text-inverse)" }}>
                            Shivshakti<br />Computer Academy
                        </div>
                        <div className="text-[0.8rem] font-light tracking-[0.07em] mb-8"
                            style={{ color: "color-mix(in srgb,var(--color-text-inverse) 35%,transparent)" }}>
                            Academy Management System
                        </div>

                        {/* Stats grid — real data from API */}
                        {(statsLoading || stats) && (
                            <div className="rounded-[18px] mb-7 overflow-hidden"
                                style={{
                                    border: "1px solid color-mix(in srgb,var(--color-warning) 10%,transparent)",
                                    background: "color-mix(in srgb,var(--color-primary) 6%,transparent)",
                                }}>
                                <div className="px-5 py-2.5 text-[8px] font-semibold tracking-[0.2em] uppercase"
                                    style={{
                                        borderBottom: "1px solid color-mix(in srgb,var(--color-warning) 8%,transparent)",
                                        color: "color-mix(in srgb,var(--color-warning) 65%,transparent)",
                                    }}>
                                    Academy Overview
                                </div>
                                <div className="grid grid-cols-2" style={{ gap: 1, background: "color-mix(in srgb,var(--color-warning) 8%,transparent)" }}>
                                    {[
                                        { key: "students",     label: "Students Enrolled",   val: stats?.students     },
                                        { key: "courses",      label: "Active Courses",       val: stats?.courses      },
                                        { key: "faculty",      label: "Faculty Members",      val: stats?.faculty      },
                                        { key: "certificates", label: "Certificates Issued",  val: stats?.certificates },
                                    ].map(({ key, label, val }) => (
                                        <div key={key} className="px-4 py-3.5"
                                            style={{ background: "var(--color-bg-sidebar)" }}>
                                            {statsLoading ? (
                                                <>
                                                    <div className="al-skel h-5 w-14 mb-1.5" />
                                                    <div className="al-skel h-2.5 w-20" />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="font-serif font-bold text-[1.3rem] leading-none mb-1"
                                                        style={{ color: "var(--color-warning)" }}>
                                                        {val?.toLocaleString("en-IN") ?? "—"}
                                                    </div>
                                                    <div className="text-[10px] font-light leading-tight"
                                                        style={{ color: "color-mix(in srgb,var(--color-text-inverse) 40%,transparent)" }}>
                                                        {label}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Feature list */}
                        <div className="flex flex-col rounded-[18px] overflow-hidden"
                            style={{ border: "1px solid color-mix(in srgb,var(--color-warning) 9%,transparent)" }}>
                            {FEATURES.map((f, i) => (
                                <div key={f.text}
                                    className="group relative flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 cursor-default"
                                    style={{ borderBottom: i < FEATURES.length - 1 ? "1px solid color-mix(in srgb,var(--color-warning) 7%,transparent)" : "none" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-warning) 5%,transparent)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                                    <span aria-hidden className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-out"
                                        style={{ background: "var(--color-warning)" }} />
                                    <span className="text-[0.8rem] flex-shrink-0" aria-hidden>{f.icon}</span>
                                    <span className="text-[0.8rem] font-light leading-[1.4]"
                                        style={{ color: "color-mix(in srgb,var(--color-text-inverse) 50%,transparent)" }}>
                                        {f.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="relative z-10 text-[0.68rem] font-light tracking-[0.04em]"
                        style={{ color: "color-mix(in srgb,var(--color-text-inverse) 18%,transparent)" }}>
                        © 2026 Shivshakti Computer Academy · All rights reserved
                    </div>
                </div>

                {/* ═══════════ RIGHT PANEL ═══════════ */}
                <div className="flex items-center justify-center px-6 py-12 min-h-screen"
                    style={{ background: "var(--color-bg)" }}>
                    <div className="w-full max-w-[400px]">

                        {/* Card */}
                        <div className="rounded-[22px] overflow-hidden"
                            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", boxShadow: "0 4px 32px color-mix(in srgb,var(--color-primary) 5%,transparent)" }}>

                            {/* Card header accent bar */}
                            <div className="h-1 w-full"
                                style={{ background: `linear-gradient(90deg, var(--color-primary), color-mix(in srgb,var(--color-primary) 50%,var(--color-accent)))` }} />

                            {/* Card header */}
                            <div className="text-center px-8 pt-6 pb-5"
                                style={{ borderBottom: "1px solid var(--color-border)" }}>
                                {/* Icon ring */}
                                <div className="w-12 h-12 rounded-2xl mx-auto mb-3.5 flex items-center justify-center text-xl"
                                    style={{
                                        background: "color-mix(in srgb,var(--color-primary) 10%,var(--color-bg))",
                                        border: "1px solid color-mix(in srgb,var(--color-primary) 20%,transparent)",
                                    }}
                                    aria-hidden>⚙️</div>
                                {/* Eyebrow */}
                                <div className="flex items-center justify-center gap-2 mb-2 text-[9px] font-medium tracking-[0.2em] uppercase"
                                    style={{ color: "var(--color-primary)" }}>
                                    <span aria-hidden style={{ display: "inline-block", width: 16, height: 1, background: "var(--color-primary)", flexShrink: 0 }} />
                                    Admin Portal
                                    <span aria-hidden style={{ display: "inline-block", width: 16, height: 1, background: "var(--color-primary)", flexShrink: 0 }} />
                                </div>
                                <div className="font-serif text-[1.3rem] font-bold leading-[1.2]"
                                    style={{ color: "var(--color-text)" }}>
                                    Sign In
                                </div>
                                <div className="text-[0.76rem] font-light mt-1"
                                    style={{ color: "var(--color-text-muted)" }}>
                                    Manage academy operations securely
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="px-8 py-6">

                                {/* Error */}
                                {error && (
                                    <div role="alert"
                                        className="flex items-start gap-2 rounded-[10px] px-3.5 py-2.5 mb-4 text-[0.78rem] font-light leading-[1.6]"
                                        style={{
                                            background: "color-mix(in srgb,var(--color-error) 8%,var(--color-bg))",
                                            border:     "1px solid color-mix(in srgb,var(--color-error) 28%,transparent)",
                                            color:      "var(--color-error)",
                                        }}>
                                        <span aria-hidden className="flex-shrink-0 mt-px">✕</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                                    {/* Email */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="al-email"
                                            className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Admin Email
                                        </label>
                                        <input id="al-email" type="email" required autoComplete="email"
                                            placeholder="admin@shivshakti.edu"
                                            value={email} onChange={e => setEmail(e.target.value)}
                                            className="al-input w-full rounded-[11px] px-4 py-[11px] text-[0.84rem] font-light outline-none transition-all duration-200"
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                background: "var(--color-bg)",
                                                border:     "1px solid var(--color-border)",
                                                color:      "var(--color-text)",
                                                boxSizing:  "border-box",
                                            }}
                                            onFocus={onFocus} onBlur={onBlur} />
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="al-password"
                                            className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input id="al-password"
                                                type={showPassword ? "text" : "password"}
                                                required autoComplete="current-password"
                                                placeholder="Enter your password"
                                                value={password} onChange={e => setPassword(e.target.value)}
                                                className="al-input w-full rounded-[11px] px-4 py-[11px] text-[0.84rem] font-light outline-none transition-all duration-200"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: "var(--color-bg)",
                                                    border:     "1px solid var(--color-border)",
                                                    color:      "var(--color-text)",
                                                    boxSizing:  "border-box",
                                                    paddingRight: 56,
                                                }}
                                                onFocus={onFocus} onBlur={onBlur} />
                                            <button type="button"
                                                onClick={() => setShowPassword(p => !p)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-md transition-colors duration-150 cursor-pointer"
                                                style={{ background: "none", border: "none", color: "var(--color-text-muted)" }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"}>
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="button"
                                                onClick={() => router.push("/forgot-password")}
                                                className="text-[0.73rem] font-normal transition-colors duration-150 cursor-pointer"
                                                style={{ background: "none", border: "none", color: "var(--color-text-muted)" }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"}>
                                                Forgot password?
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" disabled={loading}
                                        className="al-submit-shimmer w-full flex items-center justify-center gap-2 rounded-[11px] py-[13px] text-[0.87rem] font-semibold tracking-wide transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed hover:-translate-y-px cursor-pointer"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            background: "var(--color-primary)",
                                            color: "#fff", border: "none",
                                            boxShadow: "0 4px 18px color-mix(in srgb,var(--color-primary) 32%,transparent)",
                                        }}>
                                        {loading
                                            ? <><span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in…</>
                                            : <>Sign In <span aria-hidden>→</span></>
                                        }
                                    </button>
                                </form>

                                {/* Security note */}
                                <div className="flex items-start gap-2.5 rounded-[11px] px-3.5 py-3 mt-5 text-[0.74rem] font-light leading-[1.65]"
                                    style={{
                                        background: "color-mix(in srgb,var(--color-warning) 6%,var(--color-bg))",
                                        border:     "1px solid color-mix(in srgb,var(--color-warning) 16%,transparent)",
                                        color:      "var(--color-text-muted)",
                                    }}>
                                    <span aria-hidden className="flex-shrink-0 mt-px">🔐</span>
                                    <span>Admin accounts require <strong style={{ color: "var(--color-text)", fontWeight: 500 }}>OTP verification</strong> after login. Unauthorized attempts are logged.</span>
                                </div>
                            </div>
                        </div>

                        {/* Back link */}
                        <div className="mt-5 text-center">
                            <Link href="/"
                                className="inline-flex items-center gap-1.5 text-[0.76rem] font-light no-underline transition-colors duration-150"
                                style={{ color: "var(--color-text-muted)" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"}>
                                <span aria-hidden>←</span> Back to Home
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}