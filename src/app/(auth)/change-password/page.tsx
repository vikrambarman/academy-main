"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ChangePasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const forced = searchParams.get("forced") === "true";
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type:"success"|"error";text:string}|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return setStatus({type:"error",text:"Minimum 8 characters"});
    setLoading(true); setStatus(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include",
        body: JSON.stringify({ oldPassword: forced?undefined:oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (forced) {
        const role = data.role;
        router.push(role==="admin"?"/dashboard/admin":role==="teacher"?"/dashboard/teacher":"/dashboard/student");
      } else {
        setStatus({type:"success",text:"Password updated!"}); setOldPassword(""); setNewPassword("");
      }
    } catch(err:any){ setStatus({type:"error",text:err.message}); }
    finally{ setLoading(false); }
  };

  return (
    <div className="page">
      <div className="card">
        {!forced && <button className="back" onClick={()=>router.back()}>← Back</button>}
        <div className="head">
          <div className="icon">🔒</div>
          <div className={`badge ${forced?"forced":""}`}>{forced?"SECURITY REQUIRED":"CHANGE PASSWORD"}</div>
          <h1>{forced?"Set New Password":"Change Password"}</h1>
        </div>
        {status && <div className={`alert ${status.type}`}>{status.text}</div>}
        <form onSubmit={handleSubmit}>
          {!forced && <>
            <label>Current Password</label>
            <input type={show?"text":"password"} required value={oldPassword} onChange={e=>setOldPassword(e.target.value)} />
          </>}
          <label>New Password</label>
          <div className="pass-wrap">
            <input type={show?"text":"password"} required value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Min 8 characters" />
            <button type="button" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button>
          </div>
          <button type="submit" disabled={loading} className="btn">
            {loading?"Updating...":forced?"Set Password":"Update Password"}
          </button>
        </form>
        <div className="tips">
          <p>✓ At least 8 characters</p>
          <p>✓ Mix uppercase & lowercase</p>
          <p>✓ Include numbers</p>
        </div>
      </div>
      <style jsx>{`
        .page{min-height:100vh;background:#f8fafc;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui}
        .card{width:100%;max-width:460px;background:white;border:1px solid #e2e8f0;border-radius:12px;padding:32px}
        .back{background:none;border:none;color:#64748b;font-size:13px;cursor:pointer;margin-bottom:12px}
        .head{text-align:center;margin-bottom:20px}
        .icon{width:56px;height:56px;background:#dbeafe;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 12px}
        .badge{display:inline-block;background:#eff6ff;color:#1e40af;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;border:1px solid #dbeafe;margin-bottom:10px}
        .badge.forced{background:#fff7ed;color:#ea580c;border-color:#fed7aa}
        h1{margin:0;font-size:22px;color:#0f172a}
        .alert{padding:10px;border-radius:8px;font-size:14px;margin:16px 0;text-align:center}
        .alert.success{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}
        .alert.error{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c}
        label{display:block;font-size:13px;font-weight:600;color:#334155;margin:12px 0 6px}
        input{width:100%;padding:12px 14px;font-size:15px;border:1px solid #cbd5e1;border-radius:8px;outline:none;box-sizing:border-box}
        input:focus{border-color:#1e40af;box-shadow:0 0 0 3px rgba(30,64,175,.1)}
        .pass-wrap{position:relative}
        .pass-wrap button{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:#1e40af;font-size:13px;cursor:pointer;font-weight:600}
        .btn{width:100%;margin-top:16px;padding:12px;background:#1e40af;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer}
        .btn:hover:not(:disabled){background:#1c3aa0}
        .tips{margin-top:20px;padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
        .tips p{margin:4px 0;font-size:13px;color:#475569}
      `}</style>
    </div>
  );
}

export default function ChangePasswordPage(){
  return <Suspense fallback={<div/>}><ChangePasswordInner/></Suspense>
}