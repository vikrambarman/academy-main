import Link from "next/link";
import { getNotices } from "@/lib/notices";

export default async function Notices() {
    const notices = await getNotices();

    return (
        <section className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                    <div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                            Latest Notices
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Stay updated with important announcements and official updates.
                        </p>
                    </div>

                    <Link
                        href="/notices"
                        className="text-sm font-medium text-black hover:underline"
                    >
                        View All →
                    </Link>

                </div>

                <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {notices.slice(0, 3).map((notice) => (
                        <article
                            key={notice._id}
                            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                {notice.label}
                            </span>

                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                {notice.title}
                            </h3>

                            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                {notice.desc}
                            </p>

                            <Link
                                href="/notices"
                                className="inline-block mt-5 text-sm font-medium text-black hover:underline"
                            >
                                Read more →
                            </Link>
                        </article>
                    ))}

                </div>
            </div>
        </section>
    );
}