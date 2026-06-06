"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

/**
 * CoursesPreview — Clean University style
 * -------------------------------------------------------------
 * - Your ORIGINAL 9 courses keep their real /courses/[slug] links.
 * - New programming / web-development courses are added for SEO/indexing,
 *   but they link to /courses (no slug) to avoid 404s. They carry a
 *   `comingSoon: true` flag and show an "Enquire" hint instead of a fake page.
 * - Same lucide icons, same next/image. Calm, flat, sober styling.
 */

type Course = {
  title: string;
  description: string;
  image: string;
  tag: string;
  slug: string | null; // null => link to /courses (new SEO course, no detail page yet)
  duration: string;
  featured: boolean;
  comingSoon?: boolean;
};

const courses: Course[] = [
  // ───────── Original courses (real slugs, unchanged) ─────────
  {
    title: "DCA – Diploma in Computer Applications",
    description:
      "Computer fundamentals, MS Office, internet usage and practical office skills for beginners.",
    image: "/images/courses/dca.jpg",
    tag: "Diploma",
    slug: "dca-diploma-in-computer-applications",
    duration: "6 Months",
    featured: true,
  },
  {
    title: "PGDCA – Post Graduate Diploma",
    description:
      "Advanced diploma program focused on professional-level computer skills and career growth.",
    image: "/images/courses/pgdca.jpg",
    tag: "Diploma",
    slug: "pgdca",
    duration: "1 Year",
    featured: true,
  },
  {
    title: "Tally with GST",
    description:
      "Practical accounting and GST training designed for office work and business operations.",
    image: "/images/courses/tally.jpg",
    tag: "Accounting",
    slug: "tally-with-gst",
    duration: "3 Months",
    featured: false,
  },
  {
    title: "Basic Computer Course",
    description:
      "Perfect starting point for students and first-time learners beginning computer education.",
    image: "/images/courses/basic.jpg",
    tag: "Foundation",
    slug: "basic-computer-course",
    duration: "2 Months",
    featured: false,
  },
  {
    title: "Web Development",
    description:
      "Learn modern website development using HTML, CSS, JavaScript and project-based learning.",
    image: "/images/courses/web.jpg",
    tag: "Technical",
    slug: "web-development",
    duration: "4 Months",
    featured: false,
  },
  {
    title: "Software Development",
    description:
      "Programming logic, application development and real-world software skills.",
    image: "/images/courses/software.jpg",
    tag: "Technical",
    slug: "software-development",
    duration: "6 Months",
    featured: false,
  },
  {
    title: "Typing Course",
    description:
      "Hindi & English typing training focused on speed, accuracy and exam preparation.",
    image: "/images/courses/typing.jpg",
    tag: "Foundation",
    slug: "typing-course",
    duration: "1 Month",
    featured: false,
  },
  {
    title: "Cyber Security",
    description:
      "Cyber safety fundamentals, ethical hacking concepts and data protection practices.",
    image: "/images/courses/cyber.jpg",
    tag: "Technical",
    slug: "cyber-security",
    duration: "3 Months",
    featured: false,
  },
  {
    title: "Vocational Training",
    description:
      "Skill-based vocational programs aligned with employment and self-employment readiness.",
    image: "/images/courses/vocational.jpg",
    tag: "Vocational",
    slug: "vocational-training",
    duration: "Variable",
    featured: false,
  },

  // ───────── New SEO-focused courses (programming / web dev) ─────────
  // These link to /courses (no detail page yet) and show an "Enquire" hint.
  {
    title: "Python Programming",
    description:
      "Learn Python from basics to projects — variables, loops, functions, data structures and an introduction to automation and data handling.",
    image: "/images/courses/python.jpg",
    tag: "Programming",
    slug: null,
    duration: "4 Months",
    featured: false,
    comingSoon: true,
  },
  {
    title: "C & C++ Programming",
    description:
      "Strong programming foundation with C and C++ — logic building, functions, arrays, pointers and object-oriented programming concepts.",
    image: "/images/courses/cpp.jpg",
    tag: "Programming",
    slug: null,
    duration: "4 Months",
    featured: false,
    comingSoon: true,
  },
  {
    title: "Java Programming",
    description:
      "Core Java programming with object-oriented concepts, classes, exception handling and the basics of application development.",
    image: "/images/courses/java.jpg",
    tag: "Programming",
    slug: null,
    duration: "5 Months",
    featured: false,
    comingSoon: true,
  },
  {
    title: "Frontend Web Development",
    description:
      "Build responsive websites with HTML5, CSS3 and JavaScript — layouts, flexbox, grid and interactive, mobile-friendly web pages.",
    image: "/images/courses/frontend.jpg",
    tag: "Web Development",
    slug: null,
    duration: "4 Months",
    featured: false,
    comingSoon: true,
  },
  {
    title: "React JS Development",
    description:
      "Modern frontend development with React — components, props, state, hooks and building single-page web applications.",
    image: "/images/courses/react.jpg",
    tag: "Web Development",
    slug: null,
    duration: "3 Months",
    featured: false,
    comingSoon: true,
  },
  {
    title: "Full Stack Web Development",
    description:
      "End-to-end web development covering frontend (HTML, CSS, JavaScript) and backend with databases to build complete, deployable web apps.",
    image: "/images/courses/fullstack.jpg",
    tag: "Web Development",
    slug: null,
    duration: "8 Months",
    featured: false,
    comingSoon: true,
  },
];

// Tag → accent style. Kept sober: a thin left dot + muted colour, no neon.
const tagAccent: Record<string, string> = {
  Diploma: "var(--color-primary-600)",
  Accounting: "var(--color-success)",
  Foundation: "var(--color-gray-500)",
  Technical: "var(--color-accent-600)",
  Vocational: "var(--color-primary-500)",
  Programming: "var(--color-accent-700)",
  "Web Development": "var(--color-primary-700)",
};

function CourseTag({ tag }: { tag: string }) {
  return (
    <span className="course-tag">
      <span
        className="course-tag-dot"
        style={{ background: tagAccent[tag] ?? "var(--color-gray-500)" }}
        aria-hidden="true"
      />
      {tag}
    </span>
  );
}

export default function CoursesPreview() {
  const featured = courses.filter((c) => c.featured);
  const regular = courses.filter((c) => !c.featured);

  return (
    <>
      <style>{coursesStyles}</style>

      <section className="courses-section" aria-labelledby="courses-heading">
        <div className="courses-container">
          {/* Header */}
          <div className="courses-header">
            <div className="courses-header-content">
              <div className="courses-badge">
                <span className="courses-badge-line" aria-hidden="true" />
                Our Courses
              </div>
              <h2 id="courses-heading" className="courses-title">
                Professional Computer &amp; Programming Courses in{" "}
                <span className="courses-title-highlight">Ambikapur</span>
              </h2>
              <p className="courses-description">
                Career-oriented computer training — from DCA, PGDCA and Tally to
                programming and web development (Python, Java, C/C++, HTML, CSS,
                JavaScript, React) — with practical exposure and government-recognized
                certification.
              </p>
            </div>

            <Link href="/courses" className="courses-header-btn">
              View All Courses
              <ArrowRight size={16} strokeWidth={2} className="courses-btn-arrow" />
            </Link>
          </div>

          {/* Featured Courses */}
          <div className="courses-featured">
            {featured.map((course) => (
              <Link
                key={course.slug ?? course.title}
                href={course.slug ? `/courses/${course.slug}` : "/courses"}
                className="course-card-featured"
                aria-label={course.title}
              >
                <div className="course-featured-image">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 500px"
                    className="course-image"
                  />
                  <div className="course-duration-badge">
                    <Clock size={14} strokeWidth={2} />
                    {course.duration}
                  </div>
                </div>

                <div className="course-featured-content">
                  <CourseTag tag={course.tag} />
                  <h3 className="course-featured-title">{course.title}</h3>
                  <p className="course-featured-desc">{course.description}</p>
                  <div className="course-featured-footer">
                    <span className="course-learn-more">
                      Learn More
                      <ArrowRight size={14} strokeWidth={2} className="course-arrow" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Regular Courses Grid */}
          <div className="courses-grid">
            {regular.map((course) => (
              <Link
                key={course.slug ?? course.title}
                href={course.slug ? `/courses/${course.slug}` : "/courses"}
                className="course-card"
                aria-label={course.title}
              >
                <div className="course-card-image">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px"
                    className="course-image"
                  />
                </div>

                <div className="course-card-content">
                  <CourseTag tag={course.tag} />
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-desc">{course.description}</p>

                  <div className="course-card-footer">
                    <div className="course-meta">
                      <Clock size={14} strokeWidth={2} />
                      <span>{course.duration}</span>
                    </div>
                    <span className="course-learn-more">
                      {course.comingSoon ? "Enquire" : "View"}
                      <ArrowRight size={14} strokeWidth={2} className="course-arrow" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="courses-bottom-cta">
            <div className="courses-cta-line" aria-hidden="true" />
            <Link href="/courses" className="courses-cta-btn">
              Explore All Courses
              <ArrowRight size={18} strokeWidth={2} className="courses-cta-arrow" />
            </Link>
            <div className="courses-cta-line" aria-hidden="true" />
          </div>
        </div>
      </section>
    </>
  );
}

const coursesStyles = `
/* ==========================================
   COURSES PREVIEW — Clean University style
   Uses global tokens. Flat cards, hairline borders, calm.
   ========================================== */

.courses-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}

.courses-container { position: relative; max-width: 1180px; margin: 0 auto; }

/* Header */
.courses-header {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}
.courses-header-content { max-width: 620px; }
.courses-badge {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.courses-badge-line { width: 24px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.courses-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.4vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2; letter-spacing: -0.015em;
  color: var(--text-primary);
}
.courses-title-highlight { color: var(--color-primary-700); }
.courses-description {
  font-size: var(--font-size-base);
  line-height: 1.7;
  color: var(--text-secondary);
  margin-top: var(--space-3);
}

.courses-header-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: transparent;
  border: 1px solid var(--border-color-dark);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  text-decoration: none;
  transition: border-color var(--transition-base);
  white-space: nowrap;
}
.courses-header-btn:hover { border-color: var(--color-primary-600); }
.courses-btn-arrow { transition: transform var(--transition-fast); }
.courses-header-btn:hover .courses-btn-arrow { transform: translateX(3px); }

/* Tag */
.course-tag {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.04em; text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}
.course-tag-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* Featured */
.courses-featured {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
  margin-bottom: var(--space-8);
}
@media (min-width: 768px) { .courses-featured { grid-template-columns: repeat(2, 1fr); } }

.course-card-featured {
  position: relative;
  display: flex; flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
  transition: border-color var(--transition-base);
}
.course-card-featured:hover { border-color: var(--color-gray-300); }

.course-featured-image {
  position: relative; width: 100%;
  aspect-ratio: 16 / 9; overflow: hidden;
  background: var(--color-gray-100);
  border-bottom: 1px solid var(--border-color);
}
.course-duration-badge {
  position: absolute; bottom: var(--space-3); left: var(--space-3);
  z-index: 2; display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}
[data-theme="dark"] .course-duration-badge { background: var(--bg-elevated); }

.course-featured-content { padding: var(--space-6); flex: 1; display: flex; flex-direction: column; }
.course-featured-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 1.3; color: var(--text-primary);
  margin-bottom: var(--space-2);
}
.course-featured-desc { font-size: var(--font-size-sm); line-height: 1.7; color: var(--text-secondary); flex: 1; margin: 0; }
.course-featured-footer { margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--border-color); }

/* Regular grid */
.courses-grid {
  display: grid; grid-template-columns: 1fr;
  gap: var(--space-5); margin-bottom: var(--space-8);
}
@media (min-width: 640px) { .courses-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .courses-grid { grid-template-columns: repeat(3, 1fr); } }

.course-card {
  position: relative;
  display: flex; flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
  transition: border-color var(--transition-base);
}
.course-card:hover { border-color: var(--color-gray-300); }

.course-card-image {
  position: relative; width: 100%;
  aspect-ratio: 16 / 10;
  background: var(--color-gray-100);
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
}
.course-image { object-fit: cover; }

.course-card-content { padding: var(--space-5); flex: 1; display: flex; flex-direction: column; }
.course-card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1.35; color: var(--text-primary);
  margin-bottom: var(--space-2);
}
.course-card-desc { font-size: var(--font-size-sm); line-height: 1.65; color: var(--text-secondary); flex: 1; margin: 0; }

.course-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: var(--space-4); padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}
.course-meta { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); color: var(--text-tertiary); }
.course-learn-more {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);
  color: var(--color-primary-600);
}
.course-arrow { transition: transform var(--transition-fast); }
.course-card:hover .course-arrow, .course-card-featured:hover .course-arrow { transform: translateX(3px); }

/* Bottom CTA */
.courses-bottom-cta { display: flex; align-items: center; gap: var(--space-5); margin-top: var(--space-10); }
.courses-cta-line { flex: 1; height: 1px; background: var(--border-color); }
.courses-cta-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-8);
  background: var(--color-primary-600);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: var(--color-white); text-decoration: none; white-space: nowrap;
  transition: background var(--transition-base);
}
.courses-cta-btn:hover { background: var(--color-primary-700); }
.courses-cta-arrow { transition: transform var(--transition-fast); }
.courses-cta-btn:hover .courses-cta-arrow { transform: translateX(3px); }

/* Responsive */
@media (max-width: 640px) {
  .courses-section { padding: var(--space-16) var(--space-4); }
  .courses-header { flex-direction: column; align-items: start; }
  .courses-header-btn { width: 100%; justify-content: center; }
  .courses-bottom-cta { flex-direction: column; }
  .courses-cta-line { width: 100%; }
  .courses-cta-btn { width: 100%; justify-content: center; }
}
`;
