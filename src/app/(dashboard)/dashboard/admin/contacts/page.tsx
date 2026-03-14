"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Mail, CheckCircle2, Trash2, Phone } from "lucide-react";

interface ContactItem {
    _id: string; name: string; mobile: string; email?: string;
    message: string; status: "new"|"in-progress"|"resolved";
    isActive: boolean; createdAt?: string;
}

export default function AdminContacts() {
    const [contacts, setContacts] = useState<ContactItem[]>([]);
    const [search,   setSearch]   = useState("");
    const [page,     setPage]     = useState(1);
    const LIMIT = 10;

    const fetchContacts = async () => {
        const res = await fetch("/api/admin/contact", { credentials:"include" });
        setContacts((await res.json()).data||[]);
    };

    useEffect(() => { fetchContacts(); }, []);

    const markResolved = async (id: string) => {
        await fetch(`/api/admin/contact/${id}`, {
            method:"PATCH", credentials:"include",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ status:"resolved" }),
        });
        fetchContacts();
    };

    const deleteContact = async (id: string) => {
        if (!confirm("Delete this contact message?")) return;
        await fetch(`/api/admin/contact/${id}`, { method:"DELETE", credentials:"include" });
        fetchContacts();
    };

    const filtered   = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search)
    );
    const totalPages = Math.ceil(filtered.length/LIMIT)||1;
    const paginated  = filtered.slice((page-1)*LIMIT, page*LIMIT);

    const counts = {
        new:        contacts.filter(c=>c.status==="new").length,
        inProgress: contacts.filter(c=>c.status==="in-progress").length,
        resolved:   contacts.filter(c=>c.status==="resolved").length,
    };

    const statusStyle: Record<string,string> = {
        "new":         "blue",
        "in-progress": "amber",
        "resolved":    "green",
    };

    return (
        <>
            <style>{acStyles}</style>
            <div className="acn-root">

                {/* Header */}
                <div className="acn-header">
                    <div>
                        <h1 className="acn-title">Contact Messages</h1>
                        <div className="acn-stats">
                            <span className="acn-stat blue">{counts.new} New</span>
                            <span className="acn-stat amber">{counts.inProgress} In Progress</span>
                            <span className="acn-stat green">{counts.resolved} Resolved</span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="acn-search-wrap">
                    <Search size={13} className="acn-search-icon"/>
                    <input className="acn-search" placeholder="Search by name or mobile..."
                        value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}/>
                </div>

                {/* Table */}
                <div className="acn-table-wrap">
                    <table className="acn-table">
                        <thead className="acn-thead">
                            <tr>
                                <th>Name</th><th>Mobile</th><th>Email</th>
                                <th>Message</th><th>Status</th><th>Date</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="acn-tbody">
                            {paginated.length===0 ? (
                                <tr><td colSpan={7} className="acn-empty-row">No contact messages found</td></tr>
                            ) : paginated.map(c => (
                                <tr key={c._id}>
                                    <td><span className="acn-name">{c.name}</span></td>
                                    <td><span className="acn-mono">{c.mobile}</span></td>
                                    <td><span className="acn-email">{c.email||"—"}</span></td>
                                    <td><span className="acn-message">{c.message}</span></td>
                                    <td>
                                        <span className={`acn-status-badge ${statusStyle[c.status]||"blue"}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td><span className="acn-date">{c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "—"}</span></td>
                                    <td>
                                        <div style={{ display:"flex", gap:5 }}>
                                            {c.email && (
                                                <a href={`mailto:${c.email}`} className="acn-icon-btn blue" title="Reply via email">
                                                    <Mail size={11}/>
                                                </a>
                                            )}
                                            <a href={`tel:${c.mobile}`} className="acn-icon-btn amber" title="Call">
                                                <Phone size={11}/>
                                            </a>
                                            {c.status!=="resolved" && (
                                                <button className="acn-icon-btn success" onClick={()=>markResolved(c._id)} title="Mark resolved">
                                                    <CheckCircle2 size={11}/>
                                                </button>
                                            )}
                                            <button className="acn-icon-btn danger" onClick={()=>deleteContact(c._id)} title="Delete">
                                                <Trash2 size={11}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages>1 && (
                    <div className="acn-pag">
                        <button className="acn-pag-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                            <ChevronLeft size={13}/> Prev
                        </button>
                        <span className="acn-pag-info">Page {page} of {totalPages}</span>
                        <button className="acn-pag-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>
                            Next <ChevronRight size={13}/>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

const acStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .acn-root   { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }
    .acn-header { display:flex; align-items:flex-start; justify-content:space-between; }
    .acn-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .acn-stats  { display:flex; gap:8px; margin-top:5px; flex-wrap:wrap; }
    .acn-stat   { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; border:1px solid; }
    .acn-stat.blue  { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
    .acn-stat.amber { background:rgba(245,158,11,0.08); color:var(--cp-warning); border-color:rgba(245,158,11,0.2); }
    .acn-stat.green { background:rgba(34,197,94,0.08);  color:var(--cp-success); border-color:rgba(34,197,94,0.2);  }

    .acn-search-wrap { position:relative; max-width:320px; }
    .acn-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--cp-muted); pointer-events:none; }
    .acn-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:9px; color:var(--cp-text); font-size:13px; outline:none; transition:border-color .15s; }
    .acn-search:focus { border-color:var(--cp-accent); }
    .acn-search::placeholder { color:var(--cp-muted); }

    .acn-table-wrap { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; overflow-x:auto; }
    .acn-table { width:100%; border-collapse:collapse; font-size:12.5px; min-width:660px; }
    .acn-thead tr { background:var(--cp-surface2); }
    .acn-thead th { padding:11px 14px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cp-muted); white-space:nowrap; }
    .acn-tbody tr { border-top:1px solid var(--cp-border); transition:background .12s; }
    .acn-tbody tr:hover { background:var(--cp-accent-glow); }
    .acn-tbody td { padding:11px 14px; vertical-align:middle; }

    .acn-name    { font-weight:600; color:var(--cp-text); }
    .acn-mono    { font-family:monospace; font-size:12px; color:var(--cp-subtext); }
    .acn-email   { font-size:12px; color:var(--cp-muted); }
    .acn-message { font-size:11px; color:var(--cp-muted); display:block; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .acn-date    { font-size:11px; color:var(--cp-muted); }

    .acn-status-badge { font-size:10px; font-weight:700; padding:3px 9px; border-radius:100px; }
    .acn-status-badge.blue  { background:var(--cp-accent-glow); color:var(--cp-accent); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); }
    .acn-status-badge.amber { background:rgba(245,158,11,0.1); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.2); }
    .acn-status-badge.green { background:rgba(34,197,94,0.1);  color:var(--cp-success); border:1px solid rgba(34,197,94,0.2);  }

    .acn-icon-btn { width:27px; height:27px; border-radius:7px; border:1px solid; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; text-decoration:none; }
    .acn-icon-btn.blue    { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
    .acn-icon-btn.blue:hover    { background:color-mix(in srgb,var(--cp-accent) 20%,transparent); }
    .acn-icon-btn.amber   { background:rgba(245,158,11,0.08); color:var(--cp-warning); border-color:rgba(245,158,11,0.2); }
    .acn-icon-btn.amber:hover   { background:rgba(245,158,11,0.2); }
    .acn-icon-btn.success { background:rgba(34,197,94,0.08); color:var(--cp-success); border-color:rgba(34,197,94,0.2); }
    .acn-icon-btn.success:hover { background:rgba(34,197,94,0.2); }
    .acn-icon-btn.danger  { background:rgba(239,68,68,0.08); color:var(--cp-danger);  border-color:rgba(239,68,68,0.2); }
    .acn-icon-btn.danger:hover  { background:rgba(239,68,68,0.2); }

    .acn-empty-row { text-align:center; padding:40px 0 !important; color:var(--cp-muted); font-size:13px; }
    .acn-pag      { display:flex; align-items:center; justify-content:center; gap:10px; }
    .acn-pag-btn  { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .acn-pag-btn:hover:not(:disabled) { border-color:var(--cp-accent); color:var(--cp-accent); }
    .acn-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
    .acn-pag-info { font-size:12px; color:var(--cp-muted); }
`;