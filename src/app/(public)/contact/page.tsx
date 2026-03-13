"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import Script from "next/script";

const contactCards = [
    {
        href: "tel:+917477036832",
        icon: Phone,
        label: "Call Us",
        value: "+91 74770 36832",
        sub: "Mon–Sat · 8AM–6PM",
        external: false,
    },
    {
        href: "https://wa.me/919009087883",
        icon: MessageCircle,
        label: "WhatsApp",
        value: "+91 90090 87883",
        sub: "Quick response",
        external: true,
    },
    {
        href: "mailto:shivshakticomputeracademy25@gmail.com",
        icon: Mail,
        label: "Email",
        value: "Send a Message",
        sub: "We reply within 24hrs",
        external: false,
    },
    {
        href: "https://www.google.com/maps?q=Shivshakti+Computer+Academy",
        icon: MapPin,
        label: "Visit Us",
        value: "Ambikapur, C.G.",
        sub: "Get directions →",
        external: true,
    },
];

const mapInfoRows = [
    { label: "Address", value: "1st Floor, Above Usha Matching Center", sub: "Near Babra Petrol Pump, Banaras Road, Phunderdihari" },
    { label: "City",    value: "Ambikapur, Chhattisgarh",               sub: "Dist: Surguja · PIN 497001"                         },
    { label: "Phone",   value: "+91 74770 36832",                        sub: "Call or WhatsApp"                                    },
    { label: "Hours",   value: "Mon – Sat",                              sub: "8:00 AM – 6:00 PM"                                   },
];

/* ── Reusable eyebrow (matches HeroSection / VisitUs pattern) ── */
function Eyebrow({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
            style={{ color: "var(--color-primary)" }}>
            <span aria-hidden="true"
                style={{ display: "inline-block", width: 24, height: 1.5, background: "var(--color-primary)", flexShrink: 0 }} />
            {label}
        </div>
    );
}

/* ── Reusable dark eyebrow (for dark panels) ── */
function EyebrowDark({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-1.5 mb-2 text-[9px] font-medium tracking-[0.18em] uppercase"
            style={{ color: "var(--color-warning)" }}>
            <span aria-hidden="true"
                style={{ display: "inline-block", width: 14, height: 1.5, background: "var(--color-warning)", flexShrink: 0 }} />
            {label}
        </div>
    );
}

export default function ContactPage() {
    const [form, setForm]       = useState({ name: "", mobile: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError]     = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ name: "", mobile: "", message: "" });
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        }
        setLoading(false);
    };

    return (
        <>
            <Script
                id="contact-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOrganization",
                        name: "Shivshakti Computer Academy",
                        address: {
                            "@type": "PostalAddress",
                            streetAddress: "1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras Road, Phunderdihari",
                            addressLocality: "Ambikapur",
                            addressRegion: "Chhattisgarh",
                            postalCode: "497001",
                            addressCountry: "IN",
                        },
                        telephone: "+91 7477036832",
                    }),
                }}
            />

            <main style={{ background: "var(--color-bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

                {/* ══════════════════════ HERO ══════════════════════ */}
                <section className="relative overflow-hidden px-6 pt-[88px] pb-16"
                    style={{ background: "var(--color-bg)" }}
                    aria-labelledby="contact-hero-heading">

                    {/* Glow */}
                    <div aria-hidden="true" className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 9%,transparent) 0%,transparent 65%)" }} />

                    <div className="relative z-10 max-w-[1100px] mx-auto">
                        <Eyebrow label="Get in Touch" />
                        <div className="flex items-end justify-between gap-10 flex-wrap">
                            <h1 id="contact-hero-heading"
                                className="font-serif font-bold leading-[1.15]"
                                style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "var(--color-text)" }}>
                                Contact <em className="italic" style={{ color: "var(--color-accent)" }}>Shivshakti</em><br />
                                Computer Academy
                            </h1>
                            <p className="text-[0.88rem] font-light leading-[1.8] max-w-[340px] pb-1"
                                style={{ color: "var(--color-text-muted)" }}>
                                Reach us for admissions, certifications and course
                                guidance. We&apos;re available Mon–Sat, 8AM–6PM.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ CONTACT CARDS ══════════════════════ */}
                <section className="relative px-6" aria-label="Contact options">
                    {/* Top divider */}
                    <div aria-hidden="true" className="absolute top-0 pointer-events-none"
                        style={{ left: "10%", right: "10%", height: 1, background: "linear-gradient(to right,transparent,var(--color-border),transparent)" }} />

                    <div className="max-w-[1100px] mx-auto pt-12">
                        {/* Cards grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 rounded-[20px] overflow-hidden"
                            style={{ border: "1px solid var(--color-border)", background: "var(--color-border)", gap: 1 }}>
                            {contactCards.map((c) => {
                                const Icon = c.icon;
                                return (
                                    <a key={c.label}
                                        href={c.href}
                                        target={c.external ? "_blank" : undefined}
                                        rel={c.external ? "noopener noreferrer" : undefined}
                                        className="group flex flex-col items-start no-underline px-6 py-7 transition-colors duration-200 relative overflow-hidden"
                                        style={{ background: "var(--color-bg-card)" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card))"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg-card)"}>

                                        {/* Top accent bar on hover */}
                                        <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[260ms] ease-out"
                                            style={{ background: "var(--color-primary)" }} />

                                        {/* Icon */}
                                        <div className="w-10 h-10 rounded-[11px] flex items-center justify-center mb-[18px] transition-colors duration-200"
                                            style={{
                                                background: "color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))",
                                                border: "1px solid color-mix(in srgb,var(--color-primary) 20%,transparent)",
                                            }}>
                                            <Icon size={18} strokeWidth={1.8} style={{ color: "var(--color-primary)" }} />
                                        </div>

                                        <div className="text-[9px] font-medium tracking-[0.14em] uppercase mb-1.5"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            {c.label}
                                        </div>
                                        <div className="text-[0.9rem] font-medium leading-[1.3] mb-1"
                                            style={{ color: "var(--color-text)" }}>
                                            {c.value}
                                        </div>
                                        <div className="text-[0.75rem] font-light"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            {c.sub}
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ FORM + MAP ══════════════════════ */}
                <section className="relative px-6 pt-14 pb-[88px]" aria-label="Contact form and location">
                    {/* Top divider */}
                    <div aria-hidden="true" className="absolute top-0 pointer-events-none"
                        style={{ left: "10%", right: "10%", height: 1, background: "linear-gradient(to right,transparent,var(--color-border),transparent)" }} />

                    <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-5 items-start">

                        {/* ── Form card ── */}
                        <div className="rounded-[24px] overflow-hidden"
                            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>

                            {/* Dark header */}
                            <div className="relative overflow-hidden px-9 py-8"
                                style={{ background: "var(--color-bg-sidebar)", borderBottom: "1px solid var(--color-border)" }}>
                                {/* Dot pattern */}
                                <div aria-hidden="true" className="absolute -bottom-5 -right-5 w-24 h-24 pointer-events-none"
                                    style={{
                                        backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 15%,transparent) 1.5px,transparent 1.5px)",
                                        backgroundSize: "10px 10px",
                                    }} />
                                <EyebrowDark label="Message Us" />
                                <div className="font-serif text-[1.25rem] font-bold leading-[1.2] relative z-10"
                                    style={{ color: "var(--color-text-inverse)" }}>
                                    Send a Message &<br />We&apos;ll Get Back to You
                                </div>
                            </div>

                            {/* Form body */}
                            <div className="px-9 py-8">
                                {success && (
                                    <div role="alert" className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5 text-[0.82rem] font-light leading-[1.6]"
                                        style={{ background: "color-mix(in srgb,var(--color-success) 10%,var(--color-bg))", border: "1px solid color-mix(in srgb,var(--color-success) 35%,transparent)", color: "var(--color-success)" }}>
                                        <span>✓</span>
                                        <span>Thank you! Your message has been sent. We&apos;ll respond shortly.</span>
                                    </div>
                                )}
                                {error && (
                                    <div role="alert" className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5 text-[0.82rem] font-light leading-[1.6]"
                                        style={{ background: "color-mix(in srgb,var(--color-error) 10%,var(--color-bg))", border: "1px solid color-mix(in srgb,var(--color-error) 35%,transparent)", color: "var(--color-error)" }}>
                                        <span>✕</span>
                                        <span>Something went wrong. Please try again or call us directly.</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                    {/* Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="ct-name"
                                            className="text-[11px] font-medium tracking-[0.1em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Your Name
                                        </label>
                                        <input id="ct-name" type="text" placeholder="Full name" required
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full rounded-xl px-4 py-3 text-[0.85rem] font-light outline-none transition-all duration-200"
                                            style={{
                                                background: "var(--color-bg)",
                                                border: "1px solid var(--color-border)",
                                                color: "var(--color-text)",
                                                fontFamily: "'DM Sans', sans-serif",
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = "var(--color-primary)";
                                                e.currentTarget.style.background  = "var(--color-bg-card)";
                                                e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb,var(--color-primary) 12%,transparent)";
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = "var(--color-border)";
                                                e.currentTarget.style.background  = "var(--color-bg)";
                                                e.currentTarget.style.boxShadow   = "none";
                                            }}
                                        />
                                    </div>

                                    {/* Mobile */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="ct-mobile"
                                            className="text-[11px] font-medium tracking-[0.1em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Mobile Number
                                        </label>
                                        <input id="ct-mobile" type="tel" placeholder="+91 XXXXX XXXXX" required
                                            value={form.mobile}
                                            onChange={e => setForm({ ...form, mobile: e.target.value })}
                                            className="w-full rounded-xl px-4 py-3 text-[0.85rem] font-light outline-none transition-all duration-200"
                                            style={{
                                                background: "var(--color-bg)",
                                                border: "1px solid var(--color-border)",
                                                color: "var(--color-text)",
                                                fontFamily: "'DM Sans', sans-serif",
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = "var(--color-primary)";
                                                e.currentTarget.style.background  = "var(--color-bg-card)";
                                                e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb,var(--color-primary) 12%,transparent)";
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = "var(--color-border)";
                                                e.currentTarget.style.background  = "var(--color-bg)";
                                                e.currentTarget.style.boxShadow   = "none";
                                            }}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="ct-message"
                                            className="text-[11px] font-medium tracking-[0.1em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            Message
                                        </label>
                                        <textarea id="ct-message"
                                            placeholder="Ask about courses, admissions, fees..."
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            className="w-full rounded-xl px-4 py-3 text-[0.85rem] font-light outline-none transition-all duration-200 resize-y"
                                            style={{
                                                minHeight: 110,
                                                background: "var(--color-bg)",
                                                border: "1px solid var(--color-border)",
                                                color: "var(--color-text)",
                                                fontFamily: "'DM Sans', sans-serif",
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = "var(--color-primary)";
                                                e.currentTarget.style.background  = "var(--color-bg-card)";
                                                e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb,var(--color-primary) 12%,transparent)";
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = "var(--color-border)";
                                                e.currentTarget.style.background  = "var(--color-bg)";
                                                e.currentTarget.style.boxShadow   = "none";
                                            }}
                                        />
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl py-[14px] text-[0.88rem] font-medium transition-all duration-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px"
                                        style={{
                                            background: "var(--color-bg-sidebar)",
                                            color: "var(--color-text-inverse)",
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"; }}
                                        onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--color-bg-sidebar)"; }}>
                                        {loading ? "Sending..." : <>Send Message <span aria-hidden="true">→</span></>}
                                    </button>

                                </form>
                            </div>
                        </div>

                        {/* ── Map + info card ── */}
                        <div className="flex flex-col rounded-[24px] overflow-hidden"
                            style={{ border: "1px solid var(--color-border)" }}>

                            {/* Info rows */}
                            <div className="grid grid-cols-2 gap-3 p-7"
                                style={{ background: "var(--color-bg-card)", borderBottom: "1px solid var(--color-border)" }}>
                                {mapInfoRows.map((row) => (
                                    <div key={row.label}
                                        className="relative flex flex-col gap-0.5 px-4 py-3.5 rounded-xl overflow-hidden transition-colors duration-200"
                                        style={{ border: "1px solid var(--color-border)" }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.background   = "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg))";
                                            (e.currentTarget as HTMLElement).style.borderColor  = "color-mix(in srgb,var(--color-primary) 30%,transparent)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.background   = "transparent";
                                            (e.currentTarget as HTMLElement).style.borderColor  = "var(--color-border)";
                                        }}>
                                        {/* Left accent bar */}
                                        <span aria-hidden="true" className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
                                            style={{ background: "var(--color-primary)", opacity: 0.5 }} />
                                        <span className="text-[9px] font-medium tracking-[0.14em] uppercase"
                                            style={{ color: "var(--color-primary)" }}>
                                            {row.label}
                                        </span>
                                        <span className="text-[0.8rem] font-medium leading-[1.5]"
                                            style={{ color: "var(--color-text)" }}>
                                            {row.value}
                                        </span>
                                        <span className="text-[0.72rem] font-light leading-[1.4]"
                                            style={{ color: "var(--color-text-muted)" }}>
                                            {row.sub}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Iframe */}
                            <div className="relative flex-1" style={{ minHeight: 340 }}>
                                <iframe
                                    title="Shivshakti Computer Academy Location"
                                    src="https://www.google.com/maps?q=Shivshakti+Computer+Academy&output=embed"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    style={{ display: "block", width: "100%", height: "100%", minHeight: 340, border: "none" }}
                                />
                            </div>

                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}