"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  Menu, X, ChevronDown, Phone, ArrowRight,
  Building2, Award, Camera, Handshake,
  Bell, ShieldCheck, HelpCircle, User, GraduationCap, Lock,
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

const academyLinks = [
  { href: "/about", label: "About Us", icon: <Building2 size={16} /> },
  { href: "/accreditations", label: "Accreditations", icon: <Award size={16} /> },
  { href: "/gallery", label: "Gallery", icon: <Camera size={16} /> },
  { href: "/affiliations", label: "Affiliations", icon: <Handshake size={16} /> },
  { href: "/privacy", label: "Privacy Policy", icon: <Lock size={16} /> },
];

const resourceLinks = [
  { href: "/notices", label: "Notices", icon: <Bell size={16} /> },
  { href: "/verify-certificate", label: "Verify Certificate", icon: <ShieldCheck size={16} /> },
  { href: "/faq", label: "FAQ", icon: <HelpCircle size={16} /> },
];

const portalLinks = [
  { href: "/student/login", label: "Student Portal", icon: <User size={16} /> },
  { href: "/teacher/login", label: "Teacher Portal", icon: <GraduationCap size={16} /> },
  { href: "/admin/login", label: "Admin Portal", icon: <Lock size={16} /> },
];

export default function Header({ latestNotice }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Measure fixed header height → spacer height (exact, responsive)
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    // re-measure after fonts/images load
    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [latestNotice]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileAccordion(null);
  };

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        {/* ── MINIMAL TOPBAR (desktop only) ── */}
        <div className={styles.topbar}>
          <div className={styles.topbarInner}>
            <a href="tel:+917477036832" className={styles.topbarPhone}>
              <Phone size={13} strokeWidth={2} />
              +91 74770 36832
            </a>
            <nav className={styles.topbarPortals} aria-label="Portals">
              {portalLinks.map((p) => (
                <Link key={p.href} href={p.href} className={styles.topbarPortal}>
                  {p.label.replace(" Portal", "")}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ── BREAKING NOTICE ── */}
        {latestNotice && (
          <div className={styles.breaking}>
            <div className={styles.breakingInner}>
              <span className={styles.breakingLabel}>
                <span className={styles.breakingDot} aria-hidden="true" />
                Update
              </span>
              <Link href={`/notices/${latestNotice.slug}`} className={styles.breakingLink}>
                <span className={styles.breakingTitle}>{latestNotice.title}</span>
                <span className={styles.breakingCta} aria-hidden="true">Read →</span>
              </Link>
            </div>
          </div>
        )}

        {/* ── MAIN NAV: logo left · nav center · CTA right ── */}
        <div className={styles.navbar}>
          <div className={styles.navInner}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <Image src="/logo.png" alt="Shivshakti Computer Academy" width={42} height={42} priority className={styles.logoImg} />
              <span className={styles.logoText}>
                <span className={styles.logoTitle}>Shivshakti Computer Academy</span>
                <span className={styles.logoSub}>Excellence in Education</span>
              </span>
            </Link>

            {/* Center nav (desktop) */}
            <nav className={styles.nav} aria-label="Primary">
              <Link href="/" className={styles.navLink}>Home</Link>
              <Link href="/courses" className={styles.navLink}>Courses</Link>

              {/* Academy dropdown */}
              <div
                className={styles.navItem}
                onMouseEnter={() => setActiveDropdown("academy")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`${styles.navLink} ${activeDropdown === "academy" ? styles.navLinkActive : ""}`}>
                  Academy
                  <ChevronDown size={15} className={styles.navChevron} />
                </button>
                <div className={`${styles.dropdown} ${activeDropdown === "academy" ? styles.dropdownOpen : ""}`}>
                  {academyLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={styles.dropdownItem}>
                      {l.icon}<span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources dropdown */}
              <div
                className={styles.navItem}
                onMouseEnter={() => setActiveDropdown("resources")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`${styles.navLink} ${activeDropdown === "resources" ? styles.navLinkActive : ""}`}>
                  Resources
                  <ChevronDown size={15} className={styles.navChevron} />
                </button>
                <div className={`${styles.dropdown} ${activeDropdown === "resources" ? styles.dropdownOpen : ""}`}>
                  {resourceLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={styles.dropdownItem}>
                      {l.icon}<span>{l.label}</span>
                    </Link>
                  ))}
                  <div className={styles.dropdownDivider} />
                  {portalLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={styles.dropdownItem}>
                      {l.icon}<span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/contact" className={styles.navLink}>Contact</Link>
            </nav>

            {/* Right actions */}
            <div className={styles.actions}>
              <ThemeToggle />
              <Link href="/enquiry" className={styles.cta}>
                Admission
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <button
                className={styles.burger}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer — fixed header ke neeche content push karne ke liye */}
      <div className={styles.headerSpacer} style={{ height: headerHeight }} aria-hidden="true" />

      {/* ── FULLSCREEN MOBILE MENU ── */}
      {mounted && createPortal(
        <div className={`${styles.overlay} ${mobileOpen ? styles.overlayOpen : ""}`} aria-hidden={!mobileOpen}>
          <div className={styles.overlayHeader}>
            <Link href="/" onClick={closeMobile} className={styles.overlayLogo}>
              <Image src="/logo.png" alt="SCA" width={36} height={36} />
              <span>Shivshakti Academy</span>
            </Link>
            <div className={styles.overlayHeaderActions}>
              <ThemeToggle />
              <button onClick={closeMobile} className={styles.overlayClose} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
          </div>

          <nav className={styles.overlayNav} aria-label="Mobile">
            <Link href="/" onClick={closeMobile} className={styles.overlayLink}>Home</Link>
            <Link href="/courses" onClick={closeMobile} className={styles.overlayLink}>Courses</Link>

            {/* Academy accordion */}
            <div className={styles.overlayAccordion}>
              <button
                className={`${styles.overlayAccTrigger} ${mobileAccordion === "academy" ? styles.overlayAccActive : ""}`}
                onClick={() => setMobileAccordion(mobileAccordion === "academy" ? null : "academy")}
              >
                Academy <ChevronDown size={20} />
              </button>
              <div className={`${styles.overlayAccBody} ${mobileAccordion === "academy" ? styles.overlayAccBodyOpen : ""}`}>
                {academyLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={closeMobile} className={styles.overlaySubLink}>
                    {l.icon}<span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources accordion */}
            <div className={styles.overlayAccordion}>
              <button
                className={`${styles.overlayAccTrigger} ${mobileAccordion === "resources" ? styles.overlayAccActive : ""}`}
                onClick={() => setMobileAccordion(mobileAccordion === "resources" ? null : "resources")}
              >
                Resources <ChevronDown size={20} />
              </button>
              <div className={`${styles.overlayAccBody} ${mobileAccordion === "resources" ? styles.overlayAccBodyOpen : ""}`}>
                {resourceLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={closeMobile} className={styles.overlaySubLink}>
                    {l.icon}<span>{l.label}</span>
                  </Link>
                ))}
                {portalLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={closeMobile} className={styles.overlaySubLink}>
                    {l.icon}<span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/contact" onClick={closeMobile} className={styles.overlayLink}>Contact</Link>
          </nav>

          <div className={styles.overlayFooter}>
            <Link href="/enquiry" onClick={closeMobile} className={styles.overlayCta}>
              Admission Enquiry
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <a href="tel:+917477036832" className={styles.overlayPhone}>
              <Phone size={14} strokeWidth={2} />
              +91 74770 36832
            </a>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
