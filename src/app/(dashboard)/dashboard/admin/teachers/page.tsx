// src/app/dashboard/admin/teachers/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, X, Edit2, Trash2, ToggleLeft, ToggleRight, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

interface Teacher {
    _id: string;
    name: string;
    employeeId: string;
    phone?: string;
    isActive: boolean;
    user: { email: string; academyId: string; isFirstLogin: boolean; isActive: boolean };
}

export default function AdminTeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [modal, setModal]       = useState(false);
    const [editId, setEditId]     = useState<string | null>(null);
    const [toast, setToast]       = useState<{ type: "success"|"error"; msg: string } | null>(null);
    const [saving, setSaving]     = useState(false);
    const [showPwd, setShowPwd]   = useState(false);

    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

    const showToast = (type: "success"|"error", msg: string) => {
        setToast({ type, msg }); setTimeout(() => setToast(null), 3500);
    };

    const load = useCallback(async () => {
        const res = await fetchWithAuth("/api/admin/teachers");
        const d   = await res.json();
        setTeachers(d.teachers || []);
    }, []);

    useEffect(() => { load(); }, [load]);

    const openCreate = () => { setForm({ name:"", email:"", phone:"", password:"" }); setEditId(null); setModal(true); };

    const openResetPassword = (t: Teacher) => {
        setForm({ name: t.name, email: t.user?.email, phone: t.phone||"", password: "" });
        setEditId(t._id);
        setModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editId) {
                // Reset password
                if (!form.password) return showToast("error", "Naya password daalo");
                const res = await fetchWithAuth("/api/admin/teachers", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ teacherId: editId, password: form.password }),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.message);
                showToast("success", "Password reset ho gaya");
            } else {
                // Create
                if (!form.name || !form.email || !form.password) return showToast("error", "Name, email aur password required");
                const res = await fetchWithAuth("/api/admin/teachers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.message);
                showToast("success", `Teacher create ho gaya — ID: ${d.teacher?.employeeId}`);
            }
            setModal(false);
            load();
        } catch (e: any) {
            showToast("error", e.message || "Error");
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (t: Teacher) => {
        const res = await fetchWithAuth("/api/admin/teachers", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teacherId: t._id, isActive: !t.isActive }),
        });
        if (res.ok) { showToast("success", `Teacher ${!t.isActive ? "activate" : "deactivate"} ho gaya`); load(); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Is teacher ko delete karna chahte ho?")) return;
        const res = await fetchWithAuth(`/api/admin/teachers?id=${id}`, { method: "DELETE" });
        if (res.ok) { showToast("success", "Teacher delete ho gaya"); load(); }
    };

    return (
        <>
            <style>{css}</style>
            {toast && (
                <div className={`tp-toast tp-toast--${toast.type}`}>
                    {toast.type === "success" ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                    {toast.msg}
                </div>
            )}
            <div className="tp-root">

                {/* Header */}
                <div className="tp-header">
                    <div>
                        <h1 className="tp-title">Teachers</h1>
                        <p className="tp-sub">Academy ke sabhi teachers manage karo</p>
                    </div>
                    <button className="tp-add-btn" onClick={openCreate}>
                        <Plus size={13}/> Add Teacher
                    </button>
                </div>

                {/* KPI */}
                <div className="tp-kpi-row">
                    <div className="tp-kpi">
                        <div className="tp-kpi-label">Total</div>
                        <div className="tp-kpi-val">{teachers.length}</div>
                    </div>
                    <div className="tp-kpi tp-kpi--green">
                        <div className="tp-kpi-label">Active</div>
                        <div className="tp-kpi-val">{teachers.filter(t => t.isActive).length}</div>
                    </div>
                    <div className="tp-kpi tp-kpi--red">
                        <div className="tp-kpi-label">Inactive</div>
                        <div className="tp-kpi-val">{teachers.filter(t => !t.isActive).length}</div>
                    </div>
                </div>

                {/* Table */}
                {teachers.length === 0 ? (
                    <div className="tp-empty">Abhi koi teacher nahi hai — Add Teacher karo</div>
                ) : (
                    <div className="tp-table-wrap">
                        <div className="tp-thead">
                            <span>Teacher</span>
                            <span>Employee ID</span>
                            <span>Email</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>
                        {teachers.map(t => (
                            <div key={t._id} className="tp-row">
                                <div className="tp-cell tp-cell--name">
                                    <div className="tp-avatar">{t.name?.charAt(0).toUpperCase()}</div>
                                    <div>
                                        <div className="tp-name">{t.name}</div>
                                        {t.phone && <div className="tp-phone">{t.phone}</div>}
                                    </div>
                                </div>
                                <div className="tp-cell">
                                    <span className="tp-id-badge">{t.employeeId}</span>
                                </div>
                                <div className="tp-cell tp-cell--email">{t.user?.email}</div>
                                <div className="tp-cell">
                                    <span className={`tp-status ${t.isActive ? "active" : "inactive"}`}>
                                        {t.isActive ? "Active" : "Inactive"}
                                    </span>
                                    {t.user?.isFirstLogin && (
                                        <span className="tp-first-login">First Login Pending</span>
                                    )}
                                </div>
                                <div className="tp-cell tp-cell--actions">
                                    <button className="tp-icon-btn tp-icon-btn--amber" title="Reset Password"
                                        onClick={() => openResetPassword(t)}>
                                        <Edit2 size={12}/>
                                    </button>
                                    <button className="tp-icon-btn" title={t.isActive ? "Deactivate" : "Activate"}
                                        onClick={() => toggleActive(t)}>
                                        {t.isActive ? <ToggleRight size={14} color="#22c55e"/> : <ToggleLeft size={14} color="#64748b"/>}
                                    </button>
                                    <button className="tp-icon-btn tp-icon-btn--red" title="Delete"
                                        onClick={() => handleDelete(t._id)}>
                                        <Trash2 size={12}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="tp-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="tp-modal">
                        <div className="tp-modal-head">
                            <span className="tp-modal-title">{editId ? "Password Reset" : "New Teacher"}</span>
                            <button className="tp-modal-close" onClick={() => setModal(false)}><X size={13}/></button>
                        </div>
                        <div className="tp-modal-body">
                            {!editId && (
                                <>
                                    <div className="tp-field">
                                        <label className="tp-label">Full Name</label>
                                        <input className="tp-input" placeholder="Ramesh Kumar" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
                                    </div>
                                    <div className="tp-field">
                                        <label className="tp-label">Email</label>
                                        <input className="tp-input" type="email" placeholder="teacher@email.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}/>
                                    </div>
                                    <div className="tp-field">
                                        <label className="tp-label">Phone (optional)</label>
                                        <input className="tp-input" placeholder="98xxxxxxxx" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}/>
                                    </div>
                                </>
                            )}
                            {editId && (
                                <div className="tp-reset-info">
                                    <strong>{form.name}</strong> ka password reset karo
                                </div>
                            )}
                            <div className="tp-field">
                                <label className="tp-label">{editId ? "Naya Password" : "Password"}</label>
                                <div className="tp-pwd-wrap">
                                    <input className="tp-input" type={showPwd ? "text" : "password"}
                                        placeholder="••••••••" value={form.password}
                                        onChange={e => setForm(f => ({...f, password: e.target.value}))}/>
                                    <button className="tp-pwd-toggle" onClick={() => setShowPwd(p => !p)}>
                                        {showPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
                                    </button>
                                </div>
                            </div>
                            <div className="tp-modal-footer">
                                <button className="tp-ghost-btn" onClick={() => setModal(false)}>Cancel</button>
                                <button className="tp-amber-btn" onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving..." : editId ? "Reset Password" : "Create Teacher"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
*,*::before,*::after{box-sizing:border-box;}

.tp-root{font-family:'Plus Jakarta Sans',sans-serif;color:#f1f5f9;display:flex;flex-direction:column;gap:18px;max-width:900px;margin:0 auto;padding-bottom:48px;}

.tp-toast{position:fixed;top:20px;right:24px;z-index:9999;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;padding:11px 18px;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.35);animation:tpIn .22s ease;}
.tp-toast--success{background:#052e16;color:#4ade80;border:1px solid #166534;}
.tp-toast--error{background:#2d0a0a;color:#f87171;border:1px solid #7f1d1d;}
@keyframes tpIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

.tp-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.tp-title{font-family:'DM Serif Display',serif;font-size:1.7rem;color:#f8fafc;font-weight:400;margin:0 0 3px;}
.tp-sub{font-size:12px;color:#64748b;margin:0;}
.tp-add-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:9px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#1a1208;transition:opacity .15s;}
.tp-add-btn:hover{opacity:.88;}

.tp-kpi-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.tp-kpi{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:14px 16px;border-left:3px solid #334155;}
.tp-kpi--green{border-left-color:#22c55e;}
.tp-kpi--red{border-left-color:#ef4444;}
.tp-kpi-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#475569;margin-bottom:6px;}
.tp-kpi-val{font-family:'DM Serif Display',serif;font-size:1.4rem;color:#f1f5f9;}

.tp-table-wrap{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;}
.tp-thead{display:grid;grid-template-columns:1.8fr 1fr 1.5fr 1.2fr 120px;gap:8px;padding:10px 18px;background:#111;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569;}
.tp-row{display:grid;grid-template-columns:1.8fr 1fr 1.5fr 1.2fr 120px;gap:8px;padding:13px 18px;border-top:1px solid #222;align-items:center;transition:background .12s;}
.tp-row:hover{background:rgba(255,255,255,.02);}
.tp-cell{font-size:12px;color:#94a3b8;display:flex;align-items:center;gap:8px;}
.tp-cell--name{gap:10px;}
.tp-cell--email{font-size:11px;word-break:break-all;}
.tp-cell--actions{gap:6px;justify-content:flex-end;}

.tp-avatar{width:32px;height:32px;border-radius:50%;background:rgba(99,102,241,.15);color:#818cf8;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;}
.tp-name{font-size:13px;font-weight:700;color:#f1f5f9;}
.tp-phone{font-size:10px;color:#475569;}
.tp-id-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:100px;background:rgba(99,102,241,.1);color:#818cf8;border:1px solid rgba(99,102,241,.2);}
.tp-status{font-size:10px;font-weight:700;padding:2px 9px;border-radius:100px;}
.tp-status.active{background:rgba(34,197,94,.1);color:#22c55e;border:1px solid rgba(34,197,94,.2);}
.tp-status.inactive{background:rgba(100,116,139,.1);color:#64748b;border:1px solid rgba(100,116,139,.2);}
.tp-first-login{font-size:9px;font-weight:700;padding:2px 7px;border-radius:100px;background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2);}

.tp-icon-btn{width:28px;height:28px;border-radius:7px;border:1px solid #2a2a2a;background:transparent;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;}
.tp-icon-btn:hover{background:#222;color:#94a3b8;}
.tp-icon-btn--amber{color:#f59e0b;border-color:rgba(245,158,11,.2);}
.tp-icon-btn--amber:hover{background:rgba(245,158,11,.08);}
.tp-icon-btn--red{color:#ef4444;border-color:rgba(239,68,68,.2);}
.tp-icon-btn--red:hover{background:rgba(239,68,68,.08);}

.tp-empty{background:#1a1a1a;border:1px dashed #2a2a2a;border-radius:12px;padding:48px;text-align:center;color:#475569;font-size:13px;}

/* Modal */
.tp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);z-index:60;display:flex;align-items:center;justify-content:center;padding:20px;}
.tp-modal{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:14px;width:100%;max-width:420px;box-shadow:0 24px 60px rgba(0,0,0,.5);animation:tpIn .18s ease;}
.tp-modal-head{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid #2a2a2a;}
.tp-modal-title{font-family:'DM Serif Display',serif;font-size:1.05rem;color:#f1f5f9;}
.tp-modal-close{width:26px;height:26px;border-radius:7px;border:1px solid #2a2a2a;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;}
.tp-modal-close:hover{background:#222;color:#f1f5f9;}
.tp-modal-body{padding:18px;display:flex;flex-direction:column;gap:12px;}
.tp-modal-footer{display:flex;justify-content:flex-end;gap:8px;padding-top:4px;}

.tp-field{display:flex;flex-direction:column;gap:5px;}
.tp-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#475569;}
.tp-input{background:#0f172a;border:1px solid #2a2a2a;border-radius:9px;padding:9px 12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;outline:none;transition:border-color .13s;width:100%;}
.tp-input:focus{border-color:#f59e0b;}
.tp-pwd-wrap{position:relative;}
.tp-pwd-wrap .tp-input{padding-right:38px;}
.tp-pwd-toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#64748b;cursor:pointer;display:flex;align-items:center;}
.tp-reset-info{font-size:13px;color:#94a3b8;background:#111;border:1px solid #2a2a2a;border-radius:9px;padding:10px 14px;}
.tp-ghost-btn{padding:9px 16px;border-radius:8px;border:1px solid #2a2a2a;background:transparent;color:#64748b;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;}
.tp-amber-btn{padding:9px 18px;border-radius:8px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;background:#f59e0b;color:#1c1400;}
.tp-amber-btn:disabled{opacity:.5;cursor:not-allowed;}

@media(max-width:700px){
    .tp-thead,.tp-row{grid-template-columns:1fr 1fr;}
    .tp-cell--email,.tp-cell:nth-child(3){display:none;}
}
`;