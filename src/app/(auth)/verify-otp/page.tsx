"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, AuthAlert, AuthSubmit, AuthBack } from "@/components/auth/authCard";

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
        const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
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

    const urgent = timeLeft <= 60 && timeLeft > 0;

    return (
        <>
            <style>{`
                @keyframes otp-shake {
                    0%,100% { transform:translateX(0); }
                    20%     { transform:translateX(-5px); }
                    40%     { transform:translateX(5px); }
                    60%     { transform:translateX(-3px); }
                    80%     { transform:translateX(3px); }
                }
                @keyframes otp-urgent-pulse {
                    0%,100% { opacity:1; }
                    50%     { opacity:.5; }
                }
                .otp-shake  { animation: otp-shake .35s ease; }
                .otp-urgent { animation: otp-urgent-pulse 1s ease-in-out infinite; }
            `}</style>

            <AuthCard
                eyebrow="Two-Factor Auth"
                title="Verify Login"
                sub="Enter the 6-digit code sent to your registered email."
                maxWidth={440}>

                {error && <AuthAlert type="error">{error}</AuthAlert>}

                <form onSubmit={e => { e.preventDefault(); verifyOTP(otp.join("")); }}>

                    {/* OTP boxes */}
                    <div className="flex gap-2.5 justify-center mb-2" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => { inputsRef.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(e.target.value, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                aria-label={`OTP digit ${index + 1}`}
                                className={`text-center text-[1.2rem] font-semibold outline-none rounded-[12px] transition-all duration-200 ${error ? "otp-shake" : ""}`}
                                style={{
                                    width: 52,
                                    height: 58,
                                    fontFamily: "'DM Sans', sans-serif",
                                    background: digit ? "color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))" : "var(--color-bg)",
                                    border: digit
                                        ? "2px solid var(--color-primary)"
                                        : "1px solid var(--color-border)",
                                    color: "var(--color-text)",
                                    boxShadow: digit ? "0 0 0 3px color-mix(in srgb,var(--color-primary) 10%,transparent)" : "none",
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = "var(--color-primary)";
                                    e.currentTarget.style.borderWidth = "2px";
                                    e.currentTarget.style.boxShadow = "0 0 0 3px color-mix(in srgb,var(--color-primary) 12%,transparent)";
                                }}
                                onBlur={e => {
                                    if (!digit) {
                                        e.currentTarget.style.borderColor = "var(--color-border)";
                                        e.currentTarget.style.borderWidth = "1px";
                                        e.currentTarget.style.boxShadow = "none";
                                    }
                                }}
                            />
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="flex items-center justify-center gap-2 my-4">
                        <span className="text-[0.74rem] font-light" style={{ color: "var(--color-text-muted)" }}>
                            Code expires in
                        </span>
                        <span className={`text-[0.84rem] font-semibold tabular-nums ${urgent ? "otp-urgent" : ""}`}
                            style={{ color: urgent ? "var(--color-error)" : "var(--color-primary)" }}>
                            {timeLeft > 0 ? formatTime() : "Expired"}
                        </span>
                    </div>

                    <AuthSubmit
                        loading={loading}
                        loadingLabel="Verifying…"
                        label={<>Verify &amp; Continue <span aria-hidden>→</span></>}
                    />
                </form>

                {/* Resend */}
                {timeLeft <= 0 && (
                    <div className="mt-4">
                        <AuthBack onClick={handleResend}>
                            Resend Code
                        </AuthBack>
                    </div>
                )}

                {/* Help note */}
                <p className="mt-4 text-center text-[0.73rem] font-light leading-[1.6]"
                    style={{ color: "color-mix(in srgb,var(--color-text-muted) 65%,transparent)" }}>
                    Check your spam folder if you don't receive the code within a minute.
                </p>
            </AuthCard>
        </>
    );
}