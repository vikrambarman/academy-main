"use client";

import { useState, useEffect } from "react";

export default function FloatingWhatsapp() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleChatToggle = (e: CustomEvent) => {
      setIsChatOpen(e.detail.isOpen);
    };

    window.addEventListener("chatwidget-toggle" as any, handleChatToggle);
    return () => {
      window.removeEventListener("chatwidget-toggle" as any, handleChatToggle);
    };
  }, []);

  return (
    <>
      <style>{floatingWhatsappStyles}</style>
      <a
        href="https://wa.me/919009087883?text=Hello%2C%20I%20want%20to%20know%20about%20computer%20courses"
        target="_blank"
        rel="noopener noreferrer"
        className={`floating-whatsapp ${isChatOpen ? "floating-whatsapp-shifted" : ""}`}
        aria-label="Chat on WhatsApp"
      >
        <span className="floating-whatsapp-pulse"></span>
        <div className="floating-whatsapp-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="floating-whatsapp-icon"
          >
            <path d="M16.002 3C9.373 3 4 8.373 4 15.002c0 2.65.867 5.095 2.331 7.073L4 29l7.09-2.303A11.95 11.95 0 0 0 16.002 27C22.63 27 28 21.627 28 15.002 28 8.373 22.63 3 16.002 3zm0 21.75c-2.197 0-4.25-.653-5.967-1.77l-.427-.27-4.205 1.366 1.37-4.1-.28-.42A9.69 9.69 0 0 1 6.31 15c0-5.353 4.352-9.705 9.692-9.705 5.353 0 9.705 4.352 9.705 9.705 0 5.34-4.352 9.75-9.705 9.75zm5.475-7.34c-.3-.15-1.777-.877-2.052-.977-.273-.1-.472-.15-.672.15-.2.3-.772.977-.947 1.177-.175.2-.35.225-.65.075-.3-.15-1.266-.467-2.413-1.49-.892-.795-1.495-1.777-1.67-2.077-.175-.3-.02-.463.13-.613.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.672-1.627-.92-2.227-.242-.58-.487-.5-.672-.51l-.572-.01c-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.225 5.13 4.522.718.31 1.277.495 1.713.633.72.23 1.375.197 1.892.12.577-.086 1.777-.725 2.027-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
          </svg>
        </div>
        <span className="floating-whatsapp-tooltip">Chat with us</span>
      </a>
    </>
  );
}

const floatingWhatsappStyles = `
/* Floating WhatsApp - Adjusted for ChatWidget */
.floating-whatsapp {
  position: fixed;
  bottom: var(--space-6);
  right: calc(var(--space-6) + 80px); /* Shifted left to avoid ChatWidget */
  z-index: 1070;
  display: block;
  transition: all var(--transition-base);
}

.floating-whatsapp-shifted {
  bottom: calc(var(--space-6) + 520px); /* Move up when chat is open */
}

.floating-whatsapp-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-success);
  opacity: 0.4;
  animation: whatsappPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes whatsappPing {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.floating-whatsapp-button {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xl);
  transition: transform var(--transition-base);
}

.floating-whatsapp:hover .floating-whatsapp-button {
  transform: scale(1.1);
}

.floating-whatsapp-icon {
  width: 28px;
  height: 28px;
  fill: var(--color-white);
}

.floating-whatsapp-tooltip {
  position: absolute;
  right: calc(100% + var(--space-4));
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-gray-900);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-base);
}

.floating-whatsapp:hover .floating-whatsapp-tooltip {
  opacity: 1;
}

.floating-whatsapp-tooltip::after {
  content: "";
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid var(--color-gray-900);
}

@media (max-width: 768px) {
  .floating-whatsapp {
    bottom: var(--space-4);
    right: calc(var(--space-4) + 70px);
  }

  .floating-whatsapp-button {
    width: 48px;
    height: 48px;
  }

  .floating-whatsapp-icon {
    width: 24px;
    height: 24px;
  }

  .floating-whatsapp-tooltip {
    display: none;
  }
}
`;