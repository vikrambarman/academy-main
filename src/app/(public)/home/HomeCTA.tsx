import Link from "next/link";

export default function HomeCTA() {
    return (
        <section
            className="bg-gray-900 text-white"
            aria-labelledby="home-cta-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT CONTENT */}
                    <div>

                        <h2
                            id="home-cta-heading"
                            className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight"
                        >
                            Secure Your Future with Digital Skills
                        </h2>

                        <p className="mt-6 text-gray-300 text-base md:text-lg leading-relaxed">
                            Shivshakti Computer Academy provides practical computer training,
                            government-recognized certifications, and career-focused digital
                            skills designed for jobs, entrepreneurship and higher studies.
                        </p>

                        <ul className="mt-8 space-y-3 text-sm text-gray-300">
                            <li>✔ Skill India & GSDM aligned programs</li>
                            <li>✔ DigiLocker verified certificates</li>
                            <li>✔ Web Development & Professional IT training</li>
                            <li>✔ Affordable education for all backgrounds</li>
                        </ul>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                href="/courses"
                                className="inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-3 text-sm font-medium transition hover:bg-gray-200"
                            >
                                View Courses
                            </Link>

                            <Link
                                href="/enquiry"
                                className="inline-flex items-center justify-center rounded-xl border border-white px-6 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
                            >
                                Admission Enquiry
                            </Link>
                        </div>

                    </div>

                    {/* RIGHT CONTACT CARD */}
                    <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-lg">

                        <h3 className="text-lg font-semibold">
                            Need Guidance? Talk to Us
                        </h3>

                        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                            Get assistance with course selection, certification details,
                            eligibility criteria and admission guidance.
                        </p>

                        <div className="mt-6 space-y-3">

                            <a
                                href="tel:+917477036832"
                                className="block text-sm font-medium hover:underline"
                            >
                                +91 74770 36832
                            </a>

                            <a
                                href="tel:+919009087883"
                                className="block text-sm font-medium hover:underline"
                            >
                                +91 90090 87883
                            </a>

                        </div>

                        <p className="mt-6 text-xs text-gray-500">
                            Visit our training center in Ambikapur, Chhattisgarh.
                        </p>

                    </div>

                </div>

            </div>
        </section>
    );
}