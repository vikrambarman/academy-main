import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section
            className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
            aria-labelledby="hero-heading"
        >
            {/* Background Decorative Blur */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gray-200 rounded-full blur-3xl opacity-40" />

            <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 grid md:grid-cols-2 gap-16 items-center">

                {/* LEFT CONTENT */}
                <div>

                    {/* Badge */}
                    <span className="inline-block text-xs font-medium bg-black text-white px-4 py-1.5 rounded-full tracking-wide">
                        Government Recognized Training Centre
                    </span>

                    {/* H1 */}
                    <h1
                        id="hero-heading"
                        className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight"
                    >
                        Empower Your Future with{" "}
                        <span className="text-black">
                            Digital Skills
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                        Shivshakti Computer Academy provides practical computer education,
                        government-recognized certifications, and career-focused digital
                        skill programs designed for real-world success.
                    </p>

                    {/* Trust Line */}
                    <div className="mt-6 text-sm text-gray-500 flex flex-wrap gap-4">
                        <span>ISO Certified</span>
                        <span>• MSME Registered</span>
                        <span>• DigiLocker Enabled</span>
                    </div>

                    {/* CTA */}
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            href="/courses"
                            className="inline-flex items-center justify-center rounded-full bg-black text-white px-7 py-3 text-sm font-medium hover:bg-gray-800 transition shadow-md"
                        >
                            Explore Courses
                        </Link>

                        <Link
                            href="/verify-certificate"
                            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                            Verify Certificate
                        </Link>
                    </div>

                </div>

                {/* RIGHT IMAGE CARD */}
                <div className="relative">

                    <div className="relative bg-white rounded-3xl shadow-2xl p-4">
                        <Image
                            src="/hero-modern.png"
                            alt="Students learning digital skills at Shivshakti Computer Academy"
                            width={700}
                            height={520}
                            priority
                            className="rounded-2xl object-cover"
                        />
                    </div>

                </div>

            </div>
        </section>
    );
}