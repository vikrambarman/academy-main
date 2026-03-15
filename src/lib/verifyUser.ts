import { cookies, headers } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

export class AuthError extends Error {
    constructor(
        message: string,
        public code: "NO_TOKEN" | "TOKEN_INVALID" | "TOKEN_EXPIRED" | "USER_NOT_FOUND"
    ) {
        super(message);
        this.name = "AuthError";
    }
}

export async function verifyUser() {
    const cookieStore = await cookies();
    const headerStore = await headers();

    const token =
        headerStore.get("x-access-token") ??
        cookieStore.get("accessToken")?.value;

    if (!token) {
        throw new AuthError("No token", "NO_TOKEN");
    }

    let payload;
    try {
        const verified = await jwtVerify(token, accessSecret);
        payload = verified.payload;
    } catch (err: any) {
        if (err?.code === "ERR_JWT_EXPIRED") {
            throw new AuthError("Token expired", "TOKEN_EXPIRED");
        }
        throw new AuthError("Token invalid", "TOKEN_INVALID");
    }

    await connectDB();

    const user = await User.findById(payload.id)
        .select("_id role email isFirstLogin")
        .lean();

    if (!user) {
        throw new AuthError("User not found", "USER_NOT_FOUND");
    }

    return JSON.parse(JSON.stringify(user));
}