// ============================================================
// app/(public)/gallery/page.tsx  (Server Component)
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
    <>
      <main className="gl-root">
        {/* ── HERO ── */}
        <section className="gl-hero" aria-labelledby="gallery-hero-heading">
          <div className="container container-xl gl-hero__inner">
            <div className="gl-hero__eyebrow">
              <span className="gl-hero__eyebrow-line" aria-hidden="true" />
              Our Campus
            </div>
            <div className="gl-hero__layout">
              <h1 id="gallery-hero-heading" className="gl-hero__title">
                Academy <span className="gl-hero__title-em">Gallery</span>
              </h1>
              <p className="gl-hero__desc">
                A look inside our classrooms, computer labs, student activities and
                certification events.
              </p>
            </div>
          </div>
        </section>

        {/* ── GRID BODY ── */}
        <section className="gl-body" aria-label="Gallery photos">
          <div className="container container-xl gl-body__inner">
            <GalleryGrid />
          </div>
        </section>
      </main>

      <style>{`
/* ── GALLERY PAGE — Clean University style ── */
.gl-root { background: var(--bg-page); min-height: 100vh; }

.gl-hero {
  position: relative;
  padding: var(--space-20) 0 var(--space-12);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.gl-hero__inner { position: relative; }
.gl-hero__eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.gl-hero__eyebrow-line { width: 24px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.gl-hero__layout { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-8); flex-wrap: wrap; }
.gl-hero__title {
  font-family: var(--font-display); font-size: clamp(1.75rem, 3.6vw, 2.5rem);
  font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.2;
  letter-spacing: -0.015em; margin: 0;
}
.gl-hero__title-em { font-style: normal; color: var(--color-primary-700); }
.gl-hero__desc { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; max-width: 420px; margin: 0; }

.gl-body { padding: var(--space-12) 0 var(--space-24); }
.gl-body__inner { padding-top: 0; }

@media (max-width: 768px) {
  .gl-hero { padding: var(--space-16) 0 var(--space-10); }
  .gl-hero__layout { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .gl-hero__desc { max-width: 100%; }
}
@media (max-width: 480px) {
  .gl-hero { padding: var(--space-12) 0 var(--space-8); }
  .gl-body { padding: var(--space-10) 0 var(--space-16); }
}
      `}</style>
    </>
  );
}
