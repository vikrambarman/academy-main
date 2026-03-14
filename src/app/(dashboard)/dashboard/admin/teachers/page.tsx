// src/app/dashboard/admin/teachers/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Plus, X, Edit2, Trash2, ToggleLeft, ToggleRight,
    CheckCircle, AlertCircle, Eye, EyeOff, Key, UserCog, Phone, Mail, User
} from "lucide-react";

interface Teacher {
    _id: string;
    name: string;
    employeeId: string;
    phone?: string;
    isActive: boolean;
    user: { email: string; academyId: string; isFirstLogin: boolean; isActive: boolean };
}

type ModalMode = "create" | "edit" | "reset-password";

export default function AdminTeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [modal,    setModal]    = useState<ModalMode | null>(null);
    const [selected, setSelected] = useState<Teacher | null>(null);
    const [toast,    setToast]    = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [saving,   setSaving]   = useState(false);
    const [showPwd,  setShowPwd]  = useState(false);

    const [form, setForm] = useState({
        name: "", email: "", phone: "", password: "", confirmPassword: "",
    });

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg }); setTimeout(() => setToast(null), 3500);
    };

    const load = useCallback(async () => {
        const res = await fetchWithAuth("/api/admin/teachers");
        const d   = await res.json();
        setTeachers(d.teachers || []);
    }, []);

    useEffect(() => { load(); }, [load]);

    /* ── open modals ── */
    const openCreate = () => {
        setSelected(null);
        setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
        setShowPwd(false);
        setModal("create");
    };

    const openEdit = (t: Teacher) => {
        setSelected(t);
        setForm({ name: t.name, email: t.user?.email, phone: t.phone || "", password: "", confirmPassword: "" });
        setShowPwd(false);
        setModal("edit");
    };

    const openResetPassword = (t: Teacher) => {
        setSelected(t);
        setForm({ name: t.name, email: "", phone: "", password: "", confirmPassword: "" });
        setShowPwd(false);
        setModal("reset-password");
    };

    /* ── save ── */
    const handleSave = async () => {
        setSaving(true);
        try {
            if (modal === "create") {
                if (!form.name || !form.email || !form.password)
                    return showToast("error", "Name, email aur password required hain");
                if (form.password !== form.confirmPassword)
                    return showToast("error", "Passwords match nahi kar rahe");

                const res = await fetchWithAuth("/api/admin/teachers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.message);
                showToast("success", `Teacher create ho gaya — ID: ${d.teacher?.employeeId}`);

            } else if (modal === "edit") {
                if (!form.name) return showToast("error", "Name required hai");
                const res = await fetchWithAuth("/api/admin/teachers", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ teacherId: selected!._id, name: form.name, phone: form.phone }),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.message);
                showToast("success", "Teacher details update ho gaye");

            } else if (modal === "reset-password") {
                if (!form.password) return showToast("error", "Naya password daalo");
                if (form.password !== form.confirmPassword) return showToast("error", "Passwords match nahi kar rahe");
                const res = await fetchWithAuth("/api/admin/teachers", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ teacherId: selected!._id, password: form.password }),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.message);
                showToast("success", "Password reset ho gaya");
            }

            setModal(null);
            load();
        } catch (e: any) {
            showToast("error", e.message || "Error hua");
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
        if (!confirm("Is teacher ko permanently delete karna chahte ho?")) return;
        const res = await fetchWithAuth(`/api/admin/teachers?id=${id}`, { method: "DELETE" });
        if (res.ok) { showToast("success", "Teacher delete ho gaya"); load(); }
    };

    const closeModal = () => setModal(null);

    /* ── modal title / icon ── */
    const modalMeta = {
        "create":         { title: "New Teacher",     icon: <Plus size={14}/> },
        "edit":           { title: "Edit Teacher",    icon: <UserCog size={14}/> },
        "reset-password": { title: "Reset Password",  icon: <Key size={14}/> },
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

                {/* KPIs */}
                <div className="tp-kpi-row">
                    {[
                        { label: "Total",    val: teachers.length,                        color: "#334155" },
                        { label: "Active",   val: teachers.filter(t => t.isActive).length, color: "#22c55e" },
                        { label: "Inactive", val: teachers.filter(t => !t.isActive).length,color: "#ef4444" },
                    ].map(k => (
                        <div key={k.label} className="tp-kpi" style={{ borderLeftColor: k.color }}>
                            <div className="tp-kpi-label">{k.label}</div>
                            <div className="tp-kpi-val" style={{ color: k.color }}>{k.val}</div>
                        </div>
                    ))}
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
                            <span style={{ textAlign: "right" }}>Actions</span>
                        </div>
                        {teachers.map(t => (
                            <div key={t._id} className="tp-row">
                                <div className="tp-cell tp-cell--name">
                                    <div className="tp-avatar">{t.name?.charAt(0).toUpperCase()}</div>
                                    <div>
                                        <div className="tp-name">{t.name}</div>
                                        {t.phone && <div className="tp-phone">📞 {t.phone}</div>}
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
                                        <span className="tp-first-badge">First Login Pending</span>
                                    )}
                                </div>
                                <div className="tp-cell tp-cell--actions">
                                    {/* Edit details */}
                                    <button className="tp-icon-btn tp-icon-btn--teal" title="Edit Details"
                                        onClick={() => openEdit(t)}>
                                        <Edit2 size={12}/>
                                    </button>
                                    {/* Reset password */}
                                    <button className="tp-icon-btn tp-icon-btn--amber" title="Reset Password"
                                        onClick={() => openResetPassword(t)}>
                                        <Key size={12}/>
                                    </button>
                                    {/* Toggle active */}
                                    <button className="tp-icon-btn" title={t.isActive ? "Deactivate" : "Activate"}
                                        onClick={() => toggleActive(t)}>
                                        {t.isActive
                                            ? <ToggleRight size={15} color="#22c55e"/>
                                            : <ToggleLeft  size={15} color="#64748b"/>
                                        }
                                    </button>
                                    {/* Delete */}
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

            {/* ── Modal ── */}
            {modal && (
                <div className="tp-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="tp-modal">

                        <div className="tp-modal-head">
                            <div className="tp-modal-title-wrap">
                                <span className="tp-modal-icon">{modalMeta[modal].icon}</span>
                                <span className="tp-modal-title">{modalMeta[modal].title}</span>
                            </div>
                            <button className="tp-modal-close" onClick={closeModal}><X size={13}/></button>
                        </div>

                        <div className="tp-modal-body">

                            {/* CREATE fields */}
                            {modal === "create" && (
                                <>
                                    <div className="tp-field">
                                        <label className="tp-label"><User size={10}/> Full Name *</label>
                                        <input className="tp-input" placeholder="Ramesh Kumar"
                                            value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
                                    </div>
                                    <div className="tp-field">
                                        <label className="tp-label"><Mail size={10}/> Email *</label>
                                        <input className="tp-input" type="email" placeholder="teacher@email.com"
                                            value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}/>
                                    </div>
                                    <div className="tp-field">
                                        <label className="tp-label"><Phone size={10}/> Phone (optional)</label>
                                        <input className="tp-input" placeholder="98xxxxxxxx"
                                            value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}/>
                                    </div>
                                    <div className="tp-pwd-row">
                                        <div className="tp-field">
                                            <label className="tp-label"><Key size={10}/> Password *</label>
                                            <div className="tp-pwd-wrap">
                                                <input className="tp-input" type={showPwd ? "text" : "password"} placeholder="••••••••"
                                                    value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}/>
                                                <button type="button" className="tp-eye" onClick={() => setShowPwd(p => !p)}>
                                                    {showPwd ? <EyeOff size={13}/> : <Eye size={13}/>}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="tp-field">
                                            <label className="tp-label"><Key size={10}/> Confirm Password *</label>
                                            <div className="tp-pwd-wrap">
                                                <input className="tp-input" type={showPwd ? "text" : "password"} placeholder="••••••••"
                                                    value={form.confirmPassword} onChange={e => setForm(f => ({...f, confirmPassword: e.target.value}))}/>
                                            </div>
                                        </div>
                                    </div>
                                    {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                                        <div className="tp-pwd-mismatch">⚠ Passwords match nahi kar rahe</div>
                                    )}
                                </>
                            )}

                            {/* EDIT fields */}
                            {modal === "edit" && (
                                <>
                                    <div className="tp-edit-info">
                                        <div className="tp-edit-av">{selected?.name?.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div className="tp-edit-id">{selected?.employeeId}</div>
                                            <div className="tp-edit-email">{selected?.user?.email}</div>
                                        </div>
                                    </div>
                                    <div className="tp-field">
                                        <label className="tp-label"><User size={10}/> Full Name *</label>
                                        <input className="tp-input" placeholder="Ramesh Kumar"
                                            value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
                                    </div>
                                    <div className="tp-field">
                                        <label className="tp-label"><Phone size={10}/> Phone</label>
                                        <input className="tp-input" placeholder="98xxxxxxxx"
                                            value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}/>
                                    </div>
                                    <div className="tp-edit-note">
                                        💡 Email aur Employee ID change nahi hoti. Password reset ke liye alag option use karo.
                                    </div>
                                </>
                            )}

                            {/* RESET PASSWORD fields */}
                            {modal === "reset-password" && (
                                <>
                                    <div className="tp-edit-info">
                                        <div className="tp-edit-av">{selected?.name?.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div className="tp-edit-id">{selected?.name}</div>
                                            <div className="tp-edit-email">{selected?.employeeId}</div>
                                        </div>
                                    </div>
                                    <div className="tp-field">
                                        <label className="tp-label"><Key size={10}/> Naya Password *</label>
                                        <div className="tp-pwd-wrap">
                                            <input className="tp-input" type={showPwd ? "text" : "password"} placeholder="••••••••"
                                                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}/>
                                            <button type="button" className="tp-eye" onClick={() => setShowPwd(p => !p)}>
                                                {showPwd ? <EyeOff size={13}/> : <Eye size={13}/>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="tp-field">
                                        <label className="tp-label"><Key size={10}/> Confirm Password *</label>
                                        <div className="tp-pwd-wrap">
                                            <input className="tp-input" type={showPwd ? "text" : "password"} placeholder="••••••••"
                                                value={form.confirmPassword} onChange={e => setForm(f => ({...f, confirmPassword: e.target.value}))}/>
                                        </div>
                                    </div>
                                    {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                                        <div className="tp-pwd-mismatch">⚠ Passwords match nahi kar rahe</div>
                                    )}
                                    <div className="tp-edit-note">
                                        🔐 Password reset hone ke baad teacher ko first login pe change karna padega.
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="tp-modal-footer">
                            <button className="tp-ghost-btn" onClick={closeModal}>Cancel</button>
                            <button className="tp-primary-btn" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : modal === "create" ? "Create Teacher" : modal === "edit" ? "Save Changes" : "Reset Password"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// css const replace karo:
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
*, *::before, *::after { box-sizing: border-box; }

.tp-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:18px; max-width:900px; margin:0 auto; padding-bottom:48px; }

.tp-toast { position:fixed; top:20px; right:24px; z-index:9999; display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600; padding:11px 18px; border-radius:12px; box-shadow:0 8px 28px rgba(0,0,0,.35); animation:tpIn .22s ease; }
.tp-toast--success { background:rgba(34,197,94,0.12); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); }
.tp-toast--error   { background:rgba(239,68,68,0.12); color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.3); }
@keyframes tpIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

.tp-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.tp-title  { font-family:'DM Serif Display',serif; font-size:1.7rem; color:var(--cp-text); font-weight:400; margin:0 0 3px; }
.tp-sub    { font-size:12px; color:var(--cp-muted); margin:0; }
.tp-add-btn { display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; }
.tp-add-btn:hover { opacity:.88; }

.tp-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.tp-kpi { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:10px; padding:14px 16px; border-left:3px solid; }
.tp-kpi-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); margin-bottom:6px; }
.tp-kpi-val { font-family:'DM Serif Display',serif; font-size:1.4rem; }

.tp-table-wrap { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
.tp-thead { display:grid; grid-template-columns:1.8fr 1fr 1.6fr 1.2fr 130px; gap:8px; padding:10px 18px; background:var(--cp-surface2); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--cp-muted); }
.tp-row   { display:grid; grid-template-columns:1.8fr 1fr 1.6fr 1.2fr 130px; gap:8px; padding:13px 18px; border-top:1px solid var(--cp-border); align-items:center; transition:background .12s; }
.tp-row:hover { background:var(--cp-accent-glow); }
.tp-cell  { font-size:12px; color:var(--cp-subtext); display:flex; align-items:center; gap:8px; }
.tp-cell--name    { gap:10px; }
.tp-cell--email   { font-size:11px; word-break:break-all; }
.tp-cell--actions { gap:5px; justify-content:flex-end; }

.tp-avatar { width:32px; height:32px; border-radius:50%; background:var(--cp-accent-glow); color:var(--cp-accent); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; flex-shrink:0; }
.tp-name   { font-size:13px; font-weight:700; color:var(--cp-text); }
.tp-phone  { font-size:10px; color:var(--cp-muted); margin-top:1px; }
.tp-id-badge { font-size:10px; font-weight:700; padding:3px 9px; border-radius:100px; background:var(--cp-accent-glow); color:var(--cp-accent); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); }
.tp-status { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; }
.tp-status.active   { background:rgba(34,197,94,0.1);   color:var(--cp-success); border:1px solid rgba(34,197,94,0.2);  }
.tp-status.inactive { background:rgba(100,116,139,0.1); color:var(--cp-muted);   border:1px solid rgba(100,116,139,0.2); }
.tp-first-badge { font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; background:rgba(245,158,11,0.1); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.2); white-space:nowrap; }

.tp-icon-btn { width:28px; height:28px; border-radius:7px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; }
.tp-icon-btn:hover        { background:var(--cp-surface2); color:var(--cp-subtext); }
.tp-icon-btn--teal        { color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
.tp-icon-btn--teal:hover  { background:var(--cp-accent-glow); }
.tp-icon-btn--amber       { color:var(--cp-warning); border-color:rgba(245,158,11,0.2); }
.tp-icon-btn--amber:hover { background:rgba(245,158,11,0.08); }
.tp-icon-btn--red         { color:var(--cp-danger); border-color:rgba(239,68,68,0.2); }
.tp-icon-btn--red:hover   { background:rgba(239,68,68,0.08); }

.tp-empty { background:var(--cp-surface); border:1px dashed var(--cp-border); border-radius:12px; padding:48px; text-align:center; color:var(--cp-muted); font-size:13px; }

.tp-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
.tp-modal   { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:16px; width:100%; max-width:460px; box-shadow:0 24px 60px rgba(0,0,0,.5); animation:tpIn .18s ease; }

.tp-modal-head { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--cp-border); }
.tp-modal-title-wrap { display:flex; align-items:center; gap:9px; }
.tp-modal-icon  { width:28px; height:28px; border-radius:8px; background:var(--cp-accent-glow); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); color:var(--cp-accent); display:flex; align-items:center; justify-content:center; }
.tp-modal-title { font-family:'DM Serif Display',serif; font-size:1.05rem; color:var(--cp-text); }
.tp-modal-close { width:26px; height:26px; border-radius:7px; border:1px solid var(--cp-border); background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--cp-muted); transition:all .13s; }
.tp-modal-close:hover { background:var(--cp-surface2); color:var(--cp-text); }

.tp-modal-body   { padding:20px; display:flex; flex-direction:column; gap:13px; }
.tp-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding:14px 20px; border-top:1px solid var(--cp-border); }

.tp-field { display:flex; flex-direction:column; gap:5px; }
.tp-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); display:flex; align-items:center; gap:4px; }
.tp-input { background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:9px; padding:10px 12px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:var(--cp-text); outline:none; transition:border-color .13s; width:100%; }
.tp-input:focus { border-color:var(--cp-accent); }

.tp-pwd-row  { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.tp-pwd-wrap { position:relative; }
.tp-pwd-wrap .tp-input { padding-right:38px; }
.tp-eye { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:transparent; border:none; color:var(--cp-muted); cursor:pointer; display:flex; align-items:center; padding:2px; border-radius:5px; transition:color .13s; }
.tp-eye:hover { color:var(--cp-accent); }

.tp-pwd-mismatch { font-size:12px; color:var(--cp-warning); background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.15); border-radius:8px; padding:8px 12px; }

.tp-edit-info  { display:flex; align-items:center; gap:12px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:10px; padding:12px 14px; }
.tp-edit-av    { width:36px; height:36px; border-radius:50%; background:var(--cp-accent-glow); color:var(--cp-accent); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; flex-shrink:0; }
.tp-edit-id    { font-size:13px; font-weight:700; color:var(--cp-text); }
.tp-edit-email { font-size:11px; color:var(--cp-muted); margin-top:2px; }
.tp-edit-note  { font-size:12px; color:var(--cp-muted); background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; padding:9px 12px; line-height:1.6; }

.tp-ghost-btn   { padding:9px 16px; border-radius:8px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .13s; }
.tp-ghost-btn:hover { border-color:var(--cp-border2); color:var(--cp-subtext); }
.tp-primary-btn { padding:9px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .14s; }
.tp-primary-btn:disabled { opacity:.5; cursor:not-allowed; }

@media(max-width:700px) {
    .tp-thead, .tp-row { grid-template-columns:1fr 1fr; }
    .tp-cell--email { display:none; }
    .tp-pwd-row { grid-template-columns:1fr; }
}
`;