"use client";

import { useState } from "react";

export default function FAQSection() {
    const faqs = [
        {
            question: "What is the duration of computer courses?",
            answer:
                "Course duration depends on the program. Diploma courses usually range from 6 months to 1 year, while short-term certifications may be 2–3 months.",
        },
        {
            question: "Are certificates government recognized?",
            answer:
                "Yes, selected courses are aligned with Skill India, GSDM and DigiLocker for digital verification.",
        },
        {
            question: "Is practical training provided?",
            answer:
                "Yes, we focus on 100% practical computer training with hands-on system access for every student.",
        },
        {
            question: "How can I verify my certificate?",
            answer:
                "Certificates can be verified online through official portals such as DigiLocker or the relevant certification authority.",
        },
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section
            className="bg-gray-50"
            aria-labelledby="faq-heading"
        >
            <div className="max-w-4xl mx-auto px-6 md:px-12 py-20">

                {/* Header */}
                <div className="text-center">
                    <h2
                        id="faq-heading"
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                    >
                        Frequently Asked Questions
                    </h2>

                    <p className="mt-4 text-gray-600 text-base md:text-lg">
                        Common questions about admissions, certifications and training.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="mt-14 space-y-4">

                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-100 rounded-xl p-6"
                        >
                            <button
                                className="w-full text-left text-sm md:text-base font-medium text-gray-900 flex justify-between items-center"
                                onClick={() =>
                                    setOpenIndex(openIndex === index ? null : index)
                                }
                            >
                                {faq.question}
                                <span>{openIndex === index ? "−" : "+"}</span>
                            </button>

                            {openIndex === index && (
                                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}