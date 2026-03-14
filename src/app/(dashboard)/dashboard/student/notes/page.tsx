"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { BookOpen, ChevronRight, Search, CheckCheck, Printer, X } from "lucide-react";

interface NoteItem   { _id: string; title: string; topicSlug: string; order: number; updatedAt: string; }
interface ModuleItem { moduleName: string; moduleSlug: string; notes: NoteItem[]; }
interface CourseData { courseName: string; courseSlug: string; modules: ModuleItem[]; }
type ProgressMap = Record<string, boolean>;

const PROGRESS_KEY = "sca_notes_progress";
function loadProgress(): ProgressMap { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; } }
function saveProgress(map: ProgressMap) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(map)); }

function printNote(title: string, moduleName: string, content: string) {
    const win = window.open("", "_blank");
    if (!win) return;
    function mdToHtml(md: string): string {
        const lines = md.split("\n");
        let html = "", inCode = false, codeLang = "", codeLines: string[] = [], inList = false, listType = "";
        const escHtml = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
        const inlineFmt = (s: string) => s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>');
        const closeList = () => { if (inList) { html += listType==="ul"?"</ul>":"</ol>"; inList=false; listType=""; } };
        for (const line of lines) {
            if (line.startsWith("```")) { if (!inCode) { closeList(); inCode=true; codeLang=line.slice(3).trim(); codeLines=[]; } else { html+=`<pre><code class="language-${codeLang}">${escHtml(codeLines.join("\n"))}</code></pre>`; inCode=false; codeLines=[]; codeLang=""; } continue; }
            if (inCode) { codeLines.push(line); continue; }
            if (line.startsWith("#### ")) { closeList(); html+=`<h4>${inlineFmt(line.slice(5))}</h4>`; continue; }
            if (line.startsWith("### "))  { closeList(); html+=`<h3>${inlineFmt(line.slice(4))}</h3>`; continue; }
            if (line.startsWith("## "))   { closeList(); html+=`<h2>${inlineFmt(line.slice(3))}</h2>`; continue; }
            if (line.startsWith("# "))    { closeList(); html+=`<h1>${inlineFmt(line.slice(2))}</h1>`; continue; }
            if (line.startsWith("> "))    { closeList(); html+=`<blockquote>${inlineFmt(line.slice(2))}</blockquote>`; continue; }
            if (/^[-*_]{3,}$/.test(line.trim())) { closeList(); html+="<hr/>"; continue; }
            if (line.match(/^[-*+] /))   { if (!inList||listType!=="ul") { if(inList)closeList(); html+="<ul>"; inList=true; listType="ul"; } html+=`<li>${inlineFmt(line.slice(2))}</li>`; continue; }
            if (/^\d+\. /.test(line))    { if (!inList||listType!=="ol") { if(inList)closeList(); html+="<ol>"; inList=true; listType="ol"; } html+=`<li>${inlineFmt(line.replace(/^\d+\.\s*/,""))}</li>`; continue; }
            if (line.trim()==="")        { closeList(); html+="<br/>"; continue; }
            closeList(); html+=`<p>${inlineFmt(line)}</p>`;
        }
        closeList(); return html;
    }
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${title} — Shivshakti Computer Academy</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0} body{font-family:'Merriweather',Georgia,serif;font-size:13px;line-height:1.85;color:#1a1a2e;padding:40px 60px;max-width:820px;margin:0 auto}
  .header{border-bottom:3px solid #1a1a2e;padding-bottom:16px;margin-bottom:28px}
  .academy{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2563eb;margin-bottom:6px}
  .module-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
  h1{font-size:22px;font-weight:700} h2{font-size:16px;font-weight:700;margin-top:24px;margin-bottom:10px;border-left:3px solid #2563eb;padding-left:10px}
  h3{font-size:14px;font-weight:700;margin-top:18px;margin-bottom:8px} h4{font-size:13px;font-weight:700;margin-top:14px;margin-bottom:6px}
  p{margin-bottom:12px;color:#334155} ul,ol{margin:10px 0 12px 24px} li{margin-bottom:5px;color:#334155}
  code{font-family:'JetBrains Mono',monospace;font-size:11px;background:#eff6ff;color:#1d4ed8;padding:1px 5px;border-radius:3px;border:1px solid #bfdbfe}
  pre{background:#0d1117;color:#e6edf3;padding:16px 18px;border-radius:8px;margin:14px 0;overflow-x:auto;font-size:11px;line-height:1.6}
  pre code{background:none;padding:0;color:inherit;border:none}
  table{width:100%;border-collapse:collapse;margin:14px 0;font-size:12px} th{background:#1e3a5f;color:#e0effe;padding:9px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase}
  td{padding:8px 12px;border-bottom:1px solid #e5e7eb} tr:nth-child(even) td{background:#f8fafc}
  blockquote{border-left:3px solid #2563eb;background:#eff6ff;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;color:#1d4ed8;font-style:italic}
  hr{border:none;border-top:1px solid #e2e8f0;margin:20px 0}
  .footer{margin-top:40px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:10px;color:#999;display:flex;justify-content:space-between}
  @media print{body{padding:20px 30px}pre{white-space:pre-wrap;word-break:break-all}}
</style></head><body>
  <div class="header"><div class="academy">Shivshakti Computer Academy</div><div class="module-label">${moduleName}</div><h1>${title}</h1></div>
  <div class="content">${mdToHtml(content)}</div>
  <div class="footer"><span>Shivshakti Computer Academy</span><span>Printed: ${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span></div>
  <script>document.fonts.ready.then(()=>setTimeout(()=>window.print(),600));</script>
</body></html>`);
    win.document.close();
}

export default function StudentNotesPage() {
    const [data,           setData]           = useState<CourseData[]>([]);
    const [loading,        setLoading]        = useState(true);
    const [selectedNote,   setSelectedNote]   = useState<NoteItem | null>(null);
    const [noteContent,    setNoteContent]    = useState("");
    const [noteTitle,      setNoteTitle]      = useState("");
    const [noteMeta,       setNoteMeta]       = useState<{ moduleName:string; updatedAt:string } | null>(null);
    const [contentLoading, setContentLoading] = useState(false);
    const [openModules,    setOpenModules]    = useState<Set<string>>(new Set());
    const [progress,       setProgress]       = useState<ProgressMap>({});
    const [searchQuery,    setSearchQuery]    = useState("");
    const [sidebarOpen,    setSidebarOpen]    = useState(true);   // mobile sidebar state
    const articleRef = useRef<HTMLElement>(null);

    const totalNotes   = data.reduce((s, c) => s + c.modules.reduce((ms, m) => ms + m.notes.length, 0), 0);
    const readCount    = Object.values(progress).filter(Boolean).length;
    const progressPct  = totalNotes > 0 ? Math.round((readCount / totalNotes) * 100) : 0;

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
            saveProgress(next); return next;
        });
    }, []);

    async function loadNote(note: NoteItem) {
        if (selectedNote?._id === note._id && noteContent) {
            setSidebarOpen(false); // on mobile, close sidebar when note selected
            return;
        }
        setSelectedNote(note); setContentLoading(true);
        setNoteContent(""); setNoteTitle(""); setNoteMeta(null);
        setSidebarOpen(false); // close sidebar on mobile after selection
        try {
            const res = await fetchWithAuth(`/api/student/notes/${note._id}`);
            const d   = await res.json();
            if (res.ok) {
                setNoteContent(d.content || "");
                setNoteTitle(d.note.title);
                setNoteMeta({ moduleName: d.note.moduleName, updatedAt: d.note.updatedAt });
                markRead(note._id);
                setTimeout(() => articleRef.current?.scrollTo({ top:0, behavior:"smooth" }), 50);
            } else {
                setNoteContent(`> ❌ ${d.error || "Note load nahi hua"}`);
            }
        } catch { setNoteContent("> ❌ Network error"); }
        finally  { setContentLoading(false); }
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
        modules: course.modules
            .map(mod => ({ ...mod, notes: mod.notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())) }))
            .filter(mod => mod.notes.length > 0),
    })).filter(c => c.modules.length > 0);

    return (
        <>
            <style>{`
                /* ══════════════════════════════════
                   MARKDOWN CONTENT — bullets/numbers fixed
                ══════════════════════════════════ */
                .snp-note-content { font-family:'Plus Jakarta Sans',sans-serif; }

                /* Force list styles — overrides any global reset */
                .snp-note-content ul {
                    list-style-type: disc !important;
                    padding-left: 1.6rem !important;
                    margin: 0.5rem 0 0.9rem !important;
                }
                .snp-note-content ol {
                    list-style-type: decimal !important;
                    padding-left: 1.6rem !important;
                    margin: 0.5rem 0 0.9rem !important;
                }
                .snp-note-content li {
                    display: list-item !important;
                    margin-bottom: 0.35rem !important;
                    color: var(--sp-subtext) !important;
                    font-size: 0.9rem !important;
                    line-height: 1.75 !important;
                }
                .snp-note-content ul ul { list-style-type: circle !important; margin: 0.25rem 0 0.25rem 1rem !important; }
                .snp-note-content ul ul ul { list-style-type: square !important; }
                .snp-note-content ol ol { list-style-type: lower-alpha !important; }

                /* Headings */
                .snp-note-content h1 { font-family:'DM Serif Display',serif; font-size:1.5rem; font-weight:400; margin:1.4rem 0 0.6rem; color:var(--sp-text); border-bottom:2px solid var(--sp-border); padding-bottom:0.4rem; }
                .snp-note-content h2 { font-size:1.15rem; font-weight:700; margin:1.3rem 0 0.55rem; color:var(--sp-text); position:relative; padding-left:14px; }
                .snp-note-content h2::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px; background:linear-gradient(180deg,var(--sp-accent),var(--sp-accent2)); border-radius:2px; }
                .snp-note-content h3 { font-size:1rem; font-weight:700; margin:1.1rem 0 0.45rem; color:var(--sp-text); }
                .snp-note-content h4 { font-size:0.9rem; font-weight:600; margin:0.9rem 0 0.35rem; color:var(--sp-subtext); }

                /* Inline elements */
                .snp-note-content p          { margin-bottom:0.8rem; line-height:1.85; color:var(--sp-subtext); font-size:0.9rem; }
                .snp-note-content strong     { font-weight:700; color:var(--sp-text); }
                .snp-note-content em         { font-style:italic; color:var(--sp-muted); }
                .snp-note-content a          { color:var(--sp-accent); text-decoration:underline; }
                .snp-note-content hr         { border:none; border-top:1px solid var(--sp-border); margin:1.4rem 0; }
                .snp-note-content blockquote { border-left:4px solid var(--sp-accent); background:var(--sp-active-bg); padding:12px 16px; margin:1rem 0; border-radius:0 8px 8px 0; color:var(--sp-active-fg); font-size:0.875rem; }

                /* Code */
                .snp-note-content code:not(pre code) { font-family:'JetBrains Mono','Fira Code',monospace; font-size:0.8rem; background:var(--sp-active-bg); color:var(--sp-accent2); padding:2px 6px; border-radius:4px; border:1px solid var(--sp-border2); }
                .snp-note-content pre         { border-radius:10px; margin:1rem 0; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.2); }
                .snp-note-content pre code    { font-size:0.81rem !important; font-family:'JetBrains Mono',monospace !important; line-height:1.65; }
                .snp-note-content .hljs       { background:#0d1117 !important; padding:1.1rem 1.3rem !important; }

                /* Tables */
                .snp-note-content table { width:100%; border-collapse:collapse; margin:1rem 0; font-size:0.85rem; border-radius:8px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.1); }
                .snp-note-content th { background:var(--sp-bg-sidebar, #1B4FBB); color:#fff; padding:10px 14px; text-align:left; font-weight:600; font-size:0.75rem; letter-spacing:0.04em; text-transform:uppercase; }
                .snp-note-content td { padding:9px 14px; border-bottom:1px solid var(--sp-border); color:var(--sp-subtext); }
                .snp-note-content tr:last-child td { border-bottom:none; }
                .snp-note-content tr:nth-child(even) td { background:var(--sp-hover); }

                /* ══════════════════════════════════
                   ANIMATIONS
                ══════════════════════════════════ */
                @keyframes snpFadeIn { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
                .snp-fade-in { animation:snpFadeIn 0.28s ease forwards; }
                @keyframes snpSpin  { to{transform:rotate(360deg)} }
                @keyframes snpSkel  { 0%,100%{opacity:0.5} 50%{opacity:1} }

                /* ══════════════════════════════════
                   LAYOUT SHELL
                ══════════════════════════════════ */
                .snp-root {
                    display: flex;
                    height: calc(100vh - 116px);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: var(--sp-text);
                    border-radius: 16px;
                    border: 1px solid var(--sp-border);
                    background: var(--sp-surface);
                    overflow: hidden;
                    position: relative;
                }

                /* ══════════════════════════════════
                   SIDEBAR
                ══════════════════════════════════ */
                .snp-sidebar {
                    width: 268px;
                    flex-shrink: 0;
                    background: var(--sp-surface);
                    border-right: 1px solid var(--sp-border);
                    display: flex;
                    flex-direction: column;
                    transition: width 0.25s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1);
                    overflow: hidden;
                    z-index: 20;
                }

                /* Desktop collapse */
                .snp-sidebar.collapsed { width: 0; border-right: none; }

                /* Mobile: slide-in drawer */
                @media (max-width: 768px) {
                    .snp-sidebar {
                        position: absolute;
                        left: 0; top: 0; bottom: 0;
                        width: 280px !important;
                        box-shadow: 4px 0 24px rgba(0,0,0,0.25);
                        transform: translateX(-100%);
                    }
                    .snp-sidebar.mobile-open {
                        transform: translateX(0);
                    }
                }

                /* Sidebar header */
                .snp-sb-head { padding:14px 14px 10px; border-bottom:1px solid var(--sp-border); flex-shrink:0; }
                .snp-sb-top  { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
                .snp-sb-title { font-family:'DM Serif Display',serif; font-size:1rem; color:var(--sp-text); display:flex; align-items:center; gap:8px; }
                .snp-sb-title-icon { width:26px; height:26px; border-radius:7px; background:var(--sp-active-bg); display:flex; align-items:center; justify-content:center; color:var(--sp-accent); flex-shrink:0; }
                .snp-sb-meta { font-size:10px; color:var(--sp-muted); font-weight:400; margin-top:1px; }
                .snp-sb-close-btn { width:26px; height:26px; border-radius:7px; border:1px solid var(--sp-border); background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--sp-muted); transition:background 0.15s; }
                .snp-sb-close-btn:hover { background:var(--sp-hover); color:var(--sp-text); }

                /* Progress */
                .snp-progress-wrap { margin-bottom:10px; }
                .snp-progress-row  { display:flex; align-items:center; justify-content:space-between; font-size:10px; font-weight:600; margin-bottom:5px; color:var(--sp-muted); }
                .snp-progress-pct  { font-family:'DM Serif Display',serif; font-size:0.9rem; }
                .snp-progress-track { width:100%; height:4px; background:var(--sp-border); border-radius:100px; overflow:hidden; }
                .snp-progress-fill  { height:100%; border-radius:100px; transition:width 0.5s ease; }

                /* Search */
                .snp-search-wrap { position:relative; }
                .snp-search-icon { position:absolute; left:9px; top:50%; transform:translateY(-50%); color:var(--sp-muted); pointer-events:none; }
                .snp-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; font-size:12px; padding:8px 10px 8px 30px; border:1px solid var(--sp-border); border-radius:9px; background:var(--sp-bg); color:var(--sp-text); outline:none; transition:border-color 0.15s,background 0.15s; }
                .snp-search:focus { border-color:var(--sp-accent); background:var(--sp-surface); box-shadow:0 0 0 3px var(--sp-accent-glow); }
                .snp-search::placeholder { color:var(--sp-muted); }

                /* Scroll area */
                .snp-sb-scroll { flex:1; overflow-y:auto; padding:8px 0 16px; scrollbar-width:thin; scrollbar-color:var(--sp-border) transparent; }
                .snp-sb-scroll::-webkit-scrollbar { width:4px; }
                .snp-sb-scroll::-webkit-scrollbar-thumb { background:var(--sp-border); border-radius:4px; }

                /* Course label */
                .snp-course-label { padding:8px 14px 5px; }
                .snp-course-badge { display:inline-flex; align-items:center; gap:5px; font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:3px 9px; border-radius:100px; background:var(--sp-active-bg); color:var(--sp-active-fg); border:1px solid var(--sp-border2); }

                /* Module toggle */
                .snp-module-btn  { display:flex; align-items:center; justify-content:space-between; width:100%; padding:8px 14px; border:none; background:transparent; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:600; color:var(--sp-subtext); transition:color 0.14s,background 0.14s; text-align:left; }
                .snp-module-btn:hover { background:var(--sp-hover); color:var(--sp-text); }
                .snp-module-left { display:flex; align-items:center; gap:7px; }
                .snp-module-chevron { color:var(--sp-muted); transition:transform 0.2s; flex-shrink:0; }
                .snp-module-chevron.open { transform:rotate(90deg); }
                .snp-module-progress { font-size:9px; font-weight:700; color:var(--sp-muted); background:var(--sp-hover); padding:2px 7px; border-radius:100px; flex-shrink:0; }
                .snp-module-progress.done { background:rgba(34,197,94,0.12); color:var(--sp-success); }

                /* Note items */
                .snp-note-item { display:flex; align-items:center; gap:8px; padding:8px 14px 8px 28px; cursor:pointer; border:none; background:transparent; width:100%; text-align:left; font-family:'Plus Jakarta Sans',sans-serif; transition:background 0.13s; border-right:3px solid transparent; }
                .snp-note-item:hover { background:var(--sp-hover); }
                .snp-note-item.active { background:var(--sp-active-bg); border-right-color:var(--sp-accent); }
                .snp-note-dot { width:16px; height:16px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:7px; }
                .snp-note-dot.read   { background:rgba(34,197,94,0.12); color:var(--sp-success); }
                .snp-note-dot.active { background:var(--sp-active-bg);  color:var(--sp-accent);  }
                .snp-note-dot.unread { background:var(--sp-hover);      color:var(--sp-muted);   }
                .snp-note-label { font-size:12px; line-height:1.4; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
                .snp-note-label.active { color:var(--sp-active-fg); font-weight:600; }
                .snp-note-label.read   { color:var(--sp-muted);     }
                .snp-note-label.unread { color:var(--sp-subtext);   }

                /* ══════════════════════════════════
                   TOPBAR (mobile menu trigger + breadcrumb)
                ══════════════════════════════════ */
                .snp-topbar {
                    position: sticky; top: 0; z-index: 10;
                    background: var(--sp-surface);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--sp-border);
                    padding: 10px 16px;
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;
                    flex-shrink: 0;
                }

                .snp-topbar-left  { display:flex; align-items:center; gap:10px; min-width:0; }
                .snp-topbar-right { display:flex; align-items:center; gap:6px; flex-shrink:0; }

                /* Hamburger button — visible on mobile, hidden on desktop */
                .snp-menu-btn {
                    width:32px; height:32px; border-radius:8px;
                    border:1px solid var(--sp-border); background:var(--sp-surface);
                    cursor:pointer; display:flex; align-items:center; justify-content:center;
                    color:var(--sp-subtext); flex-shrink:0;
                    transition:background 0.15s,color 0.15s;
                }
                .snp-menu-btn:hover { background:var(--sp-hover); color:var(--sp-accent); }

                /* Desktop toggle — show on md+ */
                .snp-desktop-toggle { display:flex; }
                @media (max-width: 768px) { .snp-desktop-toggle { display:none; } }
                @media (min-width: 769px) {
                    /* Mobile hamburger hidden on desktop — we reuse same btn but label changes */
                }

                .snp-breadcrumb { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--sp-muted); font-weight:400; min-width:0; }
                .snp-breadcrumb-cur { color:var(--sp-subtext); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }

                .snp-action-btns { display:flex; align-items:center; gap:6px; flex-shrink:0; }

                .snp-btn { font-family:'Plus Jakarta Sans',sans-serif; display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; padding:6px 12px; border-radius:8px; cursor:pointer; border:1px solid var(--sp-border); background:var(--sp-surface); color:var(--sp-muted); transition:all 0.15s; white-space:nowrap; }
                .snp-btn:hover      { background:var(--sp-hover); border-color:var(--sp-border2); color:var(--sp-accent); }
                .snp-btn.read       { background:rgba(34,197,94,0.12); border-color:rgba(34,197,94,0.25); color:var(--sp-success); }
                .snp-btn.read:hover { background:rgba(34,197,94,0.2); }

                /* Hide print btn label on mobile */
                .snp-btn-label { display:inline; }
                @media (max-width:480px) { .snp-btn-label { display:none; } }

                /* ══════════════════════════════════
                   MAIN CONTENT AREA
                ══════════════════════════════════ */
                .snp-main { flex:1; overflow-y:auto; display:flex; flex-direction:column; scrollbar-width:thin; scrollbar-color:var(--sp-border) transparent; min-width:0; }
                .snp-main::-webkit-scrollbar { width:4px; }
                .snp-main::-webkit-scrollbar-thumb { background:var(--sp-border); border-radius:4px; }

                /* Article */
                .snp-article { max-width:760px; margin:0 auto; padding:24px 20px 60px; width:100%; }
                @media(max-width:480px) { .snp-article { padding:18px 14px 48px; } }

                .snp-article-header { margin-bottom:24px; }
                .snp-article-module { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:3px 10px; border-radius:100px; background:var(--sp-active-bg); color:var(--sp-active-fg); border:1px solid var(--sp-border2); margin-bottom:10px; }
                .snp-article-title  { font-family:'DM Serif Display',serif; font-size:1.7rem; color:var(--sp-text); line-height:1.25; margin-bottom:10px; letter-spacing:-0.01em; }
                @media(max-width:480px) { .snp-article-title { font-size:1.35rem; } }
                .snp-article-meta   { display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:11px; color:var(--sp-muted); }
                .snp-article-meta-dot { width:3px; height:3px; border-radius:50%; background:var(--sp-border2); }
                .snp-article-read-badge { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; background:rgba(34,197,94,0.12); color:var(--sp-success); border:1px solid rgba(34,197,94,0.25); padding:2px 8px; border-radius:100px; }

                /* Article footer */
                .snp-article-footer { margin-top:40px; padding-top:16px; border-top:1px solid var(--sp-border); display:flex; align-items:center; justify-content:space-between; font-size:11px; color:var(--sp-muted); flex-wrap:wrap; gap:10px; }
                .snp-complete-btn   { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:9px; cursor:pointer; border:1px solid; transition:all 0.15s; }

                /* Mobile overlay */
                .snp-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.45); z-index:15; backdrop-filter:blur(2px); }
                @media(min-width:769px) { .snp-overlay { display:none !important; } }

                /* Empty state */
                .snp-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; text-align:center; padding:40px 20px; }
                .snp-empty-icon  { width:64px; height:64px; border-radius:18px; background:var(--sp-active-bg); display:flex; align-items:center; justify-content:center; color:var(--sp-accent); margin-bottom:16px; }
                .snp-empty-title { font-family:'DM Serif Display',serif; font-size:1.2rem; color:var(--sp-text); margin-bottom:6px; }
                .snp-empty-sub   { font-size:12px; color:var(--sp-muted); font-weight:300; max-width:240px; line-height:1.6; }
                .snp-empty-hint  { margin-top:16px; font-size:12px; font-weight:500; padding:8px 16px; border-radius:9px; background:var(--sp-active-bg); color:var(--sp-active-fg); border:1px solid var(--sp-border2); }

                /* Loader */
                .snp-loader      { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:12px; }
                .snp-spinner     { width:32px; height:32px; border:3px solid var(--sp-border); border-top-color:var(--sp-accent); border-radius:50%; animation:snpSpin 0.7s linear infinite; }
                .snp-loader-text { font-size:12px; color:var(--sp-muted); }

                /* Sidebar empty */
                .snp-sb-empty      { padding:32px 16px; text-align:center; }
                .snp-sb-empty-emoji{ font-size:28px; margin-bottom:8px; }
                .snp-sb-empty-text { font-size:11px; color:var(--sp-muted); line-height:1.55; }

                @media print { .snp-no-print { display:none !important; } }
            `}</style>

            <div className="snp-root">

                {/* Mobile overlay — click to close sidebar */}
                {sidebarOpen && (
                    <div className="snp-overlay snp-no-print" onClick={() => setSidebarOpen(false)} />
                )}

                {/* ══ SIDEBAR ══ */}
                <aside className={`snp-sidebar snp-no-print ${sidebarOpen ? "mobile-open" : ""}`}>

                    <div className="snp-sb-head">
                        <div className="snp-sb-top">
                            <div className="snp-sb-title">
                                <div className="snp-sb-title-icon"><BookOpen size={13}/></div>
                                Study Notes
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <div className="snp-sb-meta">{totalNotes} notes</div>
                                {/* Close btn — mobile */}
                                <button className="snp-sb-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                                    <X size={13}/>
                                </button>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="snp-progress-wrap">
                            <div className="snp-progress-row">
                                <span>{readCount}/{totalNotes} read</span>
                                <span className="snp-progress-pct" style={{ color: progressPct === 100 ? "var(--sp-success)" : "var(--sp-accent)" }}>
                                    {progressPct}%
                                </span>
                            </div>
                            <div className="snp-progress-track">
                                <div className="snp-progress-fill" style={{
                                    width:`${progressPct}%`,
                                    background: progressPct === 100
                                        ? "linear-gradient(90deg,var(--sp-success),#4ade80)"
                                        : "linear-gradient(90deg,var(--sp-accent),var(--sp-accent2))"
                                }}/>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="snp-search-wrap">
                            <Search size={12} className="snp-search-icon"/>
                            <input className="snp-search" type="text" placeholder="Search notes..."
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
                        </div>
                    </div>

                    {/* Scroll area */}
                    <div className="snp-sb-scroll">
                        {loading ? (
                            <div style={{ padding:"20px 14px", display:"flex", flexDirection:"column", gap:8 }}>
                                {[80,65,90,55].map((w, i) => (
                                    <div key={i} style={{ height:10, width:`${w}%`, background:"var(--sp-hover)", borderRadius:6, animation:"snpSkel 1.5s ease-in-out infinite" }}/>
                                ))}
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="snp-sb-empty">
                                <div className="snp-sb-empty-emoji">{searchQuery ? "🔍" : "📭"}</div>
                                <div className="snp-sb-empty-text">{searchQuery ? `No results for "${searchQuery}"` : "No notes available yet"}</div>
                            </div>
                        ) : filteredData.map(course => (
                            <div key={course.courseSlug}>
                                <div className="snp-course-label">
                                    <span className="snp-course-badge"><BookOpen size={8}/> {course.courseName}</span>
                                </div>
                                {course.modules.map(mod => {
                                    const key    = `${course.courseSlug}-${mod.moduleSlug}`;
                                    const isOpen = openModules.has(key);
                                    const modRead = mod.notes.filter(n => progress[n._id]).length;
                                    const modDone = modRead === mod.notes.length && mod.notes.length > 0;
                                    return (
                                        <div key={key}>
                                            <button className="snp-module-btn" onClick={() => toggleModule(key)}>
                                                <div className="snp-module-left">
                                                    <ChevronRight size={12} className={`snp-module-chevron ${isOpen ? "open" : ""}`}/>
                                                    {mod.moduleName}
                                                </div>
                                                <span className={`snp-module-progress ${modDone ? "done" : ""}`}>{modRead}/{mod.notes.length}</span>
                                            </button>
                                            {isOpen && mod.notes.map(note => {
                                                const isActive = selectedNote?._id === note._id;
                                                const isRead   = !!progress[note._id];
                                                const dotClass = isActive ? "active" : isRead ? "read" : "unread";
                                                return (
                                                    <button key={note._id} className={`snp-note-item ${isActive ? "active" : ""}`} onClick={() => loadNote(note)}>
                                                        <div className={`snp-note-dot ${dotClass}`}>{isRead ? "✓" : "●"}</div>
                                                        <span className={`snp-note-label ${dotClass}`} title={note.title}>{note.title}</span>
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

                    {/* Sticky topbar — always visible */}
                    <div className="snp-topbar snp-no-print">
                        <div className="snp-topbar-left">
                            {/* Sidebar toggle button */}
                            <button className="snp-menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle notes sidebar">
                                <BookOpen size={14}/>
                            </button>
                            {/* Breadcrumb — only shown when note selected */}
                            {selectedNote && noteMeta && (
                                <div className="snp-breadcrumb">
                                    <span style={{ whiteSpace:"nowrap", flexShrink:0 }}>{noteMeta.moduleName}</span>
                                    <ChevronRight size={11} style={{ flexShrink:0 }}/>
                                    <span className="snp-breadcrumb-cur">{noteTitle}</span>
                                </div>
                            )}
                        </div>

                        {selectedNote && !contentLoading && (
                            <div className="snp-action-btns">
                                <button
                                    className={`snp-btn ${selectedNote && progress[selectedNote._id] ? "read" : ""}`}
                                    onClick={() => {
                                        if (!selectedNote) return;
                                        setProgress(prev => {
                                            const next = { ...prev };
                                            if (next[selectedNote._id]) delete next[selectedNote._id];
                                            else next[selectedNote._id] = true;
                                            saveProgress(next); return next;
                                        });
                                    }}>
                                    <CheckCheck size={12}/>
                                    <span className="snp-btn-label">{selectedNote && progress[selectedNote._id] ? "Read ✓" : "Mark Read"}</span>
                                </button>
                                <button className="snp-btn"
                                    onClick={() => noteMeta && printNote(noteTitle, noteMeta.moduleName, noteContent)}>
                                    <Printer size={12}/>
                                    <span className="snp-btn-label">Print</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {!selectedNote ? (
                        <div className="snp-empty">
                            <div className="snp-empty-icon"><BookOpen size={28}/></div>
                            <div className="snp-empty-title">Select a note</div>
                            <div className="snp-empty-sub">Choose any topic from the sidebar to start reading</div>
                            {totalNotes > 0 && (
                                <div className="snp-empty-hint">
                                    {progressPct === 0
                                        ? `${totalNotes} notes available — let's start! 🚀`
                                        : `${readCount}/${totalNotes} complete — keep going! 🔥`}
                                </div>
                            )}
                            {/* On mobile, hint to open sidebar */}
                            <button className="snp-empty-hint snp-no-print" style={{ marginTop:8, cursor:"pointer", border:"none" }}
                                onClick={() => setSidebarOpen(true)}>
                                📚 Browse notes
                            </button>
                        </div>

                    ) : contentLoading ? (
                        <div className="snp-loader">
                            <div className="snp-spinner"/>
                            <span className="snp-loader-text">Loading note…</span>
                        </div>

                    ) : (
                        <div className="snp-fade-in" style={{ display:"flex", flexDirection:"column", flex:1 }}>
                            <article className="snp-article">
                                <div className="snp-article-header">
                                    <div className="snp-article-module"><BookOpen size={9}/> {noteMeta?.moduleName}</div>
                                    <div className="snp-article-title">{noteTitle}</div>
                                    <div className="snp-article-meta">
                                        {noteMeta && (
                                            <span>Updated {new Date(noteMeta.updatedAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>
                                        )}
                                        {selectedNote && progress[selectedNote._id] && (
                                            <>
                                                <div className="snp-article-meta-dot"/>
                                                <span className="snp-article-read-badge"><CheckCheck size={9}/> Completed</span>
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
                                                    <div style={{ position:"relative" }} className="snp-no-print">
                                                        <pre>{children}</pre>
                                                        <button
                                                            onClick={() => {
                                                                const text = (children as any)?.props?.children;
                                                                if (typeof text === "string") navigator.clipboard.writeText(text);
                                                            }}
                                                            style={{ position:"absolute", top:10, right:10, padding:"3px 8px", borderRadius:6, background:"rgba(255,255,255,0.1)", color:"#94a3b8", border:"none", cursor:"pointer", fontSize:10, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                                                            Copy
                                                        </button>
                                                    </div>
                                                );
                                            },
                                            table({ children }: any) {
                                                return <div style={{ overflowX:"auto", margin:"1rem 0" }}><table>{children}</table></div>;
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
                                            ? { background:"rgba(34,197,94,0.12)", color:"var(--sp-success)", borderColor:"rgba(34,197,94,0.25)" }
                                            : { background:"var(--sp-active-bg)", color:"var(--sp-active-fg)", borderColor:"var(--sp-border2)" }
                                        }
                                        onClick={() => {
                                            if (!selectedNote) return;
                                            const next = { ...progress, [selectedNote._id]: true };
                                            saveProgress(next); setProgress(next);
                                        }}>
                                        <CheckCheck size={13}/>
                                        {selectedNote && progress[selectedNote._id] ? "Note Complete!" : "Mark Complete"}
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