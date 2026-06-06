// ============================================================
// app/(public)/notices/[slug]/page.tsx  (Server Component)
// ============================================================
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

export const revalidate = 30;

async function getNotice(slug: string) {
  try {
    await connectDB();
    const notice = await Notice.findOne({ slug, isActive: true, isPublished: true }).lean();
    if (!notice) return null;
    await Notice.updateOne({ _id: (notice as any)._id }, { $inc: { views: 1 } });
    return JSON.parse(JSON.stringify(notice));
  } catch (error) {
    console.error("DB FETCH ERROR:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const notice = await getNotice(slug);
  if (!notice) return { title: "Notice Not Found" };
  return {
    title: `${notice.title} | Shivshakti Computer Academy`,
    description: notice.content?.slice(0, 155),
    alternates: { canonical: `https://www.shivshakticomputer.in/notices/${notice.slug}` },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function NoticeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const notice = await getNotice(slug);
  if (!notice) return notFound();

  return (
    <>
      <Script
        id="notice-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: notice.title,
            datePublished: notice.createdAt,
            author: { "@type": "Organization", name: "Shivshakti Computer Academy" },
          }),
        }}
      />

      <main className="nd-root">
        {/* ── BANNER (solid ink-blue) ── */}
        <section className="nd-banner" aria-labelledby="notice-title">
          <div className="nd-wrap">
            <nav className="nd-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="nd-breadcrumb__link">Home</Link>
              <span className="nd-breadcrumb__sep" aria-hidden="true">›</span>
              <Link href="/notices" className="nd-breadcrumb__link">Notices</Link>
              <span className="nd-breadcrumb__sep" aria-hidden="true">›</span>
              <span className="nd-breadcrumb__current">{notice.title}</span>
            </nav>

            <div className="nd-meta">
              <span className="nd-meta__date">{formatDate(notice.createdAt)}</span>
              {notice.category && <span className="nd-meta__cat">{notice.category}</span>}
            </div>

            <h1 id="notice-title" className="nd-banner__title">{notice.title}</h1>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <section className="nd-content-section" aria-label="Notice content">
          <div className="nd-wrap nd-content-wrap">
            <article className="nd-article">
              <div className="nd-article__rule" aria-hidden="true" />
              <div className="nd-article__body">{notice.content}</div>
            </article>

            <Link href="/notices" className="nd-back">
              <div>
                <div className="nd-back__label">Back to</div>
                <div className="nd-back__title">All Notices &amp; Announcements</div>
              </div>
              <div className="nd-back__arrow" aria-hidden="true">←</div>
            </Link>
          </div>
        </section>
      </main>

      <style>{`
/* ── NOTICE DETAIL — Clean University style ── */
.nd-root { background: var(--bg-page); min-height: 100vh; }
.nd-wrap { max-width: 800px; margin: 0 auto; padding: 0 var(--space-6); }

/* Banner — solid ink-blue (was dark + glow + dots) */
.nd-banner { position: relative; padding: var(--space-12) 0 var(--space-10); background: var(--color-primary-700); }
.nd-breadcrumb { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-5); font-size: var(--font-size-xs); }
.nd-breadcrumb__link { color: rgba(255,255,255,0.6); text-decoration: none; transition: color var(--transition-fast); }
.nd-breadcrumb__link:hover { color: #fff; }
.nd-breadcrumb__sep { color: rgba(255,255,255,0.4); }
.nd-breadcrumb__current { color: rgba(255,255,255,0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 280px; }
.nd-meta { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-4); }
.nd-meta__date { font-size: var(--font-size-sm); color: rgba(255,255,255,0.6); }
.nd-meta__cat { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; border-radius: var(--radius-full); color: var(--color-primary-800); background: var(--color-accent-400, #c68a52); }
.nd-banner__title { font-family: var(--font-display); font-size: clamp(1.6rem, 4vw, 2.25rem); font-weight: var(--font-weight-semibold); color: #fff; line-height: 1.2; letter-spacing: -0.01em; margin: 0; }

/* Content */
.nd-content-section { padding: var(--space-12) 0 var(--space-24); }
.nd-article {
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); padding: var(--space-10) var(--space-10); margin-bottom: var(--space-5);
}
.nd-article__rule { width: 48px; height: 2px; background: var(--color-accent-500); border-radius: 2px; margin-bottom: var(--space-6); }
.nd-article__body { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.9; white-space: pre-line; }

/* Back card — solid ink-blue */
.nd-back {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
  text-decoration: none; border-radius: var(--radius-lg); padding: var(--space-5) var(--space-6);
  background: var(--color-primary-700); transition: background var(--transition-base);
}
.nd-back:hover { background: var(--color-primary-800); }
.nd-back__label { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 2px; }
.nd-back__title { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: #fff; }
.nd-back__arrow {
  width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: #fff;
  transition: transform var(--transition-fast);
}
.nd-back:hover .nd-back__arrow { transform: translateX(-3px); }

@media (max-width: 480px) {
  .nd-banner { padding: var(--space-10) 0 var(--space-8); }
  .nd-content-section { padding: var(--space-10) 0 var(--space-16); }
  .nd-article { padding: var(--space-6); }
}
      `}</style>
    </>
  );
}
