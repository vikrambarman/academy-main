import Link from "next/link";

interface Props {
    active: string | null;
    closeMenu: () => void;
}

export default function MegaMenu({ active, closeMenu }: Props) {
    if (!active) return null;

    return (
        <div className="absolute left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-fadeIn z-40">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 gap-12">

                {active === "academy" && (
                    <>
                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase">
                                Academy
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><Link href="/about" onClick={closeMenu}>About Us</Link></li>
                                <li><Link href="/accreditations" onClick={closeMenu}>Accreditations</Link></li>
                                <li><Link href="/gallery" onClick={closeMenu}>Gallery</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase">
                                Recognition
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><Link href="/msme" onClick={closeMenu}>MSME Registration</Link></li>
                                <li><Link href="/affiliations" onClick={closeMenu}>Affiliations</Link></li>
                            </ul>
                        </div>
                    </>
                )}

                {active === "resources" && (
                    <>
                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase">
                                Resources
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><Link href="/notices" onClick={closeMenu}>Notices</Link></li>
                                <li><Link href="/verify-certificate" onClick={closeMenu}>Verify Certificate</Link></li>
                                <li><Link href="/faq" onClick={closeMenu}>FAQ</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase">
                                Portals
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><Link href="/login">Student Login</Link></li>
                                <li><Link href="/login">Admin Login</Link></li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}