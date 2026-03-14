"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface Enquiry {
    _id: string; name: string; mobile: string; course: string;
    contactMethod: "Phone"|"WhatsApp"; message?: string;
    status: "new"|"contacted"|"converted"|"closed";
    isActive: boolean; createdAt?: string;
}

const STATUS_OPTIONS = ["new","contacted","converted","closed"];

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [search,    setSearch]    = useState("");
    const [page,      setPage]      = useState(1);
    const LIMIT = 10;

    useEffect(() => {
        fetch("/api/admin/enquiry", { credentials:"include" })
            .then(r=>r.json()).then(d=>setEnquiries(d.data||[]));
    }, []);

    const updateStatus = async (id: string, status: string) => {
        await fetch(`/api/admin/enquiry/${id}`, {
            method:"PATCH", credentials:"include",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ status }),
        });
        setEnquiries(prev => prev.map(e => e._id===id ? {...e, status:status as Enquiry["status"]} : e));
    };

    const filtered   = enquiries.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) || e.mobile.includes(search)
    );
    const totalPages = Math.ceil(filtered.length/LIMIT)||1;
    const paginated  = filtered.slice((page-1)*LIMIT, page*LIMIT);

    const counts = {
        new:       enquiries.filter(e=>e.status==="new").length,
        contacted: enquiries.filter(e=>e.status==="contacted").length,
        converted: enquiries.filter(e=>e.status==="converted").length,
        closed:    enquiries.filter(e=>e.status==="closed").length,
    };

    const statusStyle: Record<string,{bg:string,color:string,border:string}> = {
        new:       { bg:"rgba(96,165,250,.1)",  color:"#60a5fa", border:"rgba(96,165,250,.25)"  },
        contacted: { bg:"rgba(245,158,11,.1)",  color:"#f59e0b", border:"rgba(245,158,11,.25)"  },
        converted: { bg:"rgba(34,197,94,.1)",   color:"#22c55e", border:"rgba(34,197,94,.25)"   },
        closed:    { bg:"rgba(100,116,139,.1)", color:"#64748b", border:"rgba(100,116,139,.25)" },
    };

    return (
        <>
            <style>{aeStyles}</style>
            <div className="ae-root">

                {/* Header */}
                <div className="ae-header">
                    <div>
                        <h1 className="ae-title">Enquiries</h1>
                        <div className="ae-stats">
                            <span className="ae-stat blue">{counts.new} New</span>
                            <span className="ae-stat amber">{counts.contacted} Contacted</span>
                            <span className="ae-stat green">{counts.converted} Converted</span>
                            <span className="ae-stat muted">{counts.closed} Closed</span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="ae-search-wrap">
                    <Search size={13} className="ae-search-icon"/>
                    <input className="ae-search" placeholder="Search by name or mobile..."
                        value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}/>
                </div>

                {/* Table */}
                <div className="ae-table-wrap">
                    <table className="ae-table">
                        <thead className="ae-thead">
                            <tr>
                                <th>Name</th><th>Mobile</th><th>Course</th>
                                <th>Contact</th><th>Message</th><th>Status</th>
                                <th>Active</th><th>Date</th>
                            </tr>
                        </thead>
                        <tbody className="ae-tbody">
                            {paginated.length===0 ? (
                                <tr><td colSpan={8} className="ae-empty-row">
                                    <MessageSquare size={20} style={{ opacity:.3,marginBottom:8 }}/>
                                    <div>No enquiries found</div>
                                </td></tr>
                            ) : paginated.map(e => {
                                const ss = statusStyle[e.status] || statusStyle.new;
                                return (
                                    <tr key={e._id}>
                                        <td><span className="ae-name">{e.name}</span></td>
                                        <td><span className="ae-mono">{e.mobile}</span></td>
                                        <td><span className="ae-course">{e.course}</span></td>
                                        <td>
                                            <span className={`ae-contact-badge ${e.contactMethod==="WhatsApp"?"wa":"phone"}`}>
                                                {e.contactMethod}
                                            </span>
                                        </td>
                                        <td><span className="ae-message">{e.message||"—"}</span></td>
                                        <td>
                                            <select
                                                className="ae-status-select"
                                                style={{ background:ss.bg, color:ss.color, borderColor:ss.border }}
                                                value={e.status}
                                                onChange={ev => updateStatus(e._id, ev.target.value)}
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s} style={{ background:"#1a1a1a",color:"#f1f5f9" }}>
                                                        {s.charAt(0).toUpperCase()+s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`ae-active-badge ${e.isActive?"on":"off"}`}>
                                                {e.isActive?"Active":"Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="ae-date">
                                                {e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : "—"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="ae-pag">
                    <button className="ae-pag-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                        <ChevronLeft size={13}/> Prev
                    </button>
                    <span className="ae-pag-info">Page {page} of {totalPages}</span>
                    <button className="ae-pag-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>
                        Next <ChevronRight size={13}/>
                    </button>
                </div>
            </div>
        </>
    );
}

const aeStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .ae-root   { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:16px; }
    .ae-header { display:flex; align-items:flex-start; justify-content:space-between; }
    .ae-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .ae-stats  { display:flex; align-items:center; gap:8px; margin-top:5px; flex-wrap:wrap; }
    .ae-stat   { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; border:1px solid; }
    .ae-stat.blue  { background:var(--cp-accent-glow); color:var(--cp-accent); border-color:color-mix(in srgb,var(--cp-accent) 25%,transparent); }
    .ae-stat.amber { background:rgba(245,158,11,0.08); color:var(--cp-warning); border-color:rgba(245,158,11,0.2); }
    .ae-stat.green { background:rgba(34,197,94,0.08);  color:var(--cp-success); border-color:rgba(34,197,94,0.2);  }
    .ae-stat.muted { background:rgba(100,116,139,0.08);color:var(--cp-muted);   border-color:rgba(100,116,139,0.2);}

    .ae-search-wrap { position:relative; max-width:320px; }
    .ae-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--cp-muted); pointer-events:none; }
    .ae-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:9px; color:var(--cp-text); font-size:13px; outline:none; transition:border-color .15s; }
    .ae-search:focus { border-color:var(--cp-accent); }
    .ae-search::placeholder { color:var(--cp-muted); }

    .ae-table-wrap { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; overflow-x:auto; }
    .ae-table { width:100%; border-collapse:collapse; font-size:12.5px; min-width:700px; }
    .ae-thead tr { background:var(--cp-surface2); }
    .ae-thead th { padding:11px 14px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cp-muted); white-space:nowrap; }
    .ae-tbody tr { border-top:1px solid var(--cp-border); transition:background .12s; }
    .ae-tbody tr:hover { background:var(--cp-accent-glow); }
    .ae-tbody td { padding:11px 14px; vertical-align:middle; }

    .ae-name    { font-weight:600; color:var(--cp-text); }
    .ae-mono    { font-family:monospace; font-size:12px; color:var(--cp-subtext); }
    .ae-course  { font-size:12px; color:var(--cp-subtext); }
    .ae-message { font-size:11px; color:var(--cp-muted); display:block; max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ae-date    { font-size:11px; color:var(--cp-muted); }

    .ae-contact-badge { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; }
    .ae-contact-badge.wa    { background:rgba(34,197,94,0.1); color:var(--cp-success); border:1px solid rgba(34,197,94,0.2); }
    .ae-contact-badge.phone { background:var(--cp-accent-glow); color:var(--cp-accent); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); }

    .ae-status-select { font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:700; padding:3px 8px; border-radius:7px; border:1px solid; cursor:pointer; outline:none; }

    .ae-active-badge { font-size:10px; font-weight:700; padding:2px 9px; border-radius:100px; }
    .ae-active-badge.on  { background:rgba(34,197,94,0.1); color:var(--cp-success); border:1px solid rgba(34,197,94,0.2); }
    .ae-active-badge.off { background:rgba(239,68,68,0.1); color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.2); }

    .ae-empty-row { text-align:center; padding:48px 0 !important; color:var(--cp-muted); font-size:13px; }

    .ae-pag      { display:flex; align-items:center; justify-content:center; gap:10px; }
    .ae-pag-btn  { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .ae-pag-btn:hover:not(:disabled) { border-color:var(--cp-accent); color:var(--cp-accent); }
    .ae-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
    .ae-pag-info { font-size:12px; color:var(--cp-muted); }
`;