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
            <main className="vc-root">

                {/* ════════════ HERO ════════════ */}
                <section
                    className="vc-hero home-section"
                    aria-labelledby="verify-hero-heading"
                >
                    <div className="vc-hero__glow vc-hero__glow--1" aria-hidden="true" />
                    <div className="vc-hero__glow vc-hero__glow--2" aria-hidden="true" />

                    <div className="container container-xl vc-hero__inner">
                        {/* Eyebrow */}
                        <div className="vc-hero__eyebrow">
                            <span className="vc-hero__eyebrow-line" aria-hidden="true" />
                            Official Verification
                        </div>

                        {/* Split layout */}
                        <div className="vc-hero__layout">
                            <h1
                                id="verify-hero-heading"
                                className="vc-hero__title"
                            >
                                Certificate
                                <br />
                                <em className="vc-hero__title-em">
                                    Verification
                                </em>
                            </h1>
                            <p className="vc-hero__desc">
                                Enter your certificate number to be directed
                                to the official issuing authority&apos;s
                                verification portal.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ════════════ BODY ════════════ */}
                <section
                    className="vc-body"
                    aria-label="Certificate verification"
                >
                    <div className="vc-body__divider" aria-hidden="true" />

                    <div className="container container-xl vc-body__inner">
                        <VerificationForm />
                        <VerificationInfo />
                    </div>
                </section>
            </main>

            {/* ════════════ PAGE-SCOPED CSS ════════════ */}
            <style>{`

/* ══════════════════════════════════════════
   VERIFY CERTIFICATE PAGE  —  page-scoped
   Follows: variables.css + components.css
   ══════════════════════════════════════════ */

/* ── Root ───────────────────────────────── */
.vc-root {
  background-color: var(--bg-page);
  min-height: 100vh;
}

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
.vc-hero {
  position: relative;
  padding: var(--space-24) 0 var(--space-16);
  overflow: hidden;
  background: linear-gradient(
    160deg,
    var(--color-primary-200) 0%,
    var(--color-white) 60%,
    var(--color-primary-400) 100%
  );
}

/* Glow orbs */
.vc-hero__glow {
  position: absolute;
  border-radius: var(--radius-full);
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.30;
}
.vc-hero__glow--1 {
  width: 460px;
  height: 460px;
  background: var(--color-primary-200);
  top: -190px;
  right: -130px;
}
.vc-hero__glow--2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent-200);
  bottom: -80px;
  left: -80px;
}

.vc-hero__inner {
  position: relative;
  z-index: 2;
}

/* Eyebrow */
.vc-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary-600);
  margin-bottom: var(--space-4);
}
.vc-hero__eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Split layout */
.vc-hero__layout {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-10);
  flex-wrap: wrap;
}

/* Title */
.vc-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0;
}
.vc-hero__title-em {
  font-style: italic;
  background: linear-gradient(
    135deg,
    var(--color-primary-600),
    var(--color-accent-500)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Desc */
.vc-hero__desc {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  max-width: 360px;
  margin: 0;
  padding-bottom: var(--space-1);
}

/* ══════════════════════════════════════════
   BODY
   ══════════════════════════════════════════ */
.vc-body {
  position: relative;
  padding-bottom: var(--space-24);
}
.vc-body__divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-color),
    transparent
  );
  margin: 0 10%;
}
.vc-body__inner {
  padding-top: var(--space-12);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  align-items: start;
}

/* ══════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════ */
@media (max-width: 768px) {
  .vc-hero {
    padding: var(--space-16) 0 var(--space-12);
  }
  .vc-hero__layout {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  .vc-hero__desc {
    max-width: 100%;
  }
  .vc-body__inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .vc-hero {
    padding: var(--space-12) 0 var(--space-10);
  }
  .vc-body {
    padding-bottom: var(--space-16);
  }
}

      `}</style>
        </>
    );
}