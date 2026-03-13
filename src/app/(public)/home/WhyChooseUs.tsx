"use client"

import { MonitorCheck, Award, Briefcase, Users, ShieldCheck, Rocket } from "lucide-react";

const points = [
    { icon: MonitorCheck, title:"Practical Computer Training",  desc:"Hands-on learning with dedicated systems and real-time practical sessions."                     },
    { icon: Award,        title:"Recognized Certifications",    desc:"Certificates aligned with Skill India initiatives and DigiLocker verification."                 },
    { icon: Briefcase,    title:"Career-Oriented Programs",     desc:"Industry-focused courses designed for employment and digital careers."                          },
    { icon: Users,        title:"Supportive Learning",          desc:"Guided training environment that helps students learn confidently."                              },
    { icon: ShieldCheck,  title:"Trusted Local Institute",      desc:"Established computer training institute serving Ambikapur and nearby regions."                  },
    { icon: Rocket,       title:"Skill-Based Growth",           desc:"Programs designed for job readiness, freelancing and self-employment."                          },
];

const highlights = [
    { icon: MonitorCheck, title:"Practical-First Learning",     desc:"Every course emphasizes hands-on computer practice from day one."      },
    { icon: Award,        title:"Verified Certifications",      desc:"Certificates supported by recognised national platforms."               },
    { icon: Briefcase,    title:"Career-Oriented Curriculum",   desc:"Programs designed for real-world digital career opportunities."         },
];

export default function WhyChooseUs() {
    return (
        <>
            <style>{`
                .wcu-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }
                .wcu-highlight-item::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 2px;
                    background: var(--color-primary);
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 0.24s ease;
                }
                .wcu-highlight-item:hover::before { transform: scaleY(1); }

                .wcu-feat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--color-primary);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.26s ease;
                }
                .wcu-feat-card:hover::before { transform: scaleX(1); }

                .wcu-feat-dash { transition: width 0.26s ease; }
                .wcu-feat-card:hover .wcu-feat-dash { width: 40px; }
            `}</style>

            <section
                className="wcu-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background:"var(--color-bg)" }}
                aria-labelledby="why-choose-heading"
            >
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[72px] items-start">

                    {/* ════ LEFT ════ */}
                    <div className="md:sticky md:top-8">
                        <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                            style={{ color:"var(--color-primary)" }}>
                            <span style={{ display:"inline-block", width:24, height:1.5, background:"var(--color-primary)", flexShrink:0 }} />
                            Why Choose Us
                        </div>

                        <h2 id="why-choose-heading"
                            className="font-serif font-bold leading-[1.2]"
                            style={{ fontSize:"clamp(1.8rem,2.8vw,2.5rem)", color:"var(--color-text)" }}>
                            Why Students Choose<br />
                            <em className="not-italic" style={{ color:"var(--color-accent)" }}>Shivshakti Academy</em>
                        </h2>

                        <p className="text-[0.88rem] font-light leading-[1.8] mt-4 max-w-[420px]"
                            style={{ color:"var(--color-text-muted)" }}>
                            Our training approach combines practical computer education,
                            recognised certifications and career-focused learning — helping
                            students build strong digital skills for the modern workplace.
                        </p>

                        {/* Highlight list */}
                        <div className="mt-10 flex flex-col rounded-2xl overflow-hidden"
                            style={{ border:"1px solid var(--color-border)", background:"var(--color-bg-card)" }}>
                            {highlights.map((h) => {
                                const Icon = h.icon;
                                return (
                                    <div key={h.title}
                                        className="wcu-highlight-item group relative flex items-start gap-3.5 px-5 py-5 transition-colors duration-200"
                                        style={{ borderBottom:"1px solid var(--color-border)" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card))")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                        <div className="w-[34px] h-[34px] shrink-0 rounded-[9px] flex items-center justify-center transition-colors duration-200"
                                            style={{ background:"color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))", border:"1px solid color-mix(in srgb,var(--color-primary) 22%,transparent)", color:"var(--color-primary)" }}
                                            onMouseEnter={e => { const el = e.currentTarget; el.style.background="var(--color-primary)"; el.style.color="#fff"; el.style.borderColor="var(--color-primary)"; }}
                                            onMouseLeave={e => { const el = e.currentTarget; el.style.background="color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))"; el.style.color="var(--color-primary)"; el.style.borderColor="color-mix(in srgb,var(--color-primary) 22%,transparent)"; }}
                                            aria-hidden="true">
                                            <Icon size={16} strokeWidth={1.8} />
                                        </div>
                                        <div>
                                            <div className="text-[0.88rem] font-medium mb-0.5"
                                                style={{ color:"var(--color-text)" }}>{h.title}</div>
                                            <div className="text-[0.78rem] font-light leading-[1.6]"
                                                style={{ color:"var(--color-text-muted)" }}>{h.desc}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ════ RIGHT — feature grid ════ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-[20px] overflow-hidden"
                        style={{ background:"var(--color-border)", border:"1px solid var(--color-border)" }}>
                        {points.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title}
                                    className="wcu-feat-card group relative flex flex-col px-6 py-7 transition-colors duration-200"
                                    style={{ background:"var(--color-bg-card)" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card))")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "var(--color-bg-card)")}>
                                    <div className="w-9 h-9 shrink-0 rounded-[10px] flex items-center justify-center transition-colors duration-200"
                                        style={{ background:"color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))", border:"1px solid color-mix(in srgb,var(--color-primary) 22%,transparent)", color:"var(--color-primary)" }}
                                        onMouseEnter={e => { const el = e.currentTarget; el.style.background="var(--color-primary)"; el.style.color="#fff"; el.style.borderColor="var(--color-primary)"; }}
                                        onMouseLeave={e => { const el = e.currentTarget; el.style.background="color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))"; el.style.color="var(--color-primary)"; el.style.borderColor="color-mix(in srgb,var(--color-primary) 22%,transparent)"; }}
                                        aria-hidden="true">
                                        <Icon size={17} strokeWidth={1.8} />
                                    </div>
                                    <div className="text-[0.85rem] font-medium mt-4 mb-1.5 leading-[1.3]"
                                        style={{ color:"var(--color-text)" }}>{item.title}</div>
                                    <div className="text-[0.76rem] font-light leading-[1.7] flex-1"
                                        style={{ color:"var(--color-text-muted)" }}>{item.desc}</div>
                                    <div className="wcu-feat-dash h-0.5 rounded-full mt-4"
                                        style={{ width:20, background:"var(--color-primary)" }}
                                        aria-hidden="true" />
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>
        </>
    );
}