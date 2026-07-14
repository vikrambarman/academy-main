"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  Menu, X, ChevronDown, Phone,
  Building2, Award, Camera, Handshake,
  Bell, ShieldCheck, HelpCircle,
  User, GraduationCap, Lock,
  ChevronRight,
} from "lucide-react";
import styles from "./Header.module.css";

interface Notice {
  _id: string;
  title: string;
  slug: string;
  category?: string; // ✅ optional — backward compatible
}

interface HeaderProps {
  latestNotice?: Notice | null; // ✅ purana prop — as-is
  notices?: Notice[];           // ✅ naya optional prop
}

const academyLinks = [
  { href: "/about", label: "About Us", icon: <Building2 size={15} /> },
  { href: "/accreditations", label: "Accreditations", icon: <Award size={15} /> },
  { href: "/gallery", label: "Gallery", icon: <Camera size={15} /> },
  { href: "/affiliations", label: "Affiliations", icon: <Handshake size={15} /> },
  { href: "/privacy", label: "Privacy Policy", icon: <Lock size={15} /> },
];

const resourceLinks = [
  { href: "/notices", label: "Notices", icon: <Bell size={15} /> },
  { href: "/verify-certificate", label: "Verify Certificate", icon: <ShieldCheck size={15} /> },
  { href: "/faq", label: "FAQ", icon: <HelpCircle size={15} /> },
];

const portalLinks = [
  { href: "/student/login", label: "Student Portal", icon: <User size={15} /> },
  { href: "/teacher/login", label: "Teacher Portal", icon: <GraduationCap size={15} /> },
  { href: "/admin/login", label: "Admin Portal", icon: <Lock size={15} /> },
];

export default function Header({ latestNotice, notices = [] }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  // ✅ Notice rotation state
  const [noticeIdx, setNoticeIdx] = useState(0);
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [noticePaused, setNoticePaused] = useState(false);

  // ✅ Backward compat: notices prop khali ho to latestNotice use karo
  const noticeList: Notice[] =
    notices.length > 0 ? notices : latestNotice ? [latestNotice] : [];

  const currentNotice = noticeList[noticeIdx] ?? noticeList[0] ?? null;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [latestNotice, notices]);

  // ✅ Auto-rotate notices (sirf tab jab 1 se zyada ho, hover par pause)
  useEffect(() => {
    if (noticeList.length <= 1 || noticePaused) return;

    const interval = setInterval(() => {
      setNoticeVisible(false); // fade out
      setTimeout(() => {
        setNoticeIdx((prev) => (prev + 1) % noticeList.length);
        setNoticeVisible(true); // fade in
      }, 350);
    }, 4500);

    return () => clearInterval(interval);
  }, [noticeList.length, noticePaused]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
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

        {/* ============================================
            LAYER 1 - TOP BAR (Dark Blue)
            Notice strip + Portal access
            ============================================ */}
        <div className={styles.topBar}>
          <div className={styles.container}>
            <div className={styles.topBarInner}>

              {/* Left - Notice ticker or tagline */}
              <div className={styles.topBarLeft}>
                {currentNotice ? (
                  <div
                    className={styles.noticeTicker}
                    onMouseEnter={() => setNoticePaused(true)}
                    onMouseLeave={() => setNoticePaused(false)}
                  >
                    {/* Pulsing badge */}
                    <span className={styles.noticeBadgeWrap}>
                      <span className={styles.noticePulseRing} aria-hidden="true" />
                      <span className={styles.noticeLabel}>
                        <Bell size={10} strokeWidth={2.5} />
                        Notice
                      </span>
                    </span>

                    {/* Animated text */}
                    <div className={styles.noticeTextWrap}>
                      <Link
                        href={`/notices/${currentNotice.slug}`}
                        className={`${styles.noticeText} ${
                          noticeVisible
                            ? styles.noticeTextIn
                            : styles.noticeTextOut
                        }`}
                      >
                        <ChevronRight size={13} className={styles.noticeArrow} />
                        {currentNotice.title}
                      </Link>
                    </div>

                    {/* Dot indicators — sirf multiple notices par */}
                    {noticeList.length > 1 && (
                      <div className={styles.noticeDots} role="tablist">
                        {noticeList.map((n, i) => (
                          <button
                            key={n._id}
                            className={`${styles.noticeDotBtn} ${
                              i === noticeIdx ? styles.noticeDotActive : ""
                            }`}
                            onClick={() => {
                              setNoticeVisible(false);
                              setTimeout(() => {
                                setNoticeIdx(i);
                                setNoticeVisible(true);
                              }, 300);
                            }}
                            aria-label={`Notice ${i + 1}: ${n.title}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* View all */}
                    <Link href="/notices" className={styles.noticeViewAll}>
                      All Notices
                      <ChevronRight size={11} />
                    </Link>
                  </div>
                ) : (
                  <span className={styles.topBarTagline}>
                    Ambikapur&apos;s Most Trusted Computer Academy
                  </span>
                )}
              </div>

              {/* Right - Portal Links */}
              <div className={styles.topBarRight}>
                {portalLinks.map((p, idx) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={styles.topBarPortal}
                  >
                    {idx > 0 && (
                      <span className={styles.topBarSep} aria-hidden="true">
                        |
                      </span>
                    )}
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            LAYER 2 - MIDDLE BAR (White)
            Logo + Academy info + Contact + CTA
            ============================================ */}
        <div className={styles.middleBar}>
          <div className={styles.container}>
            <div className={styles.middleBarInner}>

              {/* Logo Block */}
              <Link href="/" className={styles.logo}>
                <Image
                  src="/logo.png"
                  alt="Shivshakti Computer Academy"
                  width={60}
                  height={60}
                  priority
                  className={styles.logoImg}
                />
                <div className={styles.logoMeta}>
                  <span className={styles.logoName}>
                    Shivshakti Computer Academy
                  </span>
                  <span className={styles.logoTag}>
                    Excellence in Education
                  </span>
                  <span className={styles.logoCert}>
                    ISO 9001:2015 Certified
                  </span>
                </div>
              </Link>

              {/* Center - Academy highlights */}
              <div className={styles.middleHighlights}>
                <div className={styles.highlight}>
                  <span className={styles.highlightNum}>10+</span>
                  <span className={styles.highlightLabel}>
                    Years of Excellence
                  </span>
                </div>
                <div className={styles.highlightDivider} />
                <div className={styles.highlight}>
                  <span className={styles.highlightNum}>25+</span>
                  <span className={styles.highlightLabel}>
                    Certified Courses
                  </span>
                </div>
                <div className={styles.highlightDivider} />
                <div className={styles.highlight}>
                  <span className={styles.highlightNum}>NSDC</span>
                  <span className={styles.highlightLabel}>
                    Partner Institute
                  </span>
                </div>
              </div>

              {/* Right - Contact + CTA */}
              <div className={styles.middleRight}>
                {/* Phone numbers */}
                <div className={styles.contactBlock}>
                  <a
                    href="tel:+917477036832"
                    className={styles.contactNum}
                  >
                    <Phone size={14} strokeWidth={2} />
                    <div className={styles.contactNumText}>
                      <span className={styles.contactNumValue}>
                        +91 74770 36832
                      </span>
                      <span className={styles.contactNumLabel}>
                        Main Office
                      </span>
                    </div>
                  </a>
                  <a
                    href="tel:+919009087883"
                    className={styles.contactNum}
                  >
                    <Phone size={14} strokeWidth={2} />
                    <div className={styles.contactNumText}>
                      <span className={styles.contactNumValue}>
                        +91 90090 87883
                      </span>
                      <span className={styles.contactNumLabel}>
                        WhatsApp Support
                      </span>
                    </div>
                  </a>
                </div>

                {/* Admission CTA */}
                <Link href="/enquiry" className={styles.ctaBtn}>
                  Apply Now
                  <br />
                  <span className={styles.ctaBtnSub}>
                    Session 2025–26
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            LAYER 3 - NAV BAR (Dark Blue)
            Main navigation links
            ============================================ */}
        <div className={styles.navBar}>
          <div className={styles.container}>
            <div className={styles.navBarInner}>

              {/* Desktop Nav */}
              <nav className={styles.nav} aria-label="Main Navigation">
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>

                <Link href="/courses" className={styles.navLink}>
                  Courses
                </Link>

                {/* Academy Dropdown */}
                <div
                  className={styles.navItem}
                  onMouseEnter={() => setActiveDropdown("academy")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`${styles.navLink} ${
                      activeDropdown === "academy" ? styles.navLinkActive : ""
                    }`}
                  >
                    Academy
                    <ChevronDown
                      size={14}
                      className={`${styles.navChevron} ${
                        activeDropdown === "academy"
                          ? styles.navChevronOpen
                          : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`${styles.dropdown} ${
                      activeDropdown === "academy" ? styles.dropdownOpen : ""
                    }`}
                  >
                    {academyLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={styles.dropdownItem}
                      >
                        <span className={styles.dropdownIcon}>{l.icon}</span>
                        <span>{l.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Resources Dropdown */}
                <div
                  className={styles.navItem}
                  onMouseEnter={() => setActiveDropdown("resources")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`${styles.navLink} ${
                      activeDropdown === "resources"
                        ? styles.navLinkActive
                        : ""
                    }`}
                  >
                    Resources
                    <ChevronDown
                      size={14}
                      className={`${styles.navChevron} ${
                        activeDropdown === "resources"
                          ? styles.navChevronOpen
                          : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`${styles.dropdown} ${
                      activeDropdown === "resources"
                        ? styles.dropdownOpen
                        : ""
                    }`}
                  >
                    {resourceLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={styles.dropdownItem}
                      >
                        <span className={styles.dropdownIcon}>{l.icon}</span>
                        <span>{l.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <Link href="/contact" className={styles.navLink}>
                  Contact
                </Link>

                <Link href="/notices" className={styles.navLink}>
                  Notices
                </Link>

                <Link href="/verify-certificate" className={styles.navLink}>
                  Verify Certificate
                </Link>
              </nav>

              {/* Mobile Burger */}
              <button
                className={styles.burger}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={24} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div
        className={styles.spacer}
        style={{ height: headerHeight }}
        aria-hidden="true"
      />

      {/* ============================================
          MOBILE MENU
          ============================================ */}
      {mounted &&
        createPortal(
          <div
            className={`${styles.mobileMenu} ${
              mobileOpen ? styles.mobileMenuOpen : ""
            }`}
            aria-hidden={!mobileOpen}
          >
            {/* Mobile Top */}
            <div className={styles.mobileTop}>
              <Link
                href="/"
                onClick={closeMobile}
                className={styles.mobileLogo}
              >
                <Image src="/logo.png" alt="SCA" width={40} height={40} />
                <span>Shivshakti Academy</span>
              </Link>
              <button
                onClick={closeMobile}
                className={styles.mobileClose}
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className={styles.mobileNav}>
              <Link
                href="/"
                onClick={closeMobile}
                className={styles.mobileLink}
              >
                Home
              </Link>
              <Link
                href="/courses"
                onClick={closeMobile}
                className={styles.mobileLink}
              >
                Courses
              </Link>

              {/* Academy Accordion */}
              <div className={styles.mobileGroup}>
                <button
                  className={`${styles.mobileGroupBtn} ${
                    mobileAccordion === "academy"
                      ? styles.mobileGroupBtnActive
                      : ""
                  }`}
                  onClick={() =>
                    setMobileAccordion(
                      mobileAccordion === "academy" ? null : "academy"
                    )
                  }
                >
                  Academy
                  <ChevronDown
                    size={18}
                    className={
                      mobileAccordion === "academy"
                        ? styles.mobileChevronOpen
                        : ""
                    }
                  />
                </button>
                <div
                  className={`${styles.mobileGroupContent} ${
                    mobileAccordion === "academy"
                      ? styles.mobileGroupContentOpen
                      : ""
                  }`}
                >
                  {academyLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={closeMobile}
                      className={styles.mobileSubLink}
                    >
                      {l.icon}
                      <span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources Accordion */}
              <div className={styles.mobileGroup}>
                <button
                  className={`${styles.mobileGroupBtn} ${
                    mobileAccordion === "resources"
                      ? styles.mobileGroupBtnActive
                      : ""
                  }`}
                  onClick={() =>
                    setMobileAccordion(
                      mobileAccordion === "resources" ? null : "resources"
                    )
                  }
                >
                  Resources
                  <ChevronDown
                    size={18}
                    className={
                      mobileAccordion === "resources"
                        ? styles.mobileChevronOpen
                        : ""
                    }
                  />
                </button>
                <div
                  className={`${styles.mobileGroupContent} ${
                    mobileAccordion === "resources"
                      ? styles.mobileGroupContentOpen
                      : ""
                  }`}
                >
                  {resourceLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={closeMobile}
                      className={styles.mobileSubLink}
                    >
                      {l.icon}
                      <span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                onClick={closeMobile}
                className={styles.mobileLink}
              >
                Contact
              </Link>
              <Link
                href="/notices"
                onClick={closeMobile}
                className={styles.mobileLink}
              >
                Notices
              </Link>
              <Link
                href="/verify-certificate"
                onClick={closeMobile}
                className={styles.mobileLink}
              >
                Verify Certificate
              </Link>
            </nav>

            {/* Mobile Footer */}
            <div className={styles.mobileFooter}>
              <Link
                href="/enquiry"
                onClick={closeMobile}
                className={styles.mobileCtaBtn}
              >
                Apply Now — Session 2025–26
              </Link>
              <a href="tel:+917477036832" className={styles.mobilePhone}>
                <Phone size={15} strokeWidth={2} />
                +91 74770 36832
              </a>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}