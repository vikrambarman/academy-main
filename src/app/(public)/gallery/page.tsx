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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .gp-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                }

                .gp-hero {
                    padding: 88px 24px 72px;
                    position: relative;
                    overflow: hidden;
                }

                .gp-hero-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                .gp-hero-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .gp-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .gp-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 1.5px;
                    background: #d97706;
                }

                .gp-hero-layout {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                }

                .gp-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.15;
                }

                .gp-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .gp-hero-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    max-width: 340px;
                    padding-bottom: 4px;
                }

                .gp-body {
                    padding: 0 24px 88px;
                    position: relative;
                }

                .gp-body::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .gp-body-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding-top: 52px;
                }

                @media (max-width: 640px) {
                    .gp-hero { padding: 64px 20px 52px; }
                    .gp-body { padding: 0 20px 64px; }
                    .gp-hero-layout { flex-direction: column; align-items: flex-start; gap: 12px; }
                }
            `}</style>

            <main className="gp-root">
                <div className="gp-hero">
                    <div className="gp-hero-glow" aria-hidden="true" />
                    <div className="gp-hero-inner">
                        <div className="gp-eyebrow">Our Campus</div>
                        <div className="gp-hero-layout">
                            <h1 className="gp-title">
                                Academy<br /><em>Gallery</em>
                            </h1>
                            <p className="gp-hero-desc">
                                A look inside our classrooms, computer labs,
                                student activities and certification events.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="gp-body">
                    <div className="gp-body-inner">
                        <GalleryGrid />
                    </div>
                </div>
            </main>
        </>
    );
}