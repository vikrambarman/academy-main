import {
    MonitorCheck,
    Award,
    Briefcase,
    Users,
    ShieldCheck,
    Rocket
} from "lucide-react";

export default function WhyChooseUs() {

    const points = [
        {
            icon: MonitorCheck,
            title: "Practical Computer Training",
            desc: "Hands-on learning with dedicated systems and real-time practical sessions."
        },
        {
            icon: Award,
            title: "Recognized Certifications",
            desc: "Certificates aligned with Skill India initiatives and DigiLocker verification."
        },
        {
            icon: Briefcase,
            title: "Career-Oriented Programs",
            desc: "Industry-focused courses designed for employment and digital careers."
        },
        {
            icon: Users,
            title: "Supportive Learning",
            desc: "Guided training environment that helps students learn confidently."
        },
        {
            icon: ShieldCheck,
            title: "Trusted Local Institute",
            desc: "Established computer training institute serving Ambikapur and nearby regions."
        },
        {
            icon: Rocket,
            title: "Skill-Based Growth",
            desc: "Programs designed for job readiness, freelancing and self-employment."
        }
    ];

    return (
        <section className="bg-white" aria-labelledby="why-choose-heading">

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">

                {/* SPLIT LAYOUT */}
                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* LEFT SIDE */}
                    <div>

                        <span className="inline-block text-xs font-medium bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full">
                            Why Students Trust Us
                        </span>

                        <h2
                            id="why-choose-heading"
                            className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                        >
                            Why Choose Shivshakti Computer Academy
                        </h2>

                        <p className="mt-6 text-gray-600 text-base md:text-lg leading-relaxed">
                            Our training approach combines practical computer education,
                            recognized certifications and career-focused learning to help
                            students develop strong digital skills for the modern workplace.
                        </p>

                        {/* Highlight Points */}
                        <div className="mt-10 space-y-8">

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <MonitorCheck className="w-5 h-5 text-gray-700" />
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Practical-First Learning
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Every course emphasizes hands-on computer practice.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-gray-700" />
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Verified Certifications
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Certificates supported by recognized national platforms.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-gray-700" />
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Career-Oriented Curriculum
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Programs designed for real-world digital career opportunities.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>


                    {/* RIGHT SIDE FEATURES */}
                    <div className="grid sm:grid-cols-2 gap-6">

                        {points.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={index}
                                    className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300"
                                >

                                    <Icon className="w-6 h-6 text-gray-800" />

                                    <h3 className="mt-4 text-sm font-semibold text-gray-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                        {item.desc}
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>

        </section>
    );
}