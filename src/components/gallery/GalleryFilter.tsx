"use client";

interface Props {
    active: string;
    setActive: (value: string) => void;
    categories: string[];
}

export default function GalleryFilter({
    active,
    setActive,
    categories,
}: Props) {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat) => {
                const isActive = active === cat;

                return (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                ? "bg-black text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                );
            })}
        </div>
    );
}