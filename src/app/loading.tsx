"use client";

export default function Loading() {
    return (
        <>
            <style>{loadingStyles}</style>
            <div className="loading-wrapper">
                <div className="loading-container">
                    {/* Logo Spinner */}
                    <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-core">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z"
                                    fill="url(#gradient)"
                                />
                                <defs>
                                    <linearGradient
                                        id="gradient"
                                        x1="5"
                                        y1="5"
                                        x2="35"
                                        y2="35"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="#2563eb" />
                                        <stop offset="1" stopColor="#f97316" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <div className="loading-text">
                        <span className="loading-letter">L</span>
                        <span className="loading-letter">o</span>
                        <span className="loading-letter">a</span>
                        <span className="loading-letter">d</span>
                        <span className="loading-letter">i</span>
                        <span className="loading-letter">n</span>
                        <span className="loading-letter">g</span>
                        <span className="loading-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="loading-progress">
                        <div className="loading-progress-bar"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

const loadingStyles = `
/* ==========================================
   LOADING PAGE STYLES
   ========================================== */

.loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  z-index: 9999;
}

.loading-container {
  text-align: center;
}

/* Spinner */
.loading-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6);
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 3s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: var(--color-primary-600);
  animation-duration: 1.5s;
}

.spinner-ring:nth-child(2) {
  border-right-color: var(--color-accent-600);
  animation-duration: 2s;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: var(--color-primary-400);
  animation-duration: 2.5s;
}

.spinner-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s ease-in-out infinite;
}

/* Loading Text */
.loading-text {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-bottom: var(--space-4);
}

.loading-letter {
  display: inline-block;
  animation: bounce 1.4s ease-in-out infinite;
}

.loading-letter:nth-child(1) { animation-delay: 0s; }
.loading-letter:nth-child(2) { animation-delay: 0.1s; }
.loading-letter:nth-child(3) { animation-delay: 0.2s; }
.loading-letter:nth-child(4) { animation-delay: 0.3s; }
.loading-letter:nth-child(5) { animation-delay: 0.4s; }
.loading-letter:nth-child(6) { animation-delay: 0.5s; }
.loading-letter:nth-child(7) { animation-delay: 0.6s; }

.loading-dots span {
  animation: blink 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(1) { animation-delay: 0s; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

/* Progress Bar */
.loading-progress {
  width: 200px;
  height: 4px;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: 0 auto;
}

.loading-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-600), var(--color-accent-600));
  border-radius: var(--radius-full);
  animation: progress 2s ease-in-out infinite;
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}

@keyframes blink {
  0%, 80%, 100% {
    opacity: 1;
  }
  40% {
    opacity: 0.3;
  }
}

@keyframes progress {
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .loading-wrapper {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }

  .loading-progress {
    background-color: var(--color-gray-700);
  }
}
`;