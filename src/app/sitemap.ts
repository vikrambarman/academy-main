import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.shivshakticomputer.in";

  try {
    // Fetch courses
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/courses`,
      { 
        cache: "no-store",
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }

    const { data } = await res.json();

    const courseUrls: MetadataRoute.Sitemap = data.map((course: any) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: new Date(course.updatedAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.95,
      },
      {
        url: `${baseUrl}/notices`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/gallery`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${baseUrl}/faq`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/verify-certificate`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.4,
      },
    ];

    return [...staticPages, ...courseUrls];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    
    // Return static pages only if courses fetch fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
    ];
  }
}