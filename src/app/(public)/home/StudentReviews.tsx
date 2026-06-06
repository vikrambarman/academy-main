"use client";

import { useState } from "react";
import { Star, Quote, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";

/* All review data from your ORIGINAL — nothing invented. */
const reviews = [
  { author: "Tarang Tamboli", rating: 5, text: "I am very satisfied with this computer centre. Vikram sir have excellent teaching methods — they explain every concept in a simple and clear way and give individual attention to each student. The coaching environment is very good for learning.", course: "Web Development" },
  { author: "Gaurav Gupta", rating: 5, text: "Vikram sir is so experienced and full of knowledge. This institute is so well — you gonna learn more things than you think. Vikram sir is so polite and so helpful with others.", course: "Networking" },
  { author: "Ayush Mishra", rating: 5, text: "I am currently studying at Shiv Shakti Computer Academy and my experience here is really good. Teachers explain everything clearly from the basics and give attention to every student.", course: "Basic Computer" },
  { author: "Pankaj Sahu", rating: 5, text: "Vikram sir se maine networking ka course kiya hai — bahut hi acha padhate hai aur sir ka behaviour bhi acha hai. Best education institute. Join Shivshakti for better education.", course: "Networking" },
  { author: "Ram Sahu", rating: 5, text: "The knowledge and behaviour of Vikram sir is awesome and the way he teaches makes concepts easy to understand. Thank you Vikram sir for teaching us and for your all support.", course: "Computer Hardware" },
  { author: "Nikita Haldar", rating: 5, text: "This computer class is very good, you get all the facilities here. You can never be bored in this class. The faculty is very good and always ready to help.", course: "DCA" },
  { author: "Dinesh Kumar Patel", rating: 5, text: "Sir aapka baat-cheet aur behaviour bahut achha laga. Aapka knowledge aur experience is field mein great hai.", course: "Web Development" },
  { author: "A. Gautam", rating: 5, text: "Faculty is very good — response and all. Especially Vikram sir is always available to clarify doubts and guide students in the right direction.", course: "Web Development" },
  { author: "Sonali Mistri", rating: 5, text: "Come here to learn computers — honestly I enjoy learning so much. Big thumbs up to Shivshakti Computer Academy. Highly recommended for everyone.", course: "DCA" },
];

const VISIBLE = 3;

function Stars({ count, size = 13 }: { count: number; size?: number }) {
  return (
    <div className="sr-stars-row">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} fill="currentColor" className="sr-star" />
      ))}
    </div>
  );
}

function Avatar({ char, large = false }: { char: string; large?: boolean }) {
  return <div className={large ? "sr-avatar sr-avatar-lg" : "sr-avatar"}>{char}</div>;
}

export default function StudentReviews() {
  const [current, setCurrent] = useState(0);
  const total = reviews.length;
  const maxIndex = total - VISIBLE;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));
  const visible = reviews.slice(current, current + VISIBLE);

  return (
    <>
      <section className="sr-section" aria-labelledby="reviews-heading">
        <div className="sr-container">
          {/* Header */}
          <div className="sr-header">
            <div className="sr-header-left">
              <div className="sr-badge">
                <span className="sr-badge-dot" aria-hidden="true" />
                Student Voices
              </div>
              <h2 id="reviews-heading" className="sr-title">
                What Our Students <span className="sr-title-highlight">Say About Us</span>
              </h2>
              <p className="sr-subtitle">
                Real experiences from students who trained at Shivshakti Computer
                Academy.
              </p>
            </div>

            <div className="sr-rating-card">
              <div className="sr-rating-num">5.0</div>
              <div className="sr-rating-right">
                <Stars count={5} size={15} />
                <div className="sr-rating-label">Google Rating</div>
                <div className="sr-rating-count">{total} verified reviews</div>
              </div>
            </div>
          </div>

          {/* Featured review */}
          <div className="sr-featured">
            <div className="sr-featured-quote" aria-hidden="true">
              <Quote size={40} strokeWidth={1} />
            </div>
            <div className="sr-featured-body">
              <Stars count={5} size={16} />
              <p className="sr-featured-text">&ldquo;{reviews[0].text}&rdquo;</p>
              <div className="sr-featured-author">
                <Avatar char={reviews[0].author.charAt(0)} large />
                <div>
                  <div className="sr-author-name">{reviews[0].author}</div>
                  <div className="sr-author-meta">
                    <span className="sr-course-badge">{reviews[0].course}</span>
                    <span className="sr-verified">
                      <BadgeCheck size={12} strokeWidth={2} />
                      Verified Review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel header */}
          <div className="sr-carousel-header">
            <p className="sr-carousel-label">More from our students</p>
            <div className="sr-nav">
              <button className="sr-nav-btn" onClick={prev} disabled={current === 0} aria-label="Previous reviews">
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
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
              <button className="sr-nav-btn" onClick={next} disabled={current >= maxIndex} aria-label="Next reviews">
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* 3-up carousel (desktop) */}
          <div className="sr-carousel">
            {visible.map((review, i) => (
              <article key={current + i} className="sr-card">
                <div className="sr-card-top">
                  <Stars count={review.rating} />
                  <span className="sr-course-badge">{review.course}</span>
                </div>
                <p className="sr-card-text">&ldquo;{review.text}&rdquo;</p>
                <div className="sr-card-footer">
                  <Avatar char={review.author.charAt(0)} />
                  <div className="sr-card-author-info">
                    <div className="sr-author-name">{review.author}</div>
                    <div className="sr-verified">
                      <BadgeCheck size={12} strokeWidth={2} />
                      Verified Review
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile scroll */}
          <div className="sr-mobile-scroll">
            {reviews.slice(1).map((review, i) => (
              <article key={i} className="sr-card sr-mobile-card">
                <div className="sr-card-top">
                  <Stars count={review.rating} />
                  <span className="sr-course-badge">{review.course}</span>
                </div>
                <p className="sr-card-text">&ldquo;{review.text}&rdquo;</p>
                <div className="sr-card-footer">
                  <Avatar char={review.author.charAt(0)} />
                  <div className="sr-card-author-info">
                    <div className="sr-author-name">{review.author}</div>
                    <div className="sr-verified">
                      <BadgeCheck size={12} strokeWidth={2} />
                      Verified Review
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
/* ── STUDENT REVIEWS — Clean University style ── */
.sr-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}
.sr-container { position: relative; max-width: 1180px; margin: 0 auto; }

.sr-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: var(--space-6); margin-bottom: var(--space-10); }
.sr-header-left { max-width: 540px; }
.sr-badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  color: var(--color-accent-600); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: var(--space-3);
}
.sr-badge-dot { width: 6px; height: 6px; background: var(--color-accent-500); border-radius: 50%; }
.sr-title {
  font-family: var(--font-display); font-size: clamp(1.6rem, 3.6vw, 2.25rem);
  font-weight: var(--font-weight-semibold); line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary); margin-bottom: var(--space-3);
}
.sr-title-highlight { color: var(--color-primary-700); }
.sr-subtitle { font-size: var(--font-size-base); line-height: 1.7; color: var(--text-secondary); margin: 0; }

.sr-rating-card {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); flex-shrink: 0;
}
.sr-rating-num { font-family: var(--font-display); font-size: 2.25rem; font-weight: var(--font-weight-semibold); line-height: 1; color: var(--color-primary-700); }
.sr-rating-right { display: flex; flex-direction: column; gap: var(--space-1); }
.sr-stars-row { display: flex; gap: 2px; }
.sr-star { color: var(--color-accent-500); }
.sr-rating-label { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: var(--text-primary); }
.sr-rating-count { font-size: var(--font-size-xs); color: var(--text-tertiary); }

/* Featured */
.sr-featured {
  position: relative; display: flex; gap: var(--space-8); align-items: flex-start;
  padding: var(--space-8);
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-left: 2px solid var(--color-accent-500);
  border-radius: var(--radius-lg); margin-bottom: var(--space-8);
}
.sr-featured-quote { color: var(--color-primary-200); flex-shrink: 0; margin-top: var(--space-1); }
.sr-featured-body { flex: 1; }
.sr-featured-text {
  font-family: var(--font-display); font-size: clamp(1rem, 1.8vw, 1.2rem);
  line-height: 1.7; color: var(--text-primary); margin: var(--space-4) 0 var(--space-6); font-style: italic;
}
.sr-featured-author { display: flex; align-items: center; gap: var(--space-4); }

/* Avatars */
.sr-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  flex-shrink: 0; background: var(--color-primary-50); color: var(--color-primary-700); border: 1px solid var(--border-color);
}
.sr-avatar-lg { width: 48px; height: 48px; font-size: var(--font-size-lg); }

.sr-author-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin-bottom: var(--space-1); }
.sr-author-meta { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.sr-course-badge {
  display: inline-block; padding: 2px var(--space-3);
  background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-full);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-secondary);
  letter-spacing: 0.04em;
}
.sr-verified { display: flex; align-items: center; gap: 4px; font-size: var(--font-size-xs); color: var(--text-tertiary); }
.sr-verified svg { color: var(--color-success); }

/* Carousel header */
.sr-carousel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-5); }
.sr-carousel-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin: 0; }
.sr-nav { display: flex; align-items: center; gap: var(--space-3); }
.sr-nav-btn {
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid var(--border-color); background: var(--bg-elevated); color: var(--text-primary);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}
.sr-nav-btn:hover:not(:disabled) { border-color: var(--color-primary-600); color: var(--color-primary-600); }
.sr-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.sr-dots { display: flex; gap: var(--space-2); align-items: center; }
.sr-dot { width: 6px; height: 6px; border-radius: 50%; border: none; background: var(--color-gray-300); cursor: pointer; padding: 0; transition: background-color var(--transition-fast), width var(--transition-fast); }
.sr-dot--active { width: 20px; border-radius: var(--radius-full); background: var(--color-primary-600); }

/* 3-up carousel */
.sr-carousel { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.sr-card {
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); padding: var(--space-6);
  display: flex; flex-direction: column; gap: var(--space-4);
  transition: border-color var(--transition-base);
}
.sr-card:hover { border-color: var(--color-gray-300); }
.sr-card-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-2); }
.sr-card-text { font-size: var(--font-size-sm); line-height: 1.7; color: var(--text-secondary); margin: 0; flex: 1; font-style: italic; }
.sr-card-footer { display: flex; align-items: center; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid var(--border-color); margin-top: auto; }
.sr-card-author-info { display: flex; flex-direction: column; gap: 3px; }

/* Mobile scroll */
.sr-mobile-scroll { display: none; gap: var(--space-4); overflow-x: auto; padding-bottom: var(--space-3); scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.sr-mobile-card { min-width: 280px; scroll-snap-align: start; flex-shrink: 0; }

/* Responsive */
@media (max-width: 1024px) { .sr-carousel { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .sr-section { padding: var(--space-16) var(--space-4); }
  .sr-header { flex-direction: column; align-items: flex-start; }
  .sr-rating-card { width: 100%; }
  .sr-featured { flex-direction: column; gap: var(--space-4); }
  .sr-featured-quote { display: none; }
  .sr-carousel-header, .sr-carousel { display: none; }
  .sr-mobile-scroll { display: flex; }
}
@media (max-width: 480px) {
  .sr-featured-text { font-size: var(--font-size-base); }
}
      `}</style>
    </>
  );
}
