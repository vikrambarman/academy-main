"use client"

import Image from "next/image";

const affiliations = [
    { title:"ISO 9001:2015 Certified",           description:"International quality standards for education management and professional training delivery.",                              image:"/images/accreditations/iso.jpg",      badge:"Quality"          },
    { title:"Gramin Skill Development Mission",   description:"Authorized training centre aligned with Skill India initiatives and government-recognized diploma programs.",              image:"/images/affiliations/gsdm.jpg",        badge:"Govt. Authorized"  },
    { title:"Drishti Computer Education",         description:"Authorized franchise partner providing verified certification for professional courses.",                                  image:"/images/affiliations/drishti.jpg",     badge:"Franchise Partner" },
    { title:"Skill India & NSDC",                 description:"Selected course certificates verifiable through Skill India and NSDC platforms.",                                         image:"/images/affiliations/skillindia.jpg",  badge:"Skill India"       },
    { title:"DigiLocker Enabled",                 description:"Diploma certificates accessible digitally via DigiLocker with lifetime verification.",                                    image:"/images/affiliations/digilocker.jpg", badge:"Digital"           },
    { title:"MSME Registered Institute",          description:"Government-registered MSME institute ensuring authenticity and legal compliance.",                                         image:"/images/accreditations/msme.jpg",      badge:"Registered"        },
];

const stripItems = ["Skill India","NSDC","DigiLocker","ISO 9001:2015","MSME Udyam","GSDM"];

export default function PartnersAndCertifications() {
    return (
        <>
            <style>{`
                .pac-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--color-border), transparent);
                }
                .pac-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--color-primary);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.28s ease;
                }
                .pac-card:hover::before { transform: scaleX(1); }
                .pac-card-dash { transition: width 0.28s ease; }
                .pac-card:hover .pac-card-dash { width: 48px; }
            `}</style>

            <section
                className="pac-root relative overflow-hidden py-20 md:py-24 px-6"
                style={{ background:"var(--color-bg)" }}
                aria-labelledby="affiliations-heading"
            >
                <div className="max-w-[1100px] mx-auto">

                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-end mb-12 md:mb-14">
                        <div>
                            <div className="flex items-center gap-2 mb-3.5 text-[10px] font-medium tracking-[0.18em] uppercase"
                                style={{ color:"var(--color-primary)" }}>
                                <span style={{ display:"inline-block", width:24, height:1.5, background:"var(--color-primary)", flexShrink:0 }} />
                                Recognitions
                            </div>
                            <h2 id="affiliations-heading"
                                className="font-serif font-bold leading-[1.2]"
                                style={{ fontSize:"clamp(1.8rem,3vw,2.5rem)", color:"var(--color-text)" }}>
                                Our Partners &<br />
                                <em className="not-italic" style={{ color:"var(--color-accent)" }}>Certifications</em>
                            </h2>
                        </div>
                        <p className="text-[0.88rem] font-light leading-[1.8] md:pb-1"
                            style={{ color:"var(--color-text-muted)" }}>
                            Government-recognized certifications and authorized training
                            partnerships ensuring transparency and credibility for every student we train.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-[20px] overflow-hidden"
                        style={{ background:"var(--color-border)", border:"1px solid var(--color-border)" }}>
                        {affiliations.map((item) => (
                            <div key={item.title}
                                className="pac-card group relative flex flex-col p-8 md:p-9 transition-colors duration-200"
                                style={{ background:"var(--color-bg-card)" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary) 5%,var(--color-bg-card))")}
                                onMouseLeave={e => (e.currentTarget.style.background = "var(--color-bg-card))")}>

                                {/* Logo + badge */}
                                <div className="relative mb-6 shrink-0" style={{ width:80, height:52 }}>
                                    <Image src={item.image} alt={item.title} fill sizes="80px" className="object-contain" />
                                    <span className="absolute -top-2 -right-2 text-[8px] font-medium tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full whitespace-nowrap"
                                        style={{
                                            color:"var(--color-primary)",
                                            background:"color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))",
                                            border:"1px solid color-mix(in srgb,var(--color-primary) 22%,transparent)",
                                        }}>
                                        {item.badge}
                                    </span>
                                </div>

                                <h3 className="font-serif text-[0.98rem] font-semibold leading-[1.35] mb-2.5"
                                    style={{ color:"var(--color-text)" }}>{item.title}</h3>

                                <p className="text-[0.78rem] font-light leading-[1.75] flex-1"
                                    style={{ color:"var(--color-text-muted)" }}>{item.description}</p>

                                <div className="pac-card-dash h-0.5 rounded-full mt-5"
                                    style={{ width:24, background:"var(--color-primary)" }}
                                    aria-hidden="true" />
                            </div>
                        ))}
                    </div>

                    {/* Trust strip */}
                    <div className="flex items-center flex-wrap justify-center gap-3 mt-6 rounded-2xl px-7 md:px-8 py-5"
                        style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border)" }}
                        aria-label="Quick recognition summary">
                        <span className="text-[10px] font-medium tracking-[0.14em] uppercase whitespace-nowrap shrink-0"
                            style={{ color:"var(--color-text-muted)" }}>
                            Verified by
                        </span>
                        <div className="w-px h-4 shrink-0 max-sm:hidden"
                            style={{ background:"var(--color-border)" }} aria-hidden="true" />
                        {stripItems.map((item, i) => (
                            <span key={item} className="contents">
                                <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-normal whitespace-nowrap"
                                    style={{ color:"var(--color-text)" }}>
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ background:"var(--color-primary)" }} aria-hidden="true" />
                                    {item}
                                </span>
                                {i < stripItems.length - 1 && (
                                    <span className="w-px h-4 shrink-0 max-sm:hidden"
                                        style={{ background:"var(--color-border)" }} aria-hidden="true" />
                                )}
                            </span>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}