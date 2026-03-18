import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import CourseFranchiseConfig from "@/models/CourseFranchiseConfig";
import "@/models/Franchise";
import "@/models/CertificateType";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const courses = await Course.find({ isActive: true })
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();

        // Har course ke liye franchise configs fetch karo
        const courseIds = courses.map((c: any) => c._id);

        // isActive filter hata diya — purane configs bhi aayenge
        const configs = await CourseFranchiseConfig.find({
            course: { $in: courseIds },
        })
            .populate("franchise", "name code registeredBodies isOwn portalLoginRequired")
            .populate("defaultCertType", "name code issuingBody verificationMethod verificationUrl")
            .lean();

        // Course ID → configs map
        // DEBUG: log configs count
        console.log(`[PUBLIC API] Found ${configs.length} franchise configs for ${courses.length} courses`);
        configs.forEach((cfg: any) => {
            console.log(`  Config: course=${cfg.course}, franchise=${cfg.franchise?.name}, certType=${cfg.defaultCertType?.name}`);
        });

        const configMap: Record<string, any[]> = {};
        configs.forEach((cfg: any) => {
            const cid = cfg.course.toString();
            if (!configMap[cid]) configMap[cid] = [];
            configMap[cid].push(cfg);
        });

        // Har course mein franchiseOptions attach karo
        const enrichedCourses = courses.map((c: any) => ({
            ...c,
            franchiseOptions: configMap[c._id.toString()] || [],
        }));

        return NextResponse.json(
            { success: true, data: enrichedCourses },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );

    } catch (error) {
        console.error("Public Courses Fetch Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}