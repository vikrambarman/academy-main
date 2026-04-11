"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { 
    Menu, X, ChevronDown, Home, BookOpen, Building2, 
    FileText, Mail, Sparkles, Award, Camera, Handshake, 
    Bell, ShieldCheck, HelpCircle, User, GraduationCap, 
    Lock, Phone, MapPin, Clock
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./Header.module.css";

interface Notice {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
}

interface HeaderProps {
    latestNotice?: Notice | null;
}

export default function Header({ latestNotice }: HeaderProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
        
        return () => {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        };
    }, [mobileOpen]);

    const closeMobile = () => {
        setMobileOpen(false);
        setMobileAccordion(null);
    };

    const academyDropdown = {
        label: "Academy",
        icon: <Building2 size={18} />,
        links: [
            { href: "/about", label: "About Us", icon: <Building2 size={16} /> },
            { href: "/accreditations", label: "Accreditations", icon: <Award size={16} /> },
            { href: "/gallery", label: "Gallery", icon: <Camera size={16} /> },
            { href: "/affiliations", label: "Affiliations", icon: <Handshake size={16} /> },
        ],
    };

    const resourcesDropdown = {
        label: "Resources",
        icon: <FileText size={18} />,
        links: [
            { href: "/notices", label: "Notices", icon: <Bell size={16} /> },
            { href: "/verify-certificate", label: "Verify Certificate", icon: <ShieldCheck size={16} /> },
            { href: "/faq", label: "FAQ", icon: <HelpCircle size={16} /> },
            { href: "/student/login", label: "Student Portal", icon: <User size={16} /> },
            { href: "/teacher/login", label: "Teacher Portal", icon: <GraduationCap size={16} /> },
            { href: "/admin/login", label: "Admin Portal", icon: <Lock size={16} /> },
        ],
    };

    return (
        <>
            {/* ========== STICKY HEADER WRAPPER ========== */}
            {/* ✅ ADDED: data attribute for debugging */}
            <div 
                className={`${styles.headerWrapper} ${scrolled ? styles.scrolled : ""}`}
                data-sticky="true"
            >
                
                {/* ========== TOPBAR ========== */}
                <div className={styles.topbar}>
                    <div className={styles.topbarContainer}>
                        {/* Left Info */}
                        <div className={styles.topbarLeft}>
                            <a href="tel:+917477036832" className={styles.topbarItem}>
                                <Phone size={14} />
                                <span>+91 74770 36832</span>
                            </a>
                            <span className={styles.topbarDivider} />
                            <div className={styles.topbarItem}>
                                <MapPin size={14} />
                                <span>Ambikapur, Chhattisgarh</span>
                            </div>
                            <span className={styles.topbarDivider} />
                            <div className={styles.topbarItem}>
                                <Clock size={14} />
                                <span>Mon–Sat · 8AM–6PM</span>
                            </div>
                        </div>

                        {/* Right Portals */}
                        <div className={styles.topbarRight}>
                            {[
                                { href: "/student/login", label: "Student", icon: "👨‍🎓" },
                                { href: "/teacher/login", label: "Teacher", icon: "👨‍🏫" },
                                { href: "/admin/login", label: "Admin", icon: "🔐" },
                            ].map((portal, i) => (
                                <div key={portal.href} className={styles.topbarPortalGroup}>
                                    {i > 0 && <span className={styles.topbarDivider} />}
                                    <Link href={portal.href} className={styles.topbarPortalLink}>
                                        <span>{portal.icon}</span>
                                        <span>{portal.label}</span>
                                    </Link>
                                </div>
                            ))}
                            <Link href="/enquiry" className={styles.topbarCta}>
                                <Sparkles size={14} />
                                <span>Admission</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ========== BREAKING NOTICE ========== */}
                {latestNotice && (
                    <div className={styles.breaking}>
                        <div className={styles.breakingContainer}>
                            <div className={styles.breakingLabel}>
                                <span className={styles.breakingPulse}></span>
                                <span>UPDATES</span>
                            </div>
                            <div className={styles.breakingMarqueeWrapper}>
                                <div className={styles.breakingMarquee}>
                                    <Link href={`/notices/${latestNotice.slug}`} className={styles.breakingLink}>
                                        <span className={styles.breakingTitle}>{latestNotice.title}</span>
                                        {latestNotice.excerpt && (
                                            <span className={styles.breakingExcerpt}> — {latestNotice.excerpt}</span>
                                        )}
                                        <span className={styles.breakingCta}>READ MORE →</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== MAIN NAVBAR ========== */}
                <nav className={styles.navbar}>
                    <div className={styles.navbarContainer}>
                        
                        {/* Mobile Toggle */}
                        <button
                            className={styles.navToggle}
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>

                        {/* Logo */}
                        <Link href="/" className={styles.logo}>
                            <div className={styles.logoImage}>
                                <Image src="/logo.png" alt="SCA" width={48} height={48} priority />
                            </div>
                            <div className={styles.logoText}>
                                <span className={styles.logoTitle}>Shivshakti Computer Academy</span>
                                <span className={styles.logoSubtitle}>Excellence in Education</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <ul className={styles.navList}>
                            <li>
                                <Link href="/" className={styles.navLink}>
                                    <Home size={16} />
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/courses" className={styles.navLink}>
                                    <BookOpen size={16} />
                                    <span>Courses</span>
                                </Link>
                            </li>

                            {/* Academy Dropdown */}
                            <li
                                className={styles.navDropdown}
                                onMouseEnter={() => setActiveDropdown("academy")}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className={`${styles.navLink} ${activeDropdown === "academy" ? styles.active : ""}`}>
                                    {academyDropdown.icon}
                                    <span>{academyDropdown.label}</span>
                                    <ChevronDown size={16} />
                                </button>
                                <div className={`${styles.dropdownMenu} ${activeDropdown === "academy" ? styles.show : ""}`}>
                                    {academyDropdown.links.map((link) => (
                                        <Link key={link.href} href={link.href} className={styles.dropdownItem}>
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </li>

                            {/* Resources Dropdown */}
                            <li
                                className={styles.navDropdown}
                                onMouseEnter={() => setActiveDropdown("resources")}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className={`${styles.navLink} ${activeDropdown === "resources" ? styles.active : ""}`}>
                                    {resourcesDropdown.icon}
                                    <span>{resourcesDropdown.label}</span>
                                    <ChevronDown size={16} />
                                </button>
                                <div className={`${styles.dropdownMenu} ${activeDropdown === "resources" ? styles.show : ""}`}>
                                    {resourcesDropdown.links.map((link) => (
                                        <Link key={link.href} href={link.href} className={styles.dropdownItem}>
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </li>

                            <li>
                                <Link href="/contact" className={styles.navLink}>
                                    <Mail size={16} />
                                    <span>Contact</span>
                                </Link>
                            </li>
                        </ul>

                        {/* Actions */}
                        <div className={styles.navActions}>
                            <ThemeToggle />
                            <Link href="/enquiry" className={styles.navCta}>
                                <Sparkles size={16} />
                                <span>Admission</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {/* ========== MOBILE DRAWER ========== */}
            {mounted && createPortal(
                <>
                    {mobileOpen && <div className={styles.drawerBackdrop} onClick={closeMobile} />}
                    <aside className={`${styles.drawer} ${mobileOpen ? styles.open : ""}`}>
                        <div className={styles.drawerHeader}>
                            <Link href="/" onClick={closeMobile} className={styles.drawerLogo}>
                                <Image src="/logo.png" alt="SCA" width={36} height={36} />
                                <span>Shivshakti Academy</span>
                            </Link>
                            <div className={styles.drawerHeaderActions}>
                                <ThemeToggle />
                                <button onClick={closeMobile} className={styles.drawerClose}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className={styles.drawerBody}>
                            <Link href="/" onClick={closeMobile} className={styles.drawerLink}>
                                <Home size={20} />
                                <span>Home</span>
                            </Link>
                            <Link href="/courses" onClick={closeMobile} className={styles.drawerLink}>
                                <BookOpen size={20} />
                                <span>Courses</span>
                            </Link>

                            {/* Academy Accordion */}
                            <div className={styles.drawerAccordion}>
                                <button
                                    onClick={() => setMobileAccordion(mobileAccordion === "academy" ? null : "academy")}
                                    className={`${styles.drawerAccordionTrigger} ${mobileAccordion === "academy" ? styles.active : ""}`}
                                >
                                    <span className={styles.drawerAccordionTitle}>
                                        {academyDropdown.icon}
                                        <span>{academyDropdown.label}</span>
                                    </span>
                                    <ChevronDown size={18} />
                                </button>
                                <div className={`${styles.drawerAccordionContent} ${mobileAccordion === "academy" ? styles.open : ""}`}>
                                    {academyDropdown.links.map((link) => (
                                        <Link key={link.href} href={link.href} onClick={closeMobile} className={styles.drawerAccordionLink}>
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Resources Accordion */}
                            <div className={styles.drawerAccordion}>
                                <button
                                    onClick={() => setMobileAccordion(mobileAccordion === "resources" ? null : "resources")}
                                    className={`${styles.drawerAccordionTrigger} ${mobileAccordion === "resources" ? styles.active : ""}`}
                                >
                                    <span className={styles.drawerAccordionTitle}>
                                        {resourcesDropdown.icon}
                                        <span>{resourcesDropdown.label}</span>
                                    </span>
                                    <ChevronDown size={18} />
                                </button>
                                <div className={`${styles.drawerAccordionContent} ${mobileAccordion === "resources" ? styles.open : ""}`}>
                                    {resourcesDropdown.links.map((link) => (
                                        <Link key={link.href} href={link.href} onClick={closeMobile} className={styles.drawerAccordionLink}>
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link href="/contact" onClick={closeMobile} className={styles.drawerLink}>
                                <Mail size={20} />
                                <span>Contact</span>
                            </Link>

                            <div className={styles.drawerDivider} />

                            <Link href="/enquiry" onClick={closeMobile} className={styles.drawerCta}>
                                <Sparkles size={18} />
                                <span>Start Your Journey</span>
                            </Link>
                        </div>

                        <div className={styles.drawerFooter}>
                            <p>© 2026 Shivshakti Computer Academy</p>
                            <p>Empowering Future Tech Leaders</p>
                        </div>
                    </aside>
                </>,
                document.body
            )}
        </>
    );
}