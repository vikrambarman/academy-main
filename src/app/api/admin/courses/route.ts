/**
 * FULL COURSE API
 * ------------------
 * GET    → Fetch all courses
 * POST   → Create course
 * PUT    → Update course
 * DELETE → Delete course
 * PATCH  → Toggle isActive
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { verifyUser } from "@/lib/verifyUser";
import slugify from "slugify";
import {
    COURSE_LEVELS,
    COURSE_DESIGNED_FOR_MAP,
} from "@/lib/constants/courseConfig";

/* -------------------- GET -------------------- */
export async function GET() {
    try {
        await connectDB();
        const courses = await Course.find().sort({ createdAt: -1 });
        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}

/* -------------------- POST (CREATE) -------------------- */
export async function POST(req: Request) {
    try {
        await connectDB();

        const user: any = await verifyUser();

        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const body = await req.json();

        const {
            name,
            level,
            duration,
            eligibility,
            certificate,
            syllabus,
        } = body;

        if (!name || !level) {
            return NextResponse.json(
                { message: "Name and Level required" },
                { status: 400 }
            );
        }

        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true,
        });

        const existing = await Course.findOne({ slug });

        if (existing) {
            return NextResponse.json(
                { message: "Course already exists" },
                { status: 400 }
            );
        }

        const levelConfig = COURSE_LEVELS.find(
            (l) => l.level === level
        );

        if (!levelConfig) {
            return NextResponse.json(
                { message: "Invalid level selected" },
                { status: 400 }
            );
        }

        // 🔹 Clean syllabus (prevent empty module/topic crash)

        const cleanSyllabus =
            syllabus
                ?.filter((mod: any) => mod.module?.trim() !== "")
                .map((mod: any) => ({
                    module: mod.module.trim(),
                    topics:
                        mod.topics
                            ?.map((t: string) => t.trim())
                            .filter((t: string) => t !== "") || [],
                })) || [];

        // 🔹 Auto DesignedFor

        let autoDesignedFor: string[] = [];

        const lowerName = name.toLowerCase();

        for (const item of COURSE_DESIGNED_FOR_MAP) {
            if (
                item.match.some((keyword) =>
                    lowerName.includes(keyword)
                )
            ) {
                autoDesignedFor = item.designedFor;
                break;
            }
        }

        const course = await Course.create({
            name,
            slug,
            level,
            authority: levelConfig.authority,
            verification: levelConfig.verification,
            duration,
            eligibility,
            certificate,
            syllabus: cleanSyllabus,
            designedFor: autoDesignedFor,
            careerOpportunities: [],
        });

        return NextResponse.json(course);
    } catch (error: any) {

        if (
            error.message === "NO_TOKEN" ||
            error.message === "TOKEN_EXPIRED"
        ) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        console.error("COURSE CREATE ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

/* -------------------- PUT (UPDATE) -------------------- */
export async function PUT(req: Request) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const {
            id,
            name,
            level,
            duration,
            eligibility,
            certificate,
            syllabus,
        } = body;

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        // Regenerate slug if name changed
        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true,
        });

        const levelConfig = COURSE_LEVELS.find(
            (l) => l.level === level
        );

        if (!levelConfig) {
            return NextResponse.json(
                { message: "Invalid level selected" },
                { status: 400 }
            );
        }

        // Auto DesignedFor update
        let autoDesignedFor: string[] = [];
        const lowerName = name.toLowerCase();

        for (const item of COURSE_DESIGNED_FOR_MAP) {
            if (
                item.match.some((keyword) =>
                    lowerName.includes(keyword)
                )
            ) {
                autoDesignedFor = item.designedFor;
                break;
            }
        }

        course.name = name;
        course.slug = slug;
        course.level = level;
        course.authority = levelConfig.authority;
        course.verification = levelConfig.verification;
        course.duration = duration;
        course.eligibility = eligibility;
        course.certificate = certificate;
        course.syllabus = syllabus;
        course.designedFor = autoDesignedFor;

        await course.save();

        return NextResponse.json(course);
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

/* -------------------- DELETE -------------------- */
export async function DELETE(req: Request) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Course ID required" },
                { status: 400 }
            );
        }

        await Course.findByIdAndDelete(id);

        return NextResponse.json({ message: "Deleted" });
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

/* -------------------- PATCH (TOGGLE ACTIVE) -------------------- */
export async function PATCH(req: Request) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const { id, isActive } = await req.json();

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        course.isActive = isActive;
        await course.save();

        return NextResponse.json(course);
    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}