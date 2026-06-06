"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <style>{notFoundStyles}</style>
      <div className="nf-wrapper">
        <div className="nf-container">
          <div className="nf-icon-wrapper">
            <SearchX className="nf-icon" size={40} strokeWidth={1.5} />
          </div>

          <h1 className="nf-code">404</h1>
          <h2 className="nf-title">Page Not Found</h2>
          <p className="nf-description">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="nf-countdown">
            Redirecting to homepage in <span className="nf-timer">{countdown}</span>s
          </div>

          <div className="nf-actions">
            <button className="nf-btn nf-btn-primary" onClick={() => router.push("/")}>
              <Home size={16} strokeWidth={2} />
              Go to Homepage
            </button>
            <button className="nf-btn nf-btn-secondary" onClick={() => router.back()}>
              <ArrowLeft size={16} strokeWidth={2} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const notFoundStyles = `
/* ── 404 — Clean University style ── */
.nf-wrapper {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--bg-page); padding: var(--space-6);
}
.nf-container { max-width: 540px; text-align: center; }

.nf-icon-wrapper {
  width: 72px; height: 72px; margin: 0 auto var(--space-6);
  display: flex; align-items: center; justify-content: center;
  background: var(--color-primary-50); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}
.nf-icon { color: var(--color-primary-600); }

.nf-code {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 12vw, 6rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  margin: 0; line-height: 1; letter-spacing: -0.02em;
}
.nf-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: var(--space-3) 0 var(--space-3);
}
.nf-description {
  font-size: var(--font-size-base); color: var(--text-secondary);
  margin: 0 auto var(--space-6); max-width: 440px; line-height: 1.7;
}
.nf-countdown { font-size: var(--font-size-sm); color: var(--text-tertiary); margin-bottom: var(--space-8); }
.nf-timer { font-weight: var(--font-weight-semibold); color: var(--color-primary-700); }

.nf-actions { display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; }
.nf-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); font-family: var(--font-sans);
  border-radius: var(--radius-md); cursor: pointer; border: 1px solid transparent;
  transition: background var(--transition-base), border-color var(--transition-base), color var(--transition-base);
}
.nf-btn-primary { background: var(--color-primary-600); color: #fff; }
.nf-btn-primary:hover { background: var(--color-primary-700); }
.nf-btn-secondary { background: transparent; color: var(--color-primary-700); border-color: var(--border-color-dark); }
.nf-btn-secondary:hover { border-color: var(--color-primary-600); }

@media (max-width: 640px) {
  .nf-actions { flex-direction: column; width: 100%; }
  .nf-btn { width: 100%; justify-content: center; }
}
`;
