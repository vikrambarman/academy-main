import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enquiry from "@/models/Enquiry";

export async function GET() {
    try {
        await connectDB();

        const admin: any = await verifyUser();
        if (admin.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const enquiries = await Enquiry.find()
            .sort({ createdAt: -1 });

        return NextResponse.json({ data: enquiries });

    } catch (error) {
        console.error("ADMIN GET ENQUIRY ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}