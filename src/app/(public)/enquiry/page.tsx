"use client";

import { useEffect, useState } from "react";

export default function EnquiryPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        course: "",
        contactMethod: "Phone",
        message: "",
    });

    // Fetch Courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/public/courses");
                const result = await res.json();

                setCourses(result.data); // important
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };

        fetchCourses();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        await fetch("/api/public/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setLoading(false);
        alert("Enquiry Submitted Successfully");
    };

    return (
        <section className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-28">
            <div className="max-w-5xl mx-auto px-6">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-semibold text-gray-900">
                        Course Enquiry
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Fill in your details and our admission team will guide you.
                    </p>
                </div>

                {/* SaaS Card */}
                <div className="mt-16 bg-white border border-gray-100 shadow-sm rounded-3xl p-10">

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            required
                            className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        />

                        {/* Dynamic Course Dropdown */}
                        <select
                            required
                            className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            onChange={(e) => setForm({ ...form, course: e.target.value })}
                        >
                            <option value="">Select Course</option>
                            {courses?.map((course: any) => (
                                <option key={course._id} value={course.name}>
                                    {course.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border rounded-xl px-4 py-3 text-sm"
                            onChange={(e) =>
                                setForm({ ...form, contactMethod: e.target.value })
                            }
                        >
                            <option>Phone</option>
                            <option>WhatsApp</option>
                        </select>

                        <textarea
                            rows={4}
                            placeholder="Message (Optional)"
                            className="md:col-span-2 border rounded-xl px-4 py-3 text-sm"
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
                        >
                            {loading ? "Submitting..." : "Submit Enquiry"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}