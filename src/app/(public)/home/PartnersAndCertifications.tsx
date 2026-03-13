import Image from "next/image";

const affiliations = [
    {
        title: "ISO 9001:2015 Certified",
        description: "International quality standards for education management and professional training delivery.",
        image: "/images/affiliations/iso.jpg",
        badge: "Quality",
    },
    {
        title: "Gramin Skill Development Mission",
        description: "Authorized training centre aligned with Skill India initiatives and government-recognized diploma programs.",
        image: "/images/affiliations/gsdm.jpg",
        badge: "Govt. Authorized",
    },
    {
        title: "Drishti Computer Education",
        description: "Authorized franchise partner providing verified certification for professional courses.",
        image: "/images/affiliations/drishti.jpg",
        badge: "Franchise Partner",
    },
    {
        title: "Skill India & NSDC",
        description: "Selected course certificates verifiable through Skill India and NSDC platforms.",
        image: "/images/affiliations/skillindia.jpg",
        badge: "Skill India",
    },
    {
        title: "DigiLocker Enabled",
        description: "Diploma certificates accessible digitally via DigiLocker with lifetime verification.",
        image: "/images/affiliations/digilocker.jpg",
        badge: "Digital",
    },
    {
        title: "MSME Registered Institute",
        description: "Government-registered MSME institute ensuring authenticity and legal compliance.",
        image: "/images/affiliations/msme.jpg",
        badge: "Registered",
    },
];

const stripItems = ["Skill India", "NSDC", "DigiLocker", "ISO 9001:2015", "MSME Udyam", "GSDM"];

export default function PartnersAndCertifications() {
    return (
        <>
            <style>{`
                /* Top fade line */
                .pac-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #CBD5E1, transparent);
                }

                /* Card top accent on hover */
                .pac-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: #1B4FBB;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.28s ease;
                }
                .pac-card:hover::before { transform: scaleX(1); }

                /* Dash expand on hover */
                .pac-card-dash { transition: width 0.28s ease; }
                .pac-card:hover .pac-card-dash { width: 48px; }
            `}</style>

            <section
                className="pac-root relative overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A] py-20 md:py-24 px-6"
                aria-labelledby="affiliations-heading"
            >
                <div className="max-w-[1100px] mx-auto">

                    {/* ── Header ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-end mb-12 md:mb-14">
                        <div>
                            {/* Eyebrow */}
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase text-blue-700 dark:text-blue-400 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-blue-600 dark:before:bg-blue-500">
                                Recognitions
                            </div>
                            <h2
                                id="affiliations-heading"
                                className="font-serif font-bold text-[#0F172A] dark:text-slate-50 leading-[1.2]"
                                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
                            >
                                Our Partners &<br />
                                <em className="italic text-[#EF4523] dark:text-orange-400">
                                    Certifications
                                </em>
                            </h2>
                        </div>
                        <p className="text-[0.88rem] font-light text-slate-500 dark:text-slate-400 leading-[1.8] md:pb-1">
                            Government-recognized certifications and authorized training
                            partnerships ensuring transparency and credibility for every
                            student we train.
                        </p>
                    </div>

                    {/* ── Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-[20px] overflow-hidden">
                        {affiliations.map((item) => (
                            <div
                                key={item.title}
                                className="pac-card group relative flex flex-col bg-white dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-900/10 p-8 md:p-9 transition-colors duration-200"
                            >
                                {/* Logo + badge */}
                                <div className="relative w-20 h-13 mb-6 shrink-0" style={{ height: "52px" }}>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="80px"
                                        className="object-contain"
                                    />
                                    {/* Badge */}
                                    <span className="absolute -top-2 -right-2 text-[8px] font-medium tracking-[0.1em] uppercase text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                        {item.badge}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-serif text-[0.98rem] font-semibold text-[#0F172A] dark:text-slate-100 leading-[1.35] mb-2.5">
                                    {item.title}
                                </h3>

                                {/* Desc */}
                                <p className="text-[0.78rem] font-light text-slate-500 dark:text-slate-400 leading-[1.75] flex-1">
                                    {item.description}
                                </p>

                                {/* Bottom dash — Blue */}
                                <div
                                    className="pac-card-dash w-6 h-0.5 bg-[#1B4FBB] dark:bg-blue-500 rounded-full mt-5"
                                    aria-hidden="true"
                                />
                            </div>
                        ))}
                    </div>

                    {/* ── Trust strip ── */}
                    <div
                        className="flex items-center flex-wrap justify-center gap-3 mt-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl px-7 md:px-8 py-5"
                        aria-label="Quick recognition summary"
                    >
                        <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                            Verified by
                        </span>

                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 shrink-0 max-sm:hidden" aria-hidden="true" />

                        {stripItems.map((item, i) => (
                            <span key={item} className="contents">
                                <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-normal text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                    {/* Blue dot */}
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4FBB] dark:bg-blue-500 shrink-0" aria-hidden="true" />
                                    {item}
                                </span>
                                {i < stripItems.length - 1 && (
                                    <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 shrink-0 max-sm:hidden" aria-hidden="true" />
                                )}
                            </span>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}