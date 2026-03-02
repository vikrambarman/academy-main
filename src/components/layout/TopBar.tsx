import Link from "next/link";

export default function TopBar() {
    return (
        <div className="bg-black text-gray-300 text-xs">
            <div className="max-w-7xl mx-auto px-6 md:px-12 h-8 flex items-center justify-between">

                <div className="hidden md:flex gap-6 opacity-80">
                    <span>📞 +91 74770 36832</span>
                    <span>📍 Ambikapur, Chhattisgarh</span>
                    <span>Mon–Sat 8AM–6PM</span>
                </div>

                <div className="flex gap-4 ml-auto">
                    <Link href="/login" className="hover:text-white transition">
                        Student Login
                    </Link>
                    <Link href="/login" className="hover:text-white transition">
                        Admin
                    </Link>
                </div>

            </div>
        </div>
    );
}