"use client";

import Link from "next/link";

export default function TopBar() {
    return (
        <>
            <style jsx>{topBarStyles}</style>
            <div className="topbar-wrapper">
                <div className="topbar-container">
                    {/* Left Side - Contact Info */}
                    <div className="topbar-left">
                        <a href="tel:+917477036832" className="topbar-info-item topbar-phone">
                            <svg className="topbar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                            <span>+91 74770 36832</span>
                        </a>

                        <span className="topbar-divider" />

                        <div className="topbar-info-item">
                            <svg className="topbar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Ambikapur, Chhattisgarh</span>
                        </div>

                        <span className="topbar-divider" />

                        <div className="topbar-info-item">
                            <svg className="topbar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Mon–Sat · 8AM–6PM</span>
                        </div>
                    </div>

                    {/* Right Side - Portal Links */}
                    <div className="topbar-right">
                        <div className="topbar-portals">
                            {[
                                { href: "/student/login", label: "Student", icon: "👨‍🎓" },
                                { href: "/teacher/login", label: "Teacher", icon: "👨‍🏫" },
                                { href: "/admin/login", label: "Admin", icon: "🔐" },
                            ].map((portal, i) => (
                                <div key={portal.href} className="topbar-portal-group">
                                    {i > 0 && <span className="topbar-divider" />}
                                    <Link href={portal.href} className="topbar-portal-link">
                                        <span className="topbar-portal-icon">{portal.icon}</span>
                                        <span>{portal.label}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <Link href="/enquiry" className="topbar-cta">
                            <svg className="topbar-cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>Admission</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

const topBarStyles = `
/* ==========================================
   TOPBAR STYLES - Premium Design
   ========================================== */

.topbar-wrapper {
    position: relative;
    z-index: 51;
    background: linear-gradient(135deg, var(--color-gray-900), var(--color-gray-800));
    border-bottom: 1px solid rgba(59, 130, 246, 0.15);
    font-family: var(--font-sans);
}

.topbar-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--space-8);
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-6);
}

/* Left Side */
.topbar-left {
    display: none;
}

@media (min-width: 1024px) {
    .topbar-left {
        display: flex;
        align-items: center;
        gap: var(--space-4);
    }
}

.topbar-info-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-normal);
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all var(--transition-fast);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
}

.topbar-phone:hover {
    color: var(--color-white);
    background: rgba(59, 130, 246, 0.15);
}

.topbar-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.8;
}

.topbar-divider {
    width: 1px;
    height: 16px;
    background: rgba(59, 130, 246, 0.2);
    flex-shrink: 0;
}

/* Right Side */
.topbar-right {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-left: auto;
}

.topbar-portals {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.topbar-portal-group {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.topbar-portal-link {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
}

.topbar-portal-link:hover {
    color: var(--color-white);
    background: rgba(59, 130, 246, 0.15);
}

.topbar-portal-icon {
    font-size: var(--font-size-sm);
    flex-shrink: 0;
}

/* CTA Button */
.topbar-cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--color-accent-500), var(--color-accent-600));
    color: var(--color-white);
    text-decoration: none;
    transition: all var(--transition-base);
    box-shadow: 0 2px 12px rgba(249, 115, 22, 0.3);
}

.topbar-cta:hover {
    background: linear-gradient(135deg, var(--color-accent-600), var(--color-accent-700));
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
}

.topbar-cta-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

/* Mobile Responsive */
@media (max-width: 1023px) {
    .topbar-container {
        padding: 0 var(--space-4);
        height: 40px;
    }

    .topbar-portal-link span:not(.topbar-portal-icon) {
        display: none;
    }

    .topbar-portals {
        gap: var(--space-2);
    }

    .topbar-portal-link {
        padding: var(--space-1) var(--space-2);
    }

    .topbar-cta {
        padding: var(--space-2) var(--space-3);
        font-size: 11px;
    }
}

@media (max-width: 640px) {
    .topbar-divider {
        display: none;
    }

    .topbar-cta-icon {
        display: none;
    }
}
`;