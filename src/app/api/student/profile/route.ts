import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";

import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import "@/models/Course";

export async function GET() {

    try {

        await connectDB();

        const user: any = await verifyUser();

        /* ================= AUTH CHECK ================= */

        if (!user || user.role !== "student") {

            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );

        }

        /* ================= FIND STUDENT ================= */

        const student = await Student.findOne({
            user: user._id,
        }).lean();

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

        /* ================= FETCH ENROLLMENTS ================= */

        const enrollments = await Enrollment.find({ student: student._id })
            .populate({
                path: "course",
                select: "name slug duration authority certificate verification externalPortalUrl externalLoginRequired",
            })
            .select("feesTotal feesPaid certificateStatus payments admissionDate course")
            .lean();

        /* ================= RESPONSE ================= */

        return NextResponse.json({

            student: {
                studentId: student.studentId,
                name: student.name,
                email: student.email,
                phone: student.phone,
                address: student.address,
                qualification: student.qualification,
                courseStatus: student.courseStatus,
                profileImage: student.profileImage,
            },

            enrollments,

        });

    } catch (error) {

        console.error("STUDENT PROFILE ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );

    }

}


export async function PATCH(req: Request) {

    try {

        await connectDB();

        const user: any = await verifyUser();

        if (!user || user.role !== "student") {

            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );

        }

        const body = await req.json();

        const student = await Student.findOne({
            user: user._id
        });

        if (!student) {

            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            );

        }

        /* ===== ALLOWED FIELDS ===== */

        if (body.phone !== undefined)
            student.phone = body.phone;

        if (body.address !== undefined)
            student.address = body.address;

        if (body.qualification !== undefined)
            student.qualification = body.qualification;

        await student.save();

        return NextResponse.json({
            message: "Profile updated",
            student
        });

    } catch (error) {

        console.error("PROFILE UPDATE ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );

    }

}