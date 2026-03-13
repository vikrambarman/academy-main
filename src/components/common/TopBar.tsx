"use client"

import Link from "next/link";

export default function TopBar() {
    return (
        <div className="relative z-50 font-sans"
            style={{ background:"var(--color-bg-sidebar)", borderBottom:"1px solid color-mix(in srgb,var(--color-info) 10%,transparent)" }}>
            <div className="max-w-[1100px] mx-auto px-6 h-9 flex items-center justify-between gap-4">

                {/* Left — hidden on mobile */}
                <div className="hidden md:flex items-center gap-5">
                    {[
                        { icon:"📞", text:"+91 74770 36832"         },
                        { icon:"📍", text:"Ambikapur, Chhattisgarh" },
                        { icon:"🕐", text:"Mon–Sat · 8AM–6PM"       },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {i > 0 && (
                                <span className="w-px h-3 shrink-0"
                                    style={{ background:"color-mix(in srgb,var(--color-info) 15%,transparent)" }} />
                            )}
                            <span className="flex items-center gap-1.5 text-[11px] font-light tracking-wide whitespace-nowrap"
                                style={{ color:"rgba(255,255,255,0.4)" }}>
                                <span className="text-xs opacity-70" aria-hidden="true">{item.icon}</span>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 shrink-0 ml-auto">
                    {[
                        { href:"/student/login", label:"Student Portal" },
                        { href:"/teacher/login", label:"Teacher"        },
                        { href:"/admin/login",   label:"Admin"          },
                    ].map((link, i) => (
                        <div key={link.href} className="flex items-center gap-3">
                            {i > 0 && (
                                <span className="w-px h-3 shrink-0"
                                    style={{ background:"color-mix(in srgb,var(--color-info) 15%,transparent)" }} />
                            )}
                            <Link href={link.href}
                                className="text-[11px] font-normal tracking-widest transition-colors duration-200"
                                style={{ color:"rgba(255,255,255,0.4)" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "var(--color-info)")}
                                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                                {link.label}
                            </Link>
                        </div>
                    ))}

                    {/* Accent CTA */}
                    <Link href="/enquiry"
                        className="text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1 rounded-full transition-colors duration-200 whitespace-nowrap ml-1"
                        style={{ color:"#fff", background:"var(--color-accent)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb,var(--color-accent) 85%,#000)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "var(--color-accent)")}>
                        Admission
                    </Link>
                </div>

            </div>
        </div>
    );
}