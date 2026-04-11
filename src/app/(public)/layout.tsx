import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";
import Header from "@/components/Header/Header";
import Footer from "@/components/common/Footer";
import FloatingWhatsapp from "@/components/common/FloatingWhatsapp";

async function getLatestNotice() {
    try {
        await connectDB();
        const notice = await Notice.findOne({ 
            isActive: true, 
            isPublished: true 
        })
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
        <div style={{ minHeight: '100vh', height: 'auto' }}>
            {/* Header Component */}
            <Header latestNotice={latestNotice} />

            {/* Main Content - Add class conditionally */}
            <main className={`public-main ${latestNotice ? 'has-breaking-news' : ''}`}>
                {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Actions */}
            <FloatingWhatsapp />
        </div>
    );
}