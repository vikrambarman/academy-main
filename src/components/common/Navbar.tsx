"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import MegaMenu from "./MegaMenu";
import { Menu, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [activeDesktop, setActiveDesktop]     = useState<string | null>(null);
    const [mobileOpen, setMobileOpen]           = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
    const [scrolled, setScrolled]               = useState(false);
    const [noticeCount, setNoticeCount]         = useState(0);
    const [mounted, setMounted]                 = useState(false);
    
    const megaRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Desktop Menu Mouse Handlers
    const handleMouseEnter = (key: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveDesktop(key);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDesktop(null);
        }, 150);
    };

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    }, [mobileOpen]);

    useEffect(() => {
        fetch("/api/public")
            .then(r => r.json())
            .then(d => setNoticeCount(d.data?.length || 0))
            .catch(() => {});
    }, []);

    const closeMobile = () => { setMobileOpen(false); setMobileAccordion(null); };

    const academyLinks = [
        { href:"/about",          label:"About Us"          },
        { href:"/accreditations", label:"Accreditations"    },
        { href:"/gallery",        label:"Gallery"           },
        { href:"/msme",           label:"MSME Registration" },
        { href:"/affiliations",   label:"Affiliations"      },
    ];
    const resourceLinks = [
        { href:"/notices",            label:"Notices"            },
        { href:"/verify-certificate", label:"Verify Certificate" },
        { href:"/faq",                label:"FAQ"                },
        { href:"/student/login",      label:"Student Login"      },
        { href:"/admin/login",        label:"Admin Login"        },
    ];

    return (
        <>
            <style>{`
                .nb-nav-link, .nb-nav-btn {
                    color: var(--color-text-muted);
                    transition: background 0.2s, color 0.2s;
                }
                .nb-nav-link:hover, .nb-nav-btn:hover,
                .nb-nav-btn[aria-expanded="true"] {
                    background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg));
                    color: var(--color-primary);
                }
                .nb-drawer-link {
                    color: var(--color-text);
                    transition: background 0.2s, color 0.2s;
                }
                .nb-drawer-link:hover {
                    background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg));
                    color: var(--color-primary);
                }
                .nb-drawer-acc-open {
                    background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg));
                    color: var(--color-primary);
                }
                .nb-drawer-sublink {
                    color: var(--color-text-muted);
                    border-left: 2px solid transparent;
                    transition: background 0.2s, color 0.2s, border-color 0.2s;
                }
                .nb-drawer-sublink:hover {
                    background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg));
                    color: var(--color-primary);
                    border-left-color: var(--color-primary);
                }
                @keyframes mobFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `}</style>

            {/* ── DESKTOP NAVBAR ── */}
            <header
                className={cn("sticky top-0 z-30 font-sans transition-all duration-300")}
                style={{
                    background: scrolled
                        ? "color-mix(in srgb, var(--color-bg) 97%, transparent)"
                        : "color-mix(in srgb, var(--color-bg) 92%, transparent)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    // boxShadow: scrolled
                    //     ? "0 1px 0 var(--color-border), 0 4px 24px color-mix(in srgb,var(--color-primary) 8%,transparent)"
                    //     : "none",
                    // borderBottom: scrolled ? "none" : "1px solid color-mix(in srgb,var(--color-border) 60%,transparent)",
                }}
            >
                <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

                    {/* Hamburger */}
                    <button
                        className="flex lg:hidden bg-transparent border-none cursor-pointer p-1"
                        style={{ color:"var(--color-text)" }}
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} strokeWidth={1.8} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
                        <Image src="/logo.png" alt="Shivshakti Computer Academy" width={36} height={36} />
                        <div className="hidden sm:block">
                            <div className="font-serif text-[1rem] font-semibold leading-snug"
                                style={{ color:"var(--color-text)" }}>
                                Shivshakti Computer Academy
                            </div>
                            <div className="text-[0.65rem] font-light tracking-[0.06em] mt-px"
                                style={{ color:"var(--color-primary)" }}>
                                Computer Education · Ambikapur
                            </div>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav aria-label="Main navigation" className="hidden lg:block h-full">
                        <ul className="flex items-center gap-1 list-none m-0 p-0 h-full">

                            {[{ href:"/", label:"Home" }, { href:"/courses", label:"Courses" }].map(l => (
                                <li key={l.href} className="flex items-center h-full">
                                    <Link href={l.href}
                                        className="nb-nav-link flex items-center gap-1 text-[0.85rem] font-normal no-underline px-3 py-1.5 rounded-lg whitespace-nowrap">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}

                            {(["academy", "resources"] as const).map(key => (
                                <li key={key} 
                                    className="relative flex items-center h-full"
                                    onMouseEnter={() => handleMouseEnter(key)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button
                                        aria-expanded={activeDesktop === key}
                                        className="nb-nav-btn flex items-center gap-1 text-[0.85rem] font-normal capitalize px-3 py-1.5 rounded-lg border-none bg-transparent cursor-pointer whitespace-nowrap"
                                    >
                                        {key}
                                        {key === "resources" && noticeCount > 0 && (
                                            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full tracking-wide"
                                                style={{ background:"var(--color-accent)", color:"#fff" }}>
                                                {noticeCount}
                                            </span>
                                        )}
                                        <ChevronDown size={14} strokeWidth={2}
                                            className={cn("shrink-0 transition-transform duration-200", activeDesktop === key ? "rotate-180" : "")}
                                            style={{ color: activeDesktop === key ? "var(--color-primary)" : "var(--color-text-muted)" }}
                                        />
                                    </button>
                                </li>
                            ))}

                            <li className="flex items-center h-full">
                                <Link href="/contact"
                                    className="nb-nav-link flex items-center gap-1 text-[0.85rem] font-normal no-underline px-3 py-1.5 rounded-lg">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Right — ThemeToggle + CTA */}
                    <div className="flex items-center gap-3 shrink-0">
                        <ThemeToggle />
                        <Link href="/enquiry"
                            className="hidden lg:inline-flex items-center gap-1 text-[0.82rem] font-medium px-5 py-2 rounded-full no-underline whitespace-nowrap transition-all duration-200 hover:-translate-y-px"
                            style={{
                                color:"#fff",
                                background:"var(--color-accent)",
                                boxShadow:"0 2px 12px color-mix(in srgb,var(--color-accent) 35%,transparent)",
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.background = "color-mix(in srgb,var(--color-accent) 85%,#000)";
                                el.style.boxShadow = "0 4px 20px color-mix(in srgb,var(--color-accent) 40%,transparent)";
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.background = "var(--color-accent)";
                                el.style.boxShadow = "0 2px 12px color-mix(in srgb,var(--color-accent) 35%,transparent)";
                            }}>
                            Admission →
                        </Link>
                    </div>
                </div>

                {/* MegaMenu Container */}
                <div 
                    ref={megaRef} 
                    className="hidden lg:block relative"
                    onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
                    onMouseLeave={handleMouseLeave}
                >
                    <MegaMenu active={activeDesktop} closeMenu={() => setActiveDesktop(null)} />
                </div>
            </header>

            {/* ── MOBILE DRAWER ── */}
            {mounted && createPortal(
                <>
                    {mobileOpen && (
                        <div
                            className="fixed inset-0 z-[9998] animate-[mobFadeIn_0.2s_ease]"
                            style={{ background:"rgba(15,23,42,0.5)" }}
                            onClick={closeMobile}
                            aria-hidden="true"
                        />
                    )}

                    <div
                        className={cn(
                            "fixed top-0 left-0 h-full w-[300px] z-[9999]",
                            "flex flex-col overflow-y-auto",
                            "transition-transform duration-[280ms] ease-in-out",
                            mobileOpen ? "translate-x-0" : "-translate-x-full"
                        )}
                        style={{ background:"var(--color-bg)", borderRight:"1px solid var(--color-border)" }}
                        role="dialog" aria-modal="true" aria-label="Navigation menu"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-5 py-4 shrink-0"
                            style={{ borderBottom:"1px solid var(--color-border)" }}>
                            <Link href="/"
                                className="font-serif text-[0.95rem] font-semibold no-underline"
                                style={{ color:"var(--color-text)" }}
                                onClick={closeMobile}>
                                Shivshakti Academy
                            </Link>
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <button
                                    className="bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200"
                                    style={{ color:"var(--color-text-muted)" }}
                                    onClick={closeMobile}
                                    aria-label="Close menu"
                                    onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb,var(--color-border) 60%,transparent)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <X size={18} strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        {/* Drawer body */}
                        <div className="px-4 py-4 pb-8 flex flex-col gap-0.5 flex-1">

                            {["Home", "Courses", "Contact"].map(label => (
                                <Link key={label}
                                    href={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                                    className="nb-drawer-link block text-[0.88rem] font-normal no-underline px-3.5 py-2.5 rounded-xl"
                                    onClick={closeMobile}>
                                    {label}
                                </Link>
                            ))}

                            {[
                                { key:"academy",   label:"Academy",   links:academyLinks  },
                                { key:"resources", label:"Resources", links:resourceLinks },
                            ].map(({ key, label, links }) => (
                                <div key={key}>
                                    <button
                                        className={cn(
                                            "flex items-center justify-between w-full text-left",
                                            "text-[0.88rem] font-normal px-3.5 py-2.5 rounded-xl border-none bg-transparent cursor-pointer",
                                            mobileAccordion === key ? "nb-drawer-acc-open" : "nb-drawer-link"
                                        )}
                                        onClick={() => setMobileAccordion(mobileAccordion === key ? null : key)}
                                    >
                                        <span className="flex items-center gap-2">
                                            {label}
                                            {key === "resources" && noticeCount > 0 && (
                                                <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                                                    style={{ background:"var(--color-accent)", color:"#fff" }}>
                                                    {noticeCount}
                                                </span>
                                            )}
                                        </span>
                                        <ChevronDown size={14} strokeWidth={2}
                                            className={cn("shrink-0 transition-transform duration-200", mobileAccordion === key ? "rotate-180" : "")}
                                            style={{ color: mobileAccordion === key ? "var(--color-primary)" : "var(--color-text-muted)" }}
                                        />
                                    </button>

                                    <div className={cn(
                                        "overflow-hidden transition-all duration-[280ms] ease-in-out",
                                        mobileAccordion === key ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                                    )}>
                                        <div className="pl-3.5 py-1.5 flex flex-col gap-px">
                                            {links.map(l => (
                                                <Link key={l.href} href={l.href}
                                                    className="nb-drawer-sublink flex items-center gap-2 no-underline text-[0.82rem] font-light px-3 py-2 rounded-lg"
                                                    onClick={closeMobile}>
                                                    {l.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="h-px my-2.5" style={{ background:"var(--color-border)" }} />

                            <Link href="/enquiry"
                                className="block text-center no-underline mt-3 text-[0.9rem] font-medium px-4 py-3.5 rounded-2xl transition-colors duration-200"
                                style={{
                                    color:"#fff",
                                    background:"var(--color-accent)",
                                    boxShadow:"0 2px 12px color-mix(in srgb,var(--color-accent) 30%,transparent)",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb,var(--color-accent) 85%,#000)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "var(--color-accent)")}
                                onClick={closeMobile}>
                                Admission Enquiry →
                            </Link>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
}