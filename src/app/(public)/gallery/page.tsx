import GalleryGrid from "@/components/gallery/GalleryGrid";


export const metadata = {
    title: "Gallery | Shivshakti Computer Academy",
    description:
        "Explore classrooms, labs, and student activities at Shivshakti Computer Academy in Ambikapur.",
};

export default function GalleryPage() {
    return (
        <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-semibold text-gray-900">
                        Academy Gallery
                    </h2>

                    <p className="mt-6 text-gray-600 text-lg">
                        Explore our classrooms, labs, and student activities.
                    </p>
                </div>

                <div className="mt-20">
                    <GalleryGrid />
                </div>

            </div>
        </section>
    );
}