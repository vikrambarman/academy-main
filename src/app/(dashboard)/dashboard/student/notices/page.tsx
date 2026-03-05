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

      try {

        const res = await fetchWithAuth("/api/student/notices");
        const data = await res.json();

        setNotices(data?.data || []);

      } catch (error) {

        console.error("Failed to load notices");

      } finally {

        setLoading(false);

      }

    };

    loadNotices();

  }, []);

  const markAsRead = async (id: string) => {

    try {

      await fetchWithAuth(`/api/student/notices/${id}/read`, {
        method: "POST",
      });

      setNotices((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

    } catch {
      console.error("Failed to mark notice as read");
    }

  };

  if (loading) {
    return (
      <div className="text-indigo-500 animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">

      {/* PAGE HEADER */}

      <div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-indigo-900">
          Important Notices
        </h1>

        <p className="text-sm text-indigo-500 mt-1">
          Stay updated with important academic announcements.
        </p>

      </div>

      {/* EMPTY STATE */}

      {notices.length === 0 && (

        <div className="bg-white border border-indigo-100 p-6 rounded-xl shadow-md">

          <p className="text-indigo-500 text-sm">
            No notices available at the moment.
          </p>

        </div>

      )}

      {/* NOTICE LIST */}

      <div className="space-y-6">

        {notices.map((notice) => (

          <div
            key={notice._id}
            className={`rounded-xl p-5 sm:p-6 shadow-md border transition hover:shadow-lg
            ${notice.isRead
                ? "bg-white border-indigo-100"
                : "bg-indigo-50 border-indigo-400"
              }`}
          >

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-indigo-500">

              <span>
                {new Date(notice.createdAt).toDateString()}
              </span>

              <div className="flex items-center gap-2 flex-wrap">

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

            {/* TITLE */}

            <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-indigo-900">
              {notice.title}
            </h2>

            {/* EXCERPT */}

            <p className="mt-2 sm:mt-3 text-sm text-indigo-700">
              {notice.excerpt}
            </p>

            {/* ACTIONS */}

            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-4">

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
                  className="text-xs text-indigo-500 hover:text-indigo-700 transition"
                >
                  Mark as Read
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}