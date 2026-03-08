import { GraduationCap, Award, CheckCircle, Building2 } from "lucide-react";

export default function TrustSection() {

  const stats = [
    {
      icon: Building2,
      value: "10+",
      label: "Years of Experience",
      desc: "Extensive experience in computer education and digital skill training.",
    },
    {
      icon: GraduationCap,
      value: "1000+",
      label: "Students Trained",
      desc: "Trained through structured, practical programs.",
    },
    {
      icon: Award,
      value: "100%",
      label: "Verified Certificates",
      desc: "Every certificate issued with online verification support.",
    },
    {
      icon: CheckCircle,
      value: "Govt.",
      label: "Recognized Institute",
      desc: "ISO Certified · MSME Registered · Skill India aligned.",
    },
  ];

  return (
    <>
      <style>{`
                .trust-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #faf8f4;
                    padding: 88px 24px;
                    position: relative;
                    overflow: hidden;
                }

                /* faint horizontal rule top */
                .trust-root::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2d9c8, transparent);
                }

                .trust-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .trust-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: end;
                    margin-bottom: 64px;
                }

                .trust-eyebrow {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #b45309;
                    margin-bottom: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .trust-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1.5px;
                    background: #d97706;
                }

                .trust-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.6rem);
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1.2;
                }

                .trust-title em {
                    font-style: italic;
                    color: #b45309;
                }

                .trust-desc {
                    font-size: 0.93rem;
                    font-weight: 300;
                    color: #6b5e4b;
                    line-height: 1.8;
                    align-self: end;
                    padding-bottom: 4px;
                }

                /* ── Stats row ── */
                .trust-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1px;
                    background: #e8dfd0;
                    border: 1px solid #e8dfd0;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .trust-stat-card {
                    background: #fff;
                    padding: 36px 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    transition: background 0.22s ease;
                    position: relative;
                }

                .trust-stat-card:hover {
                    background: #fffbeb;
                }

                /* Top amber line on hover */
                .trust-stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #d97706;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.28s ease;
                }

                .trust-stat-card:hover::before {
                    transform: scaleX(1);
                }

                .trust-stat-icon {
                    width: 36px;
                    height: 36px;
                    background: #fef9ee;
                    border: 1px solid #fde68a;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #b45309;
                    flex-shrink: 0;
                    transition: background 0.22s, color 0.22s;
                }

                .trust-stat-card:hover .trust-stat-icon {
                    background: #1a1208;
                    border-color: #1a1208;
                    color: #fcd34d;
                }

                .trust-stat-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.4rem;
                    font-weight: 700;
                    color: #1a1208;
                    line-height: 1;
                    margin-top: 20px;
                }

                .trust-stat-label {
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #4a3f30;
                    margin-top: 6px;
                    letter-spacing: 0.01em;
                }

                .trust-stat-desc {
                    font-size: 0.76rem;
                    font-weight: 300;
                    color: #92826b;
                    line-height: 1.6;
                    margin-top: 10px;
                }

                /* ── Recognition banner ── */
                .trust-banner {
                    margin-top: 28px;
                    border-radius: 18px;
                    background: #1a1208;
                    padding: 28px 36px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    position: relative;
                    overflow: hidden;
                }

                /* Dot pattern decoration */
                .trust-banner::before {
                    content: '';
                    position: absolute;
                    right: -20px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 160px;
                    height: 160px;
                    background-image: radial-gradient(circle, rgba(252,211,77,0.18) 1.5px, transparent 1.5px);
                    background-size: 14px 14px;
                    pointer-events: none;
                }

                .trust-banner-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    flex-shrink: 0;
                }

                .trust-banner-icon {
                    width: 42px;
                    height: 42px;
                    background: rgba(252,211,77,0.15);
                    border: 1px solid rgba(252,211,77,0.25);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    flex-shrink: 0;
                }

                .trust-banner-heading {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #fef3c7;
                    line-height: 1.3;
                }

                .trust-banner-sub {
                    font-size: 0.72rem;
                    font-weight: 300;
                    color: rgba(254,243,199,0.55);
                    margin-top: 2px;
                    letter-spacing: 0.03em;
                }

                .trust-banner-pills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: flex-end;
                }

                .trust-banner-pill {
                    font-size: 10px;
                    font-weight: 400;
                    letter-spacing: 0.06em;
                    color: #fef3c7;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(252,211,77,0.2);
                    padding: 5px 12px;
                    border-radius: 100px;
                    white-space: nowrap;
                }

                /* ── Responsive ── */
                @media (max-width: 900px) {
                    .trust-header {
                        grid-template-columns: 1fr;
                        gap: 16px;
                        margin-bottom: 40px;
                    }

                    .trust-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .trust-banner {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 24px;
                    }

                    .trust-banner-pills {
                        justify-content: flex-start;
                    }
                }

                @media (max-width: 480px) {
                    .trust-root {
                        padding: 64px 16px;
                    }

                    .trust-stats {
                        grid-template-columns: 1fr;
                        border-radius: 16px;
                    }

                    .trust-stat-card {
                        padding: 28px 22px;
                    }

                    .trust-stat-num {
                        font-size: 2rem;
                    }
                }
            `}</style>

      <section className="trust-root" aria-labelledby="trust-heading">
        <div className="trust-inner">

          {/* Header — split two-column */}
          <div className="trust-header">
            <div>
              <div className="trust-eyebrow">Why Trust Us</div>
              <h2 id="trust-heading" className="trust-title">
                A Trusted Institute for<br />
                <em>Computer Education</em>
              </h2>
            </div>
            <p className="trust-desc">
              Shivshakti Computer Academy is a recognized training institute
              committed to practical education, transparent systems, and
              verified certifications — helping students build real digital
              skills for the modern world.
            </p>
          </div>

          {/* Stats — seamless grid with gap-line borders */}
          <div className="trust-stats" role="list">
            {stats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="trust-stat-card" role="listitem">
                  <div className="trust-stat-icon" aria-hidden="true">
                    <Icon size={17} strokeWidth={1.8} />
                  </div>
                  <div className="trust-stat-num">{item.value}</div>
                  <div className="trust-stat-label">{item.label}</div>
                  <div className="trust-stat-desc">{item.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Recognition banner */}
          <div className="trust-banner" aria-label="Recognitions and certifications">
            <div className="trust-banner-left">
              <div className="trust-banner-icon" aria-hidden="true">🏛</div>
              <div>
                <div className="trust-banner-heading">
                  Authorized Government Recognized Centre
                </div>
                <div className="trust-banner-sub">
                  Ambikapur, Surguja, Chhattisgarh
                </div>
              </div>
            </div>

            <div className="trust-banner-pills">
              {[
                "GSDM Authorized",
                "Skill India Aligned",
                "DigiLocker Compatible",
                "ISO 9001:2015",
                "MSME Registered",
              ].map((p) => (
                <span key={p} className="trust-banner-pill">{p}</span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}