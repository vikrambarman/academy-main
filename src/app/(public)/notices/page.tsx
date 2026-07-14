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
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
                Notices &amp;{" "}
                <span className="nt-hero__title-em">Updates</span>
              </h1>
              <div className="nt-hero__right">
                <p className="nt-hero__desc">
                  Admission notices, exam schedules and important updates from
                  the academy.
                </p>
                {notices.length > 0 && (
                  <div className="nt-hero__count">
                    <span
                      className="nt-hero__count-dot"
                      aria-hidden="true"
                    />
                    {notices.length} active notice
                    {notices.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── LIST ── */}
        <section className="nt-body" aria-label="Notices list">
          <div className="nt-wrap">
            {notices.length === 0 ? (
              <div className="nt-empty">
                <div className="nt-empty__title">
                  No notices at the moment
                </div>
                <div className="nt-empty__text">
                  Check back soon for updates and announcements.
                </div>
              </div>
            ) : (
              <div className="nt-list">
                {notices.map((notice: any) => (
                  <Link
                    key={notice._id}
                    href={`/notices/${notice.slug}`}
                    className="nt-row"
                  >
                    <span className="nt-row__bar" aria-hidden="true" />
                    <div className="nt-row__content">
                      <div className="nt-row__meta">
                        <span className="nt-row__date">
                          {formatDate(notice.createdAt)}
                        </span>
                        {notice.category && (
                          <span className="nt-row__cat">
                            {notice.category}
                          </span>
                        )}
                      </div>
                      <h2 className="nt-row__title">{notice.title}</h2>
                      {notice.excerpt && (
                        <p className="nt-row__excerpt">{notice.excerpt}</p>
                      )}
                    </div>
                    <span className="nt-row__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}