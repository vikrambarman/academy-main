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
    all:          "All Photos",
    classrooms:   "Classrooms",
    events:       "Events",
    certificates: "Certificates",
};

export default function GalleryFilter({ active, setActive, categories, counts }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-11"
            role="group" aria-label="Filter gallery by category">
            {categories.map((cat) => {
                const isActive = active === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        aria-pressed={isActive}
                        className="inline-flex items-center gap-2 rounded-full px-[18px] py-2 text-[0.82rem] whitespace-nowrap transition-all duration-200 cursor-pointer"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight:  isActive ? 500 : 400,
                            background:  isActive ? "var(--color-bg-sidebar)" : "var(--color-bg-card)",
                            border:      isActive
                                ? "1px solid var(--color-bg-sidebar)"
                                : "1px solid var(--color-border)",
                            color: isActive ? "var(--color-text-inverse)" : "var(--color-text-muted)",
                        }}
                        onMouseEnter={e => {
                            if (!isActive) {
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                                (e.currentTarget as HTMLElement).style.color       = "var(--color-text)";
                                (e.currentTarget as HTMLElement).style.background  = "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card))";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isActive) {
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                                (e.currentTarget as HTMLElement).style.color       = "var(--color-text-muted)";
                                (e.currentTarget as HTMLElement).style.background  = "var(--color-bg-card)";
                            }
                        }}>
                        <span>{LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                        {/* Count badge */}
                        <span className="text-[10px] font-light rounded-full px-1.5 leading-[1.6]"
                            style={{
                                background: isActive
                                    ? "color-mix(in srgb,var(--color-text-inverse) 15%,transparent)"
                                    : "color-mix(in srgb,var(--color-primary) 10%,var(--color-bg))",
                                color: isActive
                                    ? "var(--color-text-inverse)"
                                    : "var(--color-text-muted)",
                            }}>
                            {counts[cat]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}