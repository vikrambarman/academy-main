"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Link from "next/link";
import {
  Bell, BookOpen, CheckCheck,
  ChevronLeft, ChevronRight,
  Tag, Clock, ExternalLink,
} from "lucide-react";

/* ── Types ── */
interface Notice {
  _id:       string;
  title:     string;
  excerpt:   string;
  slug:      string;
  createdAt: string;
  category?: string;
  isRead:    boolean;
}

const LIMIT = 10;

/* Category color map — sp tokens use kar rahe hain */
const CATEGORY_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  exam:      { bg: "rgba(26,86,219,0.1)",  color: "var(--sp-accent2)", border: "rgba(26,86,219,0.2)"  },
  fee:       { bg: "rgba(239,68,68,0.1)",  color: "var(--sp-danger)",  border: "rgba(239,68,68,0.2)"  },
  holiday:   { bg: "rgba(34,197,94,0.1)",  color: "var(--sp-success)", border: "rgba(34,197,94,0.2)"  },
  result:    { bg: "rgba(245,158,11,0.1)", color: "var(--sp-warn)",    border: "rgba(245,158,11,0.2)" },
  admission: { bg: "rgba(168,85,247,0.1)", color: "#a855f7",           border: "rgba(168,85,247,0.2)" },
  general:   { bg: "var(--sp-hover)",      color: "var(--sp-subtext)", border: "var(--sp-border)"     },
};

function getCategoryStyle(cat?: string) {
  return (
    CATEGORY_COLORS[cat?.toLowerCase() ?? ""] ?? CATEGORY_COLORS.general
  );
}

/* ── Main component ── */
export default function StudentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [filter,  setFilter]  = useState<"all" | "unread" | "read">("all");
  const [marking, setMarking] = useState<string | null>(null);

  useEffect(() => {
    fetchWithAuth("/api/student/notices")
      .then((r) => r.json())
      .then((d) => setNotices(d?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    if (marking) return;
    setMarking(id);
    try {
      await fetchWithAuth(`/api/student/notices/${id}/read`, {
        method: "POST",
      });
      setNotices((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
    setMarking(null);
  };

  const markAllRead = async () => {
    for (const n of notices.filter((n) => !n.isRead)) {
      await fetchWithAuth(`/api/student/notices/${n._id}/read`, {
        method: "POST",
      }).catch(() => {});
    }
    setNotices((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  /* Derived state */
  const filtered = notices.filter((n) =>
    filter === "all"    ? true :
    filter === "unread" ? !n.isRead :
                          n.isRead
  );
  const totalPages  = Math.ceil(filtered.length / LIMIT);
  const paginated   = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const unreadCount = notices.filter((n) => !n.isRead).length;
  const categories  = [
    ...new Set(notices.map((n) => n.category).filter(Boolean)),
  ] as string[];

  /* Loading */
  if (loading) {
    return (
      <div className="sn-loader">
        <div className="sn-spinner" />
        <span className="sn-loader__text">Loading notices…</span>
      </div>
    );
  }

  return (
    <div className="sn-root">
      {/* ── Page header ── */}
      <div className="sn-page-header">
        <div>
          <div className="sn-page-title">
            <Bell size={20} style={{ color: "var(--sp-accent)" }} />
            Notices
            {unreadCount > 0 && (
              <span className="sn-unread-badge">{unreadCount} new</span>
            )}
          </div>
          <p className="sn-page-sub">
            Stay updated with important academy announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button className="sn-mark-all-btn" onClick={markAllRead}>
            <CheckCheck size={13} />
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Filter bar ── */}
      <div className="sn-filter-bar">
        {(["all", "unread", "read"] as const).map((f) => {
          const count =
            f === "all"    ? notices.length :
            f === "unread" ? notices.filter((n) => !n.isRead).length :
                             notices.filter((n) => n.isRead).length;

          return (
            <button
              key={f}
              className={`sn-filter-btn ${filter === f ? "sn-filter-btn--active" : ""}`}
              onClick={() => { setFilter(f); setPage(1); }}
            >
              {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
              <span className="sn-filter-count">{count}</span>
            </button>
          );
        })}

        {/* Category tags */}
        {categories.length > 0 && (
          <div className="sn-category-tags">
            {categories.slice(0, 4).map((cat) => {
              const cs = getCategoryStyle(cat);
              return (
                <span
                  key={cat}
                  className="sn-cat-tag"
                  style={{
                    background: cs.bg,
                    color:      cs.color,
                    border:     `1px solid ${cs.border}`,
                  }}
                >
                  <Tag size={8} />
                  {cat}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Notice list ── */}
      {filtered.length === 0 ? (
        <div className="sn-empty">
          <div className="sn-empty__icon">
            <Bell size={20} />
          </div>
          <div className="sn-empty__title">
            {filter === "unread" ? "All caught up!" : "No notices found"}
          </div>
          <p className="sn-empty__sub">
            {filter === "unread"
              ? "You have no unread notices."
              : "No notices available at the moment."}
          </p>
        </div>
      ) : (
        <div className="sn-list">
          {paginated.map((notice) => {
            const cs = getCategoryStyle(notice.category);
            const dateStr = new Date(notice.createdAt).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "short", year: "numeric" }
            );

            return (
              <div
                key={notice._id}
                className={`sn-card ${!notice.isRead ? "sn-card--unread" : ""}`}
              >
                <div className="sn-card-inner">
                  {/* Top row */}
                  <div className="sn-card-top">
                    <div className="sn-card-top-left">
                      {notice.category && (
                        <span
                          className="sn-cat-tag"
                          style={{
                            background: cs.bg,
                            color:      cs.color,
                            border:     `1px solid ${cs.border}`,
                          }}
                        >
                          <Tag size={8} />
                          {notice.category}
                        </span>
                      )}
                      {!notice.isRead && (
                        <span className="sn-new-dot">
                          <span className="sn-new-dot__dot" />
                          New
                        </span>
                      )}
                    </div>
                    <div className="sn-card-date">
                      <Clock size={11} />
                      {dateStr}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="sn-card-title">{notice.title}</div>
                  <div className="sn-card-excerpt">{notice.excerpt}</div>

                  {/* Actions */}
                  <div className="sn-card-actions">
                    <Link
                      href={`/notices/${notice.slug}`}
                      className="sn-read-link"
                      onClick={() => {
                        if (!notice.isRead) markAsRead(notice._id);
                      }}
                    >
                      <BookOpen size={12} />
                      Read Notice
                      <ExternalLink size={10} />
                    </Link>

                    {!notice.isRead && (
                      <button
                        className="sn-mark-btn"
                        onClick={() => markAsRead(notice._id)}
                        disabled={marking === notice._id}
                      >
                        <CheckCheck size={13} />
                        {marking === notice._id ? "Marking…" : "Mark as read"}
                      </button>
                    )}

                    {notice.isRead && (
                      <span className="sn-read-indicator">
                        <CheckCheck
                          size={12}
                          style={{ color: "var(--sp-success)" }}
                        />
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="sn-pagination">
          <button
            className="sn-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - page) <= 1
            )
            .reduce<(number | "…")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span key={`e${i}`} className="sn-page-info">…</span>
              ) : (
                <button
                  key={p}
                  className={`sn-page-btn ${page === p ? "sn-page-btn--active" : ""}`}
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </button>
              )
            )}

          <button
            className="sn-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}