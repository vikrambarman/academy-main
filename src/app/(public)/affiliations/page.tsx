import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Affiliations & Partnerships | Shivshakti Computer Academy",
    description: "Authorized training partnerships and skill development affiliations of Shivshakti Computer Academy.",
};

const affiliations = [
    { title: "Gramin Skill Development Mission", short: "GSDM", subtitle: "Authorized Training Centre", description: "Authorized training centre aligned with government-recognized skill development diploma programs under the Chhattisgarh state mission.", image: "/images/affiliations/gsdm.jpg", badge: "Govt. Authorized", points: ["State government recognized", "Diploma program authority", "Structured assessment framework"] },
    { title: "Drishti Computer Education", short: "Drishti", subtitle: "Franchise Partner", description: "Authorized franchise partner providing verified certification for foundation and professional computer programs across the region.", image: "/images/affiliations/drishti.jpg", badge: "Franchise Partner", points: ["Verified certification programs", "Foundation & professional levels", "Authorized examination centre"] },
    { title: "Skill India & NSDC", short: "Skill India", subtitle: "National Alignment", description: "Selected program certifications aligned with national skill development frameworks under the Ministry of Skill Development & Entrepreneurship.", image: "/images/affiliations/skillindia.jpg", badge: "National Program", points: ["NSDC aligned curriculum", "Ministry of Skill Development", "Job-ready skill framework"] },
    { title: "DigiLocker Enabled", short: "DigiLocker", subtitle: "Digital Certificate Access", description: "Eligible certificates accessible digitally for instant verification through the Government of India's DigiLocker platform.", image: "/images/affiliations/digilocker.jpg", badge: "Digital Verified", points: ["Govt. DigiLocker platform", "Instant online verification", "Tamper-proof digital records"] },
];

export default function AffiliationsPage() {
    return (
        <>
            <style>{`
                .aff-root { background: var(--color-bg); min-height: 100vh; font-family: 'DM Sans', sans-serif; }

                /* Hero */
                .aff-hero { padding: 88px 24px 72px; position: relative; overflow: hidden; }
                .aff-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
                .aff-eyebrow {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
                    color: var(--color-primary);
                    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
                }
                .aff-eyebrow::before { content: ''; display: inline-block; width: 24px; height: 1.5px; background: var(--color-primary); }
                .aff-hero-layout { display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; flex-wrap: wrap; }
                .aff-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: var(--color-text); line-height: 1.15; }
                .aff-title em { font-style: italic; color: var(--color-accent); }
                .aff-hero-desc { font-size: 0.88rem; font-weight: 300; color: var(--color-text-muted); line-height: 1.8; max-width: 360px; padding-bottom: 4px; }
                .aff-count-pill {
                    display: inline-flex; align-items: center; gap: 8px;
                    font-size: 0.78rem; font-weight: 400; color: var(--color-primary);
                    background: color-mix(in srgb,var(--color-primary) 8%,var(--color-bg));
                    border: 1px solid color-mix(in srgb,var(--color-primary) 25%,transparent);
                    padding: 6px 16px; border-radius: 100px; margin-top: 16px;
                }
                .aff-count-dot { width: 5px; height: 5px; background: var(--color-primary); border-radius: 50%; }

                /* Body */
                .aff-body { padding: 0 24px 88px; position: relative; }
                .aff-body::before {
                    content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }
                .aff-body-inner { max-width: 1100px; margin: 0 auto; padding-top: 56px; }

                /* Grid */
                .aff-grid {
                    display: grid; grid-template-columns: repeat(2, 1fr);
                    gap: 1px; background: var(--color-border);
                    border: 1px solid var(--color-border); border-radius: 24px; overflow: hidden;
                }

                /* Card */
                .aff-card { background: var(--color-bg-card); display: flex; flex-direction: column; transition: background 0.22s; position: relative; overflow: hidden; }
                .aff-card:hover { background: color-mix(in srgb,var(--color-primary) 3%,var(--color-bg-card)); }
                .aff-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(to right, var(--color-primary), var(--color-info));
                    transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; z-index: 1;
                }
                .aff-card:hover::before { transform: scaleX(1); }

                .aff-card-top {
                    padding: 32px 32px 28px;
                    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
                    border-bottom: 1px solid var(--color-border);
                }
                .aff-logo-wrap { position: relative; width: 88px; height: 56px; flex-shrink: 0; }
                .aff-badge {
                    font-size: 9px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
                    color: var(--color-primary);
                    background: color-mix(in srgb,var(--color-primary) 8%,var(--color-bg));
                    border: 1px solid color-mix(in srgb,var(--color-primary) 22%,transparent);
                    padding: 4px 10px; border-radius: 100px; white-space: nowrap; flex-shrink: 0;
                }

                .aff-card-body { padding: 28px 32px 32px; display: flex; flex-direction: column; flex: 1; }
                .aff-card-sub {
                    font-size: 9px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
                    color: var(--color-primary);
                    display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
                }
                .aff-card-sub::before { content: ''; display: inline-block; width: 12px; height: 1.5px; background: var(--color-primary); }
                .aff-card-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: var(--color-text); line-height: 1.3; margin-bottom: 12px; }
                .aff-card-desc { font-size: 0.81rem; font-weight: 300; color: var(--color-text-muted); line-height: 1.8; margin-bottom: 24px; }

                .aff-card-points { display: flex; flex-direction: column; border: 1px solid var(--color-border); border-radius: 10px; overflow: hidden; margin-top: auto; }
                .aff-point {
                    display: flex; align-items: center; gap: 10px;
                    padding: 9px 14px; font-size: 0.77rem; font-weight: 300; color: var(--color-text);
                    border-bottom: 1px solid color-mix(in srgb,var(--color-border) 60%,transparent);
                    transition: background 0.16s;
                }
                .aff-point:last-child { border-bottom: none; }
                .aff-point:hover { background: color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card)); }
                .aff-point-dot { width: 5px; height: 5px; background: var(--color-primary); border-radius: 50%; flex-shrink: 0; }

                /* Trust strip */
                .aff-strip {
                    margin-top: 20px; background: var(--color-bg-sidebar); border-radius: 18px;
                    padding: 26px 32px; display: flex; align-items: center; justify-content: space-between;
                    gap: 20px; flex-wrap: wrap; position: relative; overflow: hidden;
                }
                .aff-strip::before {
                    content: ''; position: absolute; right: -10px; top: 50%; transform: translateY(-50%);
                    width: 160px; height: 160px;
                    background-image: radial-gradient(circle, color-mix(in srgb,var(--color-info) 12%,transparent) 1.5px, transparent 1.5px);
                    background-size: 12px 12px; pointer-events: none;
                }
                .aff-strip-label {
                    font-size: 9px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
                    color: var(--color-info);
                    display: flex; align-items: center; gap: 6px; margin-bottom: 4px;
                }
                .aff-strip-label::before { content: ''; display: inline-block; width: 12px; height: 1.5px; background: var(--color-info); }
                .aff-strip-text { font-family: 'Playfair Display', serif; font-size: 0.9rem; font-weight: 600; color: var(--color-text-inverse); }
                .aff-strip-pills { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; position: relative; z-index: 1; }
                .aff-strip-pill {
                    font-size: 10px; font-weight: 300; letter-spacing: 0.04em;
                    color: rgba(255,255,255,0.7);
                    background: rgba(255,255,255,0.05);
                    border: 1px solid color-mix(in srgb,var(--color-info) 18%,transparent);
                    padding: 5px 12px; border-radius: 100px; white-space: nowrap;
                }

                @media (max-width: 768px) {
                    .aff-hero-layout { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .aff-grid { grid-template-columns: 1fr; border-radius: 20px; }
                    .aff-strip { flex-direction: column; align-items: flex-start; }
                    .aff-strip-pills { justify-content: flex-start; }
                }
                @media (max-width: 480px) {
                    .aff-hero { padding: 64px 20px 56px; }
                    .aff-body { padding: 0 20px 64px; }
                    .aff-card-top { padding: 24px 24px 20px; }
                    .aff-card-body { padding: 22px 24px 28px; }
                }
            `}</style>

            <main className="aff-root">
                <div className="aff-hero">
                    <div aria-hidden="true" className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 8%,transparent) 0%,transparent 65%)" }} />
                    <div className="aff-hero-inner">
                        <div className="aff-eyebrow">Partners & Affiliations</div>
                        <div className="aff-hero-layout">
                            <div>
                                <h1 className="aff-title">Affiliations &<br /><em>Partnerships</em></h1>
                                <div className="aff-count-pill">
                                    <span className="aff-count-dot" aria-hidden="true" />
                                    {affiliations.length} authorized affiliations
                                </div>
                            </div>
                            <p className="aff-hero-desc">
                                Official training partnerships and authorized academic
                                collaborations that back every certificate we issue.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="aff-body">
                    <div className="aff-body-inner">
                        <div className="aff-grid">
                            {affiliations.map((item, i) => (
                                <div key={i} className="aff-card">
                                    <div className="aff-card-top">
                                        <div className="aff-logo-wrap">
                                            <Image src={item.image} alt={item.title} fill sizes="88px" className="object-contain object-left" />
                                        </div>
                                        <span className="aff-badge">{item.badge}</span>
                                    </div>
                                    <div className="aff-card-body">
                                        <div className="aff-card-sub">{item.subtitle}</div>
                                        <h2 className="aff-card-title">{item.title}</h2>
                                        <p className="aff-card-desc">{item.description}</p>
                                        <div className="aff-card-points">
                                            {item.points.map((pt, j) => (
                                                <div key={j} className="aff-point">
                                                    <span className="aff-point-dot" aria-hidden="true" />
                                                    {pt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="aff-strip" aria-label="Affiliation summary">
                            <div>
                                <div className="aff-strip-label">All Affiliations</div>
                                <div className="aff-strip-text">Every certificate is backed by an authorized partner</div>
                            </div>
                            <div className="aff-strip-pills">
                                {affiliations.map(a => (
                                    <span key={a.short} className="aff-strip-pill">{a.short}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}