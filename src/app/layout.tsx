import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import { Inter, Poppins } from "next/font/google";

/* ==========================================
   FONT OPTIMIZATION
   ========================================== */

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
  fallback: ["system-ui", "arial"],
});

/* ==========================================
   METADATA
   ========================================== */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shivshakticomputer.in"),

  title: {
    default:
      "Shivshakti Computer Academy | Best Computer Institute in Ambikapur",
    template: "%s | Shivshakti Computer Academy",
  },

  description:
    "Shivshakti Computer Academy offers professional computer courses, certifications, and skill development programs in Ambikapur, Chhattisgarh. Join India's leading computer training institute.",

  keywords: [
    "Shivshakti Computer Academy",
    "Computer Institute in Ambikapur",
    "Computer Academy in Ambikapur",
    "Best Computer Institute",
    "Computer Academy",
    "Computer Courses",
    "Skill Development",
    "Computer Training in Chhattisgarh",
    "IT Certification",
    "Programming Classes",
    "Web Development Course",
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
    title: "Shivshakti Computer Academy | Best Computer Institute in Ambikapur",
    description:
      "Professional computer courses and certifications in Ambikapur, Chhattisgarh. Transform your career with expert-led training.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shivshakti Computer Academy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shivshakti Computer Academy",
    description:
      "Best computer institute offering certified courses and training in Ambikapur.",
    images: ["/og-image.jpg"],
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
    apple: "/apple-touch-icon.png",
  },

  verification: {
    google: "your-google-verification-code", // Add your actual code
  },
};

/* ==========================================
   VIEWPORT
   ========================================== */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

/* ==========================================
   ROOT LAYOUT COMPONENT
   ========================================== */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
      style={{ height: 'auto', minHeight: '100vh' }}
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body className="antialiased" suppressHydrationWarning
        style={{
          height: 'auto',
          minHeight: '100vh',
          overflowY: 'auto'
        }}>
        <ThemeProvider storageKey="sca-theme">
          {children}
          {/* <ChatWidget /> */}

          {/* Structured Data - Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                name: "Shivshakti Computer Academy",
                alternateName: "SCA Ambikapur",
                url: "https://www.shivshakticomputer.in",
                logo: "https://www.shivshakticomputer.in/logo.png",
                image: "https://www.shivshakticomputer.in/og-image.jpg",
                description:
                  "Professional computer training institute in Ambikapur offering certified courses in programming, web development, and IT skills.",
                address: {
                  "@type": "PostalAddress",
                  streetAddress:
                    "1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras Road, Phunderdihari",
                  addressLocality: "Ambikapur",
                  addressRegion: "Chhattisgarh",
                  postalCode: "497001",
                  addressCountry: "IN",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: "23.1186", // Add actual coordinates
                  longitude: "83.1958",
                },
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+91-7477036832",
                    contactType: "customer service",
                    areaServed: "IN",
                    availableLanguage: ["Hindi", "English"],
                  },
                  {
                    "@type": "ContactPoint",
                    telephone: "+91-9009087883",
                    contactType: "WhatsApp support",
                    areaServed: "IN",
                    availableLanguage: ["Hindi", "English"],
                  },
                ],
                sameAs: [
                  "https://www.facebook.com/shivshakticomputeracademy",
                  "https://www.instagram.com/shivshakticomputer07",
                  // Add more social profiles
                ],
              }),
            }}
          />

          {/* Breadcrumb Schema (will be added on pages) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Shivshakti Computer Academy",
                url: "https://www.shivshakticomputer.in",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://www.shivshakticomputer.in/courses?search={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}