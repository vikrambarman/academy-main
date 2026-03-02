"use client";

import { useState } from "react";
import Image from "next/image";
import GalleryFilter from "./GalleryFilter";

const IMAGES = [
    { src: "/gallery/classrooms/classroom1.jpg", category: "classrooms" },
    { src: "/gallery/classrooms/classroom2.jpg", category: "classrooms" },
    { src: "/gallery/events/event1.jpg", category: "events" },
    { src: "/gallery/events/event2.jpg", category: "events" },
    { src: "/gallery/certificates/certificate1.jpg", category: "certificates" },
];

const CATEGORIES = ["all", "classrooms", "events", "certificates"];

export default function GalleryGrid() {
    const [active, setActive] = useState("all");
    const [selected, setSelected] = useState<string | null>(null);

    const filtered =
        active === "all"
            ? IMAGES
            : IMAGES.filter((img) => img.category === active);

    return (
        <>
            {/* Filter */}
            <GalleryFilter
                active={active}
                setActive={setActive}
                categories={CATEGORIES}
            />

            {/* Masonry Layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">

                {filtered.map((img, index) => (
                    <div
                        key={index}
                        className="relative break-inside-avoid rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                        onClick={() => setSelected(img.src)}
                    >
                        <Image
                            src={img.src}
                            alt="Gallery image"
                            width={600}
                            height={800}
                            className="w-full h-auto object-cover group-hover:scale-105 transition duration-700"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-6">
                            <span className="text-white text-sm font-medium capitalize">
                                {img.category}
                            </span>
                        </div>
                    </div>
                ))}

            </div>

            {/* Lightbox */}
            {selected && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    onClick={() => setSelected(null)}
                >
                    <div className="relative w-full max-w-5xl h-[85vh]">
                        <Image
                            src={selected}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}