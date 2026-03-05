"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import MegaMenu from "./MegaMenu";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
    const [activeDesktop, setActiveDesktop] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [noticeCount, setNoticeCount] = useState(0);
    const [mounted, setMounted] = useState(false);

    const megaRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close desktop mega menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
                setActiveDesktop(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    }, [mobileOpen]);

    const closeMobile = () => {
        setMobileOpen(false);
        setMobileAccordion(null);
    };

    useEffect(() => {
        const fetchNoticeCount = async () => {
            try {
                const res = await fetch("/api/public");
                const data = await res.json();
                setNoticeCount(data.data?.length || 0);
            } catch { }
        };
        fetchNoticeCount();
    }, []);

    return (
        <>
            <header
                className={`sticky top-0 z-30 transition-all duration-300 ${scrolled
                        ? "bg-white shadow-md"
                        : "bg-white/90 backdrop-blur"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
                    <button
                        className="lg:hidden"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu size={26} />
                    </button>

                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={38}
                            height={38}
                        />
                        <span className="hidden sm:block font-semibold text-gray-900 text-lg">
                            Shivshakti Computer Academy
                        </span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
                        <Link href="/">Home</Link>
                        <Link href="/courses">Courses</Link>

                        <button
                            onClick={() =>
                                setActiveDesktop(
                                    activeDesktop === "academy"
                                        ? null
                                        : "academy"
                                )
                            }
                            className="flex items-center gap-1"
                        >
                            Academy <ChevronDown size={16} />
                        </button>

                        <button
                            onClick={() =>
                                setActiveDesktop(
                                    activeDesktop === "resources"
                                        ? null
                                        : "resources"
                                )
                            }
                            className="flex items-center gap-1 relative"
                        >
                            Resources
                            {noticeCount > 0 && (
                                <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {noticeCount}
                                </span>
                            )}
                            <ChevronDown size={16} />
                        </button>

                        <Link href="/contact">Contact</Link>

                        <Link
                            href="/enquiry"
                            className="ml-4 px-6 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
                        >
                            Admission
                        </Link>
                    </nav>
                </div>

                <div ref={megaRef} className="relative hidden lg:block">
                    <MegaMenu
                        active={activeDesktop}
                        closeMenu={() => setActiveDesktop(null)}
                    />
                </div>
            </header>

            {/* MOBILE DRAWER VIA PORTAL */}
            {mounted &&
                createPortal(
                    <>
                        {mobileOpen && (
                            <div
                                className="fixed inset-0 bg-black/40 z-[9998] lg:hidden"
                                onClick={closeMobile}
                            />
                        )}

                        <div
                            className={`fixed top-0 left-0 h-full w-80 bg-white z-[9999] shadow-xl transform transition-transform duration-300 lg:hidden ${mobileOpen
                                    ? "translate-x-0"
                                    : "-translate-x-full"
                                }`}
                        >
                            <div className="p-6 flex justify-between items-center border-b">
                                <span className="font-semibold text-gray-900">
                                    Menu
                                </span>
                                <button onClick={closeMobile}>
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col gap-5 text-sm font-medium text-gray-700">
                                <Link href="/" onClick={closeMobile}>
                                    Home
                                </Link>

                                <Link
                                    href="/courses"
                                    onClick={closeMobile}
                                >
                                    Courses
                                </Link>

                                {/* Academy Accordion */}
                                <div>
                                    <button
                                        onClick={() =>
                                            setMobileAccordion(
                                                mobileAccordion === "academy"
                                                    ? null
                                                    : "academy"
                                            )
                                        }
                                        className="flex justify-between items-center w-full py-2"
                                    >
                                        Academy
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${mobileAccordion === "academy"
                                                    ? "rotate-180"
                                                    : ""
                                                }`}
                                        />
                                    </button>

                                    {mobileAccordion === "academy" && (
                                        <div className="mt-2 pl-4 flex flex-col gap-3 text-gray-600">
                                            <Link
                                                href="/about"
                                                onClick={closeMobile}
                                            >
                                                About
                                            </Link>
                                            <Link
                                                href="/accreditations"
                                                onClick={closeMobile}
                                            >
                                                Accreditations
                                            </Link>
                                            <Link
                                                href="/gallery"
                                                onClick={closeMobile}
                                            >
                                                Gallery
                                            </Link>
                                            <Link
                                                href="/msme"
                                                onClick={closeMobile}
                                            >
                                                MSME Registration
                                            </Link>
                                            <Link
                                                href="/affiliations"
                                                onClick={closeMobile}
                                            >
                                                Affiliations
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Resources Accordion */}
                                <div>
                                    <button
                                        onClick={() =>
                                            setMobileAccordion(
                                                mobileAccordion === "resources"
                                                    ? null
                                                    : "resources"
                                            )
                                        }
                                        className="flex justify-between items-center w-full py-2"
                                    >
                                        Resources
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${mobileAccordion === "resources"
                                                    ? "rotate-180"
                                                    : ""
                                                }`}
                                        />
                                    </button>

                                    {mobileAccordion === "resources" && (
                                        <div className="mt-2 pl-4 flex flex-col gap-3 text-gray-600">
                                            <Link
                                                href="/notices"
                                                onClick={closeMobile}
                                            >
                                                Notices
                                            </Link>
                                            <Link
                                                href="/verify-certificate"
                                                onClick={closeMobile}
                                            >
                                                Verify Certificate
                                            </Link>
                                            <Link
                                                href="/faq"
                                                onClick={closeMobile}
                                            >
                                                FAQ
                                            </Link>
                                            <Link
                                                href="/student/login"
                                                onClick={closeMobile}
                                            >
                                                Student Login
                                            </Link>
                                            <Link
                                                href="/admin/login"
                                                onClick={closeMobile}
                                            >
                                                Admin Login
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/contact"
                                    onClick={closeMobile}
                                >
                                    Contact
                                </Link>

                                <Link
                                    href="/enquiry"
                                    onClick={closeMobile}
                                    className="mt-4 block text-center px-6 py-3 rounded-xl bg-black text-white"
                                >
                                    Admission
                                </Link>
                            </div>
                        </div>
                    </>,
                    document.body
                )}
        </>
    );
}