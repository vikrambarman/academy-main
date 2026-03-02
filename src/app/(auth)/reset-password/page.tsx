"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">

                <div className="text-center mb-8">
                    <img
                        src="/logo.png"
                        alt="Shivshakti Computer Academy"
                        className="mx-auto h-14 mb-4"
                    />
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Reset Your Password
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Enter your new password below
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md mb-4">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* New Password */}
                    <div>
                        <label className="text-sm text-slate-600">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm text-slate-600">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-md hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>

                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push("/login")}
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                        Back to Login
                    </button>
                </div>

                <p className="text-xs text-slate-400 text-center mt-6">
                    Shivshakti Computer Academy © 2026
                </p>

            </div>

        </div>
    );
}