"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type:"success"|"error";text:string}|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus({ type:"success", text:"If an account exists, reset link sent to your email." });
    } catch (err:any) {
      setStatus({ type:"error", text: err.message });
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="card">
        <button className="back" onClick={() => router.back()}>← Back to Login</button>
        <div className="head">
          <div className="icon">📧</div>
          <div className="badge">ACCOUNT RECOVERY</div>
          <h1>Forgot Password?</h1>
          <p>Enter your email and we'll send reset instructions</p>
        </div>
        {status && <div className={`alert ${status.type}`}>{status.text}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input type="email" required placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <button type="submit" disabled={loading} className="btn">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="help">Check spam folder if you don't see the email</p>
      </div>
      <style jsx>{`
        .page{min-height:100vh;background:#f8fafc;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui}
        .card{width:100%;max-width:440px;background:white;border:1px solid #e2e8f0;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
        .back{background:none;border:none;color:#64748b;font-size:13px;cursor:pointer;margin-bottom:16px;padding:0}
        .back:hover{color:#1e40af}
        .head{text-align:center;margin-bottom:24px}
        .icon{width:56px;height:56px;background:#fff7ed;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 12px;border:1px solid #fed7aa}
        .badge{display:inline-block;background:#fff7ed;color:#ea580c;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;border:1px solid #fed7aa;margin-bottom:12px}
        h1{margin:0 0 6px;font-size:22px;color:#0f172a}
        .head p{margin:0;color:#64748b;font-size:14px}
        .alert{padding:10px 12px;border-radius:8px;font-size:14px;margin-bottom:16px;text-align:center}
        .alert.success{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}
        .alert.error{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c}
        label{display:block;font-size:13px;font-weight:600;color:#334155;margin-bottom:6px}
        input{width:100%;padding:12px 14px;font-size:15px;border:1px solid #cbd5e1;border-radius:8px;outline:none;margin-bottom:16px;box-sizing:border-box}
        input:focus{border-color:#1e40af;box-shadow:0 0 0 3px rgba(30,64,175,.1)}
        .btn{width:100%;padding:12px;background:#1e40af;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer}
        .btn:hover:not(:disabled){background:#1c3aa0}
        .btn:disabled{opacity:.6}
        .help{text-align:center;font-size:12px;color:#94a3b8;margin:16px 0 0}
      `}</style>
    </div>
  );
}