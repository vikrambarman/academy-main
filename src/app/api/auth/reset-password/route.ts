import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();

    const { token, newPassword } = await req.json();

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user)
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    user.isFirstLogin = false;

    await user.save();

    return NextResponse.json({ message: "Password updated" });
}