// ============================================================
// MegaMenu.tsx
// ============================================================
import Link from "next/link";

interface Props {
    active: string | null;
    closeMenu: () => void;
}

const academyLinks = [
    { href: "/about", label: "About Us", desc: "Our story, mission & vision" },
    { href: "/accreditations", label: "Accreditations", desc: "Certifications & quality marks" },
    { href: "/gallery", label: "Gallery", desc: "Photos from our campus" },
];

const recognitionLinks = [
    { href: "/msme", label: "MSME Registration", desc: "Govt. registered institute" },
    { href: "/affiliations", label: "Affiliations", desc: "Our partners & tie-ups" },
];

const resourceLinks = [
    { href: "/notices", label: "Notices", desc: "Admissions & announcements", highlight: true },
    { href: "/verify-certificate", label: "Verify Certificate", desc: "Check your certificate online" },
    { href: "/faq", label: "FAQ", desc: "Common questions answered" },
];

const portalLinks = [
    { href: "/student/login", label: "Student Login", desc: "Access your student portal" },
    { href: "/admin/login", label: "Admin Login", desc: "Staff & admin access" },
];

export default function MegaMenu({ active, closeMenu }: Props) {
    if (!active) return null;

    return (
        <>
            <style>{`
                .mm-root {
                    font-family: 'DM Sans', sans-serif;
                    position: absolute;
                    left: 0;
                    right: 0;
                    background: #fff;
                    border-bottom: 1px solid #e8dfd0;
                    box-shadow: 0 16px 48px rgba(100,70,20,0.1);
                    z-index: 40;
                    animation: mmFadeIn 0.18s ease both;
                }

                @keyframes mmFadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .mm-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 36px 24px 40px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                }

                /* Column */
                .mm-col-label {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                }

                .mm-col-label::before {
                    content: '';
                    display: inline-block;
                    width: 16px;
                    height: 1.5px;
                    background: #d97706;
                }

                /* Link item */
                .mm-link {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 12px;
                    text-decoration: none;
                    margin-bottom: 2px;
                    transition: background 0.18s;
                    position: relative;
                }

                .mm-link:hover {
                    background: #fef9ee;
                }

                /* Left amber bar */
                .mm-link::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 8px; bottom: 8px;
                    width: 2px;
                    background: #d97706;
                    border-radius: 2px;
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 0.2s ease;
                }

                .mm-link:hover::before {
                    transform: scaleY(1);
                }

                .mm-link-icon {
                    width: 32px;
                    height: 32px;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.82rem;
                    flex-shrink: 0;
                    transition: background 0.18s;
                }

                .mm-link:hover .mm-link-icon {
                    background: #fef3c7;
                }

                .mm-link-title {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #1a1208;
                    line-height: 1.3;
                    margin-bottom: 2px;
                }

                .mm-link-desc {
                    font-size: 0.73rem;
                    font-weight: 300;
                    color: #92826b;
                    line-height: 1.4;
                }

                /* Highlighted notices link */
                .mm-link-highlight .mm-link-title {
                    color: #b45309;
                }

                .mm-link-highlight .mm-link-icon {
                    background: #fffbeb;
                    border-color: #fcd34d;
                }

                .mm-new-badge {
                    display: inline-flex;
                    align-items: center;
                    font-size: 8px;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    background: #d97706;
                    color: #fff;
                    padding: 2px 7px;
                    border-radius: 100px;
                    margin-left: 6px;
                    vertical-align: middle;
                }
            `}</style>

            <div className="mm-root">
                <div className="mm-inner">

                    {/* ── ACADEMY ── */}
                    {active === "academy" && (
                        <>
                            <div>
                                <div className="mm-col-label">Academy</div>
                                {academyLinks.map((l) => (
                                    <Link key={l.href} href={l.href} onClick={closeMenu} className="mm-link">
                                        <span className="mm-link-icon" aria-hidden="true">🏫</span>
                                        <div>
                                            <div className="mm-link-title">{l.label}</div>
                                            <div className="mm-link-desc">{l.desc}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div>
                                <div className="mm-col-label">Recognition</div>
                                {recognitionLinks.map((l) => (
                                    <Link key={l.href} href={l.href} onClick={closeMenu} className="mm-link">
                                        <span className="mm-link-icon" aria-hidden="true">🏛</span>
                                        <div>
                                            <div className="mm-link-title">{l.label}</div>
                                            <div className="mm-link-desc">{l.desc}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── RESOURCES ── */}
                    {active === "resources" && (
                        <>
                            <div>
                                <div className="mm-col-label">Resources</div>
                                {resourceLinks.map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        onClick={closeMenu}
                                        className={`mm-link ${l.highlight ? "mm-link-highlight" : ""}`}
                                    >
                                        <span className="mm-link-icon" aria-hidden="true">
                                            {l.href === "/notices" ? "📢" : l.href === "/verify-certificate" ? "🔍" : "❓"}
                                        </span>
                                        <div>
                                            <div className="mm-link-title">
                                                {l.label}
                                                {l.highlight && (
                                                    <span className="mm-new-badge">New</span>
                                                )}
                                            </div>
                                            <div className="mm-link-desc">{l.desc}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div>
                                <div className="mm-col-label">Portals</div>
                                {portalLinks.map((l) => (
                                    <Link key={l.href} href={l.href} onClick={closeMenu} className="mm-link">
                                        <span className="mm-link-icon" aria-hidden="true">🔐</span>
                                        <div>
                                            <div className="mm-link-title">{l.label}</div>
                                            <div className="mm-link-desc">{l.desc}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    );
}