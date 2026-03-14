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
        // Plain objects are required for Server Components
        return JSON.parse(JSON.stringify(notices));
    } catch (error) {
        console.error("Database Error:", error);
        return [];
    }
}

export default async function Notices() {
    const notices = await getHomeNotices();
    if (!notices.length) return null;

    return (
        <>
            <style>{`
                .not-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }
                .not-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--color-primary);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.26s ease;
                }
                .not-card:hover::before { transform: scaleX(1); }
            `}</style>

            <section
                className="not-root relative overflow-hidden py-20 md:py-24 px-6 bg-[var(--color-bg)]"
                aria-labelledby="notices-heading"
            >
                <div className="max-w-[1100px] mx-auto">
                    {/* Header */}
                    <div className="flex items-end justify-between flex-wrap gap-8 mb-12 flex-col md:flex-row">
                        <div>
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--color-primary)]">
                                <span className="inline-block w-6 h-[1.5px] bg-[var(--color-primary)] shrink-0" />
                                Announcements
                            </div>
                            <h2 id="notices-heading"
                                className="font-serif font-bold leading-[1.2] text-[var(--color-text)] text-[clamp(1.8rem,3vw,2.5rem)]">
                                Latest <em className="not-italic text-[var(--color-accent)]">Notices</em>
                            </h2>
                        </div>

                        <Link href="/notices"
                            className="group inline-flex items-center gap-1.5 text-[0.82rem] font-medium no-underline shrink-0 px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-px border-[1.5px] border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]">
                            View All Notices
                            <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="grid gap-px rounded-[20px] overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)] grid-cols-1 md:grid-cols-3">
                        {notices.map((notice: any) => (
                            <Link key={notice._id}
                                href={`/notices/${notice.slug}`}
                                className="not-card group relative flex flex-col no-underline p-8 transition-colors duration-200 bg-[var(--color-bg-card)] hover:bg-[color-mix(in_srgb,var(--color-primary)_5%,var(--color-bg-card))]">

                                <div className="flex items-center justify-between gap-2 mb-4">
                                    <span className="text-[0.72rem] font-light tracking-[0.04em] text-[var(--color-text-muted)]">
                                        {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                                            day:"numeric", month:"short", year:"numeric",
                                        })}
                                    </span>
                                    {notice.category && (
                                        <span className="text-[9px] font-medium tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap text-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-bg))] border border-[color-mix(in_srgb,var(--color-primary)_22%,transparent)]">
                                            {notice.category}
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-serif text-[1rem] font-semibold leading-[1.35] mb-2.5 text-[var(--color-text)]">
                                    {notice.title}
                                </h3>

                                <p className="text-[0.8rem] font-light leading-[1.75] flex-1 text-[var(--color-text-muted)] line-clamp-3">
                                    {notice.excerpt}
                                </p>

                                <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium mt-[18px] text-[var(--color-primary)] transition-all duration-200 group-hover:gap-[9px]" aria-hidden="true">
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