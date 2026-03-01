import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();
        const user: any = await verifyUser();

        const { currentPassword, newPassword } = await req.json();

        const dbUser = await User.findById(user.id);

        const isMatch = await bcrypt.compare(
            currentPassword,
            dbUser.password
        );

        if (!isMatch) {
            return NextResponse.json(
                { message: "Current password incorrect" },
                { status: 400 }
            );
        }

        dbUser.password = await bcrypt.hash(newPassword, 10);
        await dbUser.save();

        return NextResponse.json({ message: "Password updated" });

    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}