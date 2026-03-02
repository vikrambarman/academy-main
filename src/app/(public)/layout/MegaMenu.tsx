import Link from "next/link";

interface Props {
    active: string | null;
}

export default function MegaMenu({ active }: Props) {
    if (!active) return null;

    return (
        <div className="absolute left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-fadeIn">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-3 gap-12">

                {active === "academy" && (
                    <>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
                                Academy
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><Link href="/about">About Us</Link></li>
                                <li><Link href="/accreditations">Accreditations</Link></li>
                                <li><Link href="/gallery">Gallery</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
                                Recognition
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><Link href="/msme">MSME Registration</Link></li>
                                <li><Link href="/affiliations">Affiliations</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
                                Campus
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><Link href="/infrastructure">Infrastructure</Link></li>
                            </ul>
                        </div>
                    </>
                )}

                {active === "resources" && (
                    <>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
                                Resources
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><Link href="/notices">Notices</Link></li>
                                <li><Link href="/verify-certificate">Verify Certificate</Link></li>
                                <li><Link href="/faq">FAQ</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
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