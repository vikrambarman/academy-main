import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

export const revalidate = 30;

/* ---------------------------------------
   Fetch Single Notice
---------------------------------------- */
async function getNotice(slug: string) {
    try {
        await connectDB();

        const notice = await Notice.findOne({
            slug,
            isActive: true,
            isPublished: true,
        }).lean();

        if (!notice) return null;

        // Increase views safely
        await Notice.updateOne(
            { _id: notice._id },
            { $inc: { views: 1 } }
        );

        return JSON.parse(JSON.stringify(notice));

    } catch (error) {
        console.error("DB FETCH ERROR:", error);
        return null;
    }
}

/* ---------------------------------------
   Dynamic Metadata
---------------------------------------- */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {

    const { slug } = await params;
    const notice = await getNotice(slug);

    if (!notice) {
        return { title: "Notice Not Found" };
    }

    return {
        title: `${notice.title} | Shivshakti Computer Academy`,
        description: notice.content.slice(0, 150),
        alternates: {
            canonical: `https://www.shivshakticomputer.in/notices/${notice.slug}`,
        },
    };
}

/* ---------------------------------------
   Page Component
---------------------------------------- */
export default async function NoticeDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {

    const { slug } = await params;
    const notice = await getNotice(slug);

    if (!notice) return notFound();

    return (
        <>
            {/* Article Schema */}
            <Script
                id="notice-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: notice.title,
                        datePublished: notice.createdAt,
                        author: {
                            "@type": "Organization",
                            name: "Shivshakti Computer Academy",
                        },
                    }),
                }}
            />

            <section className="bg-white min-h-screen py-24">
                <div className="max-w-3xl mx-auto px-6">

                    <p className="text-sm text-gray-500">
                        {new Date(notice.createdAt).toDateString()}
                    </p>

                    <h1 className="mt-4 text-4xl font-bold text-gray-900">
                        {notice.title}
                    </h1>

                    <div className="mt-8 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {notice.content}
                    </div>

                </div>
            </section>
        </>
    );
}