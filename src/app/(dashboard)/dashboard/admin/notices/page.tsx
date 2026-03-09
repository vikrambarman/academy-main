"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight, Bell } from "lucide-react";

export default function AdminNotices() {
    const [notices,  setNotices]  = useState<any[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [page,     setPage]     = useState(1);
    const LIMIT = 10;

    const fetchNotices = async () => {
        const res  = await fetch("/api/admin/notices", { credentials:"include" });
        const data = await res.json();
        setNotices(data.data || []);
        setLoading(false);
    };

    useEffect(() => { fetchNotices(); }, []);

    const togglePublish = async (id: string, current: boolean) => {
        await fetch(`/api/admin/notices/${id}`, {
            method:"PATCH", credentials:"include",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ isPublished: !current }),
        });
        fetchNotices();
    };

    const deleteNotice = async (id: string) => {
        if (!confirm("Delete this notice?")) return;
        await fetch(`/api/admin/notices/${id}`, { method:"DELETE", credentials:"include" });
        fetchNotices();
    };

    const totalPages = Math.ceil(notices.length / LIMIT) || 1;
    const paginated  = notices.slice((page-1)*LIMIT, page*LIMIT);

    const published = notices.filter(n => n.isPublished).length;
    const drafts    = notices.length - published;

    return (
        <>
            <style>{anStyles}</style>
            <div className="an-root">

                {/* Header */}
                <div className="an-header">
                    <div>
                        <h1 className="an-title">Notices</h1>
                        <div className="an-stats">
                            <span className="an-stat green">{published} Published</span>
                            <span className="an-stat amber">{drafts} Drafts</span>
                            <span className="an-stat muted">{notices.length} Total</span>
                        </div>
                    </div>
                    <Link href="/dashboard/admin/notices/create" className="an-add-btn">
                        <Plus size={14}/> Create Notice
                    </Link>
                </div>

                {loading ? (
                    <div className="an-loading">
                        <div className="an-spinner"/>
                        <span>Loading notices…</span>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="an-table-wrap">
                            <table className="an-table">
                                <thead className="an-thead">
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Views</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="an-tbody">
                                    {paginated.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="an-empty-row">
                                                <Bell size={22} style={{ opacity:.3, marginBottom:8 }}/>
                                                <div>No notices yet</div>
                                            </td>
                                        </tr>
                                    ) : paginated.map(notice => (
                                        <tr key={notice._id}>
                                            <td>
                                                <div className="an-notice-title">{notice.title}</div>
                                                {notice.excerpt && (
                                                    <div className="an-notice-excerpt">{notice.excerpt}</div>
                                                )}
                                            </td>
                                            <td>
                                                {notice.category && (
                                                    <span className="an-category-tag">{notice.category}</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`an-status-badge ${notice.isPublished ? "published" : "draft"}`}>
                                                    {notice.isPublished ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="an-views">{notice.views ?? 0}</span>
                                            </td>
                                            <td>
                                                <div className="an-actions">
                                                    <Link href={`/dashboard/admin/notices/edit/${notice._id}`} className="an-icon-btn amber" title="Edit">
                                                        <Edit2 size={12}/>
                                                    </Link>
                                                    <button
                                                        className={`an-icon-btn ${notice.isPublished ? "muted" : "success"}`}
                                                        onClick={() => togglePublish(notice._id, notice.isPublished)}
                                                        title={notice.isPublished ? "Unpublish" : "Publish"}
                                                    >
                                                        {notice.isPublished ? <EyeOff size={12}/> : <Eye size={12}/>}
                                                    </button>
                                                    <button className="an-icon-btn danger" onClick={() => deleteNotice(notice._id)} title="Delete">
                                                        <Trash2 size={12}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="an-pag">
                                <button className="an-pag-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>
                                    <ChevronLeft size={13}/> Prev
                                </button>
                                <span className="an-pag-info">Page {page} of {totalPages}</span>
                                <button className="an-pag-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>
                                    Next <ChevronRight size={13}/>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

const anStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display@display=swap');
    .an-root { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:20px; }

    .an-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
    .an-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .an-stats  { display:flex; align-items:center; gap:10px; margin-top:5px; flex-wrap:wrap; }
    .an-stat   { font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; border:1px solid; }
    .an-stat.green { background:rgba(34,197,94,.08); color:#22c55e; border-color:rgba(34,197,94,.2); }
    .an-stat.amber { background:rgba(245,158,11,.08); color:#f59e0b; border-color:rgba(245,158,11,.2); }
    .an-stat.muted { background:rgba(100,116,139,.08); color:#64748b; border-color:rgba(100,116,139,.2); }

    .an-add-btn {
        display:inline-flex; align-items:center; gap:7px;
        padding:9px 18px; border-radius:9px; border:none; cursor:pointer;
        font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
        background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208;
        text-decoration:none; transition:opacity .15s;
    }
    .an-add-btn:hover { opacity:.88; }

    .an-loading { display:flex; align-items:center; gap:12px; padding:40px 0; color:#475569; font-size:13px; }
    .an-spinner { width:20px; height:20px; border:2px solid #2a2a2a; border-top-color:#f59e0b; border-radius:50%; animation:anSpin .7s linear infinite; }
    @keyframes anSpin { to { transform:rotate(360deg); } }

    .an-table-wrap { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .an-table { width:100%; border-collapse:collapse; font-size:12.5px; min-width:560px; }
    .an-thead tr { background:#222; }
    .an-thead th { padding:11px 16px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#475569; white-space:nowrap; }
    .an-tbody tr { border-top:1px solid #1f1f1f; transition:background .12s; }
    .an-tbody tr:hover { background:rgba(245,158,11,.03); }
    .an-tbody td { padding:13px 16px; vertical-align:middle; }

    .an-notice-title   { font-weight:600; color:#f1f5f9; font-size:13px; margin-bottom:2px; }
    .an-notice-excerpt { font-size:11px; color:#475569; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:260px; }

    .an-category-tag {
        display:inline-block; font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px;
        background:rgba(96,165,250,.1); color:#60a5fa; border:1px solid rgba(96,165,250,.2);
    }

    .an-status-badge { display:inline-flex; align-items:center; font-size:10px; font-weight:700; padding:3px 10px; border-radius:100px; }
    .an-status-badge.published { background:rgba(34,197,94,.1); color:#22c55e; border:1px solid rgba(34,197,94,.2); }
    .an-status-badge.draft     { background:rgba(245,158,11,.1); color:#f59e0b; border:1px solid rgba(245,158,11,.2); }

    .an-views { font-size:12px; color:#64748b; font-weight:500; }

    .an-actions { display:flex; gap:5px; }
    .an-icon-btn { width:28px; height:28px; border-radius:7px; border:1px solid; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; text-decoration:none; }
    .an-icon-btn.amber   { background:rgba(245,158,11,.08); color:#f59e0b; border-color:rgba(245,158,11,.2); }
    .an-icon-btn.amber:hover { background:rgba(245,158,11,.2); }
    .an-icon-btn.success { background:rgba(34,197,94,.08); color:#22c55e; border-color:rgba(34,197,94,.2); }
    .an-icon-btn.success:hover { background:rgba(34,197,94,.2); }
    .an-icon-btn.muted   { background:rgba(100,116,139,.08); color:#64748b; border-color:rgba(100,116,139,.2); }
    .an-icon-btn.muted:hover { background:rgba(100,116,139,.18); }
    .an-icon-btn.danger  { background:rgba(239,68,68,.08); color:#ef4444; border-color:rgba(239,68,68,.2); }
    .an-icon-btn.danger:hover { background:rgba(239,68,68,.2); }

    .an-empty-row { text-align:center; padding:48px 0 !important; color:#475569; font-size:13px; display:flex; flex-direction:column; align-items:center; }
    td.an-empty-row { display:table-cell; }

    .an-pag { display:flex; align-items:center; justify-content:center; gap:10px; }
    .an-pag-btn { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .an-pag-btn:hover:not(:disabled) { border-color:#f59e0b; color:#f59e0b; }
    .an-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
    .an-pag-info { font-size:12px; color:#475569; }
`;