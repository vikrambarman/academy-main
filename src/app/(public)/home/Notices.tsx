import Link from "next/link";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";
import { Bell, ArrowRight, Calendar, Tag } from "lucide-react";

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
    <section className="not-section" aria-labelledby="not-heading">

      {/* ── TOP BAR — Full width colored header ── */}
      <div className="not-topbar">
        <div className="not-topbar-inner">
          <div className="not-topbar-left">
            <span className="not-topbar-tag">
              <Bell size={13} strokeWidth={2} />
              Announcements
            </span>
            <h2 id="not-heading" className="not-topbar-title">
              Latest Notices
            </h2>
          </div>
          <Link href="/notices" className="not-viewall-btn">
            View All Notices
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* ── NOTICES GRID — Contained ── */}
      <div className="not-body">
        <div className="not-container">
          <div className="not-grid">
            {notices.map((notice: {
              _id: string;
              slug: string;
              title: string;
              excerpt?: string;
              category?: string;
              createdAt: string;
            }) => (
              <Link
                key={notice._id}
                href={`/notices/${notice.slug}`}
                className="not-card"
              >
                {/* Card Meta */}
                <div className="not-card-meta">
                  <span className="not-card-date">
                    <Calendar size={12} strokeWidth={2} />
                    {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {notice.category && (
                    <span className="not-card-cat">
                      <Tag size={10} strokeWidth={2} />
                      {notice.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="not-card-title">{notice.title}</h3>

                {/* Excerpt */}
                {notice.excerpt && (
                  <p className="not-card-excerpt">{notice.excerpt}</p>
                )}

                {/* Read More */}
                <span className="not-card-readmore">
                  Read More
                  <ArrowRight size={14} strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}