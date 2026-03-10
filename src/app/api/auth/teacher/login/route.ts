// src/app/api/auth/teacher/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Teacher from "@/models/Teacher";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json(
                { message: "ID/Email aur password required hain" },
                { status: 400 }
            );
        }

        // Find teacher user by email OR academyId
        const user = await User.findOne({
            role: "teacher",
            $or: [
                { email: identifier },
                { academyId: identifier },
            ],
        });

        if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        if (!user.isActive) return NextResponse.json({ message: "Account deactivated hai. Admin se sampark karein." }, { status: 403 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

        const payload = {
            id: user._id,
            role: "teacher",
            isFirstLogin: user.isFirstLogin,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        const response = NextResponse.json({
            message: "Login successful",
            role: "teacher",
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
        console.error("TEACHER LOGIN ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}