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
        <>
            <main className="gl-root">

                {/* ════════════ HERO ════════════ */}
                <section
                    className="gl-hero home-section"
                    aria-labelledby="gallery-hero-heading"
                >
                    {/* Glow orbs */}
                    <div className="gl-hero__glow gl-hero__glow--1" aria-hidden="true" />
                    <div className="gl-hero__glow gl-hero__glow--2" aria-hidden="true" />

                    <div className="container container-xl gl-hero__inner">
                        {/* Eyebrow */}
                        <div className="gl-hero__eyebrow">
                            <span className="gl-hero__eyebrow-line" aria-hidden="true" />
                            Our Campus
                        </div>

                        {/* Split layout */}
                        <div className="gl-hero__layout">
                            <h1
                                id="gallery-hero-heading"
                                className="gl-hero__title"
                            >
                                Academy
                                <br />
                                <em className="gl-hero__title-em">Gallery</em>
                            </h1>
                            <p className="gl-hero__desc">
                                A look inside our classrooms, computer labs,
                                student activities and certification events.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ════════════ GRID BODY ════════════ */}
                <section className="gl-body home-section" aria-label="Gallery photos">
                    <div className="gl-body__divider" aria-hidden="true" />
                    <div className="container container-xl gl-body__inner">
                        <GalleryGrid />
                    </div>
                </section>
            </main>

            {/* ════════════ PAGE-SCOPED CSS ════════════ */}
            <style>{`

/* ══════════════════════════════════════════
   GALLERY PAGE  —  page-scoped styles
   Follows: variables.css + components.css
   ══════════════════════════════════════════ */

/* ── Root ───────────────────────────────── */
.gl-root {
  background-color: var(--bg-page);
  min-height: 100vh;
}

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
.gl-hero {
  position: relative;
  padding: var(--space-24) 0 var(--space-16);
  overflow: hidden;
  background: linear-gradient(
    160deg,
    var(--color-primary-200) 0%,
    var(--color-white) 60%,
    var(--color-primary-400) 100%
  );
}

/* Glow orbs */
.gl-hero__glow {
  position: absolute;
  border-radius: var(--radius-full);
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.30;
}
.gl-hero__glow--1 {
  width: 440px;
  height: 440px;
  background: var(--color-primary-200);
  top: -180px;
  right: -120px;
}
.gl-hero__glow--2 {
  width: 280px;
  height: 280px;
  background: var(--color-accent-200);
  bottom: -80px;
  left: -80px;
}

.gl-hero__inner {
  position: relative;
  z-index: 2;
}

/* Eyebrow */
.gl-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary-600);
  margin-bottom: var(--space-4);
}
.gl-hero__eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Split layout */
.gl-hero__layout {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-10);
  flex-wrap: wrap;
}

/* Title */
.gl-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0;
}
.gl-hero__title-em {
  font-style: italic;
  background: linear-gradient(
    135deg,
    var(--color-primary-600),
    var(--color-accent-500)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Desc */
.gl-hero__desc {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  max-width: 360px;
  margin: 0;
  padding-bottom: var(--space-1);
}

/* ══════════════════════════════════════════
   BODY
   ══════════════════════════════════════════ */
.gl-body {
  padding-bottom: var(--space-24);
  position: relative;
}
.gl-body__divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-color),
    transparent
  );
  margin: 0 10%;
}
.gl-body__inner {
  padding-top: var(--space-12);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */
@media (max-width: 768px) {
  .gl-hero {
    padding: var(--space-16) 0 var(--space-12);
  }
  .gl-hero__layout {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  .gl-hero__desc {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .gl-hero {
    padding: var(--space-12) 0 var(--space-10);
  }
  .gl-body {
    padding-bottom: var(--space-16);
  }
}

      `}</style>
        </>
    );
}