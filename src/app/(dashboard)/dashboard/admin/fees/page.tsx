"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Search, ChevronLeft, ChevronRight, IndianRupee,
    ChevronDown, ChevronUp, Plus, Edit2, X, CheckCircle2, AlertCircle
} from "lucide-react";

interface Payment {
    _id: string; amount: number; date: string;
    remark?: string; receiptNo?: string;
}
interface Enrollment {
    _id: string; feesTotal: number; feesPaid: number;
    course: { name: string }; payments: Payment[];
}
interface StudentFee {
    _id: string; studentId: string; name: string;
    phone: string; email: string;
    enrollments: Enrollment[];
}

export default function AdminFeesPage() {
    const [students,    setStudents]    = useState<StudentFee[]>([]);
    const [search,      setSearch]      = useState("");
    const [page,        setPage]        = useState(1);
    const [expanded,    setExpanded]    = useState<Set<string>>(new Set());
    const [payForms,    setPayForms]    = useState<Record<string, { amount:string; date:string; remark:string }>>({});
    const [editPayment, setEditPayment] = useState<Payment & { enrollmentId:string } | null>(null);
    const [editForm,    setEditForm]    = useState({ amount:"", date:"", remark:"" });
    const [toast,       setToast]       = useState<{ msg:string; type:"success"|"error" }|null>(null);
    const [saving,      setSaving]      = useState(false);
    const LIMIT = 15;

    const showToast = (msg: string, type: "success"|"error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = async () => {
        const res = await fetchWithAuth("/api/admin/students");
        setStudents(await res.json());
    };

    useEffect(() => { load(); }, []);

    const toggleExpand = (id: string) => setExpanded(p => {
        const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
    });

    const handlePayChange = (eid: string, field: string, value: string) =>
        setPayForms(p => ({ ...p, [eid]: { ...p[eid], [field]: value } }));

    const addPayment = async (eid: string) => {
        const f = payForms[eid] || {};
        if (!f.amount) { showToast("Amount enter karo", "error"); return; }
        setSaving(true);
        try {
            const res = await fetchWithAuth(`/api/admin/enrollments/${eid}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentAmount: Number(f.amount), remark: f.remark, date: f.date }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.message);
            setPayForms(p => ({ ...p, [eid]: { amount:"", date:"", remark:"" } }));
            showToast("Payment add ho gaya ✓", "success");
            load();
        } catch (e: any) { showToast(e.message || "Error", "error"); }
        finally { setSaving(false); }
    };

    const openEditPayment = (p: Payment, eid: string) => {
        setEditPayment({ ...p, enrollmentId: eid });
        setEditForm({ amount: String(p.amount), date: p.date?.split("T")[0] || "", remark: p.remark || "" });
    };

    const saveEditPayment = async () => {
        if (!editPayment) return;
        setSaving(true);
        try {
            const res = await fetchWithAuth(`/api/admin/payments/${editPayment._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(editForm.amount), date: editForm.date, remark: editForm.remark }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.message);
            setEditPayment(null);
            showToast("Payment update ho gaya ✓", "success");
            load();
        } catch (e: any) { showToast(e.message || "Error", "error"); }
        finally { setSaving(false); }
    };

    const filtered   = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.includes(search)
    );
    const totalPages = Math.ceil(filtered.length / LIMIT) || 1;
    const paginated  = filtered.slice((page-1)*LIMIT, page*LIMIT);

    // Summary stats
    const totalExpected  = students.reduce((s, st) => s + st.enrollments?.reduce((a, e) => a + (e.feesTotal||0), 0), 0);
    const totalCollected = students.reduce((s, st) => s + st.enrollments?.reduce((a, e) => a + (e.feesPaid||0), 0), 0);
    const totalPending   = totalExpected - totalCollected;

    const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

    return (
        <>
            <style>{afStyles}</style>

            {toast && <div className={`af-toast ${toast.type}`}>{toast.msg}</div>}

            <div className="af-root">

                {/* Header */}
                <div className="af-header">
                    <div>
                        <h1 className="af-title">Fee Management</h1>
                        <p className="af-sub">Student-wise fee records aur payments manage karo</p>
                    </div>
                </div>

                {/* Summary KPIs */}
                <div className="af-kpi-row">
                    <div className="af-kpi amber">
                        <div className="af-kpi-label">Total Expected</div>
                        <div className="af-kpi-val">{fmt(totalExpected)}</div>
                    </div>
                    <div className="af-kpi green">
                        <div className="af-kpi-label">Collected</div>
                        <div className="af-kpi-val">{fmt(totalCollected)}</div>
                    </div>
                    <div className="af-kpi red">
                        <div className="af-kpi-label">Pending</div>
                        <div className="af-kpi-val">{fmt(totalPending)}</div>
                    </div>
                    <div className="af-kpi muted">
                        <div className="af-kpi-label">Students</div>
                        <div className="af-kpi-val">{students.length}</div>
                    </div>
                </div>

                {/* Search */}
                <div className="af-search-wrap">
                    <Search size={13} className="af-search-icon" />
                    <input className="af-search" placeholder="Search by name, ID or phone..."
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>

                {/* Student fee list */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {paginated.length === 0 ? (
                        <div className="af-empty">No students found</div>
                    ) : paginated.map(student => {
                        const totalFees = student.enrollments?.reduce((a,e) => a+(e.feesTotal||0), 0) || 0;
                        const totalPaid = student.enrollments?.reduce((a,e) => a+(e.feesPaid||0), 0) || 0;
                        const due       = totalFees - totalPaid;
                        const pct       = totalFees > 0 ? Math.round((totalPaid/totalFees)*100) : 0;
                        const isOpen    = expanded.has(student._id);

                        return (
                            <div key={student._id} className="af-student-card">

                                {/* Row header — click to expand */}
                                <div className="af-student-row" onClick={() => toggleExpand(student._id)}>
                                    <div className="af-student-left">
                                        <div className="af-avatar">{student.name?.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div className="af-student-name">{student.name}</div>
                                            <div className="af-student-meta">{student.studentId} · {student.phone}</div>
                                        </div>
                                    </div>
                                    <div className="af-student-right">
                                        <div className="af-fee-summary">
                                            <span className="af-fee-paid">{fmt(totalPaid)}</span>
                                            <span className="af-fee-sep">/</span>
                                            <span className="af-fee-total">{fmt(totalFees)}</span>
                                            {due > 0 && <span className="af-fee-due">Due {fmt(due)}</span>}
                                        </div>
                                        <div className="af-mini-bar">
                                            <div className="af-mini-fill" style={{ width:`${pct}%` }}/>
                                        </div>
                                        <span className="af-pct" style={{ color: pct===100?"#22c55e":pct>50?"#f59e0b":"#ef4444" }}>
                                            {pct}%
                                        </span>
                                        {isOpen ? <ChevronUp size={14} style={{ color:"#475569" }}/> : <ChevronDown size={14} style={{ color:"#475569" }}/>}
                                    </div>
                                </div>

                                {/* Expanded: enrollments */}
                                {isOpen && (
                                    <div className="af-enrollments">
                                        {student.enrollments?.map(enr => {
                                            const ePct  = enr.feesTotal > 0 ? Math.round((enr.feesPaid/enr.feesTotal)*100) : 0;
                                            const eDue  = (enr.feesTotal||0) - (enr.feesPaid||0);
                                            const pf    = payForms[enr._id] || { amount:"", date:"", remark:"" };

                                            return (
                                                <div key={enr._id} className="af-enrollment-block">

                                                    {/* Course header */}
                                                    <div className="af-course-head">
                                                        <span className="af-course-name">{enr.course?.name}</span>
                                                        <span className="af-enr-stats">
                                                            <span style={{ color:"#22c55e" }}>{fmt(enr.feesPaid)}</span>
                                                            <span style={{ color:"#475569" }}> / {fmt(enr.feesTotal)}</span>
                                                            {eDue > 0 && <span style={{ color:"#ef4444", marginLeft:8 }}>Due {fmt(eDue)}</span>}
                                                        </span>
                                                    </div>

                                                    {/* Progress */}
                                                    <div className="af-prog-wrap">
                                                        <div className="af-prog-track">
                                                            <div className="af-prog-fill" style={{ width:`${ePct}%` }}/>
                                                        </div>
                                                        <span className="af-prog-pct">{ePct}%</span>
                                                    </div>

                                                    {/* Payment history */}
                                                    {enr.payments?.length > 0 && (
                                                        <div className="af-payment-list">
                                                            {enr.payments.map(p => (
                                                                <div key={p._id} className="af-payment-row">
                                                                    <div className="af-pay-left">
                                                                        <span className="af-pay-amt">{fmt(p.amount)}</span>
                                                                        <span className="af-pay-date">
                                                                            {new Date(p.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                                                                        </span>
                                                                        {p.remark && <span className="af-pay-remark">{p.remark}</span>}
                                                                        {p.receiptNo && <span className="af-pay-receipt">#{p.receiptNo}</span>}
                                                                    </div>
                                                                    <button className="af-icon-btn amber" onClick={() => openEditPayment(p, enr._id)}>
                                                                        <Edit2 size={11}/>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Add payment form */}
                                                    <div className="af-add-pay-form">
                                                        <div className="af-add-pay-label">Add Installment</div>
                                                        <div className="af-add-pay-row">
                                                            <input className="af-input" type="number" placeholder="Amount (₹)"
                                                                value={pf.amount} onChange={e => handlePayChange(enr._id,"amount",e.target.value)}/>
                                                            <input className="af-input" type="date"
                                                                value={pf.date} onChange={e => handlePayChange(enr._id,"date",e.target.value)}/>
                                                            <input className="af-input" placeholder="Remark (optional)"
                                                                value={pf.remark} onChange={e => handlePayChange(enr._id,"remark",e.target.value)}/>
                                                            <button className="af-green-btn" onClick={() => addPayment(enr._id)} disabled={saving}>
                                                                <Plus size={12}/> Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="af-pag">
                        <button className="af-pag-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                            <ChevronLeft size={13}/> Prev
                        </button>
                        <span className="af-pag-info">Page {page} of {totalPages}</span>
                        <button className="af-pag-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>
                            Next <ChevronRight size={13}/>
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Payment Modal */}
            {editPayment && (
                <div className="af-overlay" onClick={e => e.target===e.currentTarget && setEditPayment(null)}>
                    <div className="af-modal">
                        <div className="af-modal-head">
                            <span className="af-modal-title">Edit Payment</span>
                            <button className="af-modal-close" onClick={() => setEditPayment(null)}><X size={13}/></button>
                        </div>
                        <div className="af-modal-body">
                            <div className="af-field">
                                <label className="af-label">Amount (₹)</label>
                                <input className="af-input" type="number" value={editForm.amount} onChange={e=>setEditForm(f=>({...f,amount:e.target.value}))}/>
                            </div>
                            <div className="af-field">
                                <label className="af-label">Date</label>
                                <input className="af-input" type="date" value={editForm.date} onChange={e=>setEditForm(f=>({...f,date:e.target.value}))}/>
                            </div>
                            <div className="af-field">
                                <label className="af-label">Remark</label>
                                <input className="af-input" placeholder="Optional" value={editForm.remark} onChange={e=>setEditForm(f=>({...f,remark:e.target.value}))}/>
                            </div>
                            <div className="af-modal-footer">
                                <button className="af-ghost-btn" onClick={()=>setEditPayment(null)}>Cancel</button>
                                <button className="af-amber-btn" onClick={saveEditPayment} disabled={saving}>
                                    {saving?"Saving...":"Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const afStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

    .af-root  { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:16px; }
    .af-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); }
    .af-toast.success { background:#166534; color:#bbf7d0; border:1px solid rgba(34,197,94,.3); }
    .af-toast.error   { background:#7f1d1d; color:#fecaca; border:1px solid rgba(239,68,68,.3); }

    .af-header { display:flex; align-items:flex-start; justify-content:space-between; }
    .af-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .af-sub    { font-size:12px; color:#475569; margin-top:3px; }

    /* KPIs */
    .af-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    @media(max-width:700px){ .af-kpi-row { grid-template-columns:repeat(2,1fr); } }
    .af-kpi { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:14px 16px; }
    .af-kpi.amber { border-left:3px solid #f59e0b; }
    .af-kpi.green { border-left:3px solid #22c55e; }
    .af-kpi.red   { border-left:3px solid #ef4444; }
    .af-kpi.muted { border-left:3px solid #475569; }
    .af-kpi-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; margin-bottom:6px; }
    .af-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#f1f5f9; }

    /* Search */
    .af-search-wrap { position:relative; max-width:320px; }
    .af-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#475569; pointer-events:none; }
    .af-search { font-family:'Plus Jakarta Sans',sans-serif; width:100%; padding:9px 12px 9px 32px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:9px; color:#f1f5f9; font-size:13px; outline:none; transition:border-color .15s; }
    .af-search:focus { border-color:#f59e0b; }
    .af-search::placeholder { color:#475569; }

    /* Student card */
    .af-student-card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }

    .af-student-row { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; transition:background .13s; gap:12px; flex-wrap:wrap; }
    .af-student-row:hover { background:rgba(245,158,11,.04); }

    .af-student-left { display:flex; align-items:center; gap:12px; }
    .af-avatar { width:36px; height:36px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; }
    .af-student-name { font-size:13px; font-weight:700; color:#f1f5f9; }
    .af-student-meta { font-size:11px; color:#475569; margin-top:1px; }

    .af-student-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
    .af-fee-summary { display:flex; align-items:center; gap:4px; font-size:12px; }
    .af-fee-paid  { font-weight:700; color:#22c55e; }
    .af-fee-sep   { color:#334155; }
    .af-fee-total { color:#64748b; }
    .af-fee-due   { font-size:10px; font-weight:700; background:rgba(239,68,68,.1); color:#ef4444; border:1px solid rgba(239,68,68,.2); padding:2px 8px; border-radius:100px; margin-left:6px; }
    .af-mini-bar  { width:70px; height:4px; background:#222; border-radius:100px; overflow:hidden; }
    .af-mini-fill { height:100%; background:linear-gradient(90deg,#f59e0b,#22c55e); border-radius:100px; transition:width .4s ease; }
    .af-pct { font-size:11px; font-weight:700; }

    /* Enrollments block */
    .af-enrollments { border-top:1px solid #222; }
    .af-enrollment-block { padding:16px 18px; border-bottom:1px solid #1f1f1f; }
    .af-enrollment-block:last-child { border-bottom:none; }

    .af-course-head  { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; flex-wrap:wrap; gap:6px; }
    .af-course-name  { font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
    .af-enr-stats    { font-size:12px; }

    .af-prog-wrap  { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
    .af-prog-track { flex:1; height:5px; background:#222; border-radius:100px; overflow:hidden; }
    .af-prog-fill  { height:100%; background:linear-gradient(90deg,#f59e0b,#22c55e); border-radius:100px; transition:width .4s; }
    .af-prog-pct   { font-size:10px; font-weight:700; color:#64748b; flex-shrink:0; }

    /* Payment list */
    .af-payment-list { background:#111; border:1px solid #1f1f1f; border-radius:8px; overflow:hidden; margin-bottom:12px; }
    .af-payment-row  { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-bottom:1px solid #1a1a1a; transition:background .12s; }
    .af-payment-row:last-child { border-bottom:none; }
    .af-payment-row:hover { background:rgba(245,158,11,.03); }
    .af-pay-left    { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .af-pay-amt     { font-size:13px; font-weight:700; color:#22c55e; }
    .af-pay-date    { font-size:11px; color:#64748b; }
    .af-pay-remark  { font-size:11px; color:#475569; }
    .af-pay-receipt { font-size:10px; color:#334155; font-family:monospace; }

    /* Add payment form */
    .af-add-pay-form  { background:#111; border:1px solid #1f1f1f; border-radius:8px; padding:12px; }
    .af-add-pay-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#334155; margin-bottom:8px; }
    .af-add-pay-row   { display:flex; flex-wrap:wrap; gap:8px; align-items:flex-end; }
    .af-add-pay-row .af-input { flex:1; min-width:120px; }

    /* Inputs */
    .af-field { display:flex; flex-direction:column; gap:5px; }
    .af-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }
    .af-input { font-family:'Plus Jakarta Sans',sans-serif; padding:8px 11px; font-size:12px; background:#111; border:1px solid #2a2a2a; border-radius:8px; color:#f1f5f9; outline:none; transition:border-color .15s; width:100%; }
    .af-input:focus { border-color:#f59e0b; }
    .af-input::placeholder { color:#334155; }

    /* Buttons */
    .af-green-btn { display:inline-flex; align-items:center; gap:5px; padding:8px 14px; border-radius:8px; border:1px solid rgba(34,197,94,.3); background:rgba(34,197,94,.1); color:#22c55e; font-size:12px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; transition:all .14s; }
    .af-green-btn:hover { background:rgba(34,197,94,.2); }
    .af-green-btn:disabled { opacity:.5; cursor:not-allowed; }
    .af-amber-btn { padding:9px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; transition:opacity .15s; }
    .af-amber-btn:disabled { opacity:.5; cursor:not-allowed; }
    .af-ghost-btn { padding:9px 16px; border-radius:8px; border:1px solid #2a2a2a; background:transparent; color:#64748b; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
    .af-ghost-btn:hover { border-color:#475569; color:#94a3b8; }
    .af-icon-btn { width:26px; height:26px; border-radius:7px; border:1px solid; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; flex-shrink:0; }
    .af-icon-btn.amber { background:rgba(245,158,11,.08); color:#f59e0b; border-color:rgba(245,158,11,.2); }
    .af-icon-btn.amber:hover { background:rgba(245,158,11,.2); }

    /* Pagination */
    .af-pag     { display:flex; align-items:center; justify-content:center; gap:10px; }
    .af-pag-btn { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .af-pag-btn:hover:not(:disabled) { border-color:#f59e0b; color:#f59e0b; }
    .af-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
    .af-pag-info { font-size:12px; color:#475569; }

    .af-empty { background:#1a1a1a; border:1px dashed #2a2a2a; border-radius:12px; padding:40px; text-align:center; font-size:13px; color:#475569; }

    /* Modal */
    .af-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .af-modal   { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:14px; width:100%; max-width:400px; box-shadow:0 24px 60px rgba(0,0,0,.6); animation:afIn .18s ease; }
    @keyframes afIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .af-modal-head   { display:flex; align-items:center; justify-content:space-between; padding:15px 18px; border-bottom:1px solid #2a2a2a; }
    .af-modal-title  { font-family:'DM Serif Display',serif; font-size:1.05rem; color:#f1f5f9; }
    .af-modal-close  { width:26px; height:26px; border-radius:7px; border:1px solid #2a2a2a; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#64748b; }
    .af-modal-close:hover { background:#222; color:#f1f5f9; }
    .af-modal-body   { padding:18px; display:flex; flex-direction:column; gap:12px; }
    .af-modal-footer { display:flex; justify-content:flex-end; gap:8px; }
`;