// ============================================================
// components/verify/VerificationInfo.tsx
// ============================================================
const authorities = [
    {
        icon: "🎓",
        name: "Drishti Computer Education",
        role: "Franchise Partner",
        desc: "Foundation, ADCA, DCA and professional program certificates.",
    },
    {
        icon: "🏛",
        name: "Gramin Skill Development Mission",
        role: "Govt. Authorized Centre",
        desc: "State-recognized diploma programs for skill development.",
    },
    {
        icon: "📜",
        name: "NSDC / Skill India",
        role: "National Alignment",
        desc: "Ministry of Skill Development aligned course certifications.",
    },
    {
        icon: "🔗",
        name: "DigiLocker — Medhavi Skill University",
        role: "Digital Verified",
        desc: "University-level diplomas accessible on Government DigiLocker.",
    },
];

const credentials = [
    "ISO 9001:2015 Certified Institute",
    "GSDM Authorized Training Centre",
    "NSDC & Skill India Aligned Courses",
    "MSME (Udyam) Registered",
];

export default function VerificationInfo() {
    return (
        <>
            <style>{`
                .vi-card {
                    background: #1a1208;
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                }

                .vi-card-glow {
                    position: absolute;
                    top: -60px; right: -60px;
                    width: 280px; height: 280px;
                    background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 65%);
                    pointer-events: none;
                }

                .vi-card-dots {
                    position: absolute;
                    bottom: -10px; left: -10px;
                    width: 120px; height: 120px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.1) 1.5px, transparent 1.5px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                /* Header */
                .vi-header {
                    padding: 32px 36px 28px;
                    border-bottom: 1px solid rgba(252,211,77,0.08);
                    position: relative;
                    z-index: 1;
                }

                .vi-header-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 8px;
                }

                .vi-header-label::before {
                    content: '';
                    display: inline-block;
                    width: 14px; height: 1.5px;
                    background: #fcd34d;
                }

                .vi-header-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.25;
                }

                .vi-header-sub {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    margin-top: 6px;
                    line-height: 1.6;
                }

                /* Authorities list */
                .vi-authorities {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    background: rgba(252,211,77,0.06);
                    position: relative;
                    z-index: 1;
                }

                .vi-auth-row {
                    background: rgba(255,255,255,0.02);
                    padding: 18px 36px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    transition: background 0.18s;
                    position: relative;
                }

                .vi-auth-row::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 4px; bottom: 4px;
                    width: 2px;
                    background: #fcd34d;
                    border-radius: 2px;
                    transform: scaleY(0);
                    transition: transform 0.22s ease;
                    transform-origin: top;
                }

                .vi-auth-row:hover { background: rgba(252,211,77,0.05); }
                .vi-auth-row:hover::before { transform: scaleY(1); }

                .vi-auth-icon {
                    width: 32px; height: 32px;
                    background: rgba(252,211,77,0.08);
                    border: 1px solid rgba(252,211,77,0.14);
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    flex-shrink: 0;
                }

                .vi-auth-badge {
                    font-size: 8px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: rgba(252,211,77,0.6);
                    margin-bottom: 3px;
                }

                .vi-auth-name {
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #fef3c7;
                    line-height: 1.3;
                    margin-bottom: 3px;
                }

                .vi-auth-desc {
                    font-size: 0.74rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.35);
                    line-height: 1.5;
                }

                /* Credentials footer */
                .vi-footer {
                    padding: 24px 36px 32px;
                    border-top: 1px solid rgba(252,211,77,0.08);
                    position: relative;
                    z-index: 1;
                }

                .vi-footer-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: rgba(252,211,77,0.4);
                    margin-bottom: 14px;
                }

                .vi-creds {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .vi-cred {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.5);
                }

                .vi-cred-check {
                    width: 16px; height: 16px;
                    background: rgba(74,222,128,0.12);
                    border: 1px solid rgba(74,222,128,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.55rem;
                    color: #4ade80;
                    flex-shrink: 0;
                }

                @media (max-width: 480px) {
                    .vi-header { padding: 24px 24px 20px; }
                    .vi-auth-row { padding: 16px 24px; }
                    .vi-footer { padding: 20px 24px 28px; }
                }
            `}</style>

            <div className="vi-card">
                <div className="vi-card-glow" aria-hidden="true" />
                <div className="vi-card-dots" aria-hidden="true" />

                <div className="vi-header">
                    <div className="vi-header-label">How It Works</div>
                    <div className="vi-header-title">Certificate Authorities</div>
                    <div className="vi-header-sub">
                        All certificates are issued and verifiable through these recognized organizations.
                    </div>
                </div>

                <div className="vi-authorities">
                    {authorities.map((a) => (
                        <div key={a.name} className="vi-auth-row">
                            <div className="vi-auth-icon" aria-hidden="true">{a.icon}</div>
                            <div>
                                <div className="vi-auth-badge">{a.role}</div>
                                <div className="vi-auth-name">{a.name}</div>
                                <div className="vi-auth-desc">{a.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="vi-footer">
                    <div className="vi-footer-label">Institute Credentials</div>
                    <div className="vi-creds">
                        {credentials.map((c) => (
                            <div key={c} className="vi-cred">
                                <div className="vi-cred-check" aria-hidden="true">✓</div>
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}