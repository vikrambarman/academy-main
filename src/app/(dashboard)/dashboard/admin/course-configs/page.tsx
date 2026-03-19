"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, X, Edit2, Trash2, ChevronDown, ChevronUp, Shield, Award, IndianRupee } from "lucide-react";

interface Course { _id: string; name: string; level: string; isActive: boolean; }
interface Franchise { _id: string; name: string; code: string; isOwn: boolean; }
interface CertType { _id: string; name: string; code: string; issuingBody: string; defaultFee: number; franchise: { _id: string; }; }
interface Config {
    _id: string;
    course: { _id: string; name: string; level: string };
    franchise: { _id: string; name: string; code: string; isOwn: boolean; registeredBodies: string[] };
    defaultCertType: { _id: string; name: string; code: string; issuingBody: string; verificationMethod: string; benefits: string[] };
    availableCertTypes: { _id: string; name: string; code: string }[];
    feeStructure: { total: number; installmentsAllowed: boolean; maxInstallments: number; minInstallmentAmount: number };
    benefits: string[];
    highlights: string[];
    isActive: boolean;
}

export default function AdminCourseConfigPage() {
    const [courses,    setCourses]    = useState<Course[]>([]);
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [certTypes,  setCertTypes]  = useState<CertType[]>([]);
    const [configs,    setConfigs]    = useState<Config[]>([]);
    const [modal,      setModal]      = useState(false);
    const [editConfig, setEditConfig] = useState<Config | null>(null);
    const [saving,     setSaving]     = useState(false);
    const [toast,      setToast]      = useState<{ msg: string; ok: boolean } | null>(null);
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

    const [form, setForm] = useState({
        courseId: "", franchiseId: "", defaultCertTypeId: "",
        total: "", installmentsAllowed: true, maxInstallments: "3",
        minInstallmentAmount: "500",
        benefits: [""], highlights: [""],
    });

    const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

    const load = async () => {
        // Each API call isolated — one failure won't break others
        const safeJson = async (url: string) => {
            try {
                const r = await fetchWithAuth(url);
                if (!r.ok) return [];
                const d = await r.json();
                return Array.isArray(d) ? d : [];
            } catch { return []; }
        };

        const [cr, fr, ct, cfg] = await Promise.all([
            safeJson("/api/admin/courses"),
            safeJson("/api/admin/franchises"),
            safeJson("/api/admin/cert-types"),
            safeJson("/api/admin/course-franchise-configs"),
        ]);

        setCourses(cr.filter((c: Course) => c.isActive));
        setFranchises(fr);
        setCertTypes(ct);
        setConfigs(cfg);
    };

    useEffect(() => { load(); }, []);

    // Filter cert types by selected franchise
    const filteredCertTypes = form.franchiseId
        ? certTypes.filter(c => c.franchise._id === form.franchiseId || c.franchise._id?.toString() === form.franchiseId)
        : certTypes;

    const openCreate = () => {
        setEditConfig(null);
        setForm({ courseId: "", franchiseId: "", defaultCertTypeId: "", total: "", installmentsAllowed: true, maxInstallments: "3", minInstallmentAmount: "500", benefits: [""], highlights: [""] });
        setModal(true);
    };

    const openEdit = (c: Config) => {
        setEditConfig(c);
        setForm({
            courseId:             c.course._id,
            franchiseId:          c.franchise._id,
            defaultCertTypeId:    c.defaultCertType._id,
            total:                c.feeStructure.total.toString(),
            installmentsAllowed:  c.feeStructure.installmentsAllowed,
            maxInstallments:      c.feeStructure.maxInstallments.toString(),
            minInstallmentAmount: c.feeStructure.minInstallmentAmount.toString(),
            benefits:             c.benefits.length ? c.benefits : [""],
            highlights:           c.highlights.length ? c.highlights : [""],
        });
        setModal(true);
    };

    // Auto-fill fee when certType selected
    const handleCertTypeChange = (ctId: string) => {
        const ct = certTypes.find(c => c._id === ctId);
        setForm(p => ({
            ...p,
            defaultCertTypeId: ctId,
            total: ct?.defaultFee ? ct.defaultFee.toString() : p.total,
        }));
    };

    const save = async () => {
        if (!form.courseId || !form.franchiseId || !form.defaultCertTypeId)
            return showToast("Course, Franchise aur Cert Type required", false);
        if (!form.total || Number(form.total) <= 0)
            return showToast("Fee amount required", false);

        setSaving(true);
        try {
            if (editConfig) {
                const res = await fetchWithAuth("/api/admin/course-franchise-configs", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: editConfig._id,
                        defaultCertTypeId: form.defaultCertTypeId,
                        feeStructure: {
                            total: Number(form.total),
                            installmentsAllowed: form.installmentsAllowed,
                            maxInstallments: Number(form.maxInstallments),
                            minInstallmentAmount: Number(form.minInstallmentAmount),
                        },
                        benefits:   form.benefits.filter(Boolean),
                        highlights: form.highlights.filter(Boolean),
                    }),
                });
                const d = await res.json();
                if (!res.ok) return showToast(d.message || "Error", false);
                showToast("Config updated");
            } else {
                const res = await fetchWithAuth("/api/admin/course-franchise-configs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        courseId:          form.courseId,
                        franchiseId:       form.franchiseId,
                        defaultCertTypeId: form.defaultCertTypeId,
                        feeStructure: {
                            total: Number(form.total),
                            installmentsAllowed: form.installmentsAllowed,
                            maxInstallments: Number(form.maxInstallments),
                            minInstallmentAmount: Number(form.minInstallmentAmount),
                        },
                        benefits:   form.benefits.filter(Boolean),
                        highlights: form.highlights.filter(Boolean),
                    }),
                });
                const d = await res.json();
                if (!res.ok) return showToast(d.message || "Error", false);
                showToast("Config created");
            }
            setModal(false);
            load();
        } finally { setSaving(false); }
    };

    const deleteConfig = async (id: string) => {
        if (!confirm("Delete this config?")) return;
        const res = await fetchWithAuth(`/api/admin/course-franchise-configs?id=${id}`, { method: "DELETE" });
        const d = await res.json();
        if (!res.ok) return showToast(d.message || "Delete failed", false);
        showToast("Deleted");
        load();
    };

    // Group configs by course
    const configsByCourse: Record<string, Config[]> = {};
    configs.forEach(cfg => {
        const key = cfg.course._id;
        if (!configsByCourse[key]) configsByCourse[key] = [];
        configsByCourse[key].push(cfg);
    });

    // Courses with configs
    const coursesWithConfigs = courses.filter(c => configsByCourse[c._id]?.length > 0);
    const coursesWithout = courses.filter(c => !configsByCourse[c._id]?.length);

    return (
        <>
            <style>{styles}</style>
            {toast && <div className={`cc-toast ${toast.ok ? "ok" : "err"}`}>{toast.msg}</div>}
            <div className="cc-root">

                <div className="cc-header">
                    <div>
                        <h1 className="cc-title">Course Franchise Config</h1>
                        <p className="cc-sub">Har course ke liye franchise + fee + certificate type set karo</p>
                    </div>
                    <button className="cc-btn-primary" onClick={openCreate}>
                        <Plus size={13} /> Add Config
                    </button>
                </div>

                {/* Info note */}
                <div className="cc-info-note">
                    Yahan aap define karte ho: "DCA + GSDM = Medhavi Diploma + ₹4500" aur "DCA + Drishti = Drishti Cert + ₹3800". Jab admin student enroll karta hai, yahi configs franchise selection mein dikhte hain.
                </div>

                {/* Courses without any config */}
                {coursesWithout.length > 0 && (
                    <div className="cc-no-config-section">
                        <div className="cc-section-label">Courses with no franchise config ({coursesWithout.length})</div>
                        <div className="cc-no-config-grid">
                            {coursesWithout.map(c => (
                                <div key={c._id} className="cc-no-config-item">
                                    <div>
                                        <div className="cc-course-name">{c.name}</div>
                                        <div className="cc-course-level">{c.level}</div>
                                    </div>
                                    <button className="cc-btn-sm" onClick={() => {
                                        setForm(p => ({ ...p, courseId: c._id }));
                                        setEditConfig(null);
                                        setModal(true);
                                    }}>
                                        <Plus size={11} /> Add Config
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Courses with configs */}
                {coursesWithConfigs.map(course => {
                    const cfgs = configsByCourse[course._id] || [];
                    const isOpen = expandedCourse === course._id;
                    return (
                        <div key={course._id} className="cc-course-block">
                            <div className="cc-course-head" onClick={() => setExpandedCourse(isOpen ? null : course._id)}>
                                <div>
                                    <span className="cc-course-name">{course.name}</span>
                                    <span className="cc-course-level-badge">{course.level}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="cc-cfg-count">{cfgs.length} franchise{cfgs.length !== 1 ? "s" : ""}</span>
                                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </div>
                            </div>

                            {isOpen && (
                                <div className="cc-configs-grid">
                                    {cfgs.map(cfg => (
                                        <div key={cfg._id} className="cc-config-card">
                                            {/* Franchise badge */}
                                            <div className="cc-fc-head">
                                                <div className="cc-fc-code" style={{ background: cfg.franchise.isOwn ? "rgba(245,158,11,0.15)" : "var(--cp-accent-glow)", color: cfg.franchise.isOwn ? "var(--cp-warning)" : "var(--cp-accent)" }}>
                                                    {cfg.franchise.code}
                                                </div>
                                                <div className="cc-fc-name">{cfg.franchise.name}</div>
                                            </div>

                                            {/* Reg bodies */}
                                            <div className="cc-reg-bodies">
                                                {cfg.franchise.registeredBodies?.slice(0, 3).map(b => (
                                                    <span key={b} className="cc-body-pill">{b}</span>
                                                ))}
                                            </div>

                                            {/* Cert type */}
                                            <div className="cc-cert-row">
                                                <Award size={11} style={{ color: "var(--cp-accent)", flexShrink: 0 }} />
                                                <div>
                                                    <div className="cc-cert-name">{cfg.defaultCertType.name}</div>
                                                    <div className="cc-cert-issuer">{cfg.defaultCertType.issuingBody}</div>
                                                </div>
                                            </div>

                                            {/* Fee */}
                                            <div className="cc-fee-row">
                                                <IndianRupee size={12} style={{ color: "var(--cp-success)" }} />
                                                <span className="cc-fee-amount">₹{cfg.feeStructure.total.toLocaleString("en-IN")}</span>
                                                {cfg.feeStructure.installmentsAllowed && (
                                                    <span className="cc-installment-note">upto {cfg.feeStructure.maxInstallments} installments</span>
                                                )}
                                            </div>

                                            {/* Benefits */}
                                            {cfg.benefits.slice(0, 3).map((b, i) => (
                                                <div key={i} className="cc-benefit">✓ {b}</div>
                                            ))}

                                            {/* Actions */}
                                            <div className="cc-config-actions">
                                                <button className="cc-icon-btn amber" onClick={() => openEdit(cfg)}><Edit2 size={11} /></button>
                                                <button className="cc-icon-btn danger" onClick={() => deleteConfig(cfg._id)}><Trash2 size={11} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Add another franchise for same course */}
                                    <div className="cc-add-card" onClick={() => {
                                        setForm(p => ({ ...p, courseId: course._id, franchiseId: "", defaultCertTypeId: "" }));
                                        setEditConfig(null);
                                        setModal(true);
                                    }}>
                                        <Plus size={18} style={{ opacity: .5 }} />
                                        <span>Add another franchise</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {configs.length === 0 && courses.length > 0 && (
                    <div className="cc-empty">
                        <Shield size={28} style={{ opacity: .3 }} />
                        <div>Koi config nahi hai abhi.</div>
                        <div style={{ fontSize: 11 }}>Add Config button se pehla config banao.</div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="cc-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="cc-modal">
                        <div className="cc-modal-head">
                            <span>{editConfig ? "Edit Config" : "Add Course Franchise Config"}</span>
                            <button className="cc-icon-btn" onClick={() => setModal(false)}><X size={13} /></button>
                        </div>
                        <div className="cc-modal-body">

                            {/* Step 1: Course */}
                            <div className="cc-step-label">Step 1 — Course select karo</div>
                            <div className="cc-field">
                                <select className="cc-select" value={form.courseId}
                                    onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
                                    disabled={!!editConfig}>
                                    <option value="">-- Course chunno --</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.level})</option>)}
                                </select>
                            </div>

                            {/* Step 2: Franchise */}
                            <div className="cc-step-label">Step 2 — Franchise select karo</div>
                            <div className="cc-field">
                                <select className="cc-select" value={form.franchiseId}
                                    onChange={e => setForm(p => ({ ...p, franchiseId: e.target.value, defaultCertTypeId: "" }))}
                                    disabled={!!editConfig}>
                                    <option value="">-- Franchise chunno --</option>
                                    {franchises.map(f => <option key={f._id} value={f._id}>{f.name} ({f.code}){f.isOwn ? " — Own" : ""}</option>)}
                                </select>
                            </div>

                            {/* Step 3: Cert Type */}
                            {form.franchiseId && (
                                <>
                                    <div className="cc-step-label">Step 3 — Certificate Type select karo</div>
                                    <div className="cc-field">
                                        <select className="cc-select" value={form.defaultCertTypeId}
                                            onChange={e => handleCertTypeChange(e.target.value)}>
                                            <option value="">-- Cert type chunno --</option>
                                            {filteredCertTypes.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name} — {c.issuingBody} (₹{c.defaultFee})
                                                </option>
                                            ))}
                                        </select>
                                        {filteredCertTypes.length === 0 && (
                                            <div style={{ fontSize: 11, color: "var(--cp-warning)", marginTop: 6 }}>
                                                Is franchise ke liye koi cert type nahi. Pehle Franchises page pe cert type add karo.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Step 4: Fee */}
                            <div className="cc-step-label">Step 4 — Fee Structure</div>
                            <div className="cc-form-grid">
                                <div className="cc-field">
                                    <label className="cc-label">Total Fee (₹) *</label>
                                    <input className="cc-input" type="number" value={form.total}
                                        onChange={e => setForm(p => ({ ...p, total: e.target.value }))}
                                        placeholder="e.g. 4500" />
                                </div>
                                <div className="cc-field">
                                    <label className="cc-label">Max Installments</label>
                                    <input className="cc-input" type="number" value={form.maxInstallments}
                                        onChange={e => setForm(p => ({ ...p, maxInstallments: e.target.value }))} />
                                </div>
                                <div className="cc-field">
                                    <label className="cc-label">Min Installment Amount (₹)</label>
                                    <input className="cc-input" type="number" value={form.minInstallmentAmount}
                                        onChange={e => setForm(p => ({ ...p, minInstallmentAmount: e.target.value }))} />
                                </div>
                                <div className="cc-field" style={{ justifyContent: "flex-end", paddingTop: 20 }}>
                                    <label className="cc-checkbox">
                                        <input type="checkbox" checked={form.installmentsAllowed}
                                            onChange={e => setForm(p => ({ ...p, installmentsAllowed: e.target.checked }))} />
                                        Installments allowed
                                    </label>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="cc-step-label">Step 5 — Benefits (student portal mein dikhega)</div>
                            {form.benefits.map((b, i) => (
                                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                    <input className="cc-input" style={{ flex: 1 }} value={b}
                                        onChange={e => { const u = [...form.benefits]; u[i] = e.target.value; setForm(p => ({ ...p, benefits: u })); }}
                                        placeholder="e.g. DigiLocker mein stored" />
                                    {form.benefits.length > 1 && (
                                        <button className="cc-icon-btn danger" onClick={() => setForm(p => ({ ...p, benefits: p.benefits.filter((_, j) => j !== i) }))}>
                                            <X size={11} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button className="cc-link-btn" onClick={() => setForm(p => ({ ...p, benefits: [...p.benefits, ""] }))}>
                                <Plus size={10} /> Add benefit
                            </button>

                            {/* Highlights */}
                            <div className="cc-step-label" style={{ marginTop: 8 }}>Highlights (admission form mein dikhega)</div>
                            {form.highlights.map((h, i) => (
                                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                    <input className="cc-input" style={{ flex: 1 }} value={h}
                                        onChange={e => { const u = [...form.highlights]; u[i] = e.target.value; setForm(p => ({ ...p, highlights: u })); }}
                                        placeholder="e.g. Government Recognized" />
                                    {form.highlights.length > 1 && (
                                        <button className="cc-icon-btn danger" onClick={() => setForm(p => ({ ...p, highlights: p.highlights.filter((_, j) => j !== i) }))}>
                                            <X size={11} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button className="cc-link-btn" onClick={() => setForm(p => ({ ...p, highlights: [...p.highlights, ""] }))}>
                                <Plus size={10} /> Add highlight
                            </button>

                            <div className="cc-modal-footer">
                                <button className="cc-btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                                <button className="cc-btn-primary" onClick={save} disabled={saving}>
                                    {saving ? "Saving..." : editConfig ? "Update Config" : "Create Config"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .cc-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }
    .cc-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; }
    .cc-toast.ok  { background:rgba(34,197,94,0.12); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); }
    .cc-toast.err { background:rgba(239,68,68,0.12); color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.3); }
    .cc-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .cc-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .cc-sub    { font-size:12px; color:var(--cp-muted); margin-top:3px; }
    .cc-info-note { background:var(--cp-accent-glow); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); border-radius:10px; padding:12px 16px; font-size:12px; color:var(--cp-subtext); line-height:1.6; }
    .cc-section-label { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cp-muted); margin-bottom:8px; }
    .cc-no-config-section { display:flex; flex-direction:column; gap:8px; }
    .cc-no-config-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:8px; }
    .cc-no-config-item { background:var(--cp-surface); border:1px dashed var(--cp-border); border-radius:9px; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
    .cc-course-name  { font-size:13px; font-weight:700; color:var(--cp-text); }
    .cc-course-level { font-size:10px; color:var(--cp-muted); margin-top:2px; }
    .cc-course-block { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
    .cc-course-head  { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; transition:background .13s; gap:10px; }
    .cc-course-head:hover { background:var(--cp-accent-glow); }
    .cc-course-level-badge { font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px; background:var(--cp-bg); color:var(--cp-muted); border:1px solid var(--cp-border); margin-left:10px; }
    .cc-cfg-count { font-size:11px; color:var(--cp-muted); font-weight:600; }
    .cc-configs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:12px; padding:14px 18px; background:var(--cp-bg); border-top:1px solid var(--cp-border); }
    .cc-config-card { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:10px; padding:14px; position:relative; }
    .cc-fc-head { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
    .cc-fc-code { font-size:10px; font-weight:800; letter-spacing:.08em; padding:3px 9px; border-radius:6px; }
    .cc-fc-name { font-size:12px; font-weight:700; color:var(--cp-text); }
    .cc-reg-bodies { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:10px; }
    .cc-body-pill { font-size:9px; font-weight:600; padding:2px 7px; border-radius:100px; background:var(--cp-bg); color:var(--cp-muted); border:1px solid var(--cp-border); }
    .cc-cert-row { display:flex; align-items:flex-start; gap:6px; margin-bottom:8px; padding:8px 10px; background:var(--cp-bg); border-radius:7px; }
    .cc-cert-name   { font-size:11px; font-weight:700; color:var(--cp-text); line-height:1.3; }
    .cc-cert-issuer { font-size:10px; color:var(--cp-muted); margin-top:2px; }
    .cc-fee-row { display:flex; align-items:center; gap:5px; margin-bottom:8px; }
    .cc-fee-amount { font-size:14px; font-weight:800; color:var(--cp-success); }
    .cc-installment-note { font-size:10px; color:var(--cp-muted); }
    .cc-benefit { font-size:10px; color:var(--cp-success); margin-bottom:3px; }
    .cc-config-actions { display:flex; gap:6px; margin-top:10px; }
    .cc-add-card { background:transparent; border:1px dashed var(--cp-border); border-radius:10px; padding:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; cursor:pointer; color:var(--cp-muted); font-size:12px; font-weight:500; min-height:120px; transition:all .14s; }
    .cc-add-card:hover { border-color:var(--cp-accent); color:var(--cp-accent); background:var(--cp-accent-glow); }
    .cc-empty { text-align:center; padding:60px 20px; color:var(--cp-muted); display:flex; flex-direction:column; align-items:center; gap:8px; font-size:13px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; }
    .cc-btn-primary { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; white-space:nowrap; }
    .cc-btn-primary:hover { opacity:.88; }
    .cc-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
    .cc-btn-sm { display:inline-flex; align-items:center; gap:4px; padding:5px 12px; border-radius:7px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; }
    .cc-btn-sm:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .cc-btn-ghost { padding:9px 16px; border-radius:8px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
    .cc-link-btn { display:inline-flex; align-items:center; gap:4px; background:none; border:none; cursor:pointer; font-size:11px; font-weight:600; color:var(--cp-accent); font-family:'Plus Jakarta Sans',sans-serif; padding:3px 0; }
    .cc-icon-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:1px solid var(--cp-border); background:transparent; cursor:pointer; color:var(--cp-muted); transition:all .13s; }
    .cc-icon-btn.amber { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
    .cc-icon-btn.danger { background:rgba(239,68,68,0.08); color:var(--cp-danger); border-color:rgba(239,68,68,0.2); }
    .cc-icon-btn:hover { background:var(--cp-accent-glow); color:var(--cp-accent); }
    .cc-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .cc-modal { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:14px; width:100%; max-width:560px; max-height:92vh; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--cp-border2) transparent; animation:ccIn .18s ease; }
    @keyframes ccIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .cc-modal-head { display:flex; align-items:center; justify-content:space-between; padding:15px 18px; border-bottom:1px solid var(--cp-border); font-family:'DM Serif Display',serif; font-size:1.05rem; color:var(--cp-text); position:sticky; top:0; background:var(--cp-surface); z-index:2; }
    .cc-modal-body { padding:18px; display:flex; flex-direction:column; gap:12px; }
    .cc-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding-top:4px; }
    .cc-step-label { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cp-accent); padding-bottom:6px; border-bottom:1px solid color-mix(in srgb,var(--cp-accent) 20%,transparent); }
    .cc-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    @media(max-width:560px){ .cc-form-grid { grid-template-columns:1fr; } }
    .cc-field { display:flex; flex-direction:column; gap:5px; }
    .cc-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }
    .cc-input, .cc-select { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px; font-size:13px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; color:var(--cp-text); outline:none; transition:border-color .15s; }
    .cc-input:focus,.cc-select:focus { border-color:var(--cp-accent); }
    .cc-input::placeholder { color:var(--cp-border2); }
    .cc-select option { background:var(--cp-surface); }
    .cc-checkbox { display:flex; align-items:center; gap:7px; font-size:13px; color:var(--cp-subtext); cursor:pointer; }
    .cc-checkbox input { width:14px; height:14px; cursor:pointer; accent-color:var(--cp-accent); }
`;