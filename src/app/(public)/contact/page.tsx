"use client";

import { useState } from "react";
import Script from "next/script";

/* ─── Data (UNCHANGED) ─── */
const contactCards = [
  { href: "tel:+917477036832", label: "Call Us", value: "+91 74770 36832", sub: "Mon–Sat · 8AM–6PM", external: false, icon: "phone" },
  { href: "https://wa.me/919009087883", label: "WhatsApp", value: "+91 90090 87883", sub: "Quick response", external: true, icon: "whatsapp" },
  { href: "mailto:shivshakticomputeracademy25@gmail.com", label: "Email", value: "Send a Message", sub: "We reply within 24hrs", external: false, icon: "mail" },
  { href: "https://www.google.com/maps?q=Shivshakti+Computer+Academy", label: "Visit Us", value: "Ambikapur, C.G.", sub: "Get directions →", external: true, icon: "map" },
];

const mapInfoRows = [
  { label: "Address", value: "1st Floor, Above Usha Matching Center", sub: "Near Babra Petrol Pump, Banaras Road, Phunderdihari" },
  { label: "City", value: "Ambikapur, Chhattisgarh", sub: "Dist: Surguja · PIN 497001" },
  { label: "Phone", value: "+91 74770 36832", sub: "Call or WhatsApp" },
  { label: "Hours", value: "Mon – Sat", sub: "8:00 AM – 6:00 PM" },
];

/* ─── Icons ─── */
const PhoneIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
const WhatsAppIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);
const MailIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>);
const MapPinIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const SendIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>);

const iconMap: Record<string, React.ReactNode> = {
  phone: <PhoneIcon />, whatsapp: <WhatsAppIcon />, mail: <MailIcon />, map: <MapPinIcon />,
};

export default function ContactPage() {
  // ── State & logic: UNCHANGED (backend intact) ──
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
        {/* ── HERO ── */}
        <section className="ct-hero" aria-labelledby="contact-hero-heading">
          <div className="container container-xl ct-hero__inner">
            <div className="ct-hero__eyebrow">
              <span className="ct-hero__eyebrow-line" aria-hidden="true" />
              Get in Touch
            </div>
            <div className="ct-hero__layout">
              <h1 id="contact-hero-heading" className="ct-hero__title">
                Contact <span className="ct-hero__title-em">Shivshakti</span> Computer Academy
              </h1>
              <p className="ct-hero__desc">
                Reach us for admissions, certifications and course guidance. We&apos;re
                available Mon–Sat, 8AM–6PM.
              </p>
            </div>
          </div>
        </section>

        {/* ── CONTACT CARDS ── */}
        <section className="ct-cards-section" aria-label="Contact options">
          <div className="container container-xl ct-cards-section__inner">
            <div className="ct-cards-grid">
              {contactCards.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="ct-card"
                >
                  <div className="ct-card__icon">{iconMap[c.icon]}</div>
                  <div className="ct-card__label">{c.label}</div>
                  <div className="ct-card__value">{c.value}</div>
                  <div className="ct-card__sub">{c.sub}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM + MAP ── */}
        <section className="ct-bottom-section" aria-label="Contact form and location">
          <div className="container container-xl ct-bottom-section__inner">
            {/* Form Card */}
            <div className="ct-form-card">
              <div className="ct-form-card__header">
                <div className="ct-form-card__header-eyebrow">
                  <span className="ct-form-card__header-eyebrow-line" aria-hidden="true" />
                  Message Us
                </div>
                <div className="ct-form-card__header-title">
                  Send a Message &amp; We&apos;ll Get Back to You
                </div>
              </div>

              <div className="ct-form-card__body">
                {success && (
                  <div role="alert" className="ct-alert ct-alert--success">
                    <span aria-hidden="true">✓</span>
                    <span>Thank you! Your message has been sent. We&apos;ll respond shortly.</span>
                  </div>
                )}
                {error && (
                  <div role="alert" className="ct-alert ct-alert--error">
                    <span aria-hidden="true">✕</span>
                    <span>Something went wrong. Please try again or call us directly.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="ct-form">
                  <div className="form-group">
                    <label htmlFor="ct-name" className="ct-form__label">Your Name</label>
                    <input id="ct-name" type="text" placeholder="Full name" required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="ct-form__input" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ct-mobile" className="ct-form__label">Mobile Number</label>
                    <input id="ct-mobile" type="tel" placeholder="+91 XXXXX XXXXX" required
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="ct-form__input" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ct-message" className="ct-form__label">Message</label>
                    <textarea id="ct-message" placeholder="Ask about courses, admissions, fees..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="ct-form__textarea" />
                  </div>
                  <button type="submit" disabled={loading} className="ct-form__submit">
                    {loading ? "Sending…" : (<><SendIcon /> Send Message</>)}
                  </button>
                </form>
              </div>
            </div>

            {/* Map + Info Card */}
            <div className="ct-map-card">
              <div className="ct-map-card__info">
                {mapInfoRows.map((row) => (
                  <div key={row.label} className="ct-info-row">
                    <span className="ct-info-row__label">{row.label}</span>
                    <span className="ct-info-row__value">{row.value}</span>
                    <span className="ct-info-row__sub">{row.sub}</span>
                  </div>
                ))}
              </div>
              <div className="ct-map-card__map">
                <iframe
                  title="Shivshakti Computer Academy Location"
                  src="https://www.google.com/maps?q=Shivshakti+Computer+Academy&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="ct-map-card__iframe"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
/* ── CONTACT — Clean University style ── */
.ct-root { background: var(--bg-page); min-height: 100vh; }

.ct-hero { position: relative; padding: var(--space-20) 0 var(--space-12); background: var(--bg-page); border-bottom: 1px solid var(--border-color); }
.ct-hero__inner { position: relative; }
.ct-hero__eyebrow { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3); }
.ct-hero__eyebrow-line { width: 24px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.ct-hero__layout { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-8); flex-wrap: wrap; }
.ct-hero__title { font-family: var(--font-display); font-size: clamp(1.75rem, 3.6vw, 2.5rem); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.2; letter-spacing: -0.015em; margin: 0; }
.ct-hero__title-em { font-style: normal; color: var(--color-primary-700); }
.ct-hero__desc { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; max-width: 380px; margin: 0; }

/* Cards */
.ct-cards-section { padding-top: var(--space-12); }
.ct-cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
.ct-card {
  position: relative; display: flex; flex-direction: column; align-items: flex-start;
  padding: var(--space-6); background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600); border-radius: var(--radius-lg); text-decoration: none;
  transition: border-color var(--transition-base);
}
.ct-card:hover { border-color: var(--color-gray-300); }
.ct-card__icon {
  width: 40px; height: 40px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4);
  background: var(--color-primary-50); border: 1px solid var(--border-color); color: var(--color-primary-600); flex-shrink: 0;
}
.ct-card__label { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: var(--space-1); }
.ct-card__value { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.2; margin-bottom: var(--space-1); }
.ct-card__sub { font-size: var(--font-size-xs); color: var(--text-tertiary); }

/* Form + map */
.ct-bottom-section { padding: var(--space-12) 0 var(--space-24); }
.ct-bottom-section__inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: var(--space-5); align-items: start; }

.ct-form-card { border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-color); }
.ct-form-card__header { position: relative; padding: var(--space-8); background: var(--color-primary-700); }
.ct-form-card__header-eyebrow { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.85); margin-bottom: var(--space-3); }
.ct-form-card__header-eyebrow-line { width: 14px; height: 2px; background: rgba(255,255,255,0.6); flex-shrink: 0; }
.ct-form-card__header-title { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.3; }
.ct-form-card__body { padding: var(--space-8); background: var(--bg-elevated); }

.ct-alert { display: flex; align-items: flex-start; gap: var(--space-3); border-radius: var(--radius-md); padding: var(--space-3) var(--space-4); margin-bottom: var(--space-5); font-size: var(--font-size-sm); line-height: 1.6; }
.ct-alert--success { background: var(--color-success-light); border: 1px solid var(--color-success); color: var(--color-success-dark); }
.ct-alert--error { background: var(--color-danger-light); border: 1px solid var(--color-danger); color: var(--color-danger-dark); }

.ct-form { display: flex; flex-direction: column; gap: var(--space-4); }
.ct-form__label { display: block; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); margin-bottom: var(--space-2); }
.ct-form__input, .ct-form__textarea {
  width: 100%; padding: var(--space-3) var(--space-4); font-size: var(--font-size-base); font-family: var(--font-sans);
  color: var(--text-primary); background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.ct-form__input:focus, .ct-form__textarea:focus { outline: none; border-color: var(--color-primary-600); box-shadow: 0 0 0 3px var(--color-primary-100); }
.ct-form__input::placeholder, .ct-form__textarea::placeholder { color: var(--color-gray-400); }
.ct-form__textarea { min-height: 110px; resize: vertical; }
.ct-form__submit {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2); width: 100%;
  padding: var(--space-3) var(--space-6); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); font-family: var(--font-sans);
  color: #fff; background: var(--color-primary-600); border: none; border-radius: var(--radius-md); cursor: pointer;
  transition: background var(--transition-base);
}
.ct-form__submit:hover:not(:disabled) { background: var(--color-primary-700); }
.ct-form__submit:disabled { opacity: 0.6; cursor: not-allowed; }

.ct-map-card { border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-color); display: flex; flex-direction: column; }
.ct-map-card__info { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); padding: var(--space-6); background: var(--bg-elevated); border-bottom: 1px solid var(--border-color); }
.ct-info-row {
  display: flex; flex-direction: column; gap: 2px; padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-color); border-left: 2px solid var(--color-primary-600); border-radius: var(--radius-md);
  transition: border-color var(--transition-fast);
}
.ct-info-row:hover { border-color: var(--color-gray-300); border-left-color: var(--color-primary-600); }
.ct-info-row__label { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-accent-600); }
.ct-info-row__value { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.3; }
.ct-info-row__sub { font-size: var(--font-size-xs); color: var(--text-tertiary); line-height: 1.3; }
.ct-map-card__map { position: relative; flex: 1; min-height: 340px; }
.ct-map-card__iframe { display: block; width: 100%; height: 100%; min-height: 340px; border: none; }

/* Responsive */
@media (max-width: 900px) {
  .ct-bottom-section__inner { grid-template-columns: 1fr; }
  .ct-cards-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .ct-hero { padding: var(--space-16) 0 var(--space-10); }
  .ct-hero__layout { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .ct-hero__desc { max-width: 100%; }
  .ct-cards-grid { grid-template-columns: 1fr 1fr; }
  .ct-map-card__info { grid-template-columns: 1fr; }
  .ct-bottom-section { padding-bottom: var(--space-16); }
}
@media (max-width: 480px) {
  .ct-hero { padding: var(--space-12) 0 var(--space-8); }
  .ct-form-card__header, .ct-form-card__body { padding: var(--space-6); }
}
      `}</style>
    </>
  );
}
