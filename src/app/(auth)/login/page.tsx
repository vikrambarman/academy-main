"use client";

/**
 * Login Page
 * -----------
 * Handles admin & student login.
 * On success:
 * - Stores access token in memory (local state)
 * - Redirects based on role
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle form submit
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // 1️⃣ If Admin requires OTP
            if (data.requires2FA) {
                router.push(`/verify-otp?uid=${data.userId}`);
                return;
            }

            // 2️⃣ Force password change (FIRST LOGIN)
            if (data.forceChangePassword) {
                router.push("/change-password?forced=true");
                return;
            }

            // 3️⃣ Normal role-based redirect
            if (data.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard/student");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-slate-50">

            {/* LEFT BRANDING SIDE */}
            <div className="hidden md:flex flex-col justify-between bg-slate-900 text-white p-12">

                <div>
                    <h1 className="text-3xl font-bold">Shivshakti Computer Academy</h1>
                    <p className="mt-3 text-slate-300">
                        Smart Computer Academy Management System
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                        ✔ Secure Admin Access
                    </p>
                    <p className="text-sm text-slate-400">
                        ✔ Two-Factor Authentication
                    </p>
                    <p className="text-sm text-slate-400">
                        ✔ Student Management System
                    </p>
                </div>

                <p className="text-xs text-slate-500">
                    © 2026 Shivshakti Computer Academy. All rights reserved.
                </p>
            </div>


            {/* RIGHT LOGIN SIDE */}
            <div className="flex items-center justify-center px-6">

                <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Sign in to your account
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">

                        <div>
                            <label className="text-sm text-slate-600">Email</label>
                            <input
                                type="email"
                                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Password</label>
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

                            {/* 🔐 Forgot Password Link */}
                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push("/forgot-password")}
                                    className="text-sm text-slate-600 hover:text-slate-900 transition"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-2.5 rounded-md hover:bg-slate-800 transition disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 text-center mt-6">
                        Admin accounts are protected with Two-Factor Authentication.
                    </p>
                    <p className="text-xs text-slate-400 mt-4 text-center">
                        By signing in, you agree to our Terms & Privacy Policy.
                    </p>

                </div>
            </div>
        </div>
    );
}