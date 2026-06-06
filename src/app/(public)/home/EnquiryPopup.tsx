"use client";

import { useEffect, useState } from "react";
import { X, GraduationCap, CheckCircle, Loader2, ChevronDown } from "lucide-react";

/**
 * EnquiryPopup — auto-opening enquiry modal for the home page
 * -------------------------------------------------------------
 * BACKEND-CONNECTED — uses the SAME API + field names as your Enquiry page:
 *   - GET  /api/public/courses   → result.data  (course._id, course.name)
 *   - POST /api/public/enquiry   → body: { name, mobile, course, contactMethod, message }
 *
 * Behaviour:
 *   - Opens ~3.5s after first visit (per browser session).
 *   - Remembers via sessionStorage so it won't nag on every navigation.
 *   - Shows computer courses + UGC university degree info.
 *
 * Usage: add <EnquiryPopup /> in app/(public)/page.tsx (home) or (public)/layout.tsx.
 */

const STORAGE_KEY = "sca_enquiry_popup_seen";
const CONTACT_METHODS = ["Phone", "WhatsApp"];

type Course = { _id: string; name: string };
type Status = "idle" | "submitting" | "success" | "error";

export default function EnquiryPopup() {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    course: "",
    contactMethod: "Phone",
    message: "",
  });

  // Auto-open once per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 3500);
    return () => clearTimeout(t);
  }, []);

  // Fetch courses (same endpoint as Enquiry page) — only when popup opens
  useEffect(() => {
    if (!open || courses.length) return;
    fetch("/api/public/courses")
      .then((r) => r.json())
      .then((result) => setCourses(result.data || []))
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, [open, courses.length]);

  // Lock body scroll + Esc to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
  }

  // SAME submit logic as your Enquiry page
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) {
      setErrorMsg("Please enter your name and mobile number.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/public/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        sessionStorage.setItem(STORAGE_KEY, "1");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again or call us.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or call us.");
    }
  }

  if (!open) return null;

  return (
    <div className="eqp-overlay" role="dialog" aria-modal="true" aria-labelledby="eqp-title">
      <style>{styles}</style>

      <div className="eqp-backdrop" onClick={close} aria-hidden="true" />

      <div className="eqp-modal">
        <button className="eqp-close" onClick={close} aria-label="Close">
          <X size={18} strokeWidth={2} />
        </button>

        <div className="eqp-grid">
          {/* Left: info panel */}
          <aside className="eqp-info">
            <span className="eqp-info-eyebrow">
              <GraduationCap size={14} strokeWidth={2} />
              Admissions Open
            </span>
            <h2 id="eqp-title" className="eqp-info-title">
              Build your career in Ambikapur
            </h2>
            <p className="eqp-info-text">
              From job-oriented computer courses to recognized university degrees — get
              the right guidance for your goals.
            </p>

            <ul className="eqp-info-list">
              <li>
                <CheckCircle size={15} strokeWidth={2} />
                Computer courses — DCA, PGDCA, Tally, Typing
              </li>
              <li>
                <CheckCircle size={15} strokeWidth={2} />
                Programming &amp; Web Development — Python, Java, React
              </li>
              <li>
                <CheckCircle size={15} strokeWidth={2} />
                University degrees — BCA, BA, B.Com, BSc, MSc, MBA
              </li>
              <li>
                <CheckCircle size={15} strokeWidth={2} />
                Online &amp; distance education via Mangalayatan University
              </li>
            </ul>

            <p className="eqp-info-note">
              Degree admissions are facilitated through our university partnership
              (College Vidya).
            </p>
          </aside>

          {/* Right: form */}
          <div className="eqp-form-wrap">
            {status === "success" ? (
              <div className="eqp-success">
                <div className="eqp-success-icon">
                  <CheckCircle size={40} strokeWidth={1.5} />
                </div>
                <h3 className="eqp-success-title">Thank you!</h3>
                <p className="eqp-success-text">
                  Your enquiry has been submitted. Our team will contact you within
                  24 hours.
                </p>
                <button className="eqp-btn eqp-btn-primary" onClick={close}>
                  Continue browsing
                </button>
              </div>
            ) : (
              <form className="eqp-form" onSubmit={handleSubmit}>
                <h3 className="eqp-form-title">Request a callback</h3>
                <p className="eqp-form-sub">
                  Fill this and we&apos;ll get back to you — usually the same day.
                </p>

                <div className="eqp-field">
                  <label htmlFor="eqp-name">Full Name</label>
                  <input
                    id="eqp-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>

                <div className="eqp-field">
                  <label htmlFor="eqp-mobile">Mobile Number</label>
                  <input
                    id="eqp-mobile"
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
                  />
                </div>

                <div className="eqp-field">
                  <label htmlFor="eqp-course">Course Interested In</label>
                  <div className="eqp-select-wrap">
                    <select
                      id="eqp-course"
                      value={form.course}
                      onChange={(e) => setForm({ ...form, course: e.target.value })}
                    >
                      <option value="">Select a course</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                      {/* University degrees (not in computer-course DB) */}
                      <option value="University Degree (BCA/BA/B.Com/BSc/MSc/MBA)">
                        University Degree (BCA / BA / B.Com / BSc / MSc / MBA)
                      </option>
                    </select>
                    <span className="eqp-select-chevron" aria-hidden="true">
                      <ChevronDown size={14} strokeWidth={2} />
                    </span>
                  </div>
                </div>

                <div className="eqp-field">
                  <span className="eqp-label">Preferred Contact Method</span>
                  <div className="eqp-method-group" role="group" aria-label="Contact method">
                    {CONTACT_METHODS.map((method) => {
                      const active = form.contactMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setForm({ ...form, contactMethod: method })}
                          className={active ? "eqp-method-btn eqp-method-btn--active" : "eqp-method-btn"}
                        >
                          {method}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {status === "error" && <p className="eqp-error">{errorMsg}</p>}

                <button
                  type="submit"
                  className="eqp-btn eqp-btn-primary eqp-btn-full"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="eqp-spin" /> Submitting…
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </button>

                <button type="button" className="eqp-skip" onClick={close}>
                  No thanks, maybe later
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = `
.eqp-overlay {
  position: fixed; inset: 0; z-index: var(--z-modal, 1050);
  display: flex; align-items: center; justify-content: center; padding: var(--space-4);
}
.eqp-backdrop { position: absolute; inset: 0; background: var(--bg-overlay, rgba(26,25,22,0.5)); }
.eqp-modal {
  position: relative; width: 100%; max-width: 760px;
  max-height: 92vh; overflow: auto;
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-2xl);
  animation: eqpIn 0.25s ease-out both;
}
@keyframes eqpIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.eqp-close {
  position: absolute; top: var(--space-3); right: var(--space-3); z-index: 3;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: var(--radius-md); color: var(--text-secondary); cursor: pointer;
  transition: border-color var(--transition-base);
}
.eqp-close:hover { border-color: var(--color-gray-300); }
.eqp-grid { display: grid; grid-template-columns: 1fr 1fr; }

/* Info panel */
.eqp-info { background: var(--color-primary-700); color: #fff; padding: var(--space-8); display: flex; flex-direction: column; }
.eqp-info-eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.85); margin-bottom: var(--space-3);
}
.eqp-info-title { font-family: var(--font-display); font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.2; margin-bottom: var(--space-3); }
.eqp-info-text { font-size: var(--font-size-sm); color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: var(--space-5); }
.eqp-info-list { list-style: none; padding: 0; margin: 0 0 var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); }
.eqp-info-list li { display: flex; align-items: flex-start; gap: var(--space-2); font-size: var(--font-size-sm); color: rgba(255,255,255,0.92); line-height: 1.4; margin: 0; }
.eqp-info-list svg { color: #9fdcb6; flex-shrink: 0; margin-top: 2px; }
.eqp-info-note { font-size: var(--font-size-xs); color: rgba(255,255,255,0.6); margin: auto 0 0; line-height: 1.5; }

/* Form */
.eqp-form-wrap { padding: var(--space-8); }
.eqp-form-title { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin-bottom: var(--space-1); }
.eqp-form-sub { font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-5); }
.eqp-field { margin-bottom: var(--space-3); }
.eqp-field label, .eqp-label { display: block; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); margin-bottom: var(--space-1); }
.eqp-field input, .eqp-field select {
  width: 100%; font-family: var(--font-sans); font-size: var(--font-size-base);
  color: var(--text-primary); background: var(--bg-elevated);
  border: 1px solid var(--border-color); border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3); appearance: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.eqp-field input:focus, .eqp-field select:focus {
  outline: none; border-color: var(--color-primary-600); box-shadow: 0 0 0 3px var(--color-primary-100);
}
.eqp-select-wrap { position: relative; }
.eqp-select-chevron { position: absolute; right: var(--space-3); top: 50%; transform: translateY(-50%); color: var(--text-tertiary); pointer-events: none; display: flex; }

.eqp-method-group { display: flex; gap: var(--space-2); }
.eqp-method-btn {
  flex: 1; font-family: var(--font-sans); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);
  color: var(--text-secondary); background: var(--bg-elevated);
  border: 1px solid var(--border-color); border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3); cursor: pointer;
  transition: border-color var(--transition-base), color var(--transition-base), background var(--transition-base);
}
.eqp-method-btn:hover { border-color: var(--color-gray-300); color: var(--text-primary); }
.eqp-method-btn--active { color: #fff; background: var(--color-primary-600); border-color: var(--color-primary-600); }

.eqp-error { font-size: var(--font-size-sm); color: var(--color-danger); margin: 0 0 var(--space-3); }

.eqp-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6); font-family: var(--font-sans);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md); border: 1px solid transparent; cursor: pointer;
  transition: background var(--transition-base);
}
.eqp-btn-primary { background: var(--color-primary-600); color: #fff; }
.eqp-btn-primary:hover { background: var(--color-primary-700); }
.eqp-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.eqp-btn-full { width: 100%; margin-top: var(--space-2); }
.eqp-skip { display: block; width: 100%; text-align: center; background: none; border: none; cursor: pointer; font-size: var(--font-size-sm); color: var(--text-tertiary); margin-top: var(--space-3); padding: var(--space-2); }
.eqp-skip:hover { color: var(--text-secondary); }
.eqp-spin { animation: eqpspin 0.8s linear infinite; }
@keyframes eqpspin { to { transform: rotate(360deg); } }

/* Success */
.eqp-success { text-align: center; padding: var(--space-6) 0; }
.eqp-success-icon { color: var(--color-success); margin-bottom: var(--space-3); display: flex; justify-content: center; }
.eqp-success-title { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin-bottom: var(--space-2); }
.eqp-success-text { font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-5); }

@media (max-width: 700px) {
  .eqp-grid { grid-template-columns: 1fr; }
  .eqp-info { display: none; }
  .eqp-form-wrap { padding: var(--space-6); padding-top: var(--space-8); }
}
`;
