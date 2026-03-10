// src/components/TopBar.tsx
import Link from "next/link";

export default function TopBar() {
    return (
        <>
            <style>{`
                .tb-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #1a1208;
                    border-bottom: 1px solid rgba(252,211,77,0.1);
                    position: relative;
                    z-index: 50;
                }
                .tb-inner {
                    max-width: 1100px; 
                    margin: 0 auto; 
                    padding: 0 24px;
                    height: 36px; 
                    display: flex;
                    align-items: center; 
                    justify-content: space-between; 
                    gap: 16px;
                }
                .tb-left { 
                    display: flex; 
                    align-items: center; 
                    gap: 20px; 
                }
                .tb-item {
                    display: flex; 
                    align-items: center; 
                    gap: 6px;
                    font-size: 11px; 
                    font-weight: 300;
                    color: rgba(254,243,199,0.55); 
                    letter-spacing: 0.02em; 
                    white-space: nowrap;
                }
                .tb-item-icon { 
                    font-size: 0.75rem; 
                    opacity: 0.7; 
                }
                .tb-sep { 
                    width: 1px; 
                    height: 12px; 
                    background: rgba(252,211,77,0.15); 
                    flex-shrink: 0; 
                }
                .tb-right { 
                    display: flex; 
                    align-items: center; 
                    gap: 16px; 
                    flex-shrink: 0; 
                }
                .tb-link {
                    font-size: 11px; 
                    font-weight: 400;
                    color: rgba(254,243,199,0.5); 
                    text-decoration: none;
                    letter-spacing: 0.04em; 
                    transition: color 0.18s;
                }
                .tb-link:hover { 
                    color: #fcd34d; 
                }
                .tb-admission {
                    font-size: 10px; 
                    font-weight: 500; 
                    letter-spacing: 0.1em;
                    text-transform: uppercase; 
                    color: #1a1208;
                    background: #fcd34d; 
                    padding: 4px 12px;
                    border-radius: 100px; 
                    text-decoration: none;
                    transition: background 0.18s; 
                    white-space: nowrap;
                }
                .tb-admission:hover { 
                    background: #fef3c7; 
                }
                @media (max-width: 768px) {
                    .tb-left { 
                        display: none; 
                    }
                    .tb-inner { 
                        justify-content: flex-end; 
                    }
                }
            `}</style>

            <div className="tb-root">
                <div className="tb-inner">
                    <div className="tb-left">
                        <span className="tb-item">
                            <span className="tb-item-icon">📞</span>
                            +91 74770 36832
                        </span>
                        <span className="tb-sep" />
                        <span className="tb-item">
                            <span className="tb-item-icon">📍</span>
                            Ambikapur, Chhattisgarh
                        </span>
                        <span className="tb-sep" />
                        <span className="tb-item">
                            <span className="tb-item-icon">🕐</span>
                            Mon–Sat · 8AM–6PM
                        </span>
                    </div>

                    <div className="tb-right">
                        <Link href="/student/login" className="tb-link">Student Portal</Link>
                        <span className="tb-sep" />
                        <Link href="/teacher/login" className="tb-link">Teacher</Link>
                        <span className="tb-sep" />
                        <Link href="/admin/login" className="tb-link">Admin</Link>
                        <Link href="/enquiry" className="tb-admission">Admission</Link>
                    </div>
                </div>
            </div>
        </>
    );
}