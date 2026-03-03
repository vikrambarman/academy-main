import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enquiry from "@/models/Enquiry";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, mobile, course, contactMethod, message } = body;

        if (!name || !mobile || !course) {
            return NextResponse.json(
                { message: "Name, Mobile and Course are required" },
                { status: 400 }
            );
        }

        await Enquiry.create({
            name: name.trim(),
            mobile: mobile.trim(),
            course: course.trim(),
            contactMethod,
            message: message?.trim(),
        });

        return NextResponse.json(
            { message: "Enquiry submitted successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error("ENQUIRY ERROR:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}