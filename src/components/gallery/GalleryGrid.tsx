// ============================================================
// components/gallery/GalleryGrid.tsx
// ============================================================
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import GalleryFilter from "./GalleryFilter";

/* ─── Data ───────────────────────────────────────────────────────── */

const IMAGES = [
    { src: "/images/gallery/classrooms/classroom1.jpeg",    category: "classrooms",   alt: "Computer lab classroom at Shivshakti Academy" },
    { src: "/images/gallery/classrooms/classroom2.jpeg",    category: "classrooms",   alt: "Students in practical training session"        },
    { src: "/images/gallery/classrooms/classroom3.jpeg",    category: "classrooms",   alt: "Students in practical training session"        },
    { src: "/images/gallery/classrooms/classroom4.jpeg",    category: "classrooms",   alt: "Students in practical training session"        },
    { src: "/images/gallery/classrooms/classroom5.jpeg",    category: "classrooms",   alt: "Students in practical training session"        },
    { src: "/images/gallery/classrooms/classroom6.jpeg",    category: "classrooms",   alt: "Academy's Corridor at Shivshakti Academy"     },
    { src: "/images/gallery/events/event1.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event2.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event3.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event4.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event5.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event6.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event7.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event8.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event9.jpeg",            category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event10.jpeg",           category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event11.jpeg",           category: "events",       alt: "December 2025 Picnic"                         },
    { src: "/images/gallery/events/event12.jpeg",           category: "events",       alt: "Students photo shoot"                         },
    { src: "/images/gallery/events/event13.jpeg",           category: "events",       alt: "Students photo shoot"                         },
    { src: "/images/gallery/events/event14.jpeg",           category: "events",       alt: "Reception Area"                               },
    { src: "/images/gallery/events/event15.jpeg",           category: "events",       alt: "Saraswati Pooja 2026"                         },
    { src: "/images/gallery/events/event16.jpeg",           category: "events",       alt: "Students photo shoot"                         },
    { src: "/images/gallery/certificates/certificate1.jpeg",category: "certificates", alt: "Student receiving verified certificate"       },
];

const CATEGORIES = ["all", "classrooms", "events", "certificates"];

/* ─── Icons (inline SVG — no lucide dep needed) ─────────────────── */

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const ZoomInIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

/* ─── Component ─────────────────────────────────────────────────── */

export default function GalleryGrid() {
    const [active, setActive]           = useState("all");
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const filtered =
        active === "all"
            ? IMAGES
            : IMAGES.filter((img) => img.category === active);

    const counts: Record<string, number> = { all: IMAGES.length };
    IMAGES.forEach((img) => {
        counts[img.category] = (counts[img.category] ?? 0) + 1;
    });

    const openLightbox  = (idx: number) => setLightboxIdx(idx);
    const closeLightbox = useCallback(() => setLightboxIdx(null), []);

    const prev = useCallback(() => {
        setLightboxIdx((i) =>
            i === null ? null : (i - 1 + filtered.length) % filtered.length
        );
    }, [filtered.length]);

    const next = useCallback(() => {
        setLightboxIdx((i) =>
            i === null ? null : (i + 1) % filtered.length
        );
    }, [filtered.length]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Escape")     closeLightbox();
            if (e.key === "ArrowLeft")  prev();
            if (e.key === "ArrowRight") next();
        },
        [closeLightbox, prev, next]
    );

    return (
        <>
            {/* ── Filter ── */}
            <GalleryFilter
                active={active}
                setActive={(cat) => {
                    setActive(cat);
                    setLightboxIdx(null);
                }}
                categories={CATEGORIES}
                counts={counts}
            />

            {/* ── Empty state ── */}
            {filtered.length === 0 ? (
                <div className="gg-empty">
                    No photos in this category yet.
                </div>
            ) : (
                /* ── Masonry Grid ── */
                <div className="gg-grid">
                    {filtered.map((img, idx) => (
                        <div
                            key={img.src}
                            className="gg-item"
                            onClick={() => openLightbox(idx)}
                            role="button"
                            tabIndex={0}
                            aria-label={`View ${img.alt}`}
                            onKeyDown={(e) =>
                                e.key === "Enter" && openLightbox(idx)
                            }
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                width={600}
                                height={800}
                                className="gg-item__img"
                            />

                            {/* Hover overlay */}
                            <div className="gg-overlay" aria-hidden="true">
                                <span className="gg-overlay__pill">
                                    {img.category}
                                </span>
                                <span className="gg-overlay__zoom">
                                    <ZoomInIcon />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ══════════ LIGHTBOX ══════════ */}
            {lightboxIdx !== null && (
                <div
                    className="gg-lb"
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                    tabIndex={-1}
                >
                    <div
                        className="gg-lb__inner"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            className="gg-lb__close"
                            onClick={closeLightbox}
                            aria-label="Close lightbox"
                        >
                            <XIcon />
                        </button>

                        {/* Image */}
                        <div className="gg-lb__img-wrap">
                            <Image
                                src={filtered[lightboxIdx].src}
                                alt={filtered[lightboxIdx].alt}
                                width={960}
                                height={720}
                                className="gg-lb__img"
                                priority
                            />
                        </div>

                        {/* Caption */}
                        <p className="gg-lb__caption">
                            {filtered[lightboxIdx].alt}
                        </p>

                        {/* Nav row */}
                        <div className="gg-lb__nav">
                            <button
                                className="gg-lb__nav-btn"
                                onClick={prev}
                                aria-label="Previous image"
                            >
                                <ChevronLeftIcon />
                            </button>

                            <span className="gg-lb__counter">
                                {lightboxIdx + 1} / {filtered.length}
                            </span>

                            <button
                                className="gg-lb__nav-btn"
                                onClick={next}
                                aria-label="Next image"
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Component-scoped CSS ── */}
            <style>{`

/* ══════════════════════════════════════════
   GALLERY GRID  —  component-scoped styles
   ══════════════════════════════════════════ */

/* ── Masonry Grid ───────────────────────── */
.gg-grid {
  columns: 1;
  gap: var(--space-3);
}
@media (min-width: 640px) {
  .gg-grid { columns: 2; }
}
@media (min-width: 1024px) {
  .gg-grid { columns: 3; }
}

/* ── Grid Item ──────────────────────────── */
.gg-item {
  break-inside: avoid;
  margin-bottom: var(--space-3);
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  background: var(--color-primary-50);
  border: 1px solid var(--border-color);
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}
.gg-item:hover {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-lg);
}
.gg-item__img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform var(--transition-slower);
}
.gg-item:hover .gg-item__img {
  transform: scale(1.04);
}

/* ── Hover Overlay ──────────────────────── */
.gg-overlay {
  position: absolute;
  inset: 0;
  opacity: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  background: linear-gradient(
    to top,
    rgba(17, 24, 39, 0.78) 0%,
    transparent 55%
  );
  transition: opacity var(--transition-base);
}
.gg-item:hover .gg-overlay {
  opacity: 1;
}
.gg-overlay__pill {
  font-size: 9px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-white);
  background: rgba(37, 99, 235, 0.40);
  border: 1px solid rgba(96, 165, 250, 0.45);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}
.gg-overlay__zoom {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: var(--color-white);
}

/* ── Empty State ────────────────────────── */
.gg-empty {
  text-align: center;
  padding: var(--space-16) var(--space-6);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-tertiary);
}

/* ══════════════════════════════════════════
   LIGHTBOX
   ══════════════════════════════════════════ */
@keyframes gg-lb-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.gg-lb {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: rgba(10, 7, 3, 0.93);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: gg-lb-in 0.2s var(--ease-out) forwards;
}

.gg-lb__inner {
  position: relative;
  width: 100%;
  max-width: 960px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

/* Close button */
.gg-lb__close {
  position: absolute;
  top: calc(-1 * var(--space-4));
  right: calc(-1 * var(--space-4));
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}
.gg-lb__close:hover {
  background: rgba(255, 255, 255, 0.20);
  border-color: rgba(255, 255, 255, 0.30);
}

/* Image wrapper */
.gg-lb__img-wrap {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--color-gray-900);
  max-height: calc(85vh - 100px);
}
.gg-lb__img {
  object-fit: contain;
  width: 100%;
  max-height: calc(85vh - 100px);
}

/* Caption */
.gg-lb__caption {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  letter-spacing: 0.03em;
  margin: 0;
}

/* Nav row */
.gg-lb__nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.gg-lb__nav-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}
.gg-lb__nav-btn:hover {
  background: rgba(37, 99, 235, 0.25);
  border-color: rgba(96, 165, 250, 0.40);
}
.gg-lb__counter {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: rgba(255, 255, 255, 0.50);
  letter-spacing: 0.06em;
  min-width: 60px;
  text-align: center;
}

      `}</style>
        </>
    );
}