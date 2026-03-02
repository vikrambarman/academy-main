"use client";

export default function FloatingWhatsapp() {
    return (
        <a
            href="https://wa.me/919009087883"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Chat on WhatsApp"
        >
            {/* Pulse Ring */}
            <span className="absolute inset-0 rounded-full bg-green-500 opacity-40 animate-ping"></span>

            {/* Button */}
            <div className="relative w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-xl hover:scale-110 transition duration-300">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-7 h-7 fill-white"
                >
                    <path d="M16.002 3C9.373 3 4 8.373 4 15.002c0 2.65.867 5.095 2.331 7.073L4 29l7.09-2.303A11.95 11.95 0 0 0 16.002 27C22.63 27 28 21.627 28 15.002 28 8.373 22.63 3 16.002 3zm0 21.75c-2.197 0-4.25-.653-5.967-1.77l-.427-.27-4.205 1.366 1.37-4.1-.28-.42A9.69 9.69 0 0 1 6.31 15c0-5.353 4.352-9.705 9.692-9.705 5.353 0 9.705 4.352 9.705 9.705 0 5.34-4.352 9.75-9.705 9.75zm5.475-7.34c-.3-.15-1.777-.877-2.052-.977-.273-.1-.472-.15-.672.15-.2.3-.772.977-.947 1.177-.175.2-.35.225-.65.075-.3-.15-1.266-.467-2.413-1.49-.892-.795-1.495-1.777-1.67-2.077-.175-.3-.02-.463.13-.613.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.672-1.627-.92-2.227-.242-.58-.487-.5-.672-.51l-.572-.01c-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.225 5.13 4.522.718.31 1.277.495 1.713.633.72.23 1.375.197 1.892.12.577-.086 1.777-.725 2.027-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
                </svg>
            </div>

            {/* Tooltip */}
            <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition">
                Chat with us
            </span>
        </a>
    );
}