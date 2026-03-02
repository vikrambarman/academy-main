import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* About */}
                    <div>
                        <h3 className="text-white font-semibold text-lg">
                            Shivshakti Computer Academy
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed">
                            Government-recognized computer training institute in Ambikapur
                            providing practical education, digital certifications and
                            career-oriented skill programs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/courses">Courses</Link></li>
                            <li><Link href="/gallery">Gallery</Link></li>
                            <li><Link href="/accreditations">Accreditations</Link></li>
                            <li><Link href="/notices">Notices</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            Resources
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/verify-certificate">Verify Certificate</Link></li>
                            <li><Link href="/student-login">Student Login</Link></li>
                            <li><Link href="/admin-login">Admin Login</Link></li>
                            <li><Link href="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            Contact
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>Ambikapur, Chhattisgarh</li>
                            <li>
                                <a href="tel:+917477036832" className="hover:text-white">
                                    +91 74770 36832
                                </a>
                            </li>
                            <li>Mon–Sat 8AM–6PM</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-16 border-t border-gray-800 pt-8 text-sm flex flex-col md:flex-row justify-between items-center gap-4">

                    <p>
                        © {new Date().getFullYear()} Shivshakti Computer Academy. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms">Terms & Conditions</Link>
                    </div>

                </div>

            </div>
        </footer>
    );
}