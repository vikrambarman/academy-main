"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/* ─── Data (unchanged from your original) ─── */
const CONTACT_METHODS = ["Phone", "WhatsApp"];

const admissionSteps = [
  { num: "1", title: "Submit Enquiry", desc: "Fill the form with your details and preferred course." },
  { num: "2", title: "Team Contacts You", desc: "We reach out within 24 hours on your preferred channel." },
  { num: "3", title: "Visit the Academy", desc: "Come in for a demo session or direct admission." },
  { num: "4", title: "Enroll & Begin", desc: "Complete admission formalities and start learning." },
];

const contactLinks = [
  { href: "tel:+917477036832", label: "Call Us", value: "+91 74770 36832", external: false, type: "phone" },
  { href: "https://wa.me/919009087883", label: "WhatsApp", value: "+91 90090 87883", external: true, type: "whatsapp" },
];

/* ─── Icons ─── */
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const iconMap: Record<string, React.ReactNode> = {
  phone: <PhoneIcon />,
  whatsapp: <WhatsAppIcon />,
};

type Course = { _id: string; name: string };

export default function EnquiryPage() {
  // ── State & logic: UNCHANGED from your original (backend intact) ──
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    course: "",
    contactMethod: "Phone",
    message: "",
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", mobile: "", course: "", contactMethod: "Phone", message: "" });
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
        {/* ── HERO ── */}
        <section className="eq-hero home-section" aria-labelledby="enquiry-hero-heading">
          <div className="container container-xl eq-hero__inner">
            <div className="eq-hero__eyebrow">
              <span className="eq-hero__eyebrow-line" aria-hidden="true" />
              Admissions Open
            </div>
            <div className="eq-hero__layout">
              <h1 id="enquiry-hero-heading" className="eq-hero__title">
                Course <em className="eq-hero__title-em">Enquiry</em> in Ambikapur
              </h1>
              <p className="eq-hero__desc">
                Submit your enquiry and our admission team will contact you within
                24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <section className="eq-body" aria-label="Enquiry form">
          <div className="container container-xl eq-body__inner">
            {/* ── Form Card ── */}
            <div className="eq-form-card">
              <div className="eq-form-card__header">
                <div className="eq-form-card__header-eyebrow">
                  <span className="eq-form-card__header-eyebrow-line" aria-hidden="true" />
                  Admission Enquiry
                </div>
                <div className="eq-form-card__header-title">Tell Us About Yourself</div>
                <div className="eq-form-card__header-sub">
                  Fill in the form and we&apos;ll get back to you shortly.
                </div>
              </div>

              <div className="eq-form-card__body">
                {success && (
                  <div role="alert" className="eq-alert eq-alert--success">
                    <span aria-hidden="true">✓</span>
                    <span>
                      Thank you! Your enquiry has been submitted. Our team will contact
                      you within 24 hours.
                    </span>
                  </div>
                )}

                {error && (
                  <div role="alert" className="eq-alert eq-alert--error">
                    <span aria-hidden="true">✕</span>
                    <span>
                      Something went wrong. Please try again or call us directly.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="eq-form">
                  {/* Full Name */}
                  <div className="form-group">
                    <label htmlFor="eq-name" className="eq-form__label">Full Name</label>
                    <input
                      id="eq-name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="eq-form__input"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="form-group">
                    <label htmlFor="eq-mobile" className="eq-form__label">Mobile Number</label>
                    <input
                      id="eq-mobile"
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="eq-form__input"
                    />
                  </div>

                  {/* Course select */}
                  <div className="form-group">
                    <label htmlFor="eq-course" className="eq-form__label">Course Interested In</label>
                    <div className="eq-select-wrap">
                      <select
                        id="eq-course"
                        required
                        value={form.course}
                        onChange={(e) => setForm({ ...form, course: e.target.value })}
                        className="eq-form__select"
                      >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                          <option key={course._id} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                        {/* University degrees (facilitated via Mangalayatan University) */}
                        <option value="University Degree (BCA/BA/B.Com/BSc/MSc/MBA)">
                          University Degree (BCA / BA / B.Com / BSc / MSc / MBA)
                        </option>
                      </select>
                      <span className="eq-select-wrap__chevron" aria-hidden="true">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>

                  {/* Contact method */}
                  <div className="form-group">
                    <span className="eq-form__label">Preferred Contact Method</span>
                    <div className="eq-method-group" role="group" aria-label="Contact method">
                      {CONTACT_METHODS.map((method) => {
                        const active = form.contactMethod === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setForm({ ...form, contactMethod: method })}
                            className={active ? "eq-method-btn eq-method-btn--active" : "eq-method-btn"}
                          >
                            <span className="eq-method-btn__icon">
                              {iconMap[method === "WhatsApp" ? "whatsapp" : "phone"]}
                            </span>
                            {method}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message — full width */}
                  <div className="form-group eq-form__full">
                    <label htmlFor="eq-message" className="eq-form__label">
                      Message <span className="eq-form__label-opt">(Optional)</span>
                    </label>
                    <textarea
                      id="eq-message"
                      placeholder="Any questions or specific requirements..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="eq-form__textarea"
                    />
                  </div>

                  {/* Submit — full width */}
                  <div className="eq-form__full">
                    <button type="submit" disabled={loading} className="eq-form__submit">
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
              <div className="eq-side-card__header">
                <div className="eq-side-card__eyebrow">
                  <span className="eq-side-card__eyebrow-line" aria-hidden="true" />
                  What Happens Next
                </div>
                <div className="eq-side-card__title">Our Admission Process</div>
              </div>

              <div className="eq-steps">
                {admissionSteps.map((step) => (
                  <div key={step.num} className="eq-step">
                    <div className="eq-step__num" aria-hidden="true">{step.num}</div>
                    <div>
                      <div className="eq-step__title">{step.title}</div>
                      <div className="eq-step__desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="eq-contact-links">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="eq-contact-link"
                  >
                    <span className="eq-contact-link__icon">{iconMap[link.type]}</span>
                    <div>
                      <div className="eq-contact-link__label">{link.label}</div>
                      <div className="eq-contact-link__value">{link.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>

      <style>{`
/* ══════════════════════════════════════════
   ENQUIRY PAGE — Clean University style
   ══════════════════════════════════════════ */
.eq-root { background-color: var(--bg-page); min-height: 100vh; }

/* HERO — plain */
.eq-hero {
  position: relative;
  padding: var(--space-24) 0 var(--space-12);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.eq-hero__inner { position: relative; }
.eq-hero__eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.eq-hero__eyebrow-line { width: 24px; height: 2px; background: var(--color-accent-500); border-radius: 2px; flex-shrink: 0; }
.eq-hero__layout { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-8); flex-wrap: wrap; }
.eq-hero__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.6vw, 2.5rem);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary); line-height: 1.2; letter-spacing: -0.015em; margin: 0;
}
.eq-hero__title-em { font-style: normal; color: var(--color-primary-700); }
.eq-hero__desc { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; max-width: 380px; margin: 0; }

/* BODY */
.eq-body { position: relative; padding-bottom: var(--space-24); }
.eq-body__inner {
  padding-top: var(--space-12);
  display: grid; grid-template-columns: 1fr 360px;
  gap: var(--space-5); align-items: start;
}

/* FORM CARD */
.eq-form-card { border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-color); }
.eq-form-card__header {
  position: relative;
  padding: var(--space-8);
  background: var(--color-primary-700);
}
.eq-form-card__header-eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.85); margin-bottom: var(--space-3);
}
.eq-form-card__header-eyebrow-line { width: 14px; height: 2px; background: rgba(255,255,255,0.6); border-radius: 2px; flex-shrink: 0; }
.eq-form-card__header-title { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.2; margin-bottom: var(--space-2); }
.eq-form-card__header-sub { font-size: var(--font-size-sm); color: rgba(255,255,255,0.75); line-height: 1.6; }
.eq-form-card__body { padding: var(--space-8); background: var(--bg-elevated); }

/* Alerts */
.eq-alert {
  display: flex; align-items: flex-start; gap: var(--space-3);
  border-radius: var(--radius-md); padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-5); font-size: var(--font-size-sm); line-height: 1.6;
}
.eq-alert--success { background: var(--color-success-light); border: 1px solid var(--color-success); color: var(--color-success-dark); }
.eq-alert--error { background: var(--color-danger-light); border: 1px solid var(--color-danger); color: var(--color-danger-dark); }

/* Form grid */
.eq-form { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.eq-form__full { grid-column: 1 / -1; }
.eq-form__label {
  display: block; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);
  color: var(--text-primary); margin-bottom: var(--space-2);
}
.eq-form__label-opt { font-weight: var(--font-weight-normal); color: var(--text-tertiary); }

.eq-form__input, .eq-form__select, .eq-form__textarea {
  width: 100%; padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base); font-family: var(--font-sans);
  color: var(--text-primary); background: var(--bg-elevated);
  border: 1px solid var(--border-color); border-radius: var(--radius-md);
  appearance: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.eq-form__input:focus, .eq-form__select:focus, .eq-form__textarea:focus {
  outline: none; border-color: var(--color-primary-600); box-shadow: 0 0 0 3px var(--color-primary-100);
}
.eq-form__input::placeholder, .eq-form__textarea::placeholder { color: var(--color-gray-400); }
.eq-form__textarea { min-height: 100px; resize: vertical; }

.eq-select-wrap { position: relative; }
.eq-select-wrap__chevron { position: absolute; right: var(--space-4); top: 50%; transform: translateY(-50%); color: var(--text-tertiary); pointer-events: none; display: flex; }

/* Contact method tabs */
.eq-method-group { display: flex; gap: var(--space-2); }
.eq-method-btn {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); font-family: var(--font-sans);
  color: var(--text-secondary); background: var(--bg-elevated);
  border: 1px solid var(--border-color); border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4); cursor: pointer;
  transition: border-color var(--transition-base), color var(--transition-base), background var(--transition-base);
}
.eq-method-btn:hover { border-color: var(--color-gray-300); color: var(--text-primary); }
.eq-method-btn--active { color: #fff; background: var(--color-primary-600); border-color: var(--color-primary-600); }
.eq-method-btn--active:hover { background: var(--color-primary-700); color: #fff; }
.eq-method-btn__icon { display: flex; align-items: center; flex-shrink: 0; }

/* Submit */
.eq-form__submit {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  width: 100%; padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); font-family: var(--font-sans);
  color: #fff; background: var(--color-primary-600);
  border: none; border-radius: var(--radius-md); cursor: pointer;
  transition: background var(--transition-base);
}
.eq-form__submit:hover:not(:disabled) { background: var(--color-primary-700); }
.eq-form__submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* SIDE INFO CARD — solid ink-blue (no dark gradient/glows) */
.eq-side-card {
  position: relative;
  border-radius: var(--radius-lg); overflow: hidden;
  background: var(--color-primary-700);
}
.eq-side-card__header { padding: var(--space-6); border-bottom: 1px solid rgba(255,255,255,0.12); }
.eq-side-card__eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.8); margin-bottom: var(--space-2);
}
.eq-side-card__eyebrow-line { width: 12px; height: 2px; background: rgba(255,255,255,0.5); border-radius: 2px; flex-shrink: 0; }
.eq-side-card__title { font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.2; }

/* Steps */
.eq-steps { display: flex; flex-direction: column; padding: 0 var(--space-6); border-bottom: 1px solid rgba(255,255,255,0.12); }
.eq-step { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-4) 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
.eq-step:last-child { border-bottom: none; }
.eq-step__num {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
  font-family: var(--font-display); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  background: var(--color-accent-500); color: #fff;
}
.eq-step__title { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: #fff; line-height: 1.3; margin-bottom: 3px; }
.eq-step__desc { font-size: var(--font-size-xs); color: rgba(255,255,255,0.65); line-height: 1.5; }

/* Contact links */
.eq-contact-links { padding: var(--space-5) var(--space-6) var(--space-6); display: flex; flex-direction: column; gap: var(--space-3); }
.eq-contact-link {
  display: flex; align-items: center; gap: var(--space-3); text-decoration: none;
  padding: var(--space-3) var(--space-4); border-radius: var(--radius-md);
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14);
  transition: background var(--transition-base), border-color var(--transition-base);
}
.eq-contact-link:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }
.eq-contact-link__icon {
  width: 32px; height: 32px; border-radius: var(--radius-md);
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;
}
.eq-contact-link__label { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 2px; }
.eq-contact-link__value { font-size: var(--font-size-sm); color: rgba(255,255,255,0.9); }

/* RESPONSIVE */
@media (max-width: 900px) {
  .eq-body__inner { grid-template-columns: 1fr; }
  .eq-side-card { order: -1; }
  .eq-steps { display: grid; grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .eq-hero { padding: var(--space-16) 0 var(--space-10); }
  .eq-hero__layout { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .eq-hero__desc { max-width: 100%; }
  .eq-form { grid-template-columns: 1fr; }
  .eq-form__full { grid-column: 1; }
  .eq-steps { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .eq-hero { padding: var(--space-12) 0 var(--space-8); }
  .eq-body { padding-bottom: var(--space-16); }
  .eq-form-card__header, .eq-form-card__body { padding: var(--space-6); }
}
      `}</style>
    </>
  );
}
