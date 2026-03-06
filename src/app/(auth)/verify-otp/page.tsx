"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VerifyOTPPage() {

    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    /* ================= LOAD USER ================= */

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        const uid = params.get("uid");

        if (!uid) {
            router.push("/login");
            return;
        }

        setUserId(uid);

        setTimeout(() => {
            inputsRef.current[0]?.focus();
        }, 100);

    }, []);

    /* ================= TIMER ================= */

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

    /* ================= INPUT CHANGE ================= */

    const handleChange = (value: string, index: number) => {

        if (!/^\d?$/.test(value)) return;

        const updated = [...otp];
        updated[index] = value;

        setOtp(updated);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

        const joined = updated.join("");

        if (joined.length === 6) {
            verifyOTP(joined);
        }

    };

    /* ================= KEY NAVIGATION ================= */

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {

        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

    };

    /* ================= PASTE SUPPORT ================= */

    const handlePaste = (e: React.ClipboardEvent) => {

        const paste = e.clipboardData.getData("text").slice(0, 6);

        if (!/^\d+$/.test(paste)) return;

        const arr = paste.split("");
        const updated = [...otp];

        arr.forEach((n, i) => {
            updated[i] = n;
        });

        setOtp(updated);

        if (arr.length === 6) {
            verifyOTP(arr.join(""));
        }

    };

    /* ================= VERIFY ================= */

    const verifyOTP = async (code: string) => {

        if (!userId) return;

        setLoading(true);
        setError("");

        try {

            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    userId,
                    otp: code
                }),
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        verifyOTP(otp.join(""));
    };

    /* ================= RESEND ================= */

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

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">

                {/* Header */}

                <div className="text-center mb-8">

                    <Image
                        src="/logo.png"
                        alt="Shivshakti Computer Academy"
                        width={56}
                        height={56}
                        className="mx-auto mb-4"
                    />

                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Verify Your Login
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        Enter the 6-digit verification code sent to your email
                    </p>

                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                {/* OTP */}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div
                        className="flex justify-center gap-2 sm:gap-3"
                        onPaste={handlePaste}
                    >

                        {otp.map((digit, index) => (

                            <input
                                key={index}
                                ref={(el) => {
                                    inputsRef.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="
                w-10 h-10
                sm:w-12 sm:h-12
                text-center
                text-lg
                font-semibold
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-black
                transition
                "
                            />

                        ))}

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify & Continue"}
                    </button>

                </form>

                {/* Timer */}

                <div className="text-center mt-6">

                    <p className="text-sm text-gray-500">
                        Code expires in <span className="font-medium">{formatTime()}</span>
                    </p>

                    {timeLeft <= 0 && (
                        <button
                            onClick={handleResend}
                            className="mt-3 text-sm font-medium text-black hover:underline"
                        >
                            Resend Code
                        </button>
                    )}

                </div>

                <p className="text-xs text-gray-400 text-center mt-8">
                    Shivshakti Computer Academy © 2026
                </p>

            </div>

        </div>

    );

}