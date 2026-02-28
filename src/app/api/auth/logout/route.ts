/**
 * LOGOUT API
 * -----------
 * - Removes refresh token from DB
 * - Clears cookies
 */

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

        if (refreshToken) {
            const decoded: any = jwt.verify(
                refreshToken,
                process.env.REFRESH_SECRET!
            );

            const user = await User.findById(decoded.id);
            if (user) {
                user.refreshToken = undefined;
                await user.save();
            }
        }

        const response = NextResponse.json({
            message: "Logged out",
        });

        response.cookies.set("accessToken", "", { maxAge: 0 });
        response.cookies.set("refreshToken", "", { maxAge: 0 });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Logout failed" },
            { status: 500 }
        );
    }
}