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
    const notice = await Notice.findOne({
      slug,
      isActive: true,
      isPublished: true,
    }).lean();
    if (!notice) return null;
    await Notice.updateOne(
      { _id: (notice as any)._id },
      { $inc: { views: 1 } }
    );
    return JSON.parse(JSON.stringify(notice));
  } catch (error) {
    console.error("DB FETCH ERROR:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const notice = await getNotice(slug);
  if (!notice) return { title: "Notice Not Found" };
  return {
    title: `${notice.title} | Shivshakti Computer Academy`,
    description: notice.content?.slice(0, 155),
    alternates: {
      canonical: `https://www.shivshakticomputer.in/notices/${notice.slug}`,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NoticeDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
            author: {
              "@type": "Organization",
              name: "Shivshakti Computer Academy",
            },
          }),
        }}
      />

      <main className="nd-root">
        {/* ── BANNER ── */}
        <section className="nd-banner" aria-labelledby="notice-title">
          <div className="nd-wrap nd-wrap-inner">
            <nav className="nd-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="nd-breadcrumb__link">
                Home
              </Link>
              <span className="nd-breadcrumb__sep" aria-hidden="true">
                ›
              </span>
              <Link href="/notices" className="nd-breadcrumb__link">
                Notices
              </Link>
              <span className="nd-breadcrumb__sep" aria-hidden="true">
                ›
              </span>
              <span className="nd-breadcrumb__current">{notice.title}</span>
            </nav>

            <div className="nd-meta">
              <span className="nd-meta__date">
                {formatDate(notice.createdAt)}
              </span>
              {notice.category && (
                <span className="nd-meta__cat">{notice.category}</span>
              )}
            </div>

            <h1 id="notice-title" className="nd-banner__title">
              {notice.title}
            </h1>
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
                <div className="nd-back__title">
                  All Notices &amp; Announcements
                </div>
              </div>
              <div className="nd-back__arrow" aria-hidden="true">←</div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}