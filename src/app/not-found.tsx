"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
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
          {/* Animated Icon */}
          <div className="nf-icon-wrapper">
            <div className="nf-icon-bg"></div>
            <AlertTriangle className="nf-icon" size={64} />
          </div>

          {/* Error Code */}
          <h1 className="nf-code">404</h1>

          {/* Message */}
          <h2 className="nf-title">Page Not Found</h2>
          <p className="nf-description">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Countdown */}
          <div className="nf-countdown">
            Redirecting to homepage in <span className="nf-timer">{countdown}</span>s
          </div>

          {/* Action Buttons */}
          <div className="nf-actions">
            <button 
              className="nf-btn nf-btn-primary" 
              onClick={() => router.push("/")}
            >
              <Home size={18} />
              Go to Homepage
            </button>
            <button 
              className="nf-btn nf-btn-secondary" 
              onClick={() => router.back()}
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="nf-decoration nf-decoration-1"></div>
          <div className="nf-decoration nf-decoration-2"></div>
        </div>
      </div>
    </>
  );
}

const notFoundStyles = `
/* ==========================================
   404 NOT FOUND PAGE STYLES
   ========================================== */

.nf-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
}

.nf-container {
  max-width: 600px;
  text-align: center;
  position: relative;
  z-index: 10;
}

/* Icon Styling */
.nf-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: var(--space-8);
}

.nf-icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: var(--color-accent-100);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  opacity: 0.3;
}

.nf-icon {
  position: relative;
  color: var(--color-accent-600);
  animation: float 3s ease-in-out infinite;
}

/* Error Code */
.nf-code {
  font-family: var(--font-display);
  font-size: clamp(4rem, 15vw, 8rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
  margin: 0;
  line-height: 1;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-accent-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Title */
.nf-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  margin: var(--space-4) 0;
}

/* Description */
.nf-description {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: var(--line-height-relaxed);
}

/* Countdown */
.nf-countdown {
  font-size: var(--font-size-base);
  color: var(--text-tertiary);
  margin-bottom: var(--space-8);
}

.nf-timer {
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-600);
  font-size: var(--font-size-xl);
}

/* Action Buttons */
.nf-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-sans);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  border: none;
  outline: none;
}

.nf-btn-primary {
  background-color: var(--color-primary-600);
  color: var(--color-white);
  box-shadow: var(--shadow-md);
}

.nf-btn-primary:hover {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.nf-btn-primary:active {
  transform: translateY(0);
}

.nf-btn-secondary {
  background-color: var(--color-white);
  color: var(--color-gray-700);
  border: 2px solid var(--border-color);
}

.nf-btn-secondary:hover {
  border-color: var(--color-primary-600);
  color: var(--color-primary-600);
  transform: translateY(-2px);
}

/* Decorative Elements */
.nf-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  pointer-events: none;
}

.nf-decoration-1 {
  width: 300px;
  height: 300px;
  background: var(--color-primary-500);
  top: -150px;
  right: -150px;
  animation: float 6s ease-in-out infinite;
}

.nf-decoration-2 {
  width: 200px;
  height: 200px;
  background: var(--color-accent-500);
  bottom: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .nf-wrapper {
    padding: var(--space-4);
  }

  .nf-actions {
    flex-direction: column;
    width: 100%;
  }

  .nf-btn {
    width: 100%;
    justify-content: center;
  }

  .nf-description {
    font-size: var(--font-size-base);
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .nf-wrapper {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }

  .nf-btn-secondary {
    background-color: var(--color-gray-800);
    color: var(--color-gray-200);
    border-color: var(--color-gray-700);
  }
}
`;