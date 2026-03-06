/**
 * LOGIN API
 * ----------
 * - Validates user credentials
 * - Generates access + refresh tokens
 * - Stores both in httpOnly cookies
 * - No token exposed to frontend JS
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
    generateAccessToken,
    generateRefreshToken,
} from "@/lib/auth";
import { sendOTPEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { identifier, password } = await req.json();
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { academyId: identifier }
            ]
        });
        
        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // 🔐 ADMIN → 2FA FLOW
        if (user.role === "admin") {

            const otp = Math.floor(100000 + 900000 * Math.random()).toString();

            user.twoFactorCode = otp;
            user.twoFactorExpiry = new Date(Date.now() + 5 * 60 * 1000);
            await user.save();

            await sendOTPEmail(user.email, otp);

            return NextResponse.json({
                requires2FA: true,
                userId: user._id,
            });
        }

        // 🎓 STUDENT → NORMAL LOGIN FLOW

        const payload = {
            id: user._id,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        if (!user.isActive) {
            return NextResponse.json(
                { message: "Account disabled" },
                { status: 403 }
            );
        }

        const response = NextResponse.json({
            message: "Login successful",
            role: user.role,
            forceChangePassword: user.isFirstLogin,
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

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}