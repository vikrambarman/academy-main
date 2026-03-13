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

                .not-card-link { transition: gap 0.2s; }
                .not-card:hover .not-card-link { gap: 9px; }

                .not-view-all-arrow { transition: transform 0.2s; }
                .not-view-all:hover .not-view-all-arrow { transform: translateX(4px); }

                @media (max-width: 900px) {
                    .not-grid { grid-template-columns: 1fr !important; border-radius: 16px !important; }
                    .not-header { flex-direction: column; align-items: flex-start; gap: 20px; margin-bottom: 36px; }
                }
                @media (max-width: 480px) {
                    .not-root { padding: 64px 16px !important; }
                    .not-card { padding: 24px 20px !important; }
                }
            `}</style>

            <section
                className="not-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background:"var(--color-bg)" }}
                aria-labelledby="notices-heading"
            >
                <div className="max-w-[1100px] mx-auto">

                    {/* Header */}
                    <div className="not-header flex items-end justify-between flex-wrap gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                                style={{ color:"var(--color-primary)" }}>
                                <span style={{ display:"inline-block", width:24, height:1.5, background:"var(--color-primary)", flexShrink:0 }} />
                                Announcements
                            </div>
                            <h2 id="notices-heading"
                                className="font-serif font-bold leading-[1.2]"
                                style={{ fontSize:"clamp(1.8rem,3vw,2.5rem)", color:"var(--color-text)" }}>
                                Latest{" "}
                                <em className="not-italic" style={{ color:"var(--color-accent)" }}>Notices</em>
                            </h2>
                        </div>

                        <Link href="/notices"
                            className="not-view-all inline-flex items-center gap-1.5 text-[0.82rem] font-medium no-underline shrink-0 px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-px"
                            style={{ color:"var(--color-primary)", border:"1.5px solid var(--color-border)" }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="var(--color-primary)"; el.style.background="color-mix(in srgb,var(--color-primary) 6%,transparent)"; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="var(--color-border)"; el.style.background="transparent"; }}>
                            View All Notices
                            <span className="not-view-all-arrow" aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="not-grid grid gap-px rounded-[20px] overflow-hidden"
                        style={{ gridTemplateColumns:"repeat(3,1fr)", background:"var(--color-border)", border:"1px solid var(--color-border)" }}>
                        {notices.map((notice: any) => (
                            <Link key={notice._id}
                                href={`/notices/${notice.slug}`}
                                className="not-card relative flex flex-col no-underline p-8 transition-colors duration-200"
                                style={{ background:"var(--color-bg-card)" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card))")}
                                onMouseLeave={e => (e.currentTarget.style.background = "var(--color-bg-card)")}>

                                {/* Meta row */}
                                <div className="flex items-center justify-between gap-2 mb-4">
                                    <span className="text-[0.72rem] font-light tracking-[0.04em]"
                                        style={{ color:"var(--color-text-muted)" }}>
                                        {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                                            day:"numeric", month:"short", year:"numeric",
                                        })}
                                    </span>
                                    {notice.category && (
                                        <span className="text-[9px] font-medium tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap"
                                            style={{
                                                color:"var(--color-primary)",
                                                background:"color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))",
                                                border:"1px solid color-mix(in srgb,var(--color-primary) 22%,transparent)",
                                            }}>
                                            {notice.category}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="font-serif text-[1rem] font-semibold leading-[1.35] mb-2.5"
                                    style={{ color:"var(--color-text)" }}>
                                    {notice.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-[0.8rem] font-light leading-[1.75] flex-1"
                                    style={{ color:"var(--color-text-muted)", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                                    {notice.excerpt}
                                </p>

                                {/* Read more */}
                                <span className="not-card-link inline-flex items-center gap-1.5 text-[0.78rem] font-medium mt-[18px]"
                                    style={{ color:"var(--color-primary)" }}
                                    aria-hidden="true">
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