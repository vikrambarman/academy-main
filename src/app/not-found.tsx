// ============================================================
// app/not-found.tsx
// ============================================================
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .nf-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    position: relative;
                    overflow: hidden;
                }

                .nf-glow {
                    position: fixed;
                    top: -80px; right: -80px;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 65%);
                    pointer-events: none;
                }

                .nf-inner {
                    max-width: 560px;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }

                /* Ghost 404 */
                .nf-ghost {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(80px, 18vw, 160px);
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1.5px rgba(217,119,6,0.12);
                    line-height: 1;
                    margin-bottom: -16px;
                    user-select: none;
                }

                .nf-eyebrow {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .nf-eyebrow::before,
                .nf-eyebrow::after {
                    content: '';
                    display: inline-block;
                    width: 20px; height: 1px;
                    background: #d97706;
                }

                .nf-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.6rem, 4vw, 2.4rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                    margin-bottom: 14px;
                }

                .nf-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .nf-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    margin-bottom: 36px;
                }

                /* Buttons */
                .nf-actions {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .nf-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    padding: 12px 24px;
                    border-radius: 100px;
                    text-decoration: none;
                    transition: background 0.18s, transform 0.15s;
                }

                .nf-btn-primary:hover { background: #2d1f0d; transform: translateY(-1px); }

                .nf-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 400;
                    color: #4a3f30;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    padding: 12px 24px;
                    border-radius: 100px;
                    text-decoration: none;
                    transition: background 0.18s, border-color 0.18s, transform 0.15s;
                }

                .nf-btn-secondary:hover {
                    background: #fef9ee;
                    border-color: #d97706;
                    color: #1a1208;
                    transform: translateY(-1px);
                }

                .nf-footer {
                    margin-top: 48px;
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: #c4b5a0;
                }
            `}</style>

            <main className="nf-root">
                <div className="nf-glow" aria-hidden="true" />

                <div className="nf-inner">
                    <div className="nf-ghost" aria-hidden="true">404</div>
                    <div className="nf-eyebrow">Page Not Found</div>
                    <h1 className="nf-title">
                        This Page<br /><em>Doesn't Exist</em>
                    </h1>
                    <p className="nf-desc">
                        The page you are looking for does not exist or may have been moved.
                        Return to the homepage or explore our courses.
                    </p>

                    <div className="nf-actions">
                        <Link href="/" className="nf-btn-primary">
                            Go to Homepage <span aria-hidden="true">→</span>
                        </Link>
                        <Link href="/courses" className="nf-btn-secondary">
                            Browse Courses
                        </Link>
                    </div>

                    <div className="nf-footer">Shivshakti Computer Academy · Ambikapur</div>
                </div>
            </main>
        </>
    );
}