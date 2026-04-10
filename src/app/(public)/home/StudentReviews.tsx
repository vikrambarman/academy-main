"use client";

import { useState } from "react";
import { Star, Quote, Verified, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
    { author: "Tarang Tamboli", rating: 5, text: "I am very satisfied with this computer centre. Vikram sir have excellent teaching methods — they explain every concept in a simple and clear way and give individual attention to each student. The coaching environment is very good for learning.", course: "Web Development", color: "blue" },
    { author: "Gaurav Gupta", rating: 5, text: "Vikram sir is so experienced and full of knowledge. This institute is so well — you gonna learn more things than you think. Vikram sir is so polite and so helpful with others.", course: "Networking", color: "orange" },
    { author: "Ayush Mishra", rating: 5, text: "I am currently studying at Shiv Shakti Computer Academy and my experience here is really good. Teachers explain everything clearly from the basics and give attention to every student.", course: "Basic Computer", color: "gray" },
    { author: "Pankaj Sahu", rating: 5, text: "Vikram sir se maine networking ka course kiya hai — bahut hi acha padhate hai aur sir ka behaviour bhi acha hai. Best education institute. Join Shivshakti for better education.", course: "Networking", color: "orange" },
    { author: "Ram Sahu", rating: 5, text: "The knowledge and behaviour of Vikram sir is awesome and the way he teaches makes concepts easy to understand. Thank you Vikram sir for teaching us and for your all support.", course: "Computer Hardware", color: "blue" },
    { author: "Nikita Haldar", rating: 5, text: "This computer class is very good, you get all the facilities here. You can never be bored in this class. The faculty is very good and always ready to help.", course: "DCA", color: "green" },
    { author: "Dinesh Kumar Patel", rating: 5, text: "Sir aapka baat-cheet aur behaviour bahut achha laga. Aapka knowledge aur experience is field mein great hai.", course: "Web Development", color: "purple" },
    { author: "A. Gautam", rating: 5, text: "Faculty is very good — response and all. Especially Vikram sir is always available to clarify doubts and guide students in the right direction.", course: "Web Development", color: "blue" },
    { author: "Sonali Mistri", rating: 5, text: "Come here to learn computers — honestly I enjoy learning so much. Big thumbs up to Shivshakti Computer Academy. Highly recommended for everyone.", course: "DCA", color: "gray" },
];

const colorMap: Record<string, { bg: string; text: string; border: string; avatarBg: string }> = {
    blue:   { bg: "rgba(37,99,235,0.08)",   text: "#2563eb", border: "rgba(37,99,235,0.2)",   avatarBg: "rgba(37,99,235,0.1)"  },
    orange: { bg: "rgba(249,115,22,0.08)",  text: "#ea580c", border: "rgba(249,115,22,0.2)",  avatarBg: "rgba(249,115,22,0.1)" },
    green:  { bg: "rgba(16,185,129,0.08)",  text: "#059669", border: "rgba(16,185,129,0.2)",  avatarBg: "rgba(16,185,129,0.1)" },
    purple: { bg: "rgba(124,58,237,0.08)",  text: "#7c3aed", border: "rgba(124,58,237,0.2)",  avatarBg: "rgba(124,58,237,0.1)" },
    gray:   { bg: "rgba(100,116,139,0.08)", text: "#475569", border: "rgba(100,116,139,0.2)", avatarBg: "rgba(100,116,139,0.1)"},
};

// Show 3 at a time on desktop, 1 on mobile
const VISIBLE = 3;

export default function StudentReviews() {
    const [current, setCurrent] = useState(0);
    const total = reviews.length;
    const maxIndex = total - VISIBLE;

    const prev = () => setCurrent((c) => Math.max(0, c - 1));
    const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

    // Visible slice for desktop (3-up carousel)
    const visible = reviews.slice(current, current + VISIBLE);

    return (
        <>
            <section className="sr-section" aria-labelledby="reviews-heading">

                <div className="sr-glow-tr"   aria-hidden="true" />
                <div className="sr-glow-bl"   aria-hidden="true" />
                <div className="sr-bg-dots"   aria-hidden="true" />

                <div className="sr-container">

                    {/* ── Header ── */}
                    <div className="sr-header">
                        <div className="sr-header-left">
                            <div className="sr-badge">
                                <span className="sr-badge-dot" aria-hidden="true" />
                                Student Voices
                            </div>
                            <h2 id="reviews-heading" className="sr-title">
                                What Our Students<br />
                                <span className="sr-title-highlight">Say About Us</span>
                            </h2>
                            <p className="sr-subtitle">
                                Real experiences from students who trained at
                                Shivshakti Computer Academy.
                            </p>
                        </div>

                        {/* Rating summary */}
                        <div className="sr-rating-card">
                            <div className="sr-rating-num">5.0</div>
                            <div className="sr-rating-right">
                                <div className="sr-stars-row">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={15} fill="currentColor" className="sr-star" />
                                    ))}
                                </div>
                                <div className="sr-rating-label">Google Rating</div>
                                <div className="sr-rating-count">{total} verified reviews</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Featured review (large) ── */}
                    <div className="sr-featured">
                        <div className="sr-featured-quote" aria-hidden="true">
                            <Quote size={48} strokeWidth={1} />
                        </div>
                        <div className="sr-featured-body">
                            <div className="sr-featured-stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" className="sr-star" />
                                ))}
                            </div>
                            <p className="sr-featured-text">
                                "{reviews[0].text}"
                            </p>
                            <div className="sr-featured-author">
                                <div
                                    className="sr-avatar sr-avatar-lg"
                                    style={{
                                        background: colorMap[reviews[0].color].avatarBg,
                                        color: colorMap[reviews[0].color].text,
                                        border: `1.5px solid ${colorMap[reviews[0].color].border}`,
                                    }}
                                >
                                    {reviews[0].author.charAt(0)}
                                </div>
                                <div>
                                    <div className="sr-author-name">{reviews[0].author}</div>
                                    <div className="sr-author-meta">
                                        <span
                                            className="sr-course-badge"
                                            style={{
                                                background: colorMap[reviews[0].color].bg,
                                                color: colorMap[reviews[0].color].text,
                                                border: `1px solid ${colorMap[reviews[0].color].border}`,
                                            }}
                                        >
                                            {reviews[0].course}
                                        </span>
                                        <span className="sr-verified">
                                            <Verified size={11} strokeWidth={2} />
                                            Verified Review
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sr-featured-deco" aria-hidden="true" />
                    </div>

                    {/* ── Carousel header row ── */}
                    <div className="sr-carousel-header">
                        <p className="sr-carousel-label">
                            More from our students
                        </p>
                        <div className="sr-nav">
                            <button
                                className="sr-nav-btn"
                                onClick={prev}
                                disabled={current === 0}
                                aria-label="Previous reviews"
                            >
                                <ChevronLeft size={18} strokeWidth={2} />
                            </button>
                            {/* Dots */}
                            <div className="sr-dots">
                                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        className={`sr-dot${current === i ? " sr-dot--active" : ""}`}
                                        onClick={() => setCurrent(i)}
                                        aria-label={`Go to review ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                className="sr-nav-btn"
                                onClick={next}
                                disabled={current >= maxIndex}
                                aria-label="Next reviews"
                            >
                                <ChevronRight size={18} strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    {/* ── 3-up carousel ── */}
                    <div className="sr-carousel">
                        {visible.map((review, i) => {
                            const c = colorMap[review.color];
                            return (
                                <article key={current + i} className="sr-card">
                                    <div className="sr-card-top">
                                        <div className="sr-card-stars">
                                            {Array.from({ length: review.rating }).map((_, si) => (
                                                <Star key={si} size={13} fill="currentColor" className="sr-star" />
                                            ))}
                                        </div>
                                        <span
                                            className="sr-course-badge"
                                            style={{
                                                background: c.bg,
                                                color: c.text,
                                                border: `1px solid ${c.border}`,
                                            }}
                                        >
                                            {review.course}
                                        </span>
                                    </div>

                                    <p className="sr-card-text">"{review.text}"</p>

                                    <div className="sr-card-footer">
                                        <div
                                            className="sr-avatar"
                                            style={{
                                                background: c.avatarBg,
                                                color: c.text,
                                                border: `1.5px solid ${c.border}`,
                                            }}
                                        >
                                            {review.author.charAt(0)}
                                        </div>
                                        <div className="sr-card-author-info">
                                            <div className="sr-author-name">{review.author}</div>
                                            <div className="sr-verified">
                                                <Verified size={11} strokeWidth={2} />
                                                Verified Review
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* ── Mobile: single card scroll ── */}
                    <div className="sr-mobile-scroll">
                        {reviews.slice(1).map((review, i) => {
                            const c = colorMap[review.color];
                            return (
                                <article key={i} className="sr-card sr-mobile-card">
                                    <div className="sr-card-top">
                                        <div className="sr-card-stars">
                                            {Array.from({ length: review.rating }).map((_, si) => (
                                                <Star key={si} size={13} fill="currentColor" className="sr-star" />
                                            ))}
                                        </div>
                                        <span
                                            className="sr-course-badge"
                                            style={{
                                                background: c.bg,
                                                color: c.text,
                                                border: `1px solid ${c.border}`,
                                            }}
                                        >
                                            {review.course}
                                        </span>
                                    </div>
                                    <p className="sr-card-text">"{review.text}"</p>
                                    <div className="sr-card-footer">
                                        <div
                                            className="sr-avatar"
                                            style={{
                                                background: c.avatarBg,
                                                color: c.text,
                                                border: `1.5px solid ${c.border}`,
                                            }}
                                        >
                                            {review.author.charAt(0)}
                                        </div>
                                        <div className="sr-card-author-info">
                                            <div className="sr-author-name">{review.author}</div>
                                            <div className="sr-verified">
                                                <Verified size={11} strokeWidth={2} />
                                                Verified Review
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                </div>
            </section>

            <style>{`

                /* ── Section ── */
                .sr-section {
                    position: relative;
                    padding: var(--space-24) var(--space-6);
                    background: linear-gradient(
                        180deg,
                        var(--color-white) 0%,
                        var(--color-gray-50) 100%
                    );
                    overflow: hidden;
                }

                /* Dots bg */
                .sr-bg-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(
                        circle,
                        rgba(37,99,235,0.04) 1px,
                        transparent 1px
                    );
                    background-size: 28px 28px;
                    pointer-events: none;
                    z-index: 0;
                }

                .sr-glow-tr {
                    position: absolute;
                    top: -100px; right: -80px;
                    width: 400px; height: 400px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%);
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                .sr-glow-bl {
                    position: absolute;
                    bottom: -80px; left: -60px;
                    width: 340px; height: 340px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%);
                    filter: blur(50px);
                    pointer-events: none;
                    z-index: 0;
                }

                /* ── Container ── */
                .sr-container {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .sr-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: var(--space-6);
                    margin-bottom: var(--space-12);
                }

                .sr-header-left {
                    max-width: 520px;
                }

                /* Badge */
                .sr-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-4);
                    background: rgba(37,99,235,0.08);
                    border: 1px solid rgba(37,99,235,0.18);
                    border-radius: var(--radius-full);
                    font-size: 0.68rem;
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-primary-700);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: var(--space-4);
                }

                .sr-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--color-primary-600);
                    border-radius: var(--radius-full);
                    animation: sr-pulse 2s ease-in-out infinite;
                }

                /* Title */
                .sr-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.9rem, 4vw, 2.75rem);
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    letter-spacing: var(--letter-spacing-tight);
                    color: var(--text-primary);
                    margin-bottom: var(--space-3);
                }

                .sr-title-highlight {
                    background: linear-gradient(
                        135deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .sr-subtitle {
                    font-size: var(--font-size-base);
                    line-height: 1.7;
                    color: var(--text-secondary);
                    margin: 0;
                }

                /* Rating card */
                .sr-rating-card {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    padding: var(--space-5) var(--space-6);
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    box-shadow: var(--shadow-sm);
                    flex-shrink: 0;
                }

                .sr-rating-num {
                    font-family: var(--font-display);
                    font-size: 2.6rem;
                    font-weight: var(--font-weight-bold);
                    line-height: 1;
                    color: var(--color-primary-600);
                    letter-spacing: var(--letter-spacing-tight);
                }

                .sr-rating-right {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }

                .sr-stars-row {
                    display: flex;
                    gap: 2px;
                }

                .sr-star {
                    color: var(--color-accent-500);
                }

                .sr-rating-label {
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                }

                .sr-rating-count {
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                }

                /* ── Featured card ── */
                .sr-featured {
                    position: relative;
                    display: flex;
                    gap: var(--space-8);
                    align-items: flex-start;
                    padding: var(--space-10) var(--space-10);
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-3xl);
                    box-shadow: var(--shadow-md);
                    margin-bottom: var(--space-10);
                    overflow: hidden;
                }

                /* Left accent bar */
                .sr-featured::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 4px;
                    background: linear-gradient(
                        180deg,
                        var(--color-primary-600),
                        var(--color-accent-500)
                    );
                    border-radius: var(--radius-full);
                }

                .sr-featured-quote {
                    color: var(--color-primary-100);
                    flex-shrink: 0;
                    margin-top: var(--space-1);
                }

                .sr-featured-body {
                    flex: 1;
                }

                .sr-featured-stars {
                    display: flex;
                    gap: 3px;
                    margin-bottom: var(--space-4);
                }

                .sr-featured-text {
                    font-family: var(--font-display);
                    font-size: clamp(1rem, 1.8vw, 1.2rem);
                    font-weight: var(--font-weight-normal);
                    line-height: 1.75;
                    color: var(--text-primary);
                    margin-bottom: var(--space-6);
                    font-style: italic;
                }

                .sr-featured-author {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                }

                /* bg deco on featured */
                .sr-featured-deco {
                    position: absolute;
                    bottom: -60px; right: -60px;
                    width: 200px; height: 200px;
                    border-radius: var(--radius-full);
                    background: radial-gradient(
                        circle,
                        rgba(37,99,235,0.06) 0%,
                        transparent 70%
                    );
                    pointer-events: none;
                }

                /* ── Avatars ── */
                .sr-avatar {
                    width: 38px; height: 38px;
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-display);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    flex-shrink: 0;
                }

                .sr-avatar-lg {
                    width: 48px; height: 48px;
                    font-size: var(--font-size-lg);
                }

                /* ── Author info ── */
                .sr-author-name {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-1);
                }

                .sr-author-meta {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    flex-wrap: wrap;
                }

                /* Course badge */
                .sr-course-badge {
                    display: inline-block;
                    padding: 2px var(--space-3);
                    border-radius: var(--radius-full);
                    font-size: 0.65rem;
                    font-weight: var(--font-weight-semibold);
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                }

                /* Verified */
                .sr-verified {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                    font-weight: var(--font-weight-normal);
                }

                /* ── Carousel header ── */
                .sr-carousel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: var(--space-5);
                }

                .sr-carousel-label {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin: 0;
                }

                .sr-nav {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }

                .sr-nav-btn {
                    width: 36px; height: 36px;
                    border-radius: var(--radius-full);
                    border: 1px solid var(--color-gray-200);
                    background: var(--color-white);
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition:
                        border-color var(--transition-fast),
                        background-color var(--transition-fast),
                        color var(--transition-fast),
                        box-shadow var(--transition-fast);
                }

                .sr-nav-btn:hover:not(:disabled) {
                    border-color: var(--color-primary-400);
                    background: var(--color-primary-50);
                    color: var(--color-primary-600);
                    box-shadow: var(--shadow-sm);
                }

                .sr-nav-btn:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }

                /* Dots */
                .sr-dots {
                    display: flex;
                    gap: var(--space-2);
                    align-items: center;
                }

                .sr-dot {
                    width: 6px; height: 6px;
                    border-radius: var(--radius-full);
                    border: none;
                    background: var(--color-gray-300);
                    cursor: pointer;
                    padding: 0;
                    transition:
                        background-color var(--transition-fast),
                        width var(--transition-fast);
                }

                .sr-dot--active {
                    width: 20px;
                    background: var(--color-primary-600);
                }

                /* ── 3-up Carousel ── */
                .sr-carousel {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-5);
                    margin-bottom: var(--space-4);
                }

                /* ── Review Card ── */
                .sr-card {
                    background: var(--color-white);
                    border: 1px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-6);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    transition:
                        transform var(--transition-base),
                        box-shadow var(--transition-base),
                        border-color var(--transition-base);
                    animation: sr-card-in 0.4s var(--ease-out) both;
                }

                .sr-card:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--color-primary-200);
                }

                @keyframes sr-card-in {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .sr-card-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: var(--space-2);
                }

                .sr-card-stars {
                    display: flex;
                    gap: 2px;
                }

                .sr-card-text {
                    font-size: var(--font-size-sm);
                    line-height: 1.75;
                    color: var(--text-secondary);
                    margin: 0;
                    flex: 1;
                    font-style: italic;
                }

                .sr-card-footer {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding-top: var(--space-4);
                    border-top: 1px solid var(--color-gray-100);
                    margin-top: auto;
                }

                .sr-card-author-info {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                /* ── Mobile scroll ── */
                .sr-mobile-scroll {
                    display: none;
                    gap: var(--space-4);
                    overflow-x: auto;
                    padding-bottom: var(--space-3);
                    scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                }

                .sr-mobile-scroll::-webkit-scrollbar {
                    height: 4px;
                }

                .sr-mobile-scroll::-webkit-scrollbar-track {
                    background: var(--color-gray-100);
                    border-radius: var(--radius-full);
                }

                .sr-mobile-scroll::-webkit-scrollbar-thumb {
                    background: var(--color-primary-300);
                    border-radius: var(--radius-full);
                }

                .sr-mobile-card {
                    min-width: 280px;
                    scroll-snap-align: start;
                    flex-shrink: 0;
                }

                /* ── Keyframes ── */
                @keyframes sr-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(1.3); }
                }

                /* ── Responsive ── */
                @media (max-width: 1024px) {
                    .sr-carousel {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .sr-section {
                        padding: var(--space-16) var(--space-4);
                    }

                    .sr-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .sr-rating-card {
                        width: 100%;
                    }

                    .sr-featured {
                        flex-direction: column;
                        gap: var(--space-4);
                        padding: var(--space-6);
                    }

                    .sr-featured-quote {
                        display: none;
                    }

                    /* Hide desktop carousel on mobile */
                    .sr-carousel-header,
                    .sr-carousel {
                        display: none;
                    }

                    /* Show mobile scroll */
                    .sr-mobile-scroll {
                        display: flex;
                    }
                }

                @media (max-width: 480px) {
                    .sr-featured {
                        padding: var(--space-5);
                        border-radius: var(--radius-2xl);
                    }

                    .sr-featured-text {
                        font-size: var(--font-size-base);
                    }
                }
            `}</style>
        </>
    );
}