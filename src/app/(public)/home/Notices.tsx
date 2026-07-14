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
    <section className="home-not-section" aria-labelledby="home-not-heading">

      {/* ── TOP BAR — Full width colored header ── */}
      <div className="home-not-topbar">
        <div className="home-not-topbar-inner">
          <div className="home-not-topbar-left">
            <span className="home-not-topbar-tag">
              <Bell size={13} strokeWidth={2} />
              Announcements
            </span>
            <h2 id="home-not-heading" className="home-not-topbar-title">
              Latest Notices
            </h2>
          </div>
          <Link href="/notices" className="home-not-viewall-btn">
            View All Notices
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* ── NOTICES GRID — Contained ── */}
      <div className="home-not-body">
        <div className="home-not-container">
          <div className="home-not-grid">
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
                className="home-not-card"
              >
                {/* Card Meta */}
                <div className="home-not-card-meta">
                  <span className="home-not-card-date">
                    <Calendar size={12} strokeWidth={2} />
                    {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {notice.category && (
                    <span className="home-not-card-cat">
                      <Tag size={10} strokeWidth={2} />
                      {notice.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="home-not-card-title">{notice.title}</h3>

                {/* Excerpt */}
                {notice.excerpt && (
                  <p className="home-not-card-excerpt">{notice.excerpt}</p>
                )}

                {/* Read More */}
                <span className="home-not-card-readmore">
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