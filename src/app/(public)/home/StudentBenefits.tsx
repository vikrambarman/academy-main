"use client";

import {
    Bot,
    BookOpen,
    Award,
    Sparkles,
    CheckCircle,
    ArrowRight,
    Zap,
    Lock,
    Globe,
    Brain,
    GraduationCap,
    ShieldCheck,
} from "lucide-react";

const lmsFeatures = [
    { icon: BookOpen,      text: "Course practice modules"        },
    { icon: Brain,         text: "AI-powered doubt clearing"      },
    { icon: Zap,           text: "Progress tracking dashboard"    },
    { icon: GraduationCap, text: "Certificate preparation guides" },
];

const aiFeatures = [
    { icon: Globe,         text: "Available to all public visitors"    },
    { icon: Brain,         text: "Instant answers to course queries"   },
    { icon: Lock,          text: "Deeper access for enrolled students" },
    { icon: Sparkles,      text: "Smart study recommendations"         },
];

const certFeatures = [
    "Skill India aligned programs",
    "DigiLocker digital verification",
    "GSDM authorized certificates",
    "Verifiable via enrollment number",
];

export default function StudentBenefits() {
    return (
        <>
            <section className="sb-section" aria-labelledby="sb-heading">

                <div className="sb-glow-tl"  aria-hidden="true" />
                <div className="sb-glow-br"  aria-hidden="true" />
                <div className="sb-dots"     aria-hidden="true" />
                <div className="sb-h-line"   aria-hidden="true" />

                <div className="sb-wrap">

                    {/* ── Header ── */}
                    <div className="sb-header">
                        <div className="sb-badge">
                            <span className="sb-badge-dot" aria-hidden="true" />
                            Student Benefits
                        </div>
                        <h2 id="sb-heading" className="sb-title">
                            Everything You Get as a{" "}
                            <span className="sb-title-em">Shivshakti Student</span>
                        </h2>
                        <p className="sb-subtitle">
                            From AI-powered learning assistance to lifetime LMS access
                            and government-recognized certifications — we invest in
                            your success beyond the classroom.
                        </p>
                    </div>

                    {/* ── Main 3-pillar layout ── */}
                    <div className="sb-grid">

                        {/* ── Pillar 1 — LMS (large, left) ── */}
                        <div className="sb-card sb-card-lms">
                            <div className="sb-card-bar sb-bar-blue" aria-hidden="true" />

                            <div className="sb-card-top">
                                <div className="sb-icon sb-icon-blue">
                                    <BookOpen size={26} strokeWidth={1.6} />
                                </div>
                                <span className="sb-tag sb-tag-green">
                                    <span className="sb-tag-dot" />
                                    On Admission
                                </span>
                            </div>

                            <h3 className="sb-card-title">
                                Lifetime LMS Access
                            </h3>
                            <p className="sb-card-desc">
                                Every student who enrolls gets permanent access to our
                                Learning Management System — no expiry, no renewal fee.
                                Learn at your own pace, revisit concepts anytime.
                            </p>

                            {/* Feature list */}
                            <ul className="sb-feat-list">
                                {lmsFeatures.map((f, i) => {
                                    const Icon = f.icon;
                                    return (
                                        <li key={i} className="sb-feat-item">
                                            <span className="sb-feat-icon sb-feat-icon-blue">
                                                <Icon size={14} strokeWidth={2} />
                                            </span>
                                            <span>{f.text}</span>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Visual — LMS preview mockup */}
                            <div className="sb-lms-mock" aria-hidden="true">
                                <div className="sb-mock-bar">
                                    <span className="sb-mock-dot sb-dot-r" />
                                    <span className="sb-mock-dot sb-dot-y" />
                                    <span className="sb-mock-dot sb-dot-g" />
                                    <span className="sb-mock-url">lms.shivshakti.edu</span>
                                </div>
                                <div className="sb-mock-body">
                                    <div className="sb-mock-sidebar">
                                        <div className="sb-mock-nav-item sb-mock-nav-active" />
                                        <div className="sb-mock-nav-item" />
                                        <div className="sb-mock-nav-item" />
                                        <div className="sb-mock-nav-item" />
                                    </div>
                                    <div className="sb-mock-content">
                                        <div className="sb-mock-heading" />
                                        <div className="sb-mock-progress">
                                            <div className="sb-mock-progress-fill" />
                                        </div>
                                        <div className="sb-mock-row" />
                                        <div className="sb-mock-row sb-mock-row-short" />
                                        <div className="sb-mock-modules">
                                            <div className="sb-mock-module sb-module-done">
                                                <span>✓</span> Module 1
                                            </div>
                                            <div className="sb-mock-module sb-module-active">
                                                ▶ Module 2
                                            </div>
                                            <div className="sb-mock-module">
                                                ○ Module 3
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sb-card-footer">
                                <span className="sb-foot-note">
                                    <Lock size={12} strokeWidth={2} />
                                    Activates automatically on course admission
                                </span>
                            </div>
                        </div>

                        {/* ── Right column — stacked ── */}
                        <div className="sb-right-col">

                            {/* ── Pillar 2 — AI Assistant ── */}
                            <div className="sb-card sb-card-ai">
                                <div className="sb-card-bar sb-bar-orange" aria-hidden="true" />

                                <div className="sb-card-top">
                                    <div className="sb-icon sb-icon-orange">
                                        <Bot size={24} strokeWidth={1.6} />
                                    </div>
                                    <span className="sb-tag sb-tag-blue">
                                        <Sparkles size={10} strokeWidth={2} />
                                        Coming Soon
                                    </span>
                                </div>

                                <h3 className="sb-card-title">AI Learning Assistant</h3>
                                <p className="sb-card-desc">
                                    Our AI assistant clears doubts instantly — available
                                    24/7 for public visitors, with deeper course-specific
                                    guidance for enrolled students.
                                </p>

                                <ul className="sb-feat-list">
                                    {aiFeatures.map((f, i) => {
                                        const Icon = f.icon;
                                        return (
                                            <li key={i} className="sb-feat-item">
                                                <span className="sb-feat-icon sb-feat-icon-orange">
                                                    <Icon size={13} strokeWidth={2} />
                                                </span>
                                                <span>{f.text}</span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* AI Chat preview */}
                                <div className="sb-ai-mock" aria-hidden="true">
                                    <div className="sb-ai-msg sb-ai-msg-user">
                                        What courses are available for beginners?
                                    </div>
                                    <div className="sb-ai-msg sb-ai-msg-bot">
                                        <span className="sb-ai-bot-dot" />
                                        <span>
                                            We offer DCA, Basic Computer & Tally — perfect
                                            for beginners with no prior experience needed!
                                        </span>
                                    </div>
                                    <div className="sb-ai-typing" aria-label="typing">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>

                            {/* ── Pillar 3 — Certificates ── */}
                            <div className="sb-card sb-card-cert">
                                <div className="sb-card-bar sb-bar-green" aria-hidden="true" />

                                <div className="sb-card-top">
                                    <div className="sb-icon sb-icon-green">
                                        <Award size={24} strokeWidth={1.6} />
                                    </div>
                                    <span className="sb-tag sb-tag-green">
                                        <span className="sb-tag-dot" />
                                        Govt. Recognized
                                    </span>
                                </div>

                                <h3 className="sb-card-title">Verified Certificates</h3>

                                {/* Cert features — 2x2 grid */}
                                <div className="sb-cert-grid">
                                    {certFeatures.map((c, i) => (
                                        <div key={i} className="sb-cert-item">
                                            <CheckCircle
                                                size={14}
                                                strokeWidth={2.2}
                                                className="sb-cert-check"
                                            />
                                            <span>{c}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Certificate preview strip */}
                                <div className="sb-cert-mock" aria-hidden="true">
                                    <div className="sb-cert-mock-left">
                                        <ShieldCheck
                                            size={32}
                                            strokeWidth={1.2}
                                            className="sb-cert-shield"
                                        />
                                    </div>
                                    <div className="sb-cert-mock-right">
                                        <div className="sb-cert-name" />
                                        <div className="sb-cert-course" />
                                        <div className="sb-cert-meta">
                                            <span className="sb-cert-badge">DigiLocker ✓</span>
                                            <span className="sb-cert-badge">GSDM ✓</span>
                                        </div>
                                    </div>
                                </div>

                                <a href="/courses" className="sb-cert-link">
                                    View all courses
                                    <ArrowRight size={14} strokeWidth={2} className="sb-link-arrow" />
                                </a>
                            </div>

                        </div>
                    </div>

                    {/* ── Bottom strip — trust row ── */}
                    <div className="sb-trust-strip">
                        {[
                            { val: "Lifetime", lbl: "LMS Access",           icon: "📚" },
                            { val: "24/7",     lbl: "AI Support (Soon)",     icon: "🤖" },
                            { val: "100%",     lbl: "Verified Certificates", icon: "🏅" },
                            { val: "Free",     lbl: "Admission Guidance",    icon: "🎯" },
                        ].map((s, i) => (
                            <div key={i} className="sb-trust-item">
                                <span className="sb-trust-emoji">{s.icon}</span>
                                <div className="sb-trust-text">
                                    <div className="sb-trust-val">{s.val}</div>
                                    <div className="sb-trust-lbl">{s.lbl}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <style>{`

                /* ── Section ── */
                .sb-section {
                    position: relative;
                    padding: var(--space-24) var(--space-6);
                    background: var(--color-white);
                    overflow: hidden;
                }

                .sb-glow-tl {
                    position: absolute;
                    top: -100px; left: -80px;
                    width: 420px; height: 420px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37, 99, 235, 0.07) 0%,
                        transparent 65%
                    );
                    filter: blur(55px);
                    pointer-events: none;
                    z-index: 0;
                }

                .sb-glow-br {
                    position: absolute;
                    bottom: -80px; right: -60px;
                    width: 360px; height: 360px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(249, 115, 22, 0.06) 0%,
                        transparent 65%
                    );
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                .sb-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(
                        circle,
                        rgba(37, 99, 235, 0.04) 1px,
                        transparent 1px
                    );
                    background-size: 28px 28px;
                    pointer-events: none;
                    z-index: 0;
                }

                .sb-h-line {
                    position: absolute;
                    top: 0; left: 8%; right: 8%;
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent,
                        var(--color-gray-200),
                        transparent
                    );
                    pointer-events: none;
                }

                /* ── Wrapper ── */
                .sb-wrap {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .sb-header {
                    text-align: center;
                    max-width: 660px;
                    margin: 0 auto var(--space-14);
                }

                .sb-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-4);
                    background: rgba(37, 99, 235, 0.08);
                    border: 1px solid rgba(37, 99, 235, 0.18);
                    border-radius: var(--radius-full);
                    font-size: 0.68rem;
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-primary-700);
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    margin-bottom: var(--space-4);
                }

                .sb-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--color-primary-600);
                    border-radius: var(--radius-full);
                    animation: sb-pulse 2s ease-in-out infinite;
                }

                .sb-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.9rem, 4vw, 2.8rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: var(--space-4);
                }

                .sb-title-em {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .sb-subtitle {
                    font-size: var(--font-size-base);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin: 0;
                }

                /* ── Main grid ── */
                .sb-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-5);
                    margin-bottom: var(--space-6);
                    align-items: start;
                }

                .sb-right-col {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-5);
                }

                /* ── Card base ── */
                .sb-card {
                    position: relative;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-8);
                    overflow: hidden;
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base),
                        border-color var(--transition-base);
                }

                .sb-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .sb-card-lms:hover { border-color: var(--color-primary-200); }
                .sb-card-ai:hover  { border-color: rgba(249, 115, 22, 0.3);  }
                .sb-card-cert:hover{ border-color: rgba(16, 185, 129, 0.3);  }

                /* Top accent bar */
                .sb-card-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                }

                .sb-bar-blue   { background: linear-gradient(to right, var(--color-primary-500), var(--color-primary-400)); }
                .sb-bar-orange { background: linear-gradient(to right, var(--color-accent-500),   var(--color-accent-400));  }
                .sb-bar-green  { background: linear-gradient(to right, var(--color-success),       #34d399);                 }

                /* Card top row */
                .sb-card-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: var(--space-5);
                }

                /* Icons */
                .sb-icon {
                    width: 52px; height: 52px;
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: transform var(--transition-base);
                }

                .sb-card:hover .sb-icon {
                    transform: scale(1.08) rotate(-4deg);
                }

                .sb-icon-blue   { background: rgba(37,99,235,0.1);   border: 1px solid rgba(37,99,235,0.18);   color: var(--color-primary-600); }
                .sb-icon-orange { background: rgba(249,115,22,0.1);  border: 1px solid rgba(249,115,22,0.18);  color: var(--color-accent-600);  }
                .sb-icon-green  { background: rgba(16,185,129,0.1);  border: 1px solid rgba(16,185,129,0.18);  color: var(--color-success);     }

                /* Tags */
                .sb-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-1);
                    padding: var(--space-1) var(--space-3);
                    border-radius: var(--radius-full);
                    font-size: 0.65rem;
                    font-weight: var(--font-weight-semibold);
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }

                .sb-tag-blue  {
                    background: rgba(37,99,235,0.08);
                    color: var(--color-primary-700);
                    border: 1px solid rgba(37,99,235,0.18);
                }

                .sb-tag-green {
                    background: rgba(16,185,129,0.08);
                    color: var(--color-success-dark);
                    border: 1px solid rgba(16,185,129,0.2);
                }

                .sb-tag-dot {
                    width: 5px; height: 5px;
                    border-radius: var(--radius-full);
                    background: var(--color-success);
                    animation: sb-pulse 2s ease-in-out infinite;
                }

                /* Card title / desc */
                .sb-card-title {
                    font-family: var(--font-display);
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    letter-spacing: var(--letter-spacing-tight);
                    margin-bottom: var(--space-3);
                }

                .sb-card-desc {
                    font-size: var(--font-size-sm);
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin: 0 0 var(--space-5);
                }

                /* Feature list */
                .sb-feat-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 var(--space-6);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .sb-feat-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    margin-bottom: 0;
                }

                .sb-feat-icon {
                    width: 24px; height: 24px;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .sb-feat-icon-blue   { background: rgba(37,99,235,0.08);  color: var(--color-primary-600); }
                .sb-feat-icon-orange { background: rgba(249,115,22,0.08); color: var(--color-accent-600);  }

                /* ── LMS Mockup ── */
                .sb-lms-mock {
                    border-radius: var(--radius-xl);
                    border: 1px solid var(--color-gray-200);
                    overflow: hidden;
                    margin-bottom: var(--space-5);
                    background: var(--color-gray-50);
                }

                .sb-mock-bar {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    background: var(--color-gray-100);
                    border-bottom: 1px solid var(--color-gray-200);
                }

                .sb-mock-dot {
                    width: 8px; height: 8px;
                    border-radius: var(--radius-full);
                    flex-shrink: 0;
                }

                .sb-dot-r { background: #ef4444; }
                .sb-dot-y { background: #f59e0b; }
                .sb-dot-g { background: #22c55e; }

                .sb-mock-url {
                    font-size: 0.6rem;
                    color: var(--color-gray-400);
                    margin-left: var(--space-2);
                    font-family: var(--font-mono);
                }

                .sb-mock-body {
                    display: flex;
                    height: 120px;
                }

                .sb-mock-sidebar {
                    width: 48px;
                    background: var(--color-white);
                    border-right: 1px solid var(--color-gray-200);
                    padding: var(--space-3) var(--space-2);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .sb-mock-nav-item {
                    height: 6px;
                    border-radius: var(--radius-full);
                    background: var(--color-gray-200);
                }

                .sb-mock-nav-active {
                    background: var(--color-primary-300);
                }

                .sb-mock-content {
                    flex: 1;
                    padding: var(--space-3);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .sb-mock-heading {
                    height: 8px;
                    width: 60%;
                    background: var(--color-gray-300);
                    border-radius: var(--radius-full);
                }

                .sb-mock-progress {
                    height: 4px;
                    background: var(--color-gray-200);
                    border-radius: var(--radius-full);
                    overflow: hidden;
                }

                .sb-mock-progress-fill {
                    height: 100%;
                    width: 65%;
                    background: linear-gradient(
                        to right,
                        var(--color-primary-400),
                        var(--color-primary-300)
                    );
                    border-radius: var(--radius-full);
                }

                .sb-mock-row {
                    height: 5px;
                    background: var(--color-gray-100);
                    border-radius: var(--radius-full);
                }

                .sb-mock-row-short { width: 70%; }

                .sb-mock-modules {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    margin-top: auto;
                }

                .sb-mock-module {
                    font-size: 0.55rem;
                    padding: 2px var(--space-2);
                    border-radius: var(--radius-sm);
                    color: var(--color-gray-400);
                    background: var(--color-gray-100);
                }

                .sb-module-done {
                    background: rgba(16,185,129,0.1);
                    color: var(--color-success-dark);
                }

                .sb-module-active {
                    background: rgba(37,99,235,0.1);
                    color: var(--color-primary-600);
                    font-weight: var(--font-weight-medium);
                }

                /* Card footer */
                .sb-card-footer {
                    padding-top: var(--space-4);
                    border-top: 1px solid var(--color-gray-100);
                }

                .sb-foot-note {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                }

                /* ── AI Chat Mock ── */
                .sb-ai-mock {
                    margin-top: var(--space-4);
                    padding: var(--space-4);
                    background: var(--color-gray-50);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .sb-ai-msg {
                    font-size: 0.72rem;
                    line-height: 1.5;
                    padding: var(--space-2) var(--space-3);
                    border-radius: var(--radius-lg);
                    max-width: 90%;
                }

                .sb-ai-msg-user {
                    background: var(--color-primary-50);
                    color: var(--color-primary-700);
                    border: 1px solid var(--color-primary-100);
                    align-self: flex-end;
                    margin-left: auto;
                }

                .sb-ai-msg-bot {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-2);
                    background: var(--color-white);
                    color: var(--text-secondary);
                    border: 1px solid var(--color-gray-200);
                }

                .sb-ai-bot-dot {
                    width: 6px; height: 6px;
                    border-radius: var(--radius-full);
                    background: var(--color-accent-400);
                    flex-shrink: 0;
                    margin-top: 3px;
                    animation: sb-pulse 1.5s ease-in-out infinite;
                }

                /* Typing animation */
                .sb-ai-typing {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    padding: var(--space-2) var(--space-3);
                    width: fit-content;
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                }

                .sb-ai-typing span {
                    width: 5px; height: 5px;
                    border-radius: var(--radius-full);
                    background: var(--color-gray-400);
                    animation: sb-typing 1.2s ease-in-out infinite;
                }

                .sb-ai-typing span:nth-child(2) { animation-delay: 0.2s; }
                .sb-ai-typing span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes sb-typing {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40%           { transform: translateY(-4px); opacity: 1; }
                }

                /* ── Cert section ── */
                .sb-cert-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-3);
                    margin-bottom: var(--space-5);
                }

                .sb-cert-item {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-2);
                    font-size: var(--font-size-xs);
                    color: var(--text-secondary);
                    line-height: 1.4;
                }

                .sb-cert-check {
                    color: var(--color-success);
                    flex-shrink: 0;
                    margin-top: 1px;
                }

                /* Cert mock preview */
                .sb-cert-mock {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    padding: var(--space-4);
                    background: linear-gradient(
                        135deg,
                        rgba(37,99,235,0.04),
                        rgba(16,185,129,0.04)
                    );
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    margin-bottom: var(--space-5);
                }

                .sb-cert-mock-left {
                    flex-shrink: 0;
                }

                .sb-cert-shield {
                    color: var(--color-success);
                }

                .sb-cert-mock-right {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .sb-cert-name {
                    height: 7px;
                    width: 70%;
                    background: var(--color-gray-300);
                    border-radius: var(--radius-full);
                }

                .sb-cert-course {
                    height: 5px;
                    width: 50%;
                    background: var(--color-gray-200);
                    border-radius: var(--radius-full);
                }

                .sb-cert-meta {
                    display: flex;
                    gap: var(--space-2);
                }

                .sb-cert-badge {
                    display: inline-block;
                    padding: 2px var(--space-2);
                    background: rgba(16,185,129,0.1);
                    color: var(--color-success-dark);
                    border: 1px solid rgba(16,185,129,0.2);
                    border-radius: var(--radius-full);
                    font-size: 0.58rem;
                    font-weight: var(--font-weight-semibold);
                }

                /* Cert link */
                .sb-cert-link {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                    color: var(--color-primary-600);
                    text-decoration: none;
                    transition: gap var(--transition-fast), color var(--transition-fast);
                }

                .sb-cert-link:hover {
                    color: var(--color-primary-700);
                    gap: var(--space-3);
                }

                .sb-link-arrow {
                    transition: transform var(--transition-fast);
                }

                .sb-cert-link:hover .sb-link-arrow {
                    transform: translateX(3px);
                }

                /* ── Trust strip ── */
                .sb-trust-strip {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--space-4);
                    padding: var(--space-6) var(--space-8);
                    background: var(--color-gray-50);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    box-shadow: var(--shadow-xs);
                }

                .sb-trust-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-3);
                    border-radius: var(--radius-xl);
                    transition:
                        background var(--transition-fast),
                        transform var(--transition-fast);
                }

                .sb-trust-item:hover {
                    background: var(--color-white);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-sm);
                }

                /* dividers */
                .sb-trust-item + .sb-trust-item {
                    border-left: 1px solid var(--color-gray-200);
                }

                .sb-trust-emoji {
                    font-size: 1.4rem;
                    flex-shrink: 0;
                }

                .sb-trust-val {
                    font-family: var(--font-display);
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary-600);
                    line-height: 1;
                }

                .sb-trust-lbl {
                    font-size: 0.68rem;
                    color: var(--text-tertiary);
                    font-weight: var(--font-weight-medium);
                    line-height: 1.3;
                    margin-top: 2px;
                }

                /* ── Keyframes ── */
                @keyframes sb-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(1.3); }
                }

                /* ── Responsive ── */
                @media (max-width: 1024px) {
                    .sb-grid {
                        grid-template-columns: 1fr;
                    }

                    .sb-trust-strip {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .sb-trust-item + .sb-trust-item {
                        border-left: none;
                    }
                }

                @media (max-width: 768px) {
                    .sb-section {
                        padding: var(--space-16) var(--space-4);
                    }

                    .sb-cert-grid {
                        grid-template-columns: 1fr;
                    }

                    .sb-trust-strip {
                        grid-template-columns: repeat(2, 1fr);
                        padding: var(--space-5);
                    }
                }

                @media (max-width: 480px) {
                    .sb-trust-strip {
                        grid-template-columns: 1fr 1fr;
                        gap: var(--space-3);
                    }

                    .sb-card {
                        padding: var(--space-6);
                    }

                    .sb-lms-mock {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}