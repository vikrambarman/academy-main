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
    const [activeDesktop, setActiveDesktop] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen]       = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
    const [scrolled, setScrolled]           = useState(false);
    const [noticeCount, setNoticeCount]     = useState(0);
    const [mounted, setMounted]             = useState(false);
    const megaRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (megaRef.current && !megaRef.current.contains(e.target as Node))
                setActiveDesktop(null);
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    }, [mobileOpen]);

    useEffect(() => {
        fetch("/api/public")
            .then((r) => r.json())
            .then((d) => setNoticeCount(d.data?.length || 0))
            .catch(() => {});
    }, []);

    const closeMobile = () => { setMobileOpen(false); setMobileAccordion(null); };

    const academyLinks = [
        { href: "/about",          label: "About Us"          },
        { href: "/accreditations", label: "Accreditations"    },
        { href: "/gallery",        label: "Gallery"           },
        { href: "/msme",           label: "MSME Registration" },
        { href: "/affiliations",   label: "Affiliations"      },
    ];
    const resourceLinks = [
        { href: "/notices",            label: "Notices"            },
        { href: "/verify-certificate", label: "Verify Certificate" },
        { href: "/faq",                label: "FAQ"                },
        { href: "/student/login",      label: "Student Login"      },
        { href: "/admin/login",        label: "Admin Login"        },
    ];

    return (
        <>
            {/* ══════════════════════════════════
                DESKTOP NAVBAR
            ══════════════════════════════════ */}
            <header className={cn(
                "sticky top-0 z-30 font-sans transition-all duration-300",
                scrolled
                    ? "bg-white/[0.97] dark:bg-[#0F172A]/[0.97] backdrop-blur-xl shadow-[0_1px_0_#E2E8F0,0_4px_24px_rgba(26,79,187,0.08)] dark:shadow-[0_1px_0_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.3)]"
                    : "bg-white/[0.92] dark:bg-[#0F172A]/[0.92] backdrop-blur-lg border-slate-200/60 dark:border-slate-700/60"
            )}>
                <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

                    {/* Hamburger */}
                    <button
                        className="flex lg:hidden bg-transparent border-none cursor-pointer text-slate-700 dark:text-slate-200 p-1"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} strokeWidth={1.8} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
                        <Image src="/logo.png" alt="Shivshakti Computer Academy" width={36} height={36} />
                        <div className="hidden sm:block">
                            <div className="font-serif text-[1rem] font-semibold text-[#0F172A] dark:text-slate-100 leading-snug">
                                Shivshakti Computer Academy
                            </div>
                            <div className="text-[0.65rem] font-light text-blue-600 dark:text-blue-400 tracking-[0.06em] mt-px">
                                Computer Education · Ambikapur
                            </div>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav aria-label="Main navigation" className="hidden lg:block">
                        <ul className="flex items-center gap-1 list-none m-0 p-0">

                            {/* Static links */}
                            {[
                                { href: "/",        label: "Home"    },
                                { href: "/courses", label: "Courses" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className={cn(
                                            "flex items-center gap-1 text-[0.85rem] font-normal no-underline",
                                            "text-slate-600 dark:text-slate-300",
                                            "px-3 py-1.5 rounded-lg",
                                            "hover:bg-blue-50 hover:text-blue-700",
                                            "dark:hover:bg-blue-900/30 dark:hover:text-blue-300",
                                            "transition-colors duration-200 whitespace-nowrap"
                                        )}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}

                            {/* Dropdown buttons */}
                            {(["academy", "resources"] as const).map((key) => (
                                <li key={key}>
                                    <button
                                        onClick={() => setActiveDesktop(activeDesktop === key ? null : key)}
                                        aria-expanded={activeDesktop === key}
                                        className={cn(
                                            "flex items-center gap-1 text-[0.85rem] font-normal capitalize",
                                            "px-3 py-1.5 rounded-lg border-none bg-transparent cursor-pointer",
                                            "transition-colors duration-200 whitespace-nowrap",
                                            activeDesktop === key
                                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                                        )}
                                    >
                                        {key}
                                        {key === "resources" && noticeCount > 0 && (
                                            <span className="text-[8px] font-semibold bg-[#EF4523] text-white px-1.5 py-0.5 rounded-full tracking-wide">
                                                {noticeCount}
                                            </span>
                                        )}
                                        <ChevronDown
                                            size={14} strokeWidth={2}
                                            className={cn(
                                                "shrink-0 transition-transform duration-200",
                                                activeDesktop === key
                                                    ? "rotate-180 text-blue-600 dark:text-blue-400"
                                                    : "text-slate-400 dark:text-slate-500"
                                            )}
                                        />
                                    </button>
                                </li>
                            ))}

                            {/* Contact */}
                            <li>
                                <Link
                                    href="/contact"
                                    className={cn(
                                        "flex items-center gap-1 text-[0.85rem] font-normal no-underline",
                                        "text-slate-600 dark:text-slate-300",
                                        "px-3 py-1.5 rounded-lg",
                                        "hover:bg-blue-50 hover:text-blue-700",
                                        "dark:hover:bg-blue-900/30 dark:hover:text-blue-300",
                                        "transition-colors duration-200"
                                    )}
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Right — ThemeToggle + CTA */}
                    <div className="flex items-center gap-3 shrink-0">
                        <ThemeToggle />
                        <Link
                            href="/enquiry"
                            className={cn(
                                "hidden lg:inline-flex items-center gap-1",
                                "text-[0.82rem] font-medium text-white",
                                "bg-[#EF4523] hover:bg-[#D63B1B]",
                                "px-5 py-2 rounded-full no-underline whitespace-nowrap",
                                "shadow-[0_2px_12px_rgba(239,69,35,0.35)]",
                                "hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(239,69,35,0.4)]",
                                "transition-all duration-200"
                            )}
                        >
                            Admission →
                        </Link>
                    </div>
                </div>

                {/* MegaMenu */}
                <div ref={megaRef} className="hidden lg:block relative">
                    <MegaMenu active={activeDesktop} closeMenu={() => setActiveDesktop(null)} />
                </div>
            </header>

            {/* ══════════════════════════════════
                MOBILE DRAWER
            ══════════════════════════════════ */}
            {mounted && createPortal(
                <>
                    {/* Overlay */}
                    {mobileOpen && (
                        <div
                            className="fixed inset-0 bg-[rgba(15,23,42,0.5)] z-[9998] animate-[mobFadeIn_0.2s_ease]"
                            onClick={closeMobile}
                            aria-hidden="true"
                        />
                    )}

                    {/* Drawer */}
                    <div
                        className={cn(
                            "fixed top-0 left-0 h-full w-[300px] z-[9999]",
                            "bg-white dark:bg-[#0F172A]",
                            "border-r border-slate-200 dark:border-slate-700",
                            "flex flex-col overflow-y-auto",
                            "transition-transform duration-[280ms] ease-in-out",
                            mobileOpen ? "translate-x-0" : "-translate-x-full"
                        )}
                        role="dialog" aria-modal="true" aria-label="Navigation menu"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                            <Link
                                href="/"
                                className="font-serif text-[0.95rem] font-semibold text-[#0F172A] dark:text-slate-100 no-underline"
                                onClick={closeMobile}
                            >
                                Shivshakti Academy
                            </Link>
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <button
                                    className="bg-transparent border-none cursor-pointer text-slate-500 dark:text-slate-400 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                                    onClick={closeMobile}
                                    aria-label="Close menu"
                                >
                                    <X size={18} strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        {/* Drawer body */}
                        <div className="px-4 py-4 pb-8 flex flex-col gap-0.5 flex-1">

                            {/* Static links */}
                            {["Home", "Courses", "Contact"].map((label) => (
                                <Link
                                    key={label}
                                    href={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                                    className={cn(
                                        "block text-[0.88rem] font-normal no-underline",
                                        "text-slate-700 dark:text-slate-200",
                                        "px-3.5 py-2.5 rounded-xl",
                                        "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                                        "hover:text-blue-700 dark:hover:text-blue-300",
                                        "transition-colors duration-200"
                                    )}
                                    onClick={closeMobile}
                                >
                                    {label}
                                </Link>
                            ))}

                            {/* Accordions */}
                            {[
                                { key: "academy",   label: "Academy",   links: academyLinks   },
                                { key: "resources", label: "Resources", links: resourceLinks  },
                            ].map(({ key, label, links }) => (
                                <div key={key}>
                                    <button
                                        className={cn(
                                            "flex items-center justify-between w-full text-left",
                                            "text-[0.88rem] font-normal",
                                            "px-3.5 py-2.5 rounded-xl border-none bg-transparent cursor-pointer",
                                            "transition-colors duration-200",
                                            mobileAccordion === key
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                                : "text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300"
                                        )}
                                        onClick={() => setMobileAccordion(mobileAccordion === key ? null : key)}
                                    >
                                        <span className="flex items-center gap-2">
                                            {label}
                                            {key === "resources" && noticeCount > 0 && (
                                                <span className="text-[8px] font-semibold bg-[#EF4523] text-white px-1.5 py-0.5 rounded-full">
                                                    {noticeCount}
                                                </span>
                                            )}
                                        </span>
                                        <ChevronDown
                                            size={14} strokeWidth={2}
                                            className={cn(
                                                "shrink-0 transition-transform duration-200",
                                                mobileAccordion === key
                                                    ? "rotate-180 text-blue-600 dark:text-blue-400"
                                                    : "text-slate-400 dark:text-slate-500"
                                            )}
                                        />
                                    </button>

                                    {/* Accordion content */}
                                    <div className={cn(
                                        "overflow-hidden transition-all duration-[280ms] ease-in-out",
                                        mobileAccordion === key ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                                    )}>
                                        <div className="pl-3.5 py-1.5 flex flex-col gap-px">
                                            {links.map((l) => (
                                                <Link
                                                    key={l.href}
                                                    href={l.href}
                                                    className={cn(
                                                        "flex items-center gap-2 no-underline",
                                                        "text-[0.82rem] font-light",
                                                        "text-slate-500 dark:text-slate-400",
                                                        "px-3 py-2 rounded-lg",
                                                        "border-l-2 border-transparent",
                                                        "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                                                        "hover:text-blue-700 dark:hover:text-blue-300",
                                                        "hover:border-l-blue-600 dark:hover:border-l-blue-400",
                                                        "transition-all duration-200"
                                                    )}
                                                    onClick={closeMobile}
                                                >
                                                    {l.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Divider */}
                            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2.5" />

                            {/* Mobile CTA — OrangeRed */}
                            <Link
                                href="/enquiry"
                                className={cn(
                                    "block text-center no-underline mt-3",
                                    "text-[0.9rem] font-medium text-white",
                                    "bg-[#EF4523] hover:bg-[#D63B1B]",
                                    "px-4 py-3.5 rounded-2xl",
                                    "shadow-[0_2px_12px_rgba(239,69,35,0.3)]",
                                    "transition-colors duration-200"
                                )}
                                onClick={closeMobile}
                            >
                                Admission Enquiry →
                            </Link>
                        </div>
                    </div>

                    <style>{`
                        @keyframes mobFadeIn {
                            from { opacity: 0; }
                            to   { opacity: 1; }
                        }
                    `}</style>
                </>,
                document.body
            )}
        </>
    );
}