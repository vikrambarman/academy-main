"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import {
    BookOpen, ChevronRight, Search, Printer,
    X, FileText, Eye, EyeOff, RefreshCw
} from "lucide-react";

interface NoteItem {
    _id: string; title: string; topicSlug: string;
    order: number; isPublished: boolean; updatedAt: string;
}
interface ModuleItem { moduleName: string; moduleSlug: string; notes: NoteItem[]; }
interface CourseOption { _id: string; name: string; slug: string; }

function printNote(title: string, moduleName: string, content: string) {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Merriweather',Georgia,serif;font-size:13px;line-height:1.85;color:#1a1a2e;padding:40px 60px;max-width:820px;margin:0 auto}
  .header{border-bottom:3px solid #1a1a2e;padding-bottom:16px;margin-bottom:28px}
  .academy{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2563eb;margin-bottom:6px}
  .module-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
  h1{font-size:22px;font-weight:700}
  h2{font-size:16px;font-weight:700;margin-top:24px;margin-bottom:10px;border-left:3px solid #2563eb;padding-left:10px}
  h3{font-size:14px;font-weight:700;margin-top:18px;margin-bottom:8px}
  p{margin-bottom:12px;color:#334155} ul,ol{margin:10px 0 12px 24px} li{margin-bottom:5px;color:#334155}
  code{font-family:'JetBrains Mono',monospace;font-size:11px;background:#eff6ff;color:#1d4ed8;padding:1px 5px;border-radius:3px}
  pre{background:#0d1117;color:#e6edf3;padding:16px 18px;border-radius:8px;margin:14px 0;overflow-x:auto;font-size:11px}
  pre code{background:none;padding:0;color:inherit}
  table{width:100%;border-collapse:collapse;margin:14px 0;font-size:12px}
  th{background:#1e3a5f;color:#e0effe;padding:9px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase}
  td{padding:8px 12px;border-bottom:1px solid #e5e7eb} tr:nth-child(even) td{background:#f8fafc}
  blockquote{border-left:3px solid #2563eb;background:#eff6ff;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;color:#1d4ed8;font-style:italic}
  .footer{margin-top:40px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:10px;color:#999;display:flex;justify-content:space-between}
  @media print{body{padding:20px 30px}}
</style></head><body>
  <div class="header">
    <div class="academy">Shivshakti Computer Academy — Teacher Copy</div>
    <div class="module-label">${moduleName}</div>
    <h1>${title}</h1>
  </div>
  <div id="content"></div>
  <div class="footer">
    <span>Teacher Reference Copy</span>
    <span>Printed: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
  </div>
  <script>document.fonts.ready.then(()=>setTimeout(()=>window.print(),600));</script>
</body></html>`);
    win.document.close();
}

export default function TeacherNotesPage() {
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);
    const [modules, setModules] = useState<ModuleItem[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
    const [noteContent, setNoteContent] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [noteMeta, setNoteMeta] = useState<{ moduleName: string; updatedAt: string; isPublished: boolean } | null>(null);
    const [contentLoading, setContentLoading] = useState(false);
    const [openModules, setOpenModules] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showDraft, setShowDraft] = useState(true);
    const articleRef = useRef<HTMLElement>(null);

    // Courses load karo
    useEffect(() => {
        fetch("/api/admin/notes/study")
            .then(r => r.json())
            .then(d => setCourses(d.courses || []))
            .catch(console.error)
            .finally(() => setLoadingCourses(false));
    }, []);

    // Course select hone pe notes load karo
    const loadCourseNotes = useCallback(async (slug: string) => {
        setLoadingNotes(true);
        setSelectedNote(null);
        setNoteContent("");
        setModules([]);
        try {
            const res = await fetch(`/api/admin/notes/study?courseSlug=${slug}`);
            const d = await res.json();
            if (d.success) {
                setModules(d.modules || []);
                if (d.modules?.length) {
                    setOpenModules(new Set([d.modules[0].moduleSlug]));
                }
            }
        } catch (err) {
            console.error("loadCourseNotes error:", err);
        } finally {
            setLoadingNotes(false);
        }
    }, []);

    const handleCourseChange = (slug: string) => {
        const course = courses.find(c => c.slug === slug) || null;
        setSelectedCourse(course);
        if (course) loadCourseNotes(course.slug);
    };

    async function loadNote(note: NoteItem) {
        if (selectedNote?._id === note._id && noteContent) {
            if (window.innerWidth < 769) setSidebarOpen(false);
            return;
        }
        setSelectedNote(note);
        setContentLoading(true);
        setNoteContent(""); setNoteTitle(""); setNoteMeta(null);
        if (window.innerWidth < 769) setSidebarOpen(false);
        try {
            const res = await fetch(`/api/admin/notes/study/${note._id}`);
            const d = await res.json();
            if (res.ok) {
                setNoteContent(d.content || "");
                setNoteTitle(d.note.title);
                setNoteMeta({
                    moduleName: d.note.moduleName,
                    updatedAt: d.note.updatedAt,
                    isPublished: d.note.isPublished,
                });
                setTimeout(() => articleRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
            } else {
                setNoteContent(`> ❌ ${d.error || "Note load nahi hua"}`);
            }
        } catch { setNoteContent("> ❌ Network error"); }
        finally { setContentLoading(false); }
    }

    function toggleModule(slug: string) {
        setOpenModules(prev => {
            const next = new Set(prev);
            next.has(slug) ? next.delete(slug) : next.add(slug);
            return next;
        });
    }

    // Filter notes
    const filteredModules = modules
        .map(mod => ({
            ...mod,
            notes: mod.notes.filter(n => {
                const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchDraft = showDraft ? true : n.isPublished;
                return matchSearch && matchDraft;
            }),
        }))
        .filter(mod => mod.notes.length > 0);

    const totalNotes = modules.reduce((s, m) => s + m.notes.length, 0);
    const draftCount = modules.reduce((s, m) => s + m.notes.filter(n => !n.isPublished).length, 0);

    return (
        <>
            <style>{tnStyles}</style>
            <div className="tn-shell">

                {/* Top bar — course selector */}
                <div className="tn-topbar">
                    <div className="tn-topbar-left">
                        <button
                            className="tn-sidebar-toggle"
                            onClick={() => setSidebarOpen(o => !o)}
                            aria-label="Toggle sidebar"
                        >
                            <BookOpen size={15} />
                        </button>

                        {/* Course selector */}
                        <div className="tn-course-wrap">
                            <BookOpen size={12} className="tn-course-icon" />
                            {loadingCourses ? (
                                <span style={{ fontSize: 12, color: "var(--cp-muted)" }}>Loading courses…</span>
                            ) : (
                                <select
                                    className="tn-course-select"
                                    value={selectedCourse?.slug || ""}
                                    onChange={e => handleCourseChange(e.target.value)}
                                >
                                    <option value="">-- Course chunno --</option>
                                    {courses.map(c => (
                                        <option key={c._id || c.slug} value={c.slug}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Breadcrumb */}
                        {selectedNote && noteMeta && (
                            <div className="tn-breadcrumb">
                                <ChevronRight size={11} />
                                <span>{noteMeta.moduleName}</span>
                                <ChevronRight size={11} />
                                <span className="tn-breadcrumb-cur">{noteTitle}</span>
                            </div>
                        )}
                    </div>

                    <div className="tn-topbar-right">
                        {/* Draft toggle */}
                        <button
                            className={`tn-pill-btn ${showDraft ? "active" : ""}`}
                            onClick={() => setShowDraft(o => !o)}
                            title={showDraft ? "Draft notes hide karo" : "Draft notes dikhao"}
                        >
                            {showDraft ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span>Drafts</span>
                        </button>

                        {/* Print */}
                        {selectedNote && !contentLoading && noteMeta && (
                            <button
                                className="tn-pill-btn"
                                onClick={() => printNote(noteTitle, noteMeta.moduleName, noteContent)}
                            >
                                <Printer size={12} />
                                <span className="tn-hide-mobile">Print</span>
                            </button>
                        )}

                        {/* Refresh */}
                        {selectedCourse && (
                            <button
                                className="tn-pill-btn"
                                onClick={() => loadCourseNotes(selectedCourse.slug)}
                                title="Refresh notes"
                            >
                                <RefreshCw size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Main layout */}
                <div className="tn-root">

                    {/* Mobile overlay */}
                    {sidebarOpen && (
                        <div className="tn-overlay" onClick={() => setSidebarOpen(false)} />
                    )}

                    {/* Sidebar */}
                    <aside className={`tn-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>

                        {/* Sidebar header */}
                        <div className="tn-sb-head">
                            <div className="tn-sb-top">
                                <div className="tn-sb-title">
                                    <div className="tn-sb-title-icon"><BookOpen size={13} /></div>
                                    {selectedCourse ? selectedCourse.name : "Notes"}
                                </div>
                                <button className="tn-sb-close" onClick={() => setSidebarOpen(false)}>
                                    <X size={13} />
                                </button>
                            </div>

                            {selectedCourse && (
                                <div className="tn-sb-stats">
                                    <span>{totalNotes} notes</span>
                                    {draftCount > 0 && (
                                        <span className="tn-draft-count">{draftCount} draft</span>
                                    )}
                                </div>
                            )}

                            {/* Search */}
                            {selectedCourse && (
                                <div className="tn-search-wrap">
                                    <Search size={12} className="tn-search-icon" />
                                    <input
                                        className="tn-search"
                                        type="text"
                                        placeholder="Search notes..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Scroll area */}
                        <div className="tn-sb-scroll">
                            {!selectedCourse ? (
                                <div className="tn-sb-empty">
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>📚</div>
                                    <div className="tn-sb-empty-text">
                                        Upar se course chunno
                                    </div>
                                </div>
                            ) : loadingNotes ? (
                                <div style={{ padding: "20px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                                    {[80, 65, 90, 55, 75].map((w, i) => (
                                        <div key={i} style={{ height: 10, width: `${w}%`, background: "var(--cp-border)", borderRadius: 6, animation: "tnSkel 1.5s ease-in-out infinite" }} />
                                    ))}
                                </div>
                            ) : filteredModules.length === 0 ? (
                                <div className="tn-sb-empty">
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{searchQuery ? "🔍" : "📭"}</div>
                                    <div className="tn-sb-empty-text">
                                        {searchQuery ? `"${searchQuery}" nahi mila` : "Is course mein koi note nahi hai"}
                                    </div>
                                </div>
                            ) : filteredModules.map(mod => {
                                const isOpen = openModules.has(mod.moduleSlug);
                                return (
                                    <div key={mod.moduleSlug}>
                                        <button className="tn-module-btn" onClick={() => toggleModule(mod.moduleSlug)}>
                                            <div className="tn-module-left">
                                                <ChevronRight size={12} className={`tn-chevron ${isOpen ? "open" : ""}`} />
                                                <span>{mod.moduleName}</span>
                                            </div>
                                            <span className="tn-module-count">{mod.notes.length}</span>
                                        </button>

                                        {isOpen && mod.notes.map(note => {
                                            const isActive = selectedNote?._id === note._id;
                                            return (
                                                <button
                                                    key={note._id}
                                                    className={`tn-note-item ${isActive ? "active" : ""} ${!note.isPublished ? "draft" : ""}`}
                                                    onClick={() => loadNote(note)}
                                                >
                                                    <FileText size={11} className="tn-note-icon" />
                                                    <span className="tn-note-label" title={note.title}>
                                                        {note.title}
                                                    </span>
                                                    {!note.isPublished && (
                                                        <span className="tn-draft-badge">Draft</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Main content */}
                    <main ref={articleRef as any} className="tn-main">

                        {!selectedCourse ? (
                            <div className="tn-empty">
                                <div className="tn-empty-icon"><BookOpen size={28} /></div>
                                <div className="tn-empty-title">Course chunno</div>
                                <div className="tn-empty-sub">
                                    Upar course select karo, phir koi bhi topic padho
                                </div>
                            </div>

                        ) : !selectedNote ? (
                            <div className="tn-empty">
                                <div className="tn-empty-icon"><BookOpen size={28} /></div>
                                <div className="tn-empty-title">Topic chunno</div>
                                <div className="tn-empty-sub">
                                    Sidebar se koi topic select karo padhne ke liye
                                </div>
                                {totalNotes > 0 && (
                                    <div className="tn-empty-hint">
                                        {totalNotes} notes available · {draftCount} draft
                                    </div>
                                )}
                                <button
                                    className="tn-empty-hint tn-no-print"
                                    style={{ marginTop: 8, cursor: "pointer", border: "none" }}
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    📖 Browse notes
                                </button>
                            </div>

                        ) : contentLoading ? (
                            <div className="tn-loader">
                                <div className="tn-spinner" />
                                <span className="tn-loader-text">Loading note…</span>
                            </div>

                        ) : (
                            <div className="tn-fade-in" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <article className="tn-article">

                                    {/* Article header */}
                                    <div className="tn-article-head">
                                        <div className="tn-article-module">
                                            <BookOpen size={9} /> {noteMeta?.moduleName}
                                        </div>

                                        {/* Draft warning */}
                                        {noteMeta && !noteMeta.isPublished && (
                                            <div className="tn-draft-warning">
                                                <EyeOff size={12} />
                                                Draft — students ko nahi dikh raha
                                            </div>
                                        )}

                                        <div className="tn-article-title">{noteTitle}</div>
                                        <div className="tn-article-meta">
                                            {noteMeta && (
                                                <span>
                                                    Updated {new Date(noteMeta.updatedAt).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "long", year: "numeric"
                                                    })}
                                                </span>
                                            )}
                                            <div className="tn-article-meta-dot" />
                                            <span>{selectedCourse?.name}</span>
                                        </div>
                                    </div>

                                    {/* Markdown content */}
                                    <div className="tn-note-content">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeHighlight]}
                                            components={{
                                                code({ className, children, ...props }: any) {
                                                    return <code className={className} {...props}>{children}</code>;
                                                },
                                                pre({ children }: any) {
                                                    return (
                                                        <div style={{ position: "relative" }} className="tn-no-print">
                                                            <pre>{children}</pre>
                                                            <button
                                                                onClick={() => {
                                                                    const text = (children as any)?.props?.children;
                                                                    if (typeof text === "string") navigator.clipboard.writeText(text);
                                                                }}
                                                                style={{ position: "absolute", top: 10, right: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.1)", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                    );
                                                },
                                                table({ children }: any) {
                                                    return (
                                                        <div style={{ overflowX: "auto", margin: "1rem 0" }}>
                                                            <table>{children}</table>
                                                        </div>
                                                    );
                                                },
                                            }}
                                        >
                                            {noteContent}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Footer */}
                                    <div className="tn-article-footer tn-no-print">
                                        <span>Shivshakti Computer Academy — Teacher Copy</span>
                                        <button
                                            className="tn-print-btn"
                                            onClick={() => noteMeta && printNote(noteTitle, noteMeta.moduleName, noteContent)}
                                        >
                                            <Printer size={13} />
                                            Print / Save PDF
                                        </button>
                                    </div>
                                </article>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

const tnStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');

    @keyframes tnFadeIn { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tnSpin   { to{transform:rotate(360deg)} }
    @keyframes tnSkel   { 0%,100%{opacity:.4} 50%{opacity:.8} }

    .tn-shell { display:flex; flex-direction:column; height:calc(100vh - 116px); font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); }

    /* ── Topbar ── */
    .tn-topbar {
        display:flex; align-items:center; justify-content:space-between;
        gap:12px; padding:10px 16px;
        background:var(--cp-surface); border:1px solid var(--cp-border);
        border-radius:12px 12px 0 0; flex-shrink:0; flex-wrap:wrap;
    }
    .tn-topbar-left  { display:flex; align-items:center; gap:10px; min-width:0; flex:1; }
    .tn-topbar-right { display:flex; align-items:center; gap:6px; flex-shrink:0; }

    .tn-sidebar-toggle {
        width:32px; height:32px; border-radius:8px;
        border:1px solid var(--cp-border); background:var(--cp-surface);
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        color:var(--cp-subtext); flex-shrink:0; transition:all .15s;
    }
    .tn-sidebar-toggle:hover { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:var(--cp-accent); }

    .tn-course-wrap { display:flex; align-items:center; gap:7px; position:relative; }
    .tn-course-icon { color:var(--cp-accent); flex-shrink:0; }
    .tn-course-select {
        font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600;
        background:var(--cp-surface2); border:1px solid var(--cp-border);
        border-radius:9px; color:var(--cp-text); padding:7px 12px;
        outline:none; cursor:pointer; max-width:280px; transition:border-color .15s;
    }
    .tn-course-select:focus { border-color:var(--cp-accent); }
    .tn-course-select option { background:var(--cp-surface); }

    .tn-breadcrumb { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--cp-muted); min-width:0; }
    .tn-breadcrumb-cur { color:var(--cp-subtext); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }

    .tn-pill-btn {
        display:inline-flex; align-items:center; gap:5px;
        font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:600;
        padding:6px 12px; border-radius:8px; cursor:pointer;
        border:1px solid var(--cp-border); background:var(--cp-surface);
        color:var(--cp-muted); transition:all .15s; white-space:nowrap;
    }
    .tn-pill-btn:hover  { background:var(--cp-accent-glow); border-color:var(--cp-accent); color:var(--cp-accent); }
    .tn-pill-btn.active { background:var(--cp-accent-glow); border-color:var(--cp-accent); color:var(--cp-accent); }
    .tn-hide-mobile { display:inline; }
    @media(max-width:480px) { .tn-hide-mobile { display:none; } }

    /* ── Layout ── */
    .tn-root {
        display:flex; flex:1; overflow:hidden;
        border:1px solid var(--cp-border); border-top:none;
        border-radius:0 0 12px 12px;
        background:var(--cp-surface); position:relative;
    }

    /* Mobile overlay */
    .tn-overlay {
        position:absolute; inset:0; background:rgba(0,0,0,0.45);
        z-index:15; backdrop-filter:blur(2px);
    }
    @media(min-width:769px) { .tn-overlay { display:none !important; } }

    /* ── Sidebar ── */
    .tn-sidebar {
        width:268px; flex-shrink:0;
        background:var(--cp-surface); border-right:1px solid var(--cp-border);
        display:flex; flex-direction:column;
        transition:width .25s cubic-bezier(.4,0,.2,1), transform .25s cubic-bezier(.4,0,.2,1);
        overflow:hidden; z-index:20;
    }
    .tn-sidebar.collapsed { width:0 !important; border-right:none; overflow:hidden; }

    @media(max-width:768px) {
        .tn-sidebar {
            position:absolute; left:0; top:0; bottom:0;
            width:280px !important; box-shadow:4px 0 24px rgba(0,0,0,.25);
            transform:translateX(-100%);
        }
        .tn-sidebar.open { transform:translateX(0); }
    }

    .tn-sb-head { padding:14px 14px 10px; border-bottom:1px solid var(--cp-border); flex-shrink:0; }
    .tn-sb-top  { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
    .tn-sb-title { font-family:'DM Serif Display',serif; font-size:0.95rem; color:var(--cp-text); display:flex; align-items:center; gap:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .tn-sb-title-icon { width:24px; height:24px; border-radius:7px; background:var(--cp-accent-glow); display:flex; align-items:center; justify-content:center; color:var(--cp-accent); flex-shrink:0; }
    .tn-sb-close { width:24px; height:24px; border-radius:7px; border:1px solid var(--cp-border); background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--cp-muted); flex-shrink:0; }
    .tn-sb-close:hover { background:var(--cp-surface2); color:var(--cp-text); }

    .tn-sb-stats { display:flex; align-items:center; gap:8px; font-size:10px; color:var(--cp-muted); margin-bottom:8px; }
    .tn-draft-count { background:rgba(245,158,11,0.1); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.2); padding:1px 7px; border-radius:100px; font-weight:700; }

    .tn-search-wrap { position:relative; }
    .tn-search-icon { position:absolute; left:9px; top:50%; transform:translateY(-50%); color:var(--cp-muted); pointer-events:none; }
    .tn-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; font-size:12px; padding:7px 10px 7px 28px; border:1px solid var(--cp-border); border-radius:8px; background:var(--cp-bg); color:var(--cp-text); outline:none; transition:border-color .15s; }
    .tn-search:focus { border-color:var(--cp-accent); box-shadow:0 0 0 3px var(--cp-accent-glow); }
    .tn-search::placeholder { color:var(--cp-muted); }

    .tn-sb-scroll { flex:1; overflow-y:auto; padding:8px 0 16px; scrollbar-width:thin; scrollbar-color:var(--cp-border) transparent; }
    .tn-sb-scroll::-webkit-scrollbar { width:4px; }
    .tn-sb-scroll::-webkit-scrollbar-thumb { background:var(--cp-border); border-radius:4px; }

    .tn-module-btn { display:flex; align-items:center; justify-content:space-between; width:100%; padding:8px 14px; border:none; background:transparent; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:600; color:var(--cp-subtext); transition:color .14s,background .14s; text-align:left; }
    .tn-module-btn:hover { background:var(--cp-accent-glow2); color:var(--cp-text); }
    .tn-module-left { display:flex; align-items:center; gap:7px; }
    .tn-chevron { color:var(--cp-muted); transition:transform .2s; flex-shrink:0; }
    .tn-chevron.open { transform:rotate(90deg); }
    .tn-module-count { font-size:9px; font-weight:700; color:var(--cp-muted); background:var(--cp-surface2); padding:2px 7px; border-radius:100px; flex-shrink:0; border:1px solid var(--cp-border); }

    .tn-note-item { display:flex; align-items:center; gap:8px; padding:7px 14px 7px 28px; cursor:pointer; border:none; background:transparent; width:100%; text-align:left; font-family:'Plus Jakarta Sans',sans-serif; transition:background .13s; border-right:3px solid transparent; }
    .tn-note-item:hover { background:var(--cp-accent-glow2); }
    .tn-note-item.active { background:var(--cp-accent-glow); border-right-color:var(--cp-accent); }
    .tn-note-item.draft  { opacity:.75; }
    .tn-note-icon  { color:var(--cp-muted); flex-shrink:0; }
    .tn-note-label { font-size:12px; line-height:1.4; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--cp-subtext); }
    .tn-note-item.active .tn-note-label { color:var(--cp-accent); font-weight:600; }
    .tn-draft-badge { font-size:8px; font-weight:700; padding:1px 6px; border-radius:100px; background:rgba(245,158,11,0.1); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.25); flex-shrink:0; white-space:nowrap; }

    .tn-sb-empty { padding:32px 16px; text-align:center; }
    .tn-sb-empty-text { font-size:11px; color:var(--cp-muted); line-height:1.55; }

    /* ── Main ── */
    .tn-main { flex:1; overflow-y:auto; display:flex; flex-direction:column; scrollbar-width:thin; scrollbar-color:var(--cp-border) transparent; min-width:0; }
    .tn-main::-webkit-scrollbar { width:4px; }
    .tn-main::-webkit-scrollbar-thumb { background:var(--cp-border); border-radius:4px; }

    .tn-article { max-width:760px; margin:0 auto; padding:24px 20px 60px; width:100%; }
    @media(max-width:480px) { .tn-article { padding:16px 14px 48px; } }

    .tn-article-head { margin-bottom:24px; }
    .tn-article-module { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:3px 10px; border-radius:100px; background:var(--cp-accent-glow); color:var(--cp-accent); border:1px solid var(--cp-border); margin-bottom:8px; }

    .tn-draft-warning { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; padding:4px 10px; border-radius:100px; background:rgba(245,158,11,0.1); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.25); margin-bottom:10px; margin-left:8px; }

    .tn-article-title { font-family:'DM Serif Display',serif; font-size:1.7rem; color:var(--cp-text); line-height:1.25; margin-bottom:10px; letter-spacing:-.01em; }
    @media(max-width:480px) { .tn-article-title { font-size:1.35rem; } }
    .tn-article-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:11px; color:var(--cp-muted); }
    .tn-article-meta-dot { width:3px; height:3px; border-radius:50%; background:var(--cp-border); }

    /* Markdown content — same as student portal */
    .tn-note-content { font-family:'Plus Jakarta Sans',sans-serif; }
    .tn-note-content ul { list-style-type:disc !important; padding-left:1.6rem !important; margin:.5rem 0 .9rem !important; }
    .tn-note-content ol { list-style-type:decimal !important; padding-left:1.6rem !important; margin:.5rem 0 .9rem !important; }
    .tn-note-content li { display:list-item !important; margin-bottom:.35rem !important; color:var(--cp-subtext) !important; font-size:.9rem !important; line-height:1.75 !important; }
    .tn-note-content ul ul { list-style-type:circle !important; margin:.25rem 0 .25rem 1rem !important; }
    .tn-note-content ul ul ul { list-style-type:square !important; }
    .tn-note-content ol ol { list-style-type:lower-alpha !important; }
    .tn-note-content h1 { font-family:'DM Serif Display',serif; font-size:1.5rem; font-weight:400; margin:1.4rem 0 .6rem; color:var(--cp-text); border-bottom:2px solid var(--cp-border); padding-bottom:.4rem; }
    .tn-note-content h2 { font-size:1.15rem; font-weight:700; margin:1.3rem 0 .55rem; color:var(--cp-text); position:relative; padding-left:14px; }
    .tn-note-content h2::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px; background:var(--cp-accent); border-radius:2px; }
    .tn-note-content h3 { font-size:1rem; font-weight:700; margin:1.1rem 0 .45rem; color:var(--cp-text); }
    .tn-note-content h4 { font-size:.9rem; font-weight:600; margin:.9rem 0 .35rem; color:var(--cp-subtext); }
    .tn-note-content p { margin-bottom:.8rem; line-height:1.85; color:var(--cp-subtext); font-size:.9rem; }
    .tn-note-content strong { font-weight:700; color:var(--cp-text); }
    .tn-note-content em { font-style:italic; color:var(--cp-muted); }
    .tn-note-content a { color:var(--cp-accent); text-decoration:underline; }
    .tn-note-content hr { border:none; border-top:1px solid var(--cp-border); margin:1.4rem 0; }
    .tn-note-content blockquote { border-left:4px solid var(--cp-accent); background:var(--cp-accent-glow); padding:12px 16px; margin:1rem 0; border-radius:0 8px 8px 0; color:var(--cp-subtext); font-size:.875rem; }
    .tn-note-content code:not(pre code) { font-family:'JetBrains Mono','Fira Code',monospace; font-size:.8rem; background:var(--cp-accent-glow); color:var(--cp-accent); padding:2px 6px; border-radius:4px; border:1px solid var(--cp-border); }
    .tn-note-content pre { border-radius:10px; margin:1rem 0; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.15); }
    .tn-note-content pre code { font-size:.81rem !important; font-family:'JetBrains Mono',monospace !important; line-height:1.65; }
    .tn-note-content .hljs { background:#0d1117 !important; padding:1.1rem 1.3rem !important; }
    .tn-note-content table { width:100%; border-collapse:collapse; margin:1rem 0; font-size:.85rem; border-radius:8px; overflow:hidden; }
    .tn-note-content th { background:var(--cp-accent); color:#fff; padding:10px 14px; text-align:left; font-weight:600; font-size:.75rem; letter-spacing:.04em; text-transform:uppercase; }
    .tn-note-content td { padding:9px 14px; border-bottom:1px solid var(--cp-border); color:var(--cp-subtext); }
    .tn-note-content tr:last-child td { border-bottom:none; }
    .tn-note-content tr:nth-child(even) td { background:var(--cp-accent-glow2); }

    /* Article footer */
    .tn-article-footer { margin-top:40px; padding-top:16px; border-top:1px solid var(--cp-border); display:flex; align-items:center; justify-content:space-between; font-size:11px; color:var(--cp-muted); flex-wrap:wrap; gap:10px; }
    .tn-print-btn { display:inline-flex; align-items:center; gap:6px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; padding:8px 16px; border-radius:9px; cursor:pointer; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); transition:all .15s; }
    .tn-print-btn:hover { border-color:var(--cp-accent); color:var(--cp-accent); background:var(--cp-accent-glow); }

    /* Empty / loader */
    .tn-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; text-align:center; padding:40px 20px; }
    .tn-empty-icon  { width:64px; height:64px; border-radius:18px; background:var(--cp-accent-glow); display:flex; align-items:center; justify-content:center; color:var(--cp-accent); margin-bottom:16px; }
    .tn-empty-title { font-family:'DM Serif Display',serif; font-size:1.2rem; color:var(--cp-text); margin-bottom:6px; }
    .tn-empty-sub   { font-size:12px; color:var(--cp-muted); font-weight:300; max-width:240px; line-height:1.6; }
    .tn-empty-hint  { margin-top:12px; font-size:12px; font-weight:500; padding:7px 14px; border-radius:9px; background:var(--cp-accent-glow); color:var(--cp-accent); border:1px solid var(--cp-border); }
    .tn-loader      { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:12px; }
    .tn-spinner     { width:28px; height:28px; border:3px solid var(--cp-border); border-top-color:var(--cp-accent); border-radius:50%; animation:tnSpin .7s linear infinite; }
    .tn-loader-text { font-size:12px; color:var(--cp-muted); }

    .tn-fade-in { animation:tnFadeIn .28s ease forwards; }
    @media print { .tn-no-print { display:none !important; } }
`;