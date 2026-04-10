"use client";

import { useState, useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const COURSES = [
  "Basic Computer",
  "MS Office",
  "Tally Prime",
  "Python",
  "Web Design",
  "DTP",
  "Typing",
  "DCA",
  "PGDCA",
  "ADCA",
];

interface Message {
  role: "user" | "ai";
  content: string;
  time: Date;
}

interface LeadForm {
  name: string;
  phone: string;
  course: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: "",
    phone: "",
    course: "Basic Computer",
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Dispatch event for WhatsApp position adjustment
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("chatwidget-toggle", {
        detail: { isOpen: isOpen && !isMinimized },
      })
    );
  }, [isOpen, isMinimized]);

  // Auto open after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) {
        setUnreadCount(1);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [hasOpened]);

  async function openChat() {
    setIsOpen(true);
    setIsMinimized(false);
    setHasOpened(true);
    setUnreadCount(0);

    if (!sessionId) {
      await startChat();
    }
  }

  async function startChat() {
    try {
      const res = await fetch(`${API_URL}/api/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setSessionId(data.session_id);
      setMessages([
        {
          role: "ai",
          content: data.message,
          time: new Date(),
        },
      ]);
    } catch {
      setMessages([
        {
          role: "ai",
          content:
            "Namaste! 👋 ShivShakti Computer Academy mein aapka swagat hai. Kaise help kar sakta hu?",
          time: new Date(),
        },
      ]);
    }
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading || !sessionId) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, time: new Date() },
    ]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.message, time: new Date() },
      ]);

      if (data.show_lead_form && !leadCaptured) {
        setTimeout(() => setShowLeadForm(true), 800);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, thodi problem aa gayi. Please try again.",
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId) return;
    setSubmittingLead(true);

    try {
      const res = await fetch(`${API_URL}/api/chat/capture-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          name: leadForm.name,
          phone: leadForm.phone,
          course: leadForm.course,
        }),
      });
      const data = await res.json();

      setShowLeadForm(false);
      setLeadCaptured(true);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.message, time: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Lead capture failed. Please try again.",
          time: new Date(),
        },
      ]);
    } finally {
      setSubmittingLead(false);
    }
  }

  function handleQuickReply(text: string) {
    setInput(text);
    setTimeout(() => sendMessage(), 100);
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const quickReplies = [
    "Courses dikhao",
    "Fees kitni hai?",
    "Demo class chahiye",
    "Online classes hain?",
  ];

  return (
    <>
      <style>{chatWidgetStyles}</style>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? "minimized" : ""}`}>
          
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <span>S</span>
                <div className="chat-online-dot" />
              </div>
              <div>
                <div className="chat-name">Shiv</div>
                <div className="chat-status">ShivShakti Academy • Online</div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                className="chat-icon-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? "▲" : "▼"}
              </button>
              <button
                className="chat-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-message ${msg.role === "user" ? "user" : "ai"}`}
                  >
                    {msg.role === "ai" && <div className="msg-avatar">S</div>}
                    <div className="msg-content">
                      <div className="msg-bubble">{msg.content}</div>
                      <div className="msg-time">{formatTime(msg.time)}</div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="chat-message ai">
                    <div className="msg-avatar">S</div>
                    <div className="msg-content">
                      <div className="msg-bubble typing-bubble">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Lead Form */}
                {showLeadForm && !leadCaptured && (
                  <div className="chat-message ai">
                    <div className="msg-avatar">S</div>
                    <div className="msg-content">
                      <div className="lead-form-card">
                        <p className="lead-form-title">
                          Free Demo Class Book Karo! 🎓
                        </p>
                        <form onSubmit={submitLead} className="lead-form">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={leadForm.name}
                            onChange={(e) =>
                              setLeadForm((p) => ({ ...p, name: e.target.value }))
                            }
                            required
                            className="lead-input"
                          />
                          <input
                            type="tel"
                            placeholder="WhatsApp Number"
                            value={leadForm.phone}
                            onChange={(e) =>
                              setLeadForm((p) => ({ ...p, phone: e.target.value }))
                            }
                            required
                            maxLength={10}
                            pattern="[0-9]{10}"
                            className="lead-input"
                          />
                          <select
                            value={leadForm.course}
                            onChange={(e) =>
                              setLeadForm((p) => ({ ...p, course: e.target.value }))
                            }
                            className="lead-select"
                          >
                            {COURSES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            disabled={submittingLead}
                            className="lead-submit-btn"
                          >
                            {submittingLead ? "Booking..." : "Book Free Demo →"}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length <= 2 && !loading && (
                <div className="quick-replies">
                  {quickReplies.map((qr) => (
                    <button
                      key={qr}
                      className="quick-reply-btn"
                      onClick={() => handleQuickReply(qr)}
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form className="chat-input-area" onSubmit={sendMessage}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={loading}
                  className="chat-input"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="chat-send-btn"
                  aria-label="Send message"
                >
                  ➤
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`chat-fab ${isOpen ? "open" : ""}`}
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        aria-label="Chat with us"
      >
        {isOpen ? (
          <span className="fab-close">✕</span>
        ) : (
          <>
            <span className="fab-icon">💬</span>
            {unreadCount > 0 && <span className="fab-badge">{unreadCount}</span>}
          </>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && !hasOpened && (
        <div className="chat-tooltip">
          <p>Need help choosing a course? 👋</p>
          <span>Chat with Shiv</span>
        </div>
      )}
    </>
  );
}

const chatWidgetStyles = `
/* ==========================================
   CHAT WIDGET STYLES - Custom CSS
   ========================================== */

/* Chat Window */
.chat-window {
  position: fixed;
  bottom: 90px;
  right: var(--space-6);
  width: 380px;
  max-height: 600px;
  background: var(--bg-elevated);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  z-index: 1080;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: chatSlideUp 0.3s ease-out;
  border: 1px solid var(--border-color);
}

@keyframes chatSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chat-window.minimized {
  max-height: 60px;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  color: var(--color-white);
  flex-shrink: 0;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.chat-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-white);
  color: var(--color-primary-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.chat-online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: var(--color-success);
  border: 2px solid var(--color-white);
  border-radius: 50%;
}

.chat-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.chat-status {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

.chat-header-actions {
  display: flex;
  gap: var(--space-2);
}

.chat-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--color-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
  font-size: var(--font-size-base);
}

.chat-icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--bg-surface);
}

.chat-message {
  display: flex;
  gap: var(--space-2);
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.msg-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  max-width: 75%;
}

.chat-message.user .msg-content {
  align-items: flex-end;
}

.msg-bubble {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  word-wrap: break-word;
}

.chat-message.ai .msg-bubble {
  background: var(--color-white);
  color: var(--text-primary);
  border-bottom-left-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.chat-message.user .msg-bubble {
  background: var(--color-primary-600);
  color: var(--color-white);
  border-bottom-right-radius: var(--radius-sm);
}

.msg-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  padding: 0 var(--space-2);
}

/* Typing Indicator */
.typing-bubble {
  display: flex;
  gap: 4px;
  padding: var(--space-2) var(--space-3);
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gray-400);
  animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

/* Lead Form */
.lead-form-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
}

.lead-form-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.lead-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.lead-input,
.lead-select {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-family: var(--font-sans);
  transition: border-color var(--transition-fast);
}

.lead-input:focus,
.lead-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.lead-submit-btn {
  padding: var(--space-3) var(--space-4);
  background: var(--color-accent-600);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lead-submit-btn:hover:not(:disabled) {
  background: var(--color-accent-700);
  transform: translateY(-1px);
}

.lead-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Quick Replies */
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0 var(--space-4) var(--space-3);
  background: var(--bg-surface);
}

.quick-reply-btn {
  padding: var(--space-2) var(--space-3);
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-reply-btn:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-200);
  color: var(--color-primary-700);
}

/* Input Area */
.chat-input-area {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--bg-elevated);
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  padding: var(--space-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-family: var(--font-sans);
  transition: border-color var(--transition-fast);
}

.chat-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.chat-send-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--color-primary-600);
  border: none;
  color: var(--color-white);
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-send-btn:hover:not(:disabled) {
  background: var(--color-primary-700);
  transform: scale(1.05);
}

.chat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Floating Button */
.chat-fab {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary-600);
  border: none;
  color: var(--color-white);
  font-size: var(--font-size-2xl);
  cursor: pointer;
  box-shadow: var(--shadow-xl);
  z-index: 1079;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chat-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}

.chat-fab.open {
  background: var(--color-gray-600);
}

.fab-icon {
  font-size: 28px;
}

.fab-close {
  font-size: 24px;
}

.fab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-danger);
  color: var(--color-white);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-white);
  animation: badgePulse 2s infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Tooltip */
.chat-tooltip {
  position: fixed;
  bottom: calc(var(--space-6) + 70px);
  right: var(--space-6);
  background: var(--color-white);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  z-index: 1078;
  animation: tooltipSlide 0.3s ease-out;
  max-width: 200px;
  border: 1px solid var(--border-color);
}

@keyframes tooltipSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-tooltip p {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
}

.chat-tooltip span {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 32px);
    right: 16px;
    bottom: 80px;
    max-height: calc(100vh - 120px);
  }

  .chat-fab {
    bottom: var(--space-4);
    right: var(--space-4);
    width: 56px;
    height: 56px;
  }

  .chat-tooltip {
    right: var(--space-4);
    bottom: calc(var(--space-4) + 66px);
  }
}

/* Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
}
`;