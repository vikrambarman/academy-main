"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { UserPlus, CheckCircle2, AlertCircle, Shield } from "lucide-react";

export default function EnrollStudentPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [configs, setConfigs] = useState<any[]>([]);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingCfg, setLoadingCfg] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [form, setForm] = useState({
        studentId: "", courseId: "", franchiseId: "", certTypeId: "", feesTotal: "",
    });

    useEffect(() => {
        Promise.all([
            fetchWithAuth("/api/admin/students").then(r => r.json()),
            fetchWithAuth("/api/admin/courses").then(r => r.json()),
        ]).then(([s, co]) => {
            setStudents(Array.isArray(s) ? s : []);
            setCourses(Array.isArray(co) ? co : []);
        }).catch(() => { }).finally(() => setPageLoading(false));
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prev => {
            const updated = { ...prev, [name]: value };
            if (name === "courseId") {
                updated.franchiseId = "";
                updated.certTypeId = "";
                updated.feesTotal = "";
                if (value) loadConfigs(value);
                else setConfigs([]);
            }
            if (name === "franchiseId") {
                const cfg = configs.find(c => c.franchise._id === value);
                updated.certTypeId = cfg?.defaultCertType?._id ?? "";
                updated.feesTotal = cfg?.feeStructure?.total ? String(cfg.feeStructure.total) : "";
            }
            return updated;
        });
    };

    const loadConfigs = async (courseId: string) => {
        setLoadingCfg(true);
        try {
            const r = await fetchWithAuth(`/api/admin/course-franchise-configs?courseId=${courseId}`);
            const d = await r.json();
            setConfigs(Array.isArray(d) ? d : []);
        } catch { setConfigs([]); }
        finally { setLoadingCfg(false); }
    };

    const handleSubmit = async () => {
        if (!form.studentId || !form.courseId || !form.feesTotal) {
            setMessage({ text: "Student, course aur fees required hain", type: "error" }); return;
        }
        try {
            setLoading(true);
            const payload: any = {
                studentId: form.studentId,
                courseId: form.courseId,
                feesTotal: Number(form.feesTotal),
            };
            if (form.franchiseId) {
                payload.franchiseId = form.franchiseId;
                payload.certTypeId = form.certTypeId;
            }
            const res = await fetchWithAuth("/api/admin/enrollments", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) { setMessage({ text: data.message || "Error", type: "error" }); return; }
            setMessage({ text: "Student enrolled successfully ✓", type: "success" });
            setForm({ studentId: "", courseId: "", franchiseId: "", certTypeId: "", feesTotal: "" });
            setConfigs([]);
        } catch { setMessage({ text: "Server error", type: "error" }); }
        finally { setLoading(false); }
    };

    const selected = students.find(s => s._id === form.studentId);
    const selectedCfg = configs.find(c => c.franchise._id === form.franchiseId);

    return (
        <>
            <style>{enStyles}</style>
            {pageLoading ? (
                <div className="en-root">
                    <div className="en-header">
                        <div className="en-sk" style={{ width: 180, height: 28, borderRadius: 6 }} />
                        <div className="en-sk" style={{ width: 260, height: 12, borderRadius: 4, marginTop: 8 }} />
                    </div>
                    <div className="en-card">
                        <div className="en-card-head">
                            <div className="en-sk" style={{ width: 120, height: 12, borderRadius: 4 }} />
                        </div>
                        <div className="en-body">
                            {[180, 220, 160, 200, 100].map((w, i) => (
                                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                    <div className="en-sk" style={{ width: 80, height: 10, borderRadius: 4 }} />
                                    <div className="en-sk" style={{ width: "100%", height: 40, borderRadius: 8 }} />
                                </div>
                            ))}
                            <div className="en-sk" style={{ width: "100%", height: 42, borderRadius: 9 }} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="en-root">
                    <div className="en-header">
                        <h1 className="en-title">Enroll Student</h1>
                        <p className="en-sub">Kisi student ko ek course mein enroll karo</p>
                    </div>

                    <div className="en-card">
                        <div className="en-card-head">
                            <UserPlus size={13} style={{ color: "var(--cp-warning)" }} />
                            <span>Enrollment Form</span>
                        </div>
                        <div className="en-body">

                            {message && (
                                <div className={`en-msg ${message.type}`}>
                                    {message.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                    {message.text}
                                </div>
                            )}

                            {/* Student select */}
                            <div className="en-field">
                                <label className="en-label">Student Select Karo</label>
                                <select className="en-select" name="studentId" value={form.studentId} onChange={handleChange}>
                                    <option value="">-- Student chunno --</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Student preview */}
                            {selected && (
                                <div className="en-student-preview">
                                    <div className="en-preview-avatar">{selected.name.charAt(0).toUpperCase()}</div>
                                    <div>
                                        <div className="en-preview-name">{selected.name}</div>
                                        <div className="en-preview-meta">{selected.studentId} · {selected.phone}</div>
                                        {selected.enrollments?.length > 0 && (
                                            <div className="en-preview-courses">
                                                Already enrolled: {selected.enrollments.map((e: any) =>
                                                    `${e.course?.name}${e.franchise?.code ? ` (${e.franchise.code})` : ""}`
                                                ).join(", ")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Course select */}
                            <div className="en-field">
                                <label className="en-label">Course Select Karo</label>
                                <select className="en-select" name="courseId" value={form.courseId} onChange={handleChange}>
                                    <option value="">-- Course chunno --</option>
                                    {courses.filter((c: any) => c.isActive).map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Franchise options */}
                            {form.courseId && (
                                <div className="en-field">
                                    <label className="en-label">
                                        <Shield size={10} style={{ display: "inline", marginRight: 4 }} />
                                        Franchise / Program
                                    </label>
                                    {loadingCfg ? (
                                        <div style={{ fontSize: 12, color: "var(--cp-muted)", padding: "8px 0" }}>
                                            Loading options…
                                        </div>
                                    ) : configs.length === 0 ? (
                                        <div style={{
                                            fontSize: 12, color: "var(--cp-muted)",
                                            padding: "10px 14px", borderRadius: 8,
                                            background: "var(--cp-surface2)",
                                            border: "1px solid var(--cp-border)",
                                        }}>
                                            Is course ke liye koi franchise config nahi — direct enrollment hoga.
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                            {/* No franchise */}
                                            <label className={`en-radio-card ${!form.franchiseId ? "selected" : ""}`}>
                                                <input type="radio" name="franchiseId" value=""
                                                    checked={!form.franchiseId} onChange={handleChange}
                                                    style={{ accentColor: "var(--cp-accent)" }} />
                                                <div>
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cp-text)" }}>No Franchise</div>
                                                    <div style={{ fontSize: 10, color: "var(--cp-muted)" }}>Manual fee entry</div>
                                                </div>
                                            </label>
                                            {configs.map(cfg => {
                                                const sel = form.franchiseId === cfg.franchise._id;
                                                const color = cfg.franchise.isOwn ? "#F59E0B" : "var(--cp-accent)";
                                                return (
                                                    <label key={cfg._id}
                                                        className={`en-radio-card ${sel ? "selected" : ""}`}
                                                        style={sel ? { borderColor: color, background: cfg.franchise.isOwn ? "rgba(245,158,11,0.06)" : "var(--cp-accent-glow)" } : {}}>
                                                        <input type="radio" name="franchiseId"
                                                            value={cfg.franchise._id}
                                                            checked={sel}
                                                            onChange={handleChange}
                                                            style={{ accentColor: color }} />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                                                                <span style={{
                                                                    fontSize: 9, fontWeight: 800,
                                                                    padding: "1px 7px", borderRadius: 5,
                                                                    background: color, color: "#fff",
                                                                }}>
                                                                    {cfg.franchise.code}
                                                                </span>
                                                                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cp-text)" }}>
                                                                    {cfg.franchise.name}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: 10, color: "var(--cp-muted)" }}>
                                                                {cfg.defaultCertType?.name ?? "—"}
                                                                {cfg.feeStructure?.total ? (
                                                                    <span style={{ marginLeft: 8, color: "var(--cp-success)", fontWeight: 700 }}>
                                                                        · Default ₹{cfg.feeStructure.total.toLocaleString("en-IN")}
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Total Fees */}
                            <div className="en-field">
                                <label className="en-label">
                                    Total Fees (₹)
                                    {selectedCfg && (
                                        <span style={{ marginLeft: 6, fontSize: 10, color: "var(--cp-success)", fontWeight: 500, textTransform: "none" }}>
                                            — auto-filled (edit if needed)
                                        </span>
                                    )}
                                </label>
                                <input className="en-input" name="feesTotal" type="number"
                                    placeholder="e.g. 5000" value={form.feesTotal} onChange={handleChange} />
                            </div>

                            <button className="en-submit-btn" onClick={handleSubmit} disabled={loading}>
                                {loading ? "Enrolling..." : "Enroll Student"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const enStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
    .en-root  { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:20px; max-width:560px; }
    .en-title { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .en-sub   { font-size:12px; color:var(--cp-muted); }
    .en-card      { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
    .en-card-head { display:flex; align-items:center; gap:7px; padding:13px 18px; border-bottom:1px solid var(--cp-border); background:var(--cp-surface2); font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-subtext); }
    .en-body { padding:20px; display:flex; flex-direction:column; gap:14px; }
    .en-field  { display:flex; flex-direction:column; gap:5px; }
    .en-label  { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }
    .en-input, .en-select { font-family:'Plus Jakarta Sans',sans-serif; padding:10px 12px; font-size:13px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; color:var(--cp-text); outline:none; transition:border-color .15s; width:100%; }
    .en-input:focus,.en-select:focus { border-color:var(--cp-accent); box-shadow:0 0 0 3px var(--cp-accent-glow); }
    .en-input::placeholder { color:var(--cp-border2); }
    .en-select option { background:var(--cp-surface); }
    .en-radio-card { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:9px; cursor:pointer; border:1px solid var(--cp-border); background:var(--cp-surface2); transition:all .15s; }
    .en-radio-card.selected { border-color:var(--cp-accent); background:var(--cp-accent-glow); }
    .en-student-preview { display:flex; align-items:center; gap:12px; padding:12px 14px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:9px; animation:enFade .2s ease; }
    @keyframes enFade { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .en-preview-avatar  { width:36px; height:36px; border-radius:50%; background:var(--cp-accent); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; flex-shrink:0; }
    .en-preview-name    { font-size:13px; font-weight:700; color:var(--cp-text); }
    .en-preview-meta    { font-size:11px; color:var(--cp-muted); margin-top:1px; }
    .en-preview-courses { font-size:10px; color:var(--cp-muted); margin-top:3px; }
    .en-msg { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:9px; font-size:12px; font-weight:600; }
    .en-msg.success { background:rgba(34,197,94,0.08); color:var(--cp-success); border:1px solid rgba(34,197,94,0.2); }
    .en-msg.error   { background:rgba(239,68,68,0.08); color:var(--cp-danger);  border:1px solid rgba(239,68,68,0.2); }
    .en-submit-btn { padding:11px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; }
    .en-submit-btn:hover { opacity:.9; }
    .en-submit-btn:disabled { opacity:.5; cursor:not-allowed; }
    .en-sk { background:linear-gradient(90deg,var(--cp-surface) 25%,var(--cp-surface2) 50%,var(--cp-surface) 75%); background-size:200% 100%; animation:enShimmer 1.4s infinite; }
    @keyframes enShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;