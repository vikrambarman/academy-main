"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FEATURES = [
    "Secure Admin Dashboard",
    "Two-Factor Authentication Protection",
    "Full Student & Course Management",
    "Payment & Certificate Tracking",
];

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ identifier: email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Login failed");

            if (data.requires2FA) { router.push(`/verify-otp?uid=${data.userId}`); return; }
            if (data.forceChangePassword) { router.push("/change-password?forced=true"); return; }

            if (data.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                setError("This login portal is restricted to administrators.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500&display=swap');

                .al-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: #faf8f4;
                }

                /* ── Left panel ── */
                .al-left {
                    background: #1a1208;
                    padding: 52px 52px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    min-height: 100vh;
                }

                /* Background elements */
                .al-left-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 360px; height: 360px;
                    background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 65%);
                    pointer-events: none;
                }

                .al-left-glow-2 {
                    position: absolute;
                    bottom: -60px; left: -60px;
                    width: 280px; height: 280px;
                    background: radial-gradient(circle, rgba(252,211,77,0.05) 0%, transparent 65%);
                    pointer-events: none;
                }

                .al-left-dots {
                    position: absolute;
                    bottom: 40px; right: 40px;
                    width: 140px; height: 140px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.1) 1.5px, transparent 1.5px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                /* Ghost watermark */
                .al-left-watermark {
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

                .al-left-top {
                    position: relative;
                    z-index: 1;
                }

                .al-left-badge {
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

                .al-left-badge-dot {
                    width: 5px; height: 5px;
                    background: #92540a;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .al-left-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                    margin-bottom: 6px;
                }

                .al-left-sub {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.4);
                    letter-spacing: 0.06em;
                    margin-bottom: 40px;
                }

                /* Feature list */
                .al-features {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    border: 1px solid rgba(252,211,77,0.08);
                    border-radius: 16px;
                    overflow: hidden;
                }

                .al-feature {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px;
                    border-bottom: 1px solid rgba(252,211,77,0.06);
                    transition: background 0.18s;
                    position: relative;
                }

                .al-feature:last-child { border-bottom: none; }

                .al-feature::before {
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

                .al-feature:hover { background: rgba(252,211,77,0.04); }
                .al-feature:hover::before { transform: scaleY(1); }

                .al-feature-check {
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

                .al-feature-text {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.55);
                    line-height: 1.4;
                }

                .al-left-bottom {
                    position: relative;
                    z-index: 1;
                }

                .al-left-copy {
                    font-size: 0.7rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.2);
                    letter-spacing: 0.04em;
                }

                /* ── Right panel ── */
                .al-right {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    background: #faf8f4;
                }

                .al-card {
                    width: 100%;
                    max-width: 420px;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                }

                /* Card header */
                .al-card-header {
                    padding: 28px 32px 24px;
                    border-bottom: 1px solid #f5efe4;
                    text-align: center;
                }

                .al-card-eyebrow {
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

                .al-card-eyebrow::before,
                .al-card-eyebrow::after {
                    content: '';
                    display: inline-block;
                    width: 18px; height: 1px;
                    background: #d97706;
                }

                .al-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .al-card-sub {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: #92826b;
                    margin-top: 5px;
                }

                /* Card body */
                .al-card-body {
                    padding: 28px 32px 32px;
                }

                /* Error */
                .al-error {
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

                /* Field */
                .al-field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 14px;
                }

                .al-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92826b;
                }

                .al-input {
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

                .al-input::placeholder { color: #b8a898; }

                .al-input:focus {
                    border-color: #d97706;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(217,119,6,0.08);
                }

                /* Password wrap */
                .al-pw-wrap { position: relative; }

                .al-pw-toggle {
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

                .al-pw-toggle:hover { color: #b45309; }

                /* Forgot */
                .al-forgot {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 6px;
                }

                .al-forgot-btn {
                    font-size: 0.75rem;
                    font-weight: 400;
                    color: #92826b;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    transition: color 0.16s;
                }

                .al-forgot-btn:hover { color: #b45309; }

                /* Submit */
                .al-submit {
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

                .al-submit:hover:not(:disabled) {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                .al-submit:disabled { opacity: 0.6; cursor: not-allowed; }

                /* Security note */
                .al-security {
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

                .al-security-icon {
                    font-size: 0.8rem;
                    flex-shrink: 0;
                    margin-top: 1px;
                }

                .al-footer-note {
                    margin-top: 14px;
                    text-align: center;
                    font-size: 0.7rem;
                    font-weight: 300;
                    color: #b8a898;
                }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .al-root { grid-template-columns: 1fr; }
                    .al-left { display: none; }
                    .al-right { min-height: 100vh; padding: 32px 20px; }
                }
            `}</style>

            <div className="al-root">

                {/* Left panel */}
                <div className="al-left">
                    <div className="al-left-glow" aria-hidden="true" />
                    <div className="al-left-glow-2" aria-hidden="true" />
                    <div className="al-left-dots" aria-hidden="true" />
                    <div className="al-left-watermark" aria-hidden="true">SCA</div>

                    <div className="al-left-top">
                        <div className="al-left-badge">
                            <span className="al-left-badge-dot" aria-hidden="true" />
                            Admin Access Only
                        </div>
                        <div className="al-left-name">Shivshakti<br />Computer Academy</div>
                        <div className="al-left-sub">Academy Management System</div>

                        <div className="al-features">
                            {FEATURES.map((f) => (
                                <div key={f} className="al-feature">
                                    <div className="al-feature-check" aria-hidden="true">✓</div>
                                    <div className="al-feature-text">{f}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="al-left-bottom">
                        <div className="al-left-copy">© 2026 Shivshakti Computer Academy</div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="al-right">
                    <div className="al-card">

                        <div className="al-card-header">
                            <div className="al-card-eyebrow">Admin Portal</div>
                            <div className="al-card-title">Sign In</div>
                            <div className="al-card-sub">Manage academy operations securely</div>
                        </div>

                        <div className="al-card-body">
                            {error && (
                                <div className="al-error" role="alert">
                                    <span aria-hidden="true">✕</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="al-field">
                                    <label className="al-label" htmlFor="al-email">Admin Email</label>
                                    <input
                                        id="al-email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="al-input"
                                    />
                                </div>

                                <div className="al-field">
                                    <label className="al-label" htmlFor="al-password">Password</label>
                                    <div className="al-pw-wrap">
                                        <input
                                            id="al-password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="al-input"
                                            style={{ paddingRight: "54px" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="al-pw-toggle"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <div className="al-forgot">
                                        <button
                                            type="button"
                                            onClick={() => router.push("/forgot-password")}
                                            className="al-forgot-btn"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="al-submit"
                                >
                                    {loading
                                        ? "Signing in..."
                                        : <>Sign In <span aria-hidden="true">→</span></>
                                    }
                                </button>
                            </form>

                            <div className="al-security">
                                <span className="al-security-icon" aria-hidden="true">🔐</span>
                                <span>Admin accounts require OTP verification after login. Authorized administrators only.</span>
                            </div>

                            <div className="al-footer-note">
                                Unauthorized access attempts are logged and monitored.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}