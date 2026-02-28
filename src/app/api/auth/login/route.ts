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

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        const user = await User.findOne({ email });
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

        const payload = {
            id: user._id,
            role: user.role,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        const response = NextResponse.json({
            message: "Login successful",
            role: user.role,
        });

        // Set Access Token Cookie (Short Expiry)
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // change to true in production
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15, // 15 minutes
        });

        // Set Refresh Token Cookie (Long Expiry)
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}