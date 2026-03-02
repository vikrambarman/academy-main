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
import Script from "next/script";


export const metadata: Metadata = {
  title:
    "Best Computer Institute & Training Center in Ambikapur",
  description:
    "Shivshakti Computer Academy is a leading computer training institute in Ambikapur offering professional computer courses and career-focused certifications.",
};

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Shivshakti Computer Academy",
            url: "https://www.shivshakticomputer.in",
            logo: "https://www.shivshakticomputer.in/logo.png",
            areaServed: {
              "@type": "Place",
              name: "Ambikapur",
            },
          }),
        }}
      />
      <HeroSection />
      <TrustSection/>
      <CoursesPreview/>
      <HowItWorks/>
      <PartnersAndCertifications/>
      <WhyChooseUs/>
      <StudentReviews/>
      <VisitUs/>
      <Notices/>
      <FAQSection/>
      <HomeCTA/>
    </>
  );
}