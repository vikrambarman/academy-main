import Link from "next/link";

interface Props {
    active: string | null;
    closeMenu: () => void;
}

export default function MegaMenu({ active, closeMenu }: Props) {
    if (!active) return null;

    return (
        <div className="absolute left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-fadeIn z-40">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 gap-16">

                {/* ================= ACADEMY ================= */}
                {active === "academy" && (
                    <>
                        <div>
                            <h4 className="text-xs font-semibold mb-6 uppercase tracking-wider text-gray-500">
                                Academy
                            </h4>

                            <ul className="space-y-4 text-sm">
                                <li>
                                    <Link
                                        href="/about"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        About Us
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/accreditations"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        Accreditations
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/gallery"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        Gallery
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold mb-6 uppercase tracking-wider text-gray-500">
                                Recognition
                            </h4>

                            <ul className="space-y-4 text-sm">
                                <li>
                                    <Link
                                        href="/msme"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        MSME Registration
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/affiliations"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        Affiliations
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </>
                )}

                {/* ================= RESOURCES ================= */}
                {active === "resources" && (
                    <>
                        <div>
                            <h4 className="text-xs font-semibold mb-6 uppercase tracking-wider text-gray-500">
                                Resources
                            </h4>

                            <ul className="space-y-4 text-sm">

                                {/* 🔥 Highlighted Notices */}
                                <li>
                                    <Link
                                        href="/notices"
                                        onClick={closeMenu}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition"
                                    >
                                        <span>Notices</span>

                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            NEW
                                        </span>
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/verify-certificate"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        Verify Certificate
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/faq"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold mb-6 uppercase tracking-wider text-gray-500">
                                Portals
                            </h4>

                            <ul className="space-y-4 text-sm">
                                <li>
                                    <Link
                                        href="/student/login"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        Student Login
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/admin/login"
                                        onClick={closeMenu}
                                        className="hover:text-black transition"
                                    >
                                        Admin Login
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}