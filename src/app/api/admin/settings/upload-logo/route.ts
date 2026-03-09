/**
 * /api/admin/settings/upload-logo
 * POST → Academy logo upload karo
 *
 * Implementation: Local file system mein save karta hai /public/uploads/
 * Agar Cloudinary ya S3 use karna ho to neeche comment hai.
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyUser } from "@/lib/verifyUser";

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function POST(req: NextRequest) {
    try {
        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { message: "File nahi mili" },
                { status: 400 }
            );
        }

        /* ── Type check ── */
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { message: "Sirf PNG, JPG, WebP ya SVG allowed hai" },
                { status: 400 }
            );
        }

        /* ── Size check ── */
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_SIZE_MB) {
            return NextResponse.json(
                { message: `File ${MAX_SIZE_MB}MB se badi nahi honi chahiye` },
                { status: 400 }
            );
        }

        /* ── Save to /public/uploads/logos/ ── */
        const bytes  = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext      = file.name.split(".").pop() || "png";
        const filename = `logo-${Date.now()}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");

        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);

        const url = `/uploads/logos/${filename}`;

        return NextResponse.json({ url, message: "Logo upload ho gaya" });

        /*
         * ── Cloudinary version (agar use karna ho) ──
         *
         * import { v2 as cloudinary } from "cloudinary";
         *
         * cloudinary.config({
         *   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
         *   api_key:    process.env.CLOUDINARY_API_KEY,
         *   api_secret: process.env.CLOUDINARY_API_SECRET,
         * });
         *
         * const bytes  = await file.arrayBuffer();
         * const buffer = Buffer.from(bytes);
         * const b64    = buffer.toString("base64");
         * const dataUri = `data:${file.type};base64,${b64}`;
         *
         * const result = await cloudinary.uploader.upload(dataUri, {
         *   folder: "academy/logos",
         *   public_id: `logo-${Date.now()}`,
         * });
         *
         * return NextResponse.json({ url: result.secure_url });
         */

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("LOGO UPLOAD ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}