import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Course from "@/models/Course";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {

    try {

        await connectDB();

        const user: any = await verifyUser();

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const formData = await req.formData();

        const file = formData.get("file") as File;
        const courseId = formData.get("courseId") as string;

        if (!file || !courseId) {
            return NextResponse.json(
                { message: "File or courseId missing" },
                { status: 400 }
            );
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult: any = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "courses",
                    public_id: course.slug,
                    overwrite: true,
                    transformation: [
                        { width: 1200, height: 630, crop: "fill" },
                        { quality: "auto:eco" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            stream.end(buffer);

        });

        course.banner = uploadResult.secure_url;
        await course.save();

        return NextResponse.json({
            banner: uploadResult.secure_url
        });

    } catch (error) {

        console.error("BANNER UPLOAD ERROR:", error);

        return NextResponse.json(
            { message: "Upload failed" },
            { status: 500 }
        );
    }
}