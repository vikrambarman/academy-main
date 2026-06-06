"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const PORTALS = [
    {
        href: "/admin/login",
        badge: "Admin Portal",
        icon: "⚙️",
        title: "Administrator",
        desc: "Manage students, courses, payments, certificates and all academy operations.",
        features: ["Student Management", "Course & Fees Control", "Certificate Tracking", "Secure OTP Authentication"],
        color: "#1e40af",
    },
    {
        href: "/teacher/login",
        badge: "Faculty Portal",
        icon: "📋",
        title: "Teacher",
        desc: "Mark attendance, manage timetables and create study notes for your students.",
        features: ["Mark Daily Attendance", "Manage Class Timetable", "Create & Edit Notes", "View Student Progress"],
        color: "#ea580c",
        highlight: true,
    },
    {
        href: "/student/login",
        badge: "Student Portal",
        icon: "🎓",
        title: "Student",
        desc: "Access your course details, payment records and certificate status.",
        features: ["View Course Information", "Track Fee Payments", "Check Certificate Status", "Personal Dashboard"],
        color: "#1e40af",
    },
];

export default function PortalSelectorPage() {
    const router = useRouter();

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="header">
                    <div className="logo">
                        <Image src="/logo.png" alt="Logo" width={48} height={48} />
                    </div>
                    <h1>Shivshakti Computer Academy</h1>
                    <p>Select the portal you want to access</p>
                </div>

                {/* Cards */}
                <div className="grid">
                    {PORTALS.map((p) => (
                        <button
                            key={p.href}
                            onClick={() => router.push(p.href)}
                            className={`card ${p.highlight ? "highlight" : ""}`}
                            style={{ borderTopColor: p.color }}
                        >
                            <div className="badge" style={{ background: `${p.color}15`, color: p.color, borderColor: `${p.color}30` }}>
                                <span>{p.icon}</span> {p.badge}
                            </div>

                            <h3>{p.title}</h3>
                            <p className="desc">{p.desc}</p>

                            <ul>
                                {p.features.map(f => (
                                    <li key={f}>
                                        <span className="check">✓</span> {f}
                                    </li>
                                ))}
                            </ul>

                            <div className="cta" style={{ color: p.color }}>
                                Sign In <span>→</span>
                            </div>
                        </button>
                    ))}
                </div>

                <p className="footer">© 2026 Shivshakti Computer Academy. All rights reserved.</p>
            </div>

            <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .container { width: 100%; max-width: 1080px; }
        .header { text-align: center; margin-bottom: 48px; }
        .logo {
          width: 64px; height: 64px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }
        .header p { margin: 0; color: #64748b; font-size: 15px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-top: 3px solid;
          border-radius: 12px;
          padding: 24px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
          border-color: #cbd5e1;
        }
        .card.highlight {
          box-shadow: 0 4px 16px rgba(234,88,12,0.12);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        h3 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 18px;
          min-height: 42px;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          overflow: hidden;
        }
        li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          font-size: 13px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          background: #f8fafc;
        }
        li:last-child { border-bottom: none; }
        .check {
          width: 16px;
          height: 16px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          flex-shrink: 0;
        }
        .cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
        }
        .cta span {
          transition: transform 0.2s;
        }
        .card:hover .cta span { transform: translateX(4px); }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #94a3b8;
        }
        @media (max-width: 768px) {
          h1 { font-size: 26px; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}