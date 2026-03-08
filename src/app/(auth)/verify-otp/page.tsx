// ============================================================
// verify-otp/page.tsx
// ============================================================
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/authCard";

export default function VerifyOTPPage() {
    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const uid = params.get("uid");
        if (!uid) { router.push("/login"); return; }
        setUserId(uid);
        setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    const formatTime = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
        if (updated.join("").length === 6) verifyOTP(updated.join(""));
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) inputsRef.current[index - 1]?.focus();
        if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (paste.length !== 6) return;
        const arr = paste.split("");
        setOtp(arr);
        verifyOTP(arr.join(""));
    };

    const verifyOTP = async (code: string) => {
        if (!userId) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId, otp: code }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            router.push("/dashboard/admin");
        } catch (err: any) {
            setError(err.message);
            setOtp(["", "", "", "", "", ""]);
            inputsRef.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!userId) return;
        await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ resend: true, userId }),
        });
        setTimeLeft(300);
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
    };

    return (
        <AuthCard eyebrow="Two-Factor Auth" title="Verify Login" sub="Enter the 6-digit code sent to your registered email.">
            {error && (
                <div className="auth-alert auth-alert-error" role="alert">
                    <span aria-hidden="true">✕</span>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); verifyOTP(otp.join("")); }}>
                <div className="otp-row" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputsRef.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className={`otp-box ${digit ? "otp-box-filled" : ""}`}
                            aria-label={`OTP digit ${index + 1}`}
                        />
                    ))}
                </div>

                <button type="submit" disabled={loading || otp.join("").length < 6} className="auth-submit" style={{ marginTop: "24px" }}>
                    {loading ? "Verifying…" : <>Verify &amp; Continue <span aria-hidden="true">→</span></>}
                </button>
            </form>

            <div className="otp-timer-row">
                <span className="otp-timer-label">Code expires in</span>
                <span className={`otp-timer-count ${timeLeft <= 60 ? "otp-timer-urgent" : ""}`}>{formatTime()}</span>
            </div>

            {timeLeft <= 0 && (
                <button type="button" onClick={handleResend} className="auth-back" style={{ marginTop: 8 }}>
                    Resend Code
                </button>
            )}
        </AuthCard>
    );
}