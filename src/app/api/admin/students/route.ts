import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Student from "@/models/Student";
import User from "@/models/User";
import { sendStudentWelcomeEmail } from "@/lib/mail";

function generateTempPassword(length = 8) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return password;
}


// TODO: when will use mongodb atlas then will activate transitions


// export async function POST(req: NextRequest) {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         await connectDB();

//         const body = await req.json();
//         let {
//             name,
//             email,
//             phone,
//             courseId,
//             feesTotal,
//             externalStudentId,
//             externalPassword,
//         } = body;

//         if (!name || !email || !courseId) {
//             return NextResponse.json(
//                 { message: "Name, Email and Course are required" },
//                 { status: 400 }
//             );
//         }

//         email = email.toLowerCase().trim();

//         if (!mongoose.Types.ObjectId.isValid(courseId)) {
//             return NextResponse.json(
//                 { message: "Invalid Course ID format" },
//                 { status: 400 }
//             );
//         }

//         const course = await Course.findById(courseId);
//         if (!course || !course.isActive) {
//             return NextResponse.json(
//                 { message: "Invalid or inactive course" },
//                 { status: 400 }
//             );
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return NextResponse.json(
//                 { message: "Email already exists" },
//                 { status: 400 }
//             );
//         }

//         const studentId = await Student.generateStudentId();

//         const tempPassword = generateTempPassword(8);
//         const hashedPassword = await bcrypt.hash(tempPassword, 10);

//         const newUser = await User.create(
//             [{
//                 academyId: studentId,
//                 name,
//                 email,
//                 password: hashedPassword,
//                 role: "student",
//                 courseId,
//                 isFirstLogin: true,
//             }],
//             { session }
//         );

//         await Student.create(
//             [{
//                 studentId,
//                 name,
//                 email,
//                 phone,
//                 user: newUser[0]._id,
//                 course: courseId,
//                 externalStudentId,
//                 externalPassword,
//                 feesTotal,
//             }],
//             { session }
//         );

//         await session.commitTransaction();
//         session.endSession();

//         // Send Welcome Email AFTER successful commit
//         await sendStudentWelcomeEmail(email, {
//             name,
//             studentId,
//             tempPassword,
//         });

//         return NextResponse.json(
//             {
//                 message: "Student created successfully",
//                 data: {
//                     studentId,
//                     tempPassword,
//                 },
//             },
//             { status: 201 }
//         );

//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();

//         console.error("CREATE STUDENT ERROR:", error);

//         return NextResponse.json(
//             { message: "Server Error" },
//             { status: 500 }
//         );
//     }
// }


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        let {
            name,
            email,
            phone,
            courseId,
            feesTotal,
            externalStudentId,
            externalPassword,
        } = body;

        if (!name || !email || !courseId) {
            return NextResponse.json(
                { message: "Name, Email and Course are required" },
                { status: 400 }
            );
        }

        email = email.toLowerCase().trim();

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json(
                { message: "Invalid Course ID format" },
                { status: 400 }
            );
        }

        const course = await Course.findById(courseId);
        if (!course || !course.isActive) {
            return NextResponse.json(
                { message: "Invalid or inactive course" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        const studentId = await Student.generateStudentId();

        const tempPassword = generateTempPassword(8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // 🔹 Create User
        const newUser = await User.create({
            academyId: studentId,
            name,
            email,
            password: hashedPassword,
            role: "student",
            courseId,
            isFirstLogin: true,
        });

        try {
            // 🔹 Create Student
            await Student.create({
                studentId,
                name,
                email,
                phone,
                user: newUser._id,
                course: courseId,
                externalStudentId,
                externalPassword,
                feesTotal,
            });
        } catch (studentError) {
            // 🔥 Manual rollback (important)
            await User.findByIdAndDelete(newUser._id);
            throw studentError;
        }

        // 🔹 Send Email
        await sendStudentWelcomeEmail(email, {
            name,
            studentId,
            tempPassword,
        });

        return NextResponse.json(
            {
                message: "Student created successfully",
                data: {
                    studentId,
                    tempPassword,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("CREATE STUDENT ERROR:", error);

        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}


export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const students = await Student.find()
            .populate({
                path: "course",
                select: "name",
            })
            .sort({ createdAt: -1 });

        return NextResponse.json(students);

    } catch (error) {
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}