import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";
import Header from "@/components/Header/Header";
import Footer from "@/components/common/Footer";
import FloatingWhatsapp from "@/components/common/FloatingWhatsapp";
import ScrollToTop from "@/components/common/scrollToTop";
import EnquiryPopup from "./home/EnquiryPopup";


async function getTopNotices() {
  try {
    await connectDB();
    const notices = await Notice.find({ isActive: true, isPublished: true })
      .sort({ createdAt: -1 })
      .limit(5) // Top 5 notices
      .lean();
    return notices ? JSON.parse(JSON.stringify(notices)) : [];
  } catch {
    return [];
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notices = await getTopNotices();
const latestNotice = notices[0] || null; // Backward compatibility


  return (
    // ✅ STICKY FIX: wrapper par koi overflow nahi.
    //    Pehle inline minHeight/height tha — wo theek hai, par overflow
    //    kabhi mat dena yahan, warna Header (sticky) tak nahi pahunchega.
    <div className="public-shell">
      {/* Header — sticky (Header.module.css me position: sticky) */}
      <Header notices={notices} latestNotice={latestNotice} />

      {/* Main content */}
      <main className={`public-main ${latestNotice ? "has-breaking-news" : ""}`}>
        {children}
      </main>

      <Footer />

      <FloatingWhatsapp />

      {/* Scroll-to-top button (appears after scrolling down) */}
      <ScrollToTop />

      {/* Auto-opening enquiry popup (computer courses + UGC degrees).
          Hata dena ho to ye line remove kar dein. */}
      <EnquiryPopup />
    </div>
  );
}
