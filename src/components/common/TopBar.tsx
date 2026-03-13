import Link from "next/link";

export default function TopBar() {
    return (
        <div className="bg-[#0F172A] dark:bg-[#020C1B] border-b border-blue-400/10 relative z-50 font-sans">
            <div className="max-w-[1100px] mx-auto px-6 h-9 flex items-center justify-between gap-4">

                {/* Left — hidden on mobile */}
                <div className="hidden md:flex items-center gap-5">
                    {[
                        { icon: "📞", text: "+91 74770 36832"        },
                        { icon: "📍", text: "Ambikapur, Chhattisgarh" },
                        { icon: "🕐", text: "Mon–Sat · 8AM–6PM"      },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {i > 0 && <span className="w-px h-3 bg-blue-400/15 shrink-0" />}
                            <span className="flex items-center gap-1.5 text-[11px] font-light text-blue-100/50 tracking-wide whitespace-nowrap">
                                <span className="text-xs opacity-70" aria-hidden="true">{item.icon}</span>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 shrink-0 ml-auto">
                    {[
                        { href: "/student/login", label: "Student Portal" },
                        { href: "/teacher/login", label: "Teacher"        },
                        { href: "/admin/login",   label: "Admin"          },
                    ].map((link, i) => (
                        <div key={link.href} className="flex items-center gap-3">
                            {i > 0 && <span className="w-px h-3 bg-blue-400/15 shrink-0" />}
                            <Link
                                href={link.href}
                                className="text-[11px] font-normal text-blue-100/50 tracking-widest hover:text-blue-300 transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        </div>
                    ))}

                    {/* OrangeRed CTA */}
                    <Link
                        href="/enquiry"
                        className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white bg-[#EF4523] hover:bg-[#D63B1B] px-3 py-1 rounded-full transition-colors duration-200 whitespace-nowrap ml-1"
                    >
                        Admission
                    </Link>
                </div>
            </div>
        </div>
    );
}