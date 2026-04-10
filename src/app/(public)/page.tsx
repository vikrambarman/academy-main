import CoursesPreview from "@/app/(public)/home/CoursesPreview";
import FAQSection from "@/app/(public)/home/FAQSection";
import HomeCTA from "@/app/(public)/home/HomeCTA";
import HowItWorks from "@/app/(public)/home/HowItWorks";
import Notices from "@/app/(public)/home/Notices";
import HeroSection from "@/app/(public)/home/HeroSection";
import PartnersAndCertifications from "@/app/(public)/home/PartnersAndCertifications";
import StudentReviews from "@/app/(public)/home/StudentReviews";
import TrustSection from "@/app/(public)/home/TrustSection";
import VisitUs from "@/app/(public)/home/VisitUs";
import WhyChooseUs from "@/app/(public)/home/WhyChooseUs";
import type { Metadata } from "next";
import StudentBenefits from "./home/StudentBenefits";

export const revalidate = 30;

export const metadata: Metadata = {
  title:
    "Best Computer Training Institute in Ambikapur | DCA, PGDCA, Tally, ADCA, Typing, Web & App Development Courses",
  description:
    "Shivshakti Computer Academy is the best computer institute in Ambikapur, Surguja offering DCA, PGDCA, ADCA, Tally, CCC, Typing, Web Development, App Development, Software Development, Programming, Networking, Linux, Cloud Computing and professional computer courses with government-recognized certifications.",
  keywords: [
    "computer institute ambikapur",
    "best computer academy ambikapur",
    "DCA course ambikapur",
    "PGDCA ambikapur",
    "ADCA course",
    "Tally course ambikapur",
    "web development course",
    "app development training",
    "programming classes ambikapur",
    "computer training surguja",
    "IT courses chhattisgarh",
  ],
  alternates: {
    canonical: "https://www.shivshakticomputer.in",
  },
  openGraph: {
    title:
      "Best Computer Institute in Ambikapur | Shivshakti Computer Academy",
    description:
      "Join Shivshakti Computer Academy in Ambikapur for DCA, PGDCA, ADCA, Tally and job-oriented computer training programs with 100% placement assistance.",
    url: "https://www.shivshakticomputer.in",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Shivshakti Computer Academy - Best Computer Institute in Ambikapur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Computer Institute in Ambikapur",
    description:
      "Professional computer courses with government-recognized certifications.",
    images: ["/og-home.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section with CTA */}
      <HeroSection />

      {/* Trust Indicators */}
      <TrustSection />

      {/* Student Benefits */}
      <StudentBenefits/>

      {/* Featured Courses */}
      <CoursesPreview />

      {/* How It Works Process */}
      <HowItWorks />

      {/* Certifications & Partners */}
      <PartnersAndCertifications />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Student Testimonials */}
      <StudentReviews />

      {/* Visit Our Campus */}
      <VisitUs />

      {/* Latest Notices */}
      <Notices />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <HomeCTA />

      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.shivshakticomputer.in",
            name: "Shivshakti Computer Academy",
            image: "https://www.shivshakticomputer.in/og-home.jpg",
            description:
              "Leading computer training institute in Ambikapur offering professional courses in programming, web development, and IT skills.",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "1st Floor, Above Usha Matching Center, Near Babra Petrol Pump, Banaras Road, Phunderdihari",
              addressLocality: "Ambikapur",
              addressRegion: "Chhattisgarh",
              postalCode: "497001",
              addressCountry: "IN",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "150",
            },
            priceRange: "₹₹",
            telephone: "+91-7477036832",
            openingHours: "Mo-Sa 09:00-18:00",
          }),
        }}
      />
    </>
  );
}