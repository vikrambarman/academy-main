"use client"

import { GraduationCap, Award, CheckCircle, Building2 } from "lucide-react";

const stats = [
    { icon: Building2,     value: "10+",   label: "Years of Experience",  desc: "Extensive experience in computer education and digital skill training." },
    { icon: GraduationCap, value: "1000+", label: "Students Trained",     desc: "Trained through structured, practical programs."                        },
    { icon: Award,         value: "100%",  label: "Verified Certificates", desc: "Every certificate issued with online verification support."             },
    { icon: CheckCircle,   value: "Govt.", label: "Recognized Institute",  desc: "ISO Certified · MSME Registered · Skill India aligned."                },
];

const pills = ["GSDM Authorized","Skill India Aligned","DigiLocker Compatible","ISO 9001:2015","MSME Registered"];

export default function TrustSection() {
    return (
        <>
            <style>{`
                .trust-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }
                .trust-stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--color-primary);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.28s ease;
                }
                .trust-stat-card:hover::before { transform: scaleX(1); }
                .trust-banner::before {
                    content: '';
                    position: absolute;
                    right: -20px; top: 50%;
                    transform: translateY(-50%);
                    width: 160px; height: 160px;
                    background-image: radial-gradient(circle, color-mix(in srgb,var(--color-info) 20%,transparent) 1.5px, transparent 1.5px);
                    background-size: 14px 14px;
                    pointer-events: none;
                }
            `}</style>

            <section
                className="trust-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background: "var(--color-bg)" }}
                aria-labelledby="trust-heading"
            >
                <div className="max-w-[1100px] mx-auto">

                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-end mb-14 md:mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                                style={{ color: "var(--color-primary)" }}>
                                <span style={{ display:"inline-block", width:24, height:1.5, background:"var(--color-primary)", flexShrink:0 }} />
                                Why Trust Us
                            </div>
                            <h2 id="trust-heading"
                                className="font-serif font-bold leading-[1.2]"
                                style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)", color:"var(--color-text)" }}>
                                A Trusted Institute for<br />
                                <em className="not-italic" style={{ color:"var(--color-accent)" }}>Computer Education</em>
                            </h2>
                        </div>
                        <p className="text-[0.93rem] font-light leading-[1.8] md:pb-1"
                            style={{ color:"var(--color-text-muted)" }}>
                            Shivshakti Computer Academy is a recognized training institute committed to
                            practical education, transparent systems, and verified certifications —
                            helping students build real digital skills for the modern world.
                        </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
                        style={{ background:"var(--color-border)", border:"1px solid var(--color-border)" }}
                        role="list">
                        {stats.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} role="listitem"
                                    className="trust-stat-card group relative flex flex-col p-8 md:p-9 transition-colors duration-200 cursor-default"
                                    style={{ background:"var(--color-bg-card)" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card))")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "var(--color-bg-card)")}>
                                    <div className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center transition-colors duration-200"
                                        style={{ background:"color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))", border:"1px solid color-mix(in srgb,var(--color-primary) 22%,transparent)", color:"var(--color-primary)" }}>
                                        <Icon size={17} strokeWidth={1.8} />
                                    </div>
                                    <div className="font-serif text-[2.4rem] font-bold leading-none mt-5"
                                        style={{ color:"var(--color-text)" }}>{item.value}</div>
                                    <div className="text-[0.8rem] font-medium mt-1.5"
                                        style={{ color:"var(--color-text)" }}>{item.label}</div>
                                    <div className="text-[0.76rem] font-light leading-[1.6] mt-2.5"
                                        style={{ color:"var(--color-text-muted)" }}>{item.desc}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Banner */}
                    <div className="trust-banner relative overflow-hidden mt-6 rounded-[18px] px-7 md:px-9 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                        style={{ background:"var(--color-bg-sidebar)", border:"1px solid color-mix(in srgb,var(--color-primary) 25%,transparent)" }}
                        aria-label="Recognitions and certifications">
                        <div className="flex items-center gap-3.5 shrink-0">
                            <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-[1.1rem]"
                                style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)" }}
                                aria-hidden="true">🏛</div>
                            <div>
                                <div className="font-serif text-[1rem] font-semibold leading-snug"
                                    style={{ color:"var(--color-text-inverse)" }}>
                                    Authorized Government Recognized Centre
                                </div>
                                <div className="text-[0.72rem] font-light mt-0.5 tracking-[0.03em]"
                                    style={{ color:"rgba(255,255,255,0.4)" }}>
                                    Ambikapur, Surguja, Chhattisgarh
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 md:justify-end">
                            {pills.map((p) => (
                                <span key={p} className="text-[10px] font-normal tracking-[0.06em] px-3 py-1 rounded-full whitespace-nowrap"
                                    style={{ color:"rgba(255,255,255,0.7)", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)" }}>
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}