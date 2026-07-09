"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import dynamic from "next/dynamic";
import {
    Plus, ArrowLeft, Edit2, Trash2, Eye, EyeOff,
    BookOpen, FileText, Share2, User, X, Loader,
    Code2, AlignLeft,
} from "lucide-react";
import ShareNoteModal    from "@/components/ShareNoteModal";

// Monaco editor — SSR off
const NoteHtmlEditor = dynamic(
    () => import("@/components/lms/NoteHtmlEditor"),
    {
        ssr:     false,
        loading: () => (
            <div style={{
                height:          600,
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                background:      "#1e1e1e",
                borderRadius:    12,
                color:           "#6b7280",
                fontSize:        13,
                gap:             10,
                fontFamily:      "'Plus Jakarta Sans', sans-serif",
            }}>
                <div style={{
                    width:          18,
                    height:         18,
                    border:         "2px solid #374151",
                    borderTopColor: "#6366f1",
                    borderRadius:   "50%",
                    animation:      "admSpin .7s linear infinite",
                }}/>
                Editor load ho raha hai…
            </div>
        ),
    }
);

// ── Types ─────────────────────────────────────────────────
interface SharedStudent { _id: string; name: string; studentId: string; }

interface Note {
    _id:              string;
    title:            string;
    courseSlug:       string;
    moduleName:       string;
    moduleSlug:       string;
    topicName:        string;
    topicSlug:        string;
    isPublished:      boolean;
    order:            number;
    updatedAt:        string;
    contentType?:     "markdown" | "html";
    isSharedNote?:    boolean;
    displayModuleName?: string;
    sharedWithStudents?: SharedStudent[];
}

interface Course {
    _id:      string;
    name:     string;
    slug:     string;
    syllabus: { module: string; topics: string[] }[];
}

type Mode       = "list" | "create" | "edit";
type EditorMode = "html" | "markdown";

interface FormState {
    moduleName:  string;
    topicName:   string;
    content:     string;
    contentType: "markdown" | "html";
    isPublished: boolean;
    order:       number;
}

const EMPTY_FORM: FormState = {
    moduleName:  "",
    topicName:   "",
    content:     "",
    contentType: "html",
    isPublished: false,
    order:       0,
};

// ── Component ─────────────────────────────────────────────
export default function AdminNotesPage() {

    const [courses,           setCourses]           = useState<Course[]>([]);
    const [selectedCourse,    setSelectedCourse]    = useState<Course | null>(null);
    const [notes,             setNotes]             = useState<Note[]>([]);
    const [mode,              setMode]              = useState<Mode>("list");
    const [editorMode,        setEditorMode]        = useState<EditorMode>("html");
    const [editingNote,       setEditingNote]       = useState<Note | null>(null);
    const [loading,           setLoading]           = useState(false);
    const [saving,            setSaving]            = useState(false);
    const [globalCss,         setGlobalCss]         = useState("");
    const [toast,             setToast]             = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [form,              setForm]              = useState<FormState>(EMPTY_FORM);
    const [sharingNote,       setSharingNote]       = useState<Note | null>(null);
    const [studentShareModal, setStudentShareModal] = useState<Note | null>(null);

    // Toast auto-hide
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const showToast = (msg: string, type: "success" | "error") =>
        setToast({ msg, type });

    // Global CSS + Courses load
    useEffect(() => {
        // Global CSS fetch karo
        fetchWithAuth("/api/admin/settings")
            .then(r => r.json())
            .then(d => setGlobalCss(d.settings?.globalNotesCSS || ""))
            .catch(console.error);

        // Courses fetch karo
        fetchWithAuth("/api/admin/courses")
            .then(r => r.json())
            .then(d => setCourses(Array.isArray(d) ? d : (d.courses || [])))
            .catch(console.error);
    }, []);

    const fetchNotes = useCallback(async (slug: string) => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/api/admin/notes?courseSlug=${slug}`);
            setNotes((await res.json()).notes || []);
        } catch {
            showToast("Notes load nahi hue", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCourseSelect = (slug: string) => {
        const course = courses.find(c => c.slug === slug) || null;
        setSelectedCourse(course);
        setMode("list");
        setEditingNote(null);
        if (course) fetchNotes(course.slug);
    };

    // ── Open Create ───────────────────────────────────────
    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditorMode("html");
        setEditingNote(null);
        setMode("create");
    };

    // ── Open Edit ─────────────────────────────────────────
    const openEdit = async (note: Note) => {
        setLoading(true);
        try {
            const res   = await fetchWithAuth(`/api/admin/notes/${note._id}`);
            const d     = await res.json();
            const cType = (d.note.contentType || "html") as "markdown" | "html";

            setForm({
                moduleName:  d.note.moduleName,
                topicName:   d.note.topicName,
                content:     d.content || "",
                contentType: cType,
                isPublished: d.note.isPublished,
                order:       d.note.order,
            });
            setEditorMode(cType === "html" ? "html" : "markdown");
            setEditingNote(note);
            setMode("edit");
        } catch {
            showToast("Note load nahi hua", "error");
        } finally {
            setLoading(false);
        }
    };

    // ── Save ─────────────────────────────────────────────
    const handleSave = async () => {
        if (!selectedCourse) return;
        if (!form.moduleName.trim() || !form.topicName.trim()) {
            showToast("Module aur Topic name required hain", "error");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                courseSlug:  selectedCourse.slug,
                moduleName:  form.moduleName,
                topicName:   form.topicName,
                content:     form.content,
                contentType: editorMode === "html" ? "html" : "markdown",
                isPublished: form.isPublished,
                order:       form.order,
            };

            if (mode === "create") {
                const res = await fetchWithAuth("/api/admin/notes", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify(payload),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.error);
                showToast("Note create ho gaya ✓", "success");
            } else if (mode === "edit" && editingNote) {
                const res = await fetchWithAuth(`/api/admin/notes/${editingNote._id}`, {
                    method:  "PUT",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify(payload),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.error);
                showToast("Note update ho gaya ✓", "success");
            }

            fetchNotes(selectedCourse.slug);
            setMode("list");
        } catch (err: any) {
            showToast(err.message || "Save nahi hua", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (note: Note) => {
        if (!confirm(`"${note.title}" delete karna chahte ho?`)) return;
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            showToast("Note delete ho gaya", "success");
            setNotes(prev => prev.filter(n => n._id !== note._id));
        } catch { showToast("Delete nahi hua", "error"); }
    };

    const handleRemoveShare = async (note: Note) => {
        if (!selectedCourse) return;
        if (!confirm(`"${note.title}" ko is course se remove karna chahte ho?`)) return;
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}/share`, {
                method:  "DELETE",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ type: "course", courseSlug: selectedCourse.slug }),
            });
            if (!res.ok) throw new Error();
            showToast("Shared note remove ho gaya", "success");
            setNotes(prev => prev.filter(n => !(n._id === note._id && n.isSharedNote)));
        } catch { showToast("Remove nahi hua", "error"); }
    };

    const handleTogglePublish = async (note: Note) => {
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}`, {
                method:  "PUT",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ isPublished: !note.isPublished }),
            });
            if (!res.ok) throw new Error();
            setNotes(prev => prev.map(n =>
                n._id === note._id ? { ...n, isPublished: !n.isPublished } : n
            ));
            showToast(note.isPublished ? "Unpublished" : "Published ✓", "success");
        } catch { showToast("Update nahi hua", "error"); }
    };

    const groupedNotes = notes.reduce<Record<string, Note[]>>((acc, note) => {
        const key = note.displayModuleName || note.moduleName;
        if (!acc[key]) acc[key] = [];
        acc[key].push(note);
        return acc;
    }, {});

    const published = notes.filter(n => n.isPublished).length;

    return (
        <>
            <style>{admStyles}</style>
            {toast && <div className={`adm-toast ${toast.type}`}>{toast.msg}</div>}

            <div className="adm-root">

                {/* Header */}
                <div className="adm-header">
                    <div>
                        <h1 className="adm-title">Notes Management</h1>
                        <p className="adm-sub">Course-wise web notes manage karo</p>
                    </div>
                </div>

                {/* Course selector */}
                <div className="adm-card">
                    <div className="adm-card-head">
                        <BookOpen size={13} style={{ color: "var(--cp-accent)" }}/>
                        <span>Select Course</span>
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                        <select
                            className="adm-select"
                            style={{ maxWidth: 360 }}
                            value={selectedCourse?.slug || ""}
                            onChange={e => handleCourseSelect(e.target.value)}
                        >
                            <option value="">-- Course chunno --</option>
                            {courses.map(c => (
                                <option key={c._id} value={c.slug}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedCourse && (
                    <>
                        {/* Toolbar */}
                        <div className="adm-toolbar">
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span className="adm-course-name">{selectedCourse.name}</span>
                                <span className="adm-stat-badge">{notes.length} notes</span>
                                <span className="adm-stat-badge green">{published} published</span>
                            </div>
                            {mode === "list" ? (
                                <button className="adm-add-btn" onClick={openCreate}>
                                    <Plus size={13}/> New Note
                                </button>
                            ) : (
                                <button className="adm-back-btn" onClick={() => setMode("list")}>
                                    <ArrowLeft size={12}/> Back to List
                                </button>
                            )}
                        </div>

                        {/* ── FORM ── */}
                        {(mode === "create" || mode === "edit") && (
                            <div className="adm-card">
                                <div className="adm-card-head">
                                    <FileText size={13} style={{ color: "var(--cp-accent)" }}/>
                                    <span>
                                        {mode === "create" ? "Create New Note" : `Edit: ${editingNote?.title}`}
                                    </span>

                                    {/* Editor type toggle */}
                                    <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                                        <button
                                            type="button"
                                            onClick={() => setEditorMode("html")}
                                            style={{
                                                display:     "inline-flex",
                                                alignItems:  "center",
                                                gap:         5,
                                                padding:     "4px 10px",
                                                borderRadius: 7,
                                                border:      `1px solid ${editorMode === "html"
                                                    ? "var(--cp-accent)"
                                                    : "var(--cp-border)"}`,
                                                background:  editorMode === "html"
                                                    ? "var(--cp-accent-glow)"
                                                    : "transparent",
                                                color:       editorMode === "html"
                                                    ? "var(--cp-accent)"
                                                    : "var(--cp-muted)",
                                                fontSize:    10,
                                                fontWeight:  700,
                                                cursor:      "pointer",
                                                fontFamily:  "'Plus Jakarta Sans',sans-serif",
                                                transition:  "all .15s",
                                            }}
                                        >
                                            <Code2 size={10}/> HTML Editor
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditorMode("markdown")}
                                            style={{
                                                display:     "inline-flex",
                                                alignItems:  "center",
                                                gap:         5,
                                                padding:     "4px 10px",
                                                borderRadius: 7,
                                                border:      `1px solid ${editorMode === "markdown"
                                                    ? "var(--cp-accent)"
                                                    : "var(--cp-border)"}`,
                                                background:  editorMode === "markdown"
                                                    ? "var(--cp-accent-glow)"
                                                    : "transparent",
                                                color:       editorMode === "markdown"
                                                    ? "var(--cp-accent)"
                                                    : "var(--cp-muted)",
                                                fontSize:    10,
                                                fontWeight:  700,
                                                cursor:      "pointer",
                                                fontFamily:  "'Plus Jakarta Sans',sans-serif",
                                                transition:  "all .15s",
                                            }}
                                        >
                                            <AlignLeft size={10}/> Markdown
                                        </button>
                                    </div>
                                </div>

                                <div className="adm-form-body">

                                    {/* Meta grid */}
                                    <div className="adm-form-grid">
                                        <div className="adm-field">
                                            <label className="adm-label">Module Name *</label>
                                            <input
                                                list="adm-mod-list"
                                                className="adm-input"
                                                placeholder="e.g. MS Office, Tally Prime"
                                                value={form.moduleName}
                                                onChange={e => setForm(f => ({
                                                    ...f, moduleName: e.target.value,
                                                }))}
                                            />
                                            <datalist id="adm-mod-list">
                                                {selectedCourse.syllabus?.map((s, i) => (
                                                    <option key={i} value={s.module}/>
                                                ))}
                                            </datalist>
                                        </div>

                                        <div className="adm-field">
                                            <label className="adm-label">Topic Name *</label>
                                            <input
                                                list="adm-topic-list"
                                                className="adm-input"
                                                placeholder="e.g. Introduction to MS Word"
                                                value={form.topicName}
                                                onChange={e => setForm(f => ({
                                                    ...f, topicName: e.target.value,
                                                }))}
                                            />
                                            <datalist id="adm-topic-list">
                                                {selectedCourse.syllabus
                                                    ?.find(s => s.module === form.moduleName)
                                                    ?.topics.map((t, i) => (
                                                        <option key={i} value={t}/>
                                                    ))}
                                            </datalist>
                                        </div>

                                        <div className="adm-field">
                                            <label className="adm-label">Order</label>
                                            <input
                                                className="adm-input"
                                                type="number"
                                                min={0}
                                                value={form.order}
                                                onChange={e => setForm(f => ({
                                                    ...f, order: Number(e.target.value),
                                                }))}
                                            />
                                        </div>

                                        <div className="adm-field" style={{ justifyContent: "flex-end" }}>
                                            <label
                                                className="adm-checkbox-wrap"
                                                onClick={() => setForm(f => ({
                                                    ...f, isPublished: !f.isPublished,
                                                }))}
                                            >
                                                <div className={`adm-checkbox ${form.isPublished ? "checked" : ""}`}>
                                                    {form.isPublished && (
                                                        <span style={{
                                                            fontSize: 9,
                                                            color:    "#1a1208",
                                                            fontWeight: 800,
                                                        }}>✓</span>
                                                    )}
                                                </div>
                                                <span className="adm-checkbox-label">
                                                    Publish immediately
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* ── HTML Editor ── */}
                                    {editorMode === "html" && (
                                        <div className="adm-field">
                                            <label className="adm-label">
                                                HTML Content
                                                <span style={{
                                                    marginLeft:  8,
                                                    fontSize:    9,
                                                    fontWeight:  400,
                                                    color:       "var(--cp-muted)",
                                                    textTransform: "none",
                                                    letterSpacing: 0,
                                                }}>
                                                    — Pura HTML page likhein ya kisi bhi source se paste karein
                                                </span>
                                            </label>
                                            <NoteHtmlEditor
                                                value={form.content}
                                                onChange={html => setForm(f => ({
                                                    ...f, content: html,
                                                }))}
                                                globalCss={globalCss}
                                            />
                                        </div>
                                    )}

                                    {/* ── Markdown Editor ── */}
                                    {editorMode === "markdown" && (
                                        <div className="adm-field">
                                            <label className="adm-label">
                                                Markdown Content
                                            </label>
                                            <p style={{
                                                fontSize:      10,
                                                color:         "var(--cp-muted)",
                                                marginBottom:  6,
                                            }}>
                                                # Heading, **bold**, `code`, ```block``` supported
                                            </p>
                                            <textarea
                                                className="adm-textarea adm-mono"
                                                rows={24}
                                                value={form.content}
                                                onChange={e => setForm(f => ({
                                                    ...f, content: e.target.value,
                                                }))}
                                                placeholder={`# Topic Title\n\n## Section\n\nContent yahan…\n\n- Point 1\n- Point 2`}
                                                spellCheck={false}
                                            />
                                        </div>
                                    )}

                                    {/* Markdown → HTML warning */}
                                    {mode === "edit"
                                        && editingNote?.contentType === "markdown"
                                        && editorMode === "html"
                                        && (
                                        <div style={{
                                            padding:      "10px 14px",
                                            background:   "rgba(245,158,11,.08)",
                                            border:       "1px solid rgba(245,158,11,.25)",
                                            borderRadius: 9,
                                            fontSize:     11,
                                            color:        "var(--cp-warning)",
                                            display:      "flex",
                                            gap:          8,
                                        }}>
                                            <span>⚠️</span>
                                            <span>
                                                Ye note originally Markdown mein tha.
                                                HTML Editor se save karne par HTML mein convert ho jayega.
                                            </span>
                                        </div>
                                    )}

                                    {/* Save buttons */}
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            className="adm-submit-btn"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving…"
                                                : mode === "create"
                                                    ? "Create Note"
                                                    : "Update Note"}
                                        </button>
                                        <button
                                            className="adm-ghost-btn"
                                            onClick={() => setMode("list")}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── NOTES LIST ── */}
                        {mode === "list" && (
                            loading ? (
                                <div className="adm-loading">
                                    <div className="adm-spinner"/> Loading notes…
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="adm-empty">
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
                                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                                        Is course mein abhi koi note nahi hai
                                    </div>
                                    <button className="adm-add-btn" onClick={openCreate}>
                                        <Plus size={12}/> Pehla note create karo
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {Object.entries(groupedNotes).map(([modName, modNotes]) => (
                                        <div key={modName} className="adm-card">
                                            <div className="adm-module-head">
                                                <BookOpen size={13} style={{ color: "var(--cp-accent)" }}/>
                                                <span>{modName}</span>
                                                <span className="adm-stat-badge" style={{ marginLeft: "auto" }}>
                                                    {modNotes.length} notes
                                                </span>
                                            </div>
                                            <div>
                                                {modNotes.map(note => (
                                                    <div key={note._id} className="adm-note-row">
                                                        <div style={{
                                                            display:     "flex",
                                                            alignItems:  "center",
                                                            gap:         8,
                                                            flex:        1,
                                                            minWidth:    0,
                                                        }}>
                                                            <span className="adm-note-order">
                                                                #{note.order}
                                                            </span>
                                                            <span className="adm-note-title">
                                                                {note.title}
                                                            </span>
                                                            <span className={`adm-pub-badge ${note.isPublished ? "pub" : "draft"}`}>
                                                                {note.isPublished ? "Published" : "Draft"}
                                                            </span>
                                                            {/* Content type */}
                                                            <span className="adm-pub-badge" style={{
                                                                background:  note.contentType === "html"
                                                                    ? "rgba(16,185,129,.08)"
                                                                    : "rgba(100,116,139,.08)",
                                                                color:       note.contentType === "html"
                                                                    ? "#059669"
                                                                    : "var(--cp-muted)",
                                                                borderColor: note.contentType === "html"
                                                                    ? "rgba(16,185,129,.2)"
                                                                    : "rgba(100,116,139,.2)",
                                                            }}>
                                                                {note.contentType === "html" ? "HTML" : "MD"}
                                                            </span>
                                                            {note.isSharedNote && (
                                                                <span className="adm-pub-badge" style={{
                                                                    background:  "rgba(99,102,241,.08)",
                                                                    color:       "#6366f1",
                                                                    borderColor: "rgba(99,102,241,.2)",
                                                                }}>
                                                                    Shared
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                                                            {!note.isSharedNote && (
                                                                <button
                                                                    className={`adm-icon-btn ${note.isPublished ? "muted" : "success"}`}
                                                                    onClick={() => handleTogglePublish(note)}
                                                                    title={note.isPublished ? "Unpublish" : "Publish"}
                                                                >
                                                                    {note.isPublished
                                                                        ? <EyeOff size={11}/>
                                                                        : <Eye size={11}/>}
                                                                </button>
                                                            )}
                                                            {!note.isSharedNote && (
                                                                <button
                                                                    className="adm-icon-btn"
                                                                    style={{
                                                                        background:  "rgba(99,102,241,.08)",
                                                                        color:       "#6366f1",
                                                                        borderColor: "rgba(99,102,241,.2)",
                                                                    }}
                                                                    onClick={() => setSharingNote(note)}
                                                                    title="Share"
                                                                >
                                                                    <Share2 size={11}/>
                                                                </button>
                                                            )}
                                                            {!note.isSharedNote
                                                                && (note.sharedWithStudents?.length ?? 0) > 0
                                                                && (
                                                                <button
                                                                    className="adm-icon-btn"
                                                                    style={{
                                                                        background:  "rgba(20,184,166,.08)",
                                                                        color:       "#0d9488",
                                                                        borderColor: "rgba(20,184,166,.2)",
                                                                        width:       "auto",
                                                                        padding:     "0 8px",
                                                                        gap:         4,
                                                                        fontSize:    10,
                                                                        fontWeight:  700,
                                                                    }}
                                                                    onClick={() => setStudentShareModal(note)}
                                                                >
                                                                    <User size={10}/>
                                                                    {note.sharedWithStudents!.length}
                                                                </button>
                                                            )}
                                                            {!note.isSharedNote && (
                                                                <button
                                                                    className="adm-icon-btn amber"
                                                                    onClick={() => openEdit(note)}
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 size={11}/>
                                                                </button>
                                                            )}
                                                            <button
                                                                className="adm-icon-btn danger"
                                                                onClick={() => note.isSharedNote
                                                                    ? handleRemoveShare(note)
                                                                    : handleDelete(note)}
                                                                title={note.isSharedNote ? "Share hatao" : "Delete"}
                                                            >
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

            {sharingNote && (
                <ShareNoteModal
                    note={sharingNote}
                    courses={courses}
                    onClose={() => setSharingNote(null)}
                    showToast={showToast}
                />
            )}

            {studentShareModal && (
                <StudentShareInfoModal
                    note={studentShareModal}
                    onClose={() => setStudentShareModal(null)}
                    onRemove={async (studentId) => {
                        try {
                            const res = await fetchWithAuth(
                                `/api/admin/notes/${studentShareModal._id}/share`,
                                {
                                    method:  "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    body:    JSON.stringify({ type: "student", studentId }),
                                }
                            );
                            if (!res.ok) throw new Error();
                            showToast("Student share hata diya", "success");
                            setNotes(prev => prev.map(n =>
                                n._id === studentShareModal._id
                                    ? {
                                        ...n,
                                        sharedWithStudents: n.sharedWithStudents?.filter(
                                            s => s._id !== studentId
                                        ),
                                    }
                                    : n
                            ));
                            setStudentShareModal(prev => prev
                                ? {
                                    ...prev,
                                    sharedWithStudents: prev.sharedWithStudents?.filter(
                                        s => s._id !== studentId
                                    ),
                                }
                                : null
                            );
                        } catch {
                            showToast("Remove nahi hua", "error");
                        }
                    }}
                    showToast={showToast}
                />
            )}
        </>
    );
}

// ── StudentShareInfoModal ─────────────────────────────────
function StudentShareInfoModal({
    note, onClose, onRemove, showToast,
}: {
    note:      Note;
    onClose:   () => void;
    onRemove:  (studentId: string) => Promise<void>;
    showToast: (msg: string, type: "success" | "error") => void;
}) {
    const [removing, setRemoving] = useState<string | null>(null);
    const students = note.sharedWithStudents || [];

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [onClose]);

    return (
        <>
            <div style={{
                position:       "fixed", inset: 0,
                background:     "rgba(0,0,0,.5)",
                zIndex:         998,
                backdropFilter: "blur(3px)",
            }} onClick={onClose}/>
            <div style={{
                position:        "fixed",
                top:             "50%",
                left:            "50%",
                transform:       "translate(-50%,-50%)",
                zIndex:          999,
                width:           400,
                maxWidth:        "92vw",
                maxHeight:       "80vh",
                background:      "var(--cp-surface)",
                border:          "1px solid var(--cp-border)",
                borderRadius:    16,
                overflow:        "hidden",
                display:         "flex",
                flexDirection:   "column",
                boxShadow:       "0 32px 80px rgba(0,0,0,.4)",
                fontFamily:      "'Plus Jakarta Sans',sans-serif",
            }}>
                <div style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    padding:        "14px 16px",
                    background:     "var(--cp-surface2)",
                    borderBottom:   "1px solid var(--cp-border)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                            width:      30, height: 30, borderRadius: 8,
                            background: "rgba(20,184,166,.1)", color: "#0d9488",
                            display:    "flex", alignItems: "center", justifyContent: "center",
                            border:     "1px solid rgba(20,184,166,.2)",
                        }}>
                            <User size={13}/>
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cp-text)" }}>
                                Shared Students
                            </div>
                            <div style={{ fontSize: 10, color: "var(--cp-muted)" }}>
                                {note.moduleName} → {note.title}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        width:      28, height: 28, borderRadius: 7,
                        border:     "1px solid var(--cp-border)", background: "transparent",
                        color:      "var(--cp-muted)", cursor: "pointer",
                        display:    "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <X size={14}/>
                    </button>
                </div>

                <div style={{
                    padding:      "7px 16px",
                    background:   "rgba(20,184,166,.04)",
                    borderBottom: "1px solid var(--cp-border)",
                    fontSize:     11,
                    color:        "var(--cp-muted)",
                }}>
                    <span style={{
                        fontWeight:  700, color: "#0d9488",
                        background:  "rgba(20,184,166,.1)",
                        border:      "1px solid rgba(20,184,166,.2)",
                        padding:     "2px 8px", borderRadius: 100, marginRight: 6,
                    }}>
                        {students.length}
                    </span>
                    student{students.length !== 1 ? "s" : ""} ko share kiya gaya hai
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {students.length === 0 ? (
                        <div style={{
                            padding:   48,
                            textAlign: "center",
                            color:     "var(--cp-muted)",
                            fontSize:  12,
                        }}>
                            Koi student share nahi hai
                        </div>
                    ) : students.map(s => (
                        <div key={s._id} style={{
                            display:      "flex",
                            alignItems:   "center",
                            gap:          10,
                            padding:      "11px 16px",
                            borderBottom: "1px solid var(--cp-border)",
                        }}>
                            <div style={{
                                width:      36, height: 36, borderRadius: "50%",
                                background: "rgba(20,184,166,.1)",
                                border:     "1px solid rgba(20,184,166,.2)",
                                display:    "flex", alignItems: "center", justifyContent: "center",
                                color:      "#0d9488", fontSize: 13, fontWeight: 700, flexShrink: 0,
                            }}>
                                {s.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-text)" }}>
                                    {s.name}
                                </div>
                                <div style={{
                                    fontSize:   10,
                                    color:      "var(--cp-muted)",
                                    fontFamily: "'JetBrains Mono',monospace",
                                }}>
                                    {s.studentId}
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    if (!confirm("Share hatana chahte ho?")) return;
                                    setRemoving(s._id);
                                    await onRemove(s._id);
                                    setRemoving(null);
                                }}
                                disabled={removing === s._id}
                                style={{
                                    width:      28, height: 28, borderRadius: 7,
                                    border:     "1px solid rgba(239,68,68,.2)",
                                    background: "rgba(239,68,68,.06)", color: "var(--cp-danger)",
                                    cursor:     removing === s._id ? "not-allowed" : "pointer",
                                    display:    "flex", alignItems: "center", justifyContent: "center",
                                    opacity:    removing === s._id ? 0.5 : 1,
                                    flexShrink: 0,
                                }}
                            >
                                {removing === s._id
                                    ? <Loader size={10} style={{ animation: "admSpin .7s linear infinite" }}/>
                                    : <Trash2 size={11}/>}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    padding:        "12px 16px",
                    borderTop:      "1px solid var(--cp-border)",
                    background:     "var(--cp-surface2)",
                }}>
                    <span style={{ fontSize: 10, color: "var(--cp-muted)" }}>
                        Remove karne se access hat jaayega
                    </span>
                    <button onClick={onClose} style={{
                        padding:    "7px 18px", borderRadius: 8,
                        border:     "1px solid var(--cp-border)", background: "var(--cp-surface)",
                        color:      "var(--cp-subtext)",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize:   12, fontWeight: 600, cursor: "pointer",
                    }}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Styles ────────────────────────────────────────────────
const admStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes admToastIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
@keyframes admSpin    { to { transform: rotate(360deg); } }

.adm-root  { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }
.adm-toast { position:fixed; top:16px; right:16px; z-index:9999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); animation:admToastIn .2s ease; }
.adm-toast.success { background:rgba(34,197,94,.12); color:var(--cp-success); border:1px solid rgba(34,197,94,.3); }
.adm-toast.error   { background:rgba(239,68,68,.12);  color:var(--cp-danger);  border:1px solid rgba(239,68,68,.3); }

.adm-header { display:flex; align-items:flex-start; justify-content:space-between; }
.adm-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
.adm-sub    { font-size:12px; color:var(--cp-muted); margin-top:3px; }

.adm-card      { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
.adm-card-head { display:flex; align-items:center; gap:7px; padding:12px 18px; border-bottom:1px solid var(--cp-border); background:var(--cp-surface2); font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-subtext); flex-wrap:wrap; }
.adm-form-body { padding:18px; display:flex; flex-direction:column; gap:14px; }
.adm-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
@media(max-width:600px){ .adm-form-grid { grid-template-columns:1fr; } }

.adm-field { display:flex; flex-direction:column; gap:5px; }
.adm-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }

.adm-input,.adm-select,.adm-textarea {
    font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px;
    background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px;
    color:var(--cp-text); outline:none; transition:border-color .15s; width:100%;
}
.adm-input:focus,.adm-select:focus,.adm-textarea:focus { border-color:var(--cp-accent); box-shadow:0 0 0 3px var(--cp-accent-glow); }
.adm-select option { background:var(--cp-surface); }
.adm-textarea { resize:vertical; }
.adm-mono { font-family:'JetBrains Mono',monospace !important; font-size:12px !important; line-height:1.7; }

.adm-checkbox-wrap  { display:flex; align-items:center; gap:8px; cursor:pointer; margin-top:8px; }
.adm-checkbox       { width:17px; height:17px; border-radius:5px; border:1.5px solid var(--cp-border); background:var(--cp-bg); display:flex; align-items:center; justify-content:center; transition:all .14s; flex-shrink:0; }
.adm-checkbox.checked { background:var(--cp-accent); border-color:var(--cp-accent); }
.adm-checkbox-label { font-size:12px; color:var(--cp-subtext); font-weight:500; }

.adm-toolbar     { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.adm-course-name { font-size:14px; font-weight:700; color:var(--cp-text); }
.adm-stat-badge  { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; background:rgba(100,116,139,.1); color:var(--cp-muted); border:1px solid rgba(100,116,139,.2); }
.adm-stat-badge.green { background:rgba(34,197,94,.08); color:var(--cp-success); border-color:rgba(34,197,94,.2); }

.adm-module-head { display:flex; align-items:center; gap:8px; padding:11px 16px; background:var(--cp-surface2); border-bottom:1px solid var(--cp-border); font-size:11px; font-weight:700; color:var(--cp-subtext); letter-spacing:.06em; text-transform:uppercase; }
.adm-note-row    { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 16px; border-top:1px solid var(--cp-border); transition:background .12s; }
.adm-note-row:hover { background:var(--cp-accent-glow); }
.adm-note-order  { font-size:10px; color:var(--cp-border2,#475569); font-family:'JetBrains Mono',monospace; flex-shrink:0; }
.adm-note-title  { font-size:12.5px; color:var(--cp-text); font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; min-width:0; }
.adm-pub-badge   { font-size:9.5px; font-weight:700; padding:2px 8px; border-radius:100px; flex-shrink:0; border:1px solid; }
.adm-pub-badge.pub   { background:rgba(34,197,94,.1);  color:var(--cp-success); border-color:rgba(34,197,94,.2); }
.adm-pub-badge.draft { background:rgba(245,158,11,.08); color:var(--cp-warning); border-color:rgba(245,158,11,.2); }

.adm-add-btn    { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; }
.adm-add-btn:hover { opacity:.88; }
.adm-back-btn   { display:inline-flex; align-items:center; gap:5px; padding:7px 13px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
.adm-back-btn:hover { border-color:var(--cp-accent); color:var(--cp-accent); }
.adm-submit-btn { padding:10px 22px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; }
.adm-submit-btn:disabled { opacity:.5; cursor:not-allowed; }
.adm-ghost-btn  { padding:10px 18px; border-radius:9px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }

.adm-icon-btn { width:27px; height:27px; border-radius:7px; border:1px solid; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; flex-shrink:0; }
.adm-icon-btn.amber   { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
.adm-icon-btn.danger  { background:rgba(239,68,68,.08); color:var(--cp-danger);  border-color:rgba(239,68,68,.2); }
.adm-icon-btn.danger:hover { background:rgba(239,68,68,.2); }
.adm-icon-btn.success { background:rgba(34,197,94,.08); color:var(--cp-success); border-color:rgba(34,197,94,.2); }
.adm-icon-btn.muted   { background:rgba(100,116,139,.08); color:var(--cp-muted); border-color:rgba(100,116,139,.2); }

.adm-loading { display:flex; align-items:center; gap:10px; padding:32px; color:var(--cp-muted); font-size:13px; }
.adm-spinner { width:18px; height:18px; border:2px solid var(--cp-border); border-top-color:var(--cp-accent); border-radius:50%; animation:admSpin .7s linear infinite; }
.adm-empty   { background:var(--cp-surface); border:1px dashed var(--cp-border); border-radius:12px; padding:48px; text-align:center; }
`;