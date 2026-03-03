import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, mobile, email, message } = body;

        if (!name || !mobile || !message) {
            return NextResponse.json(
                { message: "Name, Mobile and Message are required" },
                { status: 400 }
            );
        }

        await Contact.create({
            name: name.trim(),
            mobile: mobile.trim(),
            email: email?.toLowerCase().trim(),
            message: message.trim(),
        });

        return NextResponse.json(
            { message: "Message submitted successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error("CONTACT ERROR:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}