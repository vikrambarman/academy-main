import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone, ArrowRight } from "lucide-react";

/* All data from your ORIGINAL — nothing invented. */
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
  { href: "https://facebook.com/shivshakticomputeracademy", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com/shivshakticomputer07", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
];

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>

      <footer className="footer-root">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand Column */}
            <div>
              <div className="footer-brand-name">Shivshakti Computer Academy</div>
              <div className="footer-brand-sub">Ambikapur · Chhattisgarh</div>
              <p className="footer-brand-desc">
                Leading computer training institute in Ambikapur, Surguja — offering DCA,
                PGDCA, ADCA, Tally, CCC and government-recognized certification programs.
              </p>

              <div className="footer-contacts">
                <a href="tel:+917477036832" className="footer-contact-row">
                  <span className="footer-contact-icon">
                    <Phone size={13} strokeWidth={1.8} />
                  </span>
                  +91 74770 36832
                </a>
                <a href="https://wa.me/919009087883" target="_blank" rel="noopener noreferrer" className="footer-contact-row">
                  <span className="footer-contact-icon">
                    <Phone size={13} strokeWidth={1.8} />
                  </span>
                  +91 90090 87883 (WhatsApp)
                </a>
                <a href="mailto:shivshakticomputeracademy25@gmail.com" className="footer-contact-row">
                  <span className="footer-contact-icon">
                    <Mail size={13} strokeWidth={1.8} />
                  </span>
                  shivshakticomputeracademy25@gmail.com
                </a>
              </div>

              <div className="footer-socials">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a key={social.label} href={social.href} aria-label={social.label} className="footer-social-btn" target="_blank" rel="noopener noreferrer">
                      <Icon size={15} strokeWidth={1.8} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="footer-col-label">Quick Links</div>
              <ul className="footer-links">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <div className="footer-col-label">Resources</div>
              <ul className="footer-links">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address */}
            <div>
              <div className="footer-col-label">Our Address</div>
              <address className="footer-address">
                <strong>Shivshakti Computer Academy</strong>
                1st Floor, Above Usha Matching Center<br />
                Near Babra Petrol Pump, Banaras Road<br />
                Phunderdihari, Ambikapur<br />
                Dist: Surguja, Chhattisgarh – 497001
              </address>
              <div className="footer-hours">
                <span className="footer-hours-dot" aria-hidden="true" />
                Mon – Sat · 8:00 AM – 6:00 PM
              </div>
              <Link href="/enquiry" className="footer-enroll-btn">
                Admission Enquiry
                <ArrowRight size={15} strokeWidth={2} className="footer-enroll-arrow" />
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p className="footer-copy">
              © {new Date().getFullYear()} Shivshakti Computer Academy, Ambikapur. All
              rights reserved.
            </p>
            <div className="footer-legal">
              {legalLinks.map((link, i) => (
                <span key={link.href} style={{ display: "contents" }}>
                  <Link href={link.href} className="footer-legal-link">{link.label}</Link>
                  {i < legalLinks.length - 1 && <span className="footer-legal-sep" aria-hidden="true" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

const footerStyles = `
/* ── FOOTER — Clean University style (sober dark) ── */
.footer-root {
  background: var(--color-gray-900);
  position: relative;
  font-family: var(--font-sans);
  border-top: 3px solid var(--color-primary-600);
}
[data-theme="dark"] .footer-root { background: #0e0d0a; }

.footer-inner { max-width: 1100px; margin: 0 auto; padding: var(--space-16) var(--space-6) 0; position: relative; }

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
  gap: var(--space-10);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
@media (max-width: 960px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: var(--space-8); } }
@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; gap: var(--space-8); }
  .footer-inner { padding: var(--space-12) var(--space-5) 0; }
}

/* Brand */
.footer-brand-name {
  font-family: var(--font-display); font-size: 1.15rem;
  font-weight: var(--font-weight-semibold); color: rgba(255,255,255,0.95);
  line-height: 1.3; margin-bottom: var(--space-2);
}
.footer-brand-sub {
  font-size: var(--font-size-xs); color: rgba(255,255,255,0.4);
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: var(--space-5);
}
.footer-brand-desc { font-size: var(--font-size-sm); color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: var(--space-6); }

/* Contacts */
.footer-contacts { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6); }
.footer-contact-row {
  display: flex; align-items: center; gap: var(--space-3); text-decoration: none;
  font-size: var(--font-size-sm); color: rgba(255,255,255,0.6); transition: color var(--transition-fast);
}
.footer-contact-row:hover { color: rgba(255,255,255,0.95); }
.footer-contact-icon {
  width: 28px; height: 28px; border-radius: var(--radius-md); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); color: rgba(255,255,255,0.7);
}

/* Socials */
.footer-socials { display: flex; gap: var(--space-2); }
.footer-social-btn {
  width: 34px; height: 34px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14);
  color: rgba(255,255,255,0.55); text-decoration: none;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}
.footer-social-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }

/* Column labels */
.footer-col-label {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--color-accent-400, #c68a52);
  display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-5);
}
.footer-col-label::before { content: ""; display: inline-block; width: 16px; height: 2px; background: var(--color-accent-500); }

/* Links */
.footer-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.footer-link {
  display: inline-flex; align-items: center;
  font-size: var(--font-size-sm); color: rgba(255,255,255,0.55); text-decoration: none;
  padding: var(--space-2) 0; border-bottom: 1px solid rgba(255,255,255,0.07);
  transition: color var(--transition-fast);
}
.footer-link:last-child { border-bottom: none; }
.footer-link:hover { color: #fff; }

/* Address */
.footer-address { font-size: var(--font-size-sm); color: rgba(255,255,255,0.55); line-height: 1.9; font-style: normal; margin-bottom: var(--space-5); }
.footer-address strong { display: block; font-weight: var(--font-weight-medium); color: rgba(255,255,255,0.85); margin-bottom: var(--space-1); }
.footer-hours {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14);
  padding: var(--space-2) var(--space-3); border-radius: var(--radius-full); margin-bottom: var(--space-5);
}
.footer-hours-dot { width: 6px; height: 6px; background: var(--color-success); border-radius: 50%; flex-shrink: 0; }

.footer-enroll-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: #fff; background: var(--color-accent-600);
  padding: var(--space-3) var(--space-5); border-radius: var(--radius-md);
  text-decoration: none; transition: background var(--transition-fast);
}
.footer-enroll-btn:hover { background: var(--color-accent-700); }
.footer-enroll-arrow { transition: transform var(--transition-fast); }
.footer-enroll-btn:hover .footer-enroll-arrow { transform: translateX(3px); }

/* Bottom bar */
.footer-bottom {
  max-width: 1100px; margin: 0 auto;
  padding: var(--space-5) var(--space-6) var(--space-8);
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-4); flex-wrap: wrap;
}
@media (max-width: 600px) { .footer-bottom { padding: var(--space-4) var(--space-5) var(--space-6); flex-direction: column; align-items: flex-start; gap: var(--space-3); } }
.footer-copy { font-size: var(--font-size-xs); color: rgba(255,255,255,0.4); margin: 0; }
.footer-legal { display: flex; align-items: center; gap: var(--space-1); flex-wrap: wrap; }
.footer-legal-link {
  font-size: var(--font-size-xs); color: rgba(255,255,255,0.4); text-decoration: none;
  padding: var(--space-1) var(--space-2); transition: color var(--transition-fast);
}
.footer-legal-link:hover { color: rgba(255,255,255,0.8); }
.footer-legal-sep { width: 1px; height: 10px; background: rgba(255,255,255,0.2); }
`;
