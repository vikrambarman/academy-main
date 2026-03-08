"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import Script from "next/script";

const contactCards = [
    {
        href: "tel:+917477036832",
        icon: Phone,
        iconColor: "#1a1208",
        label: "Call Us",
        value: "+91 74770 36832",
        sub: "Mon–Sat · 8AM–6PM",
        external: false,
    },
    {
        href: "https://wa.me/919009087883",
        icon: MessageCircle,
        iconColor: "#16a34a",
        label: "WhatsApp",
        value: "+91 90090 87883",
        sub: "Quick response",
        external: true,
    },
    {
        href: "mailto:shivshakticomputeracademy25@gmail.com",
        icon: Mail,
        iconColor: "#2563eb",
        label: "Email",
        value: "Send a Message",
        sub: "We reply within 24hrs",
        external: false,
    },
    {
        href: "https://www.google.com/maps?q=Shivshakti+Computer+Academy",
        icon: MapPin,
        iconColor: "#dc2626",
        label: "Visit Us",
        value: "Ambikapur, C.G.",
        sub: "Get directions →",
        external: true,
    },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", mobile: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .ct-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                }

                /* ── Hero ── */
                .ct-hero {
                    padding: 88px 24px 64px;
                    position: relative;
                    overflow: hidden;
                }

                .ct-hero-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 420px; height: 420px;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                .ct-hero-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .ct-eyebrow {
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

                .ct-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 1.5px;
                    background: #d97706;
                }

                .ct-hero-layout {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                }

                .ct-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.15;
                }

                .ct-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .ct-hero-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    max-width: 340px;
                    padding-bottom: 4px;
                }

                /* ── Contact cards ── */
                .ct-cards-section {
                    padding: 0 24px;
                    position: relative;
                }

                .ct-cards-section::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .ct-cards-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding-top: 48px;
                }

                .ct-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1px;
                    background: #e8dfd0;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .ct-card {
                    background: #fff;
                    padding: 28px 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-decoration: none;
                    transition: background 0.2s;
                    position: relative;
                    overflow: hidden;
                }

                .ct-card:hover { background: #fffbeb; }

                .ct-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: #d97706;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.26s ease;
                }

                .ct-card:hover::before { transform: scaleX(1); }

                .ct-card-icon {
                    width: 40px; height: 40px;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 18px;
                    transition: background 0.2s;
                }

                .ct-card:hover .ct-card-icon { background: #fef3c7; }

                .ct-card-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #b45309;
                    margin-bottom: 6px;
                }

                .ct-card-value {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #1a1208;
                    line-height: 1.3;
                    margin-bottom: 4px;
                }

                .ct-card-sub {
                    font-size: 0.75rem;
                    font-weight: 300;
                    color: #92826b;
                }

                /* ── Main section ── */
                .ct-main {
                    padding: 56px 24px 88px;
                    position: relative;
                }

                .ct-main::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .ct-main-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 20px;
                    align-items: start;
                }

                /* ── Form card ── */
                .ct-form-card {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                }

                .ct-form-header {
                    background: #1a1208;
                    padding: 32px 36px;
                    position: relative;
                    overflow: hidden;
                }

                .ct-form-header::before {
                    content: '';
                    position: absolute;
                    bottom: -20px; right: -20px;
                    width: 100px; height: 100px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.12) 1.5px, transparent 1.5px);
                    background-size: 10px 10px;
                    pointer-events: none;
                }

                .ct-form-header-label {
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

                .ct-form-header-label::before {
                    content: '';
                    display: inline-block;
                    width: 14px; height: 1.5px;
                    background: #fcd34d;
                }

                .ct-form-header-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                    position: relative;
                    z-index: 1;
                }

                .ct-form-body {
                    padding: 32px 36px 36px;
                }

                /* Form fields */
                .ct-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 16px;
                }

                .ct-label {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #92826b;
                }

                .ct-input {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 300;
                    color: #1a1208;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 12px;
                    padding: 12px 16px;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                }

                .ct-input::placeholder { color: #b8a898; }

                .ct-input:focus {
                    border-color: #d97706;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(217,119,6,0.08);
                }

                .ct-textarea {
                    resize: vertical;
                    min-height: 110px;
                }

                /* Submit button */
                .ct-submit {
                    width: 100%;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    border: none;
                    border-radius: 12px;
                    padding: 14px;
                    cursor: pointer;
                    margin-top: 4px;
                    transition: background 0.2s, transform 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .ct-submit:hover:not(:disabled) {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; }

                /* Alerts */
                .ct-alert {
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 0.82rem;
                    font-weight: 300;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }

                .ct-alert-success {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                }

                .ct-alert-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                }

                /* ── Map card ── */
                .ct-map-card {
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .ct-map-info {
                    background: #fff;
                    padding: 28px 32px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    border-bottom: 1px solid #f0e8d8;
                }

                .ct-info-row {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    padding: 14px 16px;
                    border: 1px solid #f0e8d8;
                    border-radius: 12px;
                    transition: background 0.18s, border-color 0.18s;
                    position: relative;
                    overflow: hidden;
                }

                .ct-info-row::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 4px; bottom: 4px;
                    width: 2px;
                    background: #d97706;
                    border-radius: 2px;
                    transform: scaleY(0);
                    transition: transform 0.22s ease;
                    transform-origin: top;
                }

                .ct-info-row:hover { background: #fffbeb; border-color: #fde68a; }
                .ct-info-row:hover::before { transform: scaleY(1); }

                .ct-info-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #b45309;
                }

                .ct-info-value {
                    font-size: 0.8rem;
                    font-weight: 400;
                    color: #1a1208;
                    line-height: 1.5;
                }

                .ct-info-sub {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: #92826b;
                    line-height: 1.4;
                }

                /* Iframe */
                .ct-iframe-wrap {
                    flex: 1;
                    min-height: 340px;
                    position: relative;
                }

                .ct-iframe-wrap iframe {
                    display: block;
                    width: 100%;
                    height: 100%;
                    min-height: 340px;
                    border: none;
                }

                /* ── Responsive ── */
                @media (max-width: 960px) {
                    .ct-main-inner { grid-template-columns: 1fr; }
                    .ct-cards-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (max-width: 640px) {
                    .ct-hero { padding: 64px 20px 48px; }
                    .ct-hero-layout { flex-direction: column; align-items: flex-start; gap: 12px; }
                    .ct-cards-section { padding: 0 20px; }
                    .ct-main { padding: 48px 20px 64px; }
                    .ct-cards-grid { grid-template-columns: repeat(2, 1fr); border-radius: 16px; }
                    .ct-map-info { grid-template-columns: 1fr; gap: 12px; }
                    .ct-form-header { padding: 24px 24px; }
                    .ct-form-body { padding: 24px 24px 28px; }
                }
            `}</style>

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

            <main className="ct-root">

                {/* Hero */}
                <div className="ct-hero">
                    <div className="ct-hero-glow" aria-hidden="true" />
                    <div className="ct-hero-inner">
                        <div className="ct-eyebrow">Get in Touch</div>
                        <div className="ct-hero-layout">
                            <h1 className="ct-title">
                                Contact <em>Shivshakti</em><br />
                                Computer Academy
                            </h1>
                            <p className="ct-hero-desc">
                                Reach us for admissions, certifications and course
                                guidance. We&apos;re available Mon–Sat, 8AM–6PM.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact cards */}
                <div className="ct-cards-section">
                    <div className="ct-cards-inner">
                        <div className="ct-cards-grid">
                            {contactCards.map((c) => {
                                const Icon = c.icon;
                                return (
                                    <a
                                    key = { c.label }
                                        href = { c.href }
                                target = { c.external ? "_blank" : undefined }
                                rel = { c.external ? "noopener noreferrer" : undefined }
                                className = "ct-card"
                                    >
                                        <div className="ct-card-icon">
                                            <Icon size={18} strokeWidth={1.8} color={c.iconColor} />
                                        </div>
                                        <div className="ct-card-label">{c.label}</div>
                                        <div className="ct-card-value">{c.value}</div>
                                        <div className="ct-card-sub">{c.sub}</div>
                                    </a>
                        );
                            })}
                    </div>
                </div>
            </div>

            {/* Form + Map */}
            <div className="ct-main">
                <div className="ct-main-inner">

                    {/* Form */}
                    <div className="ct-form-card">
                        <div className="ct-form-header">
                            <div className="ct-form-header-label">Message Us</div>
                            <div className="ct-form-header-title">
                                Send a Message &<br />We&apos;ll Get Back to You
                            </div>
                        </div>

                        <div className="ct-form-body">
                            {success && (
                                <div className="ct-alert ct-alert-success" role="alert">
                                    <span>✓</span>
                                    <span>Thank you! Your message has been sent. We&apos;ll respond shortly.</span>
                                </div>
                            )}
                            {error && (
                                <div className="ct-alert ct-alert-error" role="alert">
                                    <span>✕</span>
                                    <span>Something went wrong. Please try again or call us directly.</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="ct-field">
                                    <label className="ct-label" htmlFor="ct-name">Your Name</label>
                                    <input
                                        id="ct-name"
                                        type="text"
                                        placeholder="Full name"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="ct-input"
                                    />
                                </div>

                                <div className="ct-field">
                                    <label className="ct-label" htmlFor="ct-mobile">Mobile Number</label>
                                    <input
                                        id="ct-mobile"
                                        type="tel"
                                        placeholder="+91 XXXXX XXXXX"
                                        required
                                        value={form.mobile}
                                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                        className="ct-input"
                                    />
                                </div>

                                <div className="ct-field">
                                    <label className="ct-label" htmlFor="ct-message">Message</label>
                                    <textarea
                                        id="ct-message"
                                        placeholder="Ask about courses, admissions, fees..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="ct-input ct-textarea"
                                    />
                                </div>

                                <button type="submit" disabled={loading} className="ct-submit">
                                    {loading ? "Sending..." : <>Send Message <span aria-hidden="true">→</span></>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Map + info */}
                    <div className="ct-map-card">
                        <div className="ct-map-info">
                            {[
                                { label: "Address", value: "1st Floor, Above Usha Matching Center", sub: "Near Babra Petrol Pump, Banaras Road, Phunderdihari" },
                                { label: "City", value: "Ambikapur, Chhattisgarh", sub: "Dist: Surguja · PIN 497001" },
                                { label: "Phone", value: "+91 74770 36832", sub: "Call or WhatsApp" },
                                { label: "Hours", value: "Mon – Sat", sub: "8:00 AM – 6:00 PM" },
                            ].map((row) => (
                                <div key={row.label} className="ct-info-row">
                                    <span className="ct-info-label">{row.label}</span>
                                    <span className="ct-info-value">{row.value}</span>
                                    <span className="ct-info-sub">{row.sub}</span>
                                </div>
                            ))}
                        </div>

                        <div className="ct-iframe-wrap">
                            <iframe
                                title="Shivshakti Computer Academy Location"
                                src="https://www.google.com/maps?q=Shivshakti+Computer+Academy&output=embed"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                </div>
            </div>

        </main >
        </>
    );
}