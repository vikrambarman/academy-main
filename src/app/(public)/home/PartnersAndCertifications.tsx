import Image from "next/image";

const affiliations = [
    {
        title: "ISO 9001:2015 Certified",
        description:
            "International quality standards for education management and professional training delivery.",
        image: "/images/affiliations/iso.jpg",
    },
    {
        title: "Gramin Skill Development Mission (GSDM)",
        description:
            "Authorized training centre aligned with Skill India initiatives and government-recognized diploma programs.",
        image: "/images/affiliations/gsdm.jpg",
    },
    {
        title: "Drishti Computer Education",
        description:
            "Authorized franchise partner providing verified certification for professional courses.",
        image: "/images/affiliations/drishti.jpg",
    },
    {
        title: "Skill India & NSDC",
        description:
            "Selected course certificates verifiable through Skill India and NSDC platforms.",
        image: "/images/affiliations/skillindia.jpg",
    },
    {
        title: "DigiLocker Enabled",
        description:
            "Diploma certificates accessible digitally via DigiLocker with lifetime verification.",
        image: "/images/affiliations/digilocker.jpg",
    },
    {
        title: "MSME Registered Institute",
        description:
            "Government-registered MSME institute ensuring authenticity and legal compliance.",
        image: "/images/affiliations/msme.jpg",
    },
];

export default function PartnersAndCertifications() {
    return (
        <section
            className="bg-gray-50"
            aria-labelledby="affiliations-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2
                        id="affiliations-heading"
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                    >
                        Our Affiliations & Recognitions
                    </h2>

                    <p className="mt-4 text-gray-600 text-base md:text-lg">
                        Government-recognized certifications and authorized training partnerships
                        ensuring transparency and credibility.
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {affiliations.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-100 p-8 text-center transition hover:shadow-md"
                        >
                            {/* Logo */}
                            <div className="relative h-16 w-32 mx-auto">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Title */}
                            <h3 className="mt-6 text-lg font-semibold text-gray-900">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}