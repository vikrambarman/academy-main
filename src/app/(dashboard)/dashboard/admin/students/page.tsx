"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Search, Plus, X, ChevronLeft, ChevronRight,
    CheckCircle2, XCircle, Eye
} from "lucide-react";

interface Course { _id: string; name: string; isActive: boolean; }

const EMPTY_FORM = {
    name:"", fatherName:"", email:"", phone:"",
    dob:"", admissionDate:"", gender:"",
    qualification:"", address:"", courseId:"", feesTotal:"",
};

export default function AdminStudents() {
    const [courses,    setCourses]    = useState<Course[]>([]);
    const [students,   setStudents]   = useState<any[]>([]);
    const [search,     setSearch]     = useState("");
    const [modalOpen,  setModalOpen]  = useState(false);
    const [loading,    setLoading]    = useState(false);
    const [newStudent, setNewStudent] = useState<{ studentId:string; tempPassword:string }|null>(null);
    const [page,       setPage]       = useState(1);
    const [form,       setForm]       = useState(EMPTY_FORM);
    const LIMIT = 10;

    const fetchCourses  = async () => {
        const r = await fetchWithAuth("/api/admin/courses");
        const d = await r.json();
        setCourses(d.filter((c: Course) => c.isActive));
    };
    const fetchStudents = async () => {
        const r = await fetchWithAuth("/api/admin/students");
        setStudents(await r.json());
    };

    useEffect(() => { fetchCourses(); fetchStudents(); }, []);
    useEffect(() => {
        if (!newStudent) return;
        const t = setTimeout(() => setNewStudent(null), 60000);
        return () => clearTimeout(t);
    }, [newStudent]);

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await fetchWithAuth("/api/admin/students", {
                method:"POST", headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ ...form, feesTotal: Number(form.feesTotal) }),
            });
            const data = await res.json();
            if (!res.ok) { alert(data.message); return; }
            setNewStudent(data.data);
            setForm(EMPTY_FORM);
            setModalOpen(false);
            fetchStudents();
        } catch { alert("Server error"); }
        finally { setLoading(false); }
    };

    const filtered   = students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / LIMIT) || 1;
    const paginated  = filtered.slice((page-1)*LIMIT, page*LIMIT);

    const calcFees = (s: any) => {
        const total = s.enrollments?.reduce((n: number, e: any) => n + (e.feesTotal||0), 0) || 0;
        const paid  = s.enrollments?.reduce((n: number, e: any) => n + (e.feesPaid ||0), 0) || 0;
        return { total, paid, due: total - paid };
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

                .ast-root { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:20px; }

                .ast-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
                .ast-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }

                /* Credential banner */
                .ast-cred { background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.25); border-radius:10px; padding:14px 18px; display:flex; flex-direction:column; gap:4px; }
                .ast-cred-title { font-size:12px; font-weight:700; color:var(--cp-success); margin-bottom:4px; }
                .ast-cred-row   { font-size:12px; color:var(--cp-subtext); }
                .ast-cred-row strong { color:var(--cp-text); }
                .ast-cred-note  { font-size:10px; color:var(--cp-muted); margin-top:2px; }

                /* Search */
                .ast-search-wrap { position:relative; max-width:320px; }
                .ast-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--cp-muted); pointer-events:none; }
                .ast-search {
                    font-family:'Plus Jakarta Sans',sans-serif;
                    width:100%; padding:9px 12px 9px 34px;
                    background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:9px;
                    color:var(--cp-text); font-size:13px; outline:none; transition:border-color .15s;
                }
                .ast-search:focus { border-color:var(--cp-accent); }
                .ast-search::placeholder { color:var(--cp-muted); }

                /* Table */
                .ast-table-wrap { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
                .ast-table { width:100%; border-collapse:collapse; font-size:12.5px; }
                .ast-thead tr { background:var(--cp-surface2); border-bottom:1px solid var(--cp-border); }
                .ast-thead th { padding:11px 14px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cp-muted); white-space:nowrap; }
                .ast-tbody tr { border-bottom:1px solid var(--cp-border); transition:background .12s; }
                .ast-tbody tr:last-child { border-bottom:none; }
                .ast-tbody tr:hover { background:var(--cp-accent-glow); }
                .ast-tbody td { padding:12px 14px; vertical-align:middle; }

                .ast-id   { font-family:monospace; font-size:11px; color:var(--cp-muted); }
                .ast-name { font-weight:600; color:var(--cp-text); }
                .ast-sub  { font-size:10px; color:var(--cp-muted); margin-top:1px; }

                .ast-course-tag {
                    display:inline-flex; align-items:center;
                    font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px;
                    background:var(--cp-accent-glow); color:var(--cp-accent);
                    border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent);
                    margin:2px 2px 0 0;
                }

                .ast-fee-paid  { font-size:12px; font-weight:600; color:var(--cp-success); }
                .ast-fee-total { font-size:10px; color:var(--cp-muted); }
                .ast-fee-due   { font-size:12px; font-weight:700; color:var(--cp-danger); }

                .ast-badge { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; padding:3px 9px; border-radius:100px; }
                .ast-badge.active    { background:rgba(34,197,94,0.1);  color:var(--cp-success); border:1px solid rgba(34,197,94,0.2);  }
                .ast-badge.inactive  { background:rgba(239,68,68,0.1);  color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.2);  }
                .ast-badge.completed { background:rgba(34,197,94,0.1);  color:var(--cp-success); border:1px solid rgba(34,197,94,0.2);  }
                .ast-badge.dropped   { background:rgba(245,158,11,0.1); color:var(--cp-warning); border:1px solid rgba(245,158,11,0.2); }
                .ast-badge.course-active { background:var(--cp-accent-glow); color:var(--cp-accent); border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent); }

                .ast-view-btn {
                    display:inline-flex; align-items:center; gap:5px;
                    font-size:11px; font-weight:600; padding:5px 11px; border-radius:7px;
                    background:var(--cp-accent-glow); color:var(--cp-accent);
                    border:1px solid color-mix(in srgb,var(--cp-accent) 25%,transparent);
                    text-decoration:none; transition:background .14s;
                }
                .ast-view-btn:hover { background:color-mix(in srgb,var(--cp-accent) 20%,transparent); }

                /* Pagination */
                .ast-pag { display:flex; align-items:center; justify-content:center; gap:10px; }
                .ast-pag-btn {
                    display:flex; align-items:center; gap:4px;
                    padding:6px 14px; border-radius:8px; border:1px solid var(--cp-border);
                    background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:500;
                    cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s;
                }
                .ast-pag-btn:hover:not(:disabled) { border-color:var(--cp-accent); color:var(--cp-accent); }
                .ast-pag-btn:disabled { opacity:.35; cursor:not-allowed; }
                .ast-pag-info { font-size:12px; color:var(--cp-muted); }

                /* Add button */
                .ast-add-btn {
                    display:inline-flex; align-items:center; gap:7px;
                    padding:9px 18px; border-radius:9px; border:none; cursor:pointer;
                    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
                    background:var(--cp-accent); color:#fff;
                    transition:opacity .15s, transform .15s;
                }
                .ast-add-btn:hover { opacity:.88; transform:translateY(-1px); }

                /* Modal */
                .ast-modal-overlay {
                    position:fixed; inset:0; background:rgba(0,0,0,.7);
                    backdrop-filter:blur(4px); z-index:60;
                    display:flex; align-items:center; justify-content:center; padding:16px;
                }
                .ast-modal {
                    background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:16px;
                    width:100%; max-width:680px; max-height:90vh; overflow-y:auto;
                    box-shadow:0 24px 60px rgba(0,0,0,0.5);
                    scrollbar-width:thin; scrollbar-color:var(--cp-border2) transparent;
                    animation:astModalIn .2s ease;
                }
                @keyframes astModalIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }

                .ast-modal-head {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:18px 22px; border-bottom:1px solid var(--cp-border);
                    position:sticky; top:0; background:var(--cp-surface); z-index:2;
                }
                .ast-modal-title { font-family:'DM Serif Display',serif; font-size:1.2rem; color:var(--cp-text); }
                .ast-modal-close {
                    width:30px; height:30px; border-radius:8px;
                    border:1px solid var(--cp-border); background:transparent; cursor:pointer;
                    display:flex; align-items:center; justify-content:center;
                    color:var(--cp-muted); transition:all .14s;
                }
                .ast-modal-close:hover { background:var(--cp-surface2); color:var(--cp-text); }
                .ast-modal-body { padding:22px; display:flex; flex-direction:column; gap:16px; }

                .ast-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
                @media(max-width:560px){ .ast-form-grid { grid-template-columns:1fr; } }

                .ast-field { display:flex; flex-direction:column; gap:5px; }
                .ast-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }

                .ast-input, .ast-select, .ast-textarea {
                    font-family:'Plus Jakarta Sans',sans-serif;
                    width:100%; padding:10px 12px; font-size:13px;
                    background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px;
                    color:var(--cp-text); outline:none; transition:border-color .15s;
                }
                .ast-input:focus, .ast-select:focus, .ast-textarea:focus { border-color:var(--cp-accent); }
                .ast-input::placeholder, .ast-textarea::placeholder { color:var(--cp-border2); }
                .ast-select option { background:var(--cp-surface); }
                .ast-textarea { resize:vertical; min-height:80px; }

                .ast-submit-btn {
                    width:100%; padding:12px; border-radius:10px; border:none; cursor:pointer;
                    font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:700;
                    background:var(--cp-accent); color:#fff; transition:opacity .15s;
                }
                .ast-submit-btn:hover { opacity:.9; }
                .ast-submit-btn:disabled { opacity:.5; cursor:not-allowed; }

                .ast-section-label {
                    font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
                    color:var(--cp-muted); padding:4px 0; border-bottom:1px solid var(--cp-border); margin-bottom:4px;
                }
            `}</style>

            <div className="ast-root">
                <div className="ast-header">
                    <div>
                        <h1 className="ast-title">Students</h1>
                        <p style={{ fontSize:12, color:"var(--cp-muted)", marginTop:3 }}>
                            {students.length} total students
                        </p>
                    </div>
                    <button className="ast-add-btn" onClick={() => setModalOpen(true)}>
                        <Plus size={15} /> Add Student
                    </button>
                </div>

                {newStudent && (
                    <div className="ast-cred">
                        <div className="ast-cred-title">✓ Student created successfully</div>
                        <div className="ast-cred-row"><strong>Student ID:</strong> {newStudent.studentId}</div>
                        <div className="ast-cred-row"><strong>Temp Password:</strong> {newStudent.tempPassword}</div>
                        <div className="ast-cred-note">⚠️ Save this password — it will not be shown again. Auto-clears in 60s.</div>
                    </div>
                )}

                <div className="ast-search-wrap">
                    <Search size={13} className="ast-search-icon" />
                    <input className="ast-search" placeholder="Search students..."
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>

                <div style={{ overflowX:"auto" }}>
                    <table className="ast-table" style={{ minWidth:700 }}>
                        <thead className="ast-thead">
                            <tr>
                                <th>ID</th><th>Student</th><th>Courses</th>
                                <th>Fees Paid</th><th>Due</th><th>Account</th><th>Status</th><th></th>
                            </tr>
                        </thead>
                        <tbody className="ast-tbody">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign:"center", padding:"40px 0", color:"var(--cp-muted)", fontSize:13 }}>
                                        {search ? `No results for "${search}"` : "No students yet"}
                                    </td>
                                </tr>
                            ) : paginated.map(s => {
                                const { total, paid, due } = calcFees(s);
                                return (
                                    <tr key={s._id}>
                                        <td><span className="ast-id">{s.studentId}</span></td>
                                        <td>
                                            <div className="ast-name">{s.name}</div>
                                            <div className="ast-sub">{s.phone}</div>
                                        </td>
                                        <td>
                                            {s.enrollments?.map((e: any) => (
                                                <span key={e._id} className="ast-course-tag">{e.course?.name}</span>
                                            ))}
                                        </td>
                                        <td>
                                            <div className="ast-fee-paid">₹{paid.toLocaleString("en-IN")}</div>
                                            <div className="ast-fee-total">of ₹{total.toLocaleString("en-IN")}</div>
                                        </td>
                                        <td><span className="ast-fee-due">₹{due.toLocaleString("en-IN")}</span></td>
                                        <td>
                                            <span className={`ast-badge ${s.isActive ? "active" : "inactive"}`}>
                                                {s.isActive ? <CheckCircle2 size={9}/> : <XCircle size={9}/>}
                                                {s.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`ast-badge ${s.courseStatus === "completed" ? "completed" : s.courseStatus === "dropped" ? "dropped" : "course-active"}`}>
                                                {s.courseStatus ?? "active"}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={`/dashboard/admin/students/${s._id}`} className="ast-view-btn">
                                                <Eye size={11}/> View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="ast-pag">
                    <button className="ast-pag-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>
                        <ChevronLeft size={13}/> Prev
                    </button>
                    <span className="ast-pag-info">Page {page} of {totalPages}</span>
                    <button className="ast-pag-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>
                        Next <ChevronRight size={13}/>
                    </button>
                </div>

                {modalOpen && (
                    <div className="ast-modal-overlay" onClick={e => e.target===e.currentTarget && setModalOpen(false)}>
                        <div className="ast-modal">
                            <div className="ast-modal-head">
                                <span className="ast-modal-title">Add New Student</span>
                                <button className="ast-modal-close" onClick={() => setModalOpen(false)}><X size={14}/></button>
                            </div>
                            <div className="ast-modal-body">
                                <div className="ast-section-label">Personal Info</div>
                                <div className="ast-form-grid">
                                    {[
                                        { name:"name",          label:"Student Name",    placeholder:"Full name"           },
                                        { name:"fatherName",    label:"Father's Name",   placeholder:"Father's name"       },
                                        { name:"email",         label:"Email",           placeholder:"email@example.com"   },
                                        { name:"phone",         label:"Phone",           placeholder:"10-digit number"     },
                                        { name:"qualification", label:"Qualification",   placeholder:"e.g. 12th, Graduate" },
                                    ].map(f => (
                                        <div key={f.name} className="ast-field">
                                            <label className="ast-label">{f.label}</label>
                                            <input className="ast-input" name={f.name} placeholder={f.placeholder}
                                                onChange={handleChange} value={(form as any)[f.name]}/>
                                        </div>
                                    ))}
                                    <div className="ast-field">
                                        <label className="ast-label">Date of Birth</label>
                                        <input className="ast-input" type="date" name="dob" onChange={handleChange} value={form.dob}/>
                                    </div>
                                    <div className="ast-field">
                                        <label className="ast-label">Admission Date</label>
                                        <input className="ast-input" type="date" name="admissionDate" onChange={handleChange} value={form.admissionDate}/>
                                    </div>
                                    <div className="ast-field">
                                        <label className="ast-label">Gender</label>
                                        <select className="ast-select" name="gender" onChange={handleChange} value={form.gender}>
                                            <option value="">Select Gender</option>
                                            <option>Male</option><option>Female</option><option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="ast-field">
                                    <label className="ast-label">Address</label>
                                    <textarea className="ast-textarea" name="address" placeholder="Full address" onChange={handleChange} value={form.address}/>
                                </div>
                                <div className="ast-section-label">Enrollment</div>
                                <div className="ast-form-grid">
                                    <div className="ast-field">
                                        <label className="ast-label">Course</label>
                                        <select className="ast-select" name="courseId" onChange={handleChange} value={form.courseId}>
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="ast-field">
                                        <label className="ast-label">Total Fees (₹)</label>
                                        <input className="ast-input" name="feesTotal" placeholder="e.g. 5000" type="number" onChange={handleChange} value={form.feesTotal}/>
                                    </div>
                                </div>
                                <button className="ast-submit-btn" onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Creating student..." : "Create Student"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}