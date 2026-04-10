// ============================================================
// components/gallery/GalleryFilter.tsx
// ============================================================
"use client";

/* ─── Types ─────────────────────────────────────────────────────── */

interface Props {
    active: string;
    setActive: (value: string) => void;
    categories: string[];
    counts: Record<string, number>;
}

const LABELS: Record<string, string> = {
    all:          "All Photos",
    classrooms:   "Classrooms",
    events:       "Events",
    certificates: "Certificates",
};

/* ─── Component ─────────────────────────────────────────────────── */

export default function GalleryFilter({
    active,
    setActive,
    categories,
    counts,
}: Props) {
    return (
        <>
            <div
                className="gf-wrap"
                role="group"
                aria-label="Filter gallery by category"
            >
                {categories.map((cat) => {
                    const isActive = active === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            aria-pressed={isActive}
                            className={
                                isActive
                                    ? "gf-btn gf-btn--active"
                                    : "gf-btn"
                            }
                        >
                            <span className="gf-btn__label">
                                {LABELS[cat] ??
                                    cat.charAt(0).toUpperCase() +
                                        cat.slice(1)}
                            </span>
                            <span className="gf-btn__count">
                                {counts[cat]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Component-scoped CSS ── */}
            <style>{`

/* ══════════════════════════════════════════
   GALLERY FILTER  —  component-scoped styles
   ══════════════════════════════════════════ */

.gf-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-10);
}

/* Base button */
.gf-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-normal);
  color: var(--text-tertiary);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast);
}
.gf-btn:hover {
  border-color: var(--color-primary-400);
  color: var(--text-primary);
  background: var(--color-primary-50);
}

/* Active state */
.gf-btn--active {
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  box-shadow: var(--shadow-sm);
}
.gf-btn--active:hover {
  background: var(--color-primary-700);
  border-color: var(--color-primary-700);
  color: var(--color-white);
}

/* Label */
.gf-btn__label {
  line-height: 1;
}

/* Count badge */
.gf-btn__count {
  font-size: 10px;
  font-weight: var(--font-weight-normal);
  line-height: 1.6;
  padding: 0 var(--space-2);
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.08);
  color: inherit;
  transition: background var(--transition-fast);
}
.gf-btn--active .gf-btn__count {
  background: rgba(255, 255, 255, 0.18);
}

/* Mobile */
@media (max-width: 480px) {
  .gf-wrap {
    gap: var(--space-2);
    margin-bottom: var(--space-8);
  }
  .gf-btn {
    font-size: var(--font-size-xs);
    padding: var(--space-2) var(--space-4);
  }
}

      `}</style>
        </>
    );
}