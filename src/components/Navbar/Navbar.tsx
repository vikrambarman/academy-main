"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { 
    Menu, 
    X, 
    ChevronDown, 
    Home,
    BookOpen,
    Building2,
    FileText,
    Mail,
    Sparkles,
    Award,
    Camera,
    Handshake,
    Bell,
    ShieldCheck,
    HelpCircle,
    User,
    GraduationCap,
    Lock
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./Navbar.module.css";

interface NavLink {
    href: string;
    label: string;
    icon?: React.ReactNode;
}

interface NavDropdown {
    label: string;
    icon?: React.ReactNode;
    links: NavLink[];
}

export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Mount check for portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll detection with debounce
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setScrolled(window.scrollY > 60);
            }, 10);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    // Body scroll lock for mobile menu
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
        
        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [mobileOpen]);

    const closeMobile = () => {
        setMobileOpen(false);
        setMobileAccordion(null);
    };

    const toggleMobileAccordion = (key: string) => {
        setMobileAccordion(mobileAccordion === key ? null : key);
    };

    // Navigation data
    const academyDropdown: NavDropdown = {
        label: "Academy",
        icon: <Building2 size={18} />,
        links: [
            { href: "/about", label: "About Us", icon: <Building2 size={16} /> },
            { href: "/accreditations", label: "Accreditations", icon: <Award size={16} /> },
            { href: "/gallery", label: "Gallery", icon: <Camera size={16} /> },
            { href: "/affiliations", label: "Affiliations", icon: <Handshake size={16} /> },
        ],
    };

    const resourcesDropdown: NavDropdown = {
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
            {/* Main Header */}
            <header 
                className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
                role="banner"
            >
                <div className={styles.container}>
                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open navigation menu"
                        aria-expanded={mobileOpen}
                    >
                        <Menu size={22} strokeWidth={2.5} />
                        <span className={styles.toggleRipple} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoImage}>
                            <div className={styles.logoGlow} />
                            <Image
                                src="/logo.png"
                                alt="Shivshakti Computer Academy"
                                width={48}
                                height={48}
                                priority
                                className={styles.logoImg}
                            />
                        </div>
                        <div className={styles.logoText}>
                            <span className={styles.logoTitle}>
                                Shivshakti Computer Academy
                            </span>
                            <span className={styles.logoSubtitle}>
                                Excellence in Computer Education
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.desktopNav} aria-label="Main navigation">
                        <ul className={styles.navList}>
                            {/* Home */}
                            <li>
                                <Link href="/" className={styles.navLink}>
                                    <Home size={16} />
                                    <span>Home</span>
                                    <span className={styles.navUnderline} />
                                </Link>
                            </li>

                            {/* Courses */}
                            <li>
                                <Link href="/courses" className={styles.navLink}>
                                    <BookOpen size={16} />
                                    <span>Courses</span>
                                    <span className={styles.navUnderline} />
                                </Link>
                            </li>

                            {/* Academy Dropdown */}
                            <li
                                className={styles.dropdown}
                                onMouseEnter={() => setActiveDropdown("academy")}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button
                                    className={`${styles.dropdownTrigger} ${
                                        activeDropdown === "academy" ? styles.active : ""
                                    }`}
                                    aria-expanded={activeDropdown === "academy"}
                                    aria-haspopup="true"
                                >
                                    {academyDropdown.icon}
                                    <span>{academyDropdown.label}</span>
                                    <ChevronDown size={16} className={styles.chevron} />
                                    <span className={styles.navUnderline} />
                                </button>

                                <div
                                    className={`${styles.dropdownMenu} ${
                                        activeDropdown === "academy" ? styles.show : ""
                                    }`}
                                    role="menu"
                                >
                                    <div className={styles.dropdownInner}>
                                        {academyDropdown.links.map((link, index) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={styles.dropdownItem}
                                                onClick={() => setActiveDropdown(null)}
                                                style={{ animationDelay: `${index * 40}ms` }}
                                                role="menuitem"
                                            >
                                                {link.icon}
                                                <span>{link.label}</span>
                                                <span className={styles.dropdownShine} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </li>

                            {/* Resources Dropdown */}
                            <li
                                className={styles.dropdown}
                                onMouseEnter={() => setActiveDropdown("resources")}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button
                                    className={`${styles.dropdownTrigger} ${
                                        activeDropdown === "resources" ? styles.active : ""
                                    }`}
                                    aria-expanded={activeDropdown === "resources"}
                                    aria-haspopup="true"
                                >
                                    {resourcesDropdown.icon}
                                    <span>{resourcesDropdown.label}</span>
                                    <ChevronDown size={16} className={styles.chevron} />
                                    <span className={styles.navUnderline} />
                                </button>

                                <div
                                    className={`${styles.dropdownMenu} ${
                                        activeDropdown === "resources" ? styles.show : ""
                                    }`}
                                    role="menu"
                                >
                                    <div className={styles.dropdownInner}>
                                        {resourcesDropdown.links.map((link, index) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={styles.dropdownItem}
                                                onClick={() => setActiveDropdown(null)}
                                                style={{ animationDelay: `${index * 35}ms` }}
                                                role="menuitem"
                                            >
                                                {link.icon}
                                                <span>{link.label}</span>
                                                <span className={styles.dropdownShine} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </li>

                            {/* Contact */}
                            <li>
                                <Link href="/contact" className={styles.navLink}>
                                    <Mail size={16} />
                                    <span>Contact</span>
                                    <span className={styles.navUnderline} />
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Right Actions */}
                    <div className={styles.actions}>
                        <ThemeToggle />
                        <Link href="/enquiry" className={styles.ctaButton}>
                            <Sparkles size={16} />
                            <span>Admission</span>
                            <span className={styles.ctaGlow} />
                        </Link>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className={styles.progressBar} />
            </header>

            {/* Mobile Drawer */}
            {mounted &&
                createPortal(
                    <>
                        {/* Backdrop */}
                        {mobileOpen && (
                            <div
                                className={styles.backdrop}
                                onClick={closeMobile}
                                aria-hidden="true"
                            />
                        )}

                        {/* Drawer */}
                        <aside
                            className={`${styles.drawer} ${mobileOpen ? styles.open : ""}`}
                            aria-label="Mobile navigation"
                            aria-hidden={!mobileOpen}
                        >
                            {/* Drawer Header */}
                            <div className={styles.drawerHeader}>
                                <Link href="/" onClick={closeMobile} className={styles.drawerLogo}>
                                    <Image
                                        src="/logo.png"
                                        alt="SCA"
                                        width={36}
                                        height={36}
                                    />
                                    <span>Shivshakti Academy</span>
                                </Link>
                                <div className={styles.drawerHeaderActions}>
                                    <ThemeToggle />
                                    <button
                                        onClick={closeMobile}
                                        className={styles.drawerClose}
                                        aria-label="Close navigation menu"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Body */}
                            <div className={styles.drawerBody}>
                                {/* Home */}
                                <Link href="/" onClick={closeMobile} className={styles.drawerLink}>
                                    <Home size={20} />
                                    <span>Home</span>
                                </Link>

                                {/* Courses */}
                                <Link href="/courses" onClick={closeMobile} className={styles.drawerLink}>
                                    <BookOpen size={20} />
                                    <span>Courses</span>
                                </Link>

                                {/* Academy Accordion */}
                                <div className={styles.accordion}>
                                    <button
                                        onClick={() => toggleMobileAccordion("academy")}
                                        className={`${styles.accordionTrigger} ${
                                            mobileAccordion === "academy" ? styles.active : ""
                                        }`}
                                        aria-expanded={mobileAccordion === "academy"}
                                    >
                                        <span className={styles.accordionTitle}>
                                            {academyDropdown.icon}
                                            <span>{academyDropdown.label}</span>
                                        </span>
                                        <ChevronDown size={18} />
                                    </button>
                                    <div
                                        className={`${styles.accordionContent} ${
                                            mobileAccordion === "academy" ? styles.expanded : ""
                                        }`}
                                    >
                                        {academyDropdown.links.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={closeMobile}
                                                className={styles.accordionLink}
                                            >
                                                {link.icon}
                                                <span>{link.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Resources Accordion */}
                                <div className={styles.accordion}>
                                    <button
                                        onClick={() => toggleMobileAccordion("resources")}
                                        className={`${styles.accordionTrigger} ${
                                            mobileAccordion === "resources" ? styles.active : ""
                                        }`}
                                        aria-expanded={mobileAccordion === "resources"}
                                    >
                                        <span className={styles.accordionTitle}>
                                            {resourcesDropdown.icon}
                                            <span>{resourcesDropdown.label}</span>
                                        </span>
                                        <ChevronDown size={18} />
                                    </button>
                                    <div
                                        className={`${styles.accordionContent} ${
                                            mobileAccordion === "resources" ? styles.expanded : ""
                                        }`}
                                    >
                                        {resourcesDropdown.links.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={closeMobile}
                                                className={styles.accordionLink}
                                            >
                                                {link.icon}
                                                <span>{link.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact */}
                                <Link href="/contact" onClick={closeMobile} className={styles.drawerLink}>
                                    <Mail size={20} />
                                    <span>Contact</span>
                                </Link>

                                {/* Divider */}
                                <div className={styles.drawerDivider} />

                                {/* CTA */}
                                <Link href="/enquiry" onClick={closeMobile} className={styles.drawerCta}>
                                    <Sparkles size={18} />
                                    <span>Start Your Journey</span>
                                </Link>
                            </div>

                            {/* Drawer Footer */}
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