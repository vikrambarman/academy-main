"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Award } from "lucide-react";

const courses = [
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
];

const tagColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Diploma: {
    bg: "rgba(37, 99, 235, 0.1)",
    text: "var(--color-primary-700)",
    border: "rgba(37, 99, 235, 0.3)",
  },
  Accounting: {
    bg: "rgba(34, 197, 94, 0.1)",
    text: "#059669",
    border: "rgba(34, 197, 94, 0.3)",
  },
  Foundation: {
    bg: "rgba(100, 116, 139, 0.1)",
    text: "#475569",
    border: "rgba(100, 116, 139, 0.3)",
  },
  Technical: {
    bg: "rgba(249, 115, 22, 0.1)",
    text: "var(--color-accent-700)",
    border: "rgba(249, 115, 22, 0.3)",
  },
  Vocational: {
    bg: "rgba(139, 92, 246, 0.1)",
    text: "#7c3aed",
    border: "rgba(139, 92, 246, 0.3)",
  },
};

export default function CoursesPreview() {
  return (
    <>
      <style>{coursesStyles}</style>

      <section className="courses-section" aria-labelledby="courses-heading">
        
        {/* Background Elements */}
        <div className="courses-bg-grid" aria-hidden="true" />
        <div className="courses-gradient" aria-hidden="true" />

        <div className="courses-container">
          
          {/* Header */}
          <div className="courses-header">
            <div className="courses-header-content">
              <div className="courses-badge anim-fade-in">
                <span className="courses-badge-line" />
                Our Courses
              </div>
              <h2 id="courses-heading" className="courses-title anim-slide-up">
                Professional Courses
                <br />
                in <span className="courses-title-highlight">Ambikapur</span>
              </h2>
              <p className="courses-description anim-fade-in-delay">
                Career-oriented computer training with practical exposure and
                government-recognized certification.
              </p>
            </div>

            <Link href="/courses" className="courses-header-btn anim-scale-in">
              View All Courses
              <ArrowRight size={16} strokeWidth={2} className="courses-btn-arrow" />
            </Link>
          </div>

          {/* Featured Courses - Large Cards */}
          <div className="courses-featured">
            {courses
              .filter((c) => c.featured)
              .map((course, i) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className={`course-card-featured anim-scale-${i + 1}`}
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
                    <div className="course-featured-overlay" />
                    
                    {/* Tag */}
                    <div
                      className="course-tag"
                      style={{
                        background: tagColors[course.tag]?.bg,
                        color: tagColors[course.tag]?.text,
                        border: `1px solid ${tagColors[course.tag]?.border}`,
                      }}
                    >
                      <Award size={12} strokeWidth={2} />
                      {course.tag}
                    </div>

                    {/* Duration Badge */}
                    <div className="course-duration-badge">
                      <Clock size={14} strokeWidth={2} />
                      {course.duration}
                    </div>
                  </div>

                  <div className="course-featured-content">
                    <h3 className="course-featured-title">{course.title}</h3>
                    <p className="course-featured-desc">{course.description}</p>
                    
                    <div className="course-featured-footer">
                      <span className="course-learn-more">
                        Learn More
                        <ArrowRight size={14} strokeWidth={2} className="course-arrow" />
                      </span>
                    </div>
                  </div>

                  <div className="course-card-shine" />
                </Link>
              ))}
          </div>

          {/* Regular Courses Grid */}
          <div className="courses-grid">
            {courses
              .filter((c) => !c.featured)
              .map((course, i) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className={`course-card anim-scale-${i + 3}`}
                  aria-label={course.title}
                >
                  {/* Top Bar */}
                  <div className="course-card-top-bar" />

                  {/* Image */}
                  <div className="course-card-image">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px"
                      className="course-image"
                    />
                    
                    {/* Tag */}
                    <div
                      className="course-tag"
                      style={{
                        background: tagColors[course.tag]?.bg,
                        color: tagColors[course.tag]?.text,
                        border: `1px solid ${tagColors[course.tag]?.border}`,
                      }}
                    >
                      {course.tag}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="course-card-content">
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-desc">{course.description}</p>

                    {/* Footer */}
                    <div className="course-card-footer">
                      <div className="course-meta">
                        <Clock size={14} strokeWidth={2} />
                        <span>{course.duration}</span>
                      </div>
                      <span className="course-learn-more">
                        View
                        <ArrowRight size={14} strokeWidth={2} className="course-arrow" />
                      </span>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="course-card-border" />
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
   COURSES PREVIEW SECTION
   ========================================== */

.courses-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  overflow: hidden;
}

/* Background */
.courses-bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(37, 99, 235, 0.03) 1.5px, transparent 1.5px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.03) 1.5px, transparent 1.5px);
  background-size: 60px 60px;
  z-index: 0;
}

.courses-gradient {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent);
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}

/* Container */
.courses-container {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.courses-header {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-6);
  margin-bottom: var(--space-16);
}

.courses-header-content {
  max-width: 520px;
}

.courses-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary-600);
  margin-bottom: var(--space-4);
}

.courses-badge-line {
  width: 24px;
  height: 1.5px;
  background: var(--color-primary-600);
  flex-shrink: 0;
}

.courses-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  color: var(--text-primary);
}

.courses-title-highlight {
  color: var(--color-accent-600);
  font-style: normal;
}

.courses-description {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-light);
  line-height: 1.75;
  color: var(--text-secondary);
  margin-top: var(--space-3);
}

.courses-header-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: transparent;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-600);
  text-decoration: none;
  transition: all var(--transition-base);
}

.courses-header-btn:hover {
  border-color: var(--color-primary-600);
  background: rgba(37, 99, 235, 0.06);
  transform: translateY(-2px);
}

.courses-btn-arrow {
  transition: transform var(--transition-fast);
}

.courses-header-btn:hover .courses-btn-arrow {
  transform: translateX(4px);
}

/* Featured Courses - Large Cards */
.courses-featured {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

@media (min-width: 768px) {
  .courses-featured {
    grid-template-columns: repeat(2, 1fr);
  }
}

.course-card-featured {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  text-decoration: none;
  transition: all var(--transition-base);
}

.course-card-featured:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.12);
  border-color: rgba(37, 99, 235, 0.3);
}

.course-featured-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.course-featured-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  z-index: 1;
}

.course-duration-badge {
  position: absolute;
  bottom: var(--space-3);
  left: var(--space-3);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.course-featured-content {
  padding: var(--space-6);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-featured-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.course-featured-desc {
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--text-secondary);
  flex: 1;
  margin: 0;
}

.course-featured-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

/* Regular Courses Grid */
.courses-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
  margin-bottom: var(--space-12);
}

@media (min-width: 640px) {
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .courses-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.course-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  text-decoration: none;
  transition: all var(--transition-base);
}

.course-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(37, 99, 235, 0.2);
}

/* Top Bar Effect */
.course-card-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary-600), var(--color-accent-600));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
  z-index: 10;
}

.course-card:hover .course-card-top-bar {
  transform: scaleX(1);
}

/* Card Image */
.course-card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: rgba(37, 99, 235, 0.05);
  overflow: hidden;
}

.course-image {
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.course-card:hover .course-image {
  transform: scale(1.08);
}

/* Tag Badge */
.course-tag {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

/* Card Content */
.course-card-content {
  padding: var(--space-5);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1.35;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.course-card-desc {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  line-height: 1.7;
  color: var(--text-secondary);
  flex: 1;
  margin: 0;
}

/* Card Footer */
.course-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.course-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.course-learn-more {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-600);
  transition: gap var(--transition-fast);
}

.course-card:hover .course-learn-more {
  gap: var(--space-3);
}

.course-arrow {
  transition: transform var(--transition-fast);
}

.course-card:hover .course-arrow {
  transform: translateX(2px);
}

/* Card Effects */
.course-card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
}

.course-card-featured:hover .course-card-shine {
  left: 100%;
}

.course-card-border {
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-radius: var(--radius-xl);
  transition: border-color var(--transition-base);
  pointer-events: none;
}

.course-card:hover .course-card-border {
  border-color: rgba(37, 99, 235, 0.2);
}

/* Bottom CTA */
.courses-bottom-cta {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-top: var(--space-12);
}

.courses-cta-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
}

.courses-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  background: var(--color-primary-600);
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35);
  transition: all var(--transition-base);
}

.courses-cta-btn:hover {
  background: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.4);
}

.courses-cta-arrow {
  transition: transform var(--transition-fast);
}

.courses-cta-btn:hover .courses-cta-arrow {
  transform: translateX(4px);
}

/* Animations */
.anim-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.anim-slide-up {
  animation: slideUp 0.8s ease-out 0.1s both;
}

.anim-fade-in-delay {
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.anim-scale-in {
  animation: scaleIn 0.6s ease-out 0.3s both;
}

.anim-scale-1 {
  animation: scaleIn 0.6s ease-out 0.1s both;
}

.anim-scale-2 {
  animation: scaleIn 0.6s ease-out 0.2s both;
}

.anim-scale-3 {
  animation: scaleIn 0.6s ease-out 0.3s both;
}

.anim-scale-4 {
  animation: scaleIn 0.6s ease-out 0.4s both;
}

.anim-scale-5 {
  animation: scaleIn 0.6s ease-out 0.5s both;
}

.anim-scale-6 {
  animation: scaleIn 0.6s ease-out 0.6s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .courses-header {
    flex-direction: column;
    align-items: start;
  }

  .courses-header-btn {
    width: 100%;
    justify-content: center;
  }

  .courses-bottom-cta {
    flex-direction: column;
  }

  .courses-cta-line {
    width: 100%;
  }

  .courses-cta-btn {
    width: 100%;
    justify-content: center;
  }
}
`;