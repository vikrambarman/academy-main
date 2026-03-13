"use client"

export default function VisitUs() {
    const infoItems = [
        {
            icon: "📍",
            label: "Address",
            content: (
                <>
                    1st Floor above Usha Matching Center,<br />
                    Near Babra Petrol Pump, Banaras Road,<br />
                    Phunderdihari, Ambikapur – 497001<br />
                    Chhattisgarh, India
                </>
            ),
        },
        {
            icon: "📞",
            label: "Contact",
            content: (
                <>
                    <a href="tel:+917477036832" className="vu-link">+91 74770 36832</a>
                    <span className="vu-sep">·</span>
                    <a href="tel:+919009087883" className="vu-link">+91 90090 87883</a>
                </>
            ),
        },
        {
            icon: "🕐",
            label: "Working Hours",
            content: (
                <>
                    Monday – Saturday<br />
                    <span className="vu-hours-highlight">8:00 AM – 6:00 PM</span>
                </>
            ),
        },
        {
            icon: "🏛",
            label: "Authorization",
            content: (
                <>
                    Authorized Training Centre under<br />
                    Gramin Skill Development Mission (GSDM)
                </>
            ),
        },
    ];

    return (
        <>
            <style>{`
                /* Top fade line */
                .vu-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }

                /* Info row — left accent bar */
                .vu-info-row {
                    position: relative;
                    transition: background 0.2s;
                }
                .vu-info-row::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 2px;
                    background: var(--color-primary);
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 0.24s ease;
                }
                .vu-info-row:hover::before { transform: scaleY(1); }

                /* Dot pattern on dark panel header */
                .vu-info-header::after {
                    content: '';
                    position: absolute;
                    right: -10px; bottom: -10px;
                    width: 100px; height: 100px;
                    background-image: radial-gradient(circle, rgba(96,165,250,0.15) 1.5px, transparent 1.5px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                /* Maps btn arrow */
                .vu-maps-arrow { transition: transform 0.2s; }
                .vu-maps-btn:hover .vu-maps-arrow { transform: translateX(4px); }

                /* Inline helpers */
                .vu-link {
                    color: var(--color-primary);
                    text-decoration: none;
                    font-weight: 400;
                    transition: color 0.2s;
                }
                .vu-link:hover {
                    color: var(--color-accent);
                    text-decoration: underline;
                }
                .vu-sep {
                    color: var(--color-border);
                    margin: 0 6px;
                }
                .vu-hours-highlight {
                    color: var(--color-primary);
                    font-weight: 500;
                }

                @media (max-width: 900px) {
                    .vu-layout { grid-template-columns: 1fr !important; }
                    .vu-header { grid-template-columns: 1fr !important; gap: 16px !important; margin-bottom: 36px !important; }
                    .vu-map-wrap { min-height: 320px !important; }
                    .vu-map-wrap iframe { min-height: 320px !important; }
                }
                @media (max-width: 480px) {
                    .vu-root { padding: 64px 16px !important; }
                    .vu-info-row-inner { padding: 18px 20px !important; }
                    .vu-info-header { padding: 22px 20px !important; }
                    .vu-maps-btn { margin: 0 20px 20px !important; }
                }
            `}</style>

            <section
                className="vu-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background: "var(--color-bg)" }}
                aria-labelledby="visit-us-heading"
            >
                <div className="max-w-[1100px] mx-auto">

                    {/* ── Header ── */}
                    <div className="vu-header grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-end mb-12 md:mb-14">
                        <div>
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                                style={{ color: "var(--color-primary)" }}>
                                <span style={{ display: "inline-block", width: 24, height: 1.5, background: "var(--color-primary)", flexShrink: 0 }} />
                                Find Us
                            </div>
                            <h2
                                id="visit-us-heading"
                                className="font-serif font-bold leading-[1.2]"
                                style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--color-text)" }}
                            >
                                Visit Us in<br />
                                <em className="not-italic" style={{ color: "var(--color-accent)" }}>Ambikapur</em>
                            </h2>
                        </div>
                        <p className="text-[0.88rem] font-light leading-[1.8] md:pb-1"
                            style={{ color: "var(--color-text-muted)" }}>
                            Visit our training centre for course enquiries, admission
                            guidance and free career counselling — walk in anytime
                            during working hours.
                        </p>
                    </div>

                    {/* ── Layout ── */}
                    <div className="vu-layout grid gap-7" style={{ gridTemplateColumns: "1fr 1.4fr", alignItems: "stretch" }}>

                        {/* Info panel */}
                        <div className="flex flex-col rounded-[20px] overflow-hidden"
                            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>

                            {/* Dark header */}
                            <div className="vu-info-header relative overflow-hidden px-7 pt-7 pb-6"
                                style={{ background: "var(--color-bg-sidebar)", borderBottom: "1px solid var(--color-border)" }}>
                                <div className="font-serif text-[1.1rem] font-semibold leading-[1.3]"
                                    style={{ color: "var(--color-text-inverse)" }}>
                                    Shivshakti Computer Academy
                                </div>
                                <div className="text-[0.73rem] font-light mt-1 tracking-[0.04em]"
                                    style={{ color: "rgba(255,255,255,0.45)" }}>
                                    Ambikapur, Surguja, Chhattisgarh
                                </div>
                            </div>

                            {/* Info rows */}
                            {infoItems.map((item, i) => (
                                <div key={i}
                                    className="vu-info-row"
                                    style={{ borderBottom: i < infoItems.length - 1 ? "1px solid var(--color-border)" : "none" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 5%, var(--color-bg-card))")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <div className="vu-info-row-inner flex items-start gap-3.5 px-7 py-5">
                                        {/* Icon box */}
                                        <div className="w-[34px] h-[34px] rounded-[9px] shrink-0 flex items-center justify-center text-[0.9rem]"
                                            style={{ background: "color-mix(in srgb, var(--color-primary) 8%, var(--color-bg))", border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)" }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-medium tracking-[0.14em] uppercase mb-1.5"
                                                style={{ color: "var(--color-text-muted)" }}>
                                                {item.label}
                                            </div>
                                            <div className="text-[0.82rem] font-light leading-[1.65]"
                                                style={{ color: "var(--color-text)" }}>
                                                {item.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Maps CTA */}
                            <a href="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur"
                                target="_blank" rel="noopener noreferrer"
                                className="vu-maps-btn flex items-center justify-between gap-3 mx-7 mb-6 mt-1 px-5 py-3.5 rounded-[14px] no-underline text-[0.85rem] font-medium transition-all duration-200 hover:-translate-y-px"
                                style={{ background: "var(--color-primary)", color: "#fff" }}>
                                <span>Open in Google Maps</span>
                                <span className="vu-maps-arrow text-[0.8rem]" aria-hidden="true">→</span>
                            </a>
                        </div>

                        {/* Map */}
                        <div className="vu-map-wrap relative rounded-[20px] overflow-hidden"
                            style={{ minHeight: 440, border: "1px solid var(--color-border)", background: "color-mix(in srgb, var(--color-primary) 5%, var(--color-bg))" }}>
                            {/* Badge */}
                            <div className="absolute top-4 left-4 z-10 text-[0.75rem] font-medium px-3.5 py-1.5 rounded-full pointer-events-none backdrop-blur-md"
                                style={{ background: "color-mix(in srgb, var(--color-bg-sidebar) 88%, transparent)", color: "var(--color-text-inverse)", border: "1px solid rgba(255,255,255,0.12)" }}
                                aria-hidden="true">
                                📍 Ambikapur, Chhattisgarh
                            </div>
                            <iframe
                                src="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur&output=embed"
                                loading="lazy"
                                title="Shivshakti Computer Academy Ambikapur Location Map"
                                allowFullScreen
                                style={{ width: "100%", height: "100%", minHeight: 440, border: "none", display: "block" }}
                            />
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}