"use client";

/**
 * FILE: src/app/dashboard/admin/notes/page.tsx
 * ---------------------------------------------
 * Admin Notes Management Page
 * - Course select karo
 * - Module + Topic form se note create karo
 * - Markdown editor mein content likho
 * - Publish/Unpublish toggle
 * - Edit/Delete existing notes
 */

import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Note {
    _id: string;
    title: string;
    courseSlug: string;
    moduleName: string;
    moduleSlug: string;
    topicName: string;
    topicSlug: string;
    isPublished: boolean;
    order: number;
    updatedAt: string;
}

interface Course {
    _id: string;
    name: string;
    slug: string;
    syllabus: { module: string; topics: string[] }[];
}

type Mode = "list" | "create" | "edit";

export default function AdminNotesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [mode, setMode] = useState<Mode>("list");
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Form state
    const [form, setForm] = useState({
        moduleName: "",
        topicName: "",
        content: "",
        isPublished: false,
        order: 0,
    });

    // Toast auto-hide
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    // Courses fetch
    useEffect(() => {
        fetchWithAuth("/api/admin/courses")
            .then((r) => r.json())
            .then((d) => {
                const list = Array.isArray(d) ? d : (d.courses || []);
                setCourses(list);
            })
            .catch(console.error);
    }, []);

    // Notes fetch when course changes
    const fetchNotes = useCallback(async (courseSlug: string) => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/api/admin/notes?courseSlug=${courseSlug}`);
            const data = await res.json();
            setNotes(data.notes || []);
        } catch {
            showToast("Notes load nahi hue", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    function showToast(msg: string, type: "success" | "error") {
        setToast({ msg, type });
    }

    function handleCourseSelect(slug: string) {
        const course = courses.find((c) => c.slug === slug) || null;
        setSelectedCourse(course);
        setMode("list");
        setEditingNote(null);
        if (course) fetchNotes(course.slug);
    }

    function openCreate() {
        setForm({ moduleName: "", topicName: "", content: "", isPublished: false, order: 0 });
        setEditingNote(null);
        setMode("create");
    }

    async function openEdit(note: Note) {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}`);
            const data = await res.json();
            setForm({
                moduleName: data.note.moduleName,
                topicName: data.note.topicName,
                content: data.content || "",
                isPublished: data.note.isPublished,
                order: data.note.order,
            });
            setEditingNote(note);
            setMode("edit");
        } catch {
            showToast("Note load nahi hua", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!selectedCourse) return;
        if (!form.moduleName.trim() || !form.topicName.trim()) {
            showToast("Module aur Topic name required hain", "error");
            return;
        }

        setSaving(true);
        try {
            if (mode === "create") {
                const res = await fetchWithAuth("/api/admin/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        courseSlug: selectedCourse.slug,
                        ...form,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                showToast("Note create ho gaya! ✓", "success");
            } else if (mode === "edit" && editingNote) {
                const res = await fetchWithAuth(`/api/admin/notes/${editingNote._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                showToast("Note update ho gaya! ✓", "success");
            }
            fetchNotes(selectedCourse.slug);
            setMode("list");
        } catch (err: any) {
            showToast(err.message || "Save nahi hua", "error");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(note: Note) {
        if (!confirm(`"${note.title}" note delete karna chahte ho?`)) return;
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            showToast("Note delete ho gaya", "success");
            setNotes((prev) => prev.filter((n) => n._id !== note._id));
        } catch {
            showToast("Delete nahi hua", "error");
        }
    }

    async function handleTogglePublish(note: Note) {
        try {
            const res = await fetchWithAuth(`/api/admin/notes/${note._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !note.isPublished }),
            });
            if (!res.ok) throw new Error();
            setNotes((prev) =>
                prev.map((n) => n._id === note._id ? { ...n, isPublished: !n.isPublished } : n)
            );
            showToast(note.isPublished ? "Unpublished" : "Published ✓", "success");
        } catch {
            showToast("Update nahi hua", "error");
        }
    }

    // Group notes by module for display
    const groupedNotes = notes.reduce<Record<string, Note[]>>((acc, note) => {
        const key = note.moduleName;
        if (!acc[key]) acc[key] = [];
        acc[key].push(note);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
                    {toast.msg}
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Notes Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Course-wise study notes manage karo</p>
                </div>

                {/* Course Selector */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Select Karo
                    </label>
                    <select
                        className="w-full md:w-80 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCourse?.slug || ""}
                        onChange={(e) => handleCourseSelect(e.target.value)}
                    >
                        <option value="">-- Course chunno --</option>
                        {courses.map((c) => (
                            <option key={c._id} value={c.slug}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Main Content */}
                {selectedCourse && (
                    <>
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {selectedCourse.name} — Notes
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({notes.length} total)
                                </span>
                            </h2>
                            {mode === "list" ? (
                                <button
                                    onClick={openCreate}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <span>+</span> Naya Note
                                </button>
                            ) : (
                                <button
                                    onClick={() => setMode("list")}
                                    className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg"
                                >
                                    ← Wapas
                                </button>
                            )}
                        </div>

                        {/* Create / Edit Form */}
                        {(mode === "create" || mode === "edit") && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                                <h3 className="text-base font-semibold text-gray-800 mb-4">
                                    {mode === "create" ? "Naya Note Create Karo" : "Note Edit Karo"}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Module Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Module Name *
                                        </label>
                                        {/* Syllabus se suggest karo ya manual type */}
                                        <input
                                            list="module-suggestions"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.moduleName}
                                            onChange={(e) => setForm((f) => ({ ...f, moduleName: e.target.value }))}
                                            placeholder="e.g. MS Office, Tally Prime"
                                        />
                                        <datalist id="module-suggestions">
                                            {selectedCourse.syllabus?.map((s, i) => (
                                                <option key={i} value={s.module} />
                                            ))}
                                        </datalist>
                                    </div>

                                    {/* Topic Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Topic Name *
                                        </label>
                                        <input
                                            list="topic-suggestions"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.topicName}
                                            onChange={(e) => setForm((f) => ({ ...f, topicName: e.target.value }))}
                                            placeholder="e.g. Introduction to MS Word"
                                        />
                                        <datalist id="topic-suggestions">
                                            {selectedCourse.syllabus
                                                ?.find((s) => s.module === form.moduleName)
                                                ?.topics.map((t, i) => (
                                                    <option key={i} value={t} />
                                                ))}
                                        </datalist>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                        <input
                                            type="number"
                                            min={0}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.order}
                                            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="flex items-end pb-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded"
                                                checked={form.isPublished}
                                                onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                                            />
                                            <span className="text-sm font-medium text-gray-700">Published</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Markdown Editor */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Content (.md format)
                                    </label>
                                    <p className="text-xs text-gray-400 mb-2">
                                        Markdown format mein likho — # Heading, **bold**, `code`, etc.
                                    </p>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                        rows={20}
                                        value={form.content}
                                        onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                                        placeholder={`# Topic Title\n\n## Introduction\n\nYahan apna content likho...\n\n## Points\n\n- Point 1\n- Point 2\n\n## Example\n\n\`\`\`\nCode example yahan\n\`\`\``}
                                        spellCheck={false}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
                                    >
                                        {saving ? "Saving..." : mode === "create" ? "Create Note" : "Update Note"}
                                    </button>
                                    <button
                                        onClick={() => setMode("list")}
                                        className="border border-gray-300 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notes List */}
                        {mode === "list" && (
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-12 text-gray-400">Loading...</div>
                                ) : notes.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                                        <p className="text-gray-400 mb-3">Is course mein abhi koi note nahi hai</p>
                                        <button
                                            onClick={openCreate}
                                            className="text-blue-600 text-sm font-medium hover:underline"
                                        >
                                            + Pehla note create karo
                                        </button>
                                    </div>
                                ) : (
                                    Object.entries(groupedNotes).map(([moduleName, moduleNotes]) => (
                                        <div key={moduleName} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                            {/* Module Header */}
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                <h3 className="text-sm font-semibold text-gray-700">📚 {moduleName}</h3>
                                            </div>

                                            {/* Topics */}
                                            <div className="divide-y divide-gray-100">
                                                {moduleNotes.map((note) => (
                                                    <div key={note._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-gray-300 text-xs w-6 text-right">{note.order}</span>
                                                            <span className="text-sm text-gray-800">{note.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* Publish toggle */}
                                                            <button
                                                                onClick={() => handleTogglePublish(note)}
                                                                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${note.isPublished
                                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                                    }`}
                                                            >
                                                                {note.isPublished ? "Published" : "Draft"}
                                                            </button>
                                                            <button
                                                                onClick={() => openEdit(note)}
                                                                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(note)}
                                                                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
