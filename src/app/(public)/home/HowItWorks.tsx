export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Choose Your Course",
            desc: "Select from diploma, certification or professional IT programs based on your career goals.",
            icon: "🎯",
        },
        {
            number: "02",
            title: "Practical Training",
            desc: "Attend hands-on training sessions with real-time computer practice and expert guidance.",
            icon: "💻",
        },
        {
            number: "03",
            title: "Get Certified",
            desc: "Receive government-recognized and digitally verifiable certificates after course completion.",
            icon: "🎓",
        },
    ];

    return (
        <>
            <style>{`
                .hiw-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #1a1208;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                /* Large ghost number watermark */
                .hiw-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(160px, 28vw, 320px);
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(252,211,77,0.05);
                    pointer-events: none;
                    user-select: none;
                    white-space: nowrap;
                    letter-spacing: -0.02em;
                    z-index: 0;
                }

                /* Amber glow left */
                .hiw-glow {
                    position: absolute;
                    top: -80px;
                    left: -80px;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                .hiw-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* ── Header ── */
                .hiw-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 32px;
                    margin-bottom: 72px;
                    flex-wrap: wrap;
                }

                .hiw-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .hiw-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #fcd34d;
                }

                .hiw-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                }

                .hiw-title em {
                    font-style: italic;
                    color: #fcd34d;
                }

                .hiw-subtitle {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.55);
                    line-height: 1.75;
                    max-width: 340px;
                    align-self: flex-end;
                    padding-bottom: 4px;
                }

                /* ── Steps ── */
                .hiw-steps {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    position: relative;
                }

                /* Connector line between steps */
                .hiw-steps::before {
                    content: '';
                    position: absolute;
                    top: 28px;
                    left: calc(33.33% - 20px);
                    right: calc(33.33% - 20px);
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        rgba(252,211,77,0.3),
                        rgba(252,211,77,0.6),
                        rgba(252,211,77,0.3)
                    );
                    z-index: 0;
                    pointer-events: none;
                }

                .hiw-step {
                    padding: 0 32px 0 0;
                    position: relative;
                    z-index: 1;
                }

                .hiw-step:last-child {
                    padding-right: 0;
                }

                /* Step number pill */
                .hiw-step-num-row {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 28px;
                }

                .hiw-step-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #1a1208;
                    background: #fcd34d;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    letter-spacing: 0.04em;
                    box-shadow: 0 0 0 6px rgba(252,211,77,0.12);
                    position: relative;
                    z-index: 1;
                }

                .hiw-step-icon {
                    font-size: 1.1rem;
                    opacity: 0.85;
                }

                /* Step content */
                .hiw-step-body {
                    padding-left: 4px;
                }

                .hiw-step-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: #fef3c7;
                    line-height: 1.3;
                    margin-bottom: 12px;
                }

                .hiw-step-desc {
                    font-size: 0.83rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.55);
                    line-height: 1.8;
                }

                /* Vertical amber accent bar */
                .hiw-step-accent {
                    width: 2px;
                    height: 40px;
                    background: linear-gradient(to bottom, #fcd34d, transparent);
                    border-radius: 2px;
                    margin: 16px 0 0 21px;
                }

                /* ── Bottom note ── */
                .hiw-note {
                    margin-top: 64px;
                    padding-top: 40px;
                    border-top: 1px solid rgba(252,211,77,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .hiw-note-text {
                    font-size: 0.82rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    letter-spacing: 0.04em;
                }

                .hiw-note-dot {
                    width: 3px;
                    height: 3px;
                    background: rgba(252,211,77,0.35);
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .hiw-steps {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }

                    /* Vertical connector */
                    .hiw-steps::before {
                        top: 44px;
                        bottom: 44px;
                        left: 21px;
                        right: auto;
                        width: 1px;
                        height: auto;
                        background: linear-gradient(
                            to bottom,
                            rgba(252,211,77,0.3),
                            rgba(252,211,77,0.6),
                            rgba(252,211,77,0.3)
                        );
                    }

                    .hiw-step {
                        padding: 0 0 40px 0;
                        display: flex;
                        gap: 20px;
                    }

                    .hiw-step:last-child {
                        padding-bottom: 0;
                    }

                    .hiw-step-num-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0;
                        margin-bottom: 0;
                        flex-shrink: 0;
                    }

                    .hiw-step-icon {
                        display: none;
                    }

                    .hiw-step-accent {
                        display: none;
                    }

                    .hiw-step-body {
                        padding-top: 10px;
                    }

                    .hiw-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                        margin-bottom: 56px;
                    }

                    .hiw-subtitle {
                        max-width: 100%;
                    }
                }

                @media (max-width: 480px) {
                    .hiw-root {
                        padding: 64px 20px;
                    }
                }
            `}</style>

            <section className="hiw-root" aria-labelledby="how-it-works-heading">

                <div className="hiw-watermark" aria-hidden="true">Steps</div>
                <div className="hiw-glow" aria-hidden="true" />

                <div className="hiw-inner">

                    {/* Header */}
                    <div className="hiw-header">
                        <div>
                            <div className="hiw-eyebrow">The Process</div>
                            <h2 id="how-it-works-heading" className="hiw-title">
                                How It <em>Works</em>
                            </h2>
                        </div>
                        <p className="hiw-subtitle">
                            A simple 3-step journey from enrollment to
                            a government-recognized certificate.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="hiw-steps">
                        {steps.map((step) => (
                            <div key={step.number} className="hiw-step">

                                <div className="hiw-step-num-row">
                                    <div className="hiw-step-num" aria-hidden="true">
                                        {step.number}
                                    </div>
                                    <span className="hiw-step-icon" aria-hidden="true">
                                        {step.icon}
                                    </span>
                                </div>

                                <div className="hiw-step-body">
                                    <h3 className="hiw-step-title">{step.title}</h3>
                                    <p className="hiw-step-desc">{step.desc}</p>
                                    <div className="hiw-step-accent" aria-hidden="true" />
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Bottom note */}
                    <div className="hiw-note" aria-hidden="true">
                        {[
                            "No prior experience needed",
                            "Flexible batch timings",
                            "Hindi & English medium",
                            "Certificate in 30–180 days",
                        ].map((note, i, arr) => (
                            <span key={note} style={{ display: "contents" }}>
                                <span className="hiw-note-text">{note}</span>
                                {i < arr.length - 1 && (
                                    <span className="hiw-note-dot" />
                                )}
                            </span>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}