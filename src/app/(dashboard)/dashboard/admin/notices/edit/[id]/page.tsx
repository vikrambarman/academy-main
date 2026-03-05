"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditNotice() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/admin/notices`, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                const notice = data.data.find((n: any) => n._id === id);
                setForm(notice);
            });
    }, [id]);

    if (!form) return <p>Loading...</p>;

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await fetch(`/api/admin/notices/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
        });

        router.push("/dashboard/admin/notices");
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-0">

            <h1 className="text-lg sm:text-xl font-semibold mb-6">
                Edit Notice
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                <input
                    type="text"
                    value={form.title}
                    className="w-full border p-3 rounded-lg text-sm sm:text-base"
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <textarea
                    rows={6}
                    value={form.content}
                    className="w-full border p-3 rounded-lg text-sm sm:text-base"
                    onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                    }
                />

                <label className="flex items-center gap-2 text-sm sm:text-base">

                    <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                isPublished: e.target.checked,
                            })
                        }
                    />

                    Published

                </label>

                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg w-full sm:w-auto">
                    Update Notice
                </button>

            </form>

        </div>
    );
}