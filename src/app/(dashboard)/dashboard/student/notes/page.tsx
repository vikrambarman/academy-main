"use client";

/**
 * FILE: src/app/dashboard/student/notes/page.tsx
 *
 * DEPENDENCIES:
 * npm install react-markdown remark-gfm rehype-highlight highlight.js
 *
 * globals.css mein add karo:
 * @import 'highlight.js/styles/github-dark.css';
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

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

const PROGRESS_KEY = "sca_notes_progress";

function loadProgress(): ProgressMap {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
    catch { return {}; }
}

function saveProgress(map: ProgressMap) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

// SIRF printNote function replace karo apne page.tsx mein
// Baaki sab same rahega

function printNote(title: string, moduleName: string, content: string) {
    const win = window.open("", "_blank");
    if (!win) return;

    // Markdown ko proper HTML mein convert karo
    function mdToHtml(md: string): string {
        const lines = md.split("\n");
        let html = "";
        let inCode = false;
        let codeLang = "";
        let codeLines: string[] = [];
        let inList = false;
        let listType = "";

        const escHtml = (s: string) =>
            s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const inlineFormat = (s: string) =>
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

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Code block start/end
            if (line.startsWith("```")) {
                if (!inCode) {
                    closeList();
                    inCode = true;
                    codeLang = line.slice(3).trim();
                    codeLines = [];
                } else {
                    html += `<pre><code class="language-${codeLang}">${escHtml(codeLines.join("\n"))}</code></pre>`;
                    inCode = false;
                    codeLines = [];
                    codeLang = "";
                }
                continue;
            }

            if (inCode) {
                codeLines.push(line);
                continue;
            }

            // Headings
            if (line.startsWith("#### ")) { closeList(); html += `<h4>${inlineFormat(line.slice(5))}</h4>`; continue; }
            if (line.startsWith("### ")) { closeList(); html += `<h3>${inlineFormat(line.slice(4))}</h3>`; continue; }
            if (line.startsWith("## ")) { closeList(); html += `<h2>${inlineFormat(line.slice(3))}</h2>`; continue; }
            if (line.startsWith("# ")) { closeList(); html += `<h1>${inlineFormat(line.slice(2))}</h1>`; continue; }

            // Blockquote
            if (line.startsWith("> ")) { closeList(); html += `<blockquote>${inlineFormat(line.slice(2))}</blockquote>`; continue; }

            // HR
            if (/^[-*_]{3,}$/.test(line.trim())) { closeList(); html += "<hr/>"; continue; }

            // Unordered list
            if (line.match(/^[-*+] /)) {
                if (!inList || listType !== "ul") { if (inList) closeList(); html += "<ul>"; inList = true; listType = "ul"; }
                html += `<li>${inlineFormat(line.slice(2))}</li>`;
                continue;
            }

            // Ordered list
            if (/^\d+\. /.test(line)) {
                if (!inList || listType !== "ol") { if (inList) closeList(); html += "<ol>"; inList = true; listType = "ol"; }
                html += `<li>${inlineFormat(line.replace(/^\d+\.\s*/, ""))}</li>`;
                continue;
            }

            // Empty line
            if (line.trim() === "") {
                closeList();
                html += "<br/>";
                continue;
            }

            // Paragraph
            closeList();
            html += `<p>${inlineFormat(line)}</p>`;
        }

        closeList();
        return html;
    }

    const bodyHtml = mdToHtml(content);

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${title} — Shivshakti Computer Academy</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Merriweather', Georgia, serif; font-size: 13px; line-height: 1.85; color: #1a1a2e; padding: 40px 60px; max-width: 820px; margin: 0 auto; }
    .header { border-bottom: 3px solid #1a1a2e; padding-bottom: 16px; margin-bottom: 28px; }
    .academy { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6366f1; margin-bottom: 6px; }
    .module-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    h1 { font-size: 22px; font-weight: 700; color: #1a1a2e; }
    h2 { font-size: 16px; font-weight: 700; margin-top: 24px; margin-bottom: 10px; border-left: 3px solid #6366f1; padding-left: 10px; color: #1e293b; }
    h3 { font-size: 14px; font-weight: 700; margin-top: 18px; margin-bottom: 8px; color: #334155; }
    h4 { font-size: 13px; font-weight: 700; margin-top: 14px; margin-bottom: 6px; color: #475569; }
    p { margin-bottom: 12px; color: #334155; }
    ul, ol { margin: 10px 0 12px 24px; }
    li { margin-bottom: 5px; color: #334155; }
    code { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 11px; background: #fef3c7; color: #92400e; padding: 1px 5px; border-radius: 3px; border: 1px solid #fde68a; }
    pre { background: #0d1117; color: #e6edf3; padding: 16px 18px; border-radius: 8px; margin: 14px 0; overflow-x: auto; font-size: 11px; line-height: 1.6; }
    pre code { background: none; padding: 0; color: inherit; border: none; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 12px; border-radius: 6px; overflow: hidden; }
    th { background: #1e1b4b; color: #e0e7ff; padding: 9px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #334155; }
    tr:nth-child(even) td { background: #f9fafb; }
    blockquote { border-left: 3px solid #6366f1; background: #f5f3ff; padding: 10px 14px; margin: 12px 0; border-radius: 0 6px 6px 0; color: #4c1d95; font-style: italic; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
    strong { font-weight: 700; color: #0f172a; }
    em { font-style: italic; color: #475569; }
    a { color: #6366f1; }
    br { display: block; margin: 4px 0; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #999; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 20px 30px; }
      pre { white-space: pre-wrap; word-break: break-all; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="academy">Shivshakti Computer Academy</div>
    <div class="module-label">${moduleName}</div>
    <h1>${title}</h1>
  </div>
  <div class="content">${bodyHtml}</div>
  <div class="footer">
    <span>Shivshakti Computer Academy</span>
    <span>Printed: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
  </div>
  <script>
    // Font load hone ka wait karo phir print
    document.fonts.ready.then(() => {
      setTimeout(() => window.print(), 600);
    });
  </script>
</body>
</html>`);
    win.document.close();
}

export default function StudentNotesPage() {
    const [data, setData] = useState<CourseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
    const [noteContent, setNoteContent] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [noteMeta, setNoteMeta] = useState<{ moduleName: string; updatedAt: string } | null>(null);
    const [contentLoading, setContentLoading] = useState(false);
    const [openModules, setOpenModules] = useState<Set<string>>(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [progress, setProgress] = useState<ProgressMap>({});
    const [searchQuery, setSearchQuery] = useState("");
    const articleRef = useRef<HTMLElement>(null);

    const totalNotes = data.reduce((s, c) => s + c.modules.reduce((ms, m) => ms + m.notes.length, 0), 0);
    const readCount = Object.values(progress).filter(Boolean).length;
    const progressPct = totalNotes > 0 ? Math.round((readCount / totalNotes) * 100) : 0;

    useEffect(() => { setProgress(loadProgress()); }, []);

    useEffect(() => {
        fetchWithAuth("/api/student/notes")
            .then((r) => r.json())
            .then((d) => {
                setData(d.data || []);
                if (d.data?.length) {
                    const firstMod = `${d.data[0].courseSlug}-${d.data[0].modules[0]?.moduleSlug}`;
                    setOpenModules(new Set([firstMod]));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const markRead = useCallback((noteId: string) => {
        setProgress((prev) => {
            if (prev[noteId]) return prev;
            const next = { ...prev, [noteId]: true };
            saveProgress(next);
            return next;
        });
    }, []);

    async function loadNote(note: NoteItem) {
        if (selectedNote?._id === note._id) return;
        setSelectedNote(note);
        setContentLoading(true);
        setNoteContent(""); setNoteTitle(""); setNoteMeta(null);
        try {
            const res = await fetchWithAuth(`/api/student/notes/${note._id}`);
            const d = await res.json();
            if (res.ok) {
                setNoteContent(d.content || "");
                setNoteTitle(d.note.title);
                setNoteMeta({ moduleName: d.note.moduleName, updatedAt: d.note.updatedAt });
                markRead(note._id);
                setTimeout(() => articleRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
            } else {
                setNoteContent(`> ❌ ${d.error || "Note load nahi hua"}`);
            }
        } catch { setNoteContent("> ❌ Network error"); }
        finally { setContentLoading(false); }
    }

    function toggleModule(key: string) {
        setOpenModules((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }

    const filteredData = data.map((course) => ({
        ...course,
        modules: course.modules.map((mod) => ({
            ...mod,
            notes: mod.notes.filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase())),
        })).filter((mod) => mod.notes.length > 0),
    })).filter((c) => c.modules.length > 0);

    return (
        <>
            <style>{`
                .note-content h1{font-size:1.6rem;font-weight:800;margin:1.5rem 0 0.75rem;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:0.4rem}
                .note-content h2{font-size:1.25rem;font-weight:700;margin:1.4rem 0 0.6rem;color:#1e293b;position:relative;padding-left:14px}
                .note-content h2::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:2px}
                .note-content h3{font-size:1.05rem;font-weight:700;margin:1.2rem 0 0.5rem;color:#334155}
                .note-content h4{font-size:0.95rem;font-weight:600;margin:1rem 0 0.4rem;color:#475569}
                .note-content p{margin-bottom:0.85rem;line-height:1.85;color:#334155;font-size:0.925rem}
                .note-content ul,.note-content ol{margin:0.5rem 0 0.85rem 1.4rem}
                .note-content li{margin-bottom:0.35rem;color:#334155;font-size:0.925rem;line-height:1.7}
                .note-content strong{font-weight:700;color:#0f172a}
                .note-content em{font-style:italic;color:#475569}
                .note-content blockquote{border-left:4px solid #6366f1;background:#f5f3ff;padding:12px 16px;margin:1rem 0;border-radius:0 8px 8px 0;color:#4c1d95;font-size:0.9rem}
                .note-content hr{border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0}
                .note-content a{color:#6366f1;text-decoration:underline}
                .note-content table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:0.875rem;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.07)}
                .note-content th{background:#1e1b4b;color:#e0e7ff;padding:10px 14px;text-align:left;font-weight:600;font-size:0.8rem;letter-spacing:0.03em;text-transform:uppercase}
                .note-content td{padding:9px 14px;border-bottom:1px solid #f1f5f9;color:#334155}
                .note-content tr:last-child td{border-bottom:none}
                .note-content tr:nth-child(even) td{background:#f8fafc}
                .note-content code:not(pre code){font-family:'JetBrains Mono','Fira Code',monospace;font-size:0.82rem;background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:4px;border:1px solid #fde68a}
                .note-content pre{border-radius:10px;margin:1rem 0;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15)}
                .note-content pre code{font-size:0.83rem!important;font-family:'JetBrains Mono','Fira Code',monospace!important;line-height:1.65}
                .note-content .hljs{background:#0d1117!important;padding:1.2rem 1.4rem!important}
                @keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
                .note-fade-in{animation:fadeSlideIn 0.3s ease forwards}
                @media print{.no-print{display:none!important}}
            `}</style>

            <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">

                {/* SIDEBAR */}
                <aside className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden no-print`}
                    style={{ boxShadow: "2px 0 12px rgba(0,0,0,0.04)" }}>

                    <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">Study Notes</h2>
                                <p className="text-[11px] text-slate-400 mt-0.5">{totalNotes} notes · {readCount} read</p>
                            </div>
                            <span className="text-lg font-black" style={{ color: progressPct === 100 ? "#10b981" : "#6366f1" }}>
                                {progressPct}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPct}%`, background: progressPct === 100 ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
                        </div>
                        <div className="mt-3 relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300 text-xs">🔍</span>
                            <input type="text" placeholder="Topic search karo..." value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2">
                        {loading ? (
                            <div className="flex flex-col gap-2 p-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />)}
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <p className="text-2xl mb-2">📭</p>
                                <p className="text-xs text-slate-400">{searchQuery ? "Koi result nahi mila" : "Abhi koi notes available nahi"}</p>
                            </div>
                        ) : filteredData.map((course) => (
                            <div key={course.courseSlug} className="mb-3">
                                <div className="px-4 py-2">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                        style={{ background: "#eef2ff", color: "#4338ca" }}>
                                        📚 {course.courseName}
                                    </span>
                                </div>
                                {course.modules.map((mod) => {
                                    const key = `${course.courseSlug}-${mod.moduleSlug}`;
                                    const isOpen = openModules.has(key);
                                    const modReadCount = mod.notes.filter(n => progress[n._id]).length;
                                    return (
                                        <div key={key}>
                                            <button onClick={() => toggleModule(key)}
                                                className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-slate-50 transition-colors group">
                                                <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 group-hover:text-slate-900">
                                                    <span className="text-slate-300">{isOpen ? "▾" : "▸"}</span>
                                                    {mod.moduleName}
                                                </span>
                                                <span className="text-[10px]" style={{ color: modReadCount === mod.notes.length && mod.notes.length > 0 ? "#10b981" : "#94a3b8" }}>
                                                    {modReadCount}/{mod.notes.length}
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div className="pb-1">
                                                    {mod.notes.map((note) => {
                                                        const isSelected = selectedNote?._id === note._id;
                                                        const isRead = progress[note._id];
                                                        return (
                                                            <button key={note._id} onClick={() => loadNote(note)}
                                                                className={`w-full text-left px-5 py-2 transition-all flex items-center gap-2 ${isSelected ? "bg-indigo-50 border-r-2 border-indigo-500" : "hover:bg-slate-50"}`}>
                                                                <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                                                    style={{ background: isRead ? "#d1fae5" : isSelected ? "#e0e7ff" : "#f1f5f9" }}>
                                                                    {isRead
                                                                        ? <span className="text-[8px]" style={{ color: "#059669" }}>✓</span>
                                                                        : <span className="text-[6px]" style={{ color: isSelected ? "#6366f1" : "#cbd5e1" }}>●</span>}
                                                                </span>
                                                                <span className={`text-[11.5px] leading-tight ${isSelected ? "text-indigo-700 font-semibold" : isRead ? "text-slate-400" : "text-slate-600"}`}>
                                                                    {note.title}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ══════════ SIDEBAR TOGGLE BUTTON ══════════ */}
                <div className="no-print relative flex-shrink-0 flex items-center">
                    <button
                        onClick={() => setSidebarOpen(s => !s)}
                        className="absolute z-20 w-5 h-12 bg-white border border-slate-200 border-l-0 rounded-r-lg flex items-center justify-center shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                        title={sidebarOpen ? "Sidebar band karo" : "Sidebar kholo"}
                    >
                        <span className="text-slate-400 text-[10px]">
                            {sidebarOpen ? "◀" : "▶"}
                        </span>
                    </button>
                </div>

                {/* MAIN */}
                <main ref={articleRef as any} className="flex-1 overflow-y-auto relative">
                    {!selectedNote ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-8">
                            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mb-6"
                                style={{ background: "linear-gradient(135deg,#eef2ff,#f5f3ff)" }}>📖</div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Note select karo</h3>
                            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">Left sidebar se koi bhi topic chunno aur padhai shuru karo</p>
                            {totalNotes > 0 && (
                                <div className="mt-6 px-4 py-3 rounded-xl text-sm" style={{ background: "#f5f3ff", color: "#6366f1" }}>
                                    {progressPct === 0 ? `${totalNotes} notes available hain — shuru karo!` : `${readCount}/${totalNotes} notes complete — keep going! 🔥`}
                                </div>
                            )}
                        </div>
                    ) : contentLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin mx-auto mb-4" />
                                <p className="text-sm text-slate-400">Note load ho raha hai...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="note-fade-in">
                            {/* Action Bar */}
                            <div className="no-print sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100 px-6 py-2.5 flex items-center justify-between"
                                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                                <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
                                    <span className="truncate max-w-[200px]">{noteMeta?.moduleName}</span>
                                    <span>›</span>
                                    <span className="truncate max-w-[200px] text-slate-600 font-medium">{noteTitle}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => {
                                            if (!selectedNote) return;
                                            const isRead = progress[selectedNote._id];
                                            setProgress(prev => {
                                                const next = { ...prev };
                                                if (isRead) delete next[selectedNote._id];
                                                else next[selectedNote._id] = true;
                                                saveProgress(next);
                                                return next;
                                            });
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                                        style={selectedNote && progress[selectedNote._id]
                                            ? { background: "#d1fae5", color: "#065f46", borderColor: "#a7f3d0" }
                                            : { background: "#f8fafc", color: "#64748b", borderColor: "#e2e8f0" }}>
                                        {selectedNote && progress[selectedNote._id] ? "✓ Read" : "Mark as Read"}
                                    </button>
                                    <button
                                        onClick={() => noteMeta && printNote(noteTitle, noteMeta.moduleName, noteContent)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                                        style={{ background: "#f8fafc", color: "#64748b", borderColor: "#e2e8f0" }}>
                                        🖨️ Print / PDF
                                    </button>
                                </div>
                            </div>

                            {/* Article */}
                            <article className="max-w-3xl mx-auto px-6 py-8 pb-20">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                                        style={{ background: "#eef2ff", color: "#4338ca" }}>{noteMeta?.moduleName}</div>
                                    <h1 className="text-3xl font-black text-slate-900 leading-tight mb-3" style={{ letterSpacing: "-0.02em" }}>{noteTitle}</h1>
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        {noteMeta && <span>Updated: {new Date(noteMeta.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>}
                                        {selectedNote && progress[selectedNote._id] && (
                                            <span className="flex items-center gap-1 font-medium" style={{ color: "#10b981" }}>✓ Completed</span>
                                        )}
                                    </div>
                                </div>

                                <div className="note-content">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{
                                            code({ className, children, ...props }: any) {
                                                return <code className={className} {...props}>{children}</code>;
                                            },
                                            pre({ children }: any) {
                                                return (
                                                    <div className="relative group/code">
                                                        <pre>{children}</pre>
                                                        <button
                                                            onClick={() => {
                                                                const text = (children as any)?.props?.children;
                                                                if (typeof text === "string") navigator.clipboard.writeText(text);
                                                            }}
                                                            className="no-print absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-medium opacity-0 group-hover/code:opacity-100 transition-opacity"
                                                            style={{ background: "rgba(255,255,255,0.15)", color: "#94a3b8" }}>
                                                            Copy
                                                        </button>
                                                    </div>
                                                );
                                            },
                                            table({ children }: any) {
                                                return <div className="overflow-x-auto my-4"><table>{children}</table></div>;
                                            },
                                        }}>
                                        {noteContent}
                                    </ReactMarkdown>
                                </div>

                                <div className="no-print mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                    <span>Shivshakti Computer Academy</span>
                                    <button
                                        onClick={() => {
                                            if (!selectedNote) return;
                                            const next = { ...progress, [selectedNote._id]: true };
                                            saveProgress(next); setProgress(next);
                                        }}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-xs transition-all"
                                        style={selectedNote && progress[selectedNote._id]
                                            ? { background: "#d1fae5", color: "#065f46" }
                                            : { background: "#eef2ff", color: "#4338ca" }}>
                                        {selectedNote && progress[selectedNote._id] ? "✓ Note Complete!" : "✓ Mark Complete"}
                                    </button>
                                </div>
                            </article>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}