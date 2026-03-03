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


export const metadata: Metadata = {
  title:
    "Best Computer Training Institute in Ambikapur | DCA, PGDCA, Tally, ADCA, Typing, Web & App Development Courses",
  description:
    "Shivshakti Computer Academy is the best computer institute in Ambikapur, Surguja offering DCA, PGDCA, ADCA, Tally, CCC, Typing, Web Development, App Development, Software Development, Programmings, Networking, Linux, Cloud Computing and professional computer courses with government-recognized certifications.",
  alternates: {
    canonical: "https://www.shivshakticomputer.in",
  },
  openGraph: {
    title:
      "Best Computer Institute in Ambikapur | Shivshakti Computer Academy",
    description:
      "Join Shivshakti Computer Academy in Ambikapur for DCA, PGDCA, ADCA, Tally and job-oriented computer training programs.",
    url: "https://www.shivshakticomputer.in",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <CoursesPreview />
      <HowItWorks />
      <PartnersAndCertifications />
      <WhyChooseUs />
      <StudentReviews />
      <VisitUs />
      <Notices />
      <FAQSection />
      <HomeCTA />
    </>
  );
}