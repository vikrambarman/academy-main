"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COURSE_CHIPS = [
    "DCA", "PGDCA", "Tally Prime", "MS Office",
    "Python", "Web Design", "Typing", "CorelDRAW",
    "Hardware", "Busy Accounting", "AutoCAD", "Photoshop",
];

const FEATURES = [
    { icon: "📚", text: "Course Details & Syllabus"    },
    { icon: "💳", text: "Fee Payment Tracking"          },
    { icon: "🎓", text: "Certificate Download Status"   },
    { icon: "📋", text: "Attendance & Progress Records" },
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

export default function StudentLoginPage() {
    const router = useRouter();

    const [identifier,   setIdentifier]   = useState("");
    const [password,     setPassword]     = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading,      setLoading]      = useState(false);
    const [error,        setError]        = useState("");

    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail,     setForgotEmail]     = useState("");
    const [forgotLoading,   setForgotLoading]   = useState(false);
    const [forgotMsg, setForgotMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            const res  = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ identifier, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            if (data.forceChangePassword) { router.push("/change-password?forced=true"); return; }
            if (data.role === "student") { router.push("/dashboard/student"); }
            else setError("This portal is for students only.");
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleForgotSubmit = async () => {
        if (!forgotEmail) { setForgotMsg({ type: "error", text: "Please enter your email address." }); return; }
        setForgotLoading(true); setForgotMsg(null);
        try {
            const res  = await fetch("/api/auth/student-forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            if (res.ok) {
                setForgotMsg({ type: "success", text: data.message || "Temporary password sent to your email." });
                setTimeout(() => { setShowForgotModal(false); setForgotMsg(null); setForgotEmail(""); }, 2400);
            } else {
                setForgotMsg({ type: "error", text: data.message || "Something went wrong." });
            }
        } catch {
            setForgotMsg({ type: "error", text: "Something went wrong. Please try again." });
        }
        setForgotLoading(false);
    };

    return (
        <>
            <style>{`
                @keyframes sl-pulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%     { opacity:.5; transform:scale(.75); }
                }
                @keyframes sl-float-0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                @keyframes sl-float-1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
                @keyframes sl-float-2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                @keyframes sl-modal-fade  { from{opacity:0} to{opacity:1} }
                @keyframes sl-modal-slide { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes sl-shimmer     { from{background-position:-200% center} to{background-position:200% center} }

                .sl-badge-dot  { animation: sl-pulse 2s ease-in-out infinite; }
                .sl-chip-0     { animation: sl-float-0 4.2s ease-in-out infinite; }
                .sl-chip-1     { animation: sl-float-1 3.8s ease-in-out infinite 0.4s; }
                .sl-chip-2     { animation: sl-float-2 4.6s ease-in-out infinite 0.8s; }
                .sl-chip-3     { animation: sl-float-0 5s   ease-in-out infinite 0.2s; }
                .sl-chip-4     { animation: sl-float-1 3.5s ease-in-out infinite 1s;   }
                .sl-chip-5     { animation: sl-float-2 4.2s ease-in-out infinite 0.6s; }
                .sl-modal-bd   { animation: sl-modal-fade  .18s ease; }
                .sl-modal      { animation: sl-modal-slide .2s ease; }

                .sl-submit:not(:disabled):hover {
                    background-image: linear-gradient(
                        90deg,
                        var(--color-primary) 0%,
                        color-mix(in srgb,var(--color-primary) 70%,#fff) 45%,
                        var(--color-primary) 100%
                    );
                    background-size: 200% auto;
                    animation: sl-shimmer 1.4s linear infinite;
                }
                .sl-input::placeholder { color: color-mix(in srgb,var(--color-text-muted) 50%,transparent); }
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
                    <div aria-hidden className="absolute bottom-12 right-12 w-40 h-40 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 12%,transparent) 1.5px,transparent 1.5px)",
                            backgroundSize:  "12px 12px",
                        }} />
                    <div aria-hidden className="absolute -bottom-4 -left-3 font-serif font-black italic select-none pointer-events-none leading-none"
                        style={{ fontSize: 170, color: "transparent", WebkitTextStroke: "1px color-mix(in srgb,var(--color-warning) 4%,transparent)" }}>
                        SCA
                    </div>

                    {/* TOP */}
                    <div className="relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 text-[9px] font-medium tracking-[0.18em] uppercase rounded-full px-4 py-[5px] mb-7"
                            style={{ background: "var(--color-warning)", color: "var(--color-bg-sidebar)" }}>
                            <span className="sl-badge-dot w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: "var(--color-bg-sidebar)" }} aria-hidden />
                            Student Portal
                        </div>

                        <div className="font-serif text-[1.55rem] font-bold leading-[1.15] mb-2"
                            style={{ color: "var(--color-text-inverse)" }}>
                            Shivshakti<br />Computer Academy
                        </div>
                        <div className="text-[0.8rem] font-light tracking-[0.07em] mb-7"
                            style={{ color: "color-mix(in srgb,var(--color-text-inverse) 35%,transparent)" }}>
                            Student Learning Portal
                        </div>

                        {/* Floating course chips */}
                        <div className="mb-7">
                            <div className="text-[8px] font-medium tracking-[0.2em] uppercase mb-2.5"
                                style={{ color: "color-mix(in srgb,var(--color-warning) 65%,transparent)" }}>
                                Available Courses
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {COURSE_CHIPS.map((c, i) => (
                                    <span key={c}
                                        className={`sl-chip-${i % 6} inline-flex items-center text-[10px] font-medium px-2.5 py-[4px] rounded-full`}
                                        style={{
                                            background: "color-mix(in srgb,var(--color-primary) 12%,transparent)",
                                            border:     "1px solid color-mix(in srgb,var(--color-primary) 22%,transparent)",
                                            color:      "color-mix(in srgb,var(--color-text-inverse) 55%,transparent)",
                                        }}>
                                        {c}
                                    </span>
                                ))}
                            </div>
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
                                style={{ background: `linear-gradient(90deg, var(--color-primary), color-mix(in srgb,var(--color-primary) 50%,var(--color-accent)))` }} />

                            {/* Header */}
                            <div className="text-center px-8 pt-6 pb-5"
                                style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <div className="w-12 h-12 rounded-2xl mx-auto mb-3.5 flex items-center justify-center text-xl"
                                    style={{
                                        background: "color-mix(in srgb,var(--color-primary) 10%,var(--color-bg))",
                                        border:     "1px solid color-mix(in srgb,var(--color-primary) 20%,transparent)",
                                    }}
                                    aria-hidden>🎓</div>
                                <div className="flex items-center justify-center gap-2 mb-2 text-[9px] font-medium tracking-[0.2em] uppercase"
                                    style={{ color: "var(--color-primary)" }}>
                                    <span aria-hidden style={{ display:"inline-block", width:16, height:1, background:"var(--color-primary)", flexShrink:0 }} />
                                    Student Portal
                                    <span aria-hidden style={{ display:"inline-block", width:16, height:1, background:"var(--color-primary)", flexShrink:0 }} />
                                </div>
                                <div className="font-serif text-[1.3rem] font-bold leading-[1.2]"
                                    style={{ color: "var(--color-text)" }}>
                                    Sign In
                                </div>
                                <div className="text-[0.76rem] font-light mt-1"
                                    style={{ color: "var(--color-text-muted)" }}>
                                    Access your learning dashboard
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

                                    {/* Identifier */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="sl-id"
                                            className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Email or Student ID
                                        </label>
                                        <input id="sl-id" type="text" required autoComplete="username"
                                            placeholder="Email or student ID (e.g. STU-001)"
                                            value={identifier} onChange={e => setIdentifier(e.target.value)}
                                            className="sl-input w-full rounded-[11px] px-4 py-[11px] text-[0.84rem] font-light outline-none transition-all duration-200"
                                            style={{ fontFamily:"'DM Sans',sans-serif", background:"var(--color-bg)", border:"1px solid var(--color-border)", color:"var(--color-text)", boxSizing:"border-box" }}
                                            onFocus={onFocus} onBlur={onBlur} />
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="sl-password"
                                            className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input id="sl-password"
                                                type={showPassword ? "text" : "password"}
                                                required autoComplete="current-password"
                                                placeholder="Enter your password"
                                                value={password} onChange={e => setPassword(e.target.value)}
                                                className="sl-input w-full rounded-[11px] px-4 py-[11px] text-[0.84rem] font-light outline-none transition-all duration-200"
                                                style={{ fontFamily:"'DM Sans',sans-serif", background:"var(--color-bg)", border:"1px solid var(--color-border)", color:"var(--color-text)", boxSizing:"border-box", paddingRight:56 }}
                                                onFocus={onFocus} onBlur={onBlur} />
                                            <button type="button"
                                                onClick={() => setShowPassword(p => !p)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-md transition-colors duration-150 cursor-pointer"
                                                style={{ background:"none", border:"none", color:"var(--color-text-muted)" }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"}>
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="button"
                                                onClick={() => { setForgotMsg(null); setForgotEmail(""); setShowForgotModal(true); }}
                                                className="text-[0.73rem] font-normal transition-colors duration-150 cursor-pointer"
                                                style={{ background:"none", border:"none", color:"var(--color-text-muted)" }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"}>
                                                Forgot password?
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" disabled={loading}
                                        className="sl-submit w-full flex items-center justify-center gap-2 rounded-[11px] py-[13px] text-[0.87rem] font-semibold tracking-wide transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed hover:-translate-y-px cursor-pointer"
                                        style={{
                                            fontFamily:"'DM Sans',sans-serif",
                                            background:"var(--color-primary)", color:"#fff", border:"none",
                                            boxShadow:"0 4px 18px color-mix(in srgb,var(--color-primary) 32%,transparent)",
                                        }}>
                                        {loading
                                            ? <><span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in…</>
                                            : <>Sign In <span aria-hidden>→</span></>}
                                    </button>
                                </form>

                                {/* Info note */}
                                <div className="flex items-start gap-2.5 rounded-[11px] px-3.5 py-3 mt-5 text-[0.74rem] font-light leading-[1.65]"
                                    style={{ background:"var(--color-bg)", border:"1px solid var(--color-border)", color:"var(--color-text-muted)" }}>
                                    <span aria-hidden className="flex-shrink-0 mt-px">🎓</span>
                                    <span>Use the credentials provided by the academy at the time of <strong style={{ color:"var(--color-text)", fontWeight:500 }}>enrollment</strong>.</span>
                                </div>

                                <p className="mt-3 text-center text-[0.69rem] font-light"
                                    style={{ color: "color-mix(in srgb,var(--color-text-muted) 55%,transparent)" }}>
                                    By signing in you agree to our Terms &amp; Privacy Policy.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 text-center">
                            <Link href="/"
                                className="inline-flex items-center gap-1.5 text-[0.76rem] font-light no-underline transition-colors duration-150"
                                style={{ color:"var(--color-text-muted)" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"}>
                                <span aria-hidden>←</span> Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════ FORGOT PASSWORD MODAL ═══════════ */}
            {showForgotModal && (
                <div className="sl-modal-bd fixed inset-0 z-[9999] flex items-center justify-center px-6"
                    style={{ background: "color-mix(in srgb,var(--color-bg-sidebar) 72%,transparent)", backdropFilter: "blur(5px)" }}
                    onClick={e => { if (e.target === e.currentTarget) setShowForgotModal(false); }}
                    role="dialog" aria-modal aria-label="Reset password">

                    <div className="sl-modal w-full max-w-[390px] rounded-[20px] overflow-hidden"
                        style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border)", boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>

                        {/* Modal header */}
                        <div className="relative overflow-hidden px-7 pt-6 pb-5"
                            style={{ background:"var(--color-bg-sidebar)", borderBottom:"1px solid color-mix(in srgb,var(--color-warning) 10%,transparent)" }}>
                            <div aria-hidden className="absolute -bottom-3 -right-3 w-24 h-24 pointer-events-none"
                                style={{
                                    backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 14%,transparent) 1.5px,transparent 1.5px)",
                                    backgroundSize:  "10px 10px",
                                }} />
                            <div aria-hidden className="absolute top-0 left-0 right-0 h-0.5"
                                style={{ background: "linear-gradient(90deg,transparent,var(--color-warning),transparent)" }} />
                            <div className="flex items-center gap-1.5 mb-2 text-[9px] font-medium tracking-[0.18em] uppercase"
                                style={{ color:"var(--color-warning)" }}>
                                <span aria-hidden style={{ display:"inline-block", width:12, height:1.5, background:"var(--color-warning)", flexShrink:0 }} />
                                Account Recovery
                            </div>
                            <div className="font-serif text-[1.05rem] font-bold relative z-10"
                                style={{ color:"var(--color-text-inverse)" }}>
                                Reset Your Password
                            </div>
                            <div className="text-[0.74rem] font-light mt-1 leading-[1.65] relative z-10"
                                style={{ color:"color-mix(in srgb,var(--color-text-inverse) 38%,transparent)" }}>
                                Enter your registered email. We'll send a temporary password.
                            </div>
                        </div>

                        {/* Modal body */}
                        <div className="px-7 py-6">
                            {forgotMsg && (
                                <div role="alert"
                                    className="flex items-start gap-2 rounded-[10px] px-3.5 py-2.5 mb-4 text-[0.78rem] font-light leading-[1.6]"
                                    style={{
                                        background: forgotMsg.type === "success"
                                            ? "color-mix(in srgb,var(--color-success) 8%,var(--color-bg))"
                                            : "color-mix(in srgb,var(--color-error) 8%,var(--color-bg))",
                                        border: forgotMsg.type === "success"
                                            ? "1px solid color-mix(in srgb,var(--color-success) 28%,transparent)"
                                            : "1px solid color-mix(in srgb,var(--color-error) 28%,transparent)",
                                        color: forgotMsg.type === "success" ? "var(--color-success)" : "var(--color-error)",
                                    }}>
                                    <span aria-hidden className="flex-shrink-0 mt-px">{forgotMsg.type === "success" ? "✓" : "✕"}</span>
                                    <span>{forgotMsg.text}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5 mb-5">
                                <label htmlFor="sl-forgot-email"
                                    className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                                    style={{ color:"var(--color-text-muted)" }}>
                                    Registered Email
                                </label>
                                <input id="sl-forgot-email" type="email"
                                    value={forgotEmail}
                                    onChange={e => setForgotEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="sl-input w-full rounded-[11px] px-4 py-[11px] text-[0.84rem] font-light outline-none transition-all duration-200"
                                    style={{ fontFamily:"'DM Sans',sans-serif", background:"var(--color-bg)", border:"1px solid var(--color-border)", color:"var(--color-text)", boxSizing:"border-box" }}
                                    onFocus={onFocus} onBlur={onBlur}
                                    onKeyDown={e => e.key === "Enter" && handleForgotSubmit()} />
                            </div>

                            <div className="flex gap-2">
                                <button type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className="flex-1 rounded-[10px] py-[11px] text-[0.84rem] font-normal transition-colors duration-150 cursor-pointer"
                                    style={{ fontFamily:"'DM Sans',sans-serif", background:"var(--color-bg)", border:"1px solid var(--color-border)", color:"var(--color-text-muted)" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-border) 60%,var(--color-bg))"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg)"}>
                                    Cancel
                                </button>
                                <button type="button" disabled={forgotLoading}
                                    onClick={handleForgotSubmit}
                                    className="flex-[2] flex items-center justify-center gap-1.5 rounded-[10px] py-[11px] text-[0.84rem] font-semibold transition-all duration-150 disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
                                    style={{ fontFamily:"'DM Sans',sans-serif", background:"var(--color-primary)", color:"#fff", border:"none" }}>
                                    {forgotLoading
                                        ? <><span className="inline-block w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />Sending…</>
                                        : <>Send Reset Link <span aria-hidden>→</span></>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}