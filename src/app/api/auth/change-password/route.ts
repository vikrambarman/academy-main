import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { oldPassword, newPassword } = await req.json();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded: any = jwt.verify(
            accessToken,
            process.env.JWT_SECRET!
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // 🔐 NORMAL CHANGE PASSWORD
        if (oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) {
                return NextResponse.json(
                    { message: "Incorrect current password" },
                    { status: 400 }
                );
            }
        }

        // 🔥 UPDATE PASSWORD
        user.password = await bcrypt.hash(newPassword, 10);
        user.isFirstLogin = false;
        await user.save();

        // 🔥 ISSUE NEW TOKEN WITH UPDATED isFirstLogin
        const newPayload = {
            id: user._id,
            role: user.role,
            isFirstLogin: false,
        };

        const newAccessToken = generateAccessToken(newPayload);

        const response = NextResponse.json({
            message: "Password changed successfully",
            role: user.role,          // ✅ YAHI EK LINE ADD HUI — frontend redirect ke liye
        });

        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        });

        return response;

    } catch (error) {
        console.error("CHANGE PASSWORD ERROR:", error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}