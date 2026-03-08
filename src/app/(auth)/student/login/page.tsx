"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FEATURES = [
    "View Course Details & Syllabus",
    "Track Fee Payments",
    "Check Certificate Status",
    "Access Academic Information",
];

export default function StudentLoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMsg, setForgotMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ identifier, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            if (data.forceChangePassword) { router.push("/change-password?forced=true"); return; }
            if (data.role === "student") {
                router.push("/dashboard/student");
            } else {
                setError("This login portal is for students only.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSubmit = async () => {
        if (!forgotEmail) { setForgotMsg({ type: "error", text: "Please enter your email address." }); return; }
        setForgotLoading(true);
        setForgotMsg(null);
        try {
            const res = await fetch("/api/auth/student-forgot-password", {
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
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500&display=swap');

                .sl-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: #faf8f4;
                }

                /* ── Left panel ── */
                .sl-left {
                    background: #1a1208;
                    padding: 52px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    min-height: 100vh;
                }

                .sl-left-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 360px; height: 360px;
                    background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 65%);
                    pointer-events: none;
                }

                .sl-left-glow-2 {
                    position: absolute;
                    bottom: -60px; left: -60px;
                    width: 280px; height: 280px;
                    background: radial-gradient(circle, rgba(252,211,77,0.05) 0%, transparent 65%);
                    pointer-events: none;
                }

                .sl-left-dots {
                    position: absolute;
                    bottom: 40px; right: 40px;
                    width: 140px; height: 140px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.1) 1.5px, transparent 1.5px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                .sl-left-watermark {
                    position: absolute;
                    bottom: -20px; left: -10px;
                    font-family: 'Playfair Display', serif;
                    font-size: 160px;
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(252,211,77,0.04);
                    pointer-events: none;
                    user-select: none;
                    line-height: 1;
                }

                .sl-left-top { position: relative; z-index: 1; }

                .sl-left-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: #1a1208;
                    background: #fcd34d;
                    padding: 5px 14px;
                    border-radius: 100px;
                    margin-bottom: 24px;
                }

                .sl-left-badge-dot {
                    width: 5px; height: 5px;
                    background: #92540a;
                    border-radius: 50%;
                }

                .sl-left-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                    margin-bottom: 6px;
                }

                .sl-left-sub {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.4);
                    letter-spacing: 0.06em;
                    margin-bottom: 40px;
                }

                .sl-features {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    border: 1px solid rgba(252,211,77,0.08);
                    border-radius: 16px;
                    overflow: hidden;
                }

                .sl-feature {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px;
                    border-bottom: 1px solid rgba(252,211,77,0.06);
                    transition: background 0.18s;
                    position: relative;
                }

                .sl-feature:last-child { border-bottom: none; }

                .sl-feature::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 4px; bottom: 4px;
                    width: 2px;
                    background: #fcd34d;
                    border-radius: 2px;
                    transform: scaleY(0);
                    transition: transform 0.22s ease;
                    transform-origin: top;
                }

                .sl-feature:hover { background: rgba(252,211,77,0.04); }
                .sl-feature:hover::before { transform: scaleY(1); }

                .sl-feature-check {
                    width: 18px; height: 18px;
                    background: rgba(74,222,128,0.12);
                    border: 1px solid rgba(74,222,128,0.22);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.55rem;
                    color: #4ade80;
                    flex-shrink: 0;
                }

                .sl-feature-text {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.55);
                    line-height: 1.4;
                }

                .sl-left-bottom { position: relative; z-index: 1; }

                .sl-left-copy {
                    font-size: 0.7rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.2);
                    letter-spacing: 0.04em;
                }

                /* ── Right panel ── */
                .sl-right {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    background: #faf8f4;
                }

                .sl-card {
                    width: 100%;
                    max-width: 420px;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                }

                .sl-card-header {
                    padding: 28px 32px 24px;
                    border-bottom: 1px solid #f5efe4;
                    text-align: center;
                }

                .sl-card-eyebrow {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 10px;
                }

                .sl-card-eyebrow::before,
                .sl-card-eyebrow::after {
                    content: '';
                    display: inline-block;
                    width: 18px; height: 1px;
                    background: #d97706;
                }

                .sl-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .sl-card-sub {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: #92826b;
                    margin-top: 5px;
                }

                .sl-card-body { padding: 28px 32px 32px; }

                .sl-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 10px;
                    padding: 11px 14px;
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: #dc2626;
                    display: flex;
                    gap: 8px;
                    align-items: flex-start;
                    margin-bottom: 18px;
                    line-height: 1.55;
                }

                .sl-field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 14px;
                }

                .sl-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92826b;
                }

                .sl-input {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 300;
                    color: #1a1208;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 11px;
                    padding: 11px 14px;
                    outline: none;
                    width: 100%;
                    box-sizing: border-box;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                }

                .sl-input::placeholder { color: #b8a898; }

                .sl-input:focus {
                    border-color: #d97706;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(217,119,6,0.08);
                }

                .sl-pw-wrap { position: relative; }

                .sl-pw-toggle {
                    position: absolute;
                    right: 13px; top: 50%;
                    transform: translateY(-50%);
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: #92826b;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 2px 6px;
                    border-radius: 5px;
                    transition: color 0.16s;
                }

                .sl-pw-toggle:hover { color: #b45309; }

                .sl-forgot {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 6px;
                }

                .sl-forgot-btn {
                    font-size: 0.75rem;
                    font-weight: 400;
                    color: #92826b;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    transition: color 0.16s;
                }

                .sl-forgot-btn:hover { color: #b45309; }

                .sl-submit {
                    width: 100%;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    border: none;
                    border-radius: 11px;
                    padding: 13px;
                    cursor: pointer;
                    margin-top: 18px;
                    transition: background 0.2s, transform 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .sl-submit:hover:not(:disabled) { background: #2d1f0d; transform: translateY(-1px); }
                .sl-submit:disabled { opacity: 0.6; cursor: not-allowed; }

                .sl-info-note {
                    margin-top: 18px;
                    background: #faf8f4;
                    border: 1px solid #f0e8d8;
                    border-radius: 10px;
                    padding: 11px 14px;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    font-size: 0.75rem;
                    font-weight: 300;
                    color: #92826b;
                    line-height: 1.6;
                }

                .sl-footer-note {
                    margin-top: 14px;
                    text-align: center;
                    font-size: 0.7rem;
                    font-weight: 300;
                    color: #b8a898;
                }

                /* ── Forgot Modal ── */
                .sl-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(26,18,8,0.55);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    animation: slModalFade 0.18s ease;
                }

                @keyframes slModalFade {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                .sl-modal {
                    width: 100%;
                    max-width: 400px;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                    animation: slModalSlide 0.2s ease;
                }

                @keyframes slModalSlide {
                    from { opacity: 0; transform: translateY(-12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .sl-modal-header {
                    background: #1a1208;
                    padding: 24px 28px 20px;
                    position: relative;
                    overflow: hidden;
                }

                .sl-modal-header::before {
                    content: '';
                    position: absolute;
                    bottom: -10px; right: -10px;
                    width: 80px; height: 80px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.12) 1.5px, transparent 1.5px);
                    background-size: 10px 10px;
                    pointer-events: none;
                }

                .sl-modal-header-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 6px;
                }

                .sl-modal-header-label::before {
                    content: '';
                    display: inline-block;
                    width: 12px; height: 1.5px;
                    background: #fcd34d;
                }

                .sl-modal-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #fef3c7;
                    position: relative;
                    z-index: 1;
                }

                .sl-modal-sub {
                    font-size: 0.75rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.4);
                    margin-top: 4px;
                    line-height: 1.6;
                    position: relative;
                    z-index: 1;
                }

                .sl-modal-body { padding: 24px 28px 28px; }

                .sl-modal-alert {
                    border-radius: 9px;
                    padding: 10px 13px;
                    font-size: 0.78rem;
                    font-weight: 300;
                    line-height: 1.6;
                    margin-bottom: 14px;
                    display: flex;
                    gap: 8px;
                    align-items: flex-start;
                }

                .sl-modal-alert-success {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                }

                .sl-modal-alert-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                }

                .sl-modal-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: 16px;
                }

                .sl-modal-cancel {
                    flex: 1;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 400;
                    color: #6b5e4b;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 10px;
                    padding: 11px;
                    cursor: pointer;
                    transition: background 0.18s;
                }

                .sl-modal-cancel:hover { background: #f0e8d8; }

                .sl-modal-send {
                    flex: 2;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    border: none;
                    border-radius: 10px;
                    padding: 11px;
                    cursor: pointer;
                    transition: background 0.18s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .sl-modal-send:hover:not(:disabled) { background: #2d1f0d; }
                .sl-modal-send:disabled { opacity: 0.6; cursor: not-allowed; }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .sl-root { grid-template-columns: 1fr; }
                    .sl-left { display: none; }
                    .sl-right { min-height: 100vh; padding: 32px 20px; }
                }
            `}</style>

            <div className="sl-root">

                {/* Left panel */}
                <div className="sl-left">
                    <div className="sl-left-glow" aria-hidden="true" />
                    <div className="sl-left-glow-2" aria-hidden="true" />
                    <div className="sl-left-dots" aria-hidden="true" />
                    <div className="sl-left-watermark" aria-hidden="true">SCA</div>

                    <div className="sl-left-top">
                        <div className="sl-left-badge">
                            <span className="sl-left-badge-dot" aria-hidden="true" />
                            Student Portal
                        </div>
                        <div className="sl-left-name">Shivshakti<br />Computer Academy</div>
                        <div className="sl-left-sub">Student Learning Portal</div>

                        <div className="sl-features">
                            {FEATURES.map((f) => (
                                <div key={f} className="sl-feature">
                                    <div className="sl-feature-check" aria-hidden="true">✓</div>
                                    <div className="sl-feature-text">{f}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sl-left-bottom">
                        <div className="sl-left-copy">© 2026 Shivshakti Computer Academy</div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="sl-right">
                    <div className="sl-card">
                        <div className="sl-card-header">
                            <div className="sl-card-eyebrow">Student Portal</div>
                            <div className="sl-card-title">Sign In</div>
                            <div className="sl-card-sub">Access your learning dashboard</div>
                        </div>

                        <div className="sl-card-body">
                            {error && (
                                <div className="sl-error" role="alert">
                                    <span aria-hidden="true">✕</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="sl-field">
                                    <label className="sl-label" htmlFor="sl-identifier">
                                        Email or Student ID
                                    </label>
                                    <input
                                        id="sl-identifier"
                                        type="text"
                                        required
                                        autoComplete="username"
                                        placeholder="Email or student ID"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="sl-input"
                                    />
                                </div>

                                <div className="sl-field">
                                    <label className="sl-label" htmlFor="sl-password">Password</label>
                                    <div className="sl-pw-wrap">
                                        <input
                                            id="sl-password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="sl-input"
                                            style={{ paddingRight: "54px" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="sl-pw-toggle"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <div className="sl-forgot">
                                        <button
                                            type="button"
                                            onClick={() => { setForgotMsg(null); setForgotEmail(""); setShowForgotModal(true); }}
                                            className="sl-forgot-btn"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="sl-submit">
                                    {loading ? "Signing in..." : <>Sign In <span aria-hidden="true">→</span></>}
                                </button>
                            </form>

                            <div className="sl-info-note">
                                <span aria-hidden="true">🎓</span>
                                <span>Use the credentials provided by the academy at the time of enrollment.</span>
                            </div>

                            <div className="sl-footer-note">
                                By signing in, you agree to our Terms &amp; Privacy Policy.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot password modal */}
            {showForgotModal && (
                <div
                    className="sl-modal-backdrop"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowForgotModal(false); }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Reset password"
                >
                    <div className="sl-modal">
                        <div className="sl-modal-header">
                            <div className="sl-modal-header-label">Account Recovery</div>
                            <div className="sl-modal-title">Reset Student Password</div>
                            <div className="sl-modal-sub">
                                Enter your registered email. A temporary password will be sent to you.
                            </div>
                        </div>

                        <div className="sl-modal-body">
                            {forgotMsg && (
                                <div className={`sl-modal-alert ${forgotMsg.type === "success" ? "sl-modal-alert-success" : "sl-modal-alert-error"}`} role="alert">
                                    <span aria-hidden="true">{forgotMsg.type === "success" ? "✓" : "✕"}</span>
                                    <span>{forgotMsg.text}</span>
                                </div>
                            )}

                            <div className="sl-field">
                                <label className="sl-label" htmlFor="sl-forgot-email">Registered Email</label>
                                <input
                                    id="sl-forgot-email"
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="sl-input"
                                    onKeyDown={(e) => e.key === "Enter" && handleForgotSubmit()}
                                />
                            </div>

                            <div className="sl-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className="sl-modal-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={forgotLoading}
                                    onClick={handleForgotSubmit}
                                    className="sl-modal-send"
                                >
                                    {forgotLoading ? "Sending..." : <>Send Reset Link <span aria-hidden="true">→</span></>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}