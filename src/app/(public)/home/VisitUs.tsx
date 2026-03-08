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
                    <span style={{ color: "#d5c9b5", margin: "0 6px" }}>·</span>
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
                    <span style={{ color: "#b45309", fontWeight: 500 }}>
                        8:00 AM – 6:00 PM
                    </span>
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
                .vu-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                .vu-root::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .vu-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .vu-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: end;
                    margin-bottom: 52px;
                }

                .vu-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .vu-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #d97706;
                }

                .vu-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .vu-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .vu-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    align-self: end;
                    padding-bottom: 4px;
                }

                /* ── Main grid ── */
                .vu-layout {
                    display: grid;
                    grid-template-columns: 1fr 1.4fr;
                    gap: 28px;
                    align-items: stretch;
                }

                /* ── Info panel ── */
                .vu-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                }

                /* Academy name header */
                .vu-info-header {
                    padding: 28px 28px 24px;
                    border-bottom: 1px solid #f0e8d8;
                    background: #1a1208;
                    position: relative;
                    overflow: hidden;
                }

                /* Dot pattern on dark header */
                .vu-info-header::after {
                    content: '';
                    position: absolute;
                    right: -10px;
                    bottom: -10px;
                    width: 100px;
                    height: 100px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.15) 1.5px, transparent 1.5px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                .vu-academy-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #fef3c7;
                    line-height: 1.3;
                }

                .vu-academy-sub {
                    font-size: 0.73rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.5);
                    margin-top: 4px;
                    letter-spacing: 0.04em;
                }

                /* Info rows */
                .vu-info-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    padding: 20px 28px;
                    border-bottom: 1px solid #f8f3ea;
                    transition: background 0.2s;
                    position: relative;
                }

                .vu-info-row:last-of-type {
                    border-bottom: none;
                }

                .vu-info-row:hover {
                    background: #fffbeb;
                }

                /* Left amber bar on hover */
                .vu-info-row::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: #d97706;
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 0.24s ease;
                }

                .vu-info-row:hover::before {
                    transform: scaleY(1);
                }

                .vu-info-icon {
                    width: 34px;
                    height: 34px;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                    transition: background 0.2s;
                }

                .vu-info-row:hover .vu-info-icon {
                    background: #fff7d6;
                }

                .vu-info-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #92826b;
                    margin-bottom: 5px;
                }

                .vu-info-value {
                    font-size: 0.82rem;
                    font-weight: 300;
                    color: #1a1208;
                    line-height: 1.65;
                }

                .vu-link {
                    color: #b45309;
                    text-decoration: none;
                    font-weight: 400;
                    transition: color 0.2s;
                }

                .vu-link:hover {
                    color: #92540a;
                    text-decoration: underline;
                }

                /* Maps CTA at bottom of info panel */
                .vu-maps-btn {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin: 0 28px 24px;
                    padding: 14px 20px;
                    background: #1a1208;
                    color: #fef3c7;
                    border-radius: 14px;
                    text-decoration: none;
                    font-size: 0.85rem;
                    font-weight: 500;
                    transition: background 0.2s, transform 0.15s;
                }

                .vu-maps-btn:hover {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                .vu-maps-btn-arrow {
                    font-size: 0.8rem;
                    color: #fcd34d;
                    transition: transform 0.2s;
                }

                .vu-maps-btn:hover .vu-maps-btn-arrow {
                    transform: translateX(4px);
                }

                /* ── Map ── */
                .vu-map-wrap {
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid #e8dfd0;
                    position: relative;
                    min-height: 440px;
                    background: #f0ead8;
                }

                .vu-map-wrap iframe {
                    width: 100%;
                    height: 100%;
                    min-height: 440px;
                    border: none;
                    display: block;
                }

                /* Map label badge */
                .vu-map-badge {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    background: rgba(26,18,8,0.85);
                    backdrop-filter: blur(6px);
                    color: #fef3c7;
                    font-size: 0.75rem;
                    font-weight: 500;
                    padding: 6px 14px;
                    border-radius: 100px;
                    border: 1px solid rgba(252,211,77,0.2);
                    pointer-events: none;
                    z-index: 1;
                }

                /* ── Responsive ── */
                @media (max-width: 900px) {
                    .vu-header {
                        grid-template-columns: 1fr;
                        gap: 16px;
                        margin-bottom: 36px;
                    }

                    .vu-layout {
                        grid-template-columns: 1fr;
                    }

                    .vu-map-wrap {
                        min-height: 320px;
                    }

                    .vu-map-wrap iframe {
                        min-height: 320px;
                    }
                }

                @media (max-width: 480px) {
                    .vu-root {
                        padding: 64px 16px;
                    }

                    .vu-info-row {
                        padding: 18px 20px;
                    }

                    .vu-info-header {
                        padding: 22px 20px;
                    }

                    .vu-maps-btn {
                        margin: 0 20px 20px;
                    }
                }
            `}</style>

            <section className="vu-root" aria-labelledby="visit-us-heading">
                <div className="vu-inner">

                    {/* Header */}
                    <div className="vu-header">
                        <div>
                            <div className="vu-eyebrow">Find Us</div>
                            <h2 id="visit-us-heading" className="vu-title">
                                Visit Us in<br />
                                <em>Ambikapur</em>
                            </h2>
                        </div>
                        <p className="vu-desc">
                            Visit our training centre for course enquiries, admission
                            guidance and free career counselling — walk in anytime
                            during working hours.
                        </p>
                    </div>

                    {/* Layout */}
                    <div className="vu-layout">

                        {/* Info panel */}
                        <div className="vu-info">

                            {/* Dark header */}
                            <div className="vu-info-header">
                                <div className="vu-academy-name">
                                    Shivshakti Computer Academy
                                </div>
                                <div className="vu-academy-sub">
                                    Ambikapur, Surguja, Chhattisgarh
                                </div>
                            </div>

                            {/* Info rows */}
                            {infoItems.map((item, i) => (
                                <div key={i} className="vu-info-row">
                                    <div className="vu-info-icon" aria-hidden="true">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="vu-info-label">{item.label}</div>
                                        <div className="vu-info-value">{item.content}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Maps CTA */}
                            <a
                                href="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="vu-maps-btn"
                            >
                                <span>Open in Google Maps</span>
                                <span className="vu-maps-btn-arrow" aria-hidden="true">→</span>
                            </a>

                        </div>

                        {/* Map */}
                        <div className="vu-map-wrap">
                            <div className="vu-map-badge" aria-hidden="true">
                                📍 Ambikapur, Chhattisgarh
                            </div>
                            <iframe
                                src="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur&output=embed"
                                loading="lazy"
                                title="Shivshakti Computer Academy Ambikapur Location Map"
                                allowFullScreen
                            />
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}