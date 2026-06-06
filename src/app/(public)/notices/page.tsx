// ============================================================
// app/(public)/notices/page.tsx  (Server Component)
// ============================================================
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Latest Notices & Announcements | Shivshakti Computer Academy Ambikapur",
  description:
    "Check latest admission updates, exam notices and announcements from Shivshakti Computer Academy Ambikapur.",
  alternates: { canonical: "https://www.shivshakticomputer.in/notices" },
};

async function getNotices() {
  try {
    await connectDB();
    const notices = await Notice.find({ isActive: true, isPublished: true })
      .sort({ createdAt: -1 })
      .select("-content")
      .lean();
    return JSON.parse(JSON.stringify(notices));
  } catch (error) {
    console.error("DB FETCH ERROR:", error);
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <>
      <Script
        id="notices-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: notices.map((notice: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://www.shivshakticomputer.in/notices/${notice.slug}`,
              name: notice.title,
            })),
          }),
        }}
      />

      <main className="nt-root">
        {/* ── HERO ── */}
        <section className="nt-hero" aria-labelledby="notices-hero-heading">
          <div className="nt-wrap nt-hero__inner">
            <div className="nt-hero__eyebrow">
              <span className="nt-hero__eyebrow-line" aria-hidden="true" />
              Announcements
            </div>
            <div className="nt-hero__layout">
              <h1 id="notices-hero-heading" className="nt-hero__title">
                Notices &amp; <span className="nt-hero__title-em">Updates</span>
              </h1>
              <div className="nt-hero__right">
                <p className="nt-hero__desc">
                  Admission notices, exam schedules and important updates from the academy.
                </p>
                {notices.length > 0 && (
                  <div className="nt-hero__count">
                    <span className="nt-hero__count-dot" aria-hidden="true" />
                    {notices.length} active notice{notices.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── LIST ── */}
        <section className="nt-body" aria-label="Notices list">
          <div className="nt-wrap nt-body__inner">
            {notices.length === 0 ? (
              <div className="nt-empty">
                <div className="nt-empty__title">No notices at the moment</div>
                <div className="nt-empty__text">Check back soon for updates and announcements.</div>
              </div>
            ) : (
              <div className="nt-list">
                {notices.map((notice: any) => (
                  <Link key={notice._id} href={`/notices/${notice.slug}`} className="nt-row">
                    <span className="nt-row__bar" aria-hidden="true" />
                    <div className="nt-row__content">
                      <div className="nt-row__meta">
                        <span className="nt-row__date">{formatDate(notice.createdAt)}</span>
                        {notice.category && <span className="nt-row__cat">{notice.category}</span>}
                      </div>
                      <h2 className="nt-row__title">{notice.title}</h2>
                      {notice.excerpt && <p className="nt-row__excerpt">{notice.excerpt}</p>}
                    </div>
                    <span className="nt-row__arrow" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <style>{`
/* ── NOTICES LIST — Clean University style ── */
.nt-root { background: var(--bg-page); min-height: 100vh; }
.nt-wrap { max-width: 1100px; margin: 0 auto; padding: 0 var(--space-6); }

.nt-hero { position: relative; padding: var(--space-20) 0 var(--space-12); background: var(--bg-page); border-bottom: 1px solid var(--border-color); }
.nt-hero__inner { position: relative; }
.nt-hero__eyebrow { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3); }
.nt-hero__eyebrow-line { width: 24px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.nt-hero__layout { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-8); flex-wrap: wrap; }
.nt-hero__title { font-family: var(--font-display); font-size: clamp(1.75rem, 3.6vw, 2.5rem); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.2; letter-spacing: -0.015em; margin: 0; }
.nt-hero__title-em { font-style: normal; color: var(--color-primary-700); }
.nt-hero__right { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-3); }
.nt-hero__desc { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; max-width: 340px; text-align: right; margin: 0; }
.nt-hero__count { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); color: var(--color-primary-700); background: var(--color-primary-50); border: 1px solid var(--border-color); padding: var(--space-1) var(--space-4); border-radius: var(--radius-full); }
.nt-hero__count-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary-600); flex-shrink: 0; }

.nt-body { padding: var(--space-12) 0 var(--space-24); }

.nt-empty { text-align: center; padding: var(--space-16); border-radius: var(--radius-lg); background: var(--bg-elevated); border: 1px solid var(--border-color); }
.nt-empty__title { font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin-bottom: var(--space-2); }
.nt-empty__text { font-size: var(--font-size-sm); color: var(--text-tertiary); }

.nt-list { display: flex; flex-direction: column; border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; }
.nt-row {
  position: relative; display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-6);
  text-decoration: none; padding: var(--space-6) var(--space-8); background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-color); transition: background var(--transition-base);
}
.nt-row:last-child { border-bottom: none; }
.nt-row:hover { background: var(--bg-surface); }
.nt-row__bar { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--color-primary-600); transform: scaleY(0); transform-origin: top; transition: transform var(--transition-base); }
.nt-row:hover .nt-row__bar { transform: scaleY(1); }
.nt-row__content { flex: 1; min-width: 0; }
.nt-row__meta { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-3); }
.nt-row__date { font-size: var(--font-size-xs); color: var(--text-tertiary); }
.nt-row__cat { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 10px; border-radius: var(--radius-full); color: var(--color-primary-700); background: var(--color-primary-50); border: 1px solid var(--border-color); }
.nt-row__title { font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--text-primary); line-height: 1.3; margin-bottom: var(--space-2); letter-spacing: -0.01em; }
.nt-row__excerpt { font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.65; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.nt-row__arrow {
  width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  align-self: center; flex-shrink: 0; font-size: 1rem;
  background: var(--bg-page); border: 1px solid var(--border-color); color: var(--color-primary-600);
  transition: transform var(--transition-fast);
}
.nt-row:hover .nt-row__arrow { transform: translateX(3px); }

@media (max-width: 640px) {
  .nt-hero { padding: var(--space-16) 0 var(--space-10); }
  .nt-hero__layout { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .nt-hero__right { align-items: flex-start; }
  .nt-hero__desc { text-align: left; max-width: 100%; }
  .nt-body { padding: var(--space-10) 0 var(--space-16); }
  .nt-row { padding: var(--space-5); gap: var(--space-4); }
  .nt-row__arrow { display: none; }
}
      `}</style>
    </>
  );
}
