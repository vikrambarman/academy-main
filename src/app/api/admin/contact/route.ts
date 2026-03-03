import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Contact from "@/models/Contact";

export async function GET() {
    try {
        await connectDB();

        const admin: any = await verifyUser();
        if (admin.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const contacts = await Contact.find()
            .sort({ createdAt: -1 });

        return NextResponse.json({ data: contacts });

    } catch (error) {
        console.error("ADMIN GET CONTACT ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}