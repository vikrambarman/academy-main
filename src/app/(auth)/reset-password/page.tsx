// ============================================================
// reset-password/page.tsx
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/authCard";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showCf, setShowCf] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get("token"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) { setStatus({ type: "error", text: "Invalid or missing reset token." }); return; }
        if (password !== confirm) { setStatus({ type: "error", text: "Passwords do not match." }); return; }
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setStatus({ type: "success", text: "Password updated successfully. Redirecting to login…" });
            setTimeout(() => router.push("/login"), 1600);
        } catch (err: any) {
            setStatus({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard eyebrow="Account Recovery" title="Reset Password" sub="Enter your new password below.">
            {status && (
                <div className={`auth-alert ${status.type === "success" ? "auth-alert-success" : "auth-alert-error"}`} role="alert">
                    <span aria-hidden="true">{status.type === "success" ? "✓" : "✕"}</span>
                    <span>{status.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="auth-field">
                    <label className="auth-label" htmlFor="rp-new">New Password</label>
                    <div className="auth-pw-wrap">
                        <input
                            id="rp-new"
                            type={showPw ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            placeholder="Choose a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input"
                            style={{ paddingRight: "54px" }}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="auth-pw-toggle">{showPw ? "Hide" : "Show"}</button>
                    </div>
                </div>

                <div className="auth-field">
                    <label className="auth-label" htmlFor="rp-confirm">Confirm Password</label>
                    <div className="auth-pw-wrap">
                        <input
                            id="rp-confirm"
                            type={showCf ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            placeholder="Re-enter new password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="auth-input"
                            style={{ paddingRight: "54px" }}
                        />
                        <button type="button" onClick={() => setShowCf(!showCf)} className="auth-pw-toggle">{showCf ? "Hide" : "Show"}</button>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="auth-submit">
                    {loading ? "Updating…" : <>Update Password <span aria-hidden="true">→</span></>}
                </button>
            </form>

            <div className="auth-divider" aria-hidden="true" />
            <button type="button" onClick={() => router.push("/login")} className="auth-back">
                <span aria-hidden="true">←</span> Back to Login
            </button>
        </AuthCard>
    );
}