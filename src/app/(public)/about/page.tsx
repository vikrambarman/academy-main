import Image from "next/image";

export const metadata = {
    title:
        "About Shivshakti Computer Academy | Trusted Computer Training in Ambikapur",
    description:
        "Learn about Shivshakti Computer Academy in Ambikapur — a trusted computer training institute with 10+ years of teaching experience providing practical education and verified certifications.",
};

export default function AboutPage() {
    return (
        <section className="relative bg-gradient-to-b from-white via-gray-50 to-white min-h-screen py-28 overflow-hidden">

            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-100 blur-3xl opacity-30 rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 blur-3xl opacity-40 rounded-full -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* ================= HERO ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT CONTENT */}
                    <div className="text-center md:text-left">

                        <span className="inline-block text-xs sm:text-sm font-medium bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full shadow-sm">
                            Established & Government Recognized
                        </span>

                        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                            Empowering Digital Skills <br className="hidden sm:block" /> in Ambikapur
                        </h1>

                        <div className="mt-5 w-20 h-1 bg-yellow-500 rounded-full mx-auto md:mx-0"></div>

                        <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">
                            Shivshakti Computer Academy is a trusted computer training institute
                            in Ambikapur dedicated to practical learning, verified certification,
                            and career-oriented digital skill development. With more than
                            10 years of teaching experience across academic and professional
                            computer training environments, our institute focuses on building
                            strong digital foundations and practical confidence for every student.
                        </p>

                        {/* Premium Stats */}
                        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">

                            {[
                                { number: "10+", label: "Years Teaching Experience" },
                                { number: "1000+", label: "Students Trained" },
                                { number: "100%", label: "Verified Certificates" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md text-center border border-gray-100"
                                >
                                    <p className="text-2xl sm:text-3xl font-semibold text-gray-900">
                                        {item.number}
                                    </p>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                        {item.label}
                                    </p>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="relative flex justify-center md:justify-end">
                        <Image
                            src="/about.png"
                            alt="Students learning practical computer training"
                            width={650}
                            height={500}
                            className="rounded-3xl shadow-2xl object-cover w-full max-w-md md:max-w-lg"
                        />
                    </div>

                </div>

                {/* ================= WHO WE ARE ================= */}
                <div className="mt-32 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-gray-900">
                        Who We Are
                    </h2>

                    <div className="mt-4 w-20 h-1 bg-yellow-500 mx-auto rounded-full"></div>

                    <p className="mt-8 text-gray-600 leading-relaxed">
                        Shivshakti Computer Academy is an Authorized Training Centre
                        under Gramin Skill Development Mission. Our programs are
                        designed to align with national skill development initiatives,
                        ensuring students receive structured training and recognized
                        certifications.
                    </p>

                    <p className="mt-4 text-gray-600 leading-relaxed">
                        We follow a transparent training approach where students first
                        learn through practical hands-on sessions, then undergo
                        proper assessment, and finally receive verified certification
                        from authorized organizations.
                    </p>
                </div>

                {/* ================= RECOGNITION GRID ================= */}
                <div className="mt-32">
                    <h2 className="text-3xl font-semibold text-center text-gray-900">
                        Recognition & Authorizations
                    </h2>

                    <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            "MSME (Udyam) Registered Institute",
                            "ISO 9001:2015 Certified",
                            "Authorized GSDM Training Centre",
                            "Drishti Computer Education Franchise",
                            "Skill India Aligned Programs",
                            "DigiLocker Enabled Certificates",
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 text-center"
                            >
                                <p className="text-gray-800 text-sm font-medium">
                                    ✔ {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= TRAINING PROCESS ================= */}
                <div className="mt-32">
                    <h2 className="text-3xl font-semibold text-center text-gray-900">
                        Our Training & Certification Process
                    </h2>

                    <div className="mt-16 grid md:grid-cols-4 gap-10 text-center">
                        {[
                            "Enroll in Course",
                            "100% Practical Training",
                            "Assessment & Evaluation",
                            "Verified Certification",
                        ].map((step, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:-translate-y-2 transition"
                            >
                                <div className="w-14 h-14 mx-auto rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </div>
                                <p className="mt-6 text-gray-700 text-sm font-medium">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= MISSION & VISION ================= */}
                <div className="mt-32 grid md:grid-cols-2 gap-12">
                    <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl p-14 shadow-2xl">
                        <h3 className="text-xl font-semibold">Our Mission</h3>
                        <p className="mt-6 text-gray-300 text-sm leading-relaxed">
                            To provide affordable, practical and certified computer education
                            that builds job-ready skills and self-confidence among students.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl p-14 shadow-2xl">
                        <h3 className="text-xl font-semibold">Our Vision</h3>
                        <p className="mt-6 text-gray-300 text-sm leading-relaxed">
                            To become a trusted digital skill development institute
                            recognized for honest training, genuine certification,
                            and long-term student success.
                        </p>
                    </div>
                </div>

                {/* ================= FOUNDER MESSAGE ================= */}
                <div className="mt-32 bg-gray-50 rounded-3xl p-14">

                    <div className="grid md:grid-cols-3 gap-12 items-center">

                        {/* Founder Image */}
                        <div className="flex justify-center md:justify-start">
                            <div className="relative w-44 h-44">
                                <Image
                                    src="/founder.jpg"
                                    alt="Founder of Shivshakti Computer Academy"
                                    fill
                                    className="object-cover rounded-full shadow-md"
                                />
                            </div>
                        </div>

                        {/* Founder Content */}
                        <div className="md:col-span-2 text-center md:text-left">

                            <h3 className="text-2xl font-semibold text-gray-900">
                                Message from the Founder
                            </h3>

                            <p className="mt-6 text-gray-600 text-sm leading-relaxed">
                                With over a decade of teaching experience, my journey in education
                                has been focused on helping students develop strong academic
                                and digital foundations. Before establishing this institute,
                                I worked as a Senior Computer Faculty where I trained students
                                in practical computer applications and career-oriented skills.
                            </p>

                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                                Shivshakti Computer Academy was founded with a clear vision —
                                to provide transparent, practical and skill-based computer
                                education that prepares students for real-world opportunities
                                in today’s digital era.
                            </p>

                            <div className="mt-8">
                                <p className="text-lg font-semibold text-gray-900">
                                    Mr. Vikram Barman
                                </p>
                                <p className="text-sm text-gray-500">
                                    Founder & Director
                                    Shivshakti Computer Academy
                                </p>

                                <p className="mt-3 text-gray-400 italic">
                                    “Skills First. Certification With Integrity.”
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}