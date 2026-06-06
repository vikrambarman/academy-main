"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!identifier || !password) {
      setError("Employee ID/Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.forceChangePassword) {
        router.push("/change-password?forced=true");
        return;
      }
      router.push("/dashboard/teacher/attendance");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="left">
          <h1>Shivshakti</h1>
          <h2>Computer Academy</h2>
          <p>Teacher portal helps you mark attendance, manage classes and track student progress — all in one place.</p>
        </div>

        <div className="right">
          <div className="card">
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Employee ID or email"
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
                required
              />
              
              <div className="pass-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button type="submit" className="login" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="help">
              <Link href="/">Forgot password?</Link>
            </div>
            <div className="divider"></div>
            <div className="bottom-text">
              Need help? Contact admin office
            </div>
          </div>
          <div className="create-page">
            <Link href="/">← Back to main website</Link>
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
          max-width: 1000px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
        }
        .left {
          flex: 1;
          max-width: 500px;
          padding-bottom: 60px;
        }
        .left h1 {
          color: #1e40af; /* YOUR BLUE */
          font-size: 56px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -1px;
        }
        .left h2 {
          font-size: 26px;
          font-weight: 600;
          margin: 4px 0 16px;
          color: #ea580c; /* YOUR RED-ORANGE */
        }
        .left p {
          font-size: 22px;
          line-height: 30px;
          color: #334155;
          margin: 0;
        }
        .right { width: 100%; max-width: 396px; }
        .card {
          background: #fff;
          border-radius: 10px;
          padding: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,.06);
        }
        .card input {
          width: 100%;
          padding: 14px 16px;
          font-size: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          margin-bottom: 12px;
          outline: none;
          box-sizing: border-box;
        }
        .card input:focus {
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30,64,175,0.12);
        }
        .pass-wrap { position: relative; }
        .pass-wrap button {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-70%);
          background: none;
          border: none;
          color: #1e40af;
          font-size: 14px;
          cursor: pointer;
          font-weight: 600;
          padding: 4px 8px;
        }
        .login {
          width: 100%;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 17px;
          font-weight: 600;
          padding: 13px;
          cursor: pointer;
          margin-top: 4px;
          transition: background 0.2s;
        }
        .login:hover:not(:disabled) { background: #1c3aa0; }
        .login:disabled { opacity: 0.7; cursor: not-allowed; }
        .help { text-align: center; margin: 14px 0; }
        .help a { color: #ea580c; font-size: 14px; text-decoration: none; font-weight: 500; }
        .help a:hover { text-decoration: underline; }
        .divider { border-bottom: 1px solid #e2e8f0; margin: 18px 0; }
        .bottom-text { text-align: center; font-size: 14px; color: #64748b; }
        .create-page { text-align: center; margin-top: 24px; font-size: 14px; }
        .create-page a { color: #334155; text-decoration: none; }
        .create-page a:hover { color: #1e40af; text-decoration: underline; }
        .error {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
          padding: 10px;
          border-radius: 6px;
          font-size: 14px;
          margin-bottom: 12px;
          text-align: center;
        }
        @media (max-width: 900px) {
          .container { flex-direction: column; gap: 30px; text-align: center; }
          .left { padding-bottom: 0; }
          .left h1 { font-size: 44px; }
          .left p { font-size: 18px; line-height: 26px; }
        }
      `}</style>
    </div>
  );
}