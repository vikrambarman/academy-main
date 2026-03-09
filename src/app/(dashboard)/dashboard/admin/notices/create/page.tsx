"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";

export default function CreateNotice() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "", slug: "", excerpt: "", content: "",
        category: "General", isPublished: false,
    });
    const [loading, setLoading] = useState(false);

    const generateSlug = (title: string) =>
        title.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g,"-");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch("/api/admin/notices", {
                method:"POST", credentials:"include",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(form),
            });
            if (res.ok) router.push("/dashboard/admin/notices");
            else alert("Error creating notice");
        } finally { setLoading(false); }
    };

    return (
        <>
            <style>{ncStyles}</style>
            <div className="nc-root">
                <div className="nc-header">
                    <button className="nc-back-btn" onClick={() => router.back()}>
                        <ArrowLeft size={13}/> Back
                    </button>
                    <div>
                        <h1 className="nc-title">Create Notice</h1>
                        <p className="nc-sub">Write and publish a new notice for students</p>
                    </div>
                </div>

                <div className="nc-card">
                    <div className="nc-card-head">
                        <Bell size={13} style={{ color:"#f59e0b" }}/>
                        <span>Notice Details</span>
                    </div>
                    <form className="nc-form" onSubmit={handleSubmit}>

                        <div className="nc-field">
                            <label className="nc-label">Title <span className="nc-req">*</span></label>
                            <input
                                className="nc-input" required placeholder="Notice title..."
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
                            />
                        </div>

                        <div className="nc-field">
                            <label className="nc-label">Slug <span className="nc-req">*</span></label>
                            <input
                                className="nc-input" required placeholder="auto-generated-slug"
                                value={form.slug}
                                onChange={e => setForm({ ...form, slug: e.target.value })}
                            />
                            <span className="nc-hint">URL: /notices/{form.slug || "slug"}</span>
                        </div>

                        <div className="nc-field">
                            <label className="nc-label">Category</label>
                            <select className="nc-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {["General","Academic","Exam","Holiday","Event","Important"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="nc-field">
                            <label className="nc-label">Excerpt <span className="nc-req">*</span></label>
                            <textarea
                                className="nc-textarea" required placeholder="Short summary of the notice..."
                                style={{ minHeight:70 }}
                                value={form.excerpt}
                                onChange={e => setForm({ ...form, excerpt: e.target.value })}
                            />
                        </div>

                        <div className="nc-field">
                            <label className="nc-label">Content <span className="nc-req">*</span></label>
                            <textarea
                                className="nc-textarea" required placeholder="Full notice content..."
                                style={{ minHeight:160 }}
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                            />
                        </div>

                        <label className="nc-checkbox-wrap">
                            <div className={`nc-checkbox ${form.isPublished ? "checked" : ""}`}>
                                {form.isPublished && <span style={{ fontSize:10, color:"#1a1208", fontWeight:800 }}>✓</span>}
                            </div>
                            <input type="checkbox" style={{ display:"none" }}
                                checked={form.isPublished}
                                onChange={e => setForm({ ...form, isPublished: e.target.checked })}/>
                            <span className="nc-checkbox-label">Publish immediately</span>
                        </label>

                        <div className="nc-form-footer">
                            <button type="button" className="nc-ghost-btn" onClick={() => router.back()}>Cancel</button>
                            <button type="submit" className="nc-submit-btn" disabled={loading}>
                                {loading ? "Creating..." : form.isPublished ? "Publish Notice" : "Save as Draft"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

const ncStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display@display=swap');
    .nc-root { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:20px; max-width:720px; }

    .nc-header { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
    .nc-back-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 13px; border-radius:8px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .nc-back-btn:hover { border-color:#f59e0b; color:#f59e0b; }
    .nc-title { font-family:'DM Serif Display',serif; font-size:1.5rem; color:#f1f5f9; font-weight:400; }
    .nc-sub   { font-size:12px; color:#475569; margin-top:3px; }

    .nc-card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .nc-card-head { display:flex; align-items:center; gap:7px; padding:13px 18px; border-bottom:1px solid #222; background:#1f1f1f; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#94a3b8; }
    .nc-form { padding:20px; display:flex; flex-direction:column; gap:14px; }

    .nc-field { display:flex; flex-direction:column; gap:5px; }
    .nc-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }
    .nc-req   { color:#ef4444; }
    .nc-hint  { font-size:10px; color:#334155; margin-top:2px; }

    .nc-input, .nc-select, .nc-textarea {
        font-family:'Plus Jakarta Sans',sans-serif; width:100%;
        padding:10px 12px; font-size:13px;
        background:#111; border:1px solid #2a2a2a; border-radius:8px;
        color:#f1f5f9; outline:none; transition:border-color .15s;
    }
    .nc-input:focus, .nc-select:focus, .nc-textarea:focus { border-color:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,.07); }
    .nc-input::placeholder, .nc-textarea::placeholder { color:#334155; }
    .nc-textarea { resize:vertical; }
    .nc-select option { background:#1a1a1a; }

    .nc-checkbox-wrap { display:flex; align-items:center; gap:9px; cursor:pointer; }
    .nc-checkbox { width:18px; height:18px; border-radius:5px; border:1.5px solid #2a2a2a; background:#111; display:flex; align-items:center; justify-content:center; transition:all .14s; flex-shrink:0; }
    .nc-checkbox.checked { background:#f59e0b; border-color:#f59e0b; }
    .nc-checkbox-label { font-size:13px; color:#94a3b8; font-weight:500; }

    .nc-form-footer { display:flex; justify-content:flex-end; gap:8px; padding-top:4px; }
    .nc-submit-btn { padding:10px 24px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; transition:opacity .15s; }
    .nc-submit-btn:hover { opacity:.88; }
    .nc-submit-btn:disabled { opacity:.5; cursor:not-allowed; }
    .nc-ghost-btn { padding:10px 18px; border-radius:9px; border:1px solid #2a2a2a; background:transparent; color:#64748b; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .nc-ghost-btn:hover { border-color:#475569; color:#94a3b8; }
`;