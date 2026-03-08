// ============================================================
// app/notices/page.tsx  (Server Component)
// ============================================================
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

export const revalidate = 30;

export const metadata: Metadata = {
    title: "Latest Notices & Announcements | Shivshakti Computer Academy Ambikapur",
    description:
        "Check latest admission updates, exam notices and announcements from Shivshakti Computer Academy Ambikapur.",
    alternates: {
        canonical: "https://www.shivshakticomputer.in/notices",
    },
};

async function getNotices() {
    try {
        await connectDB();
        const notices = await Notice.find({ isActive: true, isPublished: true })
            .sort({ createdAt: -1 })
            .select("-content")
            .lean();
        return JSON.parse(JSON.stringify(notices));
    } catch (error) {
        console.error("DB FETCH ERROR:", error);
        return [];
    }
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default async function NoticesPage() {
    const notices = await getNotices();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .np-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                }

                /* ── Hero ── */
                .np-hero {
                    padding: 88px 24px 64px;
                    position: relative;
                    overflow: hidden;
                }

                .np-hero-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 420px; height: 420px;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                .np-hero-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .np-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .np-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 1.5px;
                    background: #d97706;
                }

                .np-hero-layout {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                }

                .np-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.15;
                }

                .np-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .np-hero-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 10px;
                    padding-bottom: 4px;
                }

                .np-hero-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    max-width: 340px;
                    text-align: right;
                }

                .np-count-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 0.78rem;
                    font-weight: 400;
                    color: #92540a;
                    background: #fffbeb;
                    border: 1px solid #fcd34d;
                    padding: 5px 14px;
                    border-radius: 100px;
                }

                .np-count-dot {
                    width: 5px; height: 5px;
                    background: #d97706;
                    border-radius: 50%;
                }

                /* ── List section ── */
                .np-body {
                    padding: 0 24px 88px;
                    position: relative;
                }

                .np-body::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .np-body-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding-top: 52px;
                }

                /* ── Notices list ── */
                .np-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    background: #e8dfd0;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .np-card {
                    background: #fff;
                    padding: 32px 36px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 32px;
                    text-decoration: none;
                    transition: background 0.2s;
                    position: relative;
                    overflow: hidden;
                }

                .np-card::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, #d97706, #fcd34d);
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 0.28s ease;
                }

                .np-card:hover { background: #fffefb; }
                .np-card:hover::before { transform: scaleY(1); }

                /* Left content */
                .np-card-left {
                    flex: 1;
                    min-width: 0;
                }

                .np-card-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                    flex-wrap: wrap;
                }

                .np-card-date {
                    font-size: 0.75rem;
                    font-weight: 300;
                    color: #92826b;
                    letter-spacing: 0.03em;
                }

                .np-card-cat {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92540a;
                    background: #fffbeb;
                    border: 1px solid #fde68a;
                    padding: 3px 10px;
                    border-radius: 100px;
                }

                .np-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.3;
                    margin-bottom: 10px;
                }

                .np-card-excerpt {
                    font-size: 0.82rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.75;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Right arrow */
                .np-card-arrow {
                    width: 40px; height: 40px;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: #92826b;
                    flex-shrink: 0;
                    align-self: center;
                    transition: background 0.2s, color 0.2s, transform 0.2s, border-color 0.2s;
                }

                .np-card:hover .np-card-arrow {
                    background: #1a1208;
                    border-color: #1a1208;
                    color: #fef3c7;
                    transform: translateX(3px);
                }

                /* Empty */
                .np-empty {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    padding: 64px 24px;
                    text-align: center;
                }

                .np-empty-icon {
                    font-size: 2.5rem;
                    margin-bottom: 14px;
                }

                .np-empty-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1208;
                    margin-bottom: 8px;
                }

                .np-empty-sub {
                    font-size: 0.82rem;
                    font-weight: 300;
                    color: #92826b;
                }

                /* ── Responsive ── */
                @media (max-width: 640px) {
                    .np-hero { padding: 64px 20px 52px; }
                    .np-body { padding: 0 20px 64px; }
                    .np-hero-layout { flex-direction: column; align-items: flex-start; }
                    .np-hero-right { align-items: flex-start; }
                    .np-hero-desc { text-align: left; }
                    .np-card { padding: 24px 20px; gap: 16px; }
                    .np-list { border-radius: 16px; }
                }
            `}</style>

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

            <main className="np-root">

                {/* Hero */}
                <div className="np-hero">
                    <div className="np-hero-glow" aria-hidden="true" />
                    <div className="np-hero-inner">
                        <div className="np-eyebrow">Announcements</div>
                        <div className="np-hero-layout">
                            <h1 className="np-title">
                                Notices &<br /><em>Updates</em>
                            </h1>
                            <div className="np-hero-right">
                                <p className="np-hero-desc">
                                    Admission notices, exam schedules and
                                    important updates from the academy.
                                </p>
                                {notices.length > 0 && (
                                    <div className="np-count-pill">
                                        <span className="np-count-dot" aria-hidden="true" />
                                        {notices.length} active notice{notices.length !== 1 ? "s" : ""}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="np-body">
                    <div className="np-body-inner">
                        {notices.length === 0 ? (
                            <div className="np-empty">
                                <div className="np-empty-icon" aria-hidden="true">📋</div>
                                <div className="np-empty-title">No notices at the moment</div>
                                <div className="np-empty-sub">Check back soon for updates and announcements.</div>
                            </div>
                        ) : (
                            <div className="np-list">
                                {notices.map((notice: any) => (
                                    <Link
                                        key={notice._id}
                                        href={`/notices/${notice.slug}`}
                                        className="np-card"
                                    >
                                        <div className="np-card-left">
                                            <div className="np-card-meta">
                                                <span className="np-card-date">
                                                    {formatDate(notice.createdAt)}
                                                </span>
                                                {notice.category && (
                                                    <span className="np-card-cat">{notice.category}</span>
                                                )}
                                            </div>
                                            <h2 className="np-card-title">{notice.title}</h2>
                                            {notice.excerpt && (
                                                <p className="np-card-excerpt">{notice.excerpt}</p>
                                            )}
                                        </div>
                                        <div className="np-card-arrow" aria-hidden="true">→</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </>
    );
}