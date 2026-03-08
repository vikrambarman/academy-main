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
            <style>{`
                .gf-root {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 44px;
                }

                .gf-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 400;
                    color: #6b5e4b;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 100px;
                    padding: 8px 18px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    position: relative;
                    overflow: hidden;
                }

                .gf-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: #fffbeb;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .gf-btn:hover { border-color: #d97706; color: #1a1208; }
                .gf-btn:hover::before { opacity: 1; }

                .gf-btn span { position: relative; z-index: 1; }

                .gf-btn.active {
                    background: #1a1208;
                    border-color: #1a1208;
                    color: #fef3c7;
                    font-weight: 500;
                }

                .gf-btn.active::before { display: none; }

                .gf-count {
                    position: relative;
                    z-index: 1;
                    font-size: 10px;
                    font-weight: 300;
                    background: rgba(255,255,255,0.15);
                    padding: 1px 7px;
                    border-radius: 100px;
                    line-height: 1.6;
                }

                .gf-btn:not(.active) .gf-count {
                    background: #f0e8d8;
                    color: #92826b;
                }
            `}</style>

            <div className="gf-root" role="group" aria-label="Filter gallery by category">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`gf-btn ${active === cat ? "active" : ""}`}
                        aria-pressed={active === cat}
                    >
                        <span>{LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                        <span className="gf-count">{counts[cat]}</span>
                    </button>
                ))}
            </div>
        </>
    );
}