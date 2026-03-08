// ============================================================
// app/login/page.tsx  (Portal Selector)
// ============================================================
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const portals = [
  {
    href: "/admin/login",
    badge: "Admin Portal",
    title: "Administrator",
    desc: "Manage students, courses, payments, certificates and all academy operations.",
    features: ["Student Management", "Course & Fees Control", "Certificate Tracking", "Secure OTP Authentication"],
    accent: "#1a1208",
    accentText: "#fef3c7",
  },
  {
    href: "/student/login",
    badge: "Student Portal",
    title: "Student",
    desc: "Access your course details, payment records and certificate status from your dashboard.",
    features: ["View Course Information", "Track Fee Payments", "Check Certificate Status", "Personal Student Dashboard"],
    accent: "#1a1208",
    accentText: "#fef3c7",
  },
];

export default function PortalSelectorPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500&display=swap');

                .ps-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #faf8f4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    position: relative;
                    overflow: hidden;
                }

                .ps-glow-1 {
                    position: fixed;
                    top: -100px; right: -100px;
                    width: 440px; height: 440px;
                    background: radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 65%);
                    pointer-events: none;
                }

                .ps-glow-2 {
                    position: fixed;
                    bottom: -80px; left: -80px;
                    width: 360px; height: 360px;
                    background: radial-gradient(circle, rgba(252,211,77,0.05) 0%, transparent 65%);
                    pointer-events: none;
                }

                .ps-wrap {
                    width: 100%;
                    max-width: 860px;
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .ps-header {
                    text-align: center;
                    margin-bottom: 48px;
                }

                .ps-logo-wrap {
                    width: 56px; height: 56px;
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    overflow: hidden;
                }

                .ps-eyebrow {
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .ps-eyebrow::before,
                .ps-eyebrow::after {
                    content: '';
                    display: inline-block;
                    width: 20px; height: 1px;
                    background: #d97706;
                }

                .ps-header-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 3vw, 2.2rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                    margin-bottom: 8px;
                }

                .ps-header-sub {
                    font-size: 0.85rem;
                    font-weight: 300;
                    color: #92826b;
                }

                /* Grid */
                .ps-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 20px;
                }

                /* Card */
                .ps-card {
                    background: #fff;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    padding: 32px 28px;
                    cursor: pointer;
                    transition: border-color 0.22s, box-shadow 0.22s, transform 0.18s;
                    position: relative;
                    overflow: hidden;
                    outline: none;
                }

                .ps-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(to right, #d97706, #fcd34d);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.3s ease;
                }

                .ps-card:hover {
                    border-color: #d97706;
                    box-shadow: 0 12px 40px rgba(100,70,20,0.11);
                    transform: translateY(-2px);
                }

                .ps-card:hover::before { transform: scaleX(1); }
                .ps-card:active { transform: translateY(0) scale(0.99); }

                .ps-card-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 8px;
                    font-weight: 500;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #92540a;
                    background: #fffbeb;
                    border: 1px solid #fde68a;
                    padding: 4px 11px;
                    border-radius: 100px;
                    margin-bottom: 20px;
                }

                .ps-card-badge-dot {
                    width: 4px; height: 4px;
                    background: #d97706;
                    border-radius: 50%;
                }

                .ps-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                    margin-bottom: 10px;
                }

                .ps-card-desc {
                    font-size: 0.8rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.75;
                    margin-bottom: 22px;
                }

                .ps-card-features {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    border: 1px solid #f0e8d8;
                    border-radius: 11px;
                    overflow: hidden;
                    margin-bottom: 24px;
                }

                .ps-card-feat {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 8px 12px;
                    font-size: 0.77rem;
                    font-weight: 300;
                    color: #4a3f30;
                    border-bottom: 1px solid #f8f3ea;
                    transition: background 0.15s;
                }

                .ps-card-feat:last-child { border-bottom: none; }
                .ps-card:hover .ps-card-feat { background: #fffbeb; }

                .ps-card-feat-check {
                    width: 14px; height: 14px;
                    background: rgba(74,222,128,0.1);
                    border: 1px solid rgba(74,222,128,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.5rem;
                    color: #4ade80;
                    flex-shrink: 0;
                }

                .ps-card-cta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #1a1208;
                    padding-top: 4px;
                }

                .ps-card-arrow {
                    width: 28px; height: 28px;
                    background: #faf8f4;
                    border: 1px solid #e8dfd0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    color: #6b5e4b;
                    transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s;
                }

                .ps-card:hover .ps-card-arrow {
                    background: #1a1208;
                    border-color: #1a1208;
                    color: #fcd34d;
                    transform: translateX(3px);
                }

                /* Footer */
                .ps-footer {
                    text-align: center;
                    font-size: 0.7rem;
                    font-weight: 300;
                    color: #b8a898;
                }

                @media (max-width: 640px) {
                    .ps-grid { grid-template-columns: 1fr; }
                    .ps-card { padding: 24px 22px; }
                }
            `}</style>

      <main className="ps-root">
        <div className="ps-glow-1" aria-hidden="true" />
        <div className="ps-glow-2" aria-hidden="true" />

        <div className="ps-wrap">
          <div className="ps-header">
            <div className="ps-logo-wrap">
              <Image src="/logo.png" alt="Shivshakti Computer Academy" width={40} height={40} className="object-contain" />
            </div>
            <div className="ps-eyebrow">Portal Access</div>
            <div className="ps-header-title">Shivshakti Computer Academy</div>
            <div className="ps-header-sub">Select the portal you want to access</div>
          </div>

          <div className="ps-grid">
            {portals.map((p) => (
              <div
                key={p.href}
                className="ps-card"
                onClick={() => router.push(p.href)}
                role="button"
                tabIndex={0}
                aria-label={`Go to ${p.title} portal`}
                onKeyDown={(e) => e.key === "Enter" && router.push(p.href)}
              >
                <div className="ps-card-badge">
                  <span className="ps-card-badge-dot" aria-hidden="true" />
                  {p.badge}
                </div>
                <div className="ps-card-title">{p.title} Access</div>
                <p className="ps-card-desc">{p.desc}</p>

                <div className="ps-card-features">
                  {p.features.map((f) => (
                    <div key={f} className="ps-card-feat">
                      <div className="ps-card-feat-check" aria-hidden="true">✓</div>
                      {f}
                    </div>
                  ))}
                </div>

                <div className="ps-card-cta">
                  <span>Sign In →</span>
                  <div className="ps-card-arrow" aria-hidden="true">→</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ps-footer">© 2026 Shivshakti Computer Academy. All rights reserved.</div>
        </div>
      </main>
    </>
  );
}