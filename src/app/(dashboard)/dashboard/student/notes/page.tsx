// src/app/(dashboard)/dashboard/student/notes/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { BookOpen, ChevronRight, Search, CheckCheck, Printer, X } from "lucide-react";
import NoteIframeRenderer from "@/components/lms/NoteIframeRanderer";
import NoteRenderer from "@/components/lms/NoteRenderer";

// ── Types ──────────────────────────────────────────────────────────────
interface NoteItem {
  _id: string;
  title: string;
  topicSlug: string;
  order: number;
  updatedAt: string;
}

interface ModuleItem {
  moduleName: string;
  moduleSlug: string;
  notes: NoteItem[];
}

interface CourseData {
  courseName: string;
  courseSlug: string;
  modules: ModuleItem[];
}

type ProgressMap = Record<string, boolean>;

// ── Progress helpers (localStorage) ───────────────────────────────────
const PROGRESS_KEY = "sca_notes_progress";

function loadProgress(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

// ── Print helper ───────────────────────────────────────────────────────
function printNote(title: string, moduleName: string, content: string) {
  const win = window.open("", "_blank");
  if (!win) return;

  function mdToHtml(md: string): string {
    const lines = md.split("\n");
    let html = "",
      inCode = false,
      codeLang = "",
      codeLines: string[] = [],
      inList = false,
      listType = "";

    const escHtml = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const inlineFmt = (s: string) =>
      s
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    const closeList = () => {
      if (inList) {
        html += listType === "ul" ? "</ul>" : "</ol>";
        inList = false;
        listType = "";
      }
    };

    for (const line of lines) {
      if (line.startsWith("```")) {
        if (!inCode) {
          closeList();
          inCode = true;
          codeLang = line.slice(3).trim();
          codeLines = [];
        } else {
          html += `<pre><code class="language-${codeLang}">${escHtml(
            codeLines.join("\n")
          )}</code></pre>`;
          inCode = false;
          codeLines = [];
          codeLang = "";
        }
        continue;
      }
      if (inCode) { codeLines.push(line); continue; }
      if (line.startsWith("#### ")) { closeList(); html += `<h4>${inlineFmt(line.slice(5))}</h4>`; continue; }
      if (line.startsWith("### "))  { closeList(); html += `<h3>${inlineFmt(line.slice(4))}</h3>`; continue; }
      if (line.startsWith("## "))   { closeList(); html += `<h2>${inlineFmt(line.slice(3))}</h2>`; continue; }
      if (line.startsWith("# "))    { closeList(); html += `<h1>${inlineFmt(line.slice(2))}</h1>`; continue; }
      if (line.startsWith("> "))    { closeList(); html += `<blockquote>${inlineFmt(line.slice(2))}</blockquote>`; continue; }
      if (/^[-*_]{3,}$/.test(line.trim())) { closeList(); html += "<hr/>"; continue; }
      if (line.match(/^[-*+] /)) {
        if (!inList || listType !== "ul") { if (inList) closeList(); html += "<ul>"; inList = true; listType = "ul"; }
        html += `<li>${inlineFmt(line.slice(2))}</li>`; continue;
      }
      if (/^\d+\. /.test(line)) {
        if (!inList || listType !== "ol") { if (inList) closeList(); html += "<ol>"; inList = true; listType = "ol"; }
        html += `<li>${inlineFmt(line.replace(/^\d+\.\s*/, ""))}</li>`; continue;
      }
      if (line.trim() === "") { closeList(); html += "<br/>"; continue; }
      closeList();
      html += `<p>${inlineFmt(line)}</p>`;
    }
    closeList();
    return html;
  }

  // Print window HTML — unchanged (print logic same hai)
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${title} — Shivshakti Computer Academy</title>
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
    h4{font-size:13px;font-weight:700;margin-top:14px;margin-bottom:6px}
    p{margin-bottom:12px;color:#334155}
    ul,ol{margin:10px 0 12px 24px}
    li{margin-bottom:5px;color:#334155}
    code{font-family:'JetBrains Mono',monospace;font-size:11px;background:#eff6ff;color:#1d4ed8;padding:1px 5px;border-radius:3px;border:1px solid #bfdbfe}
    pre{background:#0d1117;color:#e6edf3;padding:16px 18px;border-radius:8px;margin:14px 0;overflow-x:auto;font-size:11px;line-height:1.6}
    pre code{background:none;padding:0;color:inherit;border:none}
    table{width:100%;border-collapse:collapse;margin:14px 0;font-size:12px}
    th{background:#1e3a5f;color:#e0effe;padding:9px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase}
    td{padding:8px 12px;border-bottom:1px solid #e5e7eb}
    tr:nth-child(even) td{background:#f8fafc}
    blockquote{border-left:3px solid #2563eb;background:#eff6ff;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;color:#1d4ed8;font-style:italic}
    hr{border:none;border-top:1px solid #e2e8f0;margin:20px 0}
    .footer{margin-top:40px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:10px;color:#999;display:flex;justify-content:space-between}
    @media print{body{padding:20px 30px}pre{white-space:pre-wrap;word-break:break-all}}
  </style>
</head>
<body>
  <div class="header">
    <div class="academy">Shivshakti Computer Academy</div>
    <div class="module-label">${moduleName}</div>
    <h1>${title}</h1>
  </div>
  <div class="content">${mdToHtml(content)}</div>
  <div class="footer">
    <span>Shivshakti Computer Academy</span>
    <span>Printed: ${new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    })}</span>
  </div>
  <script>
    document.fonts.ready.then(() => setTimeout(() => window.print(), 600));
  </script>
</body>
</html>`);
  win.document.close();
}

// ══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════
export default function StudentNotesPage() {
  const [data, setData]                     = useState<CourseData[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedNote, setSelectedNote]     = useState<NoteItem | null>(null);
  const [noteContent, setNoteContent]       = useState("");
  const [noteTitle, setNoteTitle]           = useState("");
  const [noteMeta, setNoteMeta]             = useState<{
    moduleName: string; updatedAt: string;
  } | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [openModules, setOpenModules]       = useState<Set<string>>(new Set());
  const [progress, setProgress]             = useState<ProgressMap>({});
  const [searchQuery, setSearchQuery]       = useState("");
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [noteContentType, setNoteContentType] =
    useState<"markdown" | "html">("markdown");
  const [globalCss, setGlobalCss]           = useState("");
  const articleRef                          = useRef<HTMLElement>(null);

  // Derived values
  const totalNotes = data.reduce(
    (s, c) => s + c.modules.reduce((ms, m) => ms + m.notes.length, 0),
    0
  );
  const readCount    = Object.values(progress).filter(Boolean).length;
  const progressPct  =
    totalNotes > 0 ? Math.round((readCount / totalNotes) * 100) : 0;

  // Load saved progress on mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // Fetch notes data
  useEffect(() => {
    fetchWithAuth("/api/student/notes")
      .then((r) => r.json())
      .then((d) => {
        setData(d.data || []);
        if (d.data?.length) {
          const firstKey = `${d.data[0].courseSlug}-${d.data[0].modules[0]?.moduleSlug}`;
          setOpenModules(new Set([firstKey]));
          setSidebarOpen(true);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Fetch global CSS for HTML notes
  useEffect(() => {
    fetch("/api/public/notes-css")
      .then((r) => r.json())
      .then((d) => setGlobalCss(d.css || ""))
      .catch(console.error);
  }, []);

  // Mark note as read
  const markRead = useCallback((noteId: string) => {
    setProgress((prev) => {
      if (prev[noteId]) return prev;
      const next = { ...prev, [noteId]: true };
      saveProgress(next);
      return next;
    });
  }, []);

  // Load note content
  async function loadNote(note: NoteItem) {
    if (selectedNote?._id === note._id && noteContent) {
      if (window.innerWidth < 769) setSidebarOpen(false);
      return;
    }

    setSelectedNote(note);
    setContentLoading(true);
    setNoteContent("");
    setNoteTitle("");
    setNoteMeta(null);

    if (window.innerWidth < 769) setSidebarOpen(false);

    try {
      const res = await fetchWithAuth(`/api/student/notes/${note._id}`);
      const d   = await res.json();

      if (res.ok) {
        setNoteContent(d.content || "");
        setNoteContentType(d.note.contentType || "markdown");
        setNoteTitle(d.note.title);
        setNoteMeta({
          moduleName: d.note.moduleName,
          updatedAt:  d.note.updatedAt,
        });
        markRead(note._id);
        setTimeout(
          () => articleRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
          50
        );
      } else {
        setNoteContent(`> ❌ ${d.error || "Note load nahi hua"}`);
      }
    } catch {
      setNoteContent("> ❌ Network error");
    } finally {
      setContentLoading(false);
    }
  }

  // Toggle module open/close
  function toggleModule(key: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  // Toggle read/unread manually
  function toggleRead() {
    if (!selectedNote) return;
    setProgress((prev) => {
      const next = { ...prev };
      if (next[selectedNote._id]) delete next[selectedNote._id];
      else next[selectedNote._id] = true;
      saveProgress(next);
      return next;
    });
  }

  // Mark complete (one-way)
  function markComplete() {
    if (!selectedNote) return;
    const next = { ...progress, [selectedNote._id]: true };
    saveProgress(next);
    setProgress(next);
  }

  // Filtered sidebar data
  const filteredData = data
    .map((course) => ({
      ...course,
      modules: course.modules
        .map((mod) => ({
          ...mod,
          notes: mod.notes.filter((n) =>
            n.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((mod) => mod.notes.length > 0),
    }))
    .filter((c) => c.modules.length > 0);

  const isRead = selectedNote ? !!progress[selectedNote._id] : false;

  // ────────────────────────────────────────────────────────────────────
  return (
    <div className="snp-root">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="snp-overlay snp-no-print"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════ SIDEBAR ══════════ */}
      <aside
        className={[
          "snp-sidebar snp-no-print",
          sidebarOpen ? "mobile-open" : "collapsed",
        ].join(" ")}
      >
        {/* Header */}
        <div className="snp-sb-head">
          <div className="snp-sb-top">
            <div className="snp-sb-title">
              <div className="snp-sb-title-icon">
                <BookOpen size={13} />
              </div>
              Study Notes
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="snp-sb-meta">{totalNotes} notes</span>
              <button
                className="snp-sb-close-btn"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="snp-progress-wrap">
            <div className="snp-progress-row">
              <span>{readCount}/{totalNotes} read</span>
              <span
                className="snp-progress-pct"
                style={{
                  color:
                    progressPct === 100
                      ? "var(--sp-success)"
                      : "var(--sp-accent)",
                }}
              >
                {progressPct}%
              </span>
            </div>
            <div className="snp-progress-track">
              <div
                className="snp-progress-fill"
                style={{
                  width: `${progressPct}%`,
                  background:
                    progressPct === 100
                      ? "var(--portal-success)"
                      : "var(--sp-accent)",
                }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="snp-search-wrap">
            <Search size={12} className="snp-search-icon" />
            <input
              className="snp-search"
              type="text"
              placeholder="Search notes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scroll area */}
        <div className="snp-sb-scroll">
          {/* Loading skeleton */}
          {loading ? (
            <div
              style={{
                padding: "20px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[80, 65, 90, 55].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 10,
                    width: `${w}%`,
                    background: "var(--portal-surface-hover)",
                    borderRadius: 6,
                    animation: "snpSkel 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>

          ) : filteredData.length === 0 ? (
            /* Empty */
            <div className="snp-sb-empty">
              <div className="snp-sb-empty-emoji">
                {searchQuery ? "🔍" : "📭"}
              </div>
              <div className="snp-sb-empty-text">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "No notes available yet"}
              </div>
            </div>

          ) : (
            /* Course → Module → Note tree */
            filteredData.map((course) => (
              <div key={course.courseSlug}>

                {/* Course badge */}
                <div className="snp-course-label">
                  <span className="snp-course-badge">
                    <BookOpen size={8} />
                    {course.courseName}
                  </span>
                </div>

                {course.modules.map((mod) => {
                  const key    = `${course.courseSlug}-${mod.moduleSlug}`;
                  const isOpen = openModules.has(key);
                  const modRead =
                    mod.notes.filter((n) => progress[n._id]).length;
                  const modDone =
                    modRead === mod.notes.length && mod.notes.length > 0;

                  return (
                    <div key={key}>
                      {/* Module toggle */}
                      <button
                        className="snp-module-btn"
                        onClick={() => toggleModule(key)}
                      >
                        <div className="snp-module-left">
                          <ChevronRight
                            size={12}
                            className={`snp-module-chevron ${isOpen ? "open" : ""}`}
                          />
                          {mod.moduleName}
                        </div>
                        <span
                          className={`snp-module-progress ${modDone ? "done" : ""}`}
                        >
                          {modRead}/{mod.notes.length}
                        </span>
                      </button>

                      {/* Note items */}
                      {isOpen &&
                        mod.notes.map((note) => {
                          const isActive = selectedNote?._id === note._id;
                          const noteRead = !!progress[note._id];
                          const dotClass = isActive
                            ? "active"
                            : noteRead
                            ? "read"
                            : "unread";

                          return (
                            <button
                              key={note._id}
                              className={`snp-note-item ${isActive ? "active" : ""}`}
                              onClick={() => loadNote(note)}
                            >
                              <div className={`snp-note-dot ${dotClass}`}>
                                {noteRead ? "✓" : "●"}
                              </div>
                              <span
                                className={`snp-note-label ${dotClass}`}
                                title={note.title}
                              >
                                {note.title}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main ref={articleRef as any} className="snp-main">

        {/* Sticky topbar */}
        <div className="snp-topbar snp-no-print">
          <div className="snp-topbar-left">
            {/* Toggle sidebar */}
            <button
              className="snp-menu-btn"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle notes sidebar"
            >
              <BookOpen size={14} />
            </button>

            {/* Breadcrumb */}
            {selectedNote && noteMeta && (
              <div className="snp-breadcrumb">
                <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                  {noteMeta.moduleName}
                </span>
                <ChevronRight size={11} style={{ flexShrink: 0 }} />
                <span className="snp-breadcrumb-cur">{noteTitle}</span>
              </div>
            )}
          </div>

          {/* Action buttons — only when note loaded */}
          {selectedNote && !contentLoading && (
            <div className="snp-action-btns">
              <button
                className={`snp-btn ${isRead ? "read" : ""}`}
                onClick={toggleRead}
              >
                <CheckCheck size={12} />
                <span className="snp-btn-label">
                  {isRead ? "Read ✓" : "Mark Read"}
                </span>
              </button>

              <button
                className="snp-btn"
                onClick={() =>
                  noteMeta &&
                  printNote(noteTitle, noteMeta.moduleName, noteContent)
                }
              >
                <Printer size={12} />
                <span className="snp-btn-label">Print</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Content area ── */}
        {!selectedNote ? (
          /* Welcome / empty state */
          <div className="snp-empty">
            <div className="snp-empty-icon">
              <BookOpen size={28} />
            </div>
            <div className="snp-empty-title">Select a note</div>
            <div className="snp-empty-sub">
              Choose any topic from the sidebar to start reading
            </div>

            {totalNotes > 0 && (
              <div className="snp-empty-hint">
                {progressPct === 0
                  ? `${totalNotes} notes available — let's start! 🚀`
                  : `${readCount}/${totalNotes} complete — keep going! 🔥`}
              </div>
            )}

            <button
              className="snp-empty-hint snp-no-print"
              onClick={() => setSidebarOpen(true)}
            >
              📚 Browse notes
            </button>
          </div>

        ) : contentLoading ? (
          /* Loader */
          <div className="snp-loader">
            <div className="snp-spinner" />
            <span className="snp-loader-text">Loading note…</span>
          </div>

        ) : (
          /* Note article */
          <div
            className="snp-fade-in"
            style={{ display: "flex", flexDirection: "column", flex: 1 }}
          >
            <article className="snp-article">

              {/* Article header */}
              <div className="snp-article-header">
                <div className="snp-article-module">
                  <BookOpen size={9} />
                  {noteMeta?.moduleName}
                </div>

                <h1 className="snp-article-title">{noteTitle}</h1>

                <div className="snp-article-meta">
                  {noteMeta && (
                    <span>
                      Updated{" "}
                      {new Date(noteMeta.updatedAt).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </span>
                  )}
                  {isRead && (
                    <>
                      <div className="snp-article-meta-dot" />
                      <span className="snp-article-read-badge">
                        <CheckCheck size={9} /> Completed
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Note content */}
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
                  className="snp-note-content"
                />
              )}

              {/* Article footer */}
              <div className="snp-article-footer snp-no-print">
                <span>Shivshakti Computer Academy</span>
                <button
                  className="snp-complete-btn"
                  style={
                    isRead
                      ? {
                          background: "rgb(16 185 129 / 0.1)",
                          color: "var(--sp-success)",
                          borderColor: "rgb(16 185 129 / 0.25)",
                        }
                      : {
                          background: "var(--sp-active-bg)",
                          color: "var(--sp-active-fg)",
                          borderColor: "var(--sp-border)",
                        }
                  }
                  onClick={markComplete}
                >
                  <CheckCheck size={13} />
                  {isRead ? "Note Complete!" : "Mark Complete"}
                </button>
              </div>

            </article>
          </div>
        )}
      </main>
    </div>
  );
}