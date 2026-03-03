"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/* ================= INNER COMPONENT ================= */

function ChangePasswordInner() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const forced = searchParams.get("forced");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    oldPassword: forced ? undefined : oldPassword,
                    newPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            if (forced) {
                router.push("/dashboard/student");
            } else {
                setMessage("Password changed successfully.");
                setOldPassword("");
                setNewPassword("");
            }

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
                        {forced ? "Set New Password" : "Change Password"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {forced
                            ? "For security reasons, you must set a new password before continuing."
                            : "Update your account password securely."}
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

                    {!forced && (
                        <div>
                            <label className="text-sm text-slate-600">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showOld ? "text" : "password"}
                                    className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOld(!showOld)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
                                >
                                    {showOld ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm text-slate-600">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
                            >
                                {showNew ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-md hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        {loading
                            ? "Updating..."
                            : forced
                                ? "Set Password"
                                : "Update Password"}
                    </button>
                </form>

                {!forced && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="text-sm text-slate-600 hover:text-slate-900 transition"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}

                <p className="text-xs text-slate-400 text-center mt-6">
                    Shivshakti Computer Academy © 2026
                </p>

            </div>
        </div>
    );
}

/* ================= WRAPPER WITH SUSPENSE ================= */

export default function ChangePasswordPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <ChangePasswordInner />
        </Suspense>
    );
}