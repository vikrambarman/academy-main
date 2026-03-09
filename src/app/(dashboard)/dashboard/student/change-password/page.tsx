"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, Info } from "lucide-react";

interface FieldState { value: string; show: boolean; }

function strengthInfo(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: "", color: "#e0effe" };
    if (pw.length < 6) return { score: 1, label: "Too short", color: "#dc2626" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
        { score: 1, label: "Weak", color: "#dc2626" },
        { score: 2, label: "Fair", color: "#d97706" },
        { score: 3, label: "Good", color: "#2563eb" },
        { score: 4, label: "Strong", color: "#15803d" },
    ];
    return map[score - 1] ?? map[0];
}

export default function ChangePasswordPage() {
    const [current, setCurrent] = useState<FieldState>({ value: "", show: false });
    const [newPw, setNewPw] = useState<FieldState>({ value: "", show: false });
    const [confirm, setConfirm] = useState<FieldState>({ value: "", show: false });

    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    const strength = strengthInfo(newPw.value);
    const matched = newPw.value && confirm.value && newPw.value === confirm.value;
    const mismatch = confirm.value && newPw.value !== confirm.value;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!current.value || !newPw.value || !confirm.value) {
            setStatus({ type: "err", text: "All fields are required." }); return;
        }
        if (newPw.value !== confirm.value) {
            setStatus({ type: "err", text: "New passwords do not match." }); return;
        }
        if (newPw.value.length < 6) {
            setStatus({ type: "err", text: "Password must be at least 6 characters." }); return;
        }

        setSaving(true); setStatus(null);
        try {
            const res = await fetchWithAuth("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ oldPassword: current.value, newPassword: newPw.value }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setStatus({ type: "ok", text: "Password changed successfully." });
            setCurrent({ value: "", show: false });
            setNewPw({ value: "", show: false });
            setConfirm({ value: "", show: false });
        } catch (err: any) {
            setStatus({ type: "err", text: err.message || "Failed to change password." });
        }
        setSaving(false);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                .scp-root * { box-sizing:border-box; }
                .scp-root { font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; max-width:520px; }

                .scp-page-title {
                    font-family:'DM Serif Display',serif; font-size:1.4rem; color:#0f172a;
                    display:flex; align-items:center; gap:10px; margin-bottom:4px;
                }
                .scp-page-sub { font-size:13px; color:#64748b; font-weight:300; margin-bottom:22px; }

                /* ── Alert ── */
                .scp-alert {
                    display:flex; align-items:flex-start; gap:9px;
                    border-radius:11px; padding:12px 14px; font-size:13px;
                    font-weight:400; line-height:1.6; margin-bottom:18px;
                }
                .scp-alert-ok  { background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; }
                .scp-alert-err { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; }

                /* ── Card ── */
                .scp-card {
                    background:#fff; border:1px solid #e0effe;
                    border-radius:16px; overflow:hidden;
                }

                .scp-card-head {
                    padding:16px 22px; border-bottom:1px solid #f0f7ff;
                    display:flex; align-items:center; gap:10px;
                }

                .scp-card-head-icon {
                    width:32px; height:32px; border-radius:9px;
                    background:#eff6ff; display:flex; align-items:center;
                    justify-content:center; color:#2563eb;
                }

                .scp-card-head-title {
                    font-size:12px; font-weight:700; color:#475569;
                    letter-spacing:0.08em; text-transform:uppercase;
                }

                .scp-card-body { padding:22px; }

                /* ── Field ── */
                .scp-field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }

                .scp-label {
                    font-size:10px; font-weight:700; letter-spacing:0.1em;
                    text-transform:uppercase; color:#64748b;
                }

                .scp-input-wrap { position:relative; }

                .scp-input {
                    font-family:'Plus Jakarta Sans',sans-serif;
                    font-size:13px; font-weight:400; color:#0f172a;
                    background:#f8fbff; border:1px solid #e0effe;
                    border-radius:10px; padding:11px 42px 11px 14px;
                    width:100%; outline:none;
                    transition:border-color 0.18s, box-shadow 0.18s, background 0.18s;
                }
                .scp-input::placeholder { color:#94a3b8; }
                .scp-input:focus {
                    border-color:#2563eb; background:#fff;
                    box-shadow:0 0 0 3px rgba(37,99,235,0.1);
                }
                .scp-input.error { border-color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,0.08); }
                .scp-input.success { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.08); }

                .scp-eye {
                    position:absolute; right:12px; top:50%; transform:translateY(-50%);
                    background:none; border:none; cursor:pointer; color:#94a3b8;
                    display:flex; align-items:center; padding:2px;
                    transition:color 0.15s;
                }
                .scp-eye:hover { color:#2563eb; }

                /* ── Strength bar ── */
                .scp-strength { margin-top:8px; }
                .scp-strength-track {
                    height:4px; background:#e0effe; border-radius:10px;
                    overflow:hidden; margin-bottom:5px;
                }
                .scp-strength-fill { height:100%; border-radius:10px; transition:width 0.4s ease, background 0.3s; }
                .scp-strength-label { font-size:11px; font-weight:600; }

                /* ── Match indicator ── */
                .scp-match {
                    display:flex; align-items:center; gap:5px;
                    font-size:11px; font-weight:600; margin-top:6px;
                }

                /* ── Tips ── */
                .scp-tips {
                    background:#f8fbff; border:1px solid #e0effe; border-radius:11px;
                    padding:14px 16px; margin-bottom:20px;
                    display:flex; gap:10px; align-items:flex-start;
                }
                .scp-tips-icon { color:#2563eb; flex-shrink:0; margin-top:1px; }
                .scp-tips-list { font-size:12px; font-weight:300; color:#475569; line-height:2; margin:0; padding:0; list-style:none; }
                .scp-tips-list li::before { content:'· '; color:#2563eb; font-weight:700; }

                /* ── Submit ── */
                .scp-submit {
                    font-family:'Plus Jakarta Sans',sans-serif;
                    font-size:13px; font-weight:600; color:#fff;
                    background:#2563eb; border:none; border-radius:10px;
                    padding:13px 22px; width:100%; cursor:pointer;
                    display:flex; align-items:center; justify-content:center; gap:8px;
                    transition:background 0.18s, transform 0.15s;
                }
                .scp-submit:hover:not(:disabled) { background:#1d4ed8; transform:translateY(-1px); }
                .scp-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
            `}</style>

            <div className="scp-root">

                {/* Header */}
                <div className="scp-page-title">
                    <Lock size={20} style={{ color: "#2563eb" }} />
                    Change Password
                </div>
                <div className="scp-page-sub">Update your account password to keep it secure.</div>

                {/* Alert */}
                {status && (
                    <div className={`scp-alert ${status.type === "ok" ? "scp-alert-ok" : "scp-alert-err"}`}>
                        {status.type === "ok"
                            ? <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                            : <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                        }
                        {status.text}
                    </div>
                )}

                <div className="scp-card">
                    <div className="scp-card-head">
                        <div className="scp-card-head-icon"><ShieldCheck size={15} /></div>
                        <div className="scp-card-head-title">Password Settings</div>
                    </div>

                    <div className="scp-card-body">

                        {/* Tips */}
                        <div className="scp-tips">
                            <Info size={14} className="scp-tips-icon" />
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
                                    <input
                                        type={current.show ? "text" : "password"}
                                        className="scp-input"
                                        placeholder="Enter current password"
                                        value={current.value}
                                        onChange={e => setCurrent(p => ({ ...p, value: e.target.value }))}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button type="button" className="scp-eye" onClick={() => setCurrent(p => ({ ...p, show: !p.show }))}>
                                        {current.show ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* New password */}
                            <div className="scp-field">
                                <label className="scp-label">New Password</label>
                                <div className="scp-input-wrap">
                                    <input
                                        type={newPw.show ? "text" : "password"}
                                        className={`scp-input ${newPw.value && strength.score >= 3 ? "success" : newPw.value && strength.score < 2 ? "error" : ""}`}
                                        placeholder="Choose a strong password"
                                        value={newPw.value}
                                        onChange={e => setNewPw(p => ({ ...p, value: e.target.value }))}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button type="button" className="scp-eye" onClick={() => setNewPw(p => ({ ...p, show: !p.show }))}>
                                        {newPw.show ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>

                                {/* Strength meter */}
                                {newPw.value && (
                                    <div className="scp-strength">
                                        <div className="scp-strength-track">
                                            <div
                                                className="scp-strength-fill"
                                                style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}
                                            />
                                        </div>
                                        <span className="scp-strength-label" style={{ color: strength.color }}>
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div className="scp-field" style={{ marginBottom: 22 }}>
                                <label className="scp-label">Confirm New Password</label>
                                <div className="scp-input-wrap">
                                    <input
                                        type={confirm.show ? "text" : "password"}
                                        className={`scp-input ${matched ? "success" : mismatch ? "error" : ""}`}
                                        placeholder="Re-enter new password"
                                        value={confirm.value}
                                        onChange={e => setConfirm(p => ({ ...p, value: e.target.value }))}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button type="button" className="scp-eye" onClick={() => setConfirm(p => ({ ...p, show: !p.show }))}>
                                        {confirm.show ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>

                                {/* Match indicator */}
                                {confirm.value && (
                                    <div className="scp-match" style={{ color: matched ? "#15803d" : "#dc2626" }}>
                                        {matched
                                            ? <><CheckCircle2 size={12} /> Passwords match</>
                                            : <><AlertCircle size={12} /> Passwords do not match</>
                                        }
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={saving} className="scp-submit">
                                <ShieldCheck size={15} />
                                {saving ? "Updating…" : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}