"use client"

import Image from "next/image";

const reviews = [
    { author:"Tarang Tamboli",    rating:5, text:"I am very satisfied with this computer centre. Vikram sir have excellent teaching methods — they explain every concept in a simple and clear way and give individual attention to each student. The coaching environment is very good for learning — it's peaceful, disciplined, and all doubts are properly solved.", profile:"/reviews/amit.jpg",  course:"DCA"            },
    { author:"Gaurav Gupta",      rating:5, text:"Vikram sir is so experienced and full of knowledge. This institute is so well — you gonna learn more things than you think. Vikram sir is so polite and so helpful with others.",                                                                                                                                        profile:"/reviews/pooja.jpg", course:"Networking"     },
    { author:"Ayush Mishra",      rating:5, text:"I am currently studying at Shiv Shakti Computer Academy and my experience here is really good. Teachers explain everything clearly from the basics and give attention to every student. Learning here has given me a lot of confidence in computers.",                                                                    profile:"/reviews/sunita.jpg",course:"Basic Computer" },
    { author:"Pankaj Sahu",       rating:5, text:"Vikram sir se maine networking ka course kiya hai — bahut hi acha padhate hai aur sir ka behaviour bhi acha hai. Best education institute. Join Shivshakti for better education.",                                                                                                                                     profile:"/reviews/rohit.jpg", course:"Networking"     },
    { author:"Ram Sahu",          rating:5, text:"The knowledge and behaviour of Vikram sir is awesome and the way he teaches makes concepts easy to understand. Thank you Vikram sir for teaching us and for your all support.",                                                                                                                                          profile:"/reviews/pooja.jpg", course:"PGDCA"          },
    { author:"Nikita Haldar",     rating:5, text:"This computer class is very good, you get all the facilities here. You can never be bored in this class. The faculty is very good and always ready to help.",                                                                                                                                                           profile:"/reviews/pooja.jpg", course:"Tally with GST" },
    { author:"Dinesh Kumar Patel",rating:5, text:"Sir aapka baat-cheet aur behaviour bahut achha laga. Aapka knowledge aur experience is field mein great hai.",                                                                                                                                                                                                         profile:"/reviews/pooja.jpg", course:"Web Development"},
    { author:"A. Gautam",         rating:5, text:"Faculty is very good — response and all. Especially Vikram sir is always available to clarify doubts and guide students in the right direction.",                                                                                                                                                                       profile:"/reviews/pooja.jpg", course:"DCA"            },
    { author:"Sonali Mistri",     rating:5, text:"Come here to learn computers — honestly I enjoy learning so much. Big thumbs up to Shivshakti Computer Academy. Highly recommended for everyone.",                                                                                                                                                                     profile:"/reviews/pooja.jpg", course:"Basic Computer" },
];

// Course tag styles using CSS variables
const courseTagStyle: Record<string, React.CSSProperties> = {
    "DCA":            { background:"color-mix(in srgb,var(--color-info) 15%,transparent)",    color:"var(--color-info)",    border:"1px solid color-mix(in srgb,var(--color-info) 25%,transparent)"    },
    "PGDCA":          { background:"color-mix(in srgb,var(--color-info) 15%,transparent)",    color:"var(--color-info)",    border:"1px solid color-mix(in srgb,var(--color-info) 25%,transparent)"    },
    "Networking":     { background:"color-mix(in srgb,var(--color-accent) 15%,transparent)",  color:"var(--color-accent)",  border:"1px solid color-mix(in srgb,var(--color-accent) 25%,transparent)"  },
    "Basic Computer": { background:"rgba(100,116,139,0.18)",                                   color:"#94a3b8",              border:"1px solid rgba(100,116,139,0.2)"                                    },
    "Tally with GST": { background:"rgba(16,185,129,0.15)",                                    color:"#34d399",              border:"1px solid rgba(16,185,129,0.2)"                                     },
    "Web Development":{ background:"rgba(168,85,247,0.15)",                                    color:"#c084fc",              border:"1px solid rgba(168,85,247,0.2)"                                     },
};

export default function StudentReviews() {
    const col1 = reviews.filter((_, i) => i % 3 === 0);
    const col2 = reviews.filter((_, i) => i % 3 === 1);
    const col3 = reviews.filter((_, i) => i % 3 === 2);

    return (
        <>
            <style>{`
                .sr-watermark {
                    position: absolute;
                    top: -20px; right: -20px;
                    font-family: Georgia, serif;
                    font-size: clamp(180px, 30vw, 360px);
                    font-weight: 900;
                    font-style: italic;
                    line-height: 1;
                    color: transparent;
                    -webkit-text-stroke: 1px color-mix(in srgb, var(--color-info) 5%, transparent);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                }

                .sr-card {
                    transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
                }
                .sr-card:hover {
                    background: rgba(255,255,255,0.07) !important;
                    border-color: color-mix(in srgb, var(--color-info) 25%, transparent) !important;
                    transform: translateY(-2px);
                }

                @keyframes barGrow {
                    from { width: 0; }
                    to   { width: 100%; }
                }
                .sr-rating-bar-fill { animation: barGrow 1s ease forwards; }

                @media (max-width: 900px) { .sr-col-3 { display: none; } }
                @media (max-width: 560px) {
                    .sr-masonry { grid-template-columns: 1fr !important; }
                    .sr-col-3  { display: flex !important; }
                }
            `}</style>

            <section
                className="relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background:"var(--color-bg-sidebar)" }}
                aria-labelledby="student-reviews-heading"
            >
                <div className="sr-watermark" aria-hidden="true">"</div>

                {/* Primary glow top-right */}
                <div aria-hidden="true" className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
                    style={{ background:"radial-gradient(circle, color-mix(in srgb,var(--color-primary) 10%,transparent) 0%, transparent 65%)" }} />
                {/* Accent glow bottom-left */}
                <div aria-hidden="true" className="absolute -bottom-24 -left-16 w-[360px] h-[360px] rounded-full pointer-events-none z-0"
                    style={{ background:"radial-gradient(circle, color-mix(in srgb,var(--color-accent) 7%,transparent) 0%, transparent 65%)" }} />

                <div className="relative z-10 max-w-[1100px] mx-auto">

                    {/* Header */}
                    <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
                        <div>
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                                style={{ color:"var(--color-info)" }}>
                                <span style={{ display:"inline-block", width:24, height:1.5, background:"var(--color-info)", flexShrink:0 }} />
                                Student Voices
                            </div>
                            <h2 id="student-reviews-heading"
                                className="font-serif font-bold leading-[1.2]"
                                style={{ fontSize:"clamp(1.8rem,3vw,2.5rem)", color:"var(--color-text-inverse)" }}>
                                What Our Students<br />
                                <em className="not-italic" style={{ color:"var(--color-accent)" }}>Say About Us</em>
                            </h2>
                        </div>

                        {/* Rating summary */}
                        <div className="flex items-center gap-5 shrink-0 rounded-2xl px-6 py-4"
                            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid color-mix(in srgb,var(--color-info) 15%,transparent)" }}
                            aria-label="Average rating 5 out of 5">
                            <div className="font-serif text-[2.8rem] font-bold leading-none"
                                style={{ color:"var(--color-info)" }}>
                                5.0
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex gap-0.5" aria-hidden="true">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className="text-[0.9rem]"
                                            style={{ color:"var(--color-accent)" }}>★</span>
                                    ))}
                                </div>
                                <div className="text-[0.72rem] font-light tracking-[0.05em]"
                                    style={{ color:"rgba(255,255,255,0.35)" }}>
                                    Google Reviews
                                </div>
                                <div className="w-full h-0.5 rounded-full overflow-hidden"
                                    style={{ background:"color-mix(in srgb,var(--color-primary) 20%,transparent)" }}>
                                    <div className="sr-rating-bar-fill h-full rounded-full"
                                        style={{ background:"var(--color-accent)" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Masonry columns */}
                    <div className="sr-masonry grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        {[col1, col2, col3].map((col, ci) => (
                            <div key={ci} className={`flex flex-col gap-4 ${ci === 2 ? "sr-col-3" : ""}`}>
                                {col.map((review) => (
                                    <article key={review.author}
                                        className="sr-card relative overflow-hidden rounded-[18px] p-6"
                                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid color-mix(in srgb,var(--color-info) 10%,transparent)" }}>

                                        {/* Ghost quote */}
                                        <div className="absolute top-3 right-4 font-serif text-[4rem] font-black leading-none pointer-events-none select-none"
                                            style={{ color:"color-mix(in srgb,var(--color-info) 7%,transparent)" }}
                                            aria-hidden="true">"</div>

                                        {/* Stars */}
                                        <div className="flex gap-0.5 mb-3" aria-label={`${review.rating} stars`}>
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <span key={i} className="text-[0.78rem]"
                                                    style={{ color:"var(--color-accent)" }}>★</span>
                                            ))}
                                        </div>

                                        {/* Course tag */}
                                        <span className="inline-block text-[9px] font-medium tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-full mb-3"
                                            style={courseTagStyle[review.course] ?? { background:"rgba(100,116,139,0.15)", color:"#94a3b8", border:"1px solid rgba(100,116,139,0.2)" }}>
                                            {review.course}
                                        </span>

                                        {/* Text */}
                                        <p className="text-[0.82rem] font-light leading-[1.8]"
                                            style={{ color:"rgba(255,255,255,0.5)" }}>
                                            {review.text}
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-2.5 mt-5 pt-4"
                                            style={{ borderTop:"1px solid color-mix(in srgb,var(--color-info) 8%,transparent)" }}>
                                            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-serif text-[0.85rem] font-semibold"
                                                style={{ color:"var(--color-info)", background:"color-mix(in srgb,var(--color-info) 15%,transparent)", border:"1px solid color-mix(in srgb,var(--color-info) 20%,transparent)" }}
                                                aria-hidden="true">
                                                {review.author.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-[0.82rem] font-medium"
                                                    style={{ color:"var(--color-text-inverse)" }}>
                                                    {review.author}
                                                </div>
                                                <div className="flex items-center gap-1 mt-0.5 text-[0.7rem] font-light"
                                                    style={{ color:"rgba(255,255,255,0.35)" }}>
                                                    <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                                        style={{ background:"var(--color-success)" }} />
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