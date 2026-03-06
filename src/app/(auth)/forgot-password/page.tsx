"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {

            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setMessage(
                "If an account exists with this email, a password reset link has been sent."
            );

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 py-10">

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">

                {/* Header */}

                <div className="text-center mb-6 sm:mb-8">

                    <img
                        src="/logo.png"
                        alt="Shivshakti Computer Academy"
                        className="mx-auto h-12 sm:h-14 mb-3 sm:mb-4"
                    />

                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                        Forgot Password
                    </h2>

                    <p className="text-sm text-slate-500 mt-1 px-2">
                        Enter your registered email address to receive a reset link.
                    </p>

                </div>

                {/* Error */}

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {/* Success */}

                {message && (
                    <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md mb-4">
                        {message}
                    </div>
                )}

                {/* Form */}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                    <div>

                        <label className="text-sm text-slate-600">
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-slate-900 outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-2.5 sm:py-3 rounded-md hover:bg-slate-800 transition disabled:opacity-50 text-sm sm:text-base"
                    >
                        {loading ? "Sending Reset Link..." : "Send Reset Link"}
                    </button>

                </form>

                {/* Back to login */}

                <div className="text-center mt-5 sm:mt-6">

                    <button
                        onClick={() => router.push("/login")}
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                        Back to Login
                    </button>

                </div>

                {/* Footer */}

                <p className="text-xs text-slate-400 text-center mt-6">
                    Shivshakti Computer Academy © 2026
                </p>

            </div>

        </div>

    );
}