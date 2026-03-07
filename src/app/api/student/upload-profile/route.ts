import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { verifyUser } from "@/lib/verifyUser"
import Student from "@/models/Student"
import cloudinary from "@/lib/cloudinary"

export async function POST(req: NextRequest) {

    try {

        await connectDB()

        const user: any = await verifyUser()

        if (!user || user.role !== "student") {

            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            )

        }

        const formData = await req.formData()

        const file = formData.get("file") as File

        if (!file) {

            return NextResponse.json(
                { message: "No file uploaded" },
                { status: 400 }
            )

        }

        const student = await Student.findOne({
            user: user._id
        })

        if (!student) {

            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            )

        }

        const bytes = await file.arrayBuffer()

        const buffer = Buffer.from(bytes)

        const uploadResult: any = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(

                {

                    folder: "students",

                    public_id: student.studentId,

                    overwrite: true,

                    transformation: [

                        { width: 300, height: 300, crop: "fill" },
                        { quality: "auto:eco" }

                    ]

                },

                (error, result) => {

                    if (error) reject(error)

                    else resolve(result)

                }

            )

            stream.end(buffer)

        })

        student.profileImage = uploadResult.secure_url + "?v=" + uploadResult.version
        await student.save()

        return NextResponse.json({
            image: uploadResult.secure_url
        })

    } catch (error) {

        console.error("UPLOAD ERROR:", error)

        return NextResponse.json(
            { message: "Upload failed" },
            { status: 500 }
        )

    }

}