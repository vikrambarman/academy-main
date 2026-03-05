import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Student from "@/models/Student";
import "@/models/Course"; // register schema

export async function GET() {

    try {

        await connectDB();

        const user: any = await verifyUser();

        // 🔐 Check authentication
        if (!user || user.role !== "student") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        // 🔎 Find student linked with logged in user
        const student = await Student.findOne({
            user: user._id,
        })
            .populate({
                path: "course",
                select: "name duration authority certificate verification",
            })
            .select(
                "studentId name email phone feesTotal feesPaid certificateStatus course payments isActive"
            )
            .lean();

        if (!student) {
            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            );
        }

        // 🚫 Account disabled
        if (!student.isActive) {
            return NextResponse.json(
                { message: "Account deactivated" },
                { status: 403 }
            );
        }

        // 🔒 Remove sensitive fields
        delete (student as any).isActive;

        return NextResponse.json(student);

    } catch (error) {

        console.error("STUDENT PROFILE ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );

    }
}