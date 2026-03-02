import Link from "next/link";
import { getNotices } from "@/lib/notices";

export default async function NoticesPage() {
    const notices = await getNotices();

    return (
        <section className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-28">
            <div className="max-w-6xl mx-auto px-6">

                {/* ================= HERO ================= */}
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-4 py-1 rounded-full">
                        Official Announcements
                    </span>

                    <h1 className="mt-2 text-4xl font-semibold text-gray-900">
                        Academy Notices
                    </h1>

                    <p className="mt-6 text-gray-600 leading-relaxed">
                        Stay informed about admissions, certification updates,
                        academic activities and important institutional announcements.
                    </p>

                    <div className="mt-8 w-24 h-1 bg-black mx-auto rounded-full"></div>
                </div>

                {/* ================= LIST ================= */}
                <div className="mt-20 space-y-8">

                    {notices?.length > 0 ? (
                        notices.map((notice, index) => (
                            <article
                                key={notice._id}
                                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    {/* Left Content */}
                                    <div>
                                        <div className="flex items-center gap-3">

                                            <time className="text-xs font-medium text-gray-500">
                                                {notice.label}
                                            </time>

                                            {index === 0 && (
                                                <span className="text-xs font-medium bg-black text-white px-3 py-1 rounded-full">
                                                    Latest
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="mt-4 text-xl font-semibold text-gray-900">
                                            {notice.title}
                                        </h2>

                                        <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-3xl">
                                            {notice.desc}
                                        </p>
                                    </div>

                                    {/* CTA (Future slug support) */}
                                    <div>
                                        <Link
                                            href={`/notices/${notice._id}`} // future dynamic route ready
                                            className="inline-flex items-center text-sm font-medium text-black hover:underline"
                                        >
                                            Read Full Notice →
                                        </Link>
                                    </div>

                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-lg font-medium text-gray-900">
                                No notices available at the moment.
                            </h3>
                            <p className="mt-3 text-gray-500 text-sm">
                                Please check back later for updates.
                            </p>
                        </div>
                    )}

                </div>

            </div>
        </section>
    );
}