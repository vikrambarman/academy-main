import VerificationForm from "@/components/verify/VerificationForm";
import VerificationInfo from "@/components/verify/VerificationInfo";

export const metadata = {
    title: "Certificate Verification | Shivshakti Computer Academy",
    description:
        "Verify your certificates issued through Shivshakti Computer Academy via official authorities like Drishti, GSDM, NSDC, and DigiLocker.",
};

export default function VerifyCertificatePage() {
    return (
        <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-semibold text-gray-900">
                        Certificate Verification
                    </h2>

                    <p className="mt-4 text-gray-600 text-lg">
                        Verify certificates through official issuing authorities.
                    </p>
                </div>

                {/* Layout */}
                <div className="mt-20 grid md:grid-cols-2 gap-12 items-start">
                    <VerificationForm />
                    <VerificationInfo />
                </div>

            </div>
        </section>
    );
}