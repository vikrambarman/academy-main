"use client";

import { useEffect, useState } from "react";
import { X, GraduationCap, CheckCircle, Loader2, ChevronDown } from "lucide-react";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open || courses.length) return;
    fetch("/api/public/courses")
      .then((r) => r.json())
      .then((result) => setCourses(result.data || []))
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, [open, courses.length]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleClose() {
    setOpen(false);
    if (typeof window !== "undefined")
      sessionStorage.setItem(STORAGE_KEY, "1");
  }

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
    <div
      className="eqp-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eqp-title"
    >
      <div
        className="eqp-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="eqp-modal">
        <button
          className="eqp-close"
          onClick={handleClose}
          aria-label="Close enquiry popup"
        >
          <X size={16} strokeWidth={2} />
        </button>

        <div className="eqp-grid">

          {/* ── Left: info panel ── */}
          <aside className="eqp-info">
            <span className="eqp-eyebrow">
              <GraduationCap size={13} strokeWidth={2} />
              Admissions Open
            </span>

            <h2 id="eqp-title" className="eqp-info-title">
              Build your career<br />in Ambikapur
            </h2>

            <p className="eqp-info-text">
              Job-oriented computer courses to recognised
              university degrees — get the right guidance.
            </p>

            <ul className="eqp-feature-list">
              <li>
                <CheckCircle size={13} strokeWidth={2.5} />
                DCA, PGDCA, Tally, Typing &amp; more
              </li>
              <li>
                <CheckCircle size={13} strokeWidth={2.5} />
                Python, Java, Web Development
              </li>
              <li>
                <CheckCircle size={13} strokeWidth={2.5} />
                BCA, BA, B.Com, BSc, MBA degrees
              </li>
              <li>
                <CheckCircle size={13} strokeWidth={2.5} />
                Online &amp; distance via Mangalayatan Univ.
              </li>
            </ul>

            <p className="eqp-info-note">
              Degree admissions facilitated through our
              university partnership (College Vidya).
            </p>
          </aside>

          {/* ── Right: form ── */}
          <div className="eqp-form-panel">
            {status === "success" ? (

              /* ── Success state ── */
              <div className="eqp-success">
                <div className="eqp-success-icon">
                  <CheckCircle size={36} strokeWidth={1.5} />
                </div>
                <h3 className="eqp-success-title">Thank you!</h3>
                <p className="eqp-success-text">
                  Your enquiry is submitted. Our team will
                  reach out within 24 hours.
                </p>
                <button
                  className="eqp-submit-btn"
                  onClick={handleClose}
                >
                  Continue browsing
                </button>
              </div>

            ) : (

              /* ── Form ── */
              <form className="eqp-form" onSubmit={handleSubmit} noValidate>
                <div className="eqp-form-header">
                  <h3 className="eqp-form-title">Request a callback</h3>
                  <p className="eqp-form-sub">
                    Fill this in — we usually reply the same day.
                  </p>
                </div>

                {/* Name */}
                <div className="eqp-field">
                  <label htmlFor="eqp-name" className="eqp-label">
                    Full Name
                  </label>
                  <input
                    id="eqp-name"
                    type="text"
                    required
                    className="eqp-input"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>

                {/* Mobile */}
                <div className="eqp-field">
                  <label htmlFor="eqp-mobile" className="eqp-label">
                    Mobile Number
                  </label>
                  <input
                    id="eqp-mobile"
                    type="tel"
                    required
                    className="eqp-input"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
                  />
                </div>

                {/* Course + Contact side by side */}
                <div className="eqp-row">
                  <div className="eqp-field">
                    <label htmlFor="eqp-course" className="eqp-label">
                      Interested In
                    </label>
                    <div className="eqp-select-wrap">
                      <select
                        id="eqp-course"
                        className="eqp-select"
                        value={form.course}
                        onChange={(e) =>
                          setForm({ ...form, course: e.target.value })
                        }
                      >
                        <option value="">Select course</option>
                        {courses.map((c) => (
                          <option key={c._id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                        <option value="University Degree (BCA/BA/B.Com/BSc/MSc/MBA)">
                          University Degree
                        </option>
                      </select>
                      <span className="eqp-chevron" aria-hidden="true">
                        <ChevronDown size={13} strokeWidth={2} />
                      </span>
                    </div>
                  </div>

                  <div className="eqp-field">
                    <span className="eqp-label">Contact Via</span>
                    <div
                      className="eqp-method-group"
                      role="group"
                      aria-label="Contact method"
                    >
                      {CONTACT_METHODS.map((method) => (
                        <button
                          key={method}
                          type="button"
                          aria-pressed={form.contactMethod === method}
                          className={`eqp-method-btn${
                            form.contactMethod === method
                              ? " eqp-method-btn--active"
                              : ""
                          }`}
                          onClick={() =>
                            setForm({ ...form, contactMethod: method })
                          }
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Error */}
                {status === "error" && (
                  <p className="eqp-error" role="alert">
                    {errorMsg}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="eqp-submit-btn"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={15} className="eqp-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </button>

                <button
                  type="button"
                  className="eqp-skip"
                  onClick={handleClose}
                >
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