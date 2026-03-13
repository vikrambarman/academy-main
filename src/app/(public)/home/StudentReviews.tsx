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

// Course tag color mapping
const courseColors: Record<string, string> = {
    "DCA": "bg-blue-500/15 text-blue-300 border-blue-500/25",
    "PGDCA": "bg-blue-500/15 text-blue-300 border-blue-500/25",
    "Networking": "bg-[#EF4523]/15 text-orange-300 border-[#EF4523]/25",
    "Basic Computer": "bg-slate-500/20 text-slate-300 border-slate-500/20",
    "Tally with GST": "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    "Web Development": "bg-purple-500/15 text-purple-300 border-purple-500/20",
};

export default function StudentReviews() {
    const col1 = reviews.filter((_, i) => i % 3 === 0);
    const col2 = reviews.filter((_, i) => i % 3 === 1);
    const col3 = reviews.filter((_, i) => i % 3 === 2);

    return (
        <>
            <style>{`
                /* Ghost quote watermark */
                .sr-watermark {
                    position: absolute;
                    top: -20px; right: -20px;
                    font-family: Georgia, serif;
                    font-size: clamp(180px, 30vw, 360px);
                    font-weight: 900;
                    font-style: italic;
                    line-height: 1;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(96,165,250,0.04);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                }

                /* Card hover */
                .sr-card {
                    transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
                }
                .sr-card:hover {
                    background: rgba(255,255,255,0.07) !important;
                    border-color: rgba(96,165,250,0.25) !important;
                    transform: translateY(-2px);
                }

                /* Rating bar fill */
                .sr-rating-bar-fill {
                    animation: barGrow 1s ease forwards;
                }
                @keyframes barGrow {
                    from { width: 0; }
                    to   { width: 100%; }
                }

                @media (max-width: 900px) {
                    .sr-col-3 { display: none; }
                }
                @media (max-width: 560px) {
                    .sr-masonry { grid-template-columns: 1fr !important; }
                    .sr-col-3  { display: flex !important; }
                }
            `}</style>

            <section
                className="relative overflow-hidden bg-[#0F172A] dark:bg-[#020C1B] py-20 md:py-24 px-6"
                aria-labelledby="student-reviews-heading"
            >
                {/* Ghost watermark */}
                <div className="sr-watermark" aria-hidden="true">"</div>

                {/* Blue glow top-right */}
                <div aria-hidden="true" className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle, rgba(26,86,219,0.10) 0%, transparent 65%)" }} />
                {/* OrangeRed glow bottom-left */}
                <div aria-hidden="true" className="absolute -bottom-24 -left-16 w-[360px] h-[360px] rounded-full pointer-events-none z-0"
                    style={{ background: "radial-gradient(circle, rgba(239,69,35,0.07) 0%, transparent 65%)" }} />

                <div className="relative z-10 max-w-[1100px] mx-auto">

                    {/* ── Header — split layout ── */}
                    <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
                        <div>
                            {/* Eyebrow */}
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase text-blue-400 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-blue-500">
                                Student Voices
                            </div>
                            <h2
                                id="student-reviews-heading"
                                className="font-serif font-bold text-slate-100 leading-[1.2]"
                                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
                            >
                                What Our Students<br />
                                <em className="italic text-[#EF4523]">Say About Us</em>
                            </h2>
                        </div>

                        {/* Rating summary — redesigned */}
                        <div
                            className="flex items-center gap-5 shrink-0 bg-white/[0.04] border border-blue-500/15 rounded-2xl px-6 py-4"
                            aria-label="Average rating 5 out of 5"
                        >
                            {/* Big number */}
                            <div className="font-serif text-[2.8rem] font-bold text-blue-300 leading-none">
                                5.0
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {/* Stars */}
                                <div className="flex gap-0.5" aria-hidden="true">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className="text-[#EF4523] text-[0.9rem]">★</span>
                                    ))}
                                </div>
                                {/* Label */}
                                <div className="text-[0.72rem] font-light text-slate-500 tracking-[0.05em]">
                                    {reviews.length} Google Reviews
                                </div>
                                {/* Rating bar */}
                                <div className="w-full h-0.5 bg-blue-900/50 rounded-full overflow-hidden">
                                    <div className="sr-rating-bar-fill h-full bg-[#EF4523] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Masonry columns ── */}
                    <div className="sr-masonry grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        {[col1, col2, col3].map((col, ci) => (
                            <div
                                key={ci}
                                className={`flex flex-col gap-4 ${ci === 2 ? "sr-col-3" : ""}`}
                            >
                                {col.map((review) => (
                                    <article
                                        key={review.author}
                                        className="sr-card relative overflow-hidden rounded-[18px] bg-white/[0.04] border border-blue-500/10 p-6"
                                    >
                                        {/* Ghost quote */}
                                        <div
                                            className="absolute top-3 right-4 font-serif text-[4rem] font-black leading-none text-blue-400/[0.07] pointer-events-none select-none"
                                            aria-hidden="true"
                                        >"</div>

                                        {/* Stars */}
                                        <div className="flex gap-0.5 mb-3" aria-label={`${review.rating} stars`}>
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <span key={i} className="text-[#EF4523] text-[0.78rem]">★</span>
                                            ))}
                                        </div>

                                        {/* Course tag */}
                                        <span className={`inline-block text-[9px] font-medium tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-full border mb-3 ${courseColors[review.course] ?? "bg-slate-500/15 text-slate-300 border-slate-500/20"}`}>
                                            {review.course}
                                        </span>

                                        {/* Review text */}
                                        <p className="text-[0.82rem] font-light text-slate-400 leading-[1.8]">
                                            {review.text}
                                        </p>

                                        {/* Author row */}
                                        <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-blue-500/[0.08]">
                                            {/* Avatar */}
                                            <div
                                                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-serif text-[0.85rem] font-semibold text-blue-300 bg-blue-500/15 border border-blue-500/20"
                                                aria-hidden="true"
                                            >
                                                {review.author.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-[0.82rem] font-medium text-slate-200">
                                                    {review.author}
                                                </div>
                                                <div className="flex items-center gap-1 mt-0.5 text-[0.7rem] font-light text-slate-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
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