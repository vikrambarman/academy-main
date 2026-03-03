import Link from "next/link";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

/* ================= FETCH NOTICES ================= */

async function getHomeNotices() {
    try {
        await connectDB();

        const notices = await Notice.find({
            isActive: true,
            isPublished: true,
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        return JSON.parse(JSON.stringify(notices));
    } catch (error) {
        console.error("HOME NOTICES FETCH ERROR:", error);
        return [];
    }
}

/* ================= COMPONENT ================= */

export default async function Notices() {
    const notices = await getHomeNotices();

    if (!notices.length) return null;

    return (
        <section className="bg-gray-100 py-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                    <div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                            Latest Notices
                        </h2>

                        <p className="mt-3 text-gray-600 max-w-xl">
                            Stay updated with admission announcements, exam schedules and important updates from Shivshakti Computer Academy.
                        </p>
                    </div>

                    <Link
                        href="/notices"
                        className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                        View All Notices →
                    </Link>

                </div>

                {/* CARDS */}
                <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {notices.map((notice: any) => (
                        <article
                            key={notice._id}
                            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Meta */}
                            <div className="flex items-center justify-between text-xs text-gray-500">

                                <span>
                                    {new Date(notice.createdAt).toDateString()}
                                </span>

                                {notice.category && (
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                        {notice.category}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 leading-snug">
                                {notice.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
                                {notice.excerpt}
                            </p>

                            {/* Action */}
                            <Link
                                href={`/notices/${notice.slug}`}
                                className="inline-block mt-6 text-sm font-medium text-indigo-600 hover:underline"
                            >
                                Read Full Notice →
                            </Link>
                        </article>
                    ))}

                </div>
            </div>
        </section>
    );
}