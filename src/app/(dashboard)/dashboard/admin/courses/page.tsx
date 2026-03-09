// app/dashboard/admin/courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { COURSE_LEVELS } from "@/lib/constants/courseConfig";
import {
    Plus, X, Edit2, Trash2, ToggleLeft, ToggleRight,
    BookOpen, Upload, ChevronDown, ChevronUp
} from "lucide-react";

/* ─── Types ───────────────────────────────────────── */
interface TopicItem { value: string; }
interface ModuleItem { module: string; topics: TopicItem[]; }
interface CourseItem {
    _id: string; name: string; level: string;
    duration?: string; eligibility?: string; certificate?: string;
    banner?: string; isActive: boolean;
    designedFor: string[]; careerOpportunities: string[];
    syllabus?: { module: string; topics: string[] }[];
}

const EMPTY_FORM = { name: "", level: "", duration: "", eligibility: "", certificate: "" };

/* ─── Tag List Editor ─────────────────────────────── */
function TagEditor({ label, items, onChange, onAdd, onRemove, placeholder }: {
    label: string; items: string[]; placeholder: string;
    onChange: (i: number, v: string) => void;
    onAdd: () => void; onRemove: (i: number) => void;
}) {
    return (
        <div className="ac-field">
            <div className="ac-label">{label}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 6 }}>
                        <input
                            className="ac-input" style={{ flex: 1 }}
                            placeholder={placeholder} value={item}
                            onChange={e => onChange(i, e.target.value)}
                        />
                        {items.length > 1 && (
                            <button className="ac-icon-btn danger" onClick={() => onRemove(i)}>
                                <X size={12} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button className="ac-text-btn" onClick={onAdd} style={{ marginTop: 4 }}>
                <Plus size={11} /> Add {label}
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════ */
export default function AdminCourses() {
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [designedFor, setDesignedFor] = useState<string[]>([""]);
    const [careerOpportunities, setCareerOpportunities] = useState<string[]>([""]);
    const [syllabus, setSyllabus] = useState<ModuleItem[]>([{ module: "", topics: [{ value: "" }] }]);
    const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));

    const fetchCourses = async () => {
        const res = await fetchWithAuth("/api/admin/courses");
        setCourses(await res.json() || []);
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    /* ── designedFor ── */
    const handleDesignedForChange = (i: number, v: string) => { const u = [...designedFor]; u[i] = v; setDesignedFor(u); };
    const addDesignedFor = () => setDesignedFor([...designedFor, ""]);
    const removeDesignedFor = (i: number) => setDesignedFor(designedFor.filter((_, idx) => idx !== i));

    /* ── careerOpportunities ── */
    const handleCareerChange = (i: number, v: string) => { const u = [...careerOpportunities]; u[i] = v; setCareerOpportunities(u); };
    const addCareer = () => setCareerOpportunities([...careerOpportunities, ""]);
    const removeCareer = (i: number) => setCareerOpportunities(careerOpportunities.filter((_, idx) => idx !== i));

    /* ── Syllabus ── */
    const addModule = () => {
        const idx = syllabus.length;
        setSyllabus([...syllabus, { module: "", topics: [{ value: "" }] }]);
        setExpandedModules(p => new Set(p).add(idx));
    };
    const removeModule = (i: number) => {
        setSyllabus(syllabus.filter((_, idx) => idx !== i));
        setExpandedModules(p => { const n = new Set(p); n.delete(i); return n; });
    };
    const toggleModule = (i: number) => setExpandedModules(p => {
        const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n;
    });
    const handleModuleName = (i: number, v: string) => { const u = [...syllabus]; u[i].module = v; setSyllabus(u); };
    const addTopic = (mi: number) => { const u = [...syllabus]; u[mi].topics.push({ value: "" }); setSyllabus(u); };
    const removeTopic = (mi: number, ti: number) => { const u = [...syllabus]; u[mi].topics = u[mi].topics.filter((_, i) => i !== ti); setSyllabus(u); };
    const handleTopicChange = (mi: number, ti: number, v: string) => { const u = [...syllabus]; u[mi].topics[ti].value = v; setSyllabus(u); };

    /* ── Submit ── */
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const fmtSyllabus = syllabus.filter(m => m.module.trim()).map(m => ({
                module: m.module.trim(),
                topics: m.topics.map(t => t.value.trim()).filter(Boolean),
            }));
            const method = editId ? "PUT" : "POST";
            const res = await fetchWithAuth("/api/admin/courses", {
                method, headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...(editId && { id: editId }), ...form,
                    syllabus: fmtSyllabus,
                    designedFor: designedFor.map(s => s.trim()).filter(Boolean),
                    careerOpportunities: careerOpportunities.map(s => s.trim()).filter(Boolean),
                }),
            });
            if (bannerFile && editId) {
                const fd = new FormData();
                fd.append("file", bannerFile); fd.append("courseId", editId);
                await fetchWithAuth("/api/admin/courses/upload-banner", { method: "POST", body: fd });
            }
            resetForm(); fetchCourses();
        } catch { console.error("Course save failed"); }
        finally { setLoading(false); }
    };

    /* ── Reset ── */
    const resetForm = () => {
        setForm(EMPTY_FORM);
        setSyllabus([{ module: "", topics: [{ value: "" }] }]);
        setDesignedFor([""]); setCareerOpportunities([""]);
        setEditId(null); setBannerFile(null);
        setExpandedModules(new Set([0]));
    };

    /* ── Edit ── */
    const handleEdit = (c: CourseItem) => {
        setEditId(c._id);
        setForm({ name: c.name, level: c.level, duration: c.duration || "", eligibility: c.eligibility || "", certificate: c.certificate || "" });
        setDesignedFor(c.designedFor?.length ? c.designedFor : [""]);
        setCareerOpportunities(c.careerOpportunities?.length ? c.careerOpportunities : [""]);
        setSyllabus(c.syllabus?.length
            ? c.syllabus.map(m => ({ module: m.module, topics: m.topics.map(t => ({ value: t })) }))
            : [{ module: "", topics: [{ value: "" }] }]);
        setExpandedModules(new Set([0]));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ── Delete ── */
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this course?")) return;
        await fetchWithAuth(`/api/admin/courses?id=${id}`, { method: "DELETE" });
        fetchCourses();
    };

    /* ── Toggle Active ── */
    const toggleActive = async (c: CourseItem) => {
        await fetchWithAuth("/api/admin/courses", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: c._id, isActive: !c.isActive }),
        });
        fetchCourses();
    };

    return (
        <>
            <style>{acStyles}</style>
            <div className="ac-root">

                {/* ── Page header ── */}
                <div className="ac-page-header">
                    <div>
                        <h1 className="ac-page-title">{editId ? "Edit Course" : "Courses"}</h1>
                        <p className="ac-page-sub">{courses.length} courses configured</p>
                    </div>
                    {editId && (
                        <button className="ac-ghost-btn" onClick={resetForm}>
                            <X size={13} /> Cancel Edit
                        </button>
                    )}
                </div>

                <div className="ac-grid">

                    {/* ════ LEFT — FORM ════ */}
                    <div className="ac-card">
                        <div className="ac-card-head">
                            <BookOpen size={13} style={{ color: "#f59e0b" }} />
                            <span>{editId ? "Update Course" : "Create New Course"}</span>
                        </div>
                        <div className="ac-card-body">

                            {/* Basic info */}
                            <div className="ac-section-label">Basic Info</div>
                            <div className="ac-field">
                                <label className="ac-label">Course Name</label>
                                <input className="ac-input" name="name" placeholder="e.g. DCA, Tally Prime" value={form.name} onChange={handleChange} />
                            </div>
                            <div className="ac-form-grid">
                                <div className="ac-field">
                                    <label className="ac-label">Level / Authority</label>
                                    <select className="ac-select" name="level" value={form.level} onChange={handleChange}>
                                        <option value="">Select Level</option>
                                        {COURSE_LEVELS.map(item => (
                                            <option key={item.level} value={item.level}>{item.level}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="ac-field">
                                    <label className="ac-label">Duration</label>
                                    <input className="ac-input" name="duration" placeholder="e.g. 3 Months" value={form.duration} onChange={handleChange} />
                                </div>
                                <div className="ac-field">
                                    <label className="ac-label">Eligibility</label>
                                    <input className="ac-input" name="eligibility" placeholder="e.g. 10th Pass" value={form.eligibility} onChange={handleChange} />
                                </div>
                                <div className="ac-field">
                                    <label className="ac-label">Certificate Info</label>
                                    <input className="ac-input" name="certificate" placeholder="Certificate type" value={form.certificate} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Banner */}
                            <div className="ac-section-label">Course Banner</div>
                            <label className="ac-upload-zone">
                                <Upload size={16} style={{ color: "#475569" }} />
                                <span style={{ fontSize: 12, color: "#64748b" }}>
                                    {bannerFile ? bannerFile.name : "Click to upload banner image"}
                                </span>
                                <input type="file" accept="image/*" style={{ display: "none" }}
                                    onChange={e => setBannerFile(e.target.files?.[0] || null)} />
                            </label>
                            {!editId && bannerFile && (
                                <p style={{ fontSize: 10, color: "#f59e0b", marginTop: 4 }}>
                                    ⚠️ Banner will upload after saving the course first
                                </p>
                            )}

                            {/* Designed For */}
                            <div className="ac-section-label">Audience & Careers</div>
                            <TagEditor label="Designed For" items={designedFor} placeholder="e.g. Students, Professionals"
                                onChange={handleDesignedForChange} onAdd={addDesignedFor} onRemove={removeDesignedFor} />
                            <TagEditor label="Career Opportunities" items={careerOpportunities} placeholder="e.g. Data Entry Operator"
                                onChange={handleCareerChange} onAdd={addCareer} onRemove={removeCareer} />

                            {/* Syllabus */}
                            <div className="ac-section-label">Syllabus Modules</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {syllabus.map((mod, mi) => (
                                    <div key={mi} className="ac-module-card">
                                        <div className="ac-module-head" onClick={() => toggleModule(mi)}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                                                <span className="ac-module-num">M{mi + 1}</span>
                                                <input
                                                    className="ac-module-name-input"
                                                    placeholder="Module name..."
                                                    value={mod.module}
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={e => handleModuleName(mi, e.target.value)}
                                                />
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span style={{ fontSize: 10, color: "#475569" }}>{mod.topics.length} topics</span>
                                                {syllabus.length > 1 && (
                                                    <button className="ac-icon-btn danger" onClick={e => { e.stopPropagation(); removeModule(mi); }}>
                                                        <X size={11} />
                                                    </button>
                                                )}
                                                {expandedModules.has(mi)
                                                    ? <ChevronUp size={13} style={{ color: "#64748b" }} />
                                                    : <ChevronDown size={13} style={{ color: "#64748b" }} />}
                                            </div>
                                        </div>
                                        {expandedModules.has(mi) && (
                                            <div className="ac-module-body">
                                                {mod.topics.map((topic, ti) => (
                                                    <div key={ti} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                                        <input
                                                            className="ac-input" style={{ flex: 1, fontSize: 12 }}
                                                            placeholder={`Topic ${ti + 1}`}
                                                            value={topic.value}
                                                            onChange={e => handleTopicChange(mi, ti, e.target.value)}
                                                        />
                                                        {mod.topics.length > 1 && (
                                                            <button className="ac-icon-btn danger" onClick={() => removeTopic(mi, ti)}>
                                                                <X size={11} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button className="ac-text-btn" onClick={() => addTopic(mi)}>
                                                    <Plus size={10} /> Add Topic
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button className="ac-outline-btn" onClick={addModule}>
                                    <Plus size={13} /> Add Module
                                </button>
                            </div>

                            {/* Submit */}
                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                <button className="ac-submit-btn" onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Saving..." : editId ? "Update Course" : "Save Course"}
                                </button>
                                {editId && (
                                    <button className="ac-ghost-btn" onClick={resetForm}>Cancel</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ════ RIGHT — COURSE LIST ════ */}
                    <div className="ac-card">
                        <div className="ac-card-head">
                            <BookOpen size={13} style={{ color: "#f59e0b" }} />
                            <span>Existing Courses ({courses.length})</span>
                        </div>
                        <div style={{ padding: "8px 0" }}>
                            {courses.length === 0 ? (
                                <div className="ac-empty">
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
                                    <div style={{ fontSize: 13, color: "#64748b" }}>No courses yet — create one!</div>
                                </div>
                            ) : courses.map(course => (
                                <div key={course._id} className="ac-course-row">
                                    {/* Banner */}
                                    <div className="ac-course-banner">
                                        {course.banner
                                            ? <img src={course.banner} alt={course.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            : <BookOpen size={16} style={{ color: "#475569" }} />}
                                    </div>
                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                                            <span className="ac-course-name">{course.name}</span>
                                            <span className={`ac-active-dot ${course.isActive ? "on" : "off"}`} />
                                        </div>
                                        <div className="ac-course-level">{course.level}</div>
                                        <div className="ac-course-meta">
                                            {course.duration && <span>{course.duration}</span>}
                                            <span>{course.syllabus?.length || 0} modules</span>
                                            <span>{course.designedFor?.length || 0} audience</span>
                                            <span>{course.careerOpportunities?.length || 0} careers</span>
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="ac-course-actions">
                                        <button className="ac-icon-btn amber" onClick={() => handleEdit(course)} title="Edit">
                                            <Edit2 size={12} />
                                        </button>
                                        <button
                                            className={`ac-icon-btn ${course.isActive ? "success" : "muted"}`}
                                            onClick={() => toggleActive(course)}
                                            title={course.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {course.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                        </button>
                                        <button className="ac-icon-btn danger" onClick={() => handleDelete(course._id)} title="Delete">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

/* ─── Styles ─────────────────────────────────────── */
const acStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

    .ac-root { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:20px; }

    .ac-page-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .ac-page-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .ac-page-sub    { font-size:12px; color:#475569; margin-top:3px; }

    .ac-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:start; }
    @media(max-width:900px){ .ac-grid { grid-template-columns:1fr; } }

    /* Card */
    .ac-card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .ac-card-head {
        display:flex; align-items:center; gap:7px; padding:13px 18px;
        border-bottom:1px solid #222; background:#1f1f1f;
        font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#94a3b8;
    }
    .ac-card-body { padding:18px; display:flex; flex-direction:column; gap:14px; }

    .ac-section-label {
        font-size:9.5px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
        color:#475569; padding-bottom:6px; border-bottom:1px solid #222;
    }

    .ac-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    @media(max-width:560px){ .ac-form-grid { grid-template-columns:1fr; } }

    .ac-field { display:flex; flex-direction:column; gap:5px; }
    .ac-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }

    .ac-input, .ac-select {
        font-family:'Plus Jakarta Sans',sans-serif;
        padding:9px 12px; font-size:13px;
        background:#111; border:1px solid #2a2a2a; border-radius:8px;
        color:#f1f5f9; outline:none; transition:border-color .15s; width:100%;
    }
    .ac-input:focus, .ac-select:focus { border-color:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,.07); }
    .ac-input::placeholder { color:#334155; }
    .ac-select option { background:#1a1a1a; }

    /* Upload zone */
    .ac-upload-zone {
        display:flex; align-items:center; gap:10px; cursor:pointer;
        padding:12px 16px; border:1px dashed #2a2a2a; border-radius:9px;
        background:#111; transition:border-color .15s;
    }
    .ac-upload-zone:hover { border-color:#f59e0b; }

    /* Module card */
    .ac-module-card { background:#111; border:1px solid #2a2a2a; border-radius:9px; overflow:hidden; }
    .ac-module-head {
        display:flex; align-items:center; justify-content:space-between;
        padding:10px 12px; cursor:pointer; gap:8px;
        transition:background .13s;
    }
    .ac-module-head:hover { background:rgba(245,158,11,.04); }
    .ac-module-num {
        width:22px; height:22px; border-radius:6px; flex-shrink:0;
        background:rgba(245,158,11,.12); color:#f59e0b;
        display:flex; align-items:center; justify-content:center;
        font-size:9px; font-weight:800;
    }
    .ac-module-name-input {
        font-family:'Plus Jakarta Sans',sans-serif;
        flex:1; background:transparent; border:none; outline:none;
        color:#f1f5f9; font-size:12px; font-weight:600;
        min-width:0;
    }
    .ac-module-name-input::placeholder { color:#334155; }
    .ac-module-body { padding:10px 12px 12px; border-top:1px solid #1f1f1f; }

    /* Buttons */
    .ac-submit-btn {
        flex:1; padding:11px; border-radius:9px; border:none; cursor:pointer;
        font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
        background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208;
        transition:opacity .15s;
    }
    .ac-submit-btn:hover { opacity:.9; }
    .ac-submit-btn:disabled { opacity:.5; cursor:not-allowed; }

    .ac-outline-btn {
        display:flex; align-items:center; justify-content:center; gap:6px;
        width:100%; padding:9px; border-radius:8px;
        border:1px dashed #2a2a2a; background:transparent;
        color:#64748b; font-size:12px; font-weight:600; cursor:pointer;
        font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s;
    }
    .ac-outline-btn:hover { border-color:#f59e0b; color:#f59e0b; background:rgba(245,158,11,.04); }

    .ac-ghost-btn {
        display:inline-flex; align-items:center; gap:6px;
        padding:9px 16px; border-radius:8px; border:1px solid #2a2a2a;
        background:transparent; color:#64748b; font-size:12px; font-weight:600;
        cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s;
        white-space:nowrap;
    }
    .ac-ghost-btn:hover { border-color:#475569; color:#94a3b8; }

    .ac-text-btn {
        display:inline-flex; align-items:center; gap:4px;
        background:none; border:none; cursor:pointer; padding:4px 0;
        font-family:'Plus Jakarta Sans',sans-serif;
        font-size:11px; font-weight:600; color:#f59e0b; transition:opacity .13s;
    }
    .ac-text-btn:hover { opacity:.75; }

    .ac-icon-btn {
        width:28px; height:28px; border-radius:7px; border:1px solid; cursor:pointer;
        display:flex; align-items:center; justify-content:center; transition:all .13s;
        flex-shrink:0;
    }
    .ac-icon-btn.amber   { background:rgba(245,158,11,.08); color:#f59e0b; border-color:rgba(245,158,11,.2); }
    .ac-icon-btn.amber:hover { background:rgba(245,158,11,.18); }
    .ac-icon-btn.danger  { background:rgba(239,68,68,.08); color:#ef4444; border-color:rgba(239,68,68,.2); }
    .ac-icon-btn.danger:hover { background:rgba(239,68,68,.18); }
    .ac-icon-btn.success { background:rgba(34,197,94,.08); color:#22c55e; border-color:rgba(34,197,94,.2); }
    .ac-icon-btn.success:hover { background:rgba(34,197,94,.18); }
    .ac-icon-btn.muted   { background:rgba(100,116,139,.08); color:#64748b; border-color:rgba(100,116,139,.2); }
    .ac-icon-btn.muted:hover { background:rgba(100,116,139,.18); }

    /* Course list */
    .ac-course-row {
        display:flex; align-items:center; gap:12px; padding:12px 18px;
        border-bottom:1px solid #1f1f1f; transition:background .12s;
    }
    .ac-course-row:last-child { border-bottom:none; }
    .ac-course-row:hover { background:rgba(245,158,11,.03); }

    .ac-course-banner {
        width:52px; height:38px; border-radius:7px; flex-shrink:0;
        background:#111; border:1px solid #2a2a2a; overflow:hidden;
        display:flex; align-items:center; justify-content:center;
    }
    .ac-course-name  { font-size:13px; font-weight:700; color:#f1f5f9; }
    .ac-course-level { font-size:10px; color:#64748b; margin-bottom:4px; }
    .ac-course-meta  { display:flex; flex-wrap:wrap; gap:8px; font-size:10px; color:#475569; }
    .ac-course-meta span::before { content:'·'; margin-right:8px; }
    .ac-course-meta span:first-child::before { content:''; margin:0; }

    .ac-active-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
    .ac-active-dot.on  { background:#22c55e; box-shadow:0 0 5px rgba(34,197,94,.5); }
    .ac-active-dot.off { background:#475569; }

    .ac-course-actions { display:flex; gap:5px; flex-shrink:0; }

    .ac-empty { padding:40px 20px; text-align:center; }
`;