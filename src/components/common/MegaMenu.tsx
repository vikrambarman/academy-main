import Link from "next/link";

interface Props { active: string | null; closeMenu: () => void; }

const academyLinks = [
    { href:"/about",          label:"About Us",       desc:"Our story, mission & vision",   icon:"🏫", highlight:false, teacher:false },
    { href:"/accreditations", label:"Accreditations", desc:"Certifications & quality marks", icon:"🎖️", highlight:false, teacher:false },
    { href:"/gallery",        label:"Gallery",         desc:"Photos from our campus",         icon:"🖼️", highlight:false, teacher:false },
];
const recognitionLinks = [
    { href:"/msme",         label:"MSME Registration", desc:"Govt. registered institute", icon:"🏛️", highlight:false, teacher:false },
    { href:"/affiliations", label:"Affiliations",       desc:"Our partners & tie-ups",    icon:"🤝", highlight:false, teacher:false },
];
const resourceLinks = [
    { href:"/notices",            label:"Notices",            desc:"Admissions & announcements",    icon:"📢", highlight:true,  teacher:false },
    { href:"/verify-certificate", label:"Verify Certificate", desc:"Check your certificate online", icon:"🔍", highlight:false, teacher:false },
    { href:"/faq",                label:"FAQ",                desc:"Common questions answered",     icon:"❓", highlight:false, teacher:false },
];
const portalLinks = [
    { href:"/admin/login",   label:"Admin Login",   desc:"Staff & admin access",       icon:"🔐", highlight:false, teacher:false },
    { href:"/teacher/login", label:"Teacher Login", desc:"Teacher portal access",      icon:"🎓", highlight:false, teacher:true  },
    { href:"/student/login", label:"Student Login", desc:"Access your student portal", icon:"📚", highlight:false, teacher:false },
];

export default function MegaMenu({ active, closeMenu }: Props) {
    if (!active) return null;

    return (
        <div className="absolute left-0 right-0 z-40 animate-[mmFadeIn_0.18s_ease_both]"
            style={{
                background:"var(--color-bg)",
                borderBottom:"1px solid var(--color-border)",
                boxShadow:"0 16px 48px color-mix(in srgb,var(--color-primary) 10%,transparent)",
            }}>
            <style>{`
                @keyframes mmFadeIn {
                    from { opacity:0; transform:translateY(-6px); }
                    to   { opacity:1; transform:translateY(0); }
                }
            `}</style>
            <div className="max-w-[1100px] mx-auto px-6 py-9 grid grid-cols-2 gap-12">
                {active === "academy" && (
                    <>
                        <MegaCol label="Academy"     links={academyLinks}     closeMenu={closeMenu} />
                        <MegaCol label="Recognition" links={recognitionLinks} closeMenu={closeMenu} />
                    </>
                )}
                {active === "resources" && (
                    <>
                        <MegaCol label="Resources" links={resourceLinks} closeMenu={closeMenu} showNew />
                        <MegaCol label="Portals"   links={portalLinks}   closeMenu={closeMenu} />
                    </>
                )}
            </div>
        </div>
    );
}

function MegaCol({ label, links, closeMenu, showNew }: {
    label: string;
    links: { href:string; label:string; desc:string; icon:string; highlight:boolean; teacher:boolean }[];
    closeMenu: () => void;
    showNew?: boolean;
}) {
    return (
        <div>
            {/* Column label */}
            <div className="flex items-center gap-2 mb-5 text-[9px] font-medium tracking-[0.18em] uppercase"
                style={{ color:"var(--color-primary)" }}>
                <span style={{ display:"inline-block", width:16, height:1.5, background:"var(--color-primary)", flexShrink:0 }} />
                {label}
            </div>

            {links.map(l => (
                <Link key={l.href} href={l.href} onClick={closeMenu}
                    className="group relative flex items-start gap-3 px-3 py-2.5 rounded-xl mb-0.5 no-underline transition-colors duration-200"
                    style={{}}
                    onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = l.teacher
                            ? "color-mix(in srgb,#0F766E 8%,var(--color-bg))"
                            : "color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))";
                    }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                    {/* Left accent bar */}
                    <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200"
                        style={{ background: l.teacher ? "#0F766E" : "var(--color-primary)" }} />

                    {/* Icon box */}
                    <span className="w-8 h-8 shrink-0 rounded-[9px] text-[0.82rem] flex items-center justify-center border transition-colors duration-200"
                        style={
                            l.teacher   ? { background:"color-mix(in srgb,#0F766E 10%,var(--color-bg))", border:"1px solid color-mix(in srgb,#0F766E 25%,transparent)" } :
                            l.highlight ? { background:"color-mix(in srgb,var(--color-accent) 10%,var(--color-bg))", border:"1px solid color-mix(in srgb,var(--color-accent) 25%,transparent)" } :
                                          { background:"color-mix(in srgb,var(--color-primary) 8%,var(--color-bg))", border:"1px solid color-mix(in srgb,var(--color-primary) 20%,transparent)" }
                        }>
                        {l.icon}
                    </span>

                    {/* Text */}
                    <div>
                        <div className="text-[0.85rem] font-medium leading-snug mb-0.5"
                            style={{ color: l.highlight ? "var(--color-accent)" : l.teacher ? "#0F766E" : "var(--color-text)" }}>
                            {l.label}
                            {showNew && l.highlight && (
                                <span className="inline-flex items-center ml-1.5 align-middle text-[8px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full"
                                    style={{ background:"var(--color-accent)", color:"#fff" }}>
                                    New
                                </span>
                            )}
                        </div>
                        <div className="text-[0.73rem] font-light leading-snug"
                            style={{ color:"var(--color-text-muted)" }}>
                            {l.desc}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}