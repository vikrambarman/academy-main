"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminNotices() {
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotices = async () => {
        const res = await fetch("/api/admin/notices", {
            credentials: "include",
        });

        const data = await res.json();
        setNotices(data.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const togglePublish = async (id: string, current: boolean) => {
        await fetch(`/api/admin/notices/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ isPublished: !current }),
        });

        fetchNotices();
    };

    const deleteNotice = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notice?")) return;

        await fetch(`/api/admin/notices/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        fetchNotices();
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h1 className="text-lg sm:text-xl font-semibold">
                    Manage Notices
                </h1>

                <Link
                    href="/dashboard/admin/notices/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto text-center"
                >
                    + Create Notice
                </Link>

            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white rounded-xl shadow">

                    <div className="overflow-x-auto">

                        <table className="min-w-[650px] w-full text-sm">

                            <thead className="bg-gray-100 text-left">

                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Views</th>
                                    <th className="p-4">Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {notices.map((notice) => (

                                    <tr key={notice._id} className="border-t">

                                        <td className="p-4 font-medium">
                                            {notice.title}
                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${notice.isPublished
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {notice.isPublished
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>

                                        </td>

                                        <td className="p-4">
                                            {notice.views}
                                        </td>

                                        <td className="p-4">

                                            <div className="flex flex-wrap gap-3 text-sm">

                                                <Link
                                                    href={`/dashboard/admin/notices/edit/${notice._id}`}
                                                    className="text-blue-600"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        togglePublish(
                                                            notice._id,
                                                            notice.isPublished
                                                        )
                                                    }
                                                    className="text-indigo-600"
                                                >
                                                    {notice.isPublished
                                                        ? "Unpublish"
                                                        : "Publish"}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteNotice(notice._id)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

        </div>
    );
}