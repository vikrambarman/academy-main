"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

            if (data.requires2FA) {
                router.push(`/verify-otp?uid=${data.userId}`);
                return;
            }

            if (data.forceChangePassword) {
                router.push("/change-password?forced=true");
                return;
            }

            if (data.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                setError("This login portal is restricted to administrators.");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-100 to-slate-200">

            {/* LEFT SIDE */}
            <div className="hidden md:flex flex-col justify-between bg-slate-900 text-white p-12">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Shivshakti Computer Academy
                    </h1>

                    <p className="mt-3 text-slate-300">
                        Academy Management System
                    </p>

                    <div className="mt-6 inline-block bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full">
                        ADMIN ACCESS ONLY
                    </div>
                </div>

                <div className="space-y-4 text-sm">

                    <p className="text-slate-400">
                        ✔ Secure Admin Dashboard
                    </p>

                    <p className="text-slate-400">
                        ✔ Two-Factor Authentication Protection
                    </p>

                    <p className="text-slate-400">
                        ✔ Full Student & Course Management
                    </p>

                    <p className="text-slate-400">
                        ✔ Payment & Certificate Tracking
                    </p>

                </div>

                <p className="text-xs text-slate-500">
                    © 2026 Shivshakti Computer Academy
                </p>
            </div>


            {/* RIGHT SIDE LOGIN */}
            <div className="flex items-center justify-center px-6">

                <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg p-8">

                    <div className="text-center mb-8">

                        <div className="mb-3 text-slate-900 font-semibold">
                            ADMIN PORTAL
                        </div>

                        <h2 className="text-2xl font-semibold text-slate-900">
                            Admin Login
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Sign in to manage academy operations
                        </p>

                    </div>


                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm text-slate-600">
                                Admin Email
                            </label>

                            <input
                                type="email"
                                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>


                        {/* PASSWORD */}
                        <div>

                            <label className="text-sm text-slate-600">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900"
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

                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push("/forgot-password")}
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Forgot password?
                                </button>
                            </div>

                        </div>


                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-2.5 rounded-md hover:bg-slate-800 transition disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>


                    {/* SECURITY MESSAGE */}
                    <div className="mt-6 bg-slate-50 border border-slate-200 p-3 rounded-md text-xs text-slate-500 text-center">
                        Admin accounts require OTP verification after login.
                    </div>

                    <p className="text-xs text-slate-400 mt-4 text-center">
                        Authorized administrators only.
                    </p>

                </div>

            </div>
        </div>
    );
}