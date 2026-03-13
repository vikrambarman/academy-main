"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/* Today's mock schedule — replaced at runtime with real data via API if needed */
const SCHEDULE = [
    { time: "09:00", subject: "DCA – Batch A",    room: "Lab 1"  },
    { time: "11:00", subject: "MS Office – Batch B", room: "Lab 2" },
    { time: "02:00", subject: "Python – Batch C",  room: "Lab 1"  },
];

const FEATURES = [
    { icon: "📋", text: "Mark & View Attendance"        },
    { icon: "📚", text: "Manage Course Content"         },
    { icon: "📝", text: "Student Progress Reports"      },
    { icon: "🔔", text: "Notices & Announcements"       },
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

export default function TeacherLoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password,   setPassword]   = useState("");
    const [showPwd,    setShowPwd]    = useState(false);
    const [loading,    setLoading]    = useState(false);
    const [error,      setError]      = useState("");

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!identifier || !password) { setError("Employee ID/Email aur password dono required hain."); return; }
        setLoading(true); setError("");
        try {
            const res  = await fetch("/api/auth/teacher/login", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ identifier, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            if (data.forceChangePassword) { router.push("/change-password?forced=true"); return; }
            router.push("/dashboard/teacher/attendance");
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <>
            <style>{`
                @keyframes tl-pulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%     { opacity:.5; transform:scale(.75); }
                }
                @keyframes tl-shimmer {
                    from { background-position:-200% center; }
                    to   { background-position:200% center;  }
                }
                @keyframes tl-slide-in {
                    from { opacity:0; transform:translateX(-6px); }
                    to   { opacity:1; transform:translateX(0); }
                }

                .tl-badge-dot { animation: tl-pulse 2s ease-in-out infinite; }

                .tl-schedule-row { animation: tl-slide-in .3s ease both; }
                .tl-schedule-row:nth-child(1) { animation-delay:.05s; }
                .tl-schedule-row:nth-child(2) { animation-delay:.12s; }
                .tl-schedule-row:nth-child(3) { animation-delay:.19s; }

                .tl-submit:not(:disabled):hover {
                    background-image: linear-gradient(
                        90deg,
                        var(--color-primary) 0%,
                        color-mix(in srgb,var(--color-primary) 70%,#fff) 45%,
                        var(--color-primary) 100%
                    );
                    background-size: 200% auto;
                    animation: tl-shimmer 1.4s linear infinite;
                }
                .tl-input::placeholder { color: color-mix(in srgb,var(--color-text-muted) 50%,transparent); }

                /* Inline SVG icon styling */
                .tl-field-icon { color: var(--color-text-muted); transition: color .15s; }
                .tl-input-wrap:focus-within .tl-field-icon { color: var(--color-primary); }
            `}</style>

            <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]"
                style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--color-bg)" }}>

                {/* ═══════════ LEFT PANEL ═══════════ */}
                <div className="hidden md:flex flex-col justify-between relative overflow-hidden px-14 py-14 min-h-screen"
                    style={{ background: "var(--color-bg-sidebar)" }}>

                    {/* Decorative glows */}
                    <div aria-hidden className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 20%,transparent) 0%,transparent 65%)" }} />
                    <div aria-hidden className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-accent) 8%,transparent) 0%,transparent 65%)" }} />
                    {/* Dot pattern */}
                    <div aria-hidden className="absolute bottom-12 right-12 w-40 h-40 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 12%,transparent) 1.5px,transparent 1.5px)",
                            backgroundSize:  "12px 12px",
                        }} />
                    {/* Ghost watermark */}
                    <div aria-hidden className="absolute -bottom-4 -left-3 font-serif font-black italic select-none pointer-events-none leading-none"
                        style={{ fontSize: 170, color: "transparent", WebkitTextStroke: "1px color-mix(in srgb,var(--color-warning) 4%,transparent)" }}>
                        SCA
                    </div>

                    {/* TOP */}
                    <div className="relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 text-[9px] font-medium tracking-[0.18em] uppercase rounded-full px-4 py-[5px] mb-7"
                            style={{ background: "var(--color-warning)", color: "var(--color-bg-sidebar)" }}>
                            <span className="tl-badge-dot w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: "var(--color-bg-sidebar)" }} aria-hidden />
                            Faculty Portal
                        </div>

                        <div className="font-serif text-[1.55rem] font-bold leading-[1.15] mb-2"
                            style={{ color: "var(--color-text-inverse)" }}>
                            Shivshakti<br />Computer Academy
                        </div>
                        <div className="text-[0.8rem] font-light tracking-[0.07em] mb-8"
                            style={{ color: "color-mix(in srgb,var(--color-text-inverse) 35%,transparent)" }}>
                            Faculty Management Portal
                        </div>

                        {/* Today's schedule preview card */}
                        <div className="rounded-[18px] mb-7 overflow-hidden"
                            style={{
                                border: "1px solid color-mix(in srgb,var(--color-warning) 10%,transparent)",
                                background: "color-mix(in srgb,var(--color-primary) 6%,transparent)",
                            }}>
                            {/* Card header */}
                            <div className="px-5 py-3 flex items-center justify-between"
                                style={{ borderBottom: "1px solid color-mix(in srgb,var(--color-warning) 8%,transparent)" }}>
                                <div className="text-[8px] font-semibold tracking-[0.2em] uppercase"
                                    style={{ color: "color-mix(in srgb,var(--color-warning) 70%,transparent)" }}>
                                    Today's Schedule
                                </div>
                                {/* Live indicator */}
                                <div className="flex items-center gap-1.5 text-[8px] font-medium"
                                    style={{ color: "var(--color-success)" }}>
                                    <span className="tl-badge-dot w-1 h-1 rounded-full inline-block"
                                        style={{ background: "var(--color-success)" }} aria-hidden />
                                    Live
                                </div>
                            </div>

                            {/* Schedule rows */}
                            {SCHEDULE.map((s, i) => (
                                <div key={i}
                                    className="tl-schedule-row group flex items-center gap-3 px-5 py-3 transition-colors duration-200"
                                    style={{ borderBottom: i < SCHEDULE.length - 1 ? "1px solid color-mix(in srgb,var(--color-warning) 6%,transparent)" : "none" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-warning) 5%,transparent)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                                    {/* Time chip */}
                                    <div className="flex-shrink-0 text-[9px] font-semibold tracking-[0.05em] px-2 py-0.5 rounded-md"
                                        style={{
                                            background: "color-mix(in srgb,var(--color-primary) 14%,transparent)",
                                            color:      "color-mix(in srgb,var(--color-text-inverse) 60%,transparent)",
                                        }}>
                                        {s.time}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[0.78rem] font-medium truncate"
                                            style={{ color: "color-mix(in srgb,var(--color-text-inverse) 70%,transparent)" }}>
                                            {s.subject}
                                        </div>
                                        <div className="text-[9px]"
                                            style={{ color: "color-mix(in srgb,var(--color-text-inverse) 28%,transparent)" }}>
                                            {s.room}
                                        </div>
                                    </div>
                                    {/* Arrow hint on hover */}
                                    <div className="flex-shrink-0 text-[0.7rem] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        style={{ color: "var(--color-warning)" }} aria-hidden>→</div>
                                </div>
                            ))}
                        </div>

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
                                    <span className="text-[0.82rem] flex-shrink-0" aria-hidden>{f.icon}</span>
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

                        <div className="rounded-[22px] overflow-hidden"
                            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", boxShadow: "0 4px 32px color-mix(in srgb,var(--color-primary) 5%,transparent)" }}>

                            {/* Accent bar */}
                            <div className="h-1 w-full"
                                style={{ background: `linear-gradient(90deg,var(--color-primary),color-mix(in srgb,var(--color-primary) 50%,var(--color-accent)))` }} />

                            {/* Header */}
                            <div className="text-center px-8 pt-6 pb-5"
                                style={{ borderBottom: "1px solid var(--color-border)" }}>
                                {/* Logo or icon */}
                                <div className="w-12 h-12 rounded-2xl mx-auto mb-3.5 flex items-center justify-center overflow-hidden"
                                    style={{
                                        background: "color-mix(in srgb,var(--color-primary) 10%,var(--color-bg))",
                                        border:     "1px solid color-mix(in srgb,var(--color-primary) 20%,transparent)",
                                    }}>
                                    <Image src="/logo.png" alt="SCA Logo" width={32} height={32} className="object-contain" />
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-2 text-[9px] font-medium tracking-[0.2em] uppercase"
                                    style={{ color: "var(--color-primary)" }}>
                                    <span aria-hidden style={{ display:"inline-block", width:16, height:1, background:"var(--color-primary)", flexShrink:0 }} />
                                    Faculty Portal
                                    <span aria-hidden style={{ display:"inline-block", width:16, height:1, background:"var(--color-primary)", flexShrink:0 }} />
                                </div>
                                <div className="font-serif text-[1.3rem] font-bold leading-[1.2]"
                                    style={{ color: "var(--color-text)" }}>
                                    Welcome Back
                                </div>
                                <div className="text-[0.76rem] font-light mt-1"
                                    style={{ color: "var(--color-text-muted)" }}>
                                    Employee ID ya email se login karein
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-8 py-6">
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

                                    {/* Identifier with icon */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="tl-id"
                                            className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Employee ID / Email
                                        </label>
                                        <div className="tl-input-wrap relative">
                                            <span className="tl-field-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center" aria-hidden>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                                                </svg>
                                            </span>
                                            <input id="tl-id" type="text" required autoComplete="username"
                                                placeholder="TCH-001 ya email address"
                                                value={identifier}
                                                onChange={e => { setIdentifier(e.target.value); setError(""); }}
                                                onKeyDown={e => e.key === "Enter" && handleLogin()}
                                                className="tl-input w-full rounded-[11px] py-[11px] text-[0.84rem] font-light outline-none transition-all duration-200"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: "var(--color-bg)",
                                                    border:     "1px solid var(--color-border)",
                                                    color:      "var(--color-text)",
                                                    boxSizing:  "border-box",
                                                    paddingLeft: 40, paddingRight: 14,
                                                }}
                                                onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                    </div>

                                    {/* Password with icon */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="tl-password"
                                            className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Password
                                        </label>
                                        <div className="tl-input-wrap relative">
                                            <span className="tl-field-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center" aria-hidden>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                                </svg>
                                            </span>
                                            <input id="tl-password"
                                                type={showPwd ? "text" : "password"}
                                                required autoComplete="current-password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => { setPassword(e.target.value); setError(""); }}
                                                onKeyDown={e => e.key === "Enter" && handleLogin()}
                                                className="tl-input w-full rounded-[11px] py-[11px] text-[0.84rem] font-light outline-none transition-all duration-200"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: "var(--color-bg)",
                                                    border:     "1px solid var(--color-border)",
                                                    color:      "var(--color-text)",
                                                    boxSizing:  "border-box",
                                                    paddingLeft: 40, paddingRight: 48,
                                                }}
                                                onFocus={onFocus} onBlur={onBlur} />
                                            {/* Eye toggle with SVG */}
                                            <button type="button"
                                                onClick={() => setShowPwd(p => !p)}
                                                aria-label={showPwd ? "Hide password" : "Show password"}
                                                tabIndex={-1}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md flex items-center transition-colors duration-150 cursor-pointer"
                                                style={{ background: "none", border: "none", color: "var(--color-text-muted)" }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
                                                    (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-primary) 8%,transparent)";
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
                                                    (e.currentTarget as HTMLElement).style.background = "none";
                                                }}>
                                                {showPwd ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                                    </svg>
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                        <circle cx="12" cy="12" r="3"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" disabled={loading}
                                        className="tl-submit w-full flex items-center justify-center gap-2 rounded-[11px] py-[13px] text-[0.87rem] font-semibold tracking-wide transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed hover:-translate-y-px cursor-pointer"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            background: "var(--color-primary)",
                                            color: "#fff", border: "none",
                                            boxShadow: "0 4px 18px color-mix(in srgb,var(--color-primary) 32%,transparent)",
                                        }}>
                                        {loading
                                            ? <><span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Logging in…</>
                                            : <>Login to Dashboard <span aria-hidden>→</span></>}
                                    </button>
                                </form>

                                {/* Contact admin note */}
                                <div className="flex items-start gap-2.5 rounded-[11px] px-3.5 py-3 mt-5 text-[0.74rem] font-light leading-[1.65]"
                                    style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
                                    <span aria-hidden className="flex-shrink-0 mt-px">💡</span>
                                    <span>
                                        Credentials bhool gaye?{" "}
                                        <Link href="/admin/login"
                                            className="font-medium no-underline transition-colors duration-150"
                                            style={{ color: "var(--color-primary)" }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = "underline"}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = "none"}>
                                            Admin se contact karein
                                        </Link>
                                    </span>
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