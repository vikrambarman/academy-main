import { MapPin, Phone, Clock, Shield, Navigation } from "lucide-react";

const infoItems = [
  {
    icon: MapPin,
    label: "Address",
    content: [
      "1st Floor above Usha Matching Center,",
      "Near Babra Petrol Pump, Banaras Road,",
      "Phunderdihari, Ambikapur – 497001",
      "Chhattisgarh, India",
    ],
  },
  {
    icon: Phone,
    label: "Contact",
    phones: ["+91 74770 36832", "+91 90090 87883"],
  },
  {
    icon: Clock,
    label: "Working Hours",
    hours: ["Monday – Saturday", "8:00 AM – 6:00 PM"],
  },
  {
    icon: Shield,
    label: "Authorization",
    content: [
      "Authorized Training Centre under",
      "Gramin Skill Development Mission (GSDM)",
    ],
  },
];

export default function VisitUs() {
  return (
    <section className="vu-section" aria-labelledby="vu-heading">

      {/* ── TOP BAR — Full width colored header ── */}
      <div className="vu-topbar">
        <div className="vu-topbar-inner">
          <div className="vu-topbar-left">
            <span className="vu-topbar-tag">
              <MapPin size={14} strokeWidth={2} />
              Find Us
            </span>
            <h2 id="vu-heading" className="vu-topbar-title">
              Visit Us in Ambikapur
            </h2>
          </div>
          <p className="vu-topbar-desc">
            Walk in anytime during working hours for course enquiries,
            admission guidance and free career counselling.
          </p>
        </div>
      </div>

      {/* ── MAIN GRID — Full width, no container ── */}
      <div className="vu-grid">

        {/* LEFT — Info Panel */}
        <div className="vu-info-panel">

          {/* Info Items */}
          <div className="vu-info-list">
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="vu-info-item">
                  <div className="vu-info-icon">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div className="vu-info-content">
                    <div className="vu-info-label">{item.label}</div>

                    {item.content && (
                      <div className="vu-info-text">
                        {item.content.map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < item.content!.length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.phones && (
                      <div className="vu-info-phones">
                        {item.phones.map((phone, i) => (
                          <a
                            key={i}
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="vu-phone-link"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    )}

                    {item.hours && (
                      <div className="vu-info-text">
                        {item.hours[0]}
                        <br />
                        <strong className="vu-hours-highlight">
                          {item.hours[1]}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Google Maps Button */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Shivshakti+Computer+Academy+Ambikapur"
            target="_blank"
            rel="noopener noreferrer"
            className="vu-maps-btn"
          >
            <Navigation size={16} strokeWidth={2} />
            <span>Open in Google Maps</span>
          </a>

        </div>

        {/* RIGHT — Map (full height) */}
        <div className="vu-map-wrapper">
          <div className="vu-map-badge">
            <MapPin size={13} strokeWidth={2} />
            Ambikapur, Chhattisgarh
          </div>
          <iframe
            src="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur&output=embed"
            loading="lazy"
            title="Shivshakti Computer Academy Location"
            allowFullScreen
            className="vu-map-iframe"
          />
        </div>

      </div>

    </section>
  );
}