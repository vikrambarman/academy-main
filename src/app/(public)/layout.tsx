import TopBar from "@/app/(public)/layout/TopBar";
import Navbar from "@/app/(public)/layout/Navbar";
import Footer from "@/app/(public)/layout/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <TopBar />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}