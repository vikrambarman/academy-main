"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyOTPPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get("uid");

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 min

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // Redirect if no UID
    useEffect(() => {
        if (!userId) router.push("/login");
    }, [userId]);

    // Countdown Timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = () => {
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasteData)) return;

        const newOtp = pasteData.split("");
        setOtp(newOtp);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    userId,
                    otp: otp.join(""),
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            router.push("/dashboard/admin");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ resend: true, userId }),
        });
        setTimeLeft(300);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">

                <div className="text-center mb-6">
                    <img
                        src="/logo.png"
                        alt="Shivshakti Computer Academy"
                        className="mx-auto h-14 mb-4"
                    />
                    <h2 className="text-xl font-semibold text-slate-900">
                        Two-Factor Authentication
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">

                    <div
                        className="flex justify-between gap-2"
                        onPaste={handlePaste}
                    >
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputsRef.current[index] = el;
                                }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleChange(e.target.value, index)
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                                className="w-12 h-12 text-center text-lg border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-md hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify & Continue"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-500">
                        Code expires in {formatTime()}
                    </p>

                    {timeLeft <= 0 && (
                        <button
                            onClick={handleResend}
                            className="mt-3 text-sm text-slate-900 font-medium hover:underline"
                        >
                            Resend Code
                        </button>
                    )}
                </div>

                <p className="text-xs text-slate-400 text-center mt-6">
                    Shivshakti Computer Academy © 2026
                </p>
            </div>
        </div>
    );
}