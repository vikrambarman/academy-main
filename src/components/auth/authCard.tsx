// ============================================================
// Shared AuthCard component + global auth styles
// Put this in: components/auth/AuthCard.tsx
// Import in each page, or inline per page if preferred
// ============================================================
import Image from "next/image";

interface AuthCardProps {
    eyebrow: string;
    title: string;
    sub: string;
    children: React.ReactNode;
}

export function AuthCard({ eyebrow, title, sub, children }: AuthCardProps) {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500&display=swap');

                .auth-root {
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

                .auth-bg-glow-1 {
                    position: fixed;
                    top: -100px; right: -100px;
                    width: 440px; height: 440px;
                    background: radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                .auth-bg-glow-2 {
                    position: fixed;
                    bottom: -80px; left: -80px;
                    width: 360px; height: 360px;
                    background: radial-gradient(circle, rgba(252,211,77,0.05) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                .auth-card {
                    width: 100%;
                    max-width: 420px;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .auth-card-header {
                    background: #1a1208;
                    padding: 32px 32px 28px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .auth-card-header::before {
                    content: '';
                    position: absolute;
                    bottom: -12px; right: -12px;
                    width: 100px; height: 100px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.1) 1.5px, transparent 1.5px);
                    background-size: 11px 11px;
                    pointer-events: none;
                }

                .auth-logo-wrap {
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

                .auth-eyebrow {
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

                .auth-eyebrow::before,
                .auth-eyebrow::after {
                    content: '';
                    display: inline-block;
                    width: 16px; height: 1px;
                    background: rgba(252,211,77,0.4);
                }

                .auth-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                    position: relative;
                    z-index: 1;
                }

                .auth-sub {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.4);
                    margin-top: 5px;
                    line-height: 1.6;
                    position: relative;
                    z-index: 1;
                }

                /* Body */
                .auth-card-body { padding: 28px 32px 32px; }

                /* Alert */
                .auth-alert {
                    border-radius: 10px;
                    padding: 12px 14px;
                    font-size: 0.8rem;
                    font-weight: 300;
                    line-height: 1.65;
                    margin-bottom: 18px;
                    display: flex;
                    gap: 9px;
                    align-items: flex-start;
                }

                .auth-alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
                .auth-alert-error   { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

                /* Field */
                .auth-field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 14px;
                }

                .auth-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92826b;
                }

                .auth-input {
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

                .auth-input::placeholder { color: #b8a898; }
                .auth-input:focus { border-color: #d97706; background: #fff; box-shadow: 0 0 0 3px rgba(217,119,6,0.08); }

                .auth-pw-wrap { position: relative; }

                .auth-pw-toggle {
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

                .auth-pw-toggle:hover { color: #b45309; }

                /* Submit */
                .auth-submit {
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
                    margin-top: 6px;
                }

                .auth-submit:hover:not(:disabled) { background: #2d1f0d; transform: translateY(-1px); }
                .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

                /* Divider + back */
                .auth-divider { height: 1px; background: #f0e8d8; margin: 20px 0; }

                .auth-back {
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

                .auth-back:hover { background: #f0e8d8; border-color: #d97706; color: #1a1208; }

                /* Footer */
                .auth-footer { margin-top: 18px; text-align: center; font-size: 0.68rem; font-weight: 300; color: #b8a898; }

                /* ── OTP ── */
                .otp-row {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 4px;
                }

                .otp-box {
                    width: 46px; height: 52px;
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #1a1208;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 12px;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    caret-color: #d97706;
                }

                .otp-box:focus { border-color: #d97706; background: #fff; box-shadow: 0 0 0 3px rgba(217,119,6,0.08); }
                .otp-box.otp-box-filled { border-color: #d97706; background: #fffbeb; }

                .otp-timer-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 20px;
                    font-size: 0.78rem;
                }

                .otp-timer-label { font-weight: 300; color: #92826b; }

                .otp-timer-count {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    color: #1a1208;
                    font-size: 0.88rem;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    padding: 2px 10px;
                    border-radius: 100px;
                    min-width: 48px;
                    text-align: center;
                }

                .otp-timer-urgent { color: #dc2626; border-color: #fca5a5; background: #fef2f2; }

                @media (max-width: 480px) {
                    .auth-card-header { padding: 24px 24px 20px; }
                    .auth-card-body { padding: 22px 22px 28px; }
                    .otp-box { width: 40px; height: 46px; font-size: 1.1rem; }
                    .otp-row { gap: 7px; }
                }
            `}</style>

            <main className="auth-root">
                <div className="auth-bg-glow-1" aria-hidden="true" />
                <div className="auth-bg-glow-2" aria-hidden="true" />

                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-logo-wrap">
                            <Image src="/logo.png" alt="Shivshakti Computer Academy" width={36} height={36} className="object-contain" />
                        </div>
                        <div className="auth-eyebrow">{eyebrow}</div>
                        <div className="auth-title">{title}</div>
                        <div className="auth-sub">{sub}</div>
                    </div>

                    <div className="auth-card-body">
                        {children}
                        <div className="auth-footer">Shivshakti Computer Academy © 2026</div>
                    </div>
                </div>
            </main>
        </>
    );
}