// src/app/change-password/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/authCard";

function ChangePasswordInner() {
    const searchParams = useSearchParams();
    const router  = useRouter();
    const forced  = searchParams.get("forced") === "true";

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status,  setStatus]  = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch("/api/auth/change-password", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    oldPassword: forced ? undefined : oldPassword,
                    newPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            if (forced) {
                // ✅ Role ke hisaab se redirect — API response mein role aana chahiye
                const role = data.role as string | undefined;
                if      (role === "admin")   router.push("/dashboard/admin");
                else if (role === "teacher") router.push("/dashboard/teacher");
                else                         router.push("/dashboard/student");
            } else {
                setStatus({ type: "success", text: "Password changed successfully." });
                setOldPassword("");
                setNewPassword("");
            }
        } catch (err: any) {
            setStatus({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            eyebrow={forced ? "Security Required" : "Account Settings"}
            title={forced ? "Set New Password" : "Change Password"}
            sub={forced
                ? "For security reasons, you must set a new password before continuing."
                : "Update your account password securely."}
        >
            {status && (
                <div className={`auth-alert ${status.type === "success" ? "auth-alert-success" : "auth-alert-error"}`} role="alert">
                    <span aria-hidden="true">{status.type === "success" ? "✓" : "✕"}</span>
                    <span>{status.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {!forced && (
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="cp-old">Current Password</label>
                        <div className="auth-pw-wrap">
                            <input
                                id="cp-old"
                                type={showOld ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                placeholder="Your current password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="auth-input"
                                style={{ paddingRight: "54px" }}
                            />
                            <button type="button" onClick={() => setShowOld(!showOld)} className="auth-pw-toggle" aria-label={showOld ? "Hide" : "Show"}>
                                {showOld ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="auth-field">
                    <label className="auth-label" htmlFor="cp-new">New Password</label>
                    <div className="auth-pw-wrap">
                        <input
                            id="cp-new"
                            type={showNew ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            placeholder="Choose a strong password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="auth-input"
                            style={{ paddingRight: "54px" }}
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="auth-pw-toggle" aria-label={showNew ? "Hide" : "Show"}>
                            {showNew ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="auth-submit">
                    {loading ? "Updating..." : <>{forced ? "Set Password" : "Update Password"} <span aria-hidden="true">→</span></>}
                </button>
            </form>

            {!forced && (
                <>
                    <div className="auth-divider" aria-hidden="true" />
                    <button type="button" onClick={() => router.back()} className="auth-back">
                        <span aria-hidden="true">←</span> Back to Dashboard
                    </button>
                </>
            )}
        </AuthCard>
    );
}

export default function ChangePasswordPage() {
    return (
        <Suspense fallback={<AuthPageShell />}>
            <ChangePasswordInner />
        </Suspense>
    );
}

function AuthPageShell() {
    return (
        <div className="auth-root">
            <div className="auth-card" style={{ minHeight: 320 }} />
        </div>
    );
}