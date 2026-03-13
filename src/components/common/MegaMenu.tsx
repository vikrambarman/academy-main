import Link from "next/link";

interface Props {
    active: string | null;
    closeMenu: () => void;
}

const academyLinks = [
    { href: "/about",          label: "About Us",       desc: "Our story, mission & vision",   icon: "🏫", highlight: false, teacher: false },
    { href: "/accreditations", label: "Accreditations", desc: "Certifications & quality marks", icon: "🎖️", highlight: false, teacher: false },
    { href: "/gallery",        label: "Gallery",         desc: "Photos from our campus",         icon: "🖼️", highlight: false, teacher: false },
];

const recognitionLinks = [
    { href: "/msme",         label: "MSME Registration", desc: "Govt. registered institute", icon: "🏛️", highlight: false, teacher: false },
    { href: "/affiliations", label: "Affiliations",       desc: "Our partners & tie-ups",    icon: "🤝", highlight: false, teacher: false },
];

const resourceLinks = [
    { href: "/notices",            label: "Notices",            desc: "Admissions & announcements",    icon: "📢", highlight: true,  teacher: false },
    { href: "/verify-certificate", label: "Verify Certificate", desc: "Check your certificate online", icon: "🔍", highlight: false, teacher: false },
    { href: "/faq",                label: "FAQ",                desc: "Common questions answered",     icon: "❓", highlight: false, teacher: false },
];

const portalLinks = [
    { href: "/admin/login",   label: "Admin Login",   desc: "Staff & admin access",        icon: "🔐", highlight: false, teacher: false },
    { href: "/teacher/login", label: "Teacher Login", desc: "Teacher portal access",       icon: "🎓", highlight: false, teacher: true  },
    { href: "/student/login", label: "Student Login", desc: "Access your student portal",  icon: "📚", highlight: false, teacher: false },
];

export default function MegaMenu({ active, closeMenu }: Props) {
    if (!active) return null;

    return (
        <div className="
            absolute left-0 right-0 z-40
            bg-white dark:bg-[#0F172A]
            border-b border-slate-200 dark:border-slate-700
            shadow-[0_16px_48px_rgba(26,79,187,0.10)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]
            animate-[mmFadeIn_0.18s_ease_both]
        ">
            <style>{`
                @keyframes mmFadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="max-w-[1100px] mx-auto px-6 py-9 grid grid-cols-2 gap-12">
                {active === "academy" && (
                    <>
                        <MegaCol label="Academy"     links={academyLinks}     closeMenu={closeMenu} />
                        <MegaCol label="Recognition" links={recognitionLinks} closeMenu={closeMenu} />
                    </>
                )}
                {active === "resources" && (
                    <>
                        <MegaCol label="Resources" links={resourceLinks} closeMenu={closeMenu} showNew />
                        <MegaCol label="Portals"   links={portalLinks}   closeMenu={closeMenu} />
                    </>
                )}
            </div>
        </div>
    );
}

function MegaCol({ label, links, closeMenu, showNew }: {
    label: string;
    links: { href: string; label: string; desc: string; icon: string; highlight: boolean; teacher: boolean }[];
    closeMenu: () => void;
    showNew?: boolean;
}) {
    return (
        <div>
            {/* Column label — Blue */}
            <div className="
                flex items-center gap-2 mb-5
                text-[9px] font-medium tracking-[0.18em] uppercase
                text-blue-700 dark:text-blue-400
                before:content-[''] before:inline-block before:w-4 before:h-[1.5px]
                before:bg-blue-600 dark:before:bg-blue-500
            ">
                {label}
            </div>

            {links.map((l) => (
                <Link
                    key={l.href}
                    href={l.href}
                    onClick={closeMenu}
                    className={`
                        group relative flex items-start gap-3
                        px-3 py-2.5 rounded-xl mb-0.5
                        transition-colors duration-200 no-underline
                        ${l.teacher
                            ? "hover:bg-teal-50 dark:hover:bg-teal-900/20"
                            : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }
                    `}
                >
                    {/* Left accent bar — Blue or Teal */}
                    <span className={`
                        absolute left-0 top-2 bottom-2 w-0.5 rounded-full
                        scale-y-0 group-hover:scale-y-100
                        origin-top transition-transform duration-200
                        ${l.teacher
                            ? "bg-teal-500 dark:bg-teal-400"
                            : "bg-blue-600 dark:bg-blue-400"
                        }
                    `} />

                    {/* Icon box */}
                    <span className={`
                        w-8 h-8 shrink-0 rounded-[9px] text-[0.82rem]
                        flex items-center justify-center
                        border transition-colors duration-200
                        ${l.teacher
                            ? "bg-teal-50 border-teal-200 group-hover:bg-teal-100 dark:bg-teal-900/30 dark:border-teal-700"
                            : l.highlight
                                ? "bg-orange-50 border-orange-200 group-hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800"
                                : "bg-blue-50 border-blue-200 group-hover:bg-blue-100 dark:bg-slate-800 dark:border-slate-700"
                        }
                    `}>
                        {l.icon}
                    </span>

                    {/* Text */}
                    <div>
                        <div className={`
                            text-[0.85rem] font-medium leading-snug mb-0.5
                            ${l.highlight
                                ? "text-[#EF4523] dark:text-orange-400"
                                : l.teacher
                                    ? "text-teal-700 dark:text-teal-400"
                                    : "text-[#0F172A] dark:text-slate-100"
                            }
                        `}>
                            {l.label}
                            {showNew && l.highlight && (
                                <span className="
                                    inline-flex items-center ml-1.5 align-middle
                                    text-[8px] font-semibold tracking-wide uppercase
                                    bg-[#EF4523] text-white px-1.5 py-0.5 rounded-full
                                ">
                                    New
                                </span>
                            )}
                        </div>
                        <div className="text-[0.73rem] font-light text-slate-400 dark:text-slate-500 leading-snug">
                            {l.desc}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}