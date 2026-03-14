import Link from "next/link";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";

async function getLatestNotice() {
    try {
        await connectDB();
        const notice = await Notice.findOne({ isActive: true, isPublished: true })
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
        <>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    display: inline-block;
                    white-space: nowrap;
                    animation: marquee 25s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                .pulse-red {
                    animation: pulse-red 2s infinite;
                }
                @keyframes pulse-red {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }
            `}</style>

            {/* Main Bar: Using a deep dark background for maximum contrast */}
            <div className="relative z-[50] w-full overflow-hidden border-b border-white/10 bg-[#0f172a] text-white shadow-lg">
                <div className="max-w-[1400px] mx-auto flex items-center h-11">
                    
                    {/* Fixed "Breaking" Label: Bright Yellow/Red for attention */}
                    <div className="relative z-20 flex items-center h-full px-5 bg-red-600 shadow-[5px_0_15px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center gap-2.5">
                            <span className="pulse-red h-2 w-2 rounded-full bg-white"></span>
                            <span className="text-[11px] font-black tracking-widest uppercase text-white">
                                UPDATES
                            </span>
                        </div>
                        {/* Angled cut effect */}
                        <div className="absolute top-0 -right-3 h-full w-4 bg-red-600 skew-x-[-15deg]"></div>
                    </div>

                    {/* Scrolling Text Area */}
                    <div className="relative flex-1 overflow-hidden flex items-center h-full bg-[#1e293b]">
                        <div className="animate-marquee">
                            <Link 
                                href={`/notices/${notice.slug}`}
                                className="inline-flex items-center gap-6 text-[13px] font-semibold text-slate-100 hover:text-yellow-400 transition-colors"
                            >
                                <span className="ml-8 uppercase tracking-wide">
                                    {notice.title} — 
                                    <span className="font-normal normal-case text-slate-300 ml-2">
                                        {notice.excerpt || "Visit the notice board for more details."}
                                    </span>
                                </span>
                                
                                <span className="bg-white/10 px-3 py-1 rounded-md text-[10px] font-bold text-yellow-400 border border-white/20">
                                    READ FULL NOTICE →
                                </span>
                                
                                {/* Large gap for the loop */}
                                <span className="inline-block w-[150px]"></span>
                            </Link>
                        </div>
                        
                        {/* Fade effect on sides to make text "appear" and "disappear" */}
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#1e293b] to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#1e293b] to-transparent z-10"></div>
                    </div>

                </div>
            </div>
        </>
    );
}