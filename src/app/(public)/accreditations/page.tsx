import Image from "next/image";

export const metadata = {
    title: "Accreditation & Registration | Shivshakti Computer Academy",
    description:
        "Official quality certifications and government registration of Shivshakti Computer Academy including ISO 9001:2015 and MSME registration.",
};

export default function AccreditationPage() {
    const accreditation = [
        {
            title: "ISO 9001:2015 Certified",
            description:
                "International quality management certification ensuring structured academic processes and training standards.",
            image: "/images/accreditations/iso.jpg",
        },
        {
            title: "MSME (Udyam) Registered Institute",
            description:
                "Government of India registered MSME institute ensuring authenticity and legal compliance as a certified training provider.",
            image: "/images/accreditations/msme.jpg",
        },
    ];

    return (
        <section className="bg-white min-h-screen py-28">
            <div className="max-w-6xl mx-auto px-6 md:px-12">

                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-4xl font-semibold text-gray-900">
                        Accreditation & Registration
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Official quality certifications and government registrations
                        confirming institutional credibility.
                    </p>
                </div>

                <div className="mt-20 grid md:grid-cols-2 gap-14">
                    {accreditation.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-3xl p-12 text-center shadow-sm hover:shadow-xl transition"
                        >
                            <div className="relative h-20 w-40 mx-auto">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <h3 className="mt-8 text-xl font-semibold text-gray-900">
                                {item.title}
                            </h3>

                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}