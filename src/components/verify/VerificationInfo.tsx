"use client"
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
        <div className="rounded-[24px] overflow-hidden relative"
            style={{ background: "var(--color-bg-sidebar)" }}>

            {/* Glows & dots */}
            <div aria-hidden="true" className="absolute -top-16 -right-16 w-[280px] h-[280px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 15%,transparent) 0%,transparent 65%)" }} />
            <div aria-hidden="true" className="absolute -bottom-2.5 -left-2.5 w-[120px] h-[120px] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 12%,transparent) 1.5px,transparent 1.5px)",
                    backgroundSize:  "12px 12px",
                }} />

            {/* ── Header ── */}
            <div className="relative z-10 px-9 pt-8 pb-7 max-sm:px-6 max-sm:pt-6 max-sm:pb-5"
                style={{ borderBottom: "1px solid color-mix(in srgb,var(--color-warning) 10%,transparent)" }}>
                {/* Eyebrow */}
                <div className="flex items-center gap-1.5 mb-2 text-[9px] font-medium tracking-[0.18em] uppercase"
                    style={{ color: "var(--color-warning)" }}>
                    <span aria-hidden="true"
                        style={{ display: "inline-block", width: 14, height: 1.5, background: "var(--color-warning)", flexShrink: 0 }} />
                    How It Works
                </div>
                <div className="font-serif text-[1.2rem] font-bold leading-[1.25]"
                    style={{ color: "var(--color-text-inverse)" }}>
                    Certificate Authorities
                </div>
                <div className="text-[0.8rem] font-light leading-[1.6] mt-1.5"
                    style={{ color: "color-mix(in srgb,var(--color-text-inverse) 45%,transparent)" }}>
                    All certificates are issued and verifiable through these recognized organizations.
                </div>
            </div>

            {/* ── Authorities list ── */}
            <div className="relative z-10 flex flex-col"
                style={{ gap: 1, background: "color-mix(in srgb,var(--color-warning) 6%,transparent)" }}>
                {authorities.map((a, i) => (
                    <div key={a.name}
                        className="relative flex items-start gap-3 px-9 py-[18px] transition-colors duration-200 max-sm:px-6 max-sm:py-4 group"
                        style={{ background: "color-mix(in srgb,var(--color-text-inverse) 2%,transparent)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-warning) 6%,transparent)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-text-inverse) 2%,transparent)"}>

                        {/* Left accent bar */}
                        <span aria-hidden="true"
                            className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-[220ms] ease-out"
                            style={{ background: "var(--color-warning)" }} />

                        {/* Icon */}
                        <div className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[0.85rem] flex-shrink-0"
                            style={{
                                background: "color-mix(in srgb,var(--color-warning) 10%,transparent)",
                                border:     "1px solid color-mix(in srgb,var(--color-warning) 16%,transparent)",
                            }}
                            aria-hidden="true">
                            {a.icon}
                        </div>

                        <div>
                            <div className="text-[8px] font-medium tracking-[0.1em] uppercase mb-0.5"
                                style={{ color: "color-mix(in srgb,var(--color-warning) 60%,transparent)" }}>
                                {a.role}
                            </div>
                            <div className="text-[0.82rem] font-medium leading-[1.3] mb-0.5"
                                style={{ color: "var(--color-text-inverse)" }}>
                                {a.name}
                            </div>
                            <div className="text-[0.74rem] font-light leading-[1.5]"
                                style={{ color: "color-mix(in srgb,var(--color-text-inverse) 35%,transparent)" }}>
                                {a.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Credentials footer ── */}
            <div className="relative z-10 px-9 pt-6 pb-8 max-sm:px-6 max-sm:pb-6"
                style={{ borderTop: "1px solid color-mix(in srgb,var(--color-warning) 10%,transparent)" }}>
                <div className="text-[9px] font-medium tracking-[0.16em] uppercase mb-3.5"
                    style={{ color: "color-mix(in srgb,var(--color-warning) 40%,transparent)" }}>
                    Institute Credentials
                </div>
                <div className="flex flex-col gap-2">
                    {credentials.map(c => (
                        <div key={c} className="flex items-center gap-2 text-[0.78rem] font-light"
                            style={{ color: "color-mix(in srgb,var(--color-text-inverse) 50%,transparent)" }}>
                            {/* Check circle */}
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[0.55rem]"
                                style={{
                                    background: "color-mix(in srgb,var(--color-success) 14%,transparent)",
                                    border:     "1px solid color-mix(in srgb,var(--color-success) 22%,transparent)",
                                    color:      "var(--color-success)",
                                }}
                                aria-hidden="true">
                                ✓
                            </div>
                            {c}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}