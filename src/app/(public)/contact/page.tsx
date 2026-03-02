"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        message: "",
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await fetch("/api/public/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        alert("Message Sent Successfully");
    };

    return (
        <section className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-28">
            <div className="max-w-6xl mx-auto px-6">

                {/* HEADER */}
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-semibold text-gray-900">
                        Contact Us
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Reach out to us for admissions, certifications and course guidance.
                    </p>
                </div>

                {/* CONTACT ACTION CARDS */}
                <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Call */}
                    <a
                        href="tel:+917477036832"
                        className="bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                    >
                        <Phone className="mx-auto text-black mb-3" size={28} />
                        <h3 className="font-semibold text-gray-900">Call Us</h3>
                        <p className="text-sm text-gray-500 mt-2">+91 7477036832</p>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/919009087883"
                        target="_blank"
                        className="bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                    >
                        <MessageCircle className="mx-auto text-green-600 mb-3" size={28} />
                        <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                        <p className="text-sm text-gray-500 mt-2">Chat Instantly</p>
                    </a>

                    {/* Email */}
                    <a
                        href="mailto:shivshakticomputeracademy25@gmail.com"
                        className="bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                    >
                        <Mail className="mx-auto text-blue-600 mb-3" size={28} />
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <p className="text-sm text-gray-500 mt-2">Send a Message</p>
                    </a>

                    {/* Visit */}
                    <a
                        href="https://www.google.com/maps?q=Shivshakti+Computer+Academy"
                        target="_blank"
                        className="bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                    >
                        <MapPin className="mx-auto text-red-600 mb-3" size={28} />
                        <h3 className="font-semibold text-gray-900">Visit Us</h3>
                        <p className="text-sm text-gray-500 mt-2">Ambikapur, C.G.</p>
                    </a>

                </div>

                {/* FORM + MAP */}
                <div className="mt-20 grid md:grid-cols-2 gap-12">

                    {/* FORM */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 text-gray-900">
                            Send a Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                required
                                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />

                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                required
                                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            />

                            <textarea
                                rows={4}
                                placeholder="Your Message"
                                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                            />

                            <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* MAP */}
                    <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100">
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
    );
}