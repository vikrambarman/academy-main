"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    AuthCard, AuthField, AuthLabel, AuthInput, AuthPwToggle,
    AuthAlert, AuthSubmit, AuthDivider, AuthBack,
} from "@/components/auth/authCard";

function ChangePasswordInner() {
    const searchParams = useSearchParams();
    const router  = useRouter();
    const forced  = searchParams.get("forced") === "true";

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOld,     setShowOld]     = useState(false);
    const [showNew,     setShowNew]     = useState(false);
    const [loading,     setLoading]     = useState(false);
    const [status,      setStatus]      = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const res  = await fetch("/api/auth/change-password", {
                method:      "POST",
                headers:     { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    oldPassword: forced ? undefined : oldPassword,
                    newPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            if (forced) {
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
                : "Update your account password securely."
            }>

            {status && <AuthAlert type={status.type}>{status.text}</AuthAlert>}

            <form onSubmit={handleSubmit}>
                {!forced && (
                    <AuthField>
                        <AuthLabel htmlFor="cp-old">Current Password</AuthLabel>
                        <div className="relative">
                            <AuthInput
                                id="cp-old"
                                type={showOld ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                placeholder="Your current password"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                                style={{ paddingRight: 56 }}
                            />
                            <AuthPwToggle show={showOld} onToggle={() => setShowOld(p => !p)} />
                        </div>
                    </AuthField>
                )}

                <AuthField>
                    <AuthLabel htmlFor="cp-new">New Password</AuthLabel>
                    <div className="relative">
                        <AuthInput
                            id="cp-new"
                            type={showNew ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            placeholder="Choose a strong password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            style={{ paddingRight: 56 }}
                        />
                        <AuthPwToggle show={showNew} onToggle={() => setShowNew(p => !p)} />
                    </div>
                </AuthField>

                <AuthSubmit
                    loading={loading}
                    loadingLabel="Updating…"
                    label={<>{forced ? "Set Password" : "Update Password"} <span aria-hidden>→</span></>}
                />
            </form>

            {!forced && (
                <>
                    <AuthDivider />
                    <AuthBack onClick={() => router.back()}>
                        <span aria-hidden>←</span> Back to Dashboard
                    </AuthBack>
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
        <div className="min-h-screen flex items-center justify-center"
            style={{ background: "var(--color-bg)" }}>
            <div className="w-full max-w-[420px] rounded-[22px]" style={{ minHeight: 320, background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }} />
        </div>
    );
}