// ============================================================
// app/gallery/page.tsx  (Server Component)
// ============================================================
import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
    title: "Gallery | Shivshakti Computer Academy",
    description:
        "Explore classrooms, labs, and student activities at Shivshakti Computer Academy in Ambikapur.",
};

export default function GalleryPage() {
    return (
        <main style={{ background: "var(--color-bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

            {/* ══════════════════════ HERO ══════════════════════ */}
            <section className="relative overflow-hidden px-6 pt-[88px] pb-[72px]"
                style={{ background: "var(--color-bg)" }}
                aria-labelledby="gallery-hero-heading">

                {/* Glow */}
                <div aria-hidden="true" className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 9%,transparent) 0%,transparent 65%)" }} />

                <div className="relative z-10 max-w-[1100px] mx-auto">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                        style={{ color: "var(--color-primary)" }}>
                        <span aria-hidden="true"
                            style={{ display: "inline-block", width: 24, height: 1.5, background: "var(--color-primary)", flexShrink: 0 }} />
                        Our Campus
                    </div>

                    <div className="flex items-end justify-between gap-10 flex-wrap">
                        <h1 id="gallery-hero-heading"
                            className="font-serif font-bold leading-[1.15]"
                            style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "var(--color-text)" }}>
                            Academy<br />
                            <em className="italic" style={{ color: "var(--color-accent)" }}>Gallery</em>
                        </h1>
                        <p className="text-[0.88rem] font-light leading-[1.8] max-w-[340px] pb-1"
                            style={{ color: "var(--color-text-muted)" }}>
                            A look inside our classrooms, computer labs,
                            student activities and certification events.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════ GRID BODY ══════════════════════ */}
            <section className="relative px-6 pb-[88px]" aria-label="Gallery photos">
                {/* Top divider */}
                <div aria-hidden="true" className="absolute top-0 pointer-events-none"
                    style={{ left: "10%", right: "10%", height: 1, background: "linear-gradient(to right,transparent,var(--color-border),transparent)" }} />

                <div className="max-w-[1100px] mx-auto pt-14">
                    <GalleryGrid />
                </div>
            </section>

        </main>
    );
}