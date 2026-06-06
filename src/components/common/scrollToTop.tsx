"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop — floating button that appears after scrolling down,
 * and smoothly scrolls back to the top.
 *
 * Usage: add <ScrollToTop /> in (public)/layout.tsx (near FloatingWhatsapp).
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>
      <button
        type="button"
        onClick={scrollUp}
        aria-label="Scroll to top"
        className={`stt-btn ${visible ? "stt-visible" : ""}`}
      >
        <ArrowUp size={20} strokeWidth={2.2} />
      </button>
    </>
  );
}

const styles = `
.stt-btn {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: var(--z-toast, 1080);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-600);
  color: #fff;
  border: 1px solid var(--color-primary-700);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease, background 0.2s ease;
}
.stt-btn.stt-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.stt-btn:hover { background: var(--color-primary-700); }

/* If FloatingWhatsapp sits bottom-right too, stack this above it */
@media (max-width: 640px) {
  .stt-btn { bottom: 1rem; right: 1rem; width: 42px; height: 42px; }
}
`;
