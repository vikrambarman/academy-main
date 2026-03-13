import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shivshakticomputer.in"),

  title: {
    default:
      "Shivshakti Computer Academy | Best Computer Institute in Ambikapur",
    template: "%s | Shivshakti Computer Academy",
  },

  description:
    "Shivshakti Computer Academy offers professional computer courses, certifications, and skill development programs in Ambikapur, Chhattisgarh.",

  keywords: [
    "Shivshakti Computer Academy",
    "Computer Institute in Ambikapur",
    "Computer Academy in Ambikapur",
    "Best Computer Institute",
    "Computer Academy",
    "Computer Courses",
    "Skill Development",
    "Computer Training in Chhattisgarh",
  ],

  authors: [{ name: "Shivshakti Computer Academy" }],
  creator: "Shivshakti Computer Academy",
  publisher: "Shivshakti Computer Academy",
  category: "Education",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.shivshakticomputer.in",
    siteName: "Shivshakti Computer Academy",
    title: "Shivshakti Computer Academy",
    description:
      "Professional computer courses and certifications in Ambikapur, Chhattisgarh.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Shivshakti Computer Academy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shivshakti Computer Academy",
    description:
      "Best computer institute offering certified courses and training in Ambikapur.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://www.shivshakticomputer.in",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

/* ✅ Move themeColor here */
export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                name: "Shivshakti Computer Academy",
                url: "https://www.shivshakticomputer.in",
                logo: "https://www.shivshakticomputer.in/logo.png",
                address: {
                  "@type": "PostalAddress",
                  streetAddress:
                    "1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras Road, Phunderdihari",
                  addressLocality: "Ambikapur",
                  addressRegion: "Chhattisgarh",
                  postalCode: "497001",
                  addressCountry: "IN",
                },
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+91 7477036832",
                    contactType: "customer service",
                    areaServed: "IN",
                  },
                  {
                    "@type": "ContactPoint",
                    telephone: "+91 9009087883",
                    contactType: "WhatsApp support",
                    areaServed: "IN",
                  },
                ],
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}