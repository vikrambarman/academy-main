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

                .hero-badge-dot  { animation: badgePulse 2s infinite; }
                .hero-arrow      { transition: transform 0.2s; }
                .hero-cta-primary:hover .hero-arrow { transform: translateX(4px); }

                .hero-em-line {
                    position: relative;
                    display: inline-block;
                }
                .hero-em-line::after {
                    content: '';
                    position: absolute;
                    bottom: -4px; left: 0; right: 0;
                    height: 3px;
                    background: #EF4523;
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
                    border-top: 3px solid #1B4FBB;
                    border-left: 3px solid #1B4FBB;
                    border-radius: 4px 0 0 0;
                    z-index: 2; pointer-events: none;
                }
                .hero-img-frame::after {
                    content: '';
                    position: absolute;
                    bottom: -12px; right: -12px;
                    width: 72px; height: 72px;
                    border-bottom: 3px solid #EF4523;
                    border-right: 3px solid #EF4523;
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
                className="relative overflow-hidden min-h-svh flex items-center bg-[#F8FAFC] dark:bg-[#0f172a]"
                aria-labelledby="hero-heading"
            >
                {/* ── Subtle grid pattern ── */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(26,86,219,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,219,0.04) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* ── Blue glow top-right ── */}
                <div
                    aria-hidden="true"
                    className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle, rgba(26,86,219,0.10) 0%, transparent 65%)" }}
                />

                {/* ── OrangeRed glow bottom-left ── */}
                <div
                    aria-hidden="true"
                    className="absolute -bottom-20 -left-16 w-[360px] h-[360px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle, rgba(239,69,35,0.07) 0%, transparent 65%)" }}
                />

                {/* ── Decorative bg text ── */}
                <div
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-black italic pointer-events-none select-none text-transparent z-0 whitespace-nowrap"
                    style={{
                        fontSize: "clamp(100px, 18vw, 220px)",
                        WebkitTextStroke: "1px rgba(26,86,219,0.05)",
                    }}
                >
                    Digital
                </div>

                {/* ── Main grid ── */}
                <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-8 pt-24 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

                    {/* ════ LEFT ════ */}
                    <div className="flex flex-col">

                        {/* Badge */}
                        <div className="anim-1 inline-flex items-center gap-2 w-fit text-[10px] font-medium tracking-[0.16em] uppercase text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-4 py-1.5 rounded-full">
                            <span className="hero-badge-dot w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" aria-hidden="true" />
                            Government Recognized Training Centre
                        </div>

                        {/* H1 */}
                        <h1
                            id="hero-heading"
                            className="anim-2 mt-6 font-serif font-bold leading-[1.12] text-[#0f172a] dark:text-slate-50"
                            style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)" }}
                        >
                            Empower Your Future<br />
                            with{" "}
                            <span className="hero-em-line italic text-[#EF4523] dark:text-orange-400">
                                Digital Skills
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="anim-3 mt-5 text-[0.95rem] font-light text-slate-500 dark:text-slate-400 leading-[1.8] max-w-[480px]">
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
                                <span
                                    key={chip.label}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-normal text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full"
                                >
                                    <span className="text-sm" aria-hidden="true">{chip.icon}</span>
                                    {chip.label}
                                </span>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="anim-5 flex flex-wrap gap-3 mt-9 max-sm:flex-col">
                            {/* Primary — Blue */}
                            <Link
                                href="/courses"
                                className="hero-cta-primary inline-flex items-center justify-center gap-2 text-[0.9rem] font-medium text-white bg-[#1B4FBB] hover:bg-[#1A3E9A] dark:bg-blue-600 dark:hover:bg-blue-500 px-7 py-3.5 rounded-full no-underline shadow-[0_4px_20px_rgba(26,79,187,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(26,79,187,0.35)] transition-all duration-200"
                            >
                                Explore Courses
                                <span className="hero-arrow" aria-hidden="true">→</span>
                            </Link>

                            {/* Secondary — OrangeRed outline */}
                            <Link
                                href="/verify-certificate"
                                className="inline-flex items-center justify-center gap-2 text-[0.9rem] font-medium text-[#EF4523] dark:text-orange-400 bg-transparent border-[1.5px] border-[#EF4523] dark:border-orange-500 px-7 py-3.5 rounded-full no-underline hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                🎓 Verify Certificate
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="anim-6 flex flex-wrap gap-6 mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
                            {[
                                { num: "1000+", label: "Students Trained" },
                                { num: "25+",   label: "Courses Offered"  },
                                { num: "5★",    label: "Student Rating"   },
                            ].map((stat, i) => (
                                <div key={stat.label} className="flex items-center gap-6">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="font-serif text-[1.7rem] font-bold leading-none text-[#1B4FBB] dark:text-blue-400">
                                            {stat.num}
                                        </div>
                                        <div className="text-[0.68rem] font-normal tracking-[0.08em] uppercase text-slate-400 dark:text-slate-500">
                                            {stat.label}
                                        </div>
                                    </div>
                                    {i < 2 && (
                                        <div className="w-px h-9 bg-slate-200 dark:bg-slate-700 self-center max-sm:hidden" aria-hidden="true" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ════ RIGHT ════ */}
                    <div className="anim-r relative">
                        {/* Dot grid — Blue */}
                        <div
                            aria-hidden="true"
                            className="absolute -top-6 -right-6 w-24 h-24 z-0 opacity-30"
                            style={{
                                backgroundImage: "radial-gradient(circle, #1A56DB 1.2px, transparent 1.2px)",
                                backgroundSize: "12px 12px",
                            }}
                        />

                        {/* Image frame — Blue top-left, OrangeRed bottom-right corners */}
                        <div className="hero-img-frame rounded-[28px] overflow-hidden aspect-[4/3] bg-blue-50 dark:bg-slate-800 shadow-[0_32px_80px_rgba(26,79,187,0.15)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
                            <Image
                                src="/hero-modern.png"
                                alt="Students learning digital skills at Shivshakti Computer Academy, Ambikapur"
                                fill
                                sizes="(max-width: 900px) 100vw, 560px"
                                priority
                                className="object-cover"
                            />

                            {/* Floating badge */}
                            <div
                                className="absolute bottom-6 left-6 z-10 bg-[rgba(15,23,42,0.90)] dark:bg-[rgba(2,12,27,0.92)] backdrop-blur-lg border border-blue-400/30 text-white rounded-2xl px-4 py-3.5 min-w-[160px]"
                                aria-hidden="true"
                            >
                                <div className="font-serif text-[1.5rem] font-bold text-blue-400 leading-none">
                                    1000+
                                </div>
                                <div className="text-[0.7rem] tracking-[0.06em] uppercase text-white/60 mt-1">
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