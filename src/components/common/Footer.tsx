import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const quickLinks = [
    { href: "/courses", label: "Computer Courses in Ambikapur" },
    { href: "/gallery", label: "Gallery" },
    { href: "/accreditations", label: "Accreditations" },
    { href: "/notices", label: "Latest Notices" },
    { href: "/contact", label: "Contact Institute" },
];

const resourceLinks = [
    { href: "/verify-certificate", label: "Verify Certificate Online" },
    { href: "/faq", label: "FAQs" },
    { href: "/student/login", label: "Student Login" },
    { href: "/admin/login", label: "Admin Portal" },
];

const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
];

const legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/refund-policy", label: "Refund Policy" },
];

export default function Footer() {
    return (
        <>
            <style>{`
                .ft-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #1a1208;
                    position: relative;
                    overflow: hidden;
                }

                /* Large ghost watermark */
                .ft-watermark {
                    position: absolute;
                    bottom: 40px;
                    right: -40px;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(100px, 18vw, 220px);
                    font-weight: 900;
                    font-style: italic;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(252,211,77,0.04);
                    pointer-events: none;
                    user-select: none;
                    line-height: 1;
                    z-index: 0;
                }

                /* Amber glow top-left */
                .ft-glow {
                    position: absolute;
                    top: -80px;
                    left: -60px;
                    width: 360px;
                    height: 360px;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Top amber line */
                .ft-top-line {
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(
                        to right,
                        transparent 0%,
                        #d97706 20%,
                        #fcd34d 50%,
                        #d97706 80%,
                        transparent 100%
                    );
                }

                .ft-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 64px 24px 0;
                    position: relative;
                    z-index: 1;
                }

                /* ── Main grid ── */
                .ft-grid {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
                    gap: 48px;
                    padding-bottom: 56px;
                    border-bottom: 1px solid rgba(252,211,77,0.08);
                }

                /* ── Brand col ── */
                .ft-brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #fef3c7;
                    line-height: 1.3;
                    margin-bottom: 6px;
                }

                .ft-brand-sub {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.4);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 20px;
                }

                .ft-brand-desc {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    line-height: 1.8;
                    margin-bottom: 28px;
                }

                /* Contact rows */
                .ft-contacts {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 28px;
                }

                .ft-contact-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.5);
                    transition: color 0.18s;
                }

                .ft-contact-row:hover {
                    color: #fcd34d;
                }

                .ft-contact-icon {
                    width: 28px;
                    height: 28px;
                    background: rgba(252,211,77,0.08);
                    border: 1px solid rgba(252,211,77,0.12);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #d97706;
                    flex-shrink: 0;
                    transition: background 0.18s, color 0.18s;
                }

                .ft-contact-row:hover .ft-contact-icon {
                    background: rgba(252,211,77,0.15);
                    color: #fcd34d;
                }

                /* Social icons */
                .ft-socials {
                    display: flex;
                    gap: 8px;
                }

                .ft-social-btn {
                    width: 34px;
                    height: 34px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(252,211,77,0.12);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(254,243,199,0.4);
                    text-decoration: none;
                    transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.15s;
                }

                .ft-social-btn:hover {
                    background: rgba(252,211,77,0.12);
                    border-color: rgba(252,211,77,0.3);
                    color: #fcd34d;
                    transform: translateY(-2px);
                }

                /* ── Link columns ── */
                .ft-col-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 22px;
                }

                .ft-col-label::before {
                    content: '';
                    display: inline-block;
                    width: 16px;
                    height: 1.5px;
                    background: #fcd34d;
                }

                .ft-links {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .ft-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    text-decoration: none;
                    padding: 7px 0;
                    transition: color 0.18s, gap 0.18s;
                    border-bottom: 1px solid rgba(252,211,77,0.04);
                }

                .ft-link:last-child {
                    border-bottom: none;
                }

                .ft-link:hover {
                    color: #fef3c7;
                    gap: 10px;
                }

                .ft-link-arrow {
                    font-size: 0.65rem;
                    color: #d97706;
                    opacity: 0;
                    transition: opacity 0.18s;
                }

                .ft-link:hover .ft-link-arrow {
                    opacity: 1;
                }

                /* ── Address col ── */
                .ft-address {
                    font-size: 0.78rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.45);
                    line-height: 2;
                    font-style: normal;
                    margin-bottom: 24px;
                }

                .ft-address strong {
                    display: block;
                    font-weight: 500;
                    color: rgba(254,243,199,0.7);
                    margin-bottom: 4px;
                }

                .ft-hours {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    font-weight: 400;
                    color: #fcd34d;
                    background: rgba(252,211,77,0.08);
                    border: 1px solid rgba(252,211,77,0.15);
                    padding: 5px 12px;
                    border-radius: 100px;
                    margin-top: 4px;
                    margin-bottom: 20px;
                }

                .ft-hours-dot {
                    width: 5px;
                    height: 5px;
                    background: #4ade80;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .ft-enroll-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #1a1208;
                    background: #fcd34d;
                    padding: 11px 22px;
                    border-radius: 100px;
                    text-decoration: none;
                    transition: background 0.18s, transform 0.15s;
                }

                .ft-enroll-btn:hover {
                    background: #fef3c7;
                    transform: translateY(-1px);
                }

                .ft-enroll-arrow {
                    transition: transform 0.18s;
                }

                .ft-enroll-btn:hover .ft-enroll-arrow {
                    transform: translateX(3px);
                }

                /* ── Bottom bar ── */
                .ft-bottom {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 20px 24px 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    position: relative;
                    z-index: 1;
                }

                .ft-copy {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.25);
                    letter-spacing: 0.03em;
                }

                .ft-legal {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    flex-wrap: wrap;
                }

                .ft-legal-link {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.25);
                    text-decoration: none;
                    padding: 3px 8px;
                    border-radius: 4px;
                    transition: color 0.18s;
                }

                .ft-legal-link:hover {
                    color: rgba(254,243,199,0.6);
                }

                .ft-legal-sep {
                    width: 1px;
                    height: 10px;
                    background: rgba(252,211,77,0.1);
                }

                /* ── Responsive ── */
                @media (max-width: 960px) {
                    .ft-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                    }
                }

                @media (max-width: 600px) {
                    .ft-grid {
                        grid-template-columns: 1fr;
                        gap: 36px;
                    }

                    .ft-inner {
                        padding: 48px 20px 0;
                    }

                    .ft-bottom {
                        padding: 16px 20px 28px;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                }
            `}</style>

            <footer className="ft-root">
                <div className="ft-top-line" aria-hidden="true" />
                <div className="ft-watermark" aria-hidden="true">Shiv</div>
                <div className="ft-glow" aria-hidden="true" />

                <div className="ft-inner">
                    <div className="ft-grid">

                        {/* ── Brand ── */}
                        <div>
                            <div className="ft-brand-name">Shivshakti Computer Academy</div>
                            <div className="ft-brand-sub">Ambikapur · Chhattisgarh</div>
                            <p className="ft-brand-desc">
                                Leading computer training institute in Ambikapur, Surguja —
                                offering DCA, PGDCA, ADCA, Tally, CCC and government-recognized
                                certification programs.
                            </p>

                            <div className="ft-contacts">
                                <a href="tel:+917477036832" className="ft-contact-row">
                                    <span className="ft-contact-icon">
                                        <Phone size={13} strokeWidth={1.8} />
                                    </span>
                                    +91 74770 36832
                                </a>
                                <a
                                    href="https://wa.me/919009087883"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ft-contact-row"
                                >
                                    <span className="ft-contact-icon">
                                        <Phone size={13} strokeWidth={1.8} />
                                    </span>
                                    +91 90090 87883 (WhatsApp)
                                </a>
                                <a
                                    href="mailto:shivshakticomputeracademy25@gmail.com"
                                    className="ft-contact-row"
                                >
                                    <span className="ft-contact-icon">
                                        <Mail size={13} strokeWidth={1.8} />
                                    </span>
                                    shivshakticomputeracademy25@gmail.com
                                </a>
                            </div>

                            <div className="ft-socials">
                                {socialLinks.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            aria-label={s.label}
                                            className="ft-social-btn"
                                        >
                                            <Icon size={15} strokeWidth={1.8} />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Quick Links ── */}
                        <div>
                            <div className="ft-col-label">Quick Links</div>
                            <ul className="ft-links">
                                {quickLinks.map((l) => (
                                    <li key={l.href}>
                                        <Link href={l.href} className="ft-link">
                                            <span className="ft-link-arrow">→</span>
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Resources ── */}
                        <div>
                            <div className="ft-col-label">Resources</div>
                            <ul className="ft-links">
                                {resourceLinks.map((l) => (
                                    <li key={l.href}>
                                        <Link href={l.href} className="ft-link">
                                            <span className="ft-link-arrow">→</span>
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Address ── */}
                        <div>
                            <div className="ft-col-label">Our Address</div>

                            <address className="ft-address">
                                <strong>Shivshakti Computer Academy</strong>
                                1st Floor, Above Usha Matching Center<br />
                                Near Babra Petrol Pump, Banaras Road<br />
                                Phunderdihari, Ambikapur<br />
                                Dist: Surguja, Chhattisgarh – 497001
                            </address>

                            <div className="ft-hours">
                                <span className="ft-hours-dot" aria-hidden="true" />
                                Mon – Sat · 8:00 AM – 6:00 PM
                            </div>

                            <br />

                            <Link href="/enquiry" className="ft-enroll-btn">
                                Admission Enquiry
                                <span className="ft-enroll-arrow" aria-hidden="true">→</span>
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Bottom bar */}
                <div className="ft-bottom">
                    <p className="ft-copy">
                        © {new Date().getFullYear()} Shivshakti Computer Academy, Ambikapur. All rights reserved.
                    </p>

                    <div className="ft-legal">
                        {legalLinks.map((l, i) => (
                            <span key={l.href} style={{ display: "contents" }}>
                                <Link href={l.href} className="ft-legal-link">
                                    {l.label}
                                </Link>
                                {i < legalLinks.length - 1 && (
                                    <span className="ft-legal-sep" aria-hidden="true" />
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </footer>
        </>
    );
}