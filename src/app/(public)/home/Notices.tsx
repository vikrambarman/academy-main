// ============================================================
// Notices.tsx  (Server Component)
// ============================================================
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

async function getHomeNotices() {
    try {
        await connectDB();
        const notices = await Notice.find({ isActive: true, isPublished: true })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();
        return JSON.parse(JSON.stringify(notices));
    } catch {
        return [];
    }
}

export default async function Notices() {
    const notices = await getHomeNotices();
    if (!notices.length) return null;

    return (
        <>
            <style>{`
                .not-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                .not-root::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .not-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* Header */
                .not-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 32px;
                    margin-bottom: 48px;
                    flex-wrap: wrap;
                }

                .not-eyebrow {
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

                .not-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #d97706;
                }

                .not-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .not-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .not-view-all {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #1a1208;
                    text-decoration: none;
                    border: 1.5px solid #d5c9b5;
                    padding: 9px 20px;
                    border-radius: 100px;
                    white-space: nowrap;
                    flex-shrink: 0;
                    transition: border-color 0.2s, background 0.2s, transform 0.15s;
                }

                .not-view-all:hover {
                    border-color: #b45309;
                    background: #fffbeb;
                    transform: translateY(-1px);
                }

                .not-view-all-arrow {
                    transition: transform 0.2s;
                }

                .not-view-all:hover .not-view-all-arrow {
                    transform: translateX(4px);
                }

                /* Grid */
                .not-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1px;
                    background: #e8dfd0;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                }

                /* Card */
                .not-card {
                    background: #fff;
                    padding: 32px 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    text-decoration: none;
                    transition: background 0.22s ease;
                    position: relative;
                }

                .not-card:hover {
                    background: #fffbeb;
                }

                /* Amber top line */
                .not-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: #d97706;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.26s ease;
                }

                .not-card:hover::before {
                    transform: scaleX(1);
                }

                .not-card-meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .not-card-date {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: #92826b;
                    letter-spacing: 0.04em;
                }

                .not-card-cat {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #92540a;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    padding: 3px 10px;
                    border-radius: 100px;
                    white-space: nowrap;
                }

                .not-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1a1208;
                    line-height: 1.35;
                    margin-bottom: 10px;
                }

                .not-card-excerpt {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.75;
                    flex: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .not-card-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: #b45309;
                    margin-top: 18px;
                    text-decoration: none;
                    transition: gap 0.2s;
                }

                .not-card:hover .not-card-link {
                    gap: 9px;
                }

                @media (max-width: 900px) {
                    .not-grid { grid-template-columns: 1fr; border-radius: 16px; }
                    .not-header { flex-direction: column; align-items: flex-start; gap: 20px; margin-bottom: 36px; }
                }

                @media (max-width: 480px) {
                    .not-root { padding: 64px 16px; }
                    .not-card { padding: 24px 20px; }
                }
            `}</style>

            <section className="not-root" aria-labelledby="notices-heading">
                <div className="not-inner">

                    <div className="not-header">
                        <div>
                            <div className="not-eyebrow">Announcements</div>
                            <h2 id="notices-heading" className="not-title">
                                Latest <em>Notices</em>
                            </h2>
                        </div>
                        <Link href="/notices" className="not-view-all">
                            View All Notices
                            <span className="not-view-all-arrow" aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="not-grid">
                        {notices.map((notice: any) => (
                            <Link
                                key={notice._id}
                                href={`/notices/${notice.slug}`}
                                className="not-card"
                            >
                                <div className="not-card-meta">
                                    <span className="not-card-date">
                                        {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                    {notice.category && (
                                        <span className="not-card-cat">{notice.category}</span>
                                    )}
                                </div>

                                <h3 className="not-card-title">{notice.title}</h3>
                                <p className="not-card-excerpt">{notice.excerpt}</p>

                                <span className="not-card-link" aria-hidden="true">
                                    Read More <span>→</span>
                                </span>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}