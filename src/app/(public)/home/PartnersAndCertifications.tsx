import Image from "next/image";

const affiliations = [
    {
        title: "ISO 9001:2015 Certified",
        description:
            "International quality standards for education management and professional training delivery.",
        image: "/images/affiliations/iso.jpg",
        badge: "Quality",
    },
    {
        title: "Gramin Skill Development Mission",
        description:
            "Authorized training centre aligned with Skill India initiatives and government-recognized diploma programs.",
        image: "/images/affiliations/gsdm.jpg",
        badge: "Govt. Authorized",
    },
    {
        title: "Drishti Computer Education",
        description:
            "Authorized franchise partner providing verified certification for professional courses.",
        image: "/images/affiliations/drishti.jpg",
        badge: "Franchise Partner",
    },
    {
        title: "Skill India & NSDC",
        description:
            "Selected course certificates verifiable through Skill India and NSDC platforms.",
        image: "/images/affiliations/skillindia.jpg",
        badge: "Skill India",
    },
    {
        title: "DigiLocker Enabled",
        description:
            "Diploma certificates accessible digitally via DigiLocker with lifetime verification.",
        image: "/images/affiliations/digilocker.jpg",
        badge: "Digital",
    },
    {
        title: "MSME Registered Institute",
        description:
            "Government-registered MSME institute ensuring authenticity and legal compliance.",
        image: "/images/affiliations/msme.jpg",
        badge: "Registered",
    },
];

export default function PartnersAndCertifications() {
    return (
        <>
            <style>{`
                .pac-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                .pac-root::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .pac-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .pac-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: end;
                    margin-bottom: 56px;
                }

                .pac-eyebrow {
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

                .pac-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #d97706;
                }

                .pac-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .pac-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .pac-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    align-self: end;
                    padding-bottom: 4px;
                }

                /* ── Grid ── */
                .pac-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1px;
                    background: #e8dfd0;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                }

                /* ── Card ── */
                .pac-card {
                    background: #fff;
                    padding: 36px 32px;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    position: relative;
                    transition: background 0.22s ease;
                }

                .pac-card:hover {
                    background: #fffbeb;
                }

                /* Amber top line on hover */
                .pac-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #d97706;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.28s ease;
                }

                .pac-card:hover::before {
                    transform: scaleX(1);
                }

                /* Logo container */
                .pac-logo-wrap {
                    width: 80px;
                    height: 52px;
                    position: relative;
                    margin-bottom: 24px;
                    flex-shrink: 0;
                }

                /* Badge pill */
                .pac-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    font-size: 8px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #92540a;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    padding: 2px 7px;
                    border-radius: 100px;
                    white-space: nowrap;
                }

                .pac-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.98rem;
                    font-weight: 600;
                    color: #1a1208;
                    line-height: 1.35;
                    margin-bottom: 10px;
                }

                .pac-card-desc {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.75;
                    flex: 1;
                }

                /* Bottom amber dash — decorative */
                .pac-card-dash {
                    width: 24px;
                    height: 2px;
                    background: #fcd34d;
                    border-radius: 2px;
                    margin-top: 20px;
                    transition: width 0.28s ease;
                }

                .pac-card:hover .pac-card-dash {
                    width: 48px;
                }

                /* ── Trust strip ── */
                .pac-strip {
                    margin-top: 28px;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 16px;
                    padding: 20px 32px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .pac-strip-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #92826b;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .pac-strip-divider {
                    width: 1px;
                    height: 16px;
                    background: #e2d9c8;
                    flex-shrink: 0;
                }

                .pac-strip-item {
                    font-size: 0.78rem;
                    font-weight: 400;
                    color: #4a3f30;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .pac-strip-dot {
                    width: 5px;
                    height: 5px;
                    background: #fcd34d;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* ── Responsive ── */
                @media (max-width: 900px) {
                    .pac-header {
                        grid-template-columns: 1fr;
                        gap: 16px;
                        margin-bottom: 40px;
                    }

                    .pac-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 560px) {
                    .pac-root {
                        padding: 64px 16px;
                    }

                    .pac-grid {
                        grid-template-columns: 1fr;
                        border-radius: 16px;
                    }

                    .pac-card {
                        padding: 28px 24px;
                    }

                    .pac-strip {
                        padding: 16px 20px;
                        gap: 8px;
                    }

                    .pac-strip-divider {
                        display: none;
                    }
                }
            `}</style>

            <section className="pac-root" aria-labelledby="affiliations-heading">
                <div className="pac-inner">

                    {/* Header */}
                    <div className="pac-header">
                        <div>
                            <div className="pac-eyebrow">Recognitions</div>
                            <h2 id="affiliations-heading" className="pac-title">
                                Our Partners &<br />
                                <em>Certifications</em>
                            </h2>
                        </div>
                        <p className="pac-desc">
                            Government-recognized certifications and authorized training
                            partnerships ensuring transparency and credibility for every
                            student we train.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="pac-grid">
                        {affiliations.map((item, i) => (
                            <div key={i} className="pac-card">

                                {/* Logo */}
                                <div className="pac-logo-wrap">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="80px"
                                        className="object-contain"
                                    />
                                    <span className="pac-badge">{item.badge}</span>
                                </div>

                                <h3 className="pac-card-title">{item.title}</h3>
                                <p className="pac-card-desc">{item.description}</p>
                                <div className="pac-card-dash" aria-hidden="true" />
                            </div>
                        ))}
                    </div>

                    {/* Trust strip */}
                    <div className="pac-strip" aria-label="Quick recognition summary">
                        <span className="pac-strip-label">Verified by</span>
                        <div className="pac-strip-divider" aria-hidden="true" />
                        {[
                            "Skill India",
                            "NSDC",
                            "DigiLocker",
                            "ISO 9001:2015",
                            "MSME Udyam",
                            "GSDM",
                        ].map((item, i, arr) => (
                            <span key={item} style={{ display: "contents" }}>
                                <span className="pac-strip-item">
                                    <span className="pac-strip-dot" aria-hidden="true" />
                                    {item}
                                </span>
                                {i < arr.length - 1 && (
                                    <span
                                        className="pac-strip-divider"
                                        aria-hidden="true"
                                    />
                                )}
                            </span>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}