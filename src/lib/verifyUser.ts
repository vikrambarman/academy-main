import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

interface TokenPayload {
    id: string;
    role: string;
}

/**
 * Verify logged-in user from accessToken cookie
 */
export async function verifyUser() {

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        throw new Error("NO_TOKEN");
    }

    try {

        // Decode token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TokenPayload;

        // Ensure DB connected
        await connectDB();

        // Fetch actual user from DB
        const user = await User.findById(decoded.id)
            .select("_id role email")
            .lean();

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        return user;

    } catch (error) {

        throw new Error("TOKEN_INVALID");

    }
}