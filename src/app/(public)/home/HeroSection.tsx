import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

                .hero-root {
                    font-family: 'DM Sans', sans-serif;
                    background-color: #faf8f4;
                    position: relative;
                    overflow: hidden;
                    min-height: 100svh;
                    display: flex;
                    align-items: center;
                }

                /* Large decorative background text */
                .hero-bg-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(120px, 20vw, 240px);
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(180, 83, 9, 0.07);
                    white-space: nowrap;
                    pointer-events: none;
                    user-select: none;
                    letter-spacing: -0.02em;
                    z-index: 0;
                }

                /* Subtle grain overlay */
                .hero-grain {
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.4;
                }

                /* Amber glow top-right */
                .hero-glow {
                    position: absolute;
                    top: -100px;
                    right: -100px;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(217,119,6,0.10) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Bottom-left secondary glow */
                .hero-glow-2 {
                    position: absolute;
                    bottom: -80px;
                    left: -60px;
                    width: 360px;
                    height: 360px;
                    background: radial-gradient(circle, rgba(252,211,77,0.08) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Inner wrapper */
                .hero-inner {
                    position: relative;
                    z-index: 1;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 100px 32px 80px;
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 64px;
                    align-items: center;
                }

                /* ── Left Content ── */
                .hero-left {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                /* Eyebrow badge */
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    background: #fffbeb;
                    border: 1px solid #fcd34d;
                    padding: 6px 16px;
                    border-radius: 100px;
                    width: fit-content;
                    animation: fadeSlideUp 0.6s ease both;
                    animation-delay: 0.1s;
                }

                .hero-badge-dot {
                    width: 6px;
                    height: 6px;
                    background: #d97706;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(0.85); }
                }

                /* H1 */
                .hero-h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2.4rem, 4.5vw, 3.8rem);
                    font-weight: 700;
                    line-height: 1.12;
                    color: #1a1208;
                    margin-top: 24px;
                    animation: fadeSlideUp 0.6s ease both;
                    animation-delay: 0.2s;
                }

                .hero-h1-em {
                    font-style: italic;
                    color: #b45309;
                    position: relative;
                    display: inline-block;
                }

                /* Underline squiggle on italic word */
                .hero-h1-em::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: #fcd34d;
                    border-radius: 2px;
                    transform-origin: left;
                    animation: growLine 0.6s ease both;
                    animation-delay: 0.7s;
                    transform: scaleX(0);
                }

                @keyframes growLine {
                    to { transform: scaleX(1); }
                }

                /* Subtitle */
                .hero-subtitle {
                    margin-top: 24px;
                    font-size: 1rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.75;
                    max-width: 480px;
                    animation: fadeSlideUp 0.6s ease both;
                    animation-delay: 0.3s;
                }

                /* Trust chips */
                .hero-trust {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 28px;
                    animation: fadeSlideUp 0.6s ease both;
                    animation-delay: 0.4s;
                }

                .hero-trust-chip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 400;
                    color: #4a3f30;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    padding: 5px 12px;
                    border-radius: 100px;
                }

                .hero-trust-chip-icon {
                    font-size: 0.9rem;
                }

                /* CTA buttons */
                .hero-ctas {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-top: 40px;
                    animation: fadeSlideUp 0.6s ease both;
                    animation-delay: 0.5s;
                }

                .hero-cta-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #1a1208;
                    color: #fef3c7;
                    font-size: 0.9rem;
                    font-weight: 500;
                    padding: 14px 28px;
                    border-radius: 100px;
                    text-decoration: none;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 20px rgba(26,18,8,0.2);
                }

                .hero-cta-primary:hover {
                    background: #2d1f0d;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 28px rgba(26,18,8,0.25);
                }

                .hero-cta-primary-arrow {
                    transition: transform 0.2s;
                }

                .hero-cta-primary:hover .hero-cta-primary-arrow {
                    transform: translateX(4px);
                }

                .hero-cta-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    color: #1a1208;
                    font-size: 0.9rem;
                    font-weight: 500;
                    padding: 14px 28px;
                    border-radius: 100px;
                    border: 1.5px solid #d5c9b5;
                    text-decoration: none;
                    transition: border-color 0.2s, background 0.2s, transform 0.15s;
                }

                .hero-cta-secondary:hover {
                    border-color: #b45309;
                    background: #fffbeb;
                    transform: translateY(-2px);
                }

                /* Stat strip below CTAs */
                .hero-stats {
                    display: flex;
                    gap: 32px;
                    margin-top: 48px;
                    padding-top: 32px;
                    border-top: 1px solid #e8dfd0;
                    animation: fadeSlideUp 0.6s ease both;
                    animation-delay: 0.6s;
                }

                .hero-stat {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .hero-stat-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.7rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1;
                }

                .hero-stat-label {
                    font-size: 0.72rem;
                    font-weight: 400;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #92826b;
                }

                .hero-stat-divider {
                    width: 1px;
                    height: 36px;
                    background: #e2d9c8;
                    align-self: center;
                }

                /* ── Right Image ── */
                .hero-right {
                    position: relative;
                    animation: fadeSlideRight 0.7s ease both;
                    animation-delay: 0.3s;
                }

                /* Main image frame */
                .hero-img-frame {
                    position: relative;
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow: 0 32px 80px rgba(100,70,20,0.18);
                    aspect-ratio: 4/3;
                    background: #f0ead8;
                }

                /* Amber border accent — top-left corner decoration */
                .hero-img-frame::before {
                    content: '';
                    position: absolute;
                    top: -12px;
                    left: -12px;
                    width: 80px;
                    height: 80px;
                    border-top: 3px solid #d97706;
                    border-left: 3px solid #d97706;
                    border-radius: 4px 0 0 0;
                    z-index: 2;
                    pointer-events: none;
                }

                /* Bottom-right corner */
                .hero-img-frame::after {
                    content: '';
                    position: absolute;
                    bottom: -12px;
                    right: -12px;
                    width: 80px;
                    height: 80px;
                    border-bottom: 3px solid #d97706;
                    border-right: 3px solid #d97706;
                    border-radius: 0 0 4px 0;
                    z-index: 2;
                    pointer-events: none;
                }

                /* Floating badge on image */
                .hero-float-badge {
                    position: absolute;
                    bottom: 24px;
                    left: 24px;
                    background: rgba(26,18,8,0.88);
                    backdrop-filter: blur(8px);
                    color: #fef3c7;
                    border-radius: 16px;
                    padding: 14px 18px;
                    z-index: 3;
                    min-width: 160px;
                    border: 1px solid rgba(253,230,138,0.2);
                }

                .hero-float-badge-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fcd34d;
                    line-height: 1;
                }

                .hero-float-badge-text {
                    font-size: 0.72rem;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: rgba(254,243,199,0.7);
                    margin-top: 4px;
                }

                /* Small decorative dot grid */
                .hero-dot-grid {
                    position: absolute;
                    top: -24px;
                    right: -24px;
                    width: 96px;
                    height: 96px;
                    background-image: radial-gradient(circle, #d97706 1.2px, transparent 1.2px);
                    background-size: 12px 12px;
                    opacity: 0.25;
                    z-index: 0;
                }

                /* Animations */
                @keyframes fadeSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeSlideRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                /* ── Responsive ── */
                @media (max-width: 900px) {
                    .hero-inner {
                        grid-template-columns: 1fr;
                        padding: 80px 24px 60px;
                        gap: 48px;
                    }

                    .hero-right {
                        animation: fadeSlideUp 0.7s ease both;
                        animation-delay: 0.4s;
                    }

                    .hero-bg-text {
                        font-size: 80px;
                    }

                    .hero-stats {
                        gap: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .hero-h1 {
                        font-size: 2rem;
                    }

                    .hero-stats {
                        flex-wrap: wrap;
                        gap: 16px;
                    }

                    .hero-stat-divider {
                        display: none;
                    }

                    .hero-ctas {
                        flex-direction: column;
                    }

                    .hero-cta-primary,
                    .hero-cta-secondary {
                        justify-content: center;
                    }
                }
            `}</style>

            <section className="hero-root" aria-labelledby="hero-heading">

                {/* Decorative layers */}
                <div className="hero-bg-text" aria-hidden="true">Digital</div>
                <div className="hero-grain" aria-hidden="true" />
                <div className="hero-glow" aria-hidden="true" />
                <div className="hero-glow-2" aria-hidden="true" />

                <div className="hero-inner">

                    {/* ── LEFT ── */}
                    <div className="hero-left">

                        {/* Badge */}
                        <div className="hero-badge">
                            <span className="hero-badge-dot" aria-hidden="true" />
                            Government Recognized Training Centre
                        </div>

                        {/* H1 */}
                        <h1 id="hero-heading" className="hero-h1">
                            Empower Your Future<br />
                            with{" "}
                            <span className="hero-h1-em">Digital Skills</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-subtitle">
                            Shivshakti Computer Academy provides practical computer education,
                            government-recognized certifications, and career-focused digital
                            skill programs — designed for real-world success in Ambikapur & Surguja.
                        </p>

                        {/* Trust chips */}
                        <div className="hero-trust">
                            <span className="hero-trust-chip">
                                <span className="hero-trust-chip-icon">🏅</span>
                                ISO Certified
                            </span>
                            <span className="hero-trust-chip">
                                <span className="hero-trust-chip-icon">🏢</span>
                                MSME Registered
                            </span>
                            <span className="hero-trust-chip">
                                <span className="hero-trust-chip-icon">🔗</span>
                                DigiLocker Enabled
                            </span>
                            <span className="hero-trust-chip">
                                <span className="hero-trust-chip-icon">📜</span>
                                NSDC Partner
                            </span>
                        </div>

                        {/* CTAs */}
                        <div className="hero-ctas">
                            <Link href="/courses" className="hero-cta-primary">
                                Explore Courses
                                <span className="hero-cta-primary-arrow" aria-hidden="true">→</span>
                            </Link>
                            <Link href="/verify-certificate" className="hero-cta-secondary">
                                🎓 Verify Certificate
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <div className="hero-stat-num">1000+</div>
                                <div className="hero-stat-label">Students Trained</div>
                            </div>
                            <div className="hero-stat-divider" aria-hidden="true" />
                            <div className="hero-stat">
                                <div className="hero-stat-num">25+</div>
                                <div className="hero-stat-label">Courses Offered</div>
                            </div>
                            <div className="hero-stat-divider" aria-hidden="true" />
                            <div className="hero-stat">
                                <div className="hero-stat-num">5★</div>
                                <div className="hero-stat-label">Student Rating</div>
                            </div>
                        </div>

                    </div>

                    {/* ── RIGHT ── */}
                    <div className="hero-right">
                        <div className="hero-dot-grid" aria-hidden="true" />

                        <div className="hero-img-frame">
                            <Image
                                src="/hero-modern.png"
                                alt="Students learning digital skills at Shivshakti Computer Academy, Ambikapur"
                                fill
                                sizes="(max-width: 900px) 100vw, 560px"
                                priority
                                className="object-cover"
                            />

                            {/* Floating badge overlay */}
                            <div className="hero-float-badge" aria-hidden="true">
                                <div className="hero-float-badge-num">500+</div>
                                <div className="hero-float-badge-text">Certified Graduates</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}