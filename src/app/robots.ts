import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/courses", "/about", "/contact", "/notices"],
        disallow: [
          "/dashboard",
          "/api",
          "/_next",
          "/admin",
          "/student",
          "/teacher",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/courses/*", "/about", "/contact", "/notices/*"],
        disallow: ["/dashboard/*", "/api/*"],
      },
    ],
    sitemap: "https://www.shivshakticomputer.in/sitemap.xml",
    host: "https://www.shivshakticomputer.in",
  };
}