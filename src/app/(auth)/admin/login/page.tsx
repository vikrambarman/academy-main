"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ─── Icons ─── */
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a5.94 5.94 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier: email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.requires2FA) { router.push(`/verify-otp?uid=${data.userId}`); return; }
      if (data.forceChangePassword) { router.push("/change-password?forced=true"); return; }
      if (data.role === "admin") router.push("/dashboard/admin");
      else setError("This portal is restricted to administrators only.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        {/* Left */}
        <div className="left">
          <h1>Shivshakti</h1>
          <h2>Computer Academy</h2>
          <p>Secure admin dashboard for managing students, teachers, courses and academy operations.</p>
          <div className="features">
            <div className="feat"><span>✓</span> Student Management</div>
            <div className="feat"><span>✓</span> Attendance Control</div>
            <div className="feat"><span>✓</span> Fee & Reports</div>
          </div>
        </div>

        {/* Right */}
        <div className="right">
          <div className="card">
            <div className="card-head">
              <div className="badge">ADMIN PORTAL</div>
              <h3>Administrator Login</h3>
              <p>Enter your credentials to continue</p>
            </div>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@shivshakti.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <div className="label-row">
                  <label>Password</label>
                  <button type="button" className="forgot" onClick={() => router.push("/forgot-password")}>
                    Forgot?
                  </button>
                </div>
                <div className="pass-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button type="button" className="eye" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="otp-note">
              🔒 OTP verification required after login
            </div>
          </div>

          <div className="back">
            <Link href="/">← Back to website</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .container {
          width: 100%;
          max-width: 1050px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 70px;
        }
        .left {
          flex: 1;
          max-width: 520px;
        }
        .left h1 {
          color: #1e40af;
          font-size: 58px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -1.5px;
          line-height: 1;
        }
        .left h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 6px 0 18px;
          color: #ea580c;
        }
        .left p {
          font-size: 19px;
          line-height: 28px;
          color: #475569;
          margin: 0 0 28px;
        }
        .features {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .feat {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          color: #334155;
        }
        .feat span {
          width: 20px;
          height: 20px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }
        .right { width: 100%; max-width: 400px; }
        .card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .card-head { text-align: center; margin-bottom: 22px; }
        .badge {
          display: inline-block;
          background: #fff7ed;
          color: #ea580c;
          border: 1px solid #fed7aa;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .card-head h3 {
          margin: 0 0 4px;
          font-size: 22px;
          color: #0f172a;
          font-weight: 700;
        }
        .card-head p {
          margin: 0;
          font-size: 14px;
          color: #64748b;
        }
        .field { margin-bottom: 16px; }
        .field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .forgot {
          background: none;
          border: none;
          color: #ea580c;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .forgot:hover { text-decoration: underline; }
        .field input {
          width: 100%;
          padding: 12px 14px;
          font-size: 15px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.15s;
        }
        .field input:focus {
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30,64,175,0.1);
        }
        .pass-wrap { position: relative; }
        .pass-wrap input { padding-right: 42px; }
        .eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          display: flex;
        }
        .eye:hover { color: #1e40af; }
        .login {
          width: 100%;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          padding: 13px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.15s;
        }
        .login:hover:not(:disabled) { background: #1c3aa0; }
        .login:disabled { opacity: 0.6; cursor: not-allowed; }
        .otp-note {
          margin-top: 16px;
          padding: 10px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 12px;
          color: #475569;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        .error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 14px;
          margin-bottom: 16px;
          text-align: center;
        }
        .back { text-align: center; margin-top: 20px; }
        .back a {
          color: #64748b;
          font-size: 14px;
          text-decoration: none;
        }
        .back a:hover { color: #1e40af; text-decoration: underline; }

        @media (max-width: 920px) {
          .container {
            flex-direction: column;
            gap: 40px;
            text-align: center;
          }
          .left { max-width: 500px; }
          .features { align-items: center; }
          .left h1 { font-size: 46px; }
        }
      `}</style>
    </div>
  );
}