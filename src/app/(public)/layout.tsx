import TopBar from "@/components/common/TopBar";
import Footer from "@/components/common/Footer";
import FloatingWhatsapp from "@/components/common/FloatingWhatsapp";
import BreakingNotice from "@/components/common/BreakingNotice";
import Navbar from "@/components/Navbar/Navbar";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <style>{publicLayoutStyles}</style>

            {/* Top Bar */}
            <TopBar />

            {/* Sticky Wrapper - ONLY CHANGE */}
            <div className="sticky-header-group">
                <BreakingNotice />
                <Navbar />
            </div>

            {/* Main Content */}
            <main className="public-main">
                {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Actions */}
            <FloatingWhatsapp />
        </>
    );
}

const publicLayoutStyles = `
/* ==========================================
   PUBLIC LAYOUT STYLES
   ========================================== */

/* NEW: Sticky Header Group */
.sticky-header-group {
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Main Content - UNCHANGED */
.public-main {
  min-height: calc(100vh - 200px);
  position: relative;
  overflow-x: hidden;
}

/* Smooth Page Transitions - UNCHANGED */
.public-main > * {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Skip to Main Content (Accessibility) - UNCHANGED */
.skip-to-main {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--color-primary-600);
  color: var(--color-white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  z-index: 9999;
  transition: top var(--transition-fast);
}

.skip-to-main:focus {
  top: var(--space-4);
  outline: 2px solid var(--color-white);
  outline-offset: 2px;
}
`;