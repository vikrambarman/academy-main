"use client";

import { useState, useEffect } from "react";
import { X, Share2, BookOpen, User, Trash2, Loader } from "lucide-react";

interface Course       { _id: string; name: string; slug: string; syllabus?: { module: string; topics: string[] }[]; }
interface Note         { _id: string; title: string; moduleName: string; courseSlug: string; }
interface StudentBasic { _id: string; name: string; studentId: string; }
interface CurrentShares {
    sharedWithCourses:  string[];
    sharedWithStudents: StudentBasic[];
    sharedModuleNames:  Record<string, string>;
    primaryModuleName:  string;
}

interface Props {
    note:      Note;
    courses:   Course[];
    onClose:   () => void;
    showToast: (msg: string, type: "success" | "error") => void;
}

export default function ShareNoteModal({ note, courses, onClose, showToast }: Props) {

    const [tab,              setTab]              = useState<"course" | "student">("course");
    const [currentShares,    setCurrentShares]    = useState<CurrentShares>({
        sharedWithCourses:  [],
        sharedWithStudents: [],
        sharedModuleNames:  {},
        primaryModuleName:  note.moduleName,
    });
    const [selectedCourses,  setSelectedCourses]  = useState<string[]>([]);
    // moduleNames: courseSlug → moduleName mapping jo admin select karega
    const [moduleNames,      setModuleNames]      = useState<Record<string, string>>({});
    const [students,         setStudents]         = useState<StudentBasic[]>([]);
    const [selectedStudent,  setSelectedStudent]  = useState("");
    const [loadingShares,    setLoadingShares]    = useState(true);
    const [loadingStudents,  setLoadingStudents]  = useState(true);
    const [saving,           setSaving]           = useState(false);
    const [removing,         setRemoving]         = useState<string | null>(null);
    const [shareRouteExists, setShareRouteExists] = useState(true);

    useEffect(() => {
        async function loadData() {
            // 1. Shares fetch
            try {
                const r = await fetch(`/api/admin/notes/${note._id}/share`, {
                    credentials: "include",
                });
                if (r.status === 404) {
                    setShareRouteExists(false);
                } else if (r.ok) {
                    const d = await r.json();
                    if (d.success) {
                        setCurrentShares({
                            sharedWithCourses:  d.sharedWithCourses  || [],
                            sharedWithStudents: d.sharedWithStudents || [],
                            sharedModuleNames:  d.sharedModuleNames  || {},
                            primaryModuleName:  d.primaryModuleName  || note.moduleName,
                        });
                    }
                }
            } catch (err) {
                console.warn("Shares fetch error:", err);
            } finally {
                setLoadingShares(false);
            }

            // 2. Students fetch
            try {
                const r = await fetch("/api/admin/students", { credentials: "include" });
                if (r.ok) {
                    const d = await r.json();
                    setStudents(Array.isArray(d) ? d : (d.students || []));
                }
            } catch (err) {
                console.warn("Students fetch error:", err);
            } finally {
                setLoadingStudents(false);
            }
        }
        loadData();
    }, [note._id]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Jab course select ho tab default module name set karo
    const handleCourseSelect = (slugs: string[]) => {
        setSelectedCourses(slugs);
        // Naye selected courses ke liye default module name = note ka original module
        const updated = { ...moduleNames };
        slugs.forEach(slug => {
            if (!updated[slug]) updated[slug] = note.moduleName;
        });
        setModuleNames(updated);
    };

    const availableCourses = courses.filter(
        c => c.slug !== note.courseSlug &&
             !currentShares.sharedWithCourses.includes(c.slug)
    );

    const availableStudents = students.filter(
        s => !currentShares.sharedWithStudents.some(cs => cs._id === s._id)
    );

    // Course share
    const handleShareCourse = async () => {
        if (!selectedCourses.length) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/notes/${note._id}/share`, {
                method:      "POST",
                credentials: "include",
                headers:     { "Content-Type": "application/json" },
                body:        JSON.stringify({
                    type:        "course",
                    courseSlugs: selectedCourses,
                    moduleNames,   // ← module name mapping bhi bhejo
                }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || "Share nahi hua");
            showToast(d.message || "Share ho gaya ✓", "success");
            setCurrentShares(prev => ({
                ...prev,
                sharedWithCourses: [...prev.sharedWithCourses, ...selectedCourses],
                sharedModuleNames: { ...prev.sharedModuleNames, ...moduleNames },
            }));
            setSelectedCourses([]);
            setModuleNames({});
        } catch (err: any) {
            showToast(err.message || "Share nahi hua", "error");
        } finally {
            setSaving(false);
        }
    };

    // Student share
    const handleShareStudent = async () => {
        if (!selectedStudent) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/notes/${note._id}/share`, {
                method:      "POST",
                credentials: "include",
                headers:     { "Content-Type": "application/json" },
                body:        JSON.stringify({ type: "student", studentId: selectedStudent }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || "Share nahi hua");
            showToast(d.message || "Share ho gaya ✓", "success");
            const found = students.find(s => s._id === selectedStudent);
            if (found) {
                setCurrentShares(prev => ({
                    ...prev,
                    sharedWithStudents: [...prev.sharedWithStudents, found],
                }));
            }
            setSelectedStudent("");
        } catch (err: any) {
            showToast(err.message || "Share nahi hua", "error");
        } finally {
            setSaving(false);
        }
    };

    // Course share remove
    const handleRemoveCourse = async (slug: string) => {
        setRemoving(slug);
        try {
            const res = await fetch(`/api/admin/notes/${note._id}/share`, {
                method:      "DELETE",
                credentials: "include",
                headers:     { "Content-Type": "application/json" },
                body:        JSON.stringify({ type: "course", courseSlug: slug }),
            });
            if (!res.ok) throw new Error();
            setCurrentShares(prev => {
                const newModuleNames = { ...prev.sharedModuleNames };
                delete newModuleNames[slug];
                return {
                    ...prev,
                    sharedWithCourses: prev.sharedWithCourses.filter(s => s !== slug),
                    sharedModuleNames: newModuleNames,
                };
            });
            showToast("Course share hata diya", "success");
        } catch {
            showToast("Remove nahi hua", "error");
        } finally {
            setRemoving(null);
        }
    };

    // Student share remove
    const handleRemoveStudent = async (studentId: string) => {
        setRemoving(studentId);
        try {
            const res = await fetch(`/api/admin/notes/${note._id}/share`, {
                method:      "DELETE",
                credentials: "include",
                headers:     { "Content-Type": "application/json" },
                body:        JSON.stringify({ type: "student", studentId }),
            });
            if (!res.ok) throw new Error();
            setCurrentShares(prev => ({
                ...prev,
                sharedWithStudents: prev.sharedWithStudents.filter(s => s._id !== studentId),
            }));
            showToast("Student share hata diya", "success");
        } catch {
            showToast("Remove nahi hua", "error");
        } finally {
            setRemoving(null);
        }
    };

    return (
        <>
            <style>{modalStyles}</style>
            <div className="snm-backdrop" onClick={onClose}/>
            <div className="snm-modal" role="dialog" aria-modal="true">

                {/* Header */}
                <div className="snm-header">
                    <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                        <div className="snm-header-icon"><Share2 size={13}/></div>
                        <div style={{ minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:700, color:"var(--cp-text)" }}>Share Note</div>
                            <div style={{ fontSize:10, color:"var(--cp-muted)", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                {note.moduleName} → {note.title}
                            </div>
                        </div>
                    </div>
                    <button className="snm-close-btn" onClick={onClose}><X size={14}/></button>
                </div>

                {/* Primary course badge */}
                <div className="snm-primary-badge">
                    <span style={{ fontSize:10, color:"var(--cp-muted)" }}>Primary course:</span>
                    <span className="snm-primary-slug">{note.courseSlug}</span>
                    <span style={{ fontSize:10, color:"var(--cp-muted)" }}>|</span>
                    <span style={{ fontSize:10, color:"var(--cp-muted)" }}>Module:</span>
                    <span style={{ fontSize:11, fontWeight:700, color:"var(--cp-subtext)" }}>{note.moduleName}</span>
                </div>

                {/* Route missing warning */}
                {!shareRouteExists && (
                    <div style={{ padding:"10px 16px", background:"rgba(239,68,68,0.06)", borderBottom:"1px solid var(--cp-border)" }}>
                        <span style={{ fontSize:11, color:"var(--cp-danger)" }}>
                            ⚠️ Share API route missing — check karo: api/admin/notes/[id]/share/route.ts
                        </span>
                    </div>
                )}

                {/* Tabs */}
                <div className="snm-tabs">
                    <button className={`snm-tab ${tab==="course"?"active":""}`} onClick={() => setTab("course")}>
                        <BookOpen size={11}/> Share with Course
                    </button>
                    <button className={`snm-tab ${tab==="student"?"active":""}`} onClick={() => setTab("student")}>
                        <User size={11}/> Share with Student
                    </button>
                </div>

                {/* Body */}
                <div className="snm-body">

                    {/* COURSE TAB */}
                    {tab === "course" && (
                        <>
                            <div className="snm-field">
                                <label className="snm-label">
                                    Course chunno
                                    <span style={{ color:"var(--cp-border2)", fontWeight:400, marginLeft:4 }}>
                                        (Ctrl/Cmd + click = multiple)
                                    </span>
                                </label>
                                {loadingShares ? (
                                    <div className="snm-skeleton"/>
                                ) : availableCourses.length === 0 ? (
                                    <div className="snm-empty-hint">Saare courses ke saath already share ho chuka hai</div>
                                ) : (
                                    <select
                                        multiple
                                        className="snm-select"
                                        size={Math.min(availableCourses.length, 5)}
                                        value={selectedCourses}
                                        onChange={e => handleCourseSelect(
                                            Array.from(e.target.selectedOptions, o => o.value)
                                        )}
                                    >
                                        {availableCourses.map(c => (
                                            <option key={c._id} value={c.slug}>{c.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Selected courses ke liye module name inputs */}
                            {selectedCourses.length > 0 && (
                                <div className="snm-module-section">
                                    <div className="snm-module-section-title">
                                        Har course mein konse module ke andar dikhega?
                                    </div>
                                    {selectedCourses.map(slug => {
                                        const courseName = courses.find(c => c.slug === slug)?.name || slug;
                                        const targetCourse = courses.find(c => c.slug === slug);
                                        const moduleOptions = targetCourse?.syllabus?.map(s => s.module) || [];
                                        return (
                                            <div key={slug} className="snm-module-row">
                                                <div className="snm-module-course-name">{courseName}</div>
                                                {moduleOptions.length > 0 ? (
                                                    // Course ke syllabus se modules available hain
                                                    <select
                                                        className="snm-select snm-module-select"
                                                        value={moduleNames[slug] || note.moduleName}
                                                        onChange={e => setModuleNames(prev => ({
                                                            ...prev,
                                                            [slug]: e.target.value,
                                                        }))}
                                                    >
                                                        {moduleOptions.map((mod, i) => (
                                                            <option key={i} value={mod}>{mod}</option>
                                                        ))}
                                                        {/* Original module bhi option mein raho */}
                                                        {!moduleOptions.includes(note.moduleName) && (
                                                            <option value={note.moduleName}>
                                                                {note.moduleName} (original)
                                                            </option>
                                                        )}
                                                    </select>
                                                ) : (
                                                    // Syllabus nahi hai — free text input
                                                    <input
                                                        className="snm-select snm-module-select"
                                                        placeholder={`Module name (default: ${note.moduleName})`}
                                                        value={moduleNames[slug] || note.moduleName}
                                                        onChange={e => setModuleNames(prev => ({
                                                            ...prev,
                                                            [slug]: e.target.value,
                                                        }))}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <button
                                className="snm-share-btn"
                                onClick={handleShareCourse}
                                disabled={saving || !selectedCourses.length || !shareRouteExists}
                            >
                                {saving
                                    ? <><Loader size={11} className="snm-spin"/> Sharing...</>
                                    : <><Share2 size={11}/> Share with {selectedCourses.length || 0} course(s)</>
                                }
                            </button>

                            {/* Already shared */}
                            {!loadingShares && currentShares.sharedWithCourses.length > 0 && (
                                <div className="snm-shared-section">
                                    <div className="snm-shared-section-title">
                                        Already shared with {currentShares.sharedWithCourses.length} course(s):
                                    </div>
                                    {currentShares.sharedWithCourses.map(slug => {
                                        const courseName = courses.find(c => c.slug === slug)?.name || slug;
                                        const moduleName = currentShares.sharedModuleNames[slug] || note.moduleName;
                                        return (
                                            <div key={slug} className="snm-shared-row">
                                                <div className="snm-shared-icon course"><BookOpen size={10}/></div>
                                                <div style={{ flex:1, minWidth:0 }}>
                                                    <div className="snm-shared-name">{courseName}</div>
                                                    <div className="snm-shared-sub">
                                                        Module: <strong>{moduleName}</strong>
                                                    </div>
                                                </div>
                                                <button
                                                    className="snm-remove-btn"
                                                    onClick={() => handleRemoveCourse(slug)}
                                                    disabled={removing === slug}
                                                >
                                                    {removing === slug
                                                        ? <Loader size={9} className="snm-spin"/>
                                                        : <Trash2 size={10}/>
                                                    }
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {/* STUDENT TAB */}
                    {tab === "student" && (
                        <>
                            <div className="snm-field">
                                <label className="snm-label">Student chunno</label>
                                {loadingStudents ? (
                                    <div className="snm-skeleton"/>
                                ) : availableStudents.length === 0 ? (
                                    <div className="snm-empty-hint">
                                        {students.length === 0
                                            ? "Students load nahi hue — page refresh karo"
                                            : "Saare students ke saath already share ho chuka hai"
                                        }
                                    </div>
                                ) : (
                                    <select
                                        className="snm-select"
                                        value={selectedStudent}
                                        onChange={e => setSelectedStudent(e.target.value)}
                                    >
                                        <option value="">-- Student chunno --</option>
                                        {availableStudents.map(s => (
                                            <option key={s._id} value={s._id}>
                                                {s.name} ({s.studentId})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <button
                                className="snm-share-btn"
                                onClick={handleShareStudent}
                                disabled={saving || !selectedStudent || !shareRouteExists}
                            >
                                {saving
                                    ? <><Loader size={11} className="snm-spin"/> Sharing...</>
                                    : <><Share2 size={11}/> Share with Student</>
                                }
                            </button>

                            {/* Already shared students */}
                            {!loadingShares && currentShares.sharedWithStudents.length > 0 && (
                                <div className="snm-shared-section">
                                    <div className="snm-shared-section-title">
                                        Already shared with {currentShares.sharedWithStudents.length} student(s):
                                    </div>
                                    {currentShares.sharedWithStudents.map(s => (
                                        <div key={s._id} className="snm-shared-row">
                                            <div className="snm-shared-icon student"><User size={10}/></div>
                                            <div style={{ flex:1, minWidth:0 }}>
                                                <div className="snm-shared-name">{s.name}</div>
                                                <div className="snm-shared-sub">{s.studentId}</div>
                                            </div>
                                            <button
                                                className="snm-remove-btn"
                                                onClick={() => handleRemoveStudent(s._id)}
                                                disabled={removing === s._id}
                                            >
                                                {removing === s._id
                                                    ? <Loader size={9} className="snm-spin"/>
                                                    : <Trash2 size={10}/>
                                                }
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="snm-footer">
                    <span style={{ fontSize:10, color:"var(--cp-muted)" }}>
                        Shared notes student ke portal mein visible honge
                    </span>
                    <button className="snm-done-btn" onClick={onClose}>Done</button>
                </div>
            </div>
        </>
    );
}

const modalStyles = `
    @keyframes snmSpin { to { transform: rotate(360deg); } }
    @keyframes snmFadeIn { from { opacity:0; transform:translate(-50%,-47%); } to { opacity:1; transform:translate(-50%,-50%); } }

    .snm-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:998; backdrop-filter:blur(3px); }
    .snm-modal    { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:999; width:460px; max-width:94vw; max-height:90vh; background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:16px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 32px 80px rgba(0,0,0,0.4); font-family:'Plus Jakarta Sans',sans-serif; animation:snmFadeIn 0.2s ease; }

    .snm-header      { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:14px 16px; background:var(--cp-surface2); border-bottom:1px solid var(--cp-border); flex-shrink:0; }
    .snm-header-icon { width:30px; height:30px; border-radius:8px; background:rgba(99,102,241,0.1); color:#6366f1; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid rgba(99,102,241,0.2); }
    .snm-close-btn   { width:28px; height:28px; border-radius:7px; border:1px solid var(--cp-border); background:transparent; color:var(--cp-muted); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .13s; }
    .snm-close-btn:hover { background:var(--cp-bg); color:var(--cp-text); }

    .snm-primary-badge { display:flex; align-items:center; gap:6px; padding:8px 16px; background:rgba(99,102,241,0.04); border-bottom:1px solid var(--cp-border); flex-wrap:wrap; flex-shrink:0; }
    .snm-primary-slug  { font-size:11px; font-weight:700; color:#6366f1; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); padding:2px 8px; border-radius:100px; }

    .snm-tabs { display:flex; border-bottom:1px solid var(--cp-border); flex-shrink:0; }
    .snm-tab  { flex:1; display:flex; align-items:center; justify-content:center; gap:5px; padding:11px 10px; border:none; background:transparent; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:600; color:var(--cp-muted); cursor:pointer; border-bottom:2px solid transparent; transition:all .14s; }
    .snm-tab:hover  { color:var(--cp-text); background:var(--cp-surface2); }
    .snm-tab.active { color:#6366f1; border-bottom-color:#6366f1; background:rgba(99,102,241,0.04); }

    .snm-body { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:14px; scrollbar-width:thin; scrollbar-color:var(--cp-border) transparent; }
    .snm-body::-webkit-scrollbar { width:4px; }
    .snm-body::-webkit-scrollbar-thumb { background:var(--cp-border); border-radius:4px; }

    .snm-field { display:flex; flex-direction:column; gap:6px; }
    .snm-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }
    .snm-select { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; padding:8px 10px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:9px; color:var(--cp-text); outline:none; width:100%; transition:border-color .15s; }
    .snm-select:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.12); }
    .snm-select option { background:var(--cp-surface); }

    .snm-module-section       { background:var(--cp-surface2); border:1px solid var(--cp-border); border-radius:10px; overflow:hidden; }
    .snm-module-section-title { padding:8px 12px; font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--cp-muted); border-bottom:1px solid var(--cp-border); }
    .snm-module-row           { padding:10px 12px; border-bottom:1px solid var(--cp-border); display:flex; flex-direction:column; gap:6px; }
    .snm-module-row:last-child { border-bottom:none; }
    .snm-module-course-name   { font-size:11px; font-weight:600; color:var(--cp-text); }
    .snm-module-select        { font-size:12px !important; padding:6px 8px !important; }

    .snm-share-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; background:#6366f1; color:#fff; transition:opacity .15s; align-self:flex-start; }
    .snm-share-btn:disabled { opacity:.4; cursor:not-allowed; }
    .snm-share-btn:hover:not(:disabled) { opacity:.88; }

    .snm-shared-section       { background:var(--cp-surface2); border:1px solid var(--cp-border); border-radius:10px; overflow:hidden; }
    .snm-shared-section-title { padding:8px 12px; font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--cp-muted); border-bottom:1px solid var(--cp-border); }
    .snm-shared-row           { display:flex; align-items:center; gap:10px; padding:9px 12px; border-bottom:1px solid var(--cp-border); transition:background .12s; }
    .snm-shared-row:last-child { border-bottom:none; }
    .snm-shared-row:hover     { background:var(--cp-bg); }

    .snm-shared-icon         { width:24px; height:24px; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .snm-shared-icon.course  { background:rgba(99,102,241,0.1); color:#6366f1; border:1px solid rgba(99,102,241,0.2); }
    .snm-shared-icon.student { background:rgba(20,184,166,0.1); color:#0d9488; border:1px solid rgba(20,184,166,0.2); }
    .snm-shared-name { font-size:12px; font-weight:600; color:var(--cp-text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .snm-shared-sub  { font-size:10px; color:var(--cp-muted); margin-top:1px; }

    .snm-remove-btn { width:24px; height:24px; border-radius:6px; border:1px solid rgba(239,68,68,0.2); background:rgba(239,68,68,0.06); color:var(--cp-danger); cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .13s; }
    .snm-remove-btn:hover:not(:disabled) { background:rgba(239,68,68,0.15); }
    .snm-remove-btn:disabled { opacity:.5; cursor:not-allowed; }

    .snm-spin     { animation:snmSpin .7s linear infinite; }
    .snm-skeleton { height:36px; background:var(--cp-border); border-radius:8px; opacity:.5; animation:snmSkel 1.4s ease-in-out infinite; }
    @keyframes snmSkel { 0%,100%{opacity:.4} 50%{opacity:.8} }
    .snm-empty-hint { font-size:11px; color:var(--cp-muted); background:var(--cp-surface2); border:1px dashed var(--cp-border); border-radius:8px; padding:10px 12px; text-align:center; }

    .snm-footer   { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 16px; border-top:1px solid var(--cp-border); background:var(--cp-surface2); flex-shrink:0; }
    .snm-done-btn { padding:7px 18px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all .13s; }
    .snm-done-btn:hover { border-color:var(--cp-border2); color:var(--cp-text); }
`;