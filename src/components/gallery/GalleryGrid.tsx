// ============================================================
// components/gallery/GalleryGrid.tsx
// ============================================================
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import GalleryFilter from "./GalleryFilter";

const IMAGES = [
    { src: "/images/gallery/classrooms/classroom1.jpeg",   category: "classrooms",   alt: "Computer lab classroom at Shivshakti Academy"  },
    { src: "/images/gallery/classrooms/classroom2.jpeg",   category: "classrooms",   alt: "Students in practical training session"         },
    { src: "/images/gallery/classrooms/classroom3.jpeg",   category: "classrooms",   alt: "Students in practical training session"         },
    { src: "/images/gallery/classrooms/classroom4.jpeg",   category: "classrooms",   alt: "Students in practical training session"         },
    { src: "/images/gallery/classrooms/classroom5.jpeg",   category: "classrooms",   alt: "Students in practical training session"         },
    { src: "/images/gallery/classrooms/classroom6.jpeg",   category: "classrooms",   alt: "Academy's Corridor at Shivshakti Academy"      },
    { src: "/images/gallery/events/event1.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event2.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event3.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event4.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event5.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event6.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event7.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event8.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event9.jpeg",           category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event10.jpeg",          category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event11.jpeg",          category: "events",       alt: "December 2025 Picnic"                          },
    { src: "/images/gallery/events/event12.jpeg",          category: "events",       alt: "Students photo shoot"                          },
    { src: "/images/gallery/events/event13.jpeg",          category: "events",       alt: "Students photo shoot"                          },
    { src: "/images/gallery/events/event14.jpeg",          category: "events",       alt: "Reception Area"                                },
    { src: "/images/gallery/events/event15.jpeg",          category: "events",       alt: "Saraswati Pooja 2026"                          },
    { src: "/images/gallery/events/event16.jpeg",          category: "events",       alt: "Students photo shoot"                          },
    { src: "/images/gallery/certificates/certificate1.jpeg", category: "certificates", alt: "Student receiving verified certificate"      },
];

const CATEGORIES = ["all", "classrooms", "events", "certificates"];

export default function GalleryGrid() {
    const [active, setActive]           = useState("all");
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const filtered = active === "all" ? IMAGES : IMAGES.filter(img => img.category === active);

    const counts: Record<string, number> = { all: IMAGES.length };
    IMAGES.forEach(img => { counts[img.category] = (counts[img.category] ?? 0) + 1; });

    const openLightbox  = (idx: number)  => setLightboxIdx(idx);
    const closeLightbox = useCallback(() => setLightboxIdx(null), []);

    const prev = useCallback(() => {
        setLightboxIdx(i => i === null ? null : (i - 1 + filtered.length) % filtered.length);
    }, [filtered.length]);

    const next = useCallback(() => {
        setLightboxIdx(i => i === null ? null : (i + 1) % filtered.length);
    }, [filtered.length]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape")     closeLightbox();
        if (e.key === "ArrowLeft")  prev();
        if (e.key === "ArrowRight") next();
    }, [closeLightbox, prev, next]);

    return (
        <>
            {/* Masonry columns CSS — minimal, no colors */}
            <style>{`
                .gg-grid { columns: 1; gap: 14px; }
                @media (min-width: 640px)  { .gg-grid { columns: 2; } }
                @media (min-width: 1024px) { .gg-grid { columns: 3; } }
                .gg-item { break-inside: avoid; margin-bottom: 14px; }
                .gg-item img { display: block; width: 100%; height: auto; transition: transform 0.6s ease; }
                .gg-item:hover img { transform: scale(1.04); }
                .gg-item:hover .gg-overlay { opacity: 1; }
            `}</style>

            {/* Filter */}
            <GalleryFilter
                active={active}
                setActive={cat => { setActive(cat); setLightboxIdx(null); }}
                categories={CATEGORIES}
                counts={counts}
            />

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 px-6 text-[0.88rem] font-light"
                    style={{ color: "var(--color-text-muted)" }}>
                    No photos in this category yet.
                </div>
            ) : (
                <div className="gg-grid">
                    {filtered.map((img, idx) => (
                        <div key={img.src}
                            className="gg-item relative rounded-[18px] overflow-hidden cursor-pointer transition-all duration-200"
                            style={{
                                background: "color-mix(in srgb,var(--color-primary) 6%,var(--color-bg))",
                                border: "1px solid var(--color-border)",
                            }}
                            onClick={() => openLightbox(idx)}
                            role="button" tabIndex={0}
                            aria-label={`View ${img.alt}`}
                            onKeyDown={e => e.key === "Enter" && openLightbox(idx)}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                                (e.currentTarget as HTMLElement).style.boxShadow   = "0 12px 40px color-mix(in srgb,var(--color-primary) 18%,transparent)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                                (e.currentTarget as HTMLElement).style.boxShadow   = "none";
                            }}>

                            <Image src={img.src} alt={img.alt}
                                width={600} height={800}
                                className="w-full h-auto object-cover" />

                            {/* Hover overlay */}
                            <div className="gg-overlay absolute inset-0 opacity-0 transition-opacity duration-300 flex items-end justify-between px-5 py-[18px]"
                                style={{ background: "linear-gradient(to top,color-mix(in srgb,var(--color-bg-sidebar) 80%,transparent) 0%,transparent 55%)" }}
                                aria-hidden="true">
                                {/* Category pill */}
                                <span className="text-[9px] font-medium tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                                    style={{
                                        color:      "var(--color-text-inverse)",
                                        background: "color-mix(in srgb,var(--color-primary) 30%,transparent)",
                                        border:     "1px solid color-mix(in srgb,var(--color-primary) 45%,transparent)",
                                    }}>
                                    {img.category}
                                </span>
                                {/* Zoom icon */}
                                <span className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{
                                        background: "color-mix(in srgb,var(--color-text-inverse) 15%,transparent)",
                                        border:     "1px solid color-mix(in srgb,var(--color-text-inverse) 22%,transparent)",
                                        color:      "var(--color-text-inverse)",
                                    }}>
                                    <ZoomIn size={13} strokeWidth={2} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ══════════════════════ LIGHTBOX ══════════════════════ */}
            {lightboxIdx !== null && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6 animate-[lbFadeIn_0.2s_ease]"
                    style={{ background: "rgba(10,7,3,0.94)", backdropFilter: "blur(8px)" }}
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    role="dialog" aria-modal="true" aria-label="Image lightbox"
                    tabIndex={-1}>

                    <style>{`
                        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
                    `}</style>

                    <div className="relative w-full max-w-[960px] flex flex-col items-center gap-4"
                        style={{ maxHeight: "85vh" }}
                        onClick={e => e.stopPropagation()}>

                        {/* Close button */}
                        <button onClick={closeLightbox}
                            aria-label="Close lightbox"
                            className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-200 cursor-pointer"
                            style={{
                                background: "color-mix(in srgb,var(--color-text-inverse) 10%,transparent)",
                                border:     "1px solid color-mix(in srgb,var(--color-text-inverse) 15%,transparent)",
                                color:      "var(--color-text-inverse)",
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-text-inverse) 20%,transparent)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-text-inverse) 10%,transparent)"}>
                            <X size={16} strokeWidth={2} />
                        </button>

                        {/* Image */}
                        <div className="relative w-full flex items-center justify-center rounded-2xl overflow-hidden"
                            style={{ background: "var(--color-bg-sidebar)", maxHeight: "calc(85vh - 80px)" }}>
                            <Image
                                src={filtered[lightboxIdx].src}
                                alt={filtered[lightboxIdx].alt}
                                width={960} height={720}
                                className="object-contain w-full"
                                style={{ maxHeight: "calc(85vh - 80px)" }}
                                priority />
                        </div>

                        {/* Caption */}
                        <div className="text-[0.78rem] font-light text-center tracking-[0.03em]"
                            style={{ color: "color-mix(in srgb,var(--color-text-inverse) 45%,transparent)" }}>
                            {filtered[lightboxIdx].alt}
                        </div>

                        {/* Nav row */}
                        <div className="flex items-center gap-4">
                            {/* Prev */}
                            <button onClick={prev} aria-label="Previous image"
                                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer"
                                style={{
                                    background: "color-mix(in srgb,var(--color-text-inverse) 8%,transparent)",
                                    border:     "1px solid color-mix(in srgb,var(--color-text-inverse) 12%,transparent)",
                                    color:      "var(--color-text-inverse)",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background   = "color-mix(in srgb,var(--color-primary) 20%,transparent)";
                                    (e.currentTarget as HTMLElement).style.borderColor  = "color-mix(in srgb,var(--color-primary) 35%,transparent)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background   = "color-mix(in srgb,var(--color-text-inverse) 8%,transparent)";
                                    (e.currentTarget as HTMLElement).style.borderColor  = "color-mix(in srgb,var(--color-text-inverse) 12%,transparent)";
                                }}>
                                <ChevronLeft size={18} strokeWidth={1.8} />
                            </button>

                            {/* Counter */}
                            <span className="text-[0.78rem] font-light min-w-[60px] text-center tracking-[0.06em]"
                                style={{ color: "color-mix(in srgb,var(--color-text-inverse) 50%,transparent)" }}>
                                {lightboxIdx + 1} / {filtered.length}
                            </span>

                            {/* Next */}
                            <button onClick={next} aria-label="Next image"
                                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer"
                                style={{
                                    background: "color-mix(in srgb,var(--color-text-inverse) 8%,transparent)",
                                    border:     "1px solid color-mix(in srgb,var(--color-text-inverse) 12%,transparent)",
                                    color:      "var(--color-text-inverse)",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background   = "color-mix(in srgb,var(--color-primary) 20%,transparent)";
                                    (e.currentTarget as HTMLElement).style.borderColor  = "color-mix(in srgb,var(--color-primary) 35%,transparent)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background   = "color-mix(in srgb,var(--color-text-inverse) 8%,transparent)";
                                    (e.currentTarget as HTMLElement).style.borderColor  = "color-mix(in srgb,var(--color-text-inverse) 12%,transparent)";
                                }}>
                                <ChevronRight size={18} strokeWidth={1.8} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}