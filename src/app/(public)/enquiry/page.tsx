"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/* ─── Data ───────────────────────────────────────────────────────── */

const CONTACT_METHODS = ["Phone", "WhatsApp"];

const admissionSteps = [
    { num: "1", title: "Submit Enquiry",    desc: "Fill the form with your details and preferred course."       },
    { num: "2", title: "Team Contacts You", desc: "We reach out within 24 hours on your preferred channel."     },
    { num: "3", title: "Visit the Academy", desc: "Come in for a demo session or direct admission."             },
    { num: "4", title: "Enroll & Begin",    desc: "Complete admission formalities and start learning."          },
];

const contactLinks = [
    { href: "tel:+917477036832",          label: "Call Us",   value: "+91 74770 36832",  external: false, type: "phone"    },
    { href: "https://wa.me/919009087883", label: "WhatsApp",  value: "+91 90090 87883",  external: true,  type: "whatsapp" },
];

/* ─── Icons ─────────────────────────────────────────────────────── */

const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const SendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const iconMap: Record<string, React.ReactNode> = {
    phone:    <PhoneIcon />,
    whatsapp: <WhatsAppIcon />,
};

/* ─── Page ───────────────────────────────────────────────────────── */

export default function EnquiryPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError]     = useState(false);
    const [form, setForm]       = useState({
        name: "", mobile: "", course: "",
        contactMethod: "Phone", message: "",
    });

    useEffect(() => {
        fetch("/api/public/courses")
            .then((r) => r.json())
            .then((result) => setCourses(result.data || []))
            .catch((err) => console.error("Failed to fetch courses:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/public/enquiry", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(form),
            });
            if (res.ok) {
                setSuccess(true);
                setForm({
                    name: "", mobile: "", course: "",
                    contactMethod: "Phone", message: "",
                });
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

            <main className="eq-root">

                {/* ════════════ HERO ════════════ */}
                <section
                    className="eq-hero home-section"
                    aria-labelledby="enquiry-hero-heading"
                >
                    <div className="eq-hero__glow eq-hero__glow--1" aria-hidden="true" />
                    <div className="eq-hero__glow eq-hero__glow--2" aria-hidden="true" />

                    <div className="container container-xl eq-hero__inner">
                        {/* Eyebrow */}
                        <div className="eq-hero__eyebrow">
                            <span className="eq-hero__eyebrow-line" aria-hidden="true" />
                            Admissions Open
                        </div>

                        {/* Split layout */}
                        <div className="eq-hero__layout">
                            <h1
                                id="enquiry-hero-heading"
                                className="eq-hero__title"
                            >
                                Course{" "}
                                <em className="eq-hero__title-em">Enquiry</em>
                                <br />
                                in Ambikapur
                            </h1>
                            <p className="eq-hero__desc">
                                Submit your enquiry and our admission team
                                will contact you within 24 hours.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ════════════ BODY ════════════ */}
                <section className="eq-body" aria-label="Enquiry form">
                    <div className="eq-body__divider" aria-hidden="true" />

                    <div className="container container-xl eq-body__inner">

                        {/* ── Form Card ── */}
                        <div className="eq-form-card">

                            {/* Dark header */}
                            <div className="eq-form-card__header">
                                <div
                                    className="eq-form-card__header-dots"
                                    aria-hidden="true"
                                />
                                <div className="eq-form-card__header-eyebrow">
                                    <span className="eq-form-card__header-eyebrow-line" />
                                    Admission Enquiry
                                </div>
                                <div className="eq-form-card__header-title">
                                    Tell Us About Yourself
                                </div>
                                <div className="eq-form-card__header-sub">
                                    Fill in the form and we&apos;ll get back
                                    to you shortly.
                                </div>
                            </div>

                            {/* Form body */}
                            <div className="eq-form-card__body">

                                {/* Success */}
                                {success && (
                                    <div
                                        role="alert"
                                        className="eq-alert eq-alert--success"
                                    >
                                        <span aria-hidden="true">✓</span>
                                        <span>
                                            Thank you! Your enquiry has been
                                            submitted. Our team will contact
                                            you within 24 hours.
                                        </span>
                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div
                                        role="alert"
                                        className="eq-alert eq-alert--error"
                                    >
                                        <span aria-hidden="true">✕</span>
                                        <span>
                                            Something went wrong. Please try
                                            again or call us directly.
                                        </span>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="eq-form"
                                >
                                    {/* Full Name */}
                                    <div className="form-group">
                                        <label
                                            htmlFor="eq-name"
                                            className="eq-form__label"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            id="eq-name"
                                            type="text"
                                            required
                                            placeholder="Your full name"
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm({ ...form, name: e.target.value })
                                            }
                                            className="eq-form__input"
                                        />
                                    </div>

                                    {/* Mobile */}
                                    <div className="form-group">
                                        <label
                                            htmlFor="eq-mobile"
                                            className="eq-form__label"
                                        >
                                            Mobile Number
                                        </label>
                                        <input
                                            id="eq-mobile"
                                            type="tel"
                                            required
                                            placeholder="+91 XXXXX XXXXX"
                                            value={form.mobile}
                                            onChange={(e) =>
                                                setForm({ ...form, mobile: e.target.value })
                                            }
                                            className="eq-form__input"
                                        />
                                    </div>

                                    {/* Course select */}
                                    <div className="form-group">
                                        <label
                                            htmlFor="eq-course"
                                            className="eq-form__label"
                                        >
                                            Course Interested In
                                        </label>
                                        <div className="eq-select-wrap">
                                            <select
                                                id="eq-course"
                                                required
                                                value={form.course}
                                                onChange={(e) =>
                                                    setForm({ ...form, course: e.target.value })
                                                }
                                                className="eq-form__select"
                                            >
                                                <option value="">
                                                    Select a course
                                                </option>
                                                {courses.map((course) => (
                                                    <option
                                                        key={course._id}
                                                        value={course.name}
                                                    >
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <span
                                                className="eq-select-wrap__chevron"
                                                aria-hidden="true"
                                            >
                                                <ChevronDownIcon />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contact method */}
                                    <div className="form-group">
                                        <span className="eq-form__label">
                                            Preferred Contact Method
                                        </span>
                                        <div
                                            className="eq-method-group"
                                            role="group"
                                            aria-label="Contact method"
                                        >
                                            {CONTACT_METHODS.map((method) => {
                                                const active =
                                                    form.contactMethod ===
                                                    method;
                                                return (
                                                    <button
                                                        key={method}
                                                        type="button"
                                                        aria-pressed={active}
                                                        onClick={() =>
                                                            setForm({
                                                                ...form,
                                                                contactMethod: method,
                                                            })
                                                        }
                                                        className={
                                                            active
                                                                ? "eq-method-btn eq-method-btn--active"
                                                                : "eq-method-btn"
                                                        }
                                                    >
                                                        <span className="eq-method-btn__icon">
                                                            {iconMap[
                                                                method === "WhatsApp"
                                                                    ? "whatsapp"
                                                                    : "phone"
                                                            ]}
                                                        </span>
                                                        {method}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Message — full width */}
                                    <div className="form-group eq-form__full">
                                        <label
                                            htmlFor="eq-message"
                                            className="eq-form__label"
                                        >
                                            Message{" "}
                                            <span className="eq-form__label-opt">
                                                (Optional)
                                            </span>
                                        </label>
                                        <textarea
                                            id="eq-message"
                                            placeholder="Any questions or specific requirements..."
                                            value={form.message}
                                            onChange={(e) =>
                                                setForm({ ...form, message: e.target.value })
                                            }
                                            className="eq-form__textarea"
                                        />
                                    </div>

                                    {/* Submit — full width */}
                                    <div className="eq-form__full">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="eq-form__submit"
                                        >
                                            {loading ? (
                                                "Submitting…"
                                            ) : (
                                                <>
                                                    <SendIcon />
                                                    Submit Enquiry
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* ── Side Info Card ── */}
                        <aside className="eq-side-card">
                            {/* Glows */}
                            <div
                                className="eq-side-card__glow eq-side-card__glow--1"
                                aria-hidden="true"
                            />
                            <div
                                className="eq-side-card__glow eq-side-card__glow--dots"
                                aria-hidden="true"
                            />

                            {/* Header */}
                            <div className="eq-side-card__header">
                                <div className="eq-side-card__eyebrow">
                                    <span className="eq-side-card__eyebrow-line" />
                                    What Happens Next
                                </div>
                                <div className="eq-side-card__title">
                                    Our Admission Process
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="eq-steps">
                                {admissionSteps.map((step, i) => (
                                    <div key={step.num} className="eq-step">
                                        <div
                                            className="eq-step__num"
                                            aria-hidden="true"
                                        >
                                            {step.num}
                                        </div>
                                        <div>
                                            <div className="eq-step__title">
                                                {step.title}
                                            </div>
                                            <div className="eq-step__desc">
                                                {step.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact links */}
                            <div className="eq-contact-links">
                                {contactLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target={
                                            link.external ? "_blank" : undefined
                                        }
                                        rel={
                                            link.external
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                        className="eq-contact-link"
                                    >
                                        <span className="eq-contact-link__icon">
                                            {iconMap[link.type]}
                                        </span>
                                        <div>
                                            <div className="eq-contact-link__label">
                                                {link.label}
                                            </div>
                                            <div className="eq-contact-link__value">
                                                {link.value}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            {/* ════════════ PAGE-SCOPED CSS ════════════ */}
            <style>{`

/* ══════════════════════════════════════════
   ENQUIRY PAGE  —  page-scoped styles
   Follows: variables.css + components.css
   ══════════════════════════════════════════ */

/* ── Root ───────────────────────────────── */
.eq-root {
  background-color: var(--bg-page);
  min-height: 100vh;
}

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
.eq-hero {
  position: relative;
  padding: var(--space-24) 0 var(--space-16);
  overflow: hidden;
  background: linear-gradient(
    160deg,
    var(--color-primary-200) 0%,
    var(--color-white) 60%,
    var(--color-primary-400) 100%
  );
}
.eq-hero__glow {
  position: absolute;
  border-radius: var(--radius-full);
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.30;
}
.eq-hero__glow--1 {
  width: 460px;
  height: 460px;
  background: var(--color-primary-200);
  top: -190px;
  right: -130px;
}
.eq-hero__glow--2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent-200);
  bottom: -80px;
  left: -80px;
}
.eq-hero__inner {
  position: relative;
  z-index: 2;
}

/* Eyebrow */
.eq-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary-600);
  margin-bottom: var(--space-4);
}
.eq-hero__eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Layout */
.eq-hero__layout {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-10);
  flex-wrap: wrap;
}
.eq-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0;
}
.eq-hero__title-em {
  font-style: italic;
  background: linear-gradient(
    135deg,
    var(--color-primary-600),
    var(--color-accent-500)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.eq-hero__desc {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  max-width: 360px;
  margin: 0;
  padding-bottom: var(--space-1);
}

/* ══════════════════════════════════════════
   BODY
   ══════════════════════════════════════════ */
.eq-body {
  position: relative;
  padding-bottom: var(--space-24);
}
.eq-body__divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-color),
    transparent
  );
  margin: 0 10%;
}
.eq-body__inner {
  padding-top: var(--space-12);
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--space-5);
  align-items: start;
}

/* ══════════════════════════════════════════
   FORM CARD
   ══════════════════════════════════════════ */
.eq-form-card {
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

/* Dark header */
.eq-form-card__header {
  position: relative;
  overflow: hidden;
  padding: var(--space-8) var(--space-8) var(--space-6);
  background: linear-gradient(
    135deg,
    var(--color-gray-800) 0%,
    var(--color-gray-900) 100%
  );
  border-bottom: 1px solid var(--color-gray-700);
}
.eq-form-card__header-dots {
  position: absolute;
  bottom: -16px;
  right: -16px;
  width: 112px;
  height: 112px;
  background-image: radial-gradient(
    circle,
    rgba(251, 146, 60, 0.18) 1.5px,
    transparent 1.5px
  );
  background-size: 11px 11px;
  pointer-events: none;
}
.eq-form-card__header-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent-400);
  margin-bottom: var(--space-3);
  position: relative;
  z-index: 1;
}
.eq-form-card__header-eyebrow-line {
  display: inline-block;
  width: 14px;
  height: 1.5px;
  background: var(--color-accent-400);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.eq-form-card__header-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
  position: relative;
  z-index: 1;
  margin-bottom: var(--space-2);
}
.eq-form-card__header-sub {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: rgba(255, 255, 255, 0.45);
  line-height: var(--line-height-relaxed);
  position: relative;
  z-index: 1;
}

/* Form body */
.eq-form-card__body {
  padding: var(--space-8);
  background: var(--bg-elevated);
}

/* ── Alerts ─────────────────────────────── */
.eq-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-relaxed);
}
.eq-alert--success {
  background: var(--color-success-light);
  border: 1px solid var(--color-success);
  color: var(--color-success-dark);
}
.eq-alert--error {
  background: var(--color-danger-light);
  border: 1px solid var(--color-danger);
  color: var(--color-danger-dark);
}

/* ── Form grid ──────────────────────────── */
.eq-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.eq-form__full {
  grid-column: 1 / -1;
}

/* Label */
.eq-form__label {
  display: block;
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}
.eq-form__label-opt {
  font-weight: var(--font-weight-normal);
  opacity: 0.65;
  text-transform: none;
  letter-spacing: 0;
}

/* Input */
.eq-form__input,
.eq-form__select,
.eq-form__textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  font-family: var(--font-sans);
  color: var(--text-primary);
  background: var(--bg-page);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  appearance: none;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}
.eq-form__input:focus,
.eq-form__select:focus,
.eq-form__textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
  background: var(--bg-elevated);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
}
.eq-form__input::placeholder,
.eq-form__textarea::placeholder {
  color: var(--color-gray-400);
}
.eq-form__textarea {
  min-height: 100px;
  resize: vertical;
}

/* Select wrapper */
.eq-select-wrap {
  position: relative;
}
.eq-select-wrap__chevron {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  display: flex;
  align-items: center;
}

/* ── Contact method tabs ────────────────── */
.eq-method-group {
  display: flex;
  gap: var(--space-2);
}
.eq-method-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  font-family: var(--font-sans);
  color: var(--text-tertiary);
  background: var(--bg-page);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}
.eq-method-btn:hover {
  border-color: var(--color-primary-300);
  color: var(--text-primary);
}
.eq-method-btn--active {
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  background: var(--color-gray-900);
  border-color: var(--color-gray-900);
}
.eq-method-btn--active:hover {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: var(--color-white);
}
.eq-method-btn__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* Submit button */
.eq-form__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-sans);
  color: var(--color-white);
  background: var(--color-gray-900);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}
.eq-form__submit:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.eq-form__submit:disabled {
  opacity: 0.60;
  cursor: not-allowed;
}

/* ══════════════════════════════════════════
   SIDE INFO CARD
   ══════════════════════════════════════════ */
.eq-side-card {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: linear-gradient(
    160deg,
    var(--color-gray-800) 0%,
    var(--color-gray-900) 100%
  );
  border: 1px solid var(--color-gray-700);
}

/* Decorations */
.eq-side-card__glow {
  position: absolute;
  pointer-events: none;
}
.eq-side-card__glow--1 {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-full);
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.18) 0%,
    transparent 65%
  );
  top: -60px;
  right: -60px;
}
.eq-side-card__glow--dots {
  bottom: -8px;
  left: -8px;
  width: 110px;
  height: 110px;
  background-image: radial-gradient(
    circle,
    rgba(251, 146, 60, 0.14) 1.5px,
    transparent 1.5px
  );
  background-size: 11px 11px;
}

/* Header */
.eq-side-card__header {
  position: relative;
  z-index: 2;
  padding: var(--space-6) var(--space-6) var(--space-5);
  border-bottom: 1px solid rgba(251, 146, 60, 0.10);
}
.eq-side-card__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent-400);
  margin-bottom: var(--space-3);
}
.eq-side-card__eyebrow-line {
  display: inline-block;
  width: 12px;
  height: 1.5px;
  background: var(--color-accent-400);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.eq-side-card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  line-height: var(--line-height-tight);
}

/* Steps */
.eq-steps {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: var(--space-2) var(--space-6);
  border-bottom: 1px solid rgba(251, 146, 60, 0.08);
}
.eq-step {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  border-bottom: 1px solid rgba(251, 146, 60, 0.07);
}
.eq-step:last-child {
  border-bottom: none;
}
.eq-step__num {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  font-family: var(--font-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  background: var(--color-warning);
  color: var(--color-gray-900);
}
.eq-step__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  line-height: var(--line-height-tight);
  margin-bottom: 3px;
}
.eq-step__desc {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: rgba(255, 255, 255, 0.42);
  line-height: var(--line-height-relaxed);
}

/* Contact links */
.eq-contact-links {
  position: relative;
  z-index: 2;
  padding: var(--space-5) var(--space-6) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.eq-contact-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(251, 146, 60, 0.12);
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}
.eq-contact-link:hover {
  background: rgba(251, 146, 60, 0.10);
  border-color: rgba(251, 146, 60, 0.28);
}
.eq-contact-link__icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-300);
  flex-shrink: 0;
}
.eq-contact-link__label {
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(251, 146, 60, 0.60);
  margin-bottom: 2px;
}
.eq-contact-link__value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: rgba(255, 255, 255, 0.72);
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */

/* Tablet */
@media (max-width: 900px) {
  .eq-body__inner {
    grid-template-columns: 1fr;
  }
  .eq-side-card {
    order: -1;
  }
  .eq-steps {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .eq-hero {
    padding: var(--space-16) 0 var(--space-12);
  }
  .eq-hero__layout {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  .eq-hero__desc {
    max-width: 100%;
  }
  .eq-form {
    grid-template-columns: 1fr;
  }
  .eq-form__full {
    grid-column: 1;
  }
  .eq-steps {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .eq-hero {
    padding: var(--space-12) 0 var(--space-10);
  }
  .eq-body {
    padding-bottom: var(--space-16);
  }
  .eq-form-card__header,
  .eq-form-card__body {
    padding: var(--space-6);
  }
}

      `}</style>
        </>
    );
}