"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
    BookOpen, ChevronRight, Search, Printer,
    X, FileText, Eye, EyeOff, RefreshCw
} from "lucide-react";
import NoteIframeRenderer from "@/components/lms/NoteIframeRanderer";
import NoteRenderer from "@/components/lms/NoteRenderer";

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
    const [noteMeta, setNoteMeta] = useState<{
        moduleName: string;
        updatedAt: string;
        isPublished: boolean;
    } | null>(null);
    const [contentLoading, setContentLoading] = useState(false);
    const [openModules, setOpenModules] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showDraft, setShowDraft] = useState(true);
    const [noteContentType, setNoteContentType] = useState<"markdown" | "html">("markdown");
    const [globalCss, setGlobalCss] = useState("");
    const mainRef = useRef<HTMLElement>(null);

    /* ── Detect mobile ── */
    useEffect(() => {
        const check = () => {
            const mobile = window.innerWidth < 769;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ── Courses ── */
    useEffect(() => {
        fetch("/api/teacher/notes")
            .then(r => r.json())
            .then(d => setCourses(d.courses || []))
            .catch(console.error)
            .finally(() => setLoadingCourses(false));
    }, []);

    /* ── Global CSS ── */
    useEffect(() => {
        fetch("/api/public/notes-css")
            .then(r => r.json())
            .then(d => setGlobalCss(d.css || ""))
            .catch(console.error);
    }, []);

    /* ── Load notes for course ── */
    const loadCourseNotes = useCallback(async (slug: string) => {
        setLoadingNotes(true);
        setSelectedNote(null);
        setNoteContent("");
        setModules([]);
        try {
            const res = await fetch(`/api/teacher/notes?courseSlug=${slug}`);
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

    /* ── Load individual note ── */
    async function loadNote(note: NoteItem) {
        if (selectedNote?._id === note._id && noteContent) {
            if (isMobile) setSidebarOpen(false);
            return;
        }
        setSelectedNote(note);
        setContentLoading(true);
        setNoteContent("");
        setNoteTitle("");
        setNoteMeta(null);
        if (isMobile) setSidebarOpen(false);
        try {
            const res = await fetch(`/api/teacher/notes/${note._id}`);
            const d = await res.json();
            if (res.ok) {
                setNoteContent(d.content || "");
                setNoteContentType(d.note.contentType || "markdown");
                setNoteTitle(d.note.title);
                setNoteMeta({
                    moduleName: d.note.moduleName,
                    updatedAt: d.note.updatedAt,
                    isPublished: d.note.isPublished,
                });
                setTimeout(() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
            } else {
                setNoteContent(`> ❌ ${d.error || "Note load nahi hua"}`);
            }
        } catch {
            setNoteContent("> ❌ Network error");
        } finally {
            setContentLoading(false);
        }
    }

    function toggleModule(slug: string) {
        setOpenModules(prev => {
            const next = new Set(prev);
            next.has(slug) ? next.delete(slug) : next.add(slug);
            return next;
        });
    }

    /* ── Filtered list ── */
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

    const showOverlay = isMobile && sidebarOpen;

    return (
        <>
                    {/* In the <style> tag inside your component */}
                    <style>{`
            /* ── Code block fix ── */
            .tn-note-content pre {
                overflow-x: auto !important;
                overflow-y: visible !important;
                max-width: 100% !important;
                white-space: pre !important;
                border-radius: var(--portal-radius-lg) !important;
                margin: var(--portal-space-4) 0 !important;
                box-shadow: var(--portal-shadow-md) !important;
            }

            .tn-note-content pre code,
            .tn-note-content pre .hljs {
                display: block !important;
                overflow-x: auto !important;
                white-space: pre !important;
                word-break: normal !important;
                overflow-wrap: normal !important;
                min-width: 100% !important;
                width: max-content !important;
                font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                font-size: 13px !important;
                line-height: 1.7 !important;
                padding: 20px 24px !important;

                /* Dark theme background */
                background: #0F172A !important;

                /* Base text color — bright so it's readable */
                color: #E2E8F0 !important;
            }

            /* ── HLJS token colors — visible on dark bg ── */
            .tn-note-content .hljs-comment,
            .tn-note-content .hljs-quote {
                color: #64748B !important;
                font-style: italic !important;
            }

            .tn-note-content .hljs-keyword,
            .tn-note-content .hljs-selector-tag,
            .tn-note-content .hljs-built_in,
            .tn-note-content .hljs-name,
            .tn-note-content .hljs-tag {
                color: #93C5FD !important; /* blue-300 */
                font-weight: 600 !important;
            }

            .tn-note-content .hljs-string,
            .tn-note-content .hljs-title,
            .tn-note-content .hljs-section,
            .tn-note-content .hljs-attribute,
            .tn-note-content .hljs-literal,
            .tn-note-content .hljs-template-tag,
            .tn-note-content .hljs-template-variable,
            .tn-note-content .hljs-type,
            .tn-note-content .hljs-addition {
                color: #86EFAC !important; /* green-300 */
            }

            .tn-note-content .hljs-deletion,
            .tn-note-content .hljs-selector-class,
            .tn-note-content .hljs-regexp,
            .tn-note-content .hljs-meta {
                color: #FCA5A5 !important; /* red-300 */
            }

            .tn-note-content .hljs-number,
            .tn-note-content .hljs-symbol,
            .tn-note-content .hljs-bullet,
            .tn-note-content .hljs-link {
                color: #FCD34D !important; /* amber-300 */
            }

            .tn-note-content .hljs-variable,
            .tn-note-content .hljs-params {
                color: #F9A8D4 !important; /* pink-300 */
            }

            .tn-note-content .hljs-function,
            .tn-note-content .hljs-title.function_ {
                color: #67E8F9 !important; /* cyan-300 */
            }

            .tn-note-content .hljs-attr,
            .tn-note-content .hljs-property {
                color: #C4B5FD !important; /* violet-300 */
            }

            .tn-note-content .hljs-operator,
            .tn-note-content .hljs-punctuation {
                color: #94A3B8 !important; /* slate-400 */
            }

            .tn-note-content .hljs-emphasis { font-style: italic !important; }
            .tn-note-content .hljs-strong   { font-weight: 700 !important; }

            /* ── Table scroll ── */
            .tn-note-content .table-wrap {
                overflow-x: auto !important;
                max-width: 100% !important;
            }
            .tn-note-content table {
                overflow-x: auto !important;
                display: block !important;
                max-width: 100% !important;
                white-space: nowrap !important;
            }

            /* ── Desktop sidebar ── */
            @media (min-width: 769px) {
                .tn-sidebar {
                    transform: none !important;
                    position: relative !important;
                    box-shadow: none !important;
                }
                .tn-sidebar.collapsed {
                    width: 0 !important;
                    border-right: none !important;
                }
                .tn-sidebar.open {
                    width: 260px !important;
                }
            }
        `}</style>

            <div className="tn-shell">

                {/* ══ TOPBAR ══ */}
                <div className="tn-topbar">
                    <div className="tn-topbar-left">

                        <button
                            className="tn-sidebar-toggle"
                            onClick={() => setSidebarOpen(o => !o)}
                            aria-label="Toggle sidebar"
                        >
                            <BookOpen size={15} />
                        </button>

                        <div className="tn-course-wrap">
                            <BookOpen size={12} className="tn-course-icon" />
                            {loadingCourses ? (
                                <span style={{
                                    fontSize: "var(--portal-text-xs)",
                                    color: "var(--portal-text-tertiary)"
                                }}>
                                    Loading courses…
                                </span>
                            ) : (
                                <select
                                    className="tn-course-select"
                                    value={selectedCourse?.slug || ""}
                                    onChange={e => handleCourseChange(e.target.value)}
                                >
                                    <option value="">— Select course —</option>
                                    {courses.map(c => (
                                        <option key={c._id || c.slug} value={c.slug}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

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
                        <button
                            className={`tn-pill-btn${showDraft ? " active" : ""}`}
                            onClick={() => setShowDraft(o => !o)}
                            title={showDraft ? "Hide draft notes" : "Show draft notes"}
                        >
                            {showDraft ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span className="tn-hide-mobile">Drafts</span>
                        </button>

                        {selectedNote && !contentLoading && noteMeta && (
                            <button
                                className="tn-pill-btn"
                                onClick={() => printNote(noteTitle, noteMeta.moduleName, noteContent)}
                            >
                                <Printer size={12} />
                                <span className="tn-hide-mobile">Print</span>
                            </button>
                        )}

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

                {/* ══ LAYOUT ROOT ══ */}
                <div className="tn-root">

                    {/* Mobile overlay only */}
                    {showOverlay && (
                        <div
                            className="tn-overlay"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* ══ SIDEBAR ══ */}
                    <aside className={`tn-sidebar${sidebarOpen ? " open" : " collapsed"}`}>

                        <div className="tn-sb-head">
                            <div className="tn-sb-top">
                                <div className="tn-sb-title">
                                    <div className="tn-sb-title-icon">
                                        <BookOpen size={13} />
                                    </div>
                                    {selectedCourse ? selectedCourse.name : "Notes"}
                                </div>
                                <button
                                    className="tn-sb-close"
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close sidebar"
                                >
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

                            {selectedCourse && (
                                <div className="tn-search-wrap">
                                    <Search size={12} className="tn-search-icon" />
                                    <input
                                        className="tn-search"
                                        type="text"
                                        placeholder="Search notes…"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="tn-sb-scroll">
                            {!selectedCourse ? (
                                <div className="tn-sb-empty">
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>📚</div>
                                    <p className="tn-sb-empty-text">
                                        Select a course above to browse notes.
                                    </p>
                                </div>

                            ) : loadingNotes ? (
                                <div style={{
                                    padding: "16px 14px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8
                                }}>
                                    {[80, 65, 90, 55, 75].map((w, i) => (
                                        <div
                                            key={i}
                                            className="tn-skel-line"
                                            style={{ width: `${w}%` }}
                                        />
                                    ))}
                                </div>

                            ) : filteredModules.length === 0 ? (
                                <div className="tn-sb-empty">
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>
                                        {searchQuery ? "🔍" : "📭"}
                                    </div>
                                    <p className="tn-sb-empty-text">
                                        {searchQuery
                                            ? `No results for "${searchQuery}"`
                                            : "No notes in this course yet."}
                                    </p>
                                </div>

                            ) : filteredModules.map(mod => {
                                const isOpen = openModules.has(mod.moduleSlug);
                                return (
                                    <div key={mod.moduleSlug}>
                                        <button
                                            className="tn-module-btn"
                                            onClick={() => toggleModule(mod.moduleSlug)}
                                        >
                                            <div className="tn-module-left">
                                                <ChevronRight
                                                    size={12}
                                                    className={`tn-chevron${isOpen ? " open" : ""}`}
                                                />
                                                <span>{mod.moduleName}</span>
                                            </div>
                                            <span className="tn-module-count">
                                                {mod.notes.length}
                                            </span>
                                        </button>

                                        {isOpen && mod.notes.map(note => {
                                            const isActive = selectedNote?._id === note._id;
                                            return (
                                                <button
                                                    key={note._id}
                                                    className={[
                                                        "tn-note-item",
                                                        isActive ? "active" : "",
                                                        !note.isPublished ? "draft" : "",
                                                    ].filter(Boolean).join(" ")}
                                                    onClick={() => loadNote(note)}
                                                >
                                                    <FileText size={11} className="tn-note-icon" />
                                                    <span
                                                        className="tn-note-label"
                                                        title={note.title}
                                                    >
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

                    {/* ══ MAIN ══ */}
                    <main ref={mainRef} className="tn-main">

                        {!selectedCourse ? (
                            <div className="tn-empty">
                                <div className="tn-empty-icon"><BookOpen size={28} /></div>
                                <div className="tn-empty-title">Select a course</div>
                                <div className="tn-empty-sub">
                                    Choose a course from the dropdown above, then pick a topic.
                                </div>
                            </div>

                        ) : !selectedNote ? (
                            <div className="tn-empty">
                                <div className="tn-empty-icon"><BookOpen size={28} /></div>
                                <div className="tn-empty-title">Select a topic</div>
                                <div className="tn-empty-sub">
                                    Pick a note from the sidebar to start reading.
                                </div>
                                {totalNotes > 0 && (
                                    <div className="tn-empty-hint">
                                        {totalNotes} notes available · {draftCount} draft
                                    </div>
                                )}
                                {isMobile && (
                                    <button
                                        className="tn-empty-hint tn-no-print"
                                        style={{
                                            marginTop: 8,
                                            cursor: "pointer",
                                            border: "none"
                                        }}
                                        onClick={() => setSidebarOpen(true)}
                                    >
                                        📖 Browse notes
                                    </button>
                                )}
                            </div>

                        ) : contentLoading ? (
                            <div className="tn-loader">
                                <div className="tn-spinner" />
                                <span className="tn-loader-text">Loading note…</span>
                            </div>

                        ) : (
                            <div
                                className="tn-fade-in"
                                style={{ display: "flex", flexDirection: "column", flex: 1 }}
                            >
                                <article className="tn-article">

                                    <div className="tn-article-head">
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "var(--portal-space-2)",
                                            marginBottom: "var(--portal-space-3)"
                                        }}>
                                            <div className="tn-article-module">
                                                <BookOpen size={9} />
                                                {noteMeta?.moduleName}
                                            </div>

                                            {noteMeta && !noteMeta.isPublished && (
                                                <div className="tn-draft-warning">
                                                    <EyeOff size={12} />
                                                    Draft — not visible to students
                                                </div>
                                            )}
                                        </div>

                                        <div className="tn-article-title">{noteTitle}</div>

                                        <div className="tn-article-meta">
                                            {noteMeta && (
                                                <span>
                                                    Updated{" "}
                                                    {new Date(noteMeta.updatedAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            )}
                                            <div className="tn-article-meta-dot" />
                                            <span>{selectedCourse?.name}</span>
                                        </div>
                                    </div>

                                    {noteContentType === "html" ? (
                                        <NoteIframeRenderer
                                            content={noteContent}
                                            contentType="html"
                                            globalCss={globalCss}
                                        />
                                    ) : (
                                        <NoteRenderer
                                            content={noteContent}
                                            contentType="markdown"
                                            className="tn-note-content"
                                        />
                                    )}

                                    <div className="tn-article-footer tn-no-print">
                                        <span>Shivshakti Computer Academy — Teacher Copy</span>
                                        <button
                                            className="tn-print-btn"
                                            onClick={() =>
                                                noteMeta &&
                                                printNote(noteTitle, noteMeta.moduleName, noteContent)
                                            }
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