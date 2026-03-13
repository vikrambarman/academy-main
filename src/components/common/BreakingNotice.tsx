import Link from "next/link";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

async function getLatestNotice() {
    try {
        await connectDB();
        const notice = await Notice.findOne({ isActive: true, isPublished: true })
            .sort({ createdAt: -1 })
            .lean();
        return notice ? JSON.parse(JSON.stringify(notice)) : null;
    } catch {
        return null;
    }
}

export default async function BreakingNotice() {
    const notice = await getLatestNotice();
    if (!notice) return null;

    return (
        <>
            <style>{`
                .bn-link { transition: gap 0.2s ease; }
                .bn-link:hover { gap: 8px; }
            `}</style>

            <div className="relative z-40"
                style={{ background:"var(--color-bg-sidebar)", borderBottom:"1px solid color-mix(in srgb,var(--color-primary) 20%,transparent)" }}>
                <div className="max-w-[1100px] mx-auto px-6 h-8 flex items-center justify-between gap-4">

                    {/* Left — badge + title */}
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="shrink-0 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
                            style={{ background:"var(--color-accent)", color:"#fff" }}>
                            Notice
                        </span>
                        <span className="w-px h-3 shrink-0"
                            style={{ background:"color-mix(in srgb,var(--color-info) 15%,transparent)" }} />
                        <span className="text-[11px] font-light truncate"
                            style={{ color:"rgba(255,255,255,0.55)" }}>
                            {notice.title}
                        </span>
                    </div>

                    {/* Right — Read More */}
                    <Link href={`/notices/${notice.slug}`}
                        className="bn-link shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap"
                        style={{ color:"var(--color-info)" }}>
                        Read More
                        <span aria-hidden="true">→</span>
                    </Link>

                </div>
            </div>
        </>
    );
}