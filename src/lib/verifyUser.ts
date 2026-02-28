import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * Verify user from accessToken cookie
 */
export async function verifyUser() {
    const cookieStore = await cookies(); // IMPORTANT
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        throw new Error("NO_TOKEN");
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        throw new Error("TOKEN_EXPIRED");
    }
}