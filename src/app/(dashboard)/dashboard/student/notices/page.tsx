"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Link from "next/link";
import {
    Bell, BookOpen, CheckCheck, ChevronLeft,
    ChevronRight, Tag, Clock, ExternalLink
} from "lucide-react";

interface Notice {
    _id: string; title: string; excerpt: string;
    slug: string; createdAt: string;
    category?: string; isRead: boolean;
}

const LIMIT = 10;

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
    exam:        { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    fee:         { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    holiday:     { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    result:      { bg: "#fefce8", color: "#92400e", border: "#fde68a" },
    admission:   { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
    general:     { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
};

function getCategoryStyle(cat?: string) {
    const key = cat?.toLowerCase() ?? "";
    return CATEGORY_COLORS[key] ?? CATEGORY_COLORS.general;
}

export default function StudentNotices() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [page,    setPage]    = useState(1);
    const [filter,  setFilter]  = useState<"all" | "unread" | "read">("all");
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
            await fetchWithAuth(`/api/student/notices/${id}/read`, { method: "POST" });
            setNotices(p => p.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch {}
        setMarking(null);
    };

    const markAllRead = async () => {
        const unread = notices.filter(n => !n.isRead);
        for (const n of unread) {
            await fetchWithAuth(`/api/student/notices/${n._id}/read`, { method: "POST" }).catch(() => {});
        }
        setNotices(p => p.map(n => ({ ...n, isRead: true })));
    };

    const filtered = notices.filter(n =>
        filter === "all" ? true : filter === "unread" ? !n.isRead : n.isRead
    );

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated  = filtered.slice((page - 1) * LIMIT, page * LIMIT);
    const unreadCount = notices.filter(n => !n.isRead).length;

    const categories = [...new Set(notices.map(n => n.category).filter(Boolean))] as string[];

    if (loading) return (
        <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, border: "3px solid #dbeafe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spSpin 0.7s linear infinite" }} />
            <style>{`@keyframes spSpin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading notices…</span>
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                .sn-root * { box-sizing: border-box; }
                .sn-root { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; }

                /* ── Page header ── */
                .sn-page-header {
                    display: flex; align-items: flex-start; justify-content: space-between;
                    gap: 12px; flex-wrap: wrap; margin-bottom: 20px;
                }

                .sn-page-title-wrap {}
                .sn-page-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 1.4rem; color: #0f172a;
                    display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
                }

                .sn-unread-badge {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 11px; font-weight: 700;
                    background: #2563eb; color: #fff;
                    padding: 3px 9px; border-radius: 100px;
                }

                .sn-page-sub { font-size: 13px; color: #64748b; font-weight: 300; }

                .sn-mark-all-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px; font-weight: 600; color: #2563eb;
                    background: #eff6ff; border: 1px solid #bfdbfe;
                    padding: 8px 14px; border-radius: 9px; cursor: pointer;
                    display: inline-flex; align-items: center; gap: 6px;
                    transition: background 0.15s; white-space: nowrap; flex-shrink: 0;
                }

                .sn-mark-all-btn:hover { background: #dbeafe; }
                .sn-mark-all-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* ── Filter bar ── */
                .sn-filter-bar {
                    display: flex; align-items: center; gap: 6px;
                    margin-bottom: 18px; flex-wrap: wrap;
                }

                .sn-filter-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px; font-weight: 600;
                    padding: 7px 14px; border-radius: 9px; cursor: pointer;
                    border: 1px solid #e0effe; background: #fff;
                    color: #64748b; transition: all 0.15s;
                    display: inline-flex; align-items: center; gap: 5px;
                }

                .sn-filter-btn:hover { background: #f0f9ff; border-color: #bfdbfe; color: #2563eb; }
                .sn-filter-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; }

                .sn-filter-count {
                    font-size: 10px; font-weight: 700;
                    background: rgba(255,255,255,0.2); padding: 1px 5px; border-radius: 100px;
                }

                .sn-filter-btn:not(.active) .sn-filter-count { background: #f0f9ff; color: #2563eb; }

                /* ── Notice list ── */
                .sn-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

                /* ── Notice card ── */
                .sn-card {
                    background: #fff; border: 1px solid #e0effe; border-radius: 14px;
                    overflow: hidden; transition: box-shadow 0.18s, border-color 0.18s;
                    position: relative;
                }

                .sn-card:hover { box-shadow: 0 4px 20px rgba(37,99,235,0.09); border-color: #bfdbfe; }

                .sn-card.unread {
                    background: #f8fbff; border-color: #bfdbfe;
                }

                /* unread left bar */
                .sn-card.unread::before {
                    content: ''; position: absolute;
                    left: 0; top: 0; bottom: 0; width: 3px;
                    background: linear-gradient(to bottom, #2563eb, #60a5fa);
                    border-radius: 14px 0 0 14px;
                }

                .sn-card-inner { padding: 18px 20px; }

                /* card top row */
                .sn-card-top {
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 10px; margin-bottom: 10px; flex-wrap: wrap;
                }

                .sn-card-top-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

                /* category tag */
                .sn-cat-tag {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
                    padding: 3px 10px; border-radius: 100px;
                }

                /* new dot */
                .sn-new-dot {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
                    background: #2563eb; color: #fff;
                    padding: 3px 9px; border-radius: 100px;
                    animation: snPulse 2s ease-in-out infinite;
                }

                @keyframes snPulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.7; }
                }

                /* date */
                .sn-card-date {
                    display: flex; align-items: center; gap: 4px;
                    font-size: 11px; color: #94a3b8; font-weight: 400;
                }

                /* title */
                .sn-card-title {
                    font-size: 14.5px; font-weight: 700; color: #0f172a;
                    line-height: 1.4; margin-bottom: 7px;
                }

                /* excerpt */
                .sn-card-excerpt {
                    font-size: 13px; font-weight: 300; color: #475569;
                    line-height: 1.7; margin-bottom: 14px;
                    display: -webkit-box; -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical; overflow: hidden;
                }

                /* actions */
                .sn-card-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

                .sn-read-link {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: 12px; font-weight: 700; color: #2563eb;
                    text-decoration: none; padding: 7px 14px;
                    background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;
                    transition: background 0.15s;
                }

                .sn-read-link:hover { background: #dbeafe; }

                .sn-mark-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px; font-weight: 500; color: #64748b;
                    background: none; border: none; cursor: pointer;
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 7px 10px; border-radius: 8px; transition: background 0.15s, color 0.15s;
                }

                .sn-mark-btn:hover { background: #f0f9ff; color: #2563eb; }
                .sn-mark-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                /* read indicator */
                .sn-read-indicator {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: 11px; font-weight: 500; color: #94a3b8;
                    margin-left: auto;
                }

                /* ── Empty ── */
                .sn-empty {
                    background: #fff; border: 1px solid #e0effe; border-radius: 14px;
                    padding: 48px 24px; text-align: center;
                }

                .sn-empty-icon { width: 48px; height: 48px; background: #eff6ff; border-radius: 13px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: #2563eb; }
                .sn-empty-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 5px; }
                .sn-empty-sub   { font-size: 12px; font-weight: 300; color: #94a3b8; }

                /* ── Pagination ── */
                .sn-pagination {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                }

                .sn-page-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    width: 34px; height: 34px; border-radius: 9px;
                    border: 1px solid #e0effe; background: #fff;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    color: #475569; font-size: 12px; font-weight: 600;
                    transition: all 0.15s;
                }

                .sn-page-btn:hover:not(:disabled) { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
                .sn-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .sn-page-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; }

                .sn-page-info { font-size: 12px; font-weight: 500; color: #64748b; padding: 0 4px; }

                @media (max-width: 560px) {
                    .sn-card-inner { padding: 14px 16px; }
                    .sn-card-title { font-size: 13.5px; }
                }
            `}</style>

            <div className="sn-root">

                {/* Page header */}
                <div className="sn-page-header">
                    <div className="sn-page-title-wrap">
                        <div className="sn-page-title">
                            <Bell size={20} style={{ color: "#2563eb" }} />
                            Notices
                            {unreadCount > 0 && <span className="sn-unread-badge">{unreadCount} new</span>}
                        </div>
                        <div className="sn-page-sub">Stay updated with important academy announcements.</div>
                    </div>

                    {unreadCount > 0 && (
                        <button className="sn-mark-all-btn" onClick={markAllRead}>
                            <CheckCheck size={13} /> Mark all as read
                        </button>
                    )}
                </div>

                {/* Filter bar */}
                <div className="sn-filter-bar">
                    {(["all", "unread", "read"] as const).map(f => {
                        const count = f === "all" ? notices.length : f === "unread" ? notices.filter(n => !n.isRead).length : notices.filter(n => n.isRead).length;
                        return (
                            <button
                                key={f}
                                className={`sn-filter-btn ${filter === f ? "active" : ""}`}
                                onClick={() => { setFilter(f); setPage(1); }}
                            >
                                {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
                                <span className="sn-filter-count">{count}</span>
                            </button>
                        );
                    })}

                    {categories.length > 0 && (
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                            {categories.slice(0, 4).map(cat => {
                                const cs = getCategoryStyle(cat);
                                return (
                                    <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 100, background: cs.bg, color: cs.color, border: `1px solid ${cs.border}` }}>
                                        <Tag size={8} /> {cat}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div className="sn-empty">
                        <div className="sn-empty-icon"><Bell size={20} /></div>
                        <div className="sn-empty-title">{filter === "unread" ? "All caught up!" : "No notices found"}</div>
                        <div className="sn-empty-sub">{filter === "unread" ? "You have no unread notices." : "No notices available at the moment."}</div>
                    </div>
                ) : (
                    <div className="sn-list">
                        {paginated.map(notice => {
                            const cs = getCategoryStyle(notice.category);
                            const dateStr = new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                            return (
                                <div key={notice._id} className={`sn-card ${!notice.isRead ? "unread" : ""}`}>
                                    <div className="sn-card-inner">

                                        {/* Top row */}
                                        <div className="sn-card-top">
                                            <div className="sn-card-top-left">
                                                {notice.category && (
                                                    <span className="sn-cat-tag" style={{ background: cs.bg, color: cs.color, border: `1px solid ${cs.border}` }}>
                                                        <Tag size={8} /> {notice.category}
                                                    </span>
                                                )}
                                                {!notice.isRead && (
                                                    <span className="sn-new-dot">
                                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <div className="sn-card-date">
                                                <Clock size={11} /> {dateStr}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div className="sn-card-title">{notice.title}</div>

                                        {/* Excerpt */}
                                        <div className="sn-card-excerpt">{notice.excerpt}</div>

                                        {/* Actions */}
                                        <div className="sn-card-actions">
                                            <Link
                                                href={`/notices/${notice.slug}`}
                                                className="sn-read-link"
                                                onClick={() => { if (!notice.isRead) markAsRead(notice._id); }}
                                            >
                                                <BookOpen size={12} /> Read Notice <ExternalLink size={10} />
                                            </Link>

                                            {!notice.isRead && (
                                                <button
                                                    className="sn-mark-btn"
                                                    onClick={() => markAsRead(notice._id)}
                                                    disabled={marking === notice._id}
                                                >
                                                    <CheckCheck size={13} />
                                                    {marking === notice._id ? "Marking…" : "Mark as read"}
                                                </button>
                                            )}

                                            {notice.isRead && (
                                                <span className="sn-read-indicator">
                                                    <CheckCheck size={12} style={{ color: "#16a34a" }} /> Read
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
                        <button className="sn-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                            <ChevronLeft size={14} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                            .reduce<(number | "…")[]>((acc, p, i, arr) => {
                                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, i) =>
                                p === "…"
                                    ? <span key={`e${i}`} className="sn-page-info">…</span>
                                    : <button key={p} className={`sn-page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
                            )
                        }

                        <button className="sn-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}