"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Plus, ArrowLeft, Edit2, Trash2, Eye, EyeOff, BookOpen, FileText } from "lucide-react";

interface Note {
    _id: string; title: string; courseSlug: string;
    moduleName: string; moduleSlug: string;
    topicName: string; topicSlug: string;
    isPublished: boolean; order: number; updatedAt: string;
}
interface Course {
    _id: string; name: string; slug: string;
    syllabus: { module: string; topics: string[] }[];
}
type Mode = "list" | "create" | "edit";

export default function AdminNotesPage() {
    const [courses,        setCourses]        = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [notes,          setNotes]          = useState<Note[]>([]);
    const [mode,           setMode]           = useState<Mode>("list");
    const [editingNote,    setEditingNote]    = useState<Note | null>(null);
    const [loading,        setLoading]        = useState(false);
    const [saving,         setSaving]         = useState(false);
    const [toast,          setToast]          = useState<{ msg: string; type: "success"|"error" } | null>(null);
    const [form, setForm] = useState({ moduleName:"", topicName:"", content:"", isPublished:false, order:0 });

    useEffect(() => {
        if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
    }, [toast]);

    const showToast = (msg: string, type: "success"|"error") => setToast({ msg, type });

    useEffect(() => {
        fetchWithAuth("/api/admin/courses").then(r=>r.json())
            .then(d => setCourses(Array.isArray(d) ? d : (d.courses||[])))
            .catch(console.error);
    }, []);

    const fetchNotes = useCallback(async (slug: string) => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/api/admin/notes?courseSlug=${slug}`);
            setNotes((await res.json()).notes || []);
        } catch { showToast("Notes load nahi hue", "error"); }
        finally { setLoading(false); }
    }, []);

    const handleCourseSelect = (slug: string) => {
        const course = courses.find(c => c.slug===slug) || null;
        setSelectedCourse(course); setMode("list"); setEditingNote(null);
        if (course) fetchNotes(course.slug);
    };

    const openCreate = () => {
        setForm({ moduleName:"", topicName:"", content:"", isPublished:false, order:0 });
        setEditingNote(null); setMode("create");
    };

    const openEdit = async (note: Note) => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}`);
            const d   = await res.json();
            setForm({ moduleName:d.note.moduleName, topicName:d.note.topicName, content:d.content||"", isPublished:d.note.isPublished, order:d.note.order });
            setEditingNote(note); setMode("edit");
        } catch { showToast("Note load nahi hua","error"); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (!selectedCourse) return;
        if (!form.moduleName.trim()||!form.topicName.trim()) { showToast("Module aur Topic name required","error"); return; }
        setSaving(true);
        console.log("Sending:", { courseSlug: selectedCourse.slug, ...form });
        try {
            if (mode==="create") {
                const res = await fetchWithAuth("/api/admin/notes", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ courseSlug:selectedCourse.slug, ...form }) });
                const d = await res.json(); if (!res.ok) throw new Error(d.error);
                showToast("Note create ho gaya ✓","success");
            } else if (mode==="edit" && editingNote) {
                const res = await fetchWithAuth(`/api/admin/notes/${editingNote._id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
                const d = await res.json(); if (!res.ok) throw new Error(d.error);
                showToast("Note update ho gaya ✓","success");
            }
            fetchNotes(selectedCourse.slug); setMode("list");
        } catch (err: any) { showToast(err.message||"Save nahi hua","error"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (note: Note) => {
        if (!confirm(`"${note.title}" delete karna chahte ho?`)) return;
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}`, { method:"DELETE" });
            if (!res.ok) throw new Error();
            showToast("Note delete ho gaya","success");
            setNotes(prev => prev.filter(n => n._id!==note._id));
        } catch { showToast("Delete nahi hua","error"); }
    };

    const handleTogglePublish = async (note: Note) => {
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ isPublished:!note.isPublished }) });
            if (!res.ok) throw new Error();
            setNotes(prev => prev.map(n => n._id===note._id ? {...n, isPublished:!n.isPublished} : n));
            showToast(note.isPublished ? "Unpublished" : "Published ✓","success");
        } catch { showToast("Update nahi hua","error"); }
    };

    const groupedNotes = notes.reduce<Record<string, Note[]>>((acc, note) => {
        if (!acc[note.moduleName]) acc[note.moduleName] = [];
        acc[note.moduleName].push(note);
        return acc;
    }, {});

    const published = notes.filter(n=>n.isPublished).length;

    return (
        <>
            <style>{admStyles}</style>

            {/* Toast */}
            {toast && (
                <div className={`adm-toast ${toast.type}`}>{toast.msg}</div>
            )}

            <div className="adm-root">

                {/* Header */}
                <div className="adm-header">
                    <div>
                        <h1 className="adm-title">Notes Management</h1>
                        <p className="adm-sub">Course-wise study notes manage karo</p>
                    </div>
                </div>

                {/* Course selector */}
                <div className="adm-card">
                    <div className="adm-card-head">
                        <BookOpen size={13} style={{ color:"var(--cp-accent)" }}/>
                        <span>Select Course</span>
                    </div>
                    <div style={{ padding:"16px 18px" }}>
                        <select className="adm-select" style={{ maxWidth:360 }}
                            value={selectedCourse?.slug||""}
                            onChange={e => handleCourseSelect(e.target.value)}>
                            <option value="">-- Course chunno --</option>
                            {courses.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {selectedCourse && (
                    <>
                        {/* Toolbar */}
                        <div className="adm-toolbar">
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <span className="adm-course-name">{selectedCourse.name}</span>
                                <span className="adm-stat-badge">{notes.length} notes</span>
                                <span className="adm-stat-badge green">{published} published</span>
                            </div>
                            {mode==="list" ? (
                                <button className="adm-add-btn" onClick={openCreate}>
                                    <Plus size={13}/> New Note
                                </button>
                            ) : (
                                <button className="adm-back-btn" onClick={() => setMode("list")}>
                                    <ArrowLeft size={12}/> Back
                                </button>
                            )}
                        </div>

                        {/* Create / Edit Form */}
                        {(mode==="create"||mode==="edit") && (
                            <div className="adm-card">
                                <div className="adm-card-head">
                                    <FileText size={13} style={{ color:"var(--cp-accent)" }}/>
                                    <span>{mode==="create" ? "Create New Note" : "Edit Note"}</span>
                                </div>
                                <div className="adm-form-body">
                                    <div className="adm-form-grid">
                                        <div className="adm-field">
                                            <label className="adm-label">Module Name *</label>
                                            <input
                                                list="adm-module-list" className="adm-input"
                                                placeholder="e.g. MS Office, Tally Prime"
                                                value={form.moduleName}
                                                onChange={e => setForm(f=>({...f, moduleName:e.target.value}))}
                                            />
                                            <datalist id="adm-module-list">
                                                {selectedCourse.syllabus?.map((s,i) => <option key={i} value={s.module}/>)}
                                            </datalist>
                                        </div>
                                        <div className="adm-field">
                                            <label className="adm-label">Topic Name *</label>
                                            <input
                                                list="adm-topic-list" className="adm-input"
                                                placeholder="e.g. Introduction to MS Word"
                                                value={form.topicName}
                                                onChange={e => setForm(f=>({...f, topicName:e.target.value}))}
                                            />
                                            <datalist id="adm-topic-list">
                                                {selectedCourse.syllabus?.find(s=>s.module===form.moduleName)?.topics.map((t,i) => <option key={i} value={t}/>)}
                                            </datalist>
                                        </div>
                                        <div className="adm-field">
                                            <label className="adm-label">Order</label>
                                            <input className="adm-input" type="number" min={0}
                                                value={form.order}
                                                onChange={e => setForm(f=>({...f, order:Number(e.target.value)}))}/>
                                        </div>
                                        <div className="adm-field" style={{ justifyContent:"flex-end" }}>
                                            <label className="adm-checkbox-wrap" onClick={() => setForm(f=>({...f, isPublished:!f.isPublished}))}>
                                                <div className={`adm-checkbox ${form.isPublished?"checked":""}`}>
                                                    {form.isPublished && <span style={{ fontSize:9,color:"#1a1208",fontWeight:800 }}>✓</span>}
                                                </div>
                                                <span className="adm-checkbox-label">Publish immediately</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="adm-field">
                                        <label className="adm-label">Content (Markdown)</label>
                                        <p style={{ fontSize:10,color:"#334155",marginBottom:6 }}>
                                            # Heading, **bold**, `code`, ```code block``` supported
                                        </p>
                                        <textarea
                                            className="adm-textarea adm-mono" rows={22}
                                            value={form.content}
                                            onChange={e => setForm(f=>({...f, content:e.target.value}))}
                                            placeholder={`# Topic Title\n\n## Introduction\n\nYahan apna content likho...\n\n## Points\n\n- Point 1\n- Point 2`}
                                            spellCheck={false}
                                        />
                                    </div>

                                    <div style={{ display:"flex", gap:8 }}>
                                        <button className="adm-submit-btn" onClick={handleSave} disabled={saving}>
                                            {saving ? "Saving..." : mode==="create" ? "Create Note" : "Update Note"}
                                        </button>
                                        <button className="adm-ghost-btn" onClick={() => setMode("list")}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes list */}
                        {mode==="list" && (
                            loading ? (
                                <div className="adm-loading"><div className="adm-spinner"/> Loading notes…</div>
                            ) : notes.length===0 ? (
                                <div className="adm-empty">
                                    <div style={{ fontSize:28,marginBottom:8 }}>📝</div>
                                    <div style={{ fontSize:13,color:"#64748b",marginBottom:12 }}>Is course mein abhi koi note nahi hai</div>
                                    <button className="adm-add-btn" onClick={openCreate}><Plus size={12}/> Pehla note create karo</button>
                                </div>
                            ) : (
                                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                    {Object.entries(groupedNotes).map(([moduleName, moduleNotes]) => (
                                        <div key={moduleName} className="adm-card">
                                            <div className="adm-module-head">
                                                <BookOpen size={13} style={{ color:"var(--cp-accent)" }}/>
                                                <span>{moduleName}</span>
                                                <span className="adm-stat-badge" style={{ marginLeft:"auto" }}>{moduleNotes.length} notes</span>
                                            </div>
                                            <div>
                                                {moduleNotes.map(note => (
                                                    <div key={note._id} className="adm-note-row">
                                                        <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
                                                            <span className="adm-note-order">#{note.order}</span>
                                                            <span className="adm-note-title">{note.title}</span>
                                                            <span className={`adm-pub-badge ${note.isPublished?"pub":"draft"}`}>
                                                                {note.isPublished ? "Published" : "Draft"}
                                                            </span>
                                                        </div>
                                                        <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                                                            <button className={`adm-icon-btn ${note.isPublished?"muted":"success"}`}
                                                                onClick={() => handleTogglePublish(note)}
                                                                title={note.isPublished?"Unpublish":"Publish"}>
                                                                {note.isPublished ? <EyeOff size={11}/> : <Eye size={11}/>}
                                                            </button>
                                                            <button className="adm-icon-btn amber" onClick={() => openEdit(note)} title="Edit">
                                                                <Edit2 size={11}/>
                                                            </button>
                                                            <button className="adm-icon-btn danger" onClick={() => handleDelete(note)} title="Delete">
                                                                <Trash2 size={11}/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </>
    );
}

const admStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');
    .adm-root  { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }
    .adm-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); animation:admToastIn .2s ease; }
    .adm-toast.success { background:rgba(34,197,94,0.12); color:var(--cp-success); border:1px solid rgba(34,197,94,0.3); }
    .adm-toast.error   { background:rgba(239,68,68,0.12);  color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.3); }
    @keyframes admToastIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

    .adm-header { display:flex; align-items:flex-start; justify-content:space-between; }
    .adm-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .adm-sub    { font-size:12px; color:var(--cp-muted); margin-top:3px; }

    .adm-card      { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
    .adm-card-head { display:flex; align-items:center; gap:7px; padding:12px 18px; border-bottom:1px solid var(--cp-border); background:var(--cp-surface2); font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-subtext); }
    .adm-form-body { padding:18px; display:flex; flex-direction:column; gap:14px; }
    .adm-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    @media(max-width:600px){ .adm-form-grid { grid-template-columns:1fr; } }

    .adm-field { display:flex; flex-direction:column; gap:5px; }
    .adm-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }

    .adm-input, .adm-select, .adm-textarea {
        font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px;
        background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px;
        color:var(--cp-text); outline:none; transition:border-color .15s; width:100%;
    }
    .adm-input:focus,.adm-select:focus,.adm-textarea:focus { border-color:var(--cp-accent); box-shadow:0 0 0 3px var(--cp-accent-glow); }
    .adm-input::placeholder,.adm-textarea::placeholder { color:var(--cp-border2); }
    .adm-select option { background:var(--cp-surface); }
    .adm-textarea { resize:vertical; }
    .adm-mono { font-family:'JetBrains Mono','Fira Code',monospace !important; font-size:12px !important; line-height:1.7; }

    .adm-checkbox-wrap  { display:flex; align-items:center; gap:8px; cursor:pointer; margin-top:8px; }
    .adm-checkbox       { width:17px; height:17px; border-radius:5px; border:1.5px solid var(--cp-border); background:var(--cp-bg); display:flex; align-items:center; justify-content:center; transition:all .14s; flex-shrink:0; }
    .adm-checkbox.checked { background:var(--cp-accent); border-color:var(--cp-accent); }
    .adm-checkbox-label { font-size:12px; color:var(--cp-subtext); font-weight:500; }

    .adm-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .adm-course-name { font-size:14px; font-weight:700; color:var(--cp-text); }

    .adm-stat-badge { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; background:rgba(100,116,139,0.1); color:var(--cp-muted); border:1px solid rgba(100,116,139,0.2); }
    .adm-stat-badge.green { background:rgba(34,197,94,0.08); color:var(--cp-success); border-color:rgba(34,197,94,0.2); }

    .adm-module-head { display:flex; align-items:center; gap:8px; padding:11px 16px; background:var(--cp-surface2); border-bottom:1px solid var(--cp-border); font-size:11px; font-weight:700; color:var(--cp-subtext); letter-spacing:.06em; text-transform:uppercase; }

    .adm-note-row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:11px 16px; border-top:1px solid var(--cp-border); transition:background .12s; }
    .adm-note-row:hover { background:var(--cp-accent-glow); }
    .adm-note-order { font-size:10px; color:var(--cp-border2); font-family:'JetBrains Mono',monospace; flex-shrink:0; }
    .adm-note-title { font-size:12.5px; color:var(--cp-text); font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; }
    .adm-pub-badge  { font-size:9.5px; font-weight:700; padding:2px 8px; border-radius:100px; flex-shrink:0; }
    .adm-pub-badge.pub   { background:rgba(34,197,94,0.1);  color:var(--cp-success); border:1px solid rgba(34,197,94,0.2);  }
    .adm-pub-badge.draft { background:rgba(245,158,11,0.08); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.2); }

    .adm-add-btn  { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; }
    .adm-add-btn:hover { opacity:.88; }
    .adm-back-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 13px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .adm-back-btn:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
    .adm-submit-btn { padding:10px 22px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; }
    .adm-submit-btn:disabled { opacity:.5; cursor:not-allowed; }
    .adm-ghost-btn { padding:10px 18px; border-radius:9px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
    .adm-ghost-btn:hover { border-color:var(--cp-border2); color:var(--cp-subtext); }

    .adm-icon-btn { width:27px; height:27px; border-radius:7px; border:1px solid; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; }
    .adm-icon-btn.amber   { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
    .adm-icon-btn.amber:hover   { background:color-mix(in srgb,var(--cp-accent) 20%,transparent); }
    .adm-icon-btn.danger  { background:rgba(239,68,68,0.08); color:var(--cp-danger);  border-color:rgba(239,68,68,0.2); }
    .adm-icon-btn.danger:hover  { background:rgba(239,68,68,0.2); }
    .adm-icon-btn.success { background:rgba(34,197,94,0.08); color:var(--cp-success); border-color:rgba(34,197,94,0.2); }
    .adm-icon-btn.success:hover { background:rgba(34,197,94,0.2); }
    .adm-icon-btn.muted   { background:rgba(100,116,139,0.08); color:var(--cp-muted); border-color:rgba(100,116,139,0.2); }
    .adm-icon-btn.muted:hover   { background:rgba(100,116,139,0.18); }

    .adm-loading { display:flex; align-items:center; gap:10px; padding:32px; color:var(--cp-muted); font-size:13px; }
    .adm-spinner { width:18px; height:18px; border:2px solid var(--cp-border); border-top-color:var(--cp-accent); border-radius:50%; animation:admSpin .7s linear infinite; }
    @keyframes admSpin { to { transform:rotate(360deg); } }
    .adm-empty { background:var(--cp-surface); border:1px dashed var(--cp-border); border-radius:12px; padding:48px; text-align:center; }
`;