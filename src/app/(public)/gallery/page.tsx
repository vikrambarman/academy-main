// ============================================================
// app/(public)/gallery/page.tsx  (Server Component)
// ============================================================
import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery | Shivshakti Computer Academy",
  description:
    "Explore classrooms, labs, annual day, examinations and student activities at Shivshakti Computer Academy in Ambikapur.",
};

export default function GalleryPage() {
  return (
    <main className="gl-root">
      {/* ── HERO ── */}
      <section className="gl-hero" aria-labelledby="gallery-hero-heading">
        <div className="container gl-hero__inner">
          <div className="gl-hero__eyebrow">
            <span className="gl-hero__eyebrow-line" aria-hidden="true" />
            Our Campus
          </div>
          <div className="gl-hero__layout">
            <h1 id="gallery-hero-heading" className="gl-hero__title">
              Academy{" "}
              <span className="gl-hero__title-em">Gallery</span>
            </h1>
            <p className="gl-hero__desc">
              A look inside our classrooms, computer labs, annual day,
              examinations and certification events.
            </p>
          </div>
        </div>
      </section>

      {/* ── GALLERY MAIN ── */}
      <section className="gl-main" aria-label="Gallery photos">
        <div className="container">
          <GalleryGrid />
        </div>
      </section>
    </main>
  );
}