// ============================================================
// components/gallery/GalleryGrid.tsx
// ============================================================
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import GalleryFilter from "./GalleryFilter";

/* ─── Data (Add more photos here) ─── */
const IMAGES = [

  // Annual Day 7th July 2026
  { src: "/images/gallery/events/event17.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event18.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event19.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event20.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event21.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event22.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event23.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event24.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event25.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event26.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event27.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event28.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event29.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event30.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event31.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event32.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event33.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event34.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event35.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event36.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event37.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event38.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event39.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event40.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event41.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event42.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event43.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event44.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },
  { src: "/images/gallery/events/event45.jpg", category: "events", alt: "First Annual Day 7th July 2026", size: "normal" },


  // First Picnic December 2025
  { src: "/images/gallery/events/event1.jpeg", category: "events", alt: "Annual Day Celebration 2025", size: "wide" },
  { src: "/images/gallery/events/event2.jpeg", category: "events", alt: "Students performing on stage", size: "tall" },
  { src: "/images/gallery/events/event3.jpeg", category: "events", alt: "Annual Day function", size: "normal" },
  { src: "/images/gallery/events/event4.jpeg", category: "events", alt: "Picnic December 2025", size: "normal" },
  { src: "/images/gallery/events/event5.jpeg", category: "events", alt: "Students group photo", size: "normal" },
  { src: "/images/gallery/events/event6.jpeg", category: "events", alt: "Outdoor activity", size: "wide" },
  { src: "/images/gallery/events/event7.jpeg", category: "events", alt: "Cultural program", size: "normal" },
  { src: "/images/gallery/events/event8.jpeg", category: "events", alt: "Sports day event", size: "normal" },
  { src: "/images/gallery/events/event9.jpeg", category: "events", alt: "Students celebration", size: "tall" },
  { src: "/images/gallery/events/event10.jpeg", category: "events", alt: "Group activity", size: "normal" },
  { src: "/images/gallery/events/event11.jpeg", category: "events", alt: "Annual function", size: "normal" },
  { src: "/images/gallery/events/event12.jpeg", category: "events", alt: "Students photo shoot", size: "normal" },
  { src: "/images/gallery/events/event13.jpeg", category: "events", alt: "Students photo shoot", size: "wide" },
  { src: "/images/gallery/events/event14.jpeg", category: "events", alt: "Reception Area", size: "normal" },
  { src: "/images/gallery/events/event15.jpeg", category: "events", alt: "Saraswati Pooja 2026", size: "tall" },
  { src: "/images/gallery/events/event16.jpeg", category: "events", alt: "Students photo shoot", size: "normal" },

  // Classrooms 
  { src: "/images/gallery/classrooms/classroom1.jpeg", category: "classrooms", alt: "Computer lab classroom at Shivshakti Academy", size: "normal" },
  { src: "/images/gallery/classrooms/classroom2.jpeg", category: "classrooms", alt: "Students during annual day", size: "tall" },
  { src: "/images/gallery/classrooms/classroom3.jpeg", category: "classrooms", alt: "Students working on computers", size: "normal" },
  { src: "/images/gallery/classrooms/classroom4.jpeg", category: "classrooms", alt: "Computer lab with modern systems", size: "wide" },
  { src: "/images/gallery/classrooms/classroom5.jpeg", category: "classrooms", alt: "Students in exam time", size: "normal" },
  { src: "/images/gallery/classrooms/classroom6.jpeg", category: "classrooms", alt: "Students group photos after exam", size: "normal" },
  { src: "/images/gallery/classrooms/classroom7.jpeg", category: "classrooms", alt: "Students group photos after exam", size: "normal" },
  { src: "/images/gallery/classrooms/classroom8.jpeg", category: "classrooms", alt: "Students group photos after exam", size: "normal" },
  { src: "/images/gallery/classrooms/classroom9.jpeg", category: "classrooms", alt: "Students group photos after exam", size: "normal" },


  { src: "/images/gallery/certificates/certificate1.jpeg", category: "certificates", alt: "Student receiving verified certificate", size: "normal" },
  // { src: "/images/gallery/certificates/certificate2.jpeg", category: "certificates", alt: "Certificate distribution ceremony", size: "wide" },
  { src: "/images/gallery/exams/exam1.jpeg", category: "exams", alt: "Examination hall", size: "normal" },
  // { src: "/images/gallery/exams/exam2.jpeg", category: "exams", alt: "Students taking exam", size: "tall" },
  // { src: "/images/gallery/exams/exam3.jpeg", category: "exams", alt: "Exam center", size: "normal" },
];

const CATEGORIES = ["all", "classrooms", "events", "certificates", "exams"];

/* ─── Icons ─── */
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ZoomInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export default function GalleryGrid() {
  const [active, setActive] = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filtered = active === "all" ? IMAGES : IMAGES.filter((img) => img.category === active);

  const counts: Record<string, number> = { all: IMAGES.length };
  IMAGES.forEach((img) => {
    counts[img.category] = (counts[img.category] ?? 0) + 1;
  });

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxIdx(null);
    document.body.style.overflow = "";
  }, []);

  const prev = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    },
    [closeLightbox, prev, next]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="gl-layout">
        <aside className="gl-sidebar">
          <GalleryFilter
            active={active}
            setActive={setActive}
            categories={CATEGORIES}
            counts={counts}
          />
        </aside>
        <div className="gl-grid-wrap">
          <div className="gg-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="gg-item" style={{ background: "var(--color-gray-200)" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="gl-layout">
        {/* ── SIDEBAR ── */}
        <aside className="gl-sidebar" aria-label="Gallery filters">
          <div className="gl-sidebar__title">Filter Photos</div>

          <div className="gl-sidebar__stats">
            <div className="gl-sidebar__stat gl-sidebar__stat--total">
              <span>Total Photos</span>
              <span>{IMAGES.length}</span>
            </div>
          </div>

          <GalleryFilter
            active={active}
            setActive={(cat) => {
              setActive(cat);
              setLightboxIdx(null);
            }}
            categories={CATEGORIES}
            counts={counts}
          />

          <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>
              <ImageIcon />
              <span>Click any photo to enlarge</span>
            </div>
          </div>
        </aside>

        {/* ── GRID ── */}
        <div className="gl-grid-wrap">
          {filtered.length === 0 ? (
            <div className="gg-empty">No photos in this category yet.</div>
          ) : (
            <div className="gg-grid">
              {filtered.map((img, idx) => (
                <div
                  key={img.src}
                  className={`gg-item ${img.size === "wide" ? "gg-item--wide" : ""} ${img.size === "tall" ? "gg-item--tall" : ""}`}
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
                    className="gg-item__img"
                    loading="lazy"
                  />
                  <div className="gg-overlay" aria-hidden="true">
                    <div className="gg-overlay__info">
                      <span className="gg-overlay__pill">{img.category}</span>
                      <span className="gg-overlay__alt">{img.alt}</span>
                    </div>
                    <span className="gg-overlay__zoom">
                      <ZoomInIcon />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
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
          <div className="gg-lb__inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="gg-lb__close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <XIcon />
            </button>
            <div className="gg-lb__img-wrap">
              <Image
                src={filtered[lightboxIdx].src}
                alt={filtered[lightboxIdx].alt}
                width={1200}
                height={900}
                className="gg-lb__img"
                priority
              />
            </div>
            <p className="gg-lb__caption">{filtered[lightboxIdx].alt}</p>
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
    </>
  );
}