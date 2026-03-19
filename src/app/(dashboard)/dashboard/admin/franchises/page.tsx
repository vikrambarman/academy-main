"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, X, Edit2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Franchise {
    _id: string; name: string; code: string; description?: string;
    registeredBodies: string[]; websiteUrl?: string; portalUrl?: string;
    portalLoginRequired: boolean; isOwn: boolean; isActive: boolean;
}
interface CertType {
    _id: string; name: string; code: string; issuingBody: string;
    verificationMethod: string; verificationUrl?: string;
    benefits: string[]; defaultFee: number; isActive: boolean;
    franchise: { _id: string; name: string; code: string };
}

const EMPTY_F = {
    name: "", code: "", description: "", registeredBodies: [""],
    websiteUrl: "", portalUrl: "", portalLoginRequired: false, isOwn: false,
};
const EMPTY_C = {
    franchiseId: "", name: "", code: "", issuingBody: "",
    verificationMethod: "", verificationUrl: "", benefits: [""], defaultFee: "", description: "",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function FranchisesSkeleton() {
    return (
        <div className="af-root">
            <div className="af-header">
                <div>
                    <div className="af-sk" style={{ width: 150, height: 28, borderRadius: 6 }} />
                    <div className="af-sk" style={{ width: 270, height: 12, borderRadius: 4, marginTop: 8 }} />
                </div>
                <div className="af-sk" style={{ width: 130, height: 38, borderRadius: 9 }} />
            </div>
            {[1, 2, 3].map(i => (
                <div key={i} className="af-card">
                    <div className="af-card-head">
                        <div className="af-card-left">
                            <div className="af-sk" style={{ width: 60, height: 28, borderRadius: 7 }} />
                            <div>
                                <div className="af-sk" style={{ width: 160, height: 14, borderRadius: 4 }} />
                                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                    <div className="af-sk" style={{ width: 50, height: 20, borderRadius: 100 }} />
                                    <div className="af-sk" style={{ width: 60, height: 20, borderRadius: 100 }} />
                                </div>
                            </div>
                        </div>
                        <div className="af-card-right">
                            <div className="af-sk" style={{ width: 56, height: 22, borderRadius: 100 }} />
                            <div className="af-sk" style={{ width: 28, height: 28, borderRadius: 7 }} />
                            <div className="af-sk" style={{ width: 28, height: 28, borderRadius: 7 }} />
                            <div className="af-sk" style={{ width: 100, height: 28, borderRadius: 7 }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Field helper ──────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="af-field">
            <label className="af-label">{label}</label>
            {children}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminFranchisesPage() {
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [certTypes, setCertTypes] = useState<CertType[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [fModal, setFModal] = useState(false);
    const [cModal, setCModal] = useState(false);
    const [editF, setEditF] = useState<Franchise | null>(null);
    const [editC, setEditC] = useState<CertType | null>(null);
    const [formF, setFormF] = useState(EMPTY_F);
    const [formC, setFormC] = useState(EMPTY_C);
    const [saving, setSaving] = useState(false);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const load = async () => {
        setPageLoading(true);
        try {
            const [fr, ct] = await Promise.all([
                fetchWithAuth("/api/admin/franchises").then(r => r.json()),
                fetchWithAuth("/api/admin/cert-types").then(r => r.json()),
            ]);
            setFranchises(Array.isArray(fr) ? fr : []);
            setCertTypes(Array.isArray(ct) ? ct : []);
        } catch { /* silent */ }
        finally { setPageLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const toggleExpand = (id: string) =>
        setExpanded(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    // ── Franchise CRUD ──
    const openCreateF = () => { setEditF(null); setFormF(EMPTY_F); setFModal(true); };
    const openEditF = (f: Franchise) => {
        setEditF(f);
        setFormF({
            name: f.name, code: f.code, description: f.description || "",
            registeredBodies: f.registeredBodies.length ? f.registeredBodies : [""],
            websiteUrl: f.websiteUrl || "", portalUrl: f.portalUrl || "",
            portalLoginRequired: f.portalLoginRequired, isOwn: f.isOwn,
        });
        setFModal(true);
    };

    const saveF = async () => {
        if (!formF.name || !formF.code) { showToast("Name aur Code required hain", false); return; }
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/admin/franchises", {
                method: editF ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...(editF && { id: editF._id }),
                    ...formF,
                    registeredBodies: formF.registeredBodies.filter(Boolean),
                }),
            });
            const d = await res.json();
            if (!res.ok) { showToast(d.message || "Error", false); return; }
            showToast(editF ? "Franchise updated" : "Franchise created");
            setFModal(false);
            load();
        } finally { setSaving(false); }
    };

    const toggleF = async (f: Franchise) => {
        await fetchWithAuth("/api/admin/franchises", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: f._id, isActive: !f.isActive }),
        });
        load();
    };

    // ── CertType CRUD ──
    const openCreateC = (franchiseId?: string) => {
        setEditC(null);
        setFormC({ ...EMPTY_C, franchiseId: franchiseId || "" });
        setCModal(true);
    };
    const openEditC = (c: CertType) => {
        setEditC(c);
        setFormC({
            franchiseId: c.franchise._id, name: c.name, code: c.code,
            issuingBody: c.issuingBody, verificationMethod: c.verificationMethod,
            verificationUrl: c.verificationUrl || "",
            benefits: c.benefits.length ? c.benefits : [""],
            defaultFee: c.defaultFee.toString(), description: "",
        });
        setCModal(true);
    };

    const saveC = async () => {
        if (!formC.franchiseId || !formC.name || !formC.code || !formC.issuingBody) {
            showToast("Franchise, Name, Code, IssuingBody required", false); return;
        }
        setSaving(true);
        try {
            const body = editC
                ? { id: editC._id, name: formC.name, issuingBody: formC.issuingBody, verificationMethod: formC.verificationMethod, verificationUrl: formC.verificationUrl, benefits: formC.benefits.filter(Boolean), defaultFee: formC.defaultFee }
                : { franchiseId: formC.franchiseId, name: formC.name, code: formC.code, issuingBody: formC.issuingBody, verificationMethod: formC.verificationMethod, verificationUrl: formC.verificationUrl, benefits: formC.benefits.filter(Boolean), defaultFee: formC.defaultFee };

            const res = await fetchWithAuth("/api/admin/cert-types", {
                method: editC ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const d = await res.json();
            if (!res.ok) { showToast(d.message || "Error", false); return; }
            showToast(editC ? "Cert type updated" : "Cert type created");
            setCModal(false);
            load();
        } finally { setSaving(false); }
    };

    // ── Loading ──
    if (pageLoading) return <><style>{styles}</style><FranchisesSkeleton /></>;

    // ── Render ──
    return (
        <>
            <style>{styles}</style>

            {toast && (
                <div className={`af-toast ${toast.ok ? "af-toast--ok" : "af-toast--err"}`}>
                    {toast.msg}
                </div>
            )}

            <div className="af-root">

                {/* Header */}
                <div className="af-header">
                    <div>
                        <h1 className="af-title">Franchises</h1>
                        <p className="af-sub">Manage franchises aur unke certificate types</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="af-icon-btn" onClick={load} title="Refresh">
                            <RefreshCw size={13} />
                        </button>
                        <button className="af-btn-primary" onClick={openCreateF}>
                            <Plus size={13} /> Add Franchise
                        </button>
                    </div>
                </div>

                {/* Franchise cards */}
                {franchises.length === 0 ? (
                    <div className="af-empty">
                        <div style={{ fontSize: "2rem", marginBottom: 8 }}>🏛</div>
                        <div>No franchises yet.</div>
                        <div style={{ fontSize: 11, marginTop: 4 }}>
                            Seed script chalao: <code>npx ts-node scripts/seedFranchises.ts</code>
                        </div>
                    </div>
                ) : franchises.map(f => {
                    const fCerts = certTypes.filter(
                        c => c.franchise._id === f._id || c.franchise._id?.toString() === f._id?.toString()
                    );
                    const isOpen = expanded.includes(f._id);
                    const fColor = f.isOwn ? "var(--cp-warning)" : "var(--cp-accent)";
                    const fBg = f.isOwn ? "rgba(245,158,11,0.12)" : "var(--cp-accent-glow)";

                    return (
                        <div key={f._id} className={`af-card${!f.isActive ? " af-card--inactive" : ""}`}>
                            <div className="af-card-head">
                                <div className="af-card-left">
                                    <div className="af-code-badge" style={{ background: fBg, color: fColor }}>
                                        {f.code}
                                    </div>
                                    <div>
                                        <div className="af-fname">{f.name}</div>
                                        <div className="af-fmeta">
                                            {f.registeredBodies.slice(0, 3).map(b => (
                                                <span key={b} className="af-body-tag">{b}</span>
                                            ))}
                                            {f.isOwn && <span className="af-own-tag">Own Institute</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="af-card-right">
                                    <span className={`af-status ${f.isActive ? "af-status--on" : "af-status--off"}`}>
                                        {f.isActive ? "Active" : "Inactive"}
                                    </span>
                                    <button className="af-icon-btn" onClick={() => openEditF(f)} title="Edit">
                                        <Edit2 size={12} />
                                    </button>
                                    <button className="af-icon-btn af-icon-btn--toggle" onClick={() => toggleF(f)} title="Toggle">
                                        {f.isActive
                                            ? <ToggleRight size={17} style={{ color: "var(--cp-success)" }} />
                                            : <ToggleLeft size={17} style={{ color: "var(--cp-muted)" }} />}
                                    </button>
                                    <button className="af-icon-btn af-icon-btn--expand" onClick={() => toggleExpand(f._id)}>
                                        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                        <span>Cert Types ({fCerts.length})</span>
                                    </button>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="af-cert-section">
                                    <div className="af-cert-head">
                                        <span>Certificate Types</span>
                                        <button className="af-btn-sm" onClick={() => openCreateC(f._id)}>
                                            <Plus size={11} /> Add Cert Type
                                        </button>
                                    </div>
                                    {fCerts.length === 0 ? (
                                        <div className="af-cert-empty">
                                            No cert types for {f.name} — add one.
                                        </div>
                                    ) : (
                                        <div className="af-cert-grid">
                                            {fCerts.map(ct => (
                                                <div key={ct._id} className="af-cert-card">
                                                    <div className="af-cert-code">{ct.code}</div>
                                                    <div className="af-cert-name">{ct.name}</div>
                                                    <div className="af-cert-body">{ct.issuingBody}</div>
                                                    {ct.verificationMethod && (
                                                        <div className="af-cert-verify">{ct.verificationMethod}</div>
                                                    )}
                                                    <div className="af-cert-fee">
                                                        Default fee: ₹{ct.defaultFee.toLocaleString("en-IN")}
                                                    </div>
                                                    <button className="af-link-btn" onClick={() => openEditC(ct)}>
                                                        <Edit2 size={10} /> Edit
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Franchise Modal ── */}
            {fModal && (
                <div className="af-overlay" onClick={e => e.target === e.currentTarget && setFModal(false)}>
                    <div className="af-modal">
                        <div className="af-modal-head">
                            <span>{editF ? "Edit Franchise" : "Add Franchise"}</span>
                            <button className="af-icon-btn" onClick={() => setFModal(false)}><X size={13} /></button>
                        </div>
                        <div className="af-modal-body">
                            <div className="af-form-grid">
                                <Field label="Franchise Name *">
                                    <input className="af-input" value={formF.name}
                                        onChange={e => setFormF(p => ({ ...p, name: e.target.value }))}
                                        placeholder="e.g. Gramin Skill Development Mission" />
                                </Field>
                                <Field label="Code * (uppercase, no spaces)">
                                    <input className="af-input" value={formF.code}
                                        onChange={e => setFormF(p => ({ ...p, code: e.target.value.toUpperCase().replace(/\s/g, "") }))}
                                        placeholder="e.g. GSDM" disabled={!!editF} />
                                </Field>
                                <Field label="Website URL">
                                    <input className="af-input" value={formF.websiteUrl}
                                        onChange={e => setFormF(p => ({ ...p, websiteUrl: e.target.value }))}
                                        placeholder="https://..." />
                                </Field>
                                <Field label="Portal / Login URL">
                                    <input className="af-input" value={formF.portalUrl}
                                        onChange={e => setFormF(p => ({ ...p, portalUrl: e.target.value }))}
                                        placeholder="https://..." />
                                </Field>
                            </div>

                            <Field label="Description">
                                <textarea className="af-input" style={{ minHeight: 70, resize: "vertical" }}
                                    value={formF.description}
                                    onChange={e => setFormF(p => ({ ...p, description: e.target.value }))} />
                            </Field>

                            <Field label="Registered Bodies (MSME, NSDC, MCA, etc.)">
                                {formF.registeredBodies.map((b, i) => (
                                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                        <input className="af-input" style={{ flex: 1 }} value={b}
                                            onChange={e => {
                                                const u = [...formF.registeredBodies]; u[i] = e.target.value;
                                                setFormF(p => ({ ...p, registeredBodies: u }));
                                            }}
                                            placeholder="e.g. NSDC" />
                                        {formF.registeredBodies.length > 1 && (
                                            <button className="af-icon-btn af-icon-btn--danger"
                                                onClick={() => setFormF(p => ({ ...p, registeredBodies: p.registeredBodies.filter((_, j) => j !== i) }))}>
                                                <X size={11} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="af-link-btn"
                                    onClick={() => setFormF(p => ({ ...p, registeredBodies: [...p.registeredBodies, ""] }))}>
                                    <Plus size={10} /> Add body
                                </button>
                            </Field>

                            <div className="af-checkbox-row">
                                <label className="af-checkbox">
                                    <input type="checkbox" checked={formF.portalLoginRequired}
                                        onChange={e => setFormF(p => ({ ...p, portalLoginRequired: e.target.checked }))} />
                                    Portal login required
                                </label>
                                <label className="af-checkbox">
                                    <input type="checkbox" checked={formF.isOwn}
                                        onChange={e => setFormF(p => ({ ...p, isOwn: e.target.checked }))} />
                                    Own Institute Certificate
                                </label>
                            </div>

                            <div className="af-modal-footer">
                                <button className="af-btn-ghost" onClick={() => setFModal(false)}>Cancel</button>
                                <button className="af-btn-primary" onClick={saveF} disabled={saving}>
                                    {saving ? "Saving..." : editF ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CertType Modal ── */}
            {cModal && (
                <div className="af-overlay" onClick={e => e.target === e.currentTarget && setCModal(false)}>
                    <div className="af-modal">
                        <div className="af-modal-head">
                            <span>{editC ? "Edit Certificate Type" : "Add Certificate Type"}</span>
                            <button className="af-icon-btn" onClick={() => setCModal(false)}><X size={13} /></button>
                        </div>
                        <div className="af-modal-body">
                            {!editC && (
                                <Field label="Franchise *">
                                    <select className="af-input" value={formC.franchiseId}
                                        onChange={e => setFormC(p => ({ ...p, franchiseId: e.target.value }))}>
                                        <option value="">Select franchise</option>
                                        {franchises.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                                    </select>
                                </Field>
                            )}

                            <div className="af-form-grid">
                                <Field label="Cert Type Name *">
                                    <input className="af-input" value={formC.name}
                                        onChange={e => setFormC(p => ({ ...p, name: e.target.value }))}
                                        placeholder="e.g. NSDC Short Term Certificate" />
                                </Field>
                                {!editC && (
                                    <Field label="Code * (uppercase)">
                                        <input className="af-input" value={formC.code}
                                            onChange={e => setFormC(p => ({ ...p, code: e.target.value.toUpperCase().replace(/\s/g, "") }))}
                                            placeholder="e.g. GSDM_NSDC" />
                                    </Field>
                                )}
                                <Field label="Issuing Body *">
                                    <input className="af-input" value={formC.issuingBody}
                                        onChange={e => setFormC(p => ({ ...p, issuingBody: e.target.value }))}
                                        placeholder="e.g. NSDC / Skill India" />
                                </Field>
                                <Field label="Verification Method">
                                    <input className="af-input" value={formC.verificationMethod}
                                        onChange={e => setFormC(p => ({ ...p, verificationMethod: e.target.value }))}
                                        placeholder="e.g. DigiLocker + NSDC Portal" />
                                </Field>
                                <Field label="Verification URL">
                                    <input className="af-input" value={formC.verificationUrl}
                                        onChange={e => setFormC(p => ({ ...p, verificationUrl: e.target.value }))}
                                        placeholder="https://digilocker.gov.in" />
                                </Field>
                                <Field label="Default Fee (₹)">
                                    <input className="af-input" type="number" value={formC.defaultFee}
                                        onChange={e => setFormC(p => ({ ...p, defaultFee: e.target.value }))}
                                        placeholder="e.g. 2500" />
                                </Field>
                            </div>

                            <Field label="Benefits (student portal mein dikhega)">
                                {formC.benefits.map((b, i) => (
                                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                        <input className="af-input" style={{ flex: 1 }} value={b}
                                            onChange={e => {
                                                const u = [...formC.benefits]; u[i] = e.target.value;
                                                setFormC(p => ({ ...p, benefits: u }));
                                            }}
                                            placeholder="e.g. DigiLocker mein stored" />
                                        {formC.benefits.length > 1 && (
                                            <button className="af-icon-btn af-icon-btn--danger"
                                                onClick={() => setFormC(p => ({ ...p, benefits: p.benefits.filter((_, j) => j !== i) }))}>
                                                <X size={11} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="af-link-btn"
                                    onClick={() => setFormC(p => ({ ...p, benefits: [...p.benefits, ""] }))}>
                                    <Plus size={10} /> Add benefit
                                </button>
                            </Field>

                            <div className="af-modal-footer">
                                <button className="af-btn-ghost" onClick={() => setCModal(false)}>Cancel</button>
                                <button className="af-btn-primary" onClick={saveC} disabled={saving}>
                                    {saving ? "Saving..." : editC ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ── Styles — all via var(--cp-*) ─────────────────────────────────────────────

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

    .af-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }

    .af-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.3); }
    .af-toast--ok  { background:rgba(34,197,94,0.12); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); }
    .af-toast--err { background:rgba(239,68,68,0.12); color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.3); }

    .af-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .af-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .af-sub    { font-size:12px; color:var(--cp-muted); margin-top:3px; }

    .af-empty { text-align:center; padding:60px 20px; color:var(--cp-muted); display:flex; flex-direction:column; align-items:center; gap:6px; font-size:13px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; }
    .af-empty code { font-size:11px; background:var(--cp-bg); padding:2px 8px; border-radius:5px; color:var(--cp-accent); }

    .af-card            { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
    .af-card--inactive  { opacity:.6; }
    .af-card-head { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; gap:12px; flex-wrap:wrap; }
    .af-card-left  { display:flex; align-items:center; gap:12px; flex:1; min-width:0; }
    .af-card-right { display:flex; align-items:center; gap:8px; flex-shrink:0; flex-wrap:wrap; }

    .af-code-badge { font-size:11px; font-weight:800; letter-spacing:.08em; padding:4px 10px; border-radius:7px; flex-shrink:0; }
    .af-fname  { font-size:14px; font-weight:700; color:var(--cp-text); margin-bottom:4px; }
    .af-fmeta  { display:flex; flex-wrap:wrap; gap:4px; }
    .af-body-tag { font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px; background:var(--cp-bg); color:var(--cp-muted); border:1px solid var(--cp-border); }
    .af-own-tag  { font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px; background:rgba(245,158,11,0.1); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.25); }

    .af-status       { font-size:10px; font-weight:700; padding:3px 9px; border-radius:100px; }
    .af-status--on   { background:rgba(34,197,94,0.1);   color:var(--cp-success); border:1px solid rgba(34,197,94,0.2);  }
    .af-status--off  { background:rgba(100,116,139,0.1); color:var(--cp-muted);   border:1px solid var(--cp-border); }

    .af-icon-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:1px solid var(--cp-border); background:transparent; cursor:pointer; color:var(--cp-muted); transition:all .13s; }
    .af-icon-btn:hover { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 30%,transparent); }
    .af-icon-btn--danger { background:rgba(239,68,68,0.08); color:var(--cp-danger); border-color:rgba(239,68,68,0.2); }
    .af-icon-btn--danger:hover { background:rgba(239,68,68,0.15); }
    .af-icon-btn--toggle { width:auto; padding:0 4px; border:none; background:transparent; }
    .af-icon-btn--toggle:hover { background:transparent; }
    .af-icon-btn--expand { width:auto; padding:0 10px; gap:5px; font-size:11px; font-weight:600; color:var(--cp-subtext); }
    .af-icon-btn--expand:hover { color:var(--cp-accent); }

    .af-cert-section { border-top:1px solid var(--cp-border); padding:14px 18px; background:var(--cp-bg); }
    .af-cert-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--cp-muted); }
    .af-cert-empty { font-size:12px; color:var(--cp-muted); padding:10px 0; text-align:center; }
    .af-cert-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px; }
    .af-cert-card   { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:9px; padding:12px 14px; }
    .af-cert-code   { font-size:9px; font-weight:800; letter-spacing:.1em; color:var(--cp-accent); margin-bottom:4px; }
    .af-cert-name   { font-size:12px; font-weight:700; color:var(--cp-text); margin-bottom:3px; line-height:1.3; }
    .af-cert-body   { font-size:11px; color:var(--cp-subtext); margin-bottom:3px; }
    .af-cert-verify { font-size:10px; color:var(--cp-muted); margin-bottom:4px; }
    .af-cert-fee    { font-size:11px; color:var(--cp-success); font-weight:600; margin-bottom:6px; }

    .af-btn-primary { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; white-space:nowrap; }
    .af-btn-primary:hover { opacity:.88; }
    .af-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
    .af-btn-sm { display:inline-flex; align-items:center; gap:4px; padding:5px 12px; border-radius:7px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .13s; }
    .af-btn-sm:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .af-btn-ghost { padding:9px 16px; border-radius:8px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .13s; }
    .af-btn-ghost:hover { border-color:var(--cp-border2); color:var(--cp-subtext); }
    .af-link-btn { display:inline-flex; align-items:center; gap:4px; background:none; border:none; cursor:pointer; font-size:11px; font-weight:600; color:var(--cp-accent); font-family:'Plus Jakarta Sans',sans-serif; padding:3px 0; transition:opacity .13s; }
    .af-link-btn:hover { opacity:.75; }

    .af-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .af-modal { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:14px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--cp-border2) transparent; animation:afIn .18s ease; }
    @keyframes afIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .af-modal-head { display:flex; align-items:center; justify-content:space-between; padding:15px 18px; border-bottom:1px solid var(--cp-border); font-family:'DM Serif Display',serif; font-size:1.05rem; color:var(--cp-text); position:sticky; top:0; background:var(--cp-surface); z-index:2; }
    .af-modal-body { padding:18px; display:flex; flex-direction:column; gap:14px; }
    .af-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding-top:4px; }
    .af-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    @media(max-width:560px){ .af-form-grid { grid-template-columns:1fr; } }
    .af-field { display:flex; flex-direction:column; gap:5px; }
    .af-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }
    .af-input { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px; font-size:13px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; color:var(--cp-text); outline:none; transition:border-color .15s; }
    .af-input:focus { border-color:var(--cp-accent); }
    .af-input::placeholder { color:var(--cp-muted); }
    .af-checkbox-row { display:flex; gap:20px; flex-wrap:wrap; }
    .af-checkbox { display:flex; align-items:center; gap:7px; font-size:13px; color:var(--cp-subtext); cursor:pointer; }
    .af-checkbox input { width:14px; height:14px; cursor:pointer; accent-color:var(--cp-accent); }

    .af-sk { background:linear-gradient(90deg,var(--cp-surface) 25%,var(--cp-surface2) 50%,var(--cp-surface) 75%); background-size:200% 100%; animation:afShimmer 1.4s infinite; }
    @keyframes afShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;