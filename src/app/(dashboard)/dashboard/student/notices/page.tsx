"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Link from "next/link";
import { Bell, BookOpen, CheckCheck, ChevronLeft, ChevronRight, Tag, Clock, ExternalLink } from "lucide-react";

interface Notice {
    _id: string; title: string; excerpt: string;
    slug: string; createdAt: string;
    category?: string; isRead: boolean;
}

const LIMIT = 10;

/* Category colors — using sp tokens where possible, else semantic colors */
const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
    exam:      { bg:"rgba(26,86,219,0.1)",  color:"var(--sp-accent2)",  border:"rgba(26,86,219,0.2)"  },
    fee:       { bg:"rgba(239,68,68,0.1)",  color:"var(--sp-danger)",   border:"rgba(239,68,68,0.2)"  },
    holiday:   { bg:"rgba(34,197,94,0.1)",  color:"var(--sp-success)",  border:"rgba(34,197,94,0.2)"  },
    result:    { bg:"rgba(245,158,11,0.1)", color:"var(--sp-warn)",     border:"rgba(245,158,11,0.2)" },
    admission: { bg:"rgba(168,85,247,0.1)", color:"#a855f7",            border:"rgba(168,85,247,0.2)" },
    general:   { bg:"var(--sp-hover)",      color:"var(--sp-subtext)",  border:"var(--sp-border)"     },
};

function getCategoryStyle(cat?: string) {
    return CATEGORY_COLORS[cat?.toLowerCase() ?? ""] ?? CATEGORY_COLORS.general;
}

export default function StudentNotices() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [page,    setPage]    = useState(1);
    const [filter,  setFilter]  = useState<"all"|"unread"|"read">("all");
    const [marking, setMarking] = useState<string | null>(null);

    useEffect(() => {
        fetchWithAuth("/api/student/notices")
            .then(r => r.json())
            .then(d => setNotices(d?.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const markAsRead = async (id: string) => {
        if (marking) return;
        setMarking(id);
        try {
            await fetchWithAuth(`/api/student/notices/${id}/read`, { method:"POST" });
            setNotices(p => p.map(n => n._id === id ? { ...n, isRead:true } : n));
        } catch {}
        setMarking(null);
    };

    const markAllRead = async () => {
        for (const n of notices.filter(n => !n.isRead)) {
            await fetchWithAuth(`/api/student/notices/${n._id}/read`, { method:"POST" }).catch(() => {});
        }
        setNotices(p => p.map(n => ({ ...n, isRead:true })));
    };

    const filtered    = notices.filter(n => filter === "all" ? true : filter === "unread" ? !n.isRead : n.isRead);
    const totalPages  = Math.ceil(filtered.length / LIMIT);
    const paginated   = filtered.slice((page - 1) * LIMIT, page * LIMIT);
    const unreadCount = notices.filter(n => !n.isRead).length;
    const categories  = [...new Set(notices.map(n => n.category).filter(Boolean))] as string[];

    if (loading) return (
        <div style={{ padding:"48px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div style={{ width:36, height:36, border:"3px solid var(--sp-border)", borderTopColor:"var(--sp-accent)", borderRadius:"50%", animation:"spSpin 0.7s linear infinite" }}/>
            <style>{`@keyframes spSpin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize:13, color:"var(--sp-muted)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Loading notices…</span>
        </div>
    );

    return (
        <>
            <style>{`
                .sn-root * { box-sizing:border-box; }
                .sn-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--sp-text); }

                .sn-page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:20px; }
                .sn-page-title  { font-family:'DM Serif Display',serif; font-size:1.4rem; color:var(--sp-text); display:flex; align-items:center; gap:10px; margin-bottom:4px; }
                .sn-page-sub    { font-size:13px; color:var(--sp-muted); font-weight:300; }

                .sn-unread-badge { font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:700; background:var(--sp-accent); color:#fff; padding:3px 9px; border-radius:100px; }

                .sn-mark-all-btn { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; color:var(--sp-accent); background:var(--sp-active-bg); border:1px solid var(--sp-border2); padding:8px 14px; border-radius:9px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:background 0.15s; white-space:nowrap; flex-shrink:0; }
                .sn-mark-all-btn:hover    { background:var(--sp-hover); }
                .sn-mark-all-btn:disabled { opacity:0.5; cursor:not-allowed; }

                /* Filter bar */
                .sn-filter-bar { display:flex; align-items:center; gap:6px; margin-bottom:18px; flex-wrap:wrap; }
                .sn-filter-btn { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; padding:7px 14px; border-radius:9px; cursor:pointer; border:1px solid var(--sp-border); background:var(--sp-surface); color:var(--sp-muted); transition:all 0.15s; display:inline-flex; align-items:center; gap:5px; }
                .sn-filter-btn:hover      { background:var(--sp-hover); border-color:var(--sp-border2); color:var(--sp-accent); }
                .sn-filter-btn.active     { background:var(--sp-accent); border-color:var(--sp-accent); color:#fff; }
                .sn-filter-count          { font-size:10px; font-weight:700; background:rgba(255,255,255,0.2); padding:1px 5px; border-radius:100px; }
                .sn-filter-btn:not(.active) .sn-filter-count { background:var(--sp-hover); color:var(--sp-accent); }

                /* Notice list */
                .sn-list { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }

                /* Notice card */
                .sn-card { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:14px; overflow:hidden; transition:box-shadow 0.18s,border-color 0.18s; position:relative; }
                .sn-card:hover     { box-shadow:0 4px 20px rgba(26,86,219,0.1); border-color:var(--sp-border2); }
                .sn-card.unread    { background:var(--sp-surface2); border-color:var(--sp-border2); }
                .sn-card.unread::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(to bottom,var(--sp-accent),var(--sp-accent2)); border-radius:14px 0 0 14px; }

                .sn-card-inner { padding:18px 20px; }
                .sn-card-top   { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
                .sn-card-top-left { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }

                .sn-cat-tag { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; padding:3px 10px; border-radius:100px; }

                .sn-new-dot { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; letter-spacing:0.06em; background:var(--sp-accent); color:#fff; padding:3px 9px; border-radius:100px; animation:snPulse 2s ease-in-out infinite; }
                @keyframes snPulse { 0%,100%{opacity:1} 50%{opacity:0.65} }

                .sn-card-date  { display:flex; align-items:center; gap:4px; font-size:11px; color:var(--sp-muted); }
                .sn-card-title { font-size:14.5px; font-weight:700; color:var(--sp-text); line-height:1.4; margin-bottom:7px; }
                .sn-card-excerpt { font-size:13px; font-weight:300; color:var(--sp-subtext); line-height:1.7; margin-bottom:14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

                .sn-card-actions { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
                .sn-read-link  { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:700; color:var(--sp-accent); text-decoration:none; padding:7px 14px; background:var(--sp-active-bg); border:1px solid var(--sp-border2); border-radius:8px; transition:background 0.15s; }
                .sn-read-link:hover { background:var(--sp-hover); }
                .sn-mark-btn  { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:500; color:var(--sp-muted); background:none; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px; padding:7px 10px; border-radius:8px; transition:background 0.15s,color 0.15s; }
                .sn-mark-btn:hover    { background:var(--sp-hover); color:var(--sp-accent); }
                .sn-mark-btn:disabled { opacity:0.4; cursor:not-allowed; }
                .sn-read-indicator { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:500; color:var(--sp-muted); margin-left:auto; }

                /* Empty */
                .sn-empty       { background:var(--sp-surface); border:1px solid var(--sp-border); border-radius:14px; padding:48px 24px; text-align:center; }
                .sn-empty-icon  { width:48px; height:48px; background:var(--sp-hover); border-radius:13px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--sp-accent); }
                .sn-empty-title { font-size:14px; font-weight:700; color:var(--sp-text); margin-bottom:5px; }
                .sn-empty-sub   { font-size:12px; font-weight:300; color:var(--sp-muted); }

                /* Pagination */
                .sn-pagination { display:flex; align-items:center; justify-content:center; gap:8px; }
                .sn-page-btn   { font-family:'Plus Jakarta Sans',sans-serif; width:34px; height:34px; border-radius:9px; border:1px solid var(--sp-border); background:var(--sp-surface); cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--sp-subtext); font-size:12px; font-weight:600; transition:all 0.15s; }
                .sn-page-btn:hover:not(:disabled) { background:var(--sp-hover); border-color:var(--sp-border2); color:var(--sp-accent); }
                .sn-page-btn:disabled { opacity:0.4; cursor:not-allowed; }
                .sn-page-btn.active   { background:var(--sp-accent); border-color:var(--sp-accent); color:#fff; }
                .sn-page-info  { font-size:12px; font-weight:500; color:var(--sp-muted); padding:0 4px; }

                @media (max-width:560px) { .sn-card-inner{padding:14px 16px;} .sn-card-title{font-size:13.5px;} }
            `}</style>

            <div className="sn-root">

                {/* Page header */}
                <div className="sn-page-header">
                    <div>
                        <div className="sn-page-title">
                            <Bell size={20} style={{ color:"var(--sp-accent)" }}/>
                            Notices
                            {unreadCount > 0 && <span className="sn-unread-badge">{unreadCount} new</span>}
                        </div>
                        <div className="sn-page-sub">Stay updated with important academy announcements.</div>
                    </div>
                    {unreadCount > 0 && (
                        <button className="sn-mark-all-btn" onClick={markAllRead}>
                            <CheckCheck size={13}/> Mark all as read
                        </button>
                    )}
                </div>

                {/* Filter bar */}
                <div className="sn-filter-bar">
                    {(["all","unread","read"] as const).map(f => {
                        const count = f === "all" ? notices.length : f === "unread" ? notices.filter(n => !n.isRead).length : notices.filter(n => n.isRead).length;
                        return (
                            <button key={f} className={`sn-filter-btn ${filter === f ? "active" : ""}`}
                                onClick={() => { setFilter(f); setPage(1); }}>
                                {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
                                <span className="sn-filter-count">{count}</span>
                            </button>
                        );
                    })}
                    {categories.length > 0 && (
                        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                            {categories.slice(0, 4).map(cat => {
                                const cs = getCategoryStyle(cat);
                                return (
                                    <span key={cat} style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", padding:"4px 10px", borderRadius:100, background:cs.bg, color:cs.color, border:`1px solid ${cs.border}` }}>
                                        <Tag size={8}/> {cat}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div className="sn-empty">
                        <div className="sn-empty-icon"><Bell size={20}/></div>
                        <div className="sn-empty-title">{filter === "unread" ? "All caught up!" : "No notices found"}</div>
                        <div className="sn-empty-sub">{filter === "unread" ? "You have no unread notices." : "No notices available at the moment."}</div>
                    </div>
                ) : (
                    <div className="sn-list">
                        {paginated.map(notice => {
                            const cs      = getCategoryStyle(notice.category);
                            const dateStr = new Date(notice.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
                            return (
                                <div key={notice._id} className={`sn-card ${!notice.isRead ? "unread" : ""}`}>
                                    <div className="sn-card-inner">
                                        <div className="sn-card-top">
                                            <div className="sn-card-top-left">
                                                {notice.category && (
                                                    <span className="sn-cat-tag" style={{ background:cs.bg, color:cs.color, border:`1px solid ${cs.border}` }}>
                                                        <Tag size={8}/> {notice.category}
                                                    </span>
                                                )}
                                                {!notice.isRead && (
                                                    <span className="sn-new-dot">
                                                        <span style={{ width:5, height:5, borderRadius:"50%", background:"#fff", flexShrink:0 }}/>
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <div className="sn-card-date"><Clock size={11}/> {dateStr}</div>
                                        </div>
                                        <div className="sn-card-title">{notice.title}</div>
                                        <div className="sn-card-excerpt">{notice.excerpt}</div>
                                        <div className="sn-card-actions">
                                            <Link href={`/notices/${notice.slug}`} className="sn-read-link"
                                                onClick={() => { if (!notice.isRead) markAsRead(notice._id); }}>
                                                <BookOpen size={12}/> Read Notice <ExternalLink size={10}/>
                                            </Link>
                                            {!notice.isRead && (
                                                <button className="sn-mark-btn" onClick={() => markAsRead(notice._id)} disabled={marking === notice._id}>
                                                    <CheckCheck size={13}/> {marking === notice._id ? "Marking…" : "Mark as read"}
                                                </button>
                                            )}
                                            {notice.isRead && (
                                                <span className="sn-read-indicator">
                                                    <CheckCheck size={12} style={{ color:"var(--sp-success)" }}/> Read
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="sn-pagination">
                        <button className="sn-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14}/></button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                            .reduce<(number|"…")[]>((acc, p, i, arr) => { if (i > 0 && p - (arr[i-1] as number) > 1) acc.push("…"); acc.push(p); return acc; }, [])
                            .map((p, i) => p === "…"
                                ? <span key={`e${i}`} className="sn-page-info">…</span>
                                : <button key={p} className={`sn-page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
                            )
                        }
                        <button className="sn-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14}/></button>
                    </div>
                )}
            </div>
        </>
    );
}