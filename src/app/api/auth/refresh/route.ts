import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { message: "No refresh token" },
                { status: 401 }
            );
        }

        const decoded: any = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET!
        );

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return NextResponse.json(
                { message: "Invalid refresh token" },
                { status: 403 }
            );
        }

        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        const response = NextResponse.json({
            message: "Token refreshed",
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
        return NextResponse.json(
            { message: "Refresh failed" },
            { status: 401 }
        );
    }
}