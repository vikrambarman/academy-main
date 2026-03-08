// ============================================================
// components/gallery/GalleryGrid.tsx
// ============================================================
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import GalleryFilter from "./GalleryFilter";

const IMAGES = [
    { src: "/images/gallery/classrooms/classroom1.jpeg", category: "classrooms", alt: "Computer lab classroom at Shivshakti Academy" },
    { src: "/images/gallery/classrooms/classroom2.jpeg", category: "classrooms", alt: "Students in practical training session" },
    { src: "/images/gallery/classrooms/classroom3.jpeg", category: "classrooms", alt: "Students in practical training session" },
    { src: "/images/gallery/classrooms/classroom4.jpeg", category: "classrooms", alt: "Students in practical training session" },
    { src: "/images/gallery/classrooms/classroom5.jpeg", category: "classrooms", alt: "Students in practical training session" },
    { src: "/images/gallery/classrooms/classroom6.jpeg", category: "classrooms", alt: "Academy's Corridor at Shivshakti Academy" },
    { src: "/images/gallery/events/event1.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event2.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event3.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event4.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event5.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event6.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event7.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event8.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event9.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event10.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event11.jpeg", category: "events", alt: "December 2025 Picnic" },
    { src: "/images/gallery/events/event12.jpeg", category: "events", alt: "Students photo shoot" },
    { src: "/images/gallery/events/event13.jpeg", category: "events", alt: "Students photo shoot" },
    { src: "/images/gallery/events/event14.jpeg", category: "events", alt: "Reception Area" },
    { src: "/images/gallery/events/event15.jpeg", category: "events", alt: "Saraswati Pooja 2026" },
    { src: "/images/gallery/events/event16.jpeg", category: "events", alt: "Students photo shoot" },
    { src: "/images/gallery/certificates/certificate1.jpeg", category: "certificates", alt: "Student receiving verified certificate" },
];

const CATEGORIES = ["all", "classrooms", "events", "certificates"];

export default function GalleryGrid() {
    const [active, setActive] = useState("all");
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const filtered = active === "all" ? IMAGES : IMAGES.filter((img) => img.category === active);

    // Counts for filter badges
    const counts: Record<string, number> = { all: IMAGES.length };
    IMAGES.forEach((img) => {
        counts[img.category] = (counts[img.category] ?? 0) + 1;
    });

    const openLightbox = (idx: number) => setLightboxIdx(idx);
    const closeLightbox = useCallback(() => setLightboxIdx(null), []);

    const prev = useCallback(() => {
        setLightboxIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    }, [filtered.length]);

    const next = useCallback(() => {
        setLightboxIdx((i) => (i === null ? null : (i + 1) % filtered.length));
    }, [filtered.length]);

    // Keyboard nav
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
    }, [closeLightbox, prev, next]);

    return (
        <>
            <style>{`
                /* ── Grid ── */
                .gg-grid {
                    columns: 1;
                    gap: 14px;
                }

                @media (min-width: 640px)  { .gg-grid { columns: 2; } }
                @media (min-width: 1024px) { .gg-grid { columns: 3; } }

                .gg-item {
                    break-inside: avoid;
                    margin-bottom: 14px;
                    position: relative;
                    border-radius: 18px;
                    overflow: hidden;
                    cursor: pointer;
                    background: #f0e8d8;
                    border: 1px solid #e8dfd0;
                    transition: border-color 0.22s, box-shadow 0.22s;
                }

                .gg-item:hover {
                    border-color: #d97706;
                    box-shadow: 0 12px 40px rgba(100,70,20,0.14);
                }

                .gg-item img {
                    display: block;
                    width: 100%;
                    height: auto;
                    transition: transform 0.6s ease;
                }

                .gg-item:hover img { transform: scale(1.04); }

                /* Hover overlay */
                .gg-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(26,18,8,0.72) 0%, transparent 50%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    padding: 18px 20px;
                }

                .gg-item:hover .gg-overlay { opacity: 1; }

                .gg-cat-pill {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #fef3c7;
                    background: rgba(252,211,77,0.18);
                    border: 1px solid rgba(252,211,77,0.3);
                    padding: 4px 10px;
                    border-radius: 100px;
                }

                .gg-zoom-icon {
                    width: 30px; height: 30px;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    flex-shrink: 0;
                }

                /* ── Empty state ── */
                .gg-empty {
                    text-align: center;
                    padding: 64px 24px;
                    color: #92826b;
                    font-size: 0.88rem;
                    font-weight: 300;
                }

                /* ── Lightbox ── */
                .lb-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(10,7,3,0.94);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    animation: lbFadeIn 0.2s ease;
                }

                @keyframes lbFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                .lb-inner {
                    position: relative;
                    width: 100%;
                    max-width: 960px;
                    max-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }

                .lb-img-wrap {
                    position: relative;
                    width: 100%;
                    max-height: calc(85vh - 64px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #1a1208;
                }

                /* Close */
                .lb-close {
                    position: absolute;
                    top: -16px; right: -16px;
                    width: 40px; height: 40px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    cursor: pointer;
                    z-index: 1;
                    transition: background 0.18s;
                }

                .lb-close:hover { background: rgba(255,255,255,0.2); }

                /* Nav */
                .lb-nav {
                    width: 44px; height: 44px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fef3c7;
                    cursor: pointer;
                    transition: background 0.18s;
                    flex-shrink: 0;
                }

                .lb-nav:hover { background: rgba(252,211,77,0.15); border-color: rgba(252,211,77,0.3); }

                .lb-nav-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .lb-counter {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.5);
                    min-width: 60px;
                    text-align: center;
                    letter-spacing: 0.06em;
                }

                .lb-caption {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    text-align: center;
                    letter-spacing: 0.03em;
                }
            `}</style>

            {/* Filter */}
            <GalleryFilter
                active={active}
                setActive={(cat) => { setActive(cat); setLightboxIdx(null); }}
                categories={CATEGORIES}
                counts={counts}
            />

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="gg-empty">No photos in this category yet.</div>
            ) : (
                <div className="gg-grid">
                    {filtered.map((img, idx) => (
                        <div
                            key={img.src}
                            className="gg-item"
                            onClick={() => openLightbox(idx)}
                            role="button"
                            tabIndex={0}
                            aria-label={`View ${img.alt}`}
                            onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                width={600}
                                height={800}
                                className="w-full h-auto object-cover"
                            />
                            <div className="gg-overlay" aria-hidden="true">
                                <span className="gg-cat-pill">{img.category}</span>
                                <span className="gg-zoom-icon">
                                    <ZoomIn size={13} strokeWidth={2} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div
                    className="lb-backdrop"
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                    tabIndex={-1}
                >
                    <div
                        className="lb-inner"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button className="lb-close" onClick={closeLightbox} aria-label="Close lightbox">
                            <X size={16} strokeWidth={2} />
                        </button>

                        {/* Image */}
                        <div className="lb-img-wrap">
                            <Image
                                src={filtered[lightboxIdx].src}
                                alt={filtered[lightboxIdx].alt}
                                width={960}
                                height={720}
                                className="object-contain w-full"
                                style={{ maxHeight: "calc(85vh - 80px)" }}
                                priority
                            />
                        </div>

                        {/* Caption */}
                        <div className="lb-caption">{filtered[lightboxIdx].alt}</div>

                        {/* Nav row */}
                        <div className="lb-nav-row">
                            <button className="lb-nav" onClick={prev} aria-label="Previous image">
                                <ChevronLeft size={18} strokeWidth={1.8} />
                            </button>
                            <span className="lb-counter">
                                {lightboxIdx + 1} / {filtered.length}
                            </span>
                            <button className="lb-nav" onClick={next} aria-label="Next image">
                                <ChevronRight size={18} strokeWidth={1.8} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}