export default function WhyChooseUs() {
    const points = [
        {
            title: "100% Practical Computer Training",
            desc: "Hands-on computer learning with individual system access for every student."
        },
        {
            title: "Government Recognized Certifications",
            desc: "Verified certificates aligned with Skill India, GSDM and DigiLocker platforms."
        },
        {
            title: "Career-Oriented Programs",
            desc: "From basic computer education to web development and advanced IT skills."
        },
        {
            title: "Supportive Learning Environment",
            desc: "Friendly and structured learning support for students from all backgrounds."
        },
        {
            title: "Trusted Institute in Ambikapur",
            desc: "Recognized and established computer training institute in Chhattisgarh."
        },
        {
            title: "Job & Self-Employment Focus",
            desc: "Skill-based programs designed for jobs, freelancing and entrepreneurship."
        }
    ];

    return (
        <section
            className="bg-white"
            aria-labelledby="why-choose-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                {/* Split Layout */}
                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* LEFT CONTENT */}
                    <div>
                        <h2
                            id="why-choose-heading"
                            className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                        >
                            Why Choose Shivshakti Computer Academy?
                        </h2>

                        <p className="mt-6 text-gray-600 text-base md:text-lg leading-relaxed">
                            We focus on practical training, recognized certifications, and
                            career-ready computer education designed to create measurable
                            student outcomes.
                        </p>

                        {/* Highlight Block */}
                        <div className="mt-10 space-y-6">

                            <div className="border-l-4 border-black pl-5">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Practical First Approach
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Real-time computer practice integrated into every course module.
                                </p>
                            </div>

                            <div className="border-l-4 border-black pl-5">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Verified & Recognized Certification
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Government-recognized credentials with digital verification.
                                </p>
                            </div>

                            <div className="border-l-4 border-black pl-5">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Career-Driven Curriculum
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Programs aligned with job market and self-employment needs.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT GRID */}
                    <div className="grid sm:grid-cols-2 gap-8">

                        {points.map((item, index) => (
                            <div
                                key={index}
                                className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
                            >
                                <h3 className="text-base font-semibold text-gray-900">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </section>
    );
}