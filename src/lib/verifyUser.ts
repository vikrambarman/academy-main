import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/auth";

export async function verifyUser() {

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return null;
    }

    const decoded = await verifyAccessToken(token);

    if (!decoded) {
        return null;
    }

    try {

        await connectDB();

        const user = await User.findById(decoded.id)
            .select("_id role email isFirstLogin")
            .lean();

        if (!user) return null;

        return JSON.parse(JSON.stringify(user));

    } catch (err) {

        console.error("verifyUser DB error:", err);
        return null;

    }
}