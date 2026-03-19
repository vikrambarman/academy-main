"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Search, ChevronLeft, ChevronRight, MessageSquare,
    Plus, X, Phone, User, BookOpen, RefreshCw, Trash2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Enquiry {
    _id: string; name: string; mobile: string; course: string;
    contactMethod: "Phone" | "WhatsApp";
    message?: string;
    source?: "walk-in" | "website" | "phone" | "referral";
    status: "new" | "contacted" | "converted" | "closed";
    isActive: boolean; createdAt?: string;
}

const STATUS_OPTIONS = ["new", "contacted", "converted", "closed"] as const;
const SOURCE_OPTIONS = ["walk-in", "website", "phone", "referral"] as const;

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
    new: { bg: "rgba(96,165,250,.1)", color: "var(--cp-accent)", border: "color-mix(in srgb,var(--cp-accent) 25%,transparent)" },
    contacted: { bg: "rgba(245,158,11,.1)", color: "var(--cp-warning)", border: "rgba(245,158,11,.25)" },
    converted: { bg: "rgba(34,197,94,.1)", color: "var(--cp-success)", border: "rgba(34,197,94,.25)" },
    closed: { bg: "rgba(100,116,139,.1)", color: "var(--cp-muted)", border: "rgba(100,116,139,.25)" },
};

const SOURCE_LABEL: Record<string, string> = {
    "walk-in": "🚶 Walk-in",
    "website": "🌐 Website",
    "phone": "📞 Phone",
    "referral": "🤝 Referral",
};

const EMPTY_FORM = {
    name: "", mobile: "", course: "",
    contactMethod: "Phone" as "Phone" | "WhatsApp",
    message: "", source: "walk-in" as typeof SOURCE_OPTIONS[number],
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function EnquirySkeleton() {
    return (
        <div className="ae-root">
            <div className="ae-header">
                <div>
                    <div className="ae-sk" style={{ width: 150, height: 28, borderRadius: 6 }} />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="ae-sk" style={{ width: 70, height: 22, borderRadius: 100 }} />
                        ))}
                    </div>
                </div>
                <div className="ae-sk" style={{ width: 140, height: 36, borderRadius: 9 }} />
            </div>
            <div className="ae-sk" style={{ width: 300, height: 38, borderRadius: 9 }} />
            <div className="ae-table-wrap">
                <div className="ae-sk" style={{ width: "100%", height: 42, borderRadius: "10px 10px 0 0" }} />
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: "13px 16px", borderTop: "1px solid var(--cp-border)" }}>
                        <div className="ae-sk" style={{ width: 110, height: 13, borderRadius: 4 }} />
                        <div className="ae-sk" style={{ width: 90, height: 13, borderRadius: 4 }} />
                        <div className="ae-sk" style={{ width: 120, height: 13, borderRadius: 4 }} />
                        <div className="ae-sk" style={{ width: 70, height: 13, borderRadius: 4, marginLeft: "auto" }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterSource, setFilterSource] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const LIMIT = 12;

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = useCallback(async () => {
        setPageLoading(true);
        try {
            const res = await fetchWithAuth("/api/admin/enquiry");
            const d = await res.json();
            setEnquiries(d.data || []);
        } catch { showToast("Load failed", "error"); }
        finally { setPageLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const updateStatus = async (id: string, status: string) => {
        const res = await fetchWithAuth(`/api/admin/enquiry/${id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) {
            setEnquiries(prev => prev.map(e =>
                e._id === id ? { ...e, status: status as Enquiry["status"] } : e
            ));
        }
    };

    const deleteEnquiry = async (id: string) => {
        if (!confirm("Is enquiry ko delete karna chahte ho?")) return;
        const res = await fetchWithAuth(`/api/admin/enquiry/${id}`, { method: "DELETE" });
        if (res.ok) {
            setEnquiries(prev => prev.filter(e => e._id !== id));
            showToast("Enquiry deleted");
        }
    };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.mobile.trim() || !form.course.trim()) {
            showToast("Name, mobile aur course required hain", "error"); return;
        }
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/admin/enquiry", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.message);
            showToast("Enquiry add ho gayi ✓");
            setModal(false);
            setForm(EMPTY_FORM);
            load();
        } catch (e: any) { showToast(e.message || "Error", "error"); }
        finally { setSaving(false); }
    };

    // Counts
    const counts = {
        new: enquiries.filter(e => e.status === "new").length,
        contacted: enquiries.filter(e => e.status === "contacted").length,
        converted: enquiries.filter(e => e.status === "converted").length,
        closed: enquiries.filter(e => e.status === "closed").length,
    };

    // Filter + search
    const filtered = enquiries.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.mobile.includes(search) ||
            e.course.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || e.status === filterStatus;
        const matchSource = filterSource === "all" || e.source === filterSource;
        return matchSearch && matchStatus && matchSource;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT) || 1;
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    if (pageLoading) return <><style>{aeStyles}</style><EnquirySkeleton /></>;

    return (
        <>
            <style>{aeStyles}</style>

            {toast && (
                <div className={`ae-toast ae-toast--${toast.type}`}>{toast.msg}</div>
            )}

            <div className="ae-root">
                {/* Header */}
                <div className="ae-header">
                    <div>
                        <h1 className="ae-title">Enquiries</h1>
                        <div className="ae-stats">
                            <span className="ae-stat ae-stat--blue">{counts.new} New</span>
                            <span className="ae-stat ae-stat--amber">{counts.contacted} Contacted</span>
                            <span className="ae-stat ae-stat--green">{counts.converted} Converted</span>
                            <span className="ae-stat ae-stat--muted">{counts.closed} Closed</span>
                            <span className="ae-stat ae-stat--total">{enquiries.length} Total</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="ae-refresh-btn" onClick={load} title="Refresh">
                            <RefreshCw size={13} />
                        </button>
                        <button className="ae-add-btn" onClick={() => { setForm(EMPTY_FORM); setModal(true); }}>
                            <Plus size={13} /> Add Enquiry
                        </button>
                    </div>
                </div>

                {/* Filters row */}
                <div className="ae-filters">
                    <div className="ae-search-wrap">
                        <Search size={13} className="ae-search-icon" />
                        <input className="ae-search" placeholder="Name, mobile ya course se search karo..."
                            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                    </div>
                    <select className="ae-filter-select" value={filterStatus}
                        onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                        <option value="all">All Status</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                    <select className="ae-filter-select" value={filterSource}
                        onChange={e => { setFilterSource(e.target.value); setPage(1); }}>
                        <option value="all">All Sources</option>
                        {SOURCE_OPTIONS.map(s => (
                            <option key={s} value={s}>{SOURCE_LABEL[s]}</option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className="ae-table-wrap">
                    <table className="ae-table">
                        <thead className="ae-thead">
                            <tr>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Course</th>
                                <th>Source</th>
                                <th>Contact</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="ae-tbody">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="ae-empty-row">
                                        <MessageSquare size={20} style={{ opacity: .3, marginBottom: 8 }} />
                                        <div>Koi enquiry nahi mili</div>
                                    </td>
                                </tr>
                            ) : paginated.map(e => {
                                const ss = STATUS_STYLE[e.status] ?? STATUS_STYLE.new;
                                return (
                                    <tr key={e._id} className={!e.isActive ? "ae-row--inactive" : ""}>
                                        <td><span className="ae-name">{e.name}</span></td>
                                        <td><span className="ae-mono">{e.mobile}</span></td>
                                        <td><span className="ae-course">{e.course}</span></td>
                                        <td>
                                            <span className="ae-source-badge">
                                                {SOURCE_LABEL[e.source ?? "walk-in"] ?? e.source ?? "—"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`ae-contact-badge ae-contact-badge--${e.contactMethod === "WhatsApp" ? "wa" : "phone"}`}>
                                                {e.contactMethod}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="ae-message">{e.message || "—"}</span>
                                        </td>
                                        <td>
                                            <select className="ae-status-select"
                                                style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}
                                                value={e.status}
                                                onChange={ev => updateStatus(e._id, ev.target.value)}>
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s}
                                                        style={{ background: "var(--cp-surface)", color: "var(--cp-text)" }}>
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <span className="ae-date">
                                                {e.createdAt
                                                    ? new Date(e.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                    })
                                                    : "—"}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="ae-del-btn" onClick={() => deleteEnquiry(e._id)} title="Delete">
                                                <Trash2 size={11} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="ae-pag">
                        <button className="ae-pag-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                            <ChevronLeft size={13} /> Prev
                        </button>
                        <span className="ae-pag-info">Page {page} of {totalPages} ({filtered.length} results)</span>
                        <button className="ae-pag-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                            Next <ChevronRight size={13} />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Add Enquiry Modal ── */}
            {modal && (
                <div className="ae-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="ae-modal">
                        <div className="ae-modal-head">
                            <div className="ae-modal-title-wrap">
                                <div className="ae-modal-icon"><MessageSquare size={13} /></div>
                                <span className="ae-modal-title">New Enquiry</span>
                            </div>
                            <button className="ae-modal-close" onClick={() => setModal(false)}><X size={13} /></button>
                        </div>

                        <div className="ae-modal-body">
                            {/* Source */}
                            <div className="ae-field">
                                <label className="ae-label">Enquiry Source</label>
                                <div className="ae-source-grid">
                                    {SOURCE_OPTIONS.map(s => (
                                        <label key={s} className={`ae-source-card${form.source === s ? " ae-source-card--active" : ""}`}>
                                            <input type="radio" name="source" value={s}
                                                checked={form.source === s}
                                                onChange={() => setForm(f => ({ ...f, source: s }))}
                                                style={{ display: "none" }} />
                                            {SOURCE_LABEL[s]}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Name + Mobile */}
                            <div className="ae-form-grid">
                                <div className="ae-field">
                                    <label className="ae-label"><User size={10} /> Name *</label>
                                    <input className="ae-input" placeholder="Student ka naam"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="ae-field">
                                    <label className="ae-label"><Phone size={10} /> Mobile *</label>
                                    <input className="ae-input" placeholder="98xxxxxxxx" type="tel"
                                        value={form.mobile}
                                        onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
                                </div>
                            </div>

                            {/* Course */}
                            <div className="ae-field">
                                <label className="ae-label"><BookOpen size={10} /> Course Interest *</label>
                                <input className="ae-input" placeholder="e.g. DCA, Tally, MS Office..."
                                    value={form.course}
                                    onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
                            </div>

                            {/* Contact method */}
                            <div className="ae-field">
                                <label className="ae-label">Contact Method</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {(["Phone", "WhatsApp"] as const).map(m => (
                                        <label key={m} className={`ae-contact-card${form.contactMethod === m ? " ae-contact-card--active" : ""}`}>
                                            <input type="radio" name="contactMethod" value={m}
                                                checked={form.contactMethod === m}
                                                onChange={() => setForm(f => ({ ...f, contactMethod: m }))}
                                                style={{ display: "none" }} />
                                            {m === "WhatsApp" ? "💬 WhatsApp" : "📞 Phone"}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="ae-field">
                                <label className="ae-label">Notes / Message</label>
                                <textarea className="ae-input" style={{ minHeight: 72, resize: "vertical" }}
                                    placeholder="Student ne kya poochha, koi special requirement..."
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                            </div>
                        </div>

                        <div className="ae-modal-footer">
                            <button className="ae-ghost-btn" onClick={() => setModal(false)}>Cancel</button>
                            <button className="ae-primary-btn" onClick={handleSubmit} disabled={saving}>
                                {saving ? "Saving..." : "Add Enquiry"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const aeStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

    .ae-root   { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }

    .ae-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.3); }
    .ae-toast--success { background:rgba(34,197,94,0.12); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); }
    .ae-toast--error   { background:rgba(239,68,68,0.12); color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.3); }

    .ae-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
    .ae-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .ae-stats  { display:flex; align-items:center; gap:6px; margin-top:6px; flex-wrap:wrap; }
    .ae-stat   { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; border:1px solid; }
    .ae-stat--blue  { background:var(--cp-accent-glow);       color:var(--cp-accent);   border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
    .ae-stat--amber { background:rgba(245,158,11,0.08);        color:var(--cp-warning);  border-color:rgba(245,158,11,0.2); }
    .ae-stat--green { background:rgba(34,197,94,0.08);         color:var(--cp-success);  border-color:rgba(34,197,94,0.2);  }
    .ae-stat--muted { background:rgba(100,116,139,0.08);       color:var(--cp-muted);    border-color:rgba(100,116,139,0.2); }
    .ae-stat--total { background:var(--cp-surface2);           color:var(--cp-subtext);  border-color:var(--cp-border); }

    .ae-add-btn     { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; white-space:nowrap; }
    .ae-add-btn:hover { opacity:.88; }
    .ae-refresh-btn { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:9px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-muted); cursor:pointer; transition:all .14s; }
    .ae-refresh-btn:hover { border-color:var(--cp-accent); color:var(--cp-accent); }

    .ae-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
    .ae-search-wrap { position:relative; flex:1; min-width:220px; max-width:360px; }
    .ae-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--cp-muted); pointer-events:none; }
    .ae-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:9px; color:var(--cp-text); font-size:13px; outline:none; transition:border-color .15s; }
    .ae-search:focus { border-color:var(--cp-accent); }
    .ae-search::placeholder { color:var(--cp-muted); }
    .ae-filter-select { font-family:'Plus Jakarta Sans',sans-serif; padding:8px 12px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:9px; color:var(--cp-text); font-size:12px; outline:none; cursor:pointer; transition:border-color .14s; }
    .ae-filter-select:focus { border-color:var(--cp-accent); }

    .ae-table-wrap { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; overflow-x:auto; }
    .ae-table { width:100%; border-collapse:collapse; font-size:12.5px; min-width:780px; }
    .ae-thead tr { background:var(--cp-surface2); }
    .ae-thead th { padding:11px 14px; text-align:left; font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cp-muted); white-space:nowrap; }
    .ae-tbody tr { border-top:1px solid var(--cp-border); transition:background .12s; }
    .ae-tbody tr:hover { background:var(--cp-accent-glow); }
    .ae-row--inactive { opacity:.5; }
    .ae-tbody td { padding:11px 14px; vertical-align:middle; }

    .ae-name    { font-weight:600; color:var(--cp-text); white-space:nowrap; }
    .ae-mono    { font-family:monospace; font-size:12px; color:var(--cp-subtext); }
    .ae-course  { font-size:12px; color:var(--cp-subtext); }
    .ae-message { font-size:11px; color:var(--cp-muted); display:block; max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ae-date    { font-size:11px; color:var(--cp-muted); white-space:nowrap; }

    .ae-source-badge { font-size:10px; font-weight:600; color:var(--cp-muted); white-space:nowrap; }
    .ae-contact-badge { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; white-space:nowrap; }
    .ae-contact-badge--wa    { background:rgba(34,197,94,0.1); color:var(--cp-success); border:1px solid rgba(34,197,94,0.2); }
    .ae-contact-badge--phone { background:var(--cp-accent-glow); color:var(--cp-accent); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); }

    .ae-status-select { font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:3px 8px; border-radius:7px; border:1px solid; cursor:pointer; outline:none; transition:all .13s; }
    .ae-del-btn { width:26px; height:26px; border-radius:7px; border:1px solid rgba(239,68,68,0.2); background:rgba(239,68,68,0.06); color:var(--cp-danger); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; }
    .ae-del-btn:hover { background:rgba(239,68,68,0.14); }

    .ae-empty-row { text-align:center; padding:48px 0 !important; color:var(--cp-muted); font-size:13px; }

    .ae-pag      { display:flex; align-items:center; justify-content:center; gap:10px; }
    .ae-pag-btn  { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .ae-pag-btn:hover:not(:disabled) { border-color:var(--cp-accent); color:var(--cp-accent); }
    .ae-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
    .ae-pag-info { font-size:12px; color:var(--cp-muted); }

    /* Modal */
    .ae-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .ae-modal   { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:16px; width:100%; max-width:480px; box-shadow:0 24px 60px rgba(0,0,0,.5); animation:aeIn .18s ease; }
    @keyframes aeIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .ae-modal-head { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--cp-border); }
    .ae-modal-title-wrap { display:flex; align-items:center; gap:9px; }
    .ae-modal-icon  { width:28px; height:28px; border-radius:8px; background:var(--cp-accent-glow); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); color:var(--cp-accent); display:flex; align-items:center; justify-content:center; }
    .ae-modal-title { font-family:'DM Serif Display',serif; font-size:1.05rem; color:var(--cp-text); }
    .ae-modal-close { width:26px; height:26px; border-radius:7px; border:1px solid var(--cp-border); background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--cp-muted); transition:all .13s; }
    .ae-modal-close:hover { background:var(--cp-surface2); color:var(--cp-text); }
    .ae-modal-body   { padding:20px; display:flex; flex-direction:column; gap:14px; }
    .ae-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding:14px 20px; border-top:1px solid var(--cp-border); }

    .ae-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    @media(max-width:480px){ .ae-form-grid { grid-template-columns:1fr; } }
    .ae-field { display:flex; flex-direction:column; gap:5px; }
    .ae-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); display:flex; align-items:center; gap:4px; }
    .ae-input { font-family:'Plus Jakarta Sans',sans-serif; padding:10px 12px; font-size:13px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:9px; color:var(--cp-text); outline:none; transition:border-color .15s; width:100%; }
    .ae-input:focus { border-color:var(--cp-accent); }
    .ae-input::placeholder { color:var(--cp-muted); }

    .ae-source-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }
    @media(max-width:460px){ .ae-source-grid { grid-template-columns:1fr 1fr; } }
    .ae-source-card { padding:8px 10px; border-radius:9px; border:1px solid var(--cp-border); background:var(--cp-surface2); font-size:11px; font-weight:600; color:var(--cp-muted); cursor:pointer; text-align:center; transition:all .14s; }
    .ae-source-card:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .ae-source-card--active { border-color:var(--cp-accent); background:var(--cp-accent-glow); color:var(--cp-accent); }

    .ae-contact-card { padding:8px 16px; border-radius:9px; border:1px solid var(--cp-border); background:var(--cp-surface2); font-size:12px; font-weight:600; color:var(--cp-muted); cursor:pointer; transition:all .14s; }
    .ae-contact-card:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .ae-contact-card--active { border-color:var(--cp-accent); background:var(--cp-accent-glow); color:var(--cp-accent); }

    .ae-ghost-btn   { padding:9px 16px; border-radius:8px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .13s; }
    .ae-ghost-btn:hover { border-color:var(--cp-border2); color:var(--cp-subtext); }
    .ae-primary-btn { padding:9px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .14s; }
    .ae-primary-btn:disabled { opacity:.5; cursor:not-allowed; }

    .ae-sk { background:linear-gradient(90deg,var(--cp-surface) 25%,var(--cp-surface2) 50%,var(--cp-surface) 75%); background-size:200% 100%; animation:aeShimmer 1.4s infinite; }
    @keyframes aeShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;