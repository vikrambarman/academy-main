import Image from "next/image";

export const metadata = {
    title: "Affiliations & Partnerships | Shivshakti Computer Academy",
    description:
        "Authorized training partnerships and skill development affiliations of Shivshakti Computer Academy.",
};

export default function AffiliationsPage() {
    const affiliations = [
        {
            title: "Gramin Skill Development Mission (GSDM)",
            description:
                "Authorized training centre aligned with government-recognized skill development diploma programs.",
            image: "/images/affiliations/gsdm.jpg",
        },
        {
            title: "Drishti Computer Education",
            description:
                "Authorized franchise partner providing verified certification for foundation and professional programs.",
            image: "/images/affiliations/drishti.jpg",
        },
        {
            title: "Skill India & NSDC Alignment",
            description:
                "Selected program certifications aligned with national skill development frameworks.",
            image: "/images/affiliations/skillindia.jpg",
        },
        {
            title: "DigiLocker Enabled Certificates",
            description:
                "Eligible certificates accessible digitally for verification through DigiLocker platform.",
            image: "/images/affiliations/digilocker.jpg",
        },
    ];

    return (
        <section className="bg-gray-50 min-h-screen py-28">
            <div className="max-w-6xl mx-auto px-6 md:px-12">

                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-semibold text-gray-900">
                        Affiliations & Partnerships
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Official training partnerships and authorized academic collaborations.
                    </p>
                </div>

                <div className="mt-20 grid md:grid-cols-2 gap-14">
                    {affiliations.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl p-12 text-center shadow-sm hover:shadow-lg transition"
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