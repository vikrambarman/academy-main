import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shivshakticomputer.in"),

  title: {
    default: "Shivshakti Computer Academy | Best Computer Institute",
    template: "%s | Shivshakti Computer Academy",
  },

  description:
    "Shivshakti Computer Academy offers professional computer courses, certifications, and skill development programs for students and professionals.",

  keywords: [
    "Shivshakti Computer Academy",
    "Computer Institute in Ambikapur",
    "Computer Courses",
    "Skill Development",
  ],

  authors: [{ name: "Shivshakti Computer Academy" }],

  openGraph: {
    type: "website",
    url: "https://www.shivshakticomputer.in",
    title: "Shivshakti Computer Academy",
    description:
      "Professional computer courses and certifications at Shivshakti Computer Academy.",
    images: ["/logo.png"],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shivshakti Computer Academy",
    description:
      "Best computer institute offering certified courses and training.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}