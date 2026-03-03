"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Link from "next/link";

interface Notice {
    _id: string;
    title: string;
    excerpt: string;
    slug: string;
    createdAt: string;
    category?: string;
    isRead: boolean;
}

export default function StudentNotices() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotices = async () => {
            const res = await fetchWithAuth("/api/student/notices");
            const data = await res.json();
            setNotices(data.data || []);
            setLoading(false);
        };

        loadNotices();
    }, []);

    const markAsRead = async (id: string) => {
        await fetchWithAuth(`/api/student/notices/${id}/read`, {
            method: "POST",
        });

        setNotices((prev) =>
            prev.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            )
        );
    };

    if (loading) {
        return <div className="text-gray-500 animate-pulse">Loading...</div>;
    }

    return (
        <div className="max-w-4xl space-y-8">

            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Important Notices
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Stay updated with important academic announcements.
                </p>
            </div>

            {notices.length === 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">
                        No notices available at the moment.
                    </p>
                </div>
            )}

            {notices.map((notice) => (
                <div
                    key={notice._id}
                    className={`rounded-2xl p-6 shadow-md transition hover:shadow-lg border
                    ${
                        notice.isRead
                            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            : "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500"
                    }`}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>
                            {new Date(notice.createdAt).toDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                            {notice.category && (
                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs">
                                    {notice.category}
                                </span>
                            )}

                            {!notice.isRead && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                    NEW
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                        {notice.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                        {notice.excerpt}
                    </p>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-5">
                        <Link
                            href={`/notices/${notice.slug}`}
                            onClick={() => {
                                if (!notice.isRead) {
                                    markAsRead(notice._id);
                                }
                            }}
                            className="text-indigo-600 text-sm font-medium hover:underline"
                        >
                            Read Full Notice →
                        </Link>

                        {!notice.isRead && (
                            <button
                                onClick={() => markAsRead(notice._id)}
                                className="text-xs text-gray-500 hover:text-indigo-600 transition"
                            >
                                Mark as Read
                            </button>
                        )}
                    </div>
                </div>
            ))}

        </div>
    );
}