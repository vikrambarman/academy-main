"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Course = {
  title: string;
  image: string;
  tab: string;
  sidebar: string;
  slug: string;
  duration: string;
};

const courses: Course[] = [
  {
    title: "DCA – Diploma in Computer Applications",
    image: "/images/courses/dca.jpg",
    tab: "Diploma",
    sidebar: "Computer Diplomas",
    slug: "dca-diploma-in-computer-applications",
    duration: "6 Months",
  },
  {
    title: "PGDCA – Post Graduate Diploma",
    image: "/images/courses/pgdca.jpg",
    tab: "Diploma",
    sidebar: "Computer Diplomas",
    slug: "pgdca",
    duration: "1 Year",
  },
  {
    title: "Tally with GST",
    image: "/images/courses/tally.jpg",
    tab: "Accounting",
    sidebar: "Accounting & Finance",
    slug: "tally-with-gst",
    duration: "3 Months",
  },
  {
    title: "Basic Computer Course",
    image: "/images/courses/basic.jpg",
    tab: "Foundation",
    sidebar: "Foundation Programs",
    slug: "basic-computer-course",
    duration: "2 Months",
  },
  {
    title: "Web Development",
    image: "/images/courses/web.jpg",
    tab: "Technical",
    sidebar: "Web & Software",
    slug: "web-development",
    duration: "4 Months",
  },
  {
    title: "Software Development",
    image: "/images/courses/software.jpg",
    tab: "Technical",
    sidebar: "Web & Software",
    slug: "software-development",
    duration: "6 Months",
  },
  {
    title: "Typing Course",
    image: "/images/courses/typing.jpg",
    tab: "Foundation",
    sidebar: "Foundation Programs",
    slug: "typing-course",
    duration: "1 Month",
  },
  {
    title: "Cyber Security",
    image: "/images/courses/cyber.jpg",
    tab: "Technical",
    sidebar: "Security & Networking",
    slug: "cyber-security",
    duration: "3 Months",
  },
  {
    title: "Vocational Training",
    image: "/images/courses/vocational.jpg",
    tab: "Vocational",
    sidebar: "Vocational",
    slug: "vocational-training",
    duration: "Variable",
  },
];

// Top tabs
const tabs = [
  { label: "All Courses", value: "all" },
  { label: "Diploma", value: "Diploma" },
  { label: "Technical", value: "Technical" },
  { label: "Foundation", value: "Foundation" },
  { label: "Accounting", value: "Accounting" },
  { label: "Vocational", value: "Vocational" },
];

// Sidebar categories
const sidebarCategories = [
  { label: "All Courses", value: "all" },
  { label: "Computer Diplomas", value: "Computer Diplomas" },
  { label: "Web & Software", value: "Web & Software" },
  { label: "Security & Networking", value: "Security & Networking" },
  { label: "Accounting & Finance", value: "Accounting & Finance" },
  { label: "Foundation Programs", value: "Foundation Programs" },
  { label: "Vocational", value: "Vocational" },
];

// Sidebar accent colors - left border like screenshot
const sidebarColors: Record<string, string> = {
  "all": "#1e3a8a",
  "Computer Diplomas": "#1e3a8a",
  "Web & Software": "#c2410c",
  "Security & Networking": "#166534",
  "Accounting & Finance": "#15803d",
  "Foundation Programs": "#78716c",
  "Vocational": "#6d28d9",
};

export default function CoursesPreview() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeSidebar, setActiveSidebar] = useState("all");

  // Tab se filter
  const tabFiltered =
    activeTab === "all"
      ? courses
      : courses.filter((c) => c.tab === activeTab);

  // Sidebar se filter
  const displayed =
    activeSidebar === "all"
      ? tabFiltered
      : tabFiltered.filter((c) => c.sidebar === activeSidebar);

  // Tab change hone par sidebar reset
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActiveSidebar("all");
  };

  // Tab ke hisaab se sidebar categories filter
  const visibleSidebar =
    activeTab === "all"
      ? sidebarCategories
      : [
          { label: "All", value: "all" },
          ...sidebarCategories.filter((s) =>
            tabFiltered.some((c) => c.sidebar === s.value)
          ),
        ];

  // Count helper
  const getCount = (sidebarVal: string) => {
    if (sidebarVal === "all") return tabFiltered.length;
    return tabFiltered.filter((c) => c.sidebar === sidebarVal).length;
  };

  return (
    <section className="cp-section" aria-labelledby="cp-heading">
      {/* Section Title - Center aligned like screenshot */}
      <div className="cp-title-wrap">
        <h2 id="cp-heading" className="cp-main-title">
          Programmes Offered
        </h2>
        <p className="cp-main-subtitle">
          Government-recognized computer courses with practical training
          and verified certifications in Ambikapur, Chhattisgarh.
        </p>
      </div>

      <div className="cp-container">
        {/* ── TOP TABS ── */}
        <div className="cp-top-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              className={`cp-top-tab ${
                activeTab === tab.value ? "cp-top-tab--active" : ""
              }`}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
              <span className="cp-top-tab-count">
                {tab.value === "all"
                  ? courses.length
                  : courses.filter((c) => c.tab === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── MAIN PANEL ── */}
        <div className="cp-panel">
          {/* LEFT SIDEBAR */}
          <aside className="cp-sidebar">
            {visibleSidebar.map((cat) => {
              const count = getCount(cat.value);
              if (count === 0) return null;
              return (
                <button
                  key={cat.value}
                  className={`cp-sidebar-item ${
                    activeSidebar === cat.value
                      ? "cp-sidebar-item--active"
                      : ""
                  }`}
                  style={{
                    borderLeftColor:
                      activeSidebar === cat.value
                        ? sidebarColors[cat.value]
                        : "transparent",
                  }}
                  onClick={() => setActiveSidebar(cat.value)}
                >
                  <span className="cp-sidebar-label">{cat.label}</span>
                  <span className="cp-sidebar-count">{count}</span>
                </button>
              );
            })}
          </aside>

          {/* RIGHT - COURSE CARDS */}
          <div className="cp-courses-area">
            {displayed.length > 0 ? (
              <div className="cp-cards-grid">
                {displayed.map((course) => (
                  <div key={course.slug} className="cp-card">
                    {/* Image with title overlay */}
                    <div className="cp-card-image-wrap">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="(max-width: 640px) 100vw,
                               (max-width: 1024px) 50vw,
                               300px"
                        className="cp-card-img"
                      />
                      {/* Dark overlay */}
                      <div className="cp-card-overlay" />
                      {/* Title on image */}
                      <div className="cp-card-img-footer">
                        <h3 className="cp-card-img-title">
                          {course.title}
                        </h3>
                        <span className="cp-card-duration">
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    {/* Card footer - Know More + Apply Now */}
                    <div className="cp-card-actions">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="cp-action-link cp-action-link--know"
                      >
                        Know More
                        <ArrowRight size={13} strokeWidth={2.5} />
                      </Link>
                      <div className="cp-action-divider" />
                      <Link
                        href="/enquiry"
                        className="cp-action-link cp-action-link--apply"
                      >
                        Apply Now
                        <ArrowRight size={13} strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cp-empty">
                <p>No courses found in this category.</p>
                <button
                  className="cp-empty-reset"
                  onClick={() => {
                    setActiveTab("all");
                    setActiveSidebar("all");
                  }}
                >
                  View All Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="cp-bottom">
          <Link href="/courses" className="cp-bottom-link">
            View Complete Course Catalog
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
          <Link href="/enquiry" className="cp-bottom-btn">
            Free Admission Counseling
          </Link>
        </div>
      </div>
    </section>
  );
}