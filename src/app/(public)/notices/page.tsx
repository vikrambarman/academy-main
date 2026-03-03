import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

/* ---------------------------------------
   SEO Metadata
---------------------------------------- */
export const metadata: Metadata = {
    title: "Latest Notices & Announcements in Ambikapur",
    description:
        "Check latest admission updates, exam notices and announcements from Shivshakti Computer Academy Ambikapur.",
    alternates: {
        canonical: "https://www.shivshakticomputer.in/notices",
    },
};

/* ---------------------------------------
   Fetch Notices (Direct DB - Next 16)
---------------------------------------- */
async function getNotices() {
    try {
        await connectDB();

        const notices = await Notice.find({
            isActive: true,
            isPublished: true,
        })
            .sort({ createdAt: -1 })
            .select("-content")
            .lean();

        return JSON.parse(JSON.stringify(notices));

    } catch (error) {
        console.error("DB FETCH ERROR:", error);
        return [];
    }
}

/* ---------------------------------------
   Page Component
---------------------------------------- */
export default async function NoticesPage() {

    const notices = await getNotices();

    return (
        <>
            {/* Structured Data */}
            <Script
                id="notices-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        itemListElement: notices.map((notice: any, index: number) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            url: `https://www.shivshakticomputer.in/notices/${notice.slug}`,
                            name: notice.title,
                        })),
                    }),
                }}
            />

            <section className="bg-white min-h-screen py-24">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-semibold text-gray-900">
                            Latest Notices & Announcements
                        </h1>
                        <p className="mt-6 text-gray-600">
                            Stay updated with admission notices, exam schedules and important updates.
                        </p>
                    </div>

                    {/* Notices */}
                    <div className="mt-16 space-y-8">

                        {notices.length === 0 && (
                            <p className="text-center text-gray-500">
                                No notices available at the moment.
                            </p>
                        )}

                        {notices.map((notice: any) => (
                            <div
                                key={notice._id}
                                className="bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition"
                            >
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>
                                        {new Date(notice.createdAt).toDateString()}
                                    </span>

                                    {notice.category && (
                                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs">
                                            {notice.category}
                                        </span>
                                    )}
                                </div>

                                <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                                    {notice.title}
                                </h2>

                                <p className="mt-4 text-gray-600">
                                    {notice.excerpt}
                                </p>

                                <Link
                                    href={`/notices/${notice.slug}`}
                                    className="inline-block mt-6 text-sm font-medium text-black hover:underline"
                                >
                                    Read Full Notice →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}