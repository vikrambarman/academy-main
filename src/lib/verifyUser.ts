// lib/verifyUser.ts
import { cookies, headers } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyUser() {
    const cookieStore = await cookies();
    const headerStore = await headers();

    // Middleware silently renews the token and passes it via this header.
    // On the first request after expiry the cookie hasn't updated yet, so
    // we prefer the header value when it exists.
    const token =
        headerStore.get("x-access-token") ??
        cookieStore.get("accessToken")?.value;

    if (!token) {
        throw new Error("NO_TOKEN");
    }

    let payload;
    try {
        const verified = await jwtVerify(token, accessSecret);
        payload = verified.payload;
    } catch {
        throw new Error("TOKEN_INVALID");
    }

    await connectDB();

    const user = await User.findById(payload.id)
        .select("_id role email isFirstLogin")
        .lean();

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    return JSON.parse(JSON.stringify(user));
}