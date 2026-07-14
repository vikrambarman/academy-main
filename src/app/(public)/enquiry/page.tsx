"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/* ─── Data (unchanged) ─── */
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
        <section className="eq-hero" aria-labelledby="enquiry-hero-heading">
          <div className="container eq-hero__inner">
            <div className="eq-hero__eyebrow">
              <span className="eq-hero__eyebrow-line" aria-hidden="true" />
              Admissions Open
            </div>
            <div className="eq-hero__layout">
              <h1 id="enquiry-hero-heading" className="eq-hero__title">
                Course{" "}
                <em className="eq-hero__title-em">Enquiry</em>{" "}
                in Ambikapur
              </h1>
              <p className="eq-hero__desc">
                Submit your enquiry and our admission team will contact you
                within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <section className="eq-body" aria-label="Enquiry form and admission info">
          <div className="container eq-body__inner">

            {/* ── Form Card ── */}
            <div className="eq-form-card">
              <div className="eq-form-card__header">
                <div className="eq-form-card__header-eyebrow">
                  <span className="eq-form-card__header-eyebrow-line" aria-hidden="true" />
                  Admission Enquiry
                </div>
                <div className="eq-form-card__header-title">
                  Tell Us About Yourself
                </div>
                <div className="eq-form-card__header-sub">
                  Fill in the form and we&apos;ll get back to you shortly.
                </div>
              </div>

              <div className="eq-form-card__body">
                {success && (
                  <div role="alert" className="eq-alert eq-alert--success">
                    <span aria-hidden="true">✓</span>
                    <span>
                      Thank you! Your enquiry has been submitted. Our team
                      will contact you within 24 hours.
                    </span>
                  </div>
                )}

                {error && (
                  <div role="alert" className="eq-alert eq-alert--error">
                    <span aria-hidden="true">✕</span>
                    <span>
                      Something went wrong. Please try again or call us
                      directly.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="eq-form">
                  {/* Full Name */}
                  <div className="form-group">
                    <label htmlFor="eq-name" className="eq-form__label">
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
                    <label htmlFor="eq-mobile" className="eq-form__label">
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

                  {/* Course Select */}
                  <div className="form-group">
                    <label htmlFor="eq-course" className="eq-form__label">
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
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                          <option key={course._id} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                        <option value="University Degree (BCA/BA/B.Com/BSc/MSc/MBA)">
                          University Degree (BCA / BA / B.Com / BSc / MSc / MBA)
                        </option>
                      </select>
                      <span
                        className="eq-select-wrap__chevron"
                        aria-hidden="true"
                      >
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>

                  {/* Contact Method */}
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
                        const active = form.contactMethod === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              setForm({ ...form, contactMethod: method })
                            }
                            className={
                              active
                                ? "eq-method-btn eq-method-btn--active"
                                : "eq-method-btn"
                            }
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

                  {/* Message */}
                  <div className="form-group eq-form__full">
                    <label htmlFor="eq-message" className="eq-form__label">
                      Message
                      <span className="eq-form__label-opt">(Optional)</span>
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

                  {/* Submit */}
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
            <aside className="eq-side-card" aria-label="Admission process">
              <div className="eq-side-card__header">
                <div className="eq-side-card__eyebrow">
                  <span className="eq-side-card__eyebrow-line" aria-hidden="true" />
                  What Happens Next
                </div>
                <div className="eq-side-card__title">
                  Our Admission Process
                </div>
              </div>

              <div className="eq-steps">
                {admissionSteps.map((step) => (
                  <div key={step.num} className="eq-step">
                    <div className="eq-step__num" aria-hidden="true">
                      {step.num}
                    </div>
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
    </>
  );
}