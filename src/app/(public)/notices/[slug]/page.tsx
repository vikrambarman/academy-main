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
        day: "numeric",
        month: "long",
        year: "numeric",
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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .nd-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                }

                /* ── Header banner ── */
                .nd-banner {
                    background: #1a1208;
                    padding: 72px 24px 56px;
                    position: relative;
                    overflow: hidden;
                }

                .nd-banner-glow {
                    position: absolute;
                    top: -60px; right: -60px;
                    width: 320px; height: 320px;
                    background: radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 65%);
                    pointer-events: none;
                }

                .nd-banner-dots {
                    position: absolute;
                    bottom: -10px; left: -10px;
                    width: 140px; height: 140px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.12) 1.5px, transparent 1.5px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                .nd-banner-inner {
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* Breadcrumb */
                .nd-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.75rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.4);
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }

                .nd-breadcrumb a {
                    color: rgba(254,243,199,0.4);
                    text-decoration: none;
                    transition: color 0.18s;
                }

                .nd-breadcrumb a:hover { color: #fcd34d; }

                .nd-breadcrumb-sep { font-size: 0.65rem; opacity: 0.4; }

                .nd-breadcrumb-current {
                    color: rgba(254,243,199,0.7);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 280px;
                }

                /* Meta row */
                .nd-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 16px;
                }

                .nd-date {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    letter-spacing: 0.04em;
                }

                .nd-cat {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #1a1208;
                    background: #fcd34d;
                    padding: 3px 10px;
                    border-radius: 100px;
                }

                /* Title */
                .nd-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.6rem, 4vw, 2.4rem);
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                }

                /* ── Content ── */
                .nd-content-wrap {
                    padding: 56px 24px 88px;
                }

                .nd-content-inner {
                    max-width: 800px;
                    margin: 0 auto;
                }

                /* Article card */
                .nd-article {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    padding: 48px 52px;
                    margin-bottom: 24px;
                }

                .nd-article-body {
                    font-size: 0.95rem;
                    font-weight: 300;
                    color: #3a2e1e;
                    line-height: 2;
                    white-space: pre-line;
                }

                .nd-article-body p { margin-bottom: 1.2em; }
                .nd-article-body p:last-child { margin-bottom: 0; }

                /* Divider */
                .nd-divider {
                    width: 48px; height: 2px;
                    background: linear-gradient(to right, #d97706, #fcd34d);
                    border-radius: 2px;
                    margin-bottom: 28px;
                }

                /* Back link */
                .nd-back-card {
                    background: #1a1208;
                    border-radius: 16px;
                    padding: 22px 28px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    text-decoration: none;
                    transition: background 0.2s;
                }

                .nd-back-card:hover { background: #2d1f0d; }

                .nd-back-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(254,243,199,0.4);
                    margin-bottom: 4px;
                }

                .nd-back-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #fef3c7;
                }

                .nd-back-arrow {
                    width: 36px; height: 36px;
                    background: rgba(252,211,77,0.12);
                    border: 1px solid rgba(252,211,77,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fcd34d;
                    font-size: 1rem;
                    flex-shrink: 0;
                    transition: background 0.2s, transform 0.2s;
                }

                .nd-back-card:hover .nd-back-arrow {
                    background: rgba(252,211,77,0.2);
                    transform: translateX(-3px);
                }

                /* ── Responsive ── */
                @media (max-width: 640px) {
                    .nd-banner { padding: 56px 20px 44px; }
                    .nd-content-wrap { padding: 40px 20px 64px; }
                    .nd-article { padding: 28px 24px; }
                }
            `}</style>

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

            <main className="nd-root">

                {/* Dark banner header */}
                <div className="nd-banner">
                    <div className="nd-banner-glow" aria-hidden="true" />
                    <div className="nd-banner-dots" aria-hidden="true" />
                    <div className="nd-banner-inner">

                        {/* Breadcrumb */}
                        <nav className="nd-breadcrumb" aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span className="nd-breadcrumb-sep" aria-hidden="true">›</span>
                            <Link href="/notices">Notices</Link>
                            <span className="nd-breadcrumb-sep" aria-hidden="true">›</span>
                            <span className="nd-breadcrumb-current">{notice.title}</span>
                        </nav>

                        {/* Meta */}
                        <div className="nd-meta">
                            <span className="nd-date">{formatDate(notice.createdAt)}</span>
                            {notice.category && (
                                <span className="nd-cat">{notice.category}</span>
                            )}
                        </div>

                        <h1 className="nd-title">{notice.title}</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="nd-content-wrap">
                    <div className="nd-content-inner">
                        <article className="nd-article">
                            <div className="nd-divider" aria-hidden="true" />
                            <div className="nd-article-body">
                                {notice.content}
                            </div>
                        </article>

                        {/* Back link */}
                        <Link href="/notices" className="nd-back-card">
                            <div>
                                <div className="nd-back-label">Back to</div>
                                <div className="nd-back-text">All Notices & Announcements</div>
                            </div>
                            <div className="nd-back-arrow" aria-hidden="true">←</div>
                        </Link>
                    </div>
                </div>

            </main>
        </>
    );
}