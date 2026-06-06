import Link from "next/link";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

/**
 * Notices — Server Component (DB-backed).
 * Backend logic UNCHANGED — same connectDB + Notice query.
 * Only the markup/styling is cleaned to match the university look,
 * using your real CSS tokens (--bg-elevated, --border-color, etc.).
 */

async function getHomeNotices() {
  try {
    await connectDB();
    const notices = await Notice.find({ isActive: true, isPublished: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return JSON.parse(JSON.stringify(notices));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function Notices() {
  const notices = await getHomeNotices();
  if (!notices.length) return null;

  return (
    <>
      <section className="not-section" aria-labelledby="notices-heading">
        <div className="not-wrap">
          {/* Header */}
          <div className="not-header">
            <div>
              <div className="not-badge">
                <span className="not-badge-line" aria-hidden="true" />
                Announcements
              </div>
              <h2 id="notices-heading" className="not-title">
                Latest <span className="not-title-em">Notices</span>
              </h2>
            </div>

            <Link href="/notices" className="not-viewall">
              View All Notices
              <span className="not-viewall-arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Grid */}
          <div className="not-grid">
            {notices.map((notice: any) => (
              <Link key={notice._id} href={`/notices/${notice.slug}`} className="not-card">
                <div className="not-card-meta">
                  <span className="not-card-date">
                    {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {notice.category && (
                    <span className="not-card-cat">{notice.category}</span>
                  )}
                </div>

                <h3 className="not-card-title">{notice.title}</h3>
                <p className="not-card-excerpt">{notice.excerpt}</p>

                <span className="not-card-readmore" aria-hidden="true">
                  Read More <span className="not-card-arrow">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
/* ── NOTICES — Clean University style ── */
.not-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.not-wrap { position: relative; max-width: 1100px; margin: 0 auto; }

/* Header */
.not-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: var(--space-6); margin-bottom: var(--space-10);
}
.not-badge {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.not-badge-line { width: 24px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.not-title {
  font-family: var(--font-display); font-size: clamp(1.6rem, 3.4vw, 2.25rem);
  font-weight: var(--font-weight-semibold); line-height: 1.2; letter-spacing: -0.015em; color: var(--text-primary);
}
.not-title-em { color: var(--color-primary-700); }
.not-viewall {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--border-color-dark); border-radius: var(--radius-md);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700); text-decoration: none; flex-shrink: 0;
  transition: border-color var(--transition-base);
}
.not-viewall:hover { border-color: var(--color-primary-600); }
.not-viewall-arrow { transition: transform var(--transition-fast); }
.not-viewall:hover .not-viewall-arrow { transform: translateX(3px); }

/* Grid */
.not-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-5); }
@media (min-width: 768px) { .not-grid { grid-template-columns: repeat(3, 1fr); } }

.not-card {
  position: relative;
  display: flex; flex-direction: column; text-decoration: none;
  padding: var(--space-6);
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary-600);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-base);
}
.not-card:hover { border-color: var(--color-gray-300); }
.not-card-meta { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); margin-bottom: var(--space-4); }
.not-card-date { font-size: var(--font-size-xs); color: var(--text-tertiary); }
.not-card-cat {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-medium);
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 2px var(--space-3); border-radius: var(--radius-full); white-space: nowrap;
  color: var(--color-primary-700); background: var(--color-primary-50); border: 1px solid var(--border-color);
}
.not-card-title {
  font-family: var(--font-display); font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold); line-height: 1.35; margin-bottom: var(--space-2);
  color: var(--text-primary);
}
.not-card-excerpt {
  font-size: var(--font-size-sm); line-height: 1.65; flex: 1;
  color: var(--text-secondary); margin: 0;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.not-card-readmore {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);
  margin-top: var(--space-4); color: var(--color-primary-600);
}
.not-card-arrow { transition: transform var(--transition-fast); }
.not-card:hover .not-card-arrow { transform: translateX(3px); }

@media (max-width: 480px) {
  .not-section { padding: var(--space-16) var(--space-4); }
  .not-viewall { width: 100%; justify-content: center; }
}
      `}</style>
    </>
  );
}
