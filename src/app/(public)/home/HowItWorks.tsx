export default function HowItWorks() {
    const steps = [
        { number:"01", title:"Choose Your Course",  desc:"Select from diploma, certification or professional IT programs based on your career goals.", icon:"🎯" },
        { number:"02", title:"Practical Training",  desc:"Attend hands-on training sessions with real-time computer practice and expert guidance.",    icon:"💻" },
        { number:"03", title:"Get Certified",        desc:"Receive government-recognized and digitally verifiable certificates after course completion.", icon:"🎓" },
    ];

    const notes = [
        "No prior experience needed",
        "Flexible batch timings",
        "Hindi & English medium",
        "Certificate in 30–180 days",
    ];

    return (
        <>
            <style>{`
                .hiw-watermark {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: Georgia, serif;
                    font-size: clamp(160px, 28vw, 320px);
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1px color-mix(in srgb, var(--color-info) 5%, transparent);
                    pointer-events: none;
                    user-select: none;
                    white-space: nowrap;
                    letter-spacing: -0.02em;
                    z-index: 0;
                }

                /* Connector — desktop horizontal */
                .hiw-steps::before {
                    content: '';
                    position: absolute;
                    top: 22px;
                    left: calc(33.33% - 20px);
                    right: calc(33.33% - 20px);
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        color-mix(in srgb, var(--color-info) 20%, transparent),
                        color-mix(in srgb, var(--color-info) 50%, transparent),
                        color-mix(in srgb, var(--color-info) 20%, transparent)
                    );
                    z-index: 0;
                    pointer-events: none;
                }

                /* Connector — mobile vertical */
                @media (max-width: 768px) {
                    .hiw-steps::before {
                        top: 44px; bottom: 44px;
                        left: 21px; right: auto;
                        width: 1px; height: auto;
                        background: linear-gradient(
                            to bottom,
                            color-mix(in srgb, var(--color-info) 20%, transparent),
                            color-mix(in srgb, var(--color-info) 50%, transparent),
                            color-mix(in srgb, var(--color-info) 20%, transparent)
                        );
                    }
                    .hiw-steps { grid-template-columns: 1fr !important; }
                    .hiw-step  { display: flex !important; gap: 20px; padding: 0 0 40px 0 !important; }
                    .hiw-step:last-child { padding-bottom: 0 !important; }
                    .hiw-step-num-row { flex-direction: column !important; align-items: flex-start !important; gap: 0 !important; margin-bottom: 0 !important; flex-shrink: 0; }
                    .hiw-step-icon-mob { display: none; }
                    .hiw-step-accent   { display: none; }
                    .hiw-step-body     { padding-top: 10px; }
                }
                @media (max-width: 480px) {
                    .hiw-root { padding: 64px 20px !important; }
                }
            `}</style>

            <section
                className="hiw-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background: "var(--color-bg-sidebar)" }}
                aria-labelledby="how-it-works-heading"
            >
                <div className="hiw-watermark" aria-hidden="true">Steps</div>

                {/* Primary glow top-left */}
                <div aria-hidden="true" className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle, color-mix(in srgb,var(--color-primary) 12%,transparent) 0%, transparent 65%)" }} />

                {/* Accent glow bottom-right */}
                <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle, color-mix(in srgb,var(--color-accent) 7%,transparent) 0%, transparent 65%)" }} />

                <div className="relative z-10 max-w-[1100px] mx-auto">

                    {/* Header */}
                    <div className="flex flex-wrap items-end justify-between gap-5 md:gap-8 mb-16 md:mb-20">
                        <div>
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                                style={{ color: "var(--color-info)" }}>
                                <span style={{ display:"inline-block", width:24, height:1.5, background:"var(--color-info)", flexShrink:0 }} />
                                The Process
                            </div>
                            <h2 id="how-it-works-heading"
                                className="font-serif font-bold leading-[1.2]"
                                style={{ fontSize:"clamp(1.8rem,3vw,2.5rem)", color:"var(--color-text-inverse)" }}>
                                How It{" "}
                                <em className="not-italic" style={{ color:"var(--color-accent)" }}>Works</em>
                            </h2>
                        </div>
                        <p className="text-[0.88rem] font-light leading-[1.75] max-w-[340px] md:pb-1"
                            style={{ color:"rgba(255,255,255,0.4)" }}>
                            A simple 3-step journey from enrollment to a government-recognized certificate.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="hiw-steps relative grid grid-cols-3 gap-0">
                        {steps.map((step) => (
                            <div key={step.number} className="hiw-step relative z-10 pr-8 last:pr-0">

                                {/* Number row */}
                                <div className="hiw-step-num-row flex items-center gap-3.5 mb-7">
                                    <div className="relative z-10 w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-serif text-[0.8rem] font-bold tracking-[0.04em]"
                                        style={{
                                            color: "#fff",
                                            background: "var(--color-primary)",
                                            boxShadow: "0 0 0 6px color-mix(in srgb,var(--color-primary) 15%,transparent)",
                                        }}
                                        aria-hidden="true">
                                        {step.number}
                                    </div>
                                    <span className="hiw-step-icon-mob text-[1.1rem] opacity-85" aria-hidden="true">
                                        {step.icon}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="hiw-step-body pl-1">
                                    <h3 className="font-serif text-[1.15rem] font-semibold leading-[1.3] mb-3"
                                        style={{ color:"var(--color-text-inverse)" }}>
                                        {step.title}
                                    </h3>
                                    <p className="text-[0.83rem] font-light leading-[1.8]"
                                        style={{ color:"rgba(255,255,255,0.4)" }}>
                                        {step.desc}
                                    </p>
                                    <div className="hiw-step-accent w-0.5 h-10 rounded-full mt-4 ml-[21px]"
                                        style={{ background:"linear-gradient(to bottom, var(--color-primary), transparent)" }}
                                        aria-hidden="true" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom note strip */}
                    <div className="flex items-center justify-center flex-wrap gap-3 mt-16 pt-10"
                        style={{ borderTop:"1px solid color-mix(in srgb,var(--color-primary) 20%,transparent)" }}
                        aria-hidden="true">
                        {notes.map((note, i) => (
                            <span key={note} className="contents">
                                <span className="text-[0.82rem] font-light tracking-[0.04em]"
                                    style={{ color:"rgba(255,255,255,0.35)" }}>
                                    {note}
                                </span>
                                {i < notes.length - 1 && (
                                    <span className="w-1 h-1 rounded-full shrink-0"
                                        style={{ background:"color-mix(in srgb,var(--color-primary) 40%,transparent)" }} />
                                )}
                            </span>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}