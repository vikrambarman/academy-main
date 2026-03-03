import Link from "next/link";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

async function getLatestNotice() {
    try {
        await connectDB();

        const notice = await Notice.findOne({
            isActive: true,
            isPublished: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        return notice ? JSON.parse(JSON.stringify(notice)) : null;
    } catch {
        return null;
    }
}

export default async function BreakingNotice() {
    const notice = await getLatestNotice();

    if (!notice) return null;

    return (
        <div className="bg-red-600 text-white text-sm">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-2 flex items-center justify-between">

                <div className="flex items-center gap-3 truncate">
                    <span className="font-semibold">🔥 New Notice:</span>
                    <span className="truncate">{notice.title}</span>
                </div>

                <Link
                    href={`/notices/${notice.slug}`}
                    className="underline hover:text-gray-200 whitespace-nowrap"
                >
                    Read More →
                </Link>
            </div>
        </div>
    );
}