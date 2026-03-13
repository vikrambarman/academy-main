"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AuthCard, AuthField, AuthLabel, AuthInput, AuthPwToggle,
    AuthAlert, AuthSubmit, AuthDivider, AuthBack,
} from "@/components/auth/authCard";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [token,    setToken]    = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirm,  setConfirm]  = useState("");
    const [showPw,   setShowPw]   = useState(false);
    const [showCf,   setShowCf]   = useState(false);
    const [loading,  setLoading]  = useState(false);
    const [status,   setStatus]   = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get("token"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token)             { setStatus({ type: "error", text: "Invalid or missing reset token." }); return; }
        if (password !== confirm) { setStatus({ type: "error", text: "Passwords do not match." });        return; }
        setLoading(true);
        setStatus(null);
        try {
            const res  = await fetch("/api/auth/reset-password", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ token, newPassword: password }),
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
        <AuthCard
            eyebrow="Account Recovery"
            title="Reset Password"
            sub="Enter your new password below.">

            {status && <AuthAlert type={status.type}>{status.text}</AuthAlert>}

            <form onSubmit={handleSubmit}>
                <AuthField>
                    <AuthLabel htmlFor="rp-new">New Password</AuthLabel>
                    <div className="relative">
                        <AuthInput
                            id="rp-new"
                            type={showPw ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            placeholder="Choose a strong password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ paddingRight: 56 }}
                        />
                        <AuthPwToggle show={showPw} onToggle={() => setShowPw(p => !p)} />
                    </div>
                </AuthField>

                <AuthField>
                    <AuthLabel htmlFor="rp-confirm">Confirm Password</AuthLabel>
                    <div className="relative">
                        <AuthInput
                            id="rp-confirm"
                            type={showCf ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            placeholder="Re-enter new password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            style={{ paddingRight: 56 }}
                        />
                        <AuthPwToggle show={showCf} onToggle={() => setShowCf(p => !p)} />
                    </div>
                </AuthField>

                <AuthSubmit
                    loading={loading}
                    loadingLabel="Updating…"
                    label={<>Update Password <span aria-hidden>→</span></>}
                />
            </form>

            <AuthDivider />
            <AuthBack onClick={() => router.push("/login")}>
                <span aria-hidden>←</span> Back to Login
            </AuthBack>
        </AuthCard>
    );
}