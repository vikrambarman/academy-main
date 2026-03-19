/**
 * GET   /api/admin/courses        — Sabhi courses
 * POST  /api/admin/courses        — Naya course create
 * PUT   /api/admin/courses        — Course update
 * PATCH /api/admin/courses        — Toggle isActive
 * DELETE /api/admin/courses?id=xx — Course delete
 */

import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { connectDB }      from "@/lib/db";
import { verifyUser }     from "@/lib/verifyUser";
import Course             from "@/models/Course";
import { COURSE_LEVELS }  from "@/lib/constants/courseConfig";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const validLevels = () => COURSE_LEVELS.map((l: any) => l.level);

function cleanSyllabus(syllabus: any[]) {
    return (syllabus || [])
        .filter((m: any) => m.module?.trim())
        .map((m: any) => ({
            module: m.module.trim(),
            topics: (m.topics || []).map((t: string) => t.trim()).filter(Boolean),
        }));
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET() {
    try {
        await connectDB();
        await requireAdmin();
        const courses = await Course.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(courses);
    } catch (e: any) { return handleError(e, "GET /api/admin/courses"); }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { name, level, duration, eligibility, certificate,
                syllabus, designedFor, careerOpportunities } = await req.json();

        if (!name?.trim() || !level)
            return NextResponse.json({ message: "Name aur Level required hain" }, { status: 400 });

        if (!validLevels().includes(level))
            return NextResponse.json({ message: "Invalid level" }, { status: 400 });

        const slug = slugify(name, { lower: true, strict: true, trim: true });

        const existing = await Course.findOne({ slug }).lean();
        if (existing)
            return NextResponse.json({ message: "Is naam ka course already exists" }, { status: 400 });

        const course = await Course.create({
            name, slug, level, duration, eligibility,
            certificate: certificate || undefined,
            syllabus:            cleanSyllabus(syllabus),
            designedFor:         (designedFor || []).map((s: string) => s.trim()).filter(Boolean),
            careerOpportunities: (careerOpportunities || []).map((s: string) => s.trim()).filter(Boolean),
        });

        return NextResponse.json(course, { status: 201 });
    } catch (e: any) { return handleError(e, "POST /api/admin/courses"); }
}

// ── PUT ───────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { id, name, level, duration, eligibility, certificate,
                syllabus, designedFor, careerOpportunities } = await req.json();

        const course = await Course.findById(id);
        if (!course)
            return NextResponse.json({ message: "Course not found" }, { status: 404 });

        if (!validLevels().includes(level))
            return NextResponse.json({ message: "Invalid level" }, { status: 400 });

        course.name     = name;
        course.slug     = slugify(name, { lower: true, strict: true, trim: true });
        course.level    = level;
        course.duration = duration;
        course.eligibility  = eligibility;
        course.certificate  = certificate || course.certificate;
        course.syllabus     = cleanSyllabus(syllabus);
        course.designedFor  = (designedFor || []).map((s: string) => s.trim()).filter(Boolean);
        course.careerOpportunities = (careerOpportunities || []).map((s: string) => s.trim()).filter(Boolean);

        await course.save();
        return NextResponse.json(course);
    } catch (e: any) { return handleError(e, "PUT /api/admin/courses"); }
}

// ── PATCH — toggle isActive ───────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { id, isActive } = await req.json();
        const course = await Course.findById(id);
        if (!course)
            return NextResponse.json({ message: "Course not found" }, { status: 404 });

        course.isActive = isActive;
        await course.save();
        return NextResponse.json(course);
    } catch (e: any) { return handleError(e, "PATCH /api/admin/courses"); }
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id)
            return NextResponse.json({ message: "Course ID required" }, { status: 400 });

        const course = await Course.findByIdAndDelete(id).lean();
        if (!course)
            return NextResponse.json({ message: "Course not found" }, { status: 404 });

        return NextResponse.json({ message: "Course deleted" });
    } catch (e: any) { return handleError(e, "DELETE /api/admin/courses"); }
}