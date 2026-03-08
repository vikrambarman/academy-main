import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Accreditation & Registration | Shivshakti Computer Academy",
    description:
        "Official quality certifications and government registration of Shivshakti Computer Academy including ISO 9001:2015 and MSME registration.",
};

const accreditations = [
    {
        title: "ISO 9001:2015 Certified",
        subtitle: "Quality Management System",
        description:
            "International quality management certification ensuring structured academic processes, consistent training delivery, and measurable educational outcomes for every student.",
        image: "/images/accreditations/iso.jpg",
        badge: "International",
        points: [
            "Structured academic processes",
            "Consistent training delivery",
            "Measurable learning outcomes",
            "Annual quality audits",
        ],
    },
    {
        title: "MSME (Udyam) Registered",
        subtitle: "Government of India",
        description:
            "Government of India registered MSME institute ensuring full authenticity and legal compliance as a certified training provider under the Ministry of MSME.",
        image: "/images/accreditations/msme.jpg",
        badge: "Govt. Registered",
        points: [
            "Ministry of MSME recognized",
            "Legally compliant institute",
            "Authentic training provider",
            "Udyam Registration Certificate",
        ],
    },
];

export default function AccreditationPage() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .acc-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                }

                /* ── Hero header ── */
                .acc-hero {
                    padding: 88px 24px 72px;
                    position: relative;
                    overflow: hidden;
                }

                .acc-hero-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                .acc-hero-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .acc-eyebrow {
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

                .acc-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 1.5px;
                    background: #d97706;
                }

                .acc-hero-layout {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 48px;
                    flex-wrap: wrap;
                }

                .acc-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.15;
                }

                .acc-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .acc-hero-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    max-width: 360px;
                    align-self: flex-end;
                    padding-bottom: 4px;
                }

                /* ── Cards section ── */
                .acc-body {
                    padding: 0 24px 88px;
                    position: relative;
                }

                .acc-body::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .acc-body-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding-top: 56px;
                }

                .acc-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                }

                /* ── Card ── */
                .acc-card {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: box-shadow 0.25s ease, border-color 0.25s ease;
                    position: relative;
                }

                .acc-card:hover {
                    border-color: #d97706;
                    box-shadow: 0 16px 56px rgba(100,70,20,0.11);
                }

                /* Top amber line on hover */
                .acc-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(to right, #d97706, #fcd34d);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.3s ease;
                    z-index: 1;
                }

                .acc-card:hover::before { transform: scaleX(1); }

                /* Logo zone */
                .acc-card-logo-zone {
                    background: #faf8f4;
                    border-bottom: 1px solid #f0e8d8;
                    padding: 40px 40px 36px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 20px;
                }

                .acc-card-logo-wrap {
                    position: relative;
                    width: 100px;
                    height: 64px;
                    flex-shrink: 0;
                }

                .acc-card-badge {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92540a;
                    background: #fffbeb;
                    border: 1px solid #fcd34d;
                    padding: 4px 12px;
                    border-radius: 100px;
                    white-space: nowrap;
                    flex-shrink: 0;
                    align-self: flex-start;
                }

                /* Content zone */
                .acc-card-body {
                    padding: 32px 40px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .acc-card-subtitle {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #b45309;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .acc-card-subtitle::before {
                    content: '';
                    display: inline-block;
                    width: 14px; height: 1.5px;
                    background: #d97706;
                }

                .acc-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.3;
                    margin-bottom: 14px;
                }

                .acc-card-desc {
                    font-size: 0.83rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    margin-bottom: 28px;
                }

                /* Points list */
                .acc-card-points {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    border: 1px solid #f0e8d8;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-top: auto;
                }

                .acc-card-point {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 11px 16px;
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: #4a3f30;
                    border-bottom: 1px solid #f8f3ea;
                    transition: background 0.18s;
                }

                .acc-card-point:last-child { border-bottom: none; }
                .acc-card-point:hover { background: #fffbeb; }

                .acc-point-dot {
                    width: 6px; height: 6px;
                    background: #d97706;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* ── Trust strip ── */
                .acc-strip {
                    margin-top: 56px;
                    background: #1a1208;
                    border-radius: 18px;
                    padding: 28px 36px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    flex-wrap: wrap;
                    position: relative;
                    overflow: hidden;
                }

                .acc-strip::before {
                    content: '';
                    position: absolute;
                    right: -10px; top: 50%;
                    transform: translateY(-50%);
                    width: 140px; height: 140px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.14) 1.5px, transparent 1.5px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                .acc-strip-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .acc-strip-icon {
                    width: 40px; height: 40px;
                    background: rgba(252,211,77,0.12);
                    border: 1px solid rgba(252,211,77,0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    flex-shrink: 0;
                }

                .acc-strip-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #fef3c7;
                }

                .acc-strip-sub {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    margin-top: 2px;
                }

                .acc-strip-pills {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    position: relative;
                    z-index: 1;
                }

                .acc-strip-pill {
                    font-size: 10px;
                    font-weight: 400;
                    letter-spacing: 0.05em;
                    color: #fef3c7;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(252,211,77,0.18);
                    padding: 5px 12px;
                    border-radius: 100px;
                    white-space: nowrap;
                }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .acc-hero-layout { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .acc-grid { grid-template-columns: 1fr; }
                    .acc-strip { flex-direction: column; align-items: flex-start; }
                    .acc-strip-pills { justify-content: flex-start; }
                    .acc-card-logo-zone { padding: 28px 28px 24px; }
                    .acc-card-body { padding: 24px 28px 28px; }
                }

                @media (max-width: 480px) {
                    .acc-hero { padding: 64px 20px 56px; }
                    .acc-body { padding: 0 20px 64px; }
                }
            `}</style>

            <main className="acc-root">

                {/* Hero */}
                <div className="acc-hero">
                    <div className="acc-hero-glow" aria-hidden="true" />
                    <div className="acc-hero-inner">
                        <div className="acc-eyebrow">Credentials</div>
                        <div className="acc-hero-layout">
                            <h1 className="acc-title">
                                Accreditation &<br />
                                <em>Registration</em>
                            </h1>
                            <p className="acc-hero-desc">
                                Official quality certifications and government registrations
                                confirming institutional credibility and training authenticity.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="acc-body">
                    <div className="acc-body-inner">
                        <div className="acc-grid">
                            {accreditations.map((item, i) => (
                                <div key={i} className="acc-card">

                                    {/* Logo zone */}
                                    <div className="acc-card-logo-zone">
                                        <div className="acc-card-logo-wrap">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                sizes="100px"
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="acc-card-badge">{item.badge}</span>
                                    </div>

                                    {/* Body */}
                                    <div className="acc-card-body">
                                        <div className="acc-card-subtitle">{item.subtitle}</div>
                                        <h2 className="acc-card-title">{item.title}</h2>
                                        <p className="acc-card-desc">{item.description}</p>

                                        {/* Points */}
                                        <div className="acc-card-points">
                                            {item.points.map((pt, j) => (
                                                <div key={j} className="acc-card-point">
                                                    <span className="acc-point-dot" aria-hidden="true" />
                                                    {pt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust strip */}
                        <div className="acc-strip" aria-label="Institute trust summary">
                            <div className="acc-strip-left">
                                <div className="acc-strip-icon" aria-hidden="true">🏛</div>
                                <div>
                                    <div className="acc-strip-title">
                                        Fully Accredited & Government Recognized
                                    </div>
                                    <div className="acc-strip-sub">
                                        Shivshakti Computer Academy · Ambikapur, Chhattisgarh
                                    </div>
                                </div>
                            </div>
                            <div className="acc-strip-pills">
                                {["ISO 9001:2015", "MSME Udyam", "GSDM Authorized", "Skill India", "DigiLocker"].map((p) => (
                                    <span key={p} className="acc-strip-pill">{p}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}