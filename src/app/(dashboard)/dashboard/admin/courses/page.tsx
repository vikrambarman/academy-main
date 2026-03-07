"use client";

/**
 * FULL COURSE MANAGEMENT SYSTEM
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
    banner?: string;   // ⭐ add this
    isActive: boolean;
    syllabus?: {
        module: string;
        topics: string[];
    }[];
}
export default function AdminCourses() {

    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        name: "",
        level: "",
        duration: "",
        eligibility: "",
        certificate: "",
    });

    const [syllabus, setSyllabus] = useState<ModuleItem[]>([
        { module: "", topics: [{ value: "" }] },
    ]);

    const fetchCourses = async () => {
        const res = await fetchWithAuth("/api/admin/courses");
        const data = await res.json();
        setCourses(data || []);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addModule = () => {
        setSyllabus([
            ...syllabus,
            { module: "", topics: [{ value: "" }] },
        ]);
    };

    const removeModule = (index: number) => {
        setSyllabus(syllabus.filter((_, i) => i !== index));
    };

    const handleModuleNameChange = (index: number, value: string) => {
        const updated = [...syllabus];
        updated[index].module = value;
        setSyllabus(updated);
    };

    const addTopic = (moduleIndex: number) => {
        const updated = [...syllabus];
        updated[moduleIndex].topics.push({ value: "" });
        setSyllabus(updated);
    };

    const removeTopic = (moduleIndex: number, topicIndex: number) => {
        const updated = [...syllabus];
        updated[moduleIndex].topics =
            updated[moduleIndex].topics.filter(
                (_, i) => i !== topicIndex
            );
        setSyllabus(updated);
    };

    const handleTopicChange = (
        moduleIndex: number,
        topicIndex: number,
        value: string
    ) => {
        const updated = [...syllabus];
        updated[moduleIndex].topics[topicIndex].value = value;
        setSyllabus(updated);
    };

    const handleSubmit = async () => {
        try {

            setLoading(true);

            const formattedSyllabus = syllabus
                .filter((mod) => mod.module.trim() !== "")
                .map((mod) => ({
                    module: mod.module.trim(),
                    topics: mod.topics
                        .map((t) => t.value.trim())
                        .filter((t) => t !== ""),
                }));

            const method = editId ? "PUT" : "POST";

            await fetchWithAuth("/api/admin/courses", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...(editId && { id: editId }),
                    ...form,
                    syllabus: formattedSyllabus,
                }),
            });

            if (bannerFile && editId) {

                const formData = new FormData();

                formData.append("file", bannerFile);
                formData.append("courseId", editId);

                await fetchWithAuth(
                    "/api/admin/courses/upload-banner",
                    {
                        method: "POST",
                        body: formData,
                    }
                );
            }

            resetForm();
            fetchCourses();

        } catch {
            console.error("Course save failed");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {

        setForm({
            name: "",
            level: "",
            duration: "",
            eligibility: "",
            certificate: "",
        });

        setSyllabus([
            { module: "", topics: [{ value: "" }] },
        ]);

        setEditId(null);
    };

    const handleEdit = (course: CourseItem) => {

        setEditId(course._id);

        setForm({
            name: course.name,
            level: course.level,
            duration: course.duration || "",
            eligibility: course.eligibility || "",
            certificate: course.certificate || "",
        });

        if (course.syllabus && course.syllabus.length > 0) {

            const formatted: ModuleItem[] = course.syllabus.map(
                (mod) => ({
                    module: mod.module,
                    topics: mod.topics.map((t) => ({
                        value: t,
                    })),
                })
            );

            setSyllabus(formatted);

        } else {

            setSyllabus([
                { module: "", topics: [{ value: "" }] },
            ]);

        }
    };

    const handleDelete = async (id: string) => {

        if (!confirm("Are you sure?")) return;

        await fetchWithAuth(`/api/admin/courses?id=${id}`, {
            method: "DELETE",
        });

        fetchCourses();
    };

    const toggleActive = async (course: CourseItem) => {

        await fetchWithAuth("/api/admin/courses", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: course._id,
                isActive: !course.isActive,
            }),
        });

        fetchCourses();
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                {/* LEFT FORM */}

                <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6">

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                        {editId ? "Edit Course" : "Create Course"}
                    </h2>

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
                            placeholder="Duration"
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
                    <div>

                        <label className="block text-sm font-medium mb-2">
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

                    {/* SYLLABUS */}

                    <div>

                        <h3 className="font-semibold mb-3">
                            Syllabus Modules
                        </h3>

                        {syllabus.map((mod, moduleIndex) => (

                            <div
                                key={moduleIndex}
                                className="border border-slate-200 rounded-lg p-4 mb-4 relative"
                            >

                                {syllabus.length > 1 && (
                                    <button
                                        onClick={() =>
                                            removeModule(moduleIndex)
                                        }
                                        className="absolute top-2 right-2 text-red-500"
                                    >
                                        ✕
                                    </button>
                                )}

                                <input
                                    placeholder="Module Name"
                                    className="w-full border p-2 mb-2 rounded"
                                    value={mod.module}
                                    onChange={(e) =>
                                        handleModuleNameChange(
                                            moduleIndex,
                                            e.target.value
                                        )
                                    }
                                />

                                {mod.topics.map((topic, topicIndex) => (

                                    <div
                                        key={topicIndex}
                                        className="flex flex-col sm:flex-row gap-2 mb-2"
                                    >

                                        <input
                                            placeholder="Topic Name"
                                            className="flex-1 border p-2 rounded"
                                            value={topic.value}
                                            onChange={(e) =>
                                                handleTopicChange(
                                                    moduleIndex,
                                                    topicIndex,
                                                    e.target.value
                                                )
                                            }
                                        />

                                        {mod.topics.length > 1 && (
                                            <button
                                                onClick={() =>
                                                    removeTopic(
                                                        moduleIndex,
                                                        topicIndex
                                                    )
                                                }
                                                className="text-red-500 self-start sm:self-center"
                                            >
                                                ✕
                                            </button>
                                        )}

                                    </div>

                                ))}

                                <button
                                    onClick={() => addTopic(moduleIndex)}
                                    className="text-indigo-600 text-sm"
                                >
                                    + Add Topic
                                </button>

                            </div>

                        ))}

                        <button
                            onClick={addModule}
                            className="bg-slate-800 text-white px-4 py-2 rounded w-full sm:w-auto"
                        >
                            Add Module
                        </button>

                    </div>

                    {/* BUTTONS */}

                    <div className="flex flex-col sm:flex-row gap-3">

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg"
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
                                className="bg-gray-400 text-white px-4 py-3 rounded-lg w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </div>

                {/* RIGHT COURSE LIST */}

                <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5 sm:p-6">

                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800">
                        Existing Courses
                    </h2>

                    <div className="space-y-4">

                        {courses.map((course) => (

                            <div
                                key={course._id}
                                className="border border-slate-200 rounded-lg p-4"
                            >

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        {/* SMALL BANNER */}

                                        <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">

                                            {course.banner ? (

                                                <img
                                                    src={course.banner}
                                                    className="w-full h-full object-cover"
                                                />

                                            ) : (

                                                <div className="flex items-center justify-center text-xs text-gray-400 h-full">
                                                    Img
                                                </div>

                                            )}

                                        </div>

                                        {/* COURSE TEXT */}

                                        <div>

                                            <p className="font-semibold">
                                                {course.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Level: {course.level}
                                            </p>

                                            <p
                                                className={`text-xs ${course.isActive
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {course.isActive ? "Active" : "Inactive"}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="flex flex-wrap gap-3 text-sm">

                                        <button
                                            onClick={() =>
                                                handleEdit(course)
                                            }
                                            className="text-indigo-600"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(course._id)
                                            }
                                            className="text-red-600"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            onClick={() =>
                                                toggleActive(course)
                                            }
                                            className="text-amber-600"
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