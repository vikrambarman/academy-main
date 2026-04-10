"use client";

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
    <>
      <style>{visitUsStyles}</style>

      <section className="visitus-section" aria-labelledby="visit-us-heading">
        
        {/* Background */}
        <div className="visitus-bg-pattern" aria-hidden="true" />
        
        <div className="visitus-container">
          
          {/* Header */}
          <div className="visitus-header">
            <div className="visitus-header-left">
              <div className="visitus-badge anim-fade-in">
                <span className="visitus-badge-line" />
                Find Us
              </div>
              <h2 id="visit-us-heading" className="visitus-title anim-slide-up">
                Visit Us in
                <br />
                <span className="visitus-title-highlight">Ambikapur</span>
              </h2>
            </div>
            <p className="visitus-description anim-fade-in-delay">
              Visit our training centre for course enquiries, admission guidance
              and free career counselling — walk in anytime during working hours.
            </p>
          </div>

          {/* Layout Grid */}
          <div className="visitus-grid">
            
            {/* Left - Info Panel */}
            <div className="visitus-info-panel anim-scale-1">
              
              {/* Panel Header */}
              <div className="visitus-panel-header">
                <div className="visitus-panel-icon">📍</div>
                <div>
                  <div className="visitus-panel-title">
                    Shivshakti Computer Academy
                  </div>
                  <div className="visitus-panel-subtitle">
                    Ambikapur, Surguja, Chhattisgarh
                  </div>
                </div>
              </div>

              {/* Info Items */}
              <div className="visitus-info-list">
                {infoItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="visitus-info-item">
                      <div className="visitus-info-icon">
                        <Icon size={18} strokeWidth={1.5} />
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
                              <a
                                key={i}
                                href={`tel:${phone.replace(/\s/g, "")}`}
                                className="visitus-phone-link"
                              >
                                {phone}
                              </a>
                            ))}
                          </div>
                        )}
                        {item.hours && (
                          <div className="visitus-info-text">
                            <div>{item.hours[0]}</div>
                            <div className="visitus-hours-highlight">
                              {item.hours[1]}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Maps Button */}
              <a
                href="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur"
                target="_blank"
                rel="noopener noreferrer"
                className="visitus-maps-btn"
              >
                <Navigation size={18} strokeWidth={2} />
                <span>Open in Google Maps</span>
                <span className="visitus-maps-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>

            {/* Right - Map */}
            <div className="visitus-map-wrapper anim-scale-2">
              {/* Location Badge */}
              <div className="visitus-map-badge">
                <MapPin size={14} strokeWidth={2} />
                Ambikapur, Chhattisgarh
              </div>

              {/* Map Iframe */}
              <iframe
                src="https://www.google.com/maps?q=Shivshakti+Computer+Academy+Ambikapur&output=embed"
                loading="lazy"
                title="Shivshakti Computer Academy Ambikapur Location Map"
                allowFullScreen
                className="visitus-map-iframe"
              />

              {/* Map Overlay Effect */}
              <div className="visitus-map-overlay" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const visitUsStyles = `
/* ==========================================
   VISIT US SECTION
   ========================================== */

.visitus-section {
  position: relative;
  padding: var(--space-24) var(--space-6);
  background: var(--bg-page);
  overflow: hidden;
}

/* Background Pattern */
.visitus-bg-pattern {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    var(--border-color) 1px,
    transparent 1px
  );
  background-size: 100% 60px;
  opacity: 0.3;
  z-index: 0;
}

.visitus-bg-pattern::before {
  content: "";
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border-color), transparent);
}

/* Container */
.visitus-container {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.visitus-header {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  align-items: end;
  margin-bottom: var(--space-14);
}

@media (min-width: 768px) {
  .visitus-header {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
  }
}

.visitus-badge {
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

.visitus-badge-line {
  width: 24px;
  height: 1.5px;
  background: var(--color-primary-600);
  flex-shrink: 0;
}

.visitus-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  color: var(--text-primary);
}

.visitus-title-highlight {
  color: var(--color-accent-600);
}

.visitus-description {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-light);
  line-height: 1.8;
  color: var(--text-secondary);
}

@media (min-width: 768px) {
  .visitus-description {
    padding-bottom: var(--space-1);
  }
}

/* Grid Layout */
.visitus-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: stretch;
}

@media (min-width: 1024px) {
  .visitus-grid {
    grid-template-columns: 1fr 1.4fr;
  }
}

/* Info Panel */
.visitus-info-panel {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

/* Panel Header */
.visitus-panel-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8);
  background: var(--color-gray-900);
  border-bottom: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

[data-theme="dark"] .visitus-panel-header {
  background: var(--color-gray-950, #0a0a0a);
}

.visitus-panel-header::after {
  content: "";
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 100px;
  height: 100px;
  background-image: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.15) 1.5px,
    transparent 1.5px
  );
  background-size: 12px 12px;
  pointer-events: none;
}

.visitus-panel-icon {
  font-size: 2rem;
}

.visitus-panel-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.95);
}

.visitus-panel-subtitle {
  font-size: 11px;
  font-weight: var(--font-weight-light);
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.45);
  margin-top: var(--space-1);
}

/* Info List */
.visitus-info-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.visitus-info-item {
  position: relative;
  display: flex;
  align-items: start;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--border-color);
  transition: background var(--transition-base);
}

.visitus-info-item:last-child {
  border-bottom: none;
}

.visitus-info-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary-600);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--transition-base);
}

.visitus-info-item:hover::before {
  transform: scaleY(1);
}

.visitus-info-item:hover {
  background: rgba(37, 99, 235, 0.05);
}

.visitus-info-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: var(--color-primary-600);
  flex-shrink: 0;
}

.visitus-info-label {
  font-size: 9px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}

.visitus-info-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  line-height: 1.65;
  color: var(--text-secondary);
}

.visitus-info-phones {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.visitus-phone-link {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-primary-600);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.visitus-phone-link:hover {
  color: var(--color-accent-600);
  text-decoration: underline;
}

.visitus-hours-highlight {
  color: var(--color-primary-600);
  font-weight: var(--font-weight-medium);
}

/* Maps Button */
.visitus-maps-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin: var(--space-4) var(--space-8) var(--space-6);
  padding: var(--space-4) var(--space-6);
  background: var(--color-primary-600);
  color: var(--color-white);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: all var(--transition-base);
}

.visitus-maps-btn:hover {
  background: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.visitus-maps-arrow {
  transition: transform var(--transition-fast);
}

.visitus-maps-btn:hover .visitus-maps-arrow {
  transform: translateX(4px);
}

/* Map Wrapper */
.visitus-map-wrapper {
  position: relative;
  min-height: 440px;
  background: rgba(37, 99, 235, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

.visitus-map-badge {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: rgba(17, 24, 39, 0.88);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  color: rgba(255, 255, 255, 0.95);
  pointer-events: none;
}

.visitus-map-iframe {
  width: 100%;
  height: 100%;
  min-height: 440px;
  border: none;
  display: block;
}

.visitus-map-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.02) 100%
  );
  pointer-events: none;
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

.anim-scale-1 {
  animation: scaleIn 0.6s ease-out 0.3s both;
}

.anim-scale-2 {
  animation: scaleIn 0.6s ease-out 0.4s both;
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
@media (max-width: 1023px) {
  .visitus-grid {
    grid-template-columns: 1fr;
  }

  .visitus-map-wrapper {
    min-height: 320px;
  }

  .visitus-map-iframe {
    min-height: 320px;
  }
}

@media (max-width: 768px) {
  .visitus-header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .visitus-panel-header {
    padding: var(--space-6);
  }

  .visitus-info-item {
    padding: var(--space-5);
  }

  .visitus-maps-btn {
    margin: var(--space-4) var(--space-5) var(--space-5);
  }
}
`;