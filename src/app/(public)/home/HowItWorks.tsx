export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Choose Your Course",
            desc: "Select from diploma, certification or professional IT programs based on your career goals.",
        },
        {
            number: "02",
            title: "Practical Training",
            desc: "Attend hands-on training sessions with real-time computer practice and expert guidance.",
        },
        {
            number: "03",
            title: "Get Certified",
            desc: "Receive government-recognized and digitally verifiable certificates after course completion.",
        },
    ];

    return (
        <section
            className="bg-white"
            aria-labelledby="how-it-works-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2
                        id="how-it-works-heading"
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                    >
                        How It Works
                    </h2>

                    <p className="mt-4 text-gray-600 text-base md:text-lg">
                        A simple 3-step process to start your computer education journey.
                    </p>
                </div>

                {/* Steps */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">

                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="text-center md:text-left"
                        >
                            <div className="text-5xl font-bold text-gray-200">
                                {step.number}
                            </div>

                            <h3 className="mt-6 text-lg font-semibold text-gray-900">
                                {step.title}
                            </h3>

                            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}