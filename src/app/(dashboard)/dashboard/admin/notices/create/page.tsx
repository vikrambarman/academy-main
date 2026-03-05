"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateNotice() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "General",
        isPublished: false,
    });

    const generateSlug = (title: string) =>
        title
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, "-");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const res = await fetch("/api/admin/notices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
        });

        if (res.ok) {
            router.push("/dashboard/admin/notices");
        } else {
            alert("Error creating notice");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-0">

            <h1 className="text-lg sm:text-xl font-semibold mb-6">
                Create Notice
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                <input
                    type="text"
                    placeholder="Title"
                    required
                    className="w-full border p-3 rounded-lg text-sm sm:text-base"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title: e.target.value,
                            slug: generateSlug(e.target.value),
                        })
                    }
                />

                <input
                    type="text"
                    placeholder="Slug"
                    required
                    value={form.slug}
                    className="w-full border p-3 rounded-lg text-sm sm:text-base"
                    onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                    }
                />

                <textarea
                    placeholder="Excerpt"
                    required
                    className="w-full border p-3 rounded-lg text-sm sm:text-base"
                    onChange={(e) =>
                        setForm({ ...form, excerpt: e.target.value })
                    }
                />

                <textarea
                    placeholder="Content"
                    required
                    rows={6}
                    className="w-full border p-3 rounded-lg text-sm sm:text-base"
                    onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                    }
                />

                <label className="flex items-center gap-2 text-sm sm:text-base">

                    <input
                        type="checkbox"
                        onChange={(e) =>
                            setForm({
                                ...form,
                                isPublished: e.target.checked,
                            })
                        }
                    />

                    Publish Immediately

                </label>

                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg w-full sm:w-auto">
                    Create Notice
                </button>

            </form>

        </div>
    );
}