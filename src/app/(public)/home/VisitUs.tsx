"use client";

import { MapPin, Phone, Clock, Shield, Navigation } from "lucide-react";

/* All data from your ORIGINAL component — nothing invented. */
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
    <>
      <style>{visitUsStyles}</style>

      <section className="visitus-section" aria-labelledby="visit-us-heading">
        <div className="visitus-container">
          {/* Header */}
          <div className="visitus-header">
            <div className="visitus-header-left">
              <div className="visitus-badge">
                <span className="visitus-badge-line" aria-hidden="true" />
                Find Us
              </div>
              <h2 id="visit-us-heading" className="visitus-title">
                Visit Us in <span className="visitus-title-highlight">Ambikapur</span>
              </h2>
            </div>
            <p className="visitus-description">
              Visit our training centre for course enquiries, admission guidance and free
              career counselling — walk in anytime during working hours.
            </p>
          </div>

          {/* Layout Grid */}
          <div className="visitus-grid">
            {/* Left - Info Panel */}
            <div className="visitus-info-panel">
              <div className="visitus-panel-header">
                <div className="visitus-panel-icon">
                  <MapPin size={22} strokeWidth={1.6} />
                </div>
                <div>
                  <div className="visitus-panel-title">Shivshakti Computer Academy</div>
                  <div className="visitus-panel-subtitle">Ambikapur, Surguja, Chhattisgarh</div>
                </div>
              </div>

              <div className="visitus-info-list">
                {infoItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="visitus-info-item">
                      <div className="visitus-info-icon">
                        <Icon size={18} strokeWidth={1.6} />
                      </div>
                      <div className="visitus-info-content">
                        <div className="visitus-info-label">{item.label}</div>
                        {item.content && (
                          <div className="visitus-info-text">
                            {item.content.map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </div>
                        )}
                        {item.phones && (
                          <div className="visitus-info-phones">
                            {item.phones.map((phone, i) => (
                              <a key={i} href={`tel:${phone.replace(/\s/g, "")}`} className="visitus-phone-link">
                                {phone}
                              </a>
                            ))}
                          </div>
                        )}
                        {item.hours && (
                          <div className="visitus-info-text">
                            <div>{item.hours[0]}</div>
                            <div className="visitus-hours-highlight">{item.hours[1]}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur"
                target="_blank"
                rel="noopener noreferrer"
                className="visitus-maps-btn"
              >
                <Navigation size={18} strokeWidth={2} />
                <span>Open in Google Maps</span>
                <span className="visitus-maps-arrow" aria-hidden="true">→</span>
              </a>
            </div>

            {/* Right - Map */}
            <div className="visitus-map-wrapper">
              <div className="visitus-map-badge">
                <MapPin size={14} strokeWidth={2} />
                Ambikapur, Chhattisgarh
              </div>
              <iframe
                src="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur&output=embed"
                loading="lazy"
                title="Shivshakti Computer Academy Ambikapur Location Map"
                allowFullScreen
                className="visitus-map-iframe"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const visitUsStyles = `
/* ── VISIT US — Clean University style ── */
.visitus-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-color);
}
.visitus-container { position: relative; max-width: 1180px; margin: 0 auto; }

/* Header */
.visitus-header { display: grid; grid-template-columns: 1fr; gap: var(--space-6); align-items: end; margin-bottom: var(--space-12); }
@media (min-width: 768px) { .visitus-header { grid-template-columns: 1fr 1fr; gap: var(--space-12); } }
.visitus-badge {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-600); margin-bottom: var(--space-3);
}
.visitus-badge-line { width: 24px; height: 2px; background: var(--color-accent-500); flex-shrink: 0; }
.visitus-title {
  font-family: var(--font-display); font-size: clamp(1.6rem, 3.4vw, 2.25rem);
  font-weight: var(--font-weight-semibold); line-height: 1.2; letter-spacing: -0.015em; color: var(--text-primary);
}
.visitus-title-highlight { color: var(--color-primary-700); }
.visitus-description { font-size: var(--font-size-base); line-height: 1.7; color: var(--text-secondary); }

/* Grid */
.visitus-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-6); align-items: stretch; }
@media (min-width: 1024px) { .visitus-grid { grid-template-columns: 1fr 1.4fr; } }

/* Info Panel */
.visitus-info-panel {
  display: flex; flex-direction: column;
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); overflow: hidden;
}
.visitus-panel-header {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-6) var(--space-8);
  background: var(--color-primary-700); border-bottom: 1px solid var(--border-color);
}
.visitus-panel-icon {
  width: 44px; height: 44px; border-radius: var(--radius-md);
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;
}
.visitus-panel-title { font-family: var(--font-display); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); line-height: 1.3; color: #fff; }
.visitus-panel-subtitle { font-size: var(--font-size-xs); color: rgba(255,255,255,0.7); margin-top: var(--space-1); }

.visitus-info-list { flex: 1; display: flex; flex-direction: column; }
.visitus-info-item {
  position: relative; display: flex; align-items: flex-start; gap: var(--space-4);
  padding: var(--space-5) var(--space-8); border-bottom: 1px solid var(--border-color);
  transition: background var(--transition-base);
}
.visitus-info-item:last-child { border-bottom: none; }
.visitus-info-item::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: var(--color-primary-600); transform: scaleY(0); transform-origin: top;
  transition: transform var(--transition-base);
}
.visitus-info-item:hover::before { transform: scaleY(1); }
.visitus-info-item:hover { background: var(--bg-surface); }
.visitus-info-icon {
  width: 38px; height: 38px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  background: var(--color-primary-50); border: 1px solid var(--border-color); color: var(--color-primary-600); flex-shrink: 0;
}
.visitus-info-label { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: var(--space-2); }
.visitus-info-text { font-size: var(--font-size-sm); line-height: 1.6; color: var(--text-secondary); }
.visitus-info-phones { display: flex; flex-direction: column; gap: var(--space-1); }
.visitus-phone-link { font-size: var(--font-size-sm); color: var(--color-primary-600); text-decoration: none; transition: color var(--transition-fast); }
.visitus-phone-link:hover { color: var(--color-primary-700); text-decoration: underline; }
.visitus-hours-highlight { color: var(--color-primary-700); font-weight: var(--font-weight-medium); }

/* Maps Button */
.visitus-maps-btn {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
  margin: var(--space-4) var(--space-8) var(--space-6);
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary-600); color: #fff; border-radius: var(--radius-md);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-decoration: none;
  transition: background var(--transition-base);
}
.visitus-maps-btn:hover { background: var(--color-primary-700); }
.visitus-maps-arrow { transition: transform var(--transition-fast); }
.visitus-maps-btn:hover .visitus-maps-arrow { transform: translateX(3px); }

/* Map */
.visitus-map-wrapper {
  position: relative; min-height: 440px;
  background: var(--color-gray-100); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); overflow: hidden;
}
.visitus-map-badge {
  position: absolute; top: var(--space-4); left: var(--space-4); z-index: 10;
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-white); border: 1px solid var(--border-color); border-radius: var(--radius-sm);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-primary); pointer-events: none;
}
[data-theme="dark"] .visitus-map-badge { background: var(--bg-elevated); }
.visitus-map-iframe { width: 100%; height: 100%; min-height: 440px; border: none; display: block; }

/* Responsive */
@media (max-width: 1023px) {
  .visitus-grid { grid-template-columns: 1fr; }
  .visitus-map-wrapper, .visitus-map-iframe { min-height: 320px; }
}
@media (max-width: 768px) { .visitus-header { grid-template-columns: 1fr; } }
@media (max-width: 480px) {
  .visitus-section { padding: var(--space-16) var(--space-4); }
  .visitus-panel-header { padding: var(--space-6); }
  .visitus-info-item { padding: var(--space-5) var(--space-6); }
  .visitus-maps-btn { margin: var(--space-4) var(--space-6) var(--space-6); }
}
`;
