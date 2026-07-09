import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";

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
  {
    href: "https://facebook.com/shivshakticomputeracademy",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://instagram.com/shivshakticomputer07",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "#",
    icon: Linkedin,
    label: "LinkedIn",
  },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
];

// Static component — no "use client"
export default function Footer() {
  return (
    <footer className="footer-root">

      {/* ── TOP ACCENT STRIP ── */}
      <div className="footer-accent-strip">
        <div className="footer-accent-inner">
          <span>ISO 9001:2015 Certified</span>
          <span className="footer-strip-dot">·</span>
          <span>MSME Registered</span>
          <span className="footer-strip-dot">·</span>
          <span>Skill India Aligned</span>
          <span className="footer-strip-dot">·</span>
          <span>DigiLocker Enabled</span>
          <span className="footer-strip-dot">·</span>
          <span>GSDM Authorized</span>
          <span className="footer-strip-dot">·</span>
          <span>NSDC Partner</span>
        </div>
      </div>

      {/* ── MAIN FOOTER BODY ── */}
      <div className="footer-body">
        <div className="footer-grid">

          {/* ── Column 1 — Brand ── */}
          <div className="footer-col footer-col--brand">
            <div className="footer-brand-name">
              Shivshakti Computer Academy
            </div>
            <div className="footer-brand-location">
              Ambikapur · Surguja · Chhattisgarh
            </div>
            <p className="footer-brand-desc">
              Leading computer training institute in Ambikapur, Surguja
              — offering DCA, PGDCA, ADCA, Tally, CCC and
              government-recognized certification programs.
            </p>

            {/* Contact */}
            <div className="footer-contacts">
              <a
                href="tel:+917477036832"
                className="footer-contact-row"
              >
                <span className="footer-contact-icon">
                  <Phone size={13} strokeWidth={2} />
                </span>
                +91 74770 36832
              </a>
              <a
                href="https://wa.me/919009087883"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-row"
              >
                <span className="footer-contact-icon">
                  <Phone size={13} strokeWidth={2} />
                </span>
                +91 90090 87883 (WhatsApp)
              </a>
              <a
                href="mailto:shivshakticomputeracademy25@gmail.com"
                className="footer-contact-row"
              >
                <span className="footer-contact-icon">
                  <Mail size={13} strokeWidth={2} />
                </span>
                shivshakticomputeracademy25@gmail.com
              </a>
            </div>

            {/* Social Links */}
            <div className="footer-socials">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="footer-social-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={15} strokeWidth={1.8} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Column 2 — Quick Links ── */}
          <div className="footer-col">
            <div className="footer-col-label">Quick Links</div>
            <ul className="footer-links-list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    <ArrowRight size={12} strokeWidth={2.5} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3 — Resources ── */}
          <div className="footer-col">
            <div className="footer-col-label">Resources</div>
            <ul className="footer-links-list">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    <ArrowRight size={12} strokeWidth={2.5} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4 — Address ── */}
          <div className="footer-col">
            <div className="footer-col-label">Our Address</div>

            <address className="footer-address">
              <strong>Shivshakti Computer Academy</strong>
              1st Floor, Above Usha Matching Center,
              Near Babra Petrol Pump, Banaras Road,
              Phunderdihari, Ambikapur,
              Dist. Surguja, Chhattisgarh – 497001
            </address>

            {/* Hours badge */}
            <div className="footer-hours">
              <Clock size={12} strokeWidth={2} />
              <span>Mon – Sat · 8:00 AM – 6:00 PM</span>
            </div>

            {/* Map link */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Shivshakti+Computer+Academy+Ambikapur"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-map-link"
            >
              <MapPin size={13} strokeWidth={2} />
              Get Directions
            </a>

            {/* Enquiry CTA */}
            <Link href="/enquiry" className="footer-enroll-btn">
              Admission Enquiry
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} Shivshakti Computer Academy,
            Ambikapur. All rights reserved.
          </p>
          <div className="footer-legal">
            {legalLinks.map((link, i) => (
              <span key={link.href} className="footer-legal-item">
                <Link href={link.href} className="footer-legal-link">
                  {link.label}
                </Link>
                {i < legalLinks.length - 1 && (
                  <span
                    className="footer-legal-sep"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}