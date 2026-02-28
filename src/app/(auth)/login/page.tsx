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
                credentials: "include", // important
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Redirect based on role
            if (data.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard/student")
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md p-8 rounded-lg w-96">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Login to Dashboard
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="w-full border p-2 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        className="w-full border p-2 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}