"use client"

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <>
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeSlideRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes growLine {
                    to { transform: scaleX(1); }
                }
                @keyframes badgePulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%      { opacity: 0.6; transform: scale(0.85); }
                }

                .hero-badge-dot { animation: badgePulse 2s infinite; }
                .hero-arrow     { transition: transform 0.2s; }
                .hero-cta-primary:hover .hero-arrow { transform: translateX(4px); }

                /* Underline on italic em */
                .hero-em-line { position: relative; display: inline-block; }
                .hero-em-line::after {
                    content: '';
                    position: absolute;
                    bottom: -4px; left: 0; right: 0;
                    height: 3px;
                    background: var(--color-accent);
                    border-radius: 2px;
                    transform: scaleX(0);
                    transform-origin: left;
                    animation: growLine 0.6s ease both 0.8s;
                }

                /* Image frame corner accents */
                .hero-img-frame { position: relative; }
                .hero-img-frame::before {
                    content: '';
                    position: absolute;
                    top: -12px; left: -12px;
                    width: 72px; height: 72px;
                    border-top: 3px solid var(--color-primary);
                    border-left: 3px solid var(--color-primary);
                    border-radius: 4px 0 0 0;
                    z-index: 2; pointer-events: none;
                }
                .hero-img-frame::after {
                    content: '';
                    position: absolute;
                    bottom: -12px; right: -12px;
                    width: 72px; height: 72px;
                    border-bottom: 3px solid var(--color-accent);
                    border-right: 3px solid var(--color-accent);
                    border-radius: 0 0 4px 0;
                    z-index: 2; pointer-events: none;
                }

                .anim-1 { animation: fadeSlideUp 0.6s ease both 0.1s; }
                .anim-2 { animation: fadeSlideUp 0.6s ease both 0.2s; }
                .anim-3 { animation: fadeSlideUp 0.6s ease both 0.3s; }
                .anim-4 { animation: fadeSlideUp 0.6s ease both 0.4s; }
                .anim-5 { animation: fadeSlideUp 0.6s ease both 0.5s; }
                .anim-6 { animation: fadeSlideUp 0.6s ease both 0.6s; }
                .anim-r { animation: fadeSlideRight 0.7s ease both 0.3s; }
            `}</style>

            <section
                className="relative overflow-hidden min-h-svh flex items-center"
                style={{ background: "var(--color-bg)" }}
                aria-labelledby="hero-heading"
            >
                {/* Grid pattern */}
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: "linear-gradient(color-mix(in srgb,var(--color-primary) 4%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--color-primary) 4%,transparent) 1px,transparent 1px)",
                        backgroundSize: "48px 48px",
                        opacity: 0.5,
                    }} />

                {/* Blue glow top-right */}
                <div aria-hidden="true" className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 10%,transparent) 0%,transparent 65%)" }} />

                {/* Accent glow bottom-left */}
                <div aria-hidden="true" className="absolute -bottom-20 -left-16 w-[360px] h-[360px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-accent) 7%,transparent) 0%,transparent 65%)" }} />

                {/* Ghost watermark */}
                <div aria-hidden="true"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-black italic pointer-events-none select-none text-transparent z-0 whitespace-nowrap"
                    style={{ fontSize: "clamp(100px,18vw,220px)", WebkitTextStroke: "1px color-mix(in srgb,var(--color-primary) 5%,transparent)" }}>
                    Digital
                </div>

                {/* Main grid */}
                <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-8 pt-24 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

                    {/* ════ LEFT ════ */}
                    <div className="flex flex-col">

                        {/* Badge */}
                        <div className="anim-1 inline-flex items-center gap-2 w-fit text-[10px] font-medium tracking-[0.16em] uppercase px-4 py-1.5 rounded-full"
                            style={{
                                color: "var(--color-primary)",
                                background: "color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))",
                                border: "1px solid color-mix(in srgb,var(--color-primary) 22%,transparent)",
                            }}>
                            <span className="hero-badge-dot w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: "var(--color-primary)" }} aria-hidden="true" />
                            Government Recognized Training Centre
                        </div>

                        {/* H1 */}
                        <h1 id="hero-heading"
                            className="anim-2 mt-6 font-serif font-bold leading-[1.12]"
                            style={{ fontSize: "clamp(2.2rem,4vw,3.6rem)", color: "var(--color-text)" }}>
                            Empower Your Future<br />
                            with{" "}
                            <span className="hero-em-line italic" style={{ color: "var(--color-accent)" }}>
                                Digital Skills
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="anim-3 mt-5 text-[0.95rem] font-light leading-[1.8] max-w-[480px]"
                            style={{ color: "var(--color-text-muted)" }}>
                            Shivshakti Computer Academy provides practical computer education,
                            government-recognized certifications, and career-focused digital
                            skill programs — designed for real-world success in Ambikapur & Surguja.
                        </p>

                        {/* Trust chips */}
                        <div className="anim-4 flex flex-wrap gap-2 mt-6">
                            {[
                                { icon: "🏅", label: "ISO Certified"      },
                                { icon: "🏢", label: "MSME Registered"    },
                                { icon: "🔗", label: "DigiLocker Enabled" },
                                { icon: "📜", label: "NSDC Partner"       },
                            ].map((chip) => (
                                <span key={chip.label}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-normal px-3 py-1 rounded-full"
                                    style={{
                                        color: "var(--color-primary)",
                                        background: "color-mix(in srgb,var(--color-primary) 7%,var(--color-bg))",
                                        border: "1px solid color-mix(in srgb,var(--color-primary) 18%,transparent)",
                                    }}>
                                    <span className="text-sm" aria-hidden="true">{chip.icon}</span>
                                    {chip.label}
                                </span>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="anim-5 flex flex-wrap gap-3 mt-9 max-sm:flex-col">
                            {/* Primary — solid */}
                            <Link href="/courses"
                                className="hero-cta-primary inline-flex items-center justify-center gap-2 text-[0.9rem] font-medium px-7 py-3.5 rounded-full no-underline transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    color: "#fff",
                                    background: "var(--color-primary)",
                                    boxShadow: "0 4px 20px color-mix(in srgb,var(--color-primary) 35%,transparent)",
                                }}>
                                Explore Courses
                                <span className="hero-arrow" aria-hidden="true">→</span>
                            </Link>

                            {/* Secondary — accent outline */}
                            <Link href="/verify-certificate"
                                className="inline-flex items-center justify-center gap-2 text-[0.9rem] font-medium px-7 py-3.5 rounded-full no-underline transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    color: "var(--color-accent)",
                                    background: "transparent",
                                    border: "1.5px solid var(--color-accent)",
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-accent) 8%,transparent)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                                🎓 Verify Certificate
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="anim-6 flex flex-wrap gap-6 mt-10 pt-8"
                            style={{ borderTop: "1px solid var(--color-border)" }}>
                            {[
                                { num: "1000+", label: "Students Trained" },
                                { num: "25+",   label: "Courses Offered"  },
                                { num: "5★",    label: "Student Rating"   },
                            ].map((stat, i) => (
                                <div key={stat.label} className="flex items-center gap-6">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="font-serif text-[1.7rem] font-bold leading-none"
                                            style={{ color: "var(--color-primary)" }}>
                                            {stat.num}
                                        </div>
                                        <div className="text-[0.68rem] font-normal tracking-[0.08em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            {stat.label}
                                        </div>
                                    </div>
                                    {i < 2 && (
                                        <div className="w-px h-9 self-center max-sm:hidden"
                                            style={{ background: "var(--color-border)" }} aria-hidden="true" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ════ RIGHT ════ */}
                    <div className="anim-r relative">
                        {/* Dot grid */}
                        <div aria-hidden="true" className="absolute -top-6 -right-6 w-24 h-24 z-0 opacity-30"
                            style={{
                                backgroundImage: "radial-gradient(circle,var(--color-primary) 1.2px,transparent 1.2px)",
                                backgroundSize: "12px 12px",
                            }} />

                        {/* Image frame */}
                        <div className="hero-img-frame rounded-[28px] overflow-hidden aspect-[4/3]"
                            style={{
                                background: "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg))",
                                boxShadow: "0 32px 80px color-mix(in srgb,var(--color-primary) 15%,transparent)",
                            }}>
                            <Image
                                src="/hero.jpg"
                                alt="Students learning digital skills at Shivshakti Computer Academy, Ambikapur"
                                fill
                                sizes="(max-width:900px) 100vw,560px"
                                priority
                                className="object-cover"
                            />

                            {/* Floating badge */}
                            <div className="absolute bottom-6 left-6 z-10 backdrop-blur-lg rounded-2xl px-4 py-3.5 min-w-[160px]"
                                style={{
                                    background: "color-mix(in srgb,var(--color-bg-sidebar) 90%,transparent)",
                                    border: "1px solid color-mix(in srgb,var(--color-primary) 30%,transparent)",
                                }}
                                aria-hidden="true">
                                <div className="font-serif text-[1.5rem] font-bold leading-none"
                                    style={{ color: "var(--color-info)" }}>
                                    1000+
                                </div>
                                <div className="text-[0.7rem] tracking-[0.06em] uppercase mt-1"
                                    style={{ color: "rgba(255,255,255,0.55)" }}>
                                    Certified Graduates
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}