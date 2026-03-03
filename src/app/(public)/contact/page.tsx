"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Script from "next/script";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setSuccess(true);
                setForm({ name: "", mobile: "", message: "" });
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
                id="contact-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOrganization",
                        name: "Shivshakti Computer Academy",
                        address: {
                            "@type": "PostalAddress",
                            streetAddress:
                                "1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras Road, Phunderdihari",
                            addressLocality: "Ambikapur",
                            addressRegion: "Chhattisgarh",
                            postalCode: "497001",
                            addressCountry: "IN",
                        },
                        telephone: "+91 7477036832",
                    }),
                }}
            />

            <section className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-28">
                <div className="max-w-6xl mx-auto px-6">

                    {/* HEADER */}
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl font-semibold text-gray-900">
                            Contact Computer Institute in Ambikapur
                        </h1>
                        <p className="mt-4 text-gray-600">
                            Reach Shivshakti Computer Academy for admissions, certifications
                            and course guidance in Ambikapur.
                        </p>
                    </div>

                    {/* CONTACT CARDS */}
                    <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <a
                            href="tel:+917477036832"
                            className="bg-white border rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >
                            <Phone className="mx-auto text-black mb-3" size={28} />
                            <h3 className="font-semibold">Call Us</h3>
                            <p className="text-sm mt-2">+91 7477036832</p>
                        </a>

                        <a
                            href="https://wa.me/919009087883"
                            target="_blank"
                            className="bg-white border rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >
                            <MessageCircle className="mx-auto text-green-600 mb-3" size={28} />
                            <h3 className="font-semibold">WhatsApp</h3>
                            <p className="text-sm mt-2">+91 9009087883</p>
                        </a>

                        <a
                            href="mailto:shivshakticomputeracademy25@gmail.com"
                            className="bg-white border rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >
                            <Mail className="mx-auto text-blue-600 mb-3" size={28} />
                            <h3 className="font-semibold">Email</h3>
                            <p className="text-sm mt-2">Send Message</p>
                        </a>

                        <a
                            href="https://www.google.com/maps?q=Shivshakti+Computer+Academy"
                            target="_blank"
                            className="bg-white border rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >
                            <MapPin className="mx-auto text-red-600 mb-3" size={28} />
                            <h3 className="font-semibold">Visit Us</h3>
                            <p className="text-sm mt-2">Ambikapur, C.G.</p>
                        </a>
                    </div>

                    {/* FORM + MAP */}
                    <div className="mt-20 grid md:grid-cols-2 gap-12">

                        {/* FORM */}
                        <div className="bg-white p-10 rounded-3xl shadow-sm border">
                            <h2 className="text-xl font-semibold mb-6">
                                Send a Message
                            </h2>

                            {success && (
                                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-sm">
                                    Thank you! Your message has been sent successfully.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">

                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                />

                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    required
                                    value={form.mobile}
                                    onChange={(e) =>
                                        setForm({ ...form, mobile: e.target.value })
                                    }
                                    className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                />

                                <textarea
                                    rows={4}
                                    placeholder="Your Message"
                                    value={form.message}
                                    onChange={(e) =>
                                        setForm({ ...form, message: e.target.value })
                                    }
                                    className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                />

                                <button
                                    disabled={loading}
                                    className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-60"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>

                        {/* MAP */}
                        <div className="rounded-3xl overflow-hidden shadow-sm border">
                            <iframe
                                title="Shivshakti Computer Academy Location"
                                src="https://www.google.com/maps?q=Shivshakti+Computer+Academy&output=embed"
                                className="w-full h-full min-h-[450px]"
                                loading="lazy"
                            />
                        </div>

                    </div>

                </div>
            </section>
        </>
    );
}