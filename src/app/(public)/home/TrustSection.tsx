import { GraduationCap, Award, CheckCircle, Building2 } from "lucide-react";

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

const pills = [
  "GSDM Authorized",
  "Skill India Aligned",
  "DigiLocker Compatible",
  "ISO 9001:2015",
  "MSME Registered",
];

export default function TrustSection() {
  return (
    <>
      <style>{`
                /* Top fade line */
                .trust-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #CBD5E1, transparent);
                }

                /* Stat card — top accent bar on hover */
                .trust-stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: #1B4FBB;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.28s ease;
                }
                .trust-stat-card:hover::before { transform: scaleX(1); }

                /* Banner dot grid */
                .trust-banner::before {
                    content: '';
                    position: absolute;
                    right: -20px; top: 50%;
                    transform: translateY(-50%);
                    width: 160px; height: 160px;
                    background-image: radial-gradient(circle, rgba(96,165,250,0.2) 1.5px, transparent 1.5px);
                    background-size: 14px 14px;
                    pointer-events: none;
                }
            `}</style>

      <section
        className="trust-root relative overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A] py-20 md:py-24 px-6"
        aria-labelledby="trust-heading"
      >
        <div className="max-w-[1100px] mx-auto">

          {/* ── Header ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-end mb-14 md:mb-16">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase text-blue-700 dark:text-blue-400 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-blue-600 dark:before:bg-blue-500">
                Why Trust Us
              </div>
              <h2
                id="trust-heading"
                className="font-serif font-bold text-[#0F172A] dark:text-slate-50 leading-[1.2]"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
              >
                A Trusted Institute for<br />
                <em className="italic text-[#EF4523] dark:text-orange-400 not-italic">
                  Computer Education
                </em>
              </h2>
            </div>
            <p className="text-[0.93rem] font-light text-slate-500 dark:text-slate-400 leading-[1.8] md:pb-1">
              Shivshakti Computer Academy is a recognized training institute
              committed to practical education, transparent systems, and
              verified certifications — helping students build real digital
              skills for the modern world.
            </p>
          </div>

          {/* ── Stats grid ── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            role="list"
          >
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  role="listitem"
                  className="
                                        trust-stat-card group relative
                                        bg-white dark:bg-[#1E293B]
                                        hover:bg-blue-50 dark:hover:bg-blue-900/20
                                        p-8 md:p-9 flex flex-col
                                        transition-colors duration-200
                                    "
                >
                  {/* Icon */}
                  <div className="
                                        w-9 h-9 rounded-[10px] shrink-0
                                        flex items-center justify-center
                                        bg-blue-50 dark:bg-blue-900/30
                                        border border-blue-200 dark:border-blue-800
                                        text-blue-700 dark:text-blue-400
                                        group-hover:bg-[#1B4FBB] group-hover:border-[#1B4FBB]
                                        group-hover:text-white
                                        transition-colors duration-200
                                    " aria-hidden="true">
                    <Icon size={17} strokeWidth={1.8} />
                  </div>

                  {/* Number */}
                  <div className="font-serif text-[2.4rem] font-bold text-[#0F172A] dark:text-slate-100 leading-none mt-5">
                    {item.value}
                  </div>

                  {/* Label */}
                  <div className="text-[0.8rem] font-medium text-slate-700 dark:text-slate-300 mt-1.5 tracking-[0.01em]">
                    {item.label}
                  </div>

                  {/* Desc */}
                  <div className="text-[0.76rem] font-light text-slate-400 dark:text-slate-500 leading-[1.6] mt-2.5">
                    {item.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Recognition banner ── */}
          <div
            className="trust-banner relative overflow-hidden mt-6 rounded-[18px] bg-[#0F172A] dark:bg-[#020C1B] border border-blue-900/50 px-7 md:px-9 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            aria-label="Recognitions and certifications"
          >
            {/* Left */}
            <div className="flex items-center gap-3.5 shrink-0">
              <div className="
                                w-10 h-10 rounded-xl shrink-0
                                flex items-center justify-center text-[1.1rem]
                                bg-blue-500/10 border border-blue-400/20
                            " aria-hidden="true">
                🏛
              </div>
              <div>
                <div className="font-serif text-[1rem] font-semibold text-blue-50 leading-snug">
                  Authorized Government Recognized Centre
                </div>
                <div className="text-[0.72rem] font-light text-blue-200/50 mt-0.5 tracking-[0.03em]">
                  Ambikapur, Surguja, Chhattisgarh
                </div>
              </div>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2 md:justify-end">
              {pills.map((p) => (
                <span
                  key={p}
                  className="
                                        text-[10px] font-normal tracking-[0.06em]
                                        text-blue-100/80
                                        bg-white/5 border border-blue-400/15
                                        px-3 py-1 rounded-full whitespace-nowrap
                                    "
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}