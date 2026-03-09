"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Search, ChevronLeft, ChevronRight, Award,
    ExternalLink, Plus, X, Edit2, CheckCircle2, XCircle, Clock
} from "lucide-react";

type CertStatus = "issued" | "pending" | "revoked";

interface Certificate {
    _id: string;
    student: { _id: string; name: string; studentId: string };
    enrollment: { _id: string };
    course: { _id: string; name: string };
    certificateNo: string;
    authority: string;
    issueDate?: string;
    expiryDate?: string;
    verifyUrl?: string;
    status: CertStatus;
    remarks?: string;
}

const AUTH_META: Record<string, { color: string; bg: string; border: string }> = {
    "Drishti":    { color:"#60a5fa", bg:"rgba(96,165,250,.1)",  border:"rgba(96,165,250,.25)"  },
    "GSDM":       { color:"#22c55e", bg:"rgba(34,197,94,.1)",   border:"rgba(34,197,94,.25)"   },
    "NSDC":       { color:"#f59e0b", bg:"rgba(245,158,11,.1)",  border:"rgba(245,158,11,.25)"  },
    "DigiLocker": { color:"#a78bfa", bg:"rgba(167,139,250,.1)", border:"rgba(167,139,250,.25)" },
    "Other":      { color:"#94a3b8", bg:"rgba(100,116,139,.1)", border:"rgba(100,116,139,.25)" },
};

const STATUS_META: Record<CertStatus,{ label:string; color:string; bg:string }> = {
    issued:  { label:"Issued",  color:"#22c55e", bg:"rgba(34,197,94,.1)"   },
    pending: { label:"Pending", color:"#f59e0b", bg:"rgba(245,158,11,.1)"  },
    revoked: { label:"Revoked", color:"#ef4444", bg:"rgba(239,68,68,.1)"   },
};

const AUTHORITIES = ["Drishti","GSDM","NSDC","DigiLocker","Other"];

export default function AdminCertificatesPage() {
    const [certs,      setCerts]      = useState<Certificate[]>([]);
    const [students,   setStudents]   = useState<any[]>([]);
    const [search,     setSearch]     = useState("");
    const [filterAuth, setFilterAuth] = useState("all");
    const [filterStat, setFilterStat] = useState("all");
    const [page,       setPage]       = useState(1);
    const [modalOpen,  setModalOpen]  = useState(false);
    const [editCert,   setEditCert]   = useState<Certificate|null>(null);
    const [toast,      setToast]      = useState<{msg:string;type:"success"|"error"}|null>(null);
    const [saving,     setSaving]     = useState(false);
    const LIMIT = 15;

    const EMPTY_FORM = {
        studentId:"", enrollmentId:"", courseId:"",
        certificateNo:"", authority:"Drishti", issueDate:"",
        expiryDate:"", verifyUrl:"", status:"issued" as CertStatus, remarks:""
    };
    const [form, setForm] = useState(EMPTY_FORM);

    const showToast = (msg:string, type:"success"|"error") => {
        setToast({msg,type}); setTimeout(()=>setToast(null),3000);
    };

    const load = async () => {
        try {
            const res = await fetchWithAuth("/api/admin/certificates");
            const d   = await res.json();
            setCerts(d.certificates||[]);
        } catch { showToast("Load failed","error"); }
    };

    useEffect(() => {
        load();
        fetchWithAuth("/api/admin/students").then(r=>r.json()).then(setStudents);
    }, []);

    const handleStudentSelect = (sid: string) => {
        const s   = students.find(s=>s._id===sid);
        const enr = s?.enrollments?.[0];
        setForm(f=>({ ...f, studentId:sid, enrollmentId:enr?._id||"", courseId:enr?.course?._id||"" }));
    };

    const openCreate = () => {
        setEditCert(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    };

    const openEdit = (c: Certificate) => {
        setEditCert(c);
        setForm({
            studentId:     c.student?._id||"",
            enrollmentId:  c.enrollment?._id||"",
            courseId:      c.course?._id||"",
            certificateNo: c.certificateNo||"",
            authority:     c.authority||"Drishti",
            issueDate:     c.issueDate?.split("T")[0]||"",
            expiryDate:    c.expiryDate?.split("T")[0]||"",
            verifyUrl:     c.verifyUrl||"",
            status:        c.status||"issued",
            remarks:       c.remarks||"",
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.studentId||!form.enrollmentId) {
            showToast("Student aur enrollment required","error"); return;
        }
        if (!form.certificateNo.trim()) {
            showToast("Certificate number required","error"); return;
        }
        setSaving(true);
        try {
            if (editCert) {
                const res = await fetchWithAuth(`/api/admin/certificates/${editCert._id}`, {
                    method: "PATCH",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify(form),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.error||d.message);
                showToast("Certificate update ho gaya ✓","success");
            } else {
                const res = await fetchWithAuth("/api/admin/certificates", {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify(form),
                });
                const d = await res.json();
                if (!res.ok) throw new Error(d.error||d.message);
                showToast("Certificate record add ho gaya ✓","success");
            }
            setModalOpen(false);
            load();
        } catch(e:any) { showToast(e.message||"Error","error"); }
        finally { setSaving(false); }
    };

    // Filters
    const filtered = certs.filter(c => {
        const matchSearch = c.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
                            c.student?.studentId?.toLowerCase().includes(search.toLowerCase()) ||
                            c.certificateNo?.toLowerCase().includes(search.toLowerCase());
        const matchAuth   = filterAuth==="all" || c.authority===filterAuth;
        const matchStat   = filterStat==="all" || c.status===filterStat;
        return matchSearch && matchAuth && matchStat;
    });
    const totalPages = Math.ceil(filtered.length/LIMIT)||1;
    const paginated  = filtered.slice((page-1)*LIMIT, page*LIMIT);

    const counts = {
        issued:  certs.filter(c=>c.status==="issued").length,
        pending: certs.filter(c=>c.status==="pending").length,
        revoked: certs.filter(c=>c.status==="revoked").length,
    };

    return (
        <>
            <style>{acertStyles}</style>
            {toast && <div className={`acert-toast ${toast.type}`}>{toast.msg}</div>}
            <div className="acert-root">

                {/* Header */}
                <div className="acert-header">
                    <div>
                        <h1 className="acert-title">Certificates</h1>
                        <p className="acert-sub">Franchise-issued certificates ka record manage karo</p>
                    </div>
                    <button className="acert-add-btn" onClick={openCreate}>
                        <Plus size={13}/> Add Record
                    </button>
                </div>

                {/* KPIs */}
                <div className="acert-kpi-row">
                    <div className="acert-kpi amber">
                        <div className="acert-kpi-label">Total</div>
                        <div className="acert-kpi-val">{certs.length}</div>
                    </div>
                    <div className="acert-kpi green">
                        <div className="acert-kpi-label">Issued</div>
                        <div className="acert-kpi-val">{counts.issued}</div>
                    </div>
                    <div className="acert-kpi yellow">
                        <div className="acert-kpi-label">Pending</div>
                        <div className="acert-kpi-val">{counts.pending}</div>
                    </div>
                    <div className="acert-kpi red">
                        <div className="acert-kpi-label">Revoked</div>
                        <div className="acert-kpi-val">{counts.revoked}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="acert-filters">
                    <div className="acert-search-wrap">
                        <Search size={13} className="acert-search-icon"/>
                        <input className="acert-search" placeholder="Name, ID ya certificate no..."
                            value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
                    </div>
                    <select className="acert-filter-select" value={filterAuth}
                        onChange={e=>{setFilterAuth(e.target.value);setPage(1);}}>
                        <option value="all">All Authorities</option>
                        {AUTHORITIES.map(a=><option key={a} value={a}>{a}</option>)}
                    </select>
                    <select className="acert-filter-select" value={filterStat}
                        onChange={e=>{setFilterStat(e.target.value);setPage(1);}}>
                        <option value="all">All Status</option>
                        <option value="issued">Issued</option>
                        <option value="pending">Pending</option>
                        <option value="revoked">Revoked</option>
                    </select>
                </div>

                {/* Table */}
                <div className="acert-table-wrap">
                    <table className="acert-table">
                        <thead className="acert-thead">
                            <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Cert No.</th>
                                <th>Authority</th>
                                <th>Issue Date</th>
                                <th>Status</th>
                                <th>Verify</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="acert-tbody">
                            {paginated.length===0 ? (
                                <tr><td colSpan={8} className="acert-empty-row">
                                    <Award size={22} style={{opacity:.3,marginBottom:8}}/>
                                    <div>No certificates found</div>
                                </td></tr>
                            ) : paginated.map(c => {
                                const auth = AUTH_META[c.authority] || AUTH_META["Other"];
                                const stat = STATUS_META[c.status];
                                return (
                                    <tr key={c._id}>
                                        <td>
                                            <div className="acert-student-cell">
                                                <div className="acert-avatar">{c.student?.name?.charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <div className="acert-student-name">{c.student?.name}</div>
                                                    <div className="acert-student-id">{c.student?.studentId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="acert-course">{c.course?.name}</span></td>
                                        <td><span className="acert-certno">{c.certificateNo}</span></td>
                                        <td>
                                            <span className="acert-auth-badge"
                                                style={{color:auth.color,background:auth.bg,borderColor:auth.border}}>
                                                {c.authority}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="acert-date">
                                                {c.issueDate ? new Date(c.issueDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="acert-status-badge"
                                                style={{color:stat.color,background:stat.bg}}>
                                                {stat.label}
                                            </span>
                                        </td>
                                        <td>
                                            {c.verifyUrl ? (
                                                <a href={c.verifyUrl} target="_blank" rel="noreferrer"
                                                    className="acert-verify-link">
                                                    <ExternalLink size={11}/> Verify
                                                </a>
                                            ) : <span className="acert-na">—</span>}
                                        </td>
                                        <td>
                                            <button className="acert-icon-btn amber" onClick={()=>openEdit(c)}>
                                                <Edit2 size={11}/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {totalPages>1 && (
                    <div className="acert-pag">
                        <button className="acert-pag-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                            <ChevronLeft size={13}/> Prev
                        </button>
                        <span className="acert-pag-info">Page {page} of {totalPages}</span>
                        <button className="acert-pag-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>
                            Next <ChevronRight size={13}/>
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="acert-overlay" onClick={e=>e.target===e.currentTarget&&setModalOpen(false)}>
                    <div className="acert-modal">
                        <div className="acert-modal-head">
                            <span className="acert-modal-title">
                                {editCert ? "Edit Certificate Record" : "Add Certificate Record"}
                            </span>
                            <button className="acert-modal-close" onClick={()=>setModalOpen(false)}>
                                <X size={13}/>
                            </button>
                        </div>
                        <div className="acert-modal-body">

                            {!editCert && (
                                <>
                                    <div className="acert-field">
                                        <label className="acert-label">Student</label>
                                        <select className="acert-select" value={form.studentId}
                                            onChange={e=>handleStudentSelect(e.target.value)}>
                                            <option value="">-- Student chunno --</option>
                                            {students.map(s=>(
                                                <option key={s._id} value={s._id}>
                                                    {s.name} ({s.studentId})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {form.studentId && (
                                        <div className="acert-field">
                                            <label className="acert-label">Course / Enrollment</label>
                                            <select className="acert-select" value={form.enrollmentId}
                                                onChange={e=>{
                                                    const s=students.find(s=>s._id===form.studentId);
                                                    const enr=s?.enrollments?.find((en:any)=>en._id===e.target.value);
                                                    setForm(f=>({...f,enrollmentId:e.target.value,courseId:enr?.course?._id||""}));
                                                }}>
                                                <option value="">-- Course chunno --</option>
                                                {students.find(s=>s._id===form.studentId)?.enrollments?.map((e:any)=>(
                                                    <option key={e._id} value={e._id}>{e.course?.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="acert-form-grid">
                                <div className="acert-field">
                                    <label className="acert-label">Certificate No. *</label>
                                    <input className="acert-input" placeholder="e.g. DCE/2024/001"
                                        value={form.certificateNo}
                                        onChange={e=>setForm(f=>({...f,certificateNo:e.target.value}))}/>
                                </div>
                                <div className="acert-field">
                                    <label className="acert-label">Authority</label>
                                    <select className="acert-select" value={form.authority}
                                        onChange={e=>setForm(f=>({...f,authority:e.target.value}))}>
                                        {AUTHORITIES.map(a=><option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div className="acert-field">
                                    <label className="acert-label">Issue Date</label>
                                    <input className="acert-input" type="date" value={form.issueDate}
                                        onChange={e=>setForm(f=>({...f,issueDate:e.target.value}))}/>
                                </div>
                                <div className="acert-field">
                                    <label className="acert-label">Expiry Date</label>
                                    <input className="acert-input" type="date" value={form.expiryDate}
                                        onChange={e=>setForm(f=>({...f,expiryDate:e.target.value}))}/>
                                </div>
                            </div>

                            <div className="acert-field">
                                <label className="acert-label">Verify URL</label>
                                <input className="acert-input" placeholder="https://drishticce.com/verify/..."
                                    value={form.verifyUrl}
                                    onChange={e=>setForm(f=>({...f,verifyUrl:e.target.value}))}/>
                            </div>

                            <div className="acert-field">
                                <label className="acert-label">Status</label>
                                <div className="acert-status-radios">
                                    {(["issued","pending","revoked"] as CertStatus[]).map(s=>{
                                        const sm = STATUS_META[s];
                                        return (
                                            <div key={s}
                                                className={`acert-radio-btn ${form.status===s?"active":""}`}
                                                style={form.status===s?{borderColor:sm.color,background:sm.bg,color:sm.color}:{}}
                                                onClick={()=>setForm(f=>({...f,status:s}))}>
                                                {sm.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="acert-field">
                                <label className="acert-label">Remarks</label>
                                <input className="acert-input" placeholder="Optional note"
                                    value={form.remarks}
                                    onChange={e=>setForm(f=>({...f,remarks:e.target.value}))}/>
                            </div>

                            <div className="acert-modal-footer">
                                <button className="acert-ghost-btn" onClick={()=>setModalOpen(false)}>Cancel</button>
                                <button className="acert-amber-btn" onClick={handleSave} disabled={saving}>
                                    {saving?"Saving...":editCert?"Update Record":"Add Record"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const acertStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .acert-root  { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:16px; }
    .acert-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); }
    .acert-toast.success { background:#166534; color:#bbf7d0; border:1px solid rgba(34,197,94,.3); }
    .acert-toast.error   { background:#7f1d1d; color:#fecaca; border:1px solid rgba(239,68,68,.3); }

    .acert-header  { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .acert-title   { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .acert-sub     { font-size:12px; color:#475569; margin-top:3px; }
    .acert-add-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; transition:opacity .15s; white-space:nowrap; }
    .acert-add-btn:hover { opacity:.88; }

    .acert-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    @media(max-width:700px){ .acert-kpi-row { grid-template-columns:repeat(2,1fr); } }
    .acert-kpi { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:14px 16px; }
    .acert-kpi.amber  { border-left:3px solid #f59e0b; }
    .acert-kpi.green  { border-left:3px solid #22c55e; }
    .acert-kpi.yellow { border-left:3px solid #fbbf24; }
    .acert-kpi.red    { border-left:3px solid #ef4444; }
    .acert-kpi-label  { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; margin-bottom:6px; }
    .acert-kpi-val    { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#f1f5f9; }

    .acert-filters { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .acert-search-wrap  { position:relative; flex:1; min-width:200px; max-width:300px; }
    .acert-search-icon  { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#475569; pointer-events:none; }
    .acert-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:9px; color:#f1f5f9; font-size:13px; outline:none; transition:border-color .15s; }
    .acert-search:focus { border-color:#f59e0b; }
    .acert-search::placeholder { color:#475569; }
    .acert-filter-select { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:9px; color:#94a3b8; font-size:12px; outline:none; cursor:pointer; }
    .acert-filter-select:focus { border-color:#f59e0b; }
    .acert-filter-select option { background:#1a1a1a; }

    .acert-table-wrap { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; overflow-x:auto; }
    .acert-table { width:100%; border-collapse:collapse; font-size:12.5px; min-width:720px; }
    .acert-thead tr { background:#222; }
    .acert-thead th { padding:11px 14px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#475569; white-space:nowrap; }
    .acert-tbody tr { border-top:1px solid #1f1f1f; transition:background .12s; }
    .acert-tbody tr:hover { background:rgba(245,158,11,.03); }
    .acert-tbody td { padding:11px 14px; vertical-align:middle; }

    .acert-student-cell { display:flex; align-items:center; gap:9px; }
    .acert-avatar       { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; flex-shrink:0; }
    .acert-student-name { font-size:12.5px; font-weight:600; color:#f1f5f9; }
    .acert-student-id   { font-size:10px; color:#475569; }
    .acert-course  { font-size:12px; color:#94a3b8; }
    .acert-certno  { font-family:monospace; font-size:12px; color:#f59e0b; }
    .acert-date    { font-size:11px; color:#64748b; }
    .acert-na      { color:#334155; font-size:12px; }

    .acert-auth-badge   { font-size:10px; font-weight:700; padding:3px 9px; border-radius:100px; border:1px solid; }
    .acert-status-badge { font-size:10px; font-weight:700; padding:3px 9px; border-radius:100px; }

    .acert-verify-link { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:#60a5fa; text-decoration:none; padding:3px 8px; border-radius:7px; background:rgba(96,165,250,.08); border:1px solid rgba(96,165,250,.2); transition:all .13s; }
    .acert-verify-link:hover { background:rgba(96,165,250,.18); }

    .acert-icon-btn { width:27px; height:27px; border-radius:7px; border:1px solid; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; }
    .acert-icon-btn.amber { background:rgba(245,158,11,.08); color:#f59e0b; border-color:rgba(245,158,11,.2); }
    .acert-icon-btn.amber:hover { background:rgba(245,158,11,.2); }

    .acert-empty-row { text-align:center; padding:48px 0 !important; color:#475569; font-size:13px; }

    .acert-pag     { display:flex; align-items:center; justify-content:center; gap:10px; }
    .acert-pag-btn { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .acert-pag-btn:hover:not(:disabled) { border-color:#f59e0b; color:#f59e0b; }
    .acert-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
    .acert-pag-info { font-size:12px; color:#475569; }

    .acert-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .acert-modal   { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:14px; width:100%; max-width:500px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.6); scrollbar-width:thin; scrollbar-color:#333 transparent; animation:acertIn .18s ease; }
    @keyframes acertIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .acert-modal-head   { display:flex; align-items:center; justify-content:space-between; padding:15px 18px; border-bottom:1px solid #2a2a2a; position:sticky; top:0; background:#1a1a1a; z-index:2; }
    .acert-modal-title  { font-family:'DM Serif Display',serif; font-size:1.05rem; color:#f1f5f9; }
    .acert-modal-close  { width:26px; height:26px; border-radius:7px; border:1px solid #2a2a2a; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#64748b; }
    .acert-modal-close:hover { background:#222; color:#f1f5f9; }
    .acert-modal-body   { padding:18px; display:flex; flex-direction:column; gap:12px; }
    .acert-modal-footer { display:flex; justify-content:flex-end; gap:8px; }

    .acert-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .acert-field  { display:flex; flex-direction:column; gap:5px; }
    .acert-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }
    .acert-input, .acert-select { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px; background:#111; border:1px solid #2a2a2a; border-radius:8px; color:#f1f5f9; outline:none; transition:border-color .15s; width:100%; }
    .acert-input:focus,.acert-select:focus { border-color:#f59e0b; }
    .acert-input::placeholder { color:#334155; }
    .acert-select option { background:#1a1a1a; }

    .acert-status-radios { display:flex; gap:8px; flex-wrap:wrap; }
    .acert-radio-btn { padding:6px 16px; border-radius:8px; border:1px solid #2a2a2a; background:#111; color:#475569; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .acert-radio-btn:hover { border-color:#475569; color:#94a3b8; }

    .acert-amber-btn { padding:9px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; }
    .acert-amber-btn:disabled { opacity:.5; cursor:not-allowed; }
    .acert-ghost-btn { padding:9px 16px; border-radius:8px; border:1px solid #2a2a2a; background:transparent; color:#64748b; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
`;