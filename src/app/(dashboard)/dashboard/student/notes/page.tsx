// app/dashboard/student/notes/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { BookOpen, ChevronRight, Search, CheckCheck, Printer } from "lucide-react";

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

function printNote(title: string, moduleName: string, content: string) {
    const win = window.open("", "_blank");
    if (!win) return;

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
            if (inList) { html += listType === "ul" ? "</ul>" : "</ol>"; inList = false; listType = ""; }
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith("```")) {
                if (!inCode) { closeList(); inCode = true; codeLang = line.slice(3).trim(); codeLines = []; }
                else { html += `<pre><code class="language-${codeLang}">${escHtml(codeLines.join("\n"))}</code></pre>`; inCode = false; codeLines = []; codeLang = ""; }
                continue;
            }
            if (inCode) { codeLines.push(line); continue; }
            if (line.startsWith("#### ")) { closeList(); html += `<h4>${inlineFormat(line.slice(5))}</h4>`; continue; }
            if (line.startsWith("### ")) { closeList(); html += `<h3>${inlineFormat(line.slice(4))}</h3>`; continue; }
            if (line.startsWith("## ")) { closeList(); html += `<h2>${inlineFormat(line.slice(3))}</h2>`; continue; }
            if (line.startsWith("# ")) { closeList(); html += `<h1>${inlineFormat(line.slice(2))}</h1>`; continue; }
            if (line.startsWith("> ")) { closeList(); html += `<blockquote>${inlineFormat(line.slice(2))}</blockquote>`; continue; }
            if (/^[-*_]{3,}$/.test(line.trim())) { closeList(); html += "<hr/>"; continue; }
            if (line.match(/^[-*+] /)) {
                if (!inList || listType !== "ul") { if (inList) closeList(); html += "<ul>"; inList = true; listType = "ul"; }
                html += `<li>${inlineFormat(line.slice(2))}</li>`; continue;
            }
            if (/^\d+\. /.test(line)) {
                if (!inList || listType !== "ol") { if (inList) closeList(); html += "<ol>"; inList = true; listType = "ol"; }
                html += `<li>${inlineFormat(line.replace(/^\d+\.\s*/, ""))}</li>`; continue;
            }
            if (line.trim() === "") { closeList(); html += "<br/>"; continue; }
            closeList();
            html += `<p>${inlineFormat(line)}</p>`;
        }
        closeList();
        return html;
    }

    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<title>${title} — Shivshakti Computer Academy</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Merriweather',Georgia,serif;font-size:13px;line-height:1.85;color:#1a1a2e;padding:40px 60px;max-width:820px;margin:0 auto}
  .header{border-bottom:3px solid #1a1a2e;padding-bottom:16px;margin-bottom:28px}
  .academy{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2563eb;margin-bottom:6px}
  .module-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
  h1{font-size:22px;font-weight:700;color:#1a1a2e}
  h2{font-size:16px;font-weight:700;margin-top:24px;margin-bottom:10px;border-left:3px solid #2563eb;padding-left:10px;color:#1e293b}
  h3{font-size:14px;font-weight:700;margin-top:18px;margin-bottom:8px;color:#334155}
  h4{font-size:13px;font-weight:700;margin-top:14px;margin-bottom:6px;color:#475569}
  p{margin-bottom:12px;color:#334155}
  ul,ol{margin:10px 0 12px 24px}
  li{margin-bottom:5px;color:#334155}
  code{font-family:'JetBrains Mono','Courier New',monospace;font-size:11px;background:#eff6ff;color:#1d4ed8;padding:1px 5px;border-radius:3px;border:1px solid #bfdbfe}
  pre{background:#0d1117;color:#e6edf3;padding:16px 18px;border-radius:8px;margin:14px 0;overflow-x:auto;font-size:11px;line-height:1.6}
  pre code{background:none;padding:0;color:inherit;border:none;font-size:11px}
  table{width:100%;border-collapse:collapse;margin:14px 0;font-size:12px;border-radius:6px;overflow:hidden}
  th{background:#1e3a5f;color:#e0effe;padding:9px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}
  td{padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#334155}
  tr:nth-child(even) td{background:#f8fafc}
  blockquote{border-left:3px solid #2563eb;background:#eff6ff;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;color:#1d4ed8;font-style:italic}
  hr{border:none;border-top:1px solid #e2e8f0;margin:20px 0}
  strong{font-weight:700;color:#0f172a}
  em{font-style:italic;color:#475569}
  a{color:#2563eb}
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
    <span>Printed: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
  </div>
  <script>document.fonts.ready.then(() => setTimeout(() => window.print(), 600));</script>
</body></html>`);
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
    const [progress, setProgress] = useState<ProgressMap>({});
    const [searchQuery, setSearchQuery] = useState("");
    const articleRef = useRef<HTMLElement>(null);

    const totalNotes = data.reduce((s, c) => s + c.modules.reduce((ms, m) => ms + m.notes.length, 0), 0);
    const readCount = Object.values(progress).filter(Boolean).length;
    const progressPct = totalNotes > 0 ? Math.round((readCount / totalNotes) * 100) : 0;

    useEffect(() => { setProgress(loadProgress()); }, []);

    useEffect(() => {
        fetchWithAuth("/api/student/notes")
            .then(r => r.json())
            .then(d => {
                setData(d.data || []);
                if (d.data?.length) {
                    const firstKey = `${d.data[0].courseSlug}-${d.data[0].modules[0]?.moduleSlug}`;
                    setOpenModules(new Set([firstKey]));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const markRead = useCallback((noteId: string) => {
        setProgress(prev => {
            if (prev[noteId]) return prev;
            const next = { ...prev, [noteId]: true };
            saveProgress(next);
            return next;
        });
    }, []);

    async function loadNote(note: NoteItem) {
        if (selectedNote?._id === note._id && noteContent) return;
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
        setOpenModules(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }

    const filteredData = data.map(course => ({
        ...course,
        modules: course.modules.map(mod => ({
            ...mod,
            notes: mod.notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())),
        })).filter(mod => mod.notes.length > 0),
    })).filter(c => c.modules.length > 0);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                /* ══ Note content renderer ══ */
                .snp-note-content h1 { font-family: 'DM Serif Display', serif; font-size: 1.5rem; font-weight: 400; margin: 1.4rem 0 0.6rem; color: #0f172a; border-bottom: 2px solid #e0effe; padding-bottom: 0.4rem; }
                .snp-note-content h2 { font-size: 1.15rem; font-weight: 700; margin: 1.3rem 0 0.55rem; color: #1e293b; position: relative; padding-left: 14px; }
                .snp-note-content h2::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg,#2563eb,#60a5fa); border-radius: 2px; }
                .snp-note-content h3 { font-size: 1rem; font-weight: 700; margin: 1.1rem 0 0.45rem; color: #334155; }
                .snp-note-content h4 { font-size: 0.9rem; font-weight: 600; margin: 0.9rem 0 0.35rem; color: #475569; }
                .snp-note-content p  { margin-bottom: 0.8rem; line-height: 1.85; color: #334155; font-size: 0.9rem; }
                .snp-note-content ul, .snp-note-content ol { margin: 0.4rem 0 0.8rem 1.4rem; }
                .snp-note-content li { margin-bottom: 0.3rem; color: #334155; font-size: 0.9rem; line-height: 1.7; }
                .snp-note-content strong { font-weight: 700; color: #0f172a; }
                .snp-note-content em { font-style: italic; color: #475569; }
                .snp-note-content blockquote { border-left: 4px solid #2563eb; background: #eff6ff; padding: 12px 16px; margin: 1rem 0; border-radius: 0 8px 8px 0; color: #1d4ed8; font-size: 0.875rem; }
                .snp-note-content hr  { border: none; border-top: 1px solid #e0effe; margin: 1.4rem 0; }
                .snp-note-content a   { color: #2563eb; text-decoration: underline; }
                .snp-note-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
                .snp-note-content th { background: #1e3a5f; color: #e0effe; padding: 10px 14px; text-align: left; font-weight: 600; font-size: 0.75rem; letter-spacing: 0.04em; text-transform: uppercase; }
                .snp-note-content td { padding: 9px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
                .snp-note-content tr:last-child td { border-bottom: none; }
                .snp-note-content tr:nth-child(even) td { background: #f8fafc; }
                .snp-note-content code:not(pre code) { font-family: 'JetBrains Mono','Fira Code',monospace; font-size: 0.8rem; background: #eff6ff; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; border: 1px solid #bfdbfe; }
                .snp-note-content pre { border-radius: 10px; margin: 1rem 0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
                .snp-note-content pre code { font-size: 0.81rem !important; font-family: 'JetBrains Mono','Fira Code',monospace !important; line-height: 1.65; }
                .snp-note-content .hljs { background: #0d1117 !important; padding: 1.1rem 1.3rem !important; }

                @keyframes snpFadeIn { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
                .snp-fade-in { animation: snpFadeIn 0.28s ease forwards; }

                /* ══ Layout shell ══ */
                .snp-root { display: flex; height: calc(100vh - 96px); font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; overflow: hidden; border-radius: 16px; border: 1px solid #e0effe; background: #fff; }

                /* ══ Sidebar ══ */
                .snp-sidebar {
                    width: 268px; flex-shrink: 0;
                    background: #fff; border-right: 1px solid #e0effe;
                    display: flex; flex-direction: column;
                    transition: width 0.25s cubic-bezier(.4,0,.2,1);
                    overflow: hidden;
                }

                .snp-sidebar.hidden { width: 0; }

                /* Sidebar header */
                .snp-sb-head {
                    padding: 14px 14px 10px;
                    border-bottom: 1px solid #e0effe;
                    flex-shrink: 0;
                }

                .snp-sb-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }

                .snp-sb-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 1rem; color: #0f172a; display: flex; align-items: center; gap: 8px;
                }

                .snp-sb-title-icon {
                    width: 26px; height: 26px; border-radius: 7px;
                    background: #eff6ff; display: flex; align-items: center;
                    justify-content: center; color: #2563eb; flex-shrink: 0;
                }

                .snp-sb-meta { font-size: 10px; color: #94a3b8; font-weight: 400; margin-top: 1px; }

                /* Progress bar */
                .snp-progress-wrap { margin-bottom: 10px; }

                .snp-progress-row {
                    display: flex; align-items: center; justify-content: space-between;
                    font-size: 10px; font-weight: 600; margin-bottom: 5px;
                    color: #64748b;
                }

                .snp-progress-pct { font-family: 'DM Serif Display', serif; font-size: 0.9rem; }

                .snp-progress-track {
                    width: 100%; height: 4px; background: #e0effe; border-radius: 100px; overflow: hidden;
                }

                .snp-progress-fill {
                    height: 100%; border-radius: 100px; transition: width 0.5s ease;
                }

                /* Search */
                .snp-search-wrap { position: relative; }

                .snp-search-icon {
                    position: absolute; left: 9px; top: 50%; transform: translateY(-50%);
                    color: #94a3b8; pointer-events: none;
                }

                .snp-search {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    width: 100%; font-size: 12px; font-weight: 400;
                    padding: 8px 10px 8px 30px;
                    border: 1px solid #e0effe; border-radius: 9px;
                    background: #f8fbff; color: #0f172a; outline: none;
                    transition: border-color 0.15s, background 0.15s;
                }

                .snp-search:focus { border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37,99,235,0.07); }
                .snp-search::placeholder { color: #94a3b8; }

                /* Sidebar scroll area */
                .snp-sb-scroll { flex: 1; overflow-y: auto; padding: 8px 0 16px; scrollbar-width: thin; scrollbar-color: #e0effe transparent; }
                .snp-sb-scroll::-webkit-scrollbar { width: 4px; }
                .snp-sb-scroll::-webkit-scrollbar-thumb { background: #e0effe; border-radius: 4px; }

                /* Course label */
                .snp-course-label {
                    padding: 8px 14px 5px;
                    display: flex; align-items: center; gap: 6px;
                }

                .snp-course-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
                    padding: 3px 9px; border-radius: 100px;
                    background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
                }

                /* Module toggle */
                .snp-module-btn {
                    display: flex; align-items: center; justify-content: space-between;
                    width: 100%; padding: 8px 14px; border: none; background: transparent;
                    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 11px; font-weight: 600; color: #475569;
                    transition: color 0.14s, background 0.14s;
                    text-align: left;
                }

                .snp-module-btn:hover { background: #f8fbff; color: #0f172a; }

                .snp-module-left { display: flex; align-items: center; gap: 7px; }

                .snp-module-chevron {
                    color: #94a3b8; transition: transform 0.2s;
                    flex-shrink: 0;
                }

                .snp-module-chevron.open { transform: rotate(90deg); }

                .snp-module-progress {
                    font-size: 9px; font-weight: 700; color: #94a3b8;
                    background: #f1f5f9; padding: 2px 7px; border-radius: 100px;
                    flex-shrink: 0;
                }

                .snp-module-progress.done { background: #dcfce7; color: #15803d; }

                /* Note items */
                .snp-note-item {
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 14px 8px 28px;
                    cursor: pointer; border: none; background: transparent;
                    width: 100%; text-align: left;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    transition: background 0.13s;
                    border-right: 3px solid transparent;
                }

                .snp-note-item:hover { background: #f8fbff; }

                .snp-note-item.active {
                    background: #eff6ff;
                    border-right-color: #2563eb;
                }

                .snp-note-dot {
                    width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 7px;
                }

                .snp-note-dot.read    { background: #dcfce7; color: #15803d; }
                .snp-note-dot.active  { background: #dbeafe; color: #2563eb; }
                .snp-note-dot.unread  { background: #f1f5f9; color: #94a3b8; }

                .snp-note-label {
                    font-size: 12px; line-height: 1.4; flex: 1; overflow: hidden;
                    text-overflow: ellipsis; white-space: nowrap;
                }

                .snp-note-label.active  { color: #1d4ed8; font-weight: 600; }
                .snp-note-label.read    { color: #94a3b8; }
                .snp-note-label.unread  { color: #475569; }

                /* ══ Toggle sidebar button ══ */
                .snp-toggle-btn {
                    position: absolute;
                    top: 50%; transform: translateY(-50%);
                    z-index: 10;
                    width: 20px; height: 44px; border-radius: 0 8px 8px 0;
                    border: 1px solid #e0effe; border-left: none;
                    background: #fff; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: #94a3b8; font-size: 10px;
                    transition: background 0.15s, color 0.15s;
                    box-shadow: 2px 0 8px rgba(37,99,235,0.06);
                }

                .snp-toggle-btn:hover { background: #eff6ff; color: #2563eb; }

                /* ══ Main content area ══ */
                .snp-main {
                    flex: 1; overflow-y: auto; position: relative;
                    scrollbar-width: thin; scrollbar-color: #e0effe transparent;
                }

                .snp-main::-webkit-scrollbar { width: 4px; }
                .snp-main::-webkit-scrollbar-thumb { background: #e0effe; border-radius: 4px; }

                /* Sticky action bar */
                .snp-action-bar {
                    position: sticky; top: 0; z-index: 20;
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-bottom: 1px solid #e0effe;
                    padding: 10px 20px;
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;
                }

                .snp-breadcrumb {
                    display: flex; align-items: center; gap: 5px;
                    font-size: 11px; color: #94a3b8; font-weight: 400;
                    min-width: 0;
                }

                .snp-breadcrumb-cur { color: #475569; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }

                .snp-action-btns { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

                .snp-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: 11px; font-weight: 600; padding: 6px 12px;
                    border-radius: 8px; cursor: pointer; border: 1px solid #e0effe;
                    background: #fff; color: #64748b;
                    transition: all 0.15s; white-space: nowrap;
                }

                .snp-btn:hover { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }

                .snp-btn.read { background: #dcfce7; border-color: #bbf7d0; color: #15803d; }
                .snp-btn.read:hover { background: #bbf7d0; }

                /* Article */
                .snp-article { max-width: 760px; margin: 0 auto; padding: 24px 28px 60px; }

                .snp-article-header { margin-bottom: 24px; }

                .snp-article-module {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
                    padding: 3px 10px; border-radius: 100px;
                    background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
                    margin-bottom: 10px;
                }

                .snp-article-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 1.8rem; color: #0f172a; line-height: 1.25;
                    margin-bottom: 10px; letter-spacing: -0.01em;
                }

                .snp-article-meta {
                    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
                    font-size: 11px; color: #94a3b8; font-weight: 400;
                }

                .snp-article-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: #cbd5e1; }

                .snp-article-read-badge {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: 10px; font-weight: 700;
                    background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;
                    padding: 2px 8px; border-radius: 100px;
                }

                /* Article footer */
                .snp-article-footer {
                    margin-top: 40px; padding-top: 16px;
                    border-top: 1px solid #e0effe;
                    display: flex; align-items: center; justify-content: space-between;
                    font-size: 11px; color: #94a3b8;
                }

                .snp-complete-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px; font-weight: 600;
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 8px 16px; border-radius: 9px; cursor: pointer;
                    border: 1px solid; transition: all 0.15s;
                }

                /* ══ Empty state ══ */
                .snp-empty {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    height: 100%; text-align: center; padding: 40px;
                }

                .snp-empty-icon {
                    width: 64px; height: 64px; border-radius: 18px;
                    background: linear-gradient(135deg, #eff6ff, #dbeafe);
                    display: flex; align-items: center; justify-content: center;
                    color: #2563eb; margin-bottom: 16px;
                }

                .snp-empty-title { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: #0f172a; margin-bottom: 6px; }
                .snp-empty-sub   { font-size: 12px; color: #94a3b8; font-weight: 300; max-width: 240px; line-height: 1.6; }

                .snp-empty-hint {
                    margin-top: 16px; font-size: 12px; font-weight: 500;
                    padding: 8px 16px; border-radius: 9px;
                    background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
                }

                /* ══ Loading ══ */
                .snp-loader {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    height: 100%; gap: 12px;
                }

                .snp-spinner {
                    width: 32px; height: 32px;
                    border: 3px solid #dbeafe;
                    border-top-color: #2563eb;
                    border-radius: 50%;
                    animation: snpSpin 0.7s linear infinite;
                }

                @keyframes snpSpin { to { transform: rotate(360deg); } }

                .snp-loader-text { font-size: 12px; color: #94a3b8; }

                /* ══ Sidebar empty ══ */
                .snp-sb-empty { padding: 32px 16px; text-align: center; }
                .snp-sb-empty-emoji { font-size: 28px; margin-bottom: 8px; }
                .snp-sb-empty-text  { font-size: 11px; color: #94a3b8; line-height: 1.55; }

                @media (max-width: 768px) {
                    .snp-sidebar { position: absolute; z-index: 30; height: 100%; box-shadow: 4px 0 20px rgba(15,23,42,0.08); }
                    .snp-sidebar.hidden { width: 0; }
                }

                @media print { .snp-no-print { display: none !important; } }
            `}</style>

            {/* ══ WRAPPER — needed for toggle button positioning ══ */}
            <div style={{ position: "relative" }}>

                {/* Sidebar toggle */}
                <button
                    className="snp-toggle-btn snp-no-print"
                    style={{ left: 0 }}
                    onClick={() => {
                        const sb = document.querySelector(".snp-sidebar");
                        sb?.classList.toggle("hidden");
                    }}
                    title="Toggle sidebar"
                >
                    ◀
                </button>

                <div className="snp-root">

                    {/* ══ SIDEBAR ══ */}
                    <aside className="snp-sidebar snp-no-print">

                        {/* Head */}
                        <div className="snp-sb-head">
                            <div className="snp-sb-top">
                                <div className="snp-sb-title">
                                    <div className="snp-sb-title-icon"><BookOpen size={13} /></div>
                                    Study Notes
                                </div>
                                <div className="snp-sb-meta">{totalNotes} notes</div>
                            </div>

                            {/* Progress */}
                            <div className="snp-progress-wrap">
                                <div className="snp-progress-row">
                                    <span>{readCount}/{totalNotes} read</span>
                                    <span className="snp-progress-pct" style={{ color: progressPct === 100 ? "#15803d" : "#2563eb" }}>
                                        {progressPct}%
                                    </span>
                                </div>
                                <div className="snp-progress-track">
                                    <div
                                        className="snp-progress-fill"
                                        style={{
                                            width: `${progressPct}%`,
                                            background: progressPct === 100
                                                ? "linear-gradient(90deg,#15803d,#4ade80)"
                                                : "linear-gradient(90deg,#2563eb,#60a5fa)"
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
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Scroll area */}
                        <div className="snp-sb-scroll">
                            {loading ? (
                                <div style={{ padding: "20px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                                    {[80, 65, 90, 55].map((w, i) => (
                                        <div key={i} style={{ height: 10, width: `${w}%`, background: "#f1f5f9", borderRadius: 6, animation: "snpSpin 1.5s linear infinite" }} />
                                    ))}
                                </div>
                            ) : filteredData.length === 0 ? (
                                <div className="snp-sb-empty">
                                    <div className="snp-sb-empty-emoji">{searchQuery ? "🔍" : "📭"}</div>
                                    <div className="snp-sb-empty-text">
                                        {searchQuery ? `No results for "${searchQuery}"` : "No notes available yet"}
                                    </div>
                                </div>
                            ) : filteredData.map(course => (
                                <div key={course.courseSlug}>
                                    <div className="snp-course-label">
                                        <span className="snp-course-badge">
                                            <BookOpen size={8} /> {course.courseName}
                                        </span>
                                    </div>

                                    {course.modules.map(mod => {
                                        const key = `${course.courseSlug}-${mod.moduleSlug}`;
                                        const isOpen = openModules.has(key);
                                        const modRead = mod.notes.filter(n => progress[n._id]).length;
                                        const modDone = modRead === mod.notes.length && mod.notes.length > 0;

                                        return (
                                            <div key={key}>
                                                <button className="snp-module-btn" onClick={() => toggleModule(key)}>
                                                    <div className="snp-module-left">
                                                        <ChevronRight size={12} className={`snp-module-chevron ${isOpen ? "open" : ""}`} />
                                                        {mod.moduleName}
                                                    </div>
                                                    <span className={`snp-module-progress ${modDone ? "done" : ""}`}>
                                                        {modRead}/{mod.notes.length}
                                                    </span>
                                                </button>

                                                {isOpen && mod.notes.map(note => {
                                                    const isActive = selectedNote?._id === note._id;
                                                    const isRead = !!progress[note._id];
                                                    const dotClass = isActive ? "active" : isRead ? "read" : "unread";
                                                    const lblClass = isActive ? "active" : isRead ? "read" : "unread";

                                                    return (
                                                        <button key={note._id} className={`snp-note-item ${isActive ? "active" : ""}`} onClick={() => loadNote(note)}>
                                                            <div className={`snp-note-dot ${dotClass}`}>
                                                                {isRead ? "✓" : "●"}
                                                            </div>
                                                            <span className={`snp-note-label ${lblClass}`} title={note.title}>
                                                                {note.title}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* ══ MAIN ══ */}
                    <main ref={articleRef as any} className="snp-main">

                        {!selectedNote ? (
                            <div className="snp-empty">
                                <div className="snp-empty-icon"><BookOpen size={28} /></div>
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
                            </div>

                        ) : contentLoading ? (
                            <div className="snp-loader">
                                <div className="snp-spinner" />
                                <span className="snp-loader-text">Loading note…</span>
                            </div>

                        ) : (
                            <div className="snp-fade-in">

                                {/* Action bar */}
                                <div className="snp-action-bar snp-no-print">
                                    <div className="snp-breadcrumb">
                                        <span style={{ whiteSpace: "nowrap" }}>{noteMeta?.moduleName}</span>
                                        <ChevronRight size={11} style={{ flexShrink: 0 }} />
                                        <span className="snp-breadcrumb-cur">{noteTitle}</span>
                                    </div>
                                    <div className="snp-action-btns">
                                        <button
                                            className={`snp-btn ${selectedNote && progress[selectedNote._id] ? "read" : ""}`}
                                            onClick={() => {
                                                if (!selectedNote) return;
                                                setProgress(prev => {
                                                    const next = { ...prev };
                                                    if (next[selectedNote._id]) delete next[selectedNote._id];
                                                    else next[selectedNote._id] = true;
                                                    saveProgress(next);
                                                    return next;
                                                });
                                            }}
                                        >
                                            <CheckCheck size={12} />
                                            {selectedNote && progress[selectedNote._id] ? "Read ✓" : "Mark as Read"}
                                        </button>
                                        <button
                                            className="snp-btn"
                                            onClick={() => noteMeta && printNote(noteTitle, noteMeta.moduleName, noteContent)}
                                        >
                                            <Printer size={12} /> Print / PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Article */}
                                <article className="snp-article">
                                    <div className="snp-article-header">
                                        <div className="snp-article-module">
                                            <BookOpen size={9} /> {noteMeta?.moduleName}
                                        </div>
                                        <div className="snp-article-title">{noteTitle}</div>
                                        <div className="snp-article-meta">
                                            {noteMeta && (
                                                <span>
                                                    Updated {new Date(noteMeta.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                                </span>
                                            )}
                                            {selectedNote && progress[selectedNote._id] && (
                                                <>
                                                    <div className="snp-article-meta-dot" />
                                                    <span className="snp-article-read-badge">
                                                        <CheckCheck size={9} /> Completed
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="snp-note-content">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeHighlight]}
                                            components={{
                                                code({ className, children, ...props }: any) {
                                                    return <code className={className} {...props}>{children}</code>;
                                                },
                                                pre({ children }: any) {
                                                    return (
                                                        <div style={{ position: "relative" }} className="group/code snp-no-print">
                                                            <pre>{children}</pre>
                                                            <button
                                                                onClick={() => {
                                                                    const text = (children as any)?.props?.children;
                                                                    if (typeof text === "string") navigator.clipboard.writeText(text);
                                                                }}
                                                                style={{
                                                                    position: "absolute", top: 10, right: 10,
                                                                    padding: "3px 8px", borderRadius: 6,
                                                                    background: "rgba(255,255,255,0.1)", color: "#94a3b8",
                                                                    border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600,
                                                                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                                                                }}
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                    );
                                                },
                                                table({ children }: any) {
                                                    return <div style={{ overflowX: "auto", margin: "1rem 0" }}><table>{children}</table></div>;
                                                },
                                            }}
                                        >
                                            {noteContent}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Footer */}
                                    <div className="snp-article-footer snp-no-print">
                                        <span>Shivshakti Computer Academy</span>
                                        <button
                                            className="snp-complete-btn"
                                            style={selectedNote && progress[selectedNote._id]
                                                ? { background: "#dcfce7", color: "#15803d", borderColor: "#bbf7d0" }
                                                : { background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }
                                            }
                                            onClick={() => {
                                                if (!selectedNote) return;
                                                const next = { ...progress, [selectedNote._id]: true };
                                                saveProgress(next); setProgress(next);
                                            }}
                                        >
                                            <CheckCheck size={13} />
                                            {selectedNote && progress[selectedNote._id] ? "Note Complete!" : "Mark Complete"}
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