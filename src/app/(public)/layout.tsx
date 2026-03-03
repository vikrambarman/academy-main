import TopBar from "@/components/common/TopBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingWhatsapp from "@/components/common/FloatingWhatsapp";
import BreakingNotice from "@/components/common/BreakingNotice";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <TopBar />
            <BreakingNotice/>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingWhatsapp />
        </>
    );
}