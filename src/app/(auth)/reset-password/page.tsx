"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string|null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type:"success"|"error";text:string}|null>(null);

  useEffect(()=>{ setToken(new URLSearchParams(window.location.search).get("token")); },[]);

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault();
    if(!token) return setStatus({type:"error",text:"Invalid token"});
    if(password!==confirm) return setStatus({type:"error",text:"Passwords don't match"});
    if(password.length<8) return setStatus({type:"error",text:"Min 8 characters"});
    setLoading(true);
    try{
      const res = await fetch("/api/auth/reset-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,newPassword:password})});
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      setStatus({type:"success",text:"Password updated! Redirecting..."});
      setTimeout(()=>router.push("/login"),2000);
    }catch(err:any){ setStatus({type:"error",text:err.message}); }
    finally{ setLoading(false); }
  };

  return (
    <div className="page">
      <div className="card">
        <Link href="/login" className="back">← Back to Login</Link>
        <div className="head">
          <div className="icon">🔑</div>
          <h1>Reset Password</h1>
          <p>Choose a new secure password</p>
        </div>
        {status && <div className={`alert ${status.type}`}>{status.text}</div>}
        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter new password" />
          <label>Confirm Password</label>
          <input type="password" required value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter password" />
          <button type="submit" disabled={loading} className="btn">
            {loading?"Updating...":"Update Password"}
          </button>
        </form>
      </div>
      <style jsx>{`
        .page{min-height:100vh;background:#f8fafc;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui}
        .card{width:100%;max-width:440px;background:white;border:1px solid #e2e8f0;border-radius:12px;padding:32px}
        .back{display:inline-block;font-size:13px;color:#64748b;text-decoration:none;margin-bottom:16px}
        .back:hover{color:#1e40af}
        .head{text-align:center;margin-bottom:24px}
        .icon{width:56px;height:56px;background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 12px}
        h1{margin:0 0 6px;font-size:22px;color:#0f172a}
        .head p{margin:0;color:#64748b;font-size:14px}
        .alert{padding:10px;border-radius:8px;font-size:14px;margin-bottom:16px;text-align:center}
        .alert.success{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}
        .alert.error{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c}
        label{display:block;font-size:13px;font-weight:600;color:#334155;margin:12px 0 6px}
        input{width:100%;padding:12px 14px;font-size:15px;border:1px solid #cbd5e1;border-radius:8px;outline:none;box-sizing:border-box}
        input:focus{border-color:#ea580c;box-shadow:0 0 0 3px rgba(234,88,12,.1)}
        .btn{width:100%;margin-top:16px;padding:12px;background:#ea580c;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer}
        .btn:hover:not(:disabled){background:#dc4a03}
      `}</style>
    </div>
  );
}