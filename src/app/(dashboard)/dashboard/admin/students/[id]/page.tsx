"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    ArrowLeft, Edit2, X, Plus, RefreshCw,
    CheckCircle2, XCircle, IndianRupee,
    BookOpen, Award, User, ChevronDown
} from "lucide-react";

export default function StudentDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [feesTotal, setFeesTotal] = useState("");
    const [paymentForms, setPaymentForms] = useState<any>({});
    const [editingPayment, setEditingPayment] = useState<any>(null);
    const [editAmount, setEditAmount] = useState("");
    const [editRemark, setEditRemark] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
    const [editFeesTotal, setEditFeesTotal] = useState("");
    const [certificateStatus, setCertificateStatus] = useState("");
    const [courseStatus, setCourseStatus] = useState("");
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: "", fatherName: "", email: "", phone: "", gender: "", qualification: "", address: "", dob: ""
    });

    const loadStudent = async () => {
        const res = await fetchWithAuth(`/api/admin/students/${id}`);
        const data = await res.json();

        if (!res.ok || !data) {   // ← !data check add karo
            setLoading(false);
            return;
        }

        if (res.ok) {
            setStudent(data);
            setCourseStatus(data.courseStatus ?? "active");
        }

        setProfileForm({
            name: data.name || "",
            fatherName: data.fatherName || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "",
            qualification: data.qualification || "",
            address: data.address || "",
            dob: data.dob?.split("T")[0] || ""
        });

        setLoading(false);
    };

    const loadCourses = async () => {
        const res = await fetchWithAuth("/api/admin/courses");
        const data = await res.json();
        setCourses(data.filter((c: any) => c.isActive));
    };

    useEffect(() => { if (!id) return; loadStudent(); loadCourses(); }, [id]);

    const handleProfileChange = (e: any) => setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handlePaymentChange = (eid: string, field: string, value: string) =>
        setPaymentForms((p: any) => ({ ...p, [eid]: { ...p[eid], [field]: value } }));

    const updateProfile = async () => {
        const res = await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileUpdate: true, ...profileForm })
        });
        const d = await res.json();
        if (!res.ok) { alert(d.message || "Update failed"); return; }
        setEditProfileOpen(false); loadStudent();
    };

    const addPayment = async (eid: string) => {
        const f = paymentForms[eid] || {};
        if (!f.amount) return alert("Enter payment amount");
        const res = await fetchWithAuth(`/api/admin/enrollments/${eid}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentAmount: Number(f.amount), remark: f.remark, date: f.date })
        });
        const d = await res.json();
        if (!res.ok) return alert(d.message);
        setPaymentForms((p: any) => ({ ...p, [eid]: {} }));
        loadStudent();
    };

    const openEdit = (p: any) => {
        setEditingPayment(p); setEditAmount(p.amount.toString());
        setEditRemark(p.remark || ""); setEditDate(p.date?.split("T")[0]);
    };

    // Line ~88 — updatePayment function mein guard add karo
    const updatePayment = async () => {
        if (!editingPayment) return;  // ← yeh line add karo

        const res = await fetchWithAuth(`/api/admin/payments/${editingPayment._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: Number(editAmount),
                remark: editRemark,
                date: editDate,
            }),
        });
        const d = await res.json();
        if (!res.ok) return alert(d.message);
        setEditingPayment(null);
        loadStudent();
    };

    const updateCertificate = async (eid: string) => {
        await fetchWithAuth(`/api/admin/enrollments/${eid}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ certificateStatus })
        });
        loadStudent();
    };

    const updateCourseStatus = async () => {
        const res = await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseStatus })
        });
        const d = await res.json();
        if (!res.ok) { alert(d.message || "Failed"); return; }
        setStudent((p: any) => ({ ...p, courseStatus }));
    };

    const enrollCourse = async () => {
        if (!selectedCourse) return alert("Select course");
        const res = await fetchWithAuth("/api/admin/enrollments", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: student._id, courseId: selectedCourse, feesTotal: Number(feesTotal) })
        });
        const d = await res.json();
        if (!res.ok) return alert(d.message);
        setSelectedCourse(""); setFeesTotal(""); loadStudent();
    };

    const updateEnrollment = async () => {
        if (!editingEnrollment) return;
        const res = await fetchWithAuth(`/api/admin/enrollments/${editingEnrollment._id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feesTotal: Number(editFeesTotal) })
        });
        const d = await res.json();
        if (!res.ok) { alert(d.message); return; }
        setEditingEnrollment(null); loadStudent();
    };

    const deleteEnrollment = async (eid: string) => {
        if (!confirm("Delete this enrollment?")) return;
        const res = await fetchWithAuth(`/api/admin/enrollments/${eid}/delete`, { method: "DELETE" });
        const d = await res.json();
        if (!res.ok) { alert(d.message); return; }
        loadStudent();
    };

    const toggleActive = async () => {
        await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !student?.isActive })
        });
        loadStudent();
    };

    const handleReset = async (userId: string) => {
        if (!userId) { alert("User ID not found"); return; }
        if (!confirm("Reset student password?")) return;
        const res = await fetch(`/api/admin/students/${userId}/reset-password`, { method: "PATCH", credentials: "include" });
        const d = await res.json();
        if (!res.ok) { alert(d.message); return; }
        alert("Password reset successfully");
    };

    if (loading) return (
        <>
            <style>{sdStyles}</style>
            <div className="sd-root">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[200, 160, 240, 300].map((w, i) => (
                        <div key={i} className="sd-skeleton" style={{ width: w, height: i === 0 ? 28 : 14, borderRadius: 6 }} />
                    ))}
                </div>
            </div>
        </>
    );

    if (!student) return <div style={{ color: "#ef4444", fontFamily: "sans-serif", padding: 20 }}>Student not found</div>;

    return (
        <>
            <style>{sdStyles}</style>
            <div className="sd-root">

                {/* ── Header ── */}
                <div className="sd-header">
                    <div className="sd-header-left">
                        <button className="sd-back-btn" onClick={() => router.back()}>
                            <ArrowLeft size={14} /> Back
                        </button>
                        <div>
                            <h1 className="sd-title">{student.name}</h1>
                            <p className="sd-subtitle">{student.studentId} · {student.email}</p>
                        </div>
                    </div>
                    <span className={`sd-status-badge ${student.isActive ? "active" : "inactive"}`}>
                        {student.isActive ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {student.isActive ? "Active" : "Inactive"}
                    </span>
                </div>

                {/* ── Profile card ── */}
                <div className="sd-card">
                    <div className="sd-card-head">
                        <div className="sd-card-head-left">
                            <User size={13} style={{ color: "#f59e0b" }} />
                            <span>Student Profile</span>
                        </div>
                        <button className="sd-link-btn" onClick={() => setEditProfileOpen(true)}>
                            <Edit2 size={11} /> Edit Profile
                        </button>
                    </div>
                    <div className="sd-profile-grid">
                        {[
                            ["Student ID", student.studentId],
                            ["Full Name", student.name],
                            ["Father's Name", student.fatherName],
                            ["Email", student.email],
                            ["Phone", student.phone],
                            ["Gender", student.gender],
                            ["Date of Birth", student.dob?.split("T")[0]],
                            ["Qualification", student.qualification],
                            ["Address", student.address],
                        ].map(([k, v]) => (
                            <div key={k as string} className="sd-profile-row">
                                <div className="sd-profile-key">{k}</div>
                                <div className="sd-profile-val">{v || "—"}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Course Status ── */}
                <div className="sd-card">
                    <div className="sd-card-head">
                        <div className="sd-card-head-left">
                            <BookOpen size={13} style={{ color: "#f59e0b" }} />
                            <span>Course Status</span>
                        </div>
                    </div>
                    <div className="sd-row-wrap">
                        <select className="sd-select" value={courseStatus} onChange={e => setCourseStatus(e.target.value)}>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select>
                        <button className="sd-amber-btn" onClick={updateCourseStatus}>Update Status</button>
                    </div>
                </div>

                {/* ── Enroll New Course ── */}
                <div className="sd-card">
                    <div className="sd-card-head">
                        <div className="sd-card-head-left">
                            <Plus size={13} style={{ color: "#f59e0b" }} />
                            <span>Enroll New Course</span>
                        </div>
                    </div>
                    <div className="sd-row-wrap">
                        <select className="sd-select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                            <option value="">Select Course</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <input className="sd-input" type="number" placeholder="Total Fees (₹)"
                            value={feesTotal} onChange={e => setFeesTotal(e.target.value)} />
                        <button className="sd-amber-btn" onClick={enrollCourse}>Enroll</button>
                    </div>
                </div>

                {/* ── Enrollments ── */}
                {student.enrollments?.map((e: any) => {
                    const total = e.feesTotal || 0;
                    const paid = e.feesPaid || 0;
                    const due = total - paid;
                    const progress = total > 0 ? (paid / total) * 100 : 0;
                    const fmt = (n: number) => n.toLocaleString("en-IN");

                    return (
                        <div key={e._id} className="sd-card">

                            {/* Card head */}
                            <div className="sd-card-head">
                                <div className="sd-card-head-left">
                                    <BookOpen size={13} style={{ color: "#f59e0b" }} />
                                    <span>{e.course?.name}</span>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button className="sd-link-btn" onClick={() => { setEditingEnrollment(e); setEditFeesTotal(e.feesTotal?.toString() || ""); }}>
                                        <Edit2 size={10} /> Edit Fees
                                    </button>
                                    <button className="sd-link-btn danger" onClick={() => deleteEnrollment(e._id)}>
                                        <X size={10} /> Delete
                                    </button>
                                </div>
                            </div>

                            {/* Fee progress */}
                            <div className="sd-fee-block">
                                <div className="sd-fee-row">
                                    <span className="sd-fee-label">Paid</span>
                                    <span className="sd-fee-paid">₹{fmt(paid)}</span>
                                    <span className="sd-fee-label">of ₹{fmt(total)}</span>
                                    <span className="sd-fee-due">Due: ₹{fmt(due)}</span>
                                </div>
                                <div className="sd-progress-track">
                                    <div className="sd-progress-fill" style={{ width: `${progress}%` }} />
                                </div>
                            </div>

                            {/* Add payment */}
                            <div className="sd-section-label">Add Installment</div>
                            <div className="sd-row-wrap">
                                <input className="sd-input" type="number" placeholder="Amount (₹)"
                                    value={paymentForms[e._id]?.amount || ""}
                                    onChange={ev => handlePaymentChange(e._id, "amount", ev.target.value)} />
                                <input className="sd-input" type="date"
                                    value={paymentForms[e._id]?.date || ""}
                                    onChange={ev => handlePaymentChange(e._id, "date", ev.target.value)} />
                                <input className="sd-input" placeholder="Remark (optional)"
                                    value={paymentForms[e._id]?.remark || ""}
                                    onChange={ev => handlePaymentChange(e._id, "remark", ev.target.value)} />
                                <button className="sd-green-btn" onClick={() => addPayment(e._id)}>
                                    <Plus size={13} /> Add
                                </button>
                            </div>

                            {/* Payment history */}
                            {e.payments?.length > 0 && (
                                <>
                                    <div className="sd-section-label">Payment History</div>
                                    <div className="sd-payment-list">
                                        {e.payments.map((p: any) => (
                                            <div key={p._id} className="sd-payment-row">
                                                <div className="sd-payment-left">
                                                    <div className="sd-payment-amount">₹{p.amount.toLocaleString("en-IN")}</div>
                                                    <div className="sd-payment-meta">
                                                        {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                        {p.remark && <span> · {p.remark}</span>}
                                                    </div>
                                                    <div className="sd-payment-receipt">Receipt #{p.receiptNo}</div>
                                                </div>
                                                <button className="sd-link-btn" onClick={() => openEdit(p)}>
                                                    <Edit2 size={10} /> Edit
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Certificate status */}
                            <div className="sd-section-label">Certificate Status</div>
                            <div className="sd-row-wrap">
                                <select className="sd-select" defaultValue={e.certificateStatus}
                                    onChange={ev => setCertificateStatus(ev.target.value)}>
                                    <option>Not Applied</option>
                                    <option>Applied</option>
                                    <option>Exam Given</option>
                                    <option>Passed</option>
                                    <option>Certificate Generated</option>
                                </select>
                                <button className="sd-amber-btn" onClick={() => updateCertificate(e._id)}>
                                    <Award size={12} /> Update
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* ── Actions ── */}
                <div className="sd-actions">
                    <button className={`sd-action-btn ${student.isActive ? "danger" : "success"}`} onClick={toggleActive}>
                        {student.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                        {student.isActive ? "Deactivate Account" : "Activate Account"}
                    </button>
                    <button className="sd-action-btn warning" onClick={() => handleReset(student.user?._id)}>
                        <RefreshCw size={14} /> Reset Password
                    </button>
                </div>

                {/* ══ MODALS ══ */}

                {/* Edit payment */}
                {editingPayment && (
                    <div className="sd-overlay" onClick={e => e.target === e.currentTarget && setEditingPayment(null)}>
                        <div className="sd-modal">
                            <div className="sd-modal-head">
                                <span className="sd-modal-title">Edit Payment</span>
                                <button className="sd-modal-close" onClick={() => setEditingPayment(null)}><X size={13} /></button>
                            </div>
                            <div className="sd-modal-body">
                                <div className="sd-field">
                                    <label className="sd-label">Amount (₹)</label>
                                    <input className="sd-input" type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} />
                                </div>
                                <div className="sd-field">
                                    <label className="sd-label">Date</label>
                                    <input className="sd-input" type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                                </div>
                                <div className="sd-field">
                                    <label className="sd-label">Remark</label>
                                    <input className="sd-input" placeholder="Optional remark" value={editRemark} onChange={e => setEditRemark(e.target.value)} />
                                </div>
                                <div className="sd-modal-footer">
                                    <button className="sd-ghost-btn" onClick={() => setEditingPayment(null)}>Cancel</button>
                                    <button className="sd-amber-btn" onClick={updatePayment}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit enrollment */}
                {editingEnrollment && (
                    <div className="sd-overlay" onClick={e => e.target === e.currentTarget && setEditingEnrollment(null)}>
                        <div className="sd-modal">
                            <div className="sd-modal-head">
                                <span className="sd-modal-title">Edit Enrollment Fees</span>
                                <button className="sd-modal-close" onClick={() => setEditingEnrollment(null)}><X size={13} /></button>
                            </div>
                            <div className="sd-modal-body">
                                <div className="sd-field">
                                    <label className="sd-label">Total Fees (₹)</label>
                                    <input className="sd-input" type="number" value={editFeesTotal} onChange={e => setEditFeesTotal(e.target.value)} />
                                </div>
                                <div className="sd-modal-footer">
                                    <button className="sd-ghost-btn" onClick={() => setEditingEnrollment(null)}>Cancel</button>
                                    <button className="sd-amber-btn" onClick={updateEnrollment}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit profile */}
                {editProfileOpen && (
                    <div className="sd-overlay" onClick={e => e.target === e.currentTarget && setEditProfileOpen(false)}>
                        <div className="sd-modal" style={{ maxWidth: 500 }}>
                            <div className="sd-modal-head">
                                <span className="sd-modal-title">Edit Student Profile</span>
                                <button className="sd-modal-close" onClick={() => setEditProfileOpen(false)}><X size={13} /></button>
                            </div>
                            <div className="sd-modal-body">
                                {[
                                    { label: "Full Name", name: "name", type: "text" },
                                    { label: "Father's Name", name: "fatherName", type: "text" },
                                    { label: "Email", name: "email", type: "email" },
                                    { label: "Phone", name: "phone", type: "tel" },
                                    { label: "Date of Birth", name: "dob", type: "date" },
                                    { label: "Qualification", name: "qualification", type: "text" },
                                ].map(f => (
                                    <div key={f.name} className="sd-field">
                                        <label className="sd-label">{f.label}</label>
                                        <input className="sd-input" type={f.type} name={f.name}
                                            value={(profileForm as any)[f.name]} onChange={handleProfileChange} />
                                    </div>
                                ))}
                                <div className="sd-field">
                                    <label className="sd-label">Gender</label>
                                    <select className="sd-select" name="gender" value={profileForm.gender} onChange={handleProfileChange}>
                                        <option value="">Select Gender</option>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div className="sd-field">
                                    <label className="sd-label">Address</label>
                                    <textarea className="sd-textarea" name="address" value={profileForm.address} onChange={handleProfileChange} />
                                </div>
                                <div className="sd-modal-footer">
                                    <button className="sd-ghost-btn" onClick={() => setEditProfileOpen(false)}>Cancel</button>
                                    <button className="sd-amber-btn" onClick={updateProfile}>Save Profile</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

/* ─── Styles ─────────────────────────────────────── */
const sdStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

    .sd-root { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:16px; }

    /* Header */
    .sd-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
    .sd-header-left { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
    .sd-back-btn {
        display:inline-flex; align-items:center; gap:5px;
        padding:7px 13px; border-radius:8px; border:1px solid #2a2a2a;
        background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:500; cursor:pointer;
        font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s;
    }
    .sd-back-btn:hover { border-color:#f59e0b; color:#f59e0b; }
    .sd-title    { font-family:'DM Serif Display',serif; font-size:1.5rem; color:#f1f5f9; font-weight:400; }
    .sd-subtitle { font-size:11px; color:#475569; margin-top:3px; }

    .sd-status-badge {
        display:inline-flex; align-items:center; gap:5px;
        font-size:11px; font-weight:700; padding:5px 12px; border-radius:100px;
    }
    .sd-status-badge.active   { background:rgba(34,197,94,.1); color:#22c55e; border:1px solid rgba(34,197,94,.2); }
    .sd-status-badge.inactive { background:rgba(239,68,68,.1); color:#ef4444; border:1px solid rgba(239,68,68,.2); }

    /* Card */
    .sd-card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .sd-card-head {
        display:flex; align-items:center; justify-content:space-between;
        padding:13px 18px; border-bottom:1px solid #222;
        background:#1f1f1f;
    }
    .sd-card-head-left {
        display:flex; align-items:center; gap:7px;
        font-size:12px; font-weight:700; letter-spacing:.06em;
        text-transform:uppercase; color:#94a3b8;
    }

    /* Profile grid */
    .sd-profile-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; }
    @media(max-width:600px){ .sd-profile-grid { grid-template-columns:1fr; } }
    .sd-profile-row { padding:11px 18px; border-bottom:1px solid #1f1f1f; display:flex; flex-direction:column; gap:3px; }
    .sd-profile-row:nth-child(even) { border-left:1px solid #1f1f1f; }
    .sd-profile-key { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:#475569; }
    .sd-profile-val { font-size:13px; color:#e2e8f0; font-weight:500; }

    /* Inputs */
    .sd-input, .sd-select, .sd-textarea {
        font-family:'Plus Jakarta Sans',sans-serif;
        padding:9px 12px; font-size:13px;
        background:#111; border:1px solid #2a2a2a; border-radius:8px;
        color:#f1f5f9; outline:none; transition:border-color .15s;
        width:100%;
    }
    .sd-input:focus,.sd-select:focus,.sd-textarea:focus { border-color:#f59e0b; }
    .sd-input::placeholder,.sd-textarea::placeholder { color:#334155; }
    .sd-select option { background:#1a1a1a; }
    .sd-textarea { resize:vertical; min-height:80px; }

    /* Row wrap — inline form row */
    .sd-row-wrap { display:flex; flex-wrap:wrap; gap:10px; padding:16px 18px; align-items:flex-end; }
    .sd-row-wrap .sd-input, .sd-row-wrap .sd-select { flex:1; min-width:140px; }

    /* Section label inside card */
    .sd-section-label {
        font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
        color:#475569; padding:10px 18px 4px;
        border-top:1px solid #222;
    }

    /* Buttons */
    .sd-amber-btn {
        display:inline-flex; align-items:center; gap:6px;
        padding:9px 18px; border-radius:8px; border:none; cursor:pointer;
        font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700;
        background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208;
        transition:opacity .15s; white-space:nowrap;
    }
    .sd-amber-btn:hover { opacity:.88; }

    .sd-green-btn {
        display:inline-flex; align-items:center; gap:6px;
        padding:9px 18px; border-radius:8px; border:none; cursor:pointer;
        font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700;
        background:rgba(34,197,94,.15); color:#22c55e;
        border:1px solid rgba(34,197,94,.3);
        transition:all .15s; white-space:nowrap;
    }
    .sd-green-btn:hover { background:rgba(34,197,94,.25); }

    .sd-ghost-btn {
        padding:9px 18px; border-radius:8px; border:1px solid #2a2a2a;
        background:transparent; color:#64748b; font-size:12px; font-weight:600;
        cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s;
    }
    .sd-ghost-btn:hover { border-color:#475569; color:#94a3b8; }

    .sd-link-btn {
        display:inline-flex; align-items:center; gap:4px;
        font-size:11px; font-weight:600; color:#f59e0b;
        background:none; border:none; cursor:pointer;
        font-family:'Plus Jakarta Sans',sans-serif; padding:4px 6px;
        border-radius:5px; transition:background .13s;
    }
    .sd-link-btn:hover { background:rgba(245,158,11,.1); }
    .sd-link-btn.danger { color:#ef4444; }
    .sd-link-btn.danger:hover { background:rgba(239,68,68,.1); }

    /* Action buttons */
    .sd-actions { display:flex; flex-wrap:wrap; gap:10px; }
    .sd-action-btn {
        display:inline-flex; align-items:center; gap:7px;
        padding:10px 20px; border-radius:9px; border:1px solid; cursor:pointer;
        font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700;
        transition:all .15s;
    }
    .sd-action-btn.danger  { background:rgba(239,68,68,.08); color:#ef4444; border-color:rgba(239,68,68,.25); }
    .sd-action-btn.danger:hover  { background:rgba(239,68,68,.16); }
    .sd-action-btn.success { background:rgba(34,197,94,.08); color:#22c55e; border-color:rgba(34,197,94,.25); }
    .sd-action-btn.success:hover { background:rgba(34,197,94,.16); }
    .sd-action-btn.warning { background:rgba(245,158,11,.08); color:#f59e0b; border-color:rgba(245,158,11,.25); }
    .sd-action-btn.warning:hover { background:rgba(245,158,11,.16); }

    /* Fee progress */
    .sd-fee-block { padding:14px 18px; display:flex; flex-direction:column; gap:8px; }
    .sd-fee-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:12px; }
    .sd-fee-label { color:#475569; }
    .sd-fee-paid  { font-weight:700; color:#22c55e; font-size:14px; }
    .sd-fee-due   { font-weight:700; color:#ef4444; margin-left:auto; }
    .sd-progress-track { width:100%; height:5px; background:#222; border-radius:100px; overflow:hidden; }
    .sd-progress-fill  { height:100%; background:linear-gradient(90deg,#f59e0b,#22c55e); border-radius:100px; transition:width .5s ease; }

    /* Payment list */
    .sd-payment-list { display:flex; flex-direction:column; margin:0 18px 14px; border:1px solid #2a2a2a; border-radius:9px; overflow:hidden; }
    .sd-payment-row { display:flex; align-items:center; justify-content:space-between; padding:11px 14px; border-bottom:1px solid #222; transition:background .12s; }
    .sd-payment-row:last-child { border-bottom:none; }
    .sd-payment-row:hover { background:rgba(245,158,11,.04); }
    .sd-payment-left { display:flex; flex-direction:column; gap:2px; }
    .sd-payment-amount { font-size:13px; font-weight:700; color:#22c55e; }
    .sd-payment-meta   { font-size:11px; color:#475569; }
    .sd-payment-receipt { font-size:10px; color:#334155; }

    /* Modal */
    .sd-overlay {
        position:fixed; inset:0; background:rgba(0,0,0,.72);
        backdrop-filter:blur(4px); z-index:60;
        display:flex; align-items:center; justify-content:center; padding:20px;
    }
    .sd-modal {
        background:#1a1a1a; border:1px solid #2a2a2a; border-radius:14px;
        width:100%; max-width:440px; max-height:90vh; overflow-y:auto;
        box-shadow:0 24px 60px rgba(0,0,0,.6);
        scrollbar-width:thin; scrollbar-color:#333 transparent;
        animation:sdModalIn .18s ease;
    }
    @keyframes sdModalIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    .sd-modal-head {
        display:flex; align-items:center; justify-content:space-between;
        padding:16px 20px; border-bottom:1px solid #2a2a2a;
        position:sticky; top:0; background:#1a1a1a; z-index:2;
    }
    .sd-modal-title { font-family:'DM Serif Display',serif; font-size:1.05rem; color:#f1f5f9; }
    .sd-modal-close {
        width:28px; height:28px; border-radius:7px; border:1px solid #2a2a2a;
        background:transparent; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        color:#64748b; transition:all .14s;
    }
    .sd-modal-close:hover { background:#222; color:#f1f5f9; }
    .sd-modal-body { padding:20px; display:flex; flex-direction:column; gap:12px; }
    .sd-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding-top:4px; }

    .sd-field { display:flex; flex-direction:column; gap:5px; }
    .sd-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }

    /* Skeleton */
    .sd-skeleton {
        background:linear-gradient(90deg,#1e1e1e 25%,#2a2a2a 50%,#1e1e1e 75%);
        background-size:200% 100%; animation:sdShimmer 1.4s infinite;
    }
    @keyframes sdShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;