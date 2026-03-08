"use client";

/**
 * FULL COURSE MANAGEMENT SYSTEM
 * designedFor & careerOpportunities — DB se aata hai, UI se edit hota hai
 * COURSE_LEVELS — sirf courseConfig se (authority/verification ke liye)
 */

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { COURSE_LEVELS } from "@/lib/constants/courseConfig";

interface TopicItem {
    value: string;
}

interface ModuleItem {
    module: string;
    topics: TopicItem[];
}

interface CourseItem {
    _id: string;
    name: string;
    level: string;
    duration?: string;
    eligibility?: string;
    certificate?: string;
    banner?: string;
    isActive: boolean;
    designedFor: string[];
    careerOpportunities: string[];
    syllabus?: {
        module: string;
        topics: string[];
    }[];
}

// ─── Reusable Tag List Editor ─────────────────────────────────────────────────
function TagListEditor({
    label,
    items,
    onChange,
    onAdd,
    onRemove,
    placeholder,
}: {
    label: string;
    items: string[];
    onChange: (index: number, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    placeholder: string;
}) {
    return (
        <div>
            <h3 className="font-semibold mb-2 text-slate-700">{label}</h3>
            {items.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                    <input
                        placeholder={placeholder}
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-sm"
                        value={item}
                        onChange={(e) => onChange(i, e.target.value)}
                    />
                    {items.length > 1 && (
                        <button
                            onClick={() => onRemove(i)}
                            className="text-red-500 px-2 hover:text-red-700"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={onAdd}
                className="text-indigo-600 text-sm hover:text-indigo-800"
            >
                + Add {label}
            </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminCourses() {

    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        name: "",
        level: "",
        duration: "",
        eligibility: "",
        certificate: "",
    });

    // Arrays — stored & loaded from DB
    const [designedFor, setDesignedFor] = useState<string[]>([""]);
    const [careerOpportunities, setCareerOpportunities] = useState<string[]>([""]);

    const [syllabus, setSyllabus] = useState<ModuleItem[]>([
        { module: "", topics: [{ value: "" }] },
    ]);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchCourses = async () => {
        const res = await fetchWithAuth("/api/admin/courses");
        const data = await res.json();
        setCourses(data || []);
    };

    useEffect(() => { fetchCourses(); }, []);

    // ── Form field handler ────────────────────────────────────────────────────
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ── designedFor handlers ──────────────────────────────────────────────────
    const handleDesignedForChange = (i: number, v: string) => {
        const u = [...designedFor]; u[i] = v; setDesignedFor(u);
    };
    const addDesignedFor = () => setDesignedFor([...designedFor, ""]);
    const removeDesignedFor = (i: number) =>
        setDesignedFor(designedFor.filter((_, idx) => idx !== i));

    // ── careerOpportunities handlers ──────────────────────────────────────────
    const handleCareerChange = (i: number, v: string) => {
        const u = [...careerOpportunities]; u[i] = v; setCareerOpportunities(u);
    };
    const addCareer = () => setCareerOpportunities([...careerOpportunities, ""]);
    const removeCareer = (i: number) =>
        setCareerOpportunities(careerOpportunities.filter((_, idx) => idx !== i));

    // ── Syllabus handlers ─────────────────────────────────────────────────────
    const addModule = () =>
        setSyllabus([...syllabus, { module: "", topics: [{ value: "" }] }]);

    const removeModule = (i: number) =>
        setSyllabus(syllabus.filter((_, idx) => idx !== i));

    const handleModuleNameChange = (i: number, v: string) => {
        const u = [...syllabus]; u[i].module = v; setSyllabus(u);
    };

    const addTopic = (mi: number) => {
        const u = [...syllabus]; u[mi].topics.push({ value: "" }); setSyllabus(u);
    };

    const removeTopic = (mi: number, ti: number) => {
        const u = [...syllabus];
        u[mi].topics = u[mi].topics.filter((_, i) => i !== ti);
        setSyllabus(u);
    };

    const handleTopicChange = (mi: number, ti: number, v: string) => {
        const u = [...syllabus]; u[mi].topics[ti].value = v; setSyllabus(u);
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formattedSyllabus = syllabus
                .filter((m) => m.module.trim() !== "")
                .map((m) => ({
                    module: m.module.trim(),
                    topics: m.topics
                        .map((t) => t.value.trim())
                        .filter(Boolean),
                }));

            const cleanDesignedFor = designedFor
                .map((s) => s.trim())
                .filter(Boolean);

            const cleanCareers = careerOpportunities
                .map((s) => s.trim())
                .filter(Boolean);

            const method = editId ? "PUT" : "POST";

            await fetchWithAuth("/api/admin/courses", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...(editId && { id: editId }),
                    ...form,
                    syllabus: formattedSyllabus,
                    designedFor: cleanDesignedFor,
                    careerOpportunities: cleanCareers,
                }),
            });

            // Upload banner separately if selected
            if (bannerFile && editId) {
                const formData = new FormData();
                formData.append("file", bannerFile);
                formData.append("courseId", editId);
                await fetchWithAuth("/api/admin/courses/upload-banner", {
                    method: "POST",
                    body: formData,
                });
            }

            resetForm();
            fetchCourses();
        } catch {
            console.error("Course save failed");
        } finally {
            setLoading(false);
        }
    };

    // ── Reset ─────────────────────────────────────────────────────────────────
    const resetForm = () => {
        setForm({ name: "", level: "", duration: "", eligibility: "", certificate: "" });
        setSyllabus([{ module: "", topics: [{ value: "" }] }]);
        setDesignedFor([""]);
        setCareerOpportunities([""]);
        setEditId(null);
        setBannerFile(null);
    };

    // ── Edit ──────────────────────────────────────────────────────────────────
    const handleEdit = (course: CourseItem) => {
        setEditId(course._id);
        setForm({
            name: course.name,
            level: course.level,
            duration: course.duration || "",
            eligibility: course.eligibility || "",
            certificate: course.certificate || "",
        });

        // Load from DB — no auto-mapping
        setDesignedFor(
            course.designedFor?.length ? course.designedFor : [""]
        );
        setCareerOpportunities(
            course.careerOpportunities?.length ? course.careerOpportunities : [""]
        );

        setSyllabus(
            course.syllabus?.length
                ? course.syllabus.map((m) => ({
                    module: m.module,
                    topics: m.topics.map((t) => ({ value: t })),
                }))
                : [{ module: "", topics: [{ value: "" }] }]
        );
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await fetchWithAuth(`/api/admin/courses?id=${id}`, { method: "DELETE" });
        fetchCourses();
    };

    // ── Toggle Active ─────────────────────────────────────────────────────────
    const toggleActive = async (course: CourseItem) => {
        await fetchWithAuth("/api/admin/courses", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: course._id, isActive: !course.isActive }),
        });
        fetchCourses();
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                {/* ── LEFT: FORM ── */}
                <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6">

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                        {editId ? "Edit Course" : "Create Course"}
                    </h2>

                    {/* Basic Fields */}
                    <div className="space-y-4">
                        <input
                            name="name"
                            placeholder="Course Name"
                            className="w-full border border-slate-300 rounded-lg p-3"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <select
                            name="level"
                            className="w-full border border-slate-300 rounded-lg p-3"
                            value={form.level}
                            onChange={handleChange}
                        >
                            <option value="">Select Level</option>
                            {COURSE_LEVELS.map((item) => (
                                <option key={item.level} value={item.level}>
                                    {item.level}
                                </option>
                            ))}
                        </select>

                        <input
                            name="duration"
                            placeholder="Duration (e.g. 3 Months)"
                            className="w-full border border-slate-300 rounded-lg p-3"
                            value={form.duration}
                            onChange={handleChange}
                        />

                        <input
                            name="eligibility"
                            placeholder="Eligibility"
                            className="w-full border border-slate-300 rounded-lg p-3"
                            value={form.eligibility}
                            onChange={handleChange}
                        />

                        <input
                            name="certificate"
                            placeholder="Certificate Info"
                            className="w-full border border-slate-300 rounded-lg p-3"
                            value={form.certificate}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Banner Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Course Banner
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setBannerFile(e.target.files?.[0] || null)
                            }
                        />
                    </div>

                    {/* Designed For — DB se load, UI se edit */}
                    <TagListEditor
                        label="Designed For"
                        items={designedFor}
                        onChange={handleDesignedForChange}
                        onAdd={addDesignedFor}
                        onRemove={removeDesignedFor}
                        placeholder="e.g. Students, Working Professionals"
                    />

                    {/* Career Opportunities — DB se load, UI se edit */}
                    <TagListEditor
                        label="Career Opportunities"
                        items={careerOpportunities}
                        onChange={handleCareerChange}
                        onAdd={addCareer}
                        onRemove={removeCareer}
                        placeholder="e.g. Data Entry Operator, Accountant"
                    />

                    {/* Syllabus */}
                    <div>
                        <h3 className="font-semibold mb-3 text-slate-700">
                            Syllabus Modules
                        </h3>

                        {syllabus.map((mod, mi) => (
                            <div
                                key={mi}
                                className="border border-slate-200 rounded-lg p-4 mb-4 relative"
                            >
                                {syllabus.length > 1 && (
                                    <button
                                        onClick={() => removeModule(mi)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                )}

                                <input
                                    placeholder="Module Name"
                                    className="w-full border border-slate-300 p-2 mb-3 rounded-lg"
                                    value={mod.module}
                                    onChange={(e) =>
                                        handleModuleNameChange(mi, e.target.value)
                                    }
                                />

                                {mod.topics.map((topic, ti) => (
                                    <div
                                        key={ti}
                                        className="flex flex-col sm:flex-row gap-2 mb-2"
                                    >
                                        <input
                                            placeholder="Topic Name"
                                            className="flex-1 border border-slate-300 p-2 rounded-lg text-sm"
                                            value={topic.value}
                                            onChange={(e) =>
                                                handleTopicChange(mi, ti, e.target.value)
                                            }
                                        />
                                        {mod.topics.length > 1 && (
                                            <button
                                                onClick={() => removeTopic(mi, ti)}
                                                className="text-red-500 self-start sm:self-center hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={() => addTopic(mi)}
                                    className="text-indigo-600 text-sm hover:text-indigo-800"
                                >
                                    + Add Topic
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addModule}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-slate-700"
                        >
                            + Add Module
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition"
                        >
                            {loading
                                ? "Saving..."
                                : editId
                                    ? "Update Course"
                                    : "Save Course"}
                        </button>

                        {editId && (
                            <button
                                onClick={resetForm}
                                className="bg-gray-400 text-white px-4 py-3 rounded-lg w-full sm:w-auto hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: COURSE LIST ── */}
                <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5 sm:p-6">

                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800">
                        Existing Courses
                    </h2>

                    <div className="space-y-4">
                        {courses.length === 0 && (
                            <p className="text-slate-400 text-sm text-center py-8">
                                No courses yet. Create one!
                            </p>
                        )}

                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition"
                            >
                                <div className="flex items-start justify-between gap-4">

                                    {/* Banner + Info */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                            {course.banner ? (
                                                <img
                                                    src={course.banner}
                                                    alt={course.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center text-xs text-gray-400 h-full">
                                                    No img
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {course.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {course.level}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {course.designedFor?.length || 0} audience ·{" "}
                                                {course.careerOpportunities?.length || 0} careers ·{" "}
                                                {course.syllabus?.length || 0} modules
                                            </p>
                                            <p
                                                className={`text-xs mt-1 font-medium ${course.isActive
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {course.isActive ? "● Active" : "● Inactive"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-2 text-sm flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => toggleActive(course)}
                                            className="text-amber-600 hover:text-amber-800"
                                        >
                                            Toggle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}