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
  classrooms: "Classrooms",
  events: "Events",
  certificates: "Certificates",
};

export default function GalleryFilter({ active, setActive, categories, counts }: Props) {
  return (
    <>
      <div className="gf-wrap" role="group" aria-label="Filter gallery by category">
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
                {LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
              <span className="gf-btn__count">{counts[cat]}</span>
            </button>
          );
        })}
      </div>

      <style>{`
/* ── GALLERY FILTER — Clean University style ── */
.gf-wrap { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); margin-bottom: var(--space-8); }

.gf-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-4); border-radius: var(--radius-md);
  font-size: var(--font-size-sm); font-family: var(--font-sans); font-weight: var(--font-weight-medium);
  color: var(--text-secondary); background: var(--bg-elevated); border: 1px solid var(--border-color);
  cursor: pointer; white-space: nowrap;
  transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}
.gf-btn:hover { border-color: var(--color-gray-300); color: var(--text-primary); }
.gf-btn--active { color: #fff; background: var(--color-primary-600); border-color: var(--color-primary-600); }
.gf-btn--active:hover { background: var(--color-primary-700); border-color: var(--color-primary-700); color: #fff; }
.gf-btn__label { line-height: 1; }
.gf-btn__count {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); line-height: 1.6;
  padding: 0 var(--space-2); border-radius: var(--radius-full);
  background: var(--bg-surface); color: var(--text-tertiary);
}
.gf-btn--active .gf-btn__count { background: rgba(255,255,255,0.2); color: #fff; }

@media (max-width: 480px) {
  .gf-wrap { margin-bottom: var(--space-6); }
  .gf-btn { font-size: var(--font-size-xs); padding: var(--space-2) var(--space-3); }
}
      `}</style>
    </>
  );
}
