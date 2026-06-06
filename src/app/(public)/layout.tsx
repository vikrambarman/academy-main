import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";
import Header from "@/components/Header/Header";
import Footer from "@/components/common/Footer";
import FloatingWhatsapp from "@/components/common/FloatingWhatsapp";
import ScrollToTop from "@/components/common/scrollToTop";
import EnquiryPopup from "./home/EnquiryPopup";


async function getLatestNotice() {
  try {
    await connectDB();
    const notice = await Notice.findOne({ isActive: true, isPublished: true })
      .sort({ createdAt: -1 })
      .lean();
    return notice ? JSON.parse(JSON.stringify(notice)) : null;
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const latestNotice = await getLatestNotice();

  return (
    // ✅ STICKY FIX: wrapper par koi overflow nahi.
    //    Pehle inline minHeight/height tha — wo theek hai, par overflow
    //    kabhi mat dena yahan, warna Header (sticky) tak nahi pahunchega.
    <div className="public-shell">
      {/* Header — sticky (Header.module.css me position: sticky) */}
      <Header latestNotice={latestNotice} />

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
