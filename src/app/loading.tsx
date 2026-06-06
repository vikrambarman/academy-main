"use client";

export default function Loading() {
  return (
    <>
      <style>{loadingStyles}</style>
      <div className="loading-wrapper">
        <div className="loading-container">
          {/* Single calm spinner */}
          <div className="loading-spinner" aria-hidden="true">
            <div className="spinner-ring" />
          </div>

          {/* Text */}
          <div className="loading-text">Loading<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span></div>

          {/* Progress bar */}
          <div className="loading-progress">
            <div className="loading-progress-bar" />
          </div>
        </div>
      </div>
    </>
  );
}

const loadingStyles = `
/* ── LOADING — Clean University style ── */
.loading-wrapper {
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-page);
  z-index: 9999;
}
.loading-container { text-align: center; }

/* Single sober spinner */
.loading-spinner { width: 44px; height: 44px; margin: 0 auto var(--space-5); }
.spinner-ring {
  width: 100%; height: 100%;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary-600);
  border-radius: 50%;
  animation: loading-spin 0.8s linear infinite;
}

/* Text */
.loading-text {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}
.loading-dots span { animation: loading-blink 1.4s ease-in-out infinite; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

/* Progress bar (indeterminate, subtle) */
.loading-progress {
  width: 180px; height: 3px;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden; margin: 0 auto;
}
.loading-progress-bar {
  height: 100%; width: 40%;
  background: var(--color-primary-600);
  border-radius: var(--radius-full);
  animation: loading-slide 1.2s ease-in-out infinite;
}

@keyframes loading-spin { to { transform: rotate(360deg); } }
@keyframes loading-blink { 0%, 80%, 100% { opacity: 1; } 40% { opacity: 0.3; } }
@keyframes loading-slide {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(380%); }
}

@media (prefers-reduced-motion: reduce) {
  .spinner-ring, .loading-progress-bar, .loading-dots span { animation: none; }
}
`;
