import Image from "next/image";

export const metadata = {
    title:
        "About Shivshakti Computer Academy | Trusted Computer Training in Ambikapur",
    description:
        "Learn about Shivshakti Computer Academy, Ambikapur — government-recognized computer training institute providing practical education and verified certifications.",
};

export default function AboutPage() {
    return (
        <section className="relative bg-gradient-to-b from-white via-gray-50 to-white min-h-screen py-28 overflow-hidden">

            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-100 blur-3xl opacity-30 rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 blur-3xl opacity-40 rounded-full -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* ================= HERO ================= */}
                <div className="grid md:grid-cols-2 gap-20 items-center">

                    <div>
                        <span className="inline-block text-sm font-medium bg-yellow-50 text-yellow-700 px-5 py-2 rounded-full shadow-sm">
                            Established & Government Recognized
                        </span>

                        <h1 className="mt-8 text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                            Empowering Digital Skills <br /> in Ambikapur
                        </h1>

                        <div className="mt-6 w-24 h-1 bg-yellow-500 rounded-full"></div>

                        <p className="mt-8 text-lg text-gray-600 leading-relaxed">
                            Shivshakti Computer Academy is a trusted computer training institute
                            focused on practical education, verified certification, and
                            career-oriented digital skill development.
                        </p>

                        {/* Premium Stats */}
                        <div className="mt-12 grid grid-cols-3 gap-6">
                            {[
                                { number: "5+", label: "Years Experience" },
                                { number: "1000+", label: "Students Trained" },
                                { number: "100%", label: "Verified Certificates" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-md text-center border border-gray-100"
                                >
                                    <p className="text-3xl font-semibold text-gray-900">
                                        {item.number}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <Image
                            src="/gallery/classrooms/classroom1.jpg"
                            alt="Students learning practical computer training"
                            width={650}
                            height={500}
                            className="rounded-3xl shadow-2xl object-cover"
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
                        We are an Authorized Training Centre under Gramin Skill Development Mission.
                        Selected programs align with national skill development frameworks,
                        and eligible certificates are digitally verifiable.
                    </p>

                    <p className="mt-4 text-gray-600 leading-relaxed">
                        Our transparent training model ensures students first gain practical
                        expertise, then undergo structured assessment, and finally receive
                        recognized certification from respective authorities.
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

                {/* ================= MESSAGE ================= */}
                <div className="mt-32 bg-gray-50 rounded-3xl p-14 text-center shadow-inner">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Message from the Institute
                    </h3>

                    <p className="mt-8 text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto">
                        We believe skills matter more than certificates. Our goal is to ensure
                        that every student not only earns a recognized certificate but also
                        develops the practical confidence required for real-world success.
                    </p>
                </div>


                {/* ================= FOUNDER MESSAGE ================= */}
                <div className="mt-32 bg-gray-50 rounded-3xl p-14">

                    <div className="grid md:grid-cols-3 gap-12 items-center">

                        {/* Founder Image */}
                        <div className="flex justify-center md:justify-start">
                            <div className="relative w-44 h-44">
                                <Image
                                    src="/founder.jpg"   // <-- Add founder image here
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
                                At Shivshakti Computer Academy, our vision has always been simple —
                                provide practical, honest and skill-based education that truly
                                transforms careers. Certificates are important, but confidence and
                                real-world ability matter even more.
                            </p>

                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                                We remain committed to maintaining transparency, recognized
                                certifications, and structured training systems that empower
                                every student who joins us.
                            </p>

                            {/* Founder Name */}
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