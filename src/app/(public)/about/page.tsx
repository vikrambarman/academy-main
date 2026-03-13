import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Shivshakti Computer Academy | Trusted Computer Training in Ambikapur",
    description: "Learn about Shivshakti Computer Academy in Ambikapur — a trusted computer training institute with 10+ years of teaching experience providing practical education and verified certifications.",
};

const stats = [
    { num:"10+",   label:"Years Teaching Experience" },
    { num:"1000+", label:"Students Trained"          },
    { num:"100%",  label:"Verified Certificates"     },
];
const recognitions = [
    { icon:"🏢", label:"MSME (Udyam) Registered Institute"    },
    { icon:"🏅", label:"ISO 9001:2015 Certified"              },
    { icon:"🏛", label:"Authorized GSDM Training Centre"      },
    { icon:"🤝", label:"Drishti Computer Education Franchise" },
    { icon:"📜", label:"Skill India Aligned Programs"         },
    { icon:"🔗", label:"DigiLocker Enabled Certificates"      },
];
const processSteps = [
    { num:"01", title:"Enroll in Course",   desc:"Choose a program suited to your goals and register."                         },
    { num:"02", title:"Practical Training", desc:"100% hands-on training with dedicated computer systems."                     },
    { num:"03", title:"Assessment",         desc:"Structured evaluation to measure skills and knowledge."                      },
    { num:"04", title:"Certification",      desc:"Receive digitally verified, government-recognized certificate."               },
];

export default function AboutPage() {
    return (
        <>
            <style>{`
                .ab-root { background: var(--color-bg); min-height: 100vh; font-family: 'DM Sans', sans-serif; }

                /* Shared section */
                .ab-section { padding: 88px 24px; position: relative; overflow: hidden; }
                .ab-section::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%; height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }
                .ab-section:first-of-type::before { display: none; }
                .ab-inner { max-width: 1100px; margin: 0 auto; }

                /* Eyebrow */
                .ab-eyebrow {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
                    color: var(--color-primary);
                    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
                }
                .ab-eyebrow::before {
                    content: ''; display: inline-block; width: 24px; height: 1.5px;
                    background: var(--color-primary);
                }

                .ab-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700;
                    color: var(--color-text); line-height: 1.15;
                }
                .ab-title em { font-style: italic; color: var(--color-accent); }

                .ab-section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700;
                    color: var(--color-text); line-height: 1.2;
                }
                .ab-section-title em { font-style: italic; color: var(--color-accent); }

                /* Hero */
                .ab-hero { background: var(--color-bg); padding: 100px 24px 88px; position: relative; overflow: hidden; }
                .ab-hero-inner {
                    max-width: 1100px; margin: 0 auto;
                    display: grid; grid-template-columns: 1fr 1fr; gap: 72px;
                    align-items: center; position: relative; z-index: 1;
                }
                .ab-hero-body {
                    font-size: 0.9rem; font-weight: 300; color: var(--color-text-muted);
                    line-height: 1.85; margin-top: 20px; max-width: 480px;
                }

                /* Stats */
                .ab-stats {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 1px; background: var(--color-border);
                    border: 1px solid var(--color-border); border-radius: 16px;
                    overflow: hidden; margin-top: 40px;
                }
                .ab-stat {
                    background: var(--color-bg-card); padding: 22px 20px; text-align: center;
                    transition: background 0.2s;
                }
                .ab-stat:hover { background: color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card)); }
                .ab-stat-num {
                    font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700;
                    color: var(--color-text); line-height: 1;
                }
                .ab-stat-label {
                    font-size: 0.72rem; font-weight: 300; color: var(--color-text-muted);
                    margin-top: 6px; line-height: 1.4; letter-spacing: 0.02em;
                }

                /* Hero image */
                .ab-hero-img-wrap { position: relative; }
                .ab-hero-dot-grid {
                    position: absolute; top: -24px; right: -24px;
                    width: 96px; height: 96px;
                    background-image: radial-gradient(circle, var(--color-primary) 1.2px, transparent 1.2px);
                    background-size: 12px 12px; opacity: 0.15; z-index: 0;
                }
                .ab-hero-img-frame {
                    position: relative; border-radius: 24px; overflow: hidden;
                    aspect-ratio: 4/3;
                    box-shadow: 0 28px 72px color-mix(in srgb,var(--color-primary) 15%,transparent);
                    background: color-mix(in srgb,var(--color-primary) 8%,var(--color-bg));
                }
                .ab-hero-img-frame::before {
                    content: ''; position: absolute; top: -10px; left: -10px;
                    width: 60px; height: 60px;
                    border-top: 2.5px solid var(--color-primary);
                    border-left: 2.5px solid var(--color-primary);
                    border-radius: 3px 0 0 0; z-index: 2;
                }
                .ab-hero-img-frame::after {
                    content: ''; position: absolute; bottom: -10px; right: -10px;
                    width: 60px; height: 60px;
                    border-bottom: 2.5px solid var(--color-accent);
                    border-right: 2.5px solid var(--color-accent);
                    border-radius: 0 0 3px 0; z-index: 2;
                }

                /* Who we are */
                .ab-who-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
                .ab-who-body { font-size: 0.88rem; font-weight: 300; color: var(--color-text-muted); line-height: 1.9; margin-top: 16px; }

                /* Quote box */
                .ab-who-quote {
                    background: var(--color-bg-sidebar);
                    border-radius: 20px; padding: 40px 36px;
                    position: relative; overflow: hidden;
                }
                .ab-who-quote::before {
                    content: '"'; position: absolute; top: -10px; right: 20px;
                    font-family: 'Playfair Display', serif; font-size: 8rem; font-weight: 900;
                    color: color-mix(in srgb,var(--color-info) 7%,transparent);
                    line-height: 1; pointer-events: none;
                }
                .ab-who-quote-text {
                    font-family: 'Playfair Display', serif; font-size: 1.05rem;
                    font-style: italic; font-weight: 400;
                    color: var(--color-text-inverse); line-height: 1.7;
                    position: relative; z-index: 1;
                }
                .ab-who-quote-dash {
                    width: 32px; height: 2px; background: var(--color-info);
                    border-radius: 2px; margin: 20px 0 14px;
                }
                .ab-who-quote-attr {
                    font-size: 0.78rem; font-weight: 300;
                    color: rgba(255,255,255,0.4); letter-spacing: 0.04em;
                }

                /* Recognitions */
                .ab-rec-header {
                    display: flex; align-items: flex-end; justify-content: space-between;
                    gap: 32px; margin-bottom: 48px; flex-wrap: wrap;
                }
                .ab-rec-desc { font-size: 0.88rem; font-weight: 300; color: var(--color-text-muted); line-height: 1.75; max-width: 360px; }
                .ab-rec-grid {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 1px; background: var(--color-border);
                    border: 1px solid var(--color-border); border-radius: 20px; overflow: hidden;
                }
                .ab-rec-card {
                    background: var(--color-bg-card); padding: 32px 28px;
                    display: flex; align-items: flex-start; gap: 14px;
                    transition: background 0.22s; position: relative;
                }
                .ab-rec-card:hover { background: color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card)); }
                .ab-rec-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: var(--color-primary);
                    transform: scaleX(0); transform-origin: left; transition: transform 0.26s ease;
                }
                .ab-rec-card:hover::before { transform: scaleX(1); }
                .ab-rec-icon {
                    width: 36px; height: 36px;
                    background: color-mix(in srgb,var(--color-primary) 8%,var(--color-bg));
                    border: 1px solid color-mix(in srgb,var(--color-primary) 22%,transparent);
                    border-radius: 10px; display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem; flex-shrink: 0;
                }
                .ab-rec-label { font-size: 0.85rem; font-weight: 500; color: var(--color-text); line-height: 1.4; padding-top: 6px; }

                /* Process — dark section */
                .ab-process-section {
                    background: var(--color-bg-sidebar);
                    padding: 88px 24px; position: relative; overflow: hidden;
                }
                .ab-process-eyebrow {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
                    color: var(--color-info);
                    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
                }
                .ab-process-eyebrow::before {
                    content: ''; display: inline-block; width: 24px; height: 1.5px;
                    background: var(--color-info);
                }
                .ab-process-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700;
                    color: var(--color-text-inverse); line-height: 1.2; margin-bottom: 56px;
                }
                .ab-process-title em { font-style: italic; color: var(--color-info); }
                .ab-process-steps {
                    display: grid; grid-template-columns: repeat(4, 1fr); position: relative;
                }
                .ab-process-steps::before {
                    content: ''; position: absolute; top: 22px;
                    left: calc(25% / 2); right: calc(25% / 2); height: 1px;
                    background: linear-gradient(to right,
                        color-mix(in srgb,var(--color-info) 30%,transparent),
                        color-mix(in srgb,var(--color-info) 60%,transparent),
                        color-mix(in srgb,var(--color-info) 30%,transparent)
                    );
                    pointer-events: none;
                }
                .ab-step { padding-right: 28px; position: relative; z-index: 1; }
                .ab-step:last-child { padding-right: 0; }
                .ab-step-num {
                    font-family: 'Playfair Display', serif; font-size: 0.8rem; font-weight: 700;
                    color: var(--color-bg-sidebar);
                    background: var(--color-primary);
                    width: 44px; height: 44px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; margin-bottom: 24px;
                    box-shadow: 0 0 0 6px color-mix(in srgb,var(--color-primary) 15%,transparent);
                }
                .ab-step-title {
                    font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600;
                    color: var(--color-text-inverse); line-height: 1.3; margin-bottom: 10px;
                }
                .ab-step-desc { font-size: 0.8rem; font-weight: 300; color: rgba(255,255,255,0.4); line-height: 1.75; }
                .ab-step-accent {
                    width: 2px; height: 32px;
                    background: linear-gradient(to bottom, var(--color-primary), transparent);
                    border-radius: 2px; margin-top: 16px;
                }

                /* Mission / Vision */
                .ab-mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .ab-mv-card {
                    background: var(--color-bg-sidebar); border-radius: 20px;
                    padding: 44px 40px; position: relative; overflow: hidden;
                }
                .ab-mv-card::after {
                    content: ''; position: absolute; bottom: -16px; right: -16px;
                    width: 120px; height: 120px;
                    background-image: radial-gradient(circle, color-mix(in srgb,var(--color-info) 12%,transparent) 1.5px, transparent 1.5px);
                    background-size: 12px 12px; pointer-events: none;
                }
                .ab-mv-label {
                    font-size: 9px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
                    color: var(--color-info);
                    display: flex; align-items: center; gap: 8px; margin-bottom: 18px;
                }
                .ab-mv-label::before { content: ''; display: inline-block; width: 16px; height: 1.5px; background: var(--color-info); }
                .ab-mv-title {
                    font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700;
                    color: var(--color-text-inverse); line-height: 1.3; margin-bottom: 16px;
                }
                .ab-mv-body {
                    font-size: 0.85rem; font-weight: 300; color: rgba(255,255,255,0.45);
                    line-height: 1.85; position: relative; z-index: 1;
                }

                /* Founder */
                .ab-founder-wrap {
                    background: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: 24px; overflow: hidden;
                    display: grid; grid-template-columns: 280px 1fr;
                }
                .ab-founder-left {
                    background: var(--color-bg-sidebar); padding: 48px 36px;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    position: relative; overflow: hidden;
                }
                .ab-founder-left::before {
                    content: ''; position: absolute; bottom: -20px; right: -20px;
                    width: 120px; height: 120px;
                    background-image: radial-gradient(circle, color-mix(in srgb,var(--color-info) 12%,transparent) 1.5px, transparent 1.5px);
                    background-size: 12px 12px; pointer-events: none;
                }
                .ab-founder-img-ring {
                    width: 120px; height: 120px; border-radius: 50%;
                    border: 2px solid color-mix(in srgb,var(--color-primary) 40%,transparent);
                    padding: 4px; margin-bottom: 20px; position: relative; z-index: 1;
                }
                .ab-founder-img-inner {
                    width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
                    background: color-mix(in srgb,var(--color-primary) 20%,var(--color-bg-sidebar));
                    position: relative;
                }
                .ab-founder-name {
                    font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600;
                    color: var(--color-text-inverse); text-align: center; position: relative; z-index: 1;
                }
                .ab-founder-role {
                    font-size: 0.72rem; font-weight: 300; color: rgba(255,255,255,0.4);
                    text-align: center; margin-top: 4px; letter-spacing: 0.04em; position: relative; z-index: 1;
                }
                .ab-founder-quote-mark {
                    font-family: 'Playfair Display', serif; font-size: 1.8rem;
                    color: var(--color-info); margin-top: 20px; opacity: 0.6; position: relative; z-index: 1;
                }
                .ab-founder-right { padding: 48px 44px; }
                .ab-founder-tag {
                    font-size: 9px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
                    color: var(--color-primary);
                    display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
                }
                .ab-founder-tag::before { content: ''; display: inline-block; width: 16px; height: 1.5px; background: var(--color-primary); }
                .ab-founder-title {
                    font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700;
                    color: var(--color-text); line-height: 1.25; margin-bottom: 20px;
                }
                .ab-founder-body { font-size: 0.85rem; font-weight: 300; color: var(--color-text-muted); line-height: 1.9; margin-bottom: 14px; }
                .ab-founder-motto {
                    display: inline-flex; align-items: center; gap: 8px;
                    font-family: 'Playfair Display', serif; font-size: 0.88rem; font-style: italic;
                    color: var(--color-primary); margin-top: 8px; padding: 10px 18px;
                    background: color-mix(in srgb,var(--color-primary) 6%,var(--color-bg));
                    border: 1px solid color-mix(in srgb,var(--color-primary) 22%,transparent);
                    border-radius: 100px;
                }

                /* Responsive */
                @media (max-width: 960px) {
                    .ab-hero-inner { grid-template-columns: 1fr; gap: 48px; }
                    .ab-who-grid { grid-template-columns: 1fr; gap: 36px; }
                    .ab-rec-grid { grid-template-columns: repeat(2, 1fr); }
                    .ab-process-steps { grid-template-columns: repeat(2, 1fr); gap: 40px; }
                    .ab-process-steps::before { display: none; }
                    .ab-mv-grid { grid-template-columns: 1fr; }
                    .ab-founder-wrap { grid-template-columns: 1fr; }
                    .ab-founder-left { padding: 40px 28px 32px; flex-direction: row; justify-content: flex-start; gap: 20px; }
                    .ab-founder-img-ring { width: 80px; height: 80px; margin-bottom: 0; }
                    .ab-founder-quote-mark { display: none; }
                }
                @media (max-width: 640px) {
                    .ab-hero { padding: 72px 20px 64px; }
                    .ab-section { padding: 64px 20px; }
                    .ab-process-section { padding: 64px 20px; }
                    .ab-rec-grid { grid-template-columns: 1fr; border-radius: 16px; }
                    .ab-process-steps { grid-template-columns: 1fr; gap: 32px; }
                    .ab-rec-header { flex-direction: column; align-items: flex-start; }
                    .ab-founder-right { padding: 32px 24px; }
                }
            `}</style>

            <main className="ab-root">

                {/* Hero */}
                <div className="ab-hero">
                    <div aria-hidden="true" className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none"
                        style={{ background:"radial-gradient(circle,color-mix(in srgb,var(--color-primary) 9%,transparent) 0%,transparent 65%)" }} />
                    <div aria-hidden="true" className="absolute -bottom-15 -left-15 w-[320px] h-[320px] rounded-full pointer-events-none"
                        style={{ background:"radial-gradient(circle,color-mix(in srgb,var(--color-info) 7%,transparent) 0%,transparent 65%)" }} />

                    <div className="ab-hero-inner">
                        <div>
                            <div className="ab-eyebrow">Established & Recognized</div>
                            <h1 className="ab-title">
                                Empowering <em>Digital Skills</em><br />in Ambikapur
                            </h1>
                            <p className="ab-hero-body">
                                Shivshakti Computer Academy is a trusted computer training institute
                                in Ambikapur dedicated to practical learning, verified certification,
                                and career-oriented digital skill development. With more than 10 years
                                of teaching experience, our institute builds strong digital foundations
                                and practical confidence for every student.
                            </p>
                            <div className="ab-stats">
                                {stats.map((s, i) => (
                                    <div key={i} className="ab-stat">
                                        <div className="ab-stat-num">{s.num}</div>
                                        <div className="ab-stat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ab-hero-img-wrap">
                            <div className="ab-hero-dot-grid" aria-hidden="true" />
                            <div className="ab-hero-img-frame">
                                <Image src="/about.png" alt="Students learning practical computer training at Shivshakti Academy"
                                    fill sizes="(max-width: 960px) 100vw, 540px" className="object-cover" priority />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Who We Are */}
                <div className="ab-section">
                    <div className="ab-inner">
                        <div className="ab-who-grid">
                            <div>
                                <div className="ab-eyebrow">Who We Are</div>
                                <h2 className="ab-section-title">
                                    A Centre Built on<br /><em>Transparency & Trust</em>
                                </h2>
                                <p className="ab-who-body">
                                    Shivshakti Computer Academy is an Authorized Training Centre under
                                    Gramin Skill Development Mission. Our programs are designed to align
                                    with national skill development initiatives, ensuring students receive
                                    structured training and recognised certifications.
                                </p>
                                <p className="ab-who-body" style={{ marginTop:14 }}>
                                    We follow a transparent training approach where students first learn
                                    through practical hands-on sessions, then undergo proper assessment,
                                    and finally receive verified certification from authorized organizations.
                                </p>
                            </div>
                            <div className="ab-who-quote">
                                <p className="ab-who-quote-text">
                                    "Practical skills first. Honest certification. Long-term success — that is the promise we make to every student who walks through our doors."
                                </p>
                                <div className="ab-who-quote-dash" aria-hidden="true" />
                                <div className="ab-who-quote-attr">
                                    Shivshakti Computer Academy<br />Ambikapur, Chhattisgarh
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recognitions */}
                <div className="ab-section">
                    <div className="ab-inner">
                        <div className="ab-rec-header">
                            <div>
                                <div className="ab-eyebrow">Credentials</div>
                                <h2 className="ab-section-title">Recognition &<br /><em>Authorizations</em></h2>
                            </div>
                            <p className="ab-rec-desc">
                                Every recognition we hold is a commitment to quality,
                                transparency and genuine certification for our students.
                            </p>
                        </div>
                        <div className="ab-rec-grid">
                            {recognitions.map((r, i) => (
                                <div key={i} className="ab-rec-card">
                                    <div className="ab-rec-icon" aria-hidden="true">{r.icon}</div>
                                    <div className="ab-rec-label">{r.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Process */}
                <div className="ab-process-section">
                    <div aria-hidden="true" className="absolute -bottom-20 -left-15 w-[360px] h-[360px] rounded-full pointer-events-none"
                        style={{ background:"radial-gradient(circle,color-mix(in srgb,var(--color-primary) 10%,transparent) 0%,transparent 65%)" }} />
                    <div className="ab-inner" style={{ position:"relative", zIndex:1 }}>
                        <div className="ab-process-eyebrow">How It Works</div>
                        <h2 className="ab-process-title">Training &<br /><em>Certification Process</em></h2>
                        <div className="ab-process-steps">
                            {processSteps.map(step => (
                                <div key={step.num} className="ab-step">
                                    <div className="ab-step-num" aria-hidden="true">{step.num}</div>
                                    <h3 className="ab-step-title">{step.title}</h3>
                                    <p className="ab-step-desc">{step.desc}</p>
                                    <div className="ab-step-accent" aria-hidden="true" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="ab-section">
                    <div className="ab-inner">
                        <div style={{ marginBottom:40 }}>
                            <div className="ab-eyebrow">Our Purpose</div>
                            <h2 className="ab-section-title">Mission &<br /><em>Vision</em></h2>
                        </div>
                        <div className="ab-mv-grid">
                            <div className="ab-mv-card">
                                <div className="ab-mv-label">Mission</div>
                                <div className="ab-mv-title">Skills First. Honest Certification.</div>
                                <p className="ab-mv-body">
                                    To provide affordable, practical and certified computer education that
                                    builds job-ready skills and self-confidence among students across
                                    Ambikapur and Surguja region.
                                </p>
                            </div>
                            <div className="ab-mv-card">
                                <div className="ab-mv-label">Vision</div>
                                <div className="ab-mv-title">A Trusted Digital Learning Hub.</div>
                                <p className="ab-mv-body">
                                    To become a trusted digital skill development institute recognised for
                                    honest training, genuine certification, and long-term student success
                                    in India's growing digital economy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Founder */}
                <div className="ab-section">
                    <div className="ab-inner">
                        <div className="ab-founder-wrap">
                            <div className="ab-founder-left">
                                <div className="ab-founder-img-ring">
                                    <div className="ab-founder-img-inner">
                                        <Image src="/founder.jpg" alt="Mr. Vikram Barman — Founder, Shivshakti Computer Academy" fill className="object-cover" />
                                    </div>
                                </div>
                                <div className="ab-founder-name">Mr. Vikram Barman</div>
                                <div className="ab-founder-role">Founder & Director</div>
                                <div className="ab-founder-quote-mark" aria-hidden="true">"</div>
                            </div>
                            <div className="ab-founder-right">
                                <div className="ab-founder-tag">Founder's Message</div>
                                <h2 className="ab-founder-title">A Decade of Teaching.<br />A Vision for Impact.</h2>
                                <p className="ab-founder-body">
                                    With over a decade of teaching experience, my journey in education has been
                                    focused on helping students develop strong academic and digital foundations.
                                    Before establishing this institute, I worked as a Senior Computer Faculty
                                    where I trained students in practical computer applications and career-oriented skills.
                                </p>
                                <p className="ab-founder-body">
                                    Shivshakti Computer Academy was founded with a clear vision — to provide
                                    transparent, practical and skill-based computer education that prepares
                                    students for real-world opportunities in today's digital era.
                                </p>
                                <div className="ab-founder-motto">
                                    "Skills First. Certification With Integrity."
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}