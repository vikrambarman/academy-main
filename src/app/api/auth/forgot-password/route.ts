import { connectDB } from "@/lib/db";
import { sendResetEmail } from "@/lib/mail";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();

    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user)
        return NextResponse.json({ message: "User not found" }, { status: 404 });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetLink);

    return NextResponse.json({ message: "Reset link sent" });
}