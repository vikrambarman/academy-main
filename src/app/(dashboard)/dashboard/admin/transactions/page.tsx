"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Search, ChevronLeft, ChevronRight, IndianRupee,
    Download, RefreshCw, FileText, X, Filter, TrendingUp,
    Users, Calendar, Receipt
} from "lucide-react";

/* ══════════════════════════════════════════════════
   STYLES  (defined first so JSX can reference txStyles)
══════════════════════════════════════════════════ */
const txStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

.tx-root  { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:16px; }
.tx-toast { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); }
.tx-toast.success { background:#166534; color:#bbf7d0; border:1px solid rgba(34,197,94,.3); }
.tx-toast.error   { background:#7f1d1d; color:#fecaca; border:1px solid rgba(239,68,68,.3); }

.tx-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.tx-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
.tx-sub    { font-size:12px; color:#475569; margin-top:3px; }

.tx-ghost-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; position:relative; }
.tx-ghost-btn:hover { border-color:#f59e0b; color:#f59e0b; }
.tx-filter-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; border-radius:50%; background:#f59e0b; }
.tx-amber-btn  { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; }
.tx-amber-btn:hover { opacity:.9; }
.tx-clear-btn  { display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:7px; border:1px solid rgba(239,68,68,.25); background:rgba(239,68,68,.07); color:#f87171; font-size:11px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; margin-top:4px; }
.tx-clear-btn:hover { background:rgba(239,68,68,.15); }

.tx-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
@media(max-width:700px){ .tx-kpi-row { grid-template-columns:repeat(2,1fr); } }
.tx-kpi { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:12px; }
.tx-kpi.green  { border-left:3px solid #22c55e; }
.tx-kpi.amber  { border-left:3px solid #f59e0b; }
.tx-kpi.blue   { border-left:3px solid #60a5fa; }
.tx-kpi.purple { border-left:3px solid #a78bfa; }
.tx-kpi-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.tx-kpi.green  .tx-kpi-icon { background:rgba(34,197,94,.1);   color:#22c55e; }
.tx-kpi.amber  .tx-kpi-icon { background:rgba(245,158,11,.1);  color:#f59e0b; }
.tx-kpi.blue   .tx-kpi-icon { background:rgba(96,165,250,.1);  color:#60a5fa; }
.tx-kpi.purple .tx-kpi-icon { background:rgba(167,139,250,.1); color:#a78bfa; }
.tx-kpi-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#475569; margin-bottom:4px; }
.tx-kpi-val   { font-family:'DM Serif Display',serif; font-size:1.25rem; color:#f1f5f9; }

.tx-filter-panel { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; padding:16px; }
.tx-filter-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:10px; }
.tx-filter-field { display:flex; flex-direction:column; gap:5px; }
.tx-filter-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }
.tx-input { font-family:'Plus Jakarta Sans',sans-serif; padding:8px 11px; font-size:12px; background:#111; border:1px solid #2a2a2a; border-radius:8px; color:#f1f5f9; outline:none; transition:border-color .15s; width:100%; }
.tx-input:focus { border-color:#f59e0b; }
.tx-input::placeholder { color:#334155; }
.tx-input option { background:#1a1a1a; }
.tx-search-wrap { position:relative; }
.tx-search-icon { position:absolute; left:9px; top:50%; transform:translateY(-50%); color:#475569; pointer-events:none; }

.tx-result-bar { display:flex; align-items:center; gap:8px; font-size:12px; color:#64748b; padding:8px 14px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:9px; }
.tx-result-sep { color:#334155; }

.tx-table-wrap { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; overflow-x:auto; }
.tx-table      { width:100%; border-collapse:collapse; font-size:12.5px; min-width:760px; }
.tx-thead tr   { background:#222; }
.tx-thead th   { padding:11px 14px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#475569; white-space:nowrap; }
.tx-tbody .tx-row { border-top:1px solid #1f1f1f; transition:background .12s; }
.tx-tbody .tx-row:hover { background:rgba(245,158,11,.03); }
.tx-tbody td   { padding:11px 14px; vertical-align:middle; }

.tx-receipt-no   { font-family:monospace; font-size:11px; color:#f59e0b; }
.tx-student-cell { display:flex; align-items:center; gap:9px; }
.tx-avatar       { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; flex-shrink:0; }
.tx-student-name { font-size:12.5px; font-weight:600; color:#f1f5f9; }
.tx-student-id   { font-size:10px; color:#475569; }
.tx-course       { font-size:12px; color:#94a3b8; }
.tx-date-cell    { display:flex; align-items:center; gap:5px; font-size:11px; color:#64748b; }
.tx-amount       { font-weight:700; color:#22c55e; font-size:13px; }
.tx-balance-cell { display:flex; flex-direction:column; gap:4px; min-width:80px; }
.tx-pending      { font-size:11px; color:#ef4444; font-weight:600; }
.tx-clear        { font-size:11px; color:#22c55e; font-weight:700; }
.tx-progress-bar { height:3px; background:#222; border-radius:100px; overflow:hidden; }
.tx-progress-fill{ height:100%; border-radius:100px; transition:width .3s; }
.tx-status-badge { font-size:10px; font-weight:700; padding:3px 9px; border-radius:100px; }
.tx-action-btn   { width:28px; height:28px; border-radius:7px; border:1px solid rgba(245,158,11,.2); background:rgba(245,158,11,.07); color:#f59e0b; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; }
.tx-action-btn:hover { background:rgba(245,158,11,.2); }

.tx-empty   { text-align:center; padding:48px 0 !important; color:#475569; font-size:13px; }
.tx-loading { display:flex; align-items:center; gap:10px; padding:40px; justify-content:center; color:#475569; font-size:13px; }
.tx-spinner { width:18px; height:18px; border:2px solid #2a2a2a; border-top-color:#f59e0b; border-radius:50%; animation:txSpin .7s linear infinite; }
@keyframes txSpin { to{ transform:rotate(360deg) } }

.tx-pag      { display:flex; align-items:center; justify-content:center; gap:10px; }
.tx-pag-btn  { display:flex; align-items:center; gap:4px; padding:6px 14px; border-radius:8px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:500; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
.tx-pag-btn:hover:not(:disabled) { border-color:#f59e0b; color:#f59e0b; }
.tx-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
.tx-pag-info { font-size:12px; color:#475569; }

.tx-overlay  { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
.tx-modal    { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:14px; width:100%; max-width:460px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.6); animation:txIn .18s ease; scrollbar-width:thin; scrollbar-color:#333 transparent; }
@keyframes txIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
.tx-modal-head  { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #2a2a2a; position:sticky; top:0; background:#1a1a1a; z-index:2; }
.tx-modal-title { font-family:'DM Serif Display',serif; font-size:1rem; color:#f1f5f9; }
.tx-modal-close { width:26px; height:26px; border-radius:7px; border:1px solid #2a2a2a; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#64748b; }
.tx-modal-close:hover { background:#222; color:#f1f5f9; }
.tx-modal-body   { padding:18px; display:flex; flex-direction:column; gap:14px; }
.tx-modal-footer { display:flex; justify-content:flex-end; gap:8px; }

.tx-receipt-card   { background:#111; border:1px solid #222; border-radius:12px; overflow:hidden; }
.tx-receipt-top    { display:flex; align-items:flex-start; justify-content:space-between; padding:18px; border-bottom:1px solid #1f1f1f; }
.tx-receipt-no-big { font-family:monospace; font-size:12px; color:#f59e0b; margin-bottom:6px; }
.tx-receipt-amount { font-family:'DM Serif Display',serif; font-size:1.8rem; color:#f1f5f9; }
.tx-receipt-badge  { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; padding:4px 10px; border-radius:100px; background:rgba(245,158,11,.12); color:#f59e0b; border:1px solid rgba(245,158,11,.2); white-space:nowrap; margin-top:4px; }
.tx-receipt-grid   { display:grid; grid-template-columns:1fr 1fr; }
.tx-receipt-cell   { padding:12px 18px; border-right:1px solid #1a1a1a; border-bottom:1px solid #1a1a1a; }
.tx-receipt-cell:nth-child(2n)        { border-right:none; }
.tx-receipt-cell:nth-last-child(-n+2) { border-bottom:none; }
.tx-rc-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#334155; margin-bottom:3px; }
.tx-rc-val   { font-size:12px; font-weight:600; color:#f1f5f9; }
.tx-receipt-fees   { padding:14px 18px; border-top:1px solid #1f1f1f; display:flex; flex-direction:column; gap:6px; }
.tx-fee-row        { display:flex; justify-content:space-between; font-size:12px; color:#64748b; }
.tx-fee-row.green     { color:#22c55e; }
.tx-fee-row.red       { color:#ef4444; }
.tx-fee-row.highlight { border-top:1px solid #222; margin-top:4px; padding-top:10px; font-weight:700; font-size:13px; color:#f59e0b; }
.tx-receipt-remark    { padding:10px 18px; background:rgba(245,158,11,.06); border-top:1px solid #1f1f1f; font-size:11px; color:#fbbf24; }
`;

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
interface Transaction {
    _id: string;
    receiptNo: string;
    studentName: string;
    studentId: string;
    studentEmail: string;
    courseName: string;
    courseId: string;
    enrollmentId: string;
    amount: number;
    date: string;
    remark: string;
    feesTotal: number;
    feesPaid: number;
    feesPending: number;
}

interface Summary {
    filteredCount: number;
    filteredAmount: number;
    allCount: number;
    allAmount: number;
    monthAmount: number;
    uniquePayers: number;
}

interface Course { _id: string; name: string; }

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const fmt     = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* ══════════════════════════════════════════════════
   PDF RECEIPT  (browser print → Save as PDF)
══════════════════════════════════════════════════ */
function downloadReceipt(t: Transaction, academyName = "Academy") {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Receipt ${t.receiptNo}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#fff;color:#0f172a;padding:48px;max-width:640px;margin:auto}
  .logo-row{display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:2px solid #f59e0b}
  .academy{font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-.02em}
  .receipt-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#f59e0b;background:#fffbeb;padding:4px 12px;border-radius:100px;border:1px solid #fde68a}
  .receipt-no{font-size:13px;color:#64748b;margin-top:24px;margin-bottom:4px;font-weight:600}
  .amount-hero{font-size:48px;font-weight:800;color:#0f172a;letter-spacing:-.03em;line-height:1;margin:8px 0 24px}
  .amount-hero span{font-size:28px;color:#f59e0b}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px}
  .info-cell{padding:14px 18px;border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0}
  .info-cell:nth-child(2n){border-right:none}
  .info-cell:nth-last-child(-n+2){border-bottom:none}
  .info-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin-bottom:4px}
  .info-val{font-size:13px;font-weight:600;color:#0f172a}
  .fee-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin-bottom:24px}
  .fee-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:13px;color:#475569}
  .fee-row.paid-total{color:#16a34a}
  .fee-row.pending{color:#ef4444}
  .fee-row.total{border-top:1px solid #e2e8f0;margin-top:6px;padding-top:12px;font-weight:700;font-size:14px;color:#0f172a}
  .remark-box{background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;font-size:12px;color:#92400e;margin-bottom:24px}
  .footer{text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:20px}
  .watermark{color:#f59e0b;font-weight:800;font-size:13px;margin-bottom:4px}
  @media print{body{padding:20px}}
</style>
</head>
<body>
  <div class="logo-row">
    <div class="academy">${academyName}</div>
    <div class="receipt-label">Fee Receipt</div>
  </div>
  <div class="receipt-no">${t.receiptNo}</div>
  <div class="amount-hero"><span>&#8377;</span>${t.amount.toLocaleString("en-IN")}</div>
  <div class="info-grid">
    <div class="info-cell"><div class="info-label">Student Name</div><div class="info-val">${t.studentName}</div></div>
    <div class="info-cell"><div class="info-label">Student ID</div><div class="info-val">${t.studentId}</div></div>
    <div class="info-cell"><div class="info-label">Course</div><div class="info-val">${t.courseName}</div></div>
    <div class="info-cell"><div class="info-label">Payment Date</div><div class="info-val">${fmtDate(t.date)}</div></div>
  </div>
  <div class="fee-box">
    <div class="fee-row"><span>Total Course Fees</span><span>${fmt(t.feesTotal)}</span></div>
    <div class="fee-row paid-total"><span>Total Paid (incl. this)</span><span>${fmt(t.feesPaid)}</span></div>
    <div class="fee-row pending"><span>Remaining Balance</span><span>${fmt(t.feesPending)}</span></div>
    <div class="fee-row total"><span>This Payment</span><span style="color:#f59e0b">${fmt(t.amount)}</span></div>
  </div>
  ${t.remark ? `<div class="remark-box">&#128221; ${t.remark}</div>` : ""}
  <div class="footer">
    <div class="watermark">${academyName}</div>
    <div>Yeh ek computer-generated receipt hai. Kisi hastakshar ki aavashyakta nahi.</div>
  </div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const LIMIT = 20;

export default function AdminTransactionsPage() {
    const [txns,       setTxns]       = useState<Transaction[]>([]);
    const [summary,    setSummary]    = useState<Summary | null>(null);
    const [courses,    setCourses]    = useState<Course[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [page,       setPage]       = useState(1);
    const [toast,      setToast]      = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [search,     setSearch]     = useState("");
    const [course,     setCourse]     = useState("");
    const [dateFrom,   setDateFrom]   = useState("");
    const [dateTo,     setDateTo]     = useState("");
    const [status,     setStatus]     = useState("all");
    const [showFilter, setShowFilter] = useState(false);
    const [preview,    setPreview]    = useState<Transaction | null>(null);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search)           params.set("search",   search);
            if (course)           params.set("course",   course);
            if (dateFrom)         params.set("dateFrom", dateFrom);
            if (dateTo)           params.set("dateTo",   dateTo);
            if (status !== "all") params.set("status",   status);

            const res  = await fetchWithAuth(`/api/admin/transactions?${params}`);
            const data = await res.json();
            setTxns(data.transactions || []);
            setSummary(data.summary   || null);
            setPage(1);
        } catch {
            showToast("Load failed", "error");
        } finally {
            setLoading(false);
        }
    }, [search, course, dateFrom, dateTo, status]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        fetchWithAuth("/api/admin/courses")
            .then((r) => r.json())
            .then((d) => setCourses(Array.isArray(d) ? d : []))
            .catch(() => {});
    }, []);

    const totalPages = Math.ceil(txns.length / LIMIT) || 1;
    const paginated  = txns.slice((page - 1) * LIMIT, page * LIMIT);
    const hasFilters = !!(search || course || dateFrom || dateTo || status !== "all");

    return (
        <>
            <style>{txStyles}</style>

            {toast && <div className={`tx-toast ${toast.type}`}>{toast.msg}</div>}

            <div className="tx-root">

                {/* Header */}
                <div className="tx-header">
                    <div>
                        <h1 className="tx-title">Transactions</h1>
                        <p className="tx-sub">Sabhi fee payments ka record</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="tx-ghost-btn" onClick={() => setShowFilter(f => !f)}>
                            <Filter size={13} />
                            Filters
                            {hasFilters && <span className="tx-filter-dot" />}
                        </button>
                        <button className="tx-ghost-btn" onClick={load}>
                            <RefreshCw size={13} />
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="tx-kpi-row">
                    <div className="tx-kpi green">
                        <div className="tx-kpi-icon"><IndianRupee size={15} /></div>
                        <div>
                            <div className="tx-kpi-label">Total Collected</div>
                            <div className="tx-kpi-val">{fmt(summary?.allAmount || 0)}</div>
                        </div>
                    </div>
                    <div className="tx-kpi amber">
                        <div className="tx-kpi-icon"><TrendingUp size={15} /></div>
                        <div>
                            <div className="tx-kpi-label">This Month</div>
                            <div className="tx-kpi-val">{fmt(summary?.monthAmount || 0)}</div>
                        </div>
                    </div>
                    <div className="tx-kpi blue">
                        <div className="tx-kpi-icon"><Receipt size={15} /></div>
                        <div>
                            <div className="tx-kpi-label">Total Transactions</div>
                            <div className="tx-kpi-val">{summary?.allCount || 0}</div>
                        </div>
                    </div>
                    <div className="tx-kpi purple">
                        <div className="tx-kpi-icon"><Users size={15} /></div>
                        <div>
                            <div className="tx-kpi-label">Unique Payers</div>
                            <div className="tx-kpi-val">{summary?.uniquePayers || 0}</div>
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilter && (
                    <div className="tx-filter-panel">
                        <div className="tx-filter-grid">
                            <div className="tx-filter-field">
                                <label className="tx-filter-label">Search</label>
                                <div className="tx-search-wrap">
                                    <Search size={12} className="tx-search-icon" />
                                    <input
                                        className="tx-input"
                                        style={{ paddingLeft: 30 }}
                                        placeholder="Name, ID, receipt no..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="tx-filter-field">
                                <label className="tx-filter-label">Course</label>
                                <select className="tx-input" value={course}
                                    onChange={(e) => setCourse(e.target.value)}>
                                    <option value="">All Courses</option>
                                    {courses.map((c) => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="tx-filter-field">
                                <label className="tx-filter-label">From Date</label>
                                <input className="tx-input" type="date" value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)} />
                            </div>
                            <div className="tx-filter-field">
                                <label className="tx-filter-label">To Date</label>
                                <input className="tx-input" type="date" value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)} />
                            </div>
                            <div className="tx-filter-field">
                                <label className="tx-filter-label">Payment Status</label>
                                <select className="tx-input" value={status}
                                    onChange={(e) => setStatus(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="paid">Fully Paid</option>
                                    <option value="partial">Partially Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                            </div>
                        </div>
                        {hasFilters && (
                            <button className="tx-clear-btn" onClick={() => {
                                setSearch(""); setCourse("");
                                setDateFrom(""); setDateTo(""); setStatus("all");
                            }}>
                                <X size={11} /> Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Result bar */}
                {hasFilters && summary && (
                    <div className="tx-result-bar">
                        <span>{summary.filteredCount} transactions</span>
                        <span className="tx-result-sep">·</span>
                        <span style={{ color: "#22c55e", fontWeight: 700 }}>
                            {fmt(summary.filteredAmount)} total
                        </span>
                    </div>
                )}

                {/* Table */}
                <div className="tx-table-wrap">
                    {loading ? (
                        <div className="tx-loading">
                            <div className="tx-spinner" />
                            <span>Loading…</span>
                        </div>
                    ) : (
                        <table className="tx-table">
                            <thead className="tx-thead">
                                <tr>
                                    <th>Receipt No.</th>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="tx-tbody">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="tx-empty">
                                            <FileText size={24} style={{ opacity: 0.2, marginBottom: 8 }} />
                                            <div>Koi transaction nahi mila</div>
                                        </td>
                                    </tr>
                                ) : paginated.map((t) => {
                                    const pctPaid     = t.feesTotal > 0 ? Math.round((t.feesPaid / t.feesTotal) * 100) : 100;
                                    const isPaid      = t.feesPending === 0;
                                    const isPartial   = t.feesPaid > 0 && t.feesPending > 0;
                                    const statusLabel = isPaid ? "Paid" : isPartial ? "Partial" : "Unpaid";
                                    const statusColor = isPaid ? "#22c55e" : isPartial ? "#f59e0b" : "#ef4444";
                                    const statusBg    = isPaid ? "rgba(34,197,94,.1)" : isPartial ? "rgba(245,158,11,.1)" : "rgba(239,68,68,.1)";

                                    return (
                                        <tr key={t._id} className="tx-row">
                                            <td>
                                                <span className="tx-receipt-no">{t.receiptNo}</span>
                                            </td>
                                            <td>
                                                <div className="tx-student-cell">
                                                    <div className="tx-avatar">
                                                        {t.studentName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="tx-student-name">{t.studentName}</div>
                                                        <div className="tx-student-id">{t.studentId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="tx-course">{t.courseName}</span>
                                            </td>
                                            <td>
                                                <div className="tx-date-cell">
                                                    <Calendar size={10} style={{ color: "#475569" }} />
                                                    <span>{fmtDate(t.date)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="tx-amount">{fmt(t.amount)}</span>
                                            </td>
                                            <td>
                                                <div className="tx-balance-cell">
                                                    <span className={t.feesPending > 0 ? "tx-pending" : "tx-clear"}>
                                                        {t.feesPending > 0 ? fmt(t.feesPending) : "Clear"}
                                                    </span>
                                                    <div className="tx-progress-bar">
                                                        <div className="tx-progress-fill"
                                                            style={{ width: `${pctPaid}%`, background: statusColor }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="tx-status-badge"
                                                    style={{ color: statusColor, background: statusBg }}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="tx-action-btn"
                                                    title="Receipt download"
                                                    onClick={() => setPreview(t)}>
                                                    <Download size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="tx-pag">
                        <button className="tx-pag-btn" disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}>
                            <ChevronLeft size={13} /> Prev
                        </button>
                        <span className="tx-pag-info">
                            {page} / {totalPages}
                            <span style={{ color: "#334155", marginLeft: 8 }}>({txns.length} total)</span>
                        </span>
                        <button className="tx-pag-btn" disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}>
                            Next <ChevronRight size={13} />
                        </button>
                    </div>
                )}

            </div>

            {/* Receipt Preview Modal */}
            {preview && (
                <div className="tx-overlay"
                    onClick={(e) => e.target === e.currentTarget && setPreview(null)}>
                    <div className="tx-modal">
                        <div className="tx-modal-head">
                            <span className="tx-modal-title">Receipt Preview</span>
                            <button className="tx-modal-close" onClick={() => setPreview(null)}>
                                <X size={13} />
                            </button>
                        </div>
                        <div className="tx-modal-body">

                            <div className="tx-receipt-card">
                                <div className="tx-receipt-top">
                                    <div>
                                        <div className="tx-receipt-no-big">{preview.receiptNo}</div>
                                        <div className="tx-receipt-amount">{fmt(preview.amount)}</div>
                                    </div>
                                    <div className="tx-receipt-badge">Fee Receipt</div>
                                </div>
                                <div className="tx-receipt-grid">
                                    <div className="tx-receipt-cell">
                                        <div className="tx-rc-label">Student</div>
                                        <div className="tx-rc-val">{preview.studentName}</div>
                                    </div>
                                    <div className="tx-receipt-cell">
                                        <div className="tx-rc-label">ID</div>
                                        <div className="tx-rc-val">{preview.studentId}</div>
                                    </div>
                                    <div className="tx-receipt-cell">
                                        <div className="tx-rc-label">Course</div>
                                        <div className="tx-rc-val">{preview.courseName}</div>
                                    </div>
                                    <div className="tx-receipt-cell">
                                        <div className="tx-rc-label">Date</div>
                                        <div className="tx-rc-val">{fmtDate(preview.date)}</div>
                                    </div>
                                </div>
                                <div className="tx-receipt-fees">
                                    <div className="tx-fee-row">
                                        <span>Total Fees</span>
                                        <span>{fmt(preview.feesTotal)}</span>
                                    </div>
                                    <div className="tx-fee-row green">
                                        <span>Paid</span>
                                        <span>{fmt(preview.feesPaid)}</span>
                                    </div>
                                    <div className="tx-fee-row red">
                                        <span>Pending</span>
                                        <span>{fmt(preview.feesPending)}</span>
                                    </div>
                                    <div className="tx-fee-row highlight">
                                        <span>This Payment</span>
                                        <span>{fmt(preview.amount)}</span>
                                    </div>
                                </div>
                                {preview.remark && (
                                    <div className="tx-receipt-remark">📝 {preview.remark}</div>
                                )}
                            </div>

                            <div className="tx-modal-footer">
                                <button className="tx-ghost-btn" onClick={() => setPreview(null)}>
                                    Cancel
                                </button>
                                <button className="tx-amber-btn" onClick={() => downloadReceipt(preview)}>
                                    <Download size={13} /> Download / Print PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}