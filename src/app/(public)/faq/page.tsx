"use client";

import { useState } from "react";

const faqs = [
    {
        question: "Is Shivshakti Computer Academy government recognized?",
        answer:
            "Yes, the academy operates under recognized frameworks including MSME registration and authorized training partnerships. Selected programs align with national skill development guidelines.",
    },
    {
        question: "Are certificates verifiable?",
        answer:
            "Eligible certificates are issued through recognized authorities and may be digitally verifiable depending on the program and governing body.",
    },
    {
        question: "What courses are available?",
        answer:
            "We offer DCA, ADCA, Tally, Basic Computer, Web Development and other professional skill development programs.",
    },
    {
        question: "What is the admission process?",
        answer:
            "Students can visit the academy or submit an online enquiry. After counselling, enrollment and practical training begins as per course structure.",
    },
    {
        question: "Where is the academy located?",
        answer:
            "We are located in Ambikapur, Surguja (C.G.), easily accessible from the main city area.",
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-28">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto">
                    <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-4 py-1 rounded-full">
                        Help & Information
                    </span>

                    <h1 className="mt-6 text-4xl font-semibold text-gray-900">
                        Frequently Asked Questions
                    </h1>

                    <p className="mt-6 text-gray-600 leading-relaxed">
                        Find answers to common questions about admissions, certifications,
                        training structure and institutional policies.
                    </p>

                    <div className="mt-8 w-20 h-1 bg-black mx-auto rounded-full"></div>
                </div>

                {/* FAQ Accordion */}
                <div className="mt-16 space-y-4">

                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-100 rounded-2xl shadow-sm"
                        >
                            <button
                                onClick={() =>
                                    setOpenIndex(openIndex === index ? null : index)
                                }
                                className="w-full flex justify-between items-center p-6 text-left"
                            >
                                <span className="text-sm md:text-base font-medium text-gray-900">
                                    {faq.question}
                                </span>

                                <span className="text-gray-500 text-xl">
                                    {openIndex === index ? "−" : "+"}
                                </span>
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}

                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center border-t pt-10">
                    <p className="text-gray-600 text-sm">
                        Still have questions?
                    </p>

                    <a
                        href="/contact"
                        className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Contact the Academy
                    </a>
                </div>

            </div>
        </section>
    );
}