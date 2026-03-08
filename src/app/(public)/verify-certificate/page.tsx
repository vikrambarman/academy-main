// ============================================================
// app/verify-certificate/page.tsx  (Server Component)
// ============================================================
import type { Metadata } from "next";
import VerificationForm from "@/components/verify/VerificationForm";
import VerificationInfo from "@/components/verify/VerificationInfo";

export const metadata: Metadata = {
    title: "Certificate Verification | Shivshakti Computer Academy",
    description:
        "Verify your certificates issued through Shivshakti Computer Academy via official authorities like Drishti, GSDM, NSDC, and DigiLocker.",
};

export default function VerifyCertificatePage() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .vc-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    min-height: 100vh;
                }

                .vc-hero {
                    padding: 88px 24px 64px;
                    position: relative;
                    overflow: hidden;
                }

                .vc-hero-glow {
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 420px; height: 420px;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                .vc-hero-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .vc-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .vc-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 1.5px;
                    background: #d97706;
                }

                .vc-hero-layout {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                }

                .vc-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.15;
                }

                .vc-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .vc-hero-desc {
                    font-size: 0.88rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    max-width: 340px;
                    padding-bottom: 4px;
                }

                .vc-body {
                    padding: 0 24px 88px;
                    position: relative;
                }

                .vc-body::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .vc-body-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding-top: 52px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    align-items: start;
                }

                @media (max-width: 900px) {
                    .vc-body-inner { grid-template-columns: 1fr; }
                    .vc-hero-layout { flex-direction: column; align-items: flex-start; gap: 12px; }
                }

                @media (max-width: 480px) {
                    .vc-hero { padding: 64px 20px 52px; }
                    .vc-body { padding: 0 20px 64px; }
                }
            `}</style>

            <main className="vc-root">
                <div className="vc-hero">
                    <div className="vc-hero-glow" aria-hidden="true" />
                    <div className="vc-hero-inner">
                        <div className="vc-eyebrow">Official Verification</div>
                        <div className="vc-hero-layout">
                            <h1 className="vc-title">
                                Certificate<br /><em>Verification</em>
                            </h1>
                            <p className="vc-hero-desc">
                                Enter your certificate number to be directed
                                to the official issuing authority's verification portal.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="vc-body">
                    <div className="vc-body-inner">
                        <VerificationForm />
                        <VerificationInfo />
                    </div>
                </div>
            </main>
        </>
    );
}