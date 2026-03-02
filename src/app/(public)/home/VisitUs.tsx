export default function VisitUs() {
    return (
        <section
            className="bg-white"
            aria-labelledby="visit-us-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2
                        id="visit-us-heading"
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                    >
                        Visit Shivshakti Computer Academy, Ambikapur
                    </h2>

                    <p className="mt-4 text-gray-600 text-base md:text-lg">
                        Visit our training centre for course enquiries, admission guidance
                        and career counseling.
                    </p>
                </div>

                {/* Layout */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* INFO */}
                    <div className="space-y-8">

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Shivshakti Computer Academy
                            </h3>

                            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                                Authorized Training Centre under Gramin Skill Development Mission (GSDM),
                                offering government-recognized and professional computer courses in Ambikapur.
                            </p>
                        </div>

                        {/* Address */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                                Address
                            </h4>

                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                1st Floor above Usha Matching Center, Near Babra Petrol Pump,
                                Banaras Road, Phunderdihari, Ambikapur – 497001<br />
                                Chhattisgarh, India
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                                Contact
                            </h4>

                            <p className="mt-2 text-sm text-gray-600">
                                <a href="tel:+917477036832" className="hover:underline">
                                    +91 74770 36832
                                </a>
                                {" | "}
                                <a href="tel:+919009087883" className="hover:underline">
                                    +91 90090 87883
                                </a>
                            </p>
                        </div>

                        {/* Timing */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                                Working Hours
                            </h4>

                            <p className="mt-2 text-sm text-gray-600">
                                Monday – Saturday<br />
                                8:00 AM – 6:00 PM
                            </p>
                        </div>

                        {/* CTA */}
                        <div>
                            <a
                                href="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-xl bg-black text-white px-6 py-3 text-sm font-medium transition hover:bg-gray-800"
                            >
                                Open in Google Maps
                            </a>
                        </div>

                    </div>

                    {/* MAP */}
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        <div className="aspect-video w-full">
                            <iframe
                                src="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur&output=embed"
                                loading="lazy"
                                title="Shivshakti Computer Academy Ambikapur Location Map"
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}