import Image from "next/image";

const reviews = [
    {
        author: "Tarang Tamboli",
        rating: 5,
        text:
            "I am very satisfied with this computer centre. Vikram sir have excellent teaching methods — they explain every concept in a simple and clear way and give individual attention to each student. The coaching environment is very good for learning — it’s peaceful, disciplined, and all doubts are properly solved. Both theory and practical skills are well covered. If you want to learn computers seriously, this is the right place. Highly recommended!",
        profile: "/reviews/amit.jpg"
    },
    {
        author: "Gaurav Gupta",
        rating: 5,
        text:
            "Vikram sir is so experience and so full of knowledge person. this institute is so well you gonna learn more things then you think with Vikram sir he is so polite and so helping person with others.",
        profile: "/reviews/pooja.jpg"
    },
    {
        author: "Ayush Mishra",
        rating: 5,
        text:
            "I am currently studying at Shiv Shakti Computer Academy, Ambikapur, and my experience here is really good. The teachers explain everything very clearly from the basics and give attention to every student. The lab facilities are well-maintained and we get enough time for practicals. Learning here has given me a lot of confidence in computers. Truly, for beginners, this is the best computer academy in Ambikapur.",
        profile: "/reviews/sunita.jpg"
    },
    {
        author: "Pankaj Sahu",
        rating: 5,
        text:
            "Jay shree ram sir! Vikram sir se maine networking ka course kiya hai bahut hi acha padhate hai or sir ka behaviour bhi acha hai , best education institute. Join Shivshakti for better education",
        profile: "/reviews/rohit.jpg"
    },
    {
        author: "Ram Sahu",
        rating: 5,
        text:
            "The knowledge and behaviour of vikram sir is awesome and the way he teaches makes concepts easy to understand thankyou vikram sir for teaching us and for your all  support .",
        profile: "/reviews/pooja.jpg"
    },
    {
        author: "Nikita Haldar",
        rating: 5,
        text:
            "This computer class is very good, in this computer class you get all the facilities of all the computers. You can never be bored in this class. Yes, the head is very good.",
        profile: "/reviews/pooja.jpg"
    },
    {
        author:"Dinesh Kumar Patel",
        rating: 5,
        text:
            "Sir aapka bat chit or behaviour mast lga . Aapka knowledge or experience is field me great h",
        profile: "/reviews/pooja.jpg"
    },
    {
        author:"A. Gautam",
        rating: 5,
        text:
            "faculty is very good, response and all, especially vikram sir",
        profile: "/reviews/pooja.jpg"
    },
    {
        author:"Sonali Mistri",
        rating: 5,
        text:
            "Come here to learn computers, honestly I enjoy learning this so much. Big thums up to Shivshakti Computer Academy",
        profile: "/reviews/pooja.jpg"
    },
]

export default function StudentReviews() {
    return (
        <section
            className="bg-gray-50"
            aria-labelledby="student-reviews-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2
                        id="student-reviews-heading"
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
                    >
                        Student Reviews & Testimonials
                    </h2>

                    <p className="mt-4 text-gray-600 text-base md:text-lg">
                        Genuine feedback from students and parents of Shivshakti Computer Academy.
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-md transition"
                        >
                            {/* Stars */}
                            <div className="flex mb-4">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <span key={i} className="text-yellow-500 text-lg">
                                        ★
                                    </span>
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-600 text-sm leading-relaxed">
                                “{review.text}”
                            </p>

                            {/* Author */}
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {review.author}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Verified Google Review
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}