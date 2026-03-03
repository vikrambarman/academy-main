import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-gray-400">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

                    {/* Brand Section */}
                    <div>
                        <h3 className="text-white font-semibold text-xl">
                            Shivshakti Computer Academy
                        </h3>

                        <p className="mt-5 text-sm leading-relaxed">
                            Leading computer training institute in Ambikapur, Surguja,
                            offering DCA, PGDCA, ADCA, Tally, CCC and government-recognized
                            certification programs.
                        </p>

                        {/* Contact Numbers */}
                        <div className="mt-6 space-y-3 text-sm">

                            {/* Call */}
                            <div className="flex items-center gap-2">
                                <Phone size={14} />
                                <a
                                    href="tel:+917477036832"
                                    className="hover:text-white transition"
                                >
                                    Call: +91 7477036832
                                </a>
                            </div>

                            {/* WhatsApp */}
                            <div className="flex items-center gap-2">
                                <Phone size={14} />
                                <a
                                    href="https://wa.me/919009087883"
                                    target="_blank"
                                    className="hover:text-white transition"
                                >
                                    WhatsApp: +91 9009087883
                                </a>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-2">
                                <Mail size={14} />
                                <a
                                    href="mailto:shivshakticomputeracademy25@gmail.com"
                                    className="hover:text-white transition"
                                >
                                    shivshakticomputeracademy25@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Social */}
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="hover:text-white transition">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-wide">
                            Quick Links
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/courses" className="hover:text-white transition">Computer Courses in Ambikapur</Link></li>
                            <li><Link href="/gallery" className="hover:text-white transition">Gallery</Link></li>
                            <li><Link href="/accreditations" className="hover:text-white transition">Accreditations</Link></li>
                            <li><Link href="/notices" className="hover:text-white transition">Latest Notices</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition">Contact Institute</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-wide">
                            Student Resources
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/verify-certificate" className="hover:text-white transition">Verify Certificate Online</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
                            <li><Link href="/student-login" className="hover:text-white transition">Student Login</Link></li>
                            <li><Link href="/admin-login" className="hover:text-white transition">Admin Portal</Link></li>
                        </ul>
                    </div>

                    {/* Location Structured */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-wide">
                            Our Address
                        </h4>

                        <address className="not-italic text-sm leading-relaxed">
                            <strong>Shivshakti Computer Academy</strong><br />
                            1st Floor, Above Usha Matching Center<br />
                            Near Babra Petrol Pump<br />
                            Banaras Road, Phunderdihari<br />
                            Ambikapur, Dist: Surguja<br />
                            Chhattisgarh – 497001, India<br />
                            Mon–Sat: 8AM – 6PM
                        </address>

                        <Link
                            href="/enquiry"
                            className="inline-block mt-6 px-6 py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition"
                        >
                            Admission Enquiry
                        </Link>
                    </div>

                </div>

                {/* Divider */}
                <div className="mt-20 border-t border-gray-800 pt-8">

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">

                        <p className="text-gray-500 text-center md:text-left">
                            © {new Date().getFullYear()} Shivshakti Computer Academy, Ambikapur. All rights reserved.
                        </p>

                        <div className="flex gap-6 text-gray-500">
                            <Link href="/privacy-policy" className="hover:text-white transition">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition">
                                Terms & Conditions
                            </Link>
                            <Link href="/refund-policy" className="hover:text-white transition">
                                Refund Policy
                            </Link>
                        </div>

                    </div>

                </div>

            </div>
        </footer>
    );
}