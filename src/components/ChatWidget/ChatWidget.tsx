// components/ChatWidget/ChatWidget.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const COURSES = [
  'Basic Computer',
  'MS Office',
  'Tally Prime',
  'Python',
  'Web Design',
  'DTP',
  'Typing',
];

interface Message {
  role: 'user' | 'ai';
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
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: '',
    phone: '',
    course: 'Basic Computer',
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setSessionId(data.session_id);
      setMessages([
        {
          role: 'ai',
          content: data.message,
          time: new Date(),
        },
      ]);
    } catch {
      setMessages([
        {
          role: 'ai',
          content: 'Namaste! 👋 ShivShakti Computer Academy mein aapka swagat hai. Kaise help kar sakta hu?',
          time: new Date(),
        },
      ]);
    }
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading || !sessionId) return;

    setInput('');
    setMessages(prev => [
      ...prev,
      { role: 'user', content: text, time: new Date() },
    ]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: data.message, time: new Date() },
      ]);

      if (data.show_lead_form && !leadCaptured) {
        setTimeout(() => setShowLeadForm(true), 800);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: 'Sorry, thodi problem aa gayi. Please try again.',
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: data.message, time: new Date() },
      ]);
    } catch {
      // handle error
    } finally {
      setSubmittingLead(false);
    }
  }

  function handleQuickReply(text: string) {
    setInput(text);
    setTimeout(() => sendMessage(), 100);
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Quick reply suggestions
  const quickReplies = [
    'Courses dikhao',
    'Fees kitni hai?',
    'Demo class chahiye',
    'Online classes hain?',
  ];

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>

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
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? '▲' : '▼'}
              </button>
              <button
                className="chat-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
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
                    className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`}
                  >
                    {msg.role === 'ai' && (
                      <div className="msg-avatar">S</div>
                    )}
                    <div className="msg-content">
                      <div className="msg-bubble">
                        {msg.content}
                      </div>
                      <div className="msg-time">
                        {formatTime(msg.time)}
                      </div>
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
                            onChange={e =>
                              setLeadForm(p => ({ ...p, name: e.target.value }))
                            }
                            required
                          />
                          <input
                            type="tel"
                            placeholder="WhatsApp Number"
                            value={leadForm.phone}
                            onChange={e =>
                              setLeadForm(p => ({ ...p, phone: e.target.value }))
                            }
                            required
                            maxLength={10}
                          />
                          <select
                            value={leadForm.course}
                            onChange={e =>
                              setLeadForm(p => ({ ...p, course: e.target.value }))
                            }
                          >
                            {COURSES.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            disabled={submittingLead}
                          >
                            {submittingLead ? 'Booking...' : 'Book Free Demo →'}
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
                  {quickReplies.map(qr => (
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
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={loading}
                  className="chat-input"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="chat-send-btn"
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
        className={`chat-fab ${isOpen ? 'open' : ''}`}
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        aria-label="Chat with us"
      >
        {isOpen ? (
          <span className="fab-close">✕</span>
        ) : (
          <>
            <span className="fab-icon">💬</span>
            {unreadCount > 0 && (
              <span className="fab-badge">{unreadCount}</span>
            )}
          </>
        )}
      </button>

      {/* Tooltip - shows after delay */}
      {!isOpen && !hasOpened && (
        <div className="chat-tooltip">
          <p>Need help choosing a course? 👋</p>
          <span>Chat with Shiv</span>
        </div>
      )}
    </>
  );
}