"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Quote,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// ✅ Real Google reviews - course info removed (Google me nahi hai)
const reviews = [
  {
    author: "Suraj Rajwade",
    rating: 5,
    text: "Shivshakti Computer Academy is a very good computer centre, I am studying here right now, theory classes and lab work training practice are done well, sir clears any doubt."
  },
  {
    author: "Ayush Mishra",
    rating: 5,
    text: "I am currently studying at Shiv Shakti Computer Academy, Ambikapur, and my experience here is really good. The teachers explain everything very clearly from the basics and give attention to every student. The lab facilities are well-maintained and we get enough time for practicals. Learning here has given me a lot of confidence in computers. Truly, for beginners, this is the best computer academy in Ambikapur."
  },
  {
    author: "Mohit Ghosh",
    rating: 5,
    text: "Shivshakti Computer Academy is highly recommended in Ambikapur. The teachers explain every topic in a simple and easy-to-understand way and are always ready to help students. The learning environment is excellent, with good practical training and quality education."
  },

  {
    author: "Sonali Mistri",
    rating: 5,
    text: "Come here to learn computers — honestly I enjoy learning so much. Big thumbs up to Shivshakti Computer Academy. Highly recommended for everyone.",
  },
  {
    author: "Sushma Thalpahari",
    rating: 5,
    text: "The best place in Ambikapur for computer learning! Shivshakti Computer Academy offers excellent teaching in both basic and advanced modules. The instructor 'Vikram sir' is experts in their fields."
  },
  {
    author: "Aditya Gupta",
    rating: 5,
    text: "VERY GOOD EDUCATION SHIVSHAKTI COMPUTER ACADEMY IN AMBIKAPUR, Vikram sir is so experience and so full of knowledge person"
  },
  {
    author: "Shikha Kharati",
    rating: 5,
    text: "Shivshakti Computer Academy is excellent. Vikram Sir teaches very well and uses easy concepts to explain everything. He is friendly with everyone, solves all doubts, and keeps the class lively with his jokes. A big thumbs up to him!"
  },
  {
    author: "Deepika Kharati",
    rating: 5,
    text: "Best place for computer learning! Vikram Sir at Shivshakti Computer Academy has a very good behavior and an amazing way of teaching with easy concepts. If you want to learn without getting bored, this is the right spot."
  },
  {
    author: "Saurabh Rajak",
    rating: 5,
    text: "Jay shree ram! Sari ji se maine networking ka course kiya hai bahut hi acha padhate hai or sir ka behaviour bhi acha hai , best education institute. Join Shivshakti for better education"
  },
  {
    author: "Tarang Tamboli",
    rating: 5,
    text: "I am very satisfied with this computer centre. Vikram sir have excellent teaching methods — they explain every concept in a simple and clear way and give individual attention to each student. The coaching environment is very good for learning.",
  },
  {
    author: "Gaurav Gupta",
    rating: 5,
    text: "Vikram sir is so experienced and full of knowledge. This institute is so well — you gonna learn more things than you think. Vikram sir is so polite and so helpful with others.",
  },
  {
    author: "Ayush Mishra",
    rating: 5,
    text: "I am currently studying at Shiv Shakti Computer Academy and my experience here is really good. Teachers explain everything clearly from the basics and give attention to every student.",
  },
  {
    author: "Pankaj Sahu",
    rating: 5,
    text: "Vikram sir se maine networking ka course kiya hai — bahut hi acha padhate hai aur sir ka behaviour bhi acha hai. Best education institute. Join Shivshakti for better education.",
  },
  {
    author: "Ram Sahu",
    rating: 5,
    text: "The knowledge and behaviour of Vikram sir is awesome and the way he teaches makes concepts easy to understand. Thank you Vikram sir for teaching us and for your all support.",
  },
  {
    author: "Nikita Haldar",
    rating: 5,
    text: "This computer class is very good, you get all the facilities here. You can never be bored in this class. The faculty is very good and always ready to help.",
  },
  {
    author: "Dinesh Kumar Patel",
    rating: 5,
    text: "Sir aapka baat-cheet aur behaviour bahut achha laga. Aapka knowledge aur experience is field mein great hai.",
  },
  {
    author: "A. Gautam",
    rating: 5,
    text: "Faculty is very good — response and all. Especially Vikram sir is always available to clarify doubts and guide students in the right direction.",
  },
];

const VISIBLE = 3; // Desktop me 3 cards visible
const TOTAL_GOOGLE_REVIEWS = 41; // ✅ Real count

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="sr-stars-row" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill="currentColor"
          className="sr-star"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function Avatar({ char }: { char: string }) {
  return (
    <div className="sr-avatar" aria-hidden="true">
      {char}
    </div>
  );
}

export default function StudentReviews() {
  const [current, setCurrent] = useState(0);
  const total = reviews.length;
  const maxIndex = total - VISIBLE;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));
  const visible = reviews.slice(current, current + VISIBLE);

  return (
    <section className="sr-section" aria-labelledby="sr-heading">

      {/* ── TOP STRIP — Colorful gradient bar ── */}
      <div className="sr-strip-top" aria-hidden="true">
        <div className="sr-strip-top-inner">
          <Star size={15} fill="currentColor" strokeWidth={0} />
          <span>Real Student Voices</span>
          <span className="sr-strip-dot">●</span>
          <span>Google Verified Reviews</span>
          <span className="sr-strip-dot">●</span>
          <span>5.0 Rating</span>
          <span className="sr-strip-dot">●</span>
          <span>Trusted by Students</span>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="sr-body">
        <div className="sr-container">

          {/* ── Header with Rating Card ── */}
          <div className="sr-header">
            <div className="sr-header-left">
              <span className="sr-tag">
                <span className="sr-tag-dot" aria-hidden="true" />
                Student Voices
              </span>
              <h2 id="sr-heading" className="sr-title">
                What Our Students{" "}
                <span className="sr-title-accent">Say About Us</span>
              </h2>
              <p className="sr-subtitle">
                Real experiences from students who trained at Shivshakti
                Computer Academy — verified reviews from Google Maps.
              </p>
            </div>

            {/* Rating Card */}
            <div className="sr-rating-card">
              <div className="sr-rating-num">5.0</div>
              <div className="sr-rating-right">
                <Stars count={5} size={16} />
                <div className="sr-rating-label">Google Rating</div>
                <div className="sr-rating-count">
                  {TOTAL_GOOGLE_REVIEWS} reviews
                </div>
              </div>
            </div>
          </div>

          {/* ── Carousel Controls (Desktop) ── */}
          <div className="sr-carousel-header">
            <p className="sr-carousel-label">
              Showing {reviews.length} recent reviews
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
              <div className="sr-dots" role="tablist">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    className={`sr-dot ${
                      current === i ? "sr-dot--active" : ""
                    }`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to review set ${i + 1}`}
                    aria-selected={current === i}
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

          {/* ── 3-Column Carousel (Desktop) ── */}
          <div className="sr-carousel">
            {visible.map((review, i) => (
              <article key={current + i} className="sr-card">
                {/* Quote icon */}
                <div className="sr-card-quote" aria-hidden="true">
                  <Quote size={28} strokeWidth={1.2} />
                </div>

                {/* Stars */}
                <Stars count={review.rating} size={15} />

                {/* Review text */}
                <p className="sr-card-text">&ldquo;{review.text}&rdquo;</p>

                {/* Author */}
                <div className="sr-card-footer">
                  <Avatar char={review.author.charAt(0)} />
                  <div className="sr-card-author-info">
                    <div className="sr-author-name">{review.author}</div>
                    <div className="sr-verified">
                      <BadgeCheck size={12} strokeWidth={2} />
                      Google Verified
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── Mobile Horizontal Scroll ── */}
          <div className="sr-mobile-scroll">
            {reviews.map((review, i) => (
              <article key={i} className="sr-card sr-mobile-card">
                <div className="sr-card-quote" aria-hidden="true">
                  <Quote size={24} strokeWidth={1.2} />
                </div>
                <Stars count={review.rating} size={14} />
                <p className="sr-card-text">&ldquo;{review.text}&rdquo;</p>
                <div className="sr-card-footer">
                  <Avatar char={review.author.charAt(0)} />
                  <div className="sr-card-author-info">
                    <div className="sr-author-name">{review.author}</div>
                    <div className="sr-verified">
                      <BadgeCheck size={11} strokeWidth={2} />
                      Google Verified
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>

      {/* ── BOTTOM STRIP — Google Maps CTA ── */}
      <div className="sr-strip-bottom">
        <div className="sr-strip-bottom-inner">
          <Star
            size={18}
            fill="currentColor"
            strokeWidth={0}
            className="sr-bottom-icon"
          />
          <span className="sr-bottom-text">
            Read all {TOTAL_GOOGLE_REVIEWS} reviews on Google Maps
          </span>
          <Link
            href="https://www.google.com/maps/place/Shivshakti+Computer+Academy/@23.148943,83.1750144,15z/data=!4m8!3m7!1s0x3989a1fdb11b2e2f:0x71e0d512323e169f!8m2!3d23.1530579!4d83.1714009!9m1!1b1!16s%2Fg%2F11xnnn2xbz?entry=ttu&g_ep=EgoyMDI2MDcwNi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="sr-bottom-btn"
          >
            View on Google
            <ExternalLink size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>

    </section>
  );
}