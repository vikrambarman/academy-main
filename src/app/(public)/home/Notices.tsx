import Link from "next/link";

const notices = [
    {
        id: 1,
        title: "Academy Picnic – December 27",
        desc: "Annual student picnic successfully organized with participation from various computer courses.",
        date: "2025-12-27",
        label: "27 Dec 2025",
    },
    {
        id: 2,
        title: "New Admissions Open",
        desc: "Admissions now open for DCA, ADCA, Tally, Web Development and Software Development programs.",
        date: "2025-01-01",
        label: "Ongoing",
    },
    {
        id: 3,
        title: "GSDM Certificate Update",
        desc: "GSDM certificates for selected students have started generating and are available for verification.",
        date: "2025-02-01",
        label: "Latest",
    },
];

export default function Notices() {
    return (
        <section
            className="bg-gray-50"
            aria-labelledby="notices-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                    <div>
                        <h2
                            id="notices-heading"
                            className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                        >
                            Latest Notices & Updates
                        </h2>

                        <p className="mt-3 text-gray-600 text-base md:text-lg">
                            Important announcements, admission updates and official academy notices.
                        </p>
                    </div>

                    <Link
                        href="/notices"
                        className="text-sm font-medium text-black hover:underline"
                    >
                        View All Notices →
                    </Link>

                </div>

                {/* Grid */}
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {notices.map((notice) => (
                        <article
                            key={notice.id}
                            className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-md transition"
                        >
                            <time
                                dateTime={notice.date}
                                className="text-xs font-medium text-gray-500"
                            >
                                {notice.label}
                            </time>

                            <h3 className="mt-3 text-lg font-semibold text-gray-900">
                                {notice.title}
                            </h3>

                            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                {notice.desc}
                            </p>

                            <Link
                                href="/notices"
                                className="inline-block mt-5 text-sm font-medium text-black hover:underline"
                            >
                                Read more →
                            </Link>
                        </article>
                    ))}

                </div>

            </div>
        </section>
    );
}