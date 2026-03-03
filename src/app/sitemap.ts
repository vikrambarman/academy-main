import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/courses`,
        { cache: "no-store" }
    );

    const { data } = await res.json();

    const courseUrls = data.map((course: any) => ({
        url: `https://www.shivshakticomputer.in/courses/${course.slug}`,
        lastModified: new Date(),
    }));

    return [
        {
            url: "https://www.shivshakticomputer.in",
            lastModified: new Date(),
        },
        {
            url: "https://www.shivshakticomputer.in/about",
            lastModified: new Date(),
        },
        {
            url: "https://www.shivshakticomputer.in/contact",
            lastModified: new Date(),
        },
        {
            url: "https://www.shivshakticomputer.in/courses",
            lastModified: new Date(),
        },
        ...courseUrls,
    ];
}