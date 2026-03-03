"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function EnquiryPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        course: "",
        contactMethod: "Phone",
        message: "",
    });

    /* ---------------------------------------
       Fetch Courses (Dynamic Ready)
    ---------------------------------------- */
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/public/courses");
                const result = await res.json();
                setCourses(result.data || []);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };

        fetchCourses();
    }, []);

    /* ---------------------------------------
       Handle Submit
    ---------------------------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/public/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setSuccess(true);
                setForm({
                    name: "",
                    mobile: "",
                    course: "",
                    contactMethod: "Phone",
                    message: "",
                });
            }
        } catch (error) {
            console.error("Submission failed", error);
        }

        setLoading(false);
    };

    return (
        <>
            {/* Structured Data */}
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

            <section className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-28">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl font-semibold text-gray-900">
                            Course Enquiry in Ambikapur
                        </h1>
                        <p className="mt-4 text-gray-600">
                            Submit your enquiry for computer courses at Shivshakti Computer Academy.
                            Our admission team will contact you shortly.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="mt-16 bg-white border border-gray-100 shadow-sm rounded-3xl p-10">

                        {success && (
                            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-sm">
                                Thank you! Your enquiry has been submitted successfully.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            />

                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                required
                                value={form.mobile}
                                onChange={(e) =>
                                    setForm({ ...form, mobile: e.target.value })
                                }
                                className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            />

                            {/* Dynamic Course Dropdown */}
                            <select
                                required
                                value={form.course}
                                onChange={(e) =>
                                    setForm({ ...form, course: e.target.value })
                                }
                                className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course.name}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={form.contactMethod}
                                onChange={(e) =>
                                    setForm({ ...form, contactMethod: e.target.value })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            >
                                <option value="Phone">Phone</option>
                                <option value="WhatsApp">WhatsApp</option>
                            </select>

                            <textarea
                                rows={4}
                                placeholder="Message (Optional)"
                                value={form.message}
                                onChange={(e) =>
                                    setForm({ ...form, message: e.target.value })
                                }
                                className="md:col-span-2 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="md:col-span-2 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-60"
                            >
                                {loading ? "Submitting..." : "Submit Enquiry"}
                            </button>
                        </form>
                    </div>

                </div>
            </section>
        </>
    );
}