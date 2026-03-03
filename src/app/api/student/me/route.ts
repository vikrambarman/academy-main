import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Student from "@/models/Student";

export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();

        if (!user || user.role !== "student") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        // IMPORTANT FIX HERE
        const student = await Student.findOne({ user: user._id })
            .populate({
                path: "course",
                select:
                    "name authority duration certificate verification externalPortalUrl externalLoginRequired",
            })
            .lean();

        if (!student) {
            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            );
        }

        if (!student.isActive) {
            return NextResponse.json(
                { message: "Account deactivated" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            JSON.parse(JSON.stringify(student))
        );

    } catch (error) {
        console.error("STUDENT ME ERROR:", error);
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}