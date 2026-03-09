"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { UserPlus, CheckCircle2, AlertCircle } from "lucide-react";

export default function EnrollStudentPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [courses,  setCourses]  = useState<any[]>([]);
    const [message,  setMessage]  = useState<{ text:string; type:"success"|"error" }|null>(null);
    const [loading,  setLoading]  = useState(false);
    const [form, setForm] = useState({ studentId:"", courseId:"", feesTotal:"" });

    useEffect(() => {
        fetchWithAuth("/api/admin/students").then(r=>r.json()).then(setStudents);
        fetchWithAuth("/api/admin/courses").then(r=>r.json()).then(d=>setCourses(Array.isArray(d)?d:[]));
    }, []);

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.studentId||!form.courseId||!form.feesTotal) {
            setMessage({ text:"Sabhi fields required hain", type:"error" }); return;
        }
        try {
            setLoading(true);
            const res  = await fetchWithAuth("/api/admin/enrollments", {
                method:"POST", headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ ...form, feesTotal:Number(form.feesTotal) }),
            });
            const data = await res.json();
            if (!res.ok) { setMessage({ text:data.message||"Error", type:"error" }); return; }
            setMessage({ text:"Student enrolled successfully ✓", type:"success" });
            setForm({ studentId:"", courseId:"", feesTotal:"" });
        } catch { setMessage({ text:"Server error", type:"error" }); }
        finally { setLoading(false); }
    };

    const selected = students.find(s=>s._id===form.studentId);

    return (
        <>
            <style>{enStyles}</style>
            <div className="en-root">

                <div className="en-header">
                    <h1 className="en-title">Enroll Student</h1>
                    <p className="en-sub">Kisi student ko ek course mein enroll karo</p>
                </div>

                <div className="en-card">
                    <div className="en-card-head">
                        <UserPlus size={13} style={{ color:"#f59e0b" }}/>
                        <span>Enrollment Form</span>
                    </div>
                    <div className="en-body">

                        {message && (
                            <div className={`en-msg ${message.type}`}>
                                {message.type==="success" ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
                                {message.text}
                            </div>
                        )}

                        <div className="en-field">
                            <label className="en-label">Student Select Karo</label>
                            <select className="en-select" name="studentId" value={form.studentId} onChange={handleChange}>
                                <option value="">-- Student chunno --</option>
                                {students.map(s => (
                                    <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                                ))}
                            </select>
                        </div>

                        {/* Selected student preview */}
                        {selected && (
                            <div className="en-student-preview">
                                <div className="en-preview-avatar">{selected.name.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div className="en-preview-name">{selected.name}</div>
                                    <div className="en-preview-meta">{selected.studentId} · {selected.phone}</div>
                                    {selected.enrollments?.length>0 && (
                                        <div className="en-preview-courses">
                                            Already enrolled: {selected.enrollments.map((e: any) => e.course?.name).join(", ")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="en-field">
                            <label className="en-label">Course Select Karo</label>
                            <select className="en-select" name="courseId" value={form.courseId} onChange={handleChange}>
                                <option value="">-- Course chunno --</option>
                                {courses.filter((c:any)=>c.isActive).map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="en-field">
                            <label className="en-label">Total Fees (₹)</label>
                            <input className="en-input" name="feesTotal" type="number"
                                placeholder="e.g. 5000" value={form.feesTotal} onChange={handleChange}/>
                        </div>

                        <button className="en-submit-btn" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Enrolling..." : "Enroll Student"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

const enStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .en-root   { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:20px; max-width:540px; }
    .en-header { display:flex; flex-direction:column; gap:3px; }
    .en-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .en-sub    { font-size:12px; color:#475569; }

    .en-card      { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .en-card-head { display:flex; align-items:center; gap:7px; padding:13px 18px; border-bottom:1px solid #222; background:#1f1f1f; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#94a3b8; }
    .en-body      { padding:20px; display:flex; flex-direction:column; gap:14px; }

    .en-field { display:flex; flex-direction:column; gap:5px; }
    .en-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }

    .en-input, .en-select {
        font-family:'Plus Jakarta Sans',sans-serif; padding:10px 12px; font-size:13px;
        background:#111; border:1px solid #2a2a2a; border-radius:8px;
        color:#f1f5f9; outline:none; transition:border-color .15s; width:100%;
    }
    .en-input:focus,.en-select:focus { border-color:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,.07); }
    .en-input::placeholder { color:#334155; }
    .en-select option { background:#1a1a1a; }

    .en-student-preview {
        display:flex; align-items:center; gap:12px;
        padding:12px 14px; background:#111; border:1px solid #2a2a2a; border-radius:9px;
        animation:enFade .2s ease;
    }
    @keyframes enFade { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .en-preview-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; flex-shrink:0; }
    .en-preview-name   { font-size:13px; font-weight:700; color:#f1f5f9; }
    .en-preview-meta   { font-size:11px; color:#64748b; margin-top:1px; }
    .en-preview-courses{ font-size:10px; color:#475569; margin-top:3px; }

    .en-msg { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:9px; font-size:12px; font-weight:600; }
    .en-msg.success { background:rgba(34,197,94,.08); color:#22c55e; border:1px solid rgba(34,197,94,.2); }
    .en-msg.error   { background:rgba(239,68,68,.08); color:#ef4444; border:1px solid rgba(239,68,68,.2); }

    .en-submit-btn { padding:11px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; transition:opacity .15s; }
    .en-submit-btn:hover { opacity:.9; }
    .en-submit-btn:disabled { opacity:.5; cursor:not-allowed; }
`;