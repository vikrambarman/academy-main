"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, X, Edit2, Trash2, ChevronDown, ChevronUp, Shield, Award, IndianRupee, RefreshCw, Info } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Course { _id: string; name: string; level: string; isActive: boolean; }
interface Franchise { _id: string; name: string; code: string; isOwn: boolean; }
interface CertType {
    _id: string; name: string; code: string;
    issuingBody: string; defaultFee: number;
    franchise: { _id: string };
}

// Per-cert entry in form
interface CertEntry {
    certTypeId: string;
    isDefault: boolean;
    fee: string;
    registrationFee: string;
    installmentsAllowed: boolean;
    maxInstallments: string;
    minInstallmentAmount: string;
}

interface Config {
    _id: string;
    course: { _id: string; name: string; level: string };
    franchise: { _id: string; name: string; code: string; isOwn: boolean; registeredBodies: string[] };
    defaultCertType: { _id: string; name: string; code: string; issuingBody: string };
    certEntries: {
        certType: { _id: string; name: string; code: string; issuingBody: string };
        isDefault: boolean;
        fee: number;
        registrationFee: number;
        installmentsAllowed: boolean;
        maxInstallments: number;
        minInstallmentAmount: number;
    }[];
    // virtual — backward compat
    feeStructure: { total: number; registrationFee: number; installmentsAllowed: boolean; maxInstallments: number; minInstallmentAmount: number };
    benefits: string[];
    highlights: string[];
    isActive: boolean;
}

interface FormState {
    courseId: string;
    franchiseId: string;
    certEntries: CertEntry[];
    benefits: string[];
    highlights: string[];
}

const EMPTY_CERT_ENTRY = (certTypeId = ""): CertEntry => ({
    certTypeId,
    isDefault: false,
    fee: "",
    registrationFee: "",
    installmentsAllowed: true,
    maxInstallments: "3",
    minInstallmentAmount: "500",
});

const EMPTY_FORM: FormState = {
    courseId: "", franchiseId: "",
    certEntries: [],
    benefits: [""], highlights: [""],
};

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ConfigSkeleton() {
    return (
        <div className="cc-root">
            <div className="cc-header">
                <div>
                    <div className="cc-sk" style={{ width: 240, height: 28, borderRadius: 6 }} />
                    <div className="cc-sk" style={{ width: 300, height: 12, borderRadius: 4, marginTop: 8 }} />
                </div>
                <div className="cc-sk" style={{ width: 120, height: 36, borderRadius: 9 }} />
            </div>
            <div className="cc-sk" style={{ width: "100%", height: 48, borderRadius: 10 }} />
            {[1, 2].map(i => (
                <div key={i} className="cc-course-block">
                    <div className="cc-course-head" style={{ cursor: "default" }}>
                        <div className="cc-sk" style={{ width: 200, height: 14, borderRadius: 4 }} />
                        <div className="cc-sk" style={{ width: 80, height: 12, borderRadius: 4 }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminCourseConfigPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [certTypes, setCertTypes] = useState<CertType[]>([]);
    const [configs, setConfigs] = useState<Config[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editConfig, setEditConfig] = useState<Config | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok }); setTimeout(() => setToast(null), 3500);
    };

    const safeJson = async (url: string): Promise<any[]> => {
        try {
            const r = await fetchWithAuth(url);
            if (!r.ok) return [];
            const d = await r.json();
            return Array.isArray(d) ? d : [];
        } catch { return []; }
    };

    const load = async (showSkeleton = false) => {
        if (showSkeleton) setPageLoading(true);
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
        setPageLoading(false);
    };

    useEffect(() => { load(true); }, []);

    // Cert types for selected franchise
    const filteredCertTypes = form.franchiseId
        ? certTypes.filter(c =>
            c.franchise._id === form.franchiseId ||
            c.franchise._id?.toString() === form.franchiseId
        )
        : [];

    const openCreate = (presetCourseId = "") => {
        setEditConfig(null);
        setForm({ ...EMPTY_FORM, courseId: presetCourseId, certEntries: [] });
        setModal(true);
    };

    const openEdit = (cfg: Config) => {
        setEditConfig(cfg);
        setForm({
            courseId: cfg.course._id,
            franchiseId: cfg.franchise._id,
            certEntries: cfg.certEntries?.map(e => ({
                certTypeId: e.certType._id,
                isDefault: e.isDefault,
                fee: e.fee.toString(),
                registrationFee: e.registrationFee.toString(),
                installmentsAllowed: e.installmentsAllowed,
                maxInstallments: e.maxInstallments.toString(),
                minInstallmentAmount: e.minInstallmentAmount.toString(),
            })) ?? [],
            benefits: cfg.benefits.length ? cfg.benefits : [""],
            highlights: cfg.highlights.length ? cfg.highlights : [""],
        });
        setModal(true);
    };

    // When franchise changes — reset cert entries
    const handleFranchiseChange = (franchiseId: string) => {
        const existing = configs.find(
            cfg => cfg.course._id === form.courseId && cfg.franchise._id === franchiseId
        );
        if (existing && !editConfig) {
            showToast("Config pehle se exist karta hai — edit mode mein switch hua", true);
            openEdit(existing);
            return;
        }
        setForm(p => ({ ...p, franchiseId, certEntries: [] }));
    };

    // Toggle cert type in certEntries
    const toggleCertEntry = (ctId: string) => {
        setForm(p => {
            const exists = p.certEntries.find(e => e.certTypeId === ctId);
            if (exists) {
                // Cannot remove last or default
                if (p.certEntries.length === 1) return p;
                const removed = p.certEntries.filter(e => e.certTypeId !== ctId);
                // If removed was default, set first as default
                const hadDefault = exists.isDefault;
                return {
                    ...p,
                    certEntries: hadDefault
                        ? removed.map((e, i) => i === 0 ? { ...e, isDefault: true } : e)
                        : removed,
                };
            }
            // Add new entry
            const ct = certTypes.find(c => c._id === ctId);
            const newEntry = EMPTY_CERT_ENTRY(ctId);
            newEntry.fee = ct?.defaultFee ? ct.defaultFee.toString() : "";
            // First cert is default
            if (p.certEntries.length === 0) newEntry.isDefault = true;
            return { ...p, certEntries: [...p.certEntries, newEntry] };
        });
    };

    // Set default cert
    const setDefaultCert = (ctId: string) => {
        setForm(p => ({
            ...p,
            certEntries: p.certEntries.map(e => ({ ...e, isDefault: e.certTypeId === ctId })),
        }));
    };

    // Update a field in a cert entry
    const updateCertEntry = (ctId: string, field: keyof CertEntry, value: any) => {
        setForm(p => ({
            ...p,
            certEntries: p.certEntries.map(e =>
                e.certTypeId === ctId ? { ...e, [field]: value } : e
            ),
        }));
    };

    const save = async () => {
        if (!form.courseId || !form.franchiseId)
            return showToast("Course aur Franchise required hain", false);
        if (form.certEntries.length === 0)
            return showToast("Kam se kam ek Certificate Type add karo", false);
        const missingFee = form.certEntries.find(e => !e.fee || Number(e.fee) <= 0);
        if (missingFee) {
            const ct = certTypes.find(c => c._id === missingFee.certTypeId);
            return showToast(`"${ct?.name ?? "Certificate"}" ka fee enter karo`, false);
        }

        setSaving(true);
        try {
            const url = "/api/admin/course-franchise-configs";
            const method = editConfig ? "PUT" : "POST";
            const payload: any = {
                certEntries: form.certEntries.map(e => ({
                    certTypeId: e.certTypeId,
                    isDefault: e.isDefault,
                    fee: Number(e.fee),
                    registrationFee: Number(e.registrationFee) || 0,
                    installmentsAllowed: e.installmentsAllowed,
                    maxInstallments: Number(e.maxInstallments),
                    minInstallmentAmount: Number(e.minInstallmentAmount),
                })),
                benefits: form.benefits.filter(Boolean),
                highlights: form.highlights.filter(Boolean),
            };

            if (editConfig) {
                payload.id = editConfig._id;
            } else {
                payload.courseId = form.courseId;
                payload.franchiseId = form.franchiseId;
            }

            const res = await fetchWithAuth(url, {
                method, headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const d = await res.json();
            if (!res.ok) {
                if (res.status === 400 && d.message?.includes("already exists")) {
                    const existing = configs.find(
                        cfg => cfg.course._id === form.courseId && cfg.franchise._id === form.franchiseId
                    );
                    if (existing) { openEdit(existing); showToast("Config already hai — edit karo", false); return; }
                }
                return showToast(d.message || "Error", false);
            }
            showToast(editConfig ? "Config updated ✓" : "Config created ✓");
            setModal(false);
            load();
        } finally { setSaving(false); }
    };

    const deleteConfig = async (id: string) => {
        if (!confirm("Is config ko delete karna chahte ho?")) return;
        const res = await fetchWithAuth(`/api/admin/course-franchise-configs?id=${id}`, { method: "DELETE" });
        const d = await res.json();
        if (!res.ok) return showToast(d.message || "Delete failed", false);
        showToast("Config deleted");
        load();
    };

    // Group by course
    const configsByCourse: Record<string, Config[]> = {};
    configs.forEach(cfg => {
        const key = cfg.course._id;
        if (!configsByCourse[key]) configsByCourse[key] = [];
        configsByCourse[key].push(cfg);
    });
    const coursesWithConfigs = courses.filter(c => configsByCourse[c._id]?.length > 0);
    const coursesWithout = courses.filter(c => !configsByCourse[c._id]?.length);

    if (pageLoading) return <><style>{styles}</style><ConfigSkeleton /></>;

    return (
        <>
            <style>{styles}</style>
            {toast && (
                <div className={`cc-toast ${toast.ok ? "cc-toast--ok" : "cc-toast--err"}`}>{toast.msg}</div>
            )}

            <div className="cc-root">
                {/* Header */}
                <div className="cc-header">
                    <div>
                        <h1 className="cc-title">Course Franchise Config</h1>
                        <p className="cc-sub">Har course ke liye franchise + certificate types + alag alag fees set karo</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="cc-refresh-btn" onClick={() => load()} title="Refresh"><RefreshCw size={13} /></button>
                        <button className="cc-btn-primary" onClick={() => openCreate()}><Plus size={13} /> Add Config</button>
                    </div>
                </div>

                {/* Info */}
                <div className="cc-info-note">
                    <Info size={12} style={{ flexShrink: 0 }} />
                    Ek course + ek franchise = sirf ek config. Us config mein multiple cert types add karo — har ek ka apna fee, registration fee, aur installment structure hoga.
                </div>

                {/* Courses without config */}
                {coursesWithout.length > 0 && (
                    <div className="cc-no-config-section">
                        <div className="cc-section-label">Config ke bina courses ({coursesWithout.length})</div>
                        <div className="cc-no-config-grid">
                            {coursesWithout.map(c => (
                                <div key={c._id} className="cc-no-config-item">
                                    <div>
                                        <div className="cc-course-name">{c.name}</div>
                                        <div className="cc-course-level">{c.level}</div>
                                    </div>
                                    <button className="cc-btn-sm" onClick={() => openCreate(c._id)}><Plus size={11} /> Add</button>
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
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                                    {cfgs.map(cfg => {
                                        const color = cfg.franchise.isOwn ? "var(--cp-warning)" : "var(--cp-accent)";
                                        const codeBg = cfg.franchise.isOwn ? "rgba(245,158,11,0.12)" : "var(--cp-accent-glow)";
                                        return (
                                            <div key={cfg._id} className="cc-config-card">
                                                {/* Franchise */}
                                                <div className="cc-fc-head">
                                                    <div className="cc-fc-code" style={{ background: codeBg, color }}>{cfg.franchise.code}</div>
                                                    <div className="cc-fc-name">{cfg.franchise.name}</div>
                                                </div>

                                                {/* Cert entries */}
                                                <div className="cc-cert-entries">
                                                    {cfg.certEntries?.map(entry => (
                                                        <div key={entry.certType._id} className={`cc-cert-entry${entry.isDefault ? " cc-cert-entry--default" : ""}`}>
                                                            <div className="cc-cert-entry-head">
                                                                <Award size={10} style={{ color, flexShrink: 0 }} />
                                                                <span className="cc-cert-entry-name">{entry.certType.name}</span>
                                                                {entry.isDefault && (
                                                                    <span className="cc-default-badge">DEFAULT</span>
                                                                )}
                                                            </div>
                                                            <div className="cc-cert-entry-fees">
                                                                <span className="cc-fee-tag">{fmt(entry.fee)}</span>
                                                                {entry.registrationFee > 0 && (
                                                                    <span className="cc-reg-tag">+{fmt(entry.registrationFee)} reg.</span>
                                                                )}
                                                                {entry.installmentsAllowed && (
                                                                    <span className="cc-emi-tag">EMI ×{entry.maxInstallments}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Benefits preview */}
                                                {cfg.benefits.filter(Boolean).slice(0, 2).map((b, i) => (
                                                    <div key={i} className="cc-benefit">✓ {b}</div>
                                                ))}

                                                {/* Actions */}
                                                <div className="cc-config-actions">
                                                    <button className="cc-icon-btn cc-icon-btn--amber" onClick={() => openEdit(cfg)}><Edit2 size={11} /></button>
                                                    <button className="cc-icon-btn cc-icon-btn--danger" onClick={() => deleteConfig(cfg._id)}><Trash2 size={11} /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="cc-add-card" onClick={() => openCreate(course._id)}>
                                        <Plus size={18} style={{ opacity: 0.5 }} />
                                        <span>Add another franchise</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {configs.length === 0 && courses.length > 0 && (
                    <div className="cc-empty">
                        <Shield size={28} style={{ opacity: 0.3 }} />
                        <div>Koi config nahi hai abhi.</div>
                    </div>
                )}
            </div>

            {/* ── Modal ── */}
            {modal && (
                <div className="cc-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="cc-modal">
                        <div className="cc-modal-head">
                            <span>{editConfig ? "Edit Config" : "Add Course Franchise Config"}</span>
                            <button className="cc-icon-btn" onClick={() => setModal(false)}><X size={13} /></button>
                        </div>
                        <div className="cc-modal-body">

                            {editConfig && (
                                <div className="cc-edit-notice">✏️ Edit mode — Course aur Franchise change nahi hogi.</div>
                            )}

                            {/* Step 1 */}
                            <div className="cc-step-label">Step 1 — Course</div>
                            <div className="cc-field">
                                <select className="cc-select" value={form.courseId}
                                    onChange={e => setForm(p => ({ ...p, courseId: e.target.value, franchiseId: "", certEntries: [] }))}
                                    disabled={!!editConfig}>
                                    <option value="">-- Course chunno --</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.level})</option>)}
                                </select>
                            </div>

                            {/* Step 2 */}
                            <div className="cc-step-label">Step 2 — Franchise</div>
                            <div className="cc-field">
                                <select className="cc-select" value={form.franchiseId}
                                    onChange={e => handleFranchiseChange(e.target.value)}
                                    disabled={!!editConfig}>
                                    <option value="">-- Franchise chunno --</option>
                                    {franchises.map(f => (
                                        <option key={f._id} value={f._id}>
                                            {f.name} ({f.code}){f.isOwn ? " — Own" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Step 3 — Cert types with per-cert fee */}
                            {form.franchiseId && (
                                <>
                                    <div className="cc-step-label">Step 3 — Certificate Types & Fees</div>
                                    <div style={{ fontSize: 10, color: "var(--cp-muted)", marginBottom: 8, lineHeight: 1.5 }}>
                                        Har cert type ko tick karo — uska apna fee, registration fee, aur installment structure set karo. Radio se ek ko Default banao.
                                    </div>

                                    {filteredCertTypes.length === 0 ? (
                                        <div style={{ fontSize: 11, color: "var(--cp-warning)", padding: "8px 0" }}>
                                            Is franchise ke liye koi cert type nahi. Franchises page pe pehle add karo.
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {filteredCertTypes.map(ct => {
                                                const entry = form.certEntries.find(e => e.certTypeId === ct._id);
                                                const selected = !!entry;
                                                const isDefault = entry?.isDefault ?? false;

                                                return (
                                                    <div key={ct._id} className={`cc-cert-option${selected ? " cc-cert-option--sel" : ""}`}>
                                                        {/* Header row */}
                                                        <div className="cc-cert-option-head">
                                                            <label style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, cursor: "pointer" }}>
                                                                <input type="checkbox" checked={selected}
                                                                    onChange={() => toggleCertEntry(ct._id)}
                                                                    style={{ accentColor: "var(--cp-accent)", width: 14, height: 14 }} />
                                                                <div>
                                                                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--cp-text)" }}>{ct.name}</div>
                                                                    <div style={{ fontSize: 10, color: "var(--cp-muted)" }}>{ct.issuingBody}</div>
                                                                </div>
                                                            </label>
                                                            {selected && (
                                                                <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: isDefault ? "var(--cp-accent)" : "var(--cp-muted)", cursor: "pointer", fontWeight: isDefault ? 700 : 400, flexShrink: 0 }}>
                                                                    <input type="radio" name="defaultCert" checked={isDefault}
                                                                        onChange={() => setDefaultCert(ct._id)}
                                                                        style={{ accentColor: "var(--cp-accent)" }} />
                                                                    {isDefault ? "Default ✓" : "Set Default"}
                                                                </label>
                                                            )}
                                                        </div>

                                                        {/* Fee fields — only when selected */}
                                                        {selected && entry && (
                                                            <div className="cc-cert-fee-grid">
                                                                <div className="cc-field">
                                                                    <label className="cc-label">Course Fee (₹) *</label>
                                                                    <input className="cc-input" type="number"
                                                                        placeholder="e.g. 4500"
                                                                        value={entry.fee}
                                                                        onChange={e => updateCertEntry(ct._id, "fee", e.target.value)} />
                                                                </div>
                                                                <div className="cc-field">
                                                                    <label className="cc-label">Registration Fee (₹)</label>
                                                                    <input className="cc-input" type="number"
                                                                        placeholder="e.g. 200"
                                                                        value={entry.registrationFee}
                                                                        onChange={e => updateCertEntry(ct._id, "registrationFee", e.target.value)} />
                                                                </div>
                                                                <div className="cc-field">
                                                                    <label className="cc-label">Max Installments</label>
                                                                    <input className="cc-input" type="number"
                                                                        value={entry.maxInstallments}
                                                                        onChange={e => updateCertEntry(ct._id, "maxInstallments", e.target.value)} />
                                                                </div>
                                                                <div className="cc-field">
                                                                    <label className="cc-label">Min Installment (₹)</label>
                                                                    <input className="cc-input" type="number"
                                                                        value={entry.minInstallmentAmount}
                                                                        onChange={e => updateCertEntry(ct._id, "minInstallmentAmount", e.target.value)} />
                                                                </div>
                                                                <div className="cc-field" style={{ gridColumn: "1/-1" }}>
                                                                    <label className="cc-checkbox">
                                                                        <input type="checkbox"
                                                                            checked={entry.installmentsAllowed}
                                                                            onChange={e => updateCertEntry(ct._id, "installmentsAllowed", e.target.checked)} />
                                                                        Installments allowed
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Step 4 — Benefits */}
                            <div className="cc-step-label">Step 4 — Benefits</div>
                            {form.benefits.map((b, i) => (
                                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                    <input className="cc-input" style={{ flex: 1 }} value={b}
                                        placeholder="e.g. DigiLocker mein stored"
                                        onChange={e => {
                                            const u = [...form.benefits]; u[i] = e.target.value;
                                            setForm(p => ({ ...p, benefits: u }));
                                        }} />
                                    {form.benefits.length > 1 && (
                                        <button className="cc-icon-btn cc-icon-btn--danger"
                                            onClick={() => setForm(p => ({ ...p, benefits: p.benefits.filter((_, j) => j !== i) }))}>
                                            <X size={11} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button className="cc-link-btn" onClick={() => setForm(p => ({ ...p, benefits: [...p.benefits, ""] }))}>
                                <Plus size={10} /> Add benefit
                            </button>

                            {/* Highlights */}
                            <div className="cc-step-label" style={{ marginTop: 8 }}>Highlights</div>
                            {form.highlights.map((h, i) => (
                                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                    <input className="cc-input" style={{ flex: 1 }} value={h}
                                        placeholder="e.g. Government Recognized"
                                        onChange={e => {
                                            const u = [...form.highlights]; u[i] = e.target.value;
                                            setForm(p => ({ ...p, highlights: u }));
                                        }} />
                                    {form.highlights.length > 1 && (
                                        <button className="cc-icon-btn cc-icon-btn--danger"
                                            onClick={() => setForm(p => ({ ...p, highlights: p.highlights.filter((_, j) => j !== i) }))}>
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
    .cc-root  { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }
    .cc-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.3); }
    .cc-toast--ok  { background:rgba(34,197,94,0.12); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); }
    .cc-toast--err { background:rgba(239,68,68,0.12); color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.3); }
    .cc-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .cc-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .cc-sub    { font-size:12px; color:var(--cp-muted); margin-top:3px; }
    .cc-refresh-btn { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-muted); cursor:pointer; transition:all .14s; }
    .cc-refresh-btn:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .cc-info-note  { display:flex; align-items:flex-start; gap:8px; background:var(--cp-accent-glow); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); border-radius:10px; padding:12px 16px; font-size:12px; color:var(--cp-subtext); line-height:1.6; }
    .cc-edit-notice { background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); border-radius:8px; padding:10px 14px; font-size:12px; color:var(--cp-warning); }
    .cc-section-label { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cp-muted); margin-bottom:8px; }
    .cc-no-config-section { display:flex; flex-direction:column; gap:8px; }
    .cc-no-config-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:8px; }
    .cc-no-config-item { background:var(--cp-surface); border:1px dashed var(--cp-border); border-radius:9px; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
    .cc-course-name  { font-size:13px; font-weight:700; color:var(--cp-text); }
    .cc-course-level { font-size:10px; color:var(--cp-muted); margin-top:2px; }
    .cc-course-block { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
    .cc-course-head  { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; transition:background .13s; gap:10px; }
    .cc-course-head:hover { background:var(--cp-accent-glow); }
    .cc-course-level-badge { font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px; background:var(--cp-bg); color:var(--cp-muted); border:1px solid var(--cp-border); }
    .cc-cfg-count { font-size:11px; color:var(--cp-muted); font-weight:600; }
    .cc-configs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:12px; padding:14px 18px; background:var(--cp-bg); border-top:1px solid var(--cp-border); }
    .cc-config-card  { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:10px; padding:14px; }
    .cc-fc-head { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
    .cc-fc-code { font-size:10px; font-weight:800; letter-spacing:.08em; padding:3px 9px; border-radius:6px; }
    .cc-fc-name { font-size:12px; font-weight:700; color:var(--cp-text); }
    .cc-cert-entries { display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
    .cc-cert-entry { background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; padding:8px 10px; }
    .cc-cert-entry--default { border-color:color-mix(in srgb,var(--cp-accent) 30%,transparent); background:var(--cp-accent-glow); }
    .cc-cert-entry-head { display:flex; align-items:center; gap:6px; margin-bottom:5px; }
    .cc-cert-entry-name { font-size:11px; font-weight:700; color:var(--cp-text); flex:1; }
    .cc-default-badge { font-size:8px; font-weight:800; padding:1px 5px; border-radius:4px; background:var(--cp-accent); color:#fff; }
    .cc-cert-entry-fees { display:flex; flex-wrap:wrap; gap:5px; }
    .cc-fee-tag { font-size:11px; font-weight:700; color:var(--cp-success); }
    .cc-reg-tag { font-size:10px; color:var(--cp-warning); font-weight:600; }
    .cc-emi-tag { font-size:10px; color:var(--cp-muted); }
    .cc-benefit { font-size:10px; color:var(--cp-success); margin-bottom:3px; }
    .cc-config-actions { display:flex; gap:6px; margin-top:10px; }
    .cc-add-card { background:transparent; border:1px dashed var(--cp-border); border-radius:10px; padding:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; cursor:pointer; color:var(--cp-muted); font-size:12px; font-weight:500; min-height:120px; transition:all .14s; }
    .cc-add-card:hover { border-color:var(--cp-accent); color:var(--cp-accent); background:var(--cp-accent-glow); }
    .cc-empty { text-align:center; padding:60px 20px; color:var(--cp-muted); display:flex; flex-direction:column; align-items:center; gap:8px; font-size:13px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; }
    .cc-btn-primary { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; white-space:nowrap; }
    .cc-btn-primary:hover { opacity:.88; } .cc-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
    .cc-btn-sm { display:inline-flex; align-items:center; gap:4px; padding:5px 12px; border-radius:7px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .13s; }
    .cc-btn-sm:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .cc-btn-ghost { padding:9px 16px; border-radius:8px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
    .cc-link-btn { display:inline-flex; align-items:center; gap:4px; background:none; border:none; cursor:pointer; font-size:11px; font-weight:600; color:var(--cp-accent); font-family:'Plus Jakarta Sans',sans-serif; padding:3px 0; }
    .cc-icon-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:1px solid var(--cp-border); background:transparent; cursor:pointer; color:var(--cp-muted); transition:all .13s; }
    .cc-icon-btn:hover { background:var(--cp-accent-glow); color:var(--cp-accent); }
    .cc-icon-btn--amber  { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
    .cc-icon-btn--danger { background:rgba(239,68,68,0.08); color:var(--cp-danger); border-color:rgba(239,68,68,0.2); }
    .cc-icon-btn--danger:hover { background:rgba(239,68,68,0.15); }
    .cc-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .cc-modal { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:14px; width:100%; max-width:580px; max-height:92vh; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--cp-border2) transparent; animation:ccIn .18s ease; }
    @keyframes ccIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .cc-modal-head { display:flex; align-items:center; justify-content:space-between; padding:15px 18px; border-bottom:1px solid var(--cp-border); font-family:'DM Serif Display',serif; font-size:1.05rem; color:var(--cp-text); position:sticky; top:0; background:var(--cp-surface); z-index:2; }
    .cc-modal-body { padding:18px; display:flex; flex-direction:column; gap:12px; }
    .cc-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding-top:4px; }
    .cc-step-label { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cp-accent); padding-bottom:6px; border-bottom:1px solid color-mix(in srgb,var(--cp-accent) 20%,transparent); }
    .cc-field  { display:flex; flex-direction:column; gap:5px; }
    .cc-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }
    .cc-input, .cc-select { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px; font-size:13px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; color:var(--cp-text); outline:none; transition:border-color .15s; }
    .cc-input:focus,.cc-select:focus { border-color:var(--cp-accent); }
    .cc-input::placeholder { color:var(--cp-muted); }
    .cc-select option { background:var(--cp-surface); }
    .cc-checkbox { display:flex; align-items:center; gap:7px; font-size:13px; color:var(--cp-subtext); cursor:pointer; }
    .cc-checkbox input { width:14px; height:14px; cursor:pointer; accent-color:var(--cp-accent); }
    .cc-cert-option { border:1px solid var(--cp-border); border-radius:10px; background:var(--cp-surface2); overflow:hidden; transition:all .15s; }
    .cc-cert-option--sel { border-color:var(--cp-accent); }
    .cc-cert-option-head { display:flex; align-items:center; gap:8px; padding:10px 12px; }
    .cc-cert-fee-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:10px 12px 12px; background:var(--cp-bg); border-top:1px solid var(--cp-border); }
    .cc-sk { background:linear-gradient(90deg,var(--cp-surface) 25%,var(--cp-surface2) 50%,var(--cp-surface) 75%); background-size:200% 100%; animation:ccShimmer 1.4s infinite; }
    @keyframes ccShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;