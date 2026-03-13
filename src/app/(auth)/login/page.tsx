"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const PORTALS = [
    {
        href:      "/admin/login",
        badge:     "Admin Portal",
        icon:      "⚙️",
        title:     "Administrator",
        desc:      "Manage students, courses, payments, certificates and all academy operations.",
        features:  ["Student Management", "Course & Fees Control", "Certificate Tracking", "Secure OTP Authentication"],
    },
    {
        href:      "/teacher/login",
        badge:     "Faculty Portal",
        icon:      "📋",
        title:     "Teacher",
        desc:      "Mark attendance, manage timetables and create study notes for your students.",
        features:  ["Mark Daily Attendance", "Manage Class Timetable", "Create & Edit Notes", "View Student Progress"],
        highlight: true,
    },
    {
        href:      "/student/login",
        badge:     "Student Portal",
        icon:      "🎓",
        title:     "Student",
        desc:      "Access your course details, payment records and certificate status from your dashboard.",
        features:  ["View Course Information", "Track Fee Payments", "Check Certificate Status", "Personal Dashboard"],
    },
];

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--color-primary)";
};

export default function PortalSelectorPage() {
    const router = useRouter();

    return (
        <>
            <style>{`
                @keyframes ps-fade-in {
                    from { opacity:0; transform:translateY(12px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .ps-card { animation: ps-fade-in .35s ease both; }
                .ps-card:nth-child(1) { animation-delay:.04s; }
                .ps-card:nth-child(2) { animation-delay:.10s; }
                .ps-card:nth-child(3) { animation-delay:.16s; }
            `}</style>

            <div className="min-h-screen flex items-center justify-center px-5 py-12 relative overflow-hidden"
                style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--color-bg)" }}>

                {/* Background glows */}
                <div aria-hidden className="fixed -top-28 -right-28 w-[440px] h-[440px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 8%,transparent) 0%,transparent 65%)" }} />
                <div aria-hidden className="fixed -bottom-20 -left-20 w-[360px] h-[360px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 5%,transparent) 0%,transparent 65%)" }} />

                <div className="relative z-10 w-full" style={{ maxWidth: 1040 }}>

                    {/* Header */}
                    <div className="text-center mb-12">
                        {/* Logo */}
                        <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center overflow-hidden"
                            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                            <Image src="/logo.png" alt="Shivshakti Computer Academy" width={40} height={40} className="object-contain" />
                        </div>

                        {/* Eyebrow */}
                        <div className="flex items-center justify-center gap-2 mb-3 text-[9px] font-medium tracking-[0.2em] uppercase"
                            style={{ color: "var(--color-primary)" }}>
                            <span aria-hidden style={{ display:"inline-block", width:20, height:1, background:"var(--color-primary)", flexShrink:0 }} />
                            Portal Access
                            <span aria-hidden style={{ display:"inline-block", width:20, height:1, background:"var(--color-primary)", flexShrink:0 }} />
                        </div>

                        <h1 className="font-serif font-bold leading-[1.2] mb-2"
                            style={{ fontSize: "clamp(1.5rem,3vw,2.1rem)", color: "var(--color-text)" }}>
                            Shivshakti Computer Academy
                        </h1>
                        <p className="text-[0.86rem] font-light" style={{ color: "var(--color-text-muted)" }}>
                            Select the portal you want to access
                        </p>
                    </div>

                    {/* Portal cards grid */}
                    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
                        {PORTALS.map((p) => (
                            <button
                                key={p.href}
                                type="button"
                                className="ps-card text-left relative rounded-[20px] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none"
                                style={{
                                    background:  p.highlight
                                        ? "color-mix(in srgb,var(--color-primary) 4%,var(--color-bg-card))"
                                        : "var(--color-bg-card)",
                                    border:      p.highlight
                                        ? "1px solid color-mix(in srgb,var(--color-primary) 20%,var(--color-border))"
                                        : "1px solid var(--color-border)",
                                    padding:     0,
                                }}
                                onClick={() => router.push(p.href)}
                                aria-label={`Go to ${p.title} portal`}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "var(--color-primary)";
                                    el.style.boxShadow   = "0 12px 40px color-mix(in srgb,var(--color-primary) 10%,transparent)";
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = p.highlight
                                        ? "color-mix(in srgb,var(--color-primary) 20%,var(--color-border))"
                                        : "var(--color-border)";
                                    el.style.boxShadow = "none";
                                }}>

                                {/* Top accent bar — only on hover, managed via CSS class */}
                                <div className="h-[3px] w-full"
                                    style={{
                                        background: p.highlight
                                            ? "linear-gradient(90deg,var(--color-primary),color-mix(in srgb,var(--color-primary) 50%,var(--color-accent)))"
                                            : "transparent",
                                        transition: "background .2s",
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.background = "linear-gradient(90deg,var(--color-primary),color-mix(in srgb,var(--color-primary) 50%,var(--color-accent)))";
                                    }} />

                                <div className="px-7 pt-6 pb-7">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-1.5 text-[8px] font-medium tracking-[0.14em] uppercase rounded-full px-2.5 py-[4px] mb-5"
                                        style={{
                                            background: "color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))",
                                            border:     "1px solid color-mix(in srgb,var(--color-primary) 16%,transparent)",
                                            color:      "var(--color-primary)",
                                        }}>
                                        <span className="text-[10px]" aria-hidden>{p.icon}</span>
                                        {p.badge}
                                    </div>

                                    {/* Title */}
                                    <div className="font-serif text-[1.2rem] font-bold leading-[1.2] mb-2.5"
                                        style={{ color: "var(--color-text)" }}>
                                        {p.title} Access
                                    </div>

                                    {/* Description */}
                                    <p className="text-[0.8rem] font-light leading-[1.75] mb-5"
                                        style={{ color: "var(--color-text-muted)" }}>
                                        {p.desc}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-col rounded-[11px] overflow-hidden mb-6"
                                        style={{ border: "1px solid var(--color-border)" }}>
                                        {p.features.map((f, i) => (
                                            <div key={f}
                                                className="flex items-center gap-2.5 px-3 py-2 text-[0.76rem] font-light"
                                                style={{
                                                    color:        "var(--color-text)",
                                                    borderBottom: i < p.features.length - 1 ? "1px solid var(--color-border)" : "none",
                                                    background:   "var(--color-bg)",
                                                }}>
                                                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 text-[0.45rem]"
                                                    style={{
                                                        background: "color-mix(in srgb,var(--color-success) 12%,transparent)",
                                                        border:     "1px solid color-mix(in srgb,var(--color-success) 20%,transparent)",
                                                        color:      "var(--color-success)",
                                                    }}
                                                    aria-hidden>✓</div>
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA row */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[0.8rem] font-semibold"
                                            style={{ color: "var(--color-primary)" }}>
                                            Sign In
                                        </span>
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.78rem] transition-all duration-200"
                                            style={{
                                                background: "color-mix(in srgb,var(--color-primary) 10%,var(--color-bg))",
                                                border:     "1px solid color-mix(in srgb,var(--color-primary) 20%,transparent)",
                                                color:      "var(--color-primary)",
                                            }}
                                            aria-hidden>
                                            →
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-[0.68rem] font-light"
                        style={{ color: "color-mix(in srgb,var(--color-text-muted) 55%,transparent)" }}>
                        © 2026 Shivshakti Computer Academy. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
}