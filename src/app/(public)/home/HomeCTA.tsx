// ============================================================
// HomeCTA.tsx  (Server Component)
// ============================================================
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
                .cta-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                .cta-root::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .cta-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ── Main card ── */
                .cta-card {
                    background: #1a1208;
                    border-radius: 28px;
                    overflow: hidden;
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    position: relative;
                }

                /* Dot grid decoration */
                .cta-card::before {
                    content: '';
                    position: absolute;
                    top: -20px;
                    right: 340px;
                    width: 200px;
                    height: 200px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.1) 1.5px, transparent 1.5px);
                    background-size: 14px 14px;
                    pointer-events: none;
                    z-index: 0;
                }

                /* Amber glow inside card */
                .cta-card::after {
                    content: '';
                    position: absolute;
                    bottom: -60px;
                    left: -60px;
                    width: 340px;
                    height: 340px;
                    background: radial-gradient(circle, rgba(217,119,6,0.14) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Left content */
                .cta-left {
                    padding: 56px 52px;
                    position: relative;
                    z-index: 1;
                }

                .cta-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 18px;
                }

                .cta-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #fcd34d;
                }

                .cta-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 2.8vw, 2.6rem);
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.15;
                }

                .cta-title em {
                    font-style: italic;
                    color: #fcd34d;
                }

                .cta-body {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.55);
                    line-height: 1.8;
                    margin-top: 16px;
                    max-width: 420px;
                }

                /* Checklist */
                .cta-checks {
                    margin-top: 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .cta-check {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.82rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.7);
                }

                .cta-check-dot {
                    width: 18px;
                    height: 18px;
                    background: rgba(252,211,77,0.15);
                    border: 1px solid rgba(252,211,77,0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 0.55rem;
                    color: #fcd34d;
                }

                /* CTA buttons */
                .cta-btns {
                    display: flex;
                    gap: 12px;
                    margin-top: 36px;
                    flex-wrap: wrap;
                }

                .cta-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #fef3c7;
                    color: #1a1208;
                    font-size: 0.88rem;
                    font-weight: 500;
                    padding: 13px 26px;
                    border-radius: 100px;
                    text-decoration: none;
                    transition: background 0.2s, transform 0.15s;
                    box-shadow: 0 4px 20px rgba(252,211,77,0.2);
                }

                .cta-btn-primary:hover {
                    background: #fff;
                    transform: translateY(-2px);
                }

                .cta-btn-primary-arrow {
                    transition: transform 0.2s;
                }

                .cta-btn-primary:hover .cta-btn-primary-arrow {
                    transform: translateX(4px);
                }

                .cta-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    color: #fef3c7;
                    font-size: 0.88rem;
                    font-weight: 400;
                    padding: 13px 26px;
                    border-radius: 100px;
                    border: 1.5px solid rgba(254,243,199,0.25);
                    text-decoration: none;
                    transition: border-color 0.2s, background 0.2s, transform 0.15s;
                }

                .cta-btn-secondary:hover {
                    border-color: rgba(254,243,199,0.6);
                    background: rgba(255,255,255,0.05);
                    transform: translateY(-2px);
                }

                /* Right contact card */
                .cta-right {
                    background: #fff;
                    padding: 48px 36px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    z-index: 1;
                }

                /* Amber top accent */
                .cta-right::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(to right, #fcd34d, #d97706);
                }

                .cta-right-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: #1a1208;
                    line-height: 1.3;
                }

                .cta-right-desc {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.75;
                    margin-top: 12px;
                }

                /* Divider */
                .cta-right-divider {
                    height: 1px;
                    background: #f0e8d8;
                    margin: 24px 0;
                }

                /* Phone numbers */
                .cta-phones {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .cta-phone {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    padding: 12px 14px;
                    border: 1px solid #e8dfd0;
                    border-radius: 12px;
                    transition: border-color 0.2s, background 0.2s;
                }

                .cta-phone:hover {
                    border-color: #fcd34d;
                    background: #fffbeb;
                }

                .cta-phone-icon {
                    width: 30px;
                    height: 30px;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    flex-shrink: 0;
                }

                .cta-phone-num {
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: #1a1208;
                }

                .cta-right-note {
                    margin-top: auto;
                    padding-top: 20px;
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: #92826b;
                    line-height: 1.6;
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                }

                /* ── Responsive ── */
                @media (max-width: 960px) {
                    .cta-card {
                        grid-template-columns: 1fr;
                    }

                    .cta-left {
                        padding: 44px 36px;
                    }

                    .cta-right {
                        padding: 36px 36px 44px;
                    }
                }

                @media (max-width: 480px) {
                    .cta-root { padding: 64px 16px; }

                    .cta-card {
                        border-radius: 20px;
                    }

                    .cta-left {
                        padding: 36px 24px;
                    }

                    .cta-right {
                        padding: 28px 24px 36px;
                    }

                    .cta-btns {
                        flex-direction: column;
                    }

                    .cta-btn-primary,
                    .cta-btn-secondary {
                        justify-content: center;
                    }
                }
            `}</style>

            <section className="cta-root" aria-labelledby="home-cta-heading">
                <div className="cta-inner">
                    <div className="cta-card">

                        {/* Left */}
                        <div className="cta-left">
                            <div className="cta-eyebrow">Start Today</div>

                            <h2 id="home-cta-heading" className="cta-title">
                                Secure Your Future<br />
                                with <em>Digital Skills</em>
                            </h2>

                            <p className="cta-body">
                                Practical computer training, government-recognized certifications,
                                and career-focused programs — designed for jobs,
                                entrepreneurship and higher studies.
                            </p>

                            <div className="cta-checks">
                                {checkpoints.map((pt, i) => (
                                    <div key={i} className="cta-check">
                                        <div className="cta-check-dot" aria-hidden="true">✓</div>
                                        {pt}
                                    </div>
                                ))}
                            </div>

                            <div className="cta-btns">
                                <Link href="/courses" className="cta-btn-primary">
                                    View Courses
                                    <span className="cta-btn-primary-arrow" aria-hidden="true">→</span>
                                </Link>
                                <Link href="/enquiry" className="cta-btn-secondary">
                                    Admission Enquiry
                                </Link>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="cta-right">
                            <h3 className="cta-right-title">
                                Need Guidance?<br />Talk to Us
                            </h3>
                            <p className="cta-right-desc">
                                Get help with course selection, eligibility criteria,
                                certification details and admission guidance.
                            </p>

                            <div className="cta-right-divider" />

                            <div className="cta-phones">
                                {[
                                    { num: "+91 74770 36832", href: "tel:+917477036832" },
                                    { num: "+91 90090 87883", href: "tel:+919009087883" },
                                ].map((p) => (
                                    <a key={p.href} href={p.href} className="cta-phone">
                                        <span className="cta-phone-icon" aria-hidden="true">📞</span>
                                        <span className="cta-phone-num">{p.num}</span>
                                    </a>
                                ))}
                            </div>

                            <p className="cta-right-note">
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