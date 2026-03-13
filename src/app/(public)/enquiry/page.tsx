"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONTACT_METHODS = ["Phone", "WhatsApp"];

const admissionSteps = [
    { num: "1", title: "Submit Enquiry",    desc: "Fill the form with your details and preferred course."          },
    { num: "2", title: "Team Contacts You", desc: "We reach out within 24 hours on your preferred channel."        },
    { num: "3", title: "Visit the Academy", desc: "Come in for a demo session or direct admission."                },
    { num: "4", title: "Enroll & Begin",    desc: "Complete admission formalities and start learning."             },
];

const contactLinks = [
    { href: "tel:+917477036832",                         icon: "📞", label: "Call Us",   value: "+91 74770 36832",  external: false },
    { href: "https://wa.me/919009087883", icon: "💬", label: "WhatsApp", value: "+91 90090 87883", external: true  },
];

/* ── Reusable eyebrow ── */
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

/* ── Dark panel eyebrow ── */
function EyebrowDark({ label, small = false }: { label: string; small?: boolean }) {
    return (
        <div className={`flex items-center gap-1.5 mb-2 font-medium tracking-[0.18em] uppercase ${small ? "text-[9px]" : "text-[9px]"}`}
            style={{ color: "var(--color-warning)" }}>
            <span aria-hidden="true"
                style={{ display: "inline-block", width: small ? 12 : 14, height: 1.5, background: "var(--color-warning)", flexShrink: 0 }} />
            {label}
        </div>
    );
}

export default function EnquiryPage() {
    const [courses, setCourses]   = useState<any[]>([]);
    const [loading, setLoading]   = useState(false);
    const [success, setSuccess]   = useState(false);
    const [error, setError]       = useState(false);
    const [form, setForm]         = useState({
        name: "", mobile: "", course: "", contactMethod: "Phone", message: "",
    });

    useEffect(() => {
        fetch("/api/public/courses")
            .then(r => r.json())
            .then(result => setCourses(result.data || []))
            .catch(err => console.error("Failed to fetch courses:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/public/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ name: "", mobile: "", course: "", contactMethod: "Phone", message: "" });
            } else { setError(true); }
        } catch { setError(true); }
        setLoading(false);
    };

    /* Shared input style helpers */
    const inputBase: React.CSSProperties = {
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text)",
        fontFamily: "'DM Sans', sans-serif",
        borderRadius: 12,
        padding: "12px 16px",
        fontSize: "0.85rem",
        fontWeight: 300,
        width: "100%",
        outline: "none",
        boxSizing: "border-box",
        appearance: "none",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    };
    const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.currentTarget.style.borderColor = "var(--color-primary)";
        e.currentTarget.style.background  = "var(--color-bg-card)";
        e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb,var(--color-primary) 12%,transparent)";
    };
    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.background  = "var(--color-bg)";
        e.currentTarget.style.boxShadow   = "none";
    };

    return (
        <>
            <Script
                id="enquiry-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOrganization",
                        name: "Shivshakti Computer Academy",
                        areaServed: "Ambikapur, Surguja, Chhattisgarh",
                    }),
                }}
            />

            <main style={{ background: "var(--color-bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

                {/* ══════════════════════ HERO ══════════════════════ */}
                <section className="relative overflow-hidden px-6 pt-[88px] pb-16"
                    style={{ background: "var(--color-bg)" }}
                    aria-labelledby="enquiry-hero-heading">

                    {/* Glow */}
                    <div aria-hidden="true" className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
                        style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 9%,transparent) 0%,transparent 65%)" }} />

                    <div className="relative z-10 max-w-[1100px] mx-auto">
                        <Eyebrow label="Admissions Open" />
                        <div className="flex items-end justify-between gap-10 flex-wrap">
                            <h1 id="enquiry-hero-heading"
                                className="font-serif font-bold leading-[1.15]"
                                style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "var(--color-text)" }}>
                                Course <em className="italic" style={{ color: "var(--color-accent)" }}>Enquiry</em><br />
                                in Ambikapur
                            </h1>
                            <p className="text-[0.88rem] font-light leading-[1.8] max-w-[340px] pb-1"
                                style={{ color: "var(--color-text-muted)" }}>
                                Submit your enquiry and our admission team
                                will contact you within 24 hours.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ BODY ══════════════════════ */}
                <section className="relative px-6 pb-[88px]" aria-label="Enquiry form">
                    {/* Top divider */}
                    <div aria-hidden="true" className="absolute top-0 pointer-events-none"
                        style={{ left: "10%", right: "10%", height: 1, background: "linear-gradient(to right,transparent,var(--color-border),transparent)" }} />

                    <div className="max-w-[1100px] mx-auto pt-14 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5 items-start">

                        {/* ── Form card ── */}
                        <div className="rounded-[24px] overflow-hidden"
                            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>

                            {/* Dark header */}
                            <div className="relative overflow-hidden px-9 py-8"
                                style={{ background: "var(--color-bg-sidebar)", borderBottom: "1px solid var(--color-border)" }}>
                                {/* Dot pattern */}
                                <div aria-hidden="true" className="absolute -bottom-4 -right-4 w-28 h-28 pointer-events-none"
                                    style={{
                                        backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 15%,transparent) 1.5px,transparent 1.5px)",
                                        backgroundSize: "11px 11px",
                                    }} />
                                <EyebrowDark label="Admission Enquiry" />
                                <div className="font-serif text-[1.2rem] font-bold leading-[1.25] relative z-10"
                                    style={{ color: "var(--color-text-inverse)" }}>
                                    Tell Us About Yourself
                                </div>
                                <div className="text-[0.8rem] font-light leading-[1.6] mt-1.5 relative z-10"
                                    style={{ color: "color-mix(in srgb,var(--color-text-inverse) 45%,transparent)" }}>
                                    Fill in the form and we&apos;ll get back to you shortly.
                                </div>
                            </div>

                            {/* Form body */}
                            <div className="px-9 py-8">
                                {success && (
                                    <div role="alert" className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5 text-[0.82rem] font-light leading-[1.65]"
                                        style={{ background: "color-mix(in srgb,var(--color-success) 10%,var(--color-bg))", border: "1px solid color-mix(in srgb,var(--color-success) 35%,transparent)", color: "var(--color-success)" }}>
                                        <span>✓</span>
                                        <span>Thank you! Your enquiry has been submitted. Our team will contact you within 24 hours.</span>
                                    </div>
                                )}
                                {error && (
                                    <div role="alert" className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5 text-[0.82rem] font-light leading-[1.65]"
                                        style={{ background: "color-mix(in srgb,var(--color-error) 10%,var(--color-bg))", border: "1px solid color-mix(in srgb,var(--color-error) 35%,transparent)", color: "var(--color-error)" }}>
                                        <span>✕</span>
                                        <span>Something went wrong. Please try again or call us directly.</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                                    {/* Full Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="eq-name" className="text-[10px] font-medium tracking-[0.12em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>Full Name</label>
                                        <input id="eq-name" type="text" required placeholder="Your full name"
                                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                            style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                                    </div>

                                    {/* Mobile */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="eq-mobile" className="text-[10px] font-medium tracking-[0.12em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>Mobile Number</label>
                                        <input id="eq-mobile" type="tel" required placeholder="+91 XXXXX XXXXX"
                                            value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })}
                                            style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                                    </div>

                                    {/* Course select */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="eq-course" className="text-[10px] font-medium tracking-[0.12em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>Course Interested In</label>
                                        <div className="relative">
                                            <select id="eq-course" required
                                                value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}
                                                style={inputBase} onFocus={onFocus} onBlur={onBlur}>
                                                <option value="">Select a course</option>
                                                {courses.map(course => (
                                                    <option key={course._id} value={course.name}>{course.name}</option>
                                                ))}
                                            </select>
                                            {/* Chevron */}
                                            <span aria-hidden="true" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.7rem] pointer-events-none"
                                                style={{ color: "var(--color-text-muted)" }}>▾</span>
                                        </div>
                                    </div>

                                    {/* Contact method tabs */}
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-medium tracking-[0.12em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>Preferred Contact Method</span>
                                        <div className="flex gap-2" role="group" aria-label="Contact method">
                                            {CONTACT_METHODS.map(method => {
                                                const active = form.contactMethod === method;
                                                return (
                                                    <button key={method} type="button"
                                                        aria-pressed={active}
                                                        onClick={() => setForm({ ...form, contactMethod: method })}
                                                        className="flex-1 text-[0.82rem] rounded-[10px] px-4 py-2.5 text-center transition-all duration-200 cursor-pointer"
                                                        style={{
                                                            fontFamily: "'DM Sans', sans-serif",
                                                            background: active ? "var(--color-bg-sidebar)" : "var(--color-bg)",
                                                            border:     active ? "1px solid var(--color-bg-sidebar)" : "1px solid var(--color-border)",
                                                            color:      active ? "var(--color-text-inverse)" : "var(--color-text-muted)",
                                                            fontWeight: active ? 500 : 400,
                                                        }}>
                                                        {method === "WhatsApp" ? "💬 " : "📞 "}{method}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Message — full width */}
                                    <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                                        <label htmlFor="eq-message" className="text-[10px] font-medium tracking-[0.12em] uppercase"
                                            style={{ color: "var(--color-text-muted)" }}>Message (Optional)</label>
                                        <textarea id="eq-message"
                                            placeholder="Any questions or specific requirements..."
                                            value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                            style={{ ...inputBase, minHeight: 100, resize: "vertical" }}
                                            onFocus={onFocus} onBlur={onBlur} />
                                    </div>

                                    {/* Submit — full width */}
                                    <div className="col-span-1 sm:col-span-2">
                                        <button type="submit" disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 rounded-xl py-[15px] text-[0.9rem] font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px"
                                            style={{
                                                background: "var(--color-bg-sidebar)",
                                                color: "var(--color-text-inverse)",
                                                fontFamily: "'DM Sans', sans-serif",
                                                border: "none",
                                            }}
                                            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"; }}
                                            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--color-bg-sidebar)"; }}>
                                            {loading ? "Submitting..." : <>Submit Enquiry <span aria-hidden="true">→</span></>}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>

                        {/* ── Side info card ── */}
                        <div className="rounded-[24px] overflow-hidden relative"
                            style={{ background: "var(--color-bg-sidebar)" }}>

                            {/* Glows & dots */}
                            <div aria-hidden="true" className="absolute -top-10 -right-10 w-52 h-52 rounded-full pointer-events-none"
                                style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 15%,transparent) 0%,transparent 65%)" }} />
                            <div aria-hidden="true" className="absolute -bottom-2 -left-2 w-28 h-28 pointer-events-none"
                                style={{
                                    backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 12%,transparent) 1.5px,transparent 1.5px)",
                                    backgroundSize: "11px 11px",
                                }} />

                            {/* Header */}
                            <div className="relative z-10 px-7 pt-7 pb-6"
                                style={{ borderBottom: "1px solid color-mix(in srgb,var(--color-warning) 10%,transparent)" }}>
                                <EyebrowDark label="What Happens Next" small />
                                <div className="font-serif text-[1.05rem] font-bold leading-[1.25]"
                                    style={{ color: "var(--color-text-inverse)" }}>
                                    Our Admission Process
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="relative z-10 px-7 pt-5 flex flex-col"
                                style={{ borderBottom: "1px solid color-mix(in srgb,var(--color-warning) 8%,transparent)" }}>
                                {admissionSteps.map((step, i) => (
                                    <div key={step.num}
                                        className="flex items-start gap-3 py-4"
                                        style={{ borderBottom: i < admissionSteps.length - 1 ? "1px solid color-mix(in srgb,var(--color-warning) 7%,transparent)" : "none" }}>
                                        {/* Step number badge */}
                                        <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-serif text-[0.7rem] font-bold"
                                            style={{ background: "var(--color-warning)", color: "var(--color-bg-sidebar)" }}
                                            aria-hidden="true">
                                            {step.num}
                                        </div>
                                        <div>
                                            <div className="text-[0.82rem] font-medium leading-[1.3] mb-0.5"
                                                style={{ color: "var(--color-text-inverse)" }}>
                                                {step.title}
                                            </div>
                                            <div className="text-[0.74rem] font-light leading-[1.5]"
                                                style={{ color: "color-mix(in srgb,var(--color-text-inverse) 40%,transparent)" }}>
                                                {step.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact links */}
                            <div className="relative z-10 px-7 pt-5 pb-7 flex flex-col gap-2.5">
                                {contactLinks.map(link => (
                                    <a key={link.label}
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="flex items-center gap-2.5 no-underline rounded-xl px-3.5 py-2.5 transition-all duration-200"
                                        style={{
                                            background: "color-mix(in srgb,var(--color-text-inverse) 3%,transparent)",
                                            border: "1px solid color-mix(in srgb,var(--color-warning) 12%,transparent)",
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.background   = "color-mix(in srgb,var(--color-warning) 10%,transparent)";
                                            (e.currentTarget as HTMLElement).style.borderColor  = "color-mix(in srgb,var(--color-warning) 25%,transparent)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.background   = "color-mix(in srgb,var(--color-text-inverse) 3%,transparent)";
                                            (e.currentTarget as HTMLElement).style.borderColor  = "color-mix(in srgb,var(--color-warning) 12%,transparent)";
                                        }}>
                                        <span className="text-[0.9rem] w-7 text-center flex-shrink-0" aria-hidden="true">{link.icon}</span>
                                        <div>
                                            <div className="text-[9px] font-medium tracking-[0.1em] uppercase mb-0.5"
                                                style={{ color: "color-mix(in srgb,var(--color-warning) 55%,transparent)" }}>
                                                {link.label}
                                            </div>
                                            <div className="text-[0.8rem] font-normal"
                                                style={{ color: "color-mix(in srgb,var(--color-text-inverse) 70%,transparent)" }}>
                                                {link.value}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}