import { GraduationCap, Award, CheckCircle, Building2 } from "lucide-react";

export default function TrustSection() {
  const stats = [
    {
      icon: Building2,
      value: "5+",
      label: "Years of Excellence",
      desc: "Experience in computer education and skill development.",
    },
    {
      icon: GraduationCap,
      value: "1000+",
      label: "Students Trained",
      desc: "Successfully trained across certified programs.",
    },
    {
      icon: Award,
      value: "100%",
      label: "Verifiable Certificates",
      desc: "Certificates available with online verification.",
    },
    {
      icon: CheckCircle,
      value: "Govt.",
      label: "Recognized Institute",
      desc: "ISO Certified • MSME Registered • Skill India aligned.",
    },
  ];

  return (
    <section
      className="relative bg-gradient-to-b from-gray-50 to-white border-y border-gray-100"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2
            id="trust-heading"
            className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900"
          >
            A Trusted Name in Computer Education
          </h2>

          <p className="mt-4 text-gray-600 text-base md:text-lg">
            Shivshakti Computer Academy is a government-recognized institute
            delivering transparent programs, certified courses, and measurable
            student outcomes.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 group-hover:bg-black transition">
                  <Icon className="w-6 h-6 text-gray-700 group-hover:text-white transition" />
                </div>

                <h3 className="mt-6 text-3xl font-bold text-gray-900">
                  {item.value}
                </h3>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {item.label}
                </p>

                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}

        </div>

        {/* Recognition Panel */}
        <div className="mt-20 relative overflow-hidden bg-black text-white rounded-3xl p-10 md:p-14 text-center shadow-2xl">

          {/* Subtle Overlay Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white,transparent_70%)]" />

          <div className="relative">
            <p className="text-lg font-semibold">
              Authorized & Government Recognized Computer Training Centre
            </p>

            <p className="mt-4 text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Authorized under Gramin Skill Development Mission (GSDM) •
              Certificates available on Skill India Portal & DigiLocker •
              ISO 9001:2015 Certified • MSME Registered Institute
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}