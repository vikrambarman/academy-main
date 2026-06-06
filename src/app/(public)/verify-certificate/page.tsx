// ============================================================
// app/(public)/verify-certificate/page.tsx  (Server Component)
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
      <main className="vc-root">
        {/* ── HERO ── */}
        <section className="vc-hero" aria-labelledby="verify-hero-heading">
          <div className="container container-xl vc-hero__inner">
            <div className="vc-hero__eyebrow">
              <span className="vc-hero__eyebrow-line" aria-hidden="true" />
              Official Verification
            </div>
            <div className="vc-hero__layout">
              <h1 id="verify-hero-heading" className="vc-hero__title">
                Certificate <span className="vc-hero__title-em">Verification</span>
              </h1>
              <p className="vc-hero__desc">
                Enter your certificate number to be directed to the official issuing
                authority&apos;s verification portal.
              </p>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <section className="vc-body" aria-label="Certificate verification">
          <div className="container container-xl vc-body__inner">
            <VerificationForm />
            <VerificationInfo />
          </div>
        </section>
      </main>

      <style>{`
/* ── VERIFY CERTIFICATE — Clean University style ── */
.vc-root { background: var(--bg-page); min-height: 100vh; }

.vc-hero { position: relative; padding: var(--space-20) 0 var(--space-12); background: var(--bg-page); border-bottom: 1px solid var(--border-color); }
.vc-hero__inner { position: relative; }
.vc-hero__eyebrow { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3); }
.vc-hero__eyebrow-line { width: 24px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.vc-hero__layout { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-8); flex-wrap: wrap; }
.vc-hero__title { font-family: var(--font-display); font-size: clamp(1.75rem, 3.6vw, 2.5rem); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.2; letter-spacing: -0.015em; margin: 0; }
.vc-hero__title-em { font-style: normal; color: var(--color-primary-700); }
.vc-hero__desc { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; max-width: 380px; margin: 0; }

.vc-body { padding: var(--space-12) 0 var(--space-24); }
.vc-body__inner { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); align-items: start; }

@media (max-width: 768px) {
  .vc-hero { padding: var(--space-16) 0 var(--space-10); }
  .vc-hero__layout { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .vc-hero__desc { max-width: 100%; }
  .vc-body__inner { grid-template-columns: 1fr; }
  .vc-body { padding: var(--space-10) 0 var(--space-16); }
}
      `}</style>
    </>
  );
}
