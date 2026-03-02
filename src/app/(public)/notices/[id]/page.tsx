import { notFound } from "next/navigation";
import Link from "next/link";
import { getNoticeById } from "@/lib/notices";

type Props = {
    params: {
        id: string;
    };
};

export default async function NoticeDetailPage({ params }: Props) {
    const notice = await getNoticeById(params.id);

    if (!notice) {
        return notFound();
    }

    return (
        <section className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-28">
            <div className="max-w-4xl mx-auto px-6">

                {/* Back Link */}
                <Link
                    href="/notices"
                    className="text-sm font-medium text-gray-600 hover:underline"
                >
                    ← Back to Notices
                </Link>

                {/* Header */}
                <div className="mt-8">

                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-4 py-1 rounded-full">
                        {notice.label}
                    </span>

                    <h1 className="mt-6 text-3xl md:text-4xl font-semibold text-gray-900 leading-snug">
                        {notice.title}
                    </h1>

                    <div className="mt-6 w-20 h-1 bg-black rounded-full"></div>

                </div>

                {/* Content */}
                <div className="mt-10 text-gray-700 leading-relaxed space-y-6 text-base">
                    <p>
                        {notice.desc}
                    </p>

                    {/* Future: Full HTML content can go here */}
                    <p>
                        This notice was officially released by Shivshakti Computer Academy.
                        Students are advised to follow the instructions carefully and stay
                        updated through official communication channels.
                    </p>

                    <p>
                        For further clarification, students may contact the academy office
                        during working hours.
                    </p>
                </div>

                {/* CTA Section */}
                <div className="mt-14 border-t pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                    <Link
                        href="/contact"
                        className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition text-center"
                    >
                        Contact Academy
                    </Link>

                    <Link
                        href="/notices"
                        className="text-sm font-medium text-black hover:underline text-center"
                    >
                        View All Notices →
                    </Link>

                </div>

            </div>
        </section>
    );
}