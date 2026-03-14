"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";

export default function EditNotice() {
    const router    = useRouter();
    const { id }    = useParams() as { id: string };
    const [form,    setForm]    = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/admin/notices", { credentials:"include" })
            .then(r => r.json())
            .then(data => {
                const notice = data.data?.find((n: any) => n._id === id);
                setForm(notice || null);
            });
    }, [id]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            await fetch(`/api/admin/notices/${id}`, {
                method:"PATCH", credentials:"include",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(form),
            });
            router.push("/dashboard/admin/notices");
        } finally { setLoading(false); }
    };

    if (!form) return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap');
                .ne-loader { font-family:'Plus Jakarta Sans',sans-serif; display:flex; align-items:center; gap:10px; color:#475569; font-size:13px; padding:40px 0; }
                .ne-spinner { width:18px; height:18px; border:2px solid #2a2a2a; border-top-color:#f59e0b; border-radius:50%; animation:neSpin .7s linear infinite; }
                @keyframes neSpin { to { transform:rotate(360deg); } }
            `}</style>
            <div className="ne-loader"><div className="ne-spinner"/> Loading notice…</div>
        </>
    );

    return (
        <>
            <style>{neStyles}</style>
            <div className="ne-root">
                <div className="ne-header">
                    <button className="ne-back-btn" onClick={() => router.back()}>
                        <ArrowLeft size={13}/> Back
                    </button>
                    <div>
                        <h1 className="ne-title">Edit Notice</h1>
                        <p className="ne-sub">Update notice content and settings</p>
                    </div>
                </div>

                <div className="ne-card">
                    <div className="ne-card-head">
                        <Bell size={13} style={{ color:"#f59e0b" }}/>
                        <span>Notice Details</span>
                        <span className={`ne-status-badge ${form.isPublished ? "published" : "draft"}`}>
                            {form.isPublished ? "Published" : "Draft"}
                        </span>
                    </div>
                    <form className="ne-form" onSubmit={handleSubmit}>

                        <div className="ne-field">
                            <label className="ne-label">Title</label>
                            <input
                                className="ne-input"
                                value={form.title || ""}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div className="ne-field">
                            <label className="ne-label">Category</label>
                            <select className="ne-select" value={form.category||"General"} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {["General","Academic","Exam","Holiday","Event","Important"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="ne-field">
                            <label className="ne-label">Excerpt</label>
                            <textarea
                                className="ne-textarea" style={{ minHeight:70 }}
                                value={form.excerpt || ""}
                                onChange={e => setForm({ ...form, excerpt: e.target.value })}
                            />
                        </div>

                        <div className="ne-field">
                            <label className="ne-label">Content</label>
                            <textarea
                                className="ne-textarea" style={{ minHeight:200 }}
                                value={form.content || ""}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                            />
                        </div>

                        <label className="ne-checkbox-wrap" onClick={() => setForm({ ...form, isPublished: !form.isPublished })}>
                            <div className={`ne-checkbox ${form.isPublished ? "checked" : ""}`}>
                                {form.isPublished && <span style={{ fontSize:10, color:"#1a1208", fontWeight:800 }}>✓</span>}
                            </div>
                            <span className="ne-checkbox-label">Published</span>
                        </label>

                        <div className="ne-form-footer">
                            <button type="button" className="ne-ghost-btn" onClick={() => router.back()}>Cancel</button>
                            <button type="submit" className="ne-submit-btn" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

// neStyles
const neStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .ne-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:20px; max-width:720px; }

    .ne-header { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
    .ne-back-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 13px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .ne-back-btn:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .ne-title { font-family:'DM Serif Display',serif; font-size:1.5rem; color:var(--cp-text); font-weight:400; }
    .ne-sub   { font-size:12px; color:var(--cp-muted); margin-top:3px; }

    .ne-card { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
    .ne-card-head { display:flex; align-items:center; gap:7px; padding:13px 18px; border-bottom:1px solid var(--cp-border); background:var(--cp-surface2); font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-subtext); }
    .ne-form { padding:20px; display:flex; flex-direction:column; gap:14px; }

    .ne-status-badge { margin-left:auto; font-size:10px; font-weight:700; padding:3px 10px; border-radius:100px; }
    .ne-status-badge.published { background:rgba(34,197,94,0.1); color:var(--cp-success); border:1px solid rgba(34,197,94,0.2); }
    .ne-status-badge.draft     { background:rgba(245,158,11,0.1); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.2); }

    .ne-field { display:flex; flex-direction:column; gap:5px; }
    .ne-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }

    .ne-input, .ne-select, .ne-textarea {
        font-family:'Plus Jakarta Sans',sans-serif; width:100%;
        padding:10px 12px; font-size:13px;
        background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px;
        color:var(--cp-text); outline:none; transition:border-color .15s;
    }
    .ne-input:focus, .ne-select:focus, .ne-textarea:focus { border-color:var(--cp-accent); box-shadow:0 0 0 3px var(--cp-accent-glow); }
    .ne-input::placeholder, .ne-textarea::placeholder { color:var(--cp-border2); }
    .ne-textarea { resize:vertical; }
    .ne-select option { background:var(--cp-surface); }

    .ne-checkbox-wrap { display:flex; align-items:center; gap:9px; cursor:pointer; }
    .ne-checkbox { width:18px; height:18px; border-radius:5px; border:1.5px solid var(--cp-border); background:var(--cp-bg); display:flex; align-items:center; justify-content:center; transition:all .14s; flex-shrink:0; }
    .ne-checkbox.checked { background:var(--cp-accent); border-color:var(--cp-accent); }
    .ne-checkbox-label { font-size:13px; color:var(--cp-subtext); font-weight:500; }

    .ne-form-footer { display:flex; justify-content:flex-end; gap:8px; padding-top:4px; }
    .ne-submit-btn { padding:10px 24px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; }
    .ne-submit-btn:hover { opacity:.88; }
    .ne-submit-btn:disabled { opacity:.5; cursor:not-allowed; }
    .ne-ghost-btn { padding:10px 18px; border-radius:9px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .ne-ghost-btn:hover { border-color:var(--cp-border2); color:var(--cp-subtext); }
`;

