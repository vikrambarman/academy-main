import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Student from "@/models/Student";

export async function GET() {
    try {
        await connectDB();

        const user: any = await verifyUser();

        if (user.role !== "student") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const student = await Student.findOne({ user: user.id })
            .populate({
                path: "course",
                select: "name authority duration certificate verification externalPortalUrl externalLoginRequired",
            });

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

        return NextResponse.json(student);

    } catch (error) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}