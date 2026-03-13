import {
    MonitorCheck,
    Award,
    Briefcase,
    Users,
    ShieldCheck,
    Rocket,
} from "lucide-react";

const points = [
    { icon: MonitorCheck, title: "Practical Computer Training", desc: "Hands-on learning with dedicated systems and real-time practical sessions." },
    { icon: Award, title: "Recognized Certifications", desc: "Certificates aligned with Skill India initiatives and DigiLocker verification." },
    { icon: Briefcase, title: "Career-Oriented Programs", desc: "Industry-focused courses designed for employment and digital careers." },
    { icon: Users, title: "Supportive Learning", desc: "Guided training environment that helps students learn confidently." },
    { icon: ShieldCheck, title: "Trusted Local Institute", desc: "Established computer training institute serving Ambikapur and nearby regions." },
    { icon: Rocket, title: "Skill-Based Growth", desc: "Programs designed for job readiness, freelancing and self-employment." },
];

const highlights = [
    { icon: MonitorCheck, title: "Practical-First Learning", desc: "Every course emphasizes hands-on computer practice from day one." },
    { icon: Award, title: "Verified Certifications", desc: "Certificates supported by recognised national platforms." },
    { icon: Briefcase, title: "Career-Oriented Curriculum", desc: "Programs designed for real-world digital career opportunities." },
];

export default function WhyChooseUs() {
    return (
        <>
            <style>{`
                /* Top fade line */
                .wcu-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #CBD5E1, transparent);
                }

                /* Highlight item — left accent bar */
                .wcu-highlight-item::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 2px;
                    background: #1B4FBB;
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 0.24s ease;
                }
                .wcu-highlight-item:hover::before { transform: scaleY(1); }

                /* Feature card — top accent bar */
                .wcu-feat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: #1B4FBB;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.26s ease;
                }
                .wcu-feat-card:hover::before { transform: scaleX(1); }

                /* Dash expand */
                .wcu-feat-dash { transition: width 0.26s ease; }
                .wcu-feat-card:hover .wcu-feat-dash { width: 40px; }
            `}</style>

            <section
                className="wcu-root relative overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A] py-20 md:py-24 px-6"
                aria-labelledby="why-choose-heading"
            >
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[72px] items-start">

                    {/* ════ LEFT ════ */}
                    <div className="md:sticky md:top-8">

                        {/* Eyebrow */}
                        <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase text-blue-700 dark:text-blue-400 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-blue-600 dark:before:bg-blue-500">
                            Why Choose Us
                        </div>

                        <h2
                            id="why-choose-heading"
                            className="font-serif font-bold text-[#0F172A] dark:text-slate-50 leading-[1.2]"
                            style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.5rem)" }}
                        >
                            Why Students Choose<br />
                            <em className="italic text-[#EF4523] dark:text-orange-400">
                                Shivshakti Academy
                            </em>
                        </h2>

                        <p className="text-[0.88rem] font-light text-slate-500 dark:text-slate-400 leading-[1.8] mt-4 max-w-[420px]">
                            Our training approach combines practical computer education,
                            recognised certifications and career-focused learning — helping
                            students build strong digital skills for the modern workplace.
                        </p>

                        {/* Highlight list */}
                        <div className="mt-10 flex flex-col border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-[#1E293B]">
                            {highlights.map((h) => {
                                const Icon = h.icon;
                                return (
                                    <div
                                        key={h.title}
                                        className="wcu-highlight-item group relative flex items-start gap-3.5 px-5 py-5 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                                    >
                                        {/* Icon */}
                                        <div className="w-[34px] h-[34px] shrink-0 rounded-[9px] flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 group-hover:bg-[#1B4FBB] group-hover:border-[#1B4FBB] group-hover:text-white transition-colors duration-200" aria-hidden="true">
                                            <Icon size={16} strokeWidth={1.8} />
                                        </div>
                                        <div>
                                            <div className="text-[0.88rem] font-medium text-[#0F172A] dark:text-slate-100 mb-0.5">
                                                {h.title}
                                            </div>
                                            <div className="text-[0.78rem] font-light text-slate-500 dark:text-slate-400 leading-[1.6]">
                                                {h.desc}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ════ RIGHT — feature grid ════ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-[20px] overflow-hidden">
                        {points.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="wcu-feat-card group relative flex flex-col bg-white dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-900/10 px-6 py-7 transition-colors duration-200"
                                >
                                    {/* Icon */}
                                    <div className="w-9 h-9 shrink-0 rounded-[10px] flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 group-hover:bg-[#1B4FBB] group-hover:border-[#1B4FBB] group-hover:text-white transition-colors duration-200" aria-hidden="true">
                                        <Icon size={17} strokeWidth={1.8} />
                                    </div>

                                    {/* Title */}
                                    <div className="text-[0.85rem] font-medium text-[#0F172A] dark:text-slate-100 mt-4 mb-1.5 leading-[1.3]">
                                        {item.title}
                                    </div>

                                    {/* Desc */}
                                    <div className="text-[0.76rem] font-light text-slate-500 dark:text-slate-400 leading-[1.7] flex-1">
                                        {item.desc}
                                    </div>

                                    {/* Bottom dash — Blue */}
                                    <div
                                        className="wcu-feat-dash w-5 h-0.5 bg-[#1B4FBB] dark:bg-blue-500 rounded-full mt-4"
                                        aria-hidden="true"
                                    />
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>
        </>
    );
}