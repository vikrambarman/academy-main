"use client"

import Link from "next/link";

const checkpoints = [
    "Skill India & GSDM aligned programs",
    "DigiLocker verified certificates",
    "Web Development & Professional IT training",
    "Affordable education for all backgrounds",
];

export default function HomeCTA() {
    return (
        <>
            <style>{`
                /* Top fade line */
                .cta-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }

                /* Dot grid on card */
                .cta-card::before {
                    content: '';
                    position: absolute;
                    top: -20px; right: 340px;
                    width: 200px; height: 200px;
                    background-image: radial-gradient(circle, rgba(96,165,250,0.12) 1.5px, transparent 1.5px);
                    background-size: 14px 14px;
                    pointer-events: none;
                    z-index: 0;
                }

                /* Blue glow on card */
                .cta-card::after {
                    content: '';
                    position: absolute;
                    bottom: -60px; left: -60px;
                    width: 340px; height: 340px;
                    background: radial-gradient(circle, rgba(26,86,219,0.15) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Right panel — primary top accent bar */
                .cta-right::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(to right, var(--color-primary), var(--color-accent));
                }

                /* Arrows */
                .cta-primary-arrow  { transition: transform 0.2s; }
                .cta-btn-primary:hover  .cta-primary-arrow  { transform: translateX(4px); }

                /* Phone hover */
                .cta-phone {
                    transition: border-color 0.2s, background 0.2s;
                }
                .cta-phone:hover {
                    border-color: var(--color-primary) !important;
                    background: color-mix(in srgb, var(--color-primary) 6%, var(--color-bg-card)) !important;
                }

                @media (max-width: 960px) {
                    .cta-card { grid-template-columns: 1fr !important; }
                    .cta-left { padding: 44px 36px !important; }
                    .cta-right { padding: 36px 36px 44px !important; }
                }
                @media (max-width: 480px) {
                    .cta-root  { padding: 64px 16px !important; }
                    .cta-card  { border-radius: 20px !important; }
                    .cta-left  { padding: 36px 24px !important; }
                    .cta-right { padding: 28px 24px 36px !important; }
                    .cta-btns  { flex-direction: column !important; }
                    .cta-btn-primary, .cta-btn-secondary { justify-content: center !important; }
                }
            `}</style>

            <section
                className="cta-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background: "var(--color-bg)" }}
                aria-labelledby="home-cta-heading"
            >
                <div className="max-w-[1100px] mx-auto">
                    <div className="cta-card relative grid rounded-[28px] overflow-hidden"
                        style={{ gridTemplateColumns: "1fr 380px", background: "var(--color-bg-sidebar)" }}>

                        {/* ── Left ── */}
                        <div className="cta-left relative z-10 p-14 md:px-[52px] md:py-[56px]">

                            {/* Eyebrow */}
                            <div className="flex items-center gap-2 mb-[18px] text-[10px] font-medium tracking-[0.18em] uppercase"
                                style={{ color: "var(--color-info)" }}>
                                <span style={{ display: "inline-block", width: 24, height: 1.5, background: "var(--color-info)", flexShrink: 0 }} />
                                Start Today
                            </div>

                            <h2
                                id="home-cta-heading"
                                className="font-serif font-bold leading-[1.15]"
                                style={{ fontSize: "clamp(1.8rem,2.8vw,2.6rem)", color: "var(--color-text-inverse)" }}
                            >
                                Secure Your Future<br />
                                with{" "}
                                <em className="not-italic" style={{ color: "var(--color-accent)" }}>Digital Skills</em>
                            </h2>

                            <p className="text-[0.88rem] font-light leading-[1.8] mt-4 max-w-[420px]"
                                style={{ color: "rgba(255,255,255,0.5)" }}>
                                Practical computer training, government-recognized certifications,
                                and career-focused programs — designed for jobs,
                                entrepreneurship and higher studies.
                            </p>

                            {/* Checklist */}
                            <div className="flex flex-col gap-2.5 mt-7">
                                {checkpoints.map((pt) => (
                                    <div key={pt} className="flex items-center gap-2.5 text-[0.82rem] font-light"
                                        style={{ color: "rgba(255,255,255,0.65)" }}>
                                        <div className="w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center text-[0.55rem]"
                                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: "var(--color-info)" }}
                                            aria-hidden="true">✓</div>
                                        {pt}
                                    </div>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="cta-btns flex flex-wrap gap-3 mt-9">
                                <Link href="/courses"
                                    className="cta-btn-primary inline-flex items-center gap-2 text-[0.88rem] font-medium px-[26px] py-3 rounded-full no-underline transition-all duration-200 hover:-translate-y-0.5"
                                    style={{ background: "var(--color-accent)", color: "#fff", boxShadow: "0 4px 20px rgba(239,69,35,0.3)" }}>
                                    View Courses
                                    <span className="cta-primary-arrow" aria-hidden="true">→</span>
                                </Link>
                                <Link href="/enquiry"
                                    className="cta-btn-secondary inline-flex items-center gap-2 text-[0.88rem] font-normal px-[26px] py-3 rounded-full no-underline transition-all duration-200 hover:-translate-y-0.5"
                                    style={{ color: "var(--color-text-inverse)", border: "1.5px solid rgba(255,255,255,0.22)" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                                    Admission Enquiry
                                </Link>
                            </div>
                        </div>

                        {/* ── Right ── */}
                        <div className="cta-right relative z-10 flex flex-col px-9 py-12"
                            style={{ background: "var(--color-bg-card)" }}>

                            <h3 className="font-serif text-[1.15rem] font-semibold leading-[1.3]"
                                style={{ color: "var(--color-text)" }}>
                                Need Guidance?<br />Talk to Us
                            </h3>
                            <p className="text-[0.8rem] font-light leading-[1.75] mt-3"
                                style={{ color: "var(--color-text-muted)" }}>
                                Get help with course selection, eligibility criteria,
                                certification details and admission guidance.
                            </p>

                            {/* Divider */}
                            <div className="my-6 h-px" style={{ background: "var(--color-border)" }} />

                            {/* Phone numbers */}
                            <div className="flex flex-col gap-2.5">
                                {[
                                    { num: "+91 74770 36832", href: "tel:+917477036832" },
                                    { num: "+91 90090 87883", href: "tel:+919009087883" },
                                ].map((p) => (
                                    <a key={p.href} href={p.href}
                                        className="cta-phone flex items-center gap-2.5 no-underline px-3.5 py-3 rounded-xl"
                                        style={{ border: "1px solid var(--color-border)", background: "var(--color-bg-card)" }}>
                                        <span className="w-[30px] h-[30px] rounded-lg shrink-0 flex items-center justify-center text-[0.8rem]"
                                            style={{ background: "color-mix(in srgb, var(--color-primary) 8%, var(--color-bg))", border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)" }}
                                            aria-hidden="true">📞</span>
                                        <span className="text-[0.88rem] font-medium"
                                            style={{ color: "var(--color-text)" }}>{p.num}</span>
                                    </a>
                                ))}
                            </div>

                            {/* Note */}
                            <p className="flex items-start gap-1.5 mt-auto pt-5 text-[0.72rem] font-light leading-[1.6]"
                                style={{ color: "var(--color-text-muted)" }}>
                                <span aria-hidden="true">📍</span>
                                Ambikapur, Chhattisgarh · Mon–Sat, 8 AM – 6 PM
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}