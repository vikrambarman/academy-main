import Link from "next/link";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

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

export default async function BreakingNotice() {
  const notice = await getLatestNotice();
  if (!notice) return null;

  return (
    <>
      <style>{breakingNoticeStyles}</style>
      <div className="breaking-notice-wrapper">
        <div className="breaking-notice-container">
          
          {/* Breaking Label */}
          <div className="breaking-label-wrapper">
            <div className="breaking-label-content">
              <span className="breaking-pulse"></span>
              <span className="breaking-text">UPDATES</span>
            </div>
            <div className="breaking-label-angle"></div>
          </div>

          {/* Scrolling Text */}
          <div className="breaking-marquee-wrapper">
            <div className="breaking-marquee">
              <Link 
                href={`/notices/${notice.slug}`}
                className="breaking-marquee-link"
              >
                <span className="breaking-marquee-title">
                  {notice.title} —{" "}
                  <span className="breaking-marquee-excerpt">
                    {notice.excerpt || "Visit the notice board for more details."}
                  </span>
                </span>
                
                <span className="breaking-marquee-cta">
                  READ FULL NOTICE →
                </span>
                
                <span className="breaking-marquee-spacer"></span>
              </Link>
            </div>
            
            {/* Fade Edges */}
            <div className="breaking-fade breaking-fade-left"></div>
            <div className="breaking-fade breaking-fade-right"></div>
          </div>
        </div>
      </div>
    </>
  );
}

const breakingNoticeStyles = `
/* ==========================================
   BREAKING NOTICE STYLES
   ========================================== */

.breaking-notice-wrapper {
  position: relative;
  z-index: 50;
  width: 100%;
  overflow: hidden;
  background: var(--color-gray-900);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.breaking-notice-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 44px;
}

/* Breaking Label */
.breaking-label-wrapper {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 var(--space-5);
  background: var(--color-danger);
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.4);
}

.breaking-label-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.breaking-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-white);
  animation: breakingPulse 2s infinite;
}

@keyframes breakingPulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.breaking-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-white);
}

.breaking-label-angle {
  position: absolute;
  top: 0;
  right: -12px;
  height: 100%;
  width: 16px;
  background: var(--color-danger);
  transform: skewX(-15deg);
}

/* Marquee */
.breaking-marquee-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 100%;
  background: var(--color-gray-800);
}

.breaking-marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.breaking-marquee:hover {
  animation-play-state: paused;
}

.breaking-marquee-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-100);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breaking-marquee-link:hover {
  color: var(--color-accent-400);
}

.breaking-marquee-title {
  margin-left: var(--space-8);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.breaking-marquee-excerpt {
  font-weight: var(--font-weight-normal);
  text-transform: none;
  color: var(--color-gray-300);
  margin-left: var(--space-2);
}

.breaking-marquee-cta {
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-400);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.breaking-marquee-spacer {
  display: inline-block;
  width: 150px;
}

/* Fade Edges */
.breaking-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  z-index: 10;
  pointer-events: none;
}

.breaking-fade-left {
  left: 0;
  background: linear-gradient(to right, var(--color-gray-800), transparent);
}

.breaking-fade-right {
  right: 0;
  background: linear-gradient(to left, var(--color-gray-800), transparent);
}

/* Mobile */
@media (max-width: 640px) {
  .breaking-notice-container {
    height: 40px;
  }

  .breaking-text {
    font-size: 10px;
  }

  .breaking-marquee-link {
    font-size: var(--font-size-xs);
  }
}
`;