/**
 * POST /api/admin/courses/upload-banner
 * Cloudinary banner upload for course
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Course         from "@/models/Course";
import cloudinary     from "@/lib/cloudinary";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message))
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const formData = await req.formData();
        const file     = formData.get("file")     as File | null;
        const courseId = formData.get("courseId") as string | null;

        if (!file || !courseId)
            return NextResponse.json({ message: "File aur courseId required hain" }, { status: 400 });

        const course = await Course.findById(courseId);
        if (!course)
            return NextResponse.json({ message: "Course not found" }, { status: 404 });

        const buffer = Buffer.from(await file.arrayBuffer());

        const result: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder:      "courses",
                    public_id:   course.slug,
                    overwrite:   true,
                    transformation: [
                        { width: 1200, height: 630, crop: "fill" },
                        { quality: "auto:eco" },
                    ],
                },
                (error, res) => error ? reject(error) : resolve(res)
            );
            stream.end(buffer);
        });

        course.banner = result.secure_url;
        await course.save();

        return NextResponse.json({ banner: result.secure_url });
    } catch (e: any) { return handleError(e, "POST /api/admin/courses/upload-banner"); }
}