// src/app/(auth)/teacher/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherLoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword]     = useState("");
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState("");

    const handleLogin = async () => {
        if (!identifier || !password) return setError("ID/Email aur password dono required hain");
        setLoading(true); setError("");
        try {
            const res  = await fetch("/api/auth/teacher/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });
            const data = await res.json();
            if (!res.ok) return setError(data.message || "Login failed");
            if (data.forceChangePassword) return router.push("/change-password?forced=true");
            router.push("/dashboard/teacher/attendance");
        } catch {
            setError("Server se connect nahi ho pa raha");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{css}</style>
            <div className="tl-root">
                <div className="tl-card">
                    <div className="tl-logo">
                        <img src="/logo.png" alt="Logo" className="tl-logo-img"/>
                    </div>
                    <div className="tl-badge">Teacher Portal</div>
                    <h1 className="tl-title">Welcome Back</h1>
                    <p className="tl-sub">Apni ID aur password se login karein</p>

                    <div className="tl-fields">
                        <div className="tl-field">
                            <label className="tl-label">Employee ID / Email</label>
                            <input className="tl-input" placeholder="TCH-001 ya email"
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleLogin()}/>
                        </div>
                        <div className="tl-field">
                            <label className="tl-label">Password</label>
                            <input className="tl-input" type="password" placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleLogin()}/>
                        </div>
                    </div>

                    {error && <div className="tl-error">{error}</div>}

                    <button className="tl-btn" onClick={handleLogin} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
*,*::before,*::after{box-sizing:border-box;}

.tl-root{min-height:100vh;background:#0b1120;display:flex;align-items:center;justify-content:center;padding:24px;font-family:'Plus Jakarta Sans',sans-serif;}

.tl-card{width:100%;max-width:400px;background:#111827;border:1px solid #1e293b;border-radius:20px;padding:40px 36px;display:flex;flex-direction:column;align-items:center;gap:0;box-shadow:0 24px 60px rgba(0,0,0,.4);}

.tl-logo{margin-bottom:20px;}
.tl-logo-img{height:52px;object-fit:contain;}

.tl-badge{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#6366f1;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);padding:4px 12px;border-radius:100px;margin-bottom:16px;}

.tl-title{font-family:'DM Serif Display',serif;font-size:1.6rem;color:#f8fafc;font-weight:400;margin:0 0 4px;text-align:center;}
.tl-sub{font-size:12px;color:#64748b;margin:0 0 28px;text-align:center;}

.tl-fields{width:100%;display:flex;flex-direction:column;gap:14px;margin-bottom:6px;}
.tl-field{display:flex;flex-direction:column;gap:6px;width:100%;}
.tl-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748b;}
.tl-input{width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:11px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;outline:none;transition:border-color .13s;}
.tl-input:focus{border-color:#6366f1;}
.tl-input::placeholder{color:#334155;}

.tl-error{width:100%;font-size:12px;color:#f87171;background:#2d0a0a;border:1px solid #7f1d1d;border-radius:8px;padding:9px 12px;margin-top:4px;text-align:center;}

.tl-btn{margin-top:20px;width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:opacity .14s;}
.tl-btn:hover:not(:disabled){opacity:.88;}
.tl-btn:disabled{opacity:.5;cursor:not-allowed;}
`;