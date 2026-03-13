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
        day: "numeric", month: "short", year: "numeric",
    });
}

export default async function NoticesPage() {
    const notices = await getNotices();

    return (
        <>
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

            <main style={{ background: "var(--color-bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

                {/* ══════════════════════ HERO ══════════════════════ */}
                <section className="relative overflow-hidden px-6 pt-[88px] pb-16"
                    style={{ background: "var(--color-bg)" }}
                    aria-labelledby="notices-hero-heading">

                    {/* Glow */}
                    <div aria-hidden="true" className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 9%,transparent) 0%,transparent 65%)" }} />

                    <div className="relative z-10 max-w-[1100px] mx-auto">
                        {/* Eyebrow */}
                        <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                            style={{ color: "var(--color-primary)" }}>
                            <span aria-hidden="true"
                                style={{ display: "inline-block", width: 24, height: 1.5, background: "var(--color-primary)", flexShrink: 0 }} />
                            Announcements
                        </div>

                        <div className="flex items-end justify-between gap-10 flex-wrap">
                            <h1 id="notices-hero-heading"
                                className="font-serif font-bold leading-[1.15]"
                                style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "var(--color-text)" }}>
                                Notices &<br />
                                <em className="italic" style={{ color: "var(--color-accent)" }}>Updates</em>
                            </h1>

                            <div className="flex flex-col items-end gap-2.5 pb-1">
                                <p className="text-[0.88rem] font-light leading-[1.8] max-w-[340px] text-right max-sm:text-left"
                                    style={{ color: "var(--color-text-muted)" }}>
                                    Admission notices, exam schedules and
                                    important updates from the academy.
                                </p>
                                {notices.length > 0 && (
                                    <div className="inline-flex items-center gap-1.5 text-[0.78rem] font-normal px-3.5 py-1.5 rounded-full"
                                        style={{
                                            color:      "var(--color-primary)",
                                            background: "color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))",
                                            border:     "1px solid color-mix(in srgb,var(--color-primary) 25%,transparent)",
                                        }}>
                                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ background: "var(--color-primary)" }} aria-hidden="true" />
                                        {notices.length} active notice{notices.length !== 1 ? "s" : ""}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ NOTICES LIST ══════════════════════ */}
                <section className="relative px-6 pb-[88px]" aria-label="Notices list">
                    {/* Top divider */}
                    <div aria-hidden="true" className="absolute top-0 pointer-events-none"
                        style={{ left: "10%", right: "10%", height: 1, background: "linear-gradient(to right,transparent,var(--color-border),transparent)" }} />

                    <div className="max-w-[1100px] mx-auto pt-14">

                        {/* Empty state */}
                        {notices.length === 0 ? (
                            <div className="text-center py-16 rounded-[20px]"
                                style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                                <div className="text-[2.5rem] mb-3.5" aria-hidden="true">📋</div>
                                <div className="font-serif text-[1.1rem] font-semibold mb-2"
                                    style={{ color: "var(--color-text)" }}>
                                    No notices at the moment
                                </div>
                                <div className="text-[0.82rem] font-light"
                                    style={{ color: "var(--color-text-muted)" }}>
                                    Check back soon for updates and announcements.
                                </div>
                            </div>
                        ) : (
                            /* Notices list */
                            <div className="flex flex-col rounded-[20px] overflow-hidden"
                                style={{ gap: 1, background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
                                {notices.map((notice: any) => (
                                    <Link key={notice._id}
                                        href={`/notices/${notice.slug}`}
                                        className="group relative flex items-start justify-between gap-8 no-underline px-9 py-8 overflow-hidden transition-colors duration-200 max-sm:px-5 max-sm:py-6 max-sm:gap-4"
                                        style={{ background: "var(--color-bg-card)" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-primary) 3%,var(--color-bg-card))"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg-card)"}>

                                        {/* Left accent bar */}
                                        <span aria-hidden="true"
                                            className="absolute left-0 top-0 bottom-0 w-[3px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-[280ms] ease-out"
                                            style={{ background: "linear-gradient(to bottom,var(--color-primary),color-mix(in srgb,var(--color-primary) 50%,transparent))" }} />

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Meta row */}
                                            <div className="flex items-center gap-2.5 flex-wrap mb-3">
                                                <span className="text-[0.75rem] font-light tracking-[0.03em]"
                                                    style={{ color: "var(--color-text-muted)" }}>
                                                    {formatDate(notice.createdAt)}
                                                </span>
                                                {notice.category && (
                                                    <span className="text-[9px] font-medium tracking-[0.12em] uppercase px-2.5 py-0.5 rounded-full"
                                                        style={{
                                                            color:      "var(--color-primary)",
                                                            background: "color-mix(in srgb,var(--color-primary) 10%,var(--color-bg))",
                                                            border:     "1px solid color-mix(in srgb,var(--color-primary) 25%,transparent)",
                                                        }}>
                                                        {notice.category}
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="font-serif text-[1.1rem] font-bold leading-[1.3] mb-2.5"
                                                style={{ color: "var(--color-text)" }}>
                                                {notice.title}
                                            </h2>

                                            {notice.excerpt && (
                                                <p className="text-[0.82rem] font-light leading-[1.75] line-clamp-2"
                                                    style={{ color: "var(--color-text-muted)" }}>
                                                    {notice.excerpt}
                                                </p>
                                            )}
                                        </div>

                                        {/* Arrow */}
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center self-center flex-shrink-0 text-base transition-all duration-200 group-hover:translate-x-0.5"
                                            style={{
                                                background:  "var(--color-bg)",
                                                border:      "1px solid var(--color-border)",
                                                color:       "var(--color-text-muted)",
                                            }}
                                            aria-hidden="true">
                                            →
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

            </main>
        </>
    );
}