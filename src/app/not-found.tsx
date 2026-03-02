import Link from "next/link";

export default function NotFound() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
            <div className="text-center max-w-xl">

                <p className="text-sm font-medium text-gray-500">
                    Error 404
                </p>

                <h1 className="mt-4 text-5xl font-semibold text-gray-900">
                    Page Not Found
                </h1>

                <p className="mt-6 text-gray-600">
                    The page you are looking for does not exist or may have been moved.
                    Please return to the homepage or explore other sections.
                </p>

                <div className="mt-10 flex justify-center gap-4">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Go to Homepage
                    </Link>

                    <Link
                        href="/courses"
                        className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
                    >
                        Browse Courses
                    </Link>
                </div>

            </div>
        </section>
    );
}