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
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const iconMap: Record<string, React.ReactNode> = {
  phone: <PhoneIcon />,
  whatsapp: <WhatsAppIcon />,
  mail: <MailIcon />,
  map: <MapPinIcon />,
};

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
          <div className="container ct-hero__inner">
            <div className="ct-hero__eyebrow">
              <span className="ct-hero__eyebrow-line" aria-hidden="true" />
              Get in Touch
            </div>
            <div className="ct-hero__layout">
              <h1 id="contact-hero-heading" className="ct-hero__title">
                Contact{" "}
                <span className="ct-hero__title-em">Shivshakti</span>{" "}
                Computer Academy
              </h1>
              <p className="ct-hero__desc">
                Reach us for admissions, certifications and course guidance.
                We&apos;re available Mon–Sat, 8AM–6PM.
              </p>
            </div>
          </div>
        </section>

        {/* ── CONTACT CARDS ── */}
        <section className="ct-cards-section" aria-label="Contact options">
          <div className="container">
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
        <section
          className="ct-bottom-section"
          aria-label="Contact form and location"
        >
          <div className="container ct-bottom-section__inner">
            {/* Form Card */}
            <div className="ct-form-card">
              <div className="ct-form-card__header">
                <div className="ct-form-card__header-eyebrow">
                  <span
                    className="ct-form-card__header-eyebrow-line"
                    aria-hidden="true"
                  />
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
                    <span>
                      Thank you! Your message has been sent. We&apos;ll
                      respond shortly.
                    </span>
                  </div>
                )}
                {error && (
                  <div role="alert" className="ct-alert ct-alert--error">
                    <span aria-hidden="true">✕</span>
                    <span>
                      Something went wrong. Please try again or call us
                      directly.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="ct-form">
                  <div className="form-group">
                    <label htmlFor="ct-name" className="ct-form__label">
                      Your Name
                    </label>
                    <input
                      id="ct-name"
                      type="text"
                      placeholder="Full name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="ct-form__input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ct-mobile" className="ct-form__label">
                      Mobile Number
                    </label>
                    <input
                      id="ct-mobile"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      required
                      value={form.mobile}
                      onChange={(e) =>
                        setForm({ ...form, mobile: e.target.value })
                      }
                      className="ct-form__input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ct-message" className="ct-form__label">
                      Message
                    </label>
                    <textarea
                      id="ct-message"
                      placeholder="Ask about courses, admissions, fees..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="ct-form__textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="ct-form__submit"
                  >
                    {loading ? (
                      "Sending…"
                    ) : (
                      <>
                        <SendIcon />
                        Send Message
                      </>
                    )}
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
    </>
  );
}