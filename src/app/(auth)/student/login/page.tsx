"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentLoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);

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
                body: JSON.stringify({
                    identifier,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.forceChangePassword) {
                router.push("/change-password?forced=true");
                return;
            }

            if (data.role === "student") {
                router.push("/dashboard/student");
            } else {
                setError("This login portal is for students only.");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-blue-50 to-indigo-100">

            {/* LEFT SIDE */}
            <div className="hidden md:flex flex-col justify-between bg-indigo-600 text-white p-12">

                <div>
                    <h1 className="text-3xl font-bold">
                        Shivshakti Computer Academy
                    </h1>

                    <p className="mt-3 text-indigo-100">
                        Student Learning Portal
                    </p>

                    <div className="mt-6 inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                        STUDENT ACCESS
                    </div>
                </div>

                <div className="space-y-4 text-sm">

                    <p className="text-indigo-100">
                        ✔ View Course Details
                    </p>

                    <p className="text-indigo-100">
                        ✔ Track Fee Payments
                    </p>

                    <p className="text-indigo-100">
                        ✔ Check Certificate Status
                    </p>

                    <p className="text-indigo-100">
                        ✔ Access Academic Information
                    </p>

                </div>

                <p className="text-xs text-indigo-200">
                    © 2026 Shivshakti Computer Academy
                </p>
            </div>


            {/* RIGHT SIDE LOGIN */}
            <div className="flex items-center justify-center px-6">

                <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg p-8">

                    <div className="text-center mb-8">

                        <div className="mb-2 text-indigo-600 font-semibold">
                            STUDENT PORTAL
                        </div>

                        <h2 className="text-2xl font-semibold text-slate-900">
                            Student Login
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Access your learning dashboard
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
                                Email or Student ID
                            </label>

                            <input
                                type="text"
                                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
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
                                    className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
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

                        {/* Forgot Password */}
                        <div className="text-right mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setForgotEmail("");
                                    setShowForgotModal(true);
                                }}
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>

                    <div className="mt-6 bg-indigo-50 border border-indigo-100 p-3 rounded-md text-xs text-indigo-600 text-center">
                        Use the credentials provided by the academy.
                    </div>

                    <p className="text-xs text-slate-400 mt-4 text-center">
                        By signing in, you agree to our Terms & Privacy Policy.
                    </p>

                </div>
            </div>

            {/* Reset Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-4">

                        <h3 className="text-lg font-semibold text-slate-800">
                            Reset Student Password
                        </h3>

                        <p className="text-sm text-slate-500">
                            Enter your registered email. A temporary password will be sent to your email.
                        </p>

                        <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-600"
                            placeholder="Enter registered email"
                        />

                        <div className="flex justify-end gap-3 pt-3">

                            <button
                                onClick={() => setShowForgotModal(false)}
                                className="px-4 py-2 text-sm text-slate-500"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={forgotLoading}
                                onClick={async () => {

                                    if (!forgotEmail) {
                                        alert("Please enter your email");
                                        return;
                                    }

                                    setForgotLoading(true);

                                    try {

                                        const res = await fetch("/api/auth/student-forgot-password", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ email: forgotEmail }),
                                        });

                                        const data = await res.json();

                                        alert(data.message);

                                        if (res.ok) {
                                            setShowForgotModal(false);
                                        }

                                    } catch (err) {
                                        alert("Something went wrong");
                                    }

                                    setForgotLoading(false);

                                }}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                {forgotLoading ? "Sending..." : "Reset Password"}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}