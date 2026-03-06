"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ResetPasswordPage() {

    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get("token"));
    }, []);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {

            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setMessage("Password updated successfully. Redirecting to login...");

            setTimeout(() => {
                router.push("/login");
            }, 1500);

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
                        Reset Your Password
                    </h2>

                    <p className="text-sm text-slate-500 mt-1 px-2">
                        Enter your new password below
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

                    {/* New Password */}

                    <div>

                        <label className="text-sm text-slate-600">
                            New Password
                        </label>

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-slate-500 hover:text-slate-700"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                    </div>

                    {/* Confirm Password */}

                    <div>

                        <label className="text-sm text-slate-600">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-slate-500 hover:text-slate-700"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-2.5 sm:py-3 rounded-md hover:bg-slate-800 transition disabled:opacity-50 text-sm sm:text-base"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>

                </form>

                {/* Back to Login */}

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