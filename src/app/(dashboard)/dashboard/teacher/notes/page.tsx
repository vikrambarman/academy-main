// src/app/dashboard/teacher/notes/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff, BookOpen, CheckCircle, AlertCircle, ChevronDown, FileText } from "lucide-react";

interface Note {
    _id: string;
    title: string;
    content: string;
    courseSlug: string;
    moduleSlug: string;
    topicSlug: string;
    isPublished: boolean;
    order: number;
    createdAt: string;
}

interface Course { _id: string; name: string; slug?: string; }

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);

export default function TeacherNotesPage() {
    const [notes,      setNotes]      = useState<Note[]>([]);
    const [courses,    setCourses]    = useState<Course[]>([]);
    const [courseSlug, setCourseSlug] = useState("");
    const [loading,    setLoading]    = useState(false);
    const [toast,      setToast]      = useState<{ type:"success"|"error"; msg:string }|null>(null);

    // Modal state
    const [modal,    setModal]    = useState(false);
    const [editNote, setEditNote] = useState<Note|null>(null);
    const [saving,   setSaving]   = useState(false);
    const [preview,  setPreview]  = useState(false);

    const [form, setForm] = useState({
        title: "", content: "", courseSlug: "",
        moduleSlug: "", topicSlug: "", isPublished: false, order: 0,
    });

    const showToast = (type: "success"|"error", msg: string) => {
        setToast({ type, msg }); setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        fetchWithAuth("/api/teacher/courses")
            .then(r => r.json())
            .then(d => setCourses(d.courses || []))
            .catch(() => {});
    }, []);

    const loadNotes = useCallback(async () => {
        setLoading(true);
        try {
            const url = courseSlug ? `/api/teacher/notes?courseSlug=${courseSlug}` : "/api/teacher/notes";
            const res = await fetchWithAuth(url);
            const d   = await res.json();
            setNotes(d.notes || []);
        } finally {
            setLoading(false);
        }
    }, [courseSlug]);

    useEffect(() => { loadNotes(); }, [loadNotes]);

    const openCreate = () => {
        setEditNote(null);
        setForm({ title:"", content:"", courseSlug: courseSlug||"", moduleSlug:"", topicSlug:"", isPublished:false, order:0 });
        setPreview(false);
        setModal(true);
    };

    const openEdit = (note: Note) => {
        setEditNote(note);
        setForm({ title:note.title, content:note.content, courseSlug:note.courseSlug, moduleSlug:note.moduleSlug, topicSlug:note.topicSlug, isPublished:note.isPublished, order:note.order });
        setPreview(false);
        setModal(true);
    };

    const handleSave = async () => {
        if (!form.title || !form.courseSlug || !form.moduleSlug || !form.topicSlug) {
            return showToast("error", "Title, course, module aur topic required hain");
        }
        setSaving(true);
        try {
            let res;
            if (editNote) {
                res = await fetchWithAuth("/api/teacher/notes", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editNote._id, ...form }),
                });
            } else {
                res = await fetchWithAuth("/api/teacher/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            }
            const d = await res.json();
            if (!res.ok) throw new Error(d.message);
            showToast("success", editNote ? "Note update ho gaya" : "Note create ho gaya");
            setModal(false);
            loadNotes();
        } catch (e: any) {
            showToast("error", e.message || "Error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Ye note delete karna chahte ho?")) return;
        const res = await fetchWithAuth(`/api/teacher/notes?id=${id}`, { method: "DELETE" });
        if (res.ok) { showToast("success", "Note delete ho gaya"); loadNotes(); }
    };

    const togglePublish = async (note: Note) => {
        const res = await fetchWithAuth("/api/teacher/notes", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: note._id, isPublished: !note.isPublished }),
        });
        if (res.ok) { showToast("success", `Note ${!note.isPublished ? "published" : "unpublished"}`); loadNotes(); }
    };

    const courseOptions = courses.map(c => ({ slug: c.slug || slugify(c.name), name: c.name }));

    return (
        <>
            <style>{css}</style>

            {toast && (
                <div className={`tn-toast tn-toast--${toast.type}`}>
                    {toast.type==="success" ? <CheckCircle size={14}/> : <AlertCircle size={14}/>} {toast.msg}
                </div>
            )}

            <div className="tn-root">

                {/* Header */}
                <div className="tn-header">
                    <div>
                        <h1 className="tn-title">Notes</h1>
                        <p className="tn-sub">Study material create aur manage karo</p>
                    </div>
                    <button className="tn-add-btn" onClick={openCreate}>
                        <Plus size={13}/> Add Note
                    </button>
                </div>

                {/* Filter */}
                <div className="tn-filter-bar">
                    <div className="tn-field">
                        <label className="tn-label">Filter by Course</label>
                        <div className="tn-sel-wrap">
                            <select className="tn-select" value={courseSlug}
                                onChange={e => setCourseSlug(e.target.value)}>
                                <option value="">All Courses</option>
                                {courseOptions.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={12} className="tn-sel-icon"/>
                        </div>
                    </div>
                    <div className="tn-count">{notes.length} note{notes.length !== 1 ? "s" : ""}</div>
                </div>

                {/* Notes grid */}
                {loading ? (
                    <div className="tn-empty">Loading...</div>
                ) : notes.length === 0 ? (
                    <div className="tn-empty">
                        <FileText size={28} style={{ opacity:.25 }}/>
                        <span>Koi note nahi — Add Note karo</span>
                    </div>
                ) : (
                    <div className="tn-grid">
                        {notes.map(note => (
                            <div key={note._id} className={`tn-card ${note.isPublished ? "published" : ""}`}>
                                <div className="tn-card-top">
                                    <span className={`tn-badge ${note.isPublished ? "pub" : "draft"}`}>
                                        {note.isPublished ? "Published" : "Draft"}
                                    </span>
                                    <div className="tn-card-actions">
                                        <button className="tn-icon-btn" title={note.isPublished ? "Unpublish" : "Publish"}
                                            onClick={() => togglePublish(note)}>
                                            {note.isPublished ? <EyeOff size={12}/> : <Eye size={12}/>}
                                        </button>
                                        <button className="tn-icon-btn tn-icon-btn--teal" title="Edit"
                                            onClick={() => openEdit(note)}>
                                            <Edit2 size={12}/>
                                        </button>
                                        <button className="tn-icon-btn tn-icon-btn--red" title="Delete"
                                            onClick={() => handleDelete(note._id)}>
                                            <Trash2 size={12}/>
                                        </button>
                                    </div>
                                </div>

                                <div className="tn-card-title">{note.title}</div>

                                <div className="tn-card-meta">
                                    <span className="tn-meta-chip">{note.courseSlug}</span>
                                    <span className="tn-meta-sep">›</span>
                                    <span className="tn-meta-chip">{note.moduleSlug}</span>
                                    <span className="tn-meta-sep">›</span>
                                    <span className="tn-meta-chip">{note.topicSlug}</span>
                                </div>

                                <div className="tn-card-preview">
                                    {note.content
                                        ? note.content.replace(/[#*`_\[\]]/g, "").slice(0, 100) + (note.content.length > 100 ? "..." : "")
                                        : <span style={{ color:"#475569" }}>Content nahi hai</span>
                                    }
                                </div>

                                <div className="tn-card-footer">
                                    <BookOpen size={10}/> Order #{note.order} &nbsp;·&nbsp;
                                    {new Date(note.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="tn-overlay" onClick={e => e.target===e.currentTarget && setModal(false)}>
                    <div className="tn-modal">
                        <div className="tn-modal-head">
                            <span className="tn-modal-title">{editNote ? "Edit Note" : "New Note"}</span>
                            <div className="tn-modal-head-actions">
                                <button className="tn-preview-toggle" onClick={() => setPreview(p => !p)}>
                                    {preview ? <><EyeOff size={12}/> Edit</> : <><Eye size={12}/> Preview</>}
                                </button>
                                <button className="tn-modal-close" onClick={() => setModal(false)}><X size={13}/></button>
                            </div>
                        </div>

                        <div className="tn-modal-body">
                            <div className="tn-form-row">
                                <div className="tn-field tn-field--full">
                                    <label className="tn-label">Title *</label>
                                    <input className="tn-input" placeholder="e.g. Introduction to HTML"
                                        value={form.title}
                                        onChange={e => setForm(f => ({...f, title: e.target.value}))}/>
                                </div>
                            </div>

                            <div className="tn-form-row tn-form-row--3">
                                <div className="tn-field">
                                    <label className="tn-label">Course *</label>
                                    <div className="tn-sel-wrap">
                                        <select className="tn-select" value={form.courseSlug}
                                            onChange={e => setForm(f => ({...f, courseSlug: e.target.value}))}>
                                            <option value="">Select course</option>
                                            {courseOptions.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                                        </select>
                                        <ChevronDown size={11} className="tn-sel-icon"/>
                                    </div>
                                </div>
                                <div className="tn-field">
                                    <label className="tn-label">Module *</label>
                                    <input className="tn-input" placeholder="e.g. HTML Basics"
                                        value={form.moduleSlug}
                                        onChange={e => setForm(f => ({...f, moduleSlug: slugify(e.target.value)}))}/>
                                </div>
                                <div className="tn-field">
                                    <label className="tn-label">Topic *</label>
                                    <input className="tn-input" placeholder="e.g. Tags & Elements"
                                        value={form.topicSlug}
                                        onChange={e => setForm(f => ({...f, topicSlug: slugify(e.target.value)}))}/>
                                </div>
                            </div>

                            <div className="tn-form-row">
                                <div className="tn-field tn-field--full">
                                    <label className="tn-label">Content (Markdown)</label>
                                    {preview ? (
                                        <div className="tn-preview-box">
                                            {form.content || <span style={{ color:"#475569" }}>Kuch nahi likha</span>}
                                        </div>
                                    ) : (
                                        <textarea className="tn-textarea" rows={10}
                                            placeholder="# Heading&#10;&#10;Content yahan likho... Markdown supported hai"
                                            value={form.content}
                                            onChange={e => setForm(f => ({...f, content: e.target.value}))}/>
                                    )}
                                </div>
                            </div>

                            <div className="tn-form-row tn-form-row--split">
                                <div className="tn-field">
                                    <label className="tn-label">Order</label>
                                    <input type="number" className="tn-input" min={0} value={form.order}
                                        onChange={e => setForm(f => ({...f, order: Number(e.target.value)}))}/>
                                </div>
                                <label className="tn-toggle">
                                    <input type="checkbox" checked={form.isPublished}
                                        onChange={e => setForm(f => ({...f, isPublished: e.target.checked}))}
                                        style={{ accentColor:"#14b8a6" }}/>
                                    <span>Publish immediately</span>
                                </label>
                            </div>
                        </div>

                        <div className="tn-modal-footer">
                            <button className="tn-ghost-btn" onClick={() => setModal(false)}>Cancel</button>
                            <button className="tn-teal-btn" onClick={handleSave} disabled={saving}>
                                <Save size={12}/> {saving ? "Saving..." : editNote ? "Update Note" : "Create Note"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const css = `
.tn-root{display:flex;flex-direction:column;gap:18px;max-width:960px;margin:0 auto;padding-bottom:48px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;}

.tn-toast{position:fixed;top:20px;right:24px;z-index:9999;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;padding:11px 18px;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.4);animation:tnIn .22s ease;}
.tn-toast--success{background:#052e16;color:#4ade80;border:1px solid #166534;}
.tn-toast--error{background:#2d0a0a;color:#f87171;border:1px solid #7f1d1d;}
@keyframes tnIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

.tn-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.tn-title{font-family:'DM Serif Display',serif;font-size:1.7rem;color:#f8fafc;font-weight:400;margin:0 0 3px;}
.tn-sub{font-size:12px;color:#64748b;margin:0;}
.tn-add-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:9px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;background:#14b8a6;color:#042f2e;transition:opacity .14s;}
.tn-add-btn:hover{opacity:.85;}

.tn-filter-bar{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;background:#0d1b24;border:1px solid #132330;border-radius:12px;padding:14px 18px;}
.tn-field{display:flex;flex-direction:column;gap:5px;flex:1;max-width:280px;}
.tn-field--full{max-width:100%;}
.tn-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:#64748b;}
.tn-sel-wrap{position:relative;}
.tn-select{width:100%;appearance:none;background:#07111a;border:1px solid #132330;border-radius:9px;padding:9px 28px 9px 11px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;cursor:pointer;outline:none;transition:border-color .13s;}
.tn-select:focus{border-color:#14b8a6;}
.tn-sel-icon{position:absolute;right:9px;top:50%;transform:translateY(-50%);color:#64748b;pointer-events:none;}
.tn-input{background:#07111a;border:1px solid #132330;border-radius:9px;padding:9px 11px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;outline:none;transition:border-color .13s;width:100%;}
.tn-input:focus{border-color:#14b8a6;}
.tn-count{font-size:12px;font-weight:700;color:#64748b;white-space:nowrap;}

.tn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;}

.tn-card{background:#0d1b24;border:1px solid #132330;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:10px;transition:border-color .14s;}
.tn-card.published{border-color:rgba(20,184,166,.2);}
.tn-card:hover{border-color:#1e3a4a;}

.tn-card-top{display:flex;align-items:center;justify-content:space-between;}
.tn-badge{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;padding:3px 9px;border-radius:100px;}
.tn-badge.pub{background:rgba(20,184,166,.12);color:#14b8a6;border:1px solid rgba(20,184,166,.25);}
.tn-badge.draft{background:rgba(100,116,139,.1);color:#64748b;border:1px solid rgba(100,116,139,.2);}
.tn-card-actions{display:flex;gap:5px;}
.tn-icon-btn{width:26px;height:26px;border-radius:7px;border:1px solid #132330;background:transparent;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;}
.tn-icon-btn:hover{background:#132330;color:#94a3b8;}
.tn-icon-btn--teal{color:#14b8a6;border-color:rgba(20,184,166,.2);}
.tn-icon-btn--teal:hover{background:rgba(20,184,166,.08);}
.tn-icon-btn--red{color:#f87171;border-color:rgba(248,113,113,.2);}
.tn-icon-btn--red:hover{background:rgba(248,113,113,.08);}

.tn-card-title{font-size:14px;font-weight:700;color:#f1f5f9;line-height:1.4;}
.tn-card-meta{display:flex;align-items:center;gap:4px;flex-wrap:wrap;}
.tn-meta-chip{font-size:9px;font-weight:700;padding:2px 7px;border-radius:100px;background:#07111a;border:1px solid #132330;color:#475569;}
.tn-meta-sep{font-size:10px;color:#334155;}
.tn-card-preview{font-size:12px;color:#64748b;line-height:1.6;flex:1;}
.tn-card-footer{display:flex;align-items:center;gap:4px;font-size:10px;color:#334155;border-top:1px solid #132330;padding-top:8px;}

.tn-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:52px;font-size:13px;color:#475569;border:1px dashed #132330;border-radius:12px;}

/* Modal */
.tn-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);z-index:60;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;}
.tn-modal{background:#0d1b24;border:1px solid #132330;border-radius:16px;width:100%;max-width:680px;box-shadow:0 24px 60px rgba(0,0,0,.5);animation:tnIn .18s ease;margin:auto;}
.tn-modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #132330;}
.tn-modal-title{font-family:'DM Serif Display',serif;font-size:1.1rem;color:#f1f5f9;}
.tn-modal-head-actions{display:flex;align-items:center;gap:8px;}
.tn-preview-toggle{display:flex;align-items:center;gap:5px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;padding:5px 11px;border-radius:8px;border:1px solid #132330;background:transparent;color:#64748b;cursor:pointer;}
.tn-preview-toggle:hover{border-color:#14b8a6;color:#14b8a6;}
.tn-modal-close{width:26px;height:26px;border-radius:7px;border:1px solid #132330;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;}
.tn-modal-close:hover{background:#132330;color:#f1f5f9;}
.tn-modal-body{padding:20px;display:flex;flex-direction:column;gap:14px;}
.tn-modal-footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid #132330;}

.tn-form-row{display:flex;gap:12px;flex-wrap:wrap;}
.tn-form-row--3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.tn-form-row--split{display:flex;align-items:flex-end;gap:16px;}
.tn-textarea{width:100%;background:#07111a;border:1px solid #132330;border-radius:9px;padding:10px 12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#f1f5f9;outline:none;resize:vertical;transition:border-color .13s;}
.tn-textarea:focus{border-color:#14b8a6;}
.tn-preview-box{background:#07111a;border:1px solid #132330;border-radius:9px;padding:12px;font-size:13px;color:#94a3b8;min-height:200px;white-space:pre-wrap;line-height:1.7;}
.tn-toggle{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#94a3b8;cursor:pointer;white-space:nowrap;padding-bottom:9px;}

.tn-ghost-btn{padding:9px 16px;border-radius:8px;border:1px solid #132330;background:transparent;color:#64748b;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;}
.tn-ghost-btn:hover{border-color:#334155;color:#94a3b8;}
.tn-teal-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:8px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;background:#14b8a6;color:#042f2e;}
.tn-teal-btn:disabled{opacity:.5;cursor:not-allowed;}

@media(max-width:500px){ .tn-form-row--3{grid-template-columns:1fr;} }
`;