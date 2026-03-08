"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500&display=swap');

                .fp-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #faf8f4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    position: relative;
                    overflow: hidden;
                }

                /* Background glows */
                .fp-glow-1 {
                    position: fixed;
                    top: -100px; right: -100px;
                    width: 440px; height: 440px;
                    background: radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 65%);
                    pointer-events: none;
                }

                .fp-glow-2 {
                    position: fixed;
                    bottom: -80px; left: -80px;
                    width: 360px; height: 360px;
                    background: radial-gradient(circle, rgba(252,211,77,0.05) 0%, transparent 65%);
                    pointer-events: none;
                }

                /* Card */
                .fp-card {
                    width: 100%;
                    max-width: 420px;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                }

                /* Card header */
                .fp-card-header {
                    background: #1a1208;
                    padding: 32px 32px 28px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .fp-card-header::before {
                    content: '';
                    position: absolute;
                    bottom: -12px; right: -12px;
                    width: 100px; height: 100px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.1) 1.5px, transparent 1.5px);
                    background-size: 11px 11px;
                    pointer-events: none;
                }

                .fp-logo-wrap {
                    width: 52px; height: 52px;
                    background: rgba(252,211,77,0.1);
                    border: 1px solid rgba(252,211,77,0.2);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    position: relative;
                    z-index: 1;
                    overflow: hidden;
                }

                .fp-card-eyebrow {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    position: relative;
                    z-index: 1;
                }

                .fp-card-eyebrow::before,
                .fp-card-eyebrow::after {
                    content: '';
                    display: inline-block;
                    width: 16px; height: 1px;
                    background: rgba(252,211,77,0.4);
                }

                .fp-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                    position: relative;
                    z-index: 1;
                }

                .fp-card-sub {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.4);
                    margin-top: 5px;
                    line-height: 1.6;
                    position: relative;
                    z-index: 1;
                }

                /* Card body */
                .fp-card-body { padding: 28px 32px 32px; }

                /* Alert */
                .fp-alert {
                    border-radius: 10px;
                    padding: 12px 15px;
                    font-size: 0.8rem;
                    font-weight: 300;
                    line-height: 1.65;
                    margin-bottom: 18px;
                    display: flex;
                    gap: 9px;
                    align-items: flex-start;
                }

                .fp-alert-success {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                }

                .fp-alert-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                }

                /* Field */
                .fp-field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 16px;
                }

                .fp-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92826b;
                }

                .fp-input {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 300;
                    color: #1a1208;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 11px;
                    padding: 12px 14px;
                    outline: none;
                    width: 100%;
                    box-sizing: border-box;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                }

                .fp-input::placeholder { color: #b8a898; }

                .fp-input:focus {
                    border-color: #d97706;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(217,119,6,0.08);
                }

                /* Submit */
                .fp-submit {
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
                    transition: background 0.2s, transform 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .fp-submit:hover:not(:disabled) {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                .fp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

                /* Divider */
                .fp-divider {
                    height: 1px;
                    background: #f0e8d8;
                    margin: 20px 0;
                }

                /* Back button */
                .fp-back {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    width: 100%;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 400;
                    color: #6b5e4b;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 10px;
                    padding: 10px;
                    cursor: pointer;
                    transition: background 0.18s, color 0.18s, border-color 0.18s;
                }

                .fp-back:hover {
                    background: #f0e8d8;
                    border-color: #d97706;
                    color: #1a1208;
                }

                .fp-footer {
                    margin-top: 18px;
                    text-align: center;
                    font-size: 0.68rem;
                    font-weight: 300;
                    color: #b8a898;
                }
            `}</style>

            <main className="fp-root">
                <div className="fp-glow-1" aria-hidden="true" />
                <div className="fp-glow-2" aria-hidden="true" />

                <div className="fp-card">

                    {/* Header */}
                    <div className="fp-card-header">
                        <div className="fp-logo-wrap">
                            <Image
                                src="/logo.png"
                                alt="Shivshakti Computer Academy"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </div>
                        <div className="fp-card-eyebrow">Account Recovery</div>
                        <div className="fp-card-title">Forgot Password</div>
                        <div className="fp-card-sub">
                            Enter your registered email to receive a reset link.
                        </div>
                    </div>

                    {/* Body */}
                    <div className="fp-card-body">
                        {status && (
                            <div
                                className={`fp-alert ${status.type === "success" ? "fp-alert-success" : "fp-alert-error"}`}
                                role="alert"
                            >
                                <span aria-hidden="true">
                                    {status.type === "success" ? "✓" : "✕"}
                                </span>
                                <span>{status.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="fp-field">
                                <label className="fp-label" htmlFor="fp-email">
                                    Email Address
                                </label>
                                <input
                                    id="fp-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="fp-input"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="fp-submit"
                            >
                                {loading
                                    ? "Sending..."
                                    : <>Send Reset Link <span aria-hidden="true">→</span></>
                                }
                            </button>
                        </form>

                        <div className="fp-divider" aria-hidden="true" />

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="fp-back"
                        >
                            <span aria-hidden="true">←</span>
                            Back to Login
                        </button>

                        <div className="fp-footer">
                            Shivshakti Computer Academy © 2026
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}