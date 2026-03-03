import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

/* ---------------------------------------
   Fetch Notice (Dynamic Ready)
---------------------------------------- */
async function getNotice(slug: string) {
    const notices = [
        {
            title: "New DCA Batch Starting March 2026",
            slug: "new-dca-batch-march-2026",
            content:
                "Admissions are now open for the DCA course at Shivshakti Computer Academy Ambikapur. Interested students can visit the institute or contact via phone or WhatsApp.",
            date: "March 5, 2026",
        },
        {
            title: "PGDCA Exam Form Submission Notice",
            slug: "pgdca-exam-form-notice",
            content:
                "All PGDCA students must submit their exam forms before 25th March at the institute office during working hours.",
            date: "March 1, 2026",
        },
    ];

    return notices.find((n) => n.slug === slug);
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
            {/* Structured Article Schema */}
            <Script
                id="notice-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: notice.title,
                        datePublished: notice.date,
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
                        {notice.date}
                    </p>

                    <h1 className="mt-4 text-4xl font-bold text-gray-900">
                        {notice.title}
                    </h1>

                    <div className="mt-8 text-gray-700 leading-relaxed text-lg">
                        {notice.content}
                    </div>

                </div>
            </section>
        </>
    );
}