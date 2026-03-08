// ============================================================
// Navbar.tsx
// ============================================================
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
                setActiveDesktop(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            } catch {}
        };
        fetchNoticeCount();
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

                .nav-root {
                    font-family: 'DM Sans', sans-serif;
                    position: sticky;
                    top: 0;
                    z-index: 30;
                    transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                }

                .nav-root.scrolled {
                    background: rgba(250,248,244,0.97);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 1px 0 #e8dfd0, 0 4px 24px rgba(100,70,20,0.07);
                }

                .nav-root.top {
                    background: rgba(250,248,244,0.92);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border-bottom: 1px solid rgba(232,223,208,0.6);
                }

                .nav-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 24px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                }

                /* ── Logo ── */
                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    flex-shrink: 0;
                }

                .nav-logo-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .nav-logo-sub {
                    font-size: 0.65rem;
                    font-weight: 300;
                    color: #92826b;
                    letter-spacing: 0.04em;
                    margin-top: 1px;
                }

                /* ── Desktop nav ── */
                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.85rem;
                    font-weight: 400;
                    color: #4a3f30;
                    text-decoration: none;
                    padding: 6px 12px;
                    border-radius: 8px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    transition: background 0.18s, color 0.18s;
                    white-space: nowrap;
                }

                .nav-link:hover,
                .nav-link.active {
                    background: #fef9ee;
                    color: #1a1208;
                }

                .nav-link.active {
                    color: #b45309;
                }

                .nav-chevron {
                    transition: transform 0.22s ease;
                    color: #92826b;
                    flex-shrink: 0;
                }

                .nav-link.active .nav-chevron {
                    transform: rotate(180deg);
                    color: #b45309;
                }

                /* Notice badge */
                .nav-notice-badge {
                    font-size: 8px;
                    font-weight: 600;
                    background: #d97706;
                    color: #fff;
                    padding: 2px 6px;
                    border-radius: 100px;
                    letter-spacing: 0.04em;
                }

                /* CTA */
                .nav-cta {
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    padding: 9px 20px;
                    border-radius: 100px;
                    text-decoration: none;
                    white-space: nowrap;
                    margin-left: 8px;
                    transition: background 0.18s, transform 0.15s;
                    flex-shrink: 0;
                }

                .nav-cta:hover {
                    background: #2d1f0d;
                    transform: translateY(-1px);
                }

                /* Mobile hamburger */
                .nav-hamburger {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #1a1208;
                    padding: 4px;
                }

                @media (max-width: 960px) {
                    .nav-links { display: none; }
                    .nav-cta { display: none; }
                    .nav-hamburger { display: flex; }
                }

                /* ── Mobile drawer ── */
                .mob-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(26,18,8,0.45);
                    z-index: 9998;
                    animation: mobFadeIn 0.2s ease;
                }

                @keyframes mobFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                .mob-drawer {
                    position: fixed;
                    top: 0; left: 0;
                    height: 100%;
                    width: 300px;
                    background: #faf8f4;
                    z-index: 9999;
                    transform: translateX(-100%);
                    transition: transform 0.28s ease;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }

                .mob-drawer.open {
                    transform: translateX(0);
                }

                /* Drawer header */
                .mob-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 20px 18px;
                    border-bottom: 1px solid #e8dfd0;
                    flex-shrink: 0;
                }

                .mob-logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #1a1208;
                    text-decoration: none;
                }

                .mob-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6b5e4b;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    transition: background 0.18s;
                }

                .mob-close:hover {
                    background: #f0e8d8;
                }

                /* Drawer body */
                .mob-body {
                    padding: 16px 16px 32px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    flex: 1;
                }

                .mob-link {
                    display: block;
                    font-size: 0.88rem;
                    font-weight: 400;
                    color: #1a1208;
                    text-decoration: none;
                    padding: 11px 14px;
                    border-radius: 10px;
                    transition: background 0.18s;
                }

                .mob-link:hover {
                    background: #fef9ee;
                    color: #b45309;
                }

                /* Accordion trigger */
                .mob-acc-btn {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    font-size: 0.88rem;
                    font-weight: 400;
                    color: #1a1208;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 11px 14px;
                    border-radius: 10px;
                    text-align: left;
                    transition: background 0.18s;
                }

                .mob-acc-btn:hover,
                .mob-acc-btn.open {
                    background: #fef9ee;
                    color: #b45309;
                }

                .mob-acc-chevron {
                    transition: transform 0.22s ease;
                    color: #92826b;
                    flex-shrink: 0;
                }

                .mob-acc-btn.open .mob-acc-chevron {
                    transform: rotate(180deg);
                    color: #b45309;
                }

                /* Accordion content */
                .mob-acc-content {
                    overflow: hidden;
                    max-height: 0;
                    transition: max-height 0.28s ease, opacity 0.22s ease;
                    opacity: 0;
                }

                .mob-acc-content.open {
                    max-height: 320px;
                    opacity: 1;
                }

                .mob-acc-inner {
                    padding: 6px 0 6px 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }

                .mob-sub-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.82rem;
                    font-weight: 300;
                    color: #4a3f30;
                    text-decoration: none;
                    padding: 9px 12px;
                    border-radius: 8px;
                    transition: background 0.18s, color 0.18s;
                    border-left: 2px solid transparent;
                }

                .mob-sub-link:hover {
                    background: #fef9ee;
                    color: #b45309;
                    border-left-color: #d97706;
                }

                .mob-divider {
                    height: 1px;
                    background: #e8dfd0;
                    margin: 10px 0;
                }

                /* Mobile CTA */
                .mob-cta {
                    display: block;
                    text-align: center;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #fef3c7;
                    background: #1a1208;
                    padding: 14px;
                    border-radius: 14px;
                    text-decoration: none;
                    margin-top: 12px;
                    transition: background 0.18s;
                }

                .mob-cta:hover {
                    background: #2d1f0d;
                }
            `}</style>

            <header className={`nav-root ${scrolled ? "scrolled" : "top"}`}>
                <div className="nav-inner">

                    {/* Hamburger — mobile only */}
                    <button
                        className="nav-hamburger"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} strokeWidth={1.8} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="nav-logo">
                        <Image
                            src="/logo.png"
                            alt="Shivshakti Computer Academy"
                            width={36}
                            height={36}
                        />
                        <div className="hidden sm:block">
                            <div className="nav-logo-text">Shivshakti Computer Academy</div>
                            <div className="nav-logo-sub">Computer Education · Ambikapur</div>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav aria-label="Main navigation">
                        <ul className="nav-links">
                            <li>
                                <Link href="/" className="nav-link">Home</Link>
                            </li>
                            <li>
                                <Link href="/courses" className="nav-link">Courses</Link>
                            </li>
                            <li>
                                <button
                                    className={`nav-link ${activeDesktop === "academy" ? "active" : ""}`}
                                    onClick={() => setActiveDesktop(
                                        activeDesktop === "academy" ? null : "academy"
                                    )}
                                    aria-expanded={activeDesktop === "academy"}
                                >
                                    Academy
                                    <ChevronDown size={14} strokeWidth={2} className="nav-chevron" />
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`nav-link ${activeDesktop === "resources" ? "active" : ""}`}
                                    onClick={() => setActiveDesktop(
                                        activeDesktop === "resources" ? null : "resources"
                                    )}
                                    aria-expanded={activeDesktop === "resources"}
                                >
                                    Resources
                                    {noticeCount > 0 && (
                                        <span className="nav-notice-badge" aria-label={`${noticeCount} new notices`}>
                                            {noticeCount}
                                        </span>
                                    )}
                                    <ChevronDown size={14} strokeWidth={2} className="nav-chevron" />
                                </button>
                            </li>
                            <li>
                                <Link href="/contact" className="nav-link">Contact</Link>
                            </li>
                        </ul>
                    </nav>

                    <Link href="/enquiry" className="nav-cta">
                        Admission →
                    </Link>

                </div>

                {/* MegaMenu */}
                <div ref={megaRef} className="hidden lg:block" style={{ position: "relative" }}>
                    <MegaMenu
                        active={activeDesktop}
                        closeMenu={() => setActiveDesktop(null)}
                    />
                </div>
            </header>

            {/* Mobile Drawer via Portal */}
            {mounted && createPortal(
                <>
                    {mobileOpen && (
                        <div
                            className="mob-overlay"
                            onClick={closeMobile}
                            aria-hidden="true"
                        />
                    )}

                    <div className={`mob-drawer ${mobileOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation menu">

                        {/* Header */}
                        <div className="mob-header">
                            <Link href="/" className="mob-logo" onClick={closeMobile}>
                                Shivshakti Academy
                            </Link>
                            <button className="mob-close" onClick={closeMobile} aria-label="Close menu">
                                <X size={18} strokeWidth={2} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="mob-body">
                            <Link href="/" className="mob-link" onClick={closeMobile}>Home</Link>
                            <Link href="/courses" className="mob-link" onClick={closeMobile}>Courses</Link>

                            {/* Academy accordion */}
                            <div>
                                <button
                                    className={`mob-acc-btn ${mobileAccordion === "academy" ? "open" : ""}`}
                                    onClick={() => setMobileAccordion(
                                        mobileAccordion === "academy" ? null : "academy"
                                    )}
                                >
                                    Academy
                                    <ChevronDown size={14} strokeWidth={2} className="mob-acc-chevron" />
                                </button>
                                <div className={`mob-acc-content ${mobileAccordion === "academy" ? "open" : ""}`}>
                                    <div className="mob-acc-inner">
                                        {[
                                            { href: "/about", label: "About Us" },
                                            { href: "/accreditations", label: "Accreditations" },
                                            { href: "/gallery", label: "Gallery" },
                                            { href: "/msme", label: "MSME Registration" },
                                            { href: "/affiliations", label: "Affiliations" },
                                        ].map((l) => (
                                            <Link key={l.href} href={l.href} className="mob-sub-link" onClick={closeMobile}>
                                                {l.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Resources accordion */}
                            <div>
                                <button
                                    className={`mob-acc-btn ${mobileAccordion === "resources" ? "open" : ""}`}
                                    onClick={() => setMobileAccordion(
                                        mobileAccordion === "resources" ? null : "resources"
                                    )}
                                >
                                    Resources
                                    {noticeCount > 0 && (
                                        <span className="nav-notice-badge" style={{ marginLeft: 4 }}>
                                            {noticeCount}
                                        </span>
                                    )}
                                    <ChevronDown size={14} strokeWidth={2} className="mob-acc-chevron" />
                                </button>
                                <div className={`mob-acc-content ${mobileAccordion === "resources" ? "open" : ""}`}>
                                    <div className="mob-acc-inner">
                                        {[
                                            { href: "/notices", label: "Notices" },
                                            { href: "/verify-certificate", label: "Verify Certificate" },
                                            { href: "/faq", label: "FAQ" },
                                            { href: "/student/login", label: "Student Login" },
                                            { href: "/admin/login", label: "Admin Login" },
                                        ].map((l) => (
                                            <Link key={l.href} href={l.href} className="mob-sub-link" onClick={closeMobile}>
                                                {l.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link href="/contact" className="mob-link" onClick={closeMobile}>Contact</Link>

                            <div className="mob-divider" />

                            <Link href="/enquiry" className="mob-cta" onClick={closeMobile}>
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