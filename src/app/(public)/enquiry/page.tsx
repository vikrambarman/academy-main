"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONTACT_METHODS = ["Phone", "WhatsApp"];

export default function EnquiryPage() {
    const [courses, setCourses] = useState<any[]>([]);
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
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/public/courses");
                const result = await res.json();
                setCourses(result.data || []);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        };
        fetchCourses();
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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .eq-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                }

                /* ── Hero ── */
                .eq-hero {
                    padding: 88px 24px 64px;
                    position: relative;
                    overflow: hidden;
                }

                .eq-hero-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 420px; height: 420px;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                .eq-hero-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .eq-eyebrow {
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

                .eq-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 1.5px;
                    background: #d97706;
                }

                .eq-hero-layout {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                }

                .eq-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.15;
                }

                .eq-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .eq-hero-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    max-width: 340px;
                    padding-bottom: 4px;
                }

                /* ── Body ── */
                .eq-body {
                    padding: 0 24px 88px;
                    position: relative;
                }

                .eq-body::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .eq-body-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding-top: 52px;
                    display: grid;
                    grid-template-columns: 1fr 360px;
                    gap: 20px;
                    align-items: start;
                }

                /* ── Form card ── */
                .eq-form-card {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 24px;
                    overflow: hidden;
                }

                .eq-form-header {
                    background: #1a1208;
                    padding: 32px 36px 28px;
                    position: relative;
                    overflow: hidden;
                }

                .eq-form-header::before {
                    content: '';
                    position: absolute;
                    bottom: -16px; right: -16px;
                    width: 110px; height: 110px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.12) 1.5px, transparent 1.5px);
                    background-size: 11px 11px;
                    pointer-events: none;
                }

                .eq-form-header-label {
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

                .eq-form-header-label::before {
                    content: '';
                    display: inline-block;
                    width: 14px; height: 1.5px;
                    background: #fcd34d;
                }

                .eq-form-header-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.25;
                    position: relative;
                    z-index: 1;
                }

                .eq-form-header-sub {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    margin-top: 6px;
                    line-height: 1.6;
                    position: relative;
                    z-index: 1;
                }

                .eq-form-body {
                    padding: 32px 36px 36px;
                }

                /* Grid layout */
                .eq-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                }

                .eq-span-2 { grid-column: 1 / -1; }

                /* Field */
                .eq-field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .eq-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #92826b;
                }

                .eq-input,
                .eq-select,
                .eq-textarea {
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
                    appearance: none;
                    -webkit-appearance: none;
                }

                .eq-input::placeholder,
                .eq-textarea::placeholder { color: #b8a898; }

                .eq-input:focus,
                .eq-select:focus,
                .eq-textarea:focus {
                    border-color: #d97706;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(217,119,6,0.08);
                }

                /* Custom select wrapper */
                .eq-select-wrap {
                    position: relative;
                }

                .eq-select-wrap::after {
                    content: '▾';
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 0.7rem;
                    color: #92826b;
                    pointer-events: none;
                }

                .eq-textarea {
                    resize: vertical;
                    min-height: 100px;
                }

                /* Contact method tabs */
                .eq-method-tabs {
                    display: flex;
                    gap: 8px;
                }

                .eq-method-tab {
                    flex: 1;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 400;
                    color: #6b5e4b;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 10px;
                    padding: 10px 16px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.18s;
                }

                .eq-method-tab:hover {
                    border-color: #d97706;
                    color: #1a1208;
                }

                .eq-method-tab.active {
                    background: #1a1208;
                    border-color: #1a1208;
                    color: #fef3c7;
                    font-weight: 500;
                }

                /* Submit */
                .eq-submit {
                    width: 100%;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    border: none;
                    border-radius: 12px;
                    padding: 15px;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 4px;
                }

                .eq-submit:hover:not(:disabled) {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                .eq-submit:disabled { opacity: 0.6; cursor: not-allowed; }

                /* Alerts */
                .eq-alert {
                    border-radius: 12px;
                    padding: 13px 18px;
                    font-size: 0.82rem;
                    font-weight: 300;
                    line-height: 1.65;
                    margin-bottom: 20px;
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                }

                .eq-alert-success {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                }

                .eq-alert-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                }

                /* ── Side info card ── */
                .eq-info-card {
                    background: #1a1208;
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                }

                .eq-info-glow {
                    position: absolute;
                    top: -40px; right: -40px;
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 65%);
                    pointer-events: none;
                }

                .eq-info-dots {
                    position: absolute;
                    bottom: -8px; left: -8px;
                    width: 110px; height: 110px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.1) 1.5px, transparent 1.5px);
                    background-size: 11px 11px;
                    pointer-events: none;
                }

                .eq-info-header {
                    padding: 28px 28px 24px;
                    border-bottom: 1px solid rgba(252,211,77,0.08);
                    position: relative;
                    z-index: 1;
                }

                .eq-info-label {
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

                .eq-info-label::before {
                    content: '';
                    display: inline-block;
                    width: 12px; height: 1.5px;
                    background: #fcd34d;
                }

                .eq-info-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.25;
                }

                /* Process steps */
                .eq-steps {
                    padding: 20px 28px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    background: rgba(252,211,77,0.06);
                    position: relative;
                    z-index: 1;
                }

                .eq-step {
                    background: rgba(255,255,255,0.02);
                    padding: 16px 0;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border-bottom: 1px solid rgba(252,211,77,0.06);
                    transition: background 0.18s;
                }

                .eq-step:last-child { border-bottom: none; }

                .eq-step-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #1a1208;
                    background: #fcd34d;
                    width: 22px; height: 22px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .eq-step-title {
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #fef3c7;
                    margin-bottom: 3px;
                    line-height: 1.3;
                }

                .eq-step-desc {
                    font-size: 0.74rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.38);
                    line-height: 1.5;
                }

                /* Contact links */
                .eq-contact-strip {
                    padding: 20px 28px 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    position: relative;
                    z-index: 1;
                    border-top: 1px solid rgba(252,211,77,0.08);
                }

                .eq-contact-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(252,211,77,0.1);
                    border-radius: 12px;
                    transition: background 0.18s, border-color 0.18s;
                }

                .eq-contact-link:hover {
                    background: rgba(252,211,77,0.08);
                    border-color: rgba(252,211,77,0.2);
                }

                .eq-contact-icon {
                    font-size: 0.9rem;
                    flex-shrink: 0;
                    width: 28px;
                    text-align: center;
                }

                .eq-contact-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: rgba(252,211,77,0.5);
                    margin-bottom: 2px;
                }

                .eq-contact-value {
                    font-size: 0.8rem;
                    font-weight: 400;
                    color: rgba(254,243,199,0.7);
                }

                /* ── Responsive ── */
                @media (max-width: 960px) {
                    .eq-body-inner { grid-template-columns: 1fr; }
                    .eq-info-card { display: grid; grid-template-columns: 1fr 1fr; }
                    .eq-info-header { grid-column: 1 / -1; }
                }

                @media (max-width: 640px) {
                    .eq-hero { padding: 64px 20px 52px; }
                    .eq-body { padding: 0 20px 64px; }
                    .eq-hero-layout { flex-direction: column; align-items: flex-start; gap: 12px; }
                    .eq-form-grid { grid-template-columns: 1fr; }
                    .eq-span-2 { grid-column: 1; }
                    .eq-form-header { padding: 24px 24px 20px; }
                    .eq-form-body { padding: 24px 24px 28px; }
                    .eq-info-card { display: block; }
                }
            `}</style>

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

                {/* Hero */}
                <div className="eq-hero">
                    <div className="eq-hero-glow" aria-hidden="true" />
                    <div className="eq-hero-inner">
                        <div className="eq-eyebrow">Admissions Open</div>
                        <div className="eq-hero-layout">
                            <h1 className="eq-title">
                                Course <em>Enquiry</em><br />
                                in Ambikapur
                            </h1>
                            <p className="eq-hero-desc">
                                Submit your enquiry and our admission team
                                will contact you within 24 hours.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="eq-body">
                    <div className="eq-body-inner">

                        {/* Form */}
                        <div className="eq-form-card">
                            <div className="eq-form-header">
                                <div className="eq-form-header-label">Admission Enquiry</div>
                                <div className="eq-form-header-title">
                                    Tell Us About Yourself
                                </div>
                                <div className="eq-form-header-sub">
                                    Fill in the form and we&apos;ll get back to you shortly.
                                </div>
                            </div>

                            <div className="eq-form-body">
                                {success && (
                                    <div className="eq-alert eq-alert-success" role="alert">
                                        <span aria-hidden="true">✓</span>
                                        <span>
                                            Thank you! Your enquiry has been submitted.
                                            Our team will contact you within 24 hours.
                                        </span>
                                    </div>
                                )}
                                {error && (
                                    <div className="eq-alert eq-alert-error" role="alert">
                                        <span aria-hidden="true">✕</span>
                                        <span>
                                            Something went wrong. Please try again or call us directly.
                                        </span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="eq-form-grid">

                                    <div className="eq-field">
                                        <label className="eq-label" htmlFor="eq-name">Full Name</label>
                                        <input
                                            id="eq-name"
                                            type="text"
                                            required
                                            placeholder="Your full name"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="eq-input"
                                        />
                                    </div>

                                    <div className="eq-field">
                                        <label className="eq-label" htmlFor="eq-mobile">Mobile Number</label>
                                        <input
                                            id="eq-mobile"
                                            type="tel"
                                            required
                                            placeholder="+91 XXXXX XXXXX"
                                            value={form.mobile}
                                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                            className="eq-input"
                                        />
                                    </div>

                                    <div className="eq-field">
                                        <label className="eq-label" htmlFor="eq-course">Course Interested In</label>
                                        <div className="eq-select-wrap">
                                            <select
                                                id="eq-course"
                                                required
                                                value={form.course}
                                                onChange={(e) => setForm({ ...form, course: e.target.value })}
                                                className="eq-select"
                                            >
                                                <option value="">Select a course</option>
                                                {courses.map((course) => (
                                                    <option key={course._id} value={course.name}>
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="eq-field">
                                        <label className="eq-label">Preferred Contact Method</label>
                                        <div className="eq-method-tabs" role="group" aria-label="Contact method">
                                            {CONTACT_METHODS.map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    className={`eq-method-tab ${form.contactMethod === method ? "active" : ""}`}
                                                    onClick={() => setForm({ ...form, contactMethod: method })}
                                                    aria-pressed={form.contactMethod === method}
                                                >
                                                    {method === "WhatsApp" ? "💬 " : "📞 "}{method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="eq-field eq-span-2">
                                        <label className="eq-label" htmlFor="eq-message">Message (Optional)</label>
                                        <textarea
                                            id="eq-message"
                                            placeholder="Any questions or specific requirements..."
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className="eq-textarea"
                                        />
                                    </div>

                                    <div className="eq-span-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="eq-submit"
                                        >
                                            {loading
                                                ? "Submitting..."
                                                : <>Submit Enquiry <span aria-hidden="true">→</span></>
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Side info */}
                        <div className="eq-info-card">
                            <div className="eq-info-glow" aria-hidden="true" />
                            <div className="eq-info-dots" aria-hidden="true" />

                            <div className="eq-info-header">
                                <div className="eq-info-label">What Happens Next</div>
                                <div className="eq-info-title">
                                    Our Admission Process
                                </div>
                            </div>

                            <div className="eq-steps">
                                {[
                                    { num: "1", title: "Submit Enquiry", desc: "Fill the form with your details and preferred course." },
                                    { num: "2", title: "Team Contacts You", desc: "We reach out within 24 hours on your preferred channel." },
                                    { num: "3", title: "Visit the Academy", desc: "Come in for a demo session or direct admission." },
                                    { num: "4", title: "Enroll & Begin", desc: "Complete admission formalities and start learning." },
                                ].map((step) => (
                                    <div key={step.num} className="eq-step">
                                        <div className="eq-step-num" aria-hidden="true">{step.num}</div>
                                        <div>
                                            <div className="eq-step-title">{step.title}</div>
                                            <div className="eq-step-desc">{step.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="eq-contact-strip">
                                <a href="tel:+917477036832" className="eq-contact-link">
                                    <span className="eq-contact-icon">📞</span>
                                    <div>
                                        <div className="eq-contact-label">Call Us</div>
                                        <div className="eq-contact-value">+91 74770 36832</div>
                                    </div>
                                </a>
                                <a
                                    href="https://wa.me/919009087883"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="eq-contact-link"
                                >
                                    <span className="eq-contact-icon">💬</span>
                                    <div>
                                        <div className="eq-contact-label">WhatsApp</div>
                                        <div className="eq-contact-value">+91 90090 87883</div>
                                    </div>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}