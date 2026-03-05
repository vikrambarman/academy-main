"use client";

/**
 * FULL COURSE MANAGEMENT SYSTEM
 * --------------------------------
 * Features:
 * - Create Course
 * - Edit Course
 * - Delete Course
 * - Toggle Active/Inactive
 * - Dynamic Modules & Topics
 */

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { COURSE_LEVELS } from "@/lib/constants/courseConfig";

/* ---------------- TYPES ---------------- */

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
    isActive: boolean;
    syllabus?: {
        module: string;
        topics: string[];
    }[];
}

/* ---------------- COMPONENT ---------------- */

export default function AdminCourses() {

    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editId, setEditId] = useState<string | null>(null);

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

    /* ---------------- FETCH COURSES ---------------- */

    const fetchCourses = async () => {
        const res = await fetchWithAuth("/api/admin/courses");
        const data = await res.json();
        setCourses(data || []);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    /* ---------------- FORM CHANGE ---------------- */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /* ---------------- MODULE MANAGEMENT ---------------- */

    const addModule = () => {
        setSyllabus([
            ...syllabus,
            { module: "", topics: [{ value: "" }] },
        ]);
    };

    const removeModule = (index: number) => {
        setSyllabus(syllabus.filter((_, i) => i !== index));
    };

    const handleModuleNameChange = (
        index: number,
        value: string
    ) => {
        const updated = [...syllabus];
        updated[index].module = value;
        setSyllabus(updated);
    };

    const addTopic = (moduleIndex: number) => {
        const updated = [...syllabus];
        updated[moduleIndex].topics.push({ value: "" });
        setSyllabus(updated);
    };

    const removeTopic = (
        moduleIndex: number,
        topicIndex: number
    ) => {
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

    /* ---------------- CREATE / UPDATE ---------------- */

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

            resetForm();
            fetchCourses();

        } catch (error) {
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

    /* ---------------- EDIT COURSE ---------------- */

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

    /* ---------------- DELETE ---------------- */

    const handleDelete = async (id: string) => {

        if (!confirm("Are you sure?")) return;

        await fetchWithAuth(`/api/admin/courses?id=${id}`, {
            method: "DELETE",
        });

        fetchCourses();
    };

    /* ---------------- TOGGLE ACTIVE ---------------- */

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

    /* ---------------- UI ---------------- */

    return (
        <div className="p-8 bg-slate-50 min-h-screen">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT FORM */}

                <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-6">

                    <h2 className="text-2xl font-bold text-slate-800">
                        {editId ? "Edit Course" : "Create Course"}
                    </h2>

                    {/* FORM */}

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
                                <option
                                    key={item.level}
                                    value={item.level}
                                >
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
                                        className="flex gap-2 mb-2"
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
                                                className="text-red-500"
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
                            className="bg-slate-800 text-white px-4 py-2 rounded"
                        >
                            Add Module
                        </button>

                    </div>

                    {/* BUTTONS */}

                    <div className="flex gap-4">

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
                                className="bg-gray-400 text-white px-4 py-3 rounded-lg"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </div>

                {/* RIGHT COURSE LIST */}

                <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">

                    <h2 className="text-2xl font-bold mb-4 text-slate-800">
                        Existing Courses
                    </h2>

                    <div className="space-y-4">

                        {courses.map((course) => (

                            <div
                                key={course._id}
                                className="border border-slate-200 rounded-lg p-4"
                            >

                                <div className="flex justify-between">

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
                                            {course.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </p>

                                    </div>

                                    <div className="flex gap-3">

                                        <button
                                            onClick={() =>
                                                handleEdit(course)
                                            }
                                            className="text-indigo-600 text-sm"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(course._id)
                                            }
                                            className="text-red-600 text-sm"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            onClick={() =>
                                                toggleActive(course)
                                            }
                                            className="text-amber-600 text-sm"
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