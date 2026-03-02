import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
    generateAccessToken,
    generateRefreshToken,
} from "@/lib/auth";

export async function POST(req: Request) {
    await connectDB();

    const { userId, otp } = await req.json();

    const user = await User.findById(userId);

    if (!user)
        return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.twoFactorCode !== otp)
        return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });

    if (!user.twoFactorExpiry || user.twoFactorExpiry < new Date())
        return NextResponse.json({ message: "OTP expired" }, { status: 400 });

    // Clear OTP
    user.twoFactorCode = undefined;
    user.twoFactorExpiry = undefined;
    await user.save();

    const payload = {
        id: user._id,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.json({
        message: "Login successful",
        role: user.role,
    });

    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
    });

    response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return response;
}