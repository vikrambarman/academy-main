"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AuthCard, AuthField, AuthLabel, AuthInput,
    AuthAlert, AuthSubmit, AuthDivider, AuthBack,
} from "@/components/auth/authCard";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email,   setEmail]   = useState("");
    const [loading, setLoading] = useState(false);
    const [status,  setStatus]  = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const res  = await fetch("/api/auth/forgot-password", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ email }),
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
        <AuthCard
            eyebrow="Account Recovery"
            title="Forgot Password"
            sub="Enter your registered email to receive a reset link.">

            {status && <AuthAlert type={status.type}>{status.text}</AuthAlert>}

            <form onSubmit={handleSubmit}>
                <AuthField>
                    <AuthLabel htmlFor="fp-email">Email Address</AuthLabel>
                    <AuthInput
                        id="fp-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </AuthField>

                <AuthSubmit
                    loading={loading}
                    loadingLabel="Sending…"
                    label={<>Send Reset Link <span aria-hidden>→</span></>}
                />
            </form>

            <AuthDivider />

            <AuthBack onClick={() => router.back()}>
                <span aria-hidden>←</span> Back to Login
            </AuthBack>

            <p className="mt-4 text-center text-[0.68rem] font-light"
                style={{ color: "color-mix(in srgb,var(--color-text-muted) 55%,transparent)" }}>
                Shivshakti Computer Academy © 2026
            </p>
        </AuthCard>
    );
}