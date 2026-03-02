"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MegaMenu from "./MegaMenu";

export default function Navbar() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-md shadow-md"
                    : "bg-white/70 backdrop-blur-sm"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                    <span className="font-semibold text-gray-900 text-lg tracking-tight">
                        Shivshakti Computer Academy
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">

                    <Link href="/" className="hover:text-black transition">
                        Home
                    </Link>

                    <Link href="/courses" className="hover:text-black transition">
                        Courses
                    </Link>

                    <button
                        onClick={() =>
                            setActiveMenu(activeMenu === "academy" ? null : "academy")
                        }
                        className="hover:text-black transition"
                    >
                        Academy ▾
                    </button>

                    <button
                        onClick={() =>
                            setActiveMenu(activeMenu === "resources" ? null : "resources")
                        }
                        className="hover:text-black transition"
                    >
                        Resources ▾
                    </button>

                    <Link href="/contact" className="hover:text-black transition">
                        Contact
                    </Link>

                    {/* CTA */}
                    <Link
                        href="/enquiry"
                        className="ml-4 px-6 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition shadow-sm"
                    >
                        Admission
                    </Link>

                </nav>

            </div>

            {/* Mega Menu */}
            <div className="relative">
                <MegaMenu active={activeMenu} />
            </div>

        </header>
    );
}