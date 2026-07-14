// ============================================================
// components/gallery/GalleryFilter.tsx
// ============================================================
"use client";

interface Props {
  active: string;
  setActive: (value: string) => void;
  categories: string[];
  counts: Record<string, number>;
}

const LABELS: Record<string, string> = {
  all: "All Photos",
  classrooms: "Classrooms & Labs",
  events: "Events & Functions",
  certificates: "Certificates",
  exams: "Examinations",
};

const ICONS: Record<string, string> = {
  all: "📷",
  classrooms: "🖥️",
  events: "🎉",
  certificates: "📜",
  exams: "📝",
};

export default function GalleryFilter({
  active,
  setActive,
  categories,
  counts,
}: Props) {
  return (
    <div className="gl-filter-group" role="group" aria-label="Filter gallery by category">
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            aria-pressed={isActive}
            className={isActive ? "gf-btn gf-btn--active" : "gf-btn"}
          >
            <span className="gf-btn__label">
              <span style={{ marginRight: "var(--space-2)" }}>{ICONS[cat] || "📷"}</span>
              {LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)}
            </span>
            <span className="gf-btn__count">{counts[cat] || 0}</span>
          </button>
        );
      })}
    </div>
  );
}