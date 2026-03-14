// ============================================================
// app/notices/[slug]/page.tsx  (Server Component)
// ============================================================
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

export const revalidate = 30;

async function getNotice(slug: string) {
    try {
        await connectDB();
        const notice = await Notice.findOne({ slug, isActive: true, isPublished: true }).lean();
        if (!notice) return null;
        await Notice.updateOne({ _id: (notice as any)._id }, { $inc: { views: 1 } });
        return JSON.parse(JSON.stringify(notice));
    } catch (error) {
        console.error("DB FETCH ERROR:", error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const notice = await getNotice(slug);
    if (!notice) return { title: "Notice Not Found" };
    return {
        title: `${notice.title} | Shivshakti Computer Academy`,
        description: notice.content?.slice(0, 155),
        alternates: {
            canonical: `https://www.shivshakticomputer.in/notices/${notice.slug}`,
        },
    };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
    });
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

            <style>{`
                .back-link {
                    background: var(--color-bg-sidebar);
                    transition: background 200ms ease;
                }
                .back-link:hover {
                    background: color-mix(in srgb, var(--color-primary) 90%, var(--color-bg-sidebar));
                }
                .back-arrow {
                    transition: transform 200ms ease;
                }
                .back-link:hover .back-arrow {
                    transform: translateX(-2px);
                }
            `}</style>

            <main style={{ background: "var(--color-bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

                {/* ══════════════════════ DARK BANNER ══════════════════════ */}
                <section
                    className="relative overflow-hidden px-6 pt-[72px] pb-14"
                    style={{ background: "var(--color-bg-sidebar)" }}
                    aria-labelledby="notice-title"
                >
                    {/* Glow */}
                    <div
                        aria-hidden="true"
                        className="absolute -top-16 -right-16 w-[320px] h-[320px] rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 15%,transparent) 0%,transparent 65%)" }}
                    />
                    {/* Dot pattern */}
                    <div
                        aria-hidden="true"
                        className="absolute -bottom-2.5 -left-2.5 w-36 h-36 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 14%,transparent) 1.5px,transparent 1.5px)",
                            backgroundSize: "12px 12px",
                        }}
                    />

                    <div className="relative z-10 max-w-[800px] mx-auto">

                        {/* Breadcrumb */}
                        <nav
                            className="flex items-center gap-2 flex-wrap mb-6 text-[0.75rem] font-light"
                            style={{ color: "color-mix(in srgb,var(--color-text-inverse) 40%,transparent)" }}
                            aria-label="Breadcrumb"
                        >
                            <Link
                                href="/"
                                className="transition-colors duration-200 no-underline hover:text-yellow-300"
                                style={{ color: "inherit" }}
                            >
                                Home
                            </Link>
                            <span aria-hidden="true" className="text-[0.65rem] opacity-40">›</span>
                            <Link
                                href="/notices"
                                className="transition-colors duration-200 no-underline hover:text-yellow-300"
                                style={{ color: "inherit" }}
                            >
                                Notices
                            </Link>
                            <span aria-hidden="true" className="text-[0.65rem] opacity-40">›</span>
                            <span
                                className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[280px]"
                                style={{ color: "color-mix(in srgb,var(--color-text-inverse) 70%,transparent)" }}
                            >
                                {notice.title}
                            </span>
                        </nav>

                        {/* Meta row */}
                        <div className="flex items-center gap-2.5 flex-wrap mb-4">
                            <span
                                className="text-[0.78rem] font-light tracking-[0.04em]"
                                style={{ color: "color-mix(in srgb,var(--color-text-inverse) 45%,transparent)" }}
                            >
                                {formatDate(notice.createdAt)}
                            </span>
                            {notice.category && (
                                <span
                                    className="text-[9px] font-medium tracking-[0.14em] uppercase px-2.5 py-0.5 rounded-full"
                                    style={{
                                        color:      "var(--color-bg-sidebar)",
                                        background: "var(--color-warning)",
                                    }}
                                >
                                    {notice.category}
                                </span>
                            )}
                        </div>

                        <h1
                            id="notice-title"
                            className="font-serif font-bold leading-[1.2]"
                            style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "color-mix(in srgb,var(--color-text-inverse) 95%,transparent)" }}
                        >
                            {notice.title}
                        </h1>
                    </div>
                </section>

                {/* ══════════════════════ CONTENT ══════════════════════ */}
                <section
                    className="px-6 pt-14 pb-[88px] max-sm:px-5 max-sm:pt-10 max-sm:pb-16"
                    aria-label="Notice content"
                >
                    <div className="max-w-[800px] mx-auto">

                        {/* Article card */}
                        <article
                            className="rounded-[20px] px-[52px] py-12 mb-6 max-sm:px-6 max-sm:py-7"
                            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                        >
                            {/* Accent divider */}
                            <div
                                className="w-12 h-0.5 rounded-full mb-7"
                                style={{ background: "linear-gradient(to right,var(--color-primary),color-mix(in srgb,var(--color-primary) 40%,transparent))" }}
                                aria-hidden="true"
                            />
                            <div
                                className="text-[0.95rem] font-light leading-[2] whitespace-pre-line"
                                style={{ color: "var(--color-text)" }}
                            >
                                {notice.content}
                            </div>
                        </article>

                        {/* Back card */}
                        <Link
                            href="/notices"
                            className="back-link flex items-center justify-between gap-4 no-underline rounded-2xl px-7 py-[22px]"
                        >
                            <div>
                                <div
                                    className="text-[9px] font-medium tracking-[0.15em] uppercase mb-1"
                                    style={{ color: "color-mix(in srgb,var(--color-text-inverse) 40%,transparent)" }}
                                >
                                    Back to
                                </div>
                                <div
                                    className="font-serif text-[0.95rem] font-semibold"
                                    style={{ color: "var(--color-text-inverse)" }}
                                >
                                    All Notices & Announcements
                                </div>
                            </div>
                            {/* Arrow circle */}
                            <div
                                className="back-arrow w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "color-mix(in srgb,var(--color-warning) 15%,transparent)",
                                    border:     "1px solid color-mix(in srgb,var(--color-warning) 22%,transparent)",
                                    color:      "var(--color-warning)",
                                }}
                                aria-hidden="true"
                            >
                                ←
                            </div>
                        </Link>

                    </div>
                </section>

            </main>
        </>
    );
}