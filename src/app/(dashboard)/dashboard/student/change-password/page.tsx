"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, Info } from "lucide-react";

interface FieldState { value: string; show: boolean; }

function strengthInfo(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: "", color: "var(--sp-border)" };
    if (pw.length < 6) return { score: 1, label: "Too short", color: "var(--sp-danger)" };
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
        { score:1, label:"Weak",   color:"var(--sp-danger)"  },
        { score:2, label:"Fair",   color:"var(--sp-warn)"    },
        { score:3, label:"Good",   color:"var(--sp-accent2)" },
        { score:4, label:"Strong", color:"var(--sp-success)" },
    ];
    return map[score - 1] ?? map[0];
}

export default function ChangePasswordPage() {
    const [current, setCurrent] = useState<FieldState>({ value:"", show:false });
    const [newPw,   setNewPw]   = useState<FieldState>({ value:"", show:false });
    const [confirm, setConfirm] = useState<FieldState>({ value:"", show:false });
    const [saving,  setSaving]  = useState(false);
    const [status,  setStatus]  = useState<{ type:"ok"|"err"; text:string } | null>(null);

    const strength = strengthInfo(newPw.value);
    const matched  = newPw.value && confirm.value && newPw.value === confirm.value;
    const mismatch = confirm.value && newPw.value !== confirm.value;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!current.value || !newPw.value || !confirm.value) { setStatus({ type:"err", text:"All fields are required." }); return; }
        if (newPw.value !== confirm.value)                     { setStatus({ type:"err", text:"New passwords do not match." }); return; }
        if (newPw.value.length < 6)                            { setStatus({ type:"err", text:"Password must be at least 6 characters." }); return; }

        setSaving(true); setStatus(null);
        try {
            const res  = await fetchWithAuth("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ oldPassword: current.value, newPassword: newPw.value }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setStatus({ type:"ok", text:"Password changed successfully." });
            setCurrent({ value:"", show:false });
            setNewPw({ value:"", show:false });
            setConfirm({ value:"", show:false });
        } catch (err: any) {
            setStatus({ type:"err", text: err.message || "Failed to change password." });
        }
        setSaving(false);
    };

    return (
        <>
            <style>{`
                .scp-root * { box-sizing:border-box; }
                .scp-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--sp-text); max-width:520px; }

                .scp-page-title { font-family:'DM Serif Display',serif; font-size:1.4rem; color:var(--sp-text); display:flex; align-items:center; gap:10px; margin-bottom:4px; }
                .scp-page-sub   { font-size:13px; color:var(--sp-muted); font-weight:300; margin-bottom:22px; }

                .scp-alert     { display:flex; align-items:flex-start; gap:9px; border-radius:11px; padding:12px 14px; font-size:13px; line-height:1.6; margin-bottom:18px; }
                .scp-alert-ok  { background:rgba(34,197,94,0.08);  border:1px solid rgba(34,197,94,0.22);  color:var(--sp-success); }
                .scp-alert-err { background:rgba(239,68,68,0.08);  border:1px solid rgba(239,68,68,0.22);  color:var(--sp-danger);  }

                .scp-card      { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:16px; overflow:hidden; }
                .scp-card-head { padding:16px 22px; border-bottom:1px solid var(--sp-border); display:flex; align-items:center; gap:10px; }
                .scp-card-head-icon  { width:32px; height:32px; border-radius:9px; background:var(--sp-active-bg); display:flex; align-items:center; justify-content:center; color:var(--sp-accent); }
                .scp-card-head-title { font-size:12px; font-weight:700; color:var(--sp-muted); letter-spacing:0.08em; text-transform:uppercase; }
                .scp-card-body { padding:22px; }

                .scp-field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
                .scp-label { font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--sp-muted); }

                .scp-input-wrap { position:relative; }
                .scp-input {
                    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:var(--sp-text);
                    background:var(--sp-bg); border:1px solid var(--sp-border);
                    border-radius:10px; padding:11px 42px 11px 14px; width:100%; outline:none;
                    transition:border-color 0.18s,box-shadow 0.18s,background 0.18s;
                }
                .scp-input::placeholder { color:var(--sp-muted); }
                .scp-input:focus   { border-color:var(--sp-accent); background:var(--sp-surface); box-shadow:0 0 0 3px var(--sp-accent-glow); }
                .scp-input.error   { border-color:var(--sp-danger);  box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
                .scp-input.success { border-color:var(--sp-success); box-shadow:0 0 0 3px rgba(34,197,94,0.1); }

                .scp-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--sp-muted); display:flex; align-items:center; padding:2px; transition:color 0.15s; }
                .scp-eye:hover { color:var(--sp-accent); }

                /* Strength bar */
                .scp-strength       { margin-top:8px; }
                .scp-strength-track { height:4px; background:var(--sp-border); border-radius:10px; overflow:hidden; margin-bottom:5px; }
                .scp-strength-fill  { height:100%; border-radius:10px; transition:width 0.4s ease,background 0.3s; }
                .scp-strength-label { font-size:11px; font-weight:600; }

                /* Match indicator */
                .scp-match { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; margin-top:6px; }

                /* Tips */
                .scp-tips      { background:var(--sp-hover); border:1px solid var(--sp-border); border-radius:11px; padding:14px 16px; margin-bottom:20px; display:flex; gap:10px; align-items:flex-start; }
                .scp-tips-icon { color:var(--sp-accent); flex-shrink:0; margin-top:1px; }
                .scp-tips-list { font-size:12px; font-weight:300; color:var(--sp-subtext); line-height:2; margin:0; padding:0; list-style:none; }
                .scp-tips-list li::before { content:'· '; color:var(--sp-accent); font-weight:700; }

                /* Submit */
                .scp-submit { font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; color:#fff; background:var(--sp-accent); border:none; border-radius:10px; padding:13px 22px; width:100%; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:opacity 0.18s,transform 0.15s; }
                .scp-submit:hover:not(:disabled) { opacity:0.88; transform:translateY(-1px); }
                .scp-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
            `}</style>

            <div className="scp-root">

                <div className="scp-page-title"><Lock size={20} style={{ color:"var(--sp-accent)" }}/> Change Password</div>
                <div className="scp-page-sub">Update your account password to keep it secure.</div>

                {status && (
                    <div className={`scp-alert ${status.type === "ok" ? "scp-alert-ok" : "scp-alert-err"}`}>
                        {status.type === "ok"
                            ? <CheckCircle2 size={16} style={{ flexShrink:0, marginTop:1 }}/>
                            : <AlertCircle  size={16} style={{ flexShrink:0, marginTop:1 }}/>
                        }
                        {status.text}
                    </div>
                )}

                <div className="scp-card">
                    <div className="scp-card-head">
                        <div className="scp-card-head-icon"><ShieldCheck size={15}/></div>
                        <div className="scp-card-head-title">Password Settings</div>
                    </div>

                    <div className="scp-card-body">

                        <div className="scp-tips">
                            <Info size={14} className="scp-tips-icon"/>
                            <ul className="scp-tips-list">
                                <li>Minimum 6 characters</li>
                                <li>Use uppercase letters and numbers for a stronger password</li>
                                <li>Avoid using your name or student ID</li>
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* Current password */}
                            <div className="scp-field">
                                <label className="scp-label">Current Password</label>
                                <div className="scp-input-wrap">
                                    <input type={current.show ? "text" : "password"} className="scp-input"
                                        placeholder="Enter current password"
                                        value={current.value} onChange={e => setCurrent(p => ({ ...p, value:e.target.value }))}
                                        autoComplete="current-password" required/>
                                    <button type="button" className="scp-eye" onClick={() => setCurrent(p => ({ ...p, show:!p.show }))}>
                                        {current.show ? <EyeOff size={15}/> : <Eye size={15}/>}
                                    </button>
                                </div>
                            </div>

                            {/* New password */}
                            <div className="scp-field">
                                <label className="scp-label">New Password</label>
                                <div className="scp-input-wrap">
                                    <input type={newPw.show ? "text" : "password"}
                                        className={`scp-input ${newPw.value && strength.score >= 3 ? "success" : newPw.value && strength.score < 2 ? "error" : ""}`}
                                        placeholder="Choose a strong password"
                                        value={newPw.value} onChange={e => setNewPw(p => ({ ...p, value:e.target.value }))}
                                        autoComplete="new-password" required/>
                                    <button type="button" className="scp-eye" onClick={() => setNewPw(p => ({ ...p, show:!p.show }))}>
                                        {newPw.show ? <EyeOff size={15}/> : <Eye size={15}/>}
                                    </button>
                                </div>
                                {newPw.value && (
                                    <div className="scp-strength">
                                        <div className="scp-strength-track">
                                            <div className="scp-strength-fill" style={{ width:`${(strength.score / 4) * 100}%`, background:strength.color }}/>
                                        </div>
                                        <span className="scp-strength-label" style={{ color:strength.color }}>{strength.label}</span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div className="scp-field" style={{ marginBottom:22 }}>
                                <label className="scp-label">Confirm New Password</label>
                                <div className="scp-input-wrap">
                                    <input type={confirm.show ? "text" : "password"}
                                        className={`scp-input ${matched ? "success" : mismatch ? "error" : ""}`}
                                        placeholder="Re-enter new password"
                                        value={confirm.value} onChange={e => setConfirm(p => ({ ...p, value:e.target.value }))}
                                        autoComplete="new-password" required/>
                                    <button type="button" className="scp-eye" onClick={() => setConfirm(p => ({ ...p, show:!p.show }))}>
                                        {confirm.show ? <EyeOff size={15}/> : <Eye size={15}/>}
                                    </button>
                                </div>
                                {confirm.value && (
                                    <div className="scp-match" style={{ color: matched ? "var(--sp-success)" : "var(--sp-danger)" }}>
                                        {matched
                                            ? <><CheckCircle2 size={12}/> Passwords match</>
                                            : <><AlertCircle  size={12}/> Passwords do not match</>
                                        }
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={saving} className="scp-submit">
                                <ShieldCheck size={15}/>
                                {saving ? "Updating…" : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}