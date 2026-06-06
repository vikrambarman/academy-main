"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [forgotMsg, setForgotMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.forceChangePassword) {
        router.push("/change-password?forced=true");
        return;
      }
      if (data.role === "student") {
        router.push("/dashboard/student");
      } else {
        setError("This portal is for students only.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail) {
      setForgotMsg({ type: "error", text: "Please enter your email address." });
      return;
    }
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await fetch("/api/auth/student-forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMsg({ type: "success", text: data.message || "Temporary password sent!" });
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotMsg(null);
          setForgotEmail("");
        }, 2000);
      } else {
        setForgotMsg({ type: "error", text: data.message || "Something went wrong." });
      }
    } catch {
      setForgotMsg({ type: "error", text: "Network error. Try again." });
    }
    setForgotLoading(false);
  };

  return (
    <div className="page">
      <div className="container">
        {/* Left Branding */}
        <div className="left">
          <h1>Shivshakti</h1>
          <h2>Computer Academy</h2>
          <p>Access your courses, attendance, and certificates — learn anytime, anywhere.</p>
        </div>

        {/* Right Login */}
        <div className="right">
          <div className="card">
            <div className="card-head">
              <div className="badge">STUDENT PORTAL</div>
              <h3>Welcome back</h3>
            </div>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Email or Student ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
              
              <div className="pass-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button type="submit" className="login" disabled={loading}>
                {loading ? "Signing in..." : "Log in"}
              </button>
            </form>

            <button className="forgot" onClick={() => { setShowForgotModal(true); setForgotMsg(null); }}>
              Forgotten password?
            </button>

            <div className="divider"></div>
            
            <p className="help">First time? Use credentials from your enrollment email</p>
          </div>

          <div className="back">
            <Link href="/">← Back to main website</Link>
          </div>
        </div>
      </div>

      {/* Forgot Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForgotModal(false)}>
          <div className="modal">
            <div className="modal-head">
              <h4>Reset Password</h4>
              <button onClick={() => setShowForgotModal(false)}>✕</button>
            </div>
            <p className="modal-desc">Enter your registered email to receive a temporary password</p>
            
            {forgotMsg && (
              <div className={`msg ${forgotMsg.type}`}>
                {forgotMsg.text}
              </div>
            )}

            <input
              type="email"
              placeholder="your@email.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleForgotSubmit()}
            />
            
            <div className="modal-actions">
              <button className="cancel" onClick={() => setShowForgotModal(false)}>Cancel</button>
              <button className="send" onClick={handleForgotSubmit} disabled={forgotLoading}>
                {forgotLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

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
        }
        .left h1 {
          color: #1e40af;
          font-size: 56px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -1px;
        }
        .left h2 {
          font-size: 26px;
          font-weight: 600;
          margin: 4px 0 16px;
          color: #ea580c;
        }
        .left p {
          font-size: 21px;
          line-height: 30px;
          color: #334155;
          margin: 0;
        }
        .right { width: 100%; max-width: 400px; }
        .card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,.06);
        }
        .card-head { text-align: center; margin-bottom: 16px; }
        .badge {
          display: inline-block;
          background: #eff6ff;
          color: #1e40af;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
          border: 1px solid #dbeafe;
        }
        .card-head h3 {
          margin: 0;
          font-size: 20px;
          color: #0f172a;
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
          font-weight: 600;
          cursor: pointer;
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
        }
        .login:hover:not(:disabled) { background: #1c3aa0; }
        .login:disabled { opacity: 0.7; }
        .forgot {
          width: 100%;
          background: none;
          border: none;
          color: #ea580c;
          font-size: 14px;
          margin-top: 12px;
          cursor: pointer;
          font-weight: 500;
        }
        .forgot:hover { text-decoration: underline; }
        .divider { border-bottom: 1px solid #e2e8f0; margin: 18px 0; }
        .help { text-align: center; font-size: 13px; color: #64748b; margin: 0; }
        .back { text-align: center; margin-top: 24px; }
        .back a { color: #475569; font-size: 14px; text-decoration: none; }
        .back a:hover { color: #1e40af; text-decoration: underline; }
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
        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 50;
        }
        .modal {
          background: white;
          width: 100%;
          max-width: 380px;
          border-radius: 10px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }
        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .modal-head h4 { margin: 0; font-size: 18px; color: #0f172a; }
        .modal-head button {
          background: none;
          border: none;
          font-size: 20px;
          color: #64748b;
          cursor: pointer;
        }
        .modal-desc { font-size: 14px; color: #64748b; margin: 0 0 14px; }
        .modal input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
          margin-bottom: 12px;
          outline: none;
        }
        .modal input:focus { border-color: #1e40af; box-shadow: 0 0 0 3px rgba(30,64,175,0.12); }
        .msg { padding: 10px; border-radius: 6px; font-size: 14px; margin-bottom: 10px; }
        .msg.success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .msg.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .modal-actions { display: flex; gap: 10px; }
        .cancel {
          flex: 1;
          padding: 10px;
          border: 1px solid #cbd5e1;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        .send {
          flex: 1;
          padding: 10px;
          border: none;
          background: #ea580c;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .send:hover:not(:disabled) { background: #dc4a03; }
        .send:disabled { opacity: 0.7; }
        
        @media (max-width: 900px) {
          .container { flex-direction: column; text-align: center; gap: 30px; }
          .left h1 { font-size: 44px; }
          .left p { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}