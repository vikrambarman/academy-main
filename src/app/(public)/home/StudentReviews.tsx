import Image from "next/image";

const reviews = [
    {
        author: "Tarang Tamboli",
        rating: 5,
        text: "I am very satisfied with this computer centre. Vikram sir have excellent teaching methods — they explain every concept in a simple and clear way and give individual attention to each student. The coaching environment is very good for learning — it's peaceful, disciplined, and all doubts are properly solved.",
        profile: "/reviews/amit.jpg",
        course: "DCA",
    },
    {
        author: "Gaurav Gupta",
        rating: 5,
        text: "Vikram sir is so experienced and full of knowledge. This institute is so well — you gonna learn more things than you think. Vikram sir is so polite and so helpful with others.",
        profile: "/reviews/pooja.jpg",
        course: "Networking",
    },
    {
        author: "Ayush Mishra",
        rating: 5,
        text: "I am currently studying at Shiv Shakti Computer Academy and my experience here is really good. Teachers explain everything clearly from the basics and give attention to every student. Learning here has given me a lot of confidence in computers.",
        profile: "/reviews/sunita.jpg",
        course: "Basic Computer",
    },
    {
        author: "Pankaj Sahu",
        rating: 5,
        text: "Vikram sir se maine networking ka course kiya hai — bahut hi acha padhate hai aur sir ka behaviour bhi acha hai. Best education institute. Join Shivshakti for better education.",
        profile: "/reviews/rohit.jpg",
        course: "Networking",
    },
    {
        author: "Ram Sahu",
        rating: 5,
        text: "The knowledge and behaviour of Vikram sir is awesome and the way he teaches makes concepts easy to understand. Thank you Vikram sir for teaching us and for your all support.",
        profile: "/reviews/pooja.jpg",
        course: "PGDCA",
    },
    {
        author: "Nikita Haldar",
        rating: 5,
        text: "This computer class is very good, you get all the facilities here. You can never be bored in this class. The faculty is very good and always ready to help.",
        profile: "/reviews/pooja.jpg",
        course: "Tally with GST",
    },
    {
        author: "Dinesh Kumar Patel",
        rating: 5,
        text: "Sir aapka baat-cheet aur behaviour bahut achha laga. Aapka knowledge aur experience is field mein great hai.",
        profile: "/reviews/pooja.jpg",
        course: "Web Development",
    },
    {
        author: "A. Gautam",
        rating: 5,
        text: "Faculty is very good — response and all. Especially Vikram sir is always available to clarify doubts and guide students in the right direction.",
        profile: "/reviews/pooja.jpg",
        course: "DCA",
    },
    {
        author: "Sonali Mistri",
        rating: 5,
        text: "Come here to learn computers — honestly I enjoy learning so much. Big thumbs up to Shivshakti Computer Academy. Highly recommended for everyone.",
        profile: "/reviews/pooja.jpg",
        course: "Basic Computer",
    },
];

export default function StudentReviews() {
    // Split into 3 columns for masonry-like effect
    const col1 = reviews.filter((_, i) => i % 3 === 0);
    const col2 = reviews.filter((_, i) => i % 3 === 1);
    const col3 = reviews.filter((_, i) => i % 3 === 2);

    return (
        <>
            <style>{`
                .sr-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #1a1208;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                /* Ghost quote watermark */
                .sr-watermark {
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(180px, 30vw, 360px);
                    font-weight: 900;
                    font-style: italic;
                    line-height: 1;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(252,211,77,0.04);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                }

                /* Amber glow bottom-left */
                .sr-glow {
                    position: absolute;
                    bottom: -100px;
                    left: -60px;
                    width: 420px;
                    height: 420px;
                    background: radial-gradient(circle, rgba(217,119,6,0.09) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                .sr-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* ── Header ── */
                .sr-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 32px;
                    margin-bottom: 60px;
                    flex-wrap: wrap;
                }

                .sr-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .sr-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #fcd34d;
                }

                .sr-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                    color: #fef3c7;
                    line-height: 1.2;
                }

                .sr-title em {
                    font-style: italic;
                    color: #fcd34d;
                }

                /* Rating summary */
                .sr-rating-summary {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-shrink: 0;
                }

                .sr-rating-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.8rem;
                    font-weight: 700;
                    color: #fcd34d;
                    line-height: 1;
                }

                .sr-rating-right {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .sr-stars {
                    display: flex;
                    gap: 2px;
                }

                .sr-star {
                    color: #fcd34d;
                    font-size: 0.9rem;
                }

                .sr-rating-label {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.5);
                    letter-spacing: 0.05em;
                }

                /* ── Masonry columns ── */
                .sr-masonry {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    align-items: start;
                }

                .sr-col {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* ── Review card ── */
                .sr-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(252,211,77,0.1);
                    border-radius: 18px;
                    padding: 26px 24px;
                    transition: background 0.22s ease, border-color 0.22s ease;
                    position: relative;
                    overflow: hidden;
                }

                .sr-card:hover {
                    background: rgba(255,255,255,0.07);
                    border-color: rgba(252,211,77,0.22);
                }

                /* Large quote mark decoration */
                .sr-card-quote {
                    position: absolute;
                    top: 14px;
                    right: 18px;
                    font-family: 'Playfair Display', serif;
                    font-size: 4rem;
                    font-weight: 900;
                    color: rgba(252,211,77,0.07);
                    line-height: 1;
                    pointer-events: none;
                    user-select: none;
                }

                /* Stars */
                .sr-card-stars {
                    display: flex;
                    gap: 2px;
                    margin-bottom: 14px;
                }

                .sr-card-star {
                    color: #fcd34d;
                    font-size: 0.78rem;
                }

                /* Course tag */
                .sr-card-course {
                    display: inline-block;
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #fcd34d;
                    background: rgba(252,211,77,0.1);
                    border: 1px solid rgba(252,211,77,0.18);
                    padding: 3px 10px;
                    border-radius: 100px;
                    margin-bottom: 14px;
                }

                /* Review text */
                .sr-card-text {
                    font-size: 0.82rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.7);
                    line-height: 1.8;
                }

                /* Author row */
                .sr-card-author-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(252,211,77,0.08);
                }

                .sr-card-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(252,211,77,0.15);
                    border: 1px solid rgba(252,211,77,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #fcd34d;
                    flex-shrink: 0;
                    overflow: hidden;
                    position: relative;
                }

                .sr-card-author-name {
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #fef3c7;
                }

                .sr-card-author-verified {
                    font-size: 0.7rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.4);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-top: 1px;
                }

                .sr-verified-dot {
                    width: 5px;
                    height: 5px;
                    background: #4ade80;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* ── Responsive ── */
                @media (max-width: 900px) {
                    .sr-masonry {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .sr-col:last-child {
                        display: none;
                    }

                    .sr-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 24px;
                        margin-bottom: 44px;
                    }
                }

                @media (max-width: 560px) {
                    .sr-root {
                        padding: 64px 16px;
                    }

                    .sr-masonry {
                        grid-template-columns: 1fr;
                    }

                    .sr-col:last-child {
                        display: flex;
                    }
                }
            `}</style>

            <section className="sr-root" aria-labelledby="student-reviews-heading">
                <div className="sr-watermark" aria-hidden="true">"</div>
                <div className="sr-glow" aria-hidden="true" />

                <div className="sr-inner">

                    {/* Header */}
                    <div className="sr-header">
                        <div>
                            <div className="sr-eyebrow">Student Voices</div>
                            <h2 id="student-reviews-heading" className="sr-title">
                                What Our Students<br />
                                <em>Say About Us</em>
                            </h2>
                        </div>

                        {/* Rating summary */}
                        <div className="sr-rating-summary" aria-label="Average rating 5 out of 5">
                            <div className="sr-rating-num">5.0</div>
                            <div className="sr-rating-right">
                                <div className="sr-stars" aria-hidden="true">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className="sr-star">★</span>
                                    ))}
                                </div>
                                <div className="sr-rating-label">
                                    {reviews.length} Google Reviews
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Masonry columns */}
                    <div className="sr-masonry">
                        {[col1, col2, col3].map((col, ci) => (
                            <div key={ci} className="sr-col">
                                {col.map((review, ri) => (
                                    <article key={ri} className="sr-card">
                                        <div className="sr-card-quote" aria-hidden="true">"</div>

                                        {/* Stars */}
                                        <div className="sr-card-stars" aria-label={`${review.rating} stars`}>
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <span key={i} className="sr-card-star">★</span>
                                            ))}
                                        </div>

                                        {/* Course tag */}
                                        <div className="sr-card-course">{review.course}</div>

                                        {/* Text */}
                                        <p className="sr-card-text">{review.text}</p>

                                        {/* Author */}
                                        <div className="sr-card-author-row">
                                            <div
                                                className="sr-card-avatar"
                                                aria-hidden="true"
                                            >
                                                {review.author.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="sr-card-author-name">
                                                    {review.author}
                                                </div>
                                                <div className="sr-card-author-verified">
                                                    <span className="sr-verified-dot" />
                                                    Verified Google Review
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}