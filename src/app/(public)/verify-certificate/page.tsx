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
    <main className="vc-root">
      {/* ── HERO ── */}
      <section className="vc-hero" aria-labelledby="verify-hero-heading">
        <div className="container vc-hero__inner">
          <div className="vc-hero__eyebrow">
            <span className="vc-hero__eyebrow-line" aria-hidden="true" />
            Official Verification
          </div>
          <div className="vc-hero__layout">
            <h1 id="verify-hero-heading" className="vc-hero__title">
              Certificate{" "}
              <span className="vc-hero__title-em">Verification</span>
            </h1>
            <p className="vc-hero__desc">
              Enter your certificate number to be directed to the official
              issuing authority&apos;s verification portal.
            </p>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="vc-body" aria-label="Certificate verification">
        <div className="container vc-body__inner">
          <VerificationForm />
          <VerificationInfo />
        </div>
      </section>
    </main>
  );
}