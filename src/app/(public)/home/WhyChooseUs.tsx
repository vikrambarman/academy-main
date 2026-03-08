import {
    MonitorCheck,
    Award,
    Briefcase,
    Users,
    ShieldCheck,
    Rocket,
} from "lucide-react";

const points = [
    {
        icon: MonitorCheck,
        title: "Practical Computer Training",
        desc: "Hands-on learning with dedicated systems and real-time practical sessions.",
    },
    {
        icon: Award,
        title: "Recognized Certifications",
        desc: "Certificates aligned with Skill India initiatives and DigiLocker verification.",
    },
    {
        icon: Briefcase,
        title: "Career-Oriented Programs",
        desc: "Industry-focused courses designed for employment and digital careers.",
    },
    {
        icon: Users,
        title: "Supportive Learning",
        desc: "Guided training environment that helps students learn confidently.",
    },
    {
        icon: ShieldCheck,
        title: "Trusted Local Institute",
        desc: "Established computer training institute serving Ambikapur and nearby regions.",
    },
    {
        icon: Rocket,
        title: "Skill-Based Growth",
        desc: "Programs designed for job readiness, freelancing and self-employment.",
    },
];

const highlights = [
    {
        icon: MonitorCheck,
        title: "Practical-First Learning",
        desc: "Every course emphasizes hands-on computer practice from day one.",
    },
    {
        icon: Award,
        title: "Verified Certifications",
        desc: "Certificates supported by recognised national platforms.",
    },
    {
        icon: Briefcase,
        title: "Career-Oriented Curriculum",
        desc: "Programs designed for real-world digital career opportunities.",
    },
];

export default function WhyChooseUs() {
    return (
        <>
            <style>{`
                .wcu-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                .wcu-root::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .wcu-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 72px;
                    align-items: start;
                }

                /* ── LEFT ── */
                .wcu-left {
                    position: sticky;
                    top: 32px;
                }

                .wcu-eyebrow {
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

                .wcu-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #d97706;
                }

                .wcu-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 2.8vw, 2.5rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .wcu-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .wcu-body {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    margin-top: 18px;
                    max-width: 420px;
                }

                /* Highlight list */
                .wcu-highlights {
                    margin-top: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    border: 1px solid #e8dfd0;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #fff;
                }

                .wcu-highlight-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    padding: 20px 22px;
                    border-bottom: 1px solid #f0e8d8;
                    transition: background 0.2s;
                    position: relative;
                }

                .wcu-highlight-item:last-child {
                    border-bottom: none;
                }

                .wcu-highlight-item:hover {
                    background: #fffbeb;
                }

                /* Left amber bar on hover */
                .wcu-highlight-item::before {
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

                .wcu-highlight-item:hover::before {
                    transform: scaleY(1);
                }

                .wcu-highlight-icon {
                    width: 34px;
                    height: 34px;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #b45309;
                    flex-shrink: 0;
                    transition: background 0.2s, color 0.2s;
                }

                .wcu-highlight-item:hover .wcu-highlight-icon {
                    background: #1a1208;
                    border-color: #1a1208;
                    color: #fcd34d;
                }

                .wcu-highlight-title {
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: #1a1208;
                    margin-bottom: 3px;
                }

                .wcu-highlight-desc {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.6;
                }

                /* ── RIGHT: feature grid ── */
                .wcu-right {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1px;
                    background: #e8dfd0;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .wcu-feat-card {
                    background: #fff;
                    padding: 28px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    transition: background 0.22s ease;
                    position: relative;
                }

                .wcu-feat-card:hover {
                    background: #fffbeb;
                }

                /* Amber top line */
                .wcu-feat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #d97706;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.26s ease;
                }

                .wcu-feat-card:hover::before {
                    transform: scaleX(1);
                }

                .wcu-feat-icon {
                    width: 36px;
                    height: 36px;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #b45309;
                    flex-shrink: 0;
                    transition: background 0.22s, color 0.22s, border-color 0.22s;
                }

                .wcu-feat-card:hover .wcu-feat-icon {
                    background: #1a1208;
                    border-color: #1a1208;
                    color: #fcd34d;
                }

                .wcu-feat-title {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #1a1208;
                    margin-top: 16px;
                    margin-bottom: 6px;
                    line-height: 1.3;
                }

                .wcu-feat-desc {
                    font-size: 0.76rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.7;
                }

                /* Bottom amber dash */
                .wcu-feat-dash {
                    width: 20px;
                    height: 2px;
                    background: #fcd34d;
                    border-radius: 2px;
                    margin-top: 16px;
                    transition: width 0.26s ease;
                }

                .wcu-feat-card:hover .wcu-feat-dash {
                    width: 40px;
                }

                /* ── Responsive ── */
                @media (max-width: 900px) {
                    .wcu-inner {
                        grid-template-columns: 1fr;
                        gap: 48px;
                    }

                    .wcu-left {
                        position: static;
                    }

                    .wcu-right {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                @media (max-width: 480px) {
                    .wcu-root {
                        padding: 64px 16px;
                    }

                    .wcu-right {
                        grid-template-columns: 1fr;
                        border-radius: 16px;
                    }

                    .wcu-feat-card {
                        padding: 24px 20px;
                    }
                }
            `}</style>

            <section className="wcu-root" aria-labelledby="why-choose-heading">
                <div className="wcu-inner">

                    {/* ── LEFT ── */}
                    <div className="wcu-left">

                        <div className="wcu-eyebrow">Why Choose Us</div>

                        <h2 id="why-choose-heading" className="wcu-title">
                            Why Students Choose<br />
                            <em>Shivshakti Academy</em>
                        </h2>

                        <p className="wcu-body">
                            Our training approach combines practical computer education,
                            recognised certifications and career-focused learning — helping
                            students build strong digital skills for the modern workplace.
                        </p>

                        {/* Highlight list */}
                        <div className="wcu-highlights">
                            {highlights.map((h, i) => {
                                const Icon = h.icon;
                                return (
                                    <div key={i} className="wcu-highlight-item">
                                        <div className="wcu-highlight-icon" aria-hidden="true">
                                            <Icon size={16} strokeWidth={1.8} />
                                        </div>
                                        <div>
                                            <div className="wcu-highlight-title">{h.title}</div>
                                            <div className="wcu-highlight-desc">{h.desc}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>

                    {/* ── RIGHT: feature grid ── */}
                    <div className="wcu-right">
                        {points.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="wcu-feat-card">
                                    <div className="wcu-feat-icon" aria-hidden="true">
                                        <Icon size={17} strokeWidth={1.8} />
                                    </div>
                                    <div className="wcu-feat-title">{item.title}</div>
                                    <div className="wcu-feat-desc">{item.desc}</div>
                                    <div className="wcu-feat-dash" aria-hidden="true" />
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>
        </>
    );
}